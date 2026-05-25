from rest_framework.throttling import AnonRateThrottle, UserRateThrottle


class PostCreateThrottle(AnonRateThrottle):
    scope = 'post_create'


class LoginThrottle(UserRateThrottle):
    scope = 'login'
