import uuid
from django.db import models
from django.utils.timezone import now
from datetime import timedelta
from .utils import generate_session_key, hash_this, getClientIP, getUserAgent
from security.encoding import b64encode, b64decode


class SessionManager(models.Manager):
    """Manages the sessions for the users
    - Create a session: Key generation and expiry
    - Delete a session: Invalidating sessions
    - Get a session: Retrieve a session by key, user, or id
    """

    def __init__(self):
        super().__init__()
        # Session expiry in days
        self.KEY_EXPIRE_IN_DAYS = 30
        # Refresh the session before it expires during authentication
        self.KEY_REFERSH_IN_DAYS = 14

    def create_session(self, user, request):
        """Primary use case: Create a session on signup/login

        Args:
            user (User): User to create session for.
            request (HttpRequest): To note the IP and User-Agent.

        Returns:
            tuple(key: str, session: Session)
        """
        key = generate_session_key()
        session = self.create(
            id=uuid.uuid4(),
            user=user,
            token=hash_this(key),
            ip=getClientIP(request),
            ua=getUserAgent(request),
            expire_at=now() + timedelta(days=self.KEY_EXPIRE_IN_DAYS)
        )
        return b64encode(key), session

    def delete_session(self, user, session_id):
        """Primary use case: Logout a user

        Args:
            user (User): The User model object
            session_id (uuid): The row id of the session
        """
        try:
            session = self.get(user=user, id=session_id, valid=True)
            if session.valid:
                session.valid = False
                session.updated_at = now()
                session.save()
        except Exception as e:
            return None
        return None

    def authenticate_session(self, key):
        """This function authenticates a user request

        Args:
            key (str): Session key

        Returns:
            Session or None
        """
        try:
            key = b64decode(key)
            session = self.select_related(
                'user').get(token=hash_this(key), valid=True)
            if not session.valid:
                return None
            if session.expire_at < now():
                session.valid = False
                session.updated_at = now()
                session.save()
                return None
            elif session.expire_at + timedelta(days=self.KEY_REFERSH_IN_DAYS) < now():
                # If the session is about to expire, refresh it
                session.expire_at = now() + timedelta(days=self.KEY_EXPIRE_IN_DAYS)
                session.updated_at = now()
                session.save()
            return session
        except Exception as e:
            return None

    def get_session_if_valid(self, user, session_id):
        """Get session if it is valid and not expired.

        Args:
            user (User): User model object
            session_id (int): Session row id

        Returns:
            Session or None
        """
        try:
            session = self.select_related(
                'user').get(user=user, id=session_id, valid=True)
            if session.expire_at < now():
                session.valid = False
                session.save()
                return None
            return session
        except Exception as e:
            return None