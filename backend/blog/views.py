# from typing import Any
from django.db.models import Count
# from django.forms import BaseModelForm
from .models.post import Post
from rest_framework.permissions import AllowAny, IsAuthenticated
# from django.contrib.auth.models import User
# from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404
from rest_framework import status
# from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializer import PostSerializer, ListCategorySerializer
from .models.category import Category
from .models.reaction import Reactions
from notification.models import Notification
from rest_framework.pagination import CursorPagination, PageNumberPagination
from rest_framework import filters
from notification.serializers import NotificationSerializer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
# from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.db.models import Count, Q
from django.core.cache import cache


class PostCreateView(generics.CreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    # def post(self, request):
    #     serializer = self.get_serializer(data=request.data)
    #     serializer.is_valid()
    #     print("request:", request.data, "serializer_data:",
    #           serializer.validated_data)
    #     return Response('success', status=status.HTTP_200_OK)

    def perform_create(self, serializer):
        # print(serializer.data, 'postss')
        serializer.save(author=self.request.user)
        cache.delete('recent_posts')
        cache.delete('featured_posts')
        cache.delete_pattern('post_list_*')
        cache.delete_pattern('category_*')


class PostCursorPagination(CursorPagination):
    page_size = 5
    ordering = '-created_at'


class PostPageNumberPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 100


class PostListView(generics.ListAPIView):
    serializer_class = PostSerializer
    pagination_class = PostPageNumberPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'author__username']
    ordering_fields = ['created_at', 'title']
    ordering = ['-created_at']

    def get_queryset(self):
        page = self.request.query_params.get('page', 1)
        search = self.request.query_params.get('search', '')
        ordering = self.request.query_params.get('ordering', '-created_at')
        cache_key = f'post_list_page_{page}_search_{search}_order_{ordering}'

        cached = cache.get(cache_key)
        if cached is not None:
            print("Redis cache for POSTS HIT")
            return cached

        queryset = Post.objects.select_related(
            'author', 'category'
        ).annotate(
            total_reactions=Count('reaction_set'),
            like_count=Count('reaction_set', filter=Q(
                reaction_set__reaction_type='LIKE')),
            love_count=Count('reaction_set', filter=Q(
                reaction_set__reaction_type='LOVE')),
            dislike_count=Count('reaction_set', filter=Q(
                reaction_set__reaction_type='DISLIKE')),
            fire_count=Count('reaction_set', filter=Q(
                reaction_set__reaction_type='FIRE')),
        ).order_by('-created_at')

        cache.set(cache_key, queryset, timeout=60 * 15)
        print("Redis cache for POSTS MISS")
        return queryset


class PostRetrieveUpdatedDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]


class UserPostView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Post.objects.select_related('author', 'category').filter(author=self.request.user.id)


class AuthorPostView(generics.ListAPIView):
    serializer_class = PostSerializer
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        posts = Post.objects.select_related(
            'author', 'category').filter(author=self.kwargs['author_id'])
        return posts


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = ListCategorySerializer


class ReactionToPostView(generics.GenericAPIView):
    queryset = Reactions.objects.all()
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)
            reaction_type = request.data.get('reaction_type', None)

            if not reaction_type:
                return Response({'message': 'reaction type is required'}, status=status.HTTP_400_BAD_REQUEST)

            reaction, created = Reactions.objects.get_or_create(
                user=self.request.user, post=post)

            print("reaction:", reaction, "created:", created)

            previous_reaction_type = reaction.reaction_type

            # If user is changing reaction type
            if reaction.reaction_type != reaction_type:
                # Remove user from old notification
                if previous_reaction_type:
                    old_notification = Notification.objects.filter(
                        post=post, reaction_type=previous_reaction_type).first()
                    if old_notification:
                        old_notification.users.remove(self.request.user)
                        # Optionally delete notification if no users left
                        if old_notification.users.count() == 0:
                            old_notification.delete()
                        else:
                            # Update message for old notification
                            old_users = old_notification.users.all()
                            old_usernames = [
                                user.username for user in old_users[:2]]
                            old_others_count = old_users.count() - 2
                            if old_others_count > 0:
                                old_message = f"{', '.join(old_usernames)} and {old_others_count} others {previous_reaction_type.lower()}d your post '{post.title}'"
                            else:
                                old_message = f"{', '.join(old_usernames)} {previous_reaction_type.lower()}d your post '{post.title}'"
                            old_notification.message = old_message
                            old_notification.save()
                # Update reaction type
                reaction.reaction_type = reaction_type
                reaction.save()
            else:
                # If user is removing their reaction
                notification = Notification.objects.filter(
                    post=post, reaction_type=reaction_type).first()
                if notification:
                    notification.users.remove(self.request.user)
                    if notification.users.count() == 0:
                        notification.delete()
                    else:
                        users = notification.users.all()
                        usernames = [user.username for user in users[:2]]
                        others_count = users.count() - 2
                        if others_count > 0:
                            message = f"{', '.join(usernames)} and {others_count} others {reaction_type.lower()}d your post '{post.title}'"
                        else:
                            message = f"{', '.join(usernames)} {reaction_type.lower()}d your post '{post.title}'"
                        notification.message = message
                        notification.save()
                reaction.delete()
                return Response({'message': 'reaction removed', "post": PostSerializer(post).data}, status=status.HTTP_200_OK)

            channel_layer = get_channel_layer()

            # Add user to new notification
            notification, notif_created = Notification.objects.get_or_create(
                post=post, reaction_type=reaction_type)
            notification.is_read = False
            notification.save()
            notification.users.add(self.request.user)

            # Build message: user1, user2 and N others liked your post
            users = notification.users.all()
            usernames = [user.username for user in users[:2]]
            others_count = users.count() - 2
            if others_count > 0:
                message = f"{', '.join(usernames)} and {others_count} others {reaction_type.lower()}d your post '{post.title}'"
            else:
                message = f"{', '.join(usernames)} {reaction_type.lower()}d your post '{post.title}'"
            notification.message = message
            notification.save()

            serializer = NotificationSerializer(notification)
            unread_count = Notification.objects.filter(
                post__author=post.author, is_read=False).count()

            async_to_sync(channel_layer.group_send)(
                f"user_{post.author.id}",
                {
                    'type': 'send_notification',
                    'notification': {'notification': serializer.data, 'unreadCount': unread_count}
                }
            )

            serializer_data = PostSerializer(post).data
            serializer_data['coverImage'] = request.build_absolute_uri(
                serializer_data['coverImage']) if serializer_data['coverImage'] else None

            return Response({'message': 'reaction processed', "post": serializer_data}, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RecentPostView(generics.ListAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        # Try to get from cache first
        cache_key = 'recent_posts'
        cached_data = cache.get(cache_key)

        if cached_data is not None:
            print("Redis cache for RECENT POSTS HIT")
            return cached_data

        queryset = Post.objects.select_related(
            'author', 'category'
        ).annotate(
            total_reactions=Count('reaction_set'),
            like_count=Count('reaction_set', filter=Q(
                reaction_set__reaction_type='LIKE')),
            love_count=Count('reaction_set', filter=Q(
                reaction_set__reaction_type='LOVE')),
            dislike_count=Count('reaction_set', filter=Q(
                reaction_set__reaction_type='DISLIKE')),
            fire_count=Count('reaction_set', filter=Q(
                reaction_set__reaction_type='FIRE')),
        ).order_by('-created_at')[:3]

        # Store in cache for 15 minutes
        cache.set(cache_key, queryset, timeout=60 * 15)
        print("Redis cache for RECENT POSTS MISS")
        return queryset


class FeaturedPostsListView(generics.ListAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        cached = cache.get('featured_posts')
        if cached is not None:
            return cached

        queryset = Post.objects.select_related(
            'author', 'category'
        ).annotate(
            total_reactions=Count('reaction_set'),
            like_count=Count('reaction_set', filter=Q(
                reaction_set__reaction_type='LIKE')),
            love_count=Count('reaction_set', filter=Q(
                reaction_set__reaction_type='LOVE')),
            dislike_count=Count('reaction_set', filter=Q(
                reaction_set__reaction_type='DISLIKE')),
            fire_count=Count('reaction_set', filter=Q(
                reaction_set__reaction_type='FIRE')),
        ).order_by('-total_reactions')

        # Shorter timeout since reactions change more often
        cache.set('featured_posts', queryset, timeout=60 * 5)
        return queryset


class CategoryPostCursorPagination(CursorPagination):
    page_size = 5
    ordering = '-created_at'


class CategoryPostPageNumberPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 100


class CategoryPostListView(generics.ListAPIView):
    serializer_class = PostSerializer
    pagination_class = CategoryPostPageNumberPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content', 'author__username']
    ordering_fields = ['created_at', 'title']
    ordering = ['-created_at']

    def get_queryset(self):
        category_id = self.kwargs.get('category_id')
        page = self.request.query_params.get('page', 1)
        cache_key = f'category_{category_id}_posts_page_{page}'

        cached = cache.get(cache_key)
        if cached is not None:
            return cached

        queryset = Post.objects.select_related(
            'author', 'category'
        ).annotate(
            total_reactions=Count('reaction_set'),
            like_count=Count('reaction_set', filter=Q(
                reaction_set__reaction_type='LIKE')),
            love_count=Count('reaction_set', filter=Q(
                reaction_set__reaction_type='LOVE')),
            dislike_count=Count('reaction_set', filter=Q(
                reaction_set__reaction_type='DISLIKE')),
            fire_count=Count('reaction_set', filter=Q(
                reaction_set__reaction_type='FIRE')),
        ).filter(category_id=category_id)

        cache.set(cache_key, queryset, timeout=60 * 15)
        return queryset
