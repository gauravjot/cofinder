from django.db import models


class UserScheduleManager(models.Manager):
    def __init__(self):
        super().__init__()

    def add_schedule(self, term, user, section):
        schedule = self.create(
            user=user,
            term=term,
            section=section
        )
        return schedule

    def remove_schedule(self, term, user, section):
        schedule = self.get(
            user=user,
            term=term,
            section=section
        )
        schedule.delete()
        return schedule

    def get_all_schedule(self, user):
        return self.filter(user=user).order_by('term__code')
