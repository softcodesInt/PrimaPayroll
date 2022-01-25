from rest_framework import serializers

from employees.models import Employee
from employees.serializers import PayslipSerializers, LeaveApplicationSerializer
from utilities.serializers import (
    BankListSerializer,
    JobGradeSerializer,
    JobTitleSerializer,
    ContractNatureSerializer
)
from payroll.models import Payslip
from company.models import LeaveApplication


class EmployeeSerializer(serializers.ModelSerializer):
    payslips = serializers.SerializerMethodField()
    employee_leaves = serializers.SerializerMethodField()
    employee_leave_applications = serializers.SerializerMethodField()

    def to_representation(self, instance):
        self.fields['job_grade'] = JobGradeSerializer(read_only=True)
        self.fields['job_title'] = JobTitleSerializer(read_only=True)
        self.fields['nature_of_contract'] = ContractNatureSerializer(read_only=True)
        self.fields['bank'] = BankListSerializer(read_only=True)
        return super(EmployeeSerializer, self).to_representation(instance)

    def get_payslips(self, obj):
        qs = Payslip.objects.filter(company=obj.main_company, employee=obj)
        return PayslipSerializers(instance=qs, many=True).data

    def get_employee_leaves(self, obj):
        return obj.get_available_leaves(is_ess=True)

    def get_employee_leave_applications(self, obj):
        return LeaveApplicationSerializer(instance=LeaveApplication.objects.filter(employee=obj), many=True).data

    class Meta:
        model = Employee
        fields = '__all__'
