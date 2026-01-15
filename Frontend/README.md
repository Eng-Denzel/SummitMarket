# SummitMarket Frontend

A modern, responsive e-commerce frontend built with React.js that integrates seamlessly with the Django REST API backend.

## Features

- **User Authentication**: Login, registration, and protected routes
- **Product Browsing**: Browse products with filtering, sorting, and search
- **Shopping Cart**: Add, update, and remove items from cart
- **Checkout Process**: Complete order placement with shipping information
- **Order Management**: View order history and order details
- **User Account**: Manage profile information
- **Responsive Design**: Mobile-first approach with beautiful UI
- **Loading Animations**: Smooth loading states and transitions
- **Toast Notifications**: User-friendly feedback messages

## Tech Stack

- **React 18.2.0**: Modern React with hooks
- **React Router DOM 6.20.0**: Client-side routing
- **Axios 1.6.2**: HTTP client for API calls
- **Framer Motion 10.16.16**: Smooth animations
- **React Hook Form 7.49.2**: Form handling and validation
- **React Toastify 9.1.3**: Toast notifications
- **React Icons 4.12.0**: Icon library

## Project Structure

```
Frontend/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.js
│   │   │   ├── ProductCard.js
│   │   │   └── PrivateRoute.js
│   │   └── layout/
│   │       ├── Header.js
│   │       ├── Footer.js
│   │       └── Loading.js
│   ├── context/
│   │   ├── AuthContext.js
│   │   └── CartContext.js
│   ├── pages/
│   │   ├── Home.js
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Products.js
│   │   ├── ProductDetail.js
│   │   ├── Cart.js
│   │   ├── Checkout.js
│   │   ├── Account.js
│   │   ├── Orders.js
│   │   └── OrderDetail.js
│   ├── services/
│   │   └── api.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── .env
├── package.json
└── README.md
```

## Installation

1. **Install Dependencies**
   ```bash
   cd Frontend
   npm install
   ```

2. **Configure Environment Variables**
   
   Create a `.env` file in the Frontend directory:
   ```
   REACT_APP_API_BASE_URL=http://localhost:8000/api
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```
   
   The application will open at `http://localhost:3000`

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm build`: Builds the app for production
- `npm test`: Runs the test suite
- `npm eject`: Ejects from Create React App (one-way operation)

## API Integration

The frontend integrates with the Django backend API with the following endpoints:

### Authentication
- `POST /api/auth/register/`: User registration
- `POST /api/auth/login/`: User login
- `POST /api/auth/logout/`: User logout

### Products
- `GET /api/products/`: List all products
- `GET /api/products/:id/`: Get product details
- `GET /api/categories/`: List all categories

### Cart
- `GET /api/cart/`: Get user's cart
- `POST /api/cart/add/`: Add item to cart
- `POST /api/cart/update/`: Update cart item quantity
- `POST /api/cart/remove/`: Remove item from cart

### Orders
- `GET /api/orders/`: List user's orders
- `POST /api/orders/create/`: Create new order

## Key Features Implementation

### Authentication Flow
- Token-based authentication using Django Token Auth
- Tokens stored in localStorage
- Automatic token injection in API requests
- Protected routes using PrivateRoute component

### State Management
- React Context API for global state
- AuthContext for user authentication state
- CartContext for shopping cart state

### Responsive Design
- Mobile-first CSS approach
- Breakpoints: mobile (< 768px), tablet (768px-1024px), desktop (> 1024px)
- Touch-friendly interactions
- Hamburger menu for mobile navigation

### User Experience
- Loading animations during data fetching
- Toast notifications for user feedback
- Smooth page transitions with Framer Motion
- Form validation with React Hook Form
- Skeleton loaders for content loading states

## Design System

### Colors
- Primary: #0066CC (Blue)
- Secondary: #FF6B35 (Orange)
- Success: #28A745 (Green)
- Error: #DC3545 (Red)
- Warning: #FFC107 (Yellow)

### Typography
- Headings: Poppins (Bold, 700-800)
- Body: Inter (Regular, 400-600)
- Base font size: 16px

### Components
- Consistent spacing and padding
- Rounded corners (8px-16px)
- Box shadows for depth
- Smooth transitions (0.3s ease)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimization

- Code splitting with React.lazy (can be implemented)
- Image lazy loading
- Memoization for expensive computations
- Debouncing for search inputs
- Optimized bundle size

## Future Enhancements

- Payment gateway integration (Stripe/PayPal)
- Product reviews and ratings
- Wishlist functionality
- Advanced search with filters
- Product recommendations
- Order tracking
- Email notifications
- Dark mode
- Progressive Web App (PWA) features
- Multi-language support

## Troubleshooting

### CORS Issues
Ensure the Django backend has CORS configured properly:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
```

### API Connection Issues
- Verify the backend server is running on `http://localhost:8000`
- Check the `.env` file has the correct API URL
- Ensure network requests are not blocked by firewall

### Build Issues
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear npm cache: `npm cache clean --force`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the SummitMarket e-commerce platform.

## Contact

For questions or support, please contact the development team.
