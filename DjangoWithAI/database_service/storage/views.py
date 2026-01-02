from rest_framework import viewsets
from .models import PDFFile, HTMLContent
from .serializers import PDFFileSerializer, HTMLContentSerializer

class PDFFileViewSet(viewsets.ModelViewSet):
    queryset = PDFFile.objects.all()
    serializer_class = PDFFileSerializer

class HTMLContentViewSet(viewsets.ModelViewSet):
    queryset = HTMLContent.objects.all()
    serializer_class = HTMLContentSerializer
