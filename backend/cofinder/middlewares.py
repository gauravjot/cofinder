import json
from django.http import JsonResponse
from cofinder.settings import ALLOW_ORIGINS, DEBUG
from utils.error_handling.error_message import ErrorMessage


class APIRequestFormatMiddleware:
    """
    This middleware checks the request body to validate json
    for POST, PUT, and PATCH requests. If validation fails,
    the request is blocked from further processing.
    
    Place this before other app middlewares.  
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Code to be executed for each request before
        # the view (and later middleware) are called.

        response = self.get_response(request)
        # Code to be executed for each request/response after
        # the view is called.
        return response

    def process_view(self, request, view_func, view_args, view_kwargs):
        # This gets executed before the view.
        # Run on API requests only
        if request.path.startswith('/api'):
            if not self.validate_json_payload(request):
                error = ErrorMessage(
                    detail='Invalid JSON payload.',
                    status=400,
                    instance=request.build_absolute_uri(),
                    title='Invalid data provided'
                )
                return JsonResponse(
                    error.serialize(),
                    status=400)

    def validate_json_payload(self, request):
        if request.method in ['POST', 'PUT', 'PATCH']:
            try:
                request.data = json.loads(request.body)
                return True
            except json.JSONDecodeError:
                return False
        return True


class RequestOriginMiddleware:
    """
    This middleware looks at the Origin header and to check
    if the request is originating from desired frontend. It
    will stop any further request processing if none of the
    cofinder.settings.ALLOW_ORIGINS match with the request
    Origin.
    
    Place this before other middlewares for application.   
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Code to be executed for each request before
        # the view (and later middleware) are called.

        response = self.get_response(request)
        # Code to be executed for each request/response after
        # the view is called.
        return response

    def process_view(self, request, view_func, view_args, view_kwargs):
        # This gets executed before the view.
        # Run on API requests only
        if request.path.startswith('/api'):
            # If Token authentication is used that means
            # the API is accessed by android or iOS app.
            # In that case, we don't need to check the origin.
            # Otherwise check the origin header!
            if not self.validate_origin_header(request):
                error = ErrorMessage(
                    detail='You are not authorized to perform this action.',
                    status=400,
                    instance=request.build_absolute_uri(),
                    title='Action not allowed.'
                )
                return JsonResponse(
                    error.serialize(),
                    status=400)

    def validate_origin_header(self, request):
        # If DEBUG is True, allow all origins
        if DEBUG:
            return True
        # If ALLOW_ORIGINS is set to '*', allow all origins
        if ALLOW_ORIGINS[0] == '*':
            return True
        # Check if the request origin is in ALLOW_ORIGINS
        if request.headers.get('Origin') in ALLOW_ORIGINS:
            return True
        return False