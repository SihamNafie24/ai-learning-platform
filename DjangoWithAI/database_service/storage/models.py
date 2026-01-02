from django.db import models

class PDFFile(models.Model):
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='pdfs/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    user_id = models.IntegerField()

class HTMLContent(models.Model):
    title = models.CharField(max_length=255)
    html_file = models.FileField(upload_to='html/', null=True, blank=True)
    raw_html = models.TextField()
    subject = models.CharField(max_length=100)
    grade = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    user_id = models.IntegerField()
