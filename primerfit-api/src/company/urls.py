from django.conf.urls import url
from django.urls import include
from django.utils.translation import ugettext_lazy as _
from rest_framework.routers import DefaultRouter

import company.views

router = DefaultRouter()
router.register(r'', company.views.CompanyView)

urlpatterns = [
    url(_(r''), include(router.urls),
        name='history'),
    url(_(r'^filter/(?P<slug>[-\w]+)/$'),
        company.views.FilterCompanyView.as_view(),
        name='filter_company'),
]
