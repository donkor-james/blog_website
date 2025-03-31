from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from .serializer import (RegisterSerializer, LoginSerializer,
                         UserSerializer, ResetPasswordSerializer,
                         ResendVerificationSerializer)
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import generics
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from smtplib import SMTPException
from django.utils.encoding import force_str
from django.core.mail import send_mail
# from django.core.mail.exceptions import SMTPException
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

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():

            user_exist = User.objects.filter(
                email=serializer.validated_data.get('email')).exists()

            if user_exist:
                return Response({"message": "User with already exist"}, status=status.HTTP_400_BAD_REQUEST)

            user = serializer.save()
            # data = serializer.validated_data
            # user = User(**data)
            print(user, 'registered user')
            try:
                # print("user for verification", user.get_full_name())
                token = default_token_generator.make_token(user)
                uid = urlsafe_base64_encode(force_bytes(user.id))
                activation_link = f"http://localhost:3000/verify-account/{uid}/{token}/"
                sender = settings.EMAIL_HOST_USER
                subject = 'Verify Your Account'
                send_mail(
                    subject, f"Click the link to activate your account: {activation_link}", sender, [user.email], fail_silently=False)
                # user.save()

                return Response({"message": "sign up successfully"}, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({'message': 'Something went wrong, please try agin'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        else:
            return Response({"message": "Required fields cannot be empty"}, status=status.HTTP_400_BAD_REQUEST)

        # Generate token for 2 step verification


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response({'message': 'Please provide both email and password'}, status=status.HTTP_400_BAD_REQUEST)

        validated_data = serializer.validated_data
        email = validated_data.get('email')
        password = validated_data.get('password')

        try:
            user = User.objects.get(email=email)

            print(user.__dict__, "login")
            if not user.is_verified:
                return Response({'message': 'Account not verified'}, status=status.HTTP_401_UNAUTHORIZED)

            if user.password != password:
                print('wrong pass')
                return Response({'message': 'Wrong email or password'}, status=status.HTTP_400_BAD_REQUEST)

            # Generate tokens
            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'Login successful',
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            }, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({'message': 'Wrong email or password'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Log the error for debugging (optional)
            print(e)
            return Response({'message': 'An error occurred, please try again later'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VerifyAccountView(generics.GenericAPIView):

    def post(self, request, uidb64, token):
        try:
            # print('\n-----\nuidb64: ', uidb64)
            uid = force_str(urlsafe_base64_decode(uidb64))

            # print("\n------\nuid: ", uid)
            user = User.objects.get(pk=uid)
            print("\n------\nuser: ", user.__dict__)

            # print(user.__dict__, 'user')

            if user and default_token_generator.check_token(user, token):
                # serializer = self.get_serializer(data=request.data)
                # if serializer.is_valid():
                user.is_verified = True
                user.save()
                refresh = RefreshToken.for_user(user)

                return Response({"message": "Account activated successfully", "refresh": str(refresh), "access": str(refresh.access_token)}, status=status.HTTP_200_OK)
                # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"message": "Invalid token or user."}, status=status.HTTP_400_BAD_REQUEST)

        except User.DoesNotExist:
            return Response({'message': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({'message': 'Something went wrong try again later'})


class ResendActivationLinkView(generics.GenericAPIView):
    queryset = User.objects.all()
    serializer_class = ResendVerificationSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        print("request", request.data)

        if serializer.is_valid():
            email = serializer.validated_data['email']
        else:
            return Response({"message": 'email is required'}, status=status.HTTP_400_BAD_REQUEST)
        # email = request.data.get('email', None)

        try:
            user = User.objects.get(email=email)
            print(user.__dict__, 'user verr')

            if user.is_verified:
                return Response({"message": "Email is already verified"})
            # Generate token for 2 step verification
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))

            activation_link = f"http://localhost:3000/verify-account/{uid}/{token}/"
            sender = settings.EMAIL_HOST_USER  # Use your settings for the sender email

            subject = 'Verify Your Account'
            send_mail(subject,
                      f"Click the link to activate your account: {activation_link}",
                      sender,
                      ['jamesdonkor987@gmail.com'],
                      fail_silently=False
                      )

            return Response({'message': 'Activation link sent successfully'})
        except User.DoesNotExist as e:
            return Response({'message': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
        print(self.request.user.email, 'user', self.queryset)
        return self.request.user

    def perform_update(self, serializer):
        validated_data = serializer.validated_data
        user = self.request.user

        user.first_name = validated_data.get('first_name', user.first_name)
        user.last_name = validated_data.get('last_name', user.last_name)
        user.image = validated_data.get('image', user.image)
        user.email = validated_data.get('email', user.email)
        password = validated_data.get('password', None)

        if password:
            user.set_password(password)
        user.save()


class UserRetrieveView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class FeaturedWritersView(generics.ListAPIView):
    serializer_class = UserSerializer

    def get_queryset(self):
        posts = Post.objects.order_by('-reaction_type_count')[:]

        users = []

        for post in posts:
            users.append(post.author)

        return users


for user in User.objects.all():
    print(user.__dict__, user.id)
print(len(User.objects.all()))
