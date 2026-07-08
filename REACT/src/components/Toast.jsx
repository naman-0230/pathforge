import { useEffect, useRef, useState } from 'react';

// Toast — fixed-position, non-blocking confirmation. Auto-hides after
// `duration` ms, animates in/out via CSS transitions, uses position:fixed
// so it never shifts layout. Extracted from SettingsPage's previous inline
// implementation so any page can use it — the SettingsPage now just
// renders <Toast message={...} onDismiss={...} />.
//
// Design note: this is a purely PRESENTATIONAL component. The parent owns
// the "is a toast currently showing" state and passes a message (or null
// for hidden). The double-rAF dance that ensures the fade-in transition
// actually plays lives here so callers don't have to reinvent it.
export default function Toast({ message, duration = 4000, onDismiss }) {
  const [visible, setVisible] = useState(false);
  const hideTimer = useRef(null);
  const removeTimer = useRef(null);

  useEffect(() => {
    if (!message) return;

    // Double rAF: guarantees the "hidden" initial state paints before
    // flipping to "visible", so the opacity/transform transition has a
    // real starting frame to animate from (otherwise it'd just pop in).
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });

    hideTimer.current = setTimeout(() => {
      setVisible(false);
      // Match the CSS transition duration below so the element only unmounts
      // after the fade-out finishes — abrupt unmount would kill the animation.
      removeTimer.current = setTimeout(() => onDismiss?.(), 300);
    }, duration);

    return () => {
      clearTimeout(hideTimer.current);
      clearTimeout(removeTimer.current);
    };
  }, [message, duration, onDismiss]);

  if (!message) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 1000,
        padding: '10px 16px',
        borderRadius: 8,
        fontSize: 13,
        background: '#112711',
        border: '1px solid var(--grey, #15301b)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
        color: 'var(--text-high)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        pointerEvents: 'none',
      }}
    >
      {message}
    </div>
  );
}