from django.urls import path
from . import views
from AIintergration.views import newcontent, get_user_content
from auth_services.views import register_view, login_view

urlpatterns = [
    path('newcontent/', views.uploadFile),
    path('upload/', newcontent),
    path('my-content/', get_user_content),
    path('register/', register_view),
    path('login/', login_view),  # ✅ مهم: trailing slash
]
