from course.api import get_detailed_section_for_crns
from .models import UserSchedule


def get_detailed_schedule(user):
    """
    Get the detailed schedule for a user
    """
    schedules = UserSchedule.objects.get_all_schedule(user)
    crn_list = [schedule.section.pk for schedule in schedules]
    deatiled_schedule = get_detailed_section_for_crns(crn_list)
    return deatiled_schedule
