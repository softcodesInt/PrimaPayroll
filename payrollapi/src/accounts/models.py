from django.db import models
from django.contrib.auth.models import User


class AdminUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.PROTECT)
    main_company = models.ForeignKey('company.Company', on_delete=models.PROTECT, blank=True, null=True)
    has_all_access = models.BooleanField(default=False)
    license_code = models.CharField(max_length=255, blank=True, null=True)

    USERNAME_FIELD = 'email'
