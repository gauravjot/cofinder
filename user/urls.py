from django.urls import path
from .views import send_email, handleDiscordResponse, startSession, userInfo, alterSchedule, alterBulkSchedule

urlpatterns = [
    path('api/user/auth/discord/redirect/', handleDiscordResponse),
    path('api/user/session/new/<sut>/', startSession),
    path('api/user/me/', userInfo),
    path('api/user/<term_id>/schedule/', alterSchedule),
    path('api/user/schedule/bulk_update/', alterBulkSchedule),
    path('api/send/', send_email),
]
