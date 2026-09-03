import React, { useEffect, useState } from 'react';
import api from '../api.js';

export default function Precedents() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const search = (q) => api.get('/precedents/search', { params: { q } }).then(r => setResults(r.data));

  useEffect(() => { search(''); }, []);

  const onSubmit = (e) => { e.preventDefault(); search(query); };

  return (
    <div>
      <div className="page-header">
        <h1>Legal Precedent Retrieval</h1>
        <p className="muted">Instant keyword-relevance search across case law</p>
      </div>

      <form className="card form-card row" onSubmit={onSubmit}>
        <input placeholder="Search precedents e.g. 'divorce property' or 'contract breach'" value={query} onChange={e => setQuery(e.target.value)} />
        <button className="btn btn-primary" type="submit">Search</button>
      </form>

      <div className="precedent-grid">
        {results.map(p => (
          <div className="card" key={p.id}>
            <div className="precedent-title">{p.title}</div>
            <div className="muted small">{p.citation} • {p.category}</div>
            <p>{p.summary}</p>
          </div>
        ))}
        {!results.length && <p className="empty">No matching precedents found.</p>}
      </div>
    </div>
  );
}
