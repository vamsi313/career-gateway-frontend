import React, { createContext, useState, useContext, useEffect } from 'react';
import { trackEvent } from '../utils/analytics';

const ADMIN_EMAIL = 'vamsiklu367@gmail.com';
const ADMIN_PASSWORD = 'Vamsi@126971';

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
    // Check if user is logged in (from localStorage)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signIn = (email, password) => {
    if (email === ADMIN_EMAIL) {
      trackEvent('sign_in_failed', { userEmail: email, reason: 'admin-portal-required' });
      return { success: false, error: 'Use Admin Sign In for administrator access' };
    }

    // Simulate sign in
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userWithoutPassword = { ...foundUser };
      delete userWithoutPassword.password;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      trackEvent('sign_in_success', { userEmail: email, role: userWithoutPassword.role || 'student' });
      return { success: true };
    }

    trackEvent('sign_in_failed', { userEmail: email, reason: 'invalid-credentials' });
    
    return { success: false, error: 'Invalid email or password' };
  };

  const signInAdmin = (email, password) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser = { email, name: 'Admin', role: 'admin' };
      setUser(adminUser);
      localStorage.setItem('user', JSON.stringify(adminUser));
      trackEvent('admin_sign_in_success', { userEmail: email, role: 'admin' });
      return { success: true };
    }

    trackEvent('admin_sign_in_failed', { userEmail: email || 'unknown', reason: 'invalid-admin-credentials' });
    return { success: false, error: 'Invalid admin credentials' };
  };

  const signUp = (userData) => {
    // Simulate sign up
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    if (users.find(u => u.email === userData.email)) {
      return { success: false, error: 'User already exists' };
    }
    
    // Add new user
    const newUser = {
      ...userData,
      role: 'student',
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login
    const userWithoutPassword = { ...newUser };
    delete userWithoutPassword.password;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    trackEvent('sign_up_success', { userEmail: newUser.email, role: 'student' });
    
    return { success: true };
  };

  const signOut = () => {
    trackEvent('sign_out', { userEmail: user?.email || 'guest', role: user?.role || 'unknown' });
    setUser(null);
    localStorage.removeItem('user');
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