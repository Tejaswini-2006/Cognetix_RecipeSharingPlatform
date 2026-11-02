import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ChefHat, Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AlertMessage from '../components/AlertMessage';
import './Auth.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect destination after login
  const from = location.state?.from?.pathname || '/recipes';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message || 'Invalid email or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-click Demo Login for Reviewers
  const handleDemoLogin = async () => {
    setEmail('tejaswini@recipehub.com');
    setPassword('password123');
    setError(null);
    setLoading(true);
    try {
      const res = await login('tejaswini@recipehub.com', 'password123');
      if (res.success) {
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error('Demo login error:', err);
      setError('Demo login failed. Please ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Brand Icon & Welcome */}
        <div className="auth-header">
          <div className="auth-brand-badge">
            <ChefHat size={28} />
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to your RecipeHub culinary account</p>
        </div>

        {/* Error Alert */}
        {error && (
          <AlertMessage
            type="error"
            message={error}
            onClose={() => setError(null)}
          />
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                id="email"
                type="email"
                className="form-input"
                style={{ paddingLeft: '42px' }}
                placeholder="chef@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div className="password-input-wrap">
              <div className="input-with-icon" style={{ width: '100%' }}>
                <Lock size={18} className="input-icon" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  style={{ paddingLeft: '42px', paddingRight: '44px' }}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '12px' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* 1-Click Demo Login Button for Evaluators */}
        <div className="demo-login-box">
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
            Internship Review Shortcut:
          </p>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            style={{ width: '100%', justifyContent: 'center', borderColor: 'var(--accent-orange)' }}
            onClick={handleDemoLogin}
            disabled={loading}
          >
            <Sparkles size={15} color="var(--accent-orange)" />
            <span>Login as Demo Chef (Tejaswini)</span>
          </button>
        </div>

        {/* Switch Link */}
        <div className="auth-footer">
          Don't have an account yet?{' '}
          <Link to="/register">Create an account</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
