import threading

from rest_framework import viewsets, permissions, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema

from .models import Highlight, Skill, AboutData, Certification, Testimonial, Review
from .serializers import (
    HighlightSerializer,
    SkillSerializer,
    AboutDataSerializer,
    CertificationSerializer,
    TestimonialSerializer,
    ContactSerializer,
    ReviewSerializer,
)
from .utils import send_custom_mail, send_notification_email


class AdminWriteOrReadOnly(permissions.BasePermission):
    
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)


class RequestContextMixin:
   
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context




@extend_schema(tags=["Highlights"])
class HighlightViewSet(viewsets.ModelViewSet):
    queryset = Highlight.objects.all()
    serializer_class = HighlightSerializer
    permission_classes = [AdminWriteOrReadOnly]


@extend_schema(tags=["Skills"])
class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [AdminWriteOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(category__iexact=category)
        return qs


@extend_schema(tags=["About"])
class AboutDataView(RequestContextMixin, generics.RetrieveUpdateAPIView):
    
    serializer_class = AboutDataSerializer
    permission_classes = [AdminWriteOrReadOnly]

    def get_object(self):
        obj, _ = (
            AboutData.objects.prefetch_related("highlights", "skills").get_or_create(pk=1)
        )
        return obj


@extend_schema(tags=["Certifications"])
class CertificationViewSet(RequestContextMixin, viewsets.ModelViewSet):
   
    queryset = Certification.objects.all().order_by("-date")
    serializer_class = CertificationSerializer
    permission_classes = [AdminWriteOrReadOnly]


@extend_schema(tags=["Testimonials"])
class TestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.filter(approved=True)
    serializer_class = TestimonialSerializer
    permission_classes = [permissions.AllowAny]
    http_method_names = ["get", "post"]

    def perform_create(self, serializer):
        instance = serializer.save()
        threading.Thread(
            target=send_notification_email,
            args=(
                instance.name,
                f"New Testimonial from {instance.name}",
                instance.content,
            ),
            daemon=True,
        ).start()


@extend_schema(tags=["Contact"])
class ContactView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ContactSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            threading.Thread(
                target=send_custom_mail,
                args=(
                    data["name"],
                    data["email"],
                    data.get("subject", ""),
                    data["message"],
                ),
                daemon=True,
            ).start()
            return Response({"success": True, "message": "Sent Successfully!"})
        return Response(serializer.errors, status=400)


@extend_schema(tags=["Reviews"])
class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.filter(approved=True)
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]
    http_method_names = ["get", "post"]

    def perform_create(self, serializer):
        instance = serializer.save()
        threading.Thread(
            target=send_notification_email,
            args=(
                instance.name,
                f"New Portfolio Review from {instance.name}",
                instance.message,
            ),
            daemon=True,
        ).start()
