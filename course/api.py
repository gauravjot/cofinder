from .models import Sections, Terms
from .serializers import SectionSerializer, CourseSerializer, SubjectSerializer, InstructionMediumSerializer


def get_section(crn):
    """ Get Section object by CRN

    Args:
        crn (int): CRN of the section

    Returns:
        Section or None
    """
    return Sections.objects.get_section(crn=crn)


def get_term(code):
    """ Get Term object by code

    Args:
        code (str): Code of the term

    Returns:
        Term or None
    """
    return Terms.objects.get_term(code=code)


def get_detailed_section(crn):
    """ Get detailed Section object by CRN

    Args:
        crn (int): CRN of the section

    Returns:
        Section or None
    """
    section = Sections.objects.get(crn=crn).select_related(
        "course", "course__subject", "medium")
    result = list()
    result.append(dict(course=CourseSerializer(section.course).data,
                       subject=SubjectSerializer(section.course.subject).data,
                       medium=InstructionMediumSerializer(section.medium).data,
                       **SectionSerializer(section).data))
    return result


def get_detailed_section_for_term(termid):
    """ Get detailed Section objects by term and CRN list

    Args:
        termid (str): Code of the term

    Returns:
        list: List of Section objects
    """
    sections = Sections.objects.filter(
        term=termid).select_related("course", "course__subject", "medium").order_by('name')
    result = list()
    for section in sections:
        result.append(dict(course=CourseSerializer(section.course).data,
                           subject=SubjectSerializer(
                               section.course.subject).data,
                           medium=InstructionMediumSerializer(
                               section.medium).data,
                           **SectionSerializer(section).data))
    return result


def get_detailed_section_for_term_in_crn(termid, crnList):
    """ Get detailed Section objects by term and CRN list

    Args:
        termid (str): Code of the term
        crnList (list): List of CRNs

    Returns:
        list: List of Section objects
    """
    sections = Sections.objects.filter(
        term=termid, pk__in=crnList).select_related("course", "course__subject", "medium").order_by('name')
    result = list()
    for section in sections:
        result.append(dict(course=CourseSerializer(section.course).data,
                           subject=SubjectSerializer(
                               section.course.subject).data,
                           medium=InstructionMediumSerializer(
                               section.medium).data,
                           **SectionSerializer(section).data))
    return result


def get_detailed_section_for_crns(crnList):
    """ Get detailed Section objects by CRN list

    Args:
        crnList (list): List of CRNs

    Returns:
        list: List of Section objects
    """
    sections = Sections.objects.filter(
        pk__in=crnList).select_related("course", "course__subject", "medium").order_by('name')
    result = list()
    for section in sections:
        result.append(dict(course=CourseSerializer(section.course).data,
                           subject=SubjectSerializer(
                               section.course.subject).data,
                           medium=InstructionMediumSerializer(
                               section.medium).data,
                           **SectionSerializer(section).data))
    return result
