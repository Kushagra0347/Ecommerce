from django.urls import path
from api.views import order_views as views

urlpatterns = [
	path('add', views.addOrderItems, name='post-order-items'),
	path('<str:id>', views.getOrder, name='get-user-order'),
	path('<str:id>/pay', views.updateOrder, name='put-user-order'),
]
