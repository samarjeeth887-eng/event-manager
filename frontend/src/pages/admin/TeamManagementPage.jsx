import React, { useState, useEffect } from 'react';
import { teamApi, eventApi, userApi } from '../../api';
import StatusBadge from '../../components/common/StatusBadge';
import { LoadingSpinner, AlertMessage, EmptyState } from '../../components/common/Feedback';
import Modal, { ConfirmDialog } from '../../components/common/Modal';
import { IconPlus, IconEdit, IconTrash, IconUsers, IconUserCheck } from '../../components/common/Icons';

export const TeamManagementPage = () => {
  const [teams, setTeams] = useState([]);
  const [events, setEvents] = useState([]);
  const [teamLeads, setTeamLeads] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventFilter, setEventFilter] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Team Form Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    eventId: '',
    teamLeadId: '',
    status: 'ACTIVE',
  });
  const [submitting, setSubmitting] = useState(false);

  // Manage Members Modal
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [activeTeam, setActiveTeam] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedVolunteerId, setSelectedVolunteerId] = useState('');
  const [memberRole, setMemberRole] = useState('MEMBER');
  const [memberLoading, setMemberLoading] = useState(false);

  // Delete Dialog
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [teamsRes, eventsRes, leadsRes, volsRes] = await Promise.all([
        teamApi.getAll(),
        eventApi.getAll(),
        userApi.getTeamLeads(),
        userApi.getVolunteers(),
      ]);

      if (teamsRes.success) setTeams(teamsRes.data);
      if (eventsRes.success) setEvents(eventsRes.data);
      if (leadsRes.success) setTeamLeads(leadsRes.data);
      if (volsRes.success) setVolunteers(volsRes.data);
    } catch (err) {
      setError(err.message || 'Failed to load team data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredTeams = eventFilter
    ? teams.filter((t) => String(t.eventId) === String(eventFilter))
    : teams;

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      eventId: events[0]?.id || '',
      teamLeadId: teamLeads[0]?.id || '',
      status: 'ACTIVE',
    });
    setIsModalOpen(true);
    setError('');
    setSuccess('');
  };

  const handleOpenEditModal = (t) => {
    setEditingId(t.id);
    setFormData({
      name: t.name,
      description: t.description || '',
      eventId: t.eventId,
      teamLeadId: t.teamLeadId || '',
      status: t.status || 'ACTIVE',
    });
    setIsModalOpen(true);
    setError('');
    setSuccess('');
  };

  const handleSubmitTeam = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (editingId) {
        const res = await teamApi.update(editingId, formData);
        if (res.success) {
          setSuccess(`Team "${res.data.name}" updated successfully.`);
          setIsModalOpen(false);
          fetchData();
        }
      } else {
        const res = await teamApi.create(formData);
        if (res.success) {
          setSuccess(`Team "${res.data.name}" formed successfully.`);
          setIsModalOpen(false);
          fetchData();
        }
      }
    } catch (err) {
      setError(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTeam = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await teamApi.delete(deleteTarget.id);
      if (res.success) {
        setSuccess(`Team "${deleteTarget.name}" deleted successfully.`);
        setDeleteTarget(null);
        fetchData();
      }
    } catch (err) {
      setError(err.message || 'Failed to delete team');
    } finally {
      setIsDeleting(false);
    }
  };

  // Team Members Modal Handlers
  const handleOpenMembersModal = async (team) => {
    setActiveTeam(team);
    setIsMembersModalOpen(true);
    setSelectedVolunteerId(volunteers[0]?.id || '');
    setMemberRole('MEMBER');
    loadTeamMembers(team.id);
  };

  const loadTeamMembers = async (teamId) => {
    try {
      setMemberLoading(true);
      const res = await teamApi.getMembers(teamId);
      if (res.success) {
        setTeamMembers(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load team roster');
    } finally {
      setMemberLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!selectedVolunteerId || !activeTeam) return;

    try {
      const res = await teamApi.addMember({
        teamId: activeTeam.id,
        userId: selectedVolunteerId,
        roleInTeam: memberRole,
      });
      if (res.success) {
        setSuccess(`Added member to ${activeTeam.name}.`);
        loadTeamMembers(activeTeam.id);
        fetchData(); // update member count
      }
    } catch (err) {
      setError(err.message || 'Failed to add member to team');
    }
  };

  const handleRemoveMember = async (memberUserId) => {
    if (!activeTeam) return;
    try {
      const res = await teamApi.removeMember(activeTeam.id, memberUserId);
      if (res.success) {
        setSuccess(`Removed member from ${activeTeam.name}.`);
        loadTeamMembers(activeTeam.id);
        fetchData();
      }
    } catch (err) {
      setError(err.message || 'Failed to remove member');
    }
  };

  return (
    <div>
      <AlertMessage type="danger" message={error} onClose={() => setError('')} />
      <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />

      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Team Structure & Volunteer Allocation</h2>
            <p className="card-subtitle">
              Form functional operational committees (Technical, PR, Food, Logistics) and assign leads
            </p>
          </div>
          <button className="btn btn-primary" onClick={handleOpenCreateModal}>
            <IconPlus size={16} />
            <span>Form Operational Team</span>
          </button>
        </div>

        <div className="card-body">
          <div className="toolbar">
            <div className="filter-group">
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--secondary)' }}>
                Filter by Event:
              </label>
              <select
                className="form-control"
                style={{ width: '280px' }}
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
              >
                <option value="">All Events</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner text="Retrieving operational teams..." />
          ) : filteredTeams.length > 0 ? (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Team Name</th>
                    <th>Assigned Event</th>
                    <th>Team Lead</th>
                    <th>Roster Count</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeams.map((t) => (
                    <tr key={t.id}>
                      <td style={{ fontWeight: 600 }}>{t.name}</td>
                      <td>{t.eventName}</td>
                      <td>{t.teamLeadName || 'Unassigned'}</td>
                      <td>{t.memberCount} members</td>
                      <td>
                        <StatusBadge status={t.status} />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleOpenMembersModal(t)}
                            title="Manage Team Roster"
                          >
                            <IconUsers size={14} />
                            <span>Members</span>
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleOpenEditModal(t)}
                            title="Edit Team"
                          >
                            <IconEdit size={14} />
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => setDeleteTarget(t)}
                            title="Delete Team"
                          >
                            <IconTrash size={14} />
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
              title="No teams registered"
              message="Create functional teams to organize volunteers and assign operational tasks."
              actionText="Form First Team"
              onAction={handleOpenCreateModal}
            />
          )}
        </div>
      </div>

      {/* Create / Edit Team Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Team Details' : 'Form Operational Team'}
        maxWidth="540px"
      >
        <form onSubmit={handleSubmitTeam}>
          <div className="form-group">
            <label className="form-label" htmlFor="team-name">
              Team Title
            </label>
            <input
              id="team-name"
              type="text"
              className="form-control"
              placeholder="e.g. Technical & Systems, Logistics, PR"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="team-desc">
              Description & Scope
            </label>
            <textarea
              id="team-desc"
              className="form-control"
              rows={2}
              placeholder="Operational responsibilities..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="team-event">
              Target Event
            </label>
            <select
              id="team-event"
              className="form-control"
              value={formData.eventId}
              onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
              required
            >
              <option value="">Select Event</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="team-lead">
                Team Lead
              </label>
              <select
                id="team-lead"
                className="form-control"
                value={formData.teamLeadId}
                onChange={(e) => setFormData({ ...formData, teamLeadId: e.target.value })}
              >
                <option value="">Select Team Lead (Optional)</option>
                {teamLeads.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.department || 'Lead'})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="team-status">
                Status
              </label>
              <select
                id="team-status"
                className="form-control"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
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
              {submitting ? 'Saving...' : editingId ? 'Update Team' : 'Form Team'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Team Roster / Members Management Modal */}
      <Modal
        isOpen={isMembersModalOpen}
        onClose={() => setIsMembersModalOpen(false)}
        title={`Roster: ${activeTeam?.name}`}
        maxWidth="640px"
      >
        <div>
          <form onSubmit={handleAddMember} style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--secondary)' }}>
              Add Volunteer or Stakeholder to Team
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <select
                className="form-control"
                style={{ flex: 1 }}
                value={selectedVolunteerId}
                onChange={(e) => setSelectedVolunteerId(e.target.value)}
                required
              >
                <option value="">Select Volunteer</option>
                {volunteers.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.email})
                  </option>
                ))}
              </select>
              <select
                className="form-control"
                style={{ width: '130px' }}
                value={memberRole}
                onChange={(e) => setMemberRole(e.target.value)}
              >
                <option value="MEMBER">Member</option>
                <option value="LEAD">Lead</option>
              </select>
              <button type="submit" className="btn btn-primary">
                Add
              </button>
            </div>
          </form>

          <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--secondary)' }}>
            Current Roster ({teamMembers.length})
          </div>

          {memberLoading ? (
            <LoadingSpinner text="Loading roster..." />
          ) : teamMembers.length > 0 ? (
            <div className="table-container" style={{ border: '1px solid var(--border-color)' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Email</th>
                    <th>Role in Team</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {teamMembers.map((m) => (
                    <tr key={m.id}>
                      <td style={{ fontWeight: 600 }}>{m.userName}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{m.userEmail}</td>
                      <td>
                        <span className="badge badge-purple">{m.roleInTeam}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRemoveMember(m.userId)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No volunteers enrolled in this team yet.
            </div>
          )}
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Team"
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        confirmText="Delete Team"
        isDanger={true}
        loading={isDeleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteTeam}
      />
    </div>
  );
};

export default TeamManagementPage;
