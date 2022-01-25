from django.conf.urls import url
from django.urls import include
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(title="PrimalFIT API", default_version="v1"),
    public=True,
    permission_classes=[],
)

import accounts.views

urlpatterns = [
    url(r'^api/v1/accounts/', include('accounts.urls')),
    url(r'^api/v1/audit-log/', include('auditlog.urls')),
    url(r'^api/v1/company/', include('company.urls')),
    url(r'^api/v1/password-reset/$', accounts.views.ResetPasswordView.as_view()),
    url(r'^api/v1/password-reset/confirm/$', accounts.views.SetPasswordView.as_view()),

    url(r"^schema(?P<format>\.json|\.yaml)$", schema_view.without_ui(cache_timeout=0), name="schema-json"),
    url("^$", schema_view.with_ui("swagger", cache_timeout=0), name="schema-swagger-ui"),
    url("docs", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"),
    url('admin/', admin.site.urls),
] + static(settings.MEDIA_URL, document_root= settings.MEDIA_ROOT)
