from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    users = serializers.SerializerMethodField()
    created_at = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = ['id', 'post', 'users', 'message', 'is_read', 'created_at']

    def get_users(self, obj):
        return [
            {
                'id': user.id,
                'username': user.username,
                'profile_picture': f"http://localhost:8000{user.image.url}" if hasattr(user, 'image') and user.image else None
            }
            for user in obj.users.all()
        ]

    def get_created_at(self, obj):
        return obj.created_at.strftime("%B %d at %I:%M %p")
