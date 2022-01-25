from django.conf.urls import url
from django.utils.translation import ugettext_lazy as _
from rest_framework.routers import DefaultRouter
from django.urls import include

import employees.views
#
router = DefaultRouter()
router.register(r'employee-info', employees.views.EmployeeInfoView)

urlpatterns = [
    url(_(r''), include(router.urls), name='employee_urls'),
    url(r'^employee/(?P<employee_id>.*)/payslips/$', employees.views.EmployeePayslip.as_view()),
    url(r'^employee/(?P<payslip_id>.*)/download-payslip/$', employees.views.DownloadEmployeePayslip.as_view()),
    url(r'^employee/(?P<employee_id>.*)/leave-workflow/$', employees.views.EmployeeLeaveWorkflowView.as_view()),
    url(r'^employee/(?P<employee_id>.*)/terminate/$', employees.views.TerminateEmployeeView.as_view()),
    url(r'^employee/(?P<employee_id>.*)/ess-invite/$', employees.views.SendEssInviteEmailView.as_view()),
]
