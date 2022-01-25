import uuid, decimal
from dateutil.relativedelta import relativedelta
from django.db import models
from django.utils import timezone
from django.template.loader import render_to_string
from django.contrib.postgres.fields import ArrayField, JSONField
from django.db.models import Sum

from accounts.models import AdminUser
from company.models import Company, CompanyPolicy
from lib.utils import TimeStampedModel


class PayrollCategory(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  # pylint: disable=invalid-name
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)

    company_policy = models.ForeignKey(CompanyPolicy, null=True, on_delete=models.PROTECT)
    created_by = models.ForeignKey(AdminUser, on_delete=models.DO_NOTHING, null=True)

    class Meta:
        ordering = ['-date_created']

    def log_class(self):
        from auditlog.models import PayrollCategoryLog
        return PayrollCategoryLog


class PayrollElements(TimeStampedModel):
    CALCULATION_TYPE_PERCENTAGE = 'PERCENTAGE'
    CALCULATION_TYPE_FIXED = 'FIXED'
    CALCULATION_TYPE_CUSTOM = 'CUSTOM'
    CALCULATION_TYPE_NONE = 'NONE'
    CALCULATION_TYPE_EMPLOYEE_DRIVEN = 'EMPLOYEE_DRIVEN'

    CALCULATION_TYPE = (
        (CALCULATION_TYPE_PERCENTAGE, 'Percentage'),
        (CALCULATION_TYPE_FIXED, 'Fixed'),
        (CALCULATION_TYPE_CUSTOM, 'Custom'),
        (CALCULATION_TYPE_NONE, 'None'),
        (CALCULATION_TYPE_EMPLOYEE_DRIVEN, 'Employee Driven')
    )

    EARNING_TYPE_PENSIONABLE = 'PENSIONABLE'
    EARNING_TYPE_TAXABLE = 'TAXABLE'
    EARNING_TYPE_NON_TAXABLE = 'NON_TAXABLE'

    EARNING_TYPE = (
        (EARNING_TYPE_PENSIONABLE, 'Pensionable'),
        (EARNING_TYPE_TAXABLE, 'Taxable'),
        (EARNING_TYPE_NON_TAXABLE, 'Non Taxable'),
    )

    PAY_ON_BIRTHDAY = 'BIRTHDAY'
    PAY_ALWAYS = 'ALWAYS'
    PAY_ON_DATE_ENGAGED = 'DATE_ENGAGED'
    PAY_ON_CUSTOM_MONTH = 'CUSTOM'

    WHEN_TO_PAY = (
        (PAY_ON_BIRTHDAY, 'Birthday'),
        (PAY_ALWAYS, 'Always'),
        (PAY_ON_DATE_ENGAGED, 'Date Engaged'),
        (PAY_ON_CUSTOM_MONTH, 'Custom Month'),
    )

    PAYROLL_ELEMENT_EARNINGS = 'EARNINGS'
    PAYROLL_ELEMENT_DEDUCTIONS = 'DEDUCTIONS'
    PAYROLL_ELEMENT_COMPANY_CONTRIBUTION = 'COMPANY_CONTRIBUTION'
    PAYROLL_ELEMENT_FRINGE_BENEFIT = 'FRINGE_BENEFIT'
    PAYROLL_ELEMENT_PROVISIONS = 'PROVISIONS'
    PAYROLL_ELEMENT_ADDITIONS = 'ADDITIONS'

    PAYROLL_ELEMENT_CHOICE = (
        (PAYROLL_ELEMENT_EARNINGS, 'Earnings'),
        (PAYROLL_ELEMENT_DEDUCTIONS, 'Deductions'),
        (PAYROLL_ELEMENT_COMPANY_CONTRIBUTION, 'Company Contribution'),
        (PAYROLL_ELEMENT_FRINGE_BENEFIT, 'Fringe Benefit'),
        (PAYROLL_ELEMENT_PROVISIONS, 'Provisions'),
        (PAYROLL_ELEMENT_ADDITIONS, 'Additions')
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  # pylint: disable=invalid-name
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)

    mandatory = models.BooleanField(default=False, blank=True, null=True)
    prorata = models.BooleanField(default=False, blank=True, null=True)
    prorata_value = models.CharField(max_length=255, null=True, blank=True)
    calculation_type = models.CharField(max_length=30, choices=CALCULATION_TYPE, default=CALCULATION_TYPE_NONE, blank=True, null=True)
    calculation_type_value = models.DecimalField(decimal_places=2, max_digits=10, blank=True, null=True)
    custom_query = models.TextField(blank=True)
    earning_type = models.CharField(max_length=30, choices=EARNING_TYPE, blank=True, null=True)
    when_to_pay = models.CharField(max_length=30, choices=WHEN_TO_PAY, blank=True, null=True)
    when_to_pay_months = ArrayField(models.CharField(max_length=30, blank=True), null=True, blank=True)
    category = models.ForeignKey(PayrollCategory, on_delete=models.PROTECT, blank=True, null=True)
    element_type = models.CharField(max_length=30, choices=PAYROLL_ELEMENT_CHOICE, blank=True, null=True)
    created_by = models.ForeignKey(AdminUser, on_delete=models.DO_NOTHING, null=True)

    class Meta:
        ordering = ['-date_created']

    def get_payroll_value(self, employee, prorata_days=None):
        """Return payroll value for a month"""
        if self.calculation_type == self.CALCULATION_TYPE_FIXED:
            return self.calculation_type_value

        if (self.calculation_type == self.CALCULATION_TYPE_PERCENTAGE) and not prorata_days:
            return (employee.rates_per_month * self.calculation_type_value) / 100

        if (self.calculation_type == self.CALCULATION_TYPE_PERCENTAGE) and prorata_days and self.prorata:
            return (employee.rates_per_day * prorata_days * self.calculation_type_value) / 100

        if self.calculation_type == self.CALCULATION_TYPE_EMPLOYEE_DRIVEN:
            ep = EmployeeDrivenPayroll.objects.filter(employee=employee, payroll=self)
            if ep.exists():
                return ep.first().value

        if self.calculation_type == self.CALCULATION_TYPE_NONE:
            t = Transactions.objects.filter(employee=employee, is_active=True)
            if t.exists():
                if self.element_type == self.PAYROLL_ELEMENT_DEDUCTIONS:
                    for deduction in t.first().deductions:
                        if deduction['name'] == self.name:
                            return decimal.Decimal(deduction['amount'])
                else:
                    for earning in t.first().earnings:
                        if earning['name'] == self.name:
                            return decimal.Decimal(earning['amount'])
        # do custom later

    def log_class(self):
        from auditlog.models import PayrollElementLog
        return PayrollElementLog


class EmployeeDrivenPayroll(TimeStampedModel):
    employee = models.ForeignKey('employees.Employee', on_delete=models.PROTECT)
    payroll = models.ForeignKey(PayrollElements, on_delete=models.PROTECT)
    value = models.DecimalField(decimal_places=2, max_digits=12)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-date_created']

    def log_class(self):
        pass


class Remuneration(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  # pylint: disable=invalid-name
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)

    company_policy = models.ForeignKey(CompanyPolicy, on_delete=models.PROTECT)
    created_by = models.ForeignKey(AdminUser, on_delete=models.DO_NOTHING, null=True, related_name='remuneration_created_by')
    payroll_groups = models.ManyToManyField(PayrollCategory)

    class Meta:
        ordering = ['-date_created']

    def log_class(self):
        pass

    @property
    def payroll_elements(self):
        return PayrollElements.objects.filter(category__in=self.payroll_groups.filter(is_active=True))


class PensionSettings(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  # pylint: disable=invalid-name
    employee_rate = models.DecimalField(max_digits=5, decimal_places=2, default=8)
    employer_rate = models.DecimalField(max_digits=5, decimal_places=2, default=10)
    company = models.ForeignKey(Company, on_delete=models.PROTECT, null=True, blank=True)
    payroll_lines = models.ManyToManyField(PayrollElements)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-date_created']

    def log_class(self):
        pass


class PayPeriod(TimeStampedModel):
    PAY_PERIOD_STATUS_PAID = "Paid"
    PAY_PERIOD_STATUS_LIVE = "Live"
    PAY_PERIOD_STATUS_FUTURE = "Future"

    PAY_PERIOD_STATUS = (
        (PAY_PERIOD_STATUS_PAID, "Paid"),
        (PAY_PERIOD_STATUS_LIVE, "Live"),
        (PAY_PERIOD_STATUS_FUTURE, "Future")
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  # pylint: disable=invalid-name
    period_month = models.DateField()
    number_of_days = models.IntegerField()
    status = models.CharField(max_length=10, choices=PAY_PERIOD_STATUS, default=PAY_PERIOD_STATUS_FUTURE)
    company_policy = models.ForeignKey(CompanyPolicy, on_delete=models.PROTECT)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['date_created']

    def log_class(self):
        pass


class TaxReliefGroup(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  # pylint: disable=invalid-name
    company_policy = models.ForeignKey(CompanyPolicy, on_delete=models.PROTECT, null=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-date_created']

    def log_class(self):
        pass

    @property
    def relieve_items(self):
        return TaxRelief.objects.filter(relief_group=self, is_active=True)


class TaxRelief(TimeStampedModel):
    CALCULATION_TYPE_PERCENTAGE = 'PERCENTAGE'
    CALCULATION_TYPE_FIXED = 'FIXED'
    CALCULATION_TYPE_NONE = 'NONE'

    CALCULATION_TYPE = (
        (CALCULATION_TYPE_PERCENTAGE, 'Percentage'),
        (CALCULATION_TYPE_FIXED, 'Fixed'),
        (CALCULATION_TYPE_NONE, 'None')
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  # pylint: disable=invalid-name
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    calculation_type = models.CharField(max_length=15, choices=CALCULATION_TYPE)
    calculation_type_value = models.DecimalField(decimal_places=2, max_digits=10, null=True)
    payroll_lines = models.ManyToManyField(PayrollElements, blank=True)
    relief_group = models.ForeignKey(TaxReliefGroup, on_delete=models.PROTECT)

    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-date_created']

    def log_class(self):
        pass

    def get_relief_value(self, employee):
        """Return relief value for a month"""
        if self.calculation_type == self.CALCULATION_TYPE_FIXED:
            return self.calculation_type_value

        if self.calculation_type == self.CALCULATION_TYPE_PERCENTAGE:
            total_payroll_values = 0
            for line in self.payroll_lines.all():
                total_payroll_values += line.get_payroll_value(employee)
            sum_relief = (total_payroll_values * self.calculation_type_value) / 100
            return sum_relief

        try:
            etf = EmployeeTaxRelief.objects.get(tax_relief=self, employee=employee)
            return etf.value
        except:
            return 0


class EmployeeTaxRelief(TimeStampedModel):
    """All the Tax Relief with None calculation type, we store the values here"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  # pylint: disable=invalid-name
    tax_relief = models.ForeignKey(TaxRelief, on_delete=models.PROTECT)
    employee = models.ForeignKey('employees.Employee', on_delete=models.PROTECT)
    value = models.DecimalField(decimal_places=2, max_digits=7)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['date_created']

    def log_class(self):
        pass


class Payslip(TimeStampedModel):
    company = models.ForeignKey(Company, on_delete=models.PROTECT)
    is_active = models.BooleanField(default=True)
    data = JSONField()
    employee = models.ForeignKey('employees.Employee', on_delete=models.PROTECT)
    transactions = models.ForeignKey('payroll.Transactions', on_delete=models.PROTECT, null=True)
    employer_pension = models.DecimalField(decimal_places=2, max_digits=12, null=True)
    tax_paid_year_to_date = models.DecimalField(decimal_places=2, max_digits=12, null=True)
    taxable_earnings_year_to_date = models.DecimalField(decimal_places=2, max_digits=12, null=True)
    pay_period = models.ForeignKey(PayPeriod, null=True, on_delete=models.PROTECT)

    class Meta:
        ordering = ['date_created']

    def log_class(self):
        pass

    def gross_pay(self):
        total = decimal.Decimal(0)
        for key, value in self.data.items():
            if key.upper() in [PayrollElements.PAYROLL_ELEMENT_EARNINGS]:
                for payslip_element in value:
                    if payslip_element['amount'] != 'None':
                        total += decimal.Decimal(payslip_element['amount'])

        return total

    def net_pay(self):
        return self.gross_pay() - self.total_deductions()

    def total_deductions(self):
        deductions = decimal.Decimal(0)
        for key, value in self.data.items():
            if key.upper() == PayrollElements.PAYROLL_ELEMENT_DEDUCTIONS:
                for payslip_element in value:
                    if payslip_element['amount'] != 'None':
                        deductions += decimal.Decimal(payslip_element['amount'])

        return deductions

    def get_pdf(self, context):
        from weasyprint import HTML
        html_string = render_to_string("payslip.html", context)
        return HTML(string=html_string, encoding='utf-8').write_pdf()


class Transactions(TimeStampedModel):
    company = models.ForeignKey(Company, on_delete=models.PROTECT)
    earnings = JSONField()
    deductions = JSONField()
    employee = models.ForeignKey('employees.Employee', on_delete=models.PROTECT)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['date_created']

    def log_class(self):
        pass


class Loan(TimeStampedModel):
    PAY_MONTHLY = 'MONTHLY'
    PAY_ON_CUSTOM_MONTH = 'CUSTOM'

    WHEN_TO_PAY = (
        (PAY_MONTHLY, 'Monthly'),
        (PAY_ON_CUSTOM_MONTH, 'Custom Month'),
    )
    company = models.ForeignKey(Company, on_delete=models.PROTECT, null=True)
    employee = models.ForeignKey('employees.Employee', on_delete=models.PROTECT)
    amount = models.DecimalField(decimal_places=2, max_digits=12)
    interest_rate = models.DecimalField(decimal_places=2, max_digits=8)
    start_date = models.DateField()
    end_date = models.DateField()
    when_to_pay = models.CharField(max_length=30, choices=WHEN_TO_PAY, blank=True, null=True)
    when_to_pay_months = ArrayField(models.CharField(max_length=30, blank=True), null=True, blank=True)
    is_active = models.BooleanField(default=True)

    @property
    def get_total_amount(self):
        loan_amount = self.amount
        interest = 0
        if self.interest_rate != 0.00:  # since we use 2 dp
            interest = self.interest_rate / 100
            interest = interest * self.amount

        return loan_amount + interest

    @property
    def get_monthly_repayment_amount(self):
        now = timezone.now()
        if now.date() > self.end_date:
            self.is_active = False
            self.save()
            return 0

        date_diff = relativedelta(self.end_date, self.start_date)
        total_months = 0
        if self.when_to_pay == Loan.PAY_MONTHLY:
            if date_diff.months:
                total_months = date_diff.months

            if date_diff.days:
                total_months += 1

            return self.get_total_amount / total_months

        current_month = now.month
        if str(current_month) in self.when_to_pay_months:
            pass
