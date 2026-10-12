import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  IconDashboard,
  IconCalendar,
  IconUsers,
  IconCheckSquare,
  IconLayers,
  IconTruck,
  IconShieldCheck,
  IconFileText,
  IconActivity,
  IconUserCheck,
} from '../common/Icons';

export const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role;

  const renderNavLinks = () => {
    switch (role) {
      case 'ADMIN':
        return (
          <>
            <div className="nav-section-title">Operations</div>
            <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <IconDashboard className="nav-icon" />
              <span>Admin Dashboard</span>
            </NavLink>
            <NavLink to="/admin/events" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <IconCalendar className="nav-icon" />
              <span>Event Management</span>
            </NavLink>
            <NavLink to="/admin/teams" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <IconUsers className="nav-icon" />
              <span>Team Management</span>
            </NavLink>
            <NavLink to="/admin/tasks" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <IconCheckSquare className="nav-icon" />
              <span>Task Management</span>
            </NavLink>
            <NavLink to="/admin/resources" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <IconLayers className="nav-icon" />
              <span>Resource Inventory</span>
            </NavLink>
            <NavLink to="/admin/vendors" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <IconTruck className="nav-icon" />
              <span>Vendor Management</span>
            </NavLink>

            <div className="nav-section-title">Governance</div>
            <NavLink to="/admin/approvals" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <IconShieldCheck className="nav-icon" />
              <span>Approval Requests</span>
            </NavLink>
            <NavLink to="/admin/users" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <IconUserCheck className="nav-icon" />
              <span>User Directory</span>
            </NavLink>
            <NavLink to="/admin/audit-logs" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <IconActivity className="nav-icon" />
              <span>Audit Trail</span>
            </NavLink>
            <NavLink to="/admin/reports" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <IconFileText className="nav-icon" />
              <span>Reports & Analytics</span>
            </NavLink>
          </>
        );

      case 'COORDINATOR':
        return (
          <>
            <div className="nav-section-title">Event Operations</div>
            <NavLink to="/coordinator/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <IconDashboard className="nav-icon" />
              <span>Coordinator Dashboard</span>
            </NavLink>
            <NavLink to="/coordinator/events" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <IconCalendar className="nav-icon" />
              <span>My Events</span>
            </NavLink>
            <NavLink to="/coordinator/teams" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <IconUsers className="nav-icon" />
              <span>Teams & Volunteers</span>
            </NavLink>
            <NavLink to="/coordinator/tasks" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <IconCheckSquare className="nav-icon" />
              <span>Task Delegation</span>
            </NavLink>
            <NavLink to="/coordinator/resources" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <IconLayers className="nav-icon" />
              <span>Resource Requisitions</span>
            </NavLink>
            <NavLink to="/coordinator/vendors" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <IconTruck className="nav-icon" />
              <span>Event Vendors</span>
            </NavLink>
          </>
        );

      case 'TEAM_LEAD':
        return (
          <>
            <div className="nav-section-title">Team Workspace</div>
            <NavLink to="/teamlead/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <IconDashboard className="nav-icon" />
              <span>Team Lead Dashboard</span>
            </NavLink>
            <NavLink to="/teamlead/members" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <IconUsers className="nav-icon" />
              <span>Team Members</span>
            </NavLink>
            <NavLink to="/teamlead/tasks" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <IconCheckSquare className="nav-icon" />
              <span>Task Assignments</span>
            </NavLink>
          </>
        );

      case 'VOLUNTEER':
      default:
        return (
          <>
            <div className="nav-section-title">My Workspace</div>
            <NavLink to="/volunteer/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <IconDashboard className="nav-icon" />
              <span>Volunteer Dashboard</span>
            </NavLink>
            <NavLink to="/volunteer/tasks" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <IconCheckSquare className="nav-icon" />
              <span>My Assigned Tasks</span>
            </NavLink>
            <NavLink to="/volunteer/team" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <IconUsers className="nav-icon" />
              <span>My Team & Lead</span>
            </NavLink>
            <NavLink to="/volunteer/events" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <IconCalendar className="nav-icon" />
              <span>Active Events</span>
            </NavLink>
          </>
        );
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-badge">EO</div>
        <div className="logo-text">
          <span className="logo-title">EventOps</span>
          <span className="logo-subtitle">Resource Platform</span>
        </div>
      </div>

      <nav className="sidebar-nav">{renderNavLinks()}</nav>

      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-info">
            <div className="user-name">{user?.name || 'User'}</div>
            <div className="user-role-label">{role}</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
