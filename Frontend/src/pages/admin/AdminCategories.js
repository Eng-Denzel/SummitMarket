import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/adminApi';
import { toast } from 'react-toastify';
import Loading from '../../components/layout/Loading';
import './AdminCategories.css';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null,
  });
  
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error('Category name is required');
      return;
    }

    setSubmitting(true);
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      if (formData.description) {
        submitData.append('description', formData.description);
      }
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      if (editingCategory) {
        await updateCategory(editingCategory.id, submitData);
        toast.success('Category updated successfully');
      } else {
        await createCategory(submitData);
        toast.success('Category created successfully');
      }
      
      // Reset form
      resetForm();
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error(error.response?.data?.message || 'Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      image: null,
    });
    
    if (category.image) {
      // Handle image URL properly
      const imageUrl = category.image.startsWith('http')
        ? category.image
        : `${process.env.REACT_APP_API_BASE_URL?.replace('/api', '') || 'http://localhost:8000'}${category.image}`;
      setImagePreview(imageUrl);
    } else {
      setImagePreview(null);
    }
    
    setShowForm(true);
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category? All products in this category will be affected.')) {
      try {
        await deleteCategory(categoryId);
        toast.success('Category deleted successfully');
        fetchCategories();
        
        // If we were editing this category, reset the form
        if (editingCategory && editingCategory.id === categoryId) {
          resetForm();
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('Failed to delete category');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image: null,
    });
    setImagePreview(null);
    setEditingCategory(null);
    setShowForm(false);
  };

  if (loading) return <Loading />;

  return (
    <div className="admin-categories">
      <div className="page-header">
        <h1>Category Management</h1>
        <button 
          className="btn-primary" 
          onClick={() => setShowForm(true)}
        >
          <i className="fas fa-plus"></i> Add Category
        </button>
      </div>

      {showForm ? (
        <div className="category-form-container">
          <div className="form-header">
            <h2>{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
            <button className="btn-secondary" onClick={resetForm}>
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="category-form">
            <div className="form-group">
              <label htmlFor="name">Category Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter category name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                placeholder="Enter category description"
              />
            </div>

            <div className="form-group">
              <label htmlFor="image">Category Image</label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
              />
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={resetForm}
                disabled={submitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Saving...' : (editingCategory ? 'Update Category' : 'Create Category')}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="filters-section">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="categories-grid">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <div key={category.id} className="category-card">
                  <div className="category-image">
                    {category.image ? (
                      <img
                        src={category.image.startsWith('http') ? category.image : `${process.env.REACT_APP_API_BASE_URL?.replace('/api', '') || 'http://localhost:8000'}${category.image}`}
                        alt={category.name}
                      />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </div>

                  <div className="category-info">
                    <h3>{category.name}</h3>
                    <p className="description">{category.description || 'No description'}</p>
                    <div className="category-stats">
                      <span className="product-count">{category.product_count || 0} products</span>
                    </div>
                  </div>

                  <div className="category-actions">
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(category)}
                      title="Edit Category"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(category.id)}
                      title="Delete Category"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-categories">
                <p>No categories found</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminCategories;