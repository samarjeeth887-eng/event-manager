import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi, teamApi, taskApi } from '../../api';
import KpiCard from '../../components/common/KpiCard';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import { LoadingSpinner, AlertMessage, EmptyState } from '../../components/common/Feedback';
import { IconUsers, IconCheckSquare, IconPlus } from '../../components/common/Icons';

export const TeamLeadDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [ledTeams, setLedTeams] = useState([]);
  const [teamTasks, setTeamTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dashRes, teamsRes] = await Promise.all([
        dashboardApi.getTeamLeadStats(),
        teamApi.getMyLedTeams(),
      ]);

      if (dashRes.success) setStats(dashRes.data);
      if (teamsRes.success) {
        setLedTeams(teamsRes.data);
        if (teamsRes.data.length > 0) {
          const tasksRes = await taskApi.getByTeam(teamsRes.data[0].id);
          if (tasksRes.success) setTeamTasks(tasksRes.data);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve team workspace');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading team lead dashboard..." />;
  }

  return (
    <div>
      <AlertMessage type="danger" message={error} onClose={() => setError('')} />

      {/* KPI Cards */}
      <div className="kpi-grid">
        <KpiCard
          title="Team Volunteers"
          value={stats?.totalVolunteers}
          meta="Members under your leadership"
          icon={IconUsers}
          color="purple"
        />
        <KpiCard
          title="Total Assigned Tasks"
          value={stats?.totalTasks}
          meta="Deliverables across committees"
          icon={IconCheckSquare}
          color="blue"
        />
        <KpiCard
          title="Tasks In Progress"
          value={stats?.inProgressTasks}
          meta="Active member execution"
          icon={IconCheckSquare}
          color="orange"
        />
        <KpiCard
          title="Tasks Completed"
          value={stats?.completedTasks}
          meta="Successfully verified"
          icon={IconCheckSquare}
          color="green"
        />
      </div>

      {/* Assigned Teams Section */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Assigned Teams</h2>
            <p className="card-subtitle">Committees where you serve as designated Team Lead</p>
          </div>
          <Link to="/teamlead/tasks" className="btn btn-primary btn-sm">
            <IconPlus size={14} />
            <span>Assign Team Task</span>
          </Link>
        </div>
        <div className="table-container">
          {ledTeams.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Team Title</th>
                  <th>Assigned Event</th>
                  <th>Description</th>
                  <th>Total Members</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {ledTeams.map((t) => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 600 }}>{t.name}</td>
                    <td>{t.eventName}</td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {t.description || 'No description'}
                    </td>
                    <td>{t.memberCount} members</td>
                    <td>
                      <StatusBadge status={t.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState
              title="No teams assigned"
              message="You are not designated as lead for any teams yet."
            />
          )}
        </div>
      </div>

      {/* Team Tasks Section */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Active Team Tasks & Deadlines</h2>
            <p className="card-subtitle">Operational deliverables assigned to your committee</p>
          </div>
          <Link to="/teamlead/tasks" className="btn btn-secondary btn-sm">
            View All Tasks
          </Link>
        </div>
        <div className="table-container">
          {teamTasks.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Task Title</th>
                  <th>Assignee</th>
                  <th>Priority</th>
                  <th>Deadline</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {teamTasks.map((t) => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 600 }}>{t.title}</td>
                    <td>{t.assignedUserName || 'Unassigned'}</td>
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
              title="No tasks in queue"
              message="Create tasks to allocate responsibilities to your team members."
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamLeadDashboardPage;
