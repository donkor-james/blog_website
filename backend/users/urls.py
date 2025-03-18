from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('verify-confirm/<uidb64>/<token>/',
         views.VerifyAccountView.as_view(), name='verify'),
    path('resend-verification/', views.ResendActivationLinkView.as_view(),
         name='resend-verification'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('profile/', views.UserView.as_view(), name='user'),
    path('reset-password/', views.ResetPasswordView.as_view(),
         name='password-verify'),
    path('confirm-reset-password/<uidb64>/<token>/',
         views.ConfirmResetPassword.as_view(), name='confirm-reset-password'),
    path('update/<int:pk>/', views.UserView.as_view(), name='update-user'),
    # path('blogs/', blodView.PostListCreateView.as_view(), name='blog'),
]
