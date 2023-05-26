from django.urls import path
from .views import handleDiscordResponse, startSession, userInfo

urlpatterns = [
    path('api/user/auth/discord/redirect/', handleDiscordResponse),
    path('api/user/session/new/<sut>/', startSession),
    path('api/user/me/', userInfo),
]
