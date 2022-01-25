from django.contrib import admin

from .models import AdminUser


class UserAdmin(admin.ModelAdmin):
    list_per_page = 40
    # search_fields = ('user__email', 'user__first_name', 'user__last_name',)
    # list_display = ['id', 'user__email', 'user__first_name', 'user__last_name']

admin.site.register(AdminUser, UserAdmin)