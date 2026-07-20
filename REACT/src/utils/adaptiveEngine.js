import { getProblemsByTopic, getProblem } from '../data/problems.js';
import { getProblemAttempts, getProblemSignals, isProblemSolved } from './progress.js';
import { getPreferences } from './preferences.js';
import { saveJSON } from './storage.js';

// adaptiveEngine.js — REORDER-based adaptive difficulty.
//
// Instead of pulling in unscheduled substitutes (which fails in a saturated
// roadmap), we REORDER existing scheduled problems: move a suitable problem
// from a distant future day into a near future day, and push the displaced
// problem to the vacated distant slot. Net effect: total count unchanged,
// every planned problem still in the plan, but the ORDER reflects current
// skill signals.
//
// Three signal kinds:
//   'accelerate'  → user is on a streak → promote a harder problem earlier
//   'ease'        → user is struggling → promote an easier problem earlier
//   'boss-unlock' → user has mastered fundamentals → promote a boss-fight
//
// PRINCIPLES:
//   - Never regenerates the roadmap. Only overlays reorderings.
//   - Total problem count NEVER changes (swap = 1-for-1).
//   - Max 1 adjustment per topic per day (no thrashing).
//   - Only ever reorders FUTURE days, never today or past days.
//   - Every adjustment stores its reason for transparent UI badges.
//   - Adjustments persisted in roadmap state, sync via Supabase blob.
//   - User can disable via preferences.adaptive.enabled = false.
//   - Duplicate prevention: within a single call, multiple topics may each
//     trigger a reorder; workingOverlay is threaded through so subsequent
//     reorders see prior ones and can't collide.
//
// HARDNESS SCORING:
//   Uses composite score (difficulty × 10 + tier + bossFightBonus) rather
//   than tier alone. Two mastery problems with different difficulties are
//   now distinguishable — earlier versions rejected any mastery↔mastery
//   swap even when the far one was Hard and the near one was Medium.

const RECENT_WINDOW_DAYS = 14;
const ACCELERATE_MIN_STREAK = 5;
const EASE_MIN_STRUGGLES = 3;
const BOSS_UNLOCK_MIN_MASTERY = 0.8;
const MAX_ADJUSTMENTS_PER_TOPIC_PER_DAY = 1;
const NEAR_DAY_HORIZON = 20; // only consider first 20 future slots as "near"

// ============================================================
// PUBLIC API
// ============================================================

export function analyzeAndApplyAdaptive(roadmapState) {
  if (!roadmapState) return [];

  const prefs = getPreferences();
  if (prefs?.adaptive?.enabled === false) return [];

  const changes = [];
  const topicOrder = roadmapState.topicOrder || [];
  const today = todayStr();
  const overlay = deepClone(roadmapState.adaptiveOverlay || {});

  for (const topicKey of topicOrder) {
    if (countTopicAdjustmentsOnDay(overlay, topicKey, today) >= MAX_ADJUSTMENTS_PER_TOPIC_PER_DAY) {
      continue;
    }

    const signal = detectSignal(topicKey);
    if (!signal) continue;

    const reorder = pickReorder(roadmapState, overlay, topicKey, signal);
    if (!reorder) continue;

    if (!overlay[topicKey]) overlay[topicKey] = {};

    // Promoted half — the near day gets the harder/easier/boss problem
    overlay[topicKey][reorder.nearDayDate] = {
      kind: signal.kind,
      originalProblemId: reorder.nearOriginalId,
      newProblemId: reorder.farOriginalId,
      pairedDayDate: reorder.farDayDate,
      appliedAt: Date.now(),
      reason: signal.reason,
    };

    // Demoted half — the far day gets the displaced problem, marked so UI
    // knows not to render a badge on it (only the promoted side is "the
    // adjustment"; the other side is just where the moved-out problem lives)
    overlay[topicKey][reorder.farDayDate] = {
      kind: signal.kind,
      originalProblemId: reorder.farOriginalId,
      newProblemId: reorder.nearOriginalId,
      isPairedHalf: true,
      pairedDayDate: reorder.nearDayDate,
      appliedAt: Date.now(),
      reason: signal.reason,
    };

    changes.push({
      topicKey,
      kind: signal.kind,
      nearDayDate: reorder.nearDayDate,
      farDayDate: reorder.farDayDate,
      promotedId: reorder.farOriginalId,
      demotedId: reorder.nearOriginalId,
      reason: signal.reason,
    });
  }

  if (changes.length === 0) return [];

  const updated = { ...roadmapState, adaptiveOverlay: overlay };
  saveJSON('pathforge:roadmap:state', updated);
  return changes;
}

export function getAdaptiveAdjustment(roadmapState, problemId, dayDate) {
  const overlay = roadmapState?.adaptiveOverlay || {};
  for (const topicKey of Object.keys(overlay)) {
    const entry = overlay[topicKey]?.[dayDate];
    if (entry && entry.newProblemId === problemId && !entry.isPairedHalf) {
      return { ...entry, topicKey };
    }
  }
  return null;
}

export function clearAdaptiveOverlay(roadmapState) {
  if (!roadmapState) return roadmapState;
  const updated = { ...roadmapState, adaptiveOverlay: {} };
  saveJSON('pathforge:roadmap:state', updated);
  return updated;
}

// ============================================================
// SIGNAL DETECTION
// ============================================================

function detectSignal(topicKey) {
  const recent = getRecentTopicAttempts(topicKey);
  if (recent.length === 0) return null;

  // STRUGGLE — last EASE_MIN_STRUGGLES all show struggle
  const lastN = recent.slice(0, EASE_MIN_STRUGGLES);
  if (lastN.length === EASE_MIN_STRUGGLES) {
    const allStruggled = lastN.every((a) =>
      (a.confidenceRating != null && a.confidenceRating <= 2) || a.solutionPeeked
    );
    if (allStruggled) {
      return {
        kind: 'ease',
        reason: `${EASE_MIN_STRUGGLES} recent struggles — easier problem promoted earlier`,
      };
    }
  }

  // ACCELERATE — last ACCELERATE_MIN_STREAK all confident
  const lastM = recent.slice(0, ACCELERATE_MIN_STREAK);
  if (lastM.length === ACCELERATE_MIN_STREAK) {
    const allConfident = lastM.every((a) =>
      a.confidenceRating >= 3 && !a.solutionPeeked && a.hintsOpened === 0
    );
    if (allConfident) {
      return {
        kind: 'accelerate',
        reason: `${ACCELERATE_MIN_STREAK} confident solves in a row — harder problem promoted`,
      };
    }
  }

  // BOSS UNLOCK
  if (checkBossUnlockReady(topicKey)) {
    return {
      kind: 'boss-unlock',
      reason: `You've mastered the fundamentals — boss fight promoted earlier`,
    };
  }

  return null;
}

function getRecentTopicAttempts(topicKey) {
  const cutoff = Date.now() - (RECENT_WINDOW_DAYS * 24 * 60 * 60 * 1000);
  const problems = getProblemsByTopic(topicKey);
  const all = [];

  for (const problem of problems) {
    const attempts = getProblemAttempts(problem.id);
    for (const attempt of attempts) {
      if (!attempt.date) continue;
      const ts = new Date(attempt.date).getTime();
      if (isNaN(ts) || ts < cutoff) continue;
      all.push({ ...attempt, problemId: problem.id, _ts: ts });
    }
  }

  return all.sort((a, b) => b._ts - a._ts);
}

function checkBossUnlockReady(topicKey) {
  const problems = getProblemsByTopic(topicKey);
  const fundamentals = problems.filter((p) => p.tier === 'foundation' || p.tier === 'core');
  if (fundamentals.length < 5) return false;

  const highConfidenceSolved = fundamentals.filter((p) => {
    if (!isProblemSolved(p.id)) return false;
    const sig = getProblemSignals(p.id);
    return sig.confidenceRating >= 3;
  }).length;

  return highConfidenceSolved / fundamentals.length >= BOSS_UNLOCK_MIN_MASTERY;
}

// ============================================================
// REORDER SELECTION
// ============================================================

// pickReorder — scan first NEAR_DAY_HORIZON slots for a topic, and for each
// try every later slot as a candidate promotion. Pick the swap with the
// biggest hardness delta in the direction the signal wants.
function pickReorder(roadmapState, workingOverlay, topicKey, signal) {
  const dayPlan = roadmapState.dayPlan || [];
  const today = todayStr();
  const slots = [];

  for (const day of dayPlan) {
    if (day.date <= today) continue;
    if (workingOverlay[topicKey]?.[day.date]) continue;

    for (const originalId of day.problemIds) {
      const problem = getProblem(originalId);
      if (problem && problem.topicKey === topicKey && !isProblemSolved(originalId)) {
        slots.push({ dayDate: day.date, originalId, problem });
      }
    }
  }

  if (slots.length < 2) return null;
  slots.sort((a, b) => a.dayDate.localeCompare(b.dayDate));

  let best = null;
  let bestScore = 0;

  const nearLimit = Math.min(slots.length, NEAR_DAY_HORIZON);

  for (let i = 0; i < nearLimit; i++) {
    const near = slots[i];
    for (let j = i + 1; j < slots.length; j++) {
      const far = slots[j];
      if (far.dayDate === near.dayDate) continue;

      const nearScore = hardnessScore(near.problem);
      const farScore = hardnessScore(far.problem);
      const delta = farScore - nearScore;

      let improvement = 0;
      if (signal.kind === 'accelerate' && delta > 0) improvement = delta;
      else if (signal.kind === 'ease' && delta < 0) improvement = -delta;
      else if (signal.kind === 'boss-unlock' && far.problem.bossFight && !near.problem.bossFight) improvement = 10;

      if (improvement > bestScore) {
        bestScore = improvement;
        best = {
          nearDayDate: near.dayDate,
          nearOriginalId: near.originalId,
          farDayDate: far.dayDate,
          farOriginalId: far.originalId,
        };
      }
    }
  }

  return best;
}

// hardnessScore — composite ranking used to compare two problems for
// promotion decisions. Bigger = harder.
//   difficulty ×10  (dominant term — Easy vs Hard is a big jump)
//   + tier ×1       (foundation/core/mastery is a fine-grained tiebreaker)
//   + bossFight +5  (boss fights count as extra-hard within their tier)
function hardnessScore(problem) {
  const diffScore = { Easy: 1, Medium: 2, Hard: 3 }[problem.difficulty] || 2;
  const tierScore = { foundation: 1, core: 2, mastery: 3 }[problem.tier] || 2;
  const bossBonus = problem.bossFight ? 5 : 0;
  return diffScore * 10 + tierScore + bossBonus;
}

// ============================================================
// HELPERS
// ============================================================

function todayStr() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function countTopicAdjustmentsOnDay(overlay, topicKey, dayDate) {
  return overlay[topicKey]?.[dayDate] ? 1 : 0;
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}