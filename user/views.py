from django.shortcuts import redirect, reverse
# RestFramework
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
import requests

from .models import User, Session, SingleUseToken
from secrets import token_hex
import hashlib
from decouple import config

# Create your views here.


@api_view(['GET'])
def handleDiscordResponse(request):
    code = request.GET['code']
    if (code):
        try:
            r = requests.post(
                url=config('DISCORD_OAUTH_BASE_URL')+'oauth2/token',
                data={
                    'client_id': config('DISCORD_OAUTH_CLIENT_ID'),
                    'client_secret': config('DISCORD_OAUTH_SECRET'),
                    'grant_type': "authorization_code",
                    'code': str(code),
                    'redirect_uri': config('DISCORD_REDIRECT_URL'),
                },
                headers={
                    'Content-Type': 'application/x-www-form-urlencoded'
                })
            if (r.status_code == 200):
                discord_tokens = r.json()
                u = requests.get(
                    url=config('DISCORD_OAUTH_BASE_URL')+"users/@me",
                    headers={
                        "Authorization": "Bearer " + discord_tokens['access_token'],
                    }
                )
                if (u.status_code == 200):
                    discord_user = u.json()

                    # Get or create user in Database
                    try:
                        user = User.objects.get(
                            provider_uid=discord_user['id'])
                        user.provider_access_token = discord_tokens['access_token']
                        user.provider_refresh_token = discord_tokens['refresh_token']
                        user.provider_token_expiry = discord_tokens['expires_in']
                        user.save()
                    except User.DoesNotExist:
                        user = User(
                            name=discord_user['username'] +
                            "#"+discord_user['discriminator'],
                            email=discord_user['email'],
                            schedule=[],
                            provider=1,
                            provider_uid=discord_user['id'],
                            provider_access_token=discord_tokens['access_token'],
                            provider_refresh_token=discord_tokens['refresh_token'],
                            provider_token_expiry=discord_tokens['expires_in']
                        )
                        user.save()

                    # Prepare Single Use Token
                    sut = issueSingleUseToken(request, user)

                    return redirect(config('FRONTEND_AUTH_RECEIVE_URL')+sut+'/')
            raise Exception("Problem getting response from Discord API.")
        except:
            return Response(data=dict(), status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(data=dict(), status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def startSession(request, sut):
    if (sut):
        try:
            sut_row = SingleUseToken.objects.get(token=sut)
        except SingleUseToken.DoesNotExist:
            return Response(data=dict(), status=status.HTTP_400_BAD_REQUEST)

        # Issue session token and delete single use token
        user = sut_row.user
        session_token = issueSessionToken(request, user)
        sut_row.delete()

        # Prepare response
        response = dict(
            user=dict(
                id=user.id,
                name=user.name,
                provider_uid=user.provider_uid
            ))

        # Make a session
        response['session'] = dict(
            token=session_token)

        return Response(data=response, status=status.HTTP_200_OK)
    else:
        return Response(data=dict(), status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def userInfo(request):
    user = getUserID(request)
    try:

        if (user.provider_connected):
            u = requests.get(
                url=config('DISCORD_OAUTH_BASE_URL')+"users/@me",
                headers={
                    "Authorization": "Bearer " + user.provider_access_token,
                }
            )

        # Prepare response
        response = dict(
            id=user.id,
            email=user.email,
            name=user.name,
            schedule=user.schedule,
            joined=user.joined,
            provider_uid=user.provider_uid,
            avatar="",
            tag=""
        )

        if (u.status_code == 200):
            discord_user = u.json()
            response['avatar'] = discord_user['avatar']
            response['tag'] = discord_user['username'] + \
                "#"+discord_user['discriminator']

        return Response(data=response, status=status.HTTP_200_OK)
    except:
        return Response(data={}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def alterSchedule(request):
    pass


@api_view(['POST'])
def alterProfile(request):
    pass

##################################################################################


def refreshDiscordToken(refresh_token, user):
    try:
        if (user.provider_connected):
            r = requests.post(
                url=config('DISCORD_OAUTH_BASE_URL')+'oauth2/token',
                data={
                    'client_id': config('DISCORD_OAUTH_CLIENT_ID'),
                    'client_secret': config('DISCORD_OAUTH_SECRET'),
                    'grant_type': "authorization_code",
                    'refresh_token': refresh_token,
                },
                headers={
                    'Content-Type': 'application/x-www-form-urlencoded'
                })
            if (r.status_code == 200):
                # Update User
                discord_tokens = r.json()
                user.provider_access_token = discord_tokens['access_token']
                user.provider_refresh_token = discord_tokens['refresh_token']
                user.provider_token_expiry = discord_tokens['expires_in']
                user.save()
                return user
            elif (r.status_code == 401):
                # User has disconnected Discord from CoFinder
                user.provider_connected = False
                user.save()
    except:
        pass
    return None


def getUserID(request):
    # Check if token is present in header
    try:
        token = request.headers['Authorization'].split()[-1]
        if len(token) < 48:
            raise KeyError
    except KeyError:
        return Response(data="Unauthorized.", status=status.HTTP_401_UNAUTHORIZED)
    # Check if token is present in database and is valid
    try:
        session = Session.objects.select_related(
            'user').get(token=hashThis(token))
        # Check if session is expired
        isSessionExpired = False
        # Return valid token
        if session.valid and not isSessionExpired:
            return session.user
        else:
            if session.valid:
                session.valid = False
                session.token = "expired"
                session.save()
            return Response(data="Unauthorized.", status=status.HTTP_401_UNAUTHORIZED)
    except Session.DoesNotExist:
        return Response(data="Unauthorized.", status=status.HTTP_401_UNAUTHORIZED)


def issueSingleUseToken(request, user):
    session_token = token_hex(24)
    session = SingleUseToken(
        user=user,
        token=session_token,
    )
    session.save()
    return session_token


def issueSessionToken(request, user):
    session_token = token_hex(24)
    session = Session(
        user=user,
        token=hashThis(session_token),
        ip=_getClientIP(request),
        ua=_getUserAgent(request)
    )
    session.save()
    return session_token

# Hash


def hashThis(value):
    return hashlib.sha256(str(value).encode('utf-8')).hexdigest()

# Get Client IP Address


def _getClientIP(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

# Get User Agent


def _getUserAgent(request):
    return request.META.get('HTTP_USER_AGENT')
