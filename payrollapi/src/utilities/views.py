from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework import serializers
from django.db import IntegrityError
from rest_framework.exceptions import ValidationError

from accounts.utils import get_logged_in_user_company
from auditlog.models import BaseLog
from lib.utils import get_descriptive_error_message
from .models import (
    BankLists,
    JobTitle,
    JobGrade,
    ContractNature,
    TerminateReason,
    ReinstateReason
)
from .serializers import (
    BankListSerializer,
    JobTitleSerializer,
    JobGradeSerializer,
    ContractNatureSerializer,
    TerminateReasonSerializer,
    ReinstateReasonSerializer
)
from .service import UtilityService


class BankListView(viewsets.ModelViewSet):
    """
    CRUD API for the Bank API View

    To deactivate, call the endpoint with DELETE method
    """
    http_method_names = ["put", "head", "delete", "post", "get", "patch"]
    serializer_class = BankListSerializer
    permission_classes = (IsAuthenticated,)
    queryset = BankLists.objects.all()

    def get_queryset(self):
        # filter by license code
        sort_by = self.request.GET.get('sort_by')
        value = True
        if sort_by:
            if sort_by.lower() == "inactive":
                value = False
            return BankLists.objects.filter(is_active=value, company=get_logged_in_user_company(self.request))
        return BankLists.objects.filter(company=get_logged_in_user_company(self.request))

    def perform_create(self, serializer, *args, **kwargs):
        instance = serializer.save()
        user = self.request.user.adminuser
        instance.company = get_logged_in_user_company(self.request)
        try:
            instance.save()
        except IntegrityError as e:
            raise serializers.ValidationError(detail=get_descriptive_error_message(e))
        UtilityService.log_bank(BaseLog.PRIMERLOG_CREATE, user, serializer.validated_data, instance)

    def perform_update(self, serializer):
        try:
            instance = serializer.save()
        except IntegrityError as e:
            raise serializers.ValidationError(detail=get_descriptive_error_message(e))

        user = self.request.user.adminuser
        UtilityService.log_bank(BaseLog.PRIMERLOG_UPDATE, user, serializer.validated_data, instance)

    def perform_destroy(self, instance):
        if not instance.is_deletable():
            raise ValidationError(f'{instance.name} cannot be deactivated now as it is being used across board')
        instance.is_active = False
        instance.save()
        user = self.request.user.adminuser
        UtilityService.log_bank(BaseLog.PRIMERLOG_DELETE, user, {}, instance)


class JobTitleView(viewsets.ModelViewSet):
    """
    CRUD API for the Joblist

    To deactivate, call the endpoint with DELETE method
    """
    http_method_names = ["put", "head", "delete", "post", "get", "patch"]
    serializer_class = JobTitleSerializer
    permission_classes = (IsAuthenticated,)
    queryset = JobTitle.objects.all()

    def get_queryset(self):
        sort_by = self.request.GET.get('sort_by')
        value = True
        if sort_by:
            if sort_by.lower() == "inactive":
                value = False
            return JobTitle.objects.filter(is_active=value, company=get_logged_in_user_company(self.request))
        return JobTitle.objects.filter(company=get_logged_in_user_company(self.request))

    def perform_create(self, serializer, *args, **kwargs):
        instance = serializer.save()
        user = self.request.user.adminuser
        instance.company = get_logged_in_user_company(self.request)
        # instance.created_by = user
        try:
            instance.save()
        except IntegrityError as e:
            raise serializers.ValidationError(detail=get_descriptive_error_message(e))

        UtilityService.log_job_title(BaseLog.PRIMERLOG_CREATE, user, serializer.validated_data, instance)

    def perform_update(self, serializer):
        try:
            instance = serializer.save()
        except IntegrityError as e:
            raise serializers.ValidationError(detail=get_descriptive_error_message(e))
        user = self.request.user.adminuser
        UtilityService.log_job_title(BaseLog.PRIMERLOG_UPDATE, user, serializer.validated_data, instance)

    def perform_destroy(self, instance):
        if not instance.is_deletable():
            raise ValidationError(f'{instance.name} cannot be deactivated now as it is being used across board')
        instance.is_active = False
        instance.save()
        user = self.request.user.adminuser
        UtilityService.log_job_title(BaseLog.PRIMERLOG_DELETE, user, {}, instance)


class ContractNatureView(viewsets.ModelViewSet):
    """
    CRUD API for the Joblist

    To deactivate, call the endpoint with DELETE method
    """
    http_method_names = ["put", "head", "delete", "post", "get", "patch"]
    serializer_class = ContractNatureSerializer
    permission_classes = (IsAuthenticated,)
    queryset = ContractNature.objects.all()

    def get_queryset(self):
        # filter by license code
        sort_by = self.request.GET.get('sort_by')
        value = True
        if sort_by:
            if sort_by.lower() == "inactive":
                value = False
            return ContractNature.objects.filter(is_active=value, company=get_logged_in_user_company(self.request))
        return ContractNature.objects.filter(company=get_logged_in_user_company(self.request))

    def perform_create(self, serializer, *args, **kwargs):
        instance = serializer.save()
        user = self.request.user.adminuser
        instance.company = get_logged_in_user_company(self.request)

        try:
            instance.save()
        except IntegrityError as e:
            raise serializers.ValidationError(detail=get_descriptive_error_message(e))

        UtilityService.log_nature_of_contract(BaseLog.PRIMERLOG_CREATE, user, serializer.validated_data, instance)

    def perform_update(self, serializer):
        try:
            instance = serializer.save()
        except IntegrityError as e:
            raise serializers.ValidationError(detail=get_descriptive_error_message(e))

        user = self.request.user.adminuser
        UtilityService.log_nature_of_contract(BaseLog.PRIMERLOG_UPDATE, user, serializer.validated_data, instance)

    def perform_destroy(self, instance):
        if not instance.is_deletable():
            raise ValidationError(f'{instance.name} cannot be deactivated now as it is being used across board')
        instance.is_active = False
        instance.save()
        user = self.request.user.adminuser
        UtilityService.log_nature_of_contract(BaseLog.PRIMERLOG_UPDATE, user, {}, instance)


class JobGradeView(viewsets.ModelViewSet):
    """
    CRUD API for the JobView

    To deactivate, call the endpoint with DELETE method
    """
    http_method_names = ["put", "head", "delete", "post", "get", "patch"]
    serializer_class = JobGradeSerializer
    permission_classes = (IsAuthenticated,)
    queryset = JobGrade.objects.all()

    def get_queryset(self):
        # filter by license code
        sort_by = self.request.GET.get('sort_by')
        value = True
        if sort_by:
            if sort_by.lower() == "inactive":
                value = False
            return JobGrade.objects.filter(is_active=value, company=get_logged_in_user_company(self.request))
        return JobGrade.objects.filter(company=get_logged_in_user_company(self.request))

    def perform_create(self, serializer, *args, **kwargs):
        instance = serializer.save()
        user = self.request.user.adminuser
        instance.company = get_logged_in_user_company(self.request)
        try:
            instance.save()
        except IntegrityError as e:
            raise serializers.ValidationError(detail=get_descriptive_error_message(e))

        UtilityService.log_job_grade(BaseLog.PRIMERLOG_CREATE, user, serializer.validated_data, instance)

    def perform_update(self, serializer):
        try:
            instance = serializer.save()
        except IntegrityError as e:
            raise serializers.ValidationError(detail=get_descriptive_error_message(e))

        user = self.request.user.adminuser
        UtilityService.log_job_grade(BaseLog.PRIMERLOG_UPDATE, user, serializer.validated_data, instance)

    def perform_destroy(self, instance):
        if not instance.is_deletable():
            raise ValidationError(f'{instance.name} cannot be deactivated now as it is being used across board')
        instance.is_active = False
        instance.save()
        user = self.request.user.adminuser
        UtilityService.log_job_grade(BaseLog.PRIMERLOG_DELETE, user, {}, instance)


class TerminateReasonView(viewsets.ModelViewSet):
    """
    CRUD API for the TerminateReason

    To deactivate, call the endpoint with DELETE method
    """
    http_method_names = ["put", "head", "delete", "post", "get", "patch"]
    serializer_class = TerminateReasonSerializer
    permission_classes = (IsAuthenticated,)
    queryset = TerminateReason.objects.all()

    def get_queryset(self):
        # filter by license code
        sort_by = self.request.GET.get('sort_by')
        value = True
        if sort_by:
            if sort_by.lower() == "inactive":
                value = False
            return TerminateReason.objects.filter(is_active=value, company=get_logged_in_user_company(self.request))
        return TerminateReason.objects.filter(company=get_logged_in_user_company(self.request))

    def perform_create(self, serializer, *args, **kwargs):
        instance = serializer.save()
        user = self.request.user.adminuser
        instance.company = get_logged_in_user_company(self.request)
        try:
            instance.save()
        except IntegrityError as e:
            raise serializers.ValidationError(detail=get_descriptive_error_message(e))

    def perform_update(self, serializer):
        try:
            instance = serializer.save()
        except IntegrityError as e:
            raise serializers.ValidationError(detail=get_descriptive_error_message(e))

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()


class ReinstateReasonView(viewsets.ModelViewSet):
    """
    CRUD API for the Reinstate

    To deactivate, call the endpoint with DELETE method
    """
    http_method_names = ["put", "head", "delete", "post", "get", "patch"]
    serializer_class = ReinstateReasonSerializer
    permission_classes = (IsAuthenticated,)
    queryset = ReinstateReason.objects.all()

    def get_queryset(self):
        # filter by license code
        sort_by = self.request.GET.get('sort_by')
        value = True
        if sort_by:
            if sort_by.lower() == "inactive":
                value = False
            return ReinstateReason.objects.filter(is_active=value, company=get_logged_in_user_company(self.request))
        return ReinstateReason.objects.filter(company=get_logged_in_user_company(self.request))

    def perform_create(self, serializer, *args, **kwargs):
        instance = serializer.save()
        user = self.request.user.adminuser
        instance.company = get_logged_in_user_company(self.request)     # should be session
        try:
            instance.save()
        except IntegrityError as e:
            raise serializers.ValidationError(detail=get_descriptive_error_message(e))

    def perform_update(self, serializer):
        try:
            instance = serializer.save()
        except IntegrityError as e:
            raise serializers.ValidationError(detail=get_descriptive_error_message(e))

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()

