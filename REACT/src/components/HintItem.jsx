import { useRef, useEffect, useState } from 'react';

export default function HintItem({ number, label, text, unlocked, isOpen, onClick }) {
  const bodyRef = useRef(null);
  const [height, setHeight] = useState('0px');

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;

    if (unlocked && isOpen) {
      const scrollH = el.scrollHeight;
      setHeight(`${scrollH}px`);
      const timer = setTimeout(() => setHeight('auto'), 200);
      return () => clearTimeout(timer);
    } else {
      const scrollH = el.scrollHeight;
      setHeight(`${scrollH}px`);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setHeight('0px'));
      });
    }
  }, [unlocked, isOpen]);

  return (
    <div
      className={`hint-item ${!unlocked ? 'locked' : ''} ${unlocked && isOpen ? 'open' : ''}`}
      onClick={onClick}
    >
      <div className="hint-header">
        <span>{label || `Hint ${number}`}</span>
        {unlocked ? (
          <span
            className="hint-toggle"
            style={{
              display: 'inline-block',
              transition: 'transform 200ms cubic-bezier(0.4,0,0.2,1)',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            ▼
          </span>
        ) : (
          <span style={{ fontSize: 11, color: 'var(--text-low)' }}>🔒 tap to reveal</span>
        )}
      </div>
      <div
        ref={bodyRef}
        style={{
          height,
          overflow: 'hidden',
          transition: 'height 200ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <div className="hint-body">{text}</div>
      </div>
    </div>
  );
}