from django.urls import path
from . import views

urlpatterns = [
    #path('', views.MainView.as_view(), name='main'),
    path('products/', views.GetProducts.as_view(), name='products'),
    path('products/<str:id>', views.GetProduct.as_view(), name='product'),
    path('users/', views.GetUsers.as_view(), name='users'),
    path('users/profile/', views.GetUserProfile.as_view(), name='user-profile'),
    path('users/login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/register/', views.registerUser.as_view(), name='register'),
]

