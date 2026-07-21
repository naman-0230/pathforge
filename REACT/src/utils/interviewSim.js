import { topics } from '../data/topics.js';
import { getProblemsByTopic } from '../data/problems.js';
import { getProblemDetails } from '../data/problemDetails.js';
import { getTopic } from '../data/topics.js';
import { isProblemSolved } from './progress.js';
import { loadJSON, saveJSON } from './storage.js';

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
const USAGE_KEY = 'pathforge:interviewSim:weeklyUsage';
const HISTORY_MAX = 20;
const FREE_TIER_WEEKLY_LIMIT = 1;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// ============================================================
// TIER USAGE TRACKING
// ============================================================

// getSimsUsedThisWeek — count of simulations STARTED in the last 7 days.
// Used to gate free-tier users at 1/week. Doesn't matter if they finished
// or canceled — starting counts, to prevent "start and abandon" bypass.
export function getSimsUsedThisWeek() {
  const usage = loadJSON(USAGE_KEY, []);
  const cutoff = Date.now() - WEEK_MS;
  return usage.filter((t) => t > cutoff).length;
}

// getNextAvailableTime — for Free-tier users who've hit their weekly cap,
// returns the timestamp when their oldest sim rolls out of the 7-day
// window. Used to show "next available in X days" countdown.
export function getNextAvailableTime() {
  const usage = loadJSON(USAGE_KEY, []);
  const cutoff = Date.now() - WEEK_MS;
  const recent = usage.filter((t) => t > cutoff).sort((a, b) => a - b);
  if (recent.length === 0) return null;
  // Oldest recent sim + 7 days = next available slot
  return recent[0] + WEEK_MS;
}

// recordSimStart — marks a new simulation as started. Called when the
// user actually begins the session (post-setup, first problem shown).
// Non-idempotent by design: each call is a real "attempt started" event.
export function recordSimStart() {
  const usage = loadJSON(USAGE_KEY, []);
  usage.push(Date.now());
  // Prune old entries so this list doesn't grow forever
  const cutoff = Date.now() - WEEK_MS * 4; // keep 4 weeks for safety
  const pruned = usage.filter((t) => t > cutoff);
  saveJSON(USAGE_KEY, pruned);
}

// canStartNewSim — combines tier check + weekly usage. Returns
// { allowed: bool, reason?: string, nextAvailableAt?: timestamp }
export function canStartNewSim(userTier) {
  // Basic and Advanced users: unlimited
  if (userTier === 'basic' || userTier === 'advanced') {
    return { allowed: true };
  }

  // Free users: check weekly cap
  const used = getSimsUsedThisWeek();
  if (used < FREE_TIER_WEEKLY_LIMIT) {
    return { allowed: true, remaining: FREE_TIER_WEEKLY_LIMIT - used };
  }

  return {
    allowed: false,
    reason: 'weekly-cap',
    nextAvailableAt: getNextAvailableTime(),
  };
}

// ============================================================
// SESSION GENERATION
// ============================================================

// generateSession — builds an interview simulation session with the
// requested problem count, difficulty mix, and topic scope. Returns
// null if the pool is too small to fulfill the request.
export function generateSession({ problemCount, durationMinutes, topicKeys, difficultyMix }) {
  const pool = buildProblemPool(topicKeys, difficultyMix);
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

function buildProblemPool(topicKeys, difficultyMix) {
  const searchKeys = topicKeys && topicKeys.length > 0
    ? topicKeys
    : topics.filter((t) => t.seeded).map((t) => t.key);

  const pool = [];
  for (const key of searchKeys) {
    const problems = getProblemsByTopic(key);
    for (const p of problems) {
      // Only include difficulties that are requested (non-zero in mix)
      if (difficultyMix[p.difficulty.toLowerCase()] > 0) {
        pool.push(p);
      }
    }
  }
  return pool;
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
export function recordSessionResult(session) {
  const history = loadJSON(HISTORY_KEY, []);
  history.unshift({
    ...session,
    completedAt: Date.now(),
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
// timing metrics. This is not AI — it's rule-based heuristics on the
// data we captured. Real interviewer feedback needs LLM (Advanced tier
// later). This is the "poor man's interviewer" for Basic tier.
//
// Metrics we look at:
//   - Time to first approach per problem
//   - How many problems attempted vs. total
//   - Whether user wrote approaches at all
//   - Whether user completed reflection
export function generateFeedback(session) {
  const { problems, perProblemMetrics = [], reflections = [] } = session;
  const total = problems.length;

  const attempted = perProblemMetrics.filter((m) => m.approachWritten).length;
  const withReflection = reflections.filter((r) => r && r.gotRight?.trim().length > 0).length;

  const avgApproachTimeMs = perProblemMetrics
    .filter((m) => m.timeToApproachMs != null)
    .reduce((sum, m, _, arr) => sum + m.timeToApproachMs / arr.length, 0);

  const strengths = [];
  const improvements = [];

  // Attempt rate
  if (attempted === total) {
    strengths.push(`You attempted every problem (${total}/${total}). Good time discipline.`);
  } else if (attempted >= total / 2) {
    strengths.push(`You attempted ${attempted} of ${total} problems.`);
    improvements.push(`Push through more problems next time — even a partial approach beats a skip.`);
  } else {
    improvements.push(`You only attempted ${attempted} of ${total} problems. In real interviews, always sketch SOMETHING, even for problems you're stuck on.`);
  }

  // Approach timing
  if (avgApproachTimeMs > 0) {
    const avgSec = Math.round(avgApproachTimeMs / 1000);
    if (avgSec < 60) {
      strengths.push(`Fast approach formulation — average ${avgSec}s to first idea. Interviewers notice this.`);
    } else if (avgSec < 180) {
      strengths.push(`Reasonable thinking time — ${avgSec}s average before starting to write.`);
    } else {
      improvements.push(`You spent ${avgSec}s on average before writing your approach. Practice pattern recognition to speed this up.`);
    }
  }

  // Reflection completion
  if (withReflection === total && total > 0) {
    strengths.push(`You reflected on every problem. Self-awareness is a huge interview skill.`);
  } else if (withReflection > 0) {
    improvements.push(`Reflect after every problem, not just some. It's where the learning happens.`);
  } else if (total > 0) {
    improvements.push(`Skipped reflection — always take 1 minute after each problem to think about what happened.`);
  }

  // Verdict
  const score = (attempted / total) * 60 + (withReflection / total) * 40;
  let verdict;
  if (score >= 85) verdict = { text: 'Strong session', tone: 'positive' };
  else if (score >= 60) verdict = { text: 'Solid session', tone: 'positive' };
  else if (score >= 35) verdict = { text: 'Room to grow', tone: 'neutral' };
  else verdict = { text: 'Practice needed', tone: 'critical' };

  return {
    verdict,
    strengths: strengths.length ? strengths : ['You showed up and started. That counts.'],
    improvements: improvements.length ? improvements : ["Nothing major — keep practicing at this pace."],
    score: Math.round(score),
  };
}