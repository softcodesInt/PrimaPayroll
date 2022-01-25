import uuid
from datetime import timedelta

from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from django.dispatch import receiver
from django.template import loader
from django_rest_passwordreset.signals import reset_password_token_created
from lib.tasks import send_email_task


class MyUserManager(BaseUserManager):
    def _create_user(self, email, first_name, last_name, is_staff, is_superuser, **extra_fields):
        """
        Create and save an User with the given email, password, name and phone number.

        :param email: string
        :param password: string
        :param first_name: string
        :param last_name: string
        :param is_staff: boolean
        :param is_superuser: boolean
        :param extra_fields:
        :return: User
        """
        now = timezone.now()
        email = self.normalize_email(email).lower()
        user = self.model(email=email,
                          first_name=first_name,
                          last_name=last_name,
                          is_staff=is_staff,
                          is_active=True,
                          is_superuser=is_superuser,
                          last_login=now,
                          date_joined=now, **extra_fields)
        #self.email = self.email.lower()
        user.save(using=self._db)

        return user

    def create_user(self, email, first_name, last_name, **extra_fields):
        """
        Create and save an User with the given email, password and name.

        :param email: string
        :param first_name: string
        :param last_name: string
        :param password: string
        :param extra_fields:
        :return: User
        """
        return self._create_user(email, first_name, last_name, is_staff=False, is_superuser=False,
                                 **extra_fields)

    def create_superuser(self, email, first_name='', last_name='', password=None, **extra_fields):
        """
        Create a super user.

        :param email: string
        :param first_name: string
        :param last_name: string
        :param password: string
        :param extra_fields:
        :return: User
        """
        return self._create_user(email, password, first_name, last_name, is_superuser=True,
                                 **extra_fields)


class User(AbstractBaseUser):
    """
    Model that represents an user.

    To be active, the user must register and confirm his email.
    """

    ROLE_VIEWER = "VIEWER"
    ROLE_OPERATOR = "OPERATOR"
    ROLE_ADMIN = "ADMIN"

    ROLE_CHOICES = (
        (ROLE_VIEWER, "Viewer"),
        (ROLE_OPERATOR, "Operator"),
        (ROLE_ADMIN, "Admin")
    )

    # we want primary key to be called id so need to ignore pytlint
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  # pylint: disable=invalid-name

    first_name = models.CharField(_('First Name'), max_length=50)
    last_name = models.CharField(_('Last Name'), max_length=50)
    email = models.EmailField(_('Email address'), unique=True)
    profile_picture = models.ImageField(upload_to='accounts', null=True, blank=True)

    activation_key = models.UUIDField(unique=True, default=uuid.uuid4)  # email

    is_staff = models.BooleanField(_('staff status'), default=False)
    is_superuser = models.BooleanField(_('superuser status'), default=False)
    is_active = models.BooleanField(_('active'), default=True)

    role = models.CharField(choices=ROLE_CHOICES, max_length=14)

    date_joined = models.DateTimeField(_('date joined'), auto_now_add=True)
    date_updated = models.DateTimeField(_('date updated'), auto_now=True)

    USERNAME_FIELD = 'email'

    objects = MyUserManager()

    def __str__(self):
        """
        Unicode representation for an user model.

        :return: string
        """
        return self.email

    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        return self.is_superuser

    def get_full_name(self):
        """
        Return the first_name plus the last_name, with a space in between.

        :return: string
        """
        return "{0} {1}".format(self.first_name, self.last_name)

    def get_short_name(self):
        """
        Return the first_name.

        :return: string
        """
        return self.first_name

    def activation_expired(self):
        """
        Check if user's activation has expired.

        :return: boolean
        """
        return self.date_joined + timedelta(days=settings.ACCOUNT_ACTIVATION_DAYS) < timezone.now()

    def confirm_email(self):
        """
        Confirm email.

        :return: boolean
        """
        if not self.activation_expired() and not self.confirmed_email:
            self.confirmed_email = True
            self.save()
            return True
        return False

    class Meta:
        ordering = ['-date_updated']


@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    html_string = loader.render_to_string('emails/reset_password.html', {
        'user': reset_password_token.user.get_full_name(),
        'reset_link': '{}reset-password/{}'.format(settings.FRONTEND_URL, reset_password_token.key)
    })
    send_email_task(reset_password_token.user.email, 'PrimalFIT: Reset Password', html_string)
