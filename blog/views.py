from .models import Post
from django.http import HttpResponse
from django.shortcuts import render
from django.views.generic import ListView, DetailView, CreateView

# posts = [
#     {
#         'author': 'James',
#         'title': ' James 1st post',
#         'content': 'First django project',
#         'date_posted': 'January 27, 2024'
#     },
#     {
#         'author': 'Bless',
#         'title': 'Bless 1st post',
#         'content': 'I am excited to make my first post',
#         'date_posted': 'March 20, 2024'
#     },
#     {
#         'author': 'Hamlet',
#         'title': 'Hamlet 1st post',
#         'content': 'This application is revolutionary',
#         'date_posted': 'June 16, 2024'
#     },
# ]


def home(request):
    context = {
        'posts': Post.objects.all()
    }
    return render(request, 'blog/home.html', context)


class PostListView(ListView):
    model = Post
    template_name = "blog/home.html"
    context_object_name = "posts"
    ordering = ["date_posted"]


class PostDetailView(DetailView):
    model = Post


class PostCreateView(CreateView):
    model = Post
    fields = ['title', 'content']


def about(request):
    return render(request, 'blog/about.html', {'title': 'About'})
