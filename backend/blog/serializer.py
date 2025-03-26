from rest_framework import serializers
from .models.post import Post
from .models.category import Category
from .models.reaction import Reactions


class PostSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')
    reactions = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'created_at',
                  'author', 'category', 'reactions']
        read_only = ['created_at', 'auhtor']
        # extra_kwargs = {'created_at': {
        #     'read_only': True}, 'author': {'read_only': True}}

    def get_reactions(self, obj):
        reactions = Reactions.objects.filter(post=obj)

        return ReactionSerializer(reactions, many=True).data


class ListCategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = 'name'


class ReactionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Reactions
        fields = ['user', 'reaction_type']
