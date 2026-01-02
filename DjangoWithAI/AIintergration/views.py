from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.views import View
from django.utils.decorators import method_decorator
from django.core.files.storage import default_storage
from django.conf import settings
import os

import requests
from .models import PDFHistory
from django.views.decorators.http import require_POST
from django.shortcuts import redirect, get_object_or_404
from django.urls import reverse
from openai import OpenAI
import google.generativeai as genai
from .prompts import get_prompt
from PyPDF2 import PdfReader
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated


def extract_html_content(text):
    start = text.find("<!DOCTYPE html>")
    end = text.rfind("</html>") + len("</html>")
    if start == -1 or end == -1:
        return ""
    return text[start:end]


def get_llm(provider="openai"):
    if provider == "openai":
        return OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=os.getenv("OPENROUTER_API_KEY")
        )
    elif provider == "gemini":
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        return genai
    else:
        raise ValueError("Unsupported provider")


def extract_text_from_pdf(pdf_path):
    reader = PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text


def fake_llm_api(pdf_path, details_prompt):
    """
    Extract text from PDF → send to Gemini → generate HTML → save file → return HTML
    """

    pdf_text = extract_text_from_pdf(pdf_path)

    client = get_llm("gemini")

    prompt = f"""
    You are an expert assistant that generates structured HTML content.
    Additional details: {details_prompt}
    PDF content (truncated for safety): {pdf_text}
    Return ONLY valid HTML, no explanations.
    """

    model = client.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content(prompt)

    html_content = extract_html_content(response.text)

    html_dir = os.path.join(settings.MEDIA_ROOT, "generated_html")
    os.makedirs(html_dir, exist_ok=True)

    html_filename = os.path.splitext(os.path.basename(pdf_path))[0] + ".html"
    html_path = os.path.join(html_dir, html_filename)

    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html_content)

    return html_content


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def newcontent(request):
    print("request >>>>>>>>>>>")
    print(request.data)

    pdf = request.FILES.get('file')
    if not pdf:
        return JsonResponse({'error': 'Missing PDF'}, status=400)

    pdf_path = default_storage.save(os.path.join('uploads', pdf.name), pdf)
    abs_pdf_path = os.path.join(settings.MEDIA_ROOT, pdf_path)

    first_prompt = get_prompt("firstPrompt")
    connaissancesPdg = get_prompt("connaissances_pedagogie")

    prompt_text = f"""
        the necessary instructions:
        {first_prompt}
        pedagogical knowledge:
        {connaissancesPdg}
    """

    try:
        llm_html = fake_llm_api(abs_pdf_path, prompt_text)

        history_entry = PDFHistory.objects.create(
            user=request.user,
            pdf_file=pdf_path,
            result_html=llm_html
        )

        print(">>>>>>>>>>>START HTML Content <<<<<<<<<<<")
        print(llm_html)
        print(">>>>>>>>>>>END HTML Content <<<<<<<<<<<<<")

        return Response({"htmlContent": llm_html})
    except Exception as e:
        print(f"Error generating content: {str(e)}")
        return Response({"error": str(e)}, status=500)


def upload_page(request):
    return render(request, 'upload.html')


def home(request):
    history = PDFHistory.objects.filter(archived=False).order_by('-created_at')
    return render(request, 'history.html', {'history': history})


def archives(request):
    history = PDFHistory.objects.filter(archived=True).order_by('-created_at')
    return render(request, 'history_archived.html', {'history': history})


@csrf_exempt
@require_POST
def delete_history(request, pk):
    entry = get_object_or_404(PDFHistory, pk=pk)
    entry.delete()
    return redirect(reverse('home'))


@csrf_exempt
@require_POST
def archive_history(request, pk):
    entry = get_object_or_404(PDFHistory, pk=pk)
    entry.archived = True
    entry.save()
    return redirect(reverse('home'))


@csrf_exempt
@require_POST
def restore_history(request, pk):
    entry = get_object_or_404(PDFHistory, pk=pk)
    entry.archived = False
    entry.save()
    return redirect('archives')


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_content(request):
    content = PDFHistory.objects.filter(user=request.user, archived=False).order_by('-created_at')
    data = []
    for item in content:
        data.append({
            'id': item.id,
            'title': os.path.basename(item.pdf_file.name),
            'type': 'lesson',  # Default type for now
            'subject': 'General', # Default subject
            'grade': 'General', # Default grade
            'createdAt': item.created_at,
            'status': 'published'
        })
    return Response(data)
