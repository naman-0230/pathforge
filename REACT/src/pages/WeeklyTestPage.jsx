import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import Badge from '../components/Badge';
import ConfidenceButton from '../components/ConfidenceButton';
import SimulationTimer from '../components/SimulationTimer';
import { useApp } from '../context/AppContext.jsx';
import { getDifficultyType } from '../data/problems.js';
import { canAccess, getRequiredTier, getTierLabel, getTierPrice } from '../utils/tierGate.js';
import {
  generateWeeklyTest,
  getCurrentWeekTestStatus,
  recordTestStart,
  recordTestSkip,
  recordTestResult,
  getSkipMessage,
} from '../utils/weeklyTests.js';
import { triggerSync } from '../utils/sync.js';
import { usePageTitle } from '../utils/usePageTitle.js';
import WeeklyTestSampleChart from '../components/samples/WeeklyTestSampleChart';
import '../styles/app.css';
import '../styles/simulate.css';
import '../styles/weeklyTests.css';

// WeeklyTestPage — Advanced-tier weekly test experience. Similar shape
// to SimulatePage but stricter:
//   - Fixed 3-problem, 60-min format (from user's weeklyTests prefs)
//   - No topic selection (auto-picked from studied sections in roadmap)
//   - No difficulty preset (always balanced)
//   - Explicit "skip this week" option separate from cancel
//
// PHASES:
//   'gate'    → tier check (Free/Basic hits upgrade wall)
//   'setup'   → test day check, taken-status check, skip-vs-take choice
//   'active'  → running the test
//   'results' → per-problem scoring + confidence rating + history

const confidenceOptions = [
  { value: 1, label: '😵 Wrong / stuck' },
  { value: 2, label: '🤔 Partial' },
  { value: 3, label: '😊 Solved' },
  { value: 4, label: '🚀 Solid solve' },
];

export default function WeeklyTestPage() {
  usePageTitle('Weekly Test');
  const { user, roadmapSetup, tierLoaded } = useApp();
  const navigate = useNavigate();
  const userTier = user?.tier || 'free';

  const [phase, setPhase] = useState('loading');
  const [status, setStatus] = useState(null);
  const [session, setSession] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [perProblemRatings, setPerProblemRatings] = useState({});
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const hasAccess = canAccess('weeklyTests', userTier);

  // Initial load — check tier + fetch status
 useEffect(() => {
    if (!user?.id) return;
    // Wait for the real tier before deciding whether to gate. Otherwise
    // we'd flash the "upgrade" screen for advanced users on tab focus.
    if (!tierLoaded) return;

    if (!hasAccess) {
      setPhase('gate');
      return;
    }

    (async () => {
      const s = await getCurrentWeekTestStatus(user.id);
      setStatus(s);
      if (s.alreadyTaken) {
        // Show completed state — user came back to see history
        setPhase('done');
      } else if (!s.isTestDay) {
        // Not test day — nothing to do
        setPhase('not-today');
      } else {
        setPhase('setup');
      }
    })();
  }, [user?.id, hasAccess, tierLoaded]);

  async function handleStart() {
    const generated = generateWeeklyTest(roadmapSetup);
    if (!generated) {
      setError("Not enough studied sections in your roadmap to build a test. Solve a few more problems first, then come back.");
      return;
    }

    await recordTestStart(user.id, generated.weekId);

    setSession({ ...generated, startedAt: Date.now() });
    setCurrentIdx(0);
    setPerProblemRatings({});
    setPhase('active');
    if (user?.id) triggerSync(user.id);
  }

  async function handleSkip() {
    if (!status) return;
    if (!window.confirm('Skip this week\'s test? You can take it up until midnight tonight.')) return;

    await recordTestSkip(user.id, status.weekId);
    // Update status locally so the UI reflects the skip
    setStatus({ ...status, alreadySkipped: true });
    if (user?.id) triggerSync(user.id);
    navigate('/dashboard');
  }

  function handleRateProblem(problemId, rating) {
    setPerProblemRatings((prev) => ({ ...prev, [problemId]: rating }));
  }

  function handleTimeUp() {
    if (phase !== 'active') return;
    // Auto-advance to results, using whatever ratings user managed to enter
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
    const totalRated = Object.keys(perProblemRatings).length;
    const score = Object.values(perProblemRatings).filter((r) => r >= 3).length;
    const timeSpentMs = Date.now() - session.startedAt;

    const testResults = {
      score,
      totalRated,
      timeSpentMs,
      perProblemRatings,
    };

    recordTestResult(session, testResults);
    setResults(testResults);
    setPhase('results');
    if (user?.id) triggerSync(user.id);
  }

  function handleCancelActive() {
    if (!window.confirm('Cancel this test? Your progress will not be saved.')) return;
    navigate('/dashboard');
  }

  // ── RENDER ───────────────────────────────────────────────────────

  const showSidebar = phase !== 'active';

  return (
    <div className={`app-layout ${!showSidebar ? 'no-sidebar' : ''}`}>
      {showSidebar && <Sidebar />}

      <main className="main-content">
        {phase === 'loading' && (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-mid)' }}>
            Loading test status...
          </div>
        )}

        {phase === 'gate' && <GateView userTier={userTier} />}

        {phase === 'not-today' && status && <NotTodayView status={status} />}

        {phase === 'done' && status && <DoneView status={status} />}

        {phase === 'setup' && status && (
          <SetupView
            status={status}
            error={error}
            onStart={handleStart}
            onSkip={handleSkip}
          />
        )}

        {phase === 'active' && session && (
          <ActiveView
            session={session}
            currentIdx={currentIdx}
            currentRating={perProblemRatings[session.problems[currentIdx].id]}
            onRate={(rating) => handleRateProblem(session.problems[currentIdx].id, rating)}
            onNext={handleNextProblem}
            onTimeUp={handleTimeUp}
            onCancel={handleCancelActive}
          />
        )}

        {phase === 'results' && results && session && (
          <ResultsView
            session={session}
            results={results}
          />
        )}
      </main>
    </div>
  );
}

// ============================================================
// GATE VIEW — non-Advanced user
// ============================================================

function GateView({ userTier }) {
  const requiredTier = getRequiredTier('weeklyTests');
  return (
    <div className="feature-landing-page">
      <div className="feature-landing-hero">
        <div className="feature-landing-icon">🧪</div>
        <h1>Weekly Tests</h1>
        <p className="feature-landing-tagline">
          Structured recurring measurement to keep your interview prep on track.
        </p>
      </div>

      <div className="feature-landing-section">
        <h2>What are weekly tests?</h2>
        <p>
          Every week on your chosen day, you get a curated 3-problem test drawn from the
          sections you've actually studied. A single 60-minute combined timer forces you to
          allocate time across problems — a real interview skill. You rate each problem
          after solving, and your ratings feed directly into your weak-point signals.
        </p>
      </div>

      <div className="feature-landing-section">
        <h2>Why they matter</h2>
        <div className="feature-landing-grid">
          <div className="feature-landing-benefit">
            <div className="feature-landing-benefit-icon">📈</div>
            <div className="feature-landing-benefit-title">Track progress</div>
            <div className="feature-landing-benefit-desc">
              See your test scores trend upward as you improve. Concrete proof of growth.
            </div>
          </div>
          <div className="feature-landing-benefit">
            <div className="feature-landing-benefit-icon">🎯</div>
            <div className="feature-landing-benefit-title">Sharper signals</div>
            <div className="feature-landing-benefit-desc">
              Regular tests give the weak-point engine fresh data — your roadmap adapts faster.
            </div>
          </div>
          <div className="feature-landing-benefit">
            <div className="feature-landing-benefit-icon">⏱️</div>
            <div className="feature-landing-benefit-title">Time discipline</div>
            <div className="feature-landing-benefit-desc">
              A combined timer trains you to allocate across problems — a skill flat practice can't build.
            </div>
          </div>
        </div>
      </div>

      <div className="feature-landing-section">
        <h2>Sample test history</h2>
        <div className="feature-landing-preview">
          <div className="feature-landing-preview-label">Sample data</div>
          <WeeklyTestSampleChart />
        </div>
      </div>

      <div className="feature-landing-upgrade">
        <div className="feature-landing-upgrade-header">
          <div>
            <div className="feature-landing-upgrade-tier">
              {getTierLabel(requiredTier)} tier
            </div>
            <div className="feature-landing-upgrade-price">
              ₹{getTierPrice(requiredTier)} <span>until your deadline</span>
            </div>
          </div>
        </div>
        <ul className="feature-landing-upgrade-benefits">
          <li>✓ Weekly structured tests</li>
          <li>✓ Custom tests on demand</li>
          <li>✓ Theory content (OS, DBMS, Networks, OOP)</li>
          <li>✓ Mock interview rounds</li>
          <li>✓ AI approach feedback</li>
          <li>✓ Everything in Basic</li>
        </ul>
        <div className="feature-landing-upgrade-actions">
          <Link to="/settings" className="btn btn-primary">
            Upgrade to {getTierLabel(requiredTier)} →
          </Link>
          <Link to="/dashboard" className="btn">
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// NOT TODAY / DONE VIEWS
// ============================================================

function NotTodayView({ status }) {
  const nextDateStr = status.nextTestDate?.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  });
  return (
    <div className="weekly-test-info-view">
      <div className="weekly-test-info-icon">📅</div>
      <h1>Not test day</h1>
      <p>Your next weekly test is available on <strong>{nextDateStr}</strong>.</p>
      <p className="weekly-test-info-note">
        You can change your test day in Settings → Weekly Tests.
      </p>
      <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
        <Link to="/settings" className="btn btn-sm">Change test day</Link>
        <Link to="/dashboard" className="btn btn-sm btn-primary">Back to dashboard</Link>
      </div>
    </div>
  );
}

function DoneView({ status }) {
  const nextDateStr = status.nextTestDate?.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  });
  return (
    <div className="weekly-test-info-view">
      <div className="weekly-test-info-icon">✅</div>
      <h1>Test complete for this week</h1>
      <p>Nice work — {status.weekId} is done.</p>
      <p className="weekly-test-info-note">Next test: <strong>{nextDateStr}</strong>.</p>
      <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
        <Link to="/analytics" className="btn btn-sm">See test history</Link>
        <Link to="/dashboard" className="btn btn-sm btn-primary">Back to dashboard</Link>
      </div>
    </div>
  );
}

// ============================================================
// SETUP VIEW
// ============================================================

function SetupView({ status, error, onStart, onSkip }) {
  const skipMessage = status.consecutiveSkips > 0
    ? getSkipMessage(status.consecutiveSkips)
    : null;

  return (
    <div className="weekly-test-setup">
      <div className="page-header">
        <div>
          <h1>Weekly Test — {status.weekId}</h1>
          <p className="page-sub">
            3 problems from the sections you've studied · Balanced difficulty · Timed
          </p>
        </div>
      </div>

      {skipMessage && (
        <div className={`weekly-test-skip-warning weekly-test-skip-warning-${skipMessage.tone}`}>
          {skipMessage.text}
        </div>
      )}

      {status.alreadySkipped && (
        <div className="weekly-test-info-banner">
          You marked this week as skipped. You can still take it — availability lasts until midnight.
        </div>
      )}

      <div className="weekly-test-info-box">
        <h3>How this works</h3>
        <ul>
          <li>3 problems drawn from sections you've actually studied in your roadmap</li>
          <li>Balanced: 1 Easy · 1 Medium · 1 Hard (when possible)</li>
          <li>Combined 60-minute timer — allocate time across problems yourself</li>
          <li>No hints, no solution access during the test</li>
          <li>Rate each problem after solving — results feed your weak-point signals</li>
        </ul>
      </div>

      {error && <div className="sim-setup-error">{error}</div>}

      <div className="weekly-test-actions">
        <Button variant="primary" onClick={onStart}>
          Start test →
        </Button>
        <Button onClick={onSkip}>
          Skip this week
        </Button>
      </div>
    </div>
  );
}

// ============================================================
// ACTIVE VIEW — during the test
// ============================================================

function ActiveView({ session, currentIdx, currentRating, onRate, onNext, onTimeUp, onCancel }) {
  const currentProblem = session.problems[currentIdx];
  const isLastProblem = currentIdx === session.problems.length - 1;
  const hasRated = currentRating != null;

  return (
    <div className="sim-active">
      <div className="sim-active-header">
        <div className="sim-active-progress">
          Problem {currentIdx + 1} of {session.problems.length}
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

// ============================================================
// RESULTS VIEW
// ============================================================

function ResultsView({ session, results }) {
  const { score, totalRated, timeSpentMs, perProblemRatings } = results;
  const percent = Math.round((score / session.problems.length) * 100);
  const minutes = Math.floor(timeSpentMs / 60000);
  const seconds = Math.floor((timeSpentMs % 60000) / 1000);
  const timeStr = `${minutes}:${String(seconds).padStart(2, '0')}`;

  const verdict = percent >= 66
    ? { emoji: '🎯', text: 'Strong week' }
    : percent >= 33
    ? { emoji: '💪', text: 'Solid effort' }
    : { emoji: '📝', text: 'Data collected — keep going' };

  return (
    <div className="weekly-test-results">
      <div className="page-header">
        <div>
          <h1>Test complete — {session.weekId}</h1>
          <p className="page-sub">Recorded to your weekly test history</p>
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
        <Link to="/dashboard" className="btn btn-primary">Back to dashboard</Link>
        <Link to="/analytics" className="btn">See test history</Link>
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