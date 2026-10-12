import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi, taskApi, announcementApi } from '../../api';
import KpiCard from '../../components/common/KpiCard';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import { LoadingSpinner, AlertMessage, EmptyState } from '../../components/common/Feedback';
import { IconCheckSquare, IconBell, IconCalendar } from '../../components/common/Icons';

export const VolunteerDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [myTasks, setMyTasks] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dashRes, tasksRes, annRes] = await Promise.all([
        dashboardApi.getVolunteerStats(),
        taskApi.getMyTasks(),
        announcementApi.getAll(),
      ]);

      if (dashRes.success) setStats(dashRes.data);
      if (tasksRes.success) setMyTasks(tasksRes.data);
      if (annRes.success) setAnnouncements(annRes.data);
    } catch (err) {
      setError(err.message || 'Failed to retrieve volunteer workspace');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading volunteer dashboard..." />;
  }

  return (
    <div>
      <AlertMessage type="danger" message={error} onClose={() => setError('')} />

      {/* KPI Cards */}
      <div className="kpi-grid">
        <KpiCard
          title="Assigned Tasks"
          value={stats?.totalTasks}
          meta="Deliverables assigned to you"
          icon={IconCheckSquare}
          color="purple"
        />
        <KpiCard
          title="Pending Action"
          value={stats?.pendingTasks}
          meta="Awaiting commencement"
          icon={IconCheckSquare}
          color="orange"
        />
        <KpiCard
          title="In Progress"
          value={stats?.inProgressTasks}
          meta="Currently being executed"
          icon={IconCheckSquare}
          color="blue"
        />
        <KpiCard
          title="Completed"
          value={stats?.completedTasks}
          meta="Successfully submitted"
          icon={IconCheckSquare}
          color="green"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* My Priority Tasks */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <div>
              <h2 className="card-title">My Assigned Tasks</h2>
              <p className="card-subtitle">Immediate operational duties and deadlines</p>
            </div>
            <Link to="/volunteer/tasks" className="btn btn-primary btn-sm">
              Update My Tasks
            </Link>
          </div>
          <div className="table-container">
            {myTasks.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Priority</th>
                    <th>Deadline</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myTasks.slice(0, 5).map((t) => (
                    <tr key={t.id}>
                      <td style={{ fontWeight: 600 }}>{t.title}</td>
                      <td>
                        <PriorityBadge priority={t.priority} />
                      </td>
                      <td style={{ fontSize: '0.825rem', color: 'var(--secondary)' }}>
                        {t.deadline || 'No deadline'}
                      </td>
                      <td>
                        <StatusBadge status={t.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState
                title="No tasks assigned"
                message="Your team lead or coordinator has not assigned any tasks yet."
              />
            )}
          </div>
        </div>

        {/* Operational Announcements */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <div>
              <h2 className="card-title">Announcements & Briefings</h2>
              <p className="card-subtitle">Official directives from event coordinators and admin</p>
            </div>
          </div>
          <div className="card-body">
            {announcements.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {announcements.slice(0, 4).map((ann) => (
                  <div
                    key={ann.id}
                    style={{
                      padding: '0.85rem',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-surface)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{ann.title}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {ann.createdAt ? new Date(ann.createdAt).toLocaleDateString() : ''}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.825rem', color: 'var(--secondary)' }}>
                      {ann.message}
                    </p>
                    {ann.eventName && (
                      <div style={{ marginTop: '0.4rem', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 500 }}>
                        Event: {ann.eventName}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No announcements" message="No recent notices posted." />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboardPage;
