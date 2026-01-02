import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')
django.setup()

from django.contrib.auth.models import User
from django.contrib.auth import authenticate

# Check if user exists
email = "sihamnafie2000@gmail.com"

print(f"Checking for user with email: {email}")
print("=" * 60)

try:
    user = User.objects.get(email=email)
    print(f"✅ User found!")
    print(f"   - ID: {user.id}")
    print(f"   - Username: {user.username}")
    print(f"   - Email: {user.email}")
    print(f"   - First Name: {user.first_name}")
    print(f"   - Last Name: {user.last_name}")
    print(f"   - Is Active: {user.is_active}")
    print(f"   - Is Staff: {user.is_staff}")
    print(f"   - Is Superuser: {user.is_superuser}")
    print(f"   - Date Joined: {user.date_joined}")
    
    # Test authentication with a password (you'll need to provide the correct one)
    print("\n" + "=" * 60)
    print("Testing authentication...")
    test_password = input("Enter password to test: ")
    
    # Try authenticating with username=email
    auth_user = authenticate(username=email, password=test_password)
    if auth_user:
        print(f"✅ Authentication successful!")
    else:
        print(f"❌ Authentication failed!")
        print(f"   - Trying to check password manually...")
        if user.check_password(test_password):
            print(f"   ✅ Password is correct (check_password works)")
        else:
            print(f"   ❌ Password is incorrect")
    
except User.DoesNotExist:
    print(f"❌ User with email '{email}' does NOT exist!")
    print("\nAll users in database:")
    for u in User.objects.all():
        print(f"   - {u.username} ({u.email})")
