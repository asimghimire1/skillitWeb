import React, { useState } from 'react';
import '../../css/auth.css';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { apiService } from '../../services/apiService';

const registerSchema = z.object({
  fullname: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['learner', 'mentor'])
});

const Register = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'learner' }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [registrationError, setRegistrationError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const role = watch('role');

  const handleRegistrationSubmit = async (data) => {
    setRegistrationError('');
    setIsLoading(true);

    try {
      // Register user via API with validated data
      const result = await apiService.register(
        data.email,
        data.fullname,
        data.password,
        data.role
      );

      if (result.success) {
        console.log('User registered:', result.user);
        // Redirect to login page
        navigate('/login');
      } else {
        setRegistrationError(result.message || 'Registration failed');
      }
    } catch (error) {
      setRegistrationError('An error occurred during registration');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
        <div className="auth-card">
          <div className="auth-header">
            <div className="logo-icon">
              <span className="material-symbols-outlined">handshake</span>
            </div>
            <h1 className="brand-title">Skillit</h1>
            <p className="brand-subtitle">Create your account</p>
          </div>

          <form className="auth-form-login" onSubmit={handleSubmit}>
            {/* Registration Error Message */}
            {registrationError && (
              <div className="error-message" style={{ color: '#dc3545', marginBottom: '15px', padding: '10px', backgroundColor: '#f8d7da', borderRadius: '4px', textAlign: 'center' }}>
                {registrationError}
              </div>
            )}

            {/* Full Name */}
            <div className="form-field">
              <label htmlFor="fullname">Full Name</label>
              <div className="input-container">
                <input
                  type="text"
                  id="fullname"
                  placeholder="e.g. John Doe"
                  {...register('fullname')}
                  disabled={isLoading}
                />
              </div>
              {errors.fullname && <span className="error-text">{errors.fullname.message}</span>}
            </div>

            {/* Role Selector */}
            <div className="form-field">
              <label>I want to...</label>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="radio"
                    value="learner"
                    {...register('role')}
                    disabled={isLoading}
                  />
                  Learn
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="radio"
                    value="mentor"
                    {...register('role')}
                    disabled={isLoading}
                  />
                  Teach
                </label>
              </div>
              {errors.role && <span className="error-text">{errors.role.message}</span>}
            </div>

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
                  minLength={8}
                />
                <button type="button" className="visibility-toggle" onClick={togglePasswordVisibility} disabled={isLoading}>
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
              {errors.password && <span className="error-text">{errors.password.message}</span>}
            </div>

            {/* Submit */}
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login" className="signup-link">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
