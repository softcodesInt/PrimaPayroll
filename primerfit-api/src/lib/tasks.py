import smtplib, ssl, json
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart

from django.conf import settings
#from django_rq import job


#@job
def send_email_task(emails, subject, template_string):
    sender_email = settings.SENDER_EMAIL
    password = settings.SENDER_PASSWORD

    receiver_email = emails

    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = sender_email
    message["To"] = receiver_email

    message_type = MIMEText(template_string, "html")

    message.attach(message_type)

    fp = open(settings.BASE_DIR + '/templates/logo.png', 'rb')
    msgImage = MIMEImage(fp.read())
    fp.close()

    # Define the image's ID as referenced above
    msgImage.add_header('Content-ID', '<logoimage>')
    message.attach(msgImage)
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
        server.login(sender_email, password)
        server.sendmail(sender_email, receiver_email, message.as_string())

