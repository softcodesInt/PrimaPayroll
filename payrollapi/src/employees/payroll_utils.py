from django.utils import timezone

from payroll.models import PayrollElements


def should_payroll_element_be_included(element, employee):
    current_month = timezone.now().date().month
    if element.when_to_pay == PayrollElements.PAY_ALWAYS:
        return True
    elif element.when_to_pay == PayrollElements.PAY_ON_BIRTHDAY:
        if employee.date_of_birth and employee.date_of_birth.month == current_month:
            return True
    elif element.when_to_pay == PayrollElements.PAY_ON_DATE_ENGAGED:
        if employee.date_engaged and employee.date_engaged.month == current_month:
            return True

    elif element.when_to_pay == PayrollElements.PAY_ON_CUSTOM_MONTH:
        if str(current_month) in element.when_to_pay_months:
            return True
