from pathlib import Path
from decouple import config
from django.core.mail import get_connection


"""
#################################################################
#                                                               #
#                       DJANGO SETTINGS                         #
#             Possibly no need to change anything               #
#                      Edit .env instead                        #
#                                                               #
#################################################################
"""


BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = config('SECRET_KEY')

# Set to False in production
DEBUG = config('DEBUG', default=False, cast=bool)

# Everyone is allowed to make requests to this server
ALLOWED_HOSTS = ['*']

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'django_extensions',

    'course',
    'user',
    'user.user_session',
    'user.user_schedule',
    'rest_framework',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',


    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    
    "cofinder.middlewares.APIRequestFormatMiddleware",
    "cofinder.middlewares.RequestOriginMiddleware",
    "user.user_session.middlewares.SessionMiddleware",
]

ROOT_URLCONF = 'cofinder.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'cofinder.wsgi.application'

# CORS
# https://github.com/adamchainz/django-cors-headers
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    config('FRONTEND_URL', default='http://localhost:5173'),
]
CORS_ALLOW_METHODS = (
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
)
CORS_ALLOW_HEADERS = (
    "accept",
    "authorization",
    "content-type",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
)
CORS_ORIGIN_WHITELIST = CORS_ALLOWED_ORIGINS

# Security
CSRF_TRUSTED_ORIGINS = CORS_ALLOWED_ORIGINS
SECURE_SSL_REDIRECT = config('SECURE_SSL_REDIRECT', default=True, cast=bool)
SECURE_FRAME_DENY = False

# Set the origins that API will respond to.
# 1. To set all origins, use value ['*']
# 2. To add additional, simply add them to the list without trailing backslash
#      Example ['https://google.com', 'http://google.com']
# (Used in cofinder.middlewares.RequestOriginMiddleware)
ALLOW_ORIGINS = [config('FRONTEND_URL'),]

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USERNAME'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST'),
        'PORT': config('DB_PORT'),
    }
}


# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = False
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Email
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'


# Email Connection
def getEmailConnection():
    if config('SMTP_USE_TLS', default=True, cast=bool) == True:
        return get_connection(
            host=config('SMTP_HOST'),
            port=config('SMTP_PORT'),
            username=config('SMTP_USER'),
            password=config('SMTP_PASSWORD'),
            use_tls=True,
        )
    else:
        return get_connection(
            host=config('SMTP_HOST'),
            port=config('SMTP_PORT'),
            username=config('SMTP_USER'),
            password=config('SMTP_PASSWORD'),
            use_ssl=True,
        )
