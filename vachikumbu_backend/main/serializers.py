from rest_framework import serializers
from .models import Highlight, Skill, AboutData, Certification, Testimonial, Review


class HighlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Highlight
        fields = '__all__'


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'


class AboutDataSerializer(serializers.ModelSerializer):
    highlights = HighlightSerializer(many=True, read_only=True)
    skills = SkillSerializer(many=True, read_only=True)

    highlight_ids = serializers.PrimaryKeyRelatedField(
        queryset=Highlight.objects.all(), many=True, write_only=True, source='highlights'
    )
    skill_ids = serializers.PrimaryKeyRelatedField(
        queryset=Skill.objects.all(), many=True, write_only=True, source='skills'
    )

    class Meta:
        model = AboutData
        fields = '__all__'


class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = '__all__'


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
