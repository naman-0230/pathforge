import { useEffect, useRef, useState } from 'react';
import { marked } from 'marked';

// NotesPanel — markdown-based notes editor for a single problem, rendered
// at the bottom of ProblemPage's left column. Two modes:
//
//   - Edit mode: <textarea> for writing raw markdown
//   - Preview mode: rendered HTML via marked
//
// Empty notes default to edit mode with a placeholder. Non-empty notes
// default to preview mode (you re-opened this problem, you want to READ
// your past self's notes, not immediately edit them).
//
// SAVING: two triggers, both call onChange with the current text —
//   1. Debounced auto-save 2s after the last keystroke
//   2. Immediate save on blur (leaving the textarea)
// The parent (ProblemPage) owns the `notes` state and persists via its
// existing progress-record auto-save useEffect; this component is
// PRESENTATIONAL and doesn't touch localStorage itself.
//
// SAVED INDICATOR: shows "Saved ✓" briefly after every save fires. Not tied
// to actual localStorage write success (there's no reasonable way to know
// that failed short of quota errors) — just confirms that the debounce
// fired and the parent got the update.
//
// SECURITY NOTE: marked's default renderer allows raw HTML in markdown. For
// this app that's fine — notes are personal, single-user, and never shown
// to anyone else. If notes ever become shareable (backend + social), swap
// marked's config to sanitize or use DOMPurify on the output.

// Configure marked once at module load. GFM (GitHub-flavored markdown)
// gives us tables, strikethrough, and task lists on top of core markdown.
// Breaks: true means single newlines become <br>, which matches how people
// naturally write notes (paragraph-per-line) rather than requiring blank
// lines between everything.
marked.setOptions({
  gfm: true,
  breaks: true,
});

const AUTOSAVE_DEBOUNCE_MS = 2000;
const SAVED_INDICATOR_MS = 1500;

const PLACEHOLDER =
  'Write anything about this problem — approach, gotchas, why you got stuck, what to remember next time.\n\nMarkdown is supported: **bold**, *italic*, `code`, - lists, # headings, ```code blocks```.';

export default function NotesPanel({ notes, onChange }) {
  // Default to preview if there's already content — user opened the page to
  // READ their past notes. Empty notes default to edit mode with placeholder.
  const [mode, setMode] = useState(() => (notes && notes.trim().length > 0 ? 'preview' : 'edit'));
  const [draft, setDraft] = useState(notes || '');
  const [showSaved, setShowSaved] = useState(false);

  const debounceTimer = useRef(null);
  const savedIndicatorTimer = useRef(null);

  // Keep draft in sync if the parent-provided notes prop changes (e.g. user
  // navigated to a different problem via prev/next). Without this, the
  // textarea would keep showing the previous problem's text.
    // Sync draft down from parent ONLY when the incoming value differs from
  // what we already have in the textarea. Without this guard, every save
  // (parent gets new notes → passes them back down → this effect fires)
  // would overwrite the draft and, worse, reset the edit/preview mode
  // mid-typing. With the guard, the effect only actually does anything on
  // problem-change (prev/next nav), which is what it was meant for. Mode
  // is DELIBERATELY not reset here — mode is a per-view UI state, not
  // derived from content.
  useEffect(() => {
    if ((notes || '') !== draft) {
      setDraft(notes || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notes]);

  // Cleanup any pending timers on unmount so they don't fire against a dead
  // component (would trigger React's "set state on unmounted" warning).
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
    // Immediate save on blur — cancels the pending debounce so we don't
    // double-fire, then commits current draft.
    clearTimeout(debounceTimer.current);
    if (draft !== notes) commitSave(draft);
  }

  const isEmpty = !draft || draft.trim().length === 0;

  return (
    <div className="notes-panel">
      <div className="notes-panel-header">
        <span className="notes-panel-title">📝 Notes</span>
        <div className="notes-panel-header-right">
          {showSaved && <span className="notes-saved-indicator">Saved ✓</span>}
          {!isEmpty && (
            <button
              type="button"
              className="notes-mode-btn"
              onClick={() => setMode((m) => (m === 'edit' ? 'preview' : 'edit'))}
            >
              {mode === 'edit' ? '👁 Preview' : '✏️ Edit'}
            </button>
          )}
        </div>
      </div>

      {mode === 'edit' ? (
        <textarea
          className="notes-textarea"
          value={draft}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={PLACEHOLDER}
          spellCheck
        />
      ) : (
        // dangerouslySetInnerHTML is safe here — see SECURITY NOTE at top.
        // Notes are personal, single-user, never rendered to anyone else.
        <div
          className="notes-rendered"
          dangerouslySetInnerHTML={{ __html: marked.parse(draft) }}
        />
      )}
    </div>
  );
}