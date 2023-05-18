from django.db import models

# Create your models here.


class Instructors(models.Model):
    id = models.UUIDField(primary_key=True)
    name = models.CharField(max_length=96)

    def __str__(self):
        return "%s" % (self.name)


class Subjects(models.Model):
    id = models.CharField(max_length=24, primary_key=True)
    name = models.CharField(max_length=96)

    def __str__(self):
        return "%s" % (self.name)


class Terms(models.Model):
    id = models.UUIDField(primary_key=True)
    name = models.CharField(max_length=32)
    date = models.IntegerField()
    term_ident = models.CharField(max_length=32,null=True)

    def __str__(self):
        return "%s" % (self.name)


class Courses(models.Model):
    id = models.UUIDField(primary_key=True)
    code = models.CharField(max_length=16)
    name = models.CharField(max_length=192)
    credits = models.FloatField()
    subject = models.ForeignKey(Subjects, on_delete=models.CASCADE)
    prereqs = models.TextField(null=True)
    coreqs = models.TextField(null=True)
    note = models.TextField(null=True)

    def __str__(self):
        return "%s %s - %s (%s)" % (self.subject, self.code, self.name, self.credits)


class InstructionMediums(models.Model):
    id = models.UUIDField(primary_key=True)
    name = models.CharField(max_length=128)

    def __str__(self):
        return "%s" % (self.name)


class Sections(models.Model):
    crn = models.IntegerField(primary_key=True)
    instructor = models.ForeignKey(
        Instructors, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=16)
    course = models.ForeignKey(Courses, on_delete=models.CASCADE)
    term = models.ForeignKey(Terms, on_delete=models.CASCADE)
    medium = models.ForeignKey(
        InstructionMediums, on_delete=models.SET_NULL, null=True)
    is_active = models.BooleanField(default=True)
    is_lab = models.BooleanField(default=False)
    enrolled = models.IntegerField(default=0)
    capacity = models.IntegerField(default=0)
    waitlist = models.IntegerField(default=0)
    waitlist_capacity = models.IntegerField(default=0)
    crosslist = models.IntegerField(default=0)
    crosslist_capacity = models.IntegerField(default=0)
    note = models.TextField(null=True)

    def __str__(self):
        return "%s - %s %s %s (active: %s, lab: %s)" % (self.crn, self.course.subject.id, self.course.code, self.name, self.is_active, self.is_lab)


class Locations(models.Model):
    id = models.UUIDField(primary_key=True)
    campus = models.CharField(max_length=64)
    building = models.CharField(max_length=64)
    room = models.CharField(max_length=8)

    def __str__(self):
        return "%s%s %s" % (self.campus, self.building, self.room)


class Schedules(models.Model):
    id = models.UUIDField(primary_key=True)
    location = models.ForeignKey(
        Locations, on_delete=models.SET_NULL, null=True)
    crn = models.ForeignKey(Sections, on_delete=models.CASCADE)
    is_weekly = models.BooleanField(default=True)
    weekday = models.CharField(max_length=1)
    time_start = models.IntegerField()
    time_end = models.IntegerField()
    date_start = models.IntegerField()
    date_end = models.IntegerField()

    def __str__(self):
        return "%s - %s, Weekly: %s (%s-%s, %s-%s)" % (self.crn, self.weekday, self.is_weekly, self.date_start, self.date_end, self.time_start, self.time_end)
