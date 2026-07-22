// SolveInEditorButton.jsx — the CTA button in the reading-mode tracking panel.
//
// This is the entry point to coding mode. Three visual states based on
// user's tier + the problem's editor support:
//
//   1. ENABLED — user has tier access AND problem supports editor
//      → Big primary button "🚀 Solve in editor"
//      → onClick triggers layout mode transition
//
//   2. TIER LOCKED — problem supports editor but user's tier doesn't allow
//      → Compact locked pill "🔒 Code editor is a Basic feature"
//      → Small "Learn more" link inside the pill
//      → No mode change; just informational
//
//   3. UNSUPPORTED — problem type not yet supported (trees/lists/graphs)
//      → Compact info pill "🚧 Code editor coming for this problem type in v2"
//      → No CTA
//
// SIZE: Deliberately compact when NOT enabled — a giant tease/placeholder
// makes free users feel punished. Small, informative, out of the way.

import { Link } from 'react-router-dom';

export default function SolveInEditorButton({
  canUse,             // bool — tier allows editor for THIS problem
  editorSupported,    // bool — problem type is supported (v1 scope)
  onClick,            // () => void — trigger mode transition
  upgradeCta,         // optional — { label, href } if tier locked
}) {
  // State 3: Unsupported problem type (highest priority — tier doesn't matter)
  if (!editorSupported) {
    return (
      <div className="solve-in-editor-unsupported">
        <span className="solve-in-editor-unsupported-icon">🚧</span>
        <div className="solve-in-editor-unsupported-body">
          <div className="solve-in-editor-unsupported-title">
            Code editor coming in v2
          </div>
          <div className="solve-in-editor-unsupported-desc">
            Trees, linked lists, and graphs need special test setup. Solve on LeetCode
            and use the buttons below to track progress.
          </div>
        </div>
      </div>
    );
  }

  // State 2: Tier locked
  if (!canUse) {
    return (
      <div className="solve-in-editor-locked">
        <span className="solve-in-editor-locked-icon">🔒</span>
        <div className="solve-in-editor-locked-body">
          <div className="solve-in-editor-locked-title">
            Code editor is a Basic tier feature
          </div>
          <div className="solve-in-editor-locked-desc">
            Free tier includes the editor on Arrays &gt; Basics and Hashing.
            Use the Mark Solved button below to track progress on any problem.
          </div>
          <Link
            to={upgradeCta?.href || '/settings#tier'}
            className="solve-in-editor-locked-link"
          >
            {upgradeCta?.label || 'Upgrade to Basic → ₹199'}
          </Link>
        </div>
      </div>
    );
  }

  // State 1: Enabled — the actual CTA
  return (
    <button
      type="button"
      className="solve-in-editor-btn"
      onClick={onClick}
    >
      <span className="solve-in-editor-btn-icon">🚀</span>
      <div className="solve-in-editor-btn-text">
        <span className="solve-in-editor-btn-main">Solve in code editor</span>
        <span className="solve-in-editor-btn-sub">Write + test your solution inline</span>
      </div>
    </button>
  );
}