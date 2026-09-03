import React, { useEffect, useState } from 'react';
import api from '../api.js';

export default function Analytics() {
  const [workload, setWorkload] = useState([]);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.get('/analytics/workload').then(r => setWorkload(r.data));
    api.get('/analytics/summary').then(r => setSummary(r.data));
  }, []);

  const maxLoad = Math.max(1, ...workload.map(w => w.active_cases));

  return (
    <div>
      <div className="page-header">
        <h1>Judicial Workload Analytics</h1>
        <p className="muted">Live distribution of active cases across judges</p>
      </div>

      <div className="card">
        <h3>Active Case Load by Judge</h3>
        {workload.map(j => (
          <div className="bar-row" key={j.judge_id}>
            <span className="bar-label">{j.judge_name}</span>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${(j.active_cases / maxLoad) * 100}%` }} />
            </div>
            <span className="bar-count">{j.active_cases} active / {j.total_cases} total</span>
          </div>
        ))}
        {!workload.length && <p className="empty">No judges with assigned cases yet.</p>}
      </div>

      {summary && (
        <div className="card">
          <h3>Report Summary</h3>
          <ul className="report-list">
            <li>Total cases filed: <strong>{summary.totalCases}</strong></li>
            <li>Documents processed by AI classifier: <strong>{summary.totalDocuments}</strong></li>
            <li>Hearings scheduled: <strong>{summary.totalHearings}</strong></li>
            <li>Average resolution time: <strong>{summary.avgResolutionDays ?? 'Not enough closed cases yet'}</strong> {summary.avgResolutionDays ? 'days' : ''}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
