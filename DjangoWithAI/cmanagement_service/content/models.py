from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Content(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="contents")
    title = models.CharField(max_length=255)
    subject = models.CharField(max_length=100)
    grade = models.CharField(max_length=50)
    content_type = models.CharField(max_length=50)  # e.g., lesson, quiz
    body = models.TextField(blank=True, default="")  # Stored content
    html_file = models.URLField(max_length=1024, blank=True, null=True)  # Optional now
    metadata = models.JSONField(default=dict, blank=True)  # AI model, prompt, etc.
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} ({self.user})"
