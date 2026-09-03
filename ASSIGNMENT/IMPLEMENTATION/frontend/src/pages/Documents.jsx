import React, { useEffect, useState } from 'react';
import api from '../api.js';

export default function Documents() {
  const [cases, setCases] = useState([]);
  const [caseId, setCaseId] = useState('');
  const [filename, setFilename] = useState('');
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [docs, setDocs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => { api.get('/cases').then(r => setCases(r.data)); }, []);
  useEffect(() => { if (caseId) api.get(`/documents/case/${caseId}`).then(r => setDocs(r.data)); }, [caseId, result]);

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setResult(null);
    try {
      const { data } = await api.post('/documents/upload', { case_id: caseId, filename, text });
      setResult(data);
      setFilename(''); setText('');
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Document Intelligence</h1>
        <p className="muted">Automated classification and sensitive-data redaction</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form className="card form-card" onSubmit={submit}>
        <div className="form-grid">
          <div>
            <label>Case</label>
            <select value={caseId} onChange={e => setCaseId(e.target.value)} required>
              <option value="">Select a case</option>
              {cases.map(c => <option key={c.id} value={c.id}>{c.case_number} — {c.title}</option>)}
            </select>
          </div>
          <div>
            <label>File name</label>
            <input value={filename} onChange={e => setFilename(e.target.value)} placeholder="affidavit.txt" required />
          </div>
        </div>
        <label>Document text</label>
        <textarea rows="6" value={text} onChange={e => setText(e.target.value)}
          placeholder="Paste document content here (e.g. affidavit, contract, FIR text)..." required />
        <button className="btn btn-primary" type="submit">Analyze & Upload</button>
      </form>

      {result && (
        <div className="card">
          <h3>Analysis Result</h3>
          <p><strong>Predicted category:</strong> {result.category} ({result.confidence}% confidence)</p>
          <p><strong>Redactions applied:</strong> {result.redactionHits}</p>
          <pre className="redacted-preview">{result.redacted_text}</pre>
        </div>
      )}

      {caseId && (
        <div className="card">
          <h3>Documents for selected case</h3>
          <table className="table">
            <thead><tr><th>Filename</th><th>Category</th><th>Confidence</th><th>Uploaded</th></tr></thead>
            <tbody>
              {docs.map(d => (
                <tr key={d.id}>
                  <td>{d.filename}</td>
                  <td>{d.category}</td>
                  <td>{d.confidence}%</td>
                  <td>{new Date(d.uploaded_at).toLocaleString()}</td>
                </tr>
              ))}
              {!docs.length && <tr><td colSpan="4" className="empty">No documents yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
