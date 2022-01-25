from django.contrib.auth.models import User
from rest_framework import serializers

from accounts.models import AdminUser
from company.models import Company


class RegistrationSerializer(serializers.Serializer):
    company_id = serializers.UUIDField()
    first_name = serializers.CharField(max_length=255)
    last_name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    password = serializers.CharField(max_length=255)

    def validate_email(self, email):
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError(detail='Email Already exists, please use a different email')

        return email


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ['password', 'is_staff', 'is_superuser']


class UserProfileCompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name', 'address', 'logo', 'bought_ess']


class AdminUserSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = AdminUser
        fields = '__all__'

    def get_user(self, obj):
        if obj.user:
            return UserSerializer(obj.user).data
        return {}
