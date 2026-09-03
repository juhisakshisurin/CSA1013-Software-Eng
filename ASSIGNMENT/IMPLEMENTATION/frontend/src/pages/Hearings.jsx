import React, { useEffect, useState } from 'react';
import api from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Hearings() {
  const { user } = useAuth();
  const canSchedule = ['admin', 'clerk'].includes(user?.role);
  const [hearings, setHearings] = useState([]);
  const [cases, setCases] = useState([]);
  const [judges, setJudges] = useState([]);
  const [form, setForm] = useState({ case_id: '', judge_id: '', hearing_date: '', hearing_time: '10:00', room: 'Room 1' });
  const [error, setError] = useState('');
  const [suggestion, setSuggestion] = useState('');

  const load = () => api.get('/hearings').then(r => setHearings(r.data));

  useEffect(() => {
    load();
    api.get('/cases').then(r => setCases(r.data));
    api.get('/analytics/workload').then(r => setJudges(r.data)).catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setSuggestion('');
    try {
      await api.post('/hearings', form);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Scheduling failed');
      if (err.response?.data?.suggestedTime) setSuggestion(err.response.data.suggestedTime);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Hearing Scheduler</h1>
        <p className="muted">Conflict-aware scheduling with automatic slot suggestions</p>
      </div>

      {error && <div className="alert alert-error">{error}{suggestion && ` — Suggested time: ${suggestion}`}</div>}

      {canSchedule && (
        <form className="card form-card" onSubmit={submit}>
          <div className="form-grid">
            <div>
              <label>Case</label>
              <select value={form.case_id} onChange={e => setForm({ ...form, case_id: e.target.value })} required>
                <option value="">Select case</option>
                {cases.map(c => <option key={c.id} value={c.id}>{c.case_number} — {c.title}</option>)}
              </select>
            </div>
            <div>
              <label>Judge</label>
              <select value={form.judge_id} onChange={e => setForm({ ...form, judge_id: e.target.value })} required>
                <option value="">Select judge</option>
                {judges.map(j => <option key={j.judge_id} value={j.judge_id}>{j.judge_name} ({j.active_cases} active)</option>)}
              </select>
            </div>
            <div>
              <label>Date</label>
              <input type="date" value={form.hearing_date} onChange={e => setForm({ ...form, hearing_date: e.target.value })} required />
            </div>
            <div>
              <label>Time</label>
              <select value={form.hearing_time} onChange={e => setForm({ ...form, hearing_time: e.target.value })}>
                {['09:00','10:00','11:00','12:00','14:00','15:00','16:00'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label>Room</label>
              <input value={form.room} onChange={e => setForm({ ...form, room: e.target.value })} />
            </div>
          </div>
          <button className="btn btn-primary" type="submit">Schedule Hearing</button>
        </form>
      )}

      <div className="card">
        <table className="table">
          <thead><tr><th>Case</th><th>Judge</th><th>Date</th><th>Time</th><th>Room</th><th>Status</th></tr></thead>
          <tbody>
            {hearings.map(h => (
              <tr key={h.id}>
                <td>{h.case_number} — {h.case_title}</td>
                <td>{h.judge_name}</td>
                <td>{new Date(h.hearing_date).toLocaleDateString()}</td>
                <td>{h.hearing_time?.slice(0,5)}</td>
                <td>{h.room}</td>
                <td><span className={`badge badge-status-${h.status}`}>{h.status}</span></td>
              </tr>
            ))}
            {!hearings.length && <tr><td colSpan="6" className="empty">No hearings scheduled.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
