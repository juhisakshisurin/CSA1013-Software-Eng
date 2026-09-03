import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'citizen' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <div className="brand center">
          <span className="brand-mark">⚖</span>
          <div className="brand-title">Create Account</div>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <label>Full name</label>
        <input value={form.name} onChange={e => update('name', e.target.value)} required />
        <label>Email</label>
        <input type="email" value={form.email} onChange={e => update('email', e.target.value)} required />
        <label>Password</label>
        <input type="password" value={form.password} onChange={e => update('password', e.target.value)} required />
        <label>Role</label>
        <select value={form.role} onChange={e => update('role', e.target.value)}>
          <option value="citizen">Citizen</option>
          <option value="clerk">Court Clerk</option>
          <option value="judge">Judge</option>
          <option value="admin">Administrator</option>
        </select>
        <button className="btn btn-primary full" type="submit">Create account</button>
        <p className="auth-switch">Already registered? <Link to="/login">Sign in</Link></p>
      </form>
    </div>
  );
}
