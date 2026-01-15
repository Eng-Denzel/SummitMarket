import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiMapPin, FiPackage, FiCreditCard, FiTruck } from 'react-icons/fi';
import { orderService } from '../services/api';
import Loading from '../components/layout/Loading';
import './OrderDetail.css';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL?.replace('/api', '') || 'http://localhost:8000';

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const orders = await orderService.getOrders();
      const foundOrder = orders.find(o => o.id === parseInt(id));
      setOrder(foundOrder);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    const statusClasses = {
      pending: 'status-pending',
      processing: 'status-processing',
      shipped: 'status-shipped',
      delivered: 'status-delivered',
      cancelled: 'status-cancelled',
    };
    return statusClasses[status] || 'status-pending';
  };

  const getStatusLabel = (status) => {
    const statusLabels = {
      pending: 'Pending',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    };
    return statusLabels[status] || status;
  };

  const getPaymentStatusClass = (status) => {
    const statusClasses = {
      pending: 'payment-pending',
      completed: 'payment-completed',
      failed: 'payment-failed',
      refunded: 'payment-refunded',
    };
    return statusClasses[status] || 'payment-pending';
  };

  const getPaymentStatusLabel = (status) => {
    const statusLabels = {
      pending: 'Pending',
      completed: 'Completed',
      failed: 'Failed',
      refunded: 'Refunded',
    };
    return statusLabels[status] || status;
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  if (!order) {
    return (
      <div className="order-detail-page">
        <div className="container">
          <p>Order not found</p>
          <Link to="/orders">Back to Orders</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="order-detail-page">
      <div className="container">
        <Link to="/orders" className="back-link">
          <FiArrowLeft /> Back to Orders
        </Link>

        <motion.div
          className="order-detail-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="order-title-section">
            <h1>Order #{order.id}</h1>
            <p className="order-date">
              Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <div className="order-statuses">
            <span className={`order-status-badge ${getStatusClass(order.status)}`}>
              {getStatusLabel(order.status)}
            </span>
            <span className={`order-status-badge ${getPaymentStatusClass(order.payment_status)}`}>
              {getPaymentStatusLabel(order.payment_status)}
            </span>
          </div>
        </motion.div>

        {/* Order Tracking Progress */}
        <div className="tracking-progress">
          <h2><FiTruck /> Order Tracking</h2>
          <div className="progress-steps">
            <div className={`step ${order.status !== 'pending' ? 'completed' : ''}`}>
              <div className="step-icon">1</div>
              <div className="step-label">Order Placed</div>
              {order.status !== 'pending' && (
                <div className="step-date">
                  {new Date(order.created_at).toLocaleDateString()}
                </div>
              )}
            </div>
            <div className={`step ${['processing', 'shipped', 'delivered'].includes(order.status) ? 'completed' : ''}`}>
              <div className="step-icon">2</div>
              <div className="step-label">Processing</div>
              {order.status === 'processing' && (
                <div className="step-date">
                  {new Date(order.updated_at).toLocaleDateString()}
                </div>
              )}
            </div>
            <div className={`step ${['shipped', 'delivered'].includes(order.status) ? 'completed' : ''}`}>
              <div className="step-icon">3</div>
              <div className="step-label">Shipped</div>
              {order.status === 'shipped' && order.shipped_date && (
                <div className="step-date">
                  {new Date(order.shipped_date).toLocaleDateString()}
                </div>
              )}
            </div>
            <div className={`step ${order.status === 'delivered' ? 'completed' : ''}`}>
              <div className="step-icon">4</div>
              <div className="step-label">Delivered</div>
              {order.status === 'delivered' && (
                <div className="step-date">
                  {new Date(order.updated_at).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
          
          {order.tracking_number && (
            <div className="tracking-info">
              <p><strong>Tracking Number:</strong> {order.tracking_number}</p>
              {order.estimated_delivery_date && (
                <p><strong>Estimated Delivery:</strong> {new Date(order.estimated_delivery_date).toLocaleDateString()}</p>
              )}
            </div>
          )}
        </div>

        <div className="order-detail-layout">
          <motion.div
            className="order-items-section"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2><FiPackage /> Order Items</h2>
            <div className="order-items-list">
              {order.items.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="order-item-image">
                    <img
                      src={item.product.image ? `${API_BASE_URL}${item.product.image}` : '/placeholder-product.png'}
                      alt={item.product.name}
                    />
                  </div>
                  <div className="order-item-details">
                    <h3>{item.product.name}</h3>
                    <p className="order-item-category">{item.product.category_name}</p>
                    <p className="order-item-quantity">Quantity: {item.quantity}</p>
                  </div>
                  <div className="order-item-price">
                    <p className="unit-price">${parseFloat(item.price).toFixed(2)} each</p>
                    <p className="item-total">${parseFloat(item.subtotal).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="order-info-section"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="info-card">
              <h2><FiMapPin /> Shipping Address</h2>
              <div className="address-details">
                <p>{order.shipping_address}</p>
                <p>{order.city}, {order.postal_code}</p>
                <p>{order.country}</p>
              </div>
            </div>

            <div className="info-card">
              <h2><FiCreditCard /> Payment Information</h2>
              <div className="payment-details">
                <div className="payment-row">
                  <span>Payment Method</span>
                  <span>{order.payment_method || 'Not specified'}</span>
                </div>
                <div className="payment-row">
                  <span>Payment Status</span>
                  <span className={`payment-status ${getPaymentStatusClass(order.payment_status)}`}>
                    {getPaymentStatusLabel(order.payment_status)}
                  </span>
                </div>
                {order.payment_transaction_id && (
                  <div className="payment-row">
                    <span>Transaction ID</span>
                    <span>{order.payment_transaction_id}</span>
                  </div>
                )}
                {order.payment_date && (
                  <div className="payment-row">
                    <span>Payment Date</span>
                    <span>{new Date(order.payment_date).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="info-card">
              <h2>Order Summary</h2>
              <div className="summary-details">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${parseFloat(order.total_amount).toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row summary-total">
                  <span>Total</span>
                  <span>${parseFloat(order.total_amount).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
