from django.test import TestCase
from django.contrib.auth.models import User
from .models import Category, Product, Cart, CartItem, Order, OrderItem

class CategoryModelTest(TestCase):
    def setUp(self):
        self.category = Category.objects.create(
            name='Electronics',
            description='Electronic devices and gadgets'
        )
    
    def test_category_str(self):
        self.assertEqual(str(self.category), 'Electronics')

class ProductModelTest(TestCase):
    def setUp(self):
        self.category = Category.objects.create(
            name='Electronics',
            description='Electronic devices and gadgets'
        )
        self.product = Product.objects.create(
            name='Smartphone',
            description='Latest smartphone model',
            price=699.99,
            category=self.category,
            stock=10,
            discount_percent=10
        )
    
    def test_product_str(self):
        self.assertEqual(str(self.product), 'Smartphone')
    
    def test_discounted_price(self):
        expected_discounted_price = 699.99 * (1 - 10/100)
        self.assertEqual(float(self.product.discounted_price), expected_discounted_price)

class CartModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.category = Category.objects.create(name='Electronics')
        self.product = Product.objects.create(
            name='Smartphone',
            description='Latest smartphone model',
            price=699.99,
            category=self.category,
            stock=10
        )
        self.cart = Cart.objects.create(user=self.user)
        self.cart_item = CartItem.objects.create(
            cart=self.cart,
            product=self.product,
            quantity=2
        )
    
    def test_cart_str(self):
        self.assertEqual(str(self.cart), 'Cart for testuser')
    
    def test_cart_total_items(self):
        self.assertEqual(self.cart.total_items, 2)
    
    def test_cart_total_price(self):
        expected_total = 699.99 * 2
        self.assertEqual(float(self.cart.total_price), expected_total)

class OrderModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.category = Category.objects.create(name='Electronics')
        self.product = Product.objects.create(
            name='Smartphone',
            description='Latest smartphone model',
            price=699.99,
            category=self.category,
            stock=10
        )
        self.order = Order.objects.create(
            user=self.user,
            total_amount=699.99,
            shipping_address='123 Test St',
            city='Test City',
            postal_code='12345',
            country='Test Country'
        )
        self.order_item = OrderItem.objects.create(
            order=self.order,
            product=self.product,
            quantity=1,
            price=699.99
        )
    
    def test_order_str(self):
        self.assertEqual(str(self.order), 'Order 1 by testuser')
    
    def test_order_item_subtotal(self):
        self.assertEqual(float(self.order_item.subtotal), 699.99)