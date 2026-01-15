import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiMapPin, FiPackage } from 'react-icons/fi';
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
          <span className={`order-status-badge ${getStatusClass(order.status)}`}>
            {getStatusLabel(order.status)}
          </span>
        </motion.div>

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
