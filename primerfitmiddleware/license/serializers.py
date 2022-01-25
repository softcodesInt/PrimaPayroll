from rest_framework import serializers


class LicenseSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=250)
