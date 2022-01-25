from django.contrib import admin

from utilities.models import BankLists, ContractNature, JobGrade, JobTitle


class BankListsAdmin(admin.ModelAdmin):
    readonly_fields = ('date_created', 'date_updated')
    list_display = ('name', 'bank_code', 'sort_code', 'is_active')
    search_fields = ('name',)


class JobTitleAdmin(admin.ModelAdmin):
    readonly_fields = ('date_created', 'date_updated')
    list_display = ('name', 'is_active')
    search_fields = ('name',)


class ContractNatureAdmin(admin.ModelAdmin):
    readonly_fields = ('date_created', 'date_updated')
    list_display = ('name', 'is_active')
    search_fields = ('name',)


class JobGradeAdmin(admin.ModelAdmin):
    readonly_fields = ('date_created', 'date_updated')
    list_display = ('name', 'is_active')
    search_fields = ('name',)


admin.site.register(BankLists, BankListsAdmin)
admin.site.register(JobTitle, JobTitleAdmin)
admin.site.register(ContractNature, ContractNatureAdmin)
admin.site.register(JobGrade, ContractNatureAdmin)
