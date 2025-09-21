
from django.db import models
from django.contrib.auth.models import User
from cloudinary.models import CloudinaryField
from apps.core.models import TimeStampedModel
from tinymce.models import HTMLField
from taggit.managers import TaggableManager

class SiteSettings(TimeStampedModel):
    """Global site settings that can be managed from admin"""
    # Site Identity
    site_title = models.CharField(max_length=200, default="ShodhSrija Foundation")
    site_tagline = models.CharField(max_length=300, 
                                  default="Youth Innovation for Societal Change")
    site_description = models.TextField(
        default="A youth-driven research and innovation NGO focused on addressing societal challenges.")

    # Contact Information
    primary_email = models.EmailField(default="info@shodhsrija.org")
    secondary_email = models.EmailField(blank=True)
    phone_primary = models.CharField(max_length=20, blank=True)
    phone_secondary = models.CharField(max_length=20, blank=True)

    # Address
    address_line1 = models.CharField(max_length=200, blank=True)
    address_line2 = models.CharField(max_length=200, blank=True) 
    city = models.CharField(max_length=100, default="New Delhi")
    state = models.CharField(max_length=100, default="Delhi")
    country = models.CharField(max_length=100, default="India")
    postal_code = models.CharField(max_length=10, blank=True)

    # Legal Information
    registration_number = models.CharField(max_length=100, blank=True)
    pan_number = models.CharField(max_length=10, blank=True)
    tax_exemption_80g = models.CharField(max_length=100, blank=True)
    tax_exemption_12a = models.CharField(max_length=100, blank=True)
    darpan_id = models.CharField(max_length=100, blank=True)

    # SEO
    meta_keywords = models.CharField(max_length=500, blank=True)
    meta_description = models.CharField(max_length=160, blank=True)

    # Analytics
    google_analytics_id = models.CharField(max_length=50, blank=True)
    facebook_pixel_id = models.CharField(max_length=50, blank=True)

    # Features
    maintenance_mode = models.BooleanField(default=False)
    allow_registrations = models.BooleanField(default=True)
    allow_anonymous_donations = models.BooleanField(default=True)
    allow_anonymous_issue_reports = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Site Settings"
        verbose_name_plural = "Site Settings"

    def __str__(self):
        return "Site Settings"

    def save(self, *args, **kwargs):
        # Ensure only one instance exists
        if not self.pk and SiteSettings.objects.exists():
            raise ValueError("Only one SiteSettings instance is allowed")
        super().save(*args, **kwargs)

class Page(TimeStampedModel):
    """Dynamic pages that can be managed from admin"""
    PAGE_TYPES = [
        ('static', 'Static Page'),
        ('landing', 'Landing Page'),
        ('blog_post', 'Blog Post'),
        ('news', 'News Article'),
    ]

    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]

    # Basic Info
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    page_type = models.CharField(max_length=15, choices=PAGE_TYPES, default='static')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='draft')

    # Content
    excerpt = models.CharField(max_length=300, blank=True, 
                             help_text="Short description for listings")
    content = HTMLField()  # Rich text editor

    # Media
    featured_image = CloudinaryField('pages', null=True, blank=True)
    gallery_images = models.JSONField(default=list, help_text="List of image URLs")

    # SEO
    meta_title = models.CharField(max_length=60, blank=True)
    meta_description = models.CharField(max_length=160, blank=True)
    meta_keywords = models.CharField(max_length=300, blank=True)

    # Publishing
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    published_at = models.DateTimeField(null=True, blank=True)

    # Display Settings
    show_in_menu = models.BooleanField(default=False, help_text="Show in navigation menu")
    menu_order = models.PositiveIntegerField(default=0)
    featured = models.BooleanField(default=False)

    # Access Control
    is_members_only = models.BooleanField(default=False)
    allowed_membership_tiers = models.JSONField(default=list, blank=True)

    # Tags and Categories
    tags = TaggableManager(blank=True)

    # View tracking
    view_count = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['-published_at', '-created_at']
        verbose_name = "Page"
        verbose_name_plural = "Pages"

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        from django.urls import reverse
        return reverse('page-detail', kwargs={'slug': self.slug})

    @property
    def is_published(self):
        from django.utils import timezone
        return (self.status == 'published' and 
                self.published_at and 
                self.published_at <= timezone.now())

class MediaAsset(TimeStampedModel):
    """Media assets that can be reused across the site"""
    ASSET_TYPES = [
        ('image', 'Image'),
        ('video', 'Video'),
        ('document', 'Document'),
        ('audio', 'Audio'),
        ('other', 'Other'),
    ]

    # Basic Info
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    asset_type = models.CharField(max_length=10, choices=ASSET_TYPES)

    # File
    file = CloudinaryField('assets')
    original_filename = models.CharField(max_length=200)
    file_size = models.PositiveIntegerField(help_text="Size in bytes")
    mime_type = models.CharField(max_length=100)

    # Metadata
    alt_text = models.CharField(max_length=200, blank=True, help_text="For images")
    caption = models.CharField(max_length=500, blank=True)

    # Organization
    folder = models.CharField(max_length=100, blank=True, help_text="Organizational folder")
    tags = TaggableManager(blank=True)

    # Usage tracking
    used_in_pages = models.ManyToManyField(Page, blank=True, related_name='media_assets')
    download_count = models.PositiveIntegerField(default=0)

    # Admin
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Media Asset"
        verbose_name_plural = "Media Assets"

    def __str__(self):
        return self.title

    @property
    def file_size_display(self):
        """Human readable file size"""
        size = self.file_size
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024.0:
                return f"{size:.1f} {unit}"
            size /= 1024.0
        return f"{size:.1f} TB"

class MenuItem(TimeStampedModel):
    """Navigation menu items"""
    LINK_TYPES = [
        ('internal', 'Internal Page'),
        ('external', 'External URL'),
        ('category', 'Category/Section'),
    ]

    title = models.CharField(max_length=100)
    link_type = models.CharField(max_length=10, choices=LINK_TYPES, default='internal')

    # Link targets
    page = models.ForeignKey(Page, on_delete=models.CASCADE, null=True, blank=True)
    external_url = models.URLField(blank=True)

    # Hierarchy
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True,
                              related_name='children')
    order = models.PositiveIntegerField(default=0)

    # Display
    icon = models.CharField(max_length=50, blank=True, help_text="Material Design icon")
    is_active = models.BooleanField(default=True)
    open_in_new_tab = models.BooleanField(default=False)

    # Access Control
    is_members_only = models.BooleanField(default=False)
    required_permissions = models.JSONField(default=list, blank=True)

    class Meta:
        ordering = ['order', 'title']
        verbose_name = "Menu Item"
        verbose_name_plural = "Menu Items"

    def __str__(self):
        if self.parent:
            return f"{self.parent.title} > {self.title}"
        return self.title

    @property
    def url(self):
        if self.link_type == 'internal' and self.page:
            return self.page.get_absolute_url()
        elif self.link_type == 'external':
            return self.external_url
        return '#'

class Slider(TimeStampedModel):
    """Homepage slider/carousel"""
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=300, blank=True)
    description = models.TextField(blank=True)

    # Media
    image = CloudinaryField('slider')
    video_url = models.URLField(blank=True, help_text="Background video URL")

    # Call-to-Action
    cta_text = models.CharField(max_length=50, blank=True, default="Learn More")
    cta_link = models.URLField(blank=True)
    cta_page = models.ForeignKey(Page, on_delete=models.SET_NULL, null=True, blank=True)

    # Display
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    # Animation
    animation_type = models.CharField(max_length=20, default='fade', choices=[
        ('fade', 'Fade'),
        ('slide_left', 'Slide Left'),
        ('slide_right', 'Slide Right'),
        ('slide_up', 'Slide Up'),
        ('zoom', 'Zoom'),
    ])

    class Meta:
        ordering = ['order']
        verbose_name = "Slider Item"
        verbose_name_plural = "Slider Items"

    def __str__(self):
        return self.title

    @property
    def cta_url(self):
        if self.cta_page:
            return self.cta_page.get_absolute_url()
        return self.cta_link or '#'

class Testimonial(TimeStampedModel):
    """User testimonials"""
    name = models.CharField(max_length=100)
    position = models.CharField(max_length=100, blank=True)
    organization = models.CharField(max_length=200, blank=True)
    content = models.TextField()

    # Media
    photo = CloudinaryField('testimonials', null=True, blank=True)

    # Display
    is_active = models.BooleanField(default=True)
    featured = models.BooleanField(default=False)
    rating = models.PositiveIntegerField(default=5, choices=[(i, i) for i in range(1, 6)])

    # Verification
    is_verified = models.BooleanField(default=False)
    verified_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        ordering = ['-featured', '-created_at']
        verbose_name = "Testimonial"
        verbose_name_plural = "Testimonials"

    def __str__(self):
        return f"{self.name} - {self.organization}"

class FAQ(TimeStampedModel):
    """Frequently Asked Questions"""
    question = models.CharField(max_length=300)
    answer = HTMLField()

    # Categorization
    category = models.CharField(max_length=100, default='General')

    # Display
    is_active = models.BooleanField(default=True)
    featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    # Usage tracking
    view_count = models.PositiveIntegerField(default=0)
    helpful_count = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['category', 'order', 'question']
        verbose_name = "FAQ"
        verbose_name_plural = "FAQs"

    def __str__(self):
        return self.question

class Newsletter(TimeStampedModel):
    """Newsletter subscriptions"""
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100, blank=True)

    # Preferences
    interests = models.JSONField(default=list, help_text="List of interest categories")
    frequency = models.CharField(max_length=20, default='monthly', choices=[
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly'),
    ])

    # Status
    is_active = models.BooleanField(default=True)
    verified = models.BooleanField(default=False)
    verification_token = models.CharField(max_length=100, blank=True)

    # Tracking
    last_sent = models.DateTimeField(null=True, blank=True)
    total_sent = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Newsletter Subscription"
        verbose_name_plural = "Newsletter Subscriptions"

    def __str__(self):
        return f"{self.name} <{self.email}>" if self.name else self.email
