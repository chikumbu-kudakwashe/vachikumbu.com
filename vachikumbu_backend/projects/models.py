from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from shared.validators import validate_image


class StatusChoice(models.TextChoices):
    ACTIVE = "active", "Active"
    IN_PROGRESS = "in-progress", "In Progress"
    COMPLETED = "completed", "Completed"
    ARCHIVED = "archived", "Archived"
    DRAFT = "draft", "Draft"
    IDEA = "idea", "Idea"


class Technology(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Tag(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Project(models.Model):
    title = models.CharField(max_length=500)
    overview = models.TextField()
    long_description = models.TextField()

    image = models.ImageField(
        upload_to="project_images/",
        validators=[validate_image],
    )

    technologies = models.ManyToManyField(Technology, blank=True)
    tags = models.ManyToManyField(Tag, blank=True)
    challenges = models.TextField(blank=True)
    devStory = models.TextField(blank=True)
    demoUrl = models.URLField(blank=True)
    githubUrl = models.URLField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=StatusChoice.choices,
        default=StatusChoice.IN_PROGRESS,
    )
    progress = models.PositiveIntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
    )
    featured = models.BooleanField(default=False)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
