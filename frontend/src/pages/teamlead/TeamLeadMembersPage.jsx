import React, { useState, useEffect } from 'react';
import { teamApi } from '../../api';
import { LoadingSpinner, AlertMessage, EmptyState } from '../../components/common/Feedback';

export const TeamLeadMembersPage = () => {
  const [ledTeams, setLedTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLedTeams = async () => {
    try {
      setLoading(true);
      const res = await teamApi.getMyLedTeams();
      if (res.success && res.data.length > 0) {
        setLedTeams(res.data);
        setSelectedTeamId(res.data[0].id);
        loadMembers(res.data[0].id);
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve team');
    } finally {
      setLoading(false);
    }
  };

  const loadMembers = async (teamId) => {
    try {
      const res = await teamApi.getMembers(teamId);
      if (res.success) {
        setMembers(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve team roster');
    }
  };

  useEffect(() => {
    fetchLedTeams();
  }, []);

  const handleSelectTeam = (e) => {
    const tid = e.target.value;
    setSelectedTeamId(tid);
    loadMembers(tid);
  };

  return (
    <div>
      <AlertMessage type="danger" message={error} onClose={() => setError('')} />

      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Team Roster & Volunteer Allocation</h2>
            <p className="card-subtitle">
              Members enrolled in the operational committee under your supervision
            </p>
          </div>
          {ledTeams.length > 1 && (
            <select
              className="form-control"
              style={{ width: '220px' }}
              value={selectedTeamId}
              onChange={handleSelectTeam}
            >
              {ledTeams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="card-body">
          {loading ? (
            <LoadingSpinner text="Loading roster..." />
          ) : members.length > 0 ? (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Member Name</th>
                    <th>Email Address</th>
                    <th>Role in Committee</th>
                    <th>Joined At</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m) => (
                    <tr key={m.id}>
                      <td style={{ fontWeight: 600 }}>{m.userName}</td>
                      <td>{m.userEmail}</td>
                      <td>
                        <span className="badge badge-purple">{m.roleInTeam}</span>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {m.joinedAt ? new Date(m.joinedAt).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="No members enrolled"
              message="No volunteers assigned to this committee roster yet."
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamLeadMembersPage;
