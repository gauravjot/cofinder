from django.urls import path
from .views import *

urlpatterns = [
    path('api/user/me/', userInfo),
    path('api/user/logout/', logout),
    path('api/user/auth/discord/', handleDiscordResponse),
    path('api/user/schedule/bulk_update/', alterBulkSchedule),
    path('api/user/<term_id>/schedule/', alterSchedule),
]
