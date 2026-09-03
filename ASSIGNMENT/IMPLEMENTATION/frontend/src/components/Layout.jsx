import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', roles: ['admin', 'judge', 'clerk', 'citizen'] },
  { to: '/cases', label: 'Cases', roles: ['admin', 'judge', 'clerk', 'citizen'] },
  { to: '/documents', label: 'Documents', roles: ['admin', 'judge', 'clerk'] },
  { to: '/hearings', label: 'Hearings', roles: ['admin', 'judge', 'clerk', 'citizen'] },
  { to: '/analytics', label: 'Analytics', roles: ['admin', 'judge', 'clerk'] },
  { to: '/precedents', label: 'Precedents', roles: ['admin', 'judge', 'clerk'] }
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">⚖</span>
          <div>
            <div className="brand-title">Judicial Analytics</div>
            <div className="brand-sub">Court Case Platform</div>
          </div>
        </div>
        <nav className="nav">
          {NAV_ITEMS.filter(item => item.roles.includes(user?.role)).map(item => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-chip">
            <div className="avatar">{user?.name?.charAt(0)?.toUpperCase()}</div>
            <div>
              <div className="user-name">{user?.name}</div>
              <div className="user-role">{user?.role}</div>
            </div>
          </div>
          <button className="btn btn-ghost" onClick={handleLogout}>Log out</button>
        </div>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
}
