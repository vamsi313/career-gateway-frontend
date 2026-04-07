import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './SignIn.css';

const generateCaptcha = () => {
  const firstNumber = Math.floor(Math.random() * 10) + 1;
  const secondNumber = Math.floor(Math.random() * 10) + 1;
  return {
    question: `${firstNumber} + ${secondNumber}`,
    answer: firstNumber + secondNumber
  };
};

function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [captcha, setCaptcha] = useState(() => generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState('');
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let errorMsg = '';
    if (name === 'email') {
      if (!value) {
        errorMsg = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        errorMsg = 'Email format is invalid';
      }
    }
    if (name === 'password') {
      if (!value) errorMsg = 'Password is required';
    }
    if (name === 'captcha') {
      if (!value) {
        errorMsg = 'Captcha is required';
      } else if (Number(value) !== captcha.answer) {
        errorMsg = 'Incorrect CAPTCHA';
      }
    }

    setErrors(prev => ({
      ...prev,
      [name]: errorMsg
    }));
    return errorMsg === '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'captcha') {
      setCaptchaInput(value);
      validateField('captcha', value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      if (errors[name]) {
        validateField(name, value);
      }
    }
    setGlobalError('');
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError('');
    
    const isEmailValid = validateField('email', formData.email);
    const isPasswordValid = validateField('password', formData.password);
    const isCaptchaValid = validateField('captcha', captchaInput);

    if (!isEmailValid || !isPasswordValid || !isCaptchaValid) {
      return;
    }

    setLoading(true);

    try {
      const result = await signIn(formData.email, formData.password);
      
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
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to continue your career journey</p>

            {globalError && <div className="error-message">{globalError}</div>}

            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
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
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your password"
                  className={errors.password ? 'input-error' : ''}
                />
                {errors.password && <span className="inline-error">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="captcha">Security Verification *</label>
                <div className="captcha-box">
                  <span className="captcha-question">Solve: {captcha.question}</span>
                  <button
                    type="button"
                    className="captcha-refresh"
                    onClick={() => {
                      setCaptcha(generateCaptcha());
                      setCaptchaInput('');
                      setErrors(prev => ({...prev, captcha: ''}));
                      setGlobalError('');
                    }}
                  >
                    ↻ Refresh
                  </button>
                </div>
                <input
                  type="number"
                  id="captcha"
                  name="captcha"
                  value={captchaInput}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter the answer"
                  className={errors.captcha ? 'input-error' : ''}
                />
                {errors.captcha && <span className="inline-error">{errors.captcha}</span>}
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-full"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="auth-footer">
              <p>Don't have an account? <Link to="/signup" className="auth-link">Sign Up</Link></p>
            </div>

            <div className="demo-credentials">
              <p className="demo-title">Demo Credentials:</p>
              <p>Create a new student account to access assessments</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;