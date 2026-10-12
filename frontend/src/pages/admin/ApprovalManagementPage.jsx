import React, { useState, useEffect } from 'react';
import { approvalApi } from '../../api';
import StatusBadge from '../../components/common/StatusBadge';
import { LoadingSpinner, AlertMessage, EmptyState } from '../../components/common/Feedback';
import Modal from '../../components/common/Modal';
import { IconShieldCheck, IconCheck, IconX } from '../../components/common/Icons';

export const ApprovalManagementPage = () => {
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('PENDING'); // PENDING or ALL
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Action modal
  const [actionTarget, setActionTarget] = useState(null);
  const [actionType, setActionType] = useState('APPROVE'); // APPROVE or REJECT
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await approvalApi.getAll();
      if (res.success) {
        setRequests(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve approval queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const displayedRequests = requests.filter((r) => {
    if (activeTab === 'PENDING') return r.status === 'PENDING';
    return true;
  });

  const handleOpenActionModal = (req, type) => {
    setActionTarget(req);
    setActionType(type);
    setComment(type === 'APPROVE' ? 'Approved for operational deployment' : '');
    setError('');
    setSuccess('');
  };

  const handleExecuteAction = async (e) => {
    e.preventDefault();
    if (!actionTarget) return;

    setSubmitting(true);
    setError('');

    try {
      if (actionType === 'APPROVE') {
        const res = await approvalApi.approve(actionTarget.id, { comment });
        if (res.success) {
          setSuccess(`Approved request for ${actionTarget.quantity} units of ${actionTarget.resourceName}.`);
          setActionTarget(null);
          fetchRequests();
        }
      } else {
        const res = await approvalApi.reject(actionTarget.id, { comment });
        if (res.success) {
          setSuccess(`Rejected request for ${actionTarget.resourceName}.`);
          setActionTarget(null);
          fetchRequests();
        }
      }
    } catch (err) {
      setError(err.message || 'Action failed');
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
            <h2 className="card-title">Resource Approval Workflow</h2>
            <p className="card-subtitle">
              Review event coordinator equipment requests, allocate quotas, and update inventory
            </p>
          </div>
        </div>

        <div className="card-body">
          <div className="tabs-container">
            <button
              className={`tab-btn ${activeTab === 'PENDING' ? 'active' : ''}`}
              onClick={() => setActiveTab('PENDING')}
            >
              Pending Decisions ({requests.filter((r) => r.status === 'PENDING').length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'ALL' ? 'active' : ''}`}
              onClick={() => setActiveTab('ALL')}
            >
              All Requisitions ({requests.length})
            </button>
          </div>

          {loading ? (
            <LoadingSpinner text="Retrieving approval requisitions..." />
          ) : displayedRequests.length > 0 ? (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Requisition Details</th>
                    <th>Target Event</th>
                    <th>Quantity</th>
                    <th>Requested By</th>
                    <th>Request Date</th>
                    <th>Decision</th>
                    <th>Decision Notes</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedRequests.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{r.resourceName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {r.purpose || 'No purpose notes provided'}
                        </div>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>{r.eventName}</td>
                      <td style={{ fontWeight: 600, color: 'var(--primary)' }}>
                        {r.quantity} units
                      </td>
                      <td>
                        <div>{r.requestedByName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {r.requestedByEmail}
                        </div>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {r.requestedAt ? new Date(r.requestedAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td>
                        <StatusBadge status={r.status} />
                      </td>
                      <td style={{ fontSize: '0.8rem', maxWidth: '180px' }}>
                        {r.approverComments || (r.status === 'PENDING' ? 'Pending Review' : 'None')}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {r.status === 'PENDING' ? (
                          <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleOpenActionModal(r, 'APPROVE')}
                              title="Approve Requisition"
                            >
                              <IconCheck size={14} />
                              <span>Approve</span>
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleOpenActionModal(r, 'REJECT')}
                              title="Reject Requisition"
                            >
                              <IconX size={14} />
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Decision Recorded
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title={activeTab === 'PENDING' ? 'No pending requisitions' : 'No requisitions found'}
              message={
                activeTab === 'PENDING'
                  ? 'All equipment requisitions have been resolved.'
                  : 'No equipment requests have been filed yet.'
              }
            />
          )}
        </div>
      </div>

      {/* Decision Modal */}
      <Modal
        isOpen={!!actionTarget}
        onClose={() => setActionTarget(null)}
        title={`${actionType === 'APPROVE' ? 'Approve' : 'Reject'} Resource Requisition`}
        maxWidth="500px"
      >
        <form onSubmit={handleExecuteAction}>
          <div style={{ marginBottom: '1.25rem', padding: '0.85rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
            <div><strong>Equipment:</strong> {actionTarget?.resourceName}</div>
            <div><strong>Event:</strong> {actionTarget?.eventName}</div>
            <div><strong>Quantity:</strong> {actionTarget?.quantity} units</div>
            <div><strong>Requested By:</strong> {actionTarget?.requestedByName}</div>
            <div><strong>Purpose:</strong> {actionTarget?.purpose}</div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="decision-notes">
              Reviewer Comments / Justification
            </label>
            <textarea
              id="decision-notes"
              className="form-control"
              rows={3}
              placeholder={
                actionType === 'APPROVE'
                  ? 'Enter approval notes and pickup instructions...'
                  : 'State reasons for rejection or offer alternatives...'
              }
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required={actionType === 'REJECT'}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setActionTarget(null)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn ${actionType === 'APPROVE' ? 'btn-success' : 'btn-danger'}`}
              disabled={submitting}
            >
              {submitting
                ? 'Processing...'
                : actionType === 'APPROVE'
                ? 'Confirm Approval'
                : 'Confirm Rejection'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ApprovalManagementPage;
