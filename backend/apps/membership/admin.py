# apps/membership/admin.py

from django.contrib import admin
from django.utils.html import format_html
from unfold.admin import ModelAdmin
from import_export.admin import ImportExportModelAdmin
from .models import Team, MembershipTier, MembershipApplication, Payment

# Unregister existing admin registrations to avoid AlreadyRegistered errors
for model in (MembershipTier, MembershipApplication, Payment):
    try:
        admin.site.unregister(model)
    except admin.sites.NotRegistered:
        pass

@admin.register(MembershipTier)
class MembershipTierAdmin(ModelAdmin, ImportExportModelAdmin):
    list_display = ['display_name', 'name', 'price_2_months', 'price_4_months', 'is_active', 'order']
    list_filter = ['name', 'is_active']
    list_editable = ['is_active', 'order']
    ordering = ['order']

@admin.register(MembershipApplication)
class MembershipApplicationAdmin(ModelAdmin):
    list_display = ['full_name', 'membership_tier', 'status', 'total_amount', 'created_at', 'user_link']
    list_filter = ['status', 'membership_tier', 'created_at']
    search_fields = ['full_name', 'user__username', 'user__email']
    list_editable = ['status']
    readonly_fields = ['created_at', 'total_amount', 'user_link']
    ordering = ['-created_at']

    fieldsets = (
        ('Application Info', {
            'fields': ('user_link', 'membership_tier', 'duration_months', 'status', 'created_at')
        }),
        ('Personal Information', {
            'fields': (
                'full_name', 'phone', 'date_of_birth',
                'address', 'city', 'state', 'postal_code'
            )
        }),
        ('ID Verification', {
            'fields': ('id_proof_type', 'id_proof_number', 'id_proof_document')
        }),
        ('Skills & Interests', {
            'fields': ('skills', 'custom_skills', 'interests', 'experience', 'motivation')
        }),
        ('Education & Work', {
            'fields': (
                'institution', 'degree', 'field_of_study',
                'graduation_year', 'current_occupation', 'organization'
            )
        }),
        ('Admin Section', {
            'fields': ('reviewed_by', 'reviewed_at', 'admin_notes', 'rejection_reason')
        }),
        ('Membership Dates', {
            'fields': ('approved_at', 'membership_start_date', 'membership_end_date')
        }),
    )

    def user_link(self, obj):
        if obj.user:
            url = admin.reverse('auth_user_change', args=[obj.user.id])
            return format_html('<a href="{}">{}</a>', url, obj.user.username)
        return "No user"
    user_link.short_description = "User"

@admin.register(Team)
class TeamAdmin(ModelAdmin, ImportExportModelAdmin):
    list_display = ['name', 'position', 'status', 'order', 'photo_preview']
    list_filter = ['position', 'status']
    search_fields = ['name', 'bio_short']
    list_editable = ['order', 'status']
    ordering = ['order', 'name']

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'position', 'status', 'order')
        }),
        ('Biography', {
            'fields': ('bio_short', 'bio_long')
        }),
        ('Media', {
            'fields': ('photo',)
        }),
        ('Contact & Social', {
            'fields': ('email', 'linkedin', 'twitter')
        }),
    )

    def photo_preview(self, obj):
        if obj.photo:
            return format_html(
                '<img src="{}" width="50" height="50" style="border-radius: 25px;" />',
                obj.photo.url
            )
        return "No photo"
    photo_preview.short_description = "Photo"

@admin.register(Payment)
class PaymentAdmin(ModelAdmin, ImportExportModelAdmin):
    list_display = ['payment_id', 'user', 'payment_type', 'amount', 'status', 'initiated_at']
    list_filter = ['payment_type', 'status', 'initiated_at']
    readonly_fields = [
        'payment_id', 'initiated_at', 'completed_at',
        'razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature'
    ]
    ordering = ['-initiated_at']

    fieldsets = (
        ('Payment Information', {
            'fields': ('payment_id', 'user', 'payment_type', 'amount', 'status')
        }),
        ('Razorpay Details', {
            'fields': ('razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature')
        }),
        ('Timestamps', {
            'fields': ('initiated_at', 'completed_at')
        }),
        ('Relations', {
            'fields': ('membership_application',)
        }),
    )
