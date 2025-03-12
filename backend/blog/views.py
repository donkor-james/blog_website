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
    # permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class PostListView(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer


class PostRetrieveUpdatedDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    # permission_classes = [IsAuthenticated]


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = ListCategorySerializer


class ReactionToPostView(APIView):
    # queryset = Reactions.objects.all()
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
