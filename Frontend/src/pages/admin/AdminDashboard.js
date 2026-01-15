import React, { useState, useEffect } from 'react';
import { getDashboardStats, getSalesReport } from '../../services/adminApi';
import { toast } from 'react-toastify';
import Loading from '../../components/layout/Loading';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [salesReport, setSalesReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchSalesReport();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const fetchSalesReport = async () => {
    try {
      setReportLoading(true);
      const response = await getSalesReport();
      setSalesReport(response.data);
    } catch (error) {
      console.error('Error fetching sales report:', error);
      toast.error('Failed to load sales report');
    } finally {
      setReportLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome to the SummitMarket Admin Panel</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon users">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-content">
            <h3>{stats?.total_users || 0}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon products">
            <i className="fas fa-box"></i>
          </div>
          <div className="stat-content">
            <h3>{stats?.total_products || 0}</h3>
            <p>Total Products</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orders">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <div className="stat-content">
            <h3>{stats?.total_orders || 0}</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon revenue">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="stat-content">
            <h3>${parseFloat(stats?.total_revenue || 0).toFixed(2)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon pending">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-content">
            <h3>{stats?.pending_orders || 0}</h3>
            <p>Pending Orders</p>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon stock">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="stat-content">
            <h3>{stats?.low_stock_products || 0}</h3>
            <p>Low Stock Products</p>
          </div>
        </div>
      </div>

      {salesReport && (
        <div className="sales-analytics">
          <div className="analytics-header">
            <h2>Sales Analytics</h2>
            <button onClick={fetchSalesReport} disabled={reportLoading}>
              {reportLoading ? 'Refreshing...' : 'Refresh Report'}
            </button>
          </div>

          <div className="analytics-grid">
            <div className="analytics-card">
              <h3>Revenue Overview</h3>
              <div className="metric">
                <span className="metric-label">Total Revenue</span>
                <span className="metric-value">${parseFloat(salesReport.total_revenue || 0).toFixed(2)}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Total Orders</span>
                <span className="metric-value">{salesReport.total_orders || 0}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Avg. Order Value</span>
                <span className="metric-value">${parseFloat(salesReport.avg_order_value || 0).toFixed(2)}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Period</span>
                <span className="metric-value">
                  {formatDate(salesReport.date_range?.start)} - {formatDate(salesReport.date_range?.end)}
                </span>
              </div>
            </div>

            <div className="analytics-card">
              <h3>Top Selling Products</h3>
              {salesReport.top_products && salesReport.top_products.length > 0 ? (
                <div className="top-products-list">
                  {salesReport.top_products.map((product, index) => (
                    <div key={index} className="product-item">
                      <span className="product-name">{product.product__name}</span>
                      <span className="product-quantity">Qty: {product.total_quantity}</span>
                      <span className="product-revenue">${parseFloat(product.total_revenue || 0).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No product data available</p>
              )}
            </div>
          </div>

          <div className="analytics-card full-width">
            <h3>Order Status Distribution</h3>
            {salesReport.orders_by_status && salesReport.orders_by_status.length > 0 ? (
              <div className="status-distribution">
                {salesReport.orders_by_status.map((status, index) => (
                  <div key={index} className="status-item">
                    <span className="status-name">{status.status}</span>
                    <span className="status-count">{status.count}</span>
                    <div className="status-bar">
                      <div 
                        className="status-bar-fill"
                        style={{
                          width: `${(status.count / salesReport.total_orders) * 100}%`,
                          backgroundColor: getStatusColor(status.status)
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No order status data available</p>
            )}
          </div>
        </div>
      )}

      <div className="recent-orders">
        <h2>Recent Orders</h2>
        <div className="orders-table">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recent_orders?.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.user_username}</td>
                  <td>${parseFloat(order.total_amount).toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${order.payment_status}`}>
                      {order.payment_status}
                    </span>
                  </td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  const colors = {
    pending: '#ffc107',
    processing: '#17a2b8',
    shipped: '#007bff',
    delivered: '#28a745',
    cancelled: '#dc3545'
  };
  return colors[status] || '#6c757d';
};

export default AdminDashboard;
