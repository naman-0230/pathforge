import { useState, useEffect } from 'react';
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
import { loadJSON, saveJSON } from '../utils/storage.js';
import { triggerSync } from '../utils/sync.js';
import { recordSolve } from '../utils/activity.js';
import { getProblem, getProblemsByTopic, getDifficultyType } from '../data/problems.js';
import { getTopic } from '../data/topics.js';
import { getProblemDetails } from '../data/problemDetails.js';
import { getPreferences } from '../utils/preferences.js';
import { useApp } from '../context/AppContext.jsx';
import { highlightCode } from '../utils/prismSetup.js';
import '../styles/app.css';
import '../styles/problem.css';
import '../styles/prism-theme.css';
import { usePageTitle } from '../utils/usePageTitle.js';


// ProblemPage — converted from problem.html, now looks up real data by the
// :id route param instead of being hardcoded to "Two Sum".
//
// Three layers of data come together here:
//   1. problem      — lightweight metadata (name, difficulty, topic, pattern) from problems.js
//   2. details      — full write-up (hints, examples, solutions) from problemDetails.js, if it exists yet
//   3. saved        — this person's progress on this problem, from localStorage
//
// If `details` is null (most problems right now — only Two Sum has a full
// write-up so far), the page still works: it shows the real problem metadata,
// still lets you rate confidence and mark it solved (so weak-point data
// collection works even before hints are written), just without the
// hints/solution sections.
//
// SOLUTION-GATE DESIGN NOTE: "I attempted this problem genuinely" used to be a
// bare checkbox — zero cost to lie, which pollutes the weak-point signal (a
// "clueless" rating right before peeking the solution is meaningful data; a
// rubber-stamped checkbox next to it isn't). This version pairs the checkbox
// with an explicit stopwatch: the person has to press Start, and the checkbox
// stays disabled until a minimum amount of real wall-clock time has passed
// since they started. This is a soft deterrent, not an anti-cheat system —
// anyone can bypass it via devtools or by editing localStorage — the point is
// just raising the cost of lying to yourself above "click one checkbox."
//
// All of the gate's actual tuning — whether it's on at all, the base minimum
// time, whether that scales by difficulty, and whether already-completed
// problems skip it — now comes from Settings (utils/preferences.js) instead
// of being hardcoded, so this file just reads `prefs.gate` fresh each render.
//
// LAYOUT NOTE (this pass): the right column used to be four separate
// panels (progress-nav, timer, hints, mark-and-solve). Timer, confidence,
// mark-solve, and the solution gate were logically one flow — "prove you
// engaged with this problem, then unlock the solution" — but they were
// visually split across two panels with the hints panel wedged in between,
// which made the flow feel disjointed and cramped. This version merges the
// timer + confidence + actions + gate into a SINGLE "Track your attempt"
// panel with labeled sub-sections, and moves the hints panel above it so
// the tracking flow reads uninterrupted top-to-bottom. Also introduces a
// real Flag-for-revision toggle button (replacing the old inert "Revisit
// later" placeholder) — this is what the revision system's `manual-flag`
// source reads via `progress[id].flaggedForRevision`.

const confidenceOptions = [
  { value: 1, label: '😵 Clueless' },
  { value: 2, label: '🤔 Needed hints' },
  { value: 3, label: '😊 Got it' },
  { value: 4, label: '🚀 Easy' },
];

// How the gate's base minimum (from Settings) scales per difficulty when
// "scale by difficulty" is turned on — Easy gets a shorter wait, Hard longer.
const DIFFICULTY_TIME_MULTIPLIER = { Easy: 0.6, Medium: 1, Hard: 1.6 };

function formatTime(totalSeconds) {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(clamped / 60);
  const s = clamped % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// formatDisplayDate — turns 'YYYY-MM-DD' into a readable "Jul 9, 2026"
// for the solve-status line. Returns null for null/undefined input so
// callers can guard with a simple truthy check.
function formatDisplayDate(dateStr) {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
  // Only true if the person has BOTH already solved/viewed this problem
  // before AND left "skip the gate for already-done problems" turned on in
  // Settings. Deliberately reads from `saved` (state as of page load), not
  // from the isSolved/solutionEverViewed state variables below — those flip
  // to true mid-session the moment someone solves/views THIS attempt, and
  // that must not retroactively bypass the gate for a genuinely fresh attempt.
  const wasAlreadyDone = prefs.gate.bypassIfAlreadyDone && (saved?.isSolved || saved?.solutionEverViewed);

  const [unlockedHints, setUnlockedHints] = useState(
    () => new Set(saved?.unlockedHints || [])
  );
  const [openHints, setOpenHints] = useState(new Set());
  const [activeApproach, setActiveApproach] = useState(details?.approaches?.[0]?.key || 'brute');
  const [activeLanguage, setActiveLanguage] = useState(prefs.defaultCodeLanguage || 'java');
  const [confidenceRating, setConfidenceRating] = useState(saved?.confidenceRating ?? null);
  // Frozen once, at the moment of first real signal (confidence rating given,
  // or solution viewed) — never overwritten again after that. weakPoints.js
  // reads THIS, not the live timer, since the timer may have moved on to a
  // different session by the time anyone looks at weak-point data.
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(saved?.timeSpentSeconds ?? null);
  const [attemptConfirmed, setAttemptConfirmed] = useState(saved?.attemptConfirmed ?? false);
  const [solutionVisible, setSolutionVisible] = useState(false);
  // KEY ADDITION: unlike solutionVisible (which resets to false on every fresh
  // visit — that's fine, it just means "not currently showing"), this tracks
  // permanently whether the solution was EVER viewed for this problem. That's
  // the "solutionPeeked" signal the weak-point engine needs — once true, it
  // stays true even after leaving and coming back.
  const [solutionEverViewed, setSolutionEverViewed] = useState(saved?.solutionEverViewed ?? false);
  const [isSolved, setIsSolved] = useState(saved?.isSolved ?? false);
  // flaggedForRevision — the manual "revise this later" signal that
  // revision.js reads via isProblemFlaggedForRevision() to schedule a
  // manual-flag revision for the problem's section. Toggled by the flag
  // button in the Mark your progress row; persisted to the same progress
  // record everything else here saves to. Enabled from page load, no gate
  // required — flagging expresses intent to revisit, not a claim of solving.
  const [flaggedForRevision, setFlaggedForRevision] = useState(saved?.flaggedForRevision ?? false);
  // Notes — freeform markdown per problem. Rendered by NotesPanel at the
  // bottom of the left column; persisted alongside everything else here via
  // the shared saveJSON useEffect below.
  const [notes, setNotes] = useState(saved?.notes ?? '');
    // approach — freeform text sketching how the user plans to approach this
  // problem BEFORE viewing the solution. Persisted per-attempt inside the
  // attempts array (see handleConfidenceRating for how it flows in); this
  // useState holds the CURRENT draft, which gets committed to the latest
  // attempt entry on each edit.
  //
  // On first render: seeded from the most recent attempt's approach if
  // this is a re-visit, otherwise empty. This means editing the field
  // updates the current-attempt draft; when confidence is rated, whatever
  // approach text exists at that moment is snapshotted into the attempt.
    const [approach, setApproach] = useState(() => {
    const attempts = saved?.attempts || [];
    const lastAttempt = attempts[attempts.length - 1];
    return lastAttempt?.approach || '';
  });

  // savedApproachOnLoad — snapshot of what was in storage when the page
  // mounted. Used by the previous-approach banner to decide whether the
  // user is on a "fresh visit" (draft still equals stored value → surface
  // the stored approach as "last time") vs mid-edit (draft has diverged →
  // no separate "past" version to show). Captured once, never updated.
  const [savedApproachOnLoad] = useState(() => {
    const attempts = saved?.attempts || [];
    return attempts[attempts.length - 1]?.approach || '';
  });

  // approachPromptOpen — when true, shows the soft "you haven't written
  // your approach yet" prompt over the solution-gate. User can either
  // dismiss and write, or bypass and view solution anyway.
  const [approachPromptOpen, setApproachPromptOpen] = useState(false);
    // failurePromptOpen — when true, shows the "why did you open the
  // solution?" modal BEFORE the solution renders. One-tap categorical
  // capture, one per attempt. Guarded by preferences.failureArchive.promptOnPeek
  // and by whether this attempt has already logged a reason (no re-prompt
  // if user views → closes → re-opens solution in same session).
  const [failurePromptOpen, setFailurePromptOpen] = useState(false);
  const [failureReasonLogged, setFailureReasonLogged] = useState(false);
  // attempts — the history array. Seeded from localStorage on load (may
  // already be migrated, or normalizeProblemRecord will have run by the
  // time ProblemPage reads via loadJSON directly here). A new entry is
  // pushed when the user gives a confidence rating for the first time in
  // this session; subsequent rating changes update that same entry in-place.
  const [attempts, setAttempts] = useState(saved?.attempts ?? []);
  // solvedAt — date of most recent solve. Updated every time "Mark solved"
  // is clicked (even re-solves, so it always reflects the latest).
  // firstSolvedAt — date of very first solve. Written once, never overwritten.
  // Both are 'YYYY-MM-DD' local date strings, or null for pre-timestamp records.
  const [solvedAt, setSolvedAt] = useState(saved?.solvedAt ?? null);
  const [firstSolvedAt, setFirstSolvedAt] = useState(saved?.firstSolvedAt ?? null);

  // markedHard — user's explicit "this was hard for me" signal, independent
  // of the problem's data-file difficulty rating. Persisted alongside
  // everything else here; consumed by weakPoints.js (as a strong struggle
  // signal) and by ProblemRow/RoadmapProblemItem (indicator icon).
  const [markedHard, setMarkedHard] = useState(saved?.markedHard ?? false);
  // Stopwatch: modeled as accumulated time (seconds already banked from past
  // run segments) + an optional "runningSince" timestamp for the CURRENT
  // segment. This is what makes Stop/Resume possible — Stop banks the current
  // segment into accumulatedSeconds and clears runningSince (freezing the
  // display); Start begins a new segment on top of whatever's already banked.
  // Both pieces persist, so a refresh mid-run doesn't lose progress.
  const [accumulatedSeconds, setAccumulatedSeconds] = useState(saved?.accumulatedSeconds ?? 0);
  const [runningSince, setRunningSince] = useState(saved?.runningSince ?? null);
  const [nowTick, setNowTick] = useState(() => Date.now());

  useEffect(() => {
    if (!runningSince) return;
    const tickId = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(tickId);
  }, [runningSince]);

  const elapsedSeconds = accumulatedSeconds + (runningSince ? Math.floor((nowTick - runningSince) / 1000) : 0);
  const effectiveMinSeconds = prefs.gate.scaleByDifficulty
    ? Math.round(prefs.gate.minSeconds * (DIFFICULTY_TIME_MULTIPLIER[problem?.difficulty] ?? 1))
    : prefs.gate.minSeconds;
  // Folding "!prefs.gate.enabled" into hasMetMinimum itself (rather than
  // checking prefs.gate.enabled separately everywhere) means every existing
  // disabled={...} check below stays correct with no further changes: if the
  // gate is turned off in Settings, hasMetMinimum is just always true.
  const hasMetMinimum = !prefs.gate.enabled || elapsedSeconds >= effectiveMinSeconds;
  const timerHasStarted = runningSince !== null || accumulatedSeconds > 0;
  const confidenceGiven = confidenceRating != null;
  // Single combined check the checkbox/button both use: either this problem
  // was already done before (bypass), or BOTH the attempt-timer minimum was
  // met AND a real confidence rating was given. Confidence is required
  // regardless of whether the timer gate itself is turned on in Settings —
  // it's a data-integrity requirement for weak-point scoring, not an
  // optional honesty nudge like the timer.
  const gateSatisfied = wasAlreadyDone || (hasMetMinimum && confidenceGiven);

    // Read user id from Supabase session for sync triggering.
  // Imported lazily here so ProblemPage doesn't need AppContext.
  const { user } = useApp();

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
    });
    // Trigger a debounced push to Supabase after every save.
    // triggerSync is a no-op if auto-sync is not enabled (user not logged in).
    triggerSync(user?.id);
  }, [attempts, unlockedHints, confidenceRating, timeSpentSeconds, attemptConfirmed, solutionEverViewed, isSolved, solvedAt, firstSolvedAt, accumulatedSeconds, runningSince, flaggedForRevision, notes, markedHard, storageKey, user?.id]);

  function handleHintClick(hintNumber) {
    if (unlockedHints.has(hintNumber)) {
      setOpenHints((prev) => {
        const next = new Set(prev);
        next.has(hintNumber) ? next.delete(hintNumber) : next.add(hintNumber);
        return next;
      });
    } else {
      // first time clicking this hint — this is also the exact spot to increment
      // a "hints opened" counter for the weak point detection engine once wired up
      setUnlockedHints((prev) => new Set(prev).add(hintNumber));
      setOpenHints((prev) => new Set(prev).add(hintNumber));
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
      // Stop: bank the current segment's elapsed time, clear runningSince.
      setAccumulatedSeconds((prev) => prev + Math.floor((Date.now() - runningSince) / 1000));
      setRunningSince(null);
    } else {
      // Start (or resume): begin a new segment on top of whatever's banked.
      setRunningSince(Date.now());
    }
  }

  // Rating confidence is the first real "signal" moment for a fresh attempt
  // — freeze the time snapshot here if it hasn't been captured yet. Freezing
  // (not overwriting on subsequent rating changes) means someone adjusting
  // their rating later doesn't reset what "time spent" meant for this attempt.
    function handleConfidenceRating(value) {
    setConfidenceRating(value);
    const frozenTime = timeSpentSeconds ?? elapsedSeconds;
    if (timeSpentSeconds === null) {
      setTimeSpentSeconds(frozenTime);
    }

    setAttempts((prev) => {
      const isFirstRating = confidenceRating === null;

      if (isFirstRating) {
        const newEntry = {
          date: (() => {
            const d = new Date();
            const pad = (n) => String(n).padStart(2, '0');
            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
          })(),
          confidenceRating: value,
          timeSpentSeconds: frozenTime,
          hintsOpened: unlockedHints.size,
          solutionPeeked: solutionEverViewed,
          context: 'practice',
          approach: approach || '',
          approachWrittenAt: approach ? Date.now() : null,
        };
        return [...prev, newEntry];
      } else {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          confidenceRating: value,
          approach: approach || '',
          approachWrittenAt: approach ? Date.now() : updated[updated.length - 1].approachWrittenAt,
        };
        return updated;
      }
    });
  }

  // handleApproachChange — writes the current draft into the latest attempt
  // entry in-place. Called by ApproachPanel's debounced save.
  //
  // Two paths:
  //   1. No attempts yet (user hasn't rated confidence for this session) —
  //      just update the local `approach` state. It'll be picked up when
  //      they finally rate confidence and a new attempt entry is created.
  //   2. Latest attempt exists — merge the new approach text into it.
  //      This is what "same session, edited my approach" looks like.
  function handleApproachChange(text) {
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

  // handleViewSolution — reveals solution and locks the approach for this
  // attempt. If the user hasn't written an approach, we show a soft prompt
  // first (they can bypass); this is a nudge, not a hard gate.
  // handleViewSolution — reveals slution and locks the approach for this
  // attempt. If the user hasn't written an approach AND Settings has the
  // "prompt if empty" preference on, we show a soft prompt first.
  //
  // The prompt only fires once per problem visit — clicking View Solution
  // a second time while the prompt is already open (or after it was
  // dismissed) proceeds without asking again. This prevents a loop for
  // users who consciously choose to skip writing.
  // handleViewSolution — ordered gate chain:
  //   1. Approach nudge (if pref on + approach empty)
  //   2. Failure reason capture (if pref on + not already logged for this attempt)
  //   3. Actually show the solution
  //
  // Each gate is optional and can be skipped by preferences. The failure
  // reason only fires once per attempt — clicking view solution again in
  // the same session doesn't re-prompt.
  function handleViewSolution() {
    // Gate 1: approach nudge
    if (
      prefs.approach.promptIfEmpty &&
      (!approach || approach.trim().length === 0) &&
      !approachPromptOpen
    ) {
      setApproachPromptOpen(true);
      return;
    }
    // Gate 2: failure archive prompt
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

  // handleFailureReasonSelect — user picked one of the categorical reasons.
  // Persist it to the current attempt (or the most recent if none in this
  // session), mark as logged so we don't re-prompt, then continue to solution.
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

  // handleFailureReasonSkip — user chose to skip. Peek still gets counted
  // via solutionEverViewed inside proceedToSolution, just without a reason.
  // We DO mark failureReasonLogged so the prompt doesn't re-appear on
  // subsequent view-solution clicks in the same session.
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

  // handleToggleFlag — flips the manual-flag bit that revision.js reads.
  // No side effects beyond the toggle itself; the actual revision scheduling
  // happens on the next checkAndScheduleAllRevisions() sweep (Dashboard /
  // RevisionPage mount), which reads the persisted flag from progress.
  function handleToggleFlag() {
    setFlaggedForRevision((prev) => !prev);
  }

  // handleToggleHard — mirrors the flag toggle. No side effects beyond the
  // bit flip itself; the persistence useEffect above catches it in the same
  // save cycle as every other progress field.
  function handleToggleHard() {
    setMarkedHard((prev) => !prev);
  }

  // gateBlockingMessage — of the up-to-four things that can be blocking the
  // solution gate, return the one currently in effect (highest-priority
  // unmet requirement first). Rendering only ONE message instead of stacking
  // all four keeps the panel calm and readable — before this the gate
  // section showed 2-3 gray status lines at once during normal use, which
  // read as noise rather than guidance.
  function gateBlockingMessage() {
    if (wasAlreadyDone) return '✓ Already completed — solution unlocked';
    if (!confidenceGiven) return 'Rate your confidence above before viewing the solution';
    if (prefs.gate.enabled && !timerHasStarted) return 'Start the attempt timer above first';
    if (prefs.gate.enabled && timerHasStarted && !hasMetMinimum) {
      return `⏱ ${formatTime(effectiveMinSeconds - elapsedSeconds)} left before you can confirm`;
    }
    return null; // all clear — no message needed
  }

  // Problem doesn't exist in problems.js at all (bad/old URL) — simple guard.
  if (!problem) {
    return (
      <div className="app-layout">
        <Sidebar />
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

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="problem-layout">
        {/* LEFT: problem content */}
        <div className="problem-left stagger-children">
          <div className="breadcrumb">
            <Link to="/roadmap">Roadmap</Link> <span>›</span>
            <span>{topic?.label}</span> <span>›</span>
            <span className="bc-current">{problem.name}</span>
          </div>

          <div className="prob-header">
            <h1 className="prob-title">{problem.name}</h1>
            <div className="prob-tags">
              <Badge type={getDifficultyType(problem.difficulty)}>{problem.difficulty}</Badge>
              <Badge type="purple">{topic?.label}</Badge>
              <Badge type="purple">{problem.pattern}</Badge>
              {details?.requirement && <Badge type="amber">{details.requirement}</Badge>}
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
          {/* Notes — always visible at the bottom of the left column,
              regardless of whether details exist for this problem. Notes
              belong with problem CONTENT (left column), not actions
              (right column), so they stay full-width for comfortable
              markdown writing/reading. */}
          <NotesPanel notes={notes} onChange={setNotes} />
        </div>

        {/* RIGHT: navigation + hints + tracking flow (in that order) */}
        <div className="problem-right stagger-children">
          {/* Panel 1 — where am I in this topic + prev/next nav */}
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

          {/* Panel 2 — hints, isolated as their own thing so they don't
              interrupt the tracking flow below */}
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

          {/* Panel 3 — the whole engagement flow, top to bottom: timer,
              confidence, actions, solution gate. Sub-sections are separated
              by small uppercase labels + a divider so each phase is visually
              distinct without needing its own outer panel. */}
          <div className="right-panel">
            <div className="panel-title">📋 Track your attempt</div>

            {/* --- Solve status (only shown if ever solved) --- */}
                        {isSolved && solvedAt && (
              <div
                className="solve-status"
                style={{
                  fontSize: 12,
                  color: 'var(--green, #3fae63)',
                  padding: '8px 0 4px',
                  borderBottom: '1px solid var(--border)',
                  marginBottom: 8,
                }}
              >
                {firstSolvedAt && firstSolvedAt !== solvedAt
                  ? `✓ First solved ${formatDisplayDate(firstSolvedAt)} · Last solved ${formatDisplayDate(solvedAt)}`
                  : `✓ Solved on ${formatDisplayDate(solvedAt)}`}
              </div>
            )}

            {/* --- Attempt timer sub-section --- */}
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

            {/* --- How did it go? (confidence rating) --- */}
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
                        {/* --- Approach sketch (before solution) --- */}
            {details?.hints && (
              <div className="track-subsection">
                <ApproachPanel
                  value={approach}
                  onChange={handleApproachChange}
                                    previousApproach={(() => {
                    // Show the most recent PAST approach — meaning any approach
                    // that isn't the one currently being edited in this session.
                    //
                    // Logic:
                    //   - If there are 2+ attempts, the second-to-last is "past"
                    //     (last one is the current in-progress attempt).
                    //   - If there's exactly 1 attempt AND the user is starting
                    //     a fresh session on it (no in-session edits yet), that
                    //     one attempt IS the past — surface its approach.
                    //     "Fresh session" is detected via `savedApproachOnLoad`:
                    //     if the current draft matches what was in storage at
                    //     mount time, the user hasn't started editing yet.
                    //   - Otherwise (mid-session edit of a single attempt): no
                    //     "past" version distinct from current — show nothing.
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
                      // If the current draft is identical to what was saved on
                      // load, this is a fresh visit — show the saved approach
                      // as "last time." As soon as the user edits, this becomes
                      // the same thing they're currently editing (no distinct
                      // "past" version) and we stop showing the banner.
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

            {/* --- Mark your progress (solved + flag) --- */}
            {/* --- Mark your progress (solved + flag + hard-for-me) --- */}
            <div className="track-subsection">
              <div className="track-sublabel">Mark your progress</div>
              <div className="mark-actions">
                <button
                  className="btn mark-btn-done"
                  onClick={() => {
                    // Only record activity the first time — clicking an
                    // already-solved button again shouldn't double-count today.
                    if (!isSolved) recordSolve();
                    setIsSolved(true);
                    const today = (() => {
                      const d = new Date();
                      const pad = (n) => String(n).padStart(2, '0');
                      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
                    })();
                    setSolvedAt(today);
                    // firstSolvedAt is written once and never overwritten —
                    // if it's already set (re-solve of an old problem), keep
                    // the original date.
                    setFirstSolvedAt((prev) => prev ?? today);
                  }}
                  style={isSolved ? { background: 'var(--state-success-bg)', color: 'var(--green)', borderColor: 'var(--green)' } : undefined}
                >
                  {isSolved ? '✓ Solved!' : '✓ Mark solved'}
                </button>
                {/* Flag toggle — text-with-icon, enabled from page load
        (no gate), amber highlight when active to match the
        "Flagged for review" badge on Dashboard/Revision. */}
                <button
                  className={`btn mark-btn-flag ${flaggedForRevision ? 'mark-btn-flag-active' : ''}`}
                  onClick={handleToggleFlag}
                  aria-pressed={flaggedForRevision}
                  title={flaggedForRevision ? 'Remove from revision queue' : 'Flag this problem for revision'}
                >
                  {flaggedForRevision ? '🔖 Flagged' : '🔖 Flag for revision'}
                </button>
                {/* Hard-for-me toggle — user's explicit "this was harder than the
        data-file difficulty suggests" signal. Red-tinted highlight when
        active, distinct from the amber "flag for revision" so users can
        see at a glance which button is which state. Enabled from page
        load (like flag), no gate — it's a self-report, not a claim. */}
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

            {/* --- View solution (gated) --- */}
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
        </div>
           </div>

      {/* Approach nudge modal — soft prompt when user tries to view
          solution without writing an approach. Not a hard gate: user can
          bypass with "Open anyway", and that choice is remembered for
          this attempt (won't re-prompt on the next click). */}
      {approachPromptOpen && (
        <div className="approach-prompt-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) setApproachPromptOpen(false);
        }}>
          <div className="approach-prompt-modal">
            <div className="approach-prompt-title">
              💭 Sketch your approach first?
            </div>
            <p className="approach-prompt-message">
              Writing out your thinking before seeing the solution is one of the
              most effective ways to actually learn from a problem. Even one
              sentence about the pattern or data structure you'd try is enough.
              <br /><br />
              Want to jot it down first, or open the solution anyway?
            </p>
            <div className="approach-prompt-actions">
              <button
                className="btn btn-sm btn-primary"
                onClick={() => setApproachPromptOpen(false)}
              >
                Write first
              </button>
              <button
                className="btn btn-sm"
                onClick={() => {
                  // "Open anyway" bypasses the approach nudge, but the
                  // failure-reason gate should still trigger — call
                  // handleViewSolution rather than proceedToSolution
                  // directly, so the next gate in the chain runs.
                  setApproachPromptOpen(false);
                  handleViewSolution();
                }}
              >
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