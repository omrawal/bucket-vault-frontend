import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import StatMetricCard from '../ui/StatMetricCard.jsx';
import apiClient from '../api/client.js';
import { API_URLS } from '../api/urls.js';

const COLORS = {
  primary: '#2563eb',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  purple: '#a855f7',
  cyan: '#06b6d4',
};

const CATEGORY_COLORS = ['#2563eb', '#22c55e', '#f59e0b', '#ef4444', '#a855f7', '#06b6d4', '#8b5cf6', '#ec4899'];

function StatisticsPage() {
  const { selectedPortfolio } = usePortfolio();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('6months'); // 3months, 6months, 1year, all
  
  // Data states
  const [metrics, setMetrics] = useState({
    netWorth: 0,
    monthlyChange: 0,
    avgSavings: 0,
    topCategory: '-',
  });
  const [networthHistory, setNetworthHistory] = useState([]);
  const [incomeExpenseData, setIncomeExpenseData] = useState([]);
  const [categorySpending, setCategorySpending] = useState([]);
  const [categoryTrends, setCategoryTrends] = useState([]);
  const [accountBalances, setAccountBalances] = useState([]);

  useEffect(() => {
    if (selectedPortfolio) {
      fetchAllStatistics();
    }
  }, [selectedPortfolio, timeRange]);

  const fetchAllStatistics = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ 
        portfolio_id: selectedPortfolio,
        period: timeRange,
      });

      // Fetch all statistics data in parallel
      const [metricsRes, networthRes, incomeExpenseRes, categoryRes, trendsRes, accountsRes] = 
        await Promise.all([
          apiClient.get(`${API_URLS.get_metrics}?${params}`),
          apiClient.get(`${API_URLS.get_networth_history}?${params}`),
          apiClient.get(`${API_URLS.get_income_expense_trend}?${params}`),
          apiClient.get(`${API_URLS.get_category_spending}?${params}`),
          apiClient.get(`${API_URLS.get_category_trends}?${params}`),
          apiClient.get(`${API_URLS.get_account_balances}?${params}`),
        ]);

      setMetrics(metricsRes.data);
      setNetworthHistory(networthRes.data);
      setIncomeExpenseData(incomeExpenseRes.data);
      setCategorySpending(categoryRes.data);
      setCategoryTrends(trendsRes.data);
      setAccountBalances(accountsRes.data);
    } catch (err) {
      console.error('Failed to fetch statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: ₹{entry.value.toLocaleString('en-IN')}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading-spinner">
          <p>Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (!selectedPortfolio) {
    return (
      <div className="page">
        <p className="auth-error">Please select a portfolio first.</p>
      </div>
    );
  }

  return (
    <div className="page statistics-page">
      <div className="page-header">
        <h2 className="page-title">Statistics & Analytics</h2>
        <div className="time-range-selector">
          <button
            className={`time-btn ${timeRange === '3months' ? 'active' : ''}`}
            onClick={() => setTimeRange('3months')}
          >
            3M
          </button>
          <button
            className={`time-btn ${timeRange === '6months' ? 'active' : ''}`}
            onClick={() => setTimeRange('6months')}
          >
            6M
          </button>
          <button
            className={`time-btn ${timeRange === '1year' ? 'active' : ''}`}
            onClick={() => setTimeRange('1year')}
          >
            1Y
          </button>
          <button
            className={`time-btn ${timeRange === 'all' ? 'active' : ''}`}
            onClick={() => setTimeRange('all')}
          >
            All
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid-4">
        <StatMetricCard
          label="Current Net Worth"
          value={metrics.netWorth.toLocaleString('en-IN')}
          prefix="₹"
          change={metrics.monthlyChange}
        />
        <StatMetricCard
          label="Monthly Change"
          value={Math.abs(metrics.monthlyChange).toFixed(1)}
          suffix="%"
          change={metrics.monthlyChange}
        />
        <StatMetricCard
          label="Avg Monthly Savings"
          value={metrics.avgSavings.toLocaleString('en-IN')}
          prefix="₹"
        />
        <StatMetricCard
          label="Top Expense Category"
          value={metrics.topCategory}
        />
      </div>

      {/* Net Worth Growth - Full Width */}
      <div className="chart-panel full-width">
        <h3 className="panel-title">Net Worth Growth</h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={networthHistory}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.success} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={COLORS.success} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorSafety" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.cyan} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={COLORS.cyan} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="total_networth"
              name="Total Net Worth"
              stroke={COLORS.primary}
              fillOpacity={1}
              fill="url(#colorTotal)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="growth_total"
              name="Growth Bucket"
              stroke={COLORS.success}
              fillOpacity={1}
              fill="url(#colorGrowth)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="safety_total"
              name="Safety Bucket"
              stroke={COLORS.cyan}
              fillOpacity={1}
              fill="url(#colorSafety)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Income vs Expenses + Category Breakdown */}
      <div className="grid-2">
        <div className="chart-panel">
          <h3 className="panel-title">Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={incomeExpenseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="income" name="Income" fill={COLORS.success} radius={[8, 8, 0, 0]} />
              <Bar dataKey="expense" name="Expenses" fill={COLORS.danger} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-panel">
          <h3 className="panel-title">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categorySpending}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {categorySpending.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Trends - Full Width */}
      <div className="chart-panel full-width">
        <h3 className="panel-title">Category Spending Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={categoryTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {Object.keys(categoryTrends[0] || {})
              .filter(key => key !== 'month')
              .map((category, index) => (
                <Line
                  key={category}
                  type="monotone"
                  dataKey={category}
                  stroke={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Account Balances - Full Width */}
      <div className="chart-panel full-width">
        <h3 className="panel-title">Account Balances Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={accountBalances} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis type="number" stroke="#94a3b8" />
            <YAxis type="category" dataKey="account" stroke="#94a3b8" width={150} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="balance" fill={COLORS.primary} radius={[0, 8, 8, 0]}>
              {accountBalances.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.bucket === 'Growth' ? COLORS.success : COLORS.cyan} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default StatisticsPage;