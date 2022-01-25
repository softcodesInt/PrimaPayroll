from rest_framework import serializers

from .models import StaffLog, CompanyLog
from accounts.serializers import UserSerializer
from company.serializers import CompanySerializer


class StaffLogSerializer(serializers.ModelSerializer):
    blamer = UserSerializer()
    staff = UserSerializer()

    class Meta:
        model = StaffLog
        fields = '__all__'


class CompanyLogSerializer(serializers.ModelSerializer):
    blamer = UserSerializer()
    company = CompanySerializer()

    class Meta:
        model = CompanyLog
        fields = '__all__'
