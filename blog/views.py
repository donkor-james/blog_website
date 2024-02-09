from django.shortcuts import render
from django.http import HttpResponse
from .models import Post

posts = [
    {
        'author': 'James',
        'title': ' James 1st post',
        'content': 'First django project',
        'date_posted': 'January 27, 2024'
    },
    {
        'author': 'Bless',
        'title': 'Bless 1st post',
        'content': 'I am excited to make my first post',
        'date_posted': 'March 20, 2024'
    },
    {
        'author': 'Hamlet',
        'title': 'Hamlet 1st post',
        'content': 'This application is revolutionary',
        'date_posted': 'June 16, 2024'
    },
]


def home(request):
    context = {
        'posts': Post.objects.all()
    }
    return render(request, 'blog/home.html', context)


def about(request):
    return render(request, 'blog/about.html', {'title': 'About'})
