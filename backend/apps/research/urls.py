<<<<<<< HEAD
from django.urls import path
from . import views

app_name = 'research'

urlpatterns = [
    path('publications/', views.PublicationListView.as_view(), name='publication-list'),
    path('publications/<int:pk>/', views.PublicationDetailView.as_view(), name='publication-detail'),
    path('projects/', views.ResearchProjectListView.as_view(), name='project-list'),
    path('projects/<int:pk>/', views.ResearchProjectDetailView.as_view(), name='project-detail'),
]
=======
from django.urls import path
from . import views

app_name = 'research'

urlpatterns = [
    path('publications/', views.PublicationListView.as_view(), name='publication-list'),
    path('publications/<int:pk>/', views.PublicationDetailView.as_view(), name='publication-detail'),
    path('projects/', views.ResearchProjectListView.as_view(), name='project-list'),
    path('projects/<int:pk>/', views.ResearchProjectDetailView.as_view(), name='project-detail'),
]
>>>>>>> e22bff9aeb50cc02bb683c74649041d66e908df0
