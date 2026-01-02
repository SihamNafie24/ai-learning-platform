from django.contrib import admin
from .models import Content

@admin.register(Content)
class ContentAdmin(admin.ModelAdmin):
    list_display = ("title", "user", "subject", "grade", "content_type", "created_at")
    search_fields = ("title", "subject", "metadata")
    list_filter = ("subject", "grade", "content_type")
