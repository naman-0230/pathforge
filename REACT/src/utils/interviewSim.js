import { topics } from '../data/topics.js';
import { getProblemsByTopic } from '../data/problems.js';
import { getProblemDetails } from '../data/problemDetails.js';
import { getTopic } from '../data/topics.js';
import { isProblemSolved } from './progress.js';
import { loadJSON, saveJSON } from './storage.js';
import {
  recordUsageEvent,
  canStartInterviewSim as serverCanStartSim,
} from './tierService.js';

// interviewSim.js — question generation, session management, and history
// for Interview Simulation Mode.
//
// SESSION FLOW:
//   Setup → generate() creates a session object with problems + config
//   Active → each problem forces approach-first, no hints, no solution
//   Reflect → user answers 3 reflection questions
//   Complete → session recorded, feedback generated
//
// PROBLEM SELECTION:
//   - Drawn from user's selected topics (or all if none selected)
//   - Prefers unsolved problems (fresh practice, more realistic)
//   - Falls back to solved-with-low-confidence, then any solved
//   - Difficulty distribution matches request (Easy/Medium/Hard mix)
//   - Never repeats a problem within the same session
//
// FREE TIER WEEKLY CAP:
//   pathforge:interviewSim:weeklyUsage tracks a rolling 7-day window.
//   getSimsUsedThisWeek() returns count, canStartNewSim() checks against
//   tier limit. Basic+ users always return true.
//
// SESSION HISTORY:
//   pathforge:interviewSim:history — bounded at 20 sessions. Feeds
//   Analytics for interview-specific performance trends later.

const HISTORY_KEY = 'pathforge:interviewSim:history';
const HISTORY_MAX = 20;
const FREE_TIER_WEEKLY_LIMIT = 1;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// canStartNewSim — SERVER-AUTHORITATIVE check for whether the user can
// start a new interview simulation. This wraps the tierService call and
// is what SimulatePage.jsx uses instead of the old localStorage version.
//
// Async because the check requires a network round-trip to the server
// to count usage events. Callers must handle the Promise.
export async function canStartNewSim(userId, userTier) {
  return await serverCanStartSim(userId, userTier);
}

// recordSimStart — SERVER-AUTHORITATIVE recording of a new sim start.
// Fires an INSERT into user_usage with event_type='interview_sim_start'.
// This is what makes weekly limits actually enforceable — the event is
// on the server, not in localStorage where the user could clear it.
//
// Silent failure (returns null) — we don't want a network hiccup to
// block the user from starting their sim. Worst case they get one extra
// use in a session.
export async function recordSimStart(userId) {
  return await recordUsageEvent(userId, 'interview_sim_start');
}

// ============================================================
// TIER USAGE TRACKING
// ============================================================




// ============================================================
// SESSION GENERATION
// ============================================================

// generateSession — builds an interview simulation session with the
// requested problem count, difficulty mix, and topic scope. Returns
// null if the pool is too small to fulfill the request.
export function generateSession({ problemCount, durationMinutes, topicKeys, difficultyMix, studiedOnly = false }) {
  const pool = buildProblemPool(topicKeys, difficultyMix, studiedOnly);
  if (pool.length < problemCount) return null;

  const selected = pickProblems(pool, problemCount, difficultyMix);
  if (selected.length < problemCount) return null;

  return {
    sessionId: `sim-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    problemCount,
    durationMinutes,
    durationMs: durationMinutes * 60 * 1000,
    topicKeys,
    difficultyMix,
    problems: selected.map((p) => {
      // Pull the full problem write-up if it exists. Most problems don't
      // have full details yet — fall back to a synthesized description
      // that at least tells the user what to expect ("A medium Arrays
      // problem involving sliding window"). Real interviews wouldn't
      // give you just a name either — always give the user something to
      // reason about.
      const details = getProblemDetails(p.id);
      const statement = details?.statement || synthesizeStatement(p);
      const examples = details?.examples || [];
      const constraints = details?.constraints || [];
      const requiredComplexity = details?.requiredComplexity || null;

      return {
        id: p.id,
        name: p.name,
        difficulty: p.difficulty,
        topicKey: p.topicKey,
        topicLabel: getTopic(p.topicKey)?.label || p.topicKey,
        pattern: p.pattern,
        leetcode: p.leetcode,
        statement,
        examples,
        constraints,
        requiredComplexity,
      };
    }),
    startedAt: null,
  };
}

// synthesizeStatement — same fallback pattern used in patternEngine.js.
// For problems without a full write-up, generate a minimal one-liner from
// metadata. Not as good as the real statement, but better than nothing —
// the user still gets to reason about the problem shape.
function synthesizeStatement(problem) {
  const topic = getTopic(problem.topicKey);
  const topicName = topic?.label || problem.topicKey;
  return `A ${problem.difficulty.toLowerCase()} ${topicName} problem involving ${problem.pattern?.toLowerCase() || 'the concepts of this topic'}. See LeetCode for the full description (link in the problem card during real interviews you'd have this in front of you).`;
}

// pickProblems — from the pool, pick N problems matching the difficulty
// mix as closely as possible. Prefers unsolved > low-confidence > any.
function pickProblems(pool, count, difficultyMix) {
  const tiers = {
    unsolved: pool.filter((p) => !isProblemSolved(p.id)),
    solved: pool.filter((p) => isProblemSolved(p.id)),
  };

  // Group each tier by difficulty
  const grouped = {
    unsolved: groupByDifficulty(tiers.unsolved),
    solved: groupByDifficulty(tiers.solved),
  };

  const picked = [];
  const targetPerDiff = distributeMix(count, difficultyMix);

  for (const [diff, target] of Object.entries(targetPerDiff)) {
    let remaining = target;

    // Try unsolved first
    const unsolvedForDiff = shuffle(grouped.unsolved[diff] || []);
    for (const p of unsolvedForDiff) {
      if (remaining === 0) break;
      picked.push(p);
      remaining--;
    }

    // Fallback to solved
    if (remaining > 0) {
      const solvedForDiff = shuffle(grouped.solved[diff] || []);
      for (const p of solvedForDiff) {
        if (remaining === 0) break;
        if (picked.some((x) => x.id === p.id)) continue;
        picked.push(p);
        remaining--;
      }
    }
  }

  // If we're still short (e.g. topic pool had no Hard problems), fill from
  // anywhere in the pool
  if (picked.length < count) {
    const remaining = pool.filter((p) => !picked.some((x) => x.id === p.id));
    const additional = shuffle(remaining).slice(0, count - picked.length);
    picked.push(...additional);
  }

  return picked.slice(0, count);
}

// distributeMix — turns difficultyMix { easy, medium, hard } percentages
// into concrete counts per difficulty for a given total N.
function distributeMix(count, mix) {
  const raw = {
    Easy: (mix.easy / 100) * count,
    Medium: (mix.medium / 100) * count,
    Hard: (mix.hard / 100) * count,
  };
  const rounded = {
    Easy: Math.floor(raw.Easy),
    Medium: Math.floor(raw.Medium),
    Hard: Math.floor(raw.Hard),
  };

  // Distribute the remainder to the largest fractional parts
  const total = rounded.Easy + rounded.Medium + rounded.Hard;
  const leftover = count - total;
  if (leftover > 0) {
    const fractions = Object.entries(raw)
      .map(([diff, val]) => ({ diff, frac: val - Math.floor(val) }))
      .sort((a, b) => b.frac - a.frac);
    for (let i = 0; i < leftover; i++) {
      rounded[fractions[i % fractions.length].diff]++;
    }
  }

  return rounded;
}

// buildProblemPool — collect problems from selected topics that match
// the requested difficulty mix. When `studiedOnly` is true, further
// restricts to sections the user has actually engaged with (any
// problem in the section either solved or attempted with confidence
// rating). This prevents "I only did Basics but got asked Sliding
// Window in my sim" — a common frustration otherwise.
function buildProblemPool(topicKeys, difficultyMix, studiedOnly = false) {
  const searchKeys = topicKeys && topicKeys.length > 0
    ? topicKeys
    : topics.filter((t) => t.seeded).map((t) => t.key);

  const pool = [];
  for (const key of searchKeys) {
    const problems = getProblemsByTopic(key);

    // Determine which sections in this topic the user has "studied" —
    // meaning at least one problem in that section has either been
    // solved OR has any confidence rating (indicating an attempt).
    // Only computed if studiedOnly is on; otherwise all sections count.
    const studiedSections = studiedOnly
      ? getStudiedSectionsForTopic(problems)
      : null;

    for (const p of problems) {
      if (difficultyMix[p.difficulty.toLowerCase()] === 0) continue;
      if (studiedOnly && !studiedSections.has(p.section)) continue;
      pool.push(p);
    }
  }
  return pool;
}

// getStudiedSectionsForTopic — returns a Set of section names where the
// user has engaged with at least one problem. "Engaged" = solved OR has
// a confidence rating in their attempts array. This is a strict
// definition — merely opening a problem page doesn't count.
function getStudiedSectionsForTopic(problems) {
  const studied = new Set();
  for (const p of problems) {
    if (studied.has(p.section)) continue;
    if (isProblemSolved(p.id)) {
      studied.add(p.section);
      continue;
    }
    // Check for any attempt with a confidence rating
    const record = loadJSON(`pathforge:problem:${p.id}`, null);
    if (record?.attempts?.some((a) => a.confidenceRating != null)) {
      studied.add(p.section);
    }
  }
  return studied;
}

function groupByDifficulty(problems) {
  return problems.reduce((acc, p) => {
    if (!acc[p.difficulty]) acc[p.difficulty] = [];
    acc[p.difficulty].push(p);
    return acc;
  }, {});
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ============================================================
// SESSION RESULT
// ============================================================

// recordSessionResult — persists a completed session to history.
// recordSessionResult — save completed sim to local history.
// Editor results (perProblemEditorResults) are preserved via spread,
// but we also snapshot each result onto its corresponding problem entry
// so analytics can iterate session.problems[].editorResult cleanly.
export function recordSessionResult(session) {
  const history = loadJSON(HISTORY_KEY, []);
  const editorResults = session.perProblemEditorResults || {};

  history.unshift({
    ...session,
    completedAt: Date.now(),
    // Ensure editor results are at session-level for the analytics helper
    perProblemEditorResults: editorResults,
    // Enrich each problem with its editor result snapshot
    problems: (session.problems || []).map((p) => ({
      ...p,
      editorResult: editorResults[p.id] || null,
    })),
  });
  saveJSON(HISTORY_KEY, history.slice(0, HISTORY_MAX));
}
export function getSessionHistory() {
  return loadJSON(HISTORY_KEY, []);
}

// ============================================================
// FEEDBACK GENERATION
// ============================================================

// generateFeedback — synthesizes "interviewer feedback" from session
// data. Uses editor test results as the objective success signal (only
// "all tests passed" counts as solved). Other metrics — attempt rate,
// timing, reflection — provide secondary signals but never override
// the objective outcome.
//
// SCORING (0-100):
//   - Base: fraction of problems where editor passed all tests
//   - Bonus: reflection completion (small positive multiplier)
//   - Penalty: none — objective failure IS the penalty
//
// Real interviewer feedback needs LLM (Advanced tier later). This is
// rule-based heuristics on captured data.
export function generateFeedback(session) {
  const { problems, perProblemMetrics = [], reflections = [], perProblemEditorResults = {} } = session;
  const total = problems.length;

  // ─── Compute per-problem outcomes ───────────────────────
  const outcomes = problems.map((p, i) => {
    const editorResult = perProblemEditorResults[p.id] || null;
    const metrics = perProblemMetrics[i] || {};
    const reflection = reflections[i] || {};

    let status;
    if (!editorResult || !editorResult.attempted) {
      status = 'not_attempted';
    } else if (editorResult.passed) {
      status = 'passed';
    } else if (editorResult.compileError) {
      status = 'compile_error';
    } else {
      status = 'failed';
    }

    return {
      problemId: p.id,
      problemName: p.name,
      status,
      editorResult,
      approachWritten: !!metrics.approachWritten,
      timeToApproachMs: metrics.timeToApproachMs,
      reflectionComplete: !!(reflection.gotRight?.trim().length > 0),
    };
  });

  const passedCount = outcomes.filter((o) => o.status === 'passed').length;
  const failedCount = outcomes.filter((o) => o.status === 'failed').length;
  const compileErrorCount = outcomes.filter((o) => o.status === 'compile_error').length;
  const notAttemptedCount = outcomes.filter((o) => o.status === 'not_attempted').length;

  const withReflection = outcomes.filter((o) => o.reflectionComplete).length;

  const avgApproachTimeMs = perProblemMetrics
    .filter((m) => m.timeToApproachMs != null)
    .reduce((sum, m, _, arr) => sum + m.timeToApproachMs / arr.length, 0);

  // ─── Compute score — editor pass is the only success metric ────
  // Base: 100% of score is editor pass rate.
  // Reflection provides small bonus (up to +10) but can't push past 100.
  const passRate = total > 0 ? passedCount / total : 0;
  const reflectionBonus = total > 0 ? (withReflection / total) * 10 : 0;
  const rawScore = passRate * 100 + reflectionBonus;
  const score = Math.min(100, Math.round(rawScore));

  // ─── Build strengths ───────────────────────────────────
  const strengths = [];
  if (passedCount === total && total > 0) {
    strengths.push(`Perfect run — all ${total} problems passed. Interview-ready performance.`);
  } else if (passedCount > 0) {
    strengths.push(`Solved ${passedCount} of ${total} problems fully (all test cases passed).`);
  }

  if (avgApproachTimeMs > 0) {
    const avgSec = Math.round(avgApproachTimeMs / 1000);
    if (avgSec < 60) {
      strengths.push(`Fast approach formulation — average ${avgSec}s to first idea.`);
    } else if (avgSec < 180) {
      strengths.push(`Reasonable thinking time — ${avgSec}s average before coding.`);
    }
  }

  if (withReflection === total && total > 0) {
    strengths.push(`You reflected on every problem. Self-awareness is a huge interview skill.`);
  }

  // ─── Build improvements ────────────────────────────────
  const improvements = [];

  if (notAttemptedCount > 0) {
    improvements.push(
      `${notAttemptedCount} of ${total} problem${notAttemptedCount === 1 ? '' : 's'} had no code submission. In a real interview, always write SOMETHING — even a brute force beats nothing.`
    );
  }

  if (compileErrorCount > 0) {
    improvements.push(
      `${compileErrorCount} problem${compileErrorCount === 1 ? '' : 's'} had compile errors. Practice writing syntactically clean code — interviewers notice.`
    );
  }

  if (failedCount > 0) {
    improvements.push(
      `${failedCount} problem${failedCount === 1 ? '' : 's'} had failing test cases. Test your solution against edge cases before submitting.`
    );
  }

  if (avgApproachTimeMs > 0) {
    const avgSec = Math.round(avgApproachTimeMs / 1000);
    if (avgSec >= 180) {
      improvements.push(
        `You spent ${avgSec}s on average before writing your approach. Practice pattern recognition to speed this up.`
      );
    }
  }

  if (withReflection < total && total > 0) {
    if (withReflection === 0) {
      improvements.push(`Skipped reflection — always take 1 minute after each problem to think about what happened.`);
    } else {
      improvements.push(`Reflect after every problem, not just some. It's where the learning happens.`);
    }
  }

  // ─── Verdict ───────────────────────────────────────────
  let verdict;
  if (score >= 85) verdict = { text: 'Interview-ready', tone: 'positive' };
  else if (score >= 60) verdict = { text: 'Solid session', tone: 'positive' };
  else if (score >= 35) verdict = { text: 'Room to grow', tone: 'neutral' };
  else if (score > 0) verdict = { text: 'Keep practicing', tone: 'critical' };
  else verdict = { text: 'No solutions passed', tone: 'critical' };

  return {
    verdict,
    strengths: strengths.length ? strengths : ["You showed up. Now let's make sure something passes next time."],
    improvements: improvements.length ? improvements : ["Nothing major — keep practicing at this level."],
    score,
    // NEW: expose per-problem outcomes so the UI can render them accurately
    outcomes,
    // NEW: expose counts for the results component
    counts: {
      passed: passedCount,
      failed: failedCount,
      compileError: compileErrorCount,
      notAttempted: notAttemptedCount,
      total,
    },
  };
}

// ============================================================
// EDITOR ANALYTICS — for InterviewSimEditorTrend chart
// ============================================================

// getInterviewSimEditorEngagementStats — aggregate editor stats across
// all interview simulation sessions in history.
export function getInterviewSimEditorEngagementStats() {
  const history = loadJSON(HISTORY_KEY, []);
  let totalProblems = 0;
  let attemptedInEditor = 0;
  let passedInEditor = 0;

  for (const session of history) {
    const results = session.perProblemEditorResults || {};
    for (const problem of session.problems || []) {
      totalProblems += 1;
      const editorResult = results[problem.id] || problem.editorResult;
      if (editorResult?.attempted) {
        attemptedInEditor += 1;
        if (editorResult.passed) passedInEditor += 1;
      }
    }
  }

  return {
    totalProblems,
    attemptedInEditor,
    passedInEditor,
    engagementRate: totalProblems > 0 ? attemptedInEditor / totalProblems : 0,
    passRate: attemptedInEditor > 0 ? passedInEditor / attemptedInEditor : null,
  };
}

// getInterviewSimEditorTrendData — per-session pass rate ordered chronologically
export function getInterviewSimEditorTrendData() {
  const history = loadJSON(HISTORY_KEY, []);
  return history
    .slice()
    .reverse()
    .map((session) => {
      const results = session.perProblemEditorResults || {};
      const total = (session.problems || []).length;
      let attempted = 0;
      let passed = 0;

      for (const problem of session.problems || []) {
        const editorResult = results[problem.id] || problem.editorResult;
        if (editorResult?.attempted) {
          attempted += 1;
          if (editorResult.passed) passed += 1;
        }
      }

      return {
        completedAt: session.completedAt,
        sessionId: session.sessionId,
        totalProblems: total,
        attemptedCount: attempted,
        passedCount: passed,
        passRate: attempted > 0 ? (passed / attempted) * 100 : null,
      };
    });
}