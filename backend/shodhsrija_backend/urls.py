
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),

    # API Routes
    path('api/auth/', include('apps.authentication.urls')),
    path('api/core/', include('apps.core.urls')),
    path('api/research/', include('apps.research.urls')),
    path('api/membership/', include('apps.membership.urls')),
    path('api/donations/', include('apps.donations.urls')),
    path('api/issues/', include('apps.issues.urls')),
    path('api/cms/', include('apps.cms.urls')),

    # Catch-all for React frontend (should be last)
    path('', TemplateView.as_view(template_name='index.html'), name='frontend'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Admin site customization
admin.site.site_header = "ShodhSrija Foundation Admin"
admin.site.site_title = "ShodhSrija Admin"
admin.site.index_title = "Welcome to ShodhSrija Foundation Administration"

