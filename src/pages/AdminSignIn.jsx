import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './SignIn.css';

const MAX_ADMIN_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000;

const generateCaptcha = () => {
  const firstNumber = Math.floor(Math.random() * 10) + 1;
  const secondNumber = Math.floor(Math.random() * 10) + 1;
  return {
    question: `${firstNumber} + ${secondNumber}`,
    answer: firstNumber + secondNumber
  };
};

const getLockoutData = () => {
  const failedAttempts = Number(localStorage.getItem('adminFailedAttempts') || 0);
  const lockoutUntil = Number(localStorage.getItem('adminLockoutUntil') || 0);
  return { failedAttempts, lockoutUntil };
};

function AdminSignIn() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [captcha, setCaptcha] = useState(() => generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signInAdmin } = useAuth();
  const navigate = useNavigate();

  const lockoutInfo = getLockoutData();

  const remainingLockout = Math.max(0, lockoutInfo.lockoutUntil - Date.now());

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
    setError('');
  };

  const handleFailedAttempt = () => {
    const nextAttempts = lockoutInfo.failedAttempts + 1;
    localStorage.setItem('adminFailedAttempts', String(nextAttempts));

    if (nextAttempts >= MAX_ADMIN_ATTEMPTS) {
      const lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
      localStorage.setItem('adminLockoutUntil', String(lockoutUntil));
      setError('Too many failed attempts. Try again in 5 minutes.');
      return;
    }

    setError(`Invalid credentials. Attempts left: ${MAX_ADMIN_ATTEMPTS - nextAttempts}`);
  };

  const handleSuccessfulLogin = () => {
    localStorage.removeItem('adminFailedAttempts');
    localStorage.removeItem('adminLockoutUntil');
    navigate('/admin');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    if (remainingLockout > 0) {
      setError(`Admin login is temporarily locked. Try again in ${Math.ceil(remainingLockout / 60000)} minute(s).`);
      setLoading(false);
      return;
    }

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (Number(captchaInput) !== captcha.answer) {
      setError('CAPTCHA verification failed. Please try again.');
      setCaptcha(generateCaptcha());
      setCaptchaInput('');
      setLoading(false);
      return;
    }

    const result = signInAdmin(formData.email, formData.password);

    if (result.success) {
      handleSuccessfulLogin();
    } else {
      handleFailedAttempt();
      setCaptcha(generateCaptcha());
      setCaptchaInput('');
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-container">
          <div className="auth-card">
            <h1 className="auth-title">Admin Sign In</h1>
            <p className="auth-subtitle">Secure access to admin controls and analytics</p>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Admin Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Admin Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter admin password"
                  required
                />
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
                      setError('');
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
                  onChange={(event) => {
                    setCaptchaInput(event.target.value);
                    setError('');
                  }}
                  placeholder="Enter the answer"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Access Admin Panel'}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Student account? <Link to="/signin" className="auth-link">Go to Student Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSignIn;
