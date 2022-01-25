import csv

from django.views.generic import View
from django.http import HttpResponse
from rest_framework.filters import SearchFilter
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework import viewsets

from accounts.utils import get_logged_in_user_company_policy
from auditlog.models import BaseLog
from company.serializers import HierarchySerializer, Hierarchy
from company.service import CompanyService
from company.paginations import HierarchyPagination


class HierarchyView(viewsets.ModelViewSet):
    """
    CRUD API for the Hierarchy

    To deactivate, call the endpoint with DELETE method

    is_parent: set this to true when creating an header

    search by name
    """
    http_method_names = ["put", "head", "delete", "post", "get", "patch"]
    serializer_class = HierarchySerializer
    permission_classes = (IsAuthenticated,)
    filter_backends = (DjangoFilterBackend, SearchFilter,)
    search_fields = ('name',)
    queryset = Hierarchy.objects.all()
    pagination_class = HierarchyPagination

    def get_queryset(self):
        is_head = self.request.GET.get('is_head', False)
        sort_by = self.request.GET.get('sort_by')
        value = True
        if sort_by:
            if sort_by.lower() == "inactive":
                value = False

            if sort_by.lower() == "all":
                return Hierarchy.objects.filter(is_active=True, company_policy__in=get_logged_in_user_company_policy(self.request))
            return Hierarchy.objects.filter(is_header=is_head,
                                            is_active=value,
                                            company_policy__in=get_logged_in_user_company_policy(self.request))
        return Hierarchy.objects.filter(is_header=is_head,
                                        company_policy__in=get_logged_in_user_company_policy(self.request))

    def get_serializer_context(self):
        context = super(HierarchyView, self).get_serializer_context()
        # context.update({"company_policy": get_parent_company(self.request)})
        return context

    def perform_create(self, serializer, *args, **kwargs):
        instance = serializer.save()
        user = self.request.user.adminuser
        instance.created_by = user
        if self.request.data.get('parent'):
            parent = Hierarchy.objects.get(id=self.request.data.get('parent'))
            instance.parent = parent
            instance.save()
            parent_policy = parent.company_policy.all()
            for c in parent_policy:
                instance.company_policy.add(c)

        data = serializer.validated_data
        if data.get('parent'):
            data['parent'] = str(data.get('parent'))

        data['company_policy'] = str(instance.company_policy)

        CompanyService.log_hierarchy(BaseLog.PRIMERLOG_CREATE, user, data, instance=instance)

    def perform_update(self, serializer):
        instance = serializer.save()
        if self.request.data.get('parent'):
            instance.parent = Hierarchy.objects.get(id=self.request.data.get('parent'))
        instance.save()
        data = serializer.validated_data
        if data.get('parent'):
            data['parent'] = str(data.get('parent'))

        data['company_policy'] = str(instance.company_policy)
        user = self.request.user.adminuser
        CompanyService.log_hierarchy(BaseLog.PRIMERLOG_UPDATE, user, data, instance=instance)

    def perform_destroy(self, instance):
        if not instance.is_deletable():
            raise ValidationError(f"Cannot deactivate {instance.name} because it's used by other data")
        instance.is_active = False
        instance.save()
        CompanyService.log_hierarchy(BaseLog.PRIMERLOG_DELETE, self.request.user.adminuser, {}, instance=instance)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        data = self.get_serializer(instance).data
        if instance.is_header:
            data['items'] = self.get_serializer(Hierarchy.objects.filter(is_header=False, parent=instance),
                                                many=True).data
        return Response(data)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        extra_keys = {}
        page = self.paginate_queryset(queryset)
        if page is not None:
            if len(queryset):
                data_queryset = queryset[0]
                extra_keys['hierarchy'] = data_queryset
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data, extra_keys=extra_keys)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def get_paginated_response(self, data, extra_keys):
        """
        Return a paginated style `Response` object for the given output data.
        """
        assert self.paginator is not None
        return self.paginator.get_paginated_response(data, extra_keys)


class ExportImportHierarchyView(View):
    serializer_class = HierarchySerializer
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="export.csv"'

        serializer = self.get_serializer(
            Hierarchy.objects.filter(company_policy__in=get_logged_in_user_company_policy(self.request)),
            many=True
        )
        header = HierarchySerializer.Meta.fields

        writer = csv.DictWriter(response, fieldnames=header)
        writer.writeheader()
        for row in serializer.data:
            writer.writerow(row)

        return response
