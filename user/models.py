from django.db import models

# Create your models here.


class User(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=128)
    email = models.CharField(max_length=128)
    joined = models.DateTimeField(auto_now_add=True)
    schedule = models.JSONField()
    provider = models.IntegerField(default=1)
    provider_connected = models.BooleanField(default=True)
    provider_uid = models.BigIntegerField(default=0)
    provider_access_token = models.CharField(max_length=48)
    provider_refresh_token = models.CharField(max_length=48)
    provider_token_expiry = models.BigIntegerField(default=0)

    def __str__(self):
        return "%s %s" % (self.id, self.name)


class Session(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=128)
    created = models.DateTimeField(auto_now_add=True)
    valid = models.BooleanField(default=True)
    ip = models.GenericIPAddressField()
    ua = models.TextField()

    def __str__(self):
        return "%s %s" % (self.id, self.user)


class SingleUseToken(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=128)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "%s %s" % (self.id, self.user)
