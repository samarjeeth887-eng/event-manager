import React, { useState, useEffect } from 'react';
import { dashboardApi, eventApi, resourceApi, vendorApi } from '../../api';
import { LoadingSpinner, AlertMessage } from '../../components/common/Feedback';
import StatusBadge from '../../components/common/StatusBadge';

export const ReportsPage = () => {
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [resources, setResources] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dashRes, eventsRes, resRes, venRes] = await Promise.all([
        dashboardApi.getAdminStats(),
        eventApi.getAll(),
        resourceApi.getAll(),
        vendorApi.getAll(),
      ]);

      if (dashRes.success) setStats(dashRes.data);
      if (eventsRes.success) setEvents(eventsRes.data);
      if (resRes.success) setResources(resRes.data);
      if (venRes.success) setVendors(venRes.data);
    } catch (err) {
      setError(err.message || 'Failed to generate operational report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Computing operational report analytics..." />;
  }

  const totalTasks = stats?.totalTasks || 0;
  const taskCompletionRate =
    totalTasks > 0 ? Math.round(((stats?.completedTasks || 0) / totalTasks) * 100) : 0;

  const totalResources = stats?.totalResources || 0;
  const resourceAllocationRate =
    totalResources > 0 ? Math.round(((stats?.allocatedResources || 0) / totalResources) * 100) : 0;

  const totalBudget = events.reduce((acc, ev) => acc + (ev.budget || 0), 0);
  const totalVendorSpend = vendors.reduce((acc, v) => acc + (v.contractAmount || 0), 0);

  return (
    <div>
      <AlertMessage type="danger" message={error} onClose={() => setError('')} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Operational Analytics & Executive Reports</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Consolidated operational health across events, tasks, resources, and vendor contracts
          </p>
        </div>
        <button className="btn btn-secondary" onClick={() => window.print()}>
          Print Summary
        </button>
      </div>

      {/* High-level performance cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ marginBottom: 0, padding: '1.5rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Task Completion Rate
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)', marginTop: '0.35rem' }}>
            {taskCompletionRate}%
          </div>
          <div style={{ marginTop: '0.5rem', height: '8px', background: 'var(--bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${taskCompletionRate}%`, height: '100%', background: 'var(--success)' }}></div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            {stats?.completedTasks || 0} completed of {totalTasks} total tasks
          </div>
        </div>

        <div className="card" style={{ marginBottom: 0, padding: '1.5rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Equipment Allocation Index
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)', marginTop: '0.35rem' }}>
            {resourceAllocationRate}%
          </div>
          <div style={{ marginTop: '0.5rem', height: '8px', background: 'var(--bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${resourceAllocationRate}%`, height: '100%', background: 'var(--primary)' }}></div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            {stats?.allocatedResources || 0} allocated of {totalResources} pool units
          </div>
        </div>

        <div className="card" style={{ marginBottom: 0, padding: '1.5rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Procurement Commitment
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.35rem' }}>
            INR {totalVendorSpend.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
            Committed across {vendors.length} vendor contracts (Total Event Budget: INR {totalBudget.toLocaleString()})
          </div>
        </div>
      </div>

      {/* Event Financial & Operational Breakdown */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Event Operational & Budget Summary</h3>
            <p className="card-subtitle">Breakdown by schedule, status, and allocation capacity</p>
          </div>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Participant Limit</th>
                <th>Budget (INR)</th>
                <th>Schedule</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev.id}>
                  <td style={{ fontWeight: 600 }}>{ev.name}</td>
                  <td>{ev.category}</td>
                  <td>
                    <StatusBadge status={ev.status} />
                  </td>
                  <td>{ev.maxParticipants || 'N/A'}</td>
                  <td style={{ fontWeight: 600 }}>
                    INR {Number(ev.budget || 0).toLocaleString()}
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>
                    {ev.startDate} to {ev.endDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Equipment Pool Inventory Health */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Equipment Inventory Utilization</h3>
            <p className="card-subtitle">Current stock levels vs allocations across university venues</p>
          </div>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Equipment Name</th>
                <th>Category</th>
                <th>Total Pool</th>
                <th>Available</th>
                <th>Allocated</th>
                <th>Unit Value</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((r) => {
                const allocated = Math.max(0, r.totalQuantity - r.availableQuantity);
                return (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600 }}>{r.name}</td>
                    <td>{r.category}</td>
                    <td>{r.totalQuantity}</td>
                    <td style={{ color: 'var(--success)', fontWeight: 600 }}>{r.availableQuantity}</td>
                    <td style={{ color: 'var(--warning)', fontWeight: 600 }}>{allocated}</td>
                    <td>INR {Number(r.unitCost || 0).toLocaleString()}</td>
                    <td>
                      <StatusBadge status={r.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
