from django.contrib import admin
#
from .models import PayPeriod, PayrollCategory, PayrollElements, Remuneration
#
admin.site.register(PayrollCategory)
admin.site.register(PayrollElements)
admin.site.register(Remuneration)
# admin.site.register(PensionSettings)
admin.site.register(PayPeriod)
