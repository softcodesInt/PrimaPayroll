from django.conf.urls import url
from django.utils.translation import ugettext_lazy as _
from rest_framework.routers import DefaultRouter
from django.urls import include

import utilities.views
#
router = DefaultRouter()
router.register(r'bank-list', utilities.views.BankListView)
router.register(r'job-title', utilities.views.JobTitleView)
router.register(r'contract-nature', utilities.views.ContractNatureView)
router.register(r'job-grade', utilities.views.JobGradeView)
router.register(r'terminate-reason', utilities.views.TerminateReasonView)
router.register(r'reinstate-reason', utilities.views.ReinstateReasonView)

urlpatterns = [
    url(_(r''), include(router.urls), name='utilities_url')
]
