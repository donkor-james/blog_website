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
from rest_framework.pagination import CursorPagination
# from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin


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


class PostCursorPagination(CursorPagination):
    page_size = 5
    ordering = '-created_at'


class PostListView(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    pagination_class = PostCursorPagination


class PostRetrieveUpdatedDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    # def get_queryset(self):
    #     return Post.objects.filter(author=self.request.user)


class UserPostView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        posts = Post.objects.filter(author=self.request.user.id)
        return posts


class AuthorPostView(generics.ListAPIView):
    serializer_class = PostSerializer
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        posts = Post.objects.filter(author=self.kwargs['author_id'])
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
                return Response({'message': 'reaction type not available'})

            # if not reaction_type:
            #     return Response({'message': ''})

            reaction, create = Reactions.objects.get_or_create(
                user=self.request.user, post=post, defaults={'reaction_type': reaction_type})

            # print(reaction, 'reaction')
            if create:
                return Response({'message': 'reaction created', "post": PostSerializer(post).data}, status=status.HTTP_201_CREATED)
            else:
                if reaction.reaction_type != reaction_type:
                    Reactions.objects.create(
                        user=self.request.user, post=post, reaction_type=reaction_type)
                reaction.delete()
                return Response({'message': 'reaction removed', "post": PostSerializer(post).data}, status=status.HTTP_200_OK)
        except Post.DoesNotExist:
            return Response({'error': 'post deleted'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class RecentPostView(generics.ListAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        queryset = Post.objects.order_by('-created_at')[:3]
        return queryset


class FeaturedPostsListView(generics.ListAPIView):
    # serializer_class = PostSerializer
    queryset = Post.objects.annotate(reaction_count=Count(
        'reaction_set')).order_by('reaction_count')
    # serializer_class = PostSerializer

    # def get_object(self):
    #     return super().get_object()


class CategoryPostCursorPagination(CursorPagination):
    page_size = 5
    ordering = '-created_at'


class CategoryPostListView(generics.ListAPIView):
    serializer_class = PostSerializer
    pagination_class = CategoryPostCursorPagination

    def get_queryset(self):
        category_id = self.kwargs.get('category_id')
        return Post.objects.filter(category_id=category_id)
