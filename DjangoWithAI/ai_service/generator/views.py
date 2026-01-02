from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.serializers import Serializer, CharField

import google.generativeai as genai
import os

# Serializer for input validation
class AIGenerationSerializer(Serializer):
    subject = CharField(required=True)
    grade = CharField(required=True)
    content_type = CharField(required=True)
    content = CharField(required=True)

# AI Generation View using Gemini
class AIGenerationView(APIView):
    # Change to IsAuthenticated when integrating with auth service
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = AIGenerationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data

        # Build a structured AI prompt
        prompt = f"""
You are an expert educational content generator.
Create a well-structured HTML {data['content_type']} for grade {data['grade']} students
studying {data['subject']}. Base it on the following content:

{data['content']}

Return only clean, semantic HTML without scripts or external links.
Make it visually appealing with proper headings, paragraphs, lists, and structure.
Use appropriate HTML5 tags like <article>, <section>, <h1>-<h6>, <p>, <ul>, <ol>, etc.
"""

        try:
            # Get API key from environment
            api_key = os.getenv("GEMINI_API_KEY")
            
            if not api_key or api_key == "your_gemini_api_key_here":
                return Response(
                    {"error": "Gemini API key not configured. Please set GEMINI_API_KEY in .env file"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            # Configure Gemini
            genai.configure(api_key=api_key)

            # Create the model
            model = genai.GenerativeModel('gemini-1.5-flash')

            # Generate content
            response = model.generate_content(prompt)

            # Extract HTML from response
            html_output = response.text.strip()

            # Remove markdown code blocks if present
            if html_output.startswith('```html'):
                html_output = html_output[7:]  # Remove ```html
            if html_output.startswith('```'):
                html_output = html_output[3:]  # Remove ```
            if html_output.endswith('```'):
                html_output = html_output[:-3]  # Remove closing ```
            
            html_output = html_output.strip()

            # Optional metadata
            metadata = {
                "subject": data["subject"],
                "grade": data["grade"],
                "content_type": data["content_type"],
                "created_by": request.user.username if request.user.is_authenticated else "anonymous",
                "model": "gemini-1.5-flash"
            }

            return Response(
                {
                    "success": True,
                    "html": html_output,
                    "metadata": metadata
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {"error": f"Failed to generate content: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )