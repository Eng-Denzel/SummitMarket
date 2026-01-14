import logging
from django.apps import AppConfig

logger = logging.getLogger(__name__)
logger.debug("Loading api.apps")


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'
    
    def ready(self):
        import logging
        logger = logging.getLogger(__name__)
        logger.debug("ApiConfig.ready() called")