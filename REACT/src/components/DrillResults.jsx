import { Link } from 'react-router-dom';
import Button from './Button';

// DrillResults — end-of-drill summary. Shows completion rate, time,
// and offers a next-drill CTA (if another weak pattern exists) plus
// a way to head back to dashboard.

export default function DrillResults({ session, nextRecommendation, onStartAnother }) {
  const { totalSolved, problems, timeSpentMs, pattern, outcomes } = session;
  const total = problems.length;
  const percent = Math.round((totalSolved / total) * 100);
  const minutes = Math.floor(timeSpentMs / 60000);
  const seconds = Math.floor((timeSpentMs % 60000) / 1000);
  const timeStr = `${minutes}:${String(seconds).padStart(2, '0')}`;

  const autoCount = outcomes.filter((o) => o.autoDetected).length;
  const manualCount = totalSolved - autoCount;

  const verdict = percent === 100
    ? { emoji: '🎯', text: 'Drill complete — pattern locked in' }
    : percent >= 60
    ? { emoji: '💪', text: 'Solid session — some problems still open' }
    : percent >= 20
    ? { emoji: '🌱', text: 'A start — try again for full coverage' }
    : { emoji: '📝', text: 'Every step counts — come back to this' };

  return (
    <div className="drill-results">
      <div className="drill-results-verdict">
        <div className="drill-results-emoji">{verdict.emoji}</div>
        <div className="drill-results-verdict-text">{verdict.text}</div>
        <div className="drill-results-pattern-tag">
          Pattern: <strong>{pattern}</strong>
        </div>
      </div>

      <div className="drill-results-stats">
        <div className="drill-results-stat">
          <div className="drill-results-stat-value">{totalSolved}/{total}</div>
          <div className="drill-results-stat-label">Completed</div>
        </div>
        <div className="drill-results-stat">
          <div className="drill-results-stat-value">{percent}%</div>
          <div className="drill-results-stat-label">Coverage</div>
        </div>
        <div className="drill-results-stat">
          <div className="drill-results-stat-value">{timeStr}</div>
          <div className="drill-results-stat-label">Time</div>
        </div>
      </div>

      {(autoCount > 0 || manualCount > 0) && (
        <div className="drill-results-breakdown">
          {autoCount > 0 && (
            <div className="drill-results-breakdown-row">
              <span>✓ Solved through ProblemPage</span>
              <span>{autoCount}</span>
            </div>
          )}
          {manualCount > 0 && (
            <div className="drill-results-breakdown-row">
              <span>✓ Manually marked done</span>
              <span>{manualCount}</span>
            </div>
          )}
        </div>
      )}

      <div className="drill-results-actions">
        {nextRecommendation && (
          <Button variant="primary" onClick={() => onStartAnother(nextRecommendation.pattern)}>
            Start next drill: {nextRecommendation.pattern}
          </Button>
        )}
        <Link to="/pattern-training" className="btn">
          Pattern training
        </Link>
        <Link to="/dashboard" className="btn">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}