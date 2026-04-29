from rest_framework import viewsets, permissions
from drf_spectacular.utils import extend_schema

from .models import Project, Technology, Tag
from .serializers import ProjectSerializer, TechnologySerializer, TagSerializer


class AdminWriteOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)


@extend_schema(tags=["Tech Stack"])
class TechnologyViewSet(viewsets.ModelViewSet):
    queryset = Technology.objects.all()
    serializer_class = TechnologySerializer
    permission_classes = [AdminWriteOrReadOnly]


@extend_schema(tags=["Tags"])
class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [AdminWriteOrReadOnly]


@extend_schema(tags=["Projects"])
class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all().prefetch_related("technologies", "tags")
    serializer_class = ProjectSerializer
    permission_classes = [AdminWriteOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        status = self.request.query_params.get("status")
        featured = self.request.query_params.get("featured")

        if status:
            qs = qs.filter(status=status)
        if featured is not None:
            qs = qs.filter(featured=featured.lower() == "true")

        return qs

    def get_serializer_context(self):
        
        context = super().get_serializer_context()
        context["request"] = self.request
        return context
