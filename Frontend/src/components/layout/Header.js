import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import './Header.css';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setSearchQuery('');
    }
  };

  const cartItemCount = getCartItemCount();

  return (
    <header className="header">
      <div className="header-container container">
        <Link to="/" className="logo">
          <h1>Summit<span>Market</span></h1>
        </Link>

        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">
            <FiSearch />
          </button>
        </form>

        <nav className="nav-desktop">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Products</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/cart" className="cart-link">
                <FiShoppingCart />
                {cartItemCount > 0 && (
                  <span className="cart-badge">{cartItemCount}</span>
                )}
              </Link>
              <div className="user-menu">
                <button className="user-button">
                  <FiUser />
                  <span>{user?.first_name || user?.username}</span>
                </button>
                <div className="user-dropdown">
                  <Link to="/account" className="dropdown-item">My Account</Link>
                  <Link to="/orders" className="dropdown-item">Orders</Link>
                  {user?.is_staff && (
                    <Link to="/admin" className="dropdown-item">Admin Dashboard</Link>
                  )}
                  <button onClick={handleLogout} className="dropdown-item">
                    <FiLogOut /> Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn-primary">Sign Up</Link>
            </>
          )}
        </nav>

        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link to="/" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link to="/products" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              Products
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                  Cart {cartItemCount > 0 && `(${cartItemCount})`}
                </Link>
                <Link to="/account" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                  My Account
                </Link>
                <Link to="/orders" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                  Orders
                </Link>
                <button onClick={handleLogout} className="mobile-nav-link">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                  Sign Up
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
