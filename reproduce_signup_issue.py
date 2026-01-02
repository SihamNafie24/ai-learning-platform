import requests
import json

BASE_URL = "http://localhost:8000"

def signup(email, password, username, endpoint):
    url = f"{BASE_URL}{endpoint}"
    data = {
        "email": email,
        "password": password,
        "username": username
    }
    print(f"Signing up user: {email} at {endpoint}")
    try:
        response = requests.post(url, json=data)
        print(f"Signup Response: {response.status_code}")
        if response.status_code != 200 and response.status_code != 201:
             print("Response Body (truncated):", response.text[:200])
        else:
             print("Response Body:", response.text)
    except Exception as e:
        print(f"Signup failed: {e}")

if __name__ == "__main__":
    email = "newuser@example.com"
    password = "password123"
    username = "newuser"
    
    # Try to signup at /api/auth/signup/ (Current Frontend)
    print("\n--- Testing /api/auth/signup/ ---")
    signup(email, password, username, "/api/auth/signup/")

    # Try to signup at /api/auth/register/ (Correct Backend)
    print("\n--- Testing /api/auth/register/ ---")
    signup(email, password, username, "/api/auth/register/")
