import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Badge from '../components/Badge';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import HintItem from '../components/HintItem';
import ConfidenceButton from '../components/ConfidenceButton';
import { loadJSON, saveJSON } from '../utils/storage.js';
import { recordSolve } from '../utils/activity.js';
import { getProblem, getProblemsByTopic, getDifficultyType } from '../data/problems.js';
import { getTopic } from '../data/topics.js';
import { getProblemDetails } from '../data/problemDetails.js';
import { getPreferences } from '../utils/preferences.js';
import { highlightCode } from '../utils/prismSetup.js';
import '../styles/app.css';
import '../styles/problem.css';
import '../styles/prism-theme.css';

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

  useEffect(() => {
    saveJSON(storageKey, {
      unlockedHints: Array.from(unlockedHints),
      confidenceRating,
      timeSpentSeconds,
      attemptConfirmed,
      solutionEverViewed,
      isSolved,
      accumulatedSeconds,
      runningSince,
    });
  }, [unlockedHints, confidenceRating, timeSpentSeconds, attemptConfirmed, solutionEverViewed, isSolved, accumulatedSeconds, runningSince, storageKey]);

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
    if (timeSpentSeconds === null) {
      setTimeSpentSeconds(elapsedSeconds);
    }
  }

  function handleViewSolution() {
    setSolutionVisible(true);
    setSolutionEverViewed(true);
    // Defensive fallback: normally confidence is required before this point
    // is even reachable (see gateSatisfied), so timeSpentSeconds is already
    // set by handleConfidenceRating above. This only matters for the
    // wasAlreadyDone bypass path, where someone could reach View Solution
    // without ever rating confidence in THIS session.
    if (timeSpentSeconds === null) {
      setTimeSpentSeconds(elapsedSeconds);
    }
    // The attempt is over once the solution is revealed — no reason for the
    // timer to keep ticking in the background after this point.
    if (runningSince) {
      setAccumulatedSeconds((prev) => prev + Math.floor((Date.now() - runningSince) / 1000));
      setRunningSince(null);
    }
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

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="problem-layout">
        {/* LEFT: problem content */}
        <div className="problem-left">
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
                <div className="prob-section" id="solution-section">
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
        </div>

        {/* RIGHT: hints + actions */}
        <div className="problem-right">
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

          {details?.hints && prefs.gate.enabled && !wasAlreadyDone && (
            <div className="right-panel">
              <div className="panel-title">⏱ Attempt timer</div>
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
            <div className="panel-title">📋 Mark & solve</div>

            <div className="confidence-section">
              <div className="conf-label">How did it go?</div>
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

            <div className="mark-actions">
              <button
                className="btn mark-btn-done"
                onClick={() => {
                  // Only record activity the first time — clicking an
                  // already-solved button again shouldn't double-count today.
                  if (!isSolved) recordSolve();
                  setIsSolved(true);
                }}
                style={isSolved ? { background: 'var(--state-success-bg)', color: 'var(--green)', borderColor: 'var(--green)' } : undefined}
              >
                {isSolved ? '✓ Solved!' : '✓ Mark solved'}
              </button>
              <button className="btn mark-btn-revisit">⚑ Revisit later</button>
            </div>

            {details?.hints && (
              <div className="solution-gate">
                <div className="gate-text">Confirm before viewing solution:</div>

                {wasAlreadyDone && (
                  <div className="gate-timer">✓ Already completed — solution unlocked</div>
                )}
                {!wasAlreadyDone && !confidenceGiven && (
                  <div className="gate-timer">Rate your confidence above before viewing the solution</div>
                )}
                {!wasAlreadyDone && confidenceGiven && prefs.gate.enabled && !timerHasStarted && (
                  <div className="gate-timer">Start the attempt timer above first</div>
                )}
                {!wasAlreadyDone && confidenceGiven && prefs.gate.enabled && timerHasStarted && !hasMetMinimum && (
                  <div className="gate-timer">
                    ⏱ {formatTime(effectiveMinSeconds - elapsedSeconds)} left before you can confirm
                  </div>
                )}

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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}