import React, { useState, useEffect } from 'react';
import { approvalApi, resourceApi, eventApi } from '../../api';
import StatusBadge from '../../components/common/StatusBadge';
import { LoadingSpinner, AlertMessage, EmptyState } from '../../components/common/Feedback';
import Modal from '../../components/common/Modal';
import { IconPlus, IconLayers } from '../../components/common/Icons';

export const CoordinatorResourcesPage = () => {
  const [requests, setRequests] = useState([]);
  const [resources, setResources] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    eventId: '',
    resourceId: '',
    quantity: 1,
    purpose: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reqRes, resRes, eventsRes] = await Promise.all([
        approvalApi.getMyRequests(),
        resourceApi.getAll(),
        eventApi.getAll(),
      ]);

      if (reqRes.success) setRequests(reqRes.data);
      if (resRes.success) setResources(resRes.data);
      if (eventsRes.success) setEvents(eventsRes.data);
    } catch (err) {
      setError(err.message || 'Failed to load requisition records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = () => {
    setFormData({
      eventId: events[0]?.id || '',
      resourceId: resources[0]?.id || '',
      quantity: 1,
      purpose: '',
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
        eventId: Number(formData.eventId),
        resourceId: Number(formData.resourceId),
        quantity: Number(formData.quantity),
        purpose: formData.purpose,
      };

      const res = await approvalApi.createRequest(payload);
      if (res.success) {
        setSuccess('Resource requisition submitted for administrative review.');
        setIsModalOpen(false);
        fetchData();
      }
    } catch (err) {
      setError(err.message || 'Failed to submit requisition');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <AlertMessage type="danger" message={error} onClose={() => setError('')} />
      <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />

      {/* Available Equipment Catalog */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Available University Equipment Catalog</h2>
            <p className="card-subtitle">
              Browse current available stock across campus inventory pools
            </p>
          </div>
          <button className="btn btn-primary" onClick={handleOpenModal}>
            <IconPlus size={16} />
            <span>Submit Resource Requisition</span>
          </button>
        </div>

        <div className="card-body">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Equipment</th>
                  <th>Category</th>
                  <th>Total Pool</th>
                  <th>Available Now</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {resources.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600 }}>{r.name}</td>
                    <td>{r.category}</td>
                    <td>{r.totalQuantity} units</td>
                    <td style={{ fontWeight: 600, color: 'var(--success)' }}>
                      {r.availableQuantity} units
                    </td>
                    <td>
                      <StatusBadge status={r.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* My Submitted Requests */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">My Submitted Requisitions & Approval Status</h2>
            <p className="card-subtitle">
              Track decisions made by administrators on your equipment requests
            </p>
          </div>
        </div>

        <div className="card-body">
          {loading ? (
            <LoadingSpinner text="Loading requisitions..." />
          ) : requests.length > 0 ? (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Equipment</th>
                    <th>Target Event</th>
                    <th>Qty</th>
                    <th>Purpose / Need</th>
                    <th>Requested At</th>
                    <th>Decision</th>
                    <th>Reviewer Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req.id}>
                      <td style={{ fontWeight: 600 }}>{req.resourceName}</td>
                      <td>{req.eventName}</td>
                      <td style={{ fontWeight: 600, color: 'var(--primary)' }}>
                        {req.quantity}
                      </td>
                      <td style={{ maxWidth: '240px', fontSize: '0.85rem' }}>{req.purpose}</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {req.requestedAt ? new Date(req.requestedAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td>
                        <StatusBadge status={req.status} />
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--secondary)' }}>
                        {req.approverComments || 'Awaiting administrator decision'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="No requisitions filed"
              message="Submit a requisition to allocate projectors, mics, or venue setups for your event."
              actionText="Create Requisition"
              onAction={handleOpenModal}
            />
          )}
        </div>
      </div>

      {/* Requisition Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Submit Resource Requisition"
        maxWidth="520px"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="req-event">
              Event Requiring Equipment
            </label>
            <select
              id="req-event"
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

          <div className="form-group">
            <label className="form-label" htmlFor="req-res">
              Equipment / Facility
            </label>
            <select
              id="req-res"
              className="form-control"
              value={formData.resourceId}
              onChange={(e) => setFormData({ ...formData, resourceId: e.target.value })}
              required
            >
              <option value="">Select Resource</option>
              {resources.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.availableQuantity} available)
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="req-qty">
              Required Quantity
            </label>
            <input
              id="req-qty"
              type="number"
              min="1"
              className="form-control"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="req-purpose">
              Operational Justification & Location
            </label>
            <textarea
              id="req-purpose"
              className="form-control"
              rows={3}
              placeholder="e.g. Needed for registration counter check-in and attendee kits distribution in Lobby B..."
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              required
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
              {submitting ? 'Submitting...' : 'Submit to Admin'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CoordinatorResourcesPage;
