from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.contenttypes.models import ContentType


@shared_task
def refresh_featured_posts_cache():
    """
    Runs every 5 minutes to keep featured posts cache fresh.
    Since featured posts change when reactions are added,
    we refresh it periodically instead of waiting for it to expire.
    """

    from .models.post import Post
    from .models.reaction import Reactions
    from django.db.models import Count, Q
    from django.core.cache import cache

    queryset = list(Post.objects.annotate(
        total_reactions=Count('reaction_set'),
        like_count=Count('reaction_set', filter=Q(
            reaction_set__reaction_type='LIKE')),
        love_count=Count('reaction_set', filter=Q(
            reaction_set__reaction_type='LOVE')),
        dislike_count=Count('reaction_set', filter=Q(
            reaction_set__reaction_type='DISLIKE')),
        fire_count=Count('reaction_set', filter=Q(
            reaction_set__reaction_type='FIRE')),
    ).order_by('-total_reactions'))

    cache.set('featured_posts', queryset, timeout=60 * 5)


@shared_task
def cleanup_old_notifications():
    """
    Runs every day to delete notifications older than 30 days.
    """
    from notification.models import Notification
    from django.utils import timezone
    from datetime import timedelta

    cutoff = timezone.now() - timedelta(days=30)
    Notification.objects.filter(
        created_at__lt=cutoff,
        is_read=True
    ).delete()


@shared_task
def send_new_post_notification(post_id):
    """
    Sends a notification to all followers when a new post is created.
    This is called from the PostCreateView after a post is successfully created.
    """
    from .models.post import Post
    from notification.models import Notification
    from users.models import User

    try:
        post = Post.objects.get(id=post_id)
        author = post.author

        send_mail(
            subject=f"New post from {author.get_full_name()}",
            message=f"{author.get_full_name()} just published a new post: '{post.title}'. Check it out!",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[author.email],
            fail_silently=True,
        )
    except Post.DoesNotExist:
        pass  # Post was deleted before we could send notifications
