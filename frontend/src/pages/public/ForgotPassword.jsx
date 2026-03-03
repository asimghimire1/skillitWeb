import React, { useState, useRef, useEffect } from 'react';
import '../../css/auth.css';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/apiService';

const ForgotPassword = () => {
  const navigate = useNavigate();

  // Steps: 1 = email, 2 = otp, 3 = new password, 4 = success
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [previewUrl, setPreviewUrl] = useState('');

  const otpRefs = useRef([]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Auto-focus first OTP input when entering step 2
  useEffect(() => {
    if (step === 2 && otpRefs.current[0]) {
      otpRefs.current[0].focus();
    }
  }, [step]);

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await apiService.forgotPassword(email);
      if (result.success) {
        setStep(2);
        setCountdown(60);
        if (result.previewUrl) setPreviewUrl(result.previewUrl);
      } else {
        setErrorMsg(result.message || 'Something went wrong.');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setErrorMsg('');
    setOtp(['', '', '', '', '', '']);
    setPreviewUrl('');
    setIsLoading(true);
    try {
      const result = await apiService.forgotPassword(email);
      if (result.success) {
        setCountdown(60);
        if (result.previewUrl) setPreviewUrl(result.previewUrl);
      } else {
        setErrorMsg(result.message || 'Failed to resend OTP.');
      }
    } catch {
      setErrorMsg('Network error.');
    } finally {
      setIsLoading(false);
    }
  };

  // OTP input handlers
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length === 6) {
      setOtp(pastedData.split(''));
      otpRefs.current[5]?.focus();
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const otpString = otp.join('');

    if (otpString.length !== 6) {
      setErrorMsg('Please enter the complete 6-digit code.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await apiService.verifyOtp(email, otpString);
      if (result.success) {
        setStep(3);
      } else {
        setErrorMsg(result.message || 'Invalid OTP.');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const otpString = otp.join('');
      const result = await apiService.resetPassword(email, otpString, password);
      if (result.success) {
        setStep(4);
      } else {
        setErrorMsg(result.message || 'Failed to reset password.');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const stepTitles = {
    1: 'Forgot Password',
    2: 'Enter Code',
    3: 'New Password',
    4: 'All Done!',
  };

  const stepSubtitles = {
    1: "Enter your email and we'll send you a verification code",
    2: `We sent a 6-digit code to ${email}`,
    3: 'Create a new password for your account',
    4: 'Your password has been reset successfully',
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
        <button onClick={() => step === 1 ? navigate('/login') : setStep(step - 1)} className="back-btn">
          <span className="material-symbols-outlined">arrow_back</span>
          {step === 1 ? 'Back to Login' : 'Back'}
        </button>
        <div className="auth-card">
          <div className="auth-header">
            <img
              src="http://localhost:5000/uploads/images/logo.png"
              alt="Skillit Logo"
              className="auth-logo"
            />
            <h1 className="brand-title">{stepTitles[step]}</h1>
            <p className="brand-subtitle">{stepSubtitles[step]}</p>
          </div>

          {/* Progress indicator */}
          {step < 4 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  style={{
                    width: s === step ? '32px' : '10px',
                    height: '10px',
                    borderRadius: '5px',
                    background: s <= step ? 'linear-gradient(135deg, #ea2a33, #ff4d55)' : '#e5e7eb',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </div>
          )}

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

          {/* Step 1: Email */}
          {step === 1 && (
            <form className="auth-form-login" onSubmit={handleSendOtp}>
              <div className="form-field">
                <label htmlFor="email">Email Address</label>
                <div className="input-container">
                  <input
                    type="email"
                    id="email"
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Verification Code'}
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </form>
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <form className="auth-form-login" onSubmit={handleVerifyOtp}>
              {previewUrl && (
                <div style={{
                  background: '#f0fdf4',
                  border: '1px solid #86efac',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  marginBottom: '20px',
                  fontSize: '13px',
                  color: '#166534',
                }}>
                  <strong>Dev Mode:</strong> View the email at{' '}
                  <a href={previewUrl} target="_blank" rel="noreferrer" style={{ color: '#ea2a33', fontWeight: 600 }}>
                    Ethereal Inbox
                  </a>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '24px' }}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={index === 0 ? handleOtpPaste : undefined}
                    disabled={isLoading}
                    style={{
                      width: '50px',
                      height: '58px',
                      textAlign: 'center',
                      fontSize: '24px',
                      fontWeight: '700',
                      border: digit ? '2px solid #ea2a33' : '2px solid #e5e7eb',
                      borderRadius: '12px',
                      outline: 'none',
                      transition: 'all 0.2s',
                      background: digit ? '#fef2f2' : '#fff',
                      color: '#1b0e0e',
                      fontFamily: "'Courier New', monospace",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#ea2a33'; e.target.style.boxShadow = '0 0 0 3px rgba(234,42,51,0.1)'; }}
                    onBlur={(e) => { e.target.style.borderColor = digit ? '#ea2a33' : '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                  />
                ))}
              </div>
              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify Code'}
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                {countdown > 0 ? (
                  <span style={{ color: '#9ca3af', fontSize: '14px' }}>
                    Resend code in <strong style={{ color: '#ea2a33' }}>{countdown}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ea2a33',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '14px',
                      textDecoration: 'underline',
                    }}
                  >
                    Resend Code
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <form className="auth-form-login" onSubmit={handleResetPassword}>
              <div className="form-field">
                <label htmlFor="password">New Password</label>
                <div className="input-container password-input">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <button type="button" className="visibility-toggle" onClick={() => setShowPassword(!showPassword)}>
                    <span className="material-symbols-outlined">
                      {showPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-container password-input">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    id="confirmPassword"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <button type="button" className="visibility-toggle" onClick={() => setShowConfirm(!showConfirm)}>
                    <span className="material-symbols-outlined">
                      {showConfirm ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
              </div>
              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? 'Resetting...' : 'Reset Password'}
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </form>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
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
          )}

          <p className="auth-footer">
            Remember your password? <Link to="/login" className="signup-link">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
