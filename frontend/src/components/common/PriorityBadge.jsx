import React from 'react';

const priorityClassMap = {
  LOW: 'badge-gray',
  MEDIUM: 'badge-blue',
  HIGH: 'badge-orange',
  URGENT: 'badge-red',
};

export const PriorityBadge = ({ priority }) => {
  if (!priority) return null;
  const normalized = String(priority).toUpperCase();
  const className = priorityClassMap[normalized] || 'badge-gray';

  return <span className={`badge ${className}`}>{normalized}</span>;
};

export default PriorityBadge;
