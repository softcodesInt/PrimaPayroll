from rest_framework.filters import SearchFilter
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.generics import GenericAPIView

from auditlog.models import BaseLog
from accounts.utils import get_logged_in_user_company_policy
from company.models import LeaveCategory, Leave, LeaveApplication
from company.service import CompanyService
from company.serializers import LeaveCategorySerializer, LeaveSerializer
from employees.models import Employee
from employees.serializers import LeaveApplicationSerializer


class LeaveCategoryView(viewsets.ModelViewSet):
    """
    CRUD API for the Leave Category

    To deactivate, call the endpoint with DELETE method

    search by name
    """
    http_method_names = ["put", "head", "delete", "post", "get", "patch"]
    serializer_class = LeaveCategorySerializer
    permission_classes = (IsAuthenticated,)
    filter_backends = (DjangoFilterBackend, SearchFilter,)
    search_fields = ('name',)
    queryset = LeaveCategory.objects.all()

    def get_queryset(self):
        sort_by = self.request.GET.get('sort_by')
        value = True
        if sort_by:
            if sort_by.lower() == "inactive":
                value = False
            return LeaveCategory.objects.filter(is_active=value,
                                                company_policy__in=get_logged_in_user_company_policy(self.request))
        return LeaveCategory.objects.filter(company_policy__in=get_logged_in_user_company_policy(self.request))

    def perform_create(self, serializer, *args, **kwargs):
        instance = serializer.save()
        user = self.request.user.adminuser
        instance.created_by = user
        instance.save()

        data = serializer.validated_data
        data['company_policy'] = str(instance.company_policy)

        CompanyService.log_leave_category(action=BaseLog.PRIMERLOG_CREATE, blamer=user, meta=data, instance=instance)

    def perform_update(self, serializer):
        instance = serializer.save()
        data = serializer.validated_data
        data['company_policy'] = str(instance.company_policy)
        user = self.request.user.adminuser
        CompanyService.log_leave_category(action=BaseLog.PRIMERLOG_UPDATE, blamer=user, meta=data, instance=instance)

    def perform_destroy(self, instance):
        if not instance.is_deletable():
            raise ValidationError(f'{instance.name} cannot be deactivated now as it is being used across board')
        instance.is_active = False
        instance.save()
        user = self.request.user.adminuser
        CompanyService.log_leave_category(action=BaseLog.PRIMERLOG_DELETE, blamer=user, meta={}, instance=instance)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        data = self.get_serializer(instance).data
        gender = request.GET.get('gender')
        if gender:
            if gender == "MALE":
                gender_struct = {'for_male': True}
            else:
                gender_struct = {'for_female': True}
            data['leaves'] = LeaveSerializer(Leave.objects.filter(category=instance,
                                                                  is_active=True,
                                                                  **gender_struct), many=True).data
        else:
            data['leaves'] = LeaveSerializer(Leave.objects.filter(category=instance), many=True).data
        return Response(data)


class LeaveView(viewsets.ModelViewSet):
    """
    CRUD API for the Leave

    To deactivate, call the endpoint with DELETE method

    search by name
    """
    http_method_names = ["put", "head", "delete", "post", "get", "patch"]
    serializer_class = LeaveSerializer
    permission_classes = (IsAuthenticated,)
    filter_backends = (DjangoFilterBackend, SearchFilter,)
    search_fields = ('name',)
    queryset = Leave.objects.all()

    def get_queryset(self):
        sort_by = self.request.GET.get('sort_by')
        value = True
        if sort_by:
            if sort_by.lower() == "inactive":
                value = False
            return Leave.objects.filter(is_active=value,
                                        category__company_policy__in=get_logged_in_user_company_policy(self.request))
        return Leave.objects.filter(category__company_policy__in=get_logged_in_user_company_policy(self.request))

    def perform_create(self, serializer, *args, **kwargs):
        instance = serializer.save()
        user = self.request.user.adminuser
        instance.created_by = user
        instance.save()
        data = serializer.validated_data
        if data.get('category'):
            data['category'] = str(data['category'])

        CompanyService.log_leave(action=BaseLog.PRIMERLOG_CREATE, blamer=user, meta=data, instance=instance)

    def perform_update(self, serializer):
        instance = serializer.save()
        data = serializer.validated_data
        if data.get('category'):
            data['category'] = str(data['category'])

        user = self.request.user.adminuser
        CompanyService.log_leave(action=BaseLog.PRIMERLOG_UPDATE, blamer=user, meta=data, instance=instance)

    def perform_destroy(self, instance):
        if not instance.is_deletable():
            raise ValidationError(f'{instance.name} cannot be deactivated now as it is being used across board')
        instance.is_active = False
        instance.save()
        user = self.request.user.adminuser
        CompanyService.log_leave(action=BaseLog.PRIMERLOG_DELETE, blamer=user, meta={}, instance=instance)


class LeaveRequestView(GenericAPIView):
    serializer_class = LeaveSerializer
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        from employees.models import Employee
        company = request.user.adminuser.main_company
        applications = LeaveApplication.objects.filter(
            employee__in=Employee.objects.filter(main_company=company),
            status=LeaveApplication.LEAVE_STATUS_REQUEST
        )
        return Response(LeaveApplicationSerializer(instance=applications, many=True).data)

    def post(self, request, application_id):
        # APPROVE LEAVE REQUEST
        application = LeaveApplication.objects.get(id=application_id)
        application.approve_leave()

        return Response({})

    def put(self, request, application_id):
        application = LeaveApplication.objects.get(id=application_id)
        application.reject_leave()

        return Response({})
