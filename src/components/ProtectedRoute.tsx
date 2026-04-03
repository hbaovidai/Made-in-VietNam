import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('auth_token') !== null;
  const userRole = localStorage.getItem('user_role');

  if (!isAuthenticated) {
    // Redirect to login, but save the attempted URL so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Kiểm tra quyền truy cập Role-Based Access Control
  if (location.pathname.startsWith('/dashboard/buyer') && userRole === 'supplier') {
    return <Navigate to="/dashboard/supplier" replace />;
  }
  
  if (location.pathname.startsWith('/dashboard/supplier') && userRole === 'buyer') {
    return <Navigate to="/dashboard/buyer" replace />;
  }

  return <>{children}</>;
}
