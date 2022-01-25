from .interface import ExportInterface
from company.models import Holiday
from accounts.utils import get_logged_in_user_company_policy


class ExportHoliday(ExportInterface):
    def __init__(self, request_context):
        self.request_context = request_context

    def generate_export_data(self):
        company_policy = get_logged_in_user_company_policy(self.request_context)
        return Holiday.objects.filter(company_policy__in=company_policy).values_list('name', 'description', 'is_active',
                                                                                     'recurring', 'date_from',
                                                                                     'date_to', 'company_policy__name')

    def get_export_fields(self):
        return [
            {
                'value': 'name',
                'display': 'NAME',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'description',
                'display': 'DESCRIPTION',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'is_active',
                'display': 'IS ACTIVE',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'recurring',
                'display': 'RECURRING',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'date_from',
                'display': 'FROM',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'date_to',
                'display': 'TO',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'company_policy__name',
                'display': 'COMPANY POLICY',
                'is_foreign': False,
                'is_ManyToMany': False
            }
        ]
