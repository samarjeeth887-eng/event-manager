import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AlertMessage } from '../../components/common/Feedback';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'VOLUNTEER',
    phone: '',
    department: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userInfo = await register(formData);
      if (userInfo.role === 'ADMIN') navigate('/admin/dashboard');
      else if (userInfo.role === 'COORDINATOR') navigate('/coordinator/dashboard');
      else if (userInfo.role === 'TEAM_LEAD') navigate('/teamlead/dashboard');
      else navigate('/volunteer/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check input fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ maxWidth: '520px' }}>
        <div className="auth-header">
          <div className="auth-logo-badge">EO</div>
          <h2 className="auth-title">Create EventOps Account</h2>
          <p className="auth-subtitle">
            Join as a coordinator, team lead, or volunteer
          </p>
        </div>

        <AlertMessage type="danger" message={error} onClose={() => setError('')} />

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-control"
              placeholder="e.g. Rohan Sharma"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              placeholder="name@eventops.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-control"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="role">
                User Role
              </label>
              <select
                id="role"
                name="role"
                className="form-control"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="VOLUNTEER">Volunteer</option>
                <option value="TEAM_LEAD">Team Lead</option>
                <option value="COORDINATOR">Event Coordinator</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="department">
                Department / Program
              </label>
              <input
                id="department"
                name="department"
                type="text"
                className="form-control"
                placeholder="e.g. Computer Science"
                value={formData.department}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="phone">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                className="form-control"
                placeholder="e.g. 9876543210"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.75rem' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Already registered? </span>
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
