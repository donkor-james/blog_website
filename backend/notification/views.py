from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from .serializers import NotificationSerializer
from rest_framework.response import Response
from .models import Notification
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
# Create your views here.


class NotificationListView(ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(post__author=self.request.user).order_by('-created_at')

    def get(self, request, *args, **kwargs):
        notifications = self.get_queryset()
        unread_count = notifications.filter(is_read=False).count()
        serializer = self.get_serializer(notifications, many=True)
        return Response({
            'unreadCount': unread_count,
            'notifications': serializer.data
        })


class MarkNotificationReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        notifications = Notification.objects.filter(
            post__author=request.user, is_read=False)
        updated_count = notifications.update(is_read=True)
        return Response({'marked_as_read': updated_count}, status=status.HTTP_200_OK)
