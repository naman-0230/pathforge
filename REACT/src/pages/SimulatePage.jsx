import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import Badge from '../components/Badge';
import TopicChip from '../components/TopicChip';
import SimulationTimer from '../components/SimulationTimer';
import InterviewFeedback from '../components/InterviewFeedback';
import CodeEditorPanel from '../components/CodeEditorPanel';
import CodeEditorPlaceholder from '../components/CodeEditorPlaceholder';
import { useApp } from '../context/AppContext.jsx';
import { topics } from '../data/topics.js';
import InterviewSimSampleChart from '../components/samples/InterviewSimSampleChart';
import { getDifficultyType } from '../data/problems.js';
import {
  generateSession,
  canStartNewSim,
  recordSimStart,
  recordSessionResult,
  generateFeedback,
} from '../utils/interviewSim.js';
import { canAccess, getRequiredTier, getTierLabel, getTierPrice, isFreeUser } from '../utils/tierGate.js';
import { loadTestCases, hasTestCases } from '../utils/testCaseLoader.js';
import { loadJSON, saveJSON } from '../utils/storage.js';
import { supabase } from '../utils/supabaseClient.js';
import { recordSolve } from '../utils/activity.js';
import { triggerSync } from '../utils/sync.js';
import { usePageTitle } from '../utils/usePageTitle.js';
import '../styles/app.css';
import '../styles/simulate.css';
import '../styles/codeEditor.css';
import '../styles/testActiveLayout.css';

// SimulatePage — full-screen interview simulation. Five phases:
//   'gate'    → tier check + weekly-usage check
//   'setup'   → user picks duration, problem count, difficulty mix, topics
//   'active'  → 2-column split: problem+approach LEFT, editor RIGHT
//                Editor is LOCKED until approach >= 10 chars.
//                Approach required to advance (existing behavior preserved).
//   'reflect' → post-session reflection questions
//   'results' → feedback summary + editor trend data
//
// EDITOR INTEGRATION:
//   - Editor available during 'active' phase only
//   - LOCKED overlay covers editor until approach reaches 10 chars
//   - Once unlocked, user can code + refine approach in parallel
//   - Successful editor submission auto-marks problem solved (progress)
//     AND passes to reflection with editor result recorded
//   - Editor submission history stored in session for analytics

const DURATION_OPTIONS = [
  { value: 30, label: '30 min', description: '1 problem, quick warm-up' },
  { value: 45, label: '45 min', description: 'Standard coding interview' },
  { value: 60, label: '60 min', description: 'Extended session' },
];

const PROBLEM_COUNT_OPTIONS = [1, 2, 3];

const DIFFICULTY_PRESETS = {
  easy: { easy: 100, medium: 0, hard: 0, label: 'All Easy' },
  balanced: { easy: 33, medium: 34, hard: 33, label: 'Balanced' },
  hard: { easy: 0, medium: 40, hard: 60, label: 'Interview-level' },
};

const APPROACH_UNLOCK_THRESHOLD = 10; // characters — must match ActiveView threshold

const SPLIT_POSITION_KEY = 'pathforge:testActive:splitPosition';

function getStoredSplit() {
  const saved = loadJSON(SPLIT_POSITION_KEY, 45);
  if (typeof saved !== 'number') return 45;
  return Math.min(60, Math.max(30, saved));
}

function saveStoredSplit(percent) {
  saveJSON(SPLIT_POSITION_KEY, Math.min(60, Math.max(30, Math.round(percent))));
}

export default function SimulatePage() {
  usePageTitle('Interview Simulation');
  const { user, roadmapSetup, tierLoaded } = useApp();
  const navigate = useNavigate();
  const userTier = user?.tier || 'free';

  const [phase, setPhase] = useState('gate');
  const [gateInfo, setGateInfo] = useState(null);

  // Setup state
  const [duration, setDuration] = useState(45);
  const [problemCount, setProblemCount] = useState(2);
  const [difficultyPreset, setDifficultyPreset] = useState('balanced');
  const [selectedTopicKeys, setSelectedTopicKeys] = useState(
    () => roadmapSetup?.selectedTopics || topics.filter((t) => t.seeded).map((t) => t.key)
  );
  const [studiedOnly, setStudiedOnly] = useState(true);
  const [setupError, setSetupError] = useState(null);

  // Active session state
  const [session, setSession] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [approaches, setApproaches] = useState({});
  const [perProblemMetrics, setPerProblemMetrics] = useState({});
  const [problemStartTime, setProblemStartTime] = useState(null);
  const [firstKeystrokeAt, setFirstKeystrokeAt] = useState(null);

  // NEW: per-problem editor results
  const [perProblemEditorResults, setPerProblemEditorResults] = useState({});

  // Reflection state
  const [reflections, setReflections] = useState({});

  // Results state
  const [feedback, setFeedback] = useState(null);
  const [finalSession, setFinalSession] = useState(null);

  const availableTopics = useMemo(() => topics.filter((t) => t.seeded), []);

  useEffect(() => {
    if (!user?.id) return;
    if (!tierLoaded) return;

    let canceled = false;
    (async () => {
      const gate = await canStartNewSim(user.id, userTier);
      if (canceled) return;

      setGateInfo(gate);
      setPhase(gate.allowed ? 'setup' : 'gate');
    })();

    return () => { canceled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, userTier, tierLoaded]);

  const handleTimeUp = () => {
    if (phase === 'active') {
      captureCurrentMetrics();
      setPhase('reflect');
    }
  };

  function toggleTopic(key) {
    setSelectedTopicKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
    setSetupError(null);
  }

  async function handleStart() {
    if (selectedTopicKeys.length === 0) {
      setSetupError('Pick at least one topic.');
      return;
    }

    const gate = await canStartNewSim(user?.id, userTier);
    if (!gate.allowed) {
      setGateInfo(gate);
      setPhase('gate');
      return;
    }

    const mix = DIFFICULTY_PRESETS[difficultyPreset];
    const generated = generateSession({
      problemCount,
      durationMinutes: duration,
      topicKeys: selectedTopicKeys,
      difficultyMix: { easy: mix.easy, medium: mix.medium, hard: mix.hard },
      studiedOnly,
    });

    if (!generated) {
      const errorMsg = studiedOnly
        ? "Not enough problems in the sections you've studied. Turn off 'studied sections only' or add more topics."
        : 'Not enough problems in your selection. Try adding more topics or changing difficulty.';
      setSetupError(errorMsg);
      return;
    }

    if (user?.id) recordSimStart(user.id);

    const started = { ...generated, startedAt: Date.now() };
    setSession(started);
    setCurrentIdx(0);
    setApproaches({});
    setPerProblemMetrics({});
    setPerProblemEditorResults({});
    setReflections({});
    setProblemStartTime(Date.now());
    setFirstKeystrokeAt(null);
    setPhase('active');
    if (user?.id) triggerSync(user.id);
  }

  function handleApproachChange(text) {
    const currentProblem = session.problems[currentIdx];
    if (!currentProblem) return;

    if (text.length > 0 && !firstKeystrokeAt) {
      setFirstKeystrokeAt(Date.now());
    }

    setApproaches((prev) => ({ ...prev, [currentProblem.id]: text }));
  }

  function captureCurrentMetrics() {
    const currentProblem = session.problems[currentIdx];
    if (!currentProblem) return;

    const approach = approaches[currentProblem.id] || '';
    const metrics = {
      approachWritten: approach.trim().length > 0,
      approachLength: approach.trim().length,
      timeToApproachMs: firstKeystrokeAt && problemStartTime
        ? firstKeystrokeAt - problemStartTime
        : null,
      timeOnProblemMs: Date.now() - (problemStartTime || Date.now()),
    };

    setPerProblemMetrics((prev) => ({ ...prev, [currentProblem.id]: metrics }));
  }

  function handleNextProblem() {
    captureCurrentMetrics();

    if (currentIdx + 1 >= session.problems.length) {
      setPhase('reflect');
    } else {
      setCurrentIdx((i) => i + 1);
      setProblemStartTime(Date.now());
      setFirstKeystrokeAt(null);
    }
  }

  function handleReflectionChange(problemId, field, value) {
    setReflections((prev) => ({
      ...prev,
      [problemId]: { ...(prev[problemId] || {}), [field]: value },
    }));
  }

  function handleFinishSession() {
    const perProblemMetricsArray = session.problems.map((p) => perProblemMetrics[p.id] || {});
    const reflectionsArray = session.problems.map((p) => reflections[p.id] || {});
    const timeSpentMs = Date.now() - session.startedAt;

    const finalSessionData = {
      ...session,
      perProblemMetrics: perProblemMetricsArray,
      reflections: reflectionsArray,
      approaches,
      timeSpentMs,
      // Include editor results in session record for analytics
      perProblemEditorResults,
    };

    const generatedFeedback = generateFeedback(finalSessionData);
    recordSessionResult({ ...finalSessionData, feedback: generatedFeedback });

    setFinalSession(finalSessionData);
    setFeedback(generatedFeedback);
    setPhase('results');

    if (user?.id) triggerSync(user.id);
  }

  function handleCancel() {
    if (phase === 'active' || phase === 'reflect') {
      if (!window.confirm('Cancel this simulation? Your progress will not be saved.')) return;
    }
    navigate('/dashboard');
  }

  function handleStartNew() {
    setPhase('setup');
    setSession(null);
    setFeedback(null);
    setFinalSession(null);
  }

  // ─── Editor handlers ────────────────────────────────────────
  function handleEditorAccepted(problemId, details) {
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

    // Mark problem solved in overall progress
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

    if (user?.id) triggerSync(user.id);
  }

  async function handleEditorSubmission(record) {
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
      console.error('[Simulate] Failed to log submission:', err);
    }
  }

  // ── RENDER PHASES ────────────────────────────────────────

  const showSidebar = phase === 'gate' || phase === 'setup' || phase === 'results';

  return (
    <div className={`app-layout ${!showSidebar ? 'no-sidebar' : ''}`}>
      {showSidebar && <Sidebar />}

      <main className="main-content">
        {phase === 'gate' && gateInfo?.allowed === false && (
          <GateView gateInfo={gateInfo} userTier={userTier} />
        )}

        {phase === 'setup' && (
          <SetupView
            duration={duration}
            setDuration={setDuration}
            problemCount={problemCount}
            setProblemCount={setProblemCount}
            difficultyPreset={difficultyPreset}
            setDifficultyPreset={setDifficultyPreset}
            selectedTopicKeys={selectedTopicKeys}
            toggleTopic={toggleTopic}
            availableTopics={availableTopics}
            studiedOnly={studiedOnly}
            setStudiedOnly={setStudiedOnly}
            error={setupError}
            gateInfo={gateInfo}
            userTier={userTier}
            onStart={handleStart}
          />
        )}

        {phase === 'active' && session && (
          <ActiveView
            session={session}
            currentIdx={currentIdx}
            approach={approaches[session.problems[currentIdx].id] || ''}
            onApproachChange={handleApproachChange}
            onNextProblem={handleNextProblem}
            onTimeUp={handleTimeUp}
            onCancel={handleCancel}
            onEditorAccepted={(details) => handleEditorAccepted(session.problems[currentIdx].id, details)}
            onEditorSubmission={handleEditorSubmission}
          />
        )}

        {phase === 'reflect' && session && (
          <ReflectView
            session={session}
            reflections={reflections}
            perProblemEditorResults={perProblemEditorResults}
            onReflectionChange={handleReflectionChange}
            onFinish={handleFinishSession}
          />
        )}

        {phase === 'results' && feedback && finalSession && (
          <ResultsView
            feedback={feedback}
            session={finalSession}
            userTier={userTier}
            userId={user?.id}
            onStartNew={handleStartNew}
          />
        )}
      </main>
    </div>
  );
}

// ============================================================
// GATE VIEW — unchanged
// ============================================================

function GateView({ gateInfo, userTier }) {
  const nextAvailable = gateInfo?.nextAvailableAt;
  const now = Date.now();
  const msRemaining = nextAvailable ? nextAvailable - now : 0;
  const daysRemaining = Math.ceil(msRemaining / (24 * 60 * 60 * 1000));
  const requiredTier = getRequiredTier('unlimitedInterviewSims');

  return (
    <div className="feature-landing-page">
      <div className="feature-landing-hero">
        <div className="feature-landing-icon">⏳</div>
        <h1>You've used this week's free simulation</h1>
        <p className="feature-landing-tagline">
          Free tier includes 1 interview simulation per week.
          {daysRemaining > 0 && (
            <> Next available in <strong>{daysRemaining} day{daysRemaining === 1 ? '' : 's'}</strong>.</>
          )}
        </p>
      </div>

      <div className="feature-landing-section">
        <h2>What Basic unlocks</h2>
        <div className="feature-landing-grid">
          <div className="feature-landing-benefit">
            <div className="feature-landing-benefit-icon">♾️</div>
            <div className="feature-landing-benefit-title">Unlimited sims</div>
            <div className="feature-landing-benefit-desc">
              Practice as many rounds as you want — daily, or 5 in one weekend. No caps.
            </div>
          </div>
          <div className="feature-landing-benefit">
            <div className="feature-landing-benefit-icon">🎯</div>
            <div className="feature-landing-benefit-title">Multi-problem sessions</div>
            <div className="feature-landing-benefit-desc">
              2 or 3 problems per session — mimicking real onsite loops.
            </div>
          </div>
          <div className="feature-landing-benefit">
            <div className="feature-landing-benefit-icon">📊</div>
            <div className="feature-landing-benefit-title">Detailed analytics</div>
            <div className="feature-landing-benefit-desc">
              Track your simulation performance over time across topics and difficulty levels.
            </div>
          </div>
        </div>
      </div>

      <div className="feature-landing-section">
        <h2>How simulations grow with Basic</h2>
        <div className="feature-landing-preview">
          <div className="feature-landing-preview-label">Sample: sims per week</div>
          <InterviewSimSampleChart />
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
          <li>✓ Unlimited interview simulations</li>
          <li>✓ 1-3 problems per session</li>
          <li>✓ 30/45/60 min duration options</li>
          <li>✓ All topics unlocked (not just Arrays)</li>
          <li>✓ Full code editor access</li>
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
// SETUP VIEW — unchanged
// ============================================================

function SetupView({
  duration, setDuration,
  problemCount, setProblemCount,
  difficultyPreset, setDifficultyPreset,
  selectedTopicKeys, toggleTopic, availableTopics,
  studiedOnly, setStudiedOnly,
  error, gateInfo, userTier, onStart,
}) {
  const remaining = gateInfo?.remaining;
  const isLimited = isFreeUser(userTier);

  return (
    <div className="sim-setup">
      <div className="page-header">
        <div>
          <h1>Interview Simulation</h1>
          <p className="page-sub">
            Timed session · No hints · No solution access · Approach-first
            {isLimited && remaining != null && (
              <span style={{ marginLeft: 12, color: 'var(--amber, #d9a441)' }}>
                · {remaining} free simulation{remaining === 1 ? '' : 's'} left this week
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="sim-setup-section">
        <label className="sim-setup-label">Duration</label>
        <div className="sim-setup-chips">
          {DURATION_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`sim-setup-chip ${duration === opt.value ? 'selected' : ''}`}
              onClick={() => setDuration(opt.value)}
              type="button"
            >
              <div className="sim-setup-chip-value">{opt.label}</div>
              <div className="sim-setup-chip-desc">{opt.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="sim-setup-section">
        <label className="sim-setup-label">
          Number of problems
          {isFreeUser(userTier) && problemCount > 1 && (
            <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--amber, #d9a441)' }}>
              (Free tier allows 1-3 problems in a simulation)
            </span>
          )}
        </label>
        <div className="sim-setup-count-chips">
          {PROBLEM_COUNT_OPTIONS.map((n) => (
            <button
              key={n}
              className={`sim-setup-count-chip ${problemCount === n ? 'selected' : ''}`}
              onClick={() => setProblemCount(n)}
              type="button"
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="sim-setup-section">
        <label className="sim-setup-label">Difficulty mix</label>
        <div className="sim-setup-chips">
          {Object.entries(DIFFICULTY_PRESETS).map(([key, preset]) => (
            <button
              key={key}
              className={`sim-setup-chip ${difficultyPreset === key ? 'selected' : ''}`}
              onClick={() => setDifficultyPreset(key)}
              type="button"
            >
              <div className="sim-setup-chip-value">{preset.label}</div>
              <div className="sim-setup-chip-desc">
                {preset.easy}% E · {preset.medium}% M · {preset.hard}% H
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="sim-setup-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <label className="sim-setup-label" style={{ margin: 0 }}>Topics</label>
          <label className="sim-studied-toggle">
            <input
              type="checkbox"
              checked={studiedOnly}
              onChange={(e) => setStudiedOnly(e.target.checked)}
            />
            <span>Only from sections I've studied</span>
          </label>
        </div>
        <div className="topic-grid">
          {availableTopics.map((t) => (
            <TopicChip
              key={t.key}
              icon={t.icon}
              label={t.label}
              selected={selectedTopicKeys.includes(t.key)}
              onClick={() => toggleTopic(t.key)}
            />
          ))}
        </div>
      </div>

      {error && <div className="sim-setup-error">{error}</div>}

      <div className="sim-setup-actions">
        <Button variant="primary" onClick={onStart}>
          Start simulation →
        </Button>
      </div>
    </div>
  );
}

// ============================================================
// ACTIVE VIEW — 2-column split, editor locked until approach threshold
// ============================================================

function ActiveView({
  session,
  currentIdx,
  approach,
  onApproachChange,
  onNextProblem,
  onTimeUp,
  onCancel,
  onEditorAccepted,
  onEditorSubmission,
}) {
  const currentProblem = session.problems[currentIdx];
  const isLastProblem = currentIdx === session.problems.length - 1;
  const hasApproach = approach.trim().length >= APPROACH_UNLOCK_THRESHOLD;

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
  const editorLocked = !hasApproach;

  return (
    <div className="test-active-container">
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
          End session
        </button>
      </div>

      <div
        ref={containerRef}
        className="test-active-split"
        style={{ '--test-split-percent': `${splitPercent}%` }}
      >
        {/* LEFT: problem + approach + next button */}
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
                    title="Open on LeetCode in new tab — you decide if this is real interview behavior"
                  >
                    ↗ LeetCode #{currentProblem.leetcode}
                  </a>
                )}
              </div>
            </div>

            <div className="sim-active-statement">
              <div className="sim-active-statement-label">Problem</div>
              <p className="sim-active-statement-text">{currentProblem.statement}</p>

              {currentProblem.examples && currentProblem.examples.length > 0 && (
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

              {currentProblem.constraints && currentProblem.constraints.length > 0 && (
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

            <div className="sim-active-instructions" style={{ marginTop: 12 }}>
              <p><strong>No hints. No solution access.</strong></p>
              <p style={{ fontSize: 12, color: 'var(--text-mid)' }}>
                Sketch your approach below. The code editor unlocks once you've
                written at least {APPROACH_UNLOCK_THRESHOLD} characters — the
                real interview equivalent of "talking through it first."
              </p>
            </div>
          </div>

          {/* Sticky bottom: approach + next button */}
          <div className="test-active-rate-panel">
            <label className="sim-active-approach-label">
              Your approach
              {!hasApproach && <span style={{ color: 'var(--red)', marginLeft: 8, fontSize: 11 }}>Required to unlock editor + continue</span>}
              {hasApproach && <span style={{ color: 'var(--green)', marginLeft: 8, fontSize: 11 }}>✓ Editor unlocked</span>}
            </label>
            <textarea
              className="sim-active-approach-input"
              value={approach}
              onChange={(e) => onApproachChange(e.target.value)}
              placeholder="Describe your approach — pattern, data structure, edge cases, why it works..."
              autoFocus
              rows={4}
              style={{ minHeight: 80, marginTop: 6 }}
            />
            <div className="test-active-rate-actions">
              <Button
                variant="primary"
                onClick={onNextProblem}
                disabled={!hasApproach}
              >
                {isLastProblem ? 'Finish problems → Reflect' : 'Next problem →'}
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

        {/* RIGHT: code editor (locked until approach written) */}
        <div className="test-active-right" style={{ position: 'relative' }}>
          {editorSupported && testCaseSpec ? (
            <>
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
              {editorLocked && (
                <div className="test-active-editor-locked-overlay">
                  <div className="test-active-editor-locked-content">
                    <div className="test-active-editor-locked-icon">🔒</div>
                    <div className="test-active-editor-locked-title">
                      Write your approach first
                    </div>
                    <div className="test-active-editor-locked-desc">
                      The code editor unlocks once you've written at least{' '}
                      {APPROACH_UNLOCK_THRESHOLD} characters describing your approach.
                      This mimics real interviews — think, then code.
                    </div>
                  </div>
                </div>
              )}
            </>
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

// ============================================================
// REFLECT VIEW — now shows editor result per problem
// ============================================================

function ReflectView({ session, reflections, perProblemEditorResults, onReflectionChange, onFinish }) {
  const allReflected = session.problems.every((p) => {
    const r = reflections[p.id] || {};
    return (r.gotRight || '').trim().length > 0 && (r.gotStuck || '').trim().length > 0;
  });

  return (
    <div className="sim-reflect">
      <div className="page-header">
        <div>
          <h1>Reflect</h1>
          <p className="page-sub">
            The most important part. Take a minute per problem.
          </p>
        </div>
      </div>

      {session.problems.map((p) => {
        const r = reflections[p.id] || {};
        const editorResult = perProblemEditorResults?.[p.id];
        return (
          <div key={p.id} className="sim-reflect-problem">
            <div className="sim-reflect-problem-header">
              <span className="sim-reflect-problem-name">{p.name}</span>
              <Badge type={getDifficultyType(p.difficulty)}>{p.difficulty}</Badge>
              {editorResult?.attempted && (
                <span className={`sim-reflect-editor-badge ${editorResult.passed ? 'passed' : 'failed'}`}>
                  {editorResult.passed
                    ? `✅ ${editorResult.language?.toUpperCase()}`
                    : `❌ ${editorResult.passedTests}/${editorResult.totalTests}`}
                </span>
              )}
            </div>

            <div className="sim-reflect-field">
              <label>What did you get right?</label>
              <textarea
                value={r.gotRight || ''}
                onChange={(e) => onReflectionChange(p.id, 'gotRight', e.target.value)}
                placeholder="Even partial progress counts. Pattern recognition? Correct data structure?"
                rows={2}
              />
            </div>

            <div className="sim-reflect-field">
              <label>Where did you get stuck?</label>
              <textarea
                value={r.gotStuck || ''}
                onChange={(e) => onReflectionChange(p.id, 'gotStuck', e.target.value)}
                placeholder="Specific step, edge case, complexity concern..."
                rows={2}
              />
            </div>

            <div className="sim-reflect-field">
              <label>What pattern did you miss? (optional)</label>
              <textarea
                value={r.patternMissed || ''}
                onChange={(e) => onReflectionChange(p.id, 'patternMissed', e.target.value)}
                placeholder="Two pointers, sliding window, DP, etc."
                rows={1}
              />
            </div>
          </div>
        );
      })}

      <div className="sim-reflect-actions">
        <Button
          variant="primary"
          onClick={onFinish}
          disabled={!allReflected}
        >
          {allReflected ? 'Get feedback →' : 'Fill out reflections to continue'}
        </Button>
      </div>
    </div>
  );
}

// ============================================================
// RESULTS VIEW — unchanged from your original
// ============================================================

function ResultsView({ feedback, session, userTier, userId, onStartNew }) {
  const [canStartAnother, setCanStartAnother] = useState(undefined);

  useEffect(() => {
    let canceled = false;
    (async () => {
      const gate = await canStartNewSim(userId, userTier);
      if (!canceled) setCanStartAnother(gate.allowed);
    })();
    return () => { canceled = true; };
  }, [userId, userTier]);

  return (
    <div className="sim-results">
      <div className="page-header">
        <div>
          <h1>Session complete</h1>
          <p className="page-sub">Auto-generated feedback based on your session data</p>
        </div>
      </div>

      <InterviewFeedback feedback={feedback} session={session} />

      <div className="sim-results-actions">
        {canStartAnother && (
          <Button variant="primary" onClick={onStartNew}>
            Start another simulation →
          </Button>
        )}
        <Link to="/dashboard" className="btn">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}