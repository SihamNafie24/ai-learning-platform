from django.db import models

# Create your models here.

from django.contrib.auth.models import User

class PDFHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    pdf_file = models.FileField(upload_to='uploads/')
    prompt = models.TextField()
    result_html = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    archived = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.pdf_file.name} @ {self.created_at}"
