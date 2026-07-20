import { useEffect, useRef, useState } from 'react';

// ApproachPanel — freeform text area for sketching your approach BEFORE
// viewing the solution. Modeled closely on NotesPanel but simpler:
//
//   - No markdown (approach is a quick thought sketch, not documentation)
//   - No preview/edit toggle (always editable)
//   - Auto-saves on debounce (2s) and blur — parent owns the string
//   - Shows a small "Saved ✓" indicator after saves
//   - Shows the LAST recorded approach (from previous attempts) at the
//     top as a memory aid, if one exists — read-only, small text
//
// PLACEMENT: rendered inside the right-column "Track your attempt" panel,
// BETWEEN confidence rating and "Mark your progress" — the natural place
// in the flow between "how did it go" and "here's what I did / mark done".
//
// PARENT CONTRACT:
//   value            — string, current approach text
//   onChange(text)   — called with the debounced/blurred new text
//   previousApproach — { text, date, confidenceRating } | null — the last
//                      recorded approach from a past attempt, shown as a
//                      memory-jogger above the input. null on first attempt.
//   isLocked         — boolean, true once the solution has been viewed
//                      this session. Approach becomes uneditable (visual
//                      only — the underlying value stays reachable if the
//                      user really wants to change it later). Prevents
//                      post-hoc rewriting after seeing the answer.

const AUTOSAVE_DEBOUNCE_MS = 2000;
const SAVED_INDICATOR_MS = 1500;

const PLACEHOLDER =
  'How would you approach this? A sentence or two is enough — the pattern you\'d try, the data structure that comes to mind, or where you\'d start.';

export default function ApproachPanel({ value, onChange, previousApproach, isLocked }) {
  const [draft, setDraft] = useState(value || '');
  const [showSaved, setShowSaved] = useState(false);

  const debounceTimer = useRef(null);
  const savedIndicatorTimer = useRef(null);

  // Sync draft from parent when the incoming value changes AND differs from
  // our current draft. Guards against sync loops when the parent echoes our
  // own onChange back down (see NotesPanel for the same pattern).
  useEffect(() => {
    if ((value || '') !== draft) {
      setDraft(value || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    return () => {
      clearTimeout(debounceTimer.current);
      clearTimeout(savedIndicatorTimer.current);
    };
  }, []);

  function triggerSavedIndicator() {
    setShowSaved(true);
    clearTimeout(savedIndicatorTimer.current);
    savedIndicatorTimer.current = setTimeout(() => setShowSaved(false), SAVED_INDICATOR_MS);
  }

  function commitSave(text) {
    onChange(text);
    triggerSavedIndicator();
  }

  function handleChange(e) {
    const next = e.target.value;
    setDraft(next);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => commitSave(next), AUTOSAVE_DEBOUNCE_MS);
  }

  function handleBlur() {
    clearTimeout(debounceTimer.current);
    if (draft !== value) commitSave(draft);
  }

  return (
    <div className="approach-panel">
      {/* Header with title + saved indicator */}
      <div className="approach-panel-header">
        <span className="approach-panel-title">💭 Your approach</span>
        {showSaved && <span className="approach-saved-indicator">Saved ✓</span>}
      </div>

      {/* Previous-attempt callout — shows the last recorded approach as a
          memory jog. Only rendered when we actually have one, so first-time
          problems don't show an empty callout. Deliberately styled quiet
          (small text, dim color) so it doesn't compete with the input. */}
      {previousApproach && previousApproach.text && (
        <div className="approach-previous">
          <div className="approach-previous-header">
            Last time you wrote {previousApproach.date && `(${previousApproach.date})`}:
          </div>
          <div className="approach-previous-text">{previousApproach.text}</div>
        </div>
      )}

      <textarea
        className={`approach-textarea ${isLocked ? 'approach-textarea-locked' : ''}`}
        value={draft}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={PLACEHOLDER}
        disabled={isLocked}
        rows={4}
      />

      {isLocked && (
        <div className="approach-locked-note">
          🔒 Approach locked — solution has been viewed for this attempt
        </div>
      )}
    </div>
  );
}