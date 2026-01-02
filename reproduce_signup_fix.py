import requests
import json

BASE_URL = "http://localhost:8000"

def signup_with_invalid_token(email, password, username, endpoint):
    url = f"{BASE_URL}{endpoint}"
    data = {
        "email": email,
        "password": password,
        "name": username  # Changed from 'username' to 'name' to match view expectation
    }
    
    # Simulate the issue: sending an invalid token
    headers = {
        "Authorization": "Bearer invalid_token_string"
    }
    
    print(f"Signing up user: {email} at {endpoint} with INVALID TOKEN")
    try:
        response = requests.post(url, json=data, headers=headers)
        print(f"Signup Response: {response.status_code}")
        if response.status_code in [200, 201]:
            print("✅ SUCCESS: Registration succeeded despite invalid token!")
            print("Response Body:", response.text)
        else:
            print("❌ FAILED: Registration failed.")
            print("Response Body:", response.text)
            
    except Exception as e:
        print(f"Signup failed: {e}")

if __name__ == "__main__":
    # Use a unique email to avoid "already exists" error if possible, or just check status
    import time
    timestamp = int(time.time())
    email = f"testuser_{timestamp}@example.com"
    password = "password123"
    username = f"Test User {timestamp}"
    
    # Test the registration endpoint
    signup_with_invalid_token(email, password, username, "/api/auth/register/")
