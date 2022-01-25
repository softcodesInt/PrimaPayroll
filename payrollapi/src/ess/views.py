from django.utils import timezone
from django.contrib.auth.models import User
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework import status

from accounts.views import UserLoginView
from employees.models import Employee
from ess.serializers import EmployeeSerializer
from employees.views import DownloadEmployeePayslip, EmployeeLeaveWorkflowView


class CreateAccountView(GenericAPIView):
    serializer_class = None
    permission_classes = ()

    def post(self, request, employee_id, company_id):
        try:
            employee = Employee.objects.get(pk=employee_id, main_company__id=company_id)
        except Employee.DoesNotExist:
            raise ValidationError("Employee does not exist")
        if not employee.user:
            user = User.objects.create(
                first_name=employee.first_name,
                last_name=employee.last_name,
                email=employee.email if employee.email else employee.personal_email,
                username=employee.email if employee.email else employee.personal_email
            )

            user.set_password(request.data['password'])
            user.save()
            employee.user = user
            employee.save()

            return Response({})

        return Response({'non_field_errors': ['Account has been setup already']}, status=status.HTTP_400_BAD_REQUEST)


class LoginView(UserLoginView):
    def get_company(self, user):
        employee = Employee.objects.get(user=user)
        return employee.main_company


class ProfileView(GenericAPIView):
    serializer_class = EmployeeSerializer
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        employee = request.user.employee
        data = self.get_serializer(employee).data
        return Response({'user': data})


class DownloadPayslipView(DownloadEmployeePayslip):
    permission_classes = ()
    pass


class LeaveRequestView(EmployeeLeaveWorkflowView):
    def save_application(self, employee, leave, number_of_days, start_date, proposed_end_date):
        from company.models import LeaveApplication
        now = timezone.now()
        LeaveApplication.objects.create(
            employee=employee,
            leave=leave,
            number_of_days=number_of_days,
            start_date=start_date,
            end_date=proposed_end_date,
            status=LeaveApplication.LEAVE_STATUS_REQUEST
        )
