import requests
from django.conf import settings

from auditlog.models import (
    CompanyLog,
    SubsidiaryLog,
    CompanyPolicyLog,
    LeaveCategoryLog,
    LeaveLog,
    HierarchyLog,
    HolidayLog
)
from company.models import Company


class CompanyService:
    @staticmethod
    def activate_license_code(code):
        """
        Activate a license code from the external middleware

        params:
        code -> str

        :return tuple of json and status code
        """
        data = {'code': code}
        headers = {'Authorization': settings.LICENSE_CODE_API_KEY}

        response = requests.post(url=settings.LICENSE_CODE_ACTIVATION_ENDPOINT,
                                 json=data,
                                 headers=headers)
        return response.json(), response.status_code

    @staticmethod
    def log_activation(company, data):
        CompanyLog.objects.create(company=company,
                                  action=CompanyLog.PRIMERLOG_CODE_ACTIVATED,
                                  meta=data)

    @staticmethod
    def create_new_company(data):
        company = Company.objects.create(name=data['name'],
                                         address=data['address'],
                                         middleware_id=data['company_id'],
                                         middleware_date_activated=data['date_activated'],
                                         subscription_expiration_date=data['date_expired'],
                                         subscription_year=data['subscription_year'],
                                         subscription_month=data['subscription_month'],
                                         bought_payroll=data['bought_payroll'],
                                         bought_ess=data['bought_ess'],
                                         employee_count=data['employee_count'],
                                         license_code=data['license_code'],
                                         is_active=True)
        return company

    @staticmethod
    def log_subsidiary(action, blamer, meta, instance):
        SubsidiaryLog.objects.create(action=action, blamer=blamer, meta=meta, subsidiary=instance)

    @staticmethod
    def log_policy(action, blamer, meta, instance):
        CompanyPolicyLog.objects.create(action=action, blamer=blamer, meta=meta, policy=instance)

    @staticmethod
    def log_leave_category(action, blamer, meta, instance):
        LeaveCategoryLog.objects.create(action=action, blamer=blamer, meta=meta, category=instance)

    @staticmethod
    def log_leave(action, blamer, meta, instance):
        LeaveLog.objects.create(action=action, blamer=blamer, meta=meta, leave=instance)

    @staticmethod
    def log_hierarchy(action, blamer, meta, instance):
        HierarchyLog.objects.create(action=action, blamer=blamer, meta=meta, hierarchy=instance)

    @staticmethod
    def log_holiday(action, blamer, meta, instance):
        HolidayLog.objects.create(action=action, blamer=blamer, meta=meta, holiday=instance)