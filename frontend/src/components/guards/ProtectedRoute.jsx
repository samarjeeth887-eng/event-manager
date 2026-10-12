import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../common/Feedback';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner text="Authenticating session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to their appropriate role home
    if (user?.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (user?.role === 'COORDINATOR') return <Navigate to="/coordinator/dashboard" replace />;
    if (user?.role === 'TEAM_LEAD') return <Navigate to="/teamlead/dashboard" replace />;
    return <Navigate to="/volunteer/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
