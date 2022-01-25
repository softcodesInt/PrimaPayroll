from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from drf_multiple_model.views import ObjectMultipleModelAPIView
from drf_multiple_model.pagination import MultipleModelLimitOffsetPagination
from rest_framework.generics import ListAPIView
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from .serializers import StaffLogSerializer, CompanyLogSerializer
from .models import StaffLog, CompanyLog


class LimitPagination(MultipleModelLimitOffsetPagination):
    default_limit = 20


class AuditLogView(ObjectMultipleModelAPIView):
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    pagination_class = LimitPagination
    querylist = [
        {'queryset': StaffLog.objects.all(), 'serializer_class': StaffLogSerializer},
        {'queryset': CompanyLog.objects.all(), 'serializer_class': CompanyLogSerializer}
    ]


class StaffLogView(ListAPIView):
    serializer_class = StaffLogSerializer
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    queryset = StaffLog.objects.all()


class CompanyLogView(ListAPIView):
    serializer_class = CompanyLogSerializer
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    queryset = CompanyLog.objects.all()
