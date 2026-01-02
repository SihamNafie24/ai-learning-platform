import requests
from django.conf import settings

AUTH_SERVICE_URL = "http://localhost:8001/api/auth/me/"  # ✅ No 'POST' or 'GET' here

def verify_user(token: str):
    """
    Verifies a user's JWT token by calling the Auth Service.
    Returns user data if valid, or None if invalid.
    """
    headers = {"Authorization": f"Bearer {token}"}
    try:
        response = requests.get(AUTH_SERVICE_URL, headers=headers, timeout=5)
        if response.status_code == 200:
            return response.json()
        else:
            return None
    except requests.RequestException:
        return None
