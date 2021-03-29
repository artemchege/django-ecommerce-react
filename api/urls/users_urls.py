from django.urls import path
from api.views import user_views as views

urlpatterns = [
    path('', views.GetUsers.as_view(), name='users'),
    path('profile/', views.GetUserProfile.as_view(), name='user-profile'),
    path('login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', views.registerUser.as_view(), name='register'),
    path('profile/update/', views.updateUserProfile.as_view(), name='user-profile-update'),
    path('delete/<str:pk>/', views.deleteUser.as_view(), name='delete-user'),
    path('update/<str:pk>/', views.updateUserById.as_view(), name='update-user-by-id'),
    path('<str:id>/', views.GetUserById.as_view(), name='get-user-by-id'),
]

