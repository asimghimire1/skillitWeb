import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './routes/privateRoute';
import PublicRoute from './routes/publicRoute';
import { AuthProvider } from './context/AuthContext';

const Home = lazy(() => import('./pages/private/Home.jsx'));
const Product = lazy(() => import('./pages/private/Product.jsx'));
const Teacher = lazy(() => import('./pages/private/Teacher.jsx'));
const Student = lazy(() => import('./pages/private/Student.jsx'));
const Login = lazy(() => import('./pages/public/Login.jsx'));
const Register = lazy(() => import('./pages/public/Register.jsx'));

import { ToastProvider } from './context/ToastContext';
import { ConfirmProvider } from './context/ConfirmContext';

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ea2a33]"></div>
      <p className="text-gray-600 text-sm">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <ToastProvider>
      <ConfirmProvider>
        <Router>
          <AuthProvider>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>

                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route element={<PublicRoute />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Route>

                {/* Private Routes - Dynamic username-based URLs */}
                <Route element={<PrivateRoute />}>
                  <Route path="/:username" element={<Teacher />} />
                  <Route path="/dashboard" element={<Product />} />
                </Route>

                {/* Catch All */}
                <Route path="*" element={<Home />} />

              </Routes>
            </Suspense>
          </AuthProvider>
        </Router>
      </ConfirmProvider>
    </ToastProvider>
  );
}

export default App;
