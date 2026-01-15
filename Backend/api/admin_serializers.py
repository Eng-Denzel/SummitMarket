from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, Product, Order, OrderItem
from .serializers import OrderItemSerializer


class AdminUserSerializer(serializers.ModelSerializer):
    """Serializer for admin user management"""
    total_orders = serializers.SerializerMethodField()
    total_spent = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 
                 'is_staff', 'is_active', 'date_joined', 'last_login',
                 'total_orders', 'total_spent')
        read_only_fields = ('date_joined', 'last_login')
    
    def get_total_orders(self, obj):
        return obj.orders.count()
    
    def get_total_spent(self, obj):
        total = sum(order.total_amount for order in obj.orders.all())
        return float(total)


class AdminCategorySerializer(serializers.ModelSerializer):
    """Serializer for admin category management"""
    product_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = '__all__'
        read_only_fields = ('created_at',)
    
    def get_product_count(self, obj):
        return obj.products.count()
    
    def to_representation(self, instance):
        """Customize the representation to include full image URL"""
        data = super().to_representation(instance)
        if instance.image:
            request = self.context.get('request')
            if request is not None:
                data['image'] = request.build_absolute_uri(instance.image.url)
            else:
                data['image'] = instance.image.url
        else:
            data['image'] = None
        return data


class AdminProductSerializer(serializers.ModelSerializer):
    """Serializer for admin product management"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    discounted_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = Product
        fields = '__all__'
    
    def to_representation(self, instance):
        """Customize the representation to include full image URL"""
        data = super().to_representation(instance)
        if instance.image:
            request = self.context.get('request')
            if request is not None:
                data['image'] = request.build_absolute_uri(instance.image.url)
            else:
                data['image'] = instance.image.url
        return data


class AdminOrderSerializer(serializers.ModelSerializer):
    """Serializer for admin order management"""
    items = OrderItemSerializer(many=True, read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = Order
        fields = '__all__'


class DashboardStatsSerializer(serializers.Serializer):
    """Serializer for dashboard statistics"""
    total_users = serializers.IntegerField()
    total_products = serializers.IntegerField()
    total_orders = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    pending_orders = serializers.IntegerField()
    low_stock_products = serializers.IntegerField()
    recent_orders = AdminOrderSerializer(many=True)
