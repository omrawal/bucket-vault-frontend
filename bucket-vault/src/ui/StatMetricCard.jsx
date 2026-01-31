import React from 'react';

function StatMetricCard({ label, value, change, prefix = '', suffix = '', trend }) {
  const isPositive = change >= 0;
  
  return (
    <div className="stat-metric-card">
      <div className="stat-metric-label">{label}</div>
      <div className="stat-metric-value">
        {prefix}{value}{suffix}
      </div>
      {change !== undefined && (
        <div className={`stat-metric-change ${isPositive ? 'positive' : 'negative'}`}>
          <span className="stat-trend-icon">{isPositive ? '↗' : '↘'}</span>
          {Math.abs(change).toFixed(1)}% vs last month
        </div>
      )}
    </div>
  );
}

export default StatMetricCard;