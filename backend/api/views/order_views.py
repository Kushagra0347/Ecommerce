from datetime import datetime
from django.shortcuts import render
# Django Rest Framework
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
# Mine
from api.models import Product, Order, OrderItem, ShippingAddress
from api.serializers import ProductSerializer, OrderSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
	user = request.user
	data = request.data

	orderItems = data['orderItems']

	if (orderItems and len(orderItems) == 0):
		return Response({'detail': 'No Order Items'}, status=status.HTTP_406_NOT_ACCEPTABLE)

	else:
		order = Order.objects.create(
			user=user,
			payment_method=data['paymentMethod'],
			shipping_price=data['shippingPrice'],
			tax_price=data['taxPrice'],
			total_price=data['totalPrice'],
		)

		# (2) Create Shipping Address

		shipping = ShippingAddress.objects.create(
			order=order,
			address=data['shippingAddress']['address'],
			city=data['shippingAddress']['city'],
			pin_code=data['shippingAddress']['pinCode'],
			country=data['shippingAddress']['country'],
		)

		# (3) Create Order Items and set the order to order item relationship

		for orderItem in orderItems:
			product = Product.objects.get(_id=orderItem['product'])

			item = OrderItem.objects.create(
				product=product,
				order=order,
				name=product.name,
				quantity=orderItem['qty'],
				price=orderItem['price'],
				image=product.image.url
			)

			# (4) Update Stock

			product.countInStock -= int(item.quantity)
			product.save()

		serializer = OrderSerializer(order, many=False)
		return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrder(request, id):
	user = request.user
	try:
		order = Order.objects.get(_id=id)
		if (user.is_staff or order.user == user):
			serializer = OrderSerializer(order, many=False)
			return Response(serializer.data)
		else:
			return Response({'detail': 'Not Authorised to View this Order'}, status=status.HTTP_401_UNAUTHORIZED)
	except:
		return Response({'detail': 'Order Does Not Exist'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOrder(request, id):
	order = Order.objects.get(_id=id)

	order.is_paid = True
	order.paid_at = datetime.now()
	order.save()

	return Response({'detail': 'Order Was Paid'}, status=status.HTTP_200_OK)
