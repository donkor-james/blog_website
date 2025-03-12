from rest_framework import serializers
from .models import User
from rest_framework.exceptions import ValidationError


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'image']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_email(self, value):
        user = User.objects.filter(email=value)
        if user:
            raise ValidationError('user already exist')

        return value


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True)

    def validate_email(self, value):
        user = User.objects.filter(email=value)
        if not user:
            raise ValidationError('user does not exist')

        return value


class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

    def validate_email(self, value):
        user = User.objects.get(email=value)

        if user:
            return value
        raise ValidationError('user does not exist')


class UserSerializer(serializers.ModelSerializer):
    # email = serializers.EmailField(required=False)
    # password = serializers.CharField(required=False)
    # username = serializers.CharField(required=False, source='image_url')

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'image']
        extra_kwargs = {'password': {'write_only': True}}

    # def update(self, instance, validated_data):
    #     instance.username = validated_data.get('username', instance.username)
    #     instance.image = validated_data.get('image', instance.image)
    #     instance.email = validated_data.get('image', instance.image)
    # def image_url(self, obj):
    #     return f'http:localhost:8000/media/{obj.image}'
