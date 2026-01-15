import random
import os
import urllib.request
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.core.files import File
from django.core.files.temp import NamedTemporaryFile
from api.models import Category, Product

class Command(BaseCommand):
    help = 'Populate the database with dummy data for categories, products, and deals'

    def download_image(self, url, product_name):
        """Download image from URL and return a File object"""
        try:
            img_temp = NamedTemporaryFile()
            img_temp.write(urllib.request.urlopen(url).read())
            img_temp.flush()
            return File(img_temp)
        except Exception as e:
            self.stdout.write(self.style.WARNING(f'Failed to download image for {product_name}: {str(e)}'))
            return None

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
        
        # Create products with image URLs from Unsplash (free stock photos)
        products_data = [
            # Electronics
            {'name': 'Smartphone X1', 'description': 'Latest smartphone with advanced features', 'price': 699.99, 'stock': 50, 'discount_percent': 10, 'image_url': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500'},
            {'name': 'Laptop Pro', 'description': 'High-performance laptop for professionals', 'price': 1299.99, 'stock': 30, 'discount_percent': 15, 'image_url': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500'},
            {'name': 'Wireless Headphones', 'description': 'Noise-cancelling wireless headphones', 'price': 199.99, 'stock': 100, 'discount_percent': 5, 'image_url': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'},
            {'name': 'Smart Watch', 'description': 'Fitness tracker and smartwatch combo', 'price': 249.99, 'stock': 75, 'discount_percent': 0, 'image_url': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'},
            {'name': 'Tablet Elite', 'description': 'Premium tablet for work and entertainment', 'price': 499.99, 'stock': 40, 'discount_percent': 8, 'image_url': 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500'},
            
            # Clothing
            {'name': 'Casual T-Shirt', 'description': 'Comfortable cotton t-shirt for everyday wear', 'price': 19.99, 'stock': 200, 'discount_percent': 0, 'image_url': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'},
            {'name': 'Designer Jeans', 'description': 'Stylish jeans with perfect fit', 'price': 79.99, 'stock': 150, 'discount_percent': 10, 'image_url': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500'},
            {'name': 'Winter Jacket', 'description': 'Warm jacket for cold weather', 'price': 129.99, 'stock': 80, 'discount_percent': 15, 'image_url': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500'},
            {'name': 'Running Shoes', 'description': 'Lightweight shoes for running and exercise', 'price': 89.99, 'stock': 120, 'discount_percent': 5, 'image_url': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'},
            {'name': 'Formal Dress', 'description': 'Elegant dress for special occasions', 'price': 149.99, 'stock': 60, 'discount_percent': 0, 'image_url': 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500'},
            
            # Home & Kitchen
            {'name': 'Coffee Maker', 'description': 'Automatic coffee maker with timer', 'price': 89.99, 'stock': 90, 'discount_percent': 12, 'image_url': 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500'},
            {'name': 'Blender Pro', 'description': 'High-powered blender for smoothies and more', 'price': 79.99, 'stock': 110, 'discount_percent': 8, 'image_url': 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500'},
            {'name': 'Vacuum Cleaner', 'description': 'Powerful vacuum for clean homes', 'price': 199.99, 'stock': 70, 'discount_percent': 20, 'image_url': 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500'},
            {'name': 'Air Fryer', 'description': 'Healthy cooking with less oil', 'price': 129.99, 'stock': 85, 'discount_percent': 10, 'image_url': 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500'},
            {'name': 'Bedding Set', 'description': 'Comfortable bedding for a good night sleep', 'price': 99.99, 'stock': 130, 'discount_percent': 0, 'image_url': 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500'},
            
            # Books
            {'name': 'Mystery Novel', 'description': 'Thrilling mystery novel by bestselling author', 'price': 14.99, 'stock': 300, 'discount_percent': 0, 'image_url': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'},
            {'name': 'Programming Guide', 'description': 'Complete guide to modern programming', 'price': 39.99, 'stock': 180, 'discount_percent': 5, 'image_url': 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500'},
            {'name': 'Cookbook', 'description': 'Delicious recipes for every occasion', 'price': 24.99, 'stock': 220, 'discount_percent': 0, 'image_url': 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=500'},
            {'name': 'Science Fiction', 'description': 'Epic space adventure story', 'price': 16.99, 'stock': 250, 'discount_percent': 0, 'image_url': 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500'},
            {'name': 'Self-Help Book', 'description': 'Improve your life with expert advice', 'price': 19.99, 'stock': 160, 'discount_percent': 10, 'image_url': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500'},
            
            # Sports
            {'name': 'Yoga Mat', 'description': 'Non-slip yoga mat for exercise', 'price': 29.99, 'stock': 140, 'discount_percent': 0, 'image_url': 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500'},
            {'name': 'Dumbbell Set', 'description': 'Adjustable weights for home gym', 'price': 149.99, 'stock': 65, 'discount_percent': 15, 'image_url': 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500'},
            {'name': 'Tennis Racket', 'description': 'Professional tennis racket', 'price': 89.99, 'stock': 95, 'discount_percent': 5, 'image_url': 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=500'},
            {'name': 'Soccer Ball', 'description': 'Official size soccer ball', 'price': 19.99, 'stock': 175, 'discount_percent': 0, 'image_url': 'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=500'},
            {'name': 'Fitness Tracker', 'description': 'Track your steps and heart rate', 'price': 49.99, 'stock': 110, 'discount_percent': 8, 'image_url': 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500'},
            
            # Beauty
            {'name': 'Moisturizer', 'description': 'Hydrating face moisturizer with SPF', 'price': 24.99, 'stock': 200, 'discount_percent': 0, 'image_url': 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500'},
            {'name': 'Lipstick Set', 'description': 'Set of premium lipsticks in various colors', 'price': 34.99, 'stock': 150, 'discount_percent': 10, 'image_url': 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500'},
            {'name': 'Hair Dryer', 'description': 'Ionic hair dryer for smooth results', 'price': 59.99, 'stock': 125, 'discount_percent': 12, 'image_url': 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500'},
            {'name': 'Perfume', 'description': 'Luxury fragrance for men and women', 'price': 79.99, 'stock': 100, 'discount_percent': 0, 'image_url': 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500'},
            {'name': 'Face Mask Kit', 'description': 'Set of rejuvenating face masks', 'price': 29.99, 'stock': 180, 'discount_percent': 5, 'image_url': 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500'},
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
            
            # Download and attach image
            if 'image_url' in prod_data:
                image_file = self.download_image(prod_data['image_url'], prod_data['name'])
                if image_file:
                    product.image.save(f"{prod_data['name'].replace(' ', '_').lower()}.jpg", image_file, save=True)
                    self.stdout.write(self.style.SUCCESS(f'Added image for: {product.name}'))
            
            products.append(product)
            self.stdout.write(f'Created product: {product.name} in category {product.category.name}')
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully populated database with {len(categories)} categories and {len(products)} products'
            )
        )