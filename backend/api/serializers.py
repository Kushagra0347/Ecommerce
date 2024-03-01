from django.contrib.auth.models import User
# Rest Framework
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
# Mine
from .models import Product, Order, ShippingAddress, OrderItem


class UserSerializer(serializers.ModelSerializer):
	name = serializers.SerializerMethodField(read_only=True)
	_id = serializers.SerializerMethodField(read_only=True)
	isAdmin = serializers.SerializerMethodField(read_only=True)

	@staticmethod
	def get_name(obj):
		name = obj.first_name
		if (name == ''):
			name = obj.email
		return name

	@staticmethod
	def get__id(obj):
		_id = obj.id
		return _id

	@staticmethod
	def get_isAdmin(obj):
		isAdmin = obj.is_staff
		return isAdmin

	class Meta:
		model = User
		fields = ['_id', 'username', 'email', 'name', 'isAdmin']


class UserTokenSerializer(UserSerializer):
	token = serializers.SerializerMethodField(read_only=True)

	@staticmethod
	def get_token(obj):
		token = RefreshToken.for_user(obj)
		return str(token.access_token)

	class Meta:
		model = User
		fields = ['_id', 'username', 'email', 'name', 'isAdmin', 'token']


class ProductSerializer(serializers.ModelSerializer):
	class Meta:
		model = Product
		fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
	orderItems = serializers.SerializerMethodField(read_only=True)
	shippingAddress = serializers.SerializerMethodField(read_only=True)
	user = serializers.SerializerMethodField(read_only=True)

	@staticmethod
	def get_orderItems(obj):
		items = obj.orderitem_set.all()
		serializer = OrderItemSerializer(items, many=True)

		return serializer.data

	@staticmethod
	def get_shippingAddress(obj):
		print(obj.shippingaddress)
		print("Shipping Address")
		try:
			address = ShippingAddressSerializer(obj.shippingaddress, many=False).data
		except:
			address = False
		return address

	@staticmethod
	def get_user(obj):
		user = obj.user
		serializer = UserSerializer(user, many=False)
		return serializer.data

	class Meta:
		model = Order
		fields = '__all__'


class ShippingAddressSerializer(serializers.ModelSerializer):
	class Meta:
		model = ShippingAddress
		fields = '__all__'


class OrderItemSerializer(serializers.ModelSerializer):
	class Meta:
		model = OrderItem
		fields = '__all__'


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
	def validate(self, attrs):
		data = super().validate(attrs)

		serializer = UserTokenSerializer(self.user).data

		for key, value in serializer.items():
			data[key] = value

		return data
