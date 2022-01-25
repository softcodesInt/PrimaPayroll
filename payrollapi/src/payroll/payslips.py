from django.db.models import Sum
from django.template import loader

from employees.models import Employee
from employees.serializers import EmployeeSerializer
from employees.pension_utils import calculate_pension_for_employee
from payroll.models import Payslip, Transactions
from payroll.employee_tax import EmployeeTax
from lib.tasks import send_email_task


def generate_payslips_data(request, company, pay_period):
    employees = Employee.objects.filter(main_company=company)

    for employee in employees:
        if not employee.remuneration:
            continue
        if not employee.is_employee_entitled_to_salary:
            continue
        payroll_data = EmployeeSerializer(instance=employee, context={'request': request}).data
        payroll_data = payroll_data['payroll_data']

        payslip = Payslip.objects.filter(employee=employee).order_by('date_created').last()
        if payslip:
            totals = Payslip.objects.filter(employee=employee).aggregate(Sum('tax_paid_year_to_date'),
                                                                 Sum('taxable_earnings_year_to_date'))
            current_payslip = Payslip.objects.create(company=company,
                                                     employee=employee,
                                                     data=payroll_data,
                                                     pay_period=pay_period)
            if employee.tax_applied:
                tax = EmployeeTax(employee, employee.company_policy, request)
                if totals['tax_paid_year_to_date__sum']:
                    current_payslip.tax_paid_year_to_date = totals['tax_paid_year_to_date__sum'] + tax.calculate_tax()
                    current_payslip.taxable_earnings_year_to_date = totals[
                                                                        'taxable_earnings_year_to_date__sum'] + employee.get_total_taxable_earnings()
                else:
                    current_payslip.tax_paid_year_to_date = employee.calculate_tax()
                    current_payslip.taxable_earnings_year_to_date = employee.get_total_taxable_earnings()
            current_payslip.save()
        else:
            tax = EmployeeTax(employee, employee.company_policy, request)
            current_payslip = Payslip.objects.create(company=company,
                                                     employee=employee,
                                                     data=payroll_data,
                                                     tax_paid_year_to_date=tax.calculate_tax(),
                                                     taxable_earnings_year_to_date=employee.get_total_taxable_earnings(),
                                                     pay_period=pay_period)

        if employee.pension_applied:
            current_payslip.employer_pension = calculate_pension_for_employee(request, employee)['employer_rate']
            current_payslip.save()
        t = Transactions.objects.filter(employee=employee, is_active=True).first()
        if t:
            t.is_active = False
            t.save()

        email_context = {
            'company_name': current_payslip.company.name,
            'user': current_payslip.employee,
            'company_logo': current_payslip.company.logo if current_payslip.company.logo else None,
            'payslip_date': current_payslip.date_created,
            'gross_pay': current_payslip.gross_pay(),
            'total_deductions': current_payslip.total_deductions(),
            'net_pay': current_payslip.net_pay(),
            'tax_paid_year_to_date': current_payslip.tax_paid_year_to_date,
            'taxable_earnings_year_to_date': current_payslip.taxable_earnings_year_to_date,
            'payslip_data': current_payslip.data,
            'employer_pension': current_payslip.employer_pension
        }

        payslip_pdf = current_payslip.get_pdf(context=email_context)
        html_string = loader.render_to_string('emails/payslip.html', {
            'user': employee.get_full_name(),
        })
        email_to_use = None
        if employee.email:
            email_to_use = employee.email
        elif employee.personal_email:
            email_to_use = employee.personal_email

        if email_to_use:
            send_email_task(email_to_use, f"{company.name}-Payslip", html_string, payslip_pdf)
