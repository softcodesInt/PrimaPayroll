from .interface import ExportInterface
from utilities.models import BankLists
from accounts.utils import get_parent_company


class ExportBankLists(ExportInterface):
    def __init__(self, request_context):
        self.request_context = request_context

    def generate_export_data(self):
        banks = BankLists.objects.filter(company=get_parent_company(self.request_context)).values_list('name',
                                                                                                          'bank_code',
                                                                                                          'sort_code')
        return banks

    def get_export_fields(self):
        return [
            {
                'value': 'name',
                'display': 'NAME',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'bank_code',
                'display': 'BANK CODE',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'sort_code',
                'display': 'SORT CODE',
                'is_foreign': False,
                'is_ManyToMany': False
            }
        ]
