from django.db import models
from user.models import User
from django.utils.timezone import now
from django.db import models
from .managers import SessionManager


class Session(models.Model):
    id = models.UUIDField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=64)
    valid = models.BooleanField(default=True)
    ip = models.GenericIPAddressField()
    ua = models.TextField()
    created_at = models.DateTimeField(default=now)
    updated_at = models.DateTimeField(default=now)
    expire_at = models.DateTimeField()

    objects = SessionManager()

    def __str__(self):
        return f"{self.pk}"
