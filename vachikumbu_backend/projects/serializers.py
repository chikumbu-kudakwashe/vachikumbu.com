from rest_framework import serializers
from shared.serializer_mixins import AbsoluteImageUrlMixin
from .models import Project, Technology, Tag


class TechnologySerializer(serializers.ModelSerializer):
    class Meta:
        model = Technology
        fields = "__all__"


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = "__all__"


class ProjectSerializer(AbsoluteImageUrlMixin, serializers.ModelSerializer):
    

  
    image_fields = ["image"]

  
    technologies = TechnologySerializer(many=True, read_only=True)
    tags = TagSerializer(many=True, read_only=True)

   
    technology_ids = serializers.PrimaryKeyRelatedField(
        queryset=Technology.objects.all(),
        many=True,
        write_only=True,
        source="technologies",
    )
    tag_ids = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(),
        many=True,
        write_only=True,
        source="tags",
    )

    class Meta:
        model = Project
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
                f"Max allowed: {max_mb} MB."
            )

        return value
