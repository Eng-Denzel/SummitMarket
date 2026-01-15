import React, { useState, useEffect } from 'react';
import { getProducts, deleteProduct, updateProductStock, getCategories } from '../../services/adminApi';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Loading from '../../components/layout/Loading';
import './AdminProducts.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStock, setFilterStock] = useState('all');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, filterCategory, filterStock]);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (filterCategory) params.category = filterCategory;
      if (filterStock !== 'all') params.stock_status = filterStock;

      const response = await getProducts(params);
      setProducts(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  const handleStockUpdate = async (productId, currentStock) => {
    const newStock = prompt('Enter new stock quantity:', currentStock);
    if (newStock !== null && !isNaN(newStock)) {
      try {
        await updateProductStock(productId, parseInt(newStock));
        toast.success('Stock updated successfully');
        fetchProducts();
      } catch (error) {
        console.error('Error updating stock:', error);
        toast.error('Failed to update stock');
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="admin-products">
      <div className="page-header">
        <h1>Product Management</h1>
        <Link to="/admin/products/new" className="btn-primary">
          <i className="fas fa-plus"></i> Add Product
        </Link>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select value={filterStock} onChange={(e) => setFilterStock(e.target.value)}>
            <option value="all">All Stock</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              {product.image ? (
                <img src={product.image} alt={product.name} />
              ) : (
                <div className="no-image">No Image</div>
              )}
              {product.stock < 10 && (
                <span className="stock-badge low">Low Stock</span>
              )}
              {product.stock === 0 && (
                <span className="stock-badge out">Out of Stock</span>
              )}
            </div>

            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="category">{product.category_name}</p>
              <div className="product-details">
                <div className="price">
                  <span className="label">Price:</span>
                  <span className="value">${parseFloat(product.price).toFixed(2)}</span>
                </div>
                {product.discount_percent > 0 && (
                  <div className="discount">
                    <span className="label">Discount:</span>
                    <span className="value">{product.discount_percent}%</span>
                  </div>
                )}
                <div className="stock">
                  <span className="label">Stock:</span>
                  <span className="value">{product.stock}</span>
                </div>
              </div>

              <div className="product-actions">
                <button
                  className="btn-edit"
                  onClick={() => handleStockUpdate(product.id, product.stock)}
                  title="Update Stock"
                >
                  <i className="fas fa-boxes"></i>
                </button>
                <Link
                  to={`/admin/products/edit/${product.id}`}
                  className="btn-edit"
                  title="Edit Product"
                >
                  <i className="fas fa-edit"></i>
                </Link>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(product.id)}
                  title="Delete Product"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="no-products">
          <p>No products found</p>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
