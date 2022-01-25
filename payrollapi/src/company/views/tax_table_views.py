from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets

from auditlog.models import BaseLog, TaxTableLog
from accounts.utils import get_logged_in_user_company_policy
from company.serializers import TaxTableSerializer, TaxTable


class TaxTableView(viewsets.ModelViewSet):
    """
        CRUD API for the tax table view

        To deactivate, call the endpoint with DELETE method
    """
    http_method_names = ["put", "head", "delete", "post", "get", "patch"]
    serializer_class = TaxTableSerializer
    permission_classes = (IsAuthenticated,)
    queryset = TaxTable.objects.all()

    def get_queryset(self):
        sort_by = self.request.GET.get('sort_by')
        value = True
        if sort_by:
            if sort_by.lower() == "inactive":
                value = False
            return TaxTable.objects.filter(is_active=value,
                                           company_policy__in=get_logged_in_user_company_policy(self.request))
        return TaxTable.objects.filter(company_policy__in=get_logged_in_user_company_policy(self.request))

    def perform_create(self, serializer, *args, **kwargs):
        instance = serializer.save()
        user = self.request.user.adminuser
        instance.created_by = user
        instance.save()

        income_from = serializer.validated_data.get('income_from')
        if income_from:
            serializer.validated_data['income_from'] = str(income_from)

        income_to = serializer.validated_data.get('income_to')
        if income_to:
            serializer.validated_data['income_to'] = str(income_to)

        tax_rate = serializer.validated_data.get('tax_rate')
        if tax_rate:
            serializer.validated_data['tax_rate'] = str(tax_rate)

        company_policy = serializer.validated_data.get('company_policy')
        if company_policy:
            serializer.validated_data['company_policy'] = str(company_policy)

        # TaxTableLog.objects.create(action=BaseLog.PRIMERLOG_CREATE,
        #                            blamer=user,
        #                            meta=serializer.validated_data,
        #                            tax_table=instance)

    def perform_update(self, serializer):
        instance = serializer.save()

        income_from = serializer.validated_data.get('income_from')
        if income_from:
            serializer.validated_data['income_from'] = str(income_from)

        income_to = serializer.validated_data.get('income_to')
        if income_to:
            serializer.validated_data['income_to'] = str(income_to)

        company_policy = serializer.validated_data.get('company_policy')
        if company_policy:
            serializer.validated_data['company_policy'] = str(company_policy)

        # TaxTableLog.objects.create(action=BaseLog.PRIMERLOG_UPDATE,
        #                            blamer=self.request.user,
        #                            meta=serializer.validated_data,
        #                            tax_table=instance)

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()
        TaxTableLog.objects.create(action=BaseLog.PRIMERLOG_DELETE,
                                   blamer=self.request.user.adminuser,
                                   meta={},
                                   tax_table=instance)
