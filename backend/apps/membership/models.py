# apps/membership/models.py

from django.db import models
from django.contrib.auth.models import User
from cloudinary.models import CloudinaryField
from apps.core.models import TimeStampedModel
import uuid

class Team(TimeStampedModel):
    """Team members for the organization"""
    name = models.CharField(max_length=200)
    position = models.CharField(max_length=100)
    status = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    bio_short = models.TextField(blank=True)
    bio_long = models.TextField(blank=True)
    photo = CloudinaryField('team_photos', blank=True, null=True)
    email = models.EmailField(blank=True)
    linkedin = models.URLField(blank=True)
    twitter = models.URLField(blank=True)

    class Meta:
        ordering = ['order', 'name']
        verbose_name = "Team Member"
        verbose_name_plural = "Team Members"

    def __str__(self):
        return self.name

class MembershipTier(TimeStampedModel):
    """Membership tier definitions"""
    TIER_TYPES = [
        ('student', 'Student'),
        ('volunteer', 'Volunteer'),
        ('researcher', 'Researcher'),
        ('institutional', 'Institutional'),
    ]

    name = models.CharField(max_length=50, choices=TIER_TYPES, unique=True)
    display_name = models.CharField(max_length=100)
    description = models.TextField()
    price_2_months = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    price_4_months = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    benefits = models.JSONField(default=list, help_text="List of benefits")
    features = models.JSONField(default=dict, help_text="Feature flags and limits")
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    color = models.CharField(max_length=7, default='#007bff', help_text="Hex color code")

    class Meta:
        ordering = ['order', 'name']
        verbose_name = "Membership Tier"
        verbose_name_plural = "Membership Tiers"

    def __str__(self):
        return self.display_name

    @property
    def is_free(self):
        return self.price_2_months == 0 and self.price_4_months == 0

class MembershipApplication(TimeStampedModel):
    """Membership applications"""
    STATUS_CHOICES = [
        ('pending', 'Pending Verification'),
        ('approved', 'Approved - Payment Pending'),
        ('payment_completed', 'Payment Completed'),
        ('active', 'Active Membership'),
        ('rejected', 'Rejected'),
        ('expired', 'Expired'),
        ('suspended', 'Suspended'),
    ]

    DURATION_CHOICES = [
        ('2', '2 Months'),
        ('4', '4 Months'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='membership_applications')
    membership_tier = models.ForeignKey(MembershipTier, on_delete=models.CASCADE)
    duration_months = models.CharField(max_length=2, choices=DURATION_CHOICES, default='2')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    full_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    date_of_birth = models.DateField(null=True, blank=True)
    address = models.TextField()
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    postal_code = models.CharField(max_length=10)

    id_proof_type = models.CharField(max_length=50, choices=[
        ('aadhar', 'Aadhar Card'),
        ('passport', 'Passport'),
        ('driving_license', 'Driving License'),
        ('voter_id', 'Voter ID'),
        ('student_id', 'Student ID'),
    ])
    id_proof_number = models.CharField(max_length=50)
    id_proof_document = CloudinaryField('id_proofs')

    skills = models.JSONField(default=list, help_text="Selected skills from predefined list")
    custom_skills = models.CharField(max_length=500, blank=True, help_text="Additional skills")
    interests = models.JSONField(default=list, help_text="Areas of interest")
    experience = models.TextField(blank=True, help_text="Relevant experience")
    motivation = models.TextField(help_text="Why do you want to join?")

    institution = models.CharField(max_length=200, blank=True)
    degree = models.CharField(max_length=100, blank=True)
    field_of_study = models.CharField(max_length=100, blank=True)
    graduation_year = models.IntegerField(null=True, blank=True)

    current_occupation = models.CharField(max_length=100, blank=True)
    organization = models.CharField(max_length=200, blank=True)

    reviewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviewed_applications')
    reviewed_at = models.DateTimeField(null=True, blank=True)
    admin_notes = models.TextField(blank=True, help_text="Internal admin notes")
    rejection_reason = models.TextField(blank=True)

    approved_at = models.DateTimeField(null=True, blank=True)
    membership_start_date = models.DateTimeField(null=True, blank=True)
    membership_end_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Membership Application"
        verbose_name_plural = "Membership Applications"

    def __str__(self):
        return f"{self.full_name} - {self.membership_tier.display_name} ({self.get_status_display()})"

    @property
    def total_amount(self):
        if self.duration_months == '2':
            return self.membership_tier.price_2_months
        return self.membership_tier.price_4_months

    @property
    def is_active_membership(self):
        from django.utils import timezone
        return (
            self.status == 'active' and
            self.membership_start_date and
            self.membership_end_date and
            self.membership_start_date <= timezone.now() <= self.membership_end_date
        )

class Payment(TimeStampedModel):
    """Payment records for memberships and donations"""
    PAYMENT_TYPE_CHOICES = [
        ('membership', 'Membership Payment'),
        ('donation', 'Donation'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]

    payment_id = models.CharField(max_length=100, unique=True)
    razorpay_order_id = models.CharField(max_length=100, blank=True)
    razorpay_payment_id = models.CharField(max_length=100, blank=True)
    razorpay_signature = models.CharField(max_length=200, blank=True)

    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='INR')

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments')
    payment_type = models.CharField(max_length=15, choices=PAYMENT_TYPE_CHOICES)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')

    membership_application = models.ForeignKey(
        MembershipApplication, on_delete=models.CASCADE,
        null=True, blank=True, related_name='payments'
    )

    payment_method = models.CharField(max_length=50, blank=True)
    gateway_response = models.JSONField(default=dict, help_text="Raw gateway response")

    initiated_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-initiated_at']
        verbose_name = "Payment"
        verbose_name_plural = "Payments"

    def __str__(self):
        return f"Payment {self.payment_id} - {self.user.username} - ₹{self.amount}"

    def save(self, *args, **kwargs):
        if not self.payment_id:
            self.payment_id = f"PAY_{uuid.uuid4().hex[:12].upper()}"
        super().save(*args, **kwargs)
