import { Link } from 'react-router-dom';
import Badge from './Badge';

// ProblemRow — one row in "Today's problems". Reused for every problem instead of
// copy-pasting the same block 3 times like the static HTML did.
// difficultyType maps to Badge's `type` prop: 'green' | 'amber' | 'red'.
export default function ProblemRow({ id, name, meta, difficulty, difficultyType, done = false }) {
  return (
    <Link to={`/problem/${id}`} className="problem-row">
      <div className="problem-row-left">
        <div className={`prob-status ${done ? 'done' : 'pending'}`}></div>
        <div>
          <div className="prob-name">{name}</div>
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
