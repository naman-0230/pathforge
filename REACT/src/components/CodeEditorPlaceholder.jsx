// CodeEditorPlaceholder.jsx — v2 placeholder shown in the editor area
// when the problem type doesn't have test case support yet.
//
// WHEN IT SHOWS:
//   Primarily a defensive component. Users normally can't enter coding
//   mode for unsupported problems — SolveInEditorButton blocks that.
//   But if they somehow land in coding mode for an unsupported problem
//   (e.g. via direct URL manipulation, or a data mismatch), this shows
//   inside the editor panel instead of a broken/empty editor.
//
// Content:
//   - Clear "coming in v2" message
//   - Link back to reading mode
//   - Link to LeetCode as alternative

import { Link } from 'react-router-dom';

export default function CodeEditorPlaceholder({ problemName, leetcodeNumber, onBackToReading }) {
  const leetcodeUrl = leetcodeNumber
    ? `https://leetcode.com/problems/${slugify(problemName)}/`
    : `https://leetcode.com/problemset/?search=${encodeURIComponent(problemName || '')}`;

  return (
    <div className="code-editor-placeholder">
      <div className="code-editor-placeholder-inner">
        <div className="code-editor-placeholder-icon">🚧</div>
        <h3 className="code-editor-placeholder-title">
          Code editor coming in v2
        </h3>
        <p className="code-editor-placeholder-message">
          This problem uses trees, linked lists, or graphs — data types that need
          special serializers for testing. Support is being added in v2.
        </p>
        <p className="code-editor-placeholder-message">
          For now, solve on LeetCode and use the tracking panel to mark your
          progress. Your solve status, confidence rating, and revision schedule
          all work the same.
        </p>
        <div className="code-editor-placeholder-actions">
          <a
            href={leetcodeUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary btn-sm"
          >
            Open on LeetCode ↗
          </a>
          {onBackToReading && (
            <button
              type="button"
              className="btn btn-sm"
              onClick={onBackToReading}
            >
              ← Back to reading mode
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function slugify(str) {
  return String(str || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}