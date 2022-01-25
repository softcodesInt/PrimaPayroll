from .interface import ExportInterface

from employees.models import Employee
from accounts.utils import get_parent_company


class ExportEmployee(ExportInterface):
    def __init__(self, request_context):
        self.request_context = request_context

    def generate_export_data(self):
        return Employee.objects.filter(main_company=get_parent_company(self.request_context)).values_list(
            'title',
            'first_name',
            'last_name',
            'other_name',
            'date_of_birth',
            'personal_email',
            'marital_status',
            'gender',
            'email',
            'employee_code',
            'date_engaged',
            'probation_period',
            'pension_pin',
            'pension_start_date',
            'tax_identification_number',
            'nhf',
            'job_title__name',
            'nature_of_contract__name',
            'job_grade__name',
            'address',
            'nationality',
            'phone_number',
            'next_of_kin_name',
            'next_of_kin_phone_number',
            'next_of_kin_email',
            'bank__name',
            'account_number',
            'account_name',
            'company_policy__name',
            # exclude many to many
            'remuneration__name',
            'tax_relief__name',
            'fixed_tax',
            'hours_per_day',
            'hours_per_week',
            'hours_per_month',
            'rates_per_hour',
            'rates_per_day',
            'rates_per_month',
            'rates_per_year',
            'pension_applied',
            'tax_applied',
            'works_monday',
            'works_tuesday',
            'works_wednesday',
            'works_thursday',
            'works_friday',
            'works_saturday',
            'works_sunday',
        )

    def get_export_fields(self):
        return [
            {
                'value': 'title',
                'display': 'TITLE',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'first_name',
                'display': 'First Name',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'last_name',
                'display': 'Last Name',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'other_name',
                'display': 'Other Name',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'date_of_birth',
                'display': 'Date of birth',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'personal_email',
                'display': 'Personal Email',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'marital_status',
                'display': 'Marital Status',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'gender',
                'display': 'Gender',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'email',
                'display': 'Company Email',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'employee_code',
                'display': 'Employee Code',
                'is_foreign': False,
                'is_ManyToMany': False
            },{
                'value': 'date_engaged',
                'display': 'Date Engaged',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'probation_period',
                'display': 'Probation Period',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'pension_pin',
                'display': 'Pension Pin',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'pension_start_date',
                'display': 'Pension Start Date',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'tax_identification_number',
                'display': 'Tax Identification Number',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'nhf',
                'display': 'NHF',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'job_title__name',
                'import_field': 'job_title',
                'display': 'Job Title',
                'is_foreign': True,
                'is_ManyToMany': False
            },
            {
                'value': 'nature_of_contract__name',
                'import_field': 'nature_of_contract',
                'display': 'Nature Of Contract',
                'is_foreign': True,
                'is_ManyToMany': False
            },
            {
                'value': 'job_grade__name',
                'display': 'Job Grade',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'address',
                'display': 'Address',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'nationality',
                'display': 'Nationality',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'phone_number',
                'display': 'Phone Number',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'next_of_kin_name',
                'display': 'Next Of Kin Name',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'next_of_kin_phone_number',
                'display': 'Next Of Kin Phone Number',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'next_of_kin_email',
                'display': 'Next Of Kin Email',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'bank__name',
                'import_field': 'bank',
                'display': 'Bank Name',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'account_number',
                'display': 'Account Number',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'account_name',
                'display': 'Account Name',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'company_policy__name',
                'import_field': 'company_policy',
                'display': 'Company Policy',
                'is_foreign': True,
                'is_ManyToMany': False
            },
            {
                'value': 'remuneration__name',
                'import_field': 'remuneration',
                'display': 'Remuneration Name',
                'is_foreign': True,
                'is_ManyToMany': False
            },
            {
                'value': 'tax_relief__name',
                'display': 'Tax Relief',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'fixed_tax',
                'display': 'Fixed Tax',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'hours_per_day',
                'display': 'Hours Per Day',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'hours_per_week',
                'display': 'Hours Per Week',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'hours_per_month',
                'display': 'Hours Per Month',
                'is_foreign': False,
                'is_ManyToMany': False
            },{
                'value': 'rates_per_hour',
                'display': 'Rates Per Hour',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'rates_per_day',
                'display': 'Rates Per Day',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'rates_per_month',
                'display': 'Rates Per Month',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'rates_per_year',
                'display': 'Rates Per Year',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'pension_applied',
                'display': 'Pension Applied?',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'tax_applied',
                'display': 'Tax Applied?',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'works_monday',
                'display': 'Works Monday?',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'works_tuesday',
                'display': 'Works Tuesday?',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'works_wednesday',
                'display': 'Works Wednesday?',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'works_thursday',
                'display': 'Works Thursday?',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'works_friday',
                'display': 'Works Friday?',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'works_saturday',
                'display': 'Works Saturday?',
                'is_foreign': False,
                'is_ManyToMany': False
            },
            {
                'value': 'works_sunday',
                'display': 'Works Sunday?',
                'is_foreign': False,
                'is_ManyToMany': False
            },
        ]
