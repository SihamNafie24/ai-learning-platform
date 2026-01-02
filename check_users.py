"""
Check what passwords are stored for users
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')

import sys
sys.path.insert(0, 'C:/Users/hp/Desktop/forAISETSVM/DjangoWithAI/DjangoWithAI/DjangoWithAI')

django.setup()

from django.contrib.auth.models import User

# List all users and test passwords
users = User.objects.all()
print(f"Total users: {users.count()}\n")

for user in users:
    print(f"User: {user.username}")
    print(f"  Email: {user.email}")
    print(f"  ID: {user.id}")
    print(f"  First Name: {user.first_name}")
    print(f"  Password check 'test123': {user.check_password('test123')}")
    print(f"  Password check '123456': {user.check_password('123456')}")
    print(f"  Password check 'password': {user.check_password('password')}")
    print()
