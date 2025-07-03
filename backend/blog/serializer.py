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
        reactions = Reactions.objects.filter(post=obj)
        reaction_counts = Counter(
            reaction.reaction_type for reaction in reactions)

        # Prepare a response dictionary
        reaction_summary = {
            'total': len(reactions),
            'counts': {
                'LIKE': reaction_counts.get('LIKE', 0),
                'LOVE': reaction_counts.get('LOVE', 0),
                'DISLIKE': reaction_counts.get('DISLIKE', 0),
                'FIRE': reaction_counts.get('FIRE', 0),
            }
        }
        return reaction_summary

    def get_author(self, obj):
        author = User.objects.get(id=obj.author_id)
        full_name = author.get_full_name()
        return {"id": author.id, "name": full_name}

    def get_author_img(self, obj):
        author = User.objects.get(id=obj.author_id)
        return "http://localhost:8000" + author.image.url

    def validate_coverImage(self, value):
        # If it's a string (URL), just ignore it - don't update the image
        if isinstance(value, str):
            return None  # This will be handled in update()
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
