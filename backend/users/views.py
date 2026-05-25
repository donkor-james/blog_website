from django.core.cache import cache
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from django.db.models import Count
from .serializer import (RegisterSerializer, LoginSerializer,
                         UserSerializer, ResetPasswordSerializer,
                         ResendVerificationSerializer, ChangePasswordSerializer)
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import generics
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
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
from blog.serializer import PostSerializer
from blog.throttles import LoginThrottle
from django.conf import settings
from .tasks import (
    send_verification_email,
    send_password_reset_email,
    send_resend_verification_email
)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            try:
                token = default_token_generator.make_token(user)
                uid = urlsafe_base64_encode(force_bytes(user.id))
                activation_link = f"{settings.FRONTEND_URL}/verify-account/{uid}/{token}/"
                send_verification_email.delay(user.email, activation_link)

                return Response({"message": "sign up successfully"}, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({'message': 'Something went wrong, please try agin'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({"message": "Required fields cannot be empty"}, status=status.HTTP_400_BAD_REQUEST)

        # Generate token for 2 step verification


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    throttle_classes = [LoginThrottle]

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response({'message': 'Please provide both email and password'}, status=status.HTTP_400_BAD_REQUEST)

        validated_data = serializer.validated_data
        email = validated_data.get('email')
        password = validated_data.get('password')

        try:
            user = User.objects.get(email=email)
            if not user.is_verified:
                return Response({'message': 'Account not verified'}, status=status.HTTP_401_UNAUTHORIZED)

            if not user.check_password(password):
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
            return Response({'message': 'An error occurred, please try again later'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VerifyAccountView(generics.GenericAPIView):
    def post(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)

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

        if serializer.is_valid():
            email = serializer.validated_data['email']

        try:
            user = User.objects.get(email=email)

            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            activation_link = f"{settings.FRONTEND_URL}/verify-account/{uid}/{token}/"

            send_resend_verification_email.delay(user.email, activation_link)

            return Response({'message': 'Activation link sent successfully'})
        except User.DoesNotExist as e:
            return Response({'message': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ChangePasswordView(generics.GenericAPIView):
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        password = serializer.validated_data.get('password')
        new_password = serializer.validated_data.get('new_password')

        try:
            user = self.request.user
            if not user.check_password(password):
                return Response(
                    {'message': 'Wrong current password'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            user.set_password(new_password)
            user.save()
            return Response({'message': "password reset successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ResetPasswordView(generics.GenericAPIView):
    queryset = User.objects.all()
    serializer_class = ResetPasswordSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data.get('email')

        try:
            user = User.objects.get(email=email)
            # Generate token for password reset
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            reset_link = f"{settings.FRONTEND_URL}/reset-password-confirm/{uid}/{token}/"

            send_password_reset_email.delay(user.email, reset_link)

            return Response({'message': 'Password reset link sent successfully'})
        except User.DoesNotExist:
            return Response({'message': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ConfirmResetPassword(generics.GenericAPIView):
    def post(self, request, uid64, token):
        password = request.data.get('password', None)

        if not password:
            return Response({'message': 'Password is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            uid = force_str(urlsafe_base64_decode(uid64))
            user = User.objects.get(pk=uid)

            if user and default_token_generator.check_token(user, token):
                user.set_password(password)
                user.save()
                return Response({'message': 'Password reset successfully'})
            return Response({'message': 'Invalid or expired token'})
        except User.DoesNotExist:
            return Response(
                {'message': 'User does not exist'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception:
            return Response(
                {'message': 'Something went wrong'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class RefreshTokenView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh = request.data.get('refresh', None)
        if not refresh:
            return Response({'message': 'Refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Validate the refresh token and create a new access token
            token = RefreshToken(refresh)
            new_access = str(token.access_token)
            new_refresh = str(token)  # Get a new refresh token

            return Response({'access': new_access, 'refresh': new_refresh}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_401_UNAUTHORIZED)


class UserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()

    def get_object(self):
        return self.request.user


class UserUpdateView(generics.UpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()

    def get_object(self):
        return self.request.user


class FeaturedWritersView(generics.ListAPIView):
    serializer_class = UserSerializer

    def get_queryset(self):
        cached = cache.get('featured_writers')
        if cached is not None:
            return cached

        queryset = User.objects.annotate(
            post_count=Count('posts', distinct=True),
            reaction_count=Count('posts__reaction_set', distinct=True)
        ).order_by('-reaction_count', '-post_count').distinct()[:3]  # Use distinct() here if needed

        cache.set('featured_writers', list(queryset),
                  timeout=60 * 15)  # Convert to list for caching
        return queryset
