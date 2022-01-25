from django.conf import settings
from django.template import loader
from django.dispatch import receiver
from django_rest_passwordreset.signals import reset_password_token_created
from lib.tasks import send_email_task


@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    html_string = loader.render_to_string('emails/reset_password.html', {
        'user': reset_password_token.user.get_full_name(),
        'reset_link': '{}reset-password/{}'.format(settings.FRONTEND_URL, reset_password_token.key)
    })
    send_email_task(reset_password_token.user.email, 'PrimalFIT: Reset Password', html_string)
