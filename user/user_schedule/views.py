from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from user.permissions import HasSessionActive
from user.user_session.api import get_active_session
from course.api import get_section, get_term

from .serializers import *
from .models import UserSchedule
from .api import get_detailed_schedule


@api_view(['POST'])
@permission_classes([HasSessionActive])
def add(request):
    """ Add schedule(s) to user

    request.data:
        schedule (list): List of schedules to add

    ```json
    {
        "schedule": [
            {
                "term": "202401",
                "section": 12039
            },
            {
                "term": "202405",
                "section": 23201
            }
        ]
    }
    ```

    Returns:
        204 (No Content)
    """
    add_request = AddRequestSerializer(data=request.data)
    if add_request.is_valid():
        for schedule in add_request.data['schedule']:
            try:
                UserSchedule.objects.add_schedule(
                    term=get_term(schedule['term']),
                    user=get_active_session(request).user,
                    section=get_section(schedule['section'])
                )
            except:
                pass
        schedules = get_detailed_schedule(get_active_session(request).user)
        return Response(data=schedules, status=204)
    return Response(status=400)


@api_view(['POST'])
@permission_classes([HasSessionActive])
def remove(request):
    """ Remove schedule(s) from user

    request.data:
        schedule (list): List of schedules to remove

    ```json
    {
        "schedule": [
            {
                "term": "202401",
                "section": 12039
            },
            {
                "term": "202405",
                "section": 23201
            }
        ]
    }
    ```
    Returns:
        204 (No Content)
    """
    remove_request = RemoveRequestSerializer(data=request.data)
    if remove_request.is_valid():
        for schedule in remove_request.data['schedule']:
            try:
                UserSchedule.objects.remove_schedule(
                    term=get_term(schedule['term']),
                    user=get_active_session(request).user,
                    section=get_section(schedule['section'])
                )
            except:
                pass
        schedules = get_detailed_schedule(get_active_session(request).user)
        return Response(data=schedules, status=204)
    return Response(status=400)


@api_view(['GET'])
@permission_classes([HasSessionActive])
def get(request):
    """ Get all schedules for user

    Returns:
        list of UserSchedule
    """
    schedules = get_detailed_schedule(get_active_session(request).user)
    return Response(data=schedules, status=200)


@api_view(['POST'])
@permission_classes([HasSessionActive])
def add_from_scratch(request):
    """ Remove all exisiting schedules for user and add new schedules

    request.data:
        schedule (list): List of schedules to add

    ```json
    {
        "schedule": [
            {
                "term": "202401",
                "section": 12039
            },
            {
                "term": "202405",
                "section": 23201
            }
        ]
    }
    ```
    Returns:
        List[] : List of Detailed Sections for the added schedules
    """
    add_request = AddRequestSerializer(data=request.data)
    if add_request.is_valid():
        UserSchedule.objects.remove_all_schedule(
            get_active_session(request).user)
        for schedule in add_request.data['schedule']:
            try:
                UserSchedule.objects.add_schedule(
                    term=get_term(schedule['term']),
                    user=get_active_session(request).user,
                    section=get_section(schedule['section'])
                )
            except:
                pass
        schedules = get_detailed_schedule(get_active_session(request).user)
        return Response(data=schedules, status=204)
    return Response(status=400)
