from rest_framework.response import Response
import openai
from rest_framework.decorators import api_view

@api_view(['POST'])
def uploadFile(request):
	file = request.FILES.get('file')
	if not file:
		return Response({"error": "No file provided"}, status=400)

	# Process the uploaded file (e.g., save it, analyze it, etc.)
	# For demonstration, we'll just return the file name and size
	file_info = {
		"file_name": file.name,
		"file_size": file.size,
	}

	return Response({"message": "File uploaded successfully", "file_info": file_info}, status=200)