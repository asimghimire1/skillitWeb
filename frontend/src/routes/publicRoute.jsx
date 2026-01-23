import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ea2a33]"></div>
      </div>
    );
  }

  // If authenticated and trying to access login/register, redirect to appropriate dashboard
  if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/register')) {
    // Get redirect destination from state or default based on role
    const from = location.state?.from?.pathname;
    
    if (from) {
      return <Navigate to={from} replace />;
    }
    
    // Generate username URL from full name
    const getUsernameUrl = (userData) => {
      const fullname = userData?.fullname || userData?.fullName || '';
      return '/' + fullname.toLowerCase().replace(/\s+/g, '');
    };
    
    // Redirect based on user role
    if (user?.role === 'teacher' || user?.role === 'mentor') {
      return <Navigate to={getUsernameUrl(user)} replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
