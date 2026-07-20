import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Badge from './Badge';
import { getDifficultyType } from '../data/problems.js';
import { isProblemSolved } from '../utils/progress.js';

// DrillSession — the "in progress" state of a drill. Shows the 5 problems
// as a checklist, each with a link to open the actual problem page. Users
// solve problems in the regular ProblemPage (with full hints, timer,
// solution gate) then come back here to mark them off and finish the drill.
//
// TIMER: optional session-wide stopwatch. Not gated — user can finish
// whenever, timer is just for their reference and for analytics.
//
// MARKING DONE: two ways —
//   1. Auto-detected via isProblemSolved() — if user solves the problem on
//      ProblemPage, checkbox auto-updates on this page's next render.
//   2. Manual checkbox — if user just wants to mark "reviewed" without
//      going through full ProblemPage flow.
//
// FINISH: enabled once all problems are marked. Emits the session with
// outcomes to the parent which persists via drillEngine.recordDrillResult.

export default function DrillSession({ drill, onFinish, onCancel }) {
  const [manualMarks, setManualMarks] = useState({});
  const [elapsed, setElapsed] = useState(0);
  const [startedAt] = useState(() => Date.now());

  // Simple session timer
  useEffect(() => {
    const tickId = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 1000);
    return () => clearInterval(tickId);
  }, [startedAt]);

  function toggleManual(problemId) {
    setManualMarks((prev) => ({ ...prev, [problemId]: !prev[problemId] }));
  }

  // A problem counts as "done" if either the actual solve state OR the
  // manual mark is set. Auto-refresh happens on re-render (which happens
  // when user comes back from a problem page).
  const doneMap = {};
  for (const p of drill.problems) {
    doneMap[p.id] = isProblemSolved(p.id) || manualMarks[p.id];
  }
  const doneCount = Object.values(doneMap).filter(Boolean).length;
  const allDone = doneCount === drill.problems.length;

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const timerStr = `${minutes}:${String(seconds).padStart(2, '0')}`;

  function handleFinish() {
    const outcomes = drill.problems.map((p) => ({
      problemId: p.id,
      marked: doneMap[p.id],
      autoDetected: isProblemSolved(p.id) && !manualMarks[p.id],
    }));
    onFinish({
      drillId: drill.drillId,
      pattern: drill.pattern,
      problems: drill.problems,
      outcomes,
      startedAt,
      timeSpentMs: Date.now() - startedAt,
      totalSolved: doneCount,
    });
  }

  return (
    <div className="drill-session">
      <div className="drill-session-header">
        <div className="drill-session-header-left">
          <div className="drill-session-pattern">
            <span className="drill-session-pattern-icon">🎯</span>
            <span className="drill-session-pattern-name">{drill.pattern}</span>
          </div>
          <div className="drill-session-subtitle">
            {drill.problems.length} problems · Mixed topics
          </div>
        </div>
        <div className="drill-session-timer">
          <span className="drill-session-timer-value">{timerStr}</span>
          <span className="drill-session-timer-label">Session time</span>
        </div>
      </div>

      <div className="drill-session-progress-bar">
        <div
          className="drill-session-progress-fill"
          style={{ width: `${(doneCount / drill.problems.length) * 100}%` }}
        />
      </div>
      <div className="drill-session-progress-label">
        {doneCount} of {drill.problems.length} done
      </div>

      <div className="drill-problem-list">
        {drill.problems.map((p, i) => {
          const isDone = doneMap[p.id];
          const wasPrevSolved = p.previouslySolved;
          return (
            <div key={p.id} className={`drill-problem-row ${isDone ? 'done' : ''}`}>
              <div className="drill-problem-num">{i + 1}</div>
              <div className="drill-problem-check">
                <input
                  type="checkbox"
                  checked={isDone}
                  onChange={() => toggleManual(p.id)}
                  disabled={isProblemSolved(p.id)}
                  title={isProblemSolved(p.id) ? 'Auto-detected as solved' : 'Manually mark done'}
                />
              </div>
              <div className="drill-problem-body">
                <div className="drill-problem-name-row">
                  <Link
                    to={`/problem/${p.id}`}
                    className="drill-problem-link"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {p.name}
                  </Link>
                  {wasPrevSolved && (
                    <span className="drill-problem-prev-tag" title="You've solved this before — revision practice">
                      ↻ revision
                    </span>
                  )}
                </div>
                <div className="drill-problem-meta">
                  <Badge type={getDifficultyType(p.difficulty)}>{p.difficulty}</Badge>
                  <span className="drill-problem-topic">{p.topicLabel}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="drill-session-actions">
        <button className="btn" onClick={onCancel}>
          Cancel drill
        </button>
        <button
          className="btn btn-primary"
          onClick={handleFinish}
          disabled={doneCount === 0}
        >
          {allDone ? 'Finish drill ✓' : `Finish (${doneCount}/${drill.problems.length} done)`}
        </button>
      </div>
    </div>
  );
}