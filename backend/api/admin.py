from django.contrib import admin
from .models import *


# Register your models here.
class ProductManager(admin.ModelAdmin):
	list_display = ['name', 'category', 'rating', 'numReviews', 'price', 'countInStock', 'createdAt']


class ReviewManager(admin.ModelAdmin):
	list_display = ['product', 'name', 'rating']


class OrderManager(admin.ModelAdmin):
	list_display = ['user', 'payment_method', 'total_price', 'is_paid', 'is_delivered', 'paid_at', 'delivered_at',
	                'created_at']


class OrderItemManager(admin.ModelAdmin):
	list_display = ['product', 'order', 'name', 'quantity', 'price', ]


class ShippingAddressManager(admin.ModelAdmin):
	list_display = ['order', 'address', 'city', 'country', 'pin_code', 'shipping_price']


admin.site.register(Product, ProductManager)
admin.site.register(Review, ReviewManager)
admin.site.register(Order, OrderManager)
admin.site.register(OrderItem, OrderItemManager)
admin.site.register(ShippingAddress, ShippingAddressManager)
