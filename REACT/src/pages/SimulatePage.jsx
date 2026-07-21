import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import Badge from '../components/Badge';
import TopicChip from '../components/TopicChip';
import SimulationTimer from '../components/SimulationTimer';
import InterviewFeedback from '../components/InterviewFeedback';
import { useApp } from '../context/AppContext.jsx';
import { topics } from '../data/topics.js';
import { getDifficultyType } from '../data/problems.js';
import {
  generateSession,
  canStartNewSim,
  recordSimStart,
  recordSessionResult,
  generateFeedback,
  getSimsUsedThisWeek,
} from '../utils/interviewSim.js';
import { canAccess, getRequiredTier, getTierLabel, getTierPrice, isFreeUser } from '../utils/tierGate.js';
import { triggerSync } from '../utils/sync.js';
import { usePageTitle } from '../utils/usePageTitle.js';
import '../styles/app.css';
import '../styles/simulate.css';

// SimulatePage — full-screen interview simulation. Five phases:
//   'gate'    → tier check + weekly-usage check (may show upgrade prompt)
//   'setup'   → user picks duration, problem count, difficulty mix, topics
//   'active'  → running the session, problem-by-problem
//   'reflect' → post-session reflection questions
//   'results' → feedback summary
//
// KEY UX DECISIONS:
//   - Sidebar hidden during active/reflect phases (no distraction)
//   - Timer always visible in top-right during active
//   - Approach textarea is REQUIRED before "next problem" button unlocks
//     (soft-forced approach-first — the whole point of the mode)
//   - No hints, no solution access — this is the "raw" mode
//   - Time up = auto-advance to reflection (no losing work)

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

export default function SimulatePage() {
  usePageTitle('Interview Simulation');
  const { user, roadmapSetup } = useApp();
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
  const [setupError, setSetupError] = useState(null);

  // Active session state
  const [session, setSession] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [approaches, setApproaches] = useState({});
  const [perProblemMetrics, setPerProblemMetrics] = useState({});
  const [problemStartTime, setProblemStartTime] = useState(null);
  const [firstKeystrokeAt, setFirstKeystrokeAt] = useState(null);

  // Reflection state
  const [reflections, setReflections] = useState({});

  // Results state
  const [feedback, setFeedback] = useState(null);
  const [finalSession, setFinalSession] = useState(null);

  const availableTopics = useMemo(() => topics.filter((t) => t.seeded), []);

  // Basic tier gate check on mount
  useEffect(() => {
    const gate = canStartNewSim(userTier);
    if (!gate.allowed) {
      setGateInfo(gate);
      setPhase('gate');
    } else {
      setGateInfo(gate);
      setPhase('setup');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Time-up handler
  const handleTimeUp = () => {
    if (phase === 'active') {
      // Capture current problem metrics before advancing
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

  function handleStart() {
    if (selectedTopicKeys.length === 0) {
      setSetupError('Pick at least one topic.');
      return;
    }

    const mix = DIFFICULTY_PRESETS[difficultyPreset];
    const generated = generateSession({
      problemCount,
      durationMinutes: duration,
      topicKeys: selectedTopicKeys,
      difficultyMix: { easy: mix.easy, medium: mix.medium, hard: mix.hard },
    });

    if (!generated) {
      setSetupError('Not enough problems in your selection. Try adding more topics or changing difficulty.');
      return;
    }

    // Record usage (contributes to weekly cap for Free users)
    recordSimStart();

    const started = { ...generated, startedAt: Date.now() };
    setSession(started);
    setCurrentIdx(0);
    setApproaches({});
    setPerProblemMetrics({});
    setReflections({});
    setProblemStartTime(Date.now());
    setFirstKeystrokeAt(null);
    setPhase('active');
    if (user?.id) triggerSync(user.id);
  }

  function handleApproachChange(text) {
    const currentProblem = session.problems[currentIdx];
    if (!currentProblem) return;

    // Capture first keystroke time
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
      // Confirm before losing progress
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

  // ── RENDER PHASES ─────────────────────────────────────────────────

  // Show sidebar only during gate/setup/results, hide during active session
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
          />
        )}

        {phase === 'reflect' && session && (
          <ReflectView
            session={session}
            reflections={reflections}
            onReflectionChange={handleReflectionChange}
            onFinish={handleFinishSession}
          />
        )}

        {phase === 'results' && feedback && finalSession && (
          <ResultsView
            feedback={feedback}
            session={finalSession}
            userTier={userTier}
            onStartNew={handleStartNew}
          />
        )}
      </main>
    </div>
  );
}

// ============================================================
// GATE VIEW — shown when user has hit their weekly free-tier cap
// ============================================================

function GateView({ gateInfo, userTier }) {
  const nextAvailable = gateInfo?.nextAvailableAt;
  const now = Date.now();
  const msRemaining = nextAvailable ? nextAvailable - now : 0;
  const daysRemaining = Math.ceil(msRemaining / (24 * 60 * 60 * 1000));
  const requiredTier = getRequiredTier('unlimitedInterviewSims');

  return (
    <div className="sim-gate-view">
      <div className="sim-gate-icon">⏳</div>
      <h1 className="sim-gate-title">You've used this week's free simulation</h1>
      <p className="sim-gate-message">
        Free tier includes 1 interview simulation per week.
        {daysRemaining > 0 && (
          <> Next available in <strong>{daysRemaining} day{daysRemaining === 1 ? '' : 's'}</strong>.</>
        )}
      </p>

      <div className="sim-gate-upgrade">
        <div className="sim-gate-upgrade-header">
          <div className="sim-gate-upgrade-tier">
            Upgrade to {getTierLabel(requiredTier)}
          </div>
          <div className="sim-gate-upgrade-price">
            ₹{getTierPrice(requiredTier)}
          </div>
        </div>
        <ul className="sim-gate-upgrade-benefits">
          <li>✓ Unlimited interview simulations</li>
          <li>✓ 1-3 problems per session</li>
          <li>✓ 30/45/60 min duration options</li>
          <li>✓ All topics unlocked</li>
          <li>✓ Full code editor access</li>
        </ul>
        <Link to="/settings" className="btn btn-primary btn-sm">
          Upgrade now →
        </Link>
      </div>

      <Link to="/dashboard" className="btn btn-sm">← Back to dashboard</Link>
    </div>
  );
}

// ============================================================
// SETUP VIEW
// ============================================================

function SetupView({
  duration, setDuration,
  problemCount, setProblemCount,
  difficultyPreset, setDifficultyPreset,
  selectedTopicKeys, toggleTopic, availableTopics,
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
        <label className="sim-setup-label">Topics</label>
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
// ACTIVE VIEW — problem-by-problem, timer running
// ============================================================

function ActiveView({ session, currentIdx, approach, onApproachChange, onNextProblem, onTimeUp, onCancel }) {
  const currentProblem = session.problems[currentIdx];
  const isLastProblem = currentIdx === session.problems.length - 1;
  const hasApproach = approach.trim().length >= 10; // minimum meaningful approach

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
          End session
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
                title="Open on LeetCode in new tab — you decide if this is real interview behavior"
              >
                ↗ LeetCode #{currentProblem.leetcode}
              </a>
            )}
          </div>
        </div>

        {/* Problem statement — the actual thing the user needs to solve.
            Without this, "interview simulation" is just "guess what this
            problem is about." Full statement rendered inline. Examples
            and constraints below if available. */}
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

        <div className="sim-active-instructions">
          <p><strong>No hints. No solution access. Just you and the problem.</strong></p>
          <p>Sketch your approach below. Consider: pattern to use, data structures, edge cases, complexity.</p>
          <p style={{ color: 'var(--text-low)', fontSize: 12, marginTop: 8 }}>
            💡 In a real interview, you'd talk through your approach out loud. Writing it here is the equivalent.
          </p>
        </div>

        <div className="sim-active-approach">
          <label className="sim-active-approach-label">
            Your approach
            {!hasApproach && <span style={{ color: 'var(--red)', marginLeft: 8, fontSize: 11 }}>Required to continue</span>}
          </label>
          <textarea
            className="sim-active-approach-input"
            value={approach}
            onChange={(e) => onApproachChange(e.target.value)}
            placeholder="Describe your approach — pattern, data structure, edge cases, why it works..."
            autoFocus
          />
        </div>
      </div>

      <div className="sim-active-actions">
        <Button
          variant="primary"
          onClick={onNextProblem}
          disabled={!hasApproach}
        >
          {isLastProblem ? 'Finish problems → Reflect' : 'Next problem →'}
        </Button>
      </div>
    </div>
  );
}

// ============================================================
// REFLECT VIEW
// ============================================================

function ReflectView({ session, reflections, onReflectionChange, onFinish }) {
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
        return (
          <div key={p.id} className="sim-reflect-problem">
            <div className="sim-reflect-problem-header">
              <span className="sim-reflect-problem-name">{p.name}</span>
              <Badge type={getDifficultyType(p.difficulty)}>{p.difficulty}</Badge>
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
// RESULTS VIEW
// ============================================================

function ResultsView({ feedback, session, userTier, onStartNew }) {
  const gate = canStartNewSim(userTier);

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
        {gate.allowed && (
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