from rest_framework import serializers
from .models import Highlight, Skill, AboutData, Certification, Testimonial, Review
from shared.serializer_mixins import AbsoluteImageUrlMixin


class HighlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Highlight
        fields = '__all__'


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'


class AboutDataSerializer(AbsoluteImageUrlMixin, serializers.ModelSerializer):
  
    image_fields = ["cv"]

    highlights = HighlightSerializer(many=True, read_only=True)
    skills = SkillSerializer(many=True, read_only=True)

    highlight_ids = serializers.PrimaryKeyRelatedField(
        queryset=Highlight.objects.all(),
        many=True,
        write_only=True,
        source="highlights",
    )
    skill_ids = serializers.PrimaryKeyRelatedField(
        queryset=Skill.objects.all(),
        many=True,
        write_only=True,
        source="skills",
    )

    class Meta:
        model = AboutData
        fields = "__all__"


class CertificationSerializer(AbsoluteImageUrlMixin, serializers.ModelSerializer):
   
    image_fields = ["image"]

    class Meta:
        model = Certification
        fields = "__all__"

    def validate_image(self, value):
        from django.conf import settings

        max_mb = getattr(settings, "MAX_UPLOAD_SIZE_MB", 5)
        allowed = getattr(
            settings,
            "ALLOWED_IMAGE_TYPES",
            ["image/jpeg", "image/png", "image/webp", "image/gif"],
        )

        content_type = getattr(value, "content_type", None)
        if content_type and content_type not in allowed:
            raise serializers.ValidationError(
                f"Unsupported image type '{content_type}'. "
                f"Allowed: {', '.join(allowed)}."
            )

        max_bytes = max_mb * 1024 * 1024
        if value.size > max_bytes:
            raise serializers.ValidationError(
                f"Image too large ({value.size / (1024*1024):.1f} MB). "
                f"Max: {max_mb} MB."
            )

        return value

class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = '__all__'

class ContactSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    subject = serializers.CharField(max_length=200, required=False, allow_blank=True)
    message = serializers.CharField()


class ReviewSerializer(serializers.ModelSerializer): 
    class Meta:
        model = Review
        fields = '__all__'
