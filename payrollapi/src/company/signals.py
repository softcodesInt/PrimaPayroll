from django.db.models.signals import post_save
from django.dispatch import receiver

from company.models import CompanyPolicy
from company.utils import create_company_policy_pay_period, create_company_policy_tax_table


@receiver(post_save, sender=CompanyPolicy)
def create_defaults(sender, instance, created, **kwargs):
    if created:
        # make async
        create_company_policy_pay_period(instance)
        create_company_policy_tax_table(instance)
