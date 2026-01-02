from django.urls import path
from .views import PDFUploadView

urlpatterns = [
    path('upload/', PDFUploadView.as_view(), name='pdf-upload'),
]
