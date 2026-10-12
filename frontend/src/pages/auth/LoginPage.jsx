import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AlertMessage } from '../../components/common/Feedback';
import { IconEye, IconEyeOff } from '../../components/common/Icons';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userInfo = await login(email.trim(), password.trim());
      if (userInfo.role === 'ADMIN') navigate('/admin/dashboard');
      else if (userInfo.role === 'COORDINATOR') navigate('/coordinator/dashboard');
      else if (userInfo.role === 'TEAM_LEAD') navigate('/teamlead/dashboard');
      else navigate('/volunteer/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your email and password (default admin password is admin123).');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo-badge">EO</div>
          <h2 className="auth-title">Sign In to EventOps</h2>
          <p className="auth-subtitle">
            Smart Event Operations and Resource Management Platform
          </p>
        </div>

        <AlertMessage type="danger" message={error} onClose={() => setError('')} />

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="form-control"
              placeholder="user@eventops.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: '2.5rem' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted, #64748b)',
                  padding: 0
                }}
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>New user? </span>
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
