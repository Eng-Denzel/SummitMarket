import random
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import Category, Product

class Command(BaseCommand):
    help = 'Populate the database with dummy data for categories, products, and deals'

    def handle(self, *args, **options):
        # Clear existing data
        Category.objects.all().delete()
        Product.objects.all().delete()
        
        # Create categories
        categories_data = [
            {'name': 'Electronics', 'description': 'Devices and gadgets for tech enthusiasts'},
            {'name': 'Clothing', 'description': 'Fashionable clothing for men and women'},
            {'name': 'Home & Kitchen', 'description': 'Everything for your home and kitchen needs'},
            {'name': 'Books', 'description': 'Fiction, non-fiction, and educational books'},
            {'name': 'Sports', 'description': 'Equipment and gear for sports and fitness'},
            {'name': 'Beauty', 'description': 'Skincare, makeup, and personal care products'},
        ]
        
        categories = []
        for cat_data in categories_data:
            category = Category.objects.create(
                name=cat_data['name'],
                description=cat_data['description']
            )
            categories.append(category)
            self.stdout.write(f'Created category: {category.name}')
        
        # Create products
        products_data = [
            # Electronics
            {'name': 'Smartphone X1', 'description': 'Latest smartphone with advanced features', 'price': 699.99, 'stock': 50, 'discount_percent': 10},
            {'name': 'Laptop Pro', 'description': 'High-performance laptop for professionals', 'price': 1299.99, 'stock': 30, 'discount_percent': 15},
            {'name': 'Wireless Headphones', 'description': 'Noise-cancelling wireless headphones', 'price': 199.99, 'stock': 100, 'discount_percent': 5},
            {'name': 'Smart Watch', 'description': 'Fitness tracker and smartwatch combo', 'price': 249.99, 'stock': 75, 'discount_percent': 0},
            {'name': 'Tablet Elite', 'description': 'Premium tablet for work and entertainment', 'price': 499.99, 'stock': 40, 'discount_percent': 8},
            
            # Clothing
            {'name': 'Casual T-Shirt', 'description': 'Comfortable cotton t-shirt for everyday wear', 'price': 19.99, 'stock': 200, 'discount_percent': 0},
            {'name': 'Designer Jeans', 'description': 'Stylish jeans with perfect fit', 'price': 79.99, 'stock': 150, 'discount_percent': 10},
            {'name': 'Winter Jacket', 'description': 'Warm jacket for cold weather', 'price': 129.99, 'stock': 80, 'discount_percent': 15},
            {'name': 'Running Shoes', 'description': 'Lightweight shoes for running and exercise', 'price': 89.99, 'stock': 120, 'discount_percent': 5},
            {'name': 'Formal Dress', 'description': 'Elegant dress for special occasions', 'price': 149.99, 'stock': 60, 'discount_percent': 0},
            
            # Home & Kitchen
            {'name': 'Coffee Maker', 'description': 'Automatic coffee maker with timer', 'price': 89.99, 'stock': 90, 'discount_percent': 12},
            {'name': 'Blender Pro', 'description': 'High-powered blender for smoothies and more', 'price': 79.99, 'stock': 110, 'discount_percent': 8},
            {'name': 'Vacuum Cleaner', 'description': 'Powerful vacuum for clean homes', 'price': 199.99, 'stock': 70, 'discount_percent': 20},
            {'name': 'Air Fryer', 'description': 'Healthy cooking with less oil', 'price': 129.99, 'stock': 85, 'discount_percent': 10},
            {'name': 'Bedding Set', 'description': 'Comfortable bedding for a good night sleep', 'price': 99.99, 'stock': 130, 'discount_percent': 0},
            
            # Books
            {'name': 'Mystery Novel', 'description': 'Thrilling mystery novel by bestselling author', 'price': 14.99, 'stock': 300, 'discount_percent': 0},
            {'name': 'Programming Guide', 'description': 'Complete guide to modern programming', 'price': 39.99, 'stock': 180, 'discount_percent': 5},
            {'name': 'Cookbook', 'description': 'Delicious recipes for every occasion', 'price': 24.99, 'stock': 220, 'discount_percent': 0},
            {'name': 'Science Fiction', 'description': 'Epic space adventure story', 'price': 16.99, 'stock': 250, 'discount_percent': 0},
            {'name': 'Self-Help Book', 'description': 'Improve your life with expert advice', 'price': 19.99, 'stock': 160, 'discount_percent': 10},
            
            # Sports
            {'name': 'Yoga Mat', 'description': 'Non-slip yoga mat for exercise', 'price': 29.99, 'stock': 140, 'discount_percent': 0},
            {'name': 'Dumbbell Set', 'description': 'Adjustable weights for home gym', 'price': 149.99, 'stock': 65, 'discount_percent': 15},
            {'name': 'Tennis Racket', 'description': 'Professional tennis racket', 'price': 89.99, 'stock': 95, 'discount_percent': 5},
            {'name': 'Soccer Ball', 'description': 'Official size soccer ball', 'price': 19.99, 'stock': 175, 'discount_percent': 0},
            {'name': 'Fitness Tracker', 'description': 'Track your steps and heart rate', 'price': 49.99, 'stock': 110, 'discount_percent': 8},
            
            # Beauty
            {'name': 'Moisturizer', 'description': 'Hydrating face moisturizer with SPF', 'price': 24.99, 'stock': 200, 'discount_percent': 0},
            {'name': 'Lipstick Set', 'description': 'Set of premium lipsticks in various colors', 'price': 34.99, 'stock': 150, 'discount_percent': 10},
            {'name': 'Hair Dryer', 'description': 'Ionic hair dryer for smooth results', 'price': 59.99, 'stock': 125, 'discount_percent': 12},
            {'name': 'Perfume', 'description': 'Luxury fragrance for men and women', 'price': 79.99, 'stock': 100, 'discount_percent': 0},
            {'name': 'Face Mask Kit', 'description': 'Set of rejuvenating face masks', 'price': 29.99, 'stock': 180, 'discount_percent': 5},
        ]
        
        # Assign categories to products
        electronics_products = [p for p in products_data[:5]]
        clothing_products = [p for p in products_data[5:10]]
        home_products = [p for p in products_data[10:15]]
        books_products = [p for p in products_data[15:20]]
        sports_products = [p for p in products_data[20:25]]
        beauty_products = [p for p in products_data[25:30]]
        
        product_category_map = {
            **{p['name']: categories[0] for p in electronics_products},
            **{p['name']: categories[1] for p in clothing_products},
            **{p['name']: categories[2] for p in home_products},
            **{p['name']: categories[3] for p in books_products},
            **{p['name']: categories[4] for p in sports_products},
            **{p['name']: categories[5] for p in beauty_products},
        }
        
        # Create products
        products = []
        for prod_data in products_data:
            product = Product.objects.create(
                name=prod_data['name'],
                description=prod_data['description'],
                price=prod_data['price'],
                category=product_category_map[prod_data['name']],
                stock=prod_data['stock'],
                discount_percent=prod_data['discount_percent']
            )
            products.append(product)
            self.stdout.write(f'Created product: {product.name} in category {product.category.name}')
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully populated database with {len(categories)} categories and {len(products)} products'
            )
        )