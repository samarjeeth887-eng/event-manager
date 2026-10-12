import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventApi } from '../../api';
import StatusBadge from '../../components/common/StatusBadge';
import { LoadingSpinner, AlertMessage, EmptyState } from '../../components/common/Feedback';
import Modal, { ConfirmDialog } from '../../components/common/Modal';
import { IconSearch, IconPlus, IconEdit, IconTrash, IconEye } from '../../components/common/Icons';

const initialFormData = {
  name: '',
  description: '',
  category: 'Technical',
  startDate: '',
  endDate: '',
  venue: '',
  organizer: '',
  status: 'UPCOMING',
  maxParticipants: 500,
  budget: 50000.0,
};

export const EventManagementPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);

  // Delete Dialog state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await eventApi.getAll();
      if (res.success) {
        setEvents(res.data);
        setFilteredEvents(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve event list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    let result = events;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q) ||
          e.organizer.toLowerCase().includes(q)
      );
    }
    if (categoryFilter) {
      result = result.filter((e) => e.category === categoryFilter);
    }
    if (statusFilter) {
      result = result.filter((e) => e.status === statusFilter);
    }
    setFilteredEvents(result);
  }, [searchQuery, categoryFilter, statusFilter, events]);

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData(initialFormData);
    setIsModalOpen(true);
    setError('');
    setSuccess('');
  };

  const handleOpenEditModal = (ev) => {
    setEditingId(ev.id);
    setFormData({
      name: ev.name,
      description: ev.description || '',
      category: ev.category,
      startDate: ev.startDate,
      endDate: ev.endDate,
      venue: ev.venue,
      organizer: ev.organizer,
      status: ev.status,
      maxParticipants: ev.maxParticipants || 500,
      budget: ev.budget || 0,
    });
    setIsModalOpen(true);
    setError('');
    setSuccess('');
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (editingId) {
        const res = await eventApi.update(editingId, formData);
        if (res.success) {
          setSuccess(`Event "${res.data.name}" updated successfully.`);
          setIsModalOpen(false);
          fetchEvents();
        }
      } else {
        const res = await eventApi.create(formData);
        if (res.success) {
          setSuccess(`Event "${res.data.name}" registered successfully.`);
          setIsModalOpen(false);
          fetchEvents();
        }
      }
    } catch (err) {
      setError(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await eventApi.delete(deleteTarget.id);
      if (res.success) {
        setSuccess(`Event "${deleteTarget.name}" deleted.`);
        setDeleteTarget(null);
        fetchEvents();
      }
    } catch (err) {
      setError(err.message || 'Failed to delete event');
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
            <h2 className="card-title">Event Operations Management</h2>
            <p className="card-subtitle">
              Configure lifecycle schedules, categories, budgets, and participant quotas
            </p>
          </div>
          <button className="btn btn-primary" onClick={handleOpenCreateModal}>
            <IconPlus size={16} />
            <span>Create New Event</span>
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
                placeholder="Search event name, venue, organizer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <select
                className="form-control"
                style={{ width: '160px' }}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Technical">Technical</option>
                <option value="Cultural">Cultural</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Workshop">Workshop</option>
                <option value="Conference">Conference</option>
              </select>

              <select
                className="form-control"
                style={{ width: '160px' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="DRAFT">Draft</option>
                <option value="UPCOMING">Upcoming</option>
                <option value="ONGOING">Ongoing</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading event operational records..." />
          ) : filteredEvents.length > 0 ? (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Event Name</th>
                    <th>Category</th>
                    <th>Schedule</th>
                    <th>Venue</th>
                    <th>Organizer</th>
                    <th>Status</th>
                    <th>Teams</th>
                    <th>Tasks</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((ev) => (
                    <tr key={ev.id}>
                      <td style={{ fontWeight: 600 }}>
                        <Link
                          to={`/events/${ev.id}`}
                          style={{ color: 'var(--primary)', textDecoration: 'underline' }}
                        >
                          {ev.name}
                        </Link>
                      </td>
                      <td>{ev.category}</td>
                      <td style={{ fontSize: '0.825rem', color: 'var(--secondary)' }}>
                        {ev.startDate} to {ev.endDate}
                      </td>
                      <td>{ev.venue}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{ev.organizer}</td>
                      <td>
                        <StatusBadge status={ev.status} />
                      </td>
                      <td>{ev.teamCount || 0}</td>
                      <td>{ev.taskCount || 0}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                          <Link
                            to={`/events/${ev.id}`}
                            className="btn btn-secondary btn-sm"
                            title="View Operations Console"
                          >
                            <IconEye size={14} />
                          </Link>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleOpenEditModal(ev)}
                            title="Edit Event Parameters"
                          >
                            <IconEdit size={14} />
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => setDeleteTarget(ev)}
                            title="Delete Event"
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
              title="No events found"
              message="No records match current filter parameters or no events created yet."
              actionText="Register Event"
              onAction={handleOpenCreateModal}
            />
          )}
        </div>
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Event Parameters' : 'Create New Event'}
        maxWidth="680px"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Event Title
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-control"
              placeholder="e.g. National Hackathon - CodeSphere 2026"
              value={formData.name}
              onChange={handleFormChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">
              Description & Objectives
            </label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              rows={3}
              placeholder="Operational synopsis and event scope..."
              value={formData.description}
              onChange={handleFormChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="category">
                Category
              </label>
              <select
                id="category"
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleFormChange}
                required
              >
                <option value="Technical">Technical</option>
                <option value="Cultural">Cultural</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Workshop">Workshop</option>
                <option value="Conference">Conference</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="status">
                Event Status
              </label>
              <select
                id="status"
                name="status"
                className="form-control"
                value={formData.status}
                onChange={handleFormChange}
                required
              >
                <option value="DRAFT">DRAFT</option>
                <option value="UPCOMING">UPCOMING</option>
                <option value="ONGOING">ONGOING</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="startDate">
                Start Date
              </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                className="form-control"
                value={formData.startDate}
                onChange={handleFormChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="endDate">
                End Date
              </label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                className="form-control"
                value={formData.endDate}
                onChange={handleFormChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="venue">
                Venue Location
              </label>
              <input
                id="venue"
                name="venue"
                type="text"
                className="form-control"
                placeholder="e.g. Campus Convention Center"
                value={formData.venue}
                onChange={handleFormChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="organizer">
                Organizer / Department
              </label>
              <input
                id="organizer"
                name="organizer"
                type="text"
                className="form-control"
                placeholder="e.g. Department of CSE"
                value={formData.organizer}
                onChange={handleFormChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="maxParticipants">
                Capacity Limit (Participants)
              </label>
              <input
                id="maxParticipants"
                name="maxParticipants"
                type="number"
                className="form-control"
                value={formData.maxParticipants}
                onChange={handleFormChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="budget">
                Allocated Budget
              </label>
              <input
                id="budget"
                name="budget"
                type="number"
                step="0.01"
                className="form-control"
                value={formData.budget}
                onChange={handleFormChange}
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
              {submitting ? 'Saving...' : editingId ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Event"
        message={`Are you sure you want to permanently delete "${deleteTarget?.name}"? All associated teams and tasks will be affected.`}
        confirmText="Delete Event"
        isDanger={true}
        loading={isDeleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default EventManagementPage;
