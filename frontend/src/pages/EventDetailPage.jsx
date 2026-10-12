import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { eventApi, teamApi, taskApi, vendorApi, resourceApi } from '../api';
import StatusBadge from '../components/common/StatusBadge';
import PriorityBadge from '../components/common/PriorityBadge';
import { LoadingSpinner, AlertMessage, EmptyState } from '../components/common/Feedback';
import { IconCalendar, IconUsers, IconCheckSquare, IconTruck, IconLayers } from '../components/common/Icons';

export const EventDetailPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [teams, setTeams] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [resources, setResources] = useState([]);
  const [activeTab, setActiveTab] = useState('TEAMS'); // TEAMS, TASKS, VENDORS, RESOURCES
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEventData = async () => {
    try {
      setLoading(true);
      const [evRes, teamsRes, tasksRes, venRes, resRes] = await Promise.all([
        eventApi.getById(id),
        teamApi.getByEvent(id),
        taskApi.getByEvent(id),
        vendorApi.getByEvent(id),
        resourceApi.getAll(),
      ]);

      if (evRes.success) setEvent(evRes.data);
      if (teamsRes.success) setTeams(teamsRes.data);
      if (tasksRes.success) setTasks(tasksRes.data);
      if (venRes.success) setVendors(venRes.data);
      if (resRes.success) {
        setResources(resRes.data.filter((r) => String(r.eventId) === String(id)));
      }
    } catch (err) {
      setError(err.message || 'Failed to load event operations console');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, [id]);

  if (loading) {
    return <LoadingSpinner text="Loading event operations console..." />;
  }

  if (!event) {
    return <EmptyState title="Event Not Found" message="The requested event does not exist." />;
  }

  return (
    <div>
      <AlertMessage type="danger" message={error} onClose={() => setError('')} />

      {/* Event Header Banner */}
      <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-purple">{event.category}</span>
              <StatusBadge status={event.status} />
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              {event.name}
            </h1>
            <p style={{ color: 'var(--secondary)', fontSize: '0.9rem', maxWidth: '800px', lineHeight: 1.6 }}>
              {event.description}
            </p>
          </div>

          <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', minWidth: '240px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Organizer:</div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>{event.organizer}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Venue Location:</div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>{event.venue}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Operational Schedule:</div>
            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>
              {event.startDate} to {event.endDate}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button
          className={`tab-btn ${activeTab === 'TEAMS' ? 'active' : ''}`}
          onClick={() => setActiveTab('TEAMS')}
        >
          Operational Teams ({teams.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'TASKS' ? 'active' : ''}`}
          onClick={() => setActiveTab('TASKS')}
        >
          Assigned Tasks ({tasks.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'VENDORS' ? 'active' : ''}`}
          onClick={() => setActiveTab('VENDORS')}
        >
          Contracted Vendors ({vendors.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'RESOURCES' ? 'active' : ''}`}
          onClick={() => setActiveTab('RESOURCES')}
        >
          Dedicated Equipment ({resources.length})
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'TEAMS' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Event Operational Committees</h3>
              <p className="card-subtitle">Functional divisions configured for this event</p>
            </div>
          </div>
          <div className="table-container">
            {teams.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Committee Name</th>
                    <th>Team Lead</th>
                    <th>Roster Size</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((t) => (
                    <tr key={t.id}>
                      <td style={{ fontWeight: 600 }}>{t.name}</td>
                      <td>{t.teamLeadName || 'Unassigned'}</td>
                      <td>{t.memberCount} members</td>
                      <td>
                        <StatusBadge status={t.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState title="No teams formed" message="No operational committees formed for this event yet." />
            )}
          </div>
        </div>
      )}

      {activeTab === 'TASKS' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Event Operational Deliverables</h3>
              <p className="card-subtitle">Task tracking for execution phase</p>
            </div>
          </div>
          <div className="table-container">
            {tasks.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Deliverable</th>
                    <th>Team</th>
                    <th>Assignee</th>
                    <th>Priority</th>
                    <th>Deadline</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((t) => (
                    <tr key={t.id}>
                      <td style={{ fontWeight: 600 }}>{t.title}</td>
                      <td>{t.teamName || 'General'}</td>
                      <td>{t.assignedUserName || 'Unassigned'}</td>
                      <td>
                        <PriorityBadge priority={t.priority} />
                      </td>
                      <td style={{ fontSize: '0.825rem', color: 'var(--secondary)' }}>{t.deadline || 'N/A'}</td>
                      <td>
                        <StatusBadge status={t.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState title="No tasks scheduled" message="No operational tasks configured for this event." />
            )}
          </div>
        </div>
      )}

      {activeTab === 'VENDORS' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">External Procurement & Vendors</h3>
              <p className="card-subtitle">Supplier contracts attached to this event</p>
            </div>
          </div>
          <div className="table-container">
            {vendors.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Supplier</th>
                    <th>Category</th>
                    <th>Contact</th>
                    <th>Service Scope</th>
                    <th>Contract Value</th>
                    <th>Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((v) => (
                    <tr key={v.id}>
                      <td style={{ fontWeight: 600 }}>{v.name}</td>
                      <td>{v.category}</td>
                      <td>{v.contactPerson} ({v.phone})</td>
                      <td style={{ fontSize: '0.85rem' }}>{v.service}</td>
                      <td style={{ fontWeight: 600 }}>
                        INR {Number(v.contractAmount || 0).toLocaleString()}
                      </td>
                      <td>
                        <StatusBadge status={v.paymentStatus} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState title="No vendors attached" message="No external procurement contracts assigned." />
            )}
          </div>
        </div>
      )}

      {activeTab === 'RESOURCES' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Dedicated Equipment Stock</h3>
              <p className="card-subtitle">Equipment allocated to this specific event</p>
            </div>
          </div>
          <div className="table-container">
            {resources.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Equipment</th>
                    <th>Category</th>
                    <th>Total Units</th>
                    <th>Available</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {resources.map((r) => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 600 }}>{r.name}</td>
                      <td>{r.category}</td>
                      <td>{r.totalQuantity}</td>
                      <td style={{ color: 'var(--success)', fontWeight: 600 }}>{r.availableQuantity}</td>
                      <td>
                        <StatusBadge status={r.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState title="No dedicated equipment" message="Equipment is requisitioned from the central pool." />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetailPage;
