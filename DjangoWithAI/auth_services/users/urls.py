from django.urls import path
from .views import RegisterView, LoginView
from . import views

urlpatterns = [
    path('signup/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('me/', views.UserProfileView.as_view(), name='user-profile'),
]
