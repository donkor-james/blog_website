from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings


@shared_task(autoretry_for=(Exception, ), max_retries=3, retry_backoff=True)
def send_verification_email(user_email, activatation_link):
    send_mail(
        subject='Verify Your Account',
        message=f"Click the link to activate your account: {activatation_link}",
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[user_email],
        fail_silently=False
    )
    return f"Verification email sent to {user_email}"


@shared_task(autoretry_for=(Exception,), max_retries=3, retry_backoff=True)
def send_password_reset_email(user_email, reset_link):
    send_mail(
        subject='Reset Your Password',
        message=f"Click the link to reset your password: {reset_link}",
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[user_email],
        fail_silently=False
    )
    return f"Password reset email sent to {user_email}"


@shared_task(autoretry_for=(Exception,), max_retries=3, retry_backoff=True)
def send_resend_verification_email(user_email, activation_link):
    send_mail(
        subject='Verify Your Account',
        message=f"Click the link to activate your account: {activation_link}",
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[user_email],
        fail_silently=False
    )
    return f"Resend verification email sent to {user_email}"
