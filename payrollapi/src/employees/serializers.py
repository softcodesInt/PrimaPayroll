import decimal
from rest_framework import serializers

from accounts.utils import get_parent_company
from employees.models import Employee
from employees.pension_utils import calculate_pension_for_employee
from employees.payroll_utils import should_payroll_element_be_included
from company.models import Leave, LeaveApplication
from company.serializers import (
    HierarchySerializer,
    LeaveSerializer
)
from utilities.serializers import (
    BankListSerializer,
    JobGradeSerializer,
    JobTitleSerializer,
    ContractNatureSerializer
)
from payroll.serializers import (
    RemunerationSerializer,
    TaxReliefGroupSerializer,
)
from payroll.models import Payslip
from payroll.employee_tax import EmployeeTax
from utilities.models import TerminateReason, ReinstateReason


class EmployeeSerializer(serializers.ModelSerializer):
    payroll_data = serializers.SerializerMethodField()
    total_earnings = serializers.SerializerMethodField()
    total_deductions = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = '__all__'

    def to_representation(self, instance):
        self.fields['hierarchy'] = HierarchySerializer(read_only=True, many=True)
        self.fields['leaves'] = LeaveSerializer(read_only=True, many=True)
        self.fields['job_grade'] = JobGradeSerializer(read_only=True)
        self.fields['job_title'] = JobTitleSerializer(read_only=True)
        self.fields['nature_of_contract'] = ContractNatureSerializer(read_only=True)
        self.fields['bank'] = BankListSerializer(read_only=True)
        self.fields['remuneration'] = RemunerationSerializer(read_only=True)
        self.fields['tax_relief'] = TaxReliefGroupSerializer(read_only=True)
        return super(EmployeeSerializer, self).to_representation(instance)

    def get_total_earnings(self, obj):
        from payroll.models import PayrollElements

        payroll_data = self.get_payroll_data(obj)
        total = decimal.Decimal(0)
        for key, value in payroll_data.items():
            if key.upper() in [PayrollElements.PAYROLL_ELEMENT_EARNINGS]:
                for payslip_element in value:
                    if payslip_element['amount'] != 'None':
                        total += decimal.Decimal(payslip_element['amount'])
        return total

    def get_total_deductions(self, obj):
        from payroll.models import PayrollElements

        payroll_data = self.get_payroll_data(obj)
        total = decimal.Decimal(0)
        for key, value in payroll_data.items():
            if key.upper() in [PayrollElements.PAYROLL_ELEMENT_DEDUCTIONS]:
                for payslip_element in value:
                    if payslip_element['amount'] != 'None':
                        total += decimal.Decimal(payslip_element['amount'])
        return total

    def get_pension(self, obj):
        request = self.context.get('request')
        if obj.pension_applied:
            return calculate_pension_for_employee(request, obj)
        return 0

    def get_payroll_data(self, obj):
        from payroll.models import PayrollElements, Loan
        earning_data = []
        deduction_data = []
        company_contribution = []
        if not obj.remuneration:
            return {}
        earnings = obj.remuneration.payroll_elements.filter(element_type=PayrollElements.PAYROLL_ELEMENT_EARNINGS)
        for e in earnings:
            if should_payroll_element_be_included(e, obj):
                earning_data.append({
                    'name': e.name,
                    'amount': str(obj.get_user_payroll_element_value(e))
                })

        deductions = obj.remuneration.payroll_elements.filter(element_type=PayrollElements.PAYROLL_ELEMENT_DEDUCTIONS)
        for e in deductions:
            if should_payroll_element_be_included(e, obj):
                deduction_data.append({
                    'name': e.name,
                    'amount': str(obj.get_user_payroll_element_value(e))
                })

        if obj.pension_applied:
            deduction_data.append({
                'name': 'Pension',
                'amount': str(self.get_pension(obj)['employee_rate'])
            })
            company_contribution.append({
                'name': 'Employer Pension',
                'amount': str(self.get_pension(obj)['employer_rate'])
            })
        if obj.tax_applied == Employee.TAX_APPLIED_YES:
            deduction_data.append({
                'name': 'Payee Tax',
                'amount': str(self.get_tax(obj))
            })
            for relief in obj.tax_relief.relieve_items:
                deduction_data.append({
                    'name': relief.name,
                    'amount': str(relief.get_relief_value(obj))
                })

        for loan in Loan.objects.filter(employee=obj, is_active=True):
            if loan.get_monthly_repayment_amount:
                deduction_data.append({
                    'name': 'Loan',
                    'amount': str(loan.get_monthly_repayment_amount)
                })

        return {
            'earnings': earning_data,
            'deductions': deduction_data,
            'company_contributions': company_contribution
        }

    def get_tax(self, obj):
        if obj.tax_applied and obj.remuneration:
            employee_tax = EmployeeTax(obj, obj.company_policy, self.context.get('request'))
            return employee_tax.calculate_tax()
        return 0

    def validate(self, attrs):
        if 'employee_code' in attrs:
            if Employee.objects.filter(
                    employee_code=attrs['employee_code'],
                    main_company=get_parent_company(self.context.get('request'))).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError(detail="Employee Code already exists")

        if 'email' in attrs:
            if Employee.objects.filter(
                    email=attrs['email'],
                    main_company=get_parent_company(self.context.get('request'))).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError(detail="Employee Email already exists")

        if 'pension_pin' in attrs:
            if Employee.objects.filter(
                    pension_pin=attrs['pension_pin'],
                    main_company=get_parent_company(self.context.get('request'))).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError(detail="Pension Pin already exists")

        if 'tax_identification_number' in attrs:
            if Employee.objects.filter(
                    tax_identification_number=attrs['tax_identification_number'],
                    main_company=get_parent_company(self.context.get('request'))).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError(detail="Tax Identification already exists")

        if 'nhf' in attrs:
            if Employee.objects.filter(
                    nhf=attrs['nhf'],
                    main_company=get_parent_company(self.context.get('request'))).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError(detail="NHF already exists")

        return attrs


class PayslipSerializers(serializers.ModelSerializer):
    net_pay = serializers.CharField()
    gross_pay = serializers.CharField()

    class Meta:
        model = Payslip
        fields = ('id', 'date_created', 'net_pay', 'gross_pay',)


class LeaveWorkflowSerializer(serializers.Serializer):
    leave = serializers.UUIDField()
    number_of_days = serializers.IntegerField()
    start_date = serializers.DateField()


class LeaveApplicationSerializer(serializers.ModelSerializer):

    class Meta:
        model = LeaveApplication
        fields = '__all__'

    def to_representation(self, instance):
        return {
            'id': instance.id,
            'leave': {
                'id': instance.leave.pk,
                'name': instance.leave.name,
            },
            'employee': {
              'id': instance.employee.id,
              'name': instance.employee.get_full_name()
            },
            'number_of_days': instance.number_of_days,
            'start_date': str(instance.start_date),
            'end_date': str(instance.end_date),
            'is_active': instance.is_active,
            'status': instance.status
        }


class TerminateReasonSerializer(serializers.ModelSerializer):
    class Meta:
        model = TerminateReason
        fields = '__all__'


class ReinstateReasonSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReinstateReason
        fields = '__all__'


class TerminateReinstateReasonSerializer(serializers.Serializer):
    reason = serializers.UUIDField()
    date = serializers.DateField()
