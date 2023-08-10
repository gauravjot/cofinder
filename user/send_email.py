from django.core.mail import EmailMessage, get_connection
from django.conf import settings
from .welcome_template import template


def send_welcome_email(email_addr, username):
    with get_connection(
        host=settings.EMAIL_HOST,
        port=settings.EMAIL_PORT,
        username=settings.EMAIL_HOST_USER,
        password=settings.EMAIL_HOST_PASSWORD,
        use_tls=settings.EMAIL_USE_TLS
    ) as connection:
        subject = settings.EMAIL_WELCOME_EMAIL_SUBJECT
        email_from = settings.EMAIL_SEND_EMAIL_ADDR
        recipient_list = [email_addr, ]
        message = template(username)
        msg = EmailMessage(subject, message, email_from,
                           recipient_list, connection=connection)
        msg.content_subtype = "html"
        msg.send()
