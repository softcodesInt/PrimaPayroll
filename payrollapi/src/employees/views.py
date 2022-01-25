import io
import zipfile

from django.utils import timezone
from datetime import timedelta
import numpy as np
from rest_framework.exceptions import ValidationError
from rest_framework.filters import SearchFilter
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.generics import GenericAPIView, ListAPIView
from rest_framework.response import Response
from django.conf import settings
from django.template import loader

from accounts.utils import get_parent_company
from employees.paginations import EmployeePagination
from employees.serializers import (
    EmployeeSerializer,
    PayslipSerializers,
    LeaveApplicationSerializer,
    LeaveWorkflowSerializer,
    TerminateReinstateReasonSerializer
)
from employees.models import Employee
from payroll.models import Payslip
from lib.tasks import send_email_task
from utilities.models import ReinstateReason, TerminateReason


class EmployeeInfoView(viewsets.ModelViewSet):
    http_method_names = ["put", "head", "delete", "post", "get", "patch"]
    serializer_class = EmployeeSerializer
    permission_classes = (IsAuthenticated,)
    filter_backends = (DjangoFilterBackend, SearchFilter,)
    search_fields = ('first_name', 'last_name', 'other_name',)
    queryset = Employee.objects.all()
    pagination_class = EmployeePagination

    def get_queryset(self):
        sort_by = self.request.GET.get('sort_by')
        if sort_by:
            value = True
            if sort_by.lower() == "inactive":
                value = False
                return Employee.objects.filter(is_active=value, main_company=get_parent_company(self.request))
        if sort_by == "all":
            return Employee.objects.filter(main_company=get_parent_company(self.request), is_active=True)
        return Employee.objects.filter(main_company=get_parent_company(self.request))

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        extra_keys = {}
        page = self.paginate_queryset(queryset)
        if page is not None and queryset:
            data_queryset = queryset[0]
            extra_keys['hierarchy'] = data_queryset
            extra_keys['active_employees'] = Employee.objects.filter(is_active=True,
                                                                     main_company=get_parent_company(request)).count()
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data, extra_keys=extra_keys)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def get_paginated_response(self, data, extra_keys):
        """
        Return a paginated style `Response` object for the given output data.
        """
        assert self.paginator is not None
        return self.paginator.get_paginated_response(data, extra_keys)

    def retrieve(self, request, *args, **kwargs):
        from company.models import LeaveApplication
        instance = self.get_object()
        data = self.get_serializer(instance).data

        leave_applications = LeaveApplication.objects.filter(employee=instance,
                                                             status=LeaveApplication.LEAVE_STATUS_APPROVED)
        data['leave_applications'] = LeaveApplicationSerializer(leave_applications, many=True).data
        return Response(data)

    def perform_create(self, serializer):
        instance = serializer.save()
        instance.main_company = get_parent_company(self.request)
        instance.save()


class EmployeePayslip(ListAPIView):
    serializer_class = PayslipSerializers
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Payslip.objects.filter(company=get_parent_company(self.request),
                                      employee__id=self.kwargs.get('employee_id'))


class DownloadEmployeePayslip(GenericAPIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, payslip_id):
        payslip = Payslip.objects.get(id=payslip_id)
        context = {
            'company_name': payslip.company.name,
            'user': payslip.employee,
            'company_logo': payslip.company.logo,
            'payslip_date': payslip.date_created,
            'gross_pay': payslip.gross_pay(),
            'total_deductions': payslip.total_deductions(),
            'net_pay': payslip.net_pay(),
            'tax_paid_year_to_date': payslip.tax_paid_year_to_date,
            'taxable_earnings_year_to_date': payslip.taxable_earnings_year_to_date,
            'payslip_data': payslip.data,
            'employer_pension': payslip.employer_pension
        }
        response = HttpResponse(content=payslip.get_pdf(context=context),
                                content_type='application/pdf')
        response['Content-Disposition'] = 'filename=payslip.pdf'
        return response


class EmployeeLeaveWorkflowView(GenericAPIView):
    serializer_class = LeaveWorkflowSerializer
    permission_classes = (IsAuthenticated,)

    def get(self, request, employee_id):
        employee = Employee.objects.get(pk=employee_id)
        return Response({
            'available_leaves': employee.get_available_leaves(),
        })

    def save_application(self, employee, leave, number_of_days, start_date, proposed_end_date):
        from company.models import LeaveApplication
        now = timezone.now()
        LeaveApplication.objects.create(
            employee=employee,
            leave=leave,
            number_of_days=number_of_days,
            start_date=start_date,
            end_date=proposed_end_date
        )

        if start_date <= now < proposed_end_date:
            employee.status = Employee.EMPLOYEE_STATUS_ON_LEAVE
            employee.save()

    def post(self, request, employee_id):
        from company.models import Leave, Holiday
        serializer = self.serializer_class(data=request.data)
        try:
            employee = Employee.objects.get(pk=employee_id)
        except Employee.DoesNotExist:
            raise ValidationError("Employee does not exist")

        serializer.is_valid(raise_exception=True)
        number_of_days = serializer.validated_data['number_of_days']
        start_date = serializer.validated_data['start_date']

        try:
            leave = Leave.objects.get(pk=serializer.validated_data['leave'])
        except Leave.DoesNotExist:
            raise ValidationError("Selected Leave does not exist")

        available_days = leave.get_available_days(employee)
        if available_days < number_of_days:
            raise ValidationError(f"Number of days applied for {leave.name} cannot be more than {available_days}")

        proposed_end_date_without_holidays = start_date + timedelta(days=number_of_days)
        holidays = Holiday.objects.filter(company_policy=employee.company_policy, is_active=True)

        user_working_days = employee.get_working_days()

        total_number_of_holidays = 0
        holiday_dates = []
        now = timezone.now().date()
        for holiday in holidays:
            # update recurring year to current year
            if holiday.recurring:
                if holiday.date_from.year == now.year:
                    pass
                else:
                    holiday.date_from = holiday.date_from.replace(year=now.year)
                    if holiday.date_to:
                        holiday.date_to = holiday.date_to.replace(year=now.year)
            if not holiday.date_to:
                if start_date < holiday.date_from < proposed_end_date_without_holidays:
                    total_number_of_holidays += 1
                    holiday_dates.append(holiday.date_from)
            else:
                if start_date < holiday.date_from < proposed_end_date_without_holidays:
                    days_between = (proposed_end_date_without_holidays - holiday.date_to).days
                    if days_between == 0:
                        # it means the entire holiday falls between the leave days
                        total_number_of_holidays += (holiday.date_to - holiday.date_from).days
                    elif days_between < 1:
                        # it means there are more holidays after the leave proposed end date
                        total_number_of_holidays += (holiday.date_to - holiday.date_from).days
                    else:
                        # it means there are fewer holidays in between before the leave proposed date
                        total_number_of_holidays += (holiday.date_to - holiday.date_from).days

        total_number_of_days = total_number_of_holidays + number_of_days
        proposed_end_date = proposed_end_date_without_holidays + timedelta(days=total_number_of_holidays)

        number_of_work_days = np.busday_count(start_date, proposed_end_date, weekmask=user_working_days)
        number_of_work_days += 1    # np counts from 0

        number_of_days_user_not_working = int(total_number_of_days - number_of_work_days)     # this will cast to numpy.int64
        proposed_end_date = proposed_end_date + timedelta(days=number_of_days_user_not_working)

        self.save_application(employee, leave, number_of_days, start_date, proposed_end_date)

        return Response({})


class TerminateEmployeeView(GenericAPIView):
    serializer_class = TerminateReinstateReasonSerializer
    permission_classes = (IsAuthenticated,)

    def post(self, request, employee_id):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        try:
            employee = Employee.objects.get(pk=employee_id)
        except Employee.DoesNotExist:
            raise ValidationError("Employee does not exist")

        if employee.status == Employee.EMPLOYEE_STATUS_TERMINATED:
            employee.status = Employee.EMPLOYEE_STATUS_REINSTATED
            employee.reinstate_reason = ReinstateReason.objects.get(id=data.get('reason'))
            employee.reinstated_date = data.get('date')
        else:
            employee.status = Employee.EMPLOYEE_STATUS_TERMINATED
            employee.terminated_date = data.get('date')
            employee.terminate_reason = TerminateReason.objects.get(id=data.get('reason'))
        employee.save()
        return Response({})


class SendEssInviteEmailView(GenericAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = None

    def get(self, request, employee_id):
        try:
            employee = Employee.objects.get(pk=employee_id)
        except Employee.DoesNotExist:
            raise ValidationError("Employee does not exist")

        company = get_parent_company(request)
        html_string = loader.render_to_string('emails/ess_create_account.html', {
                    'user': employee.get_full_name(),
                    'company': company.name,
                    'setup_link': '{}set-password/{}?company={}'.format(settings.FRONTEND_URL, employee.id, company.id)
                })
        send_email_task(employee.email if employee.email else employee.personal_email,
                        f'Welcome to {company.name}!', html_string)

        return Response({})
# class DownloadAllEmployeePayslipView(GenericAPIView):
#     authentication_class = (JSONWebTokenAuthentication,)
#     permission_classes = (IsAuthenticated,)
#
#     def zipFiles(self, files):
#         outfile = io.BytesIO()
#         with zipfile.ZipFile(outfile, 'w') as zf:
#             for n, f in enumerate(files):
#                 zf.writestr(f['name'].replace('/', '-'), f['data'])
#         return outfile.getvalue()
#
#     def get(self, request):
#         from django.http import HttpResponse
#         duration = request.GET.get('date').split('-')
#         payslips = Payslip.objects.filter(pay_period__period_month__year=duration[0],
#                                           pay_period__period_month__month=duration[1])
#         payslip_pdfs = []
#         for payslip in payslips:
#             context = {
#                 'company_name': payslip.company.name,
#                 'user': payslip.user,
#                 'payslip_date': payslip.date_created,
#                 'gross_pay': payslip.gross_pay(),
#                 'total_deductions': payslip.total_deductions(),
#                 'net_pay': payslip.net_pay(),
#                 'tax_paid_year_to_date': payslip.tax_paid_year_to_date,
#                 'taxable_earnings_year_to_date': payslip.taxable_earnings_year_to_date,
#                 'payslip_data': payslip.data,
#                 'employer_pension': payslip.employer_pension
#             }
#             payslip_pdfs.append({
#                 'name': f'{payslip.user.first_name}-{payslip.user.employee_code}.pdf',
#                 'data': payslip.get_pdf(context=context)
#             })
#
#         zipped_files = self.zipFiles(payslip_pdfs)
#         response = HttpResponse(zipped_files, content_type='application/octet-stream')
#         response['Content-Disposition'] = 'attachment; filename=employee-payslips.zip'
#         return response
