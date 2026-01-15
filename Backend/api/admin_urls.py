from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import admin_views

router = DefaultRouter()
router.register(r'users', admin_views.AdminUserViewSet, basename='admin-user')
router.register(r'categories', admin_views.AdminCategoryViewSet, basename='admin-category')
router.register(r'products', admin_views.AdminProductViewSet, basename='admin-product')
router.register(r'orders', admin_views.AdminOrderViewSet, basename='admin-order')

urlpatterns = [
    path('stats/', admin_views.dashboard_stats, name='admin-stats'),
    path('', include(router.urls)),
]
