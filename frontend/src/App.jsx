import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './routes/privateRoute';
import PublicRoute from './routes/publicRoute';

const Home = lazy(() => import('./pages/private/Home.jsx'));
const Product = lazy(() => import('./pages/private/Product.jsx'));
const Teacher = lazy(() => import('./pages/private/Teacher.jsx'));
const Login = lazy(() => import('./pages/public/Login.jsx'));
const Register = lazy(() => import('./pages/public/Register.jsx'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Private Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/private/Home" element={<Product />} />
            <Route path="/private/Product" element={<Product />} />
            <Route path="/private/Teacher" element={<Teacher />} />
          </Route>

          {/* Catch All */}
          <Route path="*" element={<Home />} />

        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
