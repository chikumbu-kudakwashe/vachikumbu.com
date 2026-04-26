from django.contrib import admin
from .models import Project, Technology, Tag


@admin.register(Technology)
class TechnologyAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'status', 'progress', 'featured', 'createdAt', 'updatedAt')
    list_filter = ('status', 'featured', 'technologies', 'tags')
    search_fields = ('title', 'overview', 'long_description')
    filter_horizontal = ('technologies', 'tags',)
    readonly_fields = ('createdAt', 'updatedAt')
    fieldsets = (
        ('Basic Info', {
            'fields': ('title', 'overview', 'long_description', 'status', 'progress', 'featured', 'image')
        }),
        ('Relations', {
            'fields': ('technologies', 'tags',)
        }),
        ('Details', {
            'fields': ('challenges', 'devStory', 'demoUrl', 'githubUrl')
        }),
        ('Timestamps', {
            'fields': ('createdAt', 'updatedAt')
        }),
    )