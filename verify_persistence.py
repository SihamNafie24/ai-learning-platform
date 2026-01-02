import requests
import os

BASE_URL = "http://localhost:8000"

def verify_persistence():
    # 1. Login
    email = "testuser@example.com"
    password = "password123"
    
    # Ensure user exists (optional, but good for repeatability)
    requests.post(f"{BASE_URL}/api/auth/register/", json={
        "name": "Test User",
        "email": email,
        "password": password
    })

    print(f"Logging in as {email}...")
    login_resp = requests.post(f"{BASE_URL}/api/login/", json={
        "email": email,
        "password": password
    })
    
    if login_resp.status_code != 200:
        print(f"Login failed: {login_resp.text}")
        return

    token = login_resp.json().get("access")
    print("Login successful")

    headers = {"Authorization": f"Bearer {token}"}

    # 2. Upload Content
    print("Uploading PDF...")
    # Create a dummy PDF
    with open("test.pdf", "wb") as f:
        f.write(b"%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Resources <<\n/Font <<\n/F1 4 0 R\n>>\n>>\n/Contents 5 0 R\n>>\nendobj\n4 0 obj\n<<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Helvetica\n>>\nendobj\n5 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 24 Tf\n100 700 Td\n(Hello World) Tj\nET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f\n0000000010 00000 n\n0000000060 00000 n\n0000000117 00000 n\n0000000255 00000 n\n0000000343 00000 n\ntrailer\n<<\n/Size 6\n/Root 1 0 R\n>>\nstartxref\n437\n%%EOF")

    files = {'file': ('test.pdf', open('test.pdf', 'rb'), 'application/pdf')}
    data = {
        'subject': 'Math',
        'grade': 'Grade 10',
        'contentType': 'lesson'
    }
    
    upload_resp = requests.post(f"{BASE_URL}/api/upload/", headers=headers, files=files, data=data)
    
    if upload_resp.status_code != 200:
        print(f"Upload failed: {upload_resp.text}")
        return

    print("Upload successful")

    # 3. Get User Content
    print("Fetching user content...")
    content_resp = requests.get(f"{BASE_URL}/api/my-content/", headers=headers)
    
    if content_resp.status_code != 200:
        print(f"Failed to fetch content: {content_resp.text}")
        return

    content_list = content_resp.json()
    print(f"Fetched {len(content_list)} items")
    
    found = False
    for item in content_list:
        if item['title'] == 'test.pdf':
            found = True
            print("Found uploaded file in history!")
            break
    
    if not found:
        print("Uploaded file NOT found in history")

    # Cleanup
    os.remove("test.pdf")

if __name__ == "__main__":
    verify_persistence()
