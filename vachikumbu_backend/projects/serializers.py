from rest_framework import serializers
from .models import Project, Technology, Tag

class TechnologySerializer(serializers.ModelSerializer):
    class Meta:
        model = Technology
        fields = '__all__'

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'


class ProjectSerializer(serializers.ModelSerializer):
    technologies = TechnologySerializer(many=True, read_only=True)
    tags = TagSerializer(many=True, read_only=True)

    technology_ids = serializers.PrimaryKeyRelatedField(
        queryset=Technology.objects.all(), many=True, write_only=True, source='technologies'
    )
    tag_ids = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(), many=True, write_only=True, source='tags'
    )

    class Meta:
        model = Project
        fields = '__all__'