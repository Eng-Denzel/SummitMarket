from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
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
                'last_name': user.last_name
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
                    'last_name': user.last_name
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
        country=request.data.get('country', '')
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