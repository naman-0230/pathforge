import { useState, useRef, useEffect } from 'react';

export default function Collapsible({ title, badge, children, defaultOpen = false, forceOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  // forceOpen — when a parent sets this to true (e.g. deep-linking
  // to #study-plan), force the collapsible open. Only triggers on
  // changes to forceOpen, not on every render.
  useEffect(() => {
    if (forceOpen) setOpen(true);
  }, [forceOpen]);
  const bodyRef = useRef(null);
  const [height, setHeight] = useState(defaultOpen ? 'auto' : '0px');

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;

    if (open) {
      const scrollH = el.scrollHeight;
      setHeight(`${scrollH}px`);
      const timer = setTimeout(() => setHeight('auto'), 280);
      return () => clearTimeout(timer);
    } else {
      const scrollH = el.scrollHeight;
      setHeight(`${scrollH}px`);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setHeight('0px'));
      });
    }
  }, [open]);

  return (
  <div className={`section-box settings-section ${open ? 'settings-section-open' : ''}`}>
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
          <span
            style={{
              display: 'inline-block',
              fontSize: 12,
              color: 'var(--text-low)',
              transition: 'transform 250ms cubic-bezier(0.4, 0, 0.2, 1)',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            ▾
          </span>
        </div>
      </div>
            <div
        ref={bodyRef}
        className="settings-collapsible-body"
        style={{
          height,
          overflow: height === 'auto' ? 'visible' : 'hidden',
          transition: 'height 260ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div>{children}</div>
      </div>
    </div>
  );
}