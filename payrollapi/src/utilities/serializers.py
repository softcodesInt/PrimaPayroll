from rest_framework import serializers

from .models import (
    BankLists,
    ContractNature,
    JobGrade,
    JobTitle,
    ReinstateReason,
    TerminateReason
)


class BankListSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankLists
        fields = '__all__'


class JobTitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobTitle
        fields = '__all__'


class ContractNatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContractNature
        fields = '__all__'


class JobGradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobGrade
        fields = '__all__'


class TerminateReasonSerializer(serializers.ModelSerializer):
    class Meta:
        model = TerminateReason
        fields = '__all__'


class ReinstateReasonSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReinstateReason
        fields = '__all__'


class TerminateReinstateReason(serializers.Serializer):
    reason = serializers.UUIDField()
    date = serializers.DateField()
