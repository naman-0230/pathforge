import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import Badge from '../components/Badge';
import ConfidenceButton from '../components/ConfidenceButton';
import SimulationTimer from '../components/SimulationTimer';
import { useApp } from '../context/AppContext.jsx';
import { canAccess } from '../utils/tierGate.js';
import { getDifficultyType } from '../data/problems.js';
import {
  generateSession,
  recordSessionStart,
  recordSessionResult,
  getTemplate,
} from '../utils/customTests.js';
import { triggerSync } from '../utils/sync.js';
import { usePageTitle } from '../utils/usePageTitle.js';
import '../styles/app.css';
import '../styles/simulate.css';
import '../styles/customTests.css';

// CustomTestRunPage — running a specific template's test. Reuses the
// same problem-navigation and rating patterns as WeeklyTestPage.
//
// URL: /custom-tests/run/:templateId
// PHASES:
//   'gate'     → tier check (Advanced required)
//   'loading'  → building session from template
//   'error'    → template not found OR pool too small
//   'active'   → running the test (problem-by-problem)
//   'results'  → per-problem breakdown

const confidenceOptions = [
  { value: 1, label: '😵 Wrong / stuck' },
  { value: 2, label: '🤔 Partial' },
  { value: 3, label: '😊 Solved' },
  { value: 4, label: '🚀 Solid solve' },
];

export default function CustomTestRunPage() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const { user, tierLoaded } = useApp();
  const userTier = user?.tier || 'free';
  const hasAccess = canAccess('customTests', userTier);

  const [phase, setPhase] = useState('loading');
  const [session, setSession] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [perProblemRatings, setPerProblemRatings] = useState({});
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const template = getTemplate(templateId);
  usePageTitle(template ? `Test: ${template.name}` : 'Custom Test');

  useEffect(() => {
    if (!tierLoaded) return;

    if (!hasAccess) {
      setPhase('gate');
      return;
    }

    if (!template) {
      setError('Template not found. It may have been deleted.');
      setPhase('error');
      return;
    }

    const generated = generateSession(templateId);
    if (!generated) {
      setError(
        `Couldn't build the test — the current filters yield fewer than ${template.config.problemCount} problems. Try loosening filters (e.g. include solved problems, or remove pattern filter).`
      );
      setPhase('error');
      return;
    }

    // Start the session
    (async () => {
      await recordSessionStart(user?.id, generated);
      setSession({ ...generated, startedAt: Date.now() });
      setPhase('active');
      if (user?.id) triggerSync(user.id);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tierLoaded, hasAccess, templateId]);

  function handleRate(problemId, rating) {
    setPerProblemRatings((prev) => ({ ...prev, [problemId]: rating }));
  }

  function handleTimeUp() {
    if (phase !== 'active') return;
    finishTest();
  }

  function handleNextProblem() {
    if (currentIdx + 1 >= session.problems.length) {
      finishTest();
    } else {
      setCurrentIdx((i) => i + 1);
    }
  }

  function finishTest() {
    const score = Object.values(perProblemRatings).filter((r) => r >= 3).length;
    const timeSpentMs = Date.now() - session.startedAt;

    const testResults = {
      score,
      timeSpentMs,
      perProblemRatings,
    };

    recordSessionResult(session, testResults);
    setResults(testResults);
    setPhase('results');
    if (user?.id) triggerSync(user.id);
  }

  function handleCancel() {
    if (phase === 'active') {
      if (!window.confirm('Cancel this test? Your progress will not be saved.')) return;
    }
    navigate('/custom-tests');
  }

  const showSidebar = phase !== 'active';

  return (
    <div className={`app-layout ${!showSidebar ? 'no-sidebar' : ''}`}>
      {showSidebar && <Sidebar />}
      <main className="main-content">
        {phase === 'loading' && (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-mid)' }}>
            Building your test...
          </div>
        )}

        {phase === 'gate' && (
          <div className="feature-landing-page">
            <div className="feature-landing-hero">
              <div className="feature-landing-icon">🔒</div>
              <h1>Custom Tests require Advanced</h1>
              <p className="feature-landing-tagline">
                Upgrade to unlock custom test templates.
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Link to="/custom-tests" className="btn btn-primary">
                See what Custom Tests offers →
              </Link>
            </div>
          </div>
        )}

        {phase === 'error' && (
          <div className="custom-tests-error-view">
            <div className="custom-tests-error-icon">⚠️</div>
            <h1>Can't start this test</h1>
            <p>{error}</p>
            <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
              <Link to="/custom-tests" className="btn btn-primary">
                Back to templates
              </Link>
            </div>
          </div>
        )}

        {phase === 'active' && session && (
          <ActiveView
            session={session}
            currentIdx={currentIdx}
            currentRating={perProblemRatings[session.problems[currentIdx].id]}
            onRate={(rating) => handleRate(session.problems[currentIdx].id, rating)}
            onNext={handleNextProblem}
            onTimeUp={handleTimeUp}
            onCancel={handleCancel}
          />
        )}

        {phase === 'results' && results && session && (
          <ResultsView session={session} results={results} />
        )}
      </main>
    </div>
  );
}

function ActiveView({ session, currentIdx, currentRating, onRate, onNext, onTimeUp, onCancel }) {
  const currentProblem = session.problems[currentIdx];
  const isLastProblem = currentIdx === session.problems.length - 1;
  const hasRated = currentRating != null;

  return (
    <div className="sim-active">
      <div className="sim-active-header">
        <div className="sim-active-progress">
          Problem {currentIdx + 1} of {session.problems.length} · {session.templateName}
        </div>
        <SimulationTimer
          startedAt={session.startedAt}
          durationMs={session.durationMs}
          onTimeUp={onTimeUp}
        />
        <button className="sim-active-cancel" onClick={onCancel} type="button">
          Cancel test
        </button>
      </div>

      <div className="sim-active-problem">
        <div className="sim-active-problem-header">
          <h2 className="sim-active-problem-name">{currentProblem.name}</h2>
          <div className="sim-active-problem-meta">
            <Badge type={getDifficultyType(currentProblem.difficulty)}>
              {currentProblem.difficulty}
            </Badge>
            <span className="sim-active-problem-topic">{currentProblem.topicLabel}</span>
            {currentProblem.leetcode && (
              <a
                href={`https://leetcode.com/problems/${currentProblem.id}/`}
                target="_blank"
                rel="noreferrer"
                className="sim-active-external-link"
              >
                ↗ LeetCode #{currentProblem.leetcode}
              </a>
            )}
          </div>
        </div>

        <div className="sim-active-statement">
          <div className="sim-active-statement-label">Problem</div>
          <p className="sim-active-statement-text">{currentProblem.statement}</p>

          {currentProblem.examples?.length > 0 && (
            <div className="sim-active-examples">
              <div className="sim-active-examples-label">Examples</div>
              {currentProblem.examples.map((ex, i) => (
                <div key={i} className="sim-active-example">
                  <div className="sim-active-example-title">{ex.label}</div>
                  <pre><code>{ex.text}</code></pre>
                </div>
              ))}
            </div>
          )}

          {currentProblem.constraints?.length > 0 && (
            <div className="sim-active-constraints">
              <div className="sim-active-constraints-label">Constraints</div>
              <ul>
                {currentProblem.constraints.map((c, i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: c }} />
                ))}
                {currentProblem.requiredComplexity && (
                  <li><strong>Required:</strong> {currentProblem.requiredComplexity}</li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="weekly-test-rate">
          <label className="weekly-test-rate-label">
            Rate your solve
            {!hasRated && <span style={{ color: 'var(--red)', marginLeft: 8, fontSize: 11 }}>Required to continue</span>}
          </label>
          <div className="conf-options">
            {confidenceOptions.map((opt) => (
              <ConfidenceButton
                key={opt.value}
                value={opt.value}
                label={opt.label}
                selected={currentRating === opt.value}
                onClick={onRate}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="sim-active-actions">
        <Button
          variant="primary"
          onClick={onNext}
          disabled={!hasRated}
        >
          {isLastProblem ? 'Finish test →' : 'Next problem →'}
        </Button>
      </div>
    </div>
  );
}

function ResultsView({ session, results }) {
  const { score, timeSpentMs, perProblemRatings } = results;
  const percent = Math.round((score / session.problems.length) * 100);
  const minutes = Math.floor(timeSpentMs / 60000);
  const seconds = Math.floor((timeSpentMs % 60000) / 1000);
  const timeStr = `${minutes}:${String(seconds).padStart(2, '0')}`;

  const verdict = percent >= 66
    ? { emoji: '🎯', text: 'Strong session' }
    : percent >= 33
    ? { emoji: '💪', text: 'Getting there' }
    : { emoji: '📝', text: 'Data collected — keep going' };

  return (
    <div className="weekly-test-results">
      <div className="page-header">
        <div>
          <h1>Test complete — {session.templateName}</h1>
          <p className="page-sub">Recorded to your custom test history</p>
        </div>
      </div>

      <div className="weekly-test-results-verdict">
        <div className="weekly-test-results-emoji">{verdict.emoji}</div>
        <div className="weekly-test-results-verdict-text">{verdict.text}</div>
      </div>

      <div className="weekly-test-results-stats">
        <StatBlock label="Solved" value={`${score}/${session.problems.length}`} />
        <StatBlock label="Rate" value={`${percent}%`} />
        <StatBlock label="Time" value={timeStr} />
      </div>

      <div className="weekly-test-results-breakdown">
        <div className="weekly-test-results-section-title">Per-problem breakdown</div>
        {session.problems.map((p) => {
          const rating = perProblemRatings[p.id];
          return (
            <div key={p.id} className="weekly-test-results-row">
              <div>
                <div className="weekly-test-results-name">{p.name}</div>
                <div className="weekly-test-results-meta">
                  {p.topicLabel} · {p.difficulty}
                </div>
              </div>
              <div className="weekly-test-results-rating">
                {rating != null
                  ? confidenceOptions.find((o) => o.value === rating)?.label || `${rating}/4`
                  : 'Not rated'}
              </div>
            </div>
          );
        })}
      </div>

      <div className="weekly-test-actions">
        <Link to={`/custom-tests/run/${session.templateId}`} className="btn btn-primary">
          Run again →
        </Link>
        <Link to="/custom-tests" className="btn">All templates</Link>
        <Link to="/analytics" className="btn">See analytics</Link>
      </div>
    </div>
  );
}

function StatBlock({ label, value }) {
  return (
    <div className="weekly-test-results-stat">
      <div className="weekly-test-results-stat-value">{value}</div>
      <div className="weekly-test-results-stat-label">{label}</div>
    </div>
  );
}