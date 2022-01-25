from django.utils.crypto import get_random_string
from django.utils import timezone

from .models import Company

def generate_license_code():
    return get_random_string(length=32)


def has_subscription_changed(current, updated):
    """
    This util checks if the subscription of a company has changed

    current: current state of the company in the db
    updated: updated value in db

    return Boolean
    """
    current_subscription_properties = [current.subscription_year,
                                       current.subscription_month,
                                       current.employee_count,
                                       current.bought_ess]

    updated_subscription_properties = [updated.subscription_year,
                                       updated.subscription_month,
                                       updated.employee_count,
                                       updated.bought_ess]

    return current_subscription_properties != updated_subscription_properties


def get_expired_company_queryset():
    return Company.objects.filter(license__expiration_date__lt=timezone.now())
