import { useState } from 'react';

// Collapsible — settings-section wrapper that starts closed and toggles on
// header click. Kept intentionally minimal: no persistence, no controlled
// mode, no animation library. The chevron rotates via a CSS transform and
// the body is either rendered or not (rather than height-animated) since
// animating auto-height in CSS is a rabbit hole and this is a settings
// page nobody spends visual time on.
//
// Header layout MATCHES the existing `.section-box-header` pattern so
// collapsible sections look identical to non-collapsible ones — the only
// visual difference is the chevron and the pointer cursor on the header.
export default function Collapsible({ title, badge, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="section-box settings-section">
      <div
        className="section-box-header settings-collapsible-header"
        onClick={() => setOpen((v) => !v)}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen((v) => !v);
          }
        }}
      >
        <span className="section-box-title">{title}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {badge}
          <span className={`settings-collapsible-chevron ${open ? 'open' : ''}`}>▾</span>
        </div>
      </div>
      {open && <div>{children}</div>}
    </div>
  );
}