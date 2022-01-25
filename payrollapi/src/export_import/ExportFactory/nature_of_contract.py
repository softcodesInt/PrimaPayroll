from .interface import ExportInterface
from utilities.models import ContractNature
from accounts.utils import get_parent_company


class ExportNatureOfContract(ExportInterface):
    def __init__(self, request_context):
        self.request_context = request_context

    def generate_export_data(self):
        return ContractNature.objects.filter(company=get_parent_company(self.request_context)).values_list('name',
                                                                                                           'description',
                                                                                                           'is_active')

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
            }
        ]
