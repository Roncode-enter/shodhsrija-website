from django.urls import path
from . import views

app_name = 'issues'

urlpatterns = [
    path('categories/', views.IssueCategoryListView.as_view(), name='category-list'),
    path('report/', views.report_issue, name='report-issue'),
    path('list/', views.ReportedIssueListView.as_view(), name='issue-list'),
    path('detail/<int:pk>/', views.ReportedIssueDetailView.as_view(), name='issue-detail'),
]
