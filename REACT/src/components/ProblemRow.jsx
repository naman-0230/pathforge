import { Link } from 'react-router-dom';
import Badge from './Badge';
import { hasNotes, getMarkedHard } from '../utils/progress.js';

// ProblemRow — one row in "Today's problems". Reused for every problem instead of
// copy-pasting the same block 3 times like the static HTML did.
// difficultyType maps to Badge's `type` prop: 'green' | 'amber' | 'red'.
//
// The 📝 indicator appears next to the name whenever the user has non-empty
// notes for this problem — a small "past you left something here" signal
// that makes notes feel like a real feature rather than an editor buried
// on a page you might never reopen. Read fresh on every render via
// hasNotes(id) so it stays accurate without prop-drilling notes down.
export default function ProblemRow({ id, name, meta, difficulty, difficultyType, done = false }) {
  const noted = hasNotes(id);
  const hard = getMarkedHard(id);

  return (
    <Link to={`/problem/${id}`} className="problem-row">
      <div className="problem-row-left">
        <div className={`prob-status ${done ? 'done' : 'pending'}`}></div>
        <div>
          <div className="prob-name">
            {name}
            {noted && (
              <span className="prob-notes-indicator" title="You have notes on this problem">
                📝
              </span>
            )}
            {hard && (
              <span className="prob-hard-indicator" title="You marked this problem as hard">
                🔥
              </span>
            )}
          </div>
          <div className="prob-meta">{meta}</div>
        </div>
      </div>
      <div className="prob-right">
        <Badge type={difficultyType}>{difficulty}</Badge>
        <span className="prob-arrow">→</span>
      </div>
    </Link>
  );
}