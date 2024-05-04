from .welcome_template import template
from cofinder.settings import getEmailConnection
from django.core.mail import send_mail
from decouple import config


def send_welcome_email(email_addr, username):
    try:
        with getEmailConnection() as connection:
            subject = 'Welcome to CoFinder!'
            from_email = config('SMTP_DEFAULT_SEND_FROM')
            html_message = template(username)
            message = f"Hello {username},\n\nWelcome to CoFinder. Thank you for joining the platform!\n\nCoFinder Team"
            return send_mail(subject=subject,
                             message=message,
                             html_message=html_message,
                             from_email=from_email,
                             recipient_list=[email_addr,],
                             connection=connection)
    except:
        pass
