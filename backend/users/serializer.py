from rest_framework import serializers
from .models import User
from blog.models.post import Post
from rest_framework.exceptions import ValidationError


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['fullname', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, attrs):

        return attrs

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


class ResendVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)


class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

    def validate_email(self, value):
        user = User.objects.get(email=value)

        if user:
            return value
        raise ValidationError('user does not exist')


class UserSerializer(serializers.ModelSerializer):
    stat = serializers.SerializerMethodField()
    # password = serializers.CharField(required=False)
    # fullname = serializers.CharField(required=False, source='image_url')

    class Meta:
        model = User
        fields = ['id', 'fullname', 'email', 'image', "bio", "stat"]
        extra_kwargs = {'password': {'write_only': True}}

    def get_stat(self, obj):
        # posts = Post.objects.filter(author=obj)
        posts = []

        reactions = 0

        if posts:
            for post in posts:
                reactions += post.reactions.count()

            return {'stat': {'posts': posts.count(), 'reactions': reactions}}
        return {'stat': {'posts': posts.count(), 'reactions': reactions}}

    # def update(self, instance, validated_data):
    #     instance.fullname = validated_data.get('fullname', instance.fullname)
    #     instance.image = validated_data.get('image', instance.image)
    #     instance.email = validated_data.get('image', instance.image)
    # def image_url(self, obj):
    #     return f'http:localhost:8000/media/{obj.image}'
