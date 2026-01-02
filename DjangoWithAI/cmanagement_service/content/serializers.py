from rest_framework import serializers
from .models import Content
from django.contrib.auth import get_user_model

User = get_user_model()

class ContentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)  # Show username
    
    class Meta:
        model = Content
        fields = [
            "id", "user", "title", "subject", "grade",
            "content_type", "body", "html_file", "metadata",
            "created_at", "updated_at"
        ]
        read_only_fields = ["id", "user", "html_file", "created_at", "updated_at"]