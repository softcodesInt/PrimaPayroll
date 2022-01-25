import uuid
from django.db import models
from django.utils import timezone

from accounts.models import AdminUser
from lib.utils import TimeStampedModel


class Company(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  # pylint: disable=invalid-name
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255, blank=True, null=True)
    logo = models.ImageField(upload_to='logo/', null=True, blank=True)

    bought_payroll = models.BooleanField(default=True)
    bought_ess = models.BooleanField(default=False)

    employee_count = models.IntegerField(default=0)
    subscription_expiration_date = models.DateTimeField(null=True)
    subscription_year = models.IntegerField(default=0)
    subscription_month = models.IntegerField(default=0)
    license_code = models.CharField(max_length=255, null=True)

    middleware_id = models.UUIDField(null=True)
    middleware_date_activated = models.DateTimeField(null=True)

    is_active = models.BooleanField(default=False)
    is_subsidiary = models.BooleanField(default=False)
    parent = models.ForeignKey('self', null=True, on_delete=models.PROTECT)
    created_by = models.ForeignKey(AdminUser,
                                   on_delete=models.DO_NOTHING, null=True, related_name='subsidiary_created_by')
    admin = models.ForeignKey(AdminUser, null=True, on_delete=models.PROTECT)

    class Meta:
        ordering = ['-date_created']

    def log_class(self):
        from auditlog.models import CompanyLog, SubsidiaryLog
        return [CompanyLog, SubsidiaryLog]


class CompanyPolicy(TimeStampedModel):
    PAYMENT_CYCLE_DAILY = 'DAILY'
    PAYMENT_CYCLE_WEEKLY = 'WEEKLY'
    PAYMENT_CYCLE_FORTNIGHTLY = 'FORTNIGHTLY'
    PAYMENT_CYCLE_MONTHLY = 'MONTHLY'
    PAYMENT_CYCLE_YEARLY = 'YEARLY'
    PAYMENT_CYCLES = (
        (PAYMENT_CYCLE_DAILY, 'Daily'),
        (PAYMENT_CYCLE_WEEKLY, 'Weekly'),
        (PAYMENT_CYCLE_FORTNIGHTLY, 'Fortnightly'),
        (PAYMENT_CYCLE_MONTHLY, 'Monthly'),
        (PAYMENT_CYCLE_YEARLY, 'Yearly'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  # pylint: disable=invalid-name
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    payment_cycle = models.CharField(choices=PAYMENT_CYCLES, max_length=50, blank=True)
    works_monday = models.BooleanField(default=False)
    works_tuesday = models.BooleanField(default=False)
    works_wednesday = models.BooleanField(default=False)
    works_thursday = models.BooleanField(default=False)
    works_friday = models.BooleanField(default=False)
    works_saturday = models.BooleanField(default=False)
    works_sunday = models.BooleanField(default=False)
    statutory_tax_year_start = models.DateTimeField(blank=True)
    statutory_tax_year_end = models.DateTimeField(blank=True)
    probation_months = models.IntegerField(default=0)

    hours_per_week = models.IntegerField(default=0)
    hours_per_day = models.IntegerField(default=0)
    hours_per_month = models.IntegerField(default=0)

    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(AdminUser, on_delete=models.DO_NOTHING, null=True, related_name='policy_created_by')
    company = models.ManyToManyField(Company, related_name="policy_company")  # this is the company that created it

    class Meta:
        ordering = ['-date_created']

    @property
    def get_working_days(self):
        """
        Return the working days in array from 0 - 6 where 0 represents monday and 6 represents sunday
        """
        work_days = []
        if self.works_monday:
            work_days.append(0)

        if self.works_tuesday:
            work_days.append(1)

        if self.works_wednesday:
            work_days.append(2)

        if self.works_thursday:
            work_days.append(3)

        if self.works_friday:
            work_days.append(4)

        if self.works_saturday:
            work_days.append(5)

        if self.works_sunday:
            work_days.append(6)

        return work_days

    def log_class(self):
        from auditlog.models import CompanyPolicyLog
        return CompanyPolicyLog


class Hierarchy(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  # pylint: disable=invalid-name
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    parent = models.ForeignKey('self', null=True, on_delete=models.CASCADE)
    is_header = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(AdminUser, on_delete=models.DO_NOTHING, null=True, related_name='created_by')
    company_policy = models.ManyToManyField(CompanyPolicy)

    class Meta:
        ordering = ['-date_created']

    def log_class(self):
        from auditlog.models import HierarchyLog
        return HierarchyLog

    @property
    def get_header_items(self):
        if self.is_header:
            return Hierarchy.objects.filter(is_header=False, parent=self).count()
        return 0

    @property
    def get_total_head(self):
        return Hierarchy.objects.filter(is_header=True,
                                        company_policy__in=list(self.company_policy.values_list('id', flat=True))).count()

    @property
    def get_total_head_active(self):
        return Hierarchy.objects.filter(is_header=True,
                                        is_active=True,
                                        company_policy__in=list(self.company_policy.values_list('id', flat=True))).count()

    @property
    def get_total_head_inactive(self):
        return Hierarchy.objects.filter(is_header=True,
                                        is_active=False,
                                        company_policy__in=list(self.company_policy.values_list('id', flat=True))).count()

    @property
    def get_total_items(self):
        if self.parent:
            return Hierarchy.objects.filter(is_header=False,
                                            company_policy__in=list(self.parent.company_policy.values_list('id', flat=True))).count()
        return 0

    @property
    def get_total_items_active(self):
        if self.parent:
            return Hierarchy.objects.filter(is_header=False,
                                            is_active=True,
                                            company_policy__in=list(self.parent.company_policy.values_list('id', flat=True))).count()
        return 0

    @property
    def get_total_items_inactive(self):
        if self.parent:
            return Hierarchy.objects.filter(is_header=False,
                                            is_active=False,
                                            company_policy__in=list(self.parent.company_policy.values_list('id', flat=True))).count()
        return 0


class LeaveCategory(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  # pylint: disable=invalid-name
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(AdminUser,
                                   on_delete=models.DO_NOTHING,
                                   null=True,
                                   related_name='leave_category_created_by')
    company_policy = models.ManyToManyField(CompanyPolicy)

    class Meta:
        ordering = ['-date_created']

    @property
    def get_leave_count(self):
        return Leave.objects.filter(category=self).count()

    def log_class(self):
        from auditlog.models import LeaveCategoryLog
        return LeaveCategoryLog


class Leave(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  # pylint: disable=invalid-name
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    entitlement_value = models.IntegerField()
    weekend_apply = models.BooleanField(default=False)
    months_prior = models.IntegerField(default=0)
    category = models.ForeignKey(LeaveCategory,
                                 null=True,
                                 blank=True,
                                 on_delete=models.DO_NOTHING, related_name='category')
    for_female = models.BooleanField(default=False)
    for_male = models.BooleanField(default=False)
    is_sick_leave = models.BooleanField(default=False)

    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(AdminUser, on_delete=models.DO_NOTHING, null=True, related_name='leave_created_by')

    class Meta:
        ordering = ['-date_created']

    def log_class(self):
        from auditlog.models import LeaveLog
        return LeaveLog

    def get_available_days(self, user):
        from django.apps import apps
        LeaveApplication = apps.get_model('company.LeaveApplication')

        leave_application = LeaveApplication.objects.filter(leave=self, employee=user,
                                                            status=LeaveApplication.LEAVE_STATUS_APPROVED)
        if not leave_application.exists():
            return self.entitlement_value

        total_used = leave_application.aggregate(models.Sum('number_of_days')).get('number_of_days__sum')
        return self.entitlement_value - total_used


class LeaveApplication(TimeStampedModel):
    """"""
    LEAVE_STATUS_REQUEST = 'REQUEST'
    LEAVE_STATUS_APPROVED = 'APPROVED'
    LEAVE_STATUS_REJECTED = 'REJECTED'

    LEAVE_STATUS = (
        (LEAVE_STATUS_REQUEST, 'Request'),
        (LEAVE_STATUS_APPROVED, 'Approved'),
        (LEAVE_STATUS_REJECTED, 'Rejected'),
    )
    leave = models.ForeignKey(Leave, on_delete=models.PROTECT)
    number_of_days = models.IntegerField()
    start_date = models.DateField(null=True)
    end_date = models.DateField(null=True)
    employee = models.ForeignKey('employees.Employee', on_delete=models.PROTECT)
    is_active = models.BooleanField(default=True)
    status = models.CharField(default=LEAVE_STATUS_APPROVED, max_length=15, choices=LEAVE_STATUS)

    def log_class(self):
        pass

    def approve_leave(self):
        from employees.models import Employee
        self.status = LeaveApplication.LEAVE_STATUS_APPROVED
        self.save()

        if self.start_date <= timezone.now().date() < self.end_date:
            self.employee.status = Employee.EMPLOYEE_STATUS_ON_LEAVE
            self.employee.save()

    def reject_leave(self):
        self.status = LeaveApplication.LEAVE_STATUS_REJECTED
        self.save()


class Holiday(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  # pylint: disable=invalid-name
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    recurring = models.BooleanField(default=False)
    date_from = models.DateField(blank=True)
    date_to = models.DateField(blank=True, null=True)

    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(AdminUser, on_delete=models.DO_NOTHING, null=True, related_name='holiday_created_by')
    # this is the company that created it
    company_policy = models.ManyToManyField(CompanyPolicy, related_name='holiday_policy')

    class Meta:
        ordering = ['-date_created']

    def log_class(self):
        from auditlog.models import HolidayLog
        return HolidayLog


class TaxTable(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  # pylint: disable=invalid-name
    income_from = models.DecimalField(decimal_places=2, max_digits=10)
    income_to = models.DecimalField(decimal_places=2, max_digits=10)
    tax_rate = models.IntegerField()
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(AdminUser, on_delete=models.DO_NOTHING, null=True, related_name='tax_table_created_by')
    # this is the company that created it
    company_policy = models.ForeignKey(CompanyPolicy, related_name='tax_table_policy', on_delete=models.PROTECT, null=True)

    class Meta:
        ordering = ['-date_created']
