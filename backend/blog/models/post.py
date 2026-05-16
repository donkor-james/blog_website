from django.db import models
from django.utils import timezone
# from django.contrib.auth.models import User
from users.models import User
from .category import Category
# from .reaction import Reactions
from django.urls import reverse
# Create your models here.


class Post(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    coverImage = models.ImageField(upload_to='blog_images/')
    author = models.ForeignKey(
        User, on_delete=models.CASCADE, null=True, default=None, related_name='posts')
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE)
    reactions = models.ManyToManyField(
        User, through='Reactions', related_name="reacted_post")
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.title

    class Meta:
        indexes = [
            # ✅ Keep this — composite index Django doesn't auto-create
            models.Index(fields=['category', '-created_at'],
                         name='idx_post_category_date'),

            # ✅ Keep this — ordering index Django doesn't auto-create
            models.Index(fields=['-created_at'], name='idx_post_created_at'),
        ]
