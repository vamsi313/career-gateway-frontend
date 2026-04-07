import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './SignIn.css';

function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    education: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const validateField = (name, value, currentFormData = formData) => {
    let errorMsg = '';
    
    switch (name) {
      case 'name':
        if (!value) errorMsg = 'Name is required';
        break;
      case 'email':
        if (!value) errorMsg = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(value)) errorMsg = 'Email format is invalid';
        break;
      case 'education':
        if (!value) errorMsg = 'Education is required';
        break;
      case 'password':
        if (!value) errorMsg = 'Password is required';
        else if (value.length < 6) errorMsg = 'Password must be at least 6 characters';
        break;
      case 'confirmPassword':
        if (!value) errorMsg = 'Please confirm password';
        else if (value !== currentFormData.password) errorMsg = 'Passwords do not match';
        break;
      default:
        break;
    }

    setErrors(prev => ({
      ...prev,
      [name]: errorMsg
    }));
    return errorMsg === '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      if (errors[name] || name === 'password' || name === 'confirmPassword') {
        // Automatically validate matching password fields if one changes
        if (name === 'password' && newData.confirmPassword) {
           validateField('confirmPassword', newData.confirmPassword, newData);
        }
        validateField(name, value, newData);
      }
      
      return newData;
    });
    
    setGlobalError('');
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value, formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError('');
    
    const isValid = ['name', 'email', 'education', 'password', 'confirmPassword'].every(
      field => validateField(field, formData[field], formData)
    );

    if (!isValid) {
      return;
    }

    setLoading(true);

    try {
      const result = await signUp(formData);
      
      if (result.success) {
        navigate('/assessments');
      } else {
        setGlobalError(result.error);
      }
    } catch (err) {
      setGlobalError('Connection error. Please ensure the server is running.');
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-container">
          <div className="auth-card">
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Start your career discovery journey today</p>

            {globalError && <div className="error-message">{globalError}</div>}

            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="John Doe"
                  className={errors.name ? 'input-error' : ''}
                />
                {errors.name && <span className="inline-error">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="your.email@example.com"
                  className={errors.email ? 'input-error' : ''}
                />
                {errors.email && <span className="inline-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 1234567890"
                />
              </div>

              <div className="form-group">
                <label htmlFor="education">Education Level *</label>
                <select
                  id="education"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.education ? 'input-error' : ''}
                >
                  <option value="">Select your education</option>
                  <option value="B.Tech">B.Tech</option>
                  <option value="M.Tech">M.Tech</option>
                  <option value="MBA">MBA</option>
                  <option value="BBA">BBA</option>
                  <option value="B.Sc">B.Sc</option>
                  <option value="M.Sc">M.Sc</option>
                  <option value="Other">Other</option>
                </select>
                {errors.education && <span className="inline-error">{errors.education}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="At least 6 characters"
                  className={errors.password ? 'input-error' : ''}
                />
                {errors.password && <span className="inline-error">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Re-enter password"
                  className={errors.confirmPassword ? 'input-error' : ''}
                />
                {errors.confirmPassword && <span className="inline-error">{errors.confirmPassword}</span>}
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-full"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>

            <div className="auth-footer">
              <p>Already have an account? <Link to="/signin" className="auth-link">Sign In</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;