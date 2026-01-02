import fitz  # PyMuPDF
import base64
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework import status

class PDFUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def post(self, request):
        pdf_data = None
        filename = "document.pdf"
        
        # Handle file upload (form-data)
        if 'file' in request.FILES:
            pdf_file = request.FILES['file']
            filename = pdf_file.name
            
            # Validate file type
            if not pdf_file.name.endswith('.pdf'):
                return Response(
                    {"error": "File must be a PDF"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            pdf_data = pdf_file.read()
        
        # Handle base64 encoded PDF (JSON)
        elif 'file_base64' in request.data:
            try:
                pdf_data = base64.b64decode(request.data['file_base64'])
                filename = request.data.get('filename', filename)
            except Exception as e:
                return Response(
                    {"error": f"Invalid base64 data: {str(e)}"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        else:
            return Response(
                {"error": "No file provided. Use 'file' for form-data or 'file_base64' for JSON"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Read and extract text from PDF
            doc = fitz.open(stream=pdf_data, filetype="pdf")
            text = ""
            page_count = len(doc)  # Get page count before closing
            
            for page_num, page in enumerate(doc, 1):
                page_text = page.get_text()
                text += f"\n--- Page {page_num} ---\n{page_text}"
            
            doc.close()
            
            return Response({
                "success": True,
                "filename": filename,
                "pages": page_count,
                "extracted_text": text.strip(),
                "preview": text.strip()[:500] + "..." if len(text) > 500 else text.strip()
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {"error": f"Failed to process PDF: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )