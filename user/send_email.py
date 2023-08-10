from django.core.mail import send_mail, EmailMessage, get_connection
from django.conf import settings

def send_welcome_email(email_addr):
    with get_connection(
        host=settings.EMAIL_HOST,
        port=settings.EMAIL_PORT,
        username=settings.EMAIL_HOST_USER,
        password=settings.EMAIL_HOST_PASSWORD,
        use_tls=settings.EMAIL_USE_TLS
    ) as connection:
        subject = "Welcome to CoFinder"
        email_from = settings.EMAIL_HOST_USER
        recipient_list = [email_addr, ]
        message = '''<h1>this is an automated message</h1>'''
        msg = EmailMessage(subject, message, email_from, recipient_list, connection=connection)
        msg.content_subtype = "html"
        msg.send()