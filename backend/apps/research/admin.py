# Research Admin
from django.utils.html import format_html
from apps.research.models import Publication, ResearchProject, ResearchCategory
from django.contrib import admin
from django.contrib.admin import ModelAdmin

from import_export.admin import ImportExportModelAdmin  # Assuming you use this

@admin.register(ResearchCategory)
class ResearchCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_active', 'order', 'color_preview']
    list_editable = ['is_active', 'order']

    def color_preview(self, obj):
        return format_html(
            '<div style="width: 20px; height: 20px; background-color: {}; border-radius: 3px;"></div>',
            obj.color
        )
    color_preview.short_description = "Color"

@admin.register(Publication)
class PublicationAdmin(admin.ModelAdmin, ImportExportModelAdmin):
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
    )  # This closing parenthesis properly ends the tuple

