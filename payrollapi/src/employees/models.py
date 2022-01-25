import uuid, decimal, calendar

import numpy as np
from django.utils.translation import ugettext_lazy as _
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

from lib.utils import TimeStampedModel
from employees.payroll_utils import should_payroll_element_be_included
from utilities.models import (
    BankLists,
    JobTitle,
    JobGrade,
    ContractNature,
    TerminateReason,
    ReinstateReason
)
from company.models import (
    Company,
    CompanyPolicy
)


class Employee(TimeStampedModel):
    MARITAL_STATUS_MARRIED = 'MARRIED'
    MARITAL_STATUS_DIVORCED = 'DIVORCED'
    MARITAL_STATUS_SINGLE = 'SINGLE'
    MARITAL_STATUS_WIDOWED = 'WIDOWED'

    MARITAL_STATUS = (
        (MARITAL_STATUS_MARRIED, 'Married'),
        (MARITAL_STATUS_DIVORCED, 'Divorced'),
        (MARITAL_STATUS_SINGLE, 'Single'),
        (MARITAL_STATUS_WIDOWED, 'Widowed')
    )

    GENDER_MALE = 'MALE'
    GENDER_FEMALE = 'FEMALE'

    GENDER = (
        (GENDER_MALE, 'Male'),
        (GENDER_FEMALE, 'Female')
    )

    EMPLOYEE_STATUS_ACTIVE = 'ACTIVE'
    EMPLOYEE_STATUS_TERMINATED = 'TERMINATED'
    EMPLOYEE_STATUS_REINSTATED = 'REINSTATED'
    EMPLOYEE_STATUS_PENDING = 'PENDING'
    EMPLOYEE_STATUS_ON_LEAVE = 'ON_LEAVE'

    EMPLOYEE_STATUS = (
        (EMPLOYEE_STATUS_ACTIVE, 'Active'),
        (EMPLOYEE_STATUS_TERMINATED, 'Terminated'),
        (EMPLOYEE_STATUS_REINSTATED, 'Reinstated'),
        (EMPLOYEE_STATUS_PENDING, 'Pending'),
        (EMPLOYEE_STATUS_ON_LEAVE, 'On Leave')
    )

    TAX_APPLIED_YES = 'YES'
    TAX_APPLIED_NO = 'NO'
    TAX_APPLIED_FIXED = 'FIXED'

    TAX_APPLIED_CHOICES = (
        (TAX_APPLIED_YES, 'yes'),
        (TAX_APPLIED_NO, 'no'),
        (TAX_APPLIED_FIXED, 'fixed'),
    )

    # we want primary key to be called id so need to ignore pytlint
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  # pylint: disable=invalid-name

    title = models.CharField(max_length=50, blank=True)
    first_name = models.CharField(_('First Name'), max_length=50)
    last_name = models.CharField(_('Last Name'), max_length=50)
    other_name = models.CharField(_('Last Name'), max_length=50, null=True, blank=True)
    date_of_birth = models.DateField(blank=True, null=True)
    personal_email = models.EmailField(blank=True, null=True, max_length=50)
    marital_status = models.CharField(choices=MARITAL_STATUS, blank=True, max_length=15)
    gender = models.CharField(choices=GENDER, blank=True, max_length=15)

    email = models.EmailField(_('Email address'), unique=True, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='accounts', null=True, blank=True)

    activation_key = models.UUIDField(unique=True, default=uuid.uuid4)  # email

    # employmentInfo
    employee_code = models.CharField(max_length=255, null=True, blank=True)
    date_engaged = models.DateField(blank=True, null=True)
    probation_period = models.IntegerField(blank=True, null=True)
    pension_pin = models.CharField(max_length=50, blank=True)
    pension_start_date = models.DateField(blank=True, null=True)
    tax_identification_number = models.CharField(max_length=50, blank=True)
    nhf = models.CharField(blank=True, max_length=50)
    job_title = models.ForeignKey(JobTitle, null=True, on_delete=models.PROTECT)
    nature_of_contract = models.ForeignKey(ContractNature, null=True, on_delete=models.PROTECT)
    job_grade = models.ForeignKey(JobGrade, null=True, on_delete=models.PROTECT)
    address = models.CharField(max_length=255, null=True, blank=True)
    nationality = models.CharField(max_length=75, null=True, blank=True)
    phone_number = models.CharField(max_length=25, null=True, blank=True)

    next_of_kin_name = models.CharField(max_length=75, null=True, blank=True)
    next_of_kin_phone_number = models.CharField(max_length=25, null=True, blank=True)
    next_of_kin_email = models.CharField(max_length=75, null=True, blank=True)

    bank = models.ForeignKey(BankLists, null=True, on_delete=models.PROTECT)
    account_number = models.CharField(max_length=15, blank=True)
    account_name = models.CharField(max_length=80, blank=True)

    main_company = models.ForeignKey('company.Company',
                                     related_name='company_user', null=True, on_delete=models.PROTECT)
    company_policy = models.ForeignKey('company.CompanyPolicy',
                                       related_name='company_policy', null=True, on_delete=models.PROTECT)
    hierarchy = models.ManyToManyField('company.Hierarchy', related_name='employee_hierarchy', blank=True)
    leaves = models.ManyToManyField('company.Leave', related_name='employee_hierarchy', blank=True)
    remuneration = models.ForeignKey('payroll.Remuneration', on_delete=models.PROTECT, null=True,
                                     related_name='employee_remuneration')
    tax_relief = models.ForeignKey('payroll.TaxReliefGroup', on_delete=models.PROTECT, null=True,
                                     related_name='employee_taxrelief')
    fixed_tax = models.DecimalField(max_digits=15, decimal_places=4, blank=True, null=True)
    hours_per_day = models.IntegerField(blank=True, null=True)
    hours_per_week = models.IntegerField(blank=True, null=True)
    hours_per_month = models.IntegerField(blank=True, null=True)
    rates_per_hour = models.DecimalField(max_digits=15, decimal_places=4, blank=True, null=True)
    rates_per_day = models.DecimalField(max_digits=15, decimal_places=4, blank=True, null=True)
    rates_per_month = models.DecimalField(max_digits=15, decimal_places=4, blank=True, null=True)
    rates_per_year = models.DecimalField(max_digits=15, decimal_places=4, blank=True, null=True)
    pension_applied = models.BooleanField(default=False)
    tax_applied = models.CharField(choices=TAX_APPLIED_CHOICES, default=TAX_APPLIED_NO, max_length=10)
    user = models.OneToOneField(User, null=True, on_delete=models.PROTECT, blank=True)

    works_monday = models.BooleanField(default=True)
    works_tuesday = models.BooleanField(default=True)
    works_wednesday = models.BooleanField(default=True)
    works_thursday = models.BooleanField(default=True)
    works_friday = models.BooleanField(default=True)
    works_saturday = models.BooleanField(default=False)
    works_sunday = models.BooleanField(default=False)

    status = models.CharField(choices=EMPLOYEE_STATUS, default=EMPLOYEE_STATUS_ACTIVE, max_length=20)
    terminated_date = models.DateField(null=True)
    reinstated_date = models.DateField(null=True)
    terminate_reason = models.ForeignKey(TerminateReason, null=True, on_delete=models.PROTECT)
    reinstate_reason = models.ForeignKey(ReinstateReason, null=True, on_delete=models.PROTECT)

    # for django
    is_staff = models.BooleanField(_('staff status'), default=False)
    is_superuser = models.BooleanField(_('superuser status'), default=False)
    is_active = models.BooleanField(_('active'), default=True)

    is_root_user = models.BooleanField(_('active'), default=False)

    date_joined = models.DateTimeField(_('date joined'), auto_now_add=True)
    date_updated = models.DateTimeField(_('date updated'), auto_now=True)

    def get_full_name(self):
        """
        Return the first_name plus the last_name, with a space in between.

        :return: string
        """
        return "{0} {1}".format(self.first_name, self.last_name)

    @property
    def get_active_employees(self, company):
        return Employee.objects.filter(is_active=True, main_company=company).count()

    def get_user_payroll_element_value(self, payroll_element):
        """Get user payroll value for a month
        Get number of days employee worked that month
        Get business days
        If the subtraction is less than or equal to zero, give full payment
        Otherwise rates per day * number of days

        """
        if not (self.status == Employee.EMPLOYEE_STATUS_TERMINATED):
            return payroll_element.get_payroll_value(self)

        start_day_of_the_month = timezone.now().replace(day=1)
        number_of_working_days = np.busday_count(
            start_day_of_the_month.date(), self.terminated_date, weekmask=self.get_working_days())
        _, last_day_of_month = calendar.monthrange(timezone.now().year, timezone.now().month)
        number_of_month_business_days = np.busday_count(
            start_day_of_the_month.date(),
            timezone.now().replace(day=last_day_of_month).date(),
            weekmask=self.get_working_days())

        number_of_working_days += 1     # numpy counts from zero
        if number_of_working_days >= number_of_month_business_days:
            return payroll_element.get_payroll_value(self)
        return payroll_element.get_payroll_value(self, number_of_working_days)

    def get_total_taxable_earnings(self):
        from django.apps import apps
        payroll_model = apps.get_model('payroll.PayrollElements')
        Transactions = apps.get_model('payroll.Transactions')
        payroll_lines = []

        if not self.remuneration:
            return 0
        for pl in self.remuneration.payroll_elements.filter(earning_type=payroll_model.EARNING_TYPE_TAXABLE):
            if should_payroll_element_be_included(pl, self):
                payroll_lines.append(pl)

        total = 0
        for line in payroll_lines:
            if line.get_payroll_value(self):
                total += self.get_user_payroll_element_value(line)

        employee_transactions = Transactions.objects.filter(employee=self, is_active=True).first()
        # since the employee transactions naming is gotten from remuneration payroll lines, we can get the earning type easily
        if employee_transactions and employee_transactions.earnings:
            for e in employee_transactions.earnings:
                try:
                    payroll = payroll_lines.get(name=e['name'])
                    if payroll.earning_type == payroll_model.EARNING_TYPE_TAXABLE:
                        total = total + decimal.Decimal(e['amount'])
                except:
                    pass

        return total

    # def get_total_earnings(self):
    #     """
    #     Get all total earnings of a user and also include transaction for that month
    #     """
    #     from django.apps import apps
    #     payroll_model = apps.get_model('payroll.PayrollElements')
    #     Transactions = apps.get_model('payroll.Transactions')
    #     payroll_lines = []
    #     if not self.remuneration:
    #         return 0
    #     querysets = self.remuneration.payroll_elements.all().exclude(
    #         element_type__in=[payroll_model.PAYROLL_ELEMENT_COMPANY_CONTRIBUTION,
    #                           payroll_model.PAYROLL_ELEMENT_DEDUCTIONS])
    #     current_month = timezone.now().date().month
    #     for pl in querysets:
    #         if pl.when_to_pay == payroll_model.PAY_ALWAYS:
    #             payroll_lines.append(pl)
    #         elif pl.when_to_pay == payroll_model.PAY_ON_BIRTHDAY:
    #             if self.date_of_birth and self.date_of_birth.month == current_month:
    #                 payroll_lines.append(pl)
    #         elif pl.when_to_pay == payroll_model.PAY_ON_DATE_ENGAGED:
    #             if self.date_engaged and self.date_engaged.month == current_month:
    #                 payroll_lines.append(pl)
    #
    #     total = 0
    #     for line in payroll_lines:
    #         if line.get_payroll_value(self):
    #             total += self.get_user_payroll_element_value(line)
    #
    #     user_transactions = Transactions.objects.filter(user=self, is_active=True).first()
    #     if user_transactions and user_transactions.earnings:
    #         for e in user_transactions.earnings:
    #             try:
    #                 total = total + decimal.Decimal(e['amount'])
    #             except Exception as e:
    #                 pass
    #     return total
    #
    # def get_total_deductions(self, request):
    #     """
    #     Get all total deductions of a user and also include transaction for that month
    #     """
    #     from django.apps import apps
    #     from payroll.models import Loan
    #     payroll_model = apps.get_model('payroll.PayrollElements')
    #     Transactions = apps.get_model('payroll.Transactions')
    #     payroll_lines = []
    #     current_month = timezone.now().date().month
    #     if not self.remuneration:
    #         return 0
    #     queryset = self.remuneration.payroll_elements.filter(element_type=payroll_model.PAYROLL_ELEMENT_DEDUCTIONS)
    #     for pl in queryset:
    #         if pl.when_to_pay == payroll_model.PAY_ALWAYS:
    #             payroll_lines.append(pl)
    #         elif pl.when_to_pay == payroll_model.PAY_ON_BIRTHDAY:
    #             if self.date_of_birth and self.date_of_birth.month == current_month:
    #                 payroll_lines.append(pl)
    #         elif pl.when_to_pay == payroll_model.PAY_ON_DATE_ENGAGED:
    #             if self.date_engaged and self.date_engaged.month == current_month:
    #                 payroll_lines.append(pl)
    #     total = 0
    #     for line in payroll_lines:
    #         if line.get_payroll_value(self):
    #             total += self.get_user_payroll_element_value(line)
    #
    #     user_transactions = Transactions.objects.filter(user=self, is_active=True).first()
    #     if user_transactions and user_transactions.deductions:
    #         for e in user_transactions.deductions:
    #             try:
    #                 total = total + decimal.Decimal(e['amount'])
    #             except:
    #                 pass
    #
    #     # add tax if tax applied
    #     if self.tax_applied:
    #         from payroll.employee_tax import EmployeeTax
    #         tax = EmployeeTax(self, self.company_policy, request)
    #         total += tax.calculate_tax()
    #
    #     # add pension if applied
    #     if self.pension_applied:
    #         from payroll.utils import calculate_pension_for_employee
    #         total += calculate_pension_for_employee(request, self)['employee_rate']
    #
    #     # Add loan if it exists
    #     loan = Loan.objects.filter(user=self, is_active=True)
    #     if loan.first():
    #         amount = loan.first().get_monthly_repayment_amount
    #         if amount:
    #             total += amount
    #     return total

    def get_available_leaves(self, is_ess=False):
        """
        Get Available Leaves

        A leave is said to be available (IF NOT ESS)
        1. If the employee has spent more than the probation period
        2. If the employee hasn't exhausted it

        Return the number of days available left
        """
        leaves = []
        now = timezone.now().date()
        for leave in self.leaves.filter(is_active=True):
            if not self.date_engaged:
                continue
            num_months = (now.year - self.date_engaged.year) * 12 + (now.month - self.date_engaged.month)
            if is_ess:
                leaves.append({
                    'id': leave.pk,
                    'name': leave.name,
                    'days_left': leave.get_available_days(self),
                    'entitlement_days': leave.entitlement_value,
                    'active': leave.entitlement_value > leave.get_available_days(self)
                })
            elif leave.is_sick_leave:
                leaves.append({
                    'id': leave.pk,
                    'name': leave.name,
                    'days_left': leave.get_available_days(self),
                    'entitlement_days': leave.entitlement_value,
                    'active': leave.entitlement_value > leave.get_available_days(self)
                })
            elif num_months > leave.months_prior:
                # check if it hasn't been exhausted
                leaves.append({
                    'id': leave.pk,
                    'name': leave.name,
                    'days_left': leave.get_available_days(self),
                    'entitlement_days': leave.entitlement_value,
                    'active': leave.entitlement_value > leave.get_available_days(self)
                })

        return leaves

    def get_working_days(self):
        """
        Return the working days in array from 0 - 6 where 0 represents monday and 6 represents sunday
        """
        work_days = []
        if self.works_monday:
            work_days.append(1)
        else:
            work_days.append(0)

        if self.works_tuesday:
            work_days.append(1)
        else:
            work_days.append(0)

        if self.works_wednesday:
            work_days.append(1)
        else:
            work_days.append(0)

        if self.works_thursday:
            work_days.append(1)
        else:
            work_days.append(0)

        if self.works_friday:
            work_days.append(1)
        else:
            work_days.append(0)

        if self.works_saturday:
            work_days.append(1)
        else:
            work_days.append(0)

        if self.works_sunday:
            work_days.append(1)
        else:
            work_days.append(0)

        return work_days

    @property
    def is_employee_entitled_to_salary(self):
        now = timezone.now()
        if self.status == Employee.EMPLOYEE_STATUS_TERMINATED:
            if (
                    self.terminated_date and self.terminated_date.year < now.year
            ) or (
                    (self.terminated_date and self.terminated_date.year == now.year) and
                    (self.terminated_date.month < now.month)
            ):
                return False
        if not self.remuneration:
            return False
        return True

    class Meta:
        ordering = ['-date_updated']

    def log_class(self):
        pass