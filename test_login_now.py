import requests
import json

# Test login endpoint
url = "http://localhost:8000/api/login/"

# You'll need to use the correct password for this user
test_credentials = {
    "email": "sihamnafie2000@gmail.com",
    "password": "test123"  # Replace with actual password
}

print(f"Testing login at: {url}")
print(f"Email: {test_credentials['email']}")
print("-" * 60)

try:
    response = requests.post(url, json=test_credentials)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 200:
        print("\n✅ LOGIN SUCCESSFUL!")
    else:
        print(f"\n❌ Login failed with status {response.status_code}")
        
except Exception as e:
    print(f"❌ Error: {e}")
