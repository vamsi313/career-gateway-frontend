import React, { createContext, useState, useContext, useEffect } from 'react';
import { trackEvent } from '../utils/analytics';
import { apiCall } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (from localStorage as session memory)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (email, password) => {
    try {
      const response = await apiCall('/auth/signin', {
        method: 'POST',
        body: { email, password }
      });

      if (response.success && response.data) {
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        trackEvent('sign_in_success', { userEmail: email, role: response.data.role || 'student' });
        return { success: true };
      } else {
        trackEvent('sign_in_failed', { userEmail: email, reason: response.error });
        return { success: false, error: response.error };
      }
    } catch (error) {
      trackEvent('sign_in_failed', { userEmail: email, reason: 'network-error' });
      return { success: false, error: error.message || 'Connection error' };
    }
  };

  const signInAdmin = async (email, password) => {
    try {
      const response = await apiCall('/auth/admin-signin', {
        method: 'POST',
        body: { email, password }
      });

      if (response.success && response.data) {
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        trackEvent('admin_sign_in_success', { userEmail: email, role: 'admin' });
        return { success: true };
      } else {
        trackEvent('admin_sign_in_failed', { userEmail: email, reason: response.error });
        return { success: false, error: response.error };
      }
    } catch (error) {
      trackEvent('admin_sign_in_failed', { userEmail: email, reason: 'network-error' });
      return { success: false, error: error.message || 'Connection error' };
    }
  };

  const signUp = async (userData) => {
    try {
      const response = await apiCall('/auth/signup', {
        method: 'POST',
        body: {
          name: userData.name,
          email: userData.email,
          password: userData.password
        }
      });

      if (response.success && response.data) {
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        trackEvent('sign_up_success', { userEmail: userData.email, role: 'student' });
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return { success: false, error: error.message || 'Connection error' };
    }
  };

  const signOut = () => {
    trackEvent('sign_out', { userEmail: user?.email || 'guest', role: user?.role || 'unknown' });
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const value = {
    user,
    signIn,
    signInAdmin,
    signUp,
    signOut,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};