import MetricCard from '../ui/MetricCard.jsx';
import AllocationCard from '../ui/AllocationCard.jsx';
import React from 'react';

function DashboardPage() {
  // Replace these with API calls later
  const totalNetworth = 1250345;
  const growthTotal = 750000;
  const safetyTotal = 500345;

  const growthPct = Math.round((growthTotal / totalNetworth) * 100);
  const safetyPct = Math.round((safetyTotal / totalNetworth) * 100);

  return (
    <div className="page">
      <h2 className="page-title">Dashboard</h2>
      <div className="grid-3">
        <MetricCard
          label="Total Net Worth"
          value={totalNetworth}
          prefix="₹"
        />
        <MetricCard label="Growth Bucket" value={growthTotal} prefix="₹" />
        <MetricCard label="Safety Bucket" value={safetyTotal} prefix="₹" />
      </div>

      <div className="grid-2">
        <AllocationCard
          title="Bucket Allocation"
          growthPct={growthPct}
          safetyPct={safetyPct}
        />
        <div className="panel">
          <h3 className="panel-title">Quick Notes</h3>
          <p className="panel-text">
            Use this dashboard to track all bank, DMAT, and other accounts, and
            see how much is in growth vs safety buckets at a glance.
          </p>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
