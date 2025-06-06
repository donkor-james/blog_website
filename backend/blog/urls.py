from django.urls import path
# from . import views
from .views import PostCreateView, PostListView, PostRetrieveUpdatedDestroy, CategoryListView, ReactionToPostView, UserPostView, AuthorPostView

urlpatterns = [
    path('posts/', PostListView.as_view(), name='blog-posts'),
    path('posts/new/', PostCreateView.as_view(), name='post-create'),
    path('posts/update/<int:pk>/',
         PostRetrieveUpdatedDestroy.as_view(), name='post-update'),
    path('posts/delete/<int:pk>/',
         PostRetrieveUpdatedDestroy.as_view(), name='post-delete'),
    path('categories/', CategoryListView.as_view(), name='categories'),
    path('user-posts/', UserPostView.as_view(), name='user-post'),
    path('users/<int:author_id>/posts/',
         AuthorPostView.as_view(), name='author-post'),
    path('post-reaction/<str:post_id>/',
         ReactionToPostView.as_view(), name='react'),
    # path('about/', views.about, name='blog-about'),
]
