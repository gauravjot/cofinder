from rest_framework import serializers
from .models import *


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
        fields = ['crn', 'name', 'is_active', 'is_lab', 'status', 'enrolled',
                  'capacity', 'waitlist', 'locations', 'schedule', 'note']


class InstructionMediumSerializer(serializers.ModelSerializer):
    class Meta:
        model = InstructionMediums
        fields = ['name']


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subjects
        fields = ['code', 'name']


class TermSerializer(serializers.ModelSerializer):
    class Meta:
        model = Terms
        fields = ['code', 'name']
