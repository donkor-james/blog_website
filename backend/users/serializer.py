from rest_framework import serializers
from .models import User
from blog.models.post import Post
from rest_framework.exceptions import ValidationError


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True)

    # def validate_email(self, value):
    #     user = User.objects.filter(email=value).exists()
    #     if not user:
    #         raise ValidationError('user does not exist')

    #     return value


class ResendVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)


class ResetPasswordSerializer(serializers.Serializer):
    # email = serializers.EmailField(required=True)
    password = serializers.EmailField(required=True)
    new_password = serializers.EmailField(required=True)

    # def validate_email(self, value):
    #     user = User.objects.get(email=value)
    #     if user:
    #         return value
    #     raise ValidationError('user does not exist')


class UserSerializer(serializers.ModelSerializer):
    stat = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name',
                  'email', 'image', "bio", "stat"]
        extra_kwargs = {'password': {'write_only': True}}

    def get_stat(self, obj):
        posts = Post.objects.filter(author=obj)
        reactions = sum(post.reactions.count() for post in posts)

        return {'posts': posts.count(), 'reactions': reactions}

    # def update(self, instance, validated_data):
    #     instance.fullname = validated_data.get('fullname', instance.fullname)
    #     instance.image = validated_data.get('image', instance.image)
    #     instance.email = validated_data.get('image', instance.image)
    # def image_url(self, obj):
    #     return f'http:localhost:8000/media/{obj.image}'
