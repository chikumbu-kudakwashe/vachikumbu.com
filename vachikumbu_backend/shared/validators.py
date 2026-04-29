"""
shared/validators.py
--------------------
Reusable validators for image uploads across all Django apps.
"""
from django.conf import settings
from django.core.exceptions import ValidationError


def validate_image(image):
    """
    Validate an uploaded image file for content type and file size.

    Raises ValidationError if:
      - The MIME type is not in settings.ALLOWED_IMAGE_TYPES
      - The file exceeds settings.MAX_UPLOAD_SIZE_MB
    """
    max_mb = getattr(settings, "MAX_UPLOAD_SIZE_MB", 5)
    allowed = getattr(
        settings,
        "ALLOWED_IMAGE_TYPES",
        ["image/jpeg", "image/png", "image/webp", "image/gif"],
    )

    # --- content-type check ---
    content_type = getattr(image.file, "content_type", None)
    if content_type and content_type not in allowed:
        raise ValidationError(
            f"Unsupported image type '{content_type}'. "
            f"Allowed types: {', '.join(allowed)}."
        )

    # --- size check ---
    max_bytes = max_mb * 1024 * 1024
    if image.size > max_bytes:
        raise ValidationError(
            f"Image file too large ({image.size / (1024*1024):.1f} MB). "
            f"Maximum allowed size is {max_mb} MB."
        )
