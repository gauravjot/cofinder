import json
from .models import User
from rest_framework import serializers


class UserResponseSerializer(serializers.ModelSerializer):
    schedule = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'schedule',
                  'joined', 'provider_uid']

    def get_schedule(self, obj):
        # json formatted string to object
        try:
            return json.loads(obj.schedule)
        except:
            return dict()
