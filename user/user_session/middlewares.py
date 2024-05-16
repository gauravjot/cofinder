from decouple import config

from .models import Session


class SessionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.COOKIE_NAME = config('AUTH_COOKIE_NAME', default='cf_auth')

    def __call__(self, request):
        # Code to be executed for each request before
        # the view (and later middleware) are called.

        response = self.get_response(request)

        # Code to be executed for each request/response after
        # the view is called.

        return response

    def process_view(self, request, view_func, view_args, view_kwargs):
        # This gets executed before the view.
        # Get the active session
        session = self.getActiveSession(request)
        # Attach the session to the request
        request.active_session = session

    def getActiveSession(self, request):
        session = None
        # Check if auth token is present in cookies
        try:
            key = request.COOKIES.get(self.COOKIE_NAME)
            if len(key) < 48:
                raise KeyError
            session = Session.objects.authenticate_session(key)
        except (KeyError, Exception) as e:
            session = None
        return session