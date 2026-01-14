# SummitMarket - Django Backend

This is the backend API for the SummitMarket e-commerce platform. It provides RESTful endpoints for the React frontend to interact with.

## Features

- **User Authentication**: Login, registration, and token-based authentication
- **Product Management**: CRUD operations for products and categories
- **Shopping Cart**: Cart management for authenticated users
- **Order Processing**: Order creation and management
- **Payment Integration**: Stripe payment processing
- **Admin Interface**: Django admin for managing products and orders

## Tech Stack

- **Django**: Python web framework
- **Django REST Framework**: API development toolkit
- **PostgreSQL**: Database (can be configured for other databases)
- **Django CORS Headers**: Cross-origin resource sharing
- **Django Rest Auth**: Authentication endpoints
- **Stripe**: Payment processing

## Project Structure

```
Backend/
├── summitmarket/          # Main project directory
│   ├── settings.py        # Project settings
│   ├── urls.py            # Main URL configuration
│   └── wsgi.py            # WSGI deployment configuration
├── api/                   # API application
│   ├── models.py          # Database models
│   ├── serializers.py     # Data serialization
│   ├── views.py           # API views
│   └── urls.py            # API URL routing
├── manage.py              # Django management script
└── requirements.txt       # Python dependencies
```

## API Endpoints

### Authentication
- `POST /api/auth/login/` - User login
- `POST /api/auth/register/` - User registration
- `POST /api/auth/logout/` - User logout

### Products
- `GET /api/products/` - List all products
- `GET /api/products/<id>/` - Get product details
- `GET /api/categories/` - List all categories
- `GET /api/categories/<id>/` - Get category details

### Cart
- `GET /api/cart/` - Get current user's cart
- `POST /api/cart/add/` - Add item to cart
- `POST /api/cart/remove/` - Remove item from cart
- `POST /api/cart/update/` - Update item quantity

### Orders
- `GET /api/orders/` - List user's orders
- `POST /api/orders/create/` - Create new order
- `GET /api/orders/<id>/` - Get order details

## Setup Instructions

1. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Create a `.env` file with your configuration:
   ```
   SECRET_KEY=your-secret-key
   DEBUG=True
   DATABASE_URL=postgresql://user:password@localhost:5432/summitmarket
   STRIPE_SECRET_KEY=your-stripe-secret-key
   ```

4. Run database migrations:
   ```
   python manage.py migrate
   ```

5. Create a superuser:
   ```
   python manage.py createsuperuser
   ```

6. Start the development server:
   ```
   python manage.py runserver
   ```

## Environment Variables

- `SECRET_KEY`: Django secret key
- `DEBUG`: Debug mode (True/False)
- `DATABASE_URL`: Database connection URL
- `STRIPE_SECRET_KEY`: Stripe API key for payments
- `ALLOWED_HOSTS`: Comma-separated list of allowed hosts

## Models

### User
Extends Django's default User model with additional fields:
- `phone_number`: User's phone number
- `address`: Shipping address
- `city`: City
- `postal_code`: Postal code

### Category
- `name`: Category name
- `description`: Category description
- `image`: Category image

### Product
- `name`: Product name
- `description`: Product description
- `price`: Product price
- `category`: Foreign key to Category
- `image`: Product image
- `stock`: Available stock
- `created_at`: Creation timestamp

### Cart
- `user`: Foreign key to User
- `product`: Foreign key to Product
- `quantity`: Number of items
- `added_at`: When item was added

### Order
- `user`: Foreign key to User
- `total_amount`: Total order amount
- `status`: Order status (pending, processing, shipped, delivered)
- `created_at`: Order creation timestamp

### OrderItem
- `order`: Foreign key to Order
- `product`: Foreign key to Product
- `quantity`: Number of items
- `price`: Price at time of order

## Admin Interface

Access the Django admin interface at `/admin/` to manage:
- Products and categories
- User accounts
- Orders and order status
- Site configuration

## Deployment

For production deployment, ensure:
- `DEBUG` is set to `False`
- `ALLOWED_HOSTS` includes your domain
- Use a production database (PostgreSQL recommended)
- Configure static and media file serving
- Set up SSL/HTTPS
- Use a production web server (Nginx, Apache)

## License

This project is licensed under the MIT License.