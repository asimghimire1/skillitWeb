import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const token = localStorage.getItem('authToken'); // match what Login saves
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
