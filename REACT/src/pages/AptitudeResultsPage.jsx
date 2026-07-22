import { useLocation, Link, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import { CATEGORIES } from '../data/aptitude/questions.js';
import { usePageTitle } from '../utils/usePageTitle.js';
import '../styles/app.css';
import '../styles/aptitude.css';

// AptitudeResultsPage — shown after any aptitude session (practice or test).
// Displays score, per-question breakdown with explanations, and next-action
// links. Session data comes via router state (from Practice/Test pages).

export default function AptitudeResultsPage() {
  usePageTitle('Aptitude Results');
  const location = useLocation();
  const { session, answers } = location.state || {};

  // If someone navigates here directly with no state, redirect
  if (!session || !answers) {
    return <Navigate to="/aptitude" replace />;
  }

  const correctCount = session.questions.reduce((sum, q, i) => {
    return answers[i] === q.correctIndex ? sum + 1 : sum;
  }, 0);
  const total = session.questions.length;
  const percent = Math.round((correctCount / total) * 100);
  const minutes = Math.floor((session.timeSpentMs || 0) / 60000);
  const seconds = Math.floor(((session.timeSpentMs || 0) % 60000) / 1000);
  const timeStr = `${minutes}:${String(seconds).padStart(2, '0')}`;

  const verdict = percent >= 80
    ? { emoji: '🎯', text: 'Excellent work' }
    : percent >= 60
    ? { emoji: '💪', text: 'Solid session' }
    : percent >= 40
    ? { emoji: '🌱', text: 'Room to grow' }
    : { emoji: '📚', text: 'Time to study up' };

  const modeLabel = session.mode === 'practice'
    ? 'Practice'
    : session.mode === 'sectional-test'
    ? `${CATEGORIES[session.category].label} — Sectional`
    : 'Mixed Test';

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="aptitude-results-container">
          <div className="page-header">
            <div>
              <h1>Session complete</h1>
              <p className="page-sub">{modeLabel}</p>
            </div>
          </div>

          <div className="aptitude-results-verdict">
            <div className="aptitude-results-emoji">{verdict.emoji}</div>
            <div className="aptitude-results-verdict-text">{verdict.text}</div>
          </div>

          <div className="aptitude-results-stats">
            <StatBlock label="Correct" value={`${correctCount}/${total}`} />
            <StatBlock label="Accuracy" value={`${percent}%`} />
            <StatBlock label="Time" value={timeStr} />
          </div>

          {/* Per-question breakdown */}
          <div className="aptitude-results-breakdown">
            <div className="aptitude-results-section-title">Question breakdown</div>
            {session.questions.map((q, i) => {
              const userAnswer = answers[i];
              const isCorrect = userAnswer === q.correctIndex;
              const skipped = userAnswer == null;

              return (
                <div
                  key={q.id}
                  className={`aptitude-results-row ${isCorrect ? 'correct' : skipped ? 'skipped' : 'wrong'}`}
                >
                  <div className="aptitude-results-row-header">
                    <span className="aptitude-results-row-num">Q{i + 1}</span>
                    <span className="aptitude-results-row-icon">
                      {isCorrect ? '✓' : skipped ? '—' : '✗'}
                    </span>
                    <span className="aptitude-results-row-question">
                      {q.question.slice(0, 100)}{q.question.length > 100 ? '...' : ''}
                    </span>
                  </div>

                  <div className="aptitude-results-row-body">
                    <div className="aptitude-results-answer-line">
                      <strong>Correct:</strong>{' '}
                      <span className="aptitude-results-answer-correct">
                        {String.fromCharCode(65 + q.correctIndex)}. {q.options[q.correctIndex]}
                      </span>
                    </div>
                    {!skipped && !isCorrect && (
                      <div className="aptitude-results-answer-line">
                        <strong>Your answer:</strong>{' '}
                        <span className="aptitude-results-answer-wrong">
                          {String.fromCharCode(65 + userAnswer)}. {q.options[userAnswer]}
                        </span>
                      </div>
                    )}
                    {skipped && (
                      <div className="aptitude-results-answer-line aptitude-results-skipped">
                        You didn't answer this question.
                      </div>
                    )}
                    <div className="aptitude-results-explanation">
                      💡 {q.explanation}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="aptitude-results-actions">
            <Link to="/aptitude" className="btn btn-primary">
              ← Back to aptitude
            </Link>
            <Link to="/analytics" className="btn">
              See analytics
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatBlock({ label, value }) {
  return (
    <div className="aptitude-results-stat">
      <div className="aptitude-results-stat-value">{value}</div>
      <div className="aptitude-results-stat-label">{label}</div>
    </div>
  );
}