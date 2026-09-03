import React, { useEffect, useState } from 'react';
import api from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/analytics/summary').then(r => setSummary(r.data)).catch(e => setError(e.response?.data?.error || 'Failed to load'));
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>Welcome, {user?.name}</h1>
        <p className="muted">Role: {user?.role} • Real-time snapshot of court operations</p>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      {summary && (
        <>
          <div className="stat-grid">
            <StatCard label="Total Cases" value={summary.totalCases} />
            <StatCard label="Documents Processed" value={summary.totalDocuments} />
            <StatCard label="Hearings Scheduled" value={summary.totalHearings} />
            <StatCard label="Avg. Resolution (days)" value={summary.avgResolutionDays ?? '—'} />
          </div>
          <div className="card-row">
            <DistributionCard title="Case Status" data={summary.statusDistribution} keyField="status" />
            <DistributionCard title="Case Type" data={summary.typeDistribution} keyField="case_type" />
            <DistributionCard title="Priority" data={summary.priorityDistribution} keyField="priority" />
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function DistributionCard({ title, data, keyField }) {
  const max = Math.max(1, ...data.map(d => d.count));
  return (
    <div className="card">
      <h3>{title}</h3>
      {data.map(d => (
        <div className="bar-row" key={d[keyField]}>
          <span className="bar-label">{d[keyField]}</span>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${(d.count / max) * 100}%` }} />
          </div>
          <span className="bar-count">{d.count}</span>
        </div>
      ))}
    </div>
  );
}
