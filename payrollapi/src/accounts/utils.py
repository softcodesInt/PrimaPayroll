import requests
from rest_framework_jwt.settings import api_settings
from django.conf import settings
#
# from lib.utils import UserNotInCompanyException
from company.models import Company, CompanyPolicy
from accounts.models import AdminUser
from employees.models import Employee


def get_company_employee_count(code):
    """
    Get the company's employee count before granting access to create new employee.
    """
    headers = {'Authorization': settings.LICENSE_CODE_API_KEY}
    url = f'{settings.EMPLOYEE_COUNT_ENDPOINT}?license_code={code}'
    response = requests.get(url=url, headers=headers)
    return response


# def main_company(request):
#     return Company.objects.get(admin=request.user)
#     try:
#         license_code = request.COOKIES[settings.LICENSE_CODE_COOKIES_KEY]
#         return Company.objects.get(license_code=license_code)
#     except (KeyError, ValueError):
#         raise UserNotInCompanyException()


def get_parent_company(request):
    return Company.objects.get(admin=request.user.adminuser, is_subsidiary=False)


def get_logged_in_user_company(request):
    company = get_parent_company(request)
    return company


def get_company_from_user(user):
    return Company.objects.get(admin=user.adminuser, is_subsidiary=False)


def get_logged_in_user_company_policy(request):
    company = get_logged_in_user_company(request)
    return CompanyPolicy.objects.filter(company=company, is_active=True)


def get_company_active_employee(company):
    user_count = Employee.objects.filter(
        main_company=company,
        status__in=[Employee.EMPLOYEE_STATUS_ACTIVE,
                    Employee.EMPLOYEE_STATUS_REINSTATED, Employee.EMPLOYEE_STATUS_ON_LEAVE]).count()
    return user_count
