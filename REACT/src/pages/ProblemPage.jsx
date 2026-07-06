import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
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
import '../styles/app.css';
import '../styles/problem.css';

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

const confidenceOptions = [
  { value: 1, label: '😵 Clueless' },
  { value: 2, label: '🤔 Needed hints' },
  { value: 3, label: '😊 Got it' },
  { value: 4, label: '🚀 Easy' },
];

export default function ProblemPage() {
  const { id } = useParams();
  const problemId = id || 'two-sum';
  const storageKey = `pathforge:problem:${problemId}`;

  const problem = getProblem(problemId);
  const details = getProblemDetails(problemId);
  const topic = problem ? getTopic(problem.topicKey) : null;
  const topicProblems = problem ? getProblemsByTopic(problem.topicKey) : [];
  const positionInTopic = topicProblems.findIndex((p) => p.id === problemId) + 1;

  const saved = loadJSON(storageKey, null);

  const [unlockedHints, setUnlockedHints] = useState(
    () => new Set(saved?.unlockedHints || [1])
  );
  const [openHints, setOpenHints] = useState(new Set([1]));
  const [activeApproach, setActiveApproach] = useState(details?.approaches?.[0]?.key || 'brute');
  const [activeLanguage, setActiveLanguage] = useState('java');
  const [confidenceRating, setConfidenceRating] = useState(saved?.confidenceRating ?? null);
  const [attemptConfirmed, setAttemptConfirmed] = useState(saved?.attemptConfirmed ?? false);
  const [solutionVisible, setSolutionVisible] = useState(false);
  // KEY ADDITION: unlike solutionVisible (which resets to false on every fresh
  // visit — that's fine, it just means "not currently showing"), this tracks
  // permanently whether the solution was EVER viewed for this problem. That's
  // the "solutionPeeked" signal the weak-point engine needs — once true, it
  // stays true even after leaving and coming back.
  const [solutionEverViewed, setSolutionEverViewed] = useState(saved?.solutionEverViewed ?? false);
  const [isSolved, setIsSolved] = useState(saved?.isSolved ?? false);

  useEffect(() => {
    saveJSON(storageKey, {
      unlockedHints: Array.from(unlockedHints),
      confidenceRating,
      attemptConfirmed,
      solutionEverViewed,
      isSolved,
    });
  }, [unlockedHints, confidenceRating, attemptConfirmed, solutionEverViewed, isSolved, storageKey]);

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

  function handleViewSolution() {
    setSolutionVisible(true);
    setSolutionEverViewed(true);
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
                          <pre><code>{a.code[activeLanguage] || a.code.java || Object.values(a.code)[0]}</code></pre>
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
              <Button size="sm">← Prev</Button>
              <Button size="sm">Next →</Button>
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
                    onClick={setConfidenceRating}
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
                <label className="check-label">
                  <input
                    type="checkbox"
                    checked={attemptConfirmed}
                    onChange={(e) => setAttemptConfirmed(e.target.checked)}
                  />
                  I attempted this problem genuinely
                </label>
                <button
                  className="btn btn-sm"
                  id="view-sol-btn"
                  disabled={!attemptConfirmed}
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