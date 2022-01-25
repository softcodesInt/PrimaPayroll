"""
WSGI config for primerfitapi project.

"""
import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "primerfitapi.settings")

application = get_wsgi_application()
