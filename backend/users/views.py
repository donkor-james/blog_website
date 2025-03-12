from django.shortcuts import render, redirect
from django.contrib import messages
# from .forms import UserRegistrationForm, UserUpdateForm, ProfileUpdateForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from .serializer import RegisterSerializer, LoginSerializer, UserSerializer, ResetPasswordSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import generics
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from smtplib import SMTPException
from django.utils.encoding import force_str
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_str
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.conf import settings
from rest_framework import status
from .models import User
from blog.models.post import Post
from datetime import timedelta
# Create your views here.


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)

        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        try:
            user = User.objects.create_user(**validated_data)
            print(user.email, 'user')
            user.is_active = False
            user.save()
            # user = User.objects.get(email=email)
            # Generate token for 2 step verification
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))

            activation_link = f"http://localhost:3000/{uid}/{token}/"
            sender = settings.EMAIL_HOST_USER  # Use your settings for the sender email

            subject = 'Verify Your Account'
            send_mail(subject,
                      f"Click the link to activate your account: {activation_link}",
                      sender,
                      [user.email],
                      fail_silently=False
                      )
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        # print(request.data, 'loginn')

        if serializer.is_valid(raise_exception=True):
            validated_data = serializer.validated_data

            user = User.objects.filter(email=validated_data['email']).first()

            if user.check_password(validated_data['password']):
                refresh = RefreshToken.for_user(user)
                return Response({'user': {'user_id': user.id, 'username': user.username, 'email': user.email, "image_url": f'http://localhost:5000/{user.image}'}, 'refresh': str(refresh), 'access': str(refresh.access_token)})

            return Response({'error': 'Wrong email or password'})
            # return Response({'message': 'user does not exist'})


class VerifyAccountView(generics.GenericAPIView):

    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)

        # except User.DoesNotExist:
        #     return Response({'error': })
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({'error': 'Something went wrong try again later'})

        if user and default_token_generator.check_token(user, token):
            # serializer = self.get_serializer(data=request.data)
            # if serializer.is_valid():
            # user.set_password(serializer.validated_data['new_password'])
            user.activate = True
            user.save()
            return Response({"message": "Account activated successfully"}, status=status.HTTP_200_OK)
            # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"detail": "Invalid token or user."}, status=status.HTTP_400_BAD_REQUEST)


class ResetPasswordView(generics.GenericAPIView):
    queryset = User.objects.all()
    serializer_class = ResetPasswordSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        try:
            user = User.objects.get(email=email)
            # Generate token for password reset
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))

            activation_link = f"http://localhost:3000/{uid}/{token}/"
            sender = settings.EMAIL_HOST_USER  # Use your settings for the sender email

            subject = 'Reset Your Password'
            send_mail(subject,
                      f"Click the link to reset password: {activation_link}",
                      sender,
                      [user.email],
                      fail_silently=False
                      )

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ConfirmResetPassword(generics.GenericAPIView):

    def post(self, request, uid64, token):
        password = request.data.get('password', None)

        uid = force_str(urlsafe_base64_decode(uid64))
        user = User.objects.get(pk=uid)

        if user and default_token_generator.check_token(user, token):
            user.set_password(password)
            return Response({'message': 'Password reset successfully'})
        else:
            return Response({'message': 'Invalid token'})


class UserView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    # permission_classes = [IsAuthenticated]
    # User = get_user_model()
    queryset = User.objects.all()
    posts = Post.objects.all()

    # print(posts)

    def get_object(self):
        print(self.request.user, 'user', self.queryset)

        # for post in self.posts:
        #     try:
        #         if post.author.DoesNotExist:
        #             print(post, '------')
        #     except Exception:
        #         print(post)
        #         post.delete()
        return self.request.user

    def perform_update(self, serializer):
        validated_data = serializer.validated_data
        user = self.request.user

        user.username = validated_data.get('username', user.username)
        user.image = validated_data.get('image', user.image)
        # user.email = validated_data.get('image', user.email)
