from django.utils.timezone import now
# RestFramework
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
import requests
from .permissions import HasSessionActive

from .models import User
from user.user_session.api import create_session, delete_session
from decouple import config
import json
from .send_email import send_welcome_email
from .serializers import UserResponseSerializer

# Create your views here.


@api_view(['POST'])
def handleDiscordResponse(request):
    code = request.data['code']
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
                        user.provider_connected_at = now()
                        user.save()
                    except User.DoesNotExist:
                        user = User(
                            name=discord_user['username'],
                            email=discord_user['email'],
                            schedule=json.dumps(dict()),
                            provider=1,
                            provider_uid=discord_user['id'],
                            provider_access_token=discord_tokens['access_token'],
                            provider_refresh_token=discord_tokens['refresh_token'],
                            provider_token_expiry=discord_tokens['expires_in'],
                            provider_connected_at=now(),
                        )
                        user.save()
                        send_welcome_email(
                            discord_user['email'], discord_user['username'])
                    # Start session
                    key, session = create_session(user, request)
                    # Prepare response
                    data = prepareUserResponse(session, discord_user)
                    response = Response(
                        data=data, status=status.HTTP_202_ACCEPTED)
                    response.set_cookie(
                        key=config('AUTH_COOKIE_NAME', default='cf_auth'),
                        value=key,
                        expires=session.expire_at,  # expire is in minutes so we multiply by 60
                        httponly=True,
                        secure=config('AUTH_COOKIE_SECURE',
                                      default=True, cast=bool),
                        samesite=config('AUTH_COOKIE_SAMESITE',
                                        default='Strict'),
                        domain=config('AUTH_COOKIE_DOMAIN',
                                      default='localhost')
                    )
                    # Send response
                    return response
            raise Exception("Problem getting response from Discord API.")
        except Exception as e:
            print(e)
            return Response(data=dict(), status=500)
    else:
        return Response(data=dict(), status=500)


@api_view(['GET'])
@permission_classes([HasSessionActive])
def logout(request):
    # Delete session
    delete_session(request.active_session.user, request.active_session.id)
    # Return response
    return Response(status=204)


@api_view(['GET'])
@permission_classes([HasSessionActive])
def userInfo(request):
    user = request.active_session.user
    try:
        discord_user = None
        if (user.provider_connected):
            u = requests.get(
                url=config('DISCORD_OAUTH_BASE_URL')+"users/@me",
                headers={
                    "Authorization": "Bearer " + user.provider_access_token,
                }
            )
            if (u.status_code == 200):
                discord_user = u.json()
        data = prepareUserResponse(request.active_session, discord_user)
        return Response(data=data, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response(data={}, status=500)


@api_view(['POST'])
@permission_classes([HasSessionActive])
def alterSchedule(request, term_id):
    if term_id:
        user = request.active_session.user
        try:
            userSchedule = json.loads(user.schedule)
        except:
            userSchedule = dict()
        userSchedule[term_id] = request.data['schedule'].split("--")
        user.schedule = json.dumps(userSchedule)
        user.save()
        return Response(data=userSchedule, status=status.HTTP_200_OK)
    else:
        return Response(data=dict(), status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([HasSessionActive])
def alterBulkSchedule(request):
    if request.data:
        schedule = unflatten_dict(request.data.dict())
        user = request.active_session.user
        userSchedule = dict()
        for key, value in schedule.items():
            print(value['section']['data'])
            print(value['term']['data'])
            try:
                if value['section']['data'] not in userSchedule[value['term']['data']]:
                    userSchedule[value['term']['data']].append(
                        value['section']['data'])
            except KeyError:
                userSchedule[value['term']['data']] = [
                    value['section']['data']]
        print(userSchedule)
        user.schedule = json.dumps(userSchedule)
        user.save()
        return Response(data=userSchedule, status=status.HTTP_200_OK)
    else:
        return Response(data=dict(), status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([HasSessionActive])
def bulkScheduleUpdate(request):
    if request.data['schedule']:
        pass
    else:
        return Response(data=dict(), status=status.HTTP_400_BAD_REQUEST)

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
                user.provider_connected_at = now()
                user.save()
                return user
            elif (r.status_code == 401):
                # User has disconnected Discord from CoFinder
                user.provider_connected = False
                user.save()
    except:
        pass
    return None


# Unflatten local schedule from frontend


def unflatten_dict(flat_dict):
    unflattened_dict = {}

    for key, value in flat_dict.items():
        current_dict = unflattened_dict
        parts = key.split('[')
        main_key = parts[0]  # Get the main key without index

        for part in parts[1:]:
            part = part.rstrip(']')
            if part not in current_dict:
                current_dict[part] = {}
            current_dict = current_dict[part]

        current_dict[main_key] = value

    return unflattened_dict


def prepareUserResponse(session, discord_user=None):
    if discord_user:
        avatar = discord_user['avatar']
        tag = discord_user['username'] + "#"+discord_user['discriminator']
    else:
        avatar, tag = "", ""
    response = {'user': {**UserResponseSerializer(
        session.user).data, 'avatar': avatar, 'tag': tag}, **dict(session=session.id)}
    return response
