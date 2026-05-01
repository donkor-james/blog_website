from django.urls import path
from .views import NotificationListView, MarkNotificationReadView

urlpatterns = [
    path('notifications/', NotificationListView.as_view(),
         name='notification-list'),
    path('notifications/mark-read/',
         MarkNotificationReadView.as_view(), name='notification-read'),
]
