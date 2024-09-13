# context_processors.py
from django.contrib.auth.models import User


def show_hero(request):
    print(request)
    if request.path == "/":

        return {
            'show_hero': True  # Or some logic to determine this
        }
    else:
        return {'show_hero': False}


users = User.objects.all()
print(users)
