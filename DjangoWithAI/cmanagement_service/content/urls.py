from rest_framework.routers import DefaultRouter
from .views import ContentViewSet

router = DefaultRouter()
router.register(r"", ContentViewSet, basename="content")

urlpatterns = router.urls
