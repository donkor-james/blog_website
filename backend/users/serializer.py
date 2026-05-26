from rest_framework import serializers
from .models import User
from blog.models.post import Post
from rest_framework.exceptions import ValidationError
from django.db.models import Count, Q, Sum
from blog.models.reaction import Reactions


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError(
                "Password must be at least 8 characters long.")

        if value.isdigit():
            raise serializers.ValidationError(
                "Password cannot be entirely numeric.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email is already exists.")
        return value.lower()

    def validate_first_name(self, value):
        value = value.strip()
        if len(value) < 2:
            raise serializers.ValidationError(
                "First name must be at least 2 characters."
            )
        if not value.isalpha():
            raise serializers.ValidationError(
                "First name can only contain letters."
            )
        return value

    def create(self, validated_data):
        email = validated_data.get('email')
        username = email.split('@')[0]

        # Make sure username is unique
        base_username = username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1

        user = User.objects.create_user(
            username=username,
            **validated_data
        )
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True)


class ResendVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

    def validate_email(self, value):
        email = value.lower()
        user = User.objects.get(email)

        if user.is_verified:
            raise ValidationError("Email already verified.")
        return


class ChangePasswordSerializer(serializers.Serializer):
    password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_new_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError(
                "New password must be at least 8 characters long.")

        if value.isdigit():
            raise serializers.ValidationError(
                "New password cannot be entirely numeric.")
        return value

    def validate(self, data):
        password = data.get('password')
        new_password = data.get('new_password')

        if password == new_password:
            raise ValidationError(
                "New password must be different from the current password.")
        return data


class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

    def validate_email(self, value):
        return value.lower()


class UserSerializer(serializers.ModelSerializer):
    stat = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name',
                  'email', 'image', "bio", "stat"]
        extra_kwargs = {'password': {'write_only': True}}

    def get_stat(self, obj):
        posts = getattr(obj, 'post_count', None)
        reactions = getattr(obj, 'reaction_count', None)
        if posts is None:
            posts = obj.posts.count()
        if reactions is None:
            reactions = Reactions.objects.filter(post__author=obj).count()
        return {'posts': posts, 'reactions': reactions}
