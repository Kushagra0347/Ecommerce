from django.urls import path
from api.views import user_views as views

urlpatterns = [
	path('', views.getUsers, name='get-users'),
	path('login', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),  # Simple JWT URL(s)
	path('register', views.registerUser, name='post-register-user'),
	path('profile', views.getUserProfile, name='get-user-profile'),
	path('profile/edit', views.editUserProfile, name='edit-user-profile'),
]
