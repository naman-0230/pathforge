import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Badge from '../components/Badge';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import HintItem from '../components/HintItem';
import ConfidenceButton from '../components/ConfidenceButton';
import NotesPanel from '../components/NotesPanel';
import ApproachPanel from '../components/ApproachPanel';
import FailureReasonPrompt from '../components/FailureReasonPrompt';
import CodeEditorPanel from '../components/CodeEditorPanel';
import CompactTrackingPanel from '../components/CompactTrackingPanel';
import SolveInEditorButton from '../components/SolveInEditorButton';
import CodeEditorPlaceholder from '../components/CodeEditorPlaceholder';
import { loadJSON, saveJSON } from '../utils/storage.js';
import { triggerSync } from '../utils/sync.js';
import { recordSolve } from '../utils/activity.js';
import { getProblem, getProblemsByTopic, getDifficultyType } from '../data/problems.js';
import { getTopic } from '../data/topics.js';
import { getProblemDetails } from '../data/problemDetails.js';
import { getPreferences } from '../utils/preferences.js';
import { canUseCodeEditor } from '../utils/tierGate.js';
import { useApp } from '../context/AppContext.jsx';
import { highlightCode } from '../utils/prismSetup.js';
import { loadTestCases, hasTestCases } from '../utils/testCaseLoader.js';
import { getSplitPosition, saveSplitPosition } from '../utils/codeEditorState.js';
import { supabase } from '../utils/supabaseClient.js';
import '../styles/app.css';
import '../styles/problem.css';
import '../styles/codeEditor.css';
import '../styles/prism-theme.css';
import { usePageTitle } from '../utils/usePageTitle.js';

const confidenceOptions = [
  { value: 1, label: '😵 Clueless' },
  { value: 2, label: '🤔 Needed hints' },
  { value: 3, label: '😊 Got it' },
  { value: 4, label: '🚀 Easy' },
];

const DIFFICULTY_TIME_MULTIPLIER = { Easy: 0.6, Medium: 1, Hard: 1.6 };

function formatTime(totalSeconds) {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(clamped / 60);
  const s = clamped % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function formatDisplayDate(dateStr) {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function todayDateStr() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function ProblemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const problemId = id || 'two-sum';
  const storageKey = `pathforge:problem:${problemId}`;

  const problem = getProblem(problemId);
  const details = getProblemDetails(problemId);
  const topic = problem ? getTopic(problem.topicKey) : null;
  const topicProblems = problem ? getProblemsByTopic(problem.topicKey) : [];
  const positionInTopic = topicProblems.findIndex((p) => p.id === problemId) + 1;
  const currentIndex = positionInTopic - 1;
  const prevProblem = currentIndex > 0 ? topicProblems[currentIndex - 1] : null;
  const nextProblem = currentIndex >= 0 && currentIndex < topicProblems.length - 1
    ? topicProblems[currentIndex + 1]
    : null;

  const saved = loadJSON(storageKey, null);
  const prefs = getPreferences();
  const wasAlreadyDone = prefs.gate.bypassIfAlreadyDone && (saved?.isSolved || saved?.solutionEverViewed);

  const [unlockedHints, setUnlockedHints] = useState(() => new Set(saved?.unlockedHints || []));
  const [openHints, setOpenHints] = useState(new Set());
  const [activeApproach, setActiveApproach] = useState(details?.approaches?.[0]?.key || 'brute');
  const [activeLanguage, setActiveLanguage] = useState(prefs.defaultCodeLanguage || 'java');
  const [confidenceRating, setConfidenceRating] = useState(saved?.confidenceRating ?? null);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(saved?.timeSpentSeconds ?? null);
  const [attemptConfirmed, setAttemptConfirmed] = useState(saved?.attemptConfirmed ?? false);
  const [solutionVisible, setSolutionVisible] = useState(false);
  const [solutionEverViewed, setSolutionEverViewed] = useState(saved?.solutionEverViewed ?? false);
  const [isSolved, setIsSolved] = useState(saved?.isSolved ?? false);
  const [flaggedForRevision, setFlaggedForRevision] = useState(saved?.flaggedForRevision ?? false);
  const [notes, setNotes] = useState(saved?.notes ?? '');
  const [approach, setApproach] = useState(() => {
    const attempts = saved?.attempts || [];
    const lastAttempt = attempts[attempts.length - 1];
    return lastAttempt?.approach || '';
  });
  const [savedApproachOnLoad] = useState(() => {
    const attempts = saved?.attempts || [];
    return attempts[attempts.length - 1]?.approach || '';
  });
  const [attempts, setAttempts] = useState(saved?.attempts ?? []);
  const [solvedAt, setSolvedAt] = useState(saved?.solvedAt ?? null);
  const [firstSolvedAt, setFirstSolvedAt] = useState(saved?.firstSolvedAt ?? null);
  const [markedHard, setMarkedHard] = useState(saved?.markedHard ?? false);
  const [accumulatedSeconds, setAccumulatedSeconds] = useState(saved?.accumulatedSeconds ?? 0);
  const [runningSince, setRunningSince] = useState(saved?.runningSince ?? null);
  const [nowTick, setNowTick] = useState(() => Date.now());
  const [approachPromptOpen, setApproachPromptOpen] = useState(false);
  const [failurePromptOpen, setFailurePromptOpen] = useState(false);
  const [failureReasonLogged, setFailureReasonLogged] = useState(false);

  const [solvedViaEditor, setSolvedViaEditor] = useState(saved?.solvedViaEditor ?? false);
  const [editorSubmissionCount, setEditorSubmissionCount] = useState(saved?.editorSubmissionCount ?? 0);
  const [lastEditorLanguage, setLastEditorLanguage] = useState(saved?.lastEditorLanguage ?? null);
  const [firstAcceptedAt, setFirstAcceptedAt] = useState(saved?.firstAcceptedAt ?? null);

  const [layoutMode, setLayoutMode] = useState('reading');
  const [splitPercent, setSplitPercent] = useState(() => getSplitPosition());
  const [testCaseSpec, setTestCaseSpec] = useState(null);
  const [testCaseSpecLoading, setTestCaseSpecLoading] = useState(false);
  const [pendingConfidencePrompt, setPendingConfidencePrompt] = useState(false);

  const problemOpenedAtRef = useRef(Date.now());
  const firstWriteAtRef = useRef(null);
  const wasAlreadyDoneOnLoadRef = useRef(!!saved?.isSolved);

  function recordFirstWriteIfNeeded() {
    if (firstWriteAtRef.current !== null) return;
    if (wasAlreadyDoneOnLoadRef.current) return;
    firstWriteAtRef.current = Date.now();
  }

  useEffect(() => {
    if (!runningSince) return;
    const tickId = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(tickId);
  }, [runningSince]);

  const elapsedSeconds = accumulatedSeconds + (runningSince ? Math.floor((nowTick - runningSince) / 1000) : 0);
  const effectiveMinSeconds = prefs.gate.scaleByDifficulty
    ? Math.round(prefs.gate.minSeconds * (DIFFICULTY_TIME_MULTIPLIER[problem?.difficulty] ?? 1))
    : prefs.gate.minSeconds;
  const hasMetMinimum = !prefs.gate.enabled || elapsedSeconds >= effectiveMinSeconds;
  const timerHasStarted = runningSince !== null || accumulatedSeconds > 0;
  const confidenceGiven = confidenceRating != null;
  const gateSatisfied = wasAlreadyDone || (hasMetMinimum && confidenceGiven);

  const { user } = useApp();

  useEffect(() => {
    let cancelled = false;
    if (!problemId) return;
    setTestCaseSpecLoading(true);
    loadTestCases(problemId).then((spec) => {
      if (!cancelled) {
        setTestCaseSpec(spec);
        setTestCaseSpecLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [problemId]);

  useEffect(() => {
    saveJSON(storageKey, {
      attempts,
      unlockedHints: Array.from(unlockedHints),
      confidenceRating,
      timeSpentSeconds,
      attemptConfirmed,
      solutionEverViewed,
      isSolved,
      solvedAt,
      firstSolvedAt,
      accumulatedSeconds,
      runningSince,
      flaggedForRevision,
      notes,
      markedHard,
      solvedViaEditor,
      editorSubmissionCount,
      lastEditorLanguage,
      firstAcceptedAt,
    });
    triggerSync(user?.id);
  }, [attempts, unlockedHints, confidenceRating, timeSpentSeconds, attemptConfirmed, solutionEverViewed, isSolved, solvedAt, firstSolvedAt, accumulatedSeconds, runningSince, flaggedForRevision, notes, markedHard, solvedViaEditor, editorSubmissionCount, lastEditorLanguage, firstAcceptedAt, storageKey, user?.id]);

  useEffect(() => {
    setLayoutMode('reading');
    setPendingConfidencePrompt(false);
  }, [problemId]);

  function handleHintClick(hintNumber) {
    if (unlockedHints.has(hintNumber)) {
      // Single-open policy: opening a new hint closes others
      setOpenHints((prev) => {
        if (prev.has(hintNumber)) {
          // Toggle off if already open
          return new Set();
        }
        return new Set([hintNumber]);
      });
    } else {
      setUnlockedHints((prev) => new Set(prev).add(hintNumber));
      setOpenHints(new Set([hintNumber]));
    }
  }

  function handlePrevProblem() {
    if (prevProblem) navigate(`/problem/${prevProblem.id}`);
  }

  function handleNextProblem() {
    if (nextProblem) navigate(`/problem/${nextProblem.id}`);
  }

  function handleToggleStopwatch() {
    if (runningSince) {
      setAccumulatedSeconds((prev) => prev + Math.floor((Date.now() - runningSince) / 1000));
      setRunningSince(null);
    } else {
      setRunningSince(Date.now());
    }
  }

  function handleConfidenceRating(value) {
    setConfidenceRating(value);
    setPendingConfidencePrompt(false);
    const frozenTime = timeSpentSeconds ?? elapsedSeconds;
    if (timeSpentSeconds === null) {
      setTimeSpentSeconds(frozenTime);
    }

    setAttempts((prev) => {
      const isFirstRating = confidenceRating === null;
      const timeToFirstWriteMs = firstWriteAtRef.current !== null
        ? firstWriteAtRef.current - problemOpenedAtRef.current
        : null;

      if (isFirstRating) {
        const newEntry = {
          date: todayDateStr(),
          confidenceRating: value,
          timeSpentSeconds: frozenTime,
          hintsOpened: unlockedHints.size,
          solutionPeeked: solutionEverViewed,
          context: 'practice',
          approach: approach || '',
          approachWrittenAt: approach ? Date.now() : null,
          timeToFirstWriteMs,
        };
        return [...prev, newEntry];
      } else {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          confidenceRating: value,
          approach: approach || '',
          approachWrittenAt: approach ? Date.now() : updated[updated.length - 1].approachWrittenAt,
          timeToFirstWriteMs: updated[updated.length - 1].timeToFirstWriteMs ?? timeToFirstWriteMs,
        };
        return updated;
      }
    });
  }

  function handleApproachChange(text) {
    if (text && text.trim().length > 0) recordFirstWriteIfNeeded();
    setApproach(text);
    setAttempts((prev) => {
      if (prev.length === 0) return prev;
      const updated = [...prev];
      const last = updated[updated.length - 1];
      updated[updated.length - 1] = {
        ...last,
        approach: text,
        approachWrittenAt: text ? Date.now() : last.approachWrittenAt,
      };
      return updated;
    });
  }

  function handleNotesChange(text) {
    if (text && text.trim().length > 0) recordFirstWriteIfNeeded();
    setNotes(text);
  }

  function handleViewSolution() {
  // Skip approach nudge if user has already engaged via code editor
  // (any submission — successful or not — proves they attempted the problem)
  const engagedViaEditor = editorSubmissionCount > 0 || solvedViaEditor;

  if (
    prefs.approach.promptIfEmpty &&
    (!approach || approach.trim().length === 0) &&
    !approachPromptOpen &&
    !engagedViaEditor
  ) {
    setApproachPromptOpen(true);
    return;
  }
  if (
    prefs.failureArchive.promptOnPeek &&
    !failureReasonLogged &&
    !failurePromptOpen
  ) {
    setFailurePromptOpen(true);
    return;
  }
  proceedToSolution();
}

  function handleFailureReasonSelect(reason) {
    setFailureReasonLogged(true);
    setFailurePromptOpen(false);
    setAttempts((prev) => {
      if (prev.length === 0) return prev;
      const updated = [...prev];
      const last = updated[updated.length - 1];
      updated[updated.length - 1] = {
        ...last,
        peekReason: reason,
        peekReasonLoggedAt: Date.now(),
      };
      return updated;
    });
    proceedToSolution();
  }

  function handleFailureReasonSkip() {
    setFailureReasonLogged(true);
    setFailurePromptOpen(false);
    proceedToSolution();
  }

  function proceedToSolution() {
    setApproachPromptOpen(false);
    setSolutionVisible(true);
    setSolutionEverViewed(true);
    if (timeSpentSeconds === null) {
      setTimeSpentSeconds(elapsedSeconds);
    }
    if (runningSince) {
      setAccumulatedSeconds((prev) => prev + Math.floor((Date.now() - runningSince) / 1000));
      setRunningSince(null);
    }
  }

  function handleToggleFlag() {
    setFlaggedForRevision((prev) => !prev);
  }

  function handleToggleHard() {
    setMarkedHard((prev) => !prev);
  }

  function gateBlockingMessage() {
    if (wasAlreadyDone) return '✓ Already completed — solution unlocked';
    if (!confidenceGiven) return 'Rate your confidence above before viewing the solution';
    if (prefs.gate.enabled && !timerHasStarted) return 'Start the attempt timer above first';
    if (prefs.gate.enabled && timerHasStarted && !hasMetMinimum) {
      return `⏱ ${formatTime(effectiveMinSeconds - elapsedSeconds)} left before you can confirm`;
    }
    return null;
  }

  const markProblemSolved = useCallback(({ viaEditor = false, editorDetails = null } = {}) => {
    if (!isSolved) recordSolve();
    setIsSolved(true);
    const today = todayDateStr();
    setSolvedAt(today);
    setFirstSolvedAt((prev) => prev ?? today);

    if (viaEditor && editorDetails) {
      setSolvedViaEditor(true);
      setLastEditorLanguage(editorDetails.language);
      setFirstAcceptedAt((prev) => prev ?? Date.now());

      setAttempts((prev) => {
        const timeToFirstWriteMs = firstWriteAtRef.current !== null
          ? firstWriteAtRef.current - problemOpenedAtRef.current
          : null;

        const editorFields = {
          solvedViaEditor: true,
          submissionCount: editorSubmissionCount + 1,
          languageUsed: editorDetails.language,
          acceptedAt: Date.now(),
          firstFailedTestId: null,
        };

        if (prev.length === 0) {
          return [{
            date: today,
            confidenceRating: null,
            timeSpentSeconds: timeSpentSeconds ?? elapsedSeconds,
            hintsOpened: unlockedHints.size,
            solutionPeeked: solutionEverViewed,
            context: 'practice',
            approach: approach || '',
            approachWrittenAt: approach ? Date.now() : null,
            timeToFirstWriteMs,
            ...editorFields,
          }];
        } else {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            ...editorFields,
          };
          return updated;
        }
      });
    }
  }, [isSolved, editorSubmissionCount, timeSpentSeconds, elapsedSeconds, unlockedHints, solutionEverViewed, approach]);

  function handleManualMarkSolved() {
    markProblemSolved();
  }

  function handleEnterCodingMode() {
    if (!testCaseSpec) return;
    setLayoutMode('entering');
    // Faster transition — 350ms feels responsive not laggy
    setTimeout(() => setLayoutMode('coding'), 350);
  }

  function handleExitCodingMode() {
    setLayoutMode('exiting');
    setTimeout(() => setLayoutMode('reading'), 350);
  }

  async function handleEditorSubmission(record) {
    if (record.submissionType === 'submit') {
      setEditorSubmissionCount((prev) => prev + 1);
    }

    if (user?.id) {
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
        console.error('[ProblemPage] Failed to log submission:', err);
      }
    }
  }

  function handleEditorAccepted(details) {
    markProblemSolved({
      viaEditor: true,
      editorDetails: details,
    });

    if (confidenceRating === null) {
      setPendingConfidencePrompt(true);
    }

    if (runningSince) {
      setAccumulatedSeconds((prev) => prev + Math.floor((Date.now() - runningSince) / 1000));
      setRunningSince(null);
    }
  }

  const isDraggingRef = useRef(false);
  const containerRef = useRef(null);

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
      const rawPercent = ((e.clientX - rect.left) / rect.width) * 100;
      const clamped = Math.max(25, Math.min(55, rawPercent));
      setSplitPercent(clamped);
    }

    function handleMouseUp() {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        saveSplitPosition(splitPercent);
      }
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [splitPercent]);

  if (!problem) {
    return (
      <div className={`app-layout ${isCodingMode ? 'coding-mode-active' : ''}`}>
  <Sidebar forceCollapse={isCodingMode} />
        <main className="main-content">
          <p style={{ color: 'var(--text-mid)' }}>
            Couldn't find a problem with id "{problemId}".{' '}
            <Link to="/roadmap" style={{ color: 'var(--accent-mid)' }}>Back to roadmap</Link>
          </p>
        </main>
      </div>
    );
  }
  usePageTitle(problem?.name || 'Problem');

  const gateMessage = gateBlockingMessage();

  const userTier = user?.tier || 'free';
  const canUseEditor = canUseCodeEditor(userTier, {
    topicKey: problem.topicKey,
    section: problem.section,
  });
  const problemHasTestCases = hasTestCases(problemId);
  const editorSupported = problemHasTestCases;

  const isCodingMode = layoutMode === 'coding' || layoutMode === 'entering' || layoutMode === 'exiting';

  return (
    <div className={`app-layout ${isCodingMode ? 'coding-mode-active' : ''}`}>
      <Sidebar forceCollapse={isCodingMode} />

      <div
        ref={containerRef}
        className={`problem-layout problem-layout-${layoutMode}`}
        style={isCodingMode ? { '--split-percent': `${splitPercent}%` } : undefined}
      >
        {/* ═══════════════════════════════════════════════════
            LEFT COLUMN — problem content
            ═══════════════════════════════════════════════════ */}
        <div className="problem-left">
          {/* Coding-mode header bar: back button + prev/next + position */}
          {isCodingMode && (
            <div className="coding-mode-header-bar">
              <button
                type="button"
                className="btn btn-sm coding-mode-back-btn"
                onClick={handleExitCodingMode}
              >
                ← Back to reading
              </button>
              <div className="coding-mode-nav-cluster">
                <span className="coding-mode-position">
                  {positionInTopic} / {topicProblems.length}
                </span>
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={handlePrevProblem}
                  disabled={!prevProblem}
                  title={prevProblem ? `← ${prevProblem.name}` : 'No previous problem'}
                >
                  ← Prev
                </button>
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={handleNextProblem}
                  disabled={!nextProblem}
                  title={nextProblem ? `${nextProblem.name} →` : 'No next problem'}
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Scrollable content area */}
          <div className={`problem-left-scroll ${isCodingMode ? 'problem-left-scroll-coding' : ''}`}>
            <div className="stagger-children">
              {!isCodingMode && (
                <div className="breadcrumb">
                  <Link to="/roadmap">Roadmap</Link> <span>›</span>
                  <span>{topic?.label}</span> <span>›</span>
                  <span className="bc-current">{problem.name}</span>
                </div>
              )}

              <div className="prob-header">
                <h1 className="prob-title">{problem.name}</h1>
                <div className="prob-tags">
                  <Badge type={getDifficultyType(problem.difficulty)}>{problem.difficulty}</Badge>
                  <Badge type="purple">{topic?.label}</Badge>
                  <Badge type="purple">{problem.pattern}</Badge>
                  {details?.requirement && <Badge type="amber">{details.requirement}</Badge>}
                  {solvedViaEditor && (
                    <Badge type="green">🏆 Solved via {lastEditorLanguage?.toUpperCase() || 'editor'}</Badge>
                  )}
                </div>
                <div className="prob-links">
                  <a
                    href={details?.externalLinks?.[0]?.url || `https://leetcode.com/problemset/?search=${encodeURIComponent(problem.name)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="ext-link"
                  >
                    ↗ LeetCode #{problem.leetcode}
                  </a>
                </div>
              </div>

              {details ? (
                <>
                  <div className="prob-section">
                    <div className="prob-section-title">Problem</div>
                    <p className="prob-text">{details.statement}</p>
                  </div>

                  <div className="prob-section">
                    <div className="prob-section-title">Examples</div>
                    {details.examples.map((ex) => (
                      <div className="example-block" key={ex.label}>
                        <div className="example-label">{ex.label}</div>
                        <pre><code>{ex.text}</code></pre>
                      </div>
                    ))}
                  </div>

                  <div className="prob-section">
                    <div className="prob-section-title">Constraints</div>
                    <ul className="constraints-list">
                      {details.constraints.map((c) => (
                        <li key={c} dangerouslySetInnerHTML={{ __html: c }} />
                      ))}
                      <li><strong>Required:</strong> {details.requiredComplexity}</li>
                    </ul>
                  </div>

                  {solutionVisible && (
                    <div className="prob-section stagger-children" id="solution-section">
                      <div className="prob-section-title">Solution</div>
                      <div className="approach-tabs">
                        {details.approaches.map((a) => (
                          <button
                            key={a.key}
                            className={`approach-tab ${activeApproach === a.key ? 'active' : ''}`}
                            onClick={() => setActiveApproach(a.key)}
                          >
                            {a.label}
                          </button>
                        ))}
                      </div>

                      {details.approaches.map((a) =>
                        activeApproach === a.key ? (
                          <div key={a.key}>
                            <p className="prob-text" style={{ marginBottom: 12 }}>{a.explanation}</p>

                            <div className="language-tabs">
                              {Object.keys(a.code).map((lang) => (
                                <button
                                  key={lang}
                                  className={`lang-tab ${activeLanguage === lang ? 'active' : ''}`}
                                  onClick={() => setActiveLanguage(lang)}
                                >
                                  {lang}
                                </button>
                              ))}
                            </div>
                            <div className="code-block">
                              <pre><code
                                className={`language-${activeLanguage}`}
                                dangerouslySetInnerHTML={{
                                  __html: highlightCode(
                                    a.code[activeLanguage] || a.code.java || Object.values(a.code)[0],
                                    activeLanguage
                                  ),
                                }}
                              /></pre>
                            </div>

                            {a.dryRun && (
                              <div className="dryrun-box">
                                <div className="dryrun-title">{a.dryRun.title}</div>
                                <table className="dryrun-table">
                                  <thead>
                                    <tr>{a.dryRun.columns.map((c) => <th key={c}>{c}</th>)}</tr>
                                  </thead>
                                  <tbody>
                                    {a.dryRun.rows.map((row, i) => (
                                      <tr key={i}>
                                        {row.map((cell, j) => (
                                          <td key={j} className={i === a.dryRun.highlightRow ? 'highlight-cell' : undefined}>
                                            {cell}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        ) : null
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="prob-section">
                  <div className="prob-section-title">Problem</div>
                  <p className="prob-text">
                    Full write-up (examples, hints, solution walkthrough) for this problem hasn't been
                    added yet — it's next in line to be written. In the meantime, you can still look it
                    up on LeetCode using the link above, and use the panel on the right to rate your
                    confidence and mark it solved once you're done.
                  </p>
                </div>
              )}

              <NotesPanel notes={notes} onChange={handleNotesChange} />
            </div>
          </div>

          {/* STICKY BOTTOM — coding mode only */}
          {isCodingMode && (
            <div className="problem-left-sticky-bottom">
              <CompactTrackingPanel
                hints={details?.hints || null}
                unlockedHints={unlockedHints}
                openHints={openHints}
                onHintClick={handleHintClick}
                confidence={{
                  rating: confidenceRating,
                  onRate: handleConfidenceRating,
                  options: confidenceOptions,
                }}
                approach={{
                  value: approach,
                  onChange: handleApproachChange,
                  isLocked: solutionEverViewed,
                }}
                marks={{
                  isSolved,
                  onMarkSolved: handleManualMarkSolved,
                  isFlagged: flaggedForRevision,
                  onToggleFlag: handleToggleFlag,
                  isHard: markedHard,
                  onToggleHard: handleToggleHard,
                }}
                solutionGate={{
                  enabled: !!details?.hints,
                  satisfied: gateSatisfied,
                  message: gateMessage,
                  checkboxChecked: attemptConfirmed,
                  onCheckboxChange: setAttemptConfirmed,
                  onView: handleViewSolution,
                }}
              />

              {pendingConfidencePrompt && (
                <div className="post-acceptance-prompt">
                  🎉 All tests passed! Rate your confidence:
                  <div className="post-acceptance-buttons">
                    {confidenceOptions.map((opt) => (
                      <ConfidenceButton
                        key={opt.value}
                        value={opt.value}
                        label={opt.label}
                        selected={false}
                        onClick={handleConfidenceRating}
                        size="sm"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Divider */}
        {isCodingMode && (
          <div
            className="problem-layout-divider"
            onMouseDown={handleDividerMouseDown}
            role="separator"
            aria-orientation="vertical"
          />
        )}

        {/* ═══════════════════════════════════════════════════
            RIGHT COLUMN
            ═══════════════════════════════════════════════════ */}
        <div className="problem-right stagger-children">
          {!isCodingMode && (
            <>
              <div className="right-panel">
                <div className="prog-header">
                  <span className="prog-label">{topic?.label}</span>
                  <span className="prog-count">{positionInTopic} / {topicProblems.length}</span>
                </div>
                <ProgressBar percent={topicProblems.length > 0 ? Math.round((positionInTopic / topicProblems.length) * 100) : 0} />
                <div className="prob-nav">
                  <Button size="sm" onClick={handlePrevProblem} disabled={!prevProblem}>← Prev</Button>
                  <Button size="sm" onClick={handleNextProblem} disabled={!nextProblem}>Next →</Button>
                </div>
              </div>

              {details?.hints && (
                <div className="right-panel">
                  <div className="panel-title">💡 Hints</div>
                  <div className="hint-list">
                    {details.hints.map((h) => (
                      <HintItem
                        key={h.number}
                        number={h.number}
                        label={h.label}
                        text={h.text}
                        unlocked={unlockedHints.has(h.number)}
                        isOpen={openHints.has(h.number)}
                        onClick={() => handleHintClick(h.number)}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="right-panel">
                <div className="panel-title">📋 Track your attempt</div>

                {isSolved && solvedAt && (
                  <div className="solve-status" style={{
                    fontSize: 12,
                    color: 'var(--green, #3fae63)',
                    padding: '8px 0 4px',
                    borderBottom: '1px solid var(--border)',
                    marginBottom: 8,
                  }}>
                    {firstSolvedAt && firstSolvedAt !== solvedAt
                      ? `✓ First solved ${formatDisplayDate(firstSolvedAt)} · Last solved ${formatDisplayDate(solvedAt)}`
                      : `✓ Solved on ${formatDisplayDate(solvedAt)}`}
                    {solvedViaEditor && lastEditorLanguage && (
                      <span style={{ marginLeft: 8, opacity: 0.85 }}>
                        · 🏆 {lastEditorLanguage.toUpperCase()}
                      </span>
                    )}
                  </div>
                )}

                {prefs.gate.enabled && !wasAlreadyDone && (
                  <div className="track-subsection">
                    <div className="track-sublabel">Attempt timer</div>
                    <div className="timer-display">{formatTime(elapsedSeconds)}</div>
                    <button
                      className={`btn btn-sm timer-start-btn ${runningSince ? 'timer-stop-btn' : ''}`}
                      onClick={handleToggleStopwatch}
                    >
                      {runningSince ? '⏸ Stop' : timerHasStarted ? '▶ Resume' : '▶ Start timer'}
                    </button>
                    {timerHasStarted && (
                      <div className="timer-status">
                        {hasMetMinimum
                          ? '✓ Minimum attempt time reached'
                          : `${formatTime(effectiveMinSeconds - elapsedSeconds)} until solution unlocks`}
                      </div>
                    )}
                  </div>
                )}

                <div className="track-subsection">
                  <div className="track-sublabel">How did it go?</div>
                  <div className="conf-options">
                    {confidenceOptions.map((opt) => (
                      <ConfidenceButton
                        key={opt.value}
                        value={opt.value}
                        label={opt.label}
                        selected={confidenceRating === opt.value}
                        onClick={handleConfidenceRating}
                      />
                    ))}
                  </div>
                </div>

                {details?.hints && (
                  <div className="track-subsection">
                    <ApproachPanel
                      value={approach}
                      onChange={handleApproachChange}
                      previousApproach={(() => {
                        if (attempts.length >= 2) {
                          const prev = attempts[attempts.length - 2];
                          if (!prev?.approach) return null;
                          return {
                            text: prev.approach,
                            date: prev.date || null,
                            confidenceRating: prev.confidenceRating,
                          };
                        }
                        if (attempts.length === 1) {
                          const only = attempts[0];
                          if (!only?.approach) return null;
                          if (approach === savedApproachOnLoad && approach === only.approach) {
                            return {
                              text: only.approach,
                              date: only.date || null,
                              confidenceRating: only.confidenceRating,
                            };
                          }
                        }
                        return null;
                      })()}
                      isLocked={solutionEverViewed}
                    />
                  </div>
                )}

                <div className="track-subsection">
                  <div className="track-sublabel">Code it out</div>
                  <SolveInEditorButton
                    canUse={canUseEditor}
                    editorSupported={editorSupported}
                    onClick={handleEnterCodingMode}
                  />
                </div>

                <div className="track-subsection">
                  <div className="track-sublabel">Mark your progress</div>
                  <div className="mark-actions">
                    <button
                      className="btn mark-btn-done"
                      onClick={handleManualMarkSolved}
                      style={isSolved ? { background: 'var(--state-success-bg)', color: 'var(--green)', borderColor: 'var(--green)' } : undefined}
                    >
                      {isSolved ? '✓ Solved!' : '✓ Mark solved'}
                    </button>
                    <button
                      className={`btn mark-btn-flag ${flaggedForRevision ? 'mark-btn-flag-active' : ''}`}
                      onClick={handleToggleFlag}
                      aria-pressed={flaggedForRevision}
                      title={flaggedForRevision ? 'Remove from revision queue' : 'Flag this problem for revision'}
                    >
                      {flaggedForRevision ? '🔖 Flagged' : '🔖 Flag for revision'}
                    </button>
                    <button
                      className={`btn mark-btn-hard ${markedHard ? 'mark-btn-hard-active' : ''}`}
                      onClick={handleToggleHard}
                      aria-pressed={markedHard}
                      title={markedHard ? 'Remove hard-for-me mark' : 'Mark this problem as hard for you'}
                    >
                      {markedHard ? '🔥 Was hard' : '🔥 Hard for me'}
                    </button>
                  </div>
                </div>

                {details?.hints && (
                  <div className="track-subsection">
                    <div className="track-sublabel">View solution</div>
                    <div className="solution-gate">
                      {gateMessage && <div className="gate-timer">{gateMessage}</div>}
                      <label className={`check-label ${!gateSatisfied ? 'check-label-disabled' : ''}`}>
                        <input
                          type="checkbox"
                          checked={attemptConfirmed}
                          disabled={!gateSatisfied}
                          onChange={(e) => setAttemptConfirmed(e.target.checked)}
                        />
                        I attempted this problem genuinely
                      </label>
                      <button
                        className="btn btn-sm"
                        id="view-sol-btn"
                        disabled={!attemptConfirmed || !gateSatisfied}
                        onClick={handleViewSolution}
                      >
                        View solution + dry run
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {isCodingMode && (
            <>
              {testCaseSpec ? (
                <CodeEditorPanel
                  problemId={problemId}
                  topicKey={problem.topicKey}
                  testCaseSpec={testCaseSpec}
                  timerDisplay={prefs.gate.enabled && !wasAlreadyDone ? formatTime(elapsedSeconds) : null}
                  timerRunning={!!runningSince}
                  timerHasStarted={timerHasStarted}
                  onToggleTimer={handleToggleStopwatch}
                  onAccepted={handleEditorAccepted}
                  onSubmission={handleEditorSubmission}
                />
              ) : testCaseSpecLoading ? (
                <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-mid)' }}>
                  Loading test cases...
                </div>
              ) : (
                <CodeEditorPlaceholder
                  problemName={problem.name}
                  leetcodeNumber={problem.leetcode}
                  onBackToReading={handleExitCodingMode}
                />
              )}
            </>
          )}
        </div>
      </div>

      {approachPromptOpen && (
        <div className="approach-prompt-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) setApproachPromptOpen(false);
        }}>
          <div className="approach-prompt-modal">
            <div className="approach-prompt-title">💭 Sketch your approach first?</div>
            <p className="approach-prompt-message">
              Writing out your thinking before seeing the solution is one of the
              most effective ways to actually learn from a problem. Even one
              sentence about the pattern or data structure you'd try is enough.
              <br /><br />
              Want to jot it down first, or open the solution anyway?
            </p>
            <div className="approach-prompt-actions">
              <button className="btn btn-sm btn-primary" onClick={() => setApproachPromptOpen(false)}>
                Write first
              </button>
              <button className="btn btn-sm" onClick={() => {
                setApproachPromptOpen(false);
                handleViewSolution();
              }}>
                Open anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {failurePromptOpen && (
        <FailureReasonPrompt
          onSelect={handleFailureReasonSelect}
          onSkip={handleFailureReasonSkip}
        />
      )}
    </div>
  );
}