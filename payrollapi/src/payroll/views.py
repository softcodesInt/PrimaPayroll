import decimal
import io
import zipfile
from rest_framework.filters import SearchFilter
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.template.loader import render_to_string
from django.utils import timezone
from django.db.models import Q
from rest_framework import viewsets
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from openpyxl.writer.excel import save_virtual_workbook
from weasyprint import HTML
from rest_framework.exceptions import ValidationError
from rest_framework import status

from auditlog.models import BaseLog
from accounts.utils import get_logged_in_user_company_policy, get_parent_company
from employees.models import Employee
from employees.serializers import EmployeeSerializer
from payroll.serializers import (
    PayrollCategorySerializer,
    PayrollElementSerializer,
    RemunerationSerializer,
    PensionSettingSerializer,
    PayPeriodSerializer,
    TaxReliefGroupSerializer,
    TaxReliefSerializer,
    TransactionSerializer,
    EmployeeDrivenPayrollSerializer,
    LoanSerializer
)
from payroll.models import (
    PayrollElements,
    PayrollCategory,
    Remuneration,
    PensionSettings,
    PayPeriod,
    TaxReliefGroup,
    TaxRelief,
    Transactions,
    EmployeeTaxRelief,
    EmployeeDrivenPayroll,
    Loan
)
from payroll.utils import generate_bank_letter, generate_payroll_report
from payroll.payslips import generate_payslips_data
from payroll.service import PayrollService


class PayrollCategoryView(viewsets.ModelViewSet):
    """
    CRUD API for the Payroll Category

    To deactivate, call the endpoint with DELETE method
    """
    http_method_names = ["put", "head", "delete", "post", "get", "patch"]
    serializer_class = PayrollCategorySerializer
    permission_classes = (IsAuthenticated,)
    filter_backends = (DjangoFilterBackend, SearchFilter,)
    search_fields = ('name',)
    queryset = PayrollCategory.objects.all()

    def get_queryset(self):
        # filter by license code
        sort_by = self.request.GET.get('sort_by')
        value = True
        if sort_by:
            if sort_by.lower() == "inactive":
                value = False
            return PayrollCategory.objects.filter(is_active=value,
                                                  company_policy__in=get_logged_in_user_company_policy(self.request))
        return PayrollCategory.objects.filter(company_policy__in=get_logged_in_user_company_policy(self.request))

    def perform_create(self, serializer, *args, **kwargs):
        instance = serializer.save()
        user = self.request.user.adminuser
        instance.created_by = user
        instance.save()
        data = serializer.validated_data
        data['company_policy'] = str(data['company_policy'])
        PayrollService.log_category(BaseLog.PRIMERLOG_CREATE, user, data, instance)

    def perform_update(self, serializer):
        instance = serializer.save()
        user = self.request.user.adminuser
        data = serializer.validated_data
        data['company_policy'] = str(data['company_policy'])
        PayrollService.log_category(BaseLog.PRIMERLOG_UPDATE, user, data, instance)

    def perform_destroy(self, instance):
        if not instance.is_deletable():
            raise ValidationError(f'{instance.name} cannot be deactivated now as it is being used across board')
        instance.is_active = False
        instance.save()
        user = self.request.user.adminuser
        PayrollService.log_category(BaseLog.PRIMERLOG_UPDATE, user, {}, instance)


class PayrollElementView(viewsets.ModelViewSet):
    """
    CRUD API for the Payroll Element

    To deactivate, call the endpoint with DELETE method
    """
    http_method_names = ["put", "head", "delete", "post", "get", "patch"]
    serializer_class = PayrollElementSerializer
    permission_classes = (IsAuthenticated,)
    filter_backends = (DjangoFilterBackend, SearchFilter,)
    search_fields = ('name',)
    queryset = PayrollElements.objects.all()

    def get_queryset(self):
        element_type = self.request.GET.get('element_type')
        sort_by = self.request.GET.get('sort_by')
        value = True
        if sort_by:
            if sort_by.lower() == "inactive":
                value = False
            if element_type:
                return PayrollElements.objects.filter(element_type=element_type,
                                                      is_active=value,
                                                      category__company_policy__in=get_logged_in_user_company_policy(
                                                          self.request))
            else:
                return PayrollElements.objects.filter(is_active=value,
                                                      category__company_policy__in=get_logged_in_user_company_policy(
                                                          self.request))
        if element_type:
            return PayrollElements.objects.filter(element_type=element_type,
                                                  category__company_policy__in=get_logged_in_user_company_policy(
                                                      self.request))

        return PayrollElements.objects.filter(
            category__company_policy__in=get_logged_in_user_company_policy(self.request))

    def perform_create(self, serializer, *args, **kwargs):
        instance = serializer.save()
        user = self.request.user.adminuser
        instance.created_by = user
        instance.save()

        data = serializer.validated_data
        category = data.get('category')
        calculation_type_value = data.get('calculation_type_value')
        if category:
            data['category'] = str(category)
        if calculation_type_value is not None:
            data['calculation_type_value'] = str(calculation_type_value)

        PayrollService.log_payroll(BaseLog.PRIMERLOG_CREATE, user, data, instance)

    def perform_update(self, serializer):
        instance = serializer.save()
        user = self.request.user.adminuser
        data = serializer.validated_data
        category = data.get('category')
        calculation_type_value = data.get('calculation_type_value')
        if category:
            data['category'] = str(category)
        if calculation_type_value is not None:
            data['calculation_type_value'] = str(calculation_type_value)

        PayrollService.log_payroll(BaseLog.PRIMERLOG_UPDATE, user, data, instance)

    def perform_destroy(self, instance):
        if not instance.is_deletable():
            raise ValidationError(f'{instance.name} cannot be deactivated now as it is being used across board')
        instance.is_active = False
        instance.save()
        user = self.request.user.adminuser
        PayrollService.log_payroll(BaseLog.PRIMERLOG_DELETE, user, {}, instance)


class RemunerationView(viewsets.ModelViewSet):
    """
    CRUD API for the Remuneration

    To deactivate, call the endpoint with DELETE method
    """
    http_method_names = ["put", "head", "delete", "post", "get", "patch"]
    serializer_class = RemunerationSerializer
    permission_classes = (IsAuthenticated,)
    filter_backends = (DjangoFilterBackend, SearchFilter,)
    search_fields = ('name',)
    queryset = Remuneration.objects.all()

    def get_queryset(self):
        sort_by = self.request.GET.get('sort_by')
        value = True
        if sort_by:
            if sort_by.lower() == "inactive":
                value = False
            return Remuneration.objects.filter(is_active=value,
                                               company_policy__in=get_logged_in_user_company_policy(self.request))
        return Remuneration.objects.filter(company_policy__in=get_logged_in_user_company_policy(self.request))

    def perform_create(self, serializer, *args, **kwargs):
        instance = serializer.save()
        user = self.request.user.adminuser
        instance.created_by = user
        instance.save()

    def perform_update(self, serializer):
        instance = serializer.save()

    def perform_destroy(self, instance):
        if not instance.is_deletable():
            raise ValidationError(f'{instance.name} cannot be deactivated now as it is being used across board')
        instance.is_active = False
        instance.save()


class PensionSettingView(GenericAPIView):
    serializer_class = PensionSettingSerializer
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        try:
            pension_setting = PensionSettings.objects.get(id=data.get('id'))
            pension_setting.employee_rate = data.get('employee_rate')
            pension_setting.employer_rate = data.get('employer_rate')
            pension_setting.save()
        except PensionSettings.DoesNotExist:
            pension_setting = PensionSettings.objects.create(
                employee_rate=data.get('employee_rate'),
                employer_rate=data.get('employer_rate')
            )
        pension_setting.company = get_parent_company(self.request)
        pension_setting.save()
        pension_setting.payroll_lines.clear()   # delete the pension settings first
        for payroll_lines in data['payroll_lines']:
            pension_setting.payroll_lines.add(payroll_lines)
        return Response({
            'id': str(pension_setting.id),
            'employee_rate': pension_setting.employee_rate,
            'employer_rate': pension_setting.employer_rate
        })

    def get(self, request):
        try:
            pension_setting = PensionSettings.objects.filter(company=get_parent_company(request)).latest('id')
        except PensionSettings.DoesNotExist:
            return Response({})
        return Response({
            'id': str(pension_setting.id),
            'employee_rate': pension_setting.employee_rate,
            'employer_rate': pension_setting.employer_rate,
            'payroll_lines': PayrollElementSerializer(pension_setting.payroll_lines, many=True).data
        })


class BankLetterView(GenericAPIView):
    permission_classes = (IsAuthenticated,)

    def zipFiles(self, files):
        outfile = io.BytesIO()
        with zipfile.ZipFile(outfile, 'w') as zf:
            for n, f in enumerate(files):
                zf.writestr(f['name'], f['data'])
        return outfile.getvalue()

    def generate_bank_letter_pdf(self):
        company = get_parent_company(self.request)
        employees = Employee.objects.filter(main_company=company)
        context = {
            'employees': [],
            'total_net_pay': 0,
            'company_logo': company.logo.url if company.logo else None,
            'company_name': company.name,
            'company_address': company.address
        }
        total_net_pay = 0
        for employee in employees:
            if not employee.is_employee_entitled_to_salary:
                continue
            data = EmployeeSerializer(instance=employee, context={'request': self.request}).data
            net_pay = data['total_earnings'] - data['total_deductions']
            context['employees'].append({
                'employee_code': employee.employee_code,
                'account_name': employee.account_name,
                'bank_name': employee.bank.name,
                'account_number': employee.account_number,
                'net_pay': net_pay
            })
            total_net_pay += net_pay

        context['total_net_pay'] = total_net_pay
        html_string = render_to_string("bank-letter.html", context)
        return HTML(string=html_string, encoding='utf-8').write_pdf()

    def get(self, request):
        from django.http import HttpResponse
        company = get_parent_company(request)
        files_to_zip = [
            {
                'name': 'bank-letter.xlsx',
                'data': save_virtual_workbook(generate_bank_letter(request, company))
            },
            {
                'name': 'payroll-report.xlsx',
                'data': save_virtual_workbook(generate_payroll_report(request, company))
            },
            {
                'name': 'bank-letter.pdf',
                'data': self.generate_bank_letter_pdf()
            }
        ]
        zipped_files = self.zipFiles(files_to_zip)
        response = HttpResponse(zipped_files, content_type='application/octet-stream')
        response['Content-Disposition'] = 'attachment; filename=transaction-report.zip'
        return response


class PayPeriodView(GenericAPIView):
    serializer_class = PayPeriodSerializer
    permission_classes = (IsAuthenticated,)

    def get(self, request, policy_id):
        pay_periods = PayPeriod.objects.filter(company_policy__id=policy_id)
        return Response(PayPeriodSerializer(pay_periods, many=True).data)

    def post(self, request, policy_id):
        # the policy_id is from the url params, it's actually pay period id
        pay_period = PayPeriod.objects.get(id=policy_id)
        now = timezone.now()

        if pay_period.period_month.year == now.year and pay_period.period_month.month > now.month:
            return Response(
                {'non_field_errors': ['You cannot create this pay period because it is still in the future']},
                status=status.HTTP_400_BAD_REQUEST)
        pay_period.status = PayPeriod.PAY_PERIOD_STATUS_PAID
        pay_period.save()

        # update next month to be live
        next_month = PayPeriod.objects.filter(company_policy=pay_period.company_policy,
                                              status=PayPeriod.PAY_PERIOD_STATUS_FUTURE).first()
        next_month.status = PayPeriod.PAY_PERIOD_STATUS_LIVE
        next_month.save()

        # generate the payment slips for all users. Make this async
        generate_payslips_data(request, get_parent_company(request), pay_period)
        return Response({})


class TaxReliefGroupView(viewsets.ModelViewSet):
    http_method_names = ["put", "head", "delete", "post", "get", "patch"]
    serializer_class = TaxReliefGroupSerializer
    permission_classes = (IsAuthenticated,)
    filter_backends = (DjangoFilterBackend, SearchFilter,)
    search_fields = ('name',)
    queryset = TaxReliefGroup.objects.all()

    def get_queryset(self):
        sort_by = self.request.GET.get('sort_by')
        value = True
        if sort_by:
            if sort_by.lower() == "inactive":
                value = False
            return TaxReliefGroup.objects.filter(is_active=value,
                                                 company_policy__in=get_logged_in_user_company_policy(self.request))
        return TaxReliefGroup.objects.filter(company_policy__in=get_logged_in_user_company_policy(self.request))

    def perform_create(self, serializer, *args, **kwargs):
        instance = serializer.save()

    def perform_destroy(self, instance):
        if not instance.is_deletable():
            raise ValidationError(f'{instance.name} cannot be deactivated now as it is being used across board')
        instance.is_active = False
        instance.save()


class TaxReliefView(viewsets.ModelViewSet):
    http_method_names = ["put", "head", "delete", "post", "get", "patch"]
    serializer_class = TaxReliefSerializer
    permission_classes = (IsAuthenticated,)
    filter_backends = (DjangoFilterBackend, SearchFilter,)
    search_fields = ('name',)
    queryset = TaxRelief.objects.all()

    def get_queryset(self):
        sort_by = self.request.GET.get('sort_by')
        value = True
        if sort_by:
            if sort_by.lower() == "inactive":
                value = False
            return TaxRelief.objects.filter(
                is_active=value,
                relief_group__company_policy__in=get_logged_in_user_company_policy(self.request))
        return TaxRelief.objects.filter(
            relief_group__company_policy__in=get_logged_in_user_company_policy(self.request))

    def perform_create(self, serializer, *args, **kwargs):
        instance = serializer.save()

    def perform_destroy(self, instance):
        if not instance.is_deletable():
            raise ValidationError(f'{instance.name} cannot be deactivated now as it is being used across board')
        instance.is_active = False
        instance.save()


class TransactionView(GenericAPIView):
    serializer_class = TransactionSerializer
    permission_classes = (IsAuthenticated,)

    def get(self, request, employee_id):
        employee = Employee.objects.get(pk=employee_id)
        queryset = Transactions.objects.filter(company=get_parent_company(request),
                                               is_active=True,
                                               employee__id=self.kwargs.get('employee_id')).first()
        if employee.remuneration:
            payroll_choices = employee.remuneration.payroll_elements.filter(
                calculation_type=PayrollElements.CALCULATION_TYPE_NONE).exclude(
                element_type=PayrollElements.PAYROLL_ELEMENT_COMPANY_CONTRIBUTION)
            data = PayrollElementSerializer(payroll_choices, many=True).data
        else:
            data = []
        return Response({
            'transactions': self.serializer_class(queryset).data,
            'payroll_choices': data
        })

    def post(self, request, employee_id, transaction_id=None):
        data = {
            **request.data,
            "company": get_parent_company(request).id,
            "employee": employee_id
        }
        serializer = self.serializer_class(data=data)
        serializer.is_valid(raise_exception=True)
        if transaction_id:
            transaction = Transactions.objects.get(id=transaction_id)
            transaction.earnings = serializer.validated_data['earnings']
            transaction.deductions = serializer.validated_data['deductions']
            transaction.save()
            return Response({})

        serializer.save()
        return Response({})


class EmployeeDrivenTaxReliefView(GenericAPIView):
    serializer_class = None
    permission_classes = (IsAuthenticated,)

    def get(self, request, employee_id):
        employee = Employee.objects.get(pk=employee_id)
        employee_tax = EmployeeTaxRelief.objects.filter(employee=employee)
        response_data = {
            'is_empty': False
        }
        if employee_tax.exists():
            response = []
            for tax in employee_tax:
                response.append({
                    'id': tax.pk,
                    'tax_relief': {
                        'id': tax.tax_relief.pk,
                        'name': tax.tax_relief.name
                    },
                    'value': tax.value
                })
        else:
            response_data['is_empty'] = True
            response = []
            tax_relief = TaxRelief.objects.filter(relief_group=employee.tax_relief,
                                                  is_active=True,
                                                  calculation_type=TaxRelief.CALCULATION_TYPE_NONE)
            for tax in tax_relief:
                response.append({
                    'tax_relief': {
                        'id': tax.pk,
                        'name': tax.name
                    },
                    'value': 0
                })

        response_data['tax_relief'] = response
        return Response(response_data)

    def post(self, request, employee_id):
        employee = Employee.objects.get(pk=employee_id)
        employee_tax = EmployeeTaxRelief.objects.filter(employee=employee)

        data = request.data

        if employee_tax.exists():
            for t in data.get('relief'):
                etf = EmployeeTaxRelief.objects.get(employee=employee,
                                                    tax_relief=TaxRelief.objects.get(pk=t['id']))
                etf.value = t['amount']
                etf.save()
        else:
            for t in data.get('relief'):
                EmployeeTaxRelief.objects.create(
                    tax_relief=TaxRelief.objects.get(pk=t['id']),
                    employee=employee,
                    value=t['amount']
                )

        return Response({})


class TransactionAllowedView(GenericAPIView):
    serializer_class = None
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        company = get_parent_company(request)
        employees = Employee.objects.filter(main_company=company)
        allowed_status = True
        if employees.filter(Q(remuneration__isnull=True) |Q(rates_per_year__isnull=True)).exists():
            allowed_status = False

        return Response({'status': allowed_status})


class EmployeeDrivenPayrollView(GenericAPIView):
    serializer_class = EmployeeDrivenPayrollSerializer
    permission_classes = (IsAuthenticated,)

    def get(self, request, employee_id):
        try:
            employee = Employee.objects.get(pk=employee_id)
        except Employee.DoesNotExist:
            return Response({'non_field_errors': ['User Does Not Exist']})

        ep = EmployeeDrivenPayroll.objects.filter(employee=employee)
        return Response({'data': EmployeeDrivenPayrollSerializer(ep, many=True).data})

    def post(self, request, employee_id):
        try:
            employee = Employee.objects.get(pk=employee_id)
        except Employee.DoesNotExist:
            return Response({'non_field_errors': ['User Does Not Exist']})

        ep = EmployeeDrivenPayroll.objects.filter(employee=employee)

        data = request.data

        if ep.exists():
            for t in data.get('payrollLines'):
                try:
                    edp = EmployeeDrivenPayroll.objects.get(employee=employee,
                                                            payroll=PayrollElements.objects.get(pk=t['id']))
                    edp.value = t['calculation_type_value']
                    edp.save()
                except EmployeeDrivenPayroll.DoesNotExist:
                    EmployeeDrivenPayroll.objects.create(
                        payroll=PayrollElements.objects.get(pk=t['id']),
                        employee=employee,
                        value=t['calculation_type_value']
                    )

        else:
            for t in data.get('payrollLines'):
                EmployeeDrivenPayroll.objects.create(
                    payroll=PayrollElements.objects.get(pk=t['id']),
                    employee=employee,
                    value=t['calculation_type_value']
                )
        return Response({})


class LoanView(viewsets.ModelViewSet):
    http_method_names = ["put", "head", "delete", "post", "get", "patch"]
    serializer_class = LoanSerializer
    permission_classes = (IsAuthenticated,)
    filter_backends = (DjangoFilterBackend, SearchFilter,)
    search_fields = ('name',)
    queryset = Loan.objects.all()

    def get_queryset(self):
        sort_by = self.request.GET.get('sort_by')
        value = True
        if sort_by:
            if sort_by.lower() == "inactive":
                value = False
            return Loan.objects.filter(is_active=value, company=get_parent_company(self.request))
        return Loan.objects.filter(company=get_parent_company(self.request))

    def perform_create(self, serializer, *args, **kwargs):
        serializer.validated_data['employee'] = Employee.objects.get(pk=self.request.data.get('employee'))
        instance = serializer.save()
        instance.company = get_parent_company(self.request)
        instance.save()

    def perform_update(self, serializer):
        serializer.validated_data['employee'] = Employee.objects.get(pk=self.request.data.get('employee'))
        instance = serializer.save()

    def perform_destroy(self, instance):
        if not instance.is_deletable():
            raise ValidationError(f'Loan cannot be deactivated now as it is being used across board')
        instance.is_active = False
        instance.save()
