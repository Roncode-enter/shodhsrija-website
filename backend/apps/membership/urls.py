
from django.urls import path
from . import views

urlpatterns = [
    path('tiers/', views.MembershipTierListView.as_view(), name='membership-tier-list'),
    path('apply/', views.membership_application_submit, name='membership-apply'),
    path('payment/create/', views.create_payment_order, name='create-payment-order'),
    path('payment/verify/', views.verify_payment, name='verify-payment'),
]

]
