from django.apps import AppConfig


class ApiConfig(AppConfig):
	default_auto_field = 'django.db.models.BigAutoField'
	name = 'api'

	# To Fire Off The Signals
	def ready(self):
		from . import signals
