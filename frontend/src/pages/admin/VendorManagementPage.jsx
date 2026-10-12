import React, { useState, useEffect } from 'react';
import { vendorApi, eventApi } from '../../api';
import StatusBadge from '../../components/common/StatusBadge';
import { LoadingSpinner, AlertMessage, EmptyState } from '../../components/common/Feedback';
import Modal, { ConfirmDialog } from '../../components/common/Modal';
import { IconSearch, IconPlus, IconEdit, IconTrash } from '../../components/common/Icons';

const initialVendorForm = {
  name: '',
  contactPerson: '',
  phone: '',
  email: '',
  category: 'Sound & Stage',
  service: '',
  contractAmount: 10000.0,
  paymentStatus: 'PENDING',
  eventId: '',
  notes: '',
};

export const VendorManagementPage = () => {
  const [vendors, setVendors] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');

  // Alerts
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialVendorForm);
  const [submitting, setSubmitting] = useState(false);

  // Delete
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [vendorsRes, eventsRes] = await Promise.all([
        vendorApi.getAll(),
        eventApi.getAll(),
      ]);

      if (vendorsRes.success) setVendors(vendorsRes.data);
      if (eventsRes.success) setEvents(eventsRes.data);
    } catch (err) {
      setError(err.message || 'Failed to retrieve vendor directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredVendors = vendors.filter((v) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!v.name.toLowerCase().includes(q) && !v.contactPerson.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (categoryFilter && v.category !== categoryFilter) {
      return false;
    }
    if (paymentFilter && v.paymentStatus !== paymentFilter) {
      return false;
    }
    return true;
  });

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData(initialVendorForm);
    setIsModalOpen(true);
    setError('');
    setSuccess('');
  };

  const handleOpenEditModal = (v) => {
    setEditingId(v.id);
    setFormData({
      name: v.name,
      contactPerson: v.contactPerson,
      phone: v.phone,
      email: v.email,
      category: v.category,
      service: v.service,
      contractAmount: v.contractAmount,
      paymentStatus: v.paymentStatus,
      eventId: v.eventId || '',
      notes: v.notes || '',
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
        contractAmount: Number(formData.contractAmount),
        eventId: formData.eventId ? Number(formData.eventId) : null,
      };

      if (editingId) {
        const res = await vendorApi.update(editingId, payload);
        if (res.success) {
          setSuccess(`Vendor "${res.data.name}" updated successfully.`);
          setIsModalOpen(false);
          fetchData();
        }
      } else {
        const res = await vendorApi.create(payload);
        if (res.success) {
          setSuccess(`Vendor "${res.data.name}" contracted successfully.`);
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
      const res = await vendorApi.delete(deleteTarget.id);
      if (res.success) {
        setSuccess(`Vendor contract for "${deleteTarget.name}" deleted.`);
        setDeleteTarget(null);
        fetchData();
      }
    } catch (err) {
      setError(err.message || 'Failed to delete vendor');
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
            <h2 className="card-title">Vendor & External Procurement Directory</h2>
            <p className="card-subtitle">
              Manage suppliers for audio systems, catering, stage setups, printing, and security
            </p>
          </div>
          <button className="btn btn-primary" onClick={handleOpenCreateModal}>
            <IconPlus size={16} />
            <span>Register Vendor Contract</span>
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
                placeholder="Search vendor or contact person..."
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
                <option value="Sound & Stage">Sound & Stage</option>
                <option value="Catering">Catering</option>
                <option value="Decoration">Decoration</option>
                <option value="Photography">Photography</option>
                <option value="Security">Security</option>
                <option value="Logistics">Logistics</option>
              </select>

              <select
                className="form-control"
                style={{ width: '180px' }}
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
              >
                <option value="">All Payment Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="PARTIALLY_PAID">Partially Paid</option>
                <option value="PAID">Paid</option>
              </select>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner text="Retrieving procurement contracts..." />
          ) : filteredVendors.length > 0 ? (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Vendor Name</th>
                    <th>Category</th>
                    <th>Contact Person</th>
                    <th>Phone / Email</th>
                    <th>Service Scope</th>
                    <th>Contract Value</th>
                    <th>Payment Status</th>
                    <th>Assigned Event</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVendors.map((v) => (
                    <tr key={v.id}>
                      <td style={{ fontWeight: 600 }}>{v.name}</td>
                      <td>{v.category}</td>
                      <td>{v.contactPerson}</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>
                        <div>{v.phone}</div>
                        <div style={{ color: 'var(--text-muted)' }}>{v.email}</div>
                      </td>
                      <td style={{ maxWidth: '200px', fontSize: '0.825rem' }}>{v.service}</td>
                      <td style={{ fontWeight: 600 }}>
                        INR {Number(v.contractAmount || 0).toLocaleString()}
                      </td>
                      <td>
                        <StatusBadge status={v.paymentStatus} />
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>{v.eventName || 'General'}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleOpenEditModal(v)}
                            title="Edit Vendor"
                          >
                            <IconEdit size={14} />
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => setDeleteTarget(v)}
                            title="Delete Vendor"
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
              title="No vendors found"
              message="No vendor profiles match search criteria."
              actionText="Add Vendor"
              onAction={handleOpenCreateModal}
            />
          )}
        </div>
      </div>

      {/* Vendor Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Vendor Contract' : 'Register Vendor Contract'}
        maxWidth="640px"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="v-name">
                Company / Vendor Name
              </label>
              <input
                id="v-name"
                type="text"
                className="form-control"
                placeholder="e.g. AcousticVibe Systems"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="v-contact">
                Contact Person
              </label>
              <input
                id="v-contact"
                type="text"
                className="form-control"
                placeholder="e.g. Ramesh Patel"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="v-phone">
                Phone Number
              </label>
              <input
                id="v-phone"
                type="text"
                className="form-control"
                placeholder="e.g. 9876543210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="v-email">
                Email Address
              </label>
              <input
                id="v-email"
                type="email"
                className="form-control"
                placeholder="ramesh@supplier.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="v-cat">
                Service Category
              </label>
              <select
                id="v-cat"
                className="form-control"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <option value="Sound & Stage">Sound & Stage</option>
                <option value="Catering">Catering</option>
                <option value="Decoration">Decoration</option>
                <option value="Photography">Photography</option>
                <option value="Security">Security</option>
                <option value="Logistics">Logistics</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="v-payment">
                Payment Status
              </label>
              <select
                id="v-payment"
                className="form-control"
                value={formData.paymentStatus}
                onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                required
              >
                <option value="PENDING">PENDING</option>
                <option value="PARTIALLY_PAID">PARTIALLY_PAID</option>
                <option value="PAID">PAID</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="v-service">
              Service Deliverables Description
            </label>
            <input
              id="v-service"
              type="text"
              className="form-control"
              placeholder="e.g. Stage lighting, 4K livestream setup, 1200 meals"
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="v-amount">
                Contract Amount (INR)
              </label>
              <input
                id="v-amount"
                type="number"
                step="0.01"
                className="form-control"
                value={formData.contractAmount}
                onChange={(e) => setFormData({ ...formData, contractAmount: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="v-event">
                Target Event (Optional)
              </label>
              <select
                id="v-event"
                className="form-control"
                value={formData.eventId}
                onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
              >
                <option value="">Campus-Wide / Multi-Event</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="v-notes">
              Contract Terms & Operational Notes
            </label>
            <textarea
              id="v-notes"
              className="form-control"
              rows={2}
              placeholder="Advance payment percentage, delivery schedule, penalties..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
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
              {submitting ? 'Saving...' : editingId ? 'Update Contract' : 'Create Contract'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Vendor"
        message={`Are you sure you want to delete vendor contract for "${deleteTarget?.name}"?`}
        confirmText="Delete Contract"
        isDanger={true}
        loading={isDeleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default VendorManagementPage;
