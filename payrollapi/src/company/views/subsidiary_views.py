from rest_framework.filters import SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

from accounts.models import AdminUser
from auditlog.models import BaseLog
from company.serializers import CompanySerializer
from company.service import CompanyService
from company.models import Company


"""
-TODO:
-1. Delete the subsidiary model and use the company's model here
-2. Add is_subsidiary to the Company's model.
-3. get_logged_in_user_company should return an array of queryset
-    If request user is admin, fetch all companies attached to the same license code and is active
-    Else, fetch all subsidiaries attached to the user
-4. Update all queryset to use company__in
-
"""


class SubsidiaryView(viewsets.ModelViewSet):
    """
    CRUD API for the Leave Category

    To deactivate, call the endpoint with DELETE method

    search by name
    """
    http_method_names = ["put", "head", "delete", "post", "get", "patch"]
    serializer_class = CompanySerializer
    # authentication_class = (JSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    filter_backends = (DjangoFilterBackend, SearchFilter,)
    search_fields = ('name',)
    queryset = Company.objects.all()

    # def get_object(self):
    #     return get_parent_company(self.request)

    def get_queryset(self):
        admin = self.request.user.adminuser
        if admin.has_all_access:
            return Company.objects.filter(license_code=admin.license_code)
        return Company.objects.filter(admin=admin, is_active=True)

    def perform_create(self, serializer, *args, **kwargs):
        instance = serializer.save()
        user = self.request.user
        instance.created_by = user.adminuser
        parent_company = Company.objects.get(is_subsidiary=False, admin=user.adminuser)
        instance.parent = parent_company
        instance.license_code = parent_company.license_code
        instance.is_subsidiary = True
        instance.admin = AdminUser.objects.get(pk=self.request.data['admin'])
        instance.save()

        data = serializer.validated_data
        if data.get('logo'):
            del data['logo']
        CompanyService.log_subsidiary(BaseLog.PRIMERLOG_CREATE, user.adminuser, data, instance)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        data = request.data.copy()
        if data.get('logo') and type(data.get('logo')) == str:
            del data['logo']
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    def perform_update(self, serializer):
        instance = serializer.save()
        instance.admin = AdminUser.objects.get(pk=self.request.data['admin'])
        instance.save()
        data = serializer.validated_data
        if data.get('logo'):
            del data['logo']
        CompanyService.log_subsidiary(BaseLog.PRIMERLOG_UPDATE, self.request.user.adminuser, data, instance)

    def perform_destroy(self, instance):
        if not instance.is_deletable():
            raise ValidationError(f'{instance.name} cannot be deactivated now as it is being used across board')
        instance.is_active = False
        instance.save()
        CompanyService.log_subsidiary(BaseLog.PRIMERLOG_DELETE, self.request.user.adminuser, {}, instance)
