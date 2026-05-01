from django.db import models

# Create your models here.


class Notification(models.Model):
    users = models.ManyToManyField(
        'users.User', related_name='grouped_notifications')
    post = models.ForeignKey(
        'blog.Post', on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')
    reaction_type = models.CharField(max_length=10, null=True, blank=True)
    message = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification {self.id} for Post {self.post.id}"
