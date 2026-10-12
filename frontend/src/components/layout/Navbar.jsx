import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { IconLogOut } from '../common/Icons';

export const Navbar = ({ title = 'EventOps Platform' }) => {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <h1 className="navbar-title">{title}</h1>
      <div className="navbar-actions">
        <div className="system-status-indicator" title="Connected to Java Spring Boot & MySQL">
          Connected
        </div>
        {user?.role && <span className="role-pill">{user.role.replace('_', ' ')}</span>}
        <button
          className="btn btn-secondary btn-sm"
          onClick={logout}
          title="Sign out of EventOps"
        >
          <IconLogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
