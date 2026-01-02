from rest_framework import serializers
from .models import PDFFile, HTMLContent

class PDFFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PDFFile
        fields = '__all__'

class HTMLContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = HTMLContent
        fields = '__all__'
