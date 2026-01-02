from django.urls import path
from .views import register_view, login_view, MyTokenObtainPairView

urlpatterns = [
    path('register/', register_view, name='register'),
    path('login/', login_view, name='login'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
]
