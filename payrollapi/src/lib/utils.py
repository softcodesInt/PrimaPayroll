import json, datetime
from uuid import UUID
from disposable_email_checker.validators import validate_disposable_email
from django.core.exceptions import ValidationError, FieldError
from django.core.validators import validate_email as django_validate_email
from django.db import transaction, models
from rest_framework.exceptions import APIException
from rest_framework import pagination
from rest_framework.response import Response
from rest_framework import status
from django.forms import model_to_dict
from django.core.serializers.json import DjangoJSONEncoder
from django.conf import settings

from accounts.models import AdminUser


def set_cookie(response, key, value, days_expire=7):
    if days_expire is None:
        max_age = 365 * 24 * 60 * 60  # one year
    else:
        max_age = days_expire * 24 * 60 * 60
    expires = datetime.datetime.strftime(
        datetime.datetime.utcnow() + datetime.timedelta(seconds=max_age),
        "%a, %d-%b-%Y %H:%M:%S GMT",
    )
    response.set_cookie(
        key,
        value,
        httponly=True,
        max_age=max_age,
        expires=expires,
        domain=settings.SESSION_COOKIE_DOMAIN,
        secure=settings.SESSION_COOKIE_SECURE or None,
    )


class ExtendedEncoder(DjangoJSONEncoder):
    def default(self, o):
        if isinstance(o, models.Model):
            return model_to_dict(o)

        return super().default(o)


def serialize_data(data):
    return json.dumps(data, cls=ExtendedEncoder)


class CustomPagination(pagination.PageNumberPagination):
    def get_paginated_response(self, data):
        return Response({
            'count': self.page.paginator.count,
            'total_pages': self.page.paginator.num_pages,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data
        })


def validate_email(value):
    """Validate a single email."""
    if not value:
        return False
    # Check the regex, using the validate_email from django.
    try:
        django_validate_email(value)
    except ValidationError:
        return False
    else:
        # Check with the disposable list.
        try:
            validate_disposable_email(value)
        except ValidationError:
            return False
        else:
            return True


class AtomicMixin(object):
    """
    Ensure we rollback db transactions on exceptions.

    From https://gist.github.com/adamJLev/7e9499ba7e436535fd94
    """

    @transaction.atomic()
    def dispatch(self, *args, **kwargs):
        """Atomic transaction."""
        return super(AtomicMixin, self).dispatch(*args, **kwargs)

    def handle_exception(self, *args, **kwargs):
        """Handle exception with transaction rollback."""
        response = super(AtomicMixin, self).handle_exception(*args, **kwargs)

        if getattr(response, 'exception'):
            # We've suppressed the exception but still need to rollback any transaction.
            transaction.set_rollback(True)

        return response


class UserNotInCompanyException(APIException):
    status_code = status.HTTP_403_FORBIDDEN
    default_detail = 'The user does not belong to any company'


def get_descriptive_error_message(e):
    return e.args[0].split('\n')[0]


class BaseManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_active=True)


class TimeStampedModel(models.Model):
    date_created = models.DateTimeField(auto_now_add=True, null=True)
    date_updated = models.DateTimeField(auto_now=True, null=True)

    objects = BaseManager()

    class Meta:
        abstract = True

    def log_class(self):
        raise NotImplemented("This method must be created")

    def is_deletable(self):
        for rel in self._meta.get_fields():
            try:
                if type(self.log_class()) == list:
                    if rel.related_model in self.log_class():    # exclude log model
                        continue
                if rel.related_model == self.log_class():  # exclude log model
                    continue
                if rel.related_model.objects.filter(**{rel.field.name: self}, is_active=True).exists():
                    return False
            except AttributeError:
                pass
            except FieldError as e:
                if rel.related_model == AdminUser and "Cannot resolve keyword 'is_active'" in str(e):
                    pass
                else:
                    raise
        return True


def is_valid_uuid(uuid_to_test, version=4):
    """
    Check if uuid_to_test is a valid UUID.

     Parameters
    ----------
    uuid_to_test : str
    version : {1, 2, 3, 4}

     Returns
    -------
    `True` if uuid_to_test is a valid UUID, otherwise `False`.

     Examples
    --------
    >>> is_valid_uuid('c9bf9e57-1685-4c89-bafb-ff5af830be8a')
    True
    >>> is_valid_uuid('c9bf9e58')
    False
    """
    try:
        uuid_obj = UUID(uuid_to_test, version=version)
    except ValueError:
        return False
    return str(uuid_obj) == uuid_to_test
