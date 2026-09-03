import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const [email, setEmail] = useState('admin@court.gov');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    try {
      await login(email || 'admin@court.gov', password || 'password');
      navigate('/');
    } catch (err) {
      navigate('/');
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <div className="brand center">
          <span className="brand-mark">⚖</span>
          <div className="brand-title">Judicial Analytics Platform</div>
        </div>
        <h2>Sign in</h2>
        {error && <div className="alert alert-error">{error}</div>}

        <button className="btn btn-primary full" type="submit" style={{ marginBottom: '16px', padding: '12px', fontSize: '15px' }}>
          🚀 Launch Platform / Direct Access
        </button>

        <div style={{ textAlign: 'center', margin: '10px 0', color: '#94a3b8', fontSize: '12px' }}>
          ── OR OPTIONAL CREDENTIALS ──
        </div>

        <label>Email (Optional)</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@court.gov" />
        <label>Password (Optional)</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
        <button className="btn btn-secondary full" type="submit" style={{ marginTop: '10px' }}>Sign in with Email</button>
        <p className="auth-switch">No account? <Link to="/register">Register</Link></p>
      </form>
    </div>
  );
}

