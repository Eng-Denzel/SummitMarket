# Admin Dashboard Documentation

## Overview
A complete custom admin dashboard for SummitMarket, built with Django REST Framework and React. This dashboard is completely separate from Django's default admin panel and provides full control over UI and functionality.

## Features

### Backend (Django REST Framework)
- **Admin API Endpoints**: Separate API endpoints under `/api/admin/`
- **Permission-Based Access**: Only staff users can access admin endpoints
- **Comprehensive Management**:
  - User Management (view, edit, toggle staff/active status, delete)
  - Product Management (CRUD operations, stock updates)
  - Order Management (view, update status, delete)
  - Category Management (CRUD operations)
  - Dashboard Statistics (users, products, orders, revenue)

### Frontend (React)
- **Modern UI**: Clean, responsive design with gradient colors
- **Separate Layout**: Admin dashboard has its own layout without the main site header/footer
- **Dashboard Pages**:
  - **Dashboard**: Overview with statistics and recent orders
  - **Users**: Manage all users, toggle staff/active status
  - **Products**: View, edit, delete products, update stock
  - **Orders**: View orders, update status, view order details
  - **Categories**: Manage product categories

## File Structure

### Backend Files
```
Backend/api/
├── admin_serializers.py    # Serializers for admin operations
├── admin_views.py          # ViewSets and views for admin
├── admin_urls.py           # URL routing for admin endpoints
└── serializers.py          # Updated to include is_staff field
```

### Frontend Files
```
Frontend/src/
├── components/
│   ├── common/
│   │   └── AdminRoute.js           # Protected route for admin access
│   └── layout/
│       ├── AdminLayout.js          # Admin dashboard layout
│       └── AdminLayout.css
├── pages/admin/
│   ├── AdminDashboard.js          # Main dashboard
│   ├── AdminDashboard.css
│   ├── AdminUsers.js              # User management
│   ├── AdminUsers.css
│   ├── AdminProducts.js           # Product management
│   ├── AdminProducts.css
│   ├── AdminOrders.js             # Order management
│   └── AdminOrders.css
├── services/
│   └── adminApi.js                # API service for admin operations
└── App.js                         # Updated with admin routes
```

## API Endpoints

### Dashboard
- `GET /api/admin/stats/` - Get dashboard statistics

### Users
- `GET /api/admin/users/` - List all users
- `GET /api/admin/users/{id}/` - Get user details
- `PUT /api/admin/users/{id}/` - Update user
- `DELETE /api/admin/users/{id}/` - Delete user
- `POST /api/admin/users/{id}/toggle_staff/` - Toggle staff status
- `POST /api/admin/users/{id}/toggle_active/` - Toggle active status

### Products
- `GET /api/admin/products/` - List all products
- `GET /api/admin/products/{id}/` - Get product details
- `POST /api/admin/products/` - Create product
- `PUT /api/admin/products/{id}/` - Update product
- `DELETE /api/admin/products/{id}/` - Delete product
- `POST /api/admin/products/{id}/update_stock/` - Update stock

### Orders
- `GET /api/admin/orders/` - List all orders
- `GET /api/admin/orders/{id}/` - Get order details
- `PUT /api/admin/orders/{id}/` - Update order
- `DELETE /api/admin/orders/{id}/` - Delete order
- `POST /api/admin/orders/{id}/update_status/` - Update order status

### Categories
- `GET /api/admin/categories/` - List all categories
- `GET /api/admin/categories/{id}/` - Get category details
- `POST /api/admin/categories/` - Create category
- `PUT /api/admin/categories/{id}/` - Update category
- `DELETE /api/admin/categories/{id}/` - Delete category

## Access Control

### Backend
All admin endpoints require:
1. User to be authenticated (Token authentication)
2. User to have `is_staff=True`

This is enforced using Django REST Framework's `IsAdminUser` permission class.

### Frontend
Admin routes are protected by the `AdminRoute` component which:
1. Checks if user is authenticated
2. Checks if user has `is_staff=True`
3. Redirects to login if not authorized

## How to Access

1. **Create a staff user** (if you don't have one):
   ```bash
   cd Backend
   python manage.py createsuperuser
   ```

2. **Or make an existing user staff**:
   ```python
   python manage.py shell
   >>> from django.contrib.auth.models import User
   >>> user = User.objects.get(username='your_username')
   >>> user.is_staff = True
   >>> user.save()
   ```

3. **Access the admin dashboard**:
   - Login to the application
   - Navigate to `/admin` in your browser
   - You'll see the admin dashboard if you're a staff user

## Features by Page

### Dashboard
- Total users count
- Total products count
- Total orders count
- Total revenue
- Pending orders count
- Low stock products count
- Recent orders table

### Users Management
- Search users by username, email, or name
- Filter by staff status
- Filter by active status
- Toggle staff status
- Toggle active status
- Delete users
- View user statistics (total orders, total spent)

### Products Management
- Search products by name or description
- Filter by category
- Filter by stock status (low stock, out of stock)
- Update product stock quickly
- Edit product details
- Delete products
- View product images

### Orders Management
- Search orders by ID, customer username, or email
- Filter by order status
- Update order status directly from table
- View order details (items, shipping info)
- Delete orders
- Expandable order details

## Styling

The admin dashboard uses a modern design with:
- Purple gradient sidebar
- Clean white content area
- Card-based statistics
- Responsive tables
- Status badges with colors
- Hover effects and transitions
- Mobile-responsive layout

## Integration with Existing Project

The admin dashboard is fully integrated with the existing SummitMarket project:
- Uses the same authentication system
- Shares the same database models
- Uses the same API structure
- Maintains consistency with existing code patterns

## Security Considerations

1. **Authentication Required**: All admin endpoints require authentication
2. **Staff-Only Access**: Only users with `is_staff=True` can access
3. **Token-Based Auth**: Uses Django REST Framework token authentication
4. **CORS Configured**: Properly configured for frontend-backend communication

## Future Enhancements

Potential additions:
- Product creation/edit forms
- Category management page
- Analytics and charts
- Export functionality
- Bulk operations
- Activity logs
- Email notifications
- Advanced filtering and sorting
- Image upload preview
- Rich text editor for descriptions
