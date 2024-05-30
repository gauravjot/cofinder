import os
import time
import json
from django.utils.timezone import now
from course.grabber.grabber import GrabUFV
from course.models import *
from course.utils import *
from cofinder.settings import BASE_DIR


def push():
    grabber = GrabUFV()
    summary = []

    # Terms

    terms = grabber.terms()[:1]  # Get the latest term only

    for term in terms:
        Terms.objects.create_term(code=term['code'], name=term['name'])

        summary.append(now().strftime("%Y-%m-%d %H:%M:%S UTC"))
        summary.append(f"Term selected: {term['code']} - {term['name']}")

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
            time.sleep(2) # to not spam server with requests
            summary.append("-" * 30)
            summary.append(f"Processing {subject['code']}")
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

            for section in sections:
                if section is None:
                    continue
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
                        " (")[0].strip() if section['Instructional Method'] != '\xa0' else None
                    result = Sections.objects.create_section(
                        data,
                        Terms.objects.get(code=term['code']),
                        section['Instructor'] if section['Instructor'] else None,
                        Courses.objects.get(code=" ".join(
                            section['Section'].split(" ")[:2])),
                        InstructionMediums.objects.get(name=instruct_method) if len(
                            instruct_method) > 0 else None,
                        schedules,
                        locations)
                    if result is None:
                        summary.append(
                            f"> Section exists: {section['CRN']} - {section['Section']}")
                    else:
                        summary.append(
                            f"> Section created: {section['CRN']} - {section['Section']}")
                except Exception as e:
                    summary.append("!" * 5)
                    summary.append(str(e))
                    summary.append(json.dumps(section))

            print(f"finished {subject['code']}")

    # Save errors to BASE_DIR
    try:
        with open(BASE_DIR / "push_summary.txt", "w") as f:
            for line in summary:
                f.write(f'{line}\n')
        os.chmod(BASE_DIR / "push_summary.txt", 0o777)
    except:
        pass
