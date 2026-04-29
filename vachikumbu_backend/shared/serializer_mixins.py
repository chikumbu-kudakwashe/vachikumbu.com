"""
shared/serializer_mixins.py
---------------------------
Mixin that rewrites ImageField / FileField values to fully-qualified
absolute URLs using the incoming HTTP request so the frontend never
has to reconstruct URLs.

Usage
-----
    class MySerializer(AbsoluteImageUrlMixin, serializers.ModelSerializer):
        image_fields = ["image", "thumbnail"]   # list every file/image field
        ...
"""
from rest_framework import serializers


class AbsoluteImageUrlMixin:
    """
    Override to_representation() so that every field listed in
    ``image_fields`` is returned as a fully-qualified URL
    (e.g. https://vachikumbu.com/media/project_images/foo.jpg)
    instead of the bare relative path Django normally produces.

    The mixin reads ``self.context["request"]`` which DRF injects
    automatically when the serializer is instantiated inside a view.
    """

    image_fields: list[str] = []

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        request = self.context.get("request")

        for field_name in self.image_fields:
            value = representation.get(field_name)
            if value and request is not None:
                # build_absolute_uri handles http/https and any sub-path prefix
                representation[field_name] = request.build_absolute_uri(value)

        return representation
