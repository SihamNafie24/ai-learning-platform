import requests
import json

BASE_URL = "http://localhost:8000"

# Test login
print("Testing login with sihamnafie2000@gmail.com...")
login_data = {
    "email": "sihamnafie2000@gmail.com",
    "password": "test123"  # You may need to adjust this
}

try:
    response = requests.post(f"{BASE_URL}/api/login/", json=login_data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    if response.status_code == 200:
        print("Login successful!")
        print(json.dumps(response.json(), indent=2))
    else:
        print("Login failed!")
except Exception as e:
    print(f"Error: {e}")
