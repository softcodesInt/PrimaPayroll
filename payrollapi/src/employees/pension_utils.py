from payroll.models import PensionSettings
from accounts.utils import get_parent_company


def calculate_pension_for_employee(request, employee):
    pension_setting = PensionSettings.objects.filter(company=get_parent_company(request)).latest('id')
    if not pension_setting:
        return {
            'employer_rate': 0,
            'employee_rate': 0,
        }
    payroll_lines = pension_setting.payroll_lines.all()
    total = 0
    for line in payroll_lines:
        try:
            total += employee.get_user_payroll_element_value(line)
        except:
            pass
    return {
        'employer_rate': (pension_setting.employer_rate * total) / 100,
        'employee_rate': (pension_setting.employee_rate * total) / 100
    }
