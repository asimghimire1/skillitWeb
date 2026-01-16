import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PublicRoute = () => {
  const token = localStorage.getItem('authToken');
  const location = useLocation();

  // Allow access to login and register pages regardless of auth status
  // Redirect to / (landing) only for other public routes if already authenticated
  if (token && location.pathname !== '/login' && location.pathname !== '/register') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
