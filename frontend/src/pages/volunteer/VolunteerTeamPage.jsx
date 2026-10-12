import React, { useState, useEffect } from 'react';
import { teamApi } from '../../api';
import { LoadingSpinner, AlertMessage, EmptyState } from '../../components/common/Feedback';
import StatusBadge from '../../components/common/StatusBadge';

export const VolunteerTeamPage = () => {
  const [myTeams, setMyTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMyTeams = async () => {
    try {
      setLoading(true);
      const res = await teamApi.getMyTeams();
      if (res.success) {
        setMyTeams(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve team allocation');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTeams();
  }, []);

  return (
    <div>
      <AlertMessage type="danger" message={error} onClose={() => setError('')} />

      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">My Committees & Team Allocations</h2>
            <p className="card-subtitle">
              Operational teams where you are enrolled to execute event duties
            </p>
          </div>
        </div>

        <div className="card-body">
          {loading ? (
            <LoadingSpinner text="Loading your team assignments..." />
          ) : myTeams.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {myTeams.map((team) => (
                <div
                  key={team.id}
                  style={{
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem',
                    background: 'var(--bg-surface)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{team.name}</h3>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Event: {team.eventName}
                      </div>
                    </div>
                    <StatusBadge status={team.status} />
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--secondary)', marginBottom: '1rem' }}>
                    {team.description || 'General operational committee duties.'}
                  </p>

                  <div style={{ fontSize: '0.825rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                    <div style={{ color: 'var(--text-muted)' }}>Designated Team Lead:</div>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)', marginTop: '0.15rem' }}>
                      {team.teamLeadName || 'Unassigned'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Not yet enrolled in a team"
              message="Coordinators will allocate you to committees based on your skills and preferences."
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerTeamPage;
