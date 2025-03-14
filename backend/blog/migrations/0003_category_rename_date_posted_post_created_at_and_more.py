# Generated by Django 5.1.1 on 2025-03-03 12:42

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0002_alter_post_author'),
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=250)),
                ('decription', models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.RenameField(
            model_name='post',
            old_name='date_posted',
            new_name='created_at',
        ),
        migrations.AddField(
            model_name='post',
            name='category',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='blog.category'),
        ),
    ]
