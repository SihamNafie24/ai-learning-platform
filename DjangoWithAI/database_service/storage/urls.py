from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PDFFileViewSet, HTMLContentViewSet

router = DefaultRouter()
router.register(r'pdf', PDFFileViewSet)
router.register(r'html', HTMLContentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
