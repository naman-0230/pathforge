import { useLocation, Link, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import DsaMockCodeBlock from '../components/DsaMockCodeBlock';
import { DSA_MOCK_CATEGORIES, getSectionLabel } from '../data/dsaMocks/questions.js';
import { usePageTitle } from '../utils/usePageTitle.js';
import '../styles/app.css';
import '../styles/dsaMocks.css';

// DsaMocksResultsPage — shared results for practice + test.
// Shows score, per-question breakdown with correct answer + explanation,
// handles skipped (unattempted) questions properly.

export default function DsaMocksResultsPage() {
  usePageTitle('DSA Mock Results');
  const location = useLocation();
  const { session, answers } = location.state || {};

  if (!session || !answers) {
    return <Navigate to="/dsa-mocks" replace />;
  }

  const correctCount = session.questions.reduce((sum, q, i) => {
    return answers[i] === q.correctIndex ? sum + 1 : sum;
  }, 0);
  const total = session.questions.length;
  const skippedCount = answers.filter((a) => a == null).length;
  const percent = Math.round((correctCount / total) * 100);
  const minutes = Math.floor((session.timeSpentMs || 0) / 60000);
  const seconds = Math.floor(((session.timeSpentMs || 0) % 60000) / 1000);
  const timeStr = `${minutes}:${String(seconds).padStart(2, '0')}`;

  const verdict = percent >= 80
    ? { emoji: '🎯', text: 'Excellent!' }
    : percent >= 60
    ? { emoji: '💪', text: 'Solid work' }
    : percent >= 40
    ? { emoji: '🌱', text: 'Room to grow' }
    : { emoji: '📚', text: 'Time to review' };

  const modeLabel = session.mode === 'practice'
    ? 'Practice'
    : session.mode === 'sectional-test'
    ? `${DSA_MOCK_CATEGORIES[session.topicKey]?.label || 'Sectional'} — Sectional`
    : 'Mixed Test';

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="dsa-results-container">
          <div className="page-header">
            <div>
              <h1>Session complete</h1>
              <p className="page-sub">{modeLabel} · {session.goalMode !== 'all' ? session.goalMode : 'all goals'}</p>
            </div>
          </div>

          <div className="dsa-results-verdict">
            <div className="dsa-results-emoji">{verdict.emoji}</div>
            <div className="dsa-results-verdict-text">{verdict.text}</div>
          </div>

          <div className="dsa-results-stats">
            <StatBlock label="Correct" value={`${correctCount}/${total}`} />
            <StatBlock label="Accuracy" value={`${percent}%`} />
            <StatBlock label="Skipped" value={skippedCount} />
            <StatBlock label="Time" value={timeStr} />
          </div>

          <div className="dsa-results-breakdown">
            <div className="dsa-results-section-title">Question breakdown</div>
            {session.questions.map((q, i) => {
              const userAnswer = answers[i];
              const isCorrect = userAnswer === q.correctIndex;
              const skipped = userAnswer == null;

              return (
                <div
                  key={q.id}
                  className={`dsa-results-row ${isCorrect ? 'correct' : skipped ? 'skipped' : 'wrong'}`}
                >
                  <div className="dsa-results-row-header">
                    <span className="dsa-results-row-num">Q{i + 1}</span>
                    <span className="dsa-results-row-icon">
                      {isCorrect ? '✓' : skipped ? '—' : '✗'}
                    </span>
                    <span className="dsa-results-row-question">
                      {q.question.slice(0, 100)}{q.question.length > 100 ? '...' : ''}
                    </span>
                  </div>

                  <div className="dsa-results-row-body">
                    {q.codeSnippet && (
                      <DsaMockCodeBlock code={q.codeSnippet} language={q.language || 'cpp'} />
                    )}

                    <div className="dsa-results-answer-line">
                      <strong>Correct:</strong>{' '}
                      <span className="dsa-results-answer-correct">
                        {String.fromCharCode(65 + q.correctIndex)}. {q.options[q.correctIndex]}
                      </span>
                    </div>
                    {!skipped && !isCorrect && (
                      <div className="dsa-results-answer-line">
                        <strong>Your answer:</strong>{' '}
                        <span className="dsa-results-answer-wrong">
                          {String.fromCharCode(65 + userAnswer)}. {q.options[userAnswer]}
                        </span>
                      </div>
                    )}
                    {skipped && (
                      <div className="dsa-results-answer-line dsa-results-skipped">
                        You didn't answer this question.
                      </div>
                    )}
                    <div className="dsa-results-explanation">
                      💡 {q.explanation}
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <Link
                        to={`/fundamentals/${q.category}#${q.subcategory}`}
                        className="dsa-inline-fund-link"
                        style={{ fontSize: 12 }}
                      >
                        📖 Review {getSectionLabel(q.category, q.subcategory)} fundamentals →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="dsa-results-actions">
            <Link to="/dsa-mocks" className="btn btn-primary">
              ← Back to DSA mocks
            </Link>
            <Link to="/analytics" className="btn">See analytics</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatBlock({ label, value }) {
  return (
    <div className="dsa-results-stat">
      <div className="dsa-results-stat-value">{value}</div>
      <div className="dsa-results-stat-label">{label}</div>
    </div>
  );
}