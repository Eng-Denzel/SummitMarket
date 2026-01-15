from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import timedelta
import time
from .models import Category, Product, Cart, CartItem, Order, OrderItem
from .serializers import CategorySerializer, ProductSerializer, CartSerializer, CartItemSerializer, OrderSerializer, RegisterSerializer

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = Product.objects.all()
        
        # Filter by category
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category_id=category)
        
        # Search by name or description
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(name__icontains=search) | queryset.filter(description__icontains=search)
        
        # Ordering/Sorting
        ordering = self.request.query_params.get('ordering', None)
        if ordering:
            queryset = queryset.order_by(ordering)
        
        return queryset

class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    print('[REGISTER DEBUG] Registration request received')
    print('[REGISTER DEBUG] Request data:', request.data)
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        print('[REGISTER DEBUG] Serializer validation passed')
        user = serializer.save()
        print('[REGISTER DEBUG] User created:', user.username)
        token, created = Token.objects.get_or_create(user=user)
        print('[REGISTER DEBUG] Token created:', token.key)
        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser
            }
        }, status=status.HTTP_201_CREATED)
    print('[REGISTER DEBUG] Serializer validation failed:', serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    print('[LOGIN DEBUG] Login request received')
    print('[LOGIN DEBUG] Request data:', request.data)
    print('[LOGIN DEBUG] Request headers:', dict(request.headers))
    username = request.data.get('username')
    password = request.data.get('password')
    
    if username and password:
        print(f'[LOGIN DEBUG] Attempting to authenticate user: {username}')
        user = authenticate(username=username, password=password)
        if user:
            print(f'[LOGIN DEBUG] Authentication successful for user: {username}')
            token, created = Token.objects.get_or_create(user=user)
            print(f'[LOGIN DEBUG] Token created/retrieved: {token.key}')
            print(f'[LOGIN DEBUG] Token was newly created: {created}')
            response_data = {
                'token': token.key,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'is_staff': user.is_staff,
                    'is_superuser': user.is_superuser
                }
            }
            print(f'[LOGIN DEBUG] Sending response: {response_data}')
            return Response(response_data, status=status.HTTP_200_OK)
        else:
            print(f'[LOGIN DEBUG] Authentication failed for user: {username}')
    else:
        print('[LOGIN DEBUG] Missing username or password')
    
    return Response({
        'error': 'Invalid credentials'
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        request.user.auth_token.delete()
    except:
        pass
    return Response({'message': 'Logged out successfully'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def cart_view(request):
    cart, created = Cart.objects.get_or_create(user=request.user)
    serializer = CartSerializer(cart)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    product_id = request.data.get('product_id')
    quantity = request.data.get('quantity', 1)
    
    product = get_object_or_404(Product, id=product_id)
    cart, created = Cart.objects.get_or_create(user=request.user)
    
    cart_item, created = CartItem.objects.get_or_create(
        cart=cart,
        product=product,
        defaults={'quantity': quantity}
    )
    
    if not created:
        cart_item.quantity += quantity
        cart_item.save()
    
    serializer = CartItemSerializer(cart_item)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request):
    product_id = request.data.get('product_id')
    cart = get_object_or_404(Cart, user=request.user)
    cart_item = get_object_or_404(CartItem, cart=cart, product_id=product_id)
    cart_item.delete()
    
    return Response({'message': 'Item removed from cart'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_cart_item(request):
    product_id = request.data.get('product_id')
    quantity = request.data.get('quantity')
    
    if quantity <= 0:
        return remove_from_cart(request)
    
    cart = get_object_or_404(Cart, user=request.user)
    cart_item = get_object_or_404(CartItem, cart=cart, product_id=product_id)
    cart_item.quantity = quantity
    cart_item.save()
    
    serializer = CartItemSerializer(cart_item)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def order_list_view(request):
    orders = Order.objects.filter(user=request.user)
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    cart = get_object_or_404(Cart, user=request.user)
    
    if cart.items.count() == 0:
        return Response({
            'error': 'Cart is empty'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Calculate total amount
    total_amount = cart.total_price
    
    # Create order
    order = Order.objects.create(
        user=request.user,
        total_amount=total_amount,
        shipping_address=request.data.get('shipping_address', ''),
        city=request.data.get('city', ''),
        postal_code=request.data.get('postal_code', ''),
        country=request.data.get('country', ''),
        payment_method=request.data.get('payment_method', ''),
        # Set initial payment status to pending
        payment_status='pending'
    )
    
    # Create order items
    for cart_item in cart.items.all():
        OrderItem.objects.create(
            order=order,
            product=cart_item.product,
            quantity=cart_item.quantity,
            price=cart_item.product.discounted_price
        )
    
    # Clear cart
    cart.items.all().delete()
    
    serializer = OrderSerializer(order)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def process_payment(request, order_id):
    """Process payment for an order"""
    order = get_object_or_404(Order, id=order_id, user=request.user)
    
    # In a real application, you would integrate with a payment gateway here
    # For this example, we'll simulate a successful payment
    payment_method = request.data.get('payment_method', 'credit_card')
    transaction_id = request.data.get('transaction_id', f'txn_{order.id}_{int(time.time())}')
    
    # Update order with payment information
    order.payment_method = payment_method
    order.payment_transaction_id = transaction_id
    order.payment_status = 'completed'
    order.payment_date = timezone.now()
    order.save()
    
    serializer = OrderSerializer(order)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def update_shipping_status(request, order_id):
    """Update shipping status and tracking information"""
    order = get_object_or_404(Order, id=order_id)
    
    # Update shipping information
    order.status = request.data.get('status', order.status)
    order.tracking_number = request.data.get('tracking_number', order.tracking_number)
    
    if order.status == 'shipped' and not order.shipped_date:
        order.shipped_date = timezone.now()
    
    # Set estimated delivery date (5 days from shipping date)
    if order.shipped_date and not order.estimated_delivery_date:
        order.estimated_delivery_date = order.shipped_date + timedelta(days=5)
    
    order.save()
    
    serializer = OrderSerializer(order)
    return Response(serializer.data, status=status.HTTP_200_OK)