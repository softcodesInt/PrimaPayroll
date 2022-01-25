from auditlog.models import (
    PayrollCategoryLog,
    PayrollElementLog,
)


class PayrollService:
    @staticmethod
    def log_category(action, blamer, meta, instance):
        PayrollCategoryLog.objects.create(action=action, blamer=blamer, meta=meta, payroll_category=instance)

    @staticmethod
    def log_payroll(action, blamer, meta, instance):
        PayrollElementLog.objects.create(action=action, blamer=blamer, meta=meta, payroll_element=instance)
