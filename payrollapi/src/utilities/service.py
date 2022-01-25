from auditlog.models import (
    BankListLog,
    JobGradeLog,
    JobTitleLog,
    ContractNatureLog
)


class UtilityService:
    @staticmethod
    def log_bank(action, blamer, meta, instance):
        BankListLog.objects.create(action=action, blamer=blamer, meta=meta, bank=instance)

    @staticmethod
    def log_job_title(action, blamer, meta, instance):
        JobTitleLog.objects.create(action=action, blamer=blamer, meta=meta, job_title=instance)

    @staticmethod
    def log_job_grade(action, blamer, meta, instance):
        JobGradeLog.objects.create(action=action, blamer=blamer, meta=meta, job_grade=instance)

    @staticmethod
    def log_nature_of_contract(action, blamer, meta, instance):
        ContractNatureLog.objects.create(action=action, blamer=blamer, meta=meta, contract_nature=instance)