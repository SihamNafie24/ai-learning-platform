import requests
import json

BASE_URL = "http://localhost:8000"

def login(email, password):
    url = f"{BASE_URL}/api/login/"
    data = {
        "email": email,
        "password": password
    }
    print(f"Logging in user: {email}")
    try:
        response = requests.post(url, json=data)
        print(f"Login Response: {response.status_code}")
        print("Response Body:", response.text)
        if response.status_code == 200:
            print("✅ Login successful!")
        else:
            print("❌ Login failed!")
    except Exception as e:
        print(f"Login failed: {e}")

if __name__ == "__main__":
    # This user was created in the previous step (reproduce_signup_fix.py)
    email = "fixeduser@example.com"
    password = "password123"
    
    login(email, password)
