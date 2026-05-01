from django.db import models
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.models import AbstractUser
from PIL import Image
# from rest_framework import
# Create your models here.


class User(AbstractUser):
    email = models.EmailField(unique=True)
    is_verified = models.BooleanField(default=False)
    image = models.ImageField(default='default.jpg', upload_to='profile_pics/')
    bio = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.username
