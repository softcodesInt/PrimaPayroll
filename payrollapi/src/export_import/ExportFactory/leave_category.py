# from .interface import ExportInterface
# from company.models import LeaveCategory
# from accounts.utils import main_company, get_logged_in_user_company
#
#
# class ExportLeaveCategory(ExportInterface):
#     def __init__(self, request_context):
#         self.request_context = request_context
#
#     def generate_export_data(self):
#         return LeaveCategory.objects.filter(company__in=get_logged_in_user_company(self.request_context)).values_list('name',
#                                                                                                        'description',
#                                                                                                        'is_active',
#                                                                                                        'company__name')
#
#     def get_export_fields(self):
#         return [
#             {
#                 'value': 'name',
#                 'display': 'NAME',
#                 'is_foreign': False,
#                 'is_ManyToMany': False
#             },
#             {
#                 'value': 'description',
#                 'display': 'DESCRIPTION',
#                 'is_foreign': False,
#                 'is_ManyToMany': False
#             },
#             {
#                 'value': 'is_active',
#                 'display': 'IS ACTIVE',
#                 'is_foreign': False,
#                 'is_ManyToMany': False
#             },
#             {
#                 'value': 'company',
#                 'display': 'COMPANIES',
#                 'is_foreign': False,
#                 'is_ManyToMany': True
#             }
#         ]
