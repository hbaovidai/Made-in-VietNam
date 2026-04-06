import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    // Redirect to login, but save the attempted URL so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-Based Access Control
  const userRole = user.role.toLowerCase(); // 'buyer' or 'supplier'

  if (location.pathname.startsWith('/dashboard/buyer') && userRole === 'supplier') {
    return <Navigate to="/dashboard/supplier" replace />;
  }
  
  if (location.pathname.startsWith('/dashboard/supplier') && userRole === 'buyer') {
    return <Navigate to="/dashboard/buyer" replace />;
  }

  return <>{children}</>;
}
