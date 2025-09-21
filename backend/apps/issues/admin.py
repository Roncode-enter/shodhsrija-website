<<<<<<< HEAD
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
=======
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
>>>>>>> e22bff9aeb50cc02bb683c74649041d66e908df0
    )