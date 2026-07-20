import { Link } from 'react-router-dom';
import Button from './Button';

// PatternResults — end-of-session summary. Shows score, time, pattern
// breakdown of what was missed, and CTAs to train again or leave.

export default function PatternResults({ session, onTrainAgain }) {
  const { score, totalQuestions, timeSpentMs, questions } = session;
  const percent = Math.round((score / totalQuestions) * 100);
  const minutes = Math.floor(timeSpentMs / 60000);
  const seconds = Math.floor((timeSpentMs % 60000) / 1000);
  const timeStr = `${minutes}:${String(seconds).padStart(2, '0')}`;

  // Aggregate misses by pattern
  const missesByPattern = {};
  for (const q of questions) {
    if (q.correct) continue;
    const pattern = q.type === 'identify-pattern' ? q.correctPattern : q.sharedPattern;
    missesByPattern[pattern] = (missesByPattern[pattern] || 0) + 1;
  }
  const missedPatterns = Object.entries(missesByPattern)
    .sort((a, b) => b[1] - a[1]);

  const verdict = percent >= 80 ? { emoji: '🎯', text: 'Sharp pattern eye' }
    : percent >= 60 ? { emoji: '👍', text: 'Getting there' }
    : percent >= 40 ? { emoji: '🌱', text: 'Room to grow' }
    : { emoji: '📚', text: 'Time to study patterns' };

  return (
    <div className="pattern-results">
      <div className="pattern-results-verdict">
        <div className="pattern-results-emoji">{verdict.emoji}</div>
        <div className="pattern-results-verdict-text">{verdict.text}</div>
      </div>

      <div className="pattern-results-stats">
        <div className="pattern-results-stat">
          <div className="pattern-results-stat-value">{score}/{totalQuestions}</div>
          <div className="pattern-results-stat-label">Correct</div>
        </div>
        <div className="pattern-results-stat">
          <div className="pattern-results-stat-value">{percent}%</div>
          <div className="pattern-results-stat-label">Accuracy</div>
        </div>
        <div className="pattern-results-stat">
          <div className="pattern-results-stat-value">{timeStr}</div>
          <div className="pattern-results-stat-label">Time</div>
        </div>
      </div>

      {missedPatterns.length > 0 && (
        <div className="pattern-results-misses">
          <div className="pattern-results-section-title">
            Patterns you missed
          </div>
          <div className="pattern-results-miss-list">
            {missedPatterns.map(([pattern, count]) => (
              <div key={pattern} className="pattern-results-miss-row">
                <span className="pattern-results-miss-name">{pattern}</span>
                <span className="pattern-results-miss-count">
                  {count} miss{count === 1 ? '' : 'es'}
                </span>
              </div>
            ))}
          </div>
          <p className="pattern-results-miss-note">
            These patterns will appear more often in future training sessions.
          </p>
        </div>
      )}

      {missedPatterns.length === 0 && (
        <div className="pattern-results-perfect">
          Perfect round — you nailed every pattern.
        </div>
      )}

      <div className="pattern-results-actions">
        <Button variant="primary" onClick={onTrainAgain}>Train again</Button>
        <Link to="/dashboard" className="btn">Back to dashboard</Link>
      </div>
    </div>
  );
}