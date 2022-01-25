import uuid

from django.db import models
from django.contrib.postgres.fields import JSONField
from utilities.models import BankLists, JobTitle, ContractNature, JobGrade
from accounts.models import AdminUser
from company.models import Company, CompanyPolicy, LeaveCategory, Leave, Hierarchy, Holiday, TaxTable
from payroll.models import PayrollCategory, PayrollElements


class BaseLog(models.Model):
    PRIMERLOG_CREATE = 'CREATE'
    PRIMERLOG_UPDATE = 'UPDATE'
    PRIMERLOG_DELETE = 'DELETE'
    PRIMERLOG_CHANGE = 'CHANGE'
    PRIMERLOG_CODE_ACTIVATED = 'CODE_ACTIVATED'

    PRIMERLOG_CHOICES = (
        (PRIMERLOG_CREATE, 'Create'),
        (PRIMERLOG_UPDATE, 'Update'),
        (PRIMERLOG_DELETE, 'Delete'),
        (PRIMERLOG_CHANGE, 'Change'),
        (PRIMERLOG_CHANGE, 'Code Activated')
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  # pylint: disable=invalid-name
    blamer = models.ForeignKey(AdminUser, on_delete=models.PROTECT, related_name='blamer', null=True)
    action = models.CharField(choices=PRIMERLOG_CHOICES, max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)
    meta = JSONField(null=True, max_length=500)

    class Meta:
        ordering = ['-timestamp']


class AccountLog(BaseLog):
    user = models.ForeignKey(AdminUser, on_delete=models.PROTECT)


class BankListLog(BaseLog):
    bank = models.ForeignKey(BankLists, on_delete=models.PROTECT, null=True)


class JobTitleLog(BaseLog):
    job_title = models.ForeignKey(JobTitle, on_delete=models.PROTECT, null=True)


class ContractNatureLog(BaseLog):
    contract_nature = models.ForeignKey(ContractNature, on_delete=models.PROTECT, null=True)


class JobGradeLog(BaseLog):
    job_grade = models.ForeignKey(JobGrade, on_delete=models.PROTECT, null=True)


class CompanyLog(BaseLog):
    company = models.ForeignKey(Company, on_delete=models.PROTECT)


class HierarchyLog(BaseLog):
    hierarchy = models.ForeignKey(Hierarchy, on_delete=models.PROTECT)


class LeaveCategoryLog(BaseLog):
    category = models.ForeignKey(LeaveCategory, on_delete=models.PROTECT)


class LeaveLog(BaseLog):
    leave = models.ForeignKey(Leave, on_delete=models.PROTECT)


class SubsidiaryLog(BaseLog):
    subsidiary = models.ForeignKey(Company, on_delete=models.PROTECT)


class CompanyPolicyLog(BaseLog):
    policy = models.ForeignKey(CompanyPolicy, on_delete=models.PROTECT)


class HolidayLog(BaseLog):
    holiday = models.ForeignKey(Holiday, on_delete=models.PROTECT)


class TaxTableLog(BaseLog):
    tax_table = models.ForeignKey(TaxTable, on_delete=models.PROTECT)


class PayrollCategoryLog(BaseLog):
    payroll_category = models.ForeignKey(PayrollCategory, on_delete=models.PROTECT)


class PayrollElementLog(BaseLog):
    payroll_element = models.ForeignKey(PayrollElements, on_delete=models.PROTECT)
