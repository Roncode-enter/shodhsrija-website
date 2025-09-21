
from django.urls import path
from . import views

app_name = 'cms'

urlpatterns = [
    path('site-settings/', views.SiteSettingsView.as_view(), name='site-settings'),
    path('pages/', views.PageListView.as_view(), name='page-list'),
    path('pages/<int:pk>/', views.PageDetailView.as_view(), name='page-detail'),
    path('media-assets/', views.MediaAssetListView.as_view(), name='media-asset-list'),
    path('media-assets/<int:pk>/', views.MediaAssetDetailView.as_view(), name='media-asset-detail'),
]
