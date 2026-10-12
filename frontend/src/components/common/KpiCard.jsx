import React from 'react';

export const KpiCard = ({ title, value, meta, color = 'purple', icon: Icon }) => {
  return (
    <div className="kpi-card">
      <div className="kpi-header">
        <span className="kpi-title">{title}</span>
        {Icon && (
          <div className={`kpi-icon-wrap ${color}`}>
            <Icon size={18} />
          </div>
        )}
      </div>
      <div className="kpi-value">{value !== undefined && value !== null ? value : 0}</div>
      {meta && <div className="kpi-meta">{meta}</div>}
    </div>
  );
};

export default KpiCard;
