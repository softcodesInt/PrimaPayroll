import uuid
from django.db import models

from accounts.models import User


class License(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  # pylint: disable=invalid-name
    code = models.CharField(max_length=255)
    is_active = models.BooleanField(default=False)

    date_activated = models.DateTimeField(null=True)
    expiration_date = models.DateTimeField(null=True)

    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)


class Company(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  # pylint: disable=invalid-name
    name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    email = models.CharField(max_length=255)
    address = models.CharField(max_length=555, blank=True)
    blame = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    created_by = models.ForeignKey(User, on_delete=models.DO_NOTHING, null=True, related_name='created_by')
    is_active = models.BooleanField(default=True)
    license = models.ForeignKey(License, null=True, on_delete=models.PROTECT)
    subscription_year = models.IntegerField(null=True, default=0)
    subscription_month = models.IntegerField(null=True, default=0)

    contacts_name = models.CharField(max_length=255, blank=True)
    contacts_email = models.CharField(max_length=255, blank=True)
    contacts_phone_number = models.CharField(max_length=20, blank=True)

    employee_count = models.IntegerField()
    staff_used = models.IntegerField(null=True, default=0)
    bought_payroll = models.BooleanField(default=True)
    bought_ess = models.BooleanField(default=False)

    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date_updated']


class SubscriptionHistory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  # pylint: disable=invalid-name
    company = models.ForeignKey(Company, on_delete=models.PROTECT)
    previous_month = models.IntegerField()
    previous_year = models.IntegerField()
    previous_employee_count = models.IntegerField()
    previous_ess = models.BooleanField()

    new_month = models.IntegerField()
    new_year = models.IntegerField()
    new_employee_count = models.IntegerField()
    new_ess = models.BooleanField()

    updated_at = models.DateTimeField(auto_now_add=True)

