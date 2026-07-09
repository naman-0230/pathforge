import { useEffect, useRef, useState } from 'react';

// Select — themed dropdown replacement for native <select>. The native
// element's OPEN menu is drawn by the OS/browser and ignores page CSS, which
// means it looks jarring against a dark themed app and can extend past the
// viewport. This component draws its own button and popup entirely in HTML/CSS
// so both closed and open states match the app theme.
//
// Scope kept small on purpose: single-select only, no search box, no keyboard
// arrow navigation (just Enter/Space to open, Escape to close, clicking to
// pick). If the option list gets huge (like 400+ timezones), the popup
// scrolls internally via max-height + overflow-y — no virtual scrolling, but
// fine at this size.
//
// Positioning: now back to the simpler/correct model — popup is absolutely
// positioned inside a relative wrapper. This works because Collapsible now
// switches overflow to visible once fully open, so menus are no longer
// clipped by their section.

export default function Select({ options, value, onChange, placeholder = 'Select…' }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    function onDocClick(e) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) setOpen(false);
    }

    function onEsc(e) {
      if (e.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  const selected = options.find((o) => o.value === value);
  const displayLabel = selected ? selected.label : placeholder;

  return (
    <div className="pf-select" ref={rootRef}>
      <button
        type="button"
        className={`pf-select-btn ${open ? 'open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={`pf-select-label ${!selected ? 'pf-select-placeholder' : ''}`}>
          {displayLabel}
        </span>
        <span className={`pf-select-chevron ${open ? 'open' : ''}`}>▾</span>
      </button>

      {open && (
        <div className="pf-select-menu" role="listbox">
          {options.map((opt) => (
            <div
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              className={`pf-select-option ${opt.value === value ? 'selected' : ''}`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}