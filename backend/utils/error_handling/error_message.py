from django.http import JsonResponse

# https://datatracker.ietf.org/doc/html/rfc7807


class ErrorMessage():
    """Error message class that follows RFC7807 standard. It ignores `type` field and uses `code` instead.

    Attributes:
        title (str): A short summary of the problem type.
        detail (str): Explanation specific to this occurrence of the problem.
        status (int): HTTP code, e.g., 400, 404, 500. Use `status` from `rest_framework`.
        instance (str): URL that faced the problem. Get this from request.
        code (str): Custom code to identify the error. Optional.

    Usage:
        ```
        from utils import error_handling
        from utils.error_handling.error_message import ErrorMessage
        error = ErrorMessage(
            title='Incorrect credentials',
            detail='Username or password is incorrect',
            status=400,
            instance=request.build_absolute_uri(),
            code='AUTH400'
        )
        return error.to_response()
        ```
    """

    def __init__(self, title, detail, status, instance, code=None):
        # err_type is a URL that defines the problem type.
        # title is a short summary of the problem type.
        self.title = title
        # detail is explanation specific to this occurrence of the problem.
        self.detail = detail
        # status is the HTTP code
        self.status = status
        # instance is the URL that faced the problem
        self.instance = instance
        self.code = code

    def to_response(self):
        response = JsonResponse({
            'title': self.title,
            'detail': self.detail,
            'status': self.status,
            'instance': self.instance,
            'code': self.code
        }, status=self.status)
        # Content type: problem+json
        response['Content-Type'] = 'application/problem+json'
        return response

    def serialize(self):
        return {
            'title': self.title,
            'detail': self.detail,
            'status': self.status,
            'instance': self.instance,
            'code': self.code
        }