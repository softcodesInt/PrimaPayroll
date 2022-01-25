from uuid import UUID
from rest_framework import serializers

from accounts.serializers import AdminUserSerializer
from .models import (
    PayrollElements,
    PayrollCategory,
    Remuneration,
    PayPeriod,
    TaxReliefGroup,
    TaxRelief,
    Transactions,
    EmployeeDrivenPayroll,
    Loan,
)
from company.serializers import ReferencePolicySerializer
from lib.utils import is_valid_uuid
from employees.models import Employee


class PayrollCategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = PayrollCategory
        fields = '__all__'
        read_only_fields = ('created_by', 'company',)

    def to_representation(self, instance):
        self.fields['company_policy'] = ReferencePolicySerializer(read_only=True)
        self.fields['created_by'] = AdminUserSerializer(read_only=True)
        return super(PayrollCategorySerializer, self).to_representation(instance)

    def validate(self, attrs):
        name = attrs['name']
        company_policy = attrs['company_policy']

        base_check = PayrollCategory.objects.filter(company_policy=company_policy, name=name)
        if self.instance:
            base_check = base_check.exclude(id=self.instance.id)

        if base_check.exists():
            raise serializers.ValidationError("Payroll Category: '{}' exists. Use a different name.".format(name))
        return attrs


class PayrollElementSerializer(serializers.ModelSerializer):
    class Meta:
        model = PayrollElements
        fields = '__all__'
        read_only_fields = ('created_by',)

    def to_representation(self, instance):
        self.fields['category'] = PayrollCategorySerializer(read_only=True)
        return super(PayrollElementSerializer, self).to_representation(instance)

    def validate(self, attrs):
        category = attrs['category']
        name = attrs['name']

        base_check = PayrollElements.objects.filter(category=category, name=name)
        if self.instance:
            base_check = base_check.exclude(id=self.instance.id)

        if base_check.exists():
            raise serializers.ValidationError("Payroll Element: '{}' exists. Use a different name.".format(name))
        return attrs


class RemunerationPayrollSerializer(serializers.ModelSerializer):
    class Meta:
        model = PayrollElements
        fields = '__all__'

    def to_representation(self, instance):
        self.fields['company_policy'] = ReferencePolicySerializer(read_only=True)
        self.fields['created_by'] = AdminUserSerializer(read_only=True)
        return super(RemunerationPayrollSerializer, self).to_representation(instance)


class RemunerationSerializer(serializers.ModelSerializer):
    payroll_elements = PayrollElementSerializer(read_only=True, many=True)

    class Meta:
        model = Remuneration
        fields = '__all__'
        read_only_fields = ('created_by',)

    def to_representation(self, instance):
        self.fields['payroll_groups'] = PayrollCategorySerializer(read_only=True, many=True)
        self.fields['company_policy'] = ReferencePolicySerializer(read_only=True)
        self.fields['created_by'] = AdminUserSerializer(read_only=True)
        return super(RemunerationSerializer, self).to_representation(instance)

    def validate(self, attrs):
        company_policy = attrs['company_policy']
        name = attrs['name']

        base_check = Remuneration.objects.filter(company_policy=company_policy, name=name)
        if self.instance:
            base_check = base_check.exclude(id=self.instance.id)

        if base_check.exists():
            raise serializers.ValidationError("Remuneration: '{}' exists. Use a different name.".format(name))
        return attrs


class PensionSettingSerializer(serializers.Serializer):
    id = serializers.UUIDField(required=False)
    employee_rate = serializers.DecimalField(max_digits=5, decimal_places=2)
    employer_rate = serializers.DecimalField(max_digits=5, decimal_places=2)
    payroll_lines = serializers.PrimaryKeyRelatedField(queryset=PayrollElements.objects.all(), many=True)


class PayPeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PayPeriod
        fields = '__all__'

    def to_representation(self, instance):
        self.fields['company_policy'] = ReferencePolicySerializer(read_only=True)
        return super(PayPeriodSerializer, self).to_representation(instance)


class TaxReliefGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaxReliefGroup
        fields = '__all__'

    def to_representation(self, instance):
        self.fields['company_policy'] = ReferencePolicySerializer(read_only=True)
        return super(TaxReliefGroupSerializer, self).to_representation(instance)


class TaxReliefSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaxRelief
        fields = '__all__'

    def to_representation(self, instance):
        self.fields['payroll_lines'] = RemunerationPayrollSerializer(read_only=True, many=True)
        self.fields['relief_group'] = TaxReliefGroupSerializer(read_only=True)
        return super(TaxReliefSerializer, self).to_representation(instance)


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transactions
        fields = '__all__'


class EmployeeDrivenPayrollSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeDrivenPayroll
        fields = '__all__'


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ('id', 'first_name', 'last_name')


class LoanSerializer(serializers.ModelSerializer):
    employee = EmployeeSerializer(read_only=True)
    next_repayment_amount = serializers.SerializerMethodField()
    total_loan_value = serializers.SerializerMethodField()

    def get_next_repayment_amount(self, obj):
        return obj.get_monthly_repayment_amount

    def get_total_loan_value(self, obj):
        return obj.get_total_amount

    class Meta:
        model = Loan
        fields = '__all__'
