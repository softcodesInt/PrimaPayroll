import uuid
from django.db import models
from django.utils.translation import ugettext_lazy as _

from lib.utils import TimeStampedModel
from company.models import Company


class SettingsBaseModel(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(_('active'), default=True)
    company = models.ForeignKey(Company, null=True, on_delete=models.PROTECT)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-date_created']
        # constraints = [
        #     models.UniqueConstraint(
        #         fields=['name', 'company_id'],
        #         name="Name can't be duplicate for the same company"),
        # ]


class BankLists(SettingsBaseModel):
    bank_code = models.CharField(max_length=255, blank=True)
    sort_code = models.CharField(max_length=255, null=True, blank=True)

    def log_class(self):
        from auditlog.models import BankListLog
        return BankListLog

    # class Meta:
    #     ordering = ['-date_created']
    #     constraints = [
    #         models.UniqueConstraint(
    #             fields=['company_id', 'name'],
    #             name="Bank Name can't be duplicate for the same company"),
    #         models.UniqueConstraint(
    #             fields=['company_id', 'bank_code'],
    #             name="Bank Code can't be duplicate for the same company"),
    #     ]


class JobTitle(SettingsBaseModel):
    def log_class(self):
        from auditlog.models import JobTitleLog
        return JobTitleLog


class ContractNature(SettingsBaseModel):
    def log_class(self):
        from auditlog.models import ContractNatureLog
        return ContractNatureLog


class JobGrade(SettingsBaseModel):
    def log_class(self):
        from auditlog.models import JobGradeLog
        return JobGradeLog


class TerminateReason(SettingsBaseModel):
    pass


class ReinstateReason(SettingsBaseModel):
    pass
