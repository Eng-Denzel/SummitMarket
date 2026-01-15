import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // Check if user is authenticated and is staff
  if (!user || !user.is_staff) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute;
