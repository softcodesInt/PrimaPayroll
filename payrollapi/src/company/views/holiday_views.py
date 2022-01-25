from rest_framework.filters import SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.exceptions import ValidationError

from accounts.utils import get_logged_in_user_company_policy
from auditlog.models import BaseLog
from company.serializers import HolidaySerializer, Holiday
from company.service import CompanyService


class HolidayView(viewsets.ModelViewSet):
    """
        CRUD API for the holiday view

        To deactivate, call the endpoint with DELETE method
        search by name
    """
    http_method_names = ["put", "head", "delete", "post", "get", "patch"]
    serializer_class = HolidaySerializer
    authentication_class = (JSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    filter_backends = (DjangoFilterBackend, SearchFilter,)
    search_fields = ('name',)
    queryset = Holiday.objects.all()

    def get_queryset(self):
        # filter company from company_license_code by license code and use the company_policy to filter holiday
        sort_by = self.request.GET.get('sort_by')
        value = True
        if sort_by:
            if sort_by.lower() == "inactive":
                value = False
            return Holiday.objects.filter(is_active=value,
                                          company_policy__in=get_logged_in_user_company_policy(self.request))
        return Holiday.objects.filter(company_policy__in=get_logged_in_user_company_policy(self.request))

    def perform_create(self, serializer, *args, **kwargs):
        instance = serializer.save()
        user = self.request.user.adminuser
        instance.created_by = user
        instance.save()
        data = serializer.validated_data
        date_from = data.get('date_from')
        if date_from:
            data['date_from'] = str(date_from)

        date_to = data.get('date_to')
        if date_to:
            data['date_to'] = str(date_to)

        company_policy = data.get('company_policy')
        if company_policy:
            data['company_policy'] = str(company_policy)

        CompanyService.log_holiday(BaseLog.PRIMERLOG_CREATE, blamer=user, meta=data, instance=instance)

    def perform_update(self, serializer):
        instance = serializer.save()
        data = serializer.validated_data

        date_from = data.get('date_from')
        if date_from:
            data['date_from'] = str(date_from)

        date_to = data.get('date_to')
        if date_to:
            data['date_to'] = str(date_to)

        company_policy = data.get('company_policy')
        if company_policy:
            data['company_policy'] = str(company_policy)

        user = self.request.user.adminuser
        CompanyService.log_holiday(BaseLog.PRIMERLOG_UPDATE, blamer=user, meta=data, instance=instance)

    def perform_destroy(self, instance):
        if not instance.is_deletable():
            raise ValidationError(f'{instance.name} cannot be deactivated now as it is being used across board')
        instance.is_active = False
        instance.save()
        user = self.request.user.adminuser
        CompanyService.log_holiday(BaseLog.PRIMERLOG_DELETE, blamer=user, meta={}, instance=instance)
