from django.urls import path
from . import views

"""
api/user/schedule/
"""

urlpatterns = [
    path('add/', views.add),
    path('remove/', views.remove),
    path('get/', views.get)
]
