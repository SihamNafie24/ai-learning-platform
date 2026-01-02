import requests
import json

BASE_URL = "http://localhost:8000"

def register(email, password, name):
    url = f"{BASE_URL}/api/auth/register/"
    data = {
        "email": email,
        "password": password,
        "name": name
    }
    print(f"Registering user: {email}")
    try:
        response = requests.post(url, json=data)
        print(f"Register Response: {response.status_code}")
        # print(response.text)
        return response.status_code == 201 or "already exists" in response.text
    except Exception as e:
        print(f"Register failed: {e}")
        return False

def login(email, password, endpoint):
    url = f"{BASE_URL}{endpoint}"
    data = {
        "email": email,
        "password": password
    }
    print(f"Logging in user: {email} at {endpoint}")
    try:
        response = requests.post(url, json=data)
        print(f"Login Response: {response.status_code}")
        print("Response Body:", response.text)
    except Exception as e:
        print(f"Login failed: {e}")

if __name__ == "__main__":
    email = "testuser@example.com"
    password = "password123"
    name = "Test User"

    # Try to register first
    register(email, password, name)

    # Try to login at /api/login/ (Frontend uses this)
    print("\n--- Testing /api/login/ ---")
    login(email, password, "/api/login/")

    # Try to login at /api/auth/login/ (Backend seems to define this)
    print("\n--- Testing /api/auth/login/ ---")
    login(email, password, "/api/auth/login/")
