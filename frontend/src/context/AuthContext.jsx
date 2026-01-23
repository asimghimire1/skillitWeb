import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiService } from '../services/apiService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Logout function - defined first so it can be used in other functions
  const logout = useCallback(() => {
    // Clear all auth data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
    
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(false);
    
    // Navigate to login with replace to prevent going back
    navigate('/login', { replace: true });
  }, [navigate]);

  // Validate token with backend
  const validateToken = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      return false;
    }

    try {
      const result = await apiService.getCurrentUser();
      
      if (result.success && result.user) {
        setUser(result.user);
        setIsAuthenticated(true);
        // Update local storage with fresh user data
        localStorage.setItem('user', JSON.stringify(result.user));
        setIsLoading(false);
        return true;
      } else {
        // Token is invalid - clear everything
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        // Clear localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        localStorage.removeItem('user');
        return false;
      }
    } catch (error) {
      console.error('Token validation error:', error);
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      return false;
    }
  }, []);

  // Login function
  const login = useCallback(async (email, password) => {
    try {
      const result = await apiService.login(email, password);
      
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        return { success: true, user: result.user };
      }
      
      return { success: false, message: result.message || 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  }, []);

  // Check auth on mount
  useEffect(() => {
    validateToken();
  }, [validateToken]);

  // Listen for localStorage changes (handles manual token edits and cross-tab logout)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'authToken') {
        if (!e.newValue) {
          // Token was removed
          setUser(null);
          setIsAuthenticated(false);
          navigate('/login', { replace: true });
        } else if (e.newValue !== e.oldValue) {
          // Token was changed - validate it
          validateToken();
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [navigate, validateToken]);

  // Listen for unauthorized events from apiService
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setIsAuthenticated(false);
      navigate('/login', { replace: true });
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [navigate]);

  // Periodic token validation (every 30 seconds)
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        logout();
      } else {
        validateToken();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated, validateToken, logout]);

  // Check token on focus (when user switches back to tab)
  useEffect(() => {
    const handleFocus = () => {
      const token = localStorage.getItem('authToken');
      if (isAuthenticated && !token) {
        logout();
      } else if (token) {
        validateToken();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [isAuthenticated, validateToken, logout]);

  // Check token on visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const token = localStorage.getItem('authToken');
        if (isAuthenticated && !token) {
          logout();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isAuthenticated, logout]);

  // Check token immediately when it might have been modified
  useEffect(() => {
    // This runs on every render when authenticated to catch token edits
    if (isAuthenticated) {
      const token = localStorage.getItem('authToken');
      if (!token) {
        logout();
      }
    }
  });

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    validateToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
