from django.db import models
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.models import AbstractUser
from PIL import Image
# from rest_framework import
# Create your models here.


class User(AbstractUser):
    # username = models.CharField(max_length=250)
    email = models.EmailField(unique=True)
    # password = models.CharField(max_length=255)
    # isActive = models.BooleanField(default=False)
    image = models.ImageField(default='default.jpg', upload_to='profile_pics')

    # def set_password(self, password):
    #     self.password = make_password(password)

    # def check_password(self, password):
    #     return check_password(password, self.password)

    # def activate(self):
    #     self.isActive = True

    # def __str__(self):
    #     return f'{self.username}'

    # def save(self, *arg, **kwargs):
    #     super.save(*arg, **kwargs)

    #     img = Image.open(self.image.path)

    #     if img.height > 300 or img.width > 300:
    #         output_size = (300, 300)
    #         img.thumbnail(output_size)
    #         img.save(self.image.path)
