import React from 'react';

export const LoadingSpinner = ({ text = 'Loading operations data...' }) => (
  <div className="loading-container">
    <div className="spinner"></div>
    <span>{text}</span>
  </div>
);

export const EmptyState = ({ title = 'No records found', message = 'There is currently no data to display for this view.', actionText, onAction }) => (
  <div className="empty-state">
    <div className="empty-state-title">{title}</div>
    <div className="empty-state-desc">{message}</div>
    {actionText && onAction && (
      <button className="btn btn-primary btn-sm" onClick={onAction}>
        {actionText}
      </button>
    )}
  </div>
);

export const AlertMessage = ({ type = 'danger', message, onClose }) => {
  if (!message) return null;
  return (
    <div className={`alert alert-${type}`}>
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 'bold' }}
        >
          Dismiss
        </button>
      )}
    </div>
  );
};
