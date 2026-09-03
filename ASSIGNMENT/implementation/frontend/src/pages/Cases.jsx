import React, { useEffect, useState } from 'react';
import api from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

const CASE_TYPES = ['Criminal','Civil','Family','Property','Corporate','Constitutional','Tax','Labor'];
const PRIORITIES = ['low','medium','high','urgent'];

export default function Cases() {
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', description: '', case_type: 'Civil', priority: 'medium', filed_date: new Date().toISOString().split('T')[0] });

  const canCreate = ['admin', 'clerk'].includes(user?.role);

  const load = () => api.get('/cases').then(r => setCases(r.data)).catch(e => setError(e.response?.data?.error || 'Failed to load cases'));

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/cases', form);
      setShowForm(false);
      setForm({ title: '', description: '', case_type: 'Civil', priority: 'medium', filed_date: new Date().toISOString().split('T')[0] });
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create case');
    }
  };

  const updateStatus = async (id, status) => {
    await api.put(`/cases/${id}`, { status });
    load();
  };

  return (
    <div>
      <div className="page-header row">
        <div>
          <h1>Case Management</h1>
          <p className="muted">Digitized filing, tracking and status control</p>
        </div>
        {canCreate && <button className="btn btn-primary" onClick={() => setShowForm(s => !s)}>{showForm ? 'Cancel' : '+ File New Case'}</button>}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <form className="card form-card" onSubmit={submit}>
          <div className="form-grid">
            <div>
              <label>Case Title</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div>
              <label>Case Type</label>
              <select value={form.case_type} onChange={e => setForm({ ...form, case_type: e.target.value })}>
                {CASE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label>Priority</label>
              <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label>Filed Date</label>
              <input type="date" value={form.filed_date} onChange={e => setForm({ ...form, filed_date: e.target.value })} />
            </div>
          </div>
          <label>Description</label>
          <textarea rows="3" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <button className="btn btn-primary" type="submit">Submit Case</button>
        </form>
      )}

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Case #</th><th>Title</th><th>Type</th><th>Priority</th><th>Status</th><th>Judge</th><th>Predicted Completion</th>{canCreate && <th>Update</th>}
            </tr>
          </thead>
          <tbody>
            {cases.map(c => (
              <tr key={c.id}>
                <td>{c.case_number}</td>
                <td>{c.title}</td>
                <td>{c.case_type}</td>
                <td><span className={`badge badge-${c.priority}`}>{c.priority}</span></td>
                <td><span className={`badge badge-status-${c.status}`}>{c.status.replace('_', ' ')}</span></td>
                <td>{c.judge_name || '—'}</td>
                <td>{c.predicted_completion_date ? new Date(c.predicted_completion_date).toLocaleDateString() : '—'}</td>
                {canCreate && (
                  <td>
                    <select value={c.status} onChange={e => updateStatus(c.id, e.target.value)}>
                      <option value="filed">filed</option>
                      <option value="in_progress">in_progress</option>
                      <option value="scheduled">scheduled</option>
                      <option value="closed">closed</option>
                    </select>
                  </td>
                )}
              </tr>
            ))}
            {!cases.length && <tr><td colSpan="8" className="empty">No cases found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
