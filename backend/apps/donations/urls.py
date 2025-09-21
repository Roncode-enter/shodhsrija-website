<<<<<<< HEAD
from django.urls import path
from . import views

app_name = 'donations'

urlpatterns = [
    path('create-order/', views.create_donation_order, name='create-donation-order'),
    path('verify-payment/', views.verify_donation_payment, name='verify-donation-payment'),
    path('list/', views.DonationListView.as_view(), name='donation-list'),
    path('receipt/<int:pk>/', views.DonationReceiptView.as_view(), name='donation-receipt'),
]
=======
from django.urls import path
from . import views

app_name = 'donations'

urlpatterns = [
    path('create-order/', views.create_donation_order, name='create-donation-order'),
    path('verify-payment/', views.verify_donation_payment, name='verify-donation-payment'),
    path('list/', views.DonationListView.as_view(), name='donation-list'),
    path('receipt/<int:pk>/', views.DonationReceiptView.as_view(), name='donation-receipt'),
]
>>>>>>> e22bff9aeb50cc02bb683c74649041d66e908df0
