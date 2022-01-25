import os
import dj_database_url

from primerfitapi.settings.base import *  # NOQA (ignore all errors on this line)
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

LOGGER_EXCEPTION = None

CORS_ORIGIN_ALLOW_ALL = True

# ######### EMAIL CONFIG #######
SENDER_EMAIL = os.environ.get('SENDER_EMAIL')
SENDER_PASSWORD = os.environ.get('SENDER_PASSWORD')
FRONTEND_URL = 'https://primerfit-control.netlify.app/'


# # ######## RQ ############
# RQ_QUEUES = {
#     'default': {
#         'URL': os.getenv('REDISTOGO_URL'),
#         'DEFAULT_TIMEOUT': 360
#     },
#     'with-sentinel': {
#         'SENTINELS': [('localhost', 26736), ('localhost', 26737)],
#         'MASTER_NAME': 'redismaster',
#         'DB': 0,
#         'PASSWORD': 'secret',
#         'SOCKET_TIMEOUT': None,
#         'CONNECTION_KWARGS': {
#             'socket_connect_timeout': 0.3
#         },
#     },
#     'high': {
#         'URL': os.getenv('REDISTOGO_URL'), # If you're on Heroku
#         'DEFAULT_TIMEOUT': 500,
#     },
#     'low': {
#         'URL': os.getenv('REDISTOGO_URL'),
#         'DEFAULT_TIMEOUT': 360
#     }
# }
#
# LOGGING = {
#     "version": 1,
#     "disable_existing_loggers": False,
#     "formatters": {
#         "rq_console": {
#             "format": "%(asctime)s %(message)s",
#             "datefmt": "%H:%M:%S",
#         },
#     },
#     "handlers": {
#         "rq_console": {
#             "level": "DEBUG",
#             "class": "rq.utils.ColorizingStreamHandler",
#             "formatter": "rq_console",
#             "exclude": ["%(asctime)s"],
#         },
#         # If you use sentry for logging
#         'sentry': {
#             'level': 'ERROR',
#             'class': 'raven.contrib.django.handlers.SentryHandler',
#         },
#     },
#     'loggers': {
#         "rq.worker": {
#             "handlers": ["rq_console", "sentry"],
#             "level": "DEBUG"
#         },
#     }
# }
#
# RAVEN_CONFIG = {
#     'dsn': 'sync+{}'.format(os.environ.get('SENTRY_URL')),
# }
