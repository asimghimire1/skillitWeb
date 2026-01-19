import React, { useState } from 'react';
import '../../css/auth.css';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiService } from '../../services/apiService';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const onLogin = async (data) => {
    setIsLoading(true);
    setLoginError('');

    try {
      // Call backend API for login
      const result = await apiService.login(data.email, data.password);

      if (!result.success) {
        setLoginError(result.message || 'Invalid email or password');
        setIsLoading(false);
        return;
      }

      // Store token and user data in localStorage
      localStorage.setItem('authToken', result.token);
      localStorage.setItem('userEmail', result.user.email);
      localStorage.setItem('userName', result.user.fullname);
      localStorage.setItem('userRole', result.user.role);
      localStorage.setItem('userId', result.user.id);
      localStorage.setItem('user', JSON.stringify(result.user));

      // Redirect to appropriate dashboard based on role
      if (result.user.role === 'teacher' || result.user.role === 'mentor') {
        navigate('/private/Teacher');
      } else {
        navigate('/private/Home');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="background-grid">
        <div className="background-overlay"></div>
        <div className="grid-container">
          <div className="grid-column column-1">
            <div
              className="grid-image"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDVfkY6ymeI7zqzWfxBziyQD7YjcfL3ABY5_gu7sGmr7Osemo7GMqH21MGDFhQOMjRVPZ2GnqaKlQMF1gJNA4r_n884XhWV1r0hoPaF6XSsn-CC-YWLdDIpw73U7tA2xDTDsQsbvCj4opPMkUcWYeVo8bN6tmT-eJbX4AT5Rm54_zNNWRbA3_Xuw9xhJSn6_fkztPToEsSg1cCJ4HVzou1OERD_fDmNKBZKNF3PncBFOqnntcXtJjnQmPwiWqFeFvvmHef7CQr4lUz2")'
              }}
            ></div>
          </div>
        </div>
      </div>

      <div className="auth-content">
        <button onClick={() => navigate('/')} className="back-btn">
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Home
        </button>
        <div className="auth-card">
          <div className="auth-header">
            <img 
              src="http://localhost:5000/uploads/images/logo.png" 
              alt="Skillit Logo" 
              className="auth-logo"
            />
            <h1 className="brand-title">Skillit</h1>
            <p className="brand-subtitle">Log in to start swapping skills</p>
          </div>

          <form className="auth-form-login" onSubmit={handleSubmit(onLogin)}>
            {/* Login Error Message */}
            {loginError && (
              <div className="error-message" style={{ color: '#dc3545', marginBottom: '15px', padding: '10px', backgroundColor: '#f8d7da', borderRadius: '4px', textAlign: 'center' }}>
                {loginError}
              </div>
            )}

            {/* Email */}
            <div className="form-field">
              <label htmlFor="email">Email</label>
              <div className="input-container">
                <input
                  type="email"
                  id="email"
                  placeholder="user@example.com"
                  {...register('email')}
                  disabled={isLoading}
                />
              </div>
              {errors.email && <span className="error-text">{errors.email.message}</span>}
            </div>

            {/* Password */}
            <div className="form-field">
              <label htmlFor="password">Password</label>
              <div className="input-container password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="••••••••"
                  {...register('password')}
                  disabled={isLoading}
                />
                <button type="button" className="visibility-toggle" onClick={togglePasswordVisibility} disabled={isLoading}>
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
              {errors.password && <span className="error-text">{errors.password.message}</span>}
            </div>

            {/* Remember Me & Forgot */}
            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                />
                <div className="toggle-switch">
                  <div className="toggle-slider"></div>
                </div>
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-link hover-underline">Forgot password?</Link>
            </div>

            {/* Submit */}
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Log In'}
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>

          <p className="auth-footer">
            New to Skillit? <Link to="/register" className="signup-link">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
