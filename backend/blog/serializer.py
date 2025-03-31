from rest_framework import serializers
from .models.post import Post
from .models.category import Category
from .models.reaction import Reactions
from users.models import User


class PostSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)
    author = serializers.SerializerMethodField()
    reactions = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'created_at',
                  'author', 'category', 'coverImage', "reactions"]
        read_only_fields = ['created_at', 'author']
        # extra_kwargs = {'created_at': {
        #     'read_only': True}, 'author': {'read_only': True}}

    def get_reactions(self, obj):
        reactions = Reactions.objects.filter(post=obj)
        return len(reactions)

    def get_author(self, obj):
        author = User.objects.get(id=obj.author_id)
        full_name = author.get_full_name()
        return {"id": author.id, "name": full_name}


class ListCategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = ['id', 'name']


class ReactionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Reactions
        fields = ['user', 'reaction_type']
