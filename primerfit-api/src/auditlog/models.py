import uuid

from django.db import models
from django.contrib.postgres.fields import JSONField
from accounts.models import User
from company.models import Company


class BaseLog(models.Model):
    PRIMERLOG_CREATE = 'CREATE'
    PRIMERLOG_UPDATE = 'UPDATE'
    PRIMERLOG_DELETE = 'DELETE'
    PRIMERLOG_CHANGE = 'CHANGE'

    PRIMERLOG_CHOICES = (
        (PRIMERLOG_CREATE, 'Create'),
        (PRIMERLOG_UPDATE, 'Update'),
        (PRIMERLOG_DELETE, 'Delete'),
        (PRIMERLOG_CHANGE, 'Change')
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  # pylint: disable=invalid-name
    blamer = models.ForeignKey(User, on_delete=models.PROTECT, related_name='blamer')
    action = models.CharField(choices=PRIMERLOG_CHOICES, max_length=10)
    timestamp = models.DateTimeField(auto_now_add=True)
    meta = JSONField(null=True)

    class Meta:
        ordering = ['-timestamp']


class StaffLog(BaseLog):
    staff = models.ForeignKey(User, on_delete=models.PROTECT)


class CompanyLog(BaseLog):
    company = models.ForeignKey(Company, on_delete=models.PROTECT)
    previous = JSONField(null=True)
