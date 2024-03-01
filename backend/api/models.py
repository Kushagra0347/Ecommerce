from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class Product(models.Model):
	_id = models.AutoField(primary_key=True, editable=False)
	user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
	name = models.CharField(max_length=200, null=True, blank=True)
	image = models.ImageField(upload_to='Products', null=True, blank=True)
	# brand = models.CharField(max_length=100, null=True, blank=True)
	category = models.CharField(max_length=100, null=True, blank=True)
	description = models.TextField(null=True, blank=True)
	rating = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
	numReviews = models.IntegerField(default=0, null=True, blank=True)
	price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
	countInStock = models.IntegerField(default=0, null=True, blank=True)
	createdAt = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return self.name


class Review(models.Model):
	_id = models.AutoField(primary_key=True, editable=False)
	product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
	user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
	name = models.CharField(max_length=200, null=True, blank=True)
	rating = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
	review_description = models.TextField(null=True, blank=True)

	def __str__(self):
		return str(self.rating)


class Order(models.Model):
	_id = models.AutoField(primary_key=True, editable=False)
	user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
	payment_method = models.CharField(max_length=100, null=True, blank=True)
	tax_price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
	shipping_price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
	total_price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
	is_paid = models.BooleanField(default=False, null=True, blank=True)
	is_delivered = models.BooleanField(default=False, null=True, blank=True)
	paid_at = models.DateTimeField(auto_now_add=False, null=True, blank=True)
	delivered_at = models.DateTimeField(auto_now_add=False, null=True, blank=True)
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return str(self.created_at)


class OrderItem(models.Model):
	_id = models.AutoField(primary_key=True, editable=False)
	product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
	order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True, blank=True)
	name = models.CharField(max_length=200, null=True, blank=True)
	quantity = models.IntegerField(default=0, null=True, blank=True)
	price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
	image = models.URLField(max_length=200, null=True, blank=True)

	def __str__(self):
		return self.name


class ShippingAddress(models.Model):
	_id = models.AutoField(primary_key=True, editable=False)
	order = models.OneToOneField(Order, on_delete=models.CASCADE, null=True, blank=True)
	address = models.CharField(max_length=200, null=True, blank=True)
	city = models.CharField(max_length=200, null=True, blank=True)
	country = models.CharField(max_length=200, null=True, blank=True)
	pin_code = models.CharField(max_length=10, null=True, blank=True)
	shipping_price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)

	def __str__(self):
		return self.address
