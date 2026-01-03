import React from 'react';
function MetricCard({ label, value, prefix }) {
  return (
    <div className="panel metric-card">
      <span className="metric-label">{label}</span>
      <span className="metric-value">
        {prefix} {value}
      </span>
    </div>
  );
}

export default MetricCard;
