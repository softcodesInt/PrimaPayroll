from rest_framework import permissions


class AdminDashboardPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_staff and request.user.is_active


class AppPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_active and not request.user.is_staff
