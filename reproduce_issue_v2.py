import requests
import json

BASE_URL = "http://localhost:8000"

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
    
    # Try to login at /api/login/
    print("\n--- Testing /api/login/ ---")
    login(email, password, "/api/login/")
