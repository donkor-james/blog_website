from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/general/', consumers.NotificationConsumer.as_asgi())
]
