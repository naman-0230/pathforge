// CompactTrackingPanel.jsx — sticky bottom tracking flow for coding mode.
//
// Layout (top to bottom, very compact):
//   Row 1: Hints (single row pills) + Approach (starts 1 line, expands as user types)
//   Row 2: Confidence buttons — 1 row of 4
//   Row 3: Mark solved + flag + hard
//   Row 4: View solution (checkbox + button inline)
//
// APPROACH BEHAVIOR:
//   - Collapsed default: 1 row, shows placeholder as hint text
//   - Click to focus: expands to 2 rows for typing space
//   - Auto-grows as user types (up to 5 rows)
//   - On blur with empty content: collapses back to 1 row
//
// HINTS BEHAVIOR:
//   - Collapsed default: 1 row of pills (24px height)
//   - Click pill: expands to show that hint's content below
//   - Only one hint open at a time

import { useRef, useEffect, useState } from 'react';
import ConfidenceButton from './ConfidenceButton';

export default function CompactTrackingPanel({
  hints,
  unlockedHints,
  openHints,
  onHintClick,
  confidence,
  approach,
  marks,
  solutionGate,
}) {
  const hasHints = hints && hints.length > 0;
  const openHintNumber = openHints.size > 0 ? Array.from(openHints)[0] : null;
  const openHintObj = openHintNumber ? hints?.find((h) => h.number === openHintNumber) : null;

  return (
    <div className="compact-tracking-panel">
      {/* Row 1: Hints + Approach side-by-side (each starts at 1 line) */}
      <div className="compact-top-row">
        {/* Hints — single row of pills */}
{hasHints && (
  <div className="compact-hints-half">
    <div className="compact-hints-inline">
      <span className="compact-half-label-with-text">💡 Hints</span>
      <div className="compact-hints-pills-inline">
        {hints.map((h) => {
          const isUnlocked = unlockedHints.has(h.number);
          const isOpen = openHints.has(h.number);
          let cls = 'compact-hint-pill';
          if (isUnlocked) cls += ' unlocked';
          if (isOpen) cls += ' open';
          return (
            <button
              key={h.number}
              type="button"
              className={cls}
              onClick={() => onHintClick(h.number)}
              title={isUnlocked ? h.label : `Unlock hint ${h.number}`}
            >
              {isUnlocked ? h.number : `🔒${h.number}`}
            </button>
          );
        })}
      </div>
      {openHintNumber && (
        <button
          type="button"
          className="compact-hints-close-inline"
          onClick={() => onHintClick(openHintNumber)}
          title="Close hint"
        >
          ✕
        </button>
      )}
    </div>
    {openHintObj && (
      <div className="compact-hint-content">
        <div className="compact-hint-content-text">{openHintObj.text}</div>
      </div>
    )}
  </div>
)}

        {/* Approach — starts collapsed, expands on focus/typing */}
        <div className={`compact-approach-half ${!hasHints ? 'compact-approach-full' : ''}`}>
          <CompactApproachInput
            value={approach.value}
            onChange={approach.onChange}
            isLocked={approach.isLocked}
          />
        </div>
      </div>

      {/* Row 2: Confidence — 1 row of 4 */}
      <div className="compact-conf-row-single">
        {confidence.options.map((opt) => (
          <ConfidenceButton
            key={opt.value}
            value={opt.value}
            label={opt.label}
            selected={confidence.rating === opt.value}
            onClick={confidence.onRate}
            size="sm"
          />
        ))}
      </div>

      {/* Row 3: Mark + Flag + Hard */}
      <div className="compact-mark-row-single">
        <button
          type="button"
          className="btn btn-sm compact-mark-btn"
          onClick={marks.onMarkSolved}
          style={marks.isSolved ? {
            background: 'var(--state-success-bg)',
            color: 'var(--green)',
            borderColor: 'var(--green)',
          } : undefined}
        >
          {marks.isSolved ? '✓ Solved!' : '✓ Mark solved'}
        </button>
        <button
          type="button"
          className={`btn btn-sm compact-icon-btn ${marks.isFlagged ? 'compact-icon-btn-flag-active' : ''}`}
          onClick={marks.onToggleFlag}
          title={marks.isFlagged ? 'Remove flag' : 'Flag for revision'}
          aria-pressed={marks.isFlagged}
        >
          🔖
        </button>
        <button
          type="button"
          className={`btn btn-sm compact-icon-btn ${marks.isHard ? 'compact-icon-btn-hard-active' : ''}`}
          onClick={marks.onToggleHard}
          title={marks.isHard ? 'Remove hard-for-me mark' : 'Mark as hard for you'}
          aria-pressed={marks.isHard}
        >
          🔥
        </button>
      </div>

      {/* Row 4: View solution */}
      {solutionGate.enabled && (
        <div className="compact-view-solution-row">
          {solutionGate.message && (
            <div className="compact-gate-message">{solutionGate.message}</div>
          )}
          <div className="compact-view-solution-inline">
            <label className={`compact-check-label ${!solutionGate.satisfied ? 'compact-check-label-disabled' : ''}`}>
              <input
                type="checkbox"
                checked={solutionGate.checkboxChecked}
                disabled={!solutionGate.satisfied}
                onChange={(e) => solutionGate.onCheckboxChange(e.target.checked)}
              />
              I attempted genuinely
            </label>
            <button
              type="button"
              className="btn btn-sm compact-view-btn"
              disabled={!solutionGate.checkboxChecked || !solutionGate.satisfied}
              onClick={solutionGate.onView}
            >
              🔓 View solution
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Approach input — starts as 1-line input, expands to multi-line on focus/typing
const MIN_ROWS_EXPANDED = 2;
const MAX_ROWS = 5;
const LINE_HEIGHT = 18;

function CompactApproachInput({ value, onChange, isLocked }) {
  const textareaRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  const hasContent = value && value.trim().length > 0;
  const shouldExpand = isFocused || hasContent;

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    if (!shouldExpand) {
      // Collapsed — 1 line height
      ta.style.height = `${LINE_HEIGHT + 10}px`;
      return;
    }
    // Expanded — grow based on content
    ta.style.height = 'auto';
    const contentRows = Math.max(MIN_ROWS_EXPANDED, Math.ceil(ta.scrollHeight / LINE_HEIGHT));
    const clampedRows = Math.min(MAX_ROWS, contentRows);
    ta.style.height = `${clampedRows * LINE_HEIGHT + 10}px`;
  }, [value, shouldExpand]);

  return (
    <div className={`compact-approach-input-wrap ${shouldExpand ? 'expanded' : 'collapsed'}`}>
      <span className="compact-approach-label-inline">✍ Approach</span>
      <textarea
        ref={textareaRef}
        className={`compact-approach-textarea ${isLocked ? 'compact-approach-textarea-locked' : ''}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={isLocked ? 'Approach locked — solution viewed' : 'Sketch your approach...'}
        disabled={isLocked}
        rows={1}
      />
    </div>
  );
}