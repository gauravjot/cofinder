from course.grabber.grabber import GrabUFV
from course.models import *
from course.utils import *
import time


def push():
    grabber = GrabUFV()
    errors = []

    # Terms

    terms = grabber.terms()[:1]
    for term in terms:
        Terms.objects.create_term(code=term['code'], name=term['name'])

        subjects, instructors, instruct_methods = grabber.term_details(
            term['code'])

        # Subjects

        for subject in subjects:
            Subjects.objects.create_subject(subject['code'], subject['name'])

        # Instructors

        for instructor in instructors:
            Instructors.objects.create_instructor(instructor['name'])

        # Instruct Methods

        for method in instruct_methods:
            InstructionMediums.objects.create_instruction_medium(
                method['code'], method['name'])

        for subject in subjects:
            time.sleep(3)
            sections, courses = grabber.subject_courses(
                term['code'], subject['code'])

            # Courses

            course_errors = []
            for course in courses:
                try:
                    Courses.objects.create_course(
                        course_code=course['code'],
                        name=course['name'],
                        credits=course['credits'],
                        subject_code=course['subject_code'],
                        subject_instance=Subjects.objects.get(
                            code=course['subject_code']),
                        prereqs=None,
                        coreqs=None,
                        note=None)
                except:
                    course_errors.append({
                        "subject_code": course['subject_code'],
                        "code": course['code']
                    })

            # Sections

            section_errors = []
            for section in sections:
                try:
                    data = setup_section_data(
                        crn=section['CRN'],
                        name=section['Section'],
                        capacity=section['Max'],
                        enrolled=section['Enrl'],
                        is_active=True,
                        is_lab='#' in section['Section'],
                        note=section['Important'] if 'Important' in section else None,
                        status=section['Status'],
                        waitlist=section['Wait']
                    )
                    schedules = section['Schedule'] if 'Schedule' in section else None
                    locations = section['Location'] if 'Location' in section else None
                    instruct_method = section['Instructional Method'].split(
                        " (")[0].strip() if section['Instructional Method'] is not '\xa0' else None
                    Sections.objects.create_section(
                        data,
                        Terms.objects.get(code=term['code']),
                        section['Instructor'] if section['Instructor'] else None,
                        Courses.objects.get(code=" ".join(
                            section['Section'].split(" ")[:2])),
                        InstructionMediums.objects.get(name=instruct_method) if len(
                            instruct_method) > 0 else None,
                        schedules,
                        locations)
                except Exception as e:
                    print("-----")
                    print(e)
                    print(section)
                    print("-----")

            print(f"finished {subject['code']}")
