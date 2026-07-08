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
// Props:
//   options: [{ value, label }]
//   value:   currently-selected value (matched by ===)
//   onChange(newValue): called with the picked value
//   placeholder: shown if no value matches any option
//
// Positioning: the popup is positioned relative to the button via position:
// absolute inside a position: relative wrapper — no portal, no floating-ui.
// This means the popup CAN'T escape overflow:hidden parents, but our settings
// sections don't clip, so we're fine.
export default function Select({ options, value, onChange, placeholder = 'Select…' }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  // Close when clicking outside. Listens on the document so it catches
  // clicks anywhere off the component, including on other Select instances.
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