// HintItem — one hint in the hints list.
//
// KEY CHANGE from the static version: the old unlockHint() manually injected HTML
// text into the DOM the first time a locked hint was clicked. Here, `unlocked` is
// just a boolean the parent passes down — once true, the hint body always renders.
// `isOpen` separately controls whether an *already-unlocked* hint is expanded or
// collapsed (matching the old toggleHint() behavior for hint 1, which starts unlocked).
export default function HintItem({ number, label, text, unlocked, isOpen, onClick }) {
  return (
    <div
      className={`hint-item ${!unlocked ? 'locked' : ''} ${unlocked && isOpen ? 'open' : ''}`}
      onClick={onClick}
    >
      <div className="hint-header">
        <span>{label || `Hint ${number}`}</span>
        {unlocked ? (
          <span className="hint-toggle">▼</span>
        ) : (
          <span style={{ fontSize: 11, color: 'var(--text-low)' }}>🔒 tap to reveal</span>
        )}
      </div>
      {unlocked && isOpen && <div className="hint-body">{text}</div>}
    </div>
  );
}
