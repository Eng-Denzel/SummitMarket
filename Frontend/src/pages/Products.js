import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import Loading from '../components/layout/Loading';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy, searchParams]);

  const fetchCategories = async () => {
    try {
      const data = await productService.getCategories();
      // Ensure data is an array
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      
      const categoryParam = searchParams.get('category');
      if (categoryParam || selectedCategory) {
        params.category = categoryParam || selectedCategory;
      }

      const searchQuery = searchParams.get('search');
      if (searchQuery) {
        params.search = searchQuery;
      }

      if (sortBy) {
        params.ordering = sortBy;
      }

      const data = await productService.getProducts(params);
      setProducts(data.results || data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="products-page">
      <div className="container">
        <div className="products-header">
          <h1>Our Products</h1>
          <p>Discover our wide range of quality products</p>
        </div>

        <div className="products-layout">
          <aside className="products-sidebar">
            <div className="filter-section">
              <h3>Categories</h3>
              <div className="category-filters">
                <button
                  className={`category-filter ${!selectedCategory ? 'active' : ''}`}
                  onClick={() => handleCategoryChange('')}
                >
                  All Products
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`category-filter ${selectedCategory === category.id.toString() ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(category.id.toString())}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="products-main">
            <div className="products-toolbar">
              <p className="products-count">
                {products.length} {products.length === 1 ? 'Product' : 'Products'} Found
              </p>
              <div className="sort-controls">
                <label htmlFor="sort">Sort by:</label>
                <select id="sort" value={sortBy} onChange={handleSortChange}>
                  <option value="">Default</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                  <option value="-name">Name: Z to A</option>
                  <option value="-created_at">Newest First</option>
                </select>
              </div>
            </div>

            {loading ? (
              <Loading />
            ) : products.length > 0 ? (
              <div className="products-grid">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="no-products">
                <p>No products found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
