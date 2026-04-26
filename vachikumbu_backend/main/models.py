from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class Highlight(models.Model):
    highlight = models.TextField()

    def __str__(self): return self.highlight[:60]


class Skill(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    level = models.PositiveIntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )

    def __str__(self): return f"{self.name} ({self.category})"


class AboutData(models.Model):
    bio = models.TextField()
    philosophy = models.TextField()
    highlights = models.ManyToManyField(Highlight, blank=True)
    skills = models.ManyToManyField(Skill, blank=True)
    cv = models.FileField(upload_to='uploads/cv/')
    updatedAt = models.DateTimeField(auto_now=True)

    def __str__(self): return f"About (updated {self.updatedAt.date()})"


class Certification(models.Model):
    title = models.CharField(max_length=255)
    issuer = models.CharField(max_length=255)
    date = models.DateField()
    link = models.URLField(blank=True)
    image = models.ImageField(upload_to='uploads/certifications/')

    def __str__(self): return f"{self.title} — {self.issuer}"


class Testimonial(models.Model):
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=255)
    company = models.CharField(max_length=255, blank=True)
    content = models.TextField()
    approved = models.BooleanField(default=False)

    def __str__(self): return f"{self.name} @ {self.company}"

class Review(models.Model):
    name = models.CharField(max_length=255)
    rating = models.PositiveBigIntegerField(
        validators=[
            MinValueValidator(0), MaxValueValidator(5)
        ]
    )
    message = models.TextField()
    approved = models.BooleanField(default=False)

    def __str__(self): return f"{self.name} - {self.rating}"