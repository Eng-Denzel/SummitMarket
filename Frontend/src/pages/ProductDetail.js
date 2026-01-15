import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMinus, FiPlus, FiShoppingCart, FiArrowLeft } from 'react-icons/fi';
import { productService } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Button from '../components/common/Button';
import Loading from '../components/layout/Loading';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL?.replace('/api', '') || 'http://localhost:8000';

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.getProductById(id);
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    try {
      setAddingToCart(true);
      await addToCart(product.id, quantity);
      setQuantity(1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  if (!product) {
    return null;
  }

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
    <div className="product-detail-page">
      <div className="container">
        <Link to="/products" className="back-link">
          <FiArrowLeft /> Back to Products
        </Link>

        <div className="product-detail-content">
          <motion.div
            className="product-image-section"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="product-image-main">
              <img src={imageUrl} alt={product.name} />
              {hasDiscount && (
                <span className="discount-badge">-{product.discount_percent}%</span>
              )}
            </div>
          </motion.div>

          <motion.div
            className="product-info-section"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="product-category">{product.category_name}</p>
            <h1 className="product-title">{product.name}</h1>

            <div className="product-price-section">
              {hasDiscount ? (
                <>
                  <span className="price-discounted">${parseFloat(product.discounted_price).toFixed(2)}</span>
                  <span className="price-original">${parseFloat(product.price).toFixed(2)}</span>
                  <span className="savings">Save ${(parseFloat(product.price) - parseFloat(product.discounted_price)).toFixed(2)}</span>
                </>
              ) : (
                <span className="price-current">${parseFloat(product.price).toFixed(2)}</span>
              )}
            </div>

            <div className="product-stock">
              {product.stock > 0 ? (
                <span className="in-stock">In Stock ({product.stock} available)</span>
              ) : (
                <span className="out-of-stock">Out of Stock</span>
              )}
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            {product.stock > 0 && (
              <div className="product-actions">
                <div className="quantity-selector">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <FiMinus />
                  </button>
                  <span className="quantity-value">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                  >
                    <FiPlus />
                  </button>
                </div>

                <Button
                  onClick={handleAddToCart}
                  loading={addingToCart}
                  size="large"
                  fullWidth
                >
                  <FiShoppingCart />
                  Add to Cart
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
