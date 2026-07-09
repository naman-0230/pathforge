import { Link } from 'react-router-dom';
import Badge from './Badge';
import { hasNotes, getMarkedHard } from '../utils/progress.js';

// RoadmapProblemItem — one problem row inside an expanded topic section.
// status: 'done' | 'current' | 'pending' — controls the dot icon and row styling.
//
// 📝 indicator appears next to the name when notes exist — same as ProblemRow,
// same reason: makes notes discoverable across the whole app rather than
// only visible on the problem page itself.
export default function RoadmapProblemItem({ id, name, difficulty, difficultyType, pattern, status }) {
  const dotSymbol = status === 'done' ? '✓' : status === 'current' ? '→' : '';
  const noted = hasNotes(id);
  const hard = getMarkedHard(id);
  return (
    <Link to={`/problem/${id}`} className={`prob-item ${status === 'done' ? 'done' : ''} ${status === 'current' ? 'current' : ''}`}>
      <div className="prob-item-left">
        <span className={`prob-dot ${status === 'done' ? 'done' : ''} ${status === 'current' ? 'current' : ''}`}>{dotSymbol}</span>
        <span className="prob-item-name">{name}</span>
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
        <Badge type={difficultyType}>{difficulty}</Badge>
      </div>
      <span className="prob-pattern">{pattern}</span>
    </Link>
  );
}