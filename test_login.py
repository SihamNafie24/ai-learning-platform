import requests
import json

# Test login endpoint
url = "http://localhost:8000/api/login/"
data = {
    "email": "sihamnafie2000@gmail.com",
    "password": "your_password_here"  # Replace with actual password
}

print(f"Testing login at: {url}")
print(f"Request data: {json.dumps(data, indent=2)}")

try:
    response = requests.post(url, json=data)
    print(f"\nStatus Code: {response.status_code}")
    print(f"Response Headers: {dict(response.headers)}")
    print(f"Response Body: {response.text}")
    
    if response.status_code == 200:
        print("\n✅ Login successful!")
        response_data = response.json()
        print(f"Access Token: {response_data.get('access', 'N/A')[:50]}...")
        print(f"User: {response_data.get('user', {})}")
    else:
        print(f"\n❌ Login failed!")
        
except Exception as e:
    print(f"\n❌ Error: {e}")
