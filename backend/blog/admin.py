from django.contrib import admin
from blog.models.post import Post
from blog.models.category import Category
from blog.models.reaction import Reactions

# Register your models here.
admin.site.register(Post)
admin.site.register(Category)
admin.site.register(Reactions)
