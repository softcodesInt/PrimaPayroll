from django.conf.urls import url
from django.urls import include
from django.utils.translation import ugettext_lazy as _
from rest_framework.routers import DefaultRouter

import payroll.views

router = DefaultRouter()
router.register(r'category', payroll.views.PayrollCategoryView)
router.register(r'element', payroll.views.PayrollElementView)
router.register(r'remuneration', payroll.views.RemunerationView)
router.register(r'tax-relief-group', payroll.views.TaxReliefGroupView)
router.register(r'tax-relief', payroll.views.TaxReliefView)
router.register(r'loan-setup', payroll.views.LoanView)

urlpatterns = [
    url(_(r''), include(router.urls), name='payroll_views'),
    url(r'^pension-setting/$', payroll.views.PensionSettingView.as_view()),
    url(r'^bank-letter/$', payroll.views.BankLetterView.as_view()),
    url(r'pay-period/(?P<policy_id>[0-9a-f-]+)/$', payroll.views.PayPeriodView.as_view()),
    url(r'transaction/(?P<employee_id>[0-9a-f-]+)/$', payroll.views.TransactionView.as_view()),
    url(r'transaction/(?P<employee_id>[0-9a-f-]+)/(?P<transaction_id>[0-9a-f-]+)/$', payroll.views.TransactionView.as_view()),
    url(r'employee/tax-relief/(?P<employee_id>[0-9a-f-]+)/$', payroll.views.EmployeeDrivenTaxReliefView.as_view()),
    url(r'employee-driven/(?P<employee_id>[0-9a-f-]+)/$', payroll.views.EmployeeDrivenPayrollView.as_view()),
    url(r'^transaction-allowed/$', payroll.views.TransactionAllowedView.as_view()),
]
