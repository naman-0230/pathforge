import { Link } from 'react-router-dom';
import Badge from './Badge';
import { hasNotes, getMarkedHard } from '../utils/progress.js';

// RoadmapProblemItem — one problem row inside an expanded topic section.
// status: 'done' | 'current' | 'pending'
//
// Bulk select: when bulkMode is true (any problems selected anywhere on the
// page), a checkbox appears on every unsolved row. Solved rows can't be
// bulk-selected — they're already done.
export default function RoadmapProblemItem({
  id,
  name,
  difficulty,
  difficultyType,
  pattern,
  status,
  // Bulk select props
  bulkMode = false,
  isSelected = false,
  onSelect = null,
}) {
  const dotSymbol = status === 'done' ? '✓' : status === 'current' ? '→' : '';
  const noted = hasNotes(id);
  const hard = getMarkedHard(id);
  const isDone = status === 'done';

  function handleCheckboxClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (onSelect) onSelect(id);
  }

  return (
    <div
      className={`prob-item-wrapper ${isSelected ? 'prob-item-selected' : ''}`}
      style={{ position: 'relative' }}
    >
      {/* Checkbox — visible on hover always, or always visible in bulk mode */}
      {!isDone && (
        <div
          className={`prob-item-checkbox ${bulkMode ? 'prob-item-checkbox-visible' : ''}`}
          onClick={handleCheckboxClick}
          style={{
            position: 'absolute',
            left: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 20,
            height: 20,
            cursor: 'pointer',
          }}
        >
          <div style={{
            width: 16,
            height: 16,
            borderRadius: 4,
            border: `1.5px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
            background: isSelected ? 'var(--accent)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease',
          }}>
            {isSelected && (
              <span style={{ color: '#fff', fontSize: 10, lineHeight: 1 }}>✓</span>
            )}
          </div>
        </div>
      )}

      <Link
        to={`/problem/${id}`}
        className={`prob-item ${isDone ? 'done' : ''} ${status === 'current' ? 'current' : ''} ${bulkMode && !isDone ? 'bulk-shift' : ''} ${isSelected ? 'is-selected' : ''}`}
        onClick={bulkMode && !isDone ? (e) => { e.preventDefault(); if (onSelect) onSelect(id); } : undefined}
      >
        <div className="prob-item-left">
          <span className={`prob-dot ${isDone ? 'done' : ''} ${status === 'current' ? 'current' : ''}`}>
            {dotSymbol}
          </span>
          <span className="prob-item-name">{name}</span>
          {noted && (
            <span className="prob-notes-indicator" title="You have notes on this problem">📝</span>
          )}
          {hard && (
            <span className="prob-hard-indicator" title="You marked this problem as hard">🔥</span>
          )}
          <Badge type={difficultyType}>{difficulty}</Badge>
        </div>
        <span className="prob-pattern">{pattern}</span>
      </Link>
    </div>
  );
}