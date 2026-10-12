import React, { useState, useEffect } from 'react';
import { taskApi, eventApi, teamApi, userApi } from '../../api';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import { LoadingSpinner, AlertMessage, EmptyState } from '../../components/common/Feedback';
import Modal, { ConfirmDialog } from '../../components/common/Modal';
import { IconSearch, IconPlus, IconEdit, IconTrash } from '../../components/common/Icons';

const initialTaskForm = {
  title: '',
  description: '',
  eventId: '',
  teamId: '',
  assignedUserId: '',
  priority: 'MEDIUM',
  status: 'PENDING',
  deadline: '',
};

export const TaskManagementPage = () => {
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [eventFilter, setEventFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  // Feedback
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialTaskForm);
  const [modalTeams, setModalTeams] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Delete Dialog
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksRes, eventsRes, teamsRes, usersRes] = await Promise.all([
        taskApi.getAll(),
        eventApi.getAll(),
        teamApi.getAll(),
        userApi.getAll(),
      ]);

      if (tasksRes.success) setTasks(tasksRes.data);
      if (eventsRes.success) setEvents(eventsRes.data);
      if (teamsRes.success) setTeams(teamsRes.data);
      if (usersRes.success) setUsers(usersRes.data);
    } catch (err) {
      setError(err.message || 'Failed to load task repository');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredTasks = tasks.filter((t) => {
    if (searchQuery.trim() && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (eventFilter && String(t.eventId) !== String(eventFilter)) {
      return false;
    }
    if (statusFilter && t.status !== statusFilter) {
      return false;
    }
    if (priorityFilter && t.priority !== priorityFilter) {
      return false;
    }
    return true;
  });

  const handleOpenCreateModal = () => {
    setEditingId(null);
    const defaultEventId = events[0]?.id || '';
    setFormData({
      ...initialTaskForm,
      eventId: defaultEventId,
    });
    setModalTeams(teams.filter((t) => String(t.eventId) === String(defaultEventId)));
    setIsModalOpen(true);
    setError('');
    setSuccess('');
  };

  const handleOpenEditModal = (t) => {
    setEditingId(t.id);
    setFormData({
      title: t.title,
      description: t.description || '',
      eventId: t.eventId,
      teamId: t.teamId || '',
      assignedUserId: t.assignedUserId || '',
      priority: t.priority,
      status: t.status,
      deadline: t.deadline || '',
    });
    setModalTeams(teams.filter((item) => String(item.eventId) === String(t.eventId)));
    setIsModalOpen(true);
    setError('');
    setSuccess('');
  };

  const handleEventChangeInModal = (eventId) => {
    setFormData((prev) => ({
      ...prev,
      eventId,
      teamId: '',
    }));
    setModalTeams(teams.filter((t) => String(t.eventId) === String(eventId)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        ...formData,
        teamId: formData.teamId ? Number(formData.teamId) : null,
        assignedUserId: formData.assignedUserId ? Number(formData.assignedUserId) : null,
      };

      if (editingId) {
        const res = await taskApi.update(editingId, payload);
        if (res.success) {
          setSuccess(`Task "${res.data.title}" updated.`);
          setIsModalOpen(false);
          fetchData();
        }
      } else {
        const res = await taskApi.create(payload);
        if (res.success) {
          setSuccess(`Task "${res.data.title}" created.`);
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

  const handleQuickStatusChange = async (task, newStatus) => {
    try {
      const res = await taskApi.updateStatus(task.id, {
        status: newStatus,
        comment: `Updated status via console to ${newStatus}`,
      });
      if (res.success) {
        setSuccess(`Task status updated to ${newStatus}.`);
        fetchData();
      }
    } catch (err) {
      setError(err.message || 'Failed to update task status');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await taskApi.delete(deleteTarget.id);
      if (res.success) {
        setSuccess(`Task "${deleteTarget.title}" deleted.`);
        setDeleteTarget(null);
        fetchData();
      }
    } catch (err) {
      setError(err.message || 'Failed to delete task');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <AlertMessage type="danger" message={error} onClose={() => setError('')} />
      <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />

      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Central Task Operations</h2>
            <p className="card-subtitle">
              Dispatch, assign, and track operational deliverables across all event teams
            </p>
          </div>
          <button className="btn btn-primary" onClick={handleOpenCreateModal}>
            <IconPlus size={16} />
            <span>Create New Task</span>
          </button>
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
                placeholder="Search tasks by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <select
                className="form-control"
                style={{ width: '200px' }}
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

              <select
                className="form-control"
                style={{ width: '150px' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>

              <select
                className="form-control"
                style={{ width: '150px' }}
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="">All Priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner text="Retrieving task queue..." />
          ) : filteredTasks.length > 0 ? (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Task Description</th>
                    <th>Event</th>
                    <th>Team</th>
                    <th>Assignee</th>
                    <th>Priority</th>
                    <th>Deadline</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((t) => (
                    <tr key={t.id}>
                      <td style={{ maxWidth: '240px' }}>
                        <div style={{ fontWeight: 600 }}>{t.title}</div>
                        {t.description && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {t.description}
                          </div>
                        )}
                      </td>
                      <td style={{ fontSize: '0.825rem' }}>{t.eventName}</td>
                      <td>{t.teamName || 'General'}</td>
                      <td>{t.assignedUserName || 'Unassigned'}</td>
                      <td>
                        <PriorityBadge priority={t.priority} />
                      </td>
                      <td style={{ fontSize: '0.825rem', color: 'var(--secondary)' }}>
                        {t.deadline || 'No deadline'}
                      </td>
                      <td>
                        <select
                          className="form-control"
                          style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem', width: 'auto' }}
                          value={t.status}
                          onChange={(e) => handleQuickStatusChange(t, e.target.value)}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="COMPLETED">Completed</option>
                        </select>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleOpenEditModal(t)}
                            title="Edit Task"
                          >
                            <IconEdit size={14} />
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => setDeleteTarget(t)}
                            title="Delete Task"
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
              title="No tasks found"
              message="No task items match the specified filters."
              actionText="Create Task"
              onAction={handleOpenCreateModal}
            />
          )}
        </div>
      </div>

      {/* Task Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Task Details' : 'Create Operational Task'}
        maxWidth="600px"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="task-title">
              Task Title
            </label>
            <input
              id="task-title"
              type="text"
              className="form-control"
              placeholder="e.g. Setup Auditorium Stage Audio"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="task-desc">
              Task Instructions
            </label>
            <textarea
              id="task-desc"
              className="form-control"
              rows={3}
              placeholder="Operational steps and requirements..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="task-event">
                Target Event
              </label>
              <select
                id="task-event"
                className="form-control"
                value={formData.eventId}
                onChange={(e) => handleEventChangeInModal(e.target.value)}
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

            <div className="form-group">
              <label className="form-label" htmlFor="task-team">
                Operational Team
              </label>
              <select
                id="task-team"
                className="form-control"
                value={formData.teamId}
                onChange={(e) => setFormData({ ...formData, teamId: e.target.value })}
              >
                <option value="">General / Unassigned to Team</option>
                {modalTeams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="task-assignee">
                Assign User / Volunteer
              </label>
              <select
                id="task-assignee"
                className="form-control"
                value={formData.assignedUserId}
                onChange={(e) => setFormData({ ...formData, assignedUserId: e.target.value })}
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="task-priority">
                Priority
              </label>
              <select
                id="task-priority"
                className="form-control"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                required
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="URGENT">URGENT</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="task-status">
                Status
              </label>
              <select
                id="task-status"
                className="form-control"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                required
              >
                <option value="PENDING">PENDING</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="task-deadline">
                Target Deadline
              </label>
              <input
                id="task-deadline"
                type="date"
                className="form-control"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
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
              {submitting ? 'Saving...' : editingId ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Task"
        message={`Are you sure you want to delete task "${deleteTarget?.title}"?`}
        confirmText="Delete Task"
        isDanger={true}
        loading={isDeleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default TaskManagementPage;
