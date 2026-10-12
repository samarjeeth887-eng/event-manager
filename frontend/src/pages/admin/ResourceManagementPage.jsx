import React, { useState, useEffect } from 'react';
import { resourceApi, eventApi } from '../../api';
import StatusBadge from '../../components/common/StatusBadge';
import { LoadingSpinner, AlertMessage, EmptyState } from '../../components/common/Feedback';
import Modal, { ConfirmDialog } from '../../components/common/Modal';
import { IconSearch, IconPlus, IconEdit, IconTrash } from '../../components/common/Icons';

const initialResourceForm = {
  name: '',
  category: 'Audio/Visual',
  totalQuantity: 10,
  eventId: '',
  unitCost: 100.0,
};

export const ResourceManagementPage = () => {
  const [resources, setResources] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Alerts
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialResourceForm);
  const [submitting, setSubmitting] = useState(false);

  // Delete Dialog
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resRes, eventsRes] = await Promise.all([
        resourceApi.getAll(),
        eventApi.getAll(),
      ]);

      if (resRes.success) setResources(resRes.data);
      if (eventsRes.success) setEvents(eventsRes.data);
    } catch (err) {
      setError(err.message || 'Failed to retrieve equipment inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredResources = resources.filter((r) => {
    if (searchQuery.trim() && !r.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (categoryFilter && r.category !== categoryFilter) {
      return false;
    }
    if (statusFilter && r.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData(initialResourceForm);
    setIsModalOpen(true);
    setError('');
    setSuccess('');
  };

  const handleOpenEditModal = (r) => {
    setEditingId(r.id);
    setFormData({
      name: r.name,
      category: r.category,
      totalQuantity: r.totalQuantity,
      eventId: r.eventId || '',
      unitCost: r.unitCost || 0,
    });
    setIsModalOpen(true);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        ...formData,
        totalQuantity: Number(formData.totalQuantity),
        eventId: formData.eventId ? Number(formData.eventId) : null,
        unitCost: Number(formData.unitCost),
      };

      if (editingId) {
        const res = await resourceApi.update(editingId, payload);
        if (res.success) {
          setSuccess(`Resource "${res.data.name}" updated successfully.`);
          setIsModalOpen(false);
          fetchData();
        }
      } else {
        const res = await resourceApi.create(payload);
        if (res.success) {
          setSuccess(`Resource "${res.data.name}" added to inventory.`);
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

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await resourceApi.delete(deleteTarget.id);
      if (res.success) {
        setSuccess(`Resource "${deleteTarget.name}" deleted.`);
        setDeleteTarget(null);
        fetchData();
      }
    } catch (err) {
      setError(err.message || 'Failed to delete resource');
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
            <h2 className="card-title">Resource Inventory & Equipment Pool</h2>
            <p className="card-subtitle">
              Manage centralized university equipment, projectors, audio kits, workstations, and venues
            </p>
          </div>
          <button className="btn btn-primary" onClick={handleOpenCreateModal}>
            <IconPlus size={16} />
            <span>Add Equipment / Resource</span>
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
                placeholder="Search equipment by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <select
                className="form-control"
                style={{ width: '180px' }}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Audio/Visual">Audio/Visual</option>
                <option value="Computing">Computing</option>
                <option value="Furniture">Furniture</option>
                <option value="Facility">Facility</option>
                <option value="Catering">Catering</option>
                <option value="Logistics">Logistics</option>
              </select>

              <select
                className="form-control"
                style={{ width: '180px' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="AVAILABLE">Available</option>
                <option value="PARTIALLY_ALLOCATED">Partially Allocated</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
              </select>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner text="Querying equipment catalog..." />
          ) : filteredResources.length > 0 ? (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Equipment Name</th>
                    <th>Category</th>
                    <th>Total Pool</th>
                    <th>Available</th>
                    <th>Allocated</th>
                    <th>Status</th>
                    <th>Associated Event</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResources.map((r) => {
                    const allocated = Math.max(0, r.totalQuantity - r.availableQuantity);
                    return (
                      <tr key={r.id}>
                        <td style={{ fontWeight: 600 }}>{r.name}</td>
                        <td>{r.category}</td>
                        <td>{r.totalQuantity} units</td>
                        <td style={{ fontWeight: 600, color: 'var(--success)' }}>
                          {r.availableQuantity}
                        </td>
                        <td style={{ color: 'var(--warning)' }}>{allocated}</td>
                        <td>
                          <StatusBadge status={r.status} />
                        </td>
                        <td style={{ color: 'var(--text-muted)' }}>
                          {r.eventName || 'Shared Pool'}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleOpenEditModal(r)}
                              title="Edit Resource"
                            >
                              <IconEdit size={14} />
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => setDeleteTarget(r)}
                              title="Delete Resource"
                            >
                              <IconTrash size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="No resources found"
              message="No equipment records match your current criteria."
              actionText="Add Equipment"
              onAction={handleOpenCreateModal}
            />
          )}
        </div>
      </div>

      {/* Resource Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Resource Inventory' : 'Add New Equipment / Resource'}
        maxWidth="560px"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="res-name">
              Resource / Equipment Name
            </label>
            <input
              id="res-name"
              type="text"
              className="form-control"
              placeholder="e.g. Wireless Microphone Set, Projector 4K"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="res-category">
                Category
              </label>
              <select
                id="res-category"
                className="form-control"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <option value="Audio/Visual">Audio/Visual</option>
                <option value="Computing">Computing</option>
                <option value="Furniture">Furniture</option>
                <option value="Facility">Facility</option>
                <option value="Catering">Catering</option>
                <option value="Logistics">Logistics</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="res-qty">
                Total Quantity
              </label>
              <input
                id="res-qty"
                type="number"
                min="1"
                className="form-control"
                value={formData.totalQuantity}
                onChange={(e) => setFormData({ ...formData, totalQuantity: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="res-cost">
                Unit Replacement / Rental Cost (INR)
              </label>
              <input
                id="res-cost"
                type="number"
                step="0.01"
                className="form-control"
                value={formData.unitCost}
                onChange={(e) => setFormData({ ...formData, unitCost: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="res-event">
                Associated Event (Optional)
              </label>
              <select
                id="res-event"
                className="form-control"
                value={formData.eventId}
                onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
              >
                <option value="">General University Pool (Shared)</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.name}
                  </option>
                ))}
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
              {submitting ? 'Saving...' : editingId ? 'Update Resource' : 'Add to Pool'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Equipment"
        message={`Are you sure you want to delete "${deleteTarget?.name}" from the inventory pool?`}
        confirmText="Delete Resource"
        isDanger={true}
        loading={isDeleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default ResourceManagementPage;
