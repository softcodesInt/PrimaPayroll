from rest_framework import serializers

from utilities.models import JobTitle, ContractNature, JobGrade, BankLists
from accounts.utils import get_parent_company, get_logged_in_user_company_policy
from company.models import CompanyPolicy
from employees.models import Employee
from payroll.models import Remuneration, TaxReliefGroup
from .settings import EXPORT_TYPES


class ExportSerializer(serializers.Serializer):
    export_type = serializers.CharField(max_length=20)
    module = serializers.CharField(max_length=50)

    def validate(self, attrs):
        if attrs['export_type'] not in EXPORT_TYPES:
            raise serializers.ValidationError(detail='You can only export one of {}'.format(EXPORT_TYPES))

        return attrs


class ImportEmployeeSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255)
    first_name = serializers.CharField(max_length=255)
    last_name = serializers.CharField(max_length=255, required=False, allow_null=True, allow_blank=True)
    date_of_birth = serializers.DateTimeField()
    personal_email = serializers.EmailField(required=False, allow_null=True, allow_blank=True)
    marital_status = serializers.ChoiceField(choices=Employee.MARITAL_STATUS)
    gender = serializers.ChoiceField(choices=Employee.GENDER)
    email = serializers.EmailField(required=False)
    employee_code = serializers.CharField(max_length=255)
    date_engaged = serializers.DateTimeField()
    probation_period = serializers.IntegerField(max_value=255)
    pension_pin = serializers.CharField(max_length=255, required=False, allow_null=True, allow_blank=True)
    pension_start_date = serializers.DateTimeField(required=False, allow_null=True)
    tax_identification_number = serializers.CharField(max_length=255, required=False, allow_null=True, allow_blank=True)
    nhf = serializers.CharField(max_length=255, required=False, allow_null=False, allow_blank=True)
    job_title = serializers.CharField(max_length=255)
    nature_of_contract = serializers.CharField(max_length=255)
    job_grade = serializers.CharField(max_length=255, required=False, allow_null=True, allow_blank=True)
    address = serializers.CharField(max_length=255, required=False, allow_null=True, allow_blank=True)
    nationality = serializers.CharField(max_length=255, required=False, allow_null=True, allow_blank=True)
    phone_number = serializers.CharField(max_length=255, required=False, allow_null=True, allow_blank=True)
    next_of_kin_name = serializers.CharField(max_length=255, required=False, allow_null=True, allow_blank=True)
    next_of_kin_phone_number = serializers.CharField(max_length=255, required=False, allow_null=True, allow_blank=True)
    next_of_kin_email = serializers.CharField(max_length=255, required=False, allow_null=True, allow_blank=True)
    account_number = serializers.CharField(max_length=255, required=False, allow_null=True, allow_blank=True)
    account_name = serializers.CharField(max_length=255, required=False, allow_null=True, allow_blank=True)
    bank = serializers.CharField(max_length=255, required=False, allow_null=True, allow_blank=True)
    company_policy = serializers.CharField(max_length=255)
    remuneration = serializers.CharField(max_length=255)
    tax_relief = serializers.CharField(max_length=255, required=False, allow_null=True, allow_blank=True)
    fixed_tax = serializers.DecimalField(max_digits=8, required=False, decimal_places=3, allow_null=True)
    hours_per_day = serializers.IntegerField(max_value=20, required=False, allow_null=True)
    hours_per_week = serializers.IntegerField(max_value=200, required=False, allow_null=True)
    hours_per_month = serializers.IntegerField(max_value=2000, required=False, allow_null=True)
    rates_per_hour = serializers.DecimalField(max_digits=80000000, required=False, decimal_places=3, allow_null=True)
    rates_per_day = serializers.DecimalField(max_digits=800000000, required=False, decimal_places=3, allow_null=True)
    rates_per_month = serializers.DecimalField(max_digits=8000000, required=False, decimal_places=3, allow_null=True)
    pension_applied = serializers.BooleanField(required=False, default=True)
    tax_applied = serializers.BooleanField(required=False, default=True)
    works_monday = serializers.BooleanField(required=False, default=True)
    works_tuesday = serializers.BooleanField(required=False, default=True)
    works_wednesday = serializers.BooleanField(required=False, default=True)
    works_thursday = serializers.BooleanField(required=False, default=True)
    works_friday = serializers.BooleanField(required=False, default=True)
    works_saturday = serializers.BooleanField(required=False, default=True)
    works_sunday = serializers.BooleanField(required=False, default=True)

    def validate_email(self, value):
        request = self.context['request']
        if value:
            if Employee.objects.filter(email=value, main_company=get_parent_company(request)).exists():
                raise serializers.ValidationError(detail="Email already exists")
        return value

    def validate_employee_code(self, value):
        request = self.context['request']
        if Employee.objects.filter(employee_code=value, main_company=get_parent_company(request)).exists():
            raise serializers.ValidationError(detail="Employee Code already exists")

        return value

    def validate_job_title(self, value):
        request = self.context['request']
        if JobTitle.objects.filter(name=value, is_active=True, company=get_parent_company(request)).exists():
            return JobTitle.objects.get(name=value, company=get_parent_company(request))

        raise serializers.ValidationError(detail="Job Title does not exist")

    def validate_nature_of_contract(self, value):
        request = self.context['request']
        if ContractNature.objects.filter(name=value, is_active=True, company=get_parent_company(request)).exists():
            return ContractNature.objects.get(name=value, company=get_parent_company(request))

        raise serializers.ValidationError(detail="Nature of Contract does not exist")

    def validate_job_grade(self, value):
        request = self.context['request']
        if not value:
            return value
        if JobGrade.objects.filter(name=value, is_active=True, company=get_parent_company(request)).exists():
            return JobGrade.objects.get(name=value, company=get_parent_company(request))

        raise serializers.ValidationError(detail="Job Grade does not exist")

    def validate_bank(self, value):
        request = self.context['request']
        if not value:
            return value
        if BankLists.objects.filter(name=value, is_active=True, company=get_parent_company(request)).exists():
            return BankLists.objects.get(name=value, company=get_parent_company(request))

        raise serializers.ValidationError(detail="Bank does not exist")

    def validate_company_policy(self, value):
        request = self.context['request']
        if not value:
            return value
        if CompanyPolicy.objects.filter(name=value, is_active=True, company__in=[get_parent_company(request)]).exists():
            return CompanyPolicy.objects.get(name=value, company__in=[get_parent_company(request)])

        raise serializers.ValidationError(detail="Company Policy does not exist")

    def validate_remuneration(self, value):
        request = self.context['request']
        if Remuneration.objects.filter(
                name=value, is_active=True, company_policy__in=[get_logged_in_user_company_policy(request)]).exists():
            return Remuneration.objects.get(name=value, company_policy__in=[get_logged_in_user_company_policy(request)])

        raise serializers.ValidationError(detail="Remuneration does not exist")

    def validate_tax_relief(self, value):
        request = self.context['request']
        if not value:
            return value
        if TaxReliefGroup.objects.filter(
                name=value, is_active=True, company_policy__in=get_logged_in_user_company_policy(request)).exists():
            return TaxReliefGroup.objects.get(name=value, company_policy__in=get_logged_in_user_company_policy(request))

        raise serializers.ValidationError(detail="Tax Relief does not exist")

    def create(self, validated_data):
        print(validated_data)
