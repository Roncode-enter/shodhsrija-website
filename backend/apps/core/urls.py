<<<<<<< HEAD

from django.urls import path
from . import views

urlpatterns = [
    path('team/', views.TeamListView.as_view(), name='team-list'),
    path('departments/', views.DepartmentListView.as_view(), name='department-list'),
    path('focus-areas/', views.FocusAreaListView.as_view(), name='focus-area-list'),
    path('impact-stories/', views.ImpactStoryListView.as_view(), name='impact-story-list'),
    path('site-stats/', views.SiteStatsView.as_view(), name='site-stats'),
    path('contact/', views.contact_form_submit, name='contact-submit'),
    path('homepage-data/', views.homepage_data, name='homepage-data'),
]
=======

from django.urls import path
from . import views

urlpatterns = [
    path('team/', views.TeamListView.as_view(), name='team-list'),
    path('departments/', views.DepartmentListView.as_view(), name='department-list'),
    path('focus-areas/', views.FocusAreaListView.as_view(), name='focus-area-list'),
    path('impact-stories/', views.ImpactStoryListView.as_view(), name='impact-story-list'),
    path('site-stats/', views.SiteStatsView.as_view(), name='site-stats'),
    path('contact/', views.contact_form_submit, name='contact-submit'),
    path('homepage-data/', views.homepage_data, name='homepage-data'),
]
>>>>>>> e22bff9aeb50cc02bb683c74649041d66e908df0
