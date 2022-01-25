from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ('password', 'activation_key', 'is_superuser', 'is_staff',)
        read_only_fields = ('is_active', 'last_login',)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


class RegisterUserSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    email = serializers.EmailField()

    def validate_email(self, value):
        user = User.objects.filter(email=value).exists()
        if not user:
            return value

        # in case a user was populated from business loan db, the user will still be inactive
        if User.objects.filter(email=value, is_active=False).exists():
            return value
        raise serializers.ValidationError(detail="Email already exists")
