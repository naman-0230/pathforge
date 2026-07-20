import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { useScrollDirection } from '../utils/useScrollDirection.js';

// Sidebar — identical across all authenticated pages. NavLink automatically
// adds the "active" class when its `to` path matches the current URL.
//
// SYNC INDICATOR: a small pulsing dot + "Syncing..." text appears at the
// bottom of the sidebar while a background push to Supabase is in progress.
// This is non-blocking — the user can keep using the app normally.
//
// MOBILE: below 900px, the sidebar becomes a slide-in drawer triggered by a
// hamburger button in the top-left. Closes on nav click, backdrop click, or
// route change. Above 900px, it stays as a fixed sidebar (unchanged).
export default function Sidebar({ syncing = false }) {
  const { user } = useApp();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const userName = user?.name || 'Guest';
  const userEmail = user?.email || 'Not signed in';
  const scrollDir = useScrollDirection();

  const navItems = [
    { to: '/dashboard', icon: '⬛', label: 'Dashboard' },
    { to: '/roadmap', icon: '🗺', label: 'My Roadmap' },
    { to: '/revision', icon: '🔁', label: 'Revision' },
    { to: '/pattern-training', icon: '🧩', label: 'Pattern Training' },
    { to: '/analytics', icon: '📊', label: 'Analytics' },
    { to: '/fundamentals', icon: '📖', label: 'Fundamentals' },
    { to: '/settings', icon: '⚙️', label: 'Settings' },
  ];

  const initial = userName?.charAt(0)?.toUpperCase() || '?';

  // Close drawer whenever route changes (e.g. user taps a nav item)
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Lock body scroll while drawer is open on mobile
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      {/* Mobile hamburger — hidden on desktop via CSS */}
      <button
        type="button"
        className={`mobile-menu-btn ${scrollDir === 'down' ? 'scrolled-hidden' : ''}`}
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Backdrop — only visible when drawer is open on mobile */}
      <div
        className={`sidebar-backdrop ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="nav-logo-dot"></div> PathForge

          {/* Close button — only visible on mobile inside drawer */}
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
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
    </>
  );
}