import uuid
# Django
from .models import Schedules, Sections, Subjects, InstructionMediums, Instructors, Courses, Locations, Terms
import json
from uuid import UUID


def insertToDatabase(result, termdate, termname, failed):
    """
        For debugging only, comment it otherwise
    """
    # print(json.dumps(result, cls=UUIDEncoder))
    # return

    """
        Actually Prod database transformation
    """
    # Make a Term
    termUUID = uuid.uuid4()
    try:
        term = Terms.objects.get(name=termname)
        termUUID = term.id
    except Terms.DoesNotExist:
        Terms.objects.create(
            id=termUUID,
            name=termname,
            date=termdate
        )

    # Get data already in database so we dont rewrite duplicates
    inDB_instructors = list(Instructors.objects.all().values())
    inDB_courses = list(Courses.objects.all().values())
    inDB_subjects = list(Subjects.objects.all().values())
    inDB_mediums = list(InstructionMediums.objects.all().values())
    inDB_sections = list(Sections.objects.all().values())
    inDB_schedules = list(Schedules.objects.all().values())
    inDB_locations = list(Locations.objects.all().values())

    for instructor in result['instructors']:
        try:
            if instructor['name'] not in [v['name'] for v in inDB_instructors]:
                Instructors.objects.create(
                    id=instructor['id'], name=instructor['name'])
        except Exception as e:
            print(e)
    for medium in result['mediums']:
        try:
            if medium['name'] not in [v['name'] for v in inDB_mediums]:
                InstructionMediums.objects.create(id=medium['id'],
                                                  name=medium['name'])
        except Exception as e:
            print(e)
    for subject in result['subjects']:
        try:
            if subject['name'] not in [v['name'] for v in inDB_subjects]:
                Subjects.objects.create(id=subject['id'], name=subject['name'])
        except Exception as e:
            print(e)
    for course in result['courses']:
        try:
            if course['code']+course['name'] not in [v['code']+v['name'] for v in inDB_courses]:
                Courses.objects.create(id=course['id'],
                                       code=course['code'],
                                       name=course['name'],
                                       credits=course['credits'],
                                       subject=Subjects.objects.get(
                                           id=course['subject']),
                                       prereqs=course['prereqs'],
                                       coreqs=course['coreqs'],
                                       note=course['note'])
        except Exception as e:
            print(e)
    for location in result['locations']:
        try:
            if location['campus']+location['building']+location['room'] not in [v['campus']+v['building']+v['room'] for v in inDB_locations]:
                Locations.objects.create(id=location['id'],
                                         campus=location['campus'],
                                         building=location['building'],
                                         room=location['room'])
        except Exception as e:
            print(e)
    for section in result['sections']:
        try:
            if section['crn'] not in [v['crn'] for v in inDB_sections]:
                Sections.objects.create(crn=section['crn'],
                                        instructor=Instructors.objects.get(
                                            id=section['instructor']),
                                        name=section['name'],
                                        course=Courses.objects.get(
                                            id=section['course']),
                                        term=Terms.objects.get(id=termUUID),
                                        medium=InstructionMediums.objects.get(
                                            id=section['medium']),
                                        is_lab=section['is_lab'],
                                        enrolled=section['enrolled'],
                                        capacity=section['capacity'],
                                        note=section['note'])
        except Exception as e:
            print(e)
    for schedule in result['schedules']:
        try:
            if str(schedule['crn'])+str(schedule['time_start'])+str(schedule['time_end'])+str(schedule['date_start'])+str(schedule['date_end']) not in [str(v['crn_id'])+str(v['time_start'])+str(v['time_end'])+str(v['date_start'])+str(v['date_end']) for v in inDB_schedules]:
                Schedules.objects.create(id=schedule['id'],
                                         location=Locations.objects.get(
                                             id=schedule['location']),
                                         crn=Sections.objects.get(
                                             crn=schedule['crn']),
                                         weekday=schedule['weekday'],
                                         time_start=schedule['time_start'],
                                         time_end=schedule['time_end'],
                                         date_start=schedule['date_start'],
                                         date_end=schedule['date_end'],
                                         is_weekly=schedule['is_weekly'])
        except Exception as e:
            print(e)

    return dict(message="All data was imported." if len(failed) < 1 else "Some data could not be imported.",
                failed=failed)


class UUIDEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, UUID):
            # if the obj is uuid, we simply return the value of uuid
            return obj.hex
        return json.JSONEncoder.default(self, obj)
