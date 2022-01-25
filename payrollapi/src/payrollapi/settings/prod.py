import os
import dj_database_url

from payrollapi.settings.base import *  # NOQA (ignore all errors on this line)
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

sentry_sdk.init(
    dsn=os.environ.get('SENTRY_URL'),
    integrations=[DjangoIntegration()],

    # If you wish to associate users to errors (assuming you are using
    # django.contrib.auth) you may enable sending PII data.
    send_default_pii=True
)

DEBUG = True
TEMPLATE_DEBUG = DEBUG

PAGE_CACHE_SECONDS = 60

ALLOWED_HOSTS = ['*']

DATABASES = {}
DATABASES['default'] = dj_database_url.config(conn_max_age=600, ssl_require=True)

# REST_FRAMEWORK['EXCEPTION_HANDLER'] = 'django_rest_logger.handlers.rest_exception_handler'  # NOQA (ignore all errors on this line)
LOGGER_EXCEPTION = None

CORS_ORIGIN_ALLOW_ALL = True

# ######### EMAIL CONFIG #######
SENDER_EMAIL = os.environ.get('SENDER_EMAIL')
SENDER_PASSWORD = os.environ.get('SENDER_PASSWORD')
FRONTEND_URL = 'https://payroll-primerfit.netlify.app/'

LICENSE_CODE_API_KEY = os.environ.get('LICENSE_CODE_API_KEY')
