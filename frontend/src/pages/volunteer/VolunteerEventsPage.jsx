import React, { useState, useEffect } from 'react';
import { eventApi } from '../../api';
import { LoadingSpinner, AlertMessage } from '../../components/common/Feedback';
import StatusBadge from '../../components/common/StatusBadge';

export const VolunteerEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await eventApi.getAll();
      if (res.success) {
        setEvents(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve event schedule');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div>
      <AlertMessage type="danger" message={error} onClose={() => setError('')} />

      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Campus Event Calendar & Operational Briefs</h2>
            <p className="card-subtitle">
              Schedules, locations, and organizing departments for campus events
            </p>
          </div>
        </div>

        <div className="card-body">
          {loading ? (
            <LoadingSpinner text="Retrieving event schedules..." />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
              {events.map((ev) => (
                <div
                  key={ev.id}
                  style={{
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem',
                    background: 'var(--bg-surface)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <span className="badge badge-purple">{ev.category}</span>
                    <StatusBadge status={ev.status} />
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                    {ev.name}
                  </h3>

                  <p style={{ fontSize: '0.825rem', color: 'var(--secondary)', marginBottom: '0.85rem' }}>
                    {ev.description}
                  </p>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.35rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                    <div><strong>Venue:</strong> {ev.venue}</div>
                    <div><strong>Dates:</strong> {ev.startDate} to {ev.endDate}</div>
                    <div><strong>Organizer:</strong> {ev.organizer}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerEventsPage;
