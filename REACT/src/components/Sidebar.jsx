import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

// Sidebar — identical across all authenticated pages. NavLink automatically
// adds the "active" class when its `to` path matches the current URL.
//
// SYNC INDICATOR: a small pulsing dot + "Syncing..." text appears at the
// bottom of the sidebar while a background push to Supabase is in progress.
// This is non-blocking — the user can keep using the app normally.
export default function Sidebar({ syncing = false }) {
  const { user } = useApp();
  const userName = user?.name || 'Guest';
  const userEmail = user?.email || 'Not signed in';

  const navItems = [
    { to: '/dashboard', icon: '⬛', label: 'Dashboard' },
    { to: '/roadmap', icon: '🗺', label: 'My Roadmap' },
    { to: '/revision', icon: '🔁', label: 'Revision' },
    { to: '/analytics', icon: '📊', label: 'Analytics' },
    { to: '/fundamentals', icon: '📖', label: 'Fundamentals' },
    { to: '/settings', icon: '⚙️', label: 'Settings' },
  ];

  const initial = userName?.charAt(0)?.toUpperCase() || '?';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="nav-logo-dot"></div> PathForge
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => 'sidebar-item' + (isActive ? ' active' : '')}
          >
            <span className="sidebar-icon">{item.icon}</span> {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Sync indicator — only visible during background pushes */}
      {syncing && (
        <div className="sync-indicator">
          <div className="sync-indicator-dot" />
          Syncing...
        </div>
      )}

      <div className="sidebar-footer">
        <div className="user-chip">
          <div className="user-avatar">{initial}</div>
          <div>
            <div className="user-name">{userName}</div>
            <div className="user-email">{userEmail}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}