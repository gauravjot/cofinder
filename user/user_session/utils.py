import hashlib
from secrets import token_urlsafe


# Generate session key
def generate_session_key():
    # This token length can be of any size as sha256 is used
    # and saved in database as fixed 64 characters. At least
    # 64 characters key is recommended.
    return token_urlsafe(64)


# Hash Function for key
def hash_this(string):
    return hashlib.sha256(str(string).encode('utf-8')).hexdigest()


# Get Client IP Address
def getClientIP(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


# Get User Agent
def getUserAgent(request):
    return request.META.get('HTTP_USER_AGENT')