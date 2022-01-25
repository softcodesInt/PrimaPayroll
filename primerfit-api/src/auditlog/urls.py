from django.conf.urls import url
from django.utils.translation import ugettext_lazy as _

import auditlog.views

urlpatterns = [
    url(_(r'^$'),
        auditlog.views.AuditLogView.as_view(),
        name='history'),
    url(_(r'^staff/$'),
        auditlog.views.StaffLogView.as_view(),
        name='staff_log'),
    url(_(r'^company/$'),
        auditlog.views.CompanyLogView.as_view(),
        name='company_log'),
]
