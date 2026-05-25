from unittest.mock import patch
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from unittest.mock import patch

User = get_user_model()


class AuthAPITest(TestCase):

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

    # ─── REGISTER ─────────────────────────────────────────

    def test_register_success(self):
        response = self.client.post('/api/users/register/', {
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'john@example.com',
            'password': 'securepass123'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email='john@example.com').exists())

    def test_register_duplicate_email(self):
        response = self.client.post('/api/users/register/', {
            'first_name': 'Test',
            'last_name': 'User',
            'email': 'test@example.com',  # already exists
            'password': 'securepass123'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_weak_password(self):
        response = self.client.post('/api/users/register/', {
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'john2@example.com',
            'password': '123'  # too short
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_missing_fields(self):
        response = self.client.post('/api/users/register/', {
            'email': 'john3@example.com',
            # missing first_name, last_name, password
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # ─── LOGIN ────────────────────────────────────────────

    def test_login_success(self):
        response = self.client.post('/api/users/login/', {
            'email': 'test@example.com',
            'password': 'testpass123'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_login_wrong_password(self):
        response = self.client.post('/api/users/login/', {
            'email': 'test@example.com',
            'password': 'wrongpassword'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_unverified_account(self):
        # Create unverified user
        unverified = User.objects.create_user(
            username='unverified',
            email='unverified@example.com',
            password='testpass123',
            first_name='Un',
            last_name='Verified',
            is_verified=False  # ← not verified
        )
        response = self.client.post('/api/users/login/', {
            'email': 'unverified@example.com',
            'password': 'testpass123'
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_nonexistent_email(self):
        response = self.client.post('/api/users/login/', {
            'email': 'nobody@example.com',
            'password': 'testpass123'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # ─── USER PROFILE ─────────────────────────────────────

    def test_get_profile_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/users/profile/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'test@example.com')

    def test_get_profile_unauthenticated(self):
        response = self.client.get('/api/users/profile/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_profile_does_not_expose_password(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/users/profile/')
        self.assertNotIn('password', response.data)
        self.assertNotIn('is_superuser', response.data)
        self.assertNotIn('is_staff', response.data)

    # ─── CHANGE PASSWORD ──────────────────────────────────

    def test_change_password_success(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/users/change-password/', {
            'password': 'testpass123',
            'new_password': 'newpass456'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Verify new password works
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('newpass456'))

    def test_change_password_wrong_current(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/users/change-password/', {
            'password': 'wrongpassword',
            'new_password': 'newpass456'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_change_password_same_as_current(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/users/change-password/', {
            'password': 'testpass123',
            'new_password': 'testpass123'  # same as current
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class UserTaskTest(TestCase):

    @patch('users.tasks.send_mail')
    def test_send_verification_email(self, mock_send_mail):
        from users.tasks import send_verification_email

        send_verification_email.run(
            'test@example.com',
            'http://example.com/verify/abc/123/'
        )

        self.assertTrue(mock_send_mail.called)
        call_args = mock_send_mail.call_args
        self.assertIn('test@example.com', str(call_args))

    @patch('users.tasks.send_mail')
    def test_send_password_reset_email(self, mock_send_mail):
        from users.tasks import send_password_reset_email

        send_password_reset_email.run(
            'test@example.com',
            'http://example.com/reset/abc/123/'
        )

        self.assertTrue(mock_send_mail.called)
