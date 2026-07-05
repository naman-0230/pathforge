import { Link } from 'react-router-dom';
import Badge from './Badge';

// RoadmapProblemItem — one problem row inside an expanded topic section.
// status: 'done' | 'current' | 'pending' — controls the dot icon and row styling.
export default function RoadmapProblemItem({ id, name, difficulty, difficultyType, pattern, status }) {
  const dotSymbol = status === 'done' ? '✓' : status === 'current' ? '→' : '';
  return (
    <Link to={`/problem/${id}`} className={`prob-item ${status === 'done' ? 'done' : ''} ${status === 'current' ? 'current' : ''}`}>
      <div className="prob-item-left">
        <span className={`prob-dot ${status === 'done' ? 'done' : ''} ${status === 'current' ? 'current' : ''}`}>{dotSymbol}</span>
        <span className="prob-item-name">{name}</span>
        <Badge type={difficultyType}>{difficulty}</Badge>
      </div>
      <span className="prob-pattern">{pattern}</span>
    </Link>
  );
}
