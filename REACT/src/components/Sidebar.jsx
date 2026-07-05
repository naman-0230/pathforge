import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

// Sidebar — identical across Dashboard, Roadmap, and Problem pages in the original HTML.
// NavLink automatically adds the "active" class when its `to` path matches the current URL,
// so we don't need to manually mark one link as active per page like the static HTML did.
//
// KEY CHANGE: userName/userEmail no longer come from hardcoded props/defaults —
// they're read from AppContext, which gets populated the moment someone signs up
// or logs in. If context is somehow empty (e.g. someone navigates straight to
// /dashboard without signing in), we fall back to a generic placeholder so the
// UI never looks broken.
export default function Sidebar() {
  const { user } = useApp();
  const userName = user?.name || 'Guest';
  const userEmail = user?.email || 'Not signed in';

  const navItems = [
    { to: '/dashboard', icon: '⬛', label: 'Dashboard' },
    { to: '/roadmap', icon: '🗺', label: 'My Roadmap' },
    { to: '/revision', icon: '🔁', label: 'Revision' },
    { to: '/analytics', icon: '📊', label: 'Analytics' },
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