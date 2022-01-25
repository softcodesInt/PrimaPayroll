# from .interface import ExportInterface
# from company.models import Leave, LeaveCategory
# from accounts.utils import main_company, get_logged_in_user_company
#
#
# class ExportLeaveTypes(ExportInterface):
#     def __init__(self, request_context):
#         self.request_context = request_context
#
#     def generate_export_data(self):
#         leave_category = LeaveCategory.objects.filter(company__in=get_logged_in_user_company(self.request_context))
#         return Leave.objects.filter(category__in=leave_category).values_list('name', 'description', 'is_active',
#                                                                              'category__name', 'entitlement_value',
#                                                                              'weekend_apply', 'months_prior',
#                                                                              'for_female', 'for_male')
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
#                 'value': 'category',
#                 'display': 'LEAVE CATEGORY',
#                 'is_foreign': True,
#                 'is_ManyToMany': False
#             },
#             {
#                 'value': 'entitlement_value',
#                 'display': 'ENTITLEMENT VALUE',
#                 'is_foreign': False,
#                 'is_ManyToMany': False
#             },
#             {
#                 'value': 'weekend_apply',
#                 'display': 'DOES WEEKEND APPLY',
#                 'is_foreign': False,
#                 'is_ManyToMany': False
#             },
#             {
#                 'value': 'months_prior',
#                 'display': 'HOW LONG BEFORE THIS LEAVE IS ACTIVE',
#                 'is_foreign': False,
#                 'is_ManyToMany': False
#             },
#             {
#                 'value': 'for_female',
#                 'display': 'FEMALE',
#                 'is_foreign': False,
#                 'is_ManyToMany': False
#             },
#             {
#                 'value': 'for_male',
#                 'display': 'MALE',
#                 'is_foreign': False,
#                 'is_ManyToMany': False
#             },
#         ]
