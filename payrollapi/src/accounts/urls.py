from django.conf.urls import url
from django.utils.translation import ugettext_lazy as _
from rest_framework.routers import DefaultRouter
from django.urls import include

import accounts.views
#
router = DefaultRouter()
router.register(r'user-access', accounts.views.UserAccessView)

urlpatterns = [
    url(_(r'^register/$'),
        accounts.views.CreateOrganisationAdmin.as_view(),
        name='register'),
    url(_(r'^login/$'),
        accounts.views.UserLoginView.as_view(),
        name='login'),
    url(r'^password-reset/$', accounts.views.ResetPasswordView.as_view()),
    url(r'^password-reset/confirm/$', accounts.views.SetPasswordView.as_view()),
    url(r'^profile/$', accounts.views.ProfileView.as_view()),
    # url(r'^employee/download-all-payslips/$', accounts.views.DownloadAllEmployeePayslipView.as_view()),
    url(_(r''), include(router.urls), name='settings_url')
]
