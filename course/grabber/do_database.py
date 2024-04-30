from course.grabber.grabber import GrabUFV
from course.models import *


def push():
    grabber = GrabUFV()

    # Terms

    terms = grabber.terms()
    for term in terms:
        Terms.objects.create_term(code=term['code'], name=term['name'])
