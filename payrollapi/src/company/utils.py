import calendar
from django.conf import settings
from django.utils import timezone
from dateutil.relativedelta import relativedelta

from payroll.models import PayPeriod
from company.models import TaxTable


def _get_number_of_working_days_in_month(month_date, days):
    total_days = 0
    for week in calendar.monthcalendar(month_date.year, month_date.month):
        for day in days:
            if week[day] != 0:
                total_days += 1

    return total_days


def create_company_policy_pay_period(company_policy):
    """
    Create 24 months pay period for that company policy

    Note: the day of the month doesn't matter.
    """
    start_month = 1
    if company_policy.statutory_tax_year_start:
        start_month = company_policy.statutory_tax_year_start.month

    now = timezone.now().replace(month=start_month)
    working_days = company_policy.get_working_days
    for counter in range(settings.PAY_PERIOD_PER_POLICY):
        period_month = now + relativedelta(months=counter)
        work_days = _get_number_of_working_days_in_month(period_month, working_days)
        if counter == 0:
            PayPeriod.objects.create(
                period_month=period_month,
                number_of_days=work_days,
                status=PayPeriod.PAY_PERIOD_STATUS_LIVE,
                company_policy=company_policy
            )
        else:
            PayPeriod.objects.create(
                period_month=period_month,
                number_of_days=work_days,
                status=PayPeriod.PAY_PERIOD_STATUS_FUTURE,
                company_policy=company_policy
            )


def create_company_policy_tax_table(company_policy):
    data = [
        {
            'income_from': 0,
            'income_to': 300000,
            'tax_rate': 7
        },
        {
            'income_from': 300000,
            'income_to': 600000,
            'tax_rate': 11
        },
        {
            'income_from': 600000,
            'income_to': 1100000,
            'tax_rate': 15
        },
        {
            'income_from': 1100000,
            'income_to': 1600000,
            'tax_rate': 19
        },
        {
            'income_from': 1600000,
            'income_to': 3200000,
            'tax_rate': 21
        },
        {
            'income_from': 1600000,
            'income_to': 32000000,
            'tax_rate': 24
        }
    ]
    for tax_data in data:
        tax_table = TaxTable.objects.create(**tax_data, company_policy=company_policy)
