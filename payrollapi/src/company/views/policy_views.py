from rest_framework.filters import SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.exceptions import ValidationError

from auditlog.models import BaseLog
from accounts.utils import get_logged_in_user_company_policy
from company.service import CompanyService
from company.serializers import PolicySerializer, CompanyPolicy


class CompanyPolicyView(viewsets.ModelViewSet):
    """
        CRUD API for the company policy view

        To deactivate, call the endpoint with DELETE method
        search by name
    """
    http_method_names = ["put", "head", "delete", "post", "get", "patch"]
    serializer_class = PolicySerializer
    authentication_class = (JSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    filter_backends = (DjangoFilterBackend, SearchFilter,)
    search_fields = ('name',)
    queryset = CompanyPolicy.objects.all()

    def get_queryset(self):
        return get_logged_in_user_company_policy(self.request)

    def perform_create(self, serializer, *args, **kwargs):
        instance = serializer.save()
        user = self.request.user
        instance.created_by = user.adminuser
        instance.save()
        statutory_tax_year_start = serializer.validated_data.get('statutory_tax_year_start')
        if statutory_tax_year_start:
            serializer.validated_data['statutory_tax_year_start'] = str(statutory_tax_year_start)

        statutory_tax_year_end = serializer.validated_data.get('statutory_tax_year_end')
        if statutory_tax_year_end:
            serializer.validated_data['statutory_tax_year_end'] = str(statutory_tax_year_end)

        company = serializer.validated_data.get('company')
        if company:
            serializer.validated_data['company'] = str(company)

        data = serializer.validated_data
        CompanyService.log_policy(action=BaseLog.PRIMERLOG_CREATE, blamer=user.adminuser, meta=data, instance=instance)

    def perform_update(self, serializer):
        instance = serializer.save()

        statutory_tax_year_start = serializer.validated_data.get('statutory_tax_year_start')
        if statutory_tax_year_start:
            serializer.validated_data['statutory_tax_year_start'] = str(statutory_tax_year_start)

        statutory_tax_year_end = serializer.validated_data.get('statutory_tax_year_end')
        if statutory_tax_year_end:
            serializer.validated_data['statutory_tax_year_end'] = str(statutory_tax_year_end)

        company = serializer.validated_data.get('company')
        if company:
            serializer.validated_data['company'] = str(company)

        data = serializer.validated_data
        admin_user = self.request.user.adminuser
        CompanyService.log_policy(action=BaseLog.PRIMERLOG_UPDATE, blamer=admin_user, meta=data, instance=instance)

    def perform_destroy(self, instance):
        if not instance.is_deletable():
            raise ValidationError(f'{instance.name} cannot be deactivated now as it is being used across board')
        instance.is_active = False
        instance.save()
        admin_user = self.request.user.adminuser
        CompanyService.log_policy(action=BaseLog.PRIMERLOG_DELETE, blamer=admin_user, meta={}, instance=instance)
