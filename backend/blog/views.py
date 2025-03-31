# from typing import Any
# from django.db.models.query import QuerySet
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


class PostListView(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer


class PostRetrieveUpdatedDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]


class UserPostView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        posts = Post.objects.filter(author_id=self.request.user.id)
        return posts


class AuthorPostView(generics.ListAPIView):
    serializer_class = PostSerializer
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        posts = Post.objects.filter(author_id=self.kwargs['author_id'])
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
            user = self.request.user

            reaction, created = Reactions.objects.get_or_create(
                user=user, post=post, reaction_type=reaction_type)

            if created:
                return Response({'message': 'reaction created'}, status=status.HTTP_201_CREATED)
            else:
                reaction.delete()
                return Response({'message': 'reaction removed'}, status=status.HTTP_200_OK)
        except Post.DoesNotExist:
            return Response({'error': 'post deleted'})
        except Exception as e:
            return Response({'error': str(e)})


class RecentPostView(generics.ListAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        queryset = Post.objects.order_by('-created_at')[:5]

        return queryset


# print(Post.objects.all(), 'posts')
