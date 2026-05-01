import jwt
from channels.auth import AuthMiddlewareStack
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from django.conf import settings
from users.models import User


class JWTAuthMiddleware:
    "Custom middleware to handle JWT"

    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        token = self.get_token_from_scope(scope)

        if token:
            try:
                payload = jwt.decode(
                    token, settings.SECRET_KEY, algorithms=["HS256"])
                user = await self.get_user(payload['user_id'])
                scope['user'] = user
            except (jwt.ExpiredSignatureError, jwt.DecodeError):
                scope['user'] = AnonymousUser()
        else:
            scope['user'] = AnonymousUser()

        return await self.inner(scope, receive, send)

    def get_token_from_scope(self, scope):

        if 'query_string' in scope:
            query_string = scope["query_string"].decode()
            for param in query_string.split('&'):
                if param.startswith('token='):
                    return param.split('=')[1]
        return None

    @database_sync_to_async
    def get_user(self, user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return AnonymousUser()
