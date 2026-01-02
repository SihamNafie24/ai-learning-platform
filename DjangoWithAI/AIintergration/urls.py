from django.urls import path
from .views import PDFPromptLLMView, upload_page, home, delete_history, archive_history, archives, restore_history

urlpatterns = [
    path('', home, name='home'),
    path('upload/', upload_page, name='upload_page'),
    path('pdf2llm/', PDFPromptLLMView.as_view(), name='upload_pdf_prompt_llm'),
    path('delete/<int:pk>/', delete_history, name='delete_history'),
    path('archive/<int:pk>/', archive_history, name='archive_history'),
    path('archives/', archives, name='archives'),
    path('restore/<int:pk>/', restore_history, name='restore_history'),
]
