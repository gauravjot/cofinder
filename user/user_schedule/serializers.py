from .models import UserSchedule
from rest_framework import serializers


class UserScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSchedule
        fields = ['id', 'user', 'term', 'section', 'date_added']


class AddRequestSerializer(serializers.Serializer):
    schedule = serializers.ListField(
        child=serializers.DictField(
            child=serializers.IntegerField()
        )
    )


class RemoveRequestSerializer(serializers.Serializer):
    schedule = serializers.ListField(
        child=serializers.DictField(
            child=serializers.IntegerField()
        )
    )
