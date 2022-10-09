from django.shortcuts import render
# Django Rest Framework
from rest_framework.response import Response
from rest_framework.decorators import api_view
# Mine
from api.models import Product
from api.serializers import ProductSerializer


@api_view(['GET'])
def getProducts(request):
	products = Product.objects.all()
	serializer = ProductSerializer(products, many=True)
	return Response(serializer.data)


@api_view(['GET'])
def getProduct(request, id):
	product = Product.objects.get(_id=id)
	serializer = ProductSerializer(product, many=False)
	return Response(serializer.data)
