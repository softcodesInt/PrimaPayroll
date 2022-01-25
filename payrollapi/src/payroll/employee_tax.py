from decimal import Decimal
from django.conf import settings
from payroll.models import TaxRelief
from employees.pension_utils import calculate_pension_for_employee
from company.models import TaxTable
"""
TODO:
1. Use total taxable income instead of rate per year
"""


class EmployeeTax:
    def __init__(self, employee, company_policy, request):
        self.employee = employee
        self.tax_relief = employee.tax_relief
        self.company_policy = company_policy
        self.request = request
        self.annual_salary = self.employee.get_total_taxable_earnings() * 12

    def _get_pension_relief(self):
        if self.employee.pension_applied:
            pension = calculate_pension_for_employee(self.request, self.employee)
            return pension['employee_rate'] * 12
        return 0

    def _calculate_additional_relief(self):
        """
        Loop through the relief to fetch other reliefs aside from pension relief
        """
        reliefs = TaxRelief.objects.filter(relief_group=self.tax_relief, is_active=True)
        total = 0
        for relief in reliefs:
            total += relief.get_relief_value(self.employee)

        return total * 12

    def _get_twenty_percent_relief(self):
        reliefs = self.annual_salary - self._get_pension_relief() - self._calculate_additional_relief()
        return (reliefs * 20) / 100

    def _get_consolidated_relief(self):
        """
        Sum the twenty percent relief, the fixed relief, pension relief and other reliefs
        """
        twenty_percent_relief = self._get_twenty_percent_relief()
        fixed_relief = settings.FIXED_RELIEF
        pension_relief = self._get_pension_relief()
        other_reliefs = self._calculate_additional_relief()
        tax_value = twenty_percent_relief + fixed_relief + pension_relief + other_reliefs
        return self.annual_salary - tax_value

    def _get_annual_tax(self):
        """
        Fetch the tax table for the company and order by income_from

        If it's the last record, Ignore it
        If the remaining total relief is less than income_to and not the last value, use the total_relief against the
        tax_rate
        """
        total_relief = self._get_consolidated_relief()
        print(total_relief)
        # get tax table order by income_from
        # filter by company

        tax_tables = TaxTable.objects.filter(company_policy=self.company_policy).order_by('income_from')
        tax_value = 0
        tax_index_summation = 0
        counter = 0
        tax_tables_length = tax_tables.count()
        for tax_table in tax_tables:
            counter += 1
            if total_relief > (tax_table.income_to - tax_table.income_from):
                # total_relief -= tax_table.income_to
                total_relief -= (tax_table.income_to - tax_table.income_from)
                value = tax_table.income_to - tax_table.income_from
                tax_value += ((value) * tax_table.tax_rate) / 100
                tax_index_summation += value

            elif counter == tax_tables_length:
                tax_value += ((self._get_consolidated_relief() - tax_index_summation) * tax_table.tax_rate) / 100
                break
            else:
                tax_value += (total_relief * tax_table.tax_rate) / 100
                break

        return tax_value

    def calculate_tax(self):
        """
        If rates_per year is less than 30,000
        """
        from employees.models import Employee
        if self.employee.tax_applied == Employee.TAX_APPLIED_FIXED:
            return Decimal(self.employee.fixed_tax)
        try:
            return Decimal(self._get_annual_tax() / 12)
        except:
            return 0
