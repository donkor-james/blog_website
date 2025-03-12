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
    author = models.ForeignKey(
        User, on_delete=models.CASCADE, null=True, default=None, related_name='posts')
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, null=True, default=None)
    reactions = models.ManyToManyField(
        User, through='Reactions', related_name="reacted_post")
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.title

    # def get_absolute_url(self):
    #     return reverse('post-detail', kwargs={'pk': self.pk})
