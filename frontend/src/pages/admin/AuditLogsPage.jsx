import React, { useState, useEffect } from 'react';
import { auditLogApi } from '../../api';
import { LoadingSpinner, AlertMessage, EmptyState } from '../../components/common/Feedback';
import Pagination from '../../components/common/Pagination';
import { IconSearch } from '../../components/common/Icons';

export const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter
  const [entityFilter, setEntityFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchLogs = async (currentPage = 0) => {
    try {
      setLoading(true);
      const res = await auditLogApi.search({
        entityName: entityFilter || null,
        query: searchQuery || null,
        page: currentPage,
        size: 15,
      });

      if (res.success && res.data) {
        setLogs(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
        setTotalElements(res.data.totalElements || 0);
        setPage(res.data.number || 0);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch audit records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(0);
  }, [entityFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLogs(0);
  };

  return (
    <div>
      <AlertMessage type="danger" message={error} onClose={() => setError('')} />

      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">System Audit Trail & Security Logs</h2>
            <p className="card-subtitle">
              Immutable record of operational mutations, approvals, and authentication events
            </p>
          </div>
        </div>

        <div className="card-body">
          <form onSubmit={handleSearchSubmit} className="toolbar">
            <div className="search-box">
              <span className="search-icon">
                <IconSearch size={16} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search audit trail by user, action, details..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <select
                className="form-control"
                style={{ width: '180px' }}
                value={entityFilter}
                onChange={(e) => setEntityFilter(e.target.value)}
              >
                <option value="">All Entities</option>
                <option value="Event">Event</option>
                <option value="Team">Team</option>
                <option value="TeamMember">TeamMember</option>
                <option value="Task">Task</option>
                <option value="Resource">Resource</option>
                <option value="ResourceRequest">ResourceRequest</option>
                <option value="Vendor">Vendor</option>
                <option value="User">User</option>
                <option value="System">System</option>
              </select>

              <button type="submit" className="btn btn-secondary">
                Search
              </button>
            </div>
          </form>

          {loading ? (
            <LoadingSpinner text="Retrieving audit records..." />
          ) : logs.length > 0 ? (
            <>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Initiator</th>
                      <th>Action</th>
                      <th>Entity</th>
                      <th>Audit Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id}>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td style={{ fontWeight: 600, fontSize: '0.85rem' }}>{log.userEmail}</td>
                        <td>
                          <span className="badge badge-purple">{log.action}</span>
                        </td>
                        <td style={{ color: 'var(--secondary)' }}>{log.entityName}</td>
                        <td style={{ fontSize: '0.85rem' }}>{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalElements={totalElements}
                pageSize={15}
                onPageChange={(p) => fetchLogs(p)}
              />
            </>
          ) : (
            <EmptyState
              title="No audit entries found"
              message="No records matched your search parameters."
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditLogsPage;
