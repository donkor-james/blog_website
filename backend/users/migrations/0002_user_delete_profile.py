# Generated by Django 5.1.1 on 2025-02-15 14:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=250)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('password', models.CharField(max_length=255)),
                ('image', models.ImageField(default='default.jpg', upload_to='profile_pics')),
            ],
        ),
        migrations.DeleteModel(
            name='Profile',
        ),
    ]
