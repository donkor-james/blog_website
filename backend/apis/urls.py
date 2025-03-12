from django.urls import path
from . import views
from users import views
from blog import views as blodView

urlpatterns = [
    path('login/', views.LoginView.as_view(), name='login'),
    # path('user/<str:username>', UserPostListView.as_view(), name='user-posts'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('user/me', views.UserView.as_view(), name='user'),
    path('blogs/', blodView.PostListCreateView.as_view(), name='blog'),

    # path('<int:pk>/update/',
    #      PostRetrieveUpdatedDestroy.as_view(), name='post-update'),
    # path('<int:pk>/delete/',
    #      PostRetrieveUpdatedDestroy.as_view(), name='post-delete'),
]
