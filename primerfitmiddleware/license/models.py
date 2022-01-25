from django.db import models


class AccountsUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    id = models.UUIDField(primary_key=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.CharField(unique=True, max_length=254)
    profile_picture = models.CharField(max_length=100, blank=True, null=True)
    activation_key = models.UUIDField(unique=True)
    is_staff = models.BooleanField()
    is_superuser = models.BooleanField()
    is_active = models.BooleanField()
    role = models.CharField(max_length=14)
    date_joined = models.DateTimeField()
    date_updated = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'accounts_user'


class CompanyCompany(models.Model):
    id = models.UUIDField(primary_key=True)
    name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    email = models.CharField(max_length=255)
    is_active = models.BooleanField()
    contacts_name = models.CharField(max_length=255)
    contacts_email = models.CharField(max_length=255)
    contacts_phone_number = models.CharField(max_length=20)
    employee_count = models.IntegerField()
    bought_payroll = models.BooleanField()
    bought_ess = models.BooleanField()
    date_created = models.DateTimeField()
    date_updated = models.DateTimeField()
    blame = models.ForeignKey(AccountsUser, models.DO_NOTHING)
    license = models.ForeignKey('CompanyLicense', models.DO_NOTHING, blank=True, null=True)
    address = models.CharField(max_length=555)
    staff_used = models.IntegerField(blank=True, null=True)
    created_by = models.ForeignKey(AccountsUser, models.DO_NOTHING, blank=True, null=True, related_name='created_by')
    subscription_month = models.IntegerField(blank=True, null=True)
    subscription_year = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'company_company'


class CompanyLicense(models.Model):
    id = models.UUIDField(primary_key=True)
    code = models.CharField(max_length=255)
    is_active = models.BooleanField()
    date_activated = models.DateTimeField(blank=True, null=True)
    expiration_date = models.DateTimeField(blank=True, null=True)
    date_created = models.DateTimeField()
    date_updated = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'company_license'
