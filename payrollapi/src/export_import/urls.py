from django.conf.urls import url
from django.utils.translation import ugettext_lazy as _

import export_import.views


urlpatterns = [
    url(_(r'^export/$'),
        export_import.views.ExportFileView.as_view(),
        name='export_view'),
    url(_(r'^import/$'),
        export_import.views.ImportEmployeeView.as_view(),
        name='import_view'),
]
