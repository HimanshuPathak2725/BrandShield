import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShieldAlt, FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import './AuthPage.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function AuthPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    company: '',
    agreeToTerms: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setError(''); // Clear error on input change
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting login to:', `${API_BASE_URL}/api/auth/login`);
      
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('isAuthenticated', 'true');
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      if (err.message === 'Failed to fetch') {
        setError('Cannot connect to server. Please make sure the API server is running on http://localhost:5000');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate terms agreement
    if (!formData.agreeToTerms) {
      setError('Please agree to the terms and conditions');
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting registration to:', `${API_BASE_URL}/api/auth/register`);
      
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          company: formData.company
        })
      });

      const data = await response.json();
      console.log('Registration response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('isAuthenticated', 'true');
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      if (err.message === 'Failed to fetch') {
        setError('Cannot connect to server. Please make sure the API server is running on http://localhost:5000');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setError('Google Sign-In will be implemented soon!');
  };

  return (
    <div className="auth-page">
      {/* Left Panel - Brand & Messaging */}
      <div className="auth-left-panel">
        {/* Background AI Visualization */}
        <div className="auth-bg-visualization">
          <div className="bg-blob blob-1"></div>
          <div className="bg-blob blob-2"></div>
          <div className="bg-grid"></div>
        </div>

        {/* Content */}
        <div className="auth-left-content">
          {/* Logo */}
          <div className="auth-logo">
            <div className="auth-logo-icon"><FaShieldAlt size={40} /></div>
            <h2 className="auth-logo-text">BrandShield</h2>
          </div>

          {/* Heading & Description */}
          <div className="auth-left-text">
            <p className="auth-brand-label">AI-Powered Public Reaction Intelligence</p>
            <h1 className="auth-left-title">Make Smarter Product Decisions with Real-Time Public Insight</h1>
            <p className="auth-left-description">
              Leverage predictive analytics to understand market sentiment before it shifts. Secure your brand's future with the world's most advanced AI intelligence platform.
            </p>
          </div>

          {/* Stats */}
          <div className="auth-stats">
            <div className="stat-item">
              <span className="stat-value">99.9%</span>
              <span className="stat-label">Accuracy</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value">500M+</span>
              <span className="stat-label">Data Points</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value">24/7</span>
              <span className="stat-label">Monitoring</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Card */}
      <div className="auth-right-panel">
        {/* Mobile Logo */}
        <div className="auth-logo-mobile">
          <div className="auth-logo-icon"><FaShieldAlt /></div>
          <h2 className="auth-logo-text">BrandShield</h2>
        </div>

        {/* Auth Card */}
        <div className="auth-card">
          {/* Tabs */}
          <div className="auth-tabs">
            <button
              className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button
              className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
              onClick={() => setActiveTab('signup')}
            >
              Sign Up
            </button>
          </div>

          {/* Login Form */}
          {activeTab === 'login' && (
            <div className="auth-form-wrapper">
              <div className="auth-form-header">
                <h2 className="auth-form-title">Welcome Back</h2>
                <p className="auth-form-subtitle">Please enter your credentials to access your dashboard.</p>
              </div>

              {error && (
                <div className="auth-error-message">
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="auth-form">
                {/* Email Input */}
                <div className="form-group">
                  <label className="form-label">Work Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                {/* Password Input */}
                <div className="form-group">
                  <div className="form-label-row">
                    <label className="form-label">Password</label>
                    <a href="#forgot" className="form-forgot-link">
                      Forgot password?
                    </a>
                  </div>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="form-checkbox">
                  <input
                    type="checkbox"
                    id="remember"
                    name="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="checkbox-input"
                  />
                  <label htmlFor="remember" className="checkbox-label">
                    Keep me logged in
                  </label>
                </div>

                {/* Submit Button */}
                <button type="submit" className="submit-btn" disabled={loading}>
                  <span>{loading ? 'Signing In...' : 'Sign In to Dashboard'}</span>
                  <span className="btn-arrow">→</span>
                </button>
              </form>

              {/* Divider */}
              <div className="form-divider">
                <div className="divider-line"></div>
                <span className="divider-text">Or continue with</span>
              </div>

              {/* Google Button */}
              <button onClick={handleGoogleSignIn} className="google-btn">
                <svg className="google-icon" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                </svg>
                <span>Sign in with Google</span>
              </button>
            </div>
          )}

          {/* Sign Up Form */}
          {activeTab === 'signup' && (
            <div className="auth-form-wrapper">
              <div className="auth-form-header">
                <h2 className="auth-form-title">Create Account</h2>
                <p className="auth-form-subtitle">Join BrandShield to access real-time market insights.</p>
              </div>

              {error && (
                <div className="auth-error-message">
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleSignUp} className="auth-form">
                {/* Name Input */}
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                {/* Company Input */}
                <div className="form-group">
                  <label className="form-label">Company</label>
                  <input
                    type="text"
                    name="company"
                    placeholder="Your Company Inc."
                    value={formData.company}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                {/* Email Input */}
                <div className="form-group">
                  <label className="form-label">Work Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                {/* Password Input */}
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '👁️' : '🚫'}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                {/* Terms & Conditions */}
                <div className="form-checkbox">
                  <input
                    type="checkbox"
                    id="terms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="checkbox-input"
                    required
                  />
                  <label htmlFor="terms" className="checkbox-label">
                    I agree to the Terms of Service and Privacy Policy
                  </label>
                </div>

                {/* Submit Button */}
                <button type="submit" className="submit-btn" disabled={loading}>
                  <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
                  <span className="btn-arrow">→</span>
                </button>
              </form>

              {/* Divider */}
              <div className="form-divider">
                <div className="divider-line"></div>
                <span className="divider-text">Or continue with</span>
              </div>

              {/* Google Button */}
              <button onClick={handleGoogleSignIn} className="google-btn">
                <svg className="google-icon" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                </svg>
                <span>Sign up with Google</span>
              </button>
            </div>
          )}

          {/* Trust Footer */}
          <div className="auth-trust-footer">
            <div className="trust-item">
              <span className="trust-icon"><FaLock /></span>
              <span className="trust-text">Secure authentication</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon"><FaShieldAlt /></span>
              <span className="trust-text">Data encrypted</span>
            </div>
          </div>
        </div>

        {/* Bottom Links */}
        <div className="auth-bottom-links">
          <a href="#privacy" className="bottom-link">Privacy Policy</a>
          <a href="#terms" className="bottom-link">Terms of Service</a>
          <a href="#support" className="bottom-link">Support</a>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
