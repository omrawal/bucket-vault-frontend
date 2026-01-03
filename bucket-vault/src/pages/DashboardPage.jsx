import MetricCard from '../ui/MetricCard.jsx';
import AllocationCard from '../ui/AllocationCard.jsx';
import React, { use, useEffect, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import { API_URLS } from '../api/urls.js';

function DashboardPage() {
  const { selectedPortfolio } = usePortfolio();
  const [totalNetworth, setTotalNetworth] = useState(0);
  const [growthTotal, setGrowthTotal] = useState(0);
  const [safetyTotal, setSafetyTotal] = useState(0);
  const [growthPct, setGrowthPct] = useState(0);
  const [safetyPct, setSafetyPct] = useState(0);
  const [loading, setLoading] = useState(true);

  const getTotalNetworth = async (selectedPortfolio) => {
    console.log('Fetching total networth for portfolio:', selectedPortfolio);
    const portfolioId = selectedPortfolio || '';
    const params = new URLSearchParams({ portfolio_id: portfolioId });
    try {
      const totalNetworthResponse = await fetch(`${API_URLS.get_total_networth}?${params}`);
      if (totalNetworthResponse.ok) {
        const data = await totalNetworthResponse.json();
        setTotalNetworth(data.total_networth);
        setGrowthTotal(data.growth_total);
        setSafetyTotal(data.safety_total);
        setGrowthPct(Math.round((data.growth_total / data.total_networth) * 100));
        setSafetyPct(Math.round((data.safety_total / data.total_networth) * 100));

      } else {
        console.error('Failed to fetch total networth');
        return 0;
      }
    } catch (error) {
      console.error('Error fetching total networth:', error);
      return 0;
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (selectedPortfolio) {
      getTotalNetworth(selectedPortfolio);
    } else {
      setLoading(false);
    }
  }, [selectedPortfolio]);

  useEffect(() => {
    if (totalNetworth > 0) {
      setGrowthPct(Math.round((growthTotal / totalNetworth) * 100));
      setSafetyPct(Math.round((safetyTotal / totalNetworth) * 100));
    }
  }, [totalNetworth, growthTotal, safetyTotal]);

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
        {loading ? (
          <div className="panel">
            <p>Loading allocation...</p>
          </div>
        ) : (
          <AllocationCard
            title="Bucket Allocation"
            growthPct={growthPct}
            safetyPct={safetyPct}
          />)}
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
