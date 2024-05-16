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

    def get_term(self, code):
        return self.model.objects.get(code=code)


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

    def create_course(self, course_code, name, credits, subject_code, subject_instance, prereqs, coreqs, note):
        id = f'{subject_code} {course_code}'
        if self.model.objects.filter(code=id).exists():
            # Course already exists
            return None
        course = self.model(code=id, name=name, credits=credits,
                            subject=subject_instance, prereqs=prereqs, coreqs=coreqs, note=note)
        course.save()
        return course


class SectionManager(models.Manager):
    def __init__(self):
        super().__init__()

    def get_hash(self, data, schedule, locations):
        # data is a dictionary that has all the fields
        return hashlib.sha1(f'{json.dumps(data)}{json.dumps(schedule)}{json.dumps(locations)}'.encode()).hexdigest()

    def create_section(self, data, term, instructor, course, medium, schedule, locations):
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
        row = self.model.objects.filter(hash=h)
        if row.exists():
            # Section already exists and is up to date
            return None
        for r in row:
            if r.no_auto_update:
                # Section is not to be updated
                return None
        # Create/Update the object
        section = self.model(
            hash=h,
            crn=data["crn"],
            name=data["name"],
            term=term,
            instructor=instructor,
            course=course,
            medium=medium,
            is_active=data["is_active"],
            is_lab=data["is_lab"],
            status=data["status"],
            enrolled=data["enrolled"],
            capacity=data["capacity"],
            waitlist=data["waitlist"],
            note=data["note"],
            schedule=schedule,
            locations=locations
        )
        section.save()
        return section

    def get_section(self, crn):
        return self.model.objects.get(crn=crn)


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
