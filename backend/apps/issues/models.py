
from django.db import models
from django.contrib.auth.models import User
from cloudinary.models import CloudinaryField
from apps.core.models import TimeStampedModel

class IssueCategory(TimeStampedModel):
    """Categories for reported issues"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, default='report_problem')
    color = models.CharField(max_length=7, default='#dc3545')
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']
        verbose_name = "Issue Category"
        verbose_name_plural = "Issue Categories"

    def __str__(self):
        return self.name

class ReportedIssue(TimeStampedModel):
    """Issues reported by the public"""
    STATUS_CHOICES = [
        ('new', 'New'),
        ('under_review', 'Under Review'),
        ('investigating', 'Investigating'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
        ('duplicate', 'Duplicate'),
        ('invalid', 'Invalid'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]

    SEVERITY_CHOICES = [
        ('minor', 'Minor'),
        ('moderate', 'Moderate'),
        ('major', 'Major'),
        ('severe', 'Severe'),
    ]

    # Basic Information
    title = models.CharField(max_length=200, help_text="Brief title of the issue")
    description = models.TextField(help_text="Detailed description of the issue")
    category = models.ForeignKey(IssueCategory, on_delete=models.SET_NULL, null=True)

    # Location Information
    location_description = models.CharField(max_length=300, help_text="Description of location")
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=10, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    # Media
    images = models.JSONField(default=list, help_text="List of image URLs from Cloudinary")
    videos = models.JSONField(default=list, help_text="List of video URLs from Cloudinary")

    # Reporter Information (Optional)
    reporter_name = models.CharField(max_length=100, blank=True)
    reporter_email = models.EmailField(blank=True)
    reporter_phone = models.CharField(max_length=15, blank=True)
    is_anonymous = models.BooleanField(default=False)

    # If user is logged in
    reported_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True,
                                  related_name='reported_issues')

    # Admin Management
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='new')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    severity = models.CharField(max_length=10, choices=SEVERITY_CHOICES, default='moderate')

    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True,
                                  related_name='assigned_issues')
    admin_notes = models.TextField(blank=True, help_text="Internal notes for admin")

    # Resolution
    resolution_notes = models.TextField(blank=True)
    resolved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True,
                                  related_name='resolved_issues')
    resolved_at = models.DateTimeField(null=True, blank=True)

    # Follow-up
    follow_up_required = models.BooleanField(default=False)
    follow_up_date = models.DateTimeField(null=True, blank=True)

    # Public visibility
    is_public = models.BooleanField(default=True, help_text="Show on public issue tracker")
    allow_comments = models.BooleanField(default=True)

    # Auto-generated
    issue_number = models.CharField(max_length=20, unique=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Reported Issue"
        verbose_name_plural = "Reported Issues"

    def __str__(self):
        return f"#{self.issue_number}: {self.title}"

    def save(self, *args, **kwargs):
        if not self.issue_number:
            from django.utils import timezone
            year = timezone.now().year
            count = ReportedIssue.objects.filter(created_at__year=year).count() + 1
            self.issue_number = f"ISS-{year}-{count:04d}"
        super().save(*args, **kwargs)

    @property
    def reporter_display_name(self):
        if self.is_anonymous:
            return "Anonymous"
        if self.reported_by:
            return self.reported_by.get_full_name() or self.reported_by.username
        return self.reporter_name or "Unknown"

    @property
    def location_display(self):
        location_parts = []
        if self.location_description:
            location_parts.append(self.location_description)
        if self.city:
            location_parts.append(self.city)
        if self.state:
            location_parts.append(self.state)
        return ", ".join(location_parts) if location_parts else "Location not specified"

class IssueComment(TimeStampedModel):
    """Comments on reported issues"""
    COMMENT_TYPES = [
        ('public', 'Public Comment'),
        ('internal', 'Internal Note'),
        ('status_update', 'Status Update'),
    ]

    issue = models.ForeignKey(ReportedIssue, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    comment_type = models.CharField(max_length=15, choices=COMMENT_TYPES, default='public')
    content = models.TextField()

    # Attachments
    attachments = models.JSONField(default=list, help_text="List of attachment URLs")

    # Status change (if applicable)
    old_status = models.CharField(max_length=15, blank=True)
    new_status = models.CharField(max_length=15, blank=True)

    class Meta:
        ordering = ['created_at']
        verbose_name = "Issue Comment"
        verbose_name_plural = "Issue Comments"

    def __str__(self):
        return f"Comment on {self.issue.issue_number} by {self.author.username}"

class IssueTag(TimeStampedModel):
    """Tags for categorizing issues"""
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=7, default='#6c757d')
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['name']
        verbose_name = "Issue Tag"
        verbose_name_plural = "Issue Tags"

    def __str__(self):
        return self.name

# Add tags to ReportedIssue (many-to-many)
ReportedIssue.add_to_class('tags', models.ManyToManyField(IssueTag, blank=True, related_name='issues'))

class IssueTemplate(TimeStampedModel):
    """Templates for common issue types"""
    name = models.CharField(max_length=100)
    description = models.TextField()
    category = models.ForeignKey(IssueCategory, on_delete=models.CASCADE)

    # Template fields
    title_template = models.CharField(max_length=200)
    description_template = models.TextField()
    required_fields = models.JSONField(default=list, help_text="List of required field names")
    suggested_tags = models.ManyToManyField(IssueTag, blank=True)

    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']
        verbose_name = "Issue Template"
        verbose_name_plural = "Issue Templates"

    def __str__(self):
        return f"{self.name} ({self.category.name})"

class IssueAttachment(TimeStampedModel):
    """File attachments for issues"""
    issue = models.ForeignKey(ReportedIssue, on_delete=models.CASCADE, related_name='attachments')
    file = CloudinaryField('issue_attachments')
    original_filename = models.CharField(max_length=200)
    file_size = models.PositiveIntegerField(help_text="File size in bytes")
    file_type = models.CharField(max_length=50)
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        ordering = ['created_at']
        verbose_name = "Issue Attachment"
        verbose_name_plural = "Issue Attachments"

    def __str__(self):
        return f"{self.original_filename} ({self.issue.issue_number})"

    @property
    def file_size_display(self):
        """Human readable file size"""
        size = self.file_size
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024.0:
                return f"{size:.1f} {unit}"
            size /= 1024.0
        return f"{size:.1f} TB"

class IssueSubscription(TimeStampedModel):
    """User subscriptions to issue updates"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    issue = models.ForeignKey(ReportedIssue, on_delete=models.CASCADE)
    notify_comments = models.BooleanField(default=True)
    notify_status_changes = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ['user', 'issue']
        verbose_name = "Issue Subscription"
        verbose_name_plural = "Issue Subscriptions"

    def __str__(self):
        return f"{self.user.username} subscribed to {self.issue.issue_number}"

