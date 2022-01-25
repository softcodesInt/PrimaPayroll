from rest_framework.exceptions import ParseError
from rest_framework.filters import SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.generics import ListAPIView
from django.template import loader
from django.utils import timezone

from company.models import Company, License, SubscriptionHistory
from company.serializers import CompanySerializer, SubscriptionHistorySerializer
from auditlog.models import CompanyLog
from auditlog.serializers import CompanyLogSerializer
from .utils import generate_license_code, has_subscription_changed, get_expired_company_queryset
from lib.tasks import send_email_task


class CompanyView(viewsets.ModelViewSet):
    """
    Fetch All user's view for the dashboard.

    Search by name
    """
    http_method_names = ["put", "head", "delete", "post", "get", "patch"]
    serializer_class = CompanySerializer
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    filter_backends = (DjangoFilterBackend, SearchFilter,)
    search_fields = ('name',)
    queryset = Company.objects.filter(is_active=True)

    def perform_create(self, serializer, *args, **kwargs):
        instance = serializer.save()
        instance.created_by = self.request.user
        license = License.objects.create(code=generate_license_code())
        instance.license = license
        instance.save()
        post_data = serializer.validated_data
        post_data['blame'] = str(self.request.user.id)
        CompanyLog.objects.create(action=CompanyLog.PRIMERLOG_CREATE,
                                  blamer=self.request.user,
                                  meta=post_data,
                                  company=instance)

        html = loader.render_to_string('emails/new_company_staff_notification.html', {
            'user': instance.blame.get_full_name(),
            'created_by': instance.created_by.get_full_name(),
            'company': instance.name
        })
        #send_email_task(instance.blame.email, 'PrimalFIT: Company Assigned', html)

    def perform_update(self, serializer):
        current = self.get_object()
        instance = serializer.save()

        payload = serializer.validated_data
        if serializer.validated_data.get('blame'):
            payload['blame'] = str(serializer.validated_data['blame'].id)

        log = CompanyLog.objects.create(action=CompanyLog.PRIMERLOG_UPDATE,
                                  blamer=self.request.user,
                                  meta=payload,
                                  company=instance)

        if has_subscription_changed(current, instance):
            log.action = CompanyLog.PRIMERLOG_CHANGE
            log.previous = {
                "employee_count": current.employee_count,
                "year": current.subscription_year,
                "month": current.subscription_month,
                "ess": current.bought_ess,
                "updated_at": str(instance.date_updated),
            }
            log.save()
            SubscriptionHistory.objects.create(company=instance,
                                               previous_month=current.subscription_month,
                                               previous_year=current.subscription_year,
                                               previous_employee_count=current.employee_count,
                                               previous_ess=current.bought_ess,
                                               new_month=instance.subscription_month,
                                               new_year=instance.subscription_year,
                                               new_employee_count=instance.employee_count,
                                               new_ess=instance.bought_ess)

            html = loader.render_to_string('emails/subscription_changed.html', {
               'company_name': instance.name,
                'before_expiration': '{} years {} months'.format(current.subscription_year, current.subscription_month),
                'before': current,
                'after': instance,
                'after_expiration': '{} years {} months'.format(instance.subscription_year, instance.subscription_month)
            })
            send_email_task(instance.email, 'PrimalFIT: Subscription changes notification', html)

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()
        CompanyLog.objects.create(action=CompanyLog.PRIMERLOG_DELETE,
                                  blamer=self.request.user,
                                  company=instance)

    def retrieve(self, request, pk=None):
        try:
            company = Company.objects.get(id=pk)
        except Company.DoesNotExist:
            return Response({'non_field_errors': ['Company does not exist']}, status=status.HTTP_404_NOT_FOUND)
        company_activity = CompanyLog.objects.filter(company=company)

        return Response({
            'company': CompanySerializer(company).data,
            'activity': CompanyLogSerializer(company_activity, many=True).data
        })


class FilterCompanyView(ListAPIView):
    """
    Filter companies by either expired, inactive and active
    """
    serializer_class = CompanySerializer
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        status_filter = self.kwargs.get('slug')
        if status_filter not in ['expired', 'inactive', 'active']:
            raise ParseError('Filter has to be either one of [expired, inactive, active]', 400)

        if status_filter == 'expired':
            return get_expired_company_queryset()

        if status_filter == 'inactive':
            return Company.objects.filter(is_active=False)

        if status_filter == 'active':
            return Company.objects.filter(is_active=True, license__expiration_date__gt=timezone.now())
