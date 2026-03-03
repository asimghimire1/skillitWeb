import React, { useState, useEffect } from 'react';
import '../../css/auth.css';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiService } from '../../services/apiService';

const resetSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(resetSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!token) {
      setErrorMsg('Invalid or missing reset token. Please request a new password reset link.');
    }
  }, [token]);

  const onSubmit = async (data) => {
    if (!token) return;

    setIsLoading(true);
    setErrorMsg('');

    try {
      const result = await apiService.resetPassword(token, data.password);

      if (result.success) {
        setSuccess(true);
      } else {
        setErrorMsg(result.message || 'Failed to reset password. The link may have expired.');
      }
    } catch (error) {
      setErrorMsg('Network error. Please try again.');
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
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDVfkY6ymeI7zqzWfxBziyQD7YjcfL3ABY5_gu7sGmr7Osemo7GMqH21MGDFhQOMjRVPZ2GnqaKlQMF1gJNA4r_n884XhWV1r0hoPaF6XSsn-CC-YWLdDIpw73U7tA2xDTDsQsbvCj4opPMkUcWYeVo8bN6tmT-eJbX4AT5Rm54_zNNWRbA3_Xuw9xhJSn6_fkztPToEsSg1cCJ4HVzou1OERD_fDmNKBZKNF3PncBFOqnntcXtJjnQmPwiWqFeFvvmHef7CQr4lUz2")',
              }}
            ></div>
          </div>
        </div>
      </div>

      <div className="auth-content">
        <button onClick={() => navigate('/login')} className="back-btn">
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Login
        </button>
        <div className="auth-card">
          <div className="auth-header">
            <img
              src="http://localhost:5000/uploads/images/logo.png"
              alt="Skillit Logo"
              className="auth-logo"
            />
            <h1 className="brand-title">Reset Password</h1>
            <p className="brand-subtitle">
              {success ? 'Your password has been reset!' : 'Create a new password for your account'}
            </p>
          </div>

          {success ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 20px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: '32px' }}>
                  check_circle
                </span>
              </div>
              <p style={{ color: '#555', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
                Your password has been successfully reset. You can now log in with your new password.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="submit-btn"
                style={{ width: '100%' }}
              >
                Go to Login
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          ) : (
            <form className="auth-form-login" onSubmit={handleSubmit(onSubmit)}>
              {errorMsg && (
                <div className="error-message" style={{
                  color: '#dc3545',
                  marginBottom: '15px',
                  padding: '10px',
                  backgroundColor: '#f8d7da',
                  borderRadius: '4px',
                  textAlign: 'center',
                }}>
                  {errorMsg}
                </div>
              )}

              <div className="form-field">
                <label htmlFor="password">New Password</label>
                <div className="input-container password-input">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    placeholder="••••••••"
                    {...register('password')}
                    disabled={isLoading || !token}
                  />
                  <button
                    type="button"
                    className="visibility-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
                {errors.password && <span className="error-text">{errors.password.message}</span>}
              </div>

              <div className="form-field">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <div className="input-container password-input">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    id="confirmPassword"
                    placeholder="••••••••"
                    {...register('confirmPassword')}
                    disabled={isLoading || !token}
                  />
                  <button
                    type="button"
                    className="visibility-toggle"
                    onClick={() => setShowConfirm(!showConfirm)}
                    disabled={isLoading}
                  >
                    <span className="material-symbols-outlined">
                      {showConfirm ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword.message}</span>}
              </div>

              <button type="submit" className="submit-btn" disabled={isLoading || !token}>
                {isLoading ? 'Resetting...' : 'Reset Password'}
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </form>
          )}

          <p className="auth-footer">
            Remember your password? <Link to="/login" className="signup-link">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
