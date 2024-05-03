from .welcome_template import template
from cofinder.settings import getEmailConnection
from decouple import config


def send_welcome_email(email_addr, username):
    try:
        with getEmailConnection() as connection:
            subject = 'Welcome to CoFinder!'
            email_from = config('SMTP_DEFAULT_SEND_FROM')
            recipient_list = [email_addr, ]
            message = template(username)
            msg = EmailMessage(subject, message, email_from,
                            recipient_list, connection=connection)
            msg.content_subtype = "html"
            msg.send()
    except:
        pass
