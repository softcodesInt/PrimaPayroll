from django.utils import timezone
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status
from dateutil.relativedelta import relativedelta

from .serializers import LicenseSerializer
from .models import CompanyLicense, CompanyCompany
from .permissions import HasAPIAccess

class ActivateLicenseView(GenericAPIView):
    serializer_class = LicenseSerializer
    authentication_classes = ()
    permission_classes = (HasAPIAccess,)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            license = CompanyLicense.objects.get(code=serializer.validated_data['code'])
        except CompanyLicense.DoesNotExist:
            return Response({'non_field_errors': ['License doesn\'t exist']}, status=status.HTTP_404_NOT_FOUND)
        
        if license.is_active:
            return Response({'non_field_errors': ['License has already been activated']}, status=status.HTTP_400_BAD_REQUEST)

        try:
            company = CompanyCompany.objects.get(license=license)
        except CompanyCompany.DoesNotExist:
            return Response({'non_field_errors': ['License is not linked to any company']}, status=status.HTTP_400_BAD_REQUEST)
        
        now = timezone.now()
        expiry_date = now + relativedelta(years=company.subscription_year, months=company.subscription_month)
        license.date_activated = now
        license.expiration_date = expiry_date
        license.is_active = True
        license.save()

        return Response({
            'name': company.name,
            'company_id': company.id,
            'date_activated': license.date_activated,
            'date_expired': license.expiration_date,
            'address': company.address,
            'employee_count': company.employee_count,
            'bought_payroll': company.bought_payroll,
            'bought_ess': company.bought_ess,
            'license_code': license.code,
            'subscription_year': company.subscription_year,
            'subscription_month': company.subscription_month
        })


class GetCompanyEmployeeCountView(GenericAPIView):
    serializer_class = None
    authentication_classes = ()
    permission_classes = (HasAPIAccess,)

    def get(self, request):
        license_code = request.GET.get('license_code')
        try:
            license = CompanyLicense.objects.get(code=license_code)
        except CompanyLicense.DoesNotExist:
            return Response({'non_field_errors': ['License doesn\'t exist']}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            company = CompanyCompany.objects.get(license=license)
        except CompanyCompany.DoesNotExist:
            return Response({'non_field_errors': ['License is not linked to any company']}, status=status.HTTP_400_BAD_REQUEST)
        

        return Response({
            'employee_count': company.employee_count,
            'bought_ess': company.bought_ess,
            'date_activated': license.date_activated,
            'date_expired': license.expiration_date,
            'subscription_year': company.subscription_year,
            'subscription_month': company.subscription_month
        })
