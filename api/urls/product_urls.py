from django.urls import path
from api.views import product_views as views

urlpatterns = [
    path('', views.GetProducts.as_view(), name='products'),
    path('upload/', views.uploadImage.as_view(), name='image-upload'),
    path('delete/<str:pk>/', views.deleteProduct.as_view(), name='delete-product'),
    path('update/<str:pk>/', views.updateProduct.as_view(), name='update-product'),
    path('create/', views.CreateProduct.as_view(), name='create-product'),
    path('top/', views.getTopProducts.as_view(), name='top-product'),
    path('<str:id>/reviews/', views.createProductView.as_view(), name='create-review'),
    path('<str:id>', views.GetProduct.as_view(), name='product'),
]

