
from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from unfold.admin import ModelAdmin
from import_export.admin import ImportExportModelAdmin
from .models import *

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

@admin.register(Department)
class DepartmentAdmin(ModelAdmin, ImportExportModelAdmin):
    list_display = ['name', 'head', 'is_active', 'order']
    list_filter = ['is_active']
    search_fields = ['name', 'description']
    list_editable = ['order', 'is_active']
    ordering = ['order', 'name']

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'head', 'is_active', 'order')
        }),
        ('Details', {
            'fields': ('responsibilities', 'workflow_steps', 'team_structure')
        }),
        ('Display', {
            'fields': ('icon',)
        }),
    )

@admin.register(FocusArea)
class FocusAreaAdmin(ModelAdmin, ImportExportModelAdmin):
    list_display = ['title', 'category', 'is_active', 'order', 'color_preview']
    list_filter = ['category', 'is_active']
    search_fields = ['title', 'description']
    list_editable = ['order', 'is_active']
    ordering = ['order', 'title']

    def color_preview(self, obj):
        return format_html(
            '<div style="width: 20px; height: 20px; background-color: {}; border-radius: 3px; display: inline-block;"></div>',
            obj.color
        )
    color_preview.short_description = "Color"

@admin.register(ImpactStory)
class ImpactStoryAdmin(ModelAdmin, ImportExportModelAdmin):
    list_display = ['title', 'status', 'featured', 'location', 'created_at', 'image_preview']
    list_filter = ['status', 'featured', 'focus_areas']
    search_fields = ['title', 'summary', 'content']
    list_editable = ['status', 'featured']
    ordering = ['-featured', '-created_at']
    filter_horizontal = ['focus_areas']

    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'summary', 'content', 'status', 'featured')
        }),
        ('Media', {
            'fields': ('image',)
        }),
        ('Project Details', {
            'fields': ('location', 'project_duration', 'budget', 'impact_metrics', 'timeline')
        }),
        ('Categorization', {
            'fields': ('focus_areas', 'tags')
        }),
    )

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="50" height="50" />', obj.image.url)
        return "No image"
    image_preview.short_description = "Image"

@admin.register(Contact)
class ContactAdmin(ModelAdmin):
    list_display = ['name', 'email', 'subject', 'status', 'created_at']
    list_filter = ['subject', 'status', 'created_at']
    search_fields = ['name', 'email', 'message']
    list_editable = ['status']
    readonly_fields = ['created_at']
    ordering = ['-created_at']

    fieldsets = (
        ('Contact Information', {
            'fields': ('name', 'email', 'subject', 'message', 'created_at')
        }),
        ('Response', {
            'fields': ('status', 'response', 'responded_by', 'responded_at')
        }),
    )

@admin.register(SiteStats)
class SiteStatsAdmin(ModelAdmin):
    list_display = ['updated_at', 'active_projects', 'total_members', 'research_papers_published', 'cities_impacted']

    def has_add_permission(self, request):
        # Only allow one instance
        return not SiteStats.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False

# Membership Admin
from apps.membership.models import MembershipTier, MembershipApplication, Payment

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
            'fields': ('full_name', 'phone', 'date_of_birth', 'address', 'city', 'state', 'postal_code')
        }),
        ('ID Verification', {
            'fields': ('id_proof_type', 'id_proof_number', 'id_proof_document')
        }),
        ('Skills & Interests', {
            'fields': ('skills', 'custom_skills', 'interests', 'experience', 'motivation')
        }),
        ('Education & Work', {
            'fields': ('institution', 'degree', 'field_of_study', 'graduation_year', 'current_occupation', 'organization')
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
            url = reverse('admin:auth_user_change', args=[obj.user.id])
            return format_html('<a href="{}">{}</a>', url, obj.user.username)
        return "No user"
    user_link.short_description = "User"

@admin.register(Payment)
class PaymentAdmin(ModelAdmin):
    list_display = ['payment_id', 'user', 'payment_type', 'amount', 'status', 'initiated_at']
    list_filter = ['payment_type', 'status', 'initiated_at']
    search_fields = ['payment_id', 'user__username', 'razorpay_payment_id']
    readonly_fields = ['payment_id', 'initiated_at', 'completed_at', 'razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature']
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

# Research Admin
from apps.research.models import Publication, ResearchProject, ResearchCategory

@admin.register(ResearchCategory)
class ResearchCategoryAdmin(ModelAdmin):
    list_display = ['name', 'is_active', 'order', 'color_preview']
    list_editable = ['is_active', 'order']

    def color_preview(self, obj):
        return format_html(
            '<div style="width: 20px; height: 20px; background-color: {}; border-radius: 3px;"></div>',
            obj.color
        )
    color_preview.short_description = "Color"

@admin.register(Publication)
class PublicationAdmin(ModelAdmin, ImportExportModelAdmin):
    list_display = ['title', 'publication_type', 'status', 'publication_date', 'download_count']
    list_filter = ['publication_type', 'status', 'category', 'publication_date']
    search_fields = ['title', 'abstract', 'keywords']
    list_editable = ['status']
    ordering = ['-publication_date', '-created_at']
    filter_horizontal = ['authors']

    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'abstract', 'publication_type', 'status', 'featured')
        }),
        ('Publication Details', {
            'fields': ('journal_name', 'publisher', 'publication_date', 'volume', 'issue', 'pages')
        }),
        ('Identifiers', {
            'fields': ('doi', 'isbn', 'issn', 'arxiv_id')
        }),
        ('Files and Links', {
            'fields': ('pdf_file', 'external_url', 'cover_image')
        }),
        ('Categorization', {
            'fields': ('category', 'keywords', 'tags')
        }),
        ('Metrics', {
            'fields': ('download_count', 'view_count', 'citation_count')
        }),
    )

# Donations Admin
from apps.donations.models import Donation, DonationCertificate

@admin.register(Donation)
class DonationAdmin(ModelAdmin, ImportExportModelAdmin):
    list_display = ['donation_id', 'donor_display_name', 'amount', 'status', 'wants_80g_certificate', 'created_at']
    list_filter = ['status', 'donation_type', 'wants_80g_certificate', 'created_at']
    search_fields = ['donation_id', 'donor_name', 'donor_email', 'donor__username']
    list_editable = ['status']
    readonly_fields = ['donation_id', 'created_at', 'completed_at']
    ordering = ['-created_at']

@admin.register(DonationCertificate)
class DonationCertificateAdmin(ModelAdmin):
    list_display = ['certificate_number', 'donation', 'financial_year', 'status', 'issued_date']
    list_filter = ['status', 'financial_year', 'issued_date']
    search_fields = ['certificate_number', 'donation__donor_name']
    readonly_fields = ['certificate_number', 'issued_date']

# Issues Admin
from apps.issues.models import ReportedIssue, IssueCategory

@admin.register(IssueCategory)
class IssueCategoryAdmin(ModelAdmin):
    list_display = ['name', 'is_active', 'order', 'color_preview']
    list_editable = ['is_active', 'order']

    def color_preview(self, obj):
        return format_html(
            '<div style="width: 20px; height: 20px; background-color: {}; border-radius: 3px;"></div>',
            obj.color
        )
    color_preview.short_description = "Color"

@admin.register(ReportedIssue)
class ReportedIssueAdmin(ModelAdmin):
    list_display = ['issue_number', 'title', 'category', 'status', 'priority', 'location_display', 'created_at']
    list_filter = ['status', 'priority', 'category', 'created_at']
    search_fields = ['issue_number', 'title', 'description', 'reporter_name']
    list_editable = ['status', 'priority']
    readonly_fields = ['issue_number', 'created_at']
    ordering = ['-created_at']

    fieldsets = (
        ('Issue Information', {
            'fields': ('issue_number', 'title', 'description', 'category', 'created_at')
        }),
        ('Location', {
            'fields': ('location_description', 'address', 'city', 'state', 'postal_code', 'latitude', 'longitude')
        }),
        ('Media', {
            'fields': ('images', 'videos')
        }),
        ('Reporter Information', {
            'fields': ('reported_by', 'reporter_name', 'reporter_email', 'reporter_phone', 'is_anonymous')
        }),
        ('Management', {
            'fields': ('status', 'priority', 'severity', 'assigned_to', 'admin_notes')
        }),
        ('Resolution', {
            'fields': ('resolution_notes', 'resolved_by', 'resolved_at')
        }),
    )

# CMS Admin
from apps.cms.models import SiteSettings, Page, MediaAsset

@admin.register(SiteSettings)
class SiteSettingsAdmin(ModelAdmin):
    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False

    fieldsets = (
        ('Site Identity', {
            'fields': ('site_title', 'site_tagline', 'site_description')
        }),
        ('Contact Information', {
            'fields': ('primary_email', 'secondary_email', 'phone_primary', 'phone_secondary')
        }),
        ('Address', {
            'fields': ('address_line1', 'address_line2', 'city', 'state', 'country', 'postal_code')
        }),
        ('Legal Information', {
            'fields': ('registration_number', 'pan_number', 'tax_exemption_80g', 'tax_exemption_12a', 'darpan_id')
        }),
        ('SEO & Analytics', {
            'fields': ('meta_keywords', 'meta_description', 'google_analytics_id', 'facebook_pixel_id')
        }),
        ('Features', {
            'fields': ('maintenance_mode', 'allow_registrations', 'allow_anonymous_donations', 'allow_anonymous_issue_reports')
        }),
    )

@admin.register(Page)
class PageAdmin(ModelAdmin, ImportExportModelAdmin):
    list_display = ['title', 'page_type', 'status', 'show_in_menu', 'published_at', 'view_count']
    list_filter = ['page_type', 'status', 'show_in_menu', 'published_at']
    search_fields = ['title', 'content', 'meta_title']
    list_editable = ['status', 'show_in_menu']
    ordering = ['-published_at', '-created_at']
    prepopulated_fields = {'slug': ('title',)}

    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'page_type', 'status', 'author')
        }),
        ('Content', {
            'fields': ('excerpt', 'content')
        }),
        ('Media', {
            'fields': ('featured_image', 'gallery_images')
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description', 'meta_keywords')
        }),
        ('Display Settings', {
            'fields': ('show_in_menu', 'menu_order', 'featured')
        }),
        ('Access Control', {
            'fields': ('is_members_only', 'allowed_membership_tiers')
        }),
        ('Publishing', {
            'fields': ('published_at',)
        }),
    )

@admin.register(MediaAsset)
class MediaAssetAdmin(ModelAdmin):
    list_display = ['title', 'asset_type', 'file_size_display', 'uploaded_by', 'created_at']
    list_filter = ['asset_type', 'folder', 'created_at']
    search_fields = ['title', 'description', 'original_filename']
    readonly_fields = ['file_size', 'mime_type', 'created_at']

from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from unfold.admin import ModelAdmin
from import_export.admin import ImportExportModelAdmin
from .models import *

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

@admin.register(Department)
class DepartmentAdmin(ModelAdmin, ImportExportModelAdmin):
    list_display = ['name', 'head', 'is_active', 'order']
    list_filter = ['is_active']
    search_fields = ['name', 'description']
    list_editable = ['order', 'is_active']
    ordering = ['order', 'name']

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'head', 'is_active', 'order')
        }),
        ('Details', {
            'fields': ('responsibilities', 'workflow_steps', 'team_structure')
        }),
        ('Display', {
            'fields': ('icon',)
        }),
    )

@admin.register(FocusArea)
class FocusAreaAdmin(ModelAdmin, ImportExportModelAdmin):
    list_display = ['title', 'category', 'is_active', 'order', 'color_preview']
    list_filter = ['category', 'is_active']
    search_fields = ['title', 'description']
    list_editable = ['order', 'is_active']
    ordering = ['order', 'title']

    def color_preview(self, obj):
        return format_html(
            '<div style="width: 20px; height: 20px; background-color: {}; border-radius: 3px; display: inline-block;"></div>',
            obj.color
        )
    color_preview.short_description = "Color"

@admin.register(ImpactStory)
class ImpactStoryAdmin(ModelAdmin, ImportExportModelAdmin):
    list_display = ['title', 'status', 'featured', 'location', 'created_at', 'image_preview']
    list_filter = ['status', 'featured', 'focus_areas']
    search_fields = ['title', 'summary', 'content']
    list_editable = ['status', 'featured']
    ordering = ['-featured', '-created_at']
    filter_horizontal = ['focus_areas']

    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'summary', 'content', 'status', 'featured')
        }),
        ('Media', {
            'fields': ('image',)
        }),
        ('Project Details', {
            'fields': ('location', 'project_duration', 'budget', 'impact_metrics', 'timeline')
        }),
        ('Categorization', {
            'fields': ('focus_areas', 'tags')
        }),
    )

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="50" height="50" />', obj.image.url)
        return "No image"
    image_preview.short_description = "Image"

@admin.register(Contact)
class ContactAdmin(ModelAdmin):
    list_display = ['name', 'email', 'subject', 'status', 'created_at']
    list_filter = ['subject', 'status', 'created_at']
    search_fields = ['name', 'email', 'message']
    list_editable = ['status']
    readonly_fields = ['created_at']
    ordering = ['-created_at']

    fieldsets = (
        ('Contact Information', {
            'fields': ('name', 'email', 'subject', 'message', 'created_at')
        }),
        ('Response', {
            'fields': ('status', 'response', 'responded_by', 'responded_at')
        }),
    )

@admin.register(SiteStats)
class SiteStatsAdmin(ModelAdmin):
    list_display = ['updated_at', 'active_projects', 'total_members', 'research_papers_published', 'cities_impacted']

    def has_add_permission(self, request):
        # Only allow one instance
        return not SiteStats.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False

# Membership Admin
from apps.membership.models import MembershipTier, MembershipApplication, Payment

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
            'fields': ('full_name', 'phone', 'date_of_birth', 'address', 'city', 'state', 'postal_code')
        }),
        ('ID Verification', {
            'fields': ('id_proof_type', 'id_proof_number', 'id_proof_document')
        }),
        ('Skills & Interests', {
            'fields': ('skills', 'custom_skills', 'interests', 'experience', 'motivation')
        }),
        ('Education & Work', {
            'fields': ('institution', 'degree', 'field_of_study', 'graduation_year', 'current_occupation', 'organization')
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
            url = reverse('admin:auth_user_change', args=[obj.user.id])
            return format_html('<a href="{}">{}</a>', url, obj.user.username)
        return "No user"
    user_link.short_description = "User"

@admin.register(Payment)
class PaymentAdmin(ModelAdmin):
    list_display = ['payment_id', 'user', 'payment_type', 'amount', 'status', 'initiated_at']
    list_filter = ['payment_type', 'status', 'initiated_at']
    search_fields = ['payment_id', 'user__username', 'razorpay_payment_id']
    readonly_fields = ['payment_id', 'initiated_at', 'completed_at', 'razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature']
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

# Research Admin
from apps.research.models import Publication, ResearchProject, ResearchCategory

@admin.register(ResearchCategory)
class ResearchCategoryAdmin(ModelAdmin):
    list_display = ['name', 'is_active', 'order', 'color_preview']
    list_editable = ['is_active', 'order']

    def color_preview(self, obj):
        return format_html(
            '<div style="width: 20px; height: 20px; background-color: {}; border-radius: 3px;"></div>',
            obj.color
        )
    color_preview.short_description = "Color"

@admin.register(Publication)
class PublicationAdmin(ModelAdmin, ImportExportModelAdmin):
    list_display = ['title', 'publication_type', 'status', 'publication_date', 'download_count']
    list_filter = ['publication_type', 'status', 'category', 'publication_date']
    search_fields = ['title', 'abstract', 'keywords']
    list_editable = ['status']
    ordering = ['-publication_date', '-created_at']
    filter_horizontal = ['authors']

    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'abstract', 'publication_type', 'status', 'featured')
        }),
        ('Publication Details', {
            'fields': ('journal_name', 'publisher', 'publication_date', 'volume', 'issue', 'pages')
        }),
        ('Identifiers', {
            'fields': ('doi', 'isbn', 'issn', 'arxiv_id')
        }),
        ('Files and Links', {
            'fields': ('pdf_file', 'external_url', 'cover_image')
        }),
        ('Categorization', {
            'fields': ('category', 'keywords', 'tags')
        }),
        ('Metrics', {
            'fields': ('download_count', 'view_count', 'citation_count')
        }),
    )

# Donations Admin
from apps.donations.models import Donation, DonationCertificate

@admin.register(Donation)
class DonationAdmin(ModelAdmin, ImportExportModelAdmin):
    list_display = ['donation_id', 'donor_display_name', 'amount', 'status', 'wants_80g_certificate', 'created_at']
    list_filter = ['status', 'donation_type', 'wants_80g_certificate', 'created_at']
    search_fields = ['donation_id', 'donor_name', 'donor_email', 'donor__username']
    list_editable = ['status']
    readonly_fields = ['donation_id', 'created_at', 'completed_at']
    ordering = ['-created_at']

@admin.register(DonationCertificate)
class DonationCertificateAdmin(ModelAdmin):
    list_display = ['certificate_number', 'donation', 'financial_year', 'status', 'issued_date']
    list_filter = ['status', 'financial_year', 'issued_date']
    search_fields = ['certificate_number', 'donation__donor_name']
    readonly_fields = ['certificate_number', 'issued_date']

# Issues Admin
from apps.issues.models import ReportedIssue, IssueCategory

@admin.register(IssueCategory)
class IssueCategoryAdmin(ModelAdmin):
    list_display = ['name', 'is_active', 'order', 'color_preview']
    list_editable = ['is_active', 'order']

    def color_preview(self, obj):
        return format_html(
            '<div style="width: 20px; height: 20px; background-color: {}; border-radius: 3px;"></div>',
            obj.color
        )
    color_preview.short_description = "Color"

@admin.register(ReportedIssue)
class ReportedIssueAdmin(ModelAdmin):
    list_display = ['issue_number', 'title', 'category', 'status', 'priority', 'location_display', 'created_at']
    list_filter = ['status', 'priority', 'category', 'created_at']
    search_fields = ['issue_number', 'title', 'description', 'reporter_name']
    list_editable = ['status', 'priority']
    readonly_fields = ['issue_number', 'created_at']
    ordering = ['-created_at']

    fieldsets = (
        ('Issue Information', {
            'fields': ('issue_number', 'title', 'description', 'category', 'created_at')
        }),
        ('Location', {
            'fields': ('location_description', 'address', 'city', 'state', 'postal_code', 'latitude', 'longitude')
        }),
        ('Media', {
            'fields': ('images', 'videos')
        }),
        ('Reporter Information', {
            'fields': ('reported_by', 'reporter_name', 'reporter_email', 'reporter_phone', 'is_anonymous')
        }),
        ('Management', {
            'fields': ('status', 'priority', 'severity', 'assigned_to', 'admin_notes')
        }),
        ('Resolution', {
            'fields': ('resolution_notes', 'resolved_by', 'resolved_at')
        }),
    )

# CMS Admin
from apps.cms.models import SiteSettings, Page, MediaAsset

@admin.register(SiteSettings)
class SiteSettingsAdmin(ModelAdmin):
    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False

    fieldsets = (
        ('Site Identity', {
            'fields': ('site_title', 'site_tagline', 'site_description')
        }),
        ('Contact Information', {
            'fields': ('primary_email', 'secondary_email', 'phone_primary', 'phone_secondary')
        }),
        ('Address', {
            'fields': ('address_line1', 'address_line2', 'city', 'state', 'country', 'postal_code')
        }),
        ('Legal Information', {
            'fields': ('registration_number', 'pan_number', 'tax_exemption_80g', 'tax_exemption_12a', 'darpan_id')
        }),
        ('SEO & Analytics', {
            'fields': ('meta_keywords', 'meta_description', 'google_analytics_id', 'facebook_pixel_id')
        }),
        ('Features', {
            'fields': ('maintenance_mode', 'allow_registrations', 'allow_anonymous_donations', 'allow_anonymous_issue_reports')
        }),
    )

@admin.register(Page)
class PageAdmin(ModelAdmin, ImportExportModelAdmin):
    list_display = ['title', 'page_type', 'status', 'show_in_menu', 'published_at', 'view_count']
    list_filter = ['page_type', 'status', 'show_in_menu', 'published_at']
    search_fields = ['title', 'content', 'meta_title']
    list_editable = ['status', 'show_in_menu']
    ordering = ['-published_at', '-created_at']
    prepopulated_fields = {'slug': ('title',)}

    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'page_type', 'status', 'author')
        }),
        ('Content', {
            'fields': ('excerpt', 'content')
        }),
        ('Media', {
            'fields': ('featured_image', 'gallery_images')
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description', 'meta_keywords')
        }),
        ('Display Settings', {
            'fields': ('show_in_menu', 'menu_order', 'featured')
        }),
        ('Access Control', {
            'fields': ('is_members_only', 'allowed_membership_tiers')
        }),
        ('Publishing', {
            'fields': ('published_at',)
        }),
    )

@admin.register(MediaAsset)
class MediaAssetAdmin(ModelAdmin):
    list_display = ['title', 'asset_type', 'file_size_display', 'uploaded_by', 'created_at']
    list_filter = ['asset_type', 'folder', 'created_at']
    search_fields = ['title', 'description', 'original_filename']
    readonly_fields = ['file_size', 'mime_type', 'created_at']
