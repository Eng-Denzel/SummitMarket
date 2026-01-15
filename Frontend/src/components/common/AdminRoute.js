import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loading from '../layout/Loading';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  // Check if user is authenticated and is staff
  if (!user) {
    return <Navigate to="/login" replace state={{ from: '/dashboard' }} />;
  }

  if (!user.is_staff) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
