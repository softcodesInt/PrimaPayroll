from django.contrib import admin

from .models import Company, CompanyPolicy, TaxTable, LeaveCategory, Leave, Hierarchy

admin.site.register(Company)
admin.site.register(Hierarchy)
admin.site.register(LeaveCategory)
admin.site.register(Leave)
admin.site.register(CompanyPolicy)
# admin.site.register(Holiday)
admin.site.register(TaxTable)
