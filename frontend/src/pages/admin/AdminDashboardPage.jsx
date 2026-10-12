import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../../api';
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
  IconActivity,
  IconTruck,
} from '../../components/common/Icons';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await dashboardApi.getAdminStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch executive dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Retrieving operational metrics from database..." />;
  }

  return (
    <div>
      <AlertMessage type="danger" message={error} onClose={() => setError('')} />

      {/* KPI Cards Section */}
      <div className="kpi-grid">
        <KpiCard
          title="Total Events"
          value={stats?.totalEvents}
          meta={`${stats?.activeEvents || 0} active | ${stats?.upcomingEvents || 0} upcoming`}
          icon={IconCalendar}
          color="purple"
        />
        <KpiCard
          title="Active Events"
          value={stats?.activeEvents}
          meta="Currently executing on campus"
          icon={IconActivity}
          color="blue"
        />
        <KpiCard
          title="Upcoming Events"
          value={stats?.upcomingEvents}
          meta="Scheduled for upcoming dates"
          icon={IconCalendar}
          color="purple"
        />
        <KpiCard
          title="Pending Approvals"
          value={stats?.pendingApprovals}
          meta="Requisitions requiring decision"
          icon={IconShieldCheck}
          color="orange"
        />
        <KpiCard
          title="Volunteers Enrolled"
          value={stats?.totalVolunteers}
          meta={`Out of ${stats?.totalUsers || 0} platform users`}
          icon={IconUsers}
          color="green"
        />
        <KpiCard
          title="Pending Tasks"
          value={stats?.pendingTasks}
          meta={`${stats?.inProgressTasks || 0} in progress`}
          icon={IconCheckSquare}
          color="orange"
        />
        <KpiCard
          title="Completed Tasks"
          value={stats?.completedTasks}
          meta={`Out of ${stats?.totalTasks || 0} total tasks`}
          icon={IconCheckSquare}
          color="green"
        />
        <KpiCard
          title="Resource Inventory"
          value={stats?.totalResources}
          meta={`${stats?.availableResources || 0} available | ${stats?.allocatedResources || 0} allocated`}
          icon={IconLayers}
          color="blue"
        />
      </div>

      {/* Operations Grid: Events & Tasks */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Events Overview */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <div>
              <h2 className="card-title">Event Operations Overview</h2>
              <p className="card-subtitle">Active and scheduled institutional events</p>
            </div>
            <Link to="/admin/events" className="btn btn-secondary btn-sm">
              View All Events
            </Link>
          </div>
          <div className="table-container">
            {stats?.recentEvents?.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Event Name</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Start Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentEvents.map((ev) => (
                    <tr key={ev.id}>
                      <td style={{ fontWeight: 600 }}>{ev.name}</td>
                      <td>{ev.category}</td>
                      <td>
                        <StatusBadge status={ev.status} />
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>{ev.startDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState title="No active events" message="Create an event to commence operations." />
            )}
          </div>
        </div>

        {/* Urgent Task Overview */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <div>
              <h2 className="card-title">Priority Task Queue</h2>
              <p className="card-subtitle">Urgent operational items nearing deadlines</p>
            </div>
            <Link to="/admin/tasks" className="btn btn-secondary btn-sm">
              View All Tasks
            </Link>
          </div>
          <div className="table-container">
            {stats?.urgentTasks?.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Assignee</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.urgentTasks.map((t) => (
                    <tr key={t.id}>
                      <td style={{ fontWeight: 600 }}>{t.title}</td>
                      <td>{t.assignedUserName || 'Unassigned'}</td>
                      <td>
                        <PriorityBadge priority={t.priority} />
                      </td>
                      <td>
                        <StatusBadge status={t.status} />
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>{t.deadline}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState title="No urgent tasks" message="All critical deliverables are on track." />
            )}
          </div>
        </div>
      </div>

      {/* Resource & Approval Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Pending Requisitions */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <div>
              <h2 className="card-title">Pending Resource Requisitions</h2>
              <p className="card-subtitle">Equipment & facility requests awaiting admin approval</p>
            </div>
            <Link to="/admin/approvals" className="btn btn-secondary btn-sm">
              Review Approvals
            </Link>
          </div>
          <div className="table-container">
            {stats?.pendingRequestsList?.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Resource</th>
                    <th>Event</th>
                    <th>Qty</th>
                    <th>Requested By</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.pendingRequestsList.map((req) => (
                    <tr key={req.id}>
                      <td style={{ fontWeight: 600 }}>{req.resourceName}</td>
                      <td>{req.eventName}</td>
                      <td>{req.quantity}</td>
                      <td>{req.requestedByName}</td>
                      <td>
                        <StatusBadge status={req.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState title="No pending requisitions" message="All equipment requests have been reviewed." />
            )}
          </div>
        </div>

        {/* Real Audit Activity */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <div>
              <h2 className="card-title">System Audit Log</h2>
              <p className="card-subtitle">Live immutable audit trail of operational changes</p>
            </div>
            <Link to="/admin/audit-logs" className="btn btn-secondary btn-sm">
              Full Audit Trail
            </Link>
          </div>
          <div className="table-container">
            {stats?.recentActivities?.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Entity</th>
                    <th>Initiator</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentActivities.slice(0, 5).map((act) => (
                    <tr key={act.id}>
                      <td>
                        <span className="badge badge-purple">{act.action}</span>
                      </td>
                      <td>{act.entityName}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{act.userEmail}</td>
                      <td>{act.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState title="No audit entries" message="Audit logs will appear as actions occur." />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
