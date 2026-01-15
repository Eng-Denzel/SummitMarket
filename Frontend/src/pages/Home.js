import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShoppingBag, FiTruck, FiShield } from 'react-icons/fi';
import { productService } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import Loading from '../components/layout/Loading';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        productService.getProducts(),
        productService.getCategories(),
      ]);
      setProducts(productsData.results || productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  const featuredProducts = products.slice(0, 8);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content container">
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Discover Amazing Products</h1>
            <p>Shop the latest trends and exclusive deals at SummitMarket</p>
            <Link to="/products" className="hero-btn">
              Shop Now <FiArrowRight />
            </Link>
          </motion.div>
          <motion.div
            className="hero-image"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="hero-image-placeholder">
              <FiShoppingBag />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <motion.div
              className="feature-card"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="feature-icon">
                <FiTruck />
              </div>
              <h3>Free Shipping</h3>
              <p>On orders over $50</p>
            </motion.div>

            <motion.div
              className="feature-card"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="feature-icon">
                <FiShield />
              </div>
              <h3>Secure Payment</h3>
              <p>100% secure transactions</p>
            </motion.div>

            <motion.div
              className="feature-card"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="feature-icon">
                <FiShoppingBag />
              </div>
              <h3>Quality Products</h3>
              <p>Curated selection</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="categories-section">
          <div className="container">
            <div className="section-header">
              <h2>Shop by Category</h2>
              <Link to="/products" className="view-all-link">
                View All <FiArrowRight />
              </Link>
            </div>
            <div className="categories-grid">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.id}`}
                  className="category-card"
                >
                  <div className="category-image">
                    {category.image ? (
                      <img
                        src={`${process.env.REACT_APP_API_BASE_URL?.replace('/api', '') || 'http://localhost:8000'}${category.image}`}
                        alt={category.name}
                      />
                    ) : (
                      <div className="category-placeholder">
                        <FiShoppingBag />
                      </div>
                    )}
                  </div>
                  <h3>{category.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      <section className="featured-products-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Products</h2>
            <Link to="/products" className="view-all-link">
              View All <FiArrowRight />
            </Link>
          </div>
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2>Ready to Start Shopping?</h2>
            <p>Join thousands of satisfied customers and discover amazing deals</p>
            <Link to="/register" className="cta-btn">
              Create Account <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
