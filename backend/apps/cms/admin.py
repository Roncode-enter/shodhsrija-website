
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
