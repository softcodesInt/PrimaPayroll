from primerfitapi.settings.base import *  # NOQA (ignore all errors on this line)

DEBUG = True

PAGE_CACHE_SECONDS = 1

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'primerfitapi',
        'USER': 'primerfitapi_dev',
        'PASSWORD': 'password',
        'HOST': 'localhost',
        'PORT': 5432,
        'ATOMIC_REQUESTS': True
    }
}

# REST_FRAMEWORK['EXCEPTION_HANDLER'] = 'django_rest_logger.handlers.rest_exception_handler'  # NOQA (ignore all errors on this line)

# ######### RQ #######
RQ_QUEUES = {
    'default': {
        'URL': os.getenv('REDISTOGO_URL', 'redis://localhost:6379/0'), # If you're on Heroku
    },
    'with-sentinel': {
        'SENTINELS': [('localhost', 26736), ('localhost', 26737)],
        'MASTER_NAME': 'redismaster',
        'DB': 0,
        'PASSWORD': 'secret',
        'SOCKET_TIMEOUT': None,
        'CONNECTION_KWARGS': {
            'socket_connect_timeout': 0.3
        },
    },
    'high': {
        'URL': os.getenv('REDISTOGO_URL', 'redis://localhost:6379/0'), # If you're on Heroku
        'DEFAULT_TIMEOUT': 500,
    },
    'low': {
        'URL': os.getenv('REDISTOGO_URL', 'redis://localhost:6379/0'), # If you're on Heroku
    }
}

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "rq_console": {
            "format": "%(asctime)s %(message)s",
            "datefmt": "%H:%M:%S",
        },
    },
    "handlers": {
        "rq_console": {
            "level": "DEBUG",
            "class": "rq.utils.ColorizingStreamHandler",
            "formatter": "rq_console",
            "exclude": ["%(asctime)s"],
        },
        # If you use sentry for logging
        'sentry': {
            'level': 'ERROR',
            'class': 'raven.contrib.django.handlers.SentryHandler',
        },
    },
    'loggers': {
        "rq.worker": {
            "handlers": ["rq_console", "sentry"],
            "level": "DEBUG"
        },
    }
}

LOGGER_EXCEPTION = None

CORS_ORIGIN_ALLOW_ALL = True

# ###### EMAIL ###########
SENDER_EMAIL = 'payroll@softcodes.com.ng'
SENDER_PASSWORD = 'easycodes'
FRONTEND_URL = 'http://127.0.0.1:3000/'

