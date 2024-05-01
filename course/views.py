import base64
import hashlib
# RestFramework
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import *
from .models import *
from .get_seats import get_seats
import redis
import json
from decouple import config
from course.grabber.do_database import push

# Create your views here.


@api_view(['POST'])
def pushData(request):
    if 'password' in request.data:
        if hashlib.sha256(request.data['password'].encode("utf-8")).hexdigest() == config('DB_PUSH_PASSWORD'):
            push()
            return Response(status=204)
    return Response(status=403)


@api_view(['GET'])
def getSectionSeats(request, crn, termdate):
    try:
        response = get_seats(crn, termdate)
        return Response(data=dict(seats=response), status=status.HTTP_200_OK)
    except:
        return Response(data=errorMessage("Unable to fetch information."), status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def getTerms(request):
    termSerializer = TermSerializer(Terms.objects.all().values(), many=True)
    return Response(data=dict(success=True, terms=termSerializer.data), status=status.HTTP_200_OK)


@api_view(['GET'])
def getTermSections(request, termid):
    sections = Sections.objects.filter(term=termid).select_related("course")
    result = list()
    for section in sections:
        result.append(dict(course=CourseSerializer(section.course).data,
                           **SectionSerializer(section).data))
    return Response(data={'sections': result}, status=status.HTTP_200_OK)


@api_view(['GET'])
def getSpecificTermSections(request, termid, crns):
    crnList = base64.urlsafe_b64decode(crns).decode('utf-8').split(",")
    sections = Sections.objects.filter(
        term=termid, pk__in=crnList).select_related("course")
    result = list()
    for section in sections:
        result.append(dict(course=CourseSerializer(section.course).data,
                           **SectionSerializer(section).data))
    return Response(data={'sections': result}, status=status.HTTP_200_OK)


@api_view(['GET'])
def getTermCourses(request, termid):
    # Redis Cache check
    # r = makeRedisConn()
    # r_key = 'courses-'+termid
    # df_redis = r.get(r_key)
    # if df_redis:
    #     print("[>] Success from Upstash.")
    #     return Response(data={'courses': json.loads(df_redis)}, status=status.HTTP_200_OK)
    # Pull from Database
    sections = Sections.objects.select_related(
        'course', 'course__subject').filter(term=termid).distinct('course')
    result = list()
    for section in sections:
        result.append(dict(
            subject=section.course.subject.name,
            subject_id=section.course.subject.code, **CourseSerializer(section.course).data))
    sortResult = sorted(result, key=lambda item: item['code'])
    # Save to Redis
    # saveToRedis(r, r_key, sortResult)
    return Response(data={'courses': sortResult}, status=status.HTTP_200_OK)


@api_view(['GET'])
def getTermSubjects(request, termid):
    sections = Sections.objects.select_related(
        'course', 'course__subject').filter(term=termid).order_by('course__subject__code').distinct('course__subject__code')
    result = list()
    for section in sections:
        result.append(SubjectSerializer(section.course.subject).data)
    return Response(data={'subjects': result}, status=status.HTTP_200_OK)


@api_view(['GET'])
def getTermInstructors(request, termid):
    sections = Sections.objects.filter(term=termid).order_by(
        'instructor').distinct('instructor')
    result = list()
    for section in sections:
        if section.instructor and ';' in section.instructor:
            for instructor in section.instructor.split(';'):
                result.append({'name': instructor})
        else:
            if section.instructor:
                result.append({'name': section.instructor})
    return Response(data={'instructors': result}, status=status.HTTP_200_OK)


def errorMessage(message):
    return dict(action="failed", message=message)


def makeRedisConn():
    return redis.Redis(
        host=config('REDIS_HOST'),
        port=config('REDIS_PORT'),
        password=config('REDIS_PASSWORD'),
        ssl=True
    )


def saveToRedis(redis_conn, key, data):
    # Save to Redis
    try:
        jsd = json.dumps(data)
        if len(jsd) < 1000000:
            redis_conn.set(key, jsd, ex=600)
        else:
            print("[-] Warning:", "Not sent to Redis. Size limit exceeded.")
    except:
        print("[-] Warning:", "Redis failed to save.")
        pass
