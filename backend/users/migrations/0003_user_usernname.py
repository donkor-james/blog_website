# Generated by Django 5.1.1 on 2025-03-15 22:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_alter_user_bio'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='usernname',
            field=models.CharField(blank=True, max_length=250, null=True),
        ),
    ]
