import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import Badge from '../components/Badge';
import ConfidenceButton from '../components/ConfidenceButton';
import SimulationTimer from '../components/SimulationTimer';
import CodeEditorPanel from '../components/CodeEditorPanel';
import CodeEditorPlaceholder from '../components/CodeEditorPlaceholder';
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
    computeWeeklyTestScore,
} from '../utils/weeklyTests.js';
import { loadTestCases, hasTestCases } from '../utils/testCaseLoader.js';
import { loadJSON, saveJSON } from '../utils/storage.js';
import { supabase } from '../utils/supabaseClient.js';
import { recordSolve } from '../utils/activity.js';
import { triggerSync } from '../utils/sync.js';
import { usePageTitle } from '../utils/usePageTitle.js';
import WeeklyTestSampleChart from '../components/samples/WeeklyTestSampleChart';
import SessionLoader from '../components/SessionLoader';
import '../styles/app.css';
import '../styles/simulate.css';
import '../styles/weeklyTests.css';
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

    // NEW: per-problem editor results — same shape as Custom Test
    const [perProblemEditorResults, setPerProblemEditorResults] = useState({});

    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);

    const hasAccess = canAccess('weeklyTests', userTier);

    useEffect(() => {
        if (!user?.id) return;
        if (!tierLoaded) return;

        if (!hasAccess) {
            setPhase('gate');
            return;
        }

        (async () => {
            const s = await getCurrentWeekTestStatus(user.id);
            setStatus(s);
            if (s.alreadyTaken) {
                setPhase('done');
            } else if (!s.isTestDay) {
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
        setPerProblemEditorResults({});
        setPhase('active');
        if (user?.id) triggerSync(user.id);
    }

    async function handleSkip() {
        if (!status) return;
        if (!window.confirm('Skip this week\'s test? You can take it up until midnight tonight.')) return;

        await recordTestSkip(user.id, status.weekId);
        setStatus({ ...status, alreadySkipped: true });
        if (user?.id) triggerSync(user.id);
        navigate('/dashboard');
    }

    function handleRateProblem(problemId, rating) {
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
        // Use combined scoring — editor result takes priority over self-rating
        const score = computeWeeklyTestScore(
            session.problems,
            perProblemRatings,
            perProblemEditorResults
        );
        const totalRated = Object.keys(perProblemRatings).length;
        const timeSpentMs = Date.now() - session.startedAt;

        const testResults = {
            score,
            totalRated,
            timeSpentMs,
            perProblemRatings,
            perProblemEditorResults,
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

    // ─── Editor handlers ────────────────────────────────────
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

        // Mark problem as solved in progress (same code path as ProblemPage)
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

        // Auto-set confidence to "Solved" (3) if not yet rated
        if (perProblemRatings[problemId] == null) {
            handleRateProblem(problemId, 3);
        }

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
            console.error('[WeeklyTest] Failed to log submission:', err);
        }
    }

    // ── RENDER ───────────────────────────────────────────────

    const showSidebar = phase !== 'active';

    return (
        <div className={`app-layout ${!showSidebar ? 'no-sidebar' : ''}`}>
            {showSidebar && <Sidebar />}

            <main className="main-content">
                {phase === 'loading' && (
                    <SessionLoader icon="🕐" label="Loading weekly test..." />
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

// ============================================================
// GATE VIEW — unchanged
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
// NOT TODAY / DONE VIEWS — unchanged
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
// SETUP VIEW — unchanged
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
                    <li>Code editor available if test cases exist for the problem</li>
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
// ACTIVE VIEW — 2-column split with editor
// ============================================================

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

// ============================================================
// RESULTS VIEW — shows both rating AND editor result per problem
// ============================================================

function ResultsView({ session, results }) {
    const { score, timeSpentMs, perProblemRatings, perProblemEditorResults } = results;
    const percent = Math.round((score / session.problems.length) * 100);
    const minutes = Math.floor(timeSpentMs / 60000);
    const seconds = Math.floor((timeSpentMs % 60000) / 1000);
    const timeStr = `${minutes}:${String(seconds).padStart(2, '0')}`;

    const verdict = percent >= 66
        ? { emoji: '🎯', text: 'Strong week' }
        : percent >= 33
            ? { emoji: '💪', text: 'Solid effort' }
            : { emoji: '📝', text: 'Data collected — keep going' };

    // Editor engagement summary for this session
    const editorAttempts = Object.values(perProblemEditorResults || {}).filter((r) => r?.attempted);
    const editorPasses = editorAttempts.filter((r) => r.passed).length;
    const editorAttemptCount = editorAttempts.length;

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
                {editorAttemptCount > 0 && (
                    <StatBlock
                        label="Editor pass"
                        value={`${editorPasses}/${editorAttemptCount}`}
                    />
                )}
            </div>

            <div className="weekly-test-results-breakdown">
                <div className="weekly-test-results-section-title">Per-problem breakdown</div>

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
                            <div>
                                <div className="weekly-test-results-name">{p.name}</div>
                                <div className="weekly-test-results-meta">
                                    {p.topicLabel} · {p.difficulty}
                                </div>
                            </div>

                            <div className="test-results-cell-rating">
                                {rating != null
                                    ? confidenceOptions.find((o) => o.value === rating)?.label || `${rating}/4`
                                    : <span className="test-results-empty-cell">Not rated</span>}
                            </div>

                            <div className="test-results-cell-editor">
                                {editorResult?.attempted ? (
                                    <div className={`test-results-editor-status ${editorResult.passed ? 'passed' : 'failed'}`}>
                                        {editorResult.passed
                                            ? `✅ Passed (${editorResult.language?.toUpperCase()}, ${editorResult.submissionCount} sub${editorResult.submissionCount === 1 ? '' : 's'})`
                                            : `❌ ${editorResult.passedTests}/${editorResult.totalTests} passed (${editorResult.language?.toUpperCase()})`}
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