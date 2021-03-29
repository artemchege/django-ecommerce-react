from django.urls import path
from api.views import order_views as views

urlpatterns = [
    path('', views.getOrders.as_view(), name='orders'),
    path('create-checkout-session/', views.createCheckoutSession.as_view(), name='create-session'),
    path('finish-order/', views.finishOrder.as_view(), name='finish-order'),
    path('myorders/', views.getMyOrders.as_view(), name='myorders'),
    path('add/', views.addOrderItems.as_view(), name='orders-add'),
    path('<str:pk>/delivered/', views.updateOrderToDelivered.as_view(), name='order-delivered'),
    path('<str:pk>/', views.getOrderById.as_view(), name='user-order'),
]

