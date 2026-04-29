from django.contrib import admin
from .models import Highlight, Skill, AboutData, Certification, Testimonial, Review


@admin.register(Highlight)
class HighlightAdmin(admin.ModelAdmin):
    list_display = ('id', 'highlight')
    search_fields = ('highlight',)


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'category')
    list_filter = ('category',)
    search_fields = ('name', 'category')


@admin.register(AboutData)
class AboutDataAdmin(admin.ModelAdmin):
    list_display = ('id', 'updatedAt')
    filter_horizontal = ('highlights', 'skills')
    readonly_fields = ('updatedAt',)
    fieldsets = (
        ('Content', {'fields': ('bio', 'philosophy', 'cv')}),
        ('Relations', {'fields': ('highlights', 'skills')}),
        ('Meta', {'fields': ('updatedAt',)}),
    )


@admin.register(Certification)
class CertificationAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'issuer', 'date')
    list_filter = ('issuer',)
    search_fields = ('title', 'issuer')
    ordering = ('-date',)


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'role', 'company')
    search_fields = ('name', 'company')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'rating', 'message', 'approved')
    