from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Content
from .serializers import ContentSerializer

class IsOwnerPermission(permissions.BasePermission):
    """
    Allow access only to content owners for object-level operations.
    """
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user


class ContentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing educational content.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ContentSerializer
    
    def get_queryset(self):
        """Only return content owned by the current user"""
        return Content.objects.filter(user=self.request.user)
    
    def get_permissions(self):
        """Apply IsOwnerPermission only for object-level actions"""
        if self.action in ['retrieve', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsOwnerPermission()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        """Save content with the current user"""
        serializer.save(user=self.request.user)