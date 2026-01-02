"""
Script to reset password for testing login
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')
django.setup()

from django.contrib.auth.models import User

# Reset password for test user
email = 'sihamnafie2000@gmail.com'
new_password = 'test123'

try:
    user = User.objects.get(email=email)
    user.set_password(new_password)
    user.save()
    print(f"✅ Password reset successfully for {email}")
    print(f"   Username: {user.username}")
    print(f"   New password: {new_password}")
    print(f"   Password check: {user.check_password(new_password)}")
except User.DoesNotExist:
    print(f"❌ User with email {email} does not exist")
