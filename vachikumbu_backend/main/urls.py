from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    HighlightViewSet, SkillViewSet, AboutDataView,
    CertificationViewSet, TestimonialViewSet, ContactView, ReviewViewSet
)

router = DefaultRouter()
router.register(r'highlights', HighlightViewSet, basename='highlight')
router.register(r'skills', SkillViewSet, basename='skill')
router.register(r'certifications', CertificationViewSet, basename='certification')
router.register(r'testimonials', TestimonialViewSet, basename='testimonial')
router.register(r'reviews', ReviewViewSet, basename="reviews")

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/about/', AboutDataView.as_view(), name='about'),
    path('api/contact/', ContactView.as_view(), name='contact' ),
]