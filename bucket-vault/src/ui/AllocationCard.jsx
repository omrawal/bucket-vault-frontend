import React from 'react';
function AllocationCard({ title, growthPct, safetyPct }) {
  return (
    <div className="panel">
      <h3 className="panel-title">{title}</h3>
      <div className="allocation-bar">
        <div
          className="allocation-growth"
          style={{ width: `${growthPct}%` }}
          title={`Growth ${growthPct}%`}
        />
        <div
          className="allocation-safety"
          style={{ width: `${safetyPct}%` }}
          title={`Safety ${safetyPct}%`}
        />
      </div>
      <div className="allocation-legend">
        <span className="legend growth">Growth: {growthPct}%</span>
        <span className="legend safety">Safety: {safetyPct}%</span>
      </div>
    </div>
  );
}

export default AllocationCard;
