from django.db import models
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.models import AbstractUser
from PIL import Image
# from rest_framework import
# Create your models here.


class User(AbstractUser):
    fullname = models.CharField(max_length=250)
    usernname = models.CharField(max_length=250, blank=True, null=True)
    email = models.EmailField(unique=True)
    image = models.ImageField(default='default.jpg', upload_to='profile_pics')
    bio = models.TextField(blank=True, null=True)
