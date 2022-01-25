from rest_framework import permissions
from django.conf import settings


class HasAPIAccess(permissions.BasePermission):
    message = 'Invalid or missing API Key.'

    def has_permission(self, request, view):
        api_key = request.META.get('HTTP_AUTHORIZATION', '')
        return api_key == settings.API_KEY
