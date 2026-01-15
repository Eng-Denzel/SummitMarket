import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

const AdminLayout = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
    { path: '/dashboard/users', label: 'Users', icon: 'fa-users' },
    { path: '/dashboard/products', label: 'Products', icon: 'fa-box' },
    { path: '/dashboard/orders', label: 'Orders', icon: 'fa-shopping-cart' },
    { path: '/dashboard/categories', label: 'Categories', icon: 'fa-tags' },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>SummitMarket</h2>
          <p>Admin Panel</p>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <i className={`fas ${item.icon}`}></i>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <i className="fas fa-user-circle"></i>
            <div>
              <p className="user-name">{user?.username}</p>
              <p className="user-role">Administrator</p>
            </div>
          </div>
          <Link to="/" className="btn-back">
            <i className="fas fa-arrow-left"></i>
            Back to Store
          </Link>
          <button onClick={logout} className="btn-logout">
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
