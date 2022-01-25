from django.conf.urls import url
from django.utils.translation import ugettext_lazy as _

import ess.views

urlpatterns = [
    url(r'^set-password/(?P<employee_id>.*)/(?P<company_id>.*)/$', ess.views.CreateAccountView.as_view()),
    url(_(r'^login/$'), ess.views.LoginView.as_view(), name='login'),
    url(_(r'^profile/$'), ess.views.ProfileView.as_view(), name='profile'),
    url(r'^download-payslip/(?P<payslip_id>.*)/$', ess.views.DownloadPayslipView.as_view()),
    url(r'^employee/(?P<employee_id>.*)/leave-workflow/$', ess.views.LeaveRequestView.as_view()),
]
