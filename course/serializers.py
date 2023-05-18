from rest_framework import serializers
from .models import Instructors, Terms, Courses, Sections, Schedules, Locations, InstructionMediums, Subjects


class InstructorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instructors
        fields = ['name']


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Courses
        fields = ['name', 'code', 'credits', 'prereqs', 'coreqs', 'note']


class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sections
        fields = ['crn', 'name',
                  'is_active', 'is_lab', 'enrolled', 'capacity', 'waitlist', 'waitlist_capacity', 'crosslist', 'crosslist_capacity', 'note']


class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedules
        fields = ['is_weekly', 'weekday', 'time_start', 'time_end', 'date_start', 'date_end']


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Locations
        fields = ['campus', 'building', 'room']


class InstructionMediumSerializer(serializers.ModelSerializer):
    class Meta:
        model = InstructionMediums
        fields = ['name']


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subjects
        fields = ['id','name']


class TermSerializer(serializers.ModelSerializer):
    class Meta:
        model = Terms
        fields = ['id','name','date','term_ident']
