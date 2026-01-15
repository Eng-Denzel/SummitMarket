import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL?.replace('/api', '') || 'http://localhost:8000';

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    try {
      await addToCart(product.id, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const hasDiscount = product.discount_percent > 0;
  // Handle image URL - check if it's already a full URL or needs to be prefixed
  let imageUrl = '/placeholder-product.png';
  if (product.image) {
    if (product.image.startsWith('http://') || product.image.startsWith('https://')) {
      imageUrl = product.image;
    } else if (product.image.startsWith('/')) {
      imageUrl = `${API_BASE_URL}${product.image}`;
    } else {
      imageUrl = `${API_BASE_URL}/${product.image}`;
    }
  }

  return (
    <motion.div
      className="product-card"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/products/${product.id}`} className="product-card-link">
        <div className="product-image-container">
          <img src={imageUrl} alt={product.name} className="product-image" />
          {hasDiscount && (
            <span className="discount-badge">-{product.discount_percent}%</span>
          )}
          {product.stock === 0 && (
            <span className="out-of-stock-badge">Out of Stock</span>
          )}
        </div>
        <div className="product-info">
          <p className="product-category">{product.category_name}</p>
          <h3 className="product-name">{product.name}</h3>
          <div className="product-price">
            {hasDiscount ? (
              <>
                <span className="price-discounted">${parseFloat(product.discounted_price).toFixed(2)}</span>
                <span className="price-original">${parseFloat(product.price).toFixed(2)}</span>
              </>
            ) : (
              <span className="price-current">${parseFloat(product.price).toFixed(2)}</span>
            )}
          </div>
        </div>
      </Link>
      <button
        className="add-to-cart-btn"
        onClick={handleAddToCart}
        disabled={product.stock === 0}
      >
        <FiShoppingCart />
        <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
      </button>
    </motion.div>
  );
};

export default ProductCard;
