
from django.db import models
from django.contrib.auth.models import User
from cloudinary.models import CloudinaryField
from django.urls import reverse
from taggit.managers import TaggableManager
import uuid

class TimeStampedModel(models.Model):
    """Base model with created and updated timestamps"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class Team(TimeStampedModel):
    """Team member model"""
    POSITION_CHOICES = [
        ('president', 'President and Founder'),
        ('vice_president', 'Vice President and Co-Founder'), 
        ('treasurer', 'Treasurer'),
        ('board_member', 'Board Member'),
        ('advisor', 'Advisor'),
        ('volunteer', 'Volunteer'),
    ]

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]

    name = models.CharField(max_length=100)
    position = models.CharField(max_length=20, choices=POSITION_CHOICES)
    bio_short = models.CharField(max_length=100, help_text="Short bio (50 words max)")
    bio_long = models.TextField(help_text="Detailed bio")
    photo = CloudinaryField('team_photos', null=True, blank=True)
    email = models.EmailField(blank=True)
    linkedin = models.URLField(blank=True)
    twitter = models.URLField(blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
    order = models.PositiveIntegerField(default=0, help_text="Display order (lower numbers first)")

    class Meta:
        ordering = ['order', 'name']
        verbose_name = "Team Member"
        verbose_name_plural = "Team Members"

    def __str__(self):
        return f"{self.name} - {self.get_position_display()}"

class Department(TimeStampedModel):
    """Organizational departments"""
    name = models.CharField(max_length=100)
    description = models.TextField()
    head = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True, blank=True, 
                           related_name='led_departments')
    responsibilities = models.TextField(help_text="Department responsibilities")
    workflow_steps = models.JSONField(default=list, help_text="Workflow steps as JSON array")
    team_structure = models.TextField(blank=True, help_text="Organizational structure details")
    icon = models.CharField(max_length=50, default='business', 
                          help_text="Material Design icon name")
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return self.name

class FocusArea(TimeStampedModel):
    """Main focus areas of the organization"""
    CATEGORY_CHOICES = [
        ('urban', 'Urban Issues'),
        ('environmental', 'Environmental Issues'),
        ('digital', 'Digital Divide'),
        ('governance', 'Governance Issues'),
        ('social', 'Social Issues'),
    ]

    title = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    description = models.TextField()
    subtopics = models.JSONField(default=list, help_text="List of subtopics")
    statistics_india = models.JSONField(default=dict, help_text="India-specific statistics")
    statistics_world = models.JSONField(default=dict, help_text="World statistics")
    detailed_content = models.TextField(help_text="Detailed information for modal/overlay")
    icon = models.CharField(max_length=50, default='category')
    color = models.CharField(max_length=7, default='#007bff', help_text="Hex color code")
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order', 'title']
        verbose_name = "Focus Area"
        verbose_name_plural = "Focus Areas"

    def __str__(self):
        return f"{self.title} ({self.get_category_display()})"

class ImpactStory(TimeStampedModel):
    """Impact stories and case studies"""
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]

    title = models.CharField(max_length=200)
    summary = models.CharField(max_length=300, help_text="Brief summary for carousel")
    content = models.TextField(help_text="Full story content")
    image = CloudinaryField('impact_stories', null=True, blank=True)
    impact_metrics = models.JSONField(default=dict, help_text="Quantifiable impact metrics")
    timeline = models.JSONField(default=list, help_text="Project timeline")
    location = models.CharField(max_length=100, blank=True)
    project_duration = models.CharField(max_length=50, blank=True)
    budget = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    focus_areas = models.ManyToManyField(FocusArea, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    featured = models.BooleanField(default=False, help_text="Show on homepage")
    tags = TaggableManager(blank=True)

    class Meta:
        ordering = ['-featured', '-created_at']
        verbose_name = "Impact Story"
        verbose_name_plural = "Impact Stories"

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('impact-story-detail', kwargs={'pk': self.pk})

class SocialMediaLink(TimeStampedModel):
    """Social media links for the organization"""
    PLATFORM_CHOICES = [
        ('twitter', 'Twitter/X'),
        ('linkedin', 'LinkedIn'),
        ('facebook', 'Facebook'),
        ('instagram', 'Instagram'),
        ('youtube', 'YouTube'),
        ('github', 'GitHub'),
    ]

    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES, unique=True)
    url = models.URLField()
    username = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'platform']
        verbose_name = "Social Media Link"
        verbose_name_plural = "Social Media Links"

    def __str__(self):
        return f"{self.get_platform_display()}: {self.username or self.url}"

class Contact(TimeStampedModel):
    """Contact form submissions"""
    SUBJECT_CHOICES = [
        ('general', 'General Inquiry'),
        ('collaboration', 'Collaboration'),
        ('media', 'Media Inquiry'),
        ('support', 'Technical Support'),
        ('other', 'Other'),
    ]

    STATUS_CHOICES = [
        ('new', 'New'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]

    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=20, choices=SUBJECT_CHOICES)
    message = models.TextField()
    status = models.CharField(max_length=12, choices=STATUS_CHOICES, default='new')
    response = models.TextField(blank=True, help_text="Admin response")
    responded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    responded_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Contact Message"
        verbose_name_plural = "Contact Messages"

    def __str__(self):
        return f"{self.name} - {self.get_subject_display()}"

class SiteStats(TimeStampedModel):
    """Site statistics for the homepage counter"""
    active_projects = models.PositiveIntegerField(default=0)
    total_members = models.PositiveIntegerField(default=0) 
    research_papers_published = models.PositiveIntegerField(default=0)
    cities_impacted = models.PositiveIntegerField(default=1)

    class Meta:
        verbose_name = "Site Statistics"
        verbose_name_plural = "Site Statistics"

    def __str__(self):
        return f"Stats updated on {self.updated_at.strftime('%Y-%m-%d')}"

    def save(self, *args, **kwargs):
        # Ensure only one instance exists
        if not self.pk and SiteStats.objects.exists():
            raise ValueError("Only one SiteStats instance is allowed")
        super().save(*args, **kwargs)

class Headquarters(TimeStampedModel):
    """Organization headquarters information"""
    name = models.CharField(max_length=100, default="ShodhSrija Foundation")
    address_line1 = models.CharField(max_length=200)
    address_line2 = models.CharField(max_length=200, blank=True)
    city = models.CharField(max_length=50, default="New Delhi")
    state = models.CharField(max_length=50, default="Delhi")
    postal_code = models.CharField(max_length=10, blank=True)
    country = models.CharField(max_length=50, default="India")
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    email_general = models.EmailField(default="info@shodhsrija.org")
    email_grievance = models.EmailField(default="grievance@shodhsrija.org") 
    email_volunteers = models.EmailField(default="volunteers@shodhsrija.org")

    class Meta:
        verbose_name = "Headquarters Information"
        verbose_name_plural = "Headquarters Information"

    def __str__(self):
        return f"{self.name} - {self.city}"

    @property
    def full_address(self):
        address_parts = [self.address_line1]
        if self.address_line2:
            address_parts.append(self.address_line2)
        address_parts.extend([self.city, self.state, self.country])
        if self.postal_code:
            address_parts.insert(-1, self.postal_code)
        return ", ".join(address_parts)

    def save(self, *args, **kwargs):
        # Ensure only one instance exists  
        if not self.pk and Headquarters.objects.exists():
            raise ValueError("Only one Headquarters instance is allowed")
        super().save(*args, **kwargs)
