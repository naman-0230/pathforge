import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import Badge from '../components/Badge';
import ConfidenceButton from '../components/ConfidenceButton';
import SimulationTimer from '../components/SimulationTimer';
import CodeEditorPanel from '../components/CodeEditorPanel';
import CodeEditorPlaceholder from '../components/CodeEditorPlaceholder';
import { useApp } from '../context/AppContext.jsx';
import { canAccess } from '../utils/tierGate.js';
import { getDifficultyType } from '../data/problems.js';
import {
  generateSession,
  recordSessionStart,
  recordSessionResult,
  getTemplate,
  computeSessionScore,
} from '../utils/customTests.js';
import { loadTestCases, hasTestCases } from '../utils/testCaseLoader.js';
import { loadJSON, saveJSON } from '../utils/storage.js';
import { supabase } from '../utils/supabaseClient.js';
import { recordSolve } from '../utils/activity.js';
import { triggerSync } from '../utils/sync.js';
import { usePageTitle } from '../utils/usePageTitle.js';
import SessionLoader from '../components/SessionLoader';
import '../styles/app.css';
import '../styles/simulate.css';
import '../styles/customTests.css';
import '../styles/codeEditor.css';
import '../styles/testActiveLayout.css';

const confidenceOptions = [
  { value: 1, label: '😵 Wrong / stuck' },
  { value: 2, label: '🤔 Partial' },
  { value: 3, label: '😊 Solved' },
  { value: 4, label: '🚀 Solid solve' },
];

const SPLIT_POSITION_KEY = 'pathforge:testActive:splitPosition';

function getStoredSplit() {
  const saved = loadJSON(SPLIT_POSITION_KEY, 45);
  if (typeof saved !== 'number') return 45;
  return Math.min(60, Math.max(30, saved));
}

function saveStoredSplit(percent) {
  saveJSON(SPLIT_POSITION_KEY, Math.min(60, Math.max(30, Math.round(percent))));
}

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

  // NEW: per-problem editor results tracked in session state
  // Shape per entry: {
  //   attempted: bool,
  //   passed: bool,                 all tests passed (for last submission)
  //   totalTests: number,
  //   passedTests: number,
  //   language: string,
  //   submissionCount: number,
  //   lastSubmittedAt: timestamp,
  // }
  const [perProblemEditorResults, setPerProblemEditorResults] = useState({});

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
    // Use combined scoring — editor result takes priority
    const score = computeSessionScore(
      session.problems,
      perProblemRatings,
      perProblemEditorResults
    );
    const timeSpentMs = Date.now() - session.startedAt;

    const testResults = {
      score,
      timeSpentMs,
      perProblemRatings,
      perProblemEditorResults,
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

  // ─── Editor handlers ────────────────────────────────────
  function handleEditorAccepted(problemId, details) {
    // Update local editor results — this problem passed
    setPerProblemEditorResults((prev) => ({
      ...prev,
      [problemId]: {
        ...prev[problemId],
        attempted: true,
        passed: true,
        totalTests: details.totalTests,
        passedTests: details.totalTests,
        language: details.language,
        submissionCount: (prev[problemId]?.submissionCount || 0) + 1,
        lastSubmittedAt: Date.now(),
      },
    }));

    // Also mark problem as solved in overall progress (same as ProblemPage)
    const progressKey = `pathforge:problem:${problemId}`;
    const existing = loadJSON(progressKey, {});
    const today = (() => {
      const d = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    })();

    if (!existing.isSolved) recordSolve();

    const updated = {
      ...existing,
      isSolved: true,
      solvedAt: today,
      firstSolvedAt: existing.firstSolvedAt ?? today,
      solvedViaEditor: true,
      lastEditorLanguage: details.language,
      firstAcceptedAt: existing.firstAcceptedAt ?? Date.now(),
      editorSubmissionCount: (existing.editorSubmissionCount || 0) + 1,
    };
    saveJSON(progressKey, updated);

    // Auto-set confidence to "Solved" (3) if user hasn't rated yet
    if (perProblemRatings[problemId] == null) {
      handleRate(problemId, 3);
    }

    if (user?.id) triggerSync(user.id);
  }

  async function handleEditorSubmission(record) {
    // Track submission (may be pass OR fail) in local editor results
    // We only update `passed: true` on Accepted status; failures update
    // pass counts but leave passed: false
    if (record.submissionType === 'submit') {
      setPerProblemEditorResults((prev) => {
        const existing = prev[record.problemId] || {};
        const isPassed = record.status === 'accepted';
        return {
          ...prev,
          [record.problemId]: {
            attempted: true,
            passed: isPassed,
            totalTests: record.totalCount,
            passedTests: record.passedCount,
            language: record.language,
            submissionCount: (existing.submissionCount || 0) + 1,
            lastSubmittedAt: Date.now(),
          },
        };
      });
    }

    // Log to Supabase
    if (!user?.id) return;
    try {
      await supabase.from('code_submissions').insert({
        user_id: user.id,
        problem_id: record.problemId,
        language: record.language,
        submission_type: record.submissionType,
        status: record.status,
        passed_count: record.passedCount,
        total_count: record.totalCount,
        execution_time_ms: record.executionTimeMs,
        code_snippet: record.codeSnippet,
        first_failed_test_id: record.firstFailedTestId,
      });
    } catch (err) {
      console.error('[CustomTestRun] Failed to log submission:', err);
    }
  }

  const showSidebar = phase !== 'active';

  return (
    <div className={`app-layout ${!showSidebar ? 'no-sidebar' : ''}`}>
      {showSidebar && <Sidebar />}
      <main className="main-content">
        {phase === 'loading' && (
          <SessionLoader icon="🎯" label="Building your custom test..." />
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
            onEditorAccepted={(details) => handleEditorAccepted(session.problems[currentIdx].id, details)}
            onEditorSubmission={handleEditorSubmission}
          />
        )}

        {phase === 'results' && results && session && (
          <ResultsView session={session} results={results} />
        )}
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ActiveView — 2-column split with editor
// ─────────────────────────────────────────────────────────────

function ActiveView({
  session,
  currentIdx,
  currentRating,
  onRate,
  onNext,
  onTimeUp,
  onCancel,
  onEditorAccepted,
  onEditorSubmission,
}) {
  const currentProblem = session.problems[currentIdx];
  const isLastProblem = currentIdx === session.problems.length - 1;
  const hasRated = currentRating != null;

  const [testCaseSpec, setTestCaseSpec] = useState(null);
  const [testCaseSpecLoading, setTestCaseSpecLoading] = useState(false);
  const [splitPercent, setSplitPercent] = useState(() => getStoredSplit());

  useEffect(() => {
    let cancelled = false;
    setTestCaseSpec(null);
    setTestCaseSpecLoading(true);
    loadTestCases(currentProblem.id).then((spec) => {
      if (!cancelled) {
        setTestCaseSpec(spec);
        setTestCaseSpecLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [currentProblem.id]);

  const containerRef = useRef(null);
  const isDraggingRef = useRef(false);

  function handleDividerMouseDown(e) {
    e.preventDefault();
    isDraggingRef.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }

  useEffect(() => {
    function handleMouseMove(e) {
      if (!isDraggingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const percent = ((e.clientX - rect.left) / rect.width) * 100;
      const clamped = Math.max(30, Math.min(60, percent));
      setSplitPercent(clamped);
    }
    function handleMouseUp() {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        saveStoredSplit(splitPercent);
      }
    }
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [splitPercent]);

  const editorSupported = hasTestCases(currentProblem.id);

  return (
    <div className="test-active-container">
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

      <div
        ref={containerRef}
        className="test-active-split"
        style={{ '--test-split-percent': `${splitPercent}%` }}
      >
        <div className="test-active-left">
          <div className="sim-active-problem" style={{ padding: 0 }}>
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
          </div>

          <div className="test-active-rate-panel">
            <label className="weekly-test-rate-label">
              Rate your solve
              {!hasRated && (
                <span style={{ color: 'var(--red)', marginLeft: 8, fontSize: 11 }}>
                  Required to continue
                </span>
              )}
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
            <div className="test-active-rate-actions">
              <Button variant="primary" onClick={onNext} disabled={!hasRated}>
                {isLastProblem ? 'Finish test →' : 'Next problem →'}
              </Button>
            </div>
          </div>
        </div>

        <div
          className="test-active-divider"
          onMouseDown={handleDividerMouseDown}
          role="separator"
          aria-orientation="vertical"
          title="Drag to resize"
        />

        <div className="test-active-right">
          {editorSupported && testCaseSpec ? (
            <CodeEditorPanel
              problemId={currentProblem.id}
              topicKey={currentProblem.topicKey}
              testCaseSpec={testCaseSpec}
              timerDisplay={null}
              timerRunning={false}
              timerHasStarted={false}
              onToggleTimer={() => {}}
              onAccepted={onEditorAccepted}
              onSubmission={onEditorSubmission}
            />
          ) : testCaseSpecLoading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-mid)' }}>
              Loading test cases...
            </div>
          ) : (
            <CodeEditorPlaceholder
              problemName={currentProblem.name}
              leetcodeNumber={currentProblem.leetcode}
              onBackToReading={null}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ResultsView — shows BOTH self-rating AND editor result per problem
// ─────────────────────────────────────────────────────────────

function ResultsView({ session, results }) {
  const { score, timeSpentMs, perProblemRatings, perProblemEditorResults } = results;
  const percent = Math.round((score / session.problems.length) * 100);
  const minutes = Math.floor(timeSpentMs / 60000);
  const seconds = Math.floor((timeSpentMs % 60000) / 1000);
  const timeStr = `${minutes}:${String(seconds).padStart(2, '0')}`;

  const verdict = percent >= 66
    ? { emoji: '🎯', text: 'Strong session' }
    : percent >= 33
    ? { emoji: '💪', text: 'Getting there' }
    : { emoji: '📝', text: 'Data collected — keep going' };

  // Compute editor engagement summary for this session
  const editorAttempts = Object.values(perProblemEditorResults || {}).filter((r) => r?.attempted);
  const editorPasses = editorAttempts.filter((r) => r.passed).length;
  const editorAttemptCount = editorAttempts.length;

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
        {editorAttemptCount > 0 && (
          <StatBlock
            label="Editor pass"
            value={`${editorPasses}/${editorAttemptCount}`}
          />
        )}
      </div>

      <div className="weekly-test-results-breakdown">
        <div className="weekly-test-results-section-title">Per-problem breakdown</div>

        {/* Header row */}
        <div className="test-results-header-row">
          <div>Problem</div>
          <div>Rating</div>
          <div>Editor Result</div>
        </div>

        {session.problems.map((p) => {
          const rating = perProblemRatings[p.id];
          const editorResult = perProblemEditorResults?.[p.id];

          return (
            <div key={p.id} className="test-results-detail-row">
              {/* Problem name + meta */}
              <div>
                <div className="weekly-test-results-name">{p.name}</div>
                <div className="weekly-test-results-meta">
                  {p.topicLabel} · {p.difficulty}
                </div>
              </div>

              {/* Rating column */}
              <div className="test-results-cell-rating">
                {rating != null
                  ? confidenceOptions.find((o) => o.value === rating)?.label || `${rating}/4`
                  : <span className="test-results-empty-cell">Not rated</span>}
              </div>

              {/* Editor result column */}
              <div className="test-results-cell-editor">
                {editorResult?.attempted ? (
                  <div>
                    <div className={`test-results-editor-status ${editorResult.passed ? 'passed' : 'failed'}`}>
                      {editorResult.passed
                        ? `✅ Passed (${editorResult.language?.toUpperCase()}, ${editorResult.submissionCount} sub${editorResult.submissionCount === 1 ? '' : 's'})`
                        : `❌ ${editorResult.passedTests}/${editorResult.totalTests} passed (${editorResult.language?.toUpperCase()})`}
                    </div>
                  </div>
                ) : (
                  <span className="test-results-empty-cell">Not attempted in editor</span>
                )}
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