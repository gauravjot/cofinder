from django.db import models
from django.utils.timezone import now
from course.models import Terms, Sections
from user.models import User
from .managers import UserScheduleManager


class UserSchedule(models.Model):
    id = models.AutoField(primary_key=True)
    term = models.ForeignKey(Terms, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    section = models.ForeignKey(Sections, on_delete=models.CASCADE)
    date_added = models.DateTimeField(default=now)

    objects = UserScheduleManager()

    def __str__(self):
        return "%s %s" % (self.id, self.user.name)
