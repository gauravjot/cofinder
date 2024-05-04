##########################################################
#
#                   Outward facing API
#
# This file should ideally be the only export from this
# module/app. (Except permissions.py, middlewares.py)
#
# Using imports from other files may breach security.
#
# If you need to use any other function from this package,
# consider making a new function here and calling that.
#
##########################################################

from .models import Session
from .serializers import SessionSerializer


def create_session(user, request) -> tuple[str, Session]:
    """
    Create a new session for the user

    Args:
        user: User
        request: HttpRequest

    Returns: tuple[key, session]
        key: str
        session: Session
    """
    return Session.objects.create_session(user, request)


def delete_session(user, session_id):
    """
    Delete all sessions for the user

    Args:
        user: User
        session_id: int

    Returns: None
    """
    Session.objects.delete_session(user, session_id)


def get_session_if_valid(user, session_id, serialized=False):
    """
    Get session for the user given the session_id

    Args:
        user: User
        session_id: int
    """
    session = Session.objects.get_session_if_valid(user, session_id)
    if session is not None and serialized:
        return SessionSerializer(session).data
    return session


def get_all_sessions(user, serialized=False):
    sessions = Session.filter(user=user)
    if serialized:
        return SessionSerializer(sessions, many=True).data
    return sessions


def get_all_active_sessions(user, serialized=False):
    sessions = Session.filter(user=user, valid=True)
    if serialized:
        return SessionSerializer(sessions, many=True).data
    return sessions


def delete_all_sessions(user):
    Session.filter(user=user, valid=True).delete()
    return None


def delete_all_sessions_except(user, session_id):
    Session.filter(user=user, valid=True).exclude(pk=session_id).delete()
    return None