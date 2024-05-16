import base64


def b64encode(data):
    return base64.urlsafe_b64encode(data.encode('utf-8')).decode('utf-8')


def b64decode(data):
    return base64.urlsafe_b64decode(data.encode('utf-8')).decode('utf-8')