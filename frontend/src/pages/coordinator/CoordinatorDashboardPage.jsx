import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi, approvalApi } from '../../api';
import KpiCard from '../../components/common/KpiCard';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import { LoadingSpinner, AlertMessage, EmptyState } from '../../components/common/Feedback';
import {
  IconCalendar,
  IconCheckSquare,
  IconLayers,
  IconShieldCheck,
  IconUsers,
  IconTruck,
  IconPlus,
} from '../../components/common/Icons';

export const CoordinatorDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dashRes, reqRes] = await Promise.all([
        dashboardApi.getCoordinatorStats(),
        approvalApi.getMyRequests(),
      ]);

      if (dashRes.success) setStats(dashRes.data);
      if (reqRes.success) setMyRequests(reqRes.data);
    } catch (err) {
      setError(err.message || 'Failed to load coordinator workspace');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading coordinator operations console..." />;
  }

  return (
    <div>
      <AlertMessage type="danger" message={error} onClose={() => setError('')} />

      {/* KPI Cards */}
      <div className="kpi-grid">
        <KpiCard
          title="Active Events"
          value={stats?.activeEvents}
          meta={`${stats?.totalEvents || 0} total events`}
          icon={IconCalendar}
          color="purple"
        />
        <KpiCard
          title="My Requisitions"
          value={myRequests.length}
          meta={`${myRequests.filter((r) => r.status === 'PENDING').length} pending admin review`}
          icon={IconShieldCheck}
          color="orange"
        />
        <KpiCard
          title="Active Volunteers"
          value={stats?.totalVolunteers}
          meta="Allocated across committees"
          icon={IconUsers}
          color="green"
        />
        <KpiCard
          title="Tasks In Execution"
          value={stats?.inProgressTasks}
          meta={`${stats?.completedTasks || 0} tasks resolved`}
          icon={IconCheckSquare}
          color="blue"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Managed Events */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <div>
              <h2 className="card-title">Managed Events</h2>
              <p className="card-subtitle">Active events requiring operational oversight</p>
            </div>
            <Link to="/coordinator/events" className="btn btn-secondary btn-sm">
              Event Management
            </Link>
          </div>
          <div className="table-container">
            {stats?.recentEvents?.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Category</th>
                    <th>Venue</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentEvents.map((ev) => (
                    <tr key={ev.id}>
                      <td style={{ fontWeight: 600 }}>
                        <Link to={`/events/${ev.id}`} style={{ color: 'var(--primary)' }}>
                          {ev.name}
                        </Link>
                      </td>
                      <td>{ev.category}</td>
                      <td>{ev.venue}</td>
                      <td>
                        <StatusBadge status={ev.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState title="No active events" message="No events currently assigned." />
            )}
          </div>
        </div>

        {/* My Resource Requests */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <div>
              <h2 className="card-title">My Resource Requisitions</h2>
              <p className="card-subtitle">Equipment & venue requisitions submitted to Admin</p>
            </div>
            <Link to="/coordinator/resources" className="btn btn-secondary btn-sm">
              <IconPlus size={14} />
              <span>New Request</span>
            </Link>
          </div>
          <div className="table-container">
            {myRequests.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Equipment</th>
                    <th>Event</th>
                    <th>Qty</th>
                    <th>Decision</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {myRequests.slice(0, 5).map((req) => (
                    <tr key={req.id}>
                      <td style={{ fontWeight: 600 }}>{req.resourceName}</td>
                      <td>{req.eventName}</td>
                      <td>{req.quantity}</td>
                      <td>
                        <StatusBadge status={req.status} />
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {req.approverComments || 'Pending review'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState title="No requisitions" message="Submit a requisition to request event equipment." />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoordinatorDashboardPage;
