from .models import Session
from rest_framework import serializers


class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = ['id', 'token', 'user', 'expire_at',
                  'valid', 'created_at', 'updated_at', 'ip', 'ua']
        extra_kwargs = {
            'token': {'required': True, 'write_only': True},
            'user': {'required': True},
        }