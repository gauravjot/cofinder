from django.urls import path
from .views import pushData, getTermSections, getTerms, \
    getTermCourses, getTermInstructors, getTermSubjects, \
    getSpecificTermSections, getSectionSeats

urlpatterns = [
    path('api/push/', pushData),
    path('api/terms/', getTerms),
    path('api/section/seats/<termdate>/<crn>/', getSectionSeats),
    path('api/<termid>/sections/', getTermSections),
    path('api/<termid>/sections/<crns>/', getSpecificTermSections),
    path('api/<termid>/courses/', getTermCourses),
    path('api/<termid>/instructors/', getTermInstructors),
    path('api/<termid>/subjects/', getTermSubjects),
]
