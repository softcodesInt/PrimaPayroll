from rest_framework.generics import GenericAPIView
from rest_framework import status
from rest_framework.response import Response

from company.serializers import LicenseCodeActivationSerializer
from company.models import Company
from company.service import CompanyService


class LicenseCodeActivationView(GenericAPIView):
    serializer_class = LicenseCodeActivationSerializer
    authentication_classes = ()
    permission_classes = ()

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        response_json, status_code = CompanyService.activate_license_code(serializer.validated_data['code'])
        if status_code == status.HTTP_200_OK:
            data = response_json
            company = CompanyService.create_new_company(data)
            response_json['company_id'] = str(company.id)
            return Response(response_json, status=status_code)
        else:
            company = Company.objects.filter(license_code=serializer.validated_data['code']).first()
            if company and not company.admin:
                response_json = {
                    'name': company.name,
                    'company_id': company.id,
                    'date_activated': company.middleware_date_activated,
                    'date_expired': company.subscription_expiration_date,
                    'address': company.address,
                    'employee_count': company.employee_count,
                    'bought_payroll': company.bought_payroll,
                    'bought_ess': company.bought_ess,
                    'license_code': company.license_code,
                    'subscription_year': company.subscription_year,
                    'subscription_month': company.subscription_month

                }
                return Response(response_json, status=status.HTTP_200_OK)

        return Response(response_json, status=status_code)
