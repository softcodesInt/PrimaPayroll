from django.conf.urls import url
from django.urls import include
from django.utils.translation import ugettext_lazy as _
from rest_framework.routers import DefaultRouter

import company.api_views

router = DefaultRouter()
router.register(r'hierarchy', company.api_views.HierarchyView)
router.register(r'leave-category', company.api_views.LeaveCategoryView)
router.register(r'leave', company.api_views.LeaveView)
router.register(r'subsidiary', company.api_views.SubsidiaryView)
router.register(r'company-policy', company.api_views.CompanyPolicyView)
router.register(r'holiday', company.api_views.HolidayView)
router.register(r'tax-table', company.api_views.TaxTableView)

urlpatterns = [
    url(_(r'^activate-license/$'), company.api_views.LicenseCodeActivationView.as_view()),
    url(_(r''), include(router.urls), name='company_views'),
    # url(r'^export-import-hierarchy/$', company.api_views.ExportImportHierarchyView.as_view()),
    url(r'^backup-restore/$', company.api_views.BackupRestoreView.as_view()),
    url(_(r'^leave-request/$'), company.api_views.LeaveRequestView.as_view()),
    url(_(r'^leave-request/(?P<application_id>.*)/$'), company.api_views.LeaveRequestView.as_view()),
]
