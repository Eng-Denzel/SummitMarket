from django.urls import path
from . import views

urlpatterns = [
    # Authentication
    path('auth/register/', views.register_view, name='register'),
    path('auth/login/', views.login_view, name='login'),
    path('auth/logout/', views.logout_view, name='logout'),
    
    # Categories
    path('categories/', views.CategoryListView.as_view(), name='category-list'),
    
    # Products
    path('products/', views.ProductListView.as_view(), name='product-list'),
    path('products/<int:pk>/', views.ProductDetailView.as_view(), name='product-detail'),
    
    # Cart
    path('cart/', views.cart_view, name='cart'),
    path('cart/add/', views.add_to_cart, name='add-to-cart'),
    path('cart/remove/', views.remove_from_cart, name='remove-from-cart'),
    path('cart/update/', views.update_cart_item, name='update-cart-item'),
    
    # Orders
    path('orders/', views.order_list_view, name='order-list'),
    path('orders/create/', views.create_order, name='create-order'),
    path('orders/<int:order_id>/payment/', views.process_payment, name='process-payment'),
    path('orders/<int:order_id>/shipping/', views.update_shipping_status, name='update-shipping'),
]