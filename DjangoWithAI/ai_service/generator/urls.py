from django.urls import path
from .views import AIGenerationView

urlpatterns = [
    path("generate/", AIGenerationView.as_view(), name="ai-generate"),  # Fixed path
]