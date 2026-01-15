import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/api';
import { toast } from 'react-toastify';
import Button from '../components/common/Button';
import Loading from '../components/layout/Loading';
import './Checkout.css';

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  if (!cart || cart.items?.length === 0) {
    navigate('/cart');
    return null;
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const orderData = {
        shipping_address: data.address,
        city: data.city,
        postal_code: data.postal_code,
        country: data.country,
      };

      const order = await orderService.createOrder(orderData);
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/orders/${order.id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="checkout-title">Checkout</h1>

        <div className="checkout-layout">
          <motion.div
            className="checkout-form-section"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="checkout-step">
              <div className="step-header">
                <div className="step-number">
                  <FiCheck />
                </div>
                <h2>Shipping Information</h2>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="shipping-form">
                <div className="form-group">
                  <label htmlFor="address">Street Address *</label>
                  <input
                    id="address"
                    type="text"
                    placeholder="123 Main Street"
                    {...register('address', { required: 'Address is required' })}
                    className={errors.address ? 'input-error' : ''}
                  />
                  {errors.address && (
                    <span className="error-message">{errors.address.message}</span>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City *</label>
                    <input
                      id="city"
                      type="text"
                      placeholder="New York"
                      {...register('city', { required: 'City is required' })}
                      className={errors.city ? 'input-error' : ''}
                    />
                    {errors.city && (
                      <span className="error-message">{errors.city.message}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="postal_code">Postal Code *</label>
                    <input
                      id="postal_code"
                      type="text"
                      placeholder="10001"
                      {...register('postal_code', { required: 'Postal code is required' })}
                      className={errors.postal_code ? 'input-error' : ''}
                    />
                    {errors.postal_code && (
                      <span className="error-message">{errors.postal_code.message}</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="country">Country *</label>
                  <input
                    id="country"
                    type="text"
                    placeholder="United States"
                    {...register('country', { required: 'Country is required' })}
                    className={errors.country ? 'input-error' : ''}
                  />
                  {errors.country && (
                    <span className="error-message">{errors.country.message}</span>
                  )}
                </div>

                <Button type="submit" fullWidth size="large" loading={loading}>
                  Place Order
                </Button>
              </form>
            </div>
          </motion.div>

          <motion.div
            className="order-summary-section"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="order-summary">
              <h2>Order Summary</h2>

              <div className="summary-items">
                {cart.items.map((item) => (
                  <div key={item.id} className="summary-item">
                    <div className="summary-item-info">
                      <p className="summary-item-name">{item.product.name}</p>
                      <p className="summary-item-quantity">Qty: {item.quantity}</p>
                    </div>
                    <p className="summary-item-price">
                      ${parseFloat(item.subtotal).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>${parseFloat(cart.total_price).toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row summary-total">
                <span>Total</span>
                <span>${parseFloat(cart.total_price).toFixed(2)}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
