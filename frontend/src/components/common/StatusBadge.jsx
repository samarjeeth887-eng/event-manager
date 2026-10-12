import React from 'react';

const statusClassMap = {
  // Events
  DRAFT: 'badge-gray',
  UPCOMING: 'badge-blue',
  ONGOING: 'badge-purple',
  COMPLETED: 'badge-green',
  CANCELLED: 'badge-red',

  // Tasks
  PENDING: 'badge-orange',
  IN_PROGRESS: 'badge-blue',

  // Approvals
  APPROVED: 'badge-green',
  REJECTED: 'badge-red',

  // Payment
  PARTIALLY_PAID: 'badge-orange',
  PAID: 'badge-green',

  // Resource & Team
  AVAILABLE: 'badge-green',
  PARTIALLY_ALLOCATED: 'badge-orange',
  OUT_OF_STOCK: 'badge-red',
  ACTIVE: 'badge-green',
  INACTIVE: 'badge-gray',
};

const statusLabelMap = {
  IN_PROGRESS: 'In Progress',
  PARTIALLY_PAID: 'Partially Paid',
  PARTIALLY_ALLOCATED: 'Partially Allocated',
  OUT_OF_STOCK: 'Out of Stock',
};

export const StatusBadge = ({ status }) => {
  if (!status) return null;
  const normalized = String(status).toUpperCase();
  const className = statusClassMap[normalized] || 'badge-gray';
  const label = statusLabelMap[normalized] || normalized.replace(/_/g, ' ');

  return <span className={`badge ${className}`}>{label}</span>;
};

export default StatusBadge;
