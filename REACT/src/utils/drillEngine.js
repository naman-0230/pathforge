import { getProblemsByTopic, getProblem } from '../data/problems.js';
import { getTopic } from '../data/topics.js';
import { topics } from '../data/topics.js';
import { isProblemSolved, getLatestAttempt } from './progress.js';
import { getWeakPatterns, getPatternStats } from './patternEngine.js';
import { loadJSON, saveJSON } from './storage.js';

// drillEngine.js — generates focused problem drills for weak patterns.
//
// WHAT IS A DRILL:
//   A drill is a hand-picked mini-set of 5 problems, all using the SAME
//   pattern, drawn from different topics when possible. The idea: if you
//   miss "Two Pointers" a lot in pattern training, do 5 Two Pointers
//   problems back-to-back until the pattern sticks.
//
// PROBLEM SELECTION (in priority order):
//   1. Unsolved problems using the pattern → best (fresh practice)
//   2. Solved-but-low-confidence problems → good (targeted revision)
//   3. Solved-with-high-confidence problems → last resort (just to have 5)
//   Mixed across topics whenever possible for cross-topic pattern transfer.
//
// WEAK PATTERN SOURCES:
//   Primary: getWeakPatterns() from patternEngine — patterns the user
//   misses in pattern training. This is the strongest signal.
//   Secondary (future): weak-point score aggregated by pattern from
//   real problem attempts. Not wired here yet.
//
// SESSION HISTORY:
//   Stored under pathforge:drills:history. Bounded at 30 sessions.
//   Each session records what was picked, what got solved, and outcome
//   ratings so future analytics can chart drill effectiveness.
const DRILL_HISTORY_KEY = 'pathforge:drills:history';
const DRILL_HISTORY_MAX = 30;
const DEFAULT_DRILL_SIZE = 5;
const DRILL_DISMISS_KEY = 'pathforge:drills:dismissedRecommendations';
// 7 days — drill recommendations for weak patterns should re-surface more
// often than upgrade teases (30 days). Weak patterns are actionable
// learning gaps that benefit from repeated nudges, whereas upgrade teases
// are about revenue conversion where less-is-more.
const DISMISS_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;

// ============================================================
// DISMISSAL TRACKING
// ============================================================

// dismissDrillRecommendation — records that this pattern's recommendation
// should be suppressed for DISMISS_COOLDOWN_MS. Called on two events:
//   1. User explicitly clicks ✕ on the dashboard card ("Not now")
//   2. User completes a drill on this pattern — no point re-recommending
//      a pattern they just spent 10-30 minutes drilling. The cooldown
//      gives new pattern-training data time to accumulate and update
//      the miss rate.
// After the cooldown, if the pattern is still weak (miss rate above
// threshold in newer training data), it re-surfaces normally.
export function dismissDrillRecommendation(pattern) {
  const dismissed = loadJSON(DRILL_DISMISS_KEY, {});
  dismissed[pattern] = Date.now();
  saveJSON(DRILL_DISMISS_KEY, dismissed);
}

// isDrillRecommendationDismissed — checks whether a pattern is currently
// within its dismissal cooldown window. Used by getDrillRecommendation
// to skip recently-dismissed patterns.
function isDrillRecommendationDismissed(pattern) {
  const dismissed = loadJSON(DRILL_DISMISS_KEY, {});
  const dismissedAt = dismissed[pattern];
  if (!dismissedAt) return false;
  if (Date.now() - dismissedAt > DISMISS_COOLDOWN_MS) return false;
  return true;
}

// clearDrillDismissals — utility if we ever want a "reset all my drills"
// button in Settings. Not currently used.
export function clearDrillDismissals() {
  saveJSON(DRILL_DISMISS_KEY, {});
}

// ============================================================
// PUBLIC API
// ============================================================

// getDrillRecommendation — returns the top weak pattern that has enough
// problems to build a drill from, or null if nothing meaningful to drill.
// Called by Dashboard to decide whether to show the drill card.
// getDrillRecommendation — returns the top weak pattern that has enough
// problems to build a drill from AND hasn't been dismissed in the last
// 24 hours. Called by Dashboard to decide whether to show the drill card.
//
// DISMISSAL: patterns the user clicked "Not now" on stay hidden for the
// cooldown window. This prevents the same card from re-nagging on every
// dashboard visit while the user is still working through their pattern
// training weak spots.
export function getDrillRecommendation({ topicKeys = null } = {}) {
  const weak = getWeakPatterns({ minSeen: 3, minMissRate: 0.4 });
  if (weak.length === 0) return null;

  // For each weak pattern (worst first), check if we can build a drill AND
  // it hasn't been dismissed recently. Return the first eligible one.
  for (const w of weak) {
    if (isDrillRecommendationDismissed(w.pattern)) continue;
    const problems = findProblemsForPattern(w.pattern, topicKeys);
    if (problems.length >= 3) {
      return {
        pattern: w.pattern,
        missRate: w.missRate,
        seen: w.seen,
        missed: w.missed,
        problemCount: Math.min(DEFAULT_DRILL_SIZE, problems.length),
      };
    }
  }
  return null;
}

// generateDrill — builds an actual drill for the given pattern. Returns
// a session-ready object with problem list and metadata.
export function generateDrill(pattern, { topicKeys = null, size = DEFAULT_DRILL_SIZE } = {}) {
  const candidates = findProblemsForPattern(pattern, topicKeys);
  if (candidates.length === 0) return null;

  const picked = pickBestCandidates(candidates, size);

  return {
    drillId: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    pattern,
    problems: picked.map((p) => ({
      id: p.id,
      name: p.name,
      difficulty: p.difficulty,
      topicKey: p.topicKey,
      topicLabel: getTopic(p.topicKey)?.label || p.topicKey,
      previouslySolved: isProblemSolved(p.id),
    })),
    startedAt: Date.now(),
  };
}

// recordDrillResult — persists the completed drill to history AND marks
// the pattern as recently-drilled so it doesn't immediately re-recommend
// on the dashboard. Uses the same DISMISS_COOLDOWN_MS as explicit
// dismissal: user just did work on this pattern, give it time before
// suggesting more work on the same thing.
export function recordDrillResult(session) {
  const history = loadJSON(DRILL_HISTORY_KEY, []);
  history.unshift({
    ...session,
    completedAt: Date.now(),
  });
  saveJSON(DRILL_HISTORY_KEY, history.slice(0, DRILL_HISTORY_MAX));

  // Auto-suppress recommendation for this pattern for the same cooldown
  // window as explicit dismissal. The user actively engaged with this
  // pattern — that's a stronger signal than dismissal to stop nagging.
  if (session.pattern) {
    dismissDrillRecommendation(session.pattern);
  }
}

export function getDrillHistory() {
  return loadJSON(DRILL_HISTORY_KEY, []);
}

// ============================================================
// PROBLEM SELECTION
// ============================================================

// findProblemsForPattern — collect every problem in the given topics that
// uses this pattern. If topicKeys is null, search all topics.
function findProblemsForPattern(pattern, topicKeys) {
  const searchKeys = topicKeys || getAllSeededTopicKeys();
  const found = [];
  for (const key of searchKeys) {
    const problems = getProblemsByTopic(key);
    for (const p of problems) {
      if (p.pattern === pattern) found.push(p);
    }
  }
  return found;
}

function getAllSeededTopicKeys() {
  return topics.filter((t) => t.seeded).map((t) => t.key);
}

// pickBestCandidates — priority-based selection:
//   Tier A: unsolved (best — fresh practice)
//   Tier B: solved with confidence ≤ 2 (targeted revision — still struggled)
//   Tier C: solved with confidence 3-4 (last resort — just to reach count)
//
// Within each tier, shuffle then take, so repeated drills on the same
// pattern don't always pick the same problems. Mix across topics when
// possible — if all Tier A problems are in one topic and Tier B has
// problems from another topic, include some of both.
function pickBestCandidates(candidates, size) {
  const tierA = []; // unsolved
  const tierB = []; // solved but low confidence
  const tierC = []; // solved with high confidence

  for (const p of candidates) {
    if (!isProblemSolved(p.id)) {
      tierA.push(p);
      continue;
    }
    const latest = getLatestAttempt(p.id);
    if (latest?.confidenceRating != null && latest.confidenceRating <= 2) {
      tierB.push(p);
    } else {
      tierC.push(p);
    }
  }

  // Shuffle each tier independently
  shuffle(tierA);
  shuffle(tierB);
  shuffle(tierC);

  // Draw from tiers in priority order, but do topic-diversification within
  // Tier A (the primary source). If Tier A has 5+ problems, we might still
  // want to sneak in one from Tier B to give variety — skip that for now
  // and keep the logic simple: Tier A first, fill from B, then C.
  const picked = [];
  const seenTopics = new Set();

  // First pass: prefer diverse topics within Tier A
  for (const p of tierA) {
    if (picked.length >= size) break;
    if (!seenTopics.has(p.topicKey)) {
      picked.push(p);
      seenTopics.add(p.topicKey);
    }
  }

  // Second pass: fill remaining slots from Tier A (accepting topic repeats)
  for (const p of tierA) {
    if (picked.length >= size) break;
    if (!picked.includes(p)) picked.push(p);
  }

  // Third pass: Tier B
  for (const p of tierB) {
    if (picked.length >= size) break;
    picked.push(p);
  }

  // Fourth pass: Tier C
  for (const p of tierC) {
    if (picked.length >= size) break;
    picked.push(p);
  }

  return picked;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}