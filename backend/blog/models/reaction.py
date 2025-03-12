from django.db import models
from .post import Post
from users.models import User


class Reactions(models.Model):
    REACTION_TYPE = [
        ('LIKE', 'like'),
        ('LOVE', 'love'),
        ('DISLIKE', 'dislike'),
        ('FIRE', 'fire')
    ]
    post = models.ForeignKey(
        Post, on_delete=models.CASCADE, related_name='reaction_set')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    reaction_type = models.CharField(max_length=10, choices=REACTION_TYPE)

    def __str__(self):
        return f'{self.user.username} reacted to {self.post.title}'
