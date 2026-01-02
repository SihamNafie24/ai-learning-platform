import os
from django.conf import settings
import uuid

def save_html_locally(html_str: str, filename: str = None) -> str:
    """
    Save html_str to MEDIA_ROOT/html_content/<filename>.html
    Return the relative URL (MEDIA_URL + path).
    """
    folder = os.path.join(settings.MEDIA_ROOT, "html_content")
    os.makedirs(folder, exist_ok=True)

    if not filename:
        filename = f"{uuid.uuid4().hex}.html"
    if not filename.endswith(".html"):
        filename = f"{filename}.html"

    file_path = os.path.join(folder, filename)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(html_str)

    # return public-serving URL path (you will serve media in urls)
    return settings.MEDIA_URL + f"html_content/{filename}"

# Optional S3 uploader (enable later if you set AWS credentials)
def upload_html_to_s3(file_name: str, content: str) -> str:
    """
    If you set AWS keys in settings, this uploads to S3 and returns its https URL.
    Requires boto3.
    """
    import boto3
    s3 = boto3.client(
        "s3",
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_REGION,
    )
    key = f"html_content/{file_name}"
    s3.put_object(Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=key, Body=content, ContentType="text/html")
    return f"https://{settings.AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com/{key}"
