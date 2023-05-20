import hashlib
import base64
# RestFramework
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import *
from .models import *
from .summer_2023_parse import parseData as summer2023Parser
from .winter_2023_parse import parseData as winter2023Parser
from .fall_2023_parse import parseData as fall2023Parser
from django.db.models import Prefetch
from datetime import datetime
from .get_seats import get_seats
import pytz

# Create your views here.


@api_view(['POST'])
def pushData(request):
    if 'key' in request.data and hashlib.sha256(request.data['key'].encode()).hexdigest() == "68f6b138e5341203035153862b65361eb47fdeee6206bd5aa6808e346b8c2047":
        if request.data['termdate'] == "202301":
            result = winter2023Parser(
                request.FILES['file'], request.data['term'], request.data['termdate'])
        elif request.data['termdate'] == "202305":
            result = summer2023Parser(
                request.FILES['file'], request.data['term'], request.data['termdate'])
        else:
            result = fall2023Parser(
                request.FILES['file'], request.data['term'], request.data['termdate'])
        return Response(data=result, status=status.HTTP_200_OK)
    else:
        return Response(errorMessage("Request could not be completed."), status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def getSectionSeats(request, crn, termdate):
    try:
        response = get_seats(crn, termdate)
        return Response(data=response, status=status.HTTP_200_OK)
    except:
        return Response(data=errorMessage("Unable to fetch information."), status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def getTerms(request):
    print(
        "["+str(datetime.now(pytz.utc))+"] DJANGO: Request for /api/terms/ by ("+request.META.get('REMOTE_ADDR')+")")
    termSerializer = TermSerializer(Terms.objects.all().values(), many=True)
    return Response(data=dict(success=True, terms=termSerializer.data), status=status.HTTP_200_OK)


def _getTermSections(sections, termid):
    # Get data from foreign keys
    result = list()
    for section in sections:
        row = dict(course=CourseSerializer(section.course).data,
                   subject=section.course.subject.name,
                   subject_id=section.course.subject.id,
                   instructor=section.instructor.name,
                   medium=section.medium.name
                   )
        schedules = section.sec_schedules
        schList = list()
        for schedule in schedules:
            schRow = dict(location=LocationSerializer(schedule.location).data)
            schList.append({**schRow, **ScheduleSerializer(schedule).data})
        result.append(
            {**row, **SectionSerializer(section).data, 'schedule': schList})
    return Response(data={'sections': result}, status=status.HTTP_200_OK)


@api_view(['GET'])
def getTermSections(request, termid):
    print("["+str(datetime.now(pytz.utc))+"] DJANGO: Request for /api/"+termid +
          "/sections/ by ("+request.META.get('REMOTE_ADDR')+")")
    sections = Sections.objects \
        .select_related('course', 'instructor', 'medium', 'term', 'course__subject') \
        .prefetch_related(
            Prefetch('schedules_set',
                     queryset=Schedules.objects.select_related(
                         'location'
                     ),
                     to_attr='sec_schedules')
        ) \
        .filter(term=termid)
    return _getTermSections(sections, termid)


@api_view(['GET'])
def getSpecificTermSections(request, termid, crns):
    print("["+str(datetime.now(pytz.utc))+"] DJANGO: Request for /api/"+termid+"/sections/" +
          crns+"/ by ("+request.META.get('REMOTE_ADDR')+")")
    crnList = base64.urlsafe_b64decode(crns).decode('utf-8').split(",")
    sections = Sections.objects \
        .select_related('course', 'instructor', 'medium', 'term', 'course__subject') \
        .prefetch_related(
            Prefetch('schedules_set',
                     queryset=Schedules.objects.select_related(
                         'location'
                     ),
                     to_attr='sec_schedules')
        ) \
        .filter(term=termid, pk__in=crnList)
    return _getTermSections(sections, termid)


@api_view(['GET'])
def getTermCourses(request, termid):
    print("["+str(datetime.now(pytz.utc))+"] DJANGO: Request for /api/"+termid +
          "/courses/ by ("+request.META.get('REMOTE_ADDR')+")")
    sections = Sections.objects.select_related(
        'course', 'course__subject').filter(term=termid).distinct('course')
    result = list()
    for section in sections:
        result.append(dict(
            subject=section.course.subject.name,
            subject_id=section.course.subject.id, **CourseSerializer(section.course).data))
    sortResult = sorted(
        result, key=lambda item: item['subject_id']+item['code'])
    return Response(data={'courses': sortResult}, status=status.HTTP_200_OK)


@api_view(['GET'])
def getTermSubjects(request, termid):
    print("["+str(datetime.now(pytz.utc))+"] DJANGO: Request for /api/"+termid +
          "/subjects/ by ("+request.META.get('REMOTE_ADDR')+")")
    sections = Sections.objects.select_related(
        'course', 'course__subject').filter(term=termid).order_by('course__subject__name').distinct('course__subject__name')
    result = list()
    for section in sections:
        result.append(SubjectSerializer(section.course.subject).data)
    return Response(data={'subjects': result}, status=status.HTTP_200_OK)


@api_view(['GET'])
def getTermInstructors(request, termid):
    print("["+str(datetime.now(pytz.utc))+"] DJANGO: Request for /api/"+termid +
          "/instructors/ by ("+request.META.get('REMOTE_ADDR')+")")
    sections = Sections.objects.select_related('instructor').filter(
        term=termid).order_by('instructor__name').distinct('instructor__name')
    result = list()
    for section in sections:
        result.append(InstructorSerializer(section.instructor).data)
    return Response(data={'instructors': result}, status=status.HTTP_200_OK)


def errorMessage(message):
    return dict(action="failed", message=message)
