from django.test import TestCase
from django.contrib.auth import get_user_model
from blog.models.post import Post
from blog.models.category import Category
from rest_framework.test import APIClient
from rest_framework import status
from django.core.files.uploadedfile import SimpleUploadedFile
from unittest.mock import patch

User = get_user_model()


class PostModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpassword',
            first_name='Test',
            last_name='User',
        )
        self.category = Category.objects.create(
            name='Technology'
        )
        self.post = Post.objects.create(
            title='Test Post Title',
            content='This is test content for the post ' * 5,
            author=self.user,
            category=self.category
        )

    def test_post_creation(self):
        self.assertEqual(self.post.title, 'Test Post Title')
        self.assertEqual(self.post.author, self.user)
        self.assertEqual(self.post.category, self.category)
        self.assertTrue(len(self.post.content) > 0)

    def test_post_str_representation(self):
        self.assertEqual(str(self.post), 'Test Post Title')

    def test_post_belongs_to_author(self):
        posts = Post.objects.filter(author=self.user)
        self.assertEqual(posts.count(), 1)


class PostAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpassword',
            first_name='Test',
            last_name='User',
        )
        self.category = Category.objects.create(
            name='Technology'
        )
        self.post = Post.objects.create(
            title='Test Post Title',
            content='This is test content for the post ' * 5,
            author=self.user,
            category=self.category
        )

        # Minimal valid JPEG image (1x1 pixel)
        self.image = SimpleUploadedFile(
            name='test.jpg',
            content=(
                b'\xff\xd8\xff\xe0'  # SOI + APP0
                b'\x00\x10JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00'
                b'\xff\xdb\x00C\x00' + b'\x08'*64 +
                b'\xff\xc0\x00\x11\x08\x00\x01\x00\x01\x03\x01\x11\x00\x02\x11\x01\x03\x11\x01'
                b'\xff\xc4\x00\x14\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00'
                b'\xff\xda\x00\x08\x01\x01\x00\x00?\x00\xd2\xcf \xff\xd9'
            ),
            content_type='image/jpeg'
        )

    def authenticate(self):
        self.client.force_authenticate(user=self.user)

    def test_list_posts_returns_200(self):
        response = self.client.get('/api/blog/posts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list_posts_return_correct_fields(self):
        response = self.client.get('/api/blog/posts/')
        results = response.data['results']
        self.assertTrue('id' in results[0])
        self.assertTrue('title' in results[0])
        self.assertTrue('author' in results[0])
        self.assertTrue('category' in results[0])

    def test_create_post_requires_authentication(self):
        response = self.client.post('/api/blog/posts/new/', {
            'title': 'New Post',
            'content': 'This is the content of the new post.',
            'category': self.category.id
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_post_authenticated(self):
        self.authenticate()

        response = self.client.post('/api/blog/posts/new/', {
            'title': 'New Post title',
            'content': 'This is the content of the new post' * 5,
            'category': self.category.id,
            'coverImage': self.image
        }, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Post.objects.count(), 2)

    def test_create_post_title_too_short(self):
        self.authenticate()

        response = self.client.post('/api/blog/posts/new/', {
            'title': 'New',
            'content': 'This is the content of the new post.',
            'category': self.category.id,
            'coverImage': self.image
        }, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_post_content_too_short(self):
        self.authenticate()
        response = self.client.post('/api/blog/posts/new/', {
            'title': 'New Post',
            'content': 'Too short',
            'category': self.category.id,
            'coverImage': self.image
        }, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_retrieve_post(self):
        self.authenticate()
        response = self.client.get(f'/api/blog/posts/get/{self.post.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.post.id)

    def test_retrieve_returns_correct_fields(self):
        self.authenticate()
        response = self.client.get(f'/api/blog/posts/get/{self.post.id}/')
        self.assertEqual(response.data['id'], self.post.id)

    def test_delete_post_requires_authentication(self):
        response = self.client.delete(
            f'/api/blog/posts/delete/{self.post.id}/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_post_authenticated(self):
        self.authenticate()
        response = self.client.delete(
            f'/api/blog/posts/delete/{self.post.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Post.objects.count(), 0)

    def test_delete_post_by_non_author(self):
        other_user = User.objects.create_user(
            username='otheruser',
            email='otheruser@example.com',
            password='otherpassword',
            first_name='Other',
            last_name='User',
        )

        self.client.force_authenticate(user=other_user)

        response = self.client.delete(
            f'/api/blog/posts/delete/{self.post.id}/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class AdditionalPostAPITest(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User',
            is_verified=True
        )
        self.category = Category.objects.create(name='Technology')
        self.post = Post.objects.create(
            title='Test Post Title',
            content='This is test content for the post ' * 5,
            author=self.user,
            category=self.category
        )

    def test_recent_posts_returns_200(self):
        response = self.client.get('/api/blog/recent-posts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_recent_posts_returns_max_3(self):
        # Create 5 posts
        for i in range(5):
            Post.objects.create(
                title=f'Post {i}',
                content='Content ' * 10,
                author=self.user,
                category=self.category
            )
        response = self.client.get('/api/blog/recent-posts/')
        self.assertLessEqual(len(response.data), 3)

    def test_category_list_returns_200(self):
        response = self.client.get('/api/blog/categories/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_category_posts_returns_200(self):
        response = self.client.get(
            f'/api/blog/category/{self.category.id}/posts/'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_posts_requires_auth(self):
        response = self.client.get('/api/blog/user-posts/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_posts_returns_only_own_posts(self):
        self.client.force_authenticate(user=self.user)

        # Create another user with a post
        other_user = User.objects.create_user(
            username='other',
            email='other@example.com',
            password='testpass123',
            first_name='Other',
            last_name='User',
            is_verified=True
        )
        Post.objects.create(
            title='Other Post',
            content='Content ' * 10,
            author=other_user,
            category=self.category
        )

        response = self.client.get('/api/blog/user-posts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        for post in response.data:
            self.assertEqual(post['author']['id'], self.user.id)

    def test_reaction_requires_auth(self):
        response = self.client.post(
            f'/api/blog/posts/{self.post.id}/react/',
            {'reaction_type': 'LIKE'}
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_reaction_invalid_type(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            f'/api/blog/posts/{self.post.id}/react/',
            {'reaction_type': ''}  # empty reaction type
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_reaction_valid(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            f'/api/blog/posts/{self.post.id}/react/',
            {'reaction_type': 'LIKE'}
        )
        self.assertIn(response.status_code, [
            status.HTTP_200_OK,
            status.HTTP_201_CREATED
        ])


class CeleryTaskTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User',
            is_verified=True
        )
        self.category = Category.objects.create(name='Technology')
        self.post = Post.objects.create(
            title='Test Post',
            content='Content ' * 10,
            author=self.user,
            category=self.category
        )

    @patch('django.core.mail.send_mail')
    def test_send_new_post_notification(self, mock_send_mail):
        from blog.tasks import send_new_post_notification

        # Call task directly (not via .delay())
        result = send_new_post_notification(
            post_id=self.post.id
        )

        # Verify email was sent
        self.assertTrue(mock_send_mail.called)
        self.assertIn('Test Post', str(mock_send_mail.call_args))


print
