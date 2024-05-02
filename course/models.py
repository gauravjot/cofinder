from django.db import models
from .managers import *

# Create your models here.


class Instructors(models.Model):
    name = models.CharField(max_length=96, primary_key=True)

    objects = InstructorManager()

    def __str__(self):
        return "%s" % (self.name)


class Subjects(models.Model):
    code = models.CharField(max_length=8, primary_key=True)
    name = models.CharField(max_length=96)

    objects = SubjectManager()

    def __str__(self):
        return "%s" % (self.name)


class Terms(models.Model):
    code = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=32)

    objects = TermManager()

    def __str__(self):
        return "%s" % (self.name)


class Courses(models.Model):
    # primary key is subject code + course code
    code = models.CharField(max_length=16, primary_key=True)
    name = models.CharField(max_length=192)
    credits = models.FloatField()
    subject = models.ForeignKey(Subjects, on_delete=models.CASCADE)
    prereqs = models.TextField(null=True)
    coreqs = models.TextField(null=True)
    note = models.TextField(null=True)

    objects = CourseManager()

    def __str__(self):
        return "%s %s - %s (%s)" % (self.subject, self.code, self.name, self.credits)


class InstructionMediums(models.Model):
    code = models.CharField(max_length=8, primary_key=True)
    name = models.CharField(max_length=128)

    objects = InstructionMediumManager()

    def __str__(self):
        return "%s" % (self.name)


class Sections(models.Model):
    STATUS_CHOICES = (
        ('Open', 'Open'),
        ('Waitlist', 'Waitlist'),
        ('Full', 'Full')
    )
    hash = models.CharField(max_length=40)
    crn = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=16)
    instructor = models.CharField(max_length=1000,null=True)
    term = models.ForeignKey(Terms, on_delete=models.CASCADE)
    course = models.ForeignKey(Courses, on_delete=models.CASCADE)
    medium = models.ForeignKey(
        InstructionMediums, on_delete=models.SET_NULL, null=True)
    is_active = models.BooleanField(default=True)
    is_lab = models.BooleanField(default=False)
    no_auto_update = models.BooleanField(default=False)
    status = models.CharField(max_length=16, null=True,
                              choices=STATUS_CHOICES, default='Open')
    enrolled = models.IntegerField(default=0)
    capacity = models.IntegerField(default=0)
    waitlist = models.IntegerField(default=0)
    note = models.TextField(null=True)
    schedule = models.JSONField(null=True)
    locations = models.JSONField(null=True)

    objects = SectionManager()

    def __str__(self):
        return "%s" % (self.crn)
