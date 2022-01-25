from rest_framework import serializers

from .models import Company, License, SubscriptionHistory
from accounts.serializers import UserSerializer
from accounts.models import User


class LicenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = License
        fields = '__all__'


class CompanySerializer(serializers.ModelSerializer):
    license = LicenseSerializer(read_only=True)
    blame_info = UserSerializer(read_only=True, source='blame')
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Company
        fields = '__all__'


class SubscriptionHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionHistory
        fields = '__all__'
