import os
from django.conf.urls import url
from django.urls import include
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.http import HttpResponse
from django.views.generic import View
from django.views.decorators.cache import cache_page


class IndexView(View):
    """Render main page."""

    def get(self, request):
        """Return html for main application page."""

        abspath = open(os.path.join(settings.BASE_DIR, 'templates/app.html'), 'r')
        return HttpResponse(content=abspath.read())


schema_view = get_schema_view(
    openapi.Info(title="PrimalFIT API", default_version="v1"),
    public=True,
    permission_classes=[],
)

urlpatterns = [
    url(r'^api/v1/accounts/', include('accounts.urls')),
    url(r'^api/v1/company/', include('company.urls')),
    url(r'^api/v1/payroll/', include('payroll.urls')),
    url(r'^api/v1/utilities/', include('utilities.urls')),
    url(r'^api/v1/employees/', include('employees.urls')),
    url(r'^api/v1/ess/', include('ess.urls')),
    url(r'^api/v1/export-import/', include('export_import.urls')),
    url(r"^schema(?P<format>\.json|\.yaml)$", schema_view.without_ui(cache_timeout=0), name="schema-json"),
    #url("^$", schema_view.with_ui("swagger", cache_timeout=0), name="schema-swagger-ui"),
    url("docs", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"),
    url('admin/', admin.site.urls),
    #url(r'', cache_page(2000)(IndexView.as_view()))
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
