import React, { useState, useEffect } from 'react';
import { userApi } from '../../api';
import StatusBadge from '../../components/common/StatusBadge';
import { LoadingSpinner, AlertMessage, EmptyState } from '../../components/common/Feedback';
import Modal from '../../components/common/Modal';
import { IconSearch, IconUserCheck, IconEdit } from '../../components/common/Icons';

export const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Role Edit Modal state
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userApi.getAll();
      if (res.success) {
        setUsers(res.data);
        setFilteredUsers(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load user directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let result = users;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.department && u.department.toLowerCase().includes(q))
      );
    }
    if (roleFilter) {
      result = result.filter((u) => u.role === roleFilter);
    }
    setFilteredUsers(result);
  }, [searchQuery, roleFilter, users]);

  const handleOpenRoleModal = (u) => {
    setSelectedUser(u);
    setNewRole(u.role);
    setIsModalOpen(true);
    setError('');
    setSuccess('');
  };

  const handleUpdateRole = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    setSubmitting(true);
    try {
      const res = await userApi.updateRole(selectedUser.id, newRole);
      if (res.success) {
        setSuccess(`Role updated to ${newRole} for ${selectedUser.name}.`);
        setIsModalOpen(false);
        fetchUsers();
      }
    } catch (err) {
      setError(err.message || 'Failed to update role');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      const res = await userApi.toggleStatus(user.id);
      if (res.success) {
        setSuccess(`Status toggled for ${user.name}.`);
        fetchUsers();
      }
    } catch (err) {
      setError(err.message || 'Failed to update user status');
    }
  };

  return (
    <div>
      <AlertMessage type="danger" message={error} onClose={() => setError('')} />
      <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />

      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">User Accounts & Access Control</h2>
            <p className="card-subtitle">
              Manage platform roles and activation status for all stakeholders
            </p>
          </div>
        </div>

        <div className="card-body">
          <div className="toolbar">
            <div className="search-box">
              <span className="search-icon">
                <IconSearch size={16} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search by name, email, department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <select
                className="form-control"
                style={{ width: '180px' }}
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">All User Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="COORDINATOR">Coordinator</option>
                <option value="TEAM_LEAD">Team Lead</option>
                <option value="VOLUNTEER">Volunteer</option>
              </select>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner text="Fetching user records..." />
          ) : filteredUsers.length > 0 ? (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 600 }}>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className="badge badge-purple">{u.role}</span>
                      </td>
                      <td>{u.department || 'N/A'}</td>
                      <td>{u.phone || 'N/A'}</td>
                      <td>
                        <StatusBadge status={u.active ? 'ACTIVE' : 'INACTIVE'} />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleOpenRoleModal(u)}
                            title="Modify User Role"
                          >
                            <IconEdit size={14} />
                            <span>Edit Role</span>
                          </button>
                          <button
                            className={`btn ${u.active ? 'btn-secondary' : 'btn-success'} btn-sm`}
                            onClick={() => handleToggleStatus(u)}
                          >
                            {u.active ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="No users match your criteria"
              message="Adjust search query or role filter to view results."
            />
          )}
        </div>
      </div>

      {/* Role Modification Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Modify Role for ${selectedUser?.name}`}
        maxWidth="460px"
      >
        <form onSubmit={handleUpdateRole}>
          <div className="form-group">
            <label className="form-label">User Email</label>
            <input
              type="text"
              className="form-control"
              value={selectedUser?.email || ''}
              disabled
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="select-role">
              Assign New Role
            </label>
            <select
              id="select-role"
              className="form-control"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              required
            >
              <option value="ADMIN">ADMIN - Full Platform Management</option>
              <option value="COORDINATOR">COORDINATOR - Event Management</option>
              <option value="TEAM_LEAD">TEAM_LEAD - Team Task Delegation</option>
              <option value="VOLUNTEER">VOLUNTEER - Task Execution</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Updating...' : 'Save Role Change'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserManagementPage;
