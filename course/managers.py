from django.db import models
import hashlib
import json


class TermManager(models.Manager):
    def __init__(self):
        super().__init__()

    def create_term(self, code, name):
        if self.model.objects.filter(code=code).exists():
            # Term already exists
            return None
        term = self.model(code=code, name=name)
        term.save()
        return term


class InstructorManager(models.Manager):
    def __init__(self):
        super().__init__()

    def create_instructor(self, name):
        if self.model.objects.filter(name=name).exists():
            # Instructor already exists
            return None
        instructor = self.model(name=name)
        instructor.save()
        return instructor


class SubjectManager(models.Manager):
    def __init__(self):
        super().__init__()

    def create_subject(self, code, name):
        if self.model.objects.filter(code=code).exists():
            # Subject already exists
            return None
        subject = self.model(code=code, name=name)
        subject.save()
        return subject


class CourseManager(models.Manager):
    def __init__(self):
        super().__init__()

    def create_course(self, code, name, credits, subject_code, prereqs, coreqs, note):
        id = f'{subject_code} {code}'
        if self.model.objects.filter(id=id).exists():
            # Course already exists
            return None
        course = self.model(id=id, name=name, credits=credits,
                            subject=subject_code, prereqs=prereqs, coreqs=coreqs, note=note)
        course.save()
        return course


class SectionManager(models.Manager):
    def __init__(self):
        super().__init__()

    def get_hash(self, data, schedule, locations):
        # data is a dictionary that has all the fields
        return hashlib.sha1(f'{json.dumps(data)}{json.dumps(schedule)}{json.dumps(locations)}'.encode()).hexdigest()

    def create_section(self, data, schedule, locations):
        """ Create Section object

        Args:
            `data` (dict): use `.utils.setup_section_data()` method
            `schedule` (_type_): use `.utils.setup_schedule_for_section()` method
            `locations` (_type_): use `.utils.setup_location_for_section()` method

        Returns:
            Section or None
        """
        # Create a unique id for the section
        h = self.get_hash(data, schedule, locations)
        if self.model.objects.filter(hash=h).exists():
            # Section already exists and is up to date
            return None
        # Create/Update the object
        section = self.model(
            hash=h,
            crn=data["crn"],
            name=data["name"],
            term=data["term_code"],
            instructor=data["instructor"],
            course=data["course_id"],
            medium=data["medium_code"],
            is_active=data["is_active"],
            is_lab=data["is_lab"],
            status=data["status"],
            enrolled=data["enrolled"],
            capacity=data["capacity"],
            waitlist=data["waitlist"],
            waitlist_capacity=data["waitlist_capacity"],
            note=data["note"],
            schedule=schedule,
            locations=locations
        )
        section.save()
        return section


class InstructionMediumManager(models.Manager):
    def __init__(self):
        super().__init__()

    def create_instruction_medium(self, code, name):
        if self.model.objects.filter(code=code).exists():
            # Instruction Medium already exists
            return None
        medium = self.model(code=code, name=name)
        medium.save()
        return medium


class LocationManager(models.Manager):
    def __init__(self):
        super().__init__()

    def create_location(self, campus, building, room):
        id = hashlib.sha1(f'{campus}{building}{room}'.encode()).hexdigest()
        if self.model.objects.filter(id=id).exists():
            # Location already exists
            return None
        location = self.model(id=id, campus=campus,
                              building=building, room=room)
        location.save()
        return location
