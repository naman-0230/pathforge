import { NavLink } from 'react-router-dom';

// Sidebar — identical across Dashboard, Roadmap, and Problem pages in the original HTML.
// NavLink automatically adds the "active" class when its `to` path matches the current URL,
// so we don't need to manually mark one link as active per page like the static HTML did.
export default function Sidebar({ userName = 'Rahul Sharma', userEmail = 'rahul@example.com' }) {
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
