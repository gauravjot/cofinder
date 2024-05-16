from rest_framework import permissions


class HasSessionActive(permissions.BasePermission):
    message = 'Unauthorized!'
    """
    Permission to check if user session is present
    """

    def has_permission(self, request, view):
        return True if request.active_session else False