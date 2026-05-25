from rest_framework import serializers
from collections import Counter
from .models.post import Post
from .models.category import Category
from .models.reaction import Reactions
from users.models import User


class PostSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)
    author = serializers.SerializerMethodField()
    author_img = serializers.SerializerMethodField()
    reactions = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'created_at',
                  'author', 'category', 'coverImage', "reactions", "author_img"]
        read_only_fields = ['created_at', 'author', "author_img"]
        # extra_kwargs = {'created_at': {
        #     'read_only': True}, 'author': {'read_only': True}}

    def get_reactions(self, obj):
        # Prepare a response dictionary
        return {
            'total': getattr(obj, 'total_reactions', 0),
            'counts': {
                'LIKE': getattr(obj, 'like_count', 0),
                'LOVE': getattr(obj, 'love_count', 0),
                'DISLIKE': getattr(obj, 'dislike_count', 0),
                'FIRE': getattr(obj, 'fire_count', 0),
            }
        }

    def get_author(self, obj):
        author = obj.author
        full_name = author.get_full_name()
        return {"id": author.id, "name": full_name}

    def get_author_img(self, obj):
        author = obj.author
        return "https://writespace.duckdns.org" + author.image.url

    def validate_title(self, value):
        value = value.strip()

        if len(value) < 5:
            raise serializers.ValidationError(
                "Title must be at least 5 characters long.")

        if len(value) > 100:
            raise serializers.ValidationError(
                "Title cannot exceed 100 characters.")
        return value

    def validate_content(self, value):
        value = value.strip()

        if len(value) < 50:
            raise serializers.ValidationError(
                "Content must be at least 50 characters long.")

        if len(value) > 50000:
            raise serializers.ValidationError(
                "Content cannot exceed 50000 characters.")
        return value

    def validate_coverImage(self, value):
        # If it's a string (URL), just ignore it - don't update the image
        if isinstance(value, str):
            return None  # This will be handled in update()

        if value:
            max_size = 2 * 1024 * 1024
            if value.size > max_size:
                raise serializers.ValidationError(
                    "Image size cannot exceed 2MB."
                )

        allowed_types = ['image/jpeg', 'image/png', 'image/webp']
        if value.content_type not in allowed_types:
            raise serializers.ValidationError(
                "only JPEG, PNG, and WEBP formats are allowed."
            )

        return value

    # def update(self, instance, validated_data):
    #     # Remove image from validated_data if it's a URL string

    #     return super().update(instance, validated_data)


class ListCategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = ['id', 'name']


class ReactionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Reactions
        fields = ['user', 'reaction_type']
