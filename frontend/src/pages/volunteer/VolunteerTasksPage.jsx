import React, { useState, useEffect } from 'react';
import { taskApi } from '../../api';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import { LoadingSpinner, AlertMessage, EmptyState } from '../../components/common/Feedback';
import Modal from '../../components/common/Modal';
import { IconCheckSquare, IconEdit } from '../../components/common/Icons';

export const VolunteerTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Status Update Modal
  const [selectedTask, setSelectedTask] = useState(null);
  const [newStatus, setNewStatus] = useState('IN_PROGRESS');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await taskApi.getMyTasks();
      if (res.success) {
        setTasks(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve your task queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleOpenStatusModal = (task) => {
    setSelectedTask(task);
    setNewStatus(task.status);
    setComment('');
    setError('');
    setSuccess('');
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTask) return;

    setSubmitting(true);
    setError('');

    try {
      const res = await taskApi.updateStatus(selectedTask.id, {
        status: newStatus,
        comment,
      });

      if (res.success) {
        setSuccess(`Task "${selectedTask.title}" updated to ${newStatus}.`);
        setSelectedTask(null);
        fetchTasks();
      }
    } catch (err) {
      setError(err.message || 'Failed to update task status');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <AlertMessage type="danger" message={error} onClose={() => setError('')} />
      <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />

      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">My Assigned Task Queue</h2>
            <p className="card-subtitle">
              Review assigned deliverables, execute instructions, and record status transitions
            </p>
          </div>
        </div>

        <div className="card-body">
          {loading ? (
            <LoadingSpinner text="Retrieving assigned tasks..." />
          ) : tasks.length > 0 ? (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Deliverable Title</th>
                    <th>Event</th>
                    <th>Committee / Team</th>
                    <th>Priority</th>
                    <th>Target Deadline</th>
                    <th>Current Status</th>
                    <th style={{ textAlign: 'right' }}>Update</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((t) => (
                    <tr key={t.id}>
                      <td style={{ maxWidth: '280px' }}>
                        <div style={{ fontWeight: 600 }}>{t.title}</div>
                        {t.description && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {t.description}
                          </div>
                        )}
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>{t.eventName}</td>
                      <td>{t.teamName || 'General'}</td>
                      <td>
                        <PriorityBadge priority={t.priority} />
                      </td>
                      <td style={{ fontSize: '0.825rem', color: 'var(--secondary)' }}>
                        {t.deadline || 'No fixed deadline'}
                      </td>
                      <td>
                        <StatusBadge status={t.status} />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleOpenStatusModal(t)}
                        >
                          <IconEdit size={14} />
                          <span>Update Progress</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="No tasks currently assigned"
              message="Check back soon or consult your Team Lead for assignment."
            />
          )}
        </div>
      </div>

      {/* Status Transition Modal */}
      <Modal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title={`Update Task: ${selectedTask?.title}`}
        maxWidth="480px"
      >
        <form onSubmit={handleStatusSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="task-new-status">
              Operational Status
            </label>
            <select
              id="task-new-status"
              className="form-control"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              required
            >
              <option value="PENDING">PENDING - Awaiting commencement</option>
              <option value="IN_PROGRESS">IN_PROGRESS - Work ongoing</option>
              <option value="COMPLETED">COMPLETED - Finished and verified</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="task-comment">
              Progress Notes / Completion Summary
            </label>
            <textarea
              id="task-comment"
              className="form-control"
              rows={3}
              placeholder="e.g. Cables connected, audio level checked with sound engineer..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setSelectedTask(null)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Progress'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default VolunteerTasksPage;
