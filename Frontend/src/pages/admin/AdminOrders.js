import React, { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus, deleteOrder } from '../../services/adminApi';
import { toast } from 'react-toastify';
import Loading from '../../components/layout/Loading';
import './AdminOrders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [searchTerm, filterStatus]);

  const fetchOrders = async () => {
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (filterStatus) params.status = filterStatus;

      const response = await getOrders(params);
      setOrders(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated successfully');
      fetchOrders();
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const handleDelete = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await deleteOrder(orderId);
        toast.success('Order deleted successfully');
        fetchOrders();
      } catch (error) {
        console.error('Error deleting order:', error);
        toast.error('Failed to delete order');
      }
    }
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  if (loading) return <Loading />;

  return (
    <div className="admin-orders">
      <div className="page-header">
        <h1>Order Management</h1>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All Status</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Total</th>
              <th>Status</th>
              <th>Items</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                <tr>
                  <td>#{order.id}</td>
                  <td>{order.user_username}</td>
                  <td>{order.user_email}</td>
                  <td>${parseFloat(order.total_amount).toFixed(2)}</td>
                  <td>
                    <select
                      className={`status-select ${order.status}`}
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{order.items?.length || 0}</td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-view"
                        onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                        title="View Details"
                      >
                        <i className={`fas fa-chevron-${selectedOrder?.id === order.id ? 'up' : 'down'}`}></i>
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(order.id)}
                        title="Delete Order"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                {selectedOrder?.id === order.id && (
                  <tr className="order-details-row">
                    <td colSpan="8">
                      <div className="order-details">
                        <div className="details-section">
                          <h3>Shipping Information</h3>
                          <p><strong>Address:</strong> {order.shipping_address}</p>
                          <p><strong>City:</strong> {order.city}</p>
                          <p><strong>Postal Code:</strong> {order.postal_code}</p>
                          <p><strong>Country:</strong> {order.country}</p>
                        </div>

                        <div className="details-section">
                          <h3>Order Items</h3>
                          <div className="order-items">
                            {order.items?.map((item) => (
                              <div key={item.id} className="order-item">
                                <div className="item-info">
                                  <span className="item-name">{item.product.name}</span>
                                  <span className="item-quantity">x{item.quantity}</span>
                                </div>
                                <span className="item-price">
                                  ${parseFloat(item.subtotal).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <div className="no-orders">
          <p>No orders found</p>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
