import { topics } from '../data/topics.js';
import { getProblemsByTopic, getProblem } from '../data/problems.js';
import { isProblemSolved } from './progress.js';
import { getDaysRemaining } from './date.js';
import { loadJSON, saveJSON } from './storage.js';

// roadmapGenerator.js — STORED, FROZEN roadmap.
//
// Earlier versions of this file recomputed the entire roadmap from scratch
// on every single render. That was wrong: it meant the roadmap silently
// reshuffled just from loading the page, or from solving a problem nudging
// other topics' proportional shares. A roadmap should only actually change
// when one of three things happens:
//   1. Settings change (deadline / hours-per-day / topic selection edited
//      on the Settings page) — applies immediately, no confirmation needed,
//      since the person just took that action themselves.
//   2. The "Recalculate ⚡" button is clicked — applies immediately, with a
//      confirmation message.
//   3. Weak-point analysis suggests a reallocation (NOT YET IMPLEMENTED —
//      see checkWeakPointRecalcSuggestion below) — this one should ASK
//      first via a banner, and only apply if the person accepts.
//
// To make that possible, the roadmap is now GENERATED ONCE and STORED
// (localStorage, via storage.js), not recomputed live every render:
//
//   {
//     settingsSignature: "...",      // fingerprint of the settings that
//                                     // produced this roadmap — used to
//                                     // detect trigger #1 above
//     generatedAt: <timestamp>,
//     topicOrder: ['arrays', ...],    // dependency order at generation time
//     selection: {
//       arrays: {
//         allocatedIds: [...],        // newly-chosen unsolved problem ids —
//                                     // FROZEN until the next regeneration
//         baselineSolvedIds: [...],   // problems already solved AT
//                                     // GENERATION TIME (before this run)
//       },
//       ...
//     },
//     dayPlan: [
//       { day: 1, date: '2026-07-08', problemIds: [...] },
//       { day: 2, date: '2026-07-09', problemIds: [...] },
//       ...
//     ],
//   }
//
// Every render RESOLVES stats from this frozen record against LIVE solved
// status:
//   total  = allocatedIds.length + baselineSolvedIds.length   (NEVER shrinks
//            or grows from normal solving — only regeneration changes it)
//   solved = baselineSolvedIds.length + however many allocatedIds are now
//            solved                                            (grows as
//            you solve problems, that's all that moves)
//
// This is what finally fixes "solving a problem changes my roadmap" for
// good — solving something can only move a problem from "to do" to "done"
// within an unchanged total, never resize or reshuffle anything.
//
// ── DAY PLAN: now CALENDAR-DATED, not relative "Day 1/2/3" ─────────────────
// Each day in `dayPlan` gets a real ISO date, assigned ONCE at generation
// time (day 1 = the calendar date of generation, day 2 = the next day, etc.)
// and frozen from then on — exactly like the topic-level `selection`. This
// is what makes three behaviors well-defined for the first time:
//
//   - GRAYING: a day's problems are resolved live against solved status
//     every render (resolveDayPlan below), so a solved problem stays VISIBLE
//     in its day, just marked solved — it never silently disappears from
//     the day plan the way it used to.
//   - TODAY'S QUOTA COMPLETE: since a day now has a fixed real date, "is
//     today's quota done" is just "does the entry whose date === today have
//     every problem solved" (isTodayQuotaComplete below) — a real,
//     checkable fact, not something that resets itself the moment more
//     problems get pulled in from tomorrow.
//   - MISSED / CATCH-UP: any entry whose date is in the PAST that still has
//     unsolved problems is "missed" (getMissedProblems below). Per product
//     decision, missed problems do NOT get merged into today's or any other
//     day's quota — they surface as a separate catch-up list the person
//     clears at their own pace, and today's/future days' quotas stay
//     exactly as planned regardless of what's missed.

const ROADMAP_STATE_KEY = 'pathforge:roadmap:state';

const LEVEL_PACE_MULTIPLIER = { beginner: 0.8, intermediate: 1, advanced: 1.2 };

function getProblemsPerDay(hoursPerDay, dsaLevel) {
  const multiplier = LEVEL_PACE_MULTIPLIER[dsaLevel] ?? 1;
  return Math.max(1, Math.round((hoursPerDay || 2) * 1.5 * multiplier));
}

function getActiveTopicsInOrder(selectedTopicKeys) {
  return topics
    .filter((t) => t.seeded && (selectedTopicKeys.size === 0 || selectedTopicKeys.has(t.key)))
    .sort((a, b) => a.order - b.order);
}

// Date helpers for the calendar-dated day plan. Deliberately using local
// calendar date (not UTC) so "today" matches what the person actually sees
// on their clock, and a simple string comparison ('2026-07-09' < '2026-07-10')
// works correctly for past/today/future checks since ISO date strings sort
// lexicographically the same as chronologically.
function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function todayDateKey() {
  return toDateKey(new Date());
}

// settingsSignature — stable fingerprint of exactly the settings that
// should trigger regeneration. Topic selection is sorted so re-selecting
// the same topics in a different order doesn't falsely count as a change.
export function settingsSignature(roadmapSetup) {
  const selectedTopics = [...(roadmapSetup?.selectedTopics || [])].sort();
  return JSON.stringify({
    deadline: roadmapSetup?.deadline ?? null,
    hoursPerDay: roadmapSetup?.hoursPerDay ?? null,
    dsaLevel: roadmapSetup?.dsaLevel ?? null,
    selectedTopics,
  });
}

// allocateTopicBudgets — proportional split with a guaranteed floor of 1 per
// topic, largest-remainder rounding so allocations sum exactly to the
// budget (or everyone gets their full unsolved pool if the budget is
// generous enough that no trimming is needed at all).
function allocateTopicBudgets(topicPools, totalBudget) {
  const totalPool = topicPools.reduce((sum, t) => sum + t.poolSize, 0);

  if (totalPool <= totalBudget) {
    return topicPools.map((t) => ({ topicKey: t.topicKey, allocated: t.poolSize }));
  }

  const topicCount = topicPools.length;

  if (totalBudget <= topicCount) {
    return topicPools.map((t, i) => ({ topicKey: t.topicKey, allocated: i < totalBudget ? 1 : 0 }));
  }

  const remainingBudget = totalBudget - topicCount;
  const raw = topicPools.map((t) => (t.poolSize / totalPool) * remainingBudget);
  const floors = raw.map((r) => Math.floor(r));
  const distributed = floors.reduce((sum, f) => sum + f, 0);
  const leftover = remainingBudget - distributed;

  const remainderOrder = raw
    .map((r, i) => ({ i, remainder: r - floors[i] }))
    .sort((a, b) => b.remainder - a.remainder);

  const extra = new Array(topicCount).fill(0);
  for (let k = 0; k < leftover; k++) {
    extra[remainderOrder[k % topicCount].i] += 1;
  }

  return topicPools.map((t, i) => ({
    topicKey: t.topicKey,
    allocated: Math.min(t.poolSize, 1 + floors[i] + extra[i]),
  }));
}

// selectProblemsForTopic — walks a topic's sections in authored (dependency)
// order, taking whole sections while the slice allows, partially cutting
// the first section that doesn't fit, and skipping everything after that —
// which naturally cuts optional/advanced sections first, since topics.js
// already lists those last.
function selectProblemsForTopic(topic, unsolvedProblems, allocated) {
  if (allocated >= unsolvedProblems.length) return unsolvedProblems;

  const selected = [];
  let remaining = allocated;

  for (const sectionName of topic.sections) {
    if (remaining <= 0) break;
    const sectionProblems = unsolvedProblems.filter((p) => p.section === sectionName);
    if (sectionProblems.length === 0) continue;

    if (sectionProblems.length <= remaining) {
      selected.push(...sectionProblems);
      remaining -= sectionProblems.length;
    } else {
      selected.push(...sectionProblems.slice(0, remaining));
      remaining = 0;
      break;
    }
  }

  return selected;
}

// generateRoadmap — the ONE place actual generation happens: computes a
// fresh allocation from CURRENT solved/unsolved state, freezes it into a
// storable record, and persists it. Called on: first-ever load, detected
// settings change, explicit "Recalculate" click, or (later) an accepted
// weak-point suggestion. Never called just from rendering.
export function generateRoadmap(roadmapSetup) {
  const selectedTopicKeys = new Set(roadmapSetup?.selectedTopics || []);
  const activeTopics = getActiveTopicsInOrder(selectedTopicKeys);

  const topicPools = activeTopics.map((t) => {
    const allProblems = getProblemsByTopic(t.key);
    const unsolved = allProblems.filter((p) => !isProblemSolved(p.id));
    const baselineSolvedIds = allProblems.filter((p) => isProblemSolved(p.id)).map((p) => p.id);
    return { topicKey: t.key, unsolved, poolSize: unsolved.length, baselineSolvedIds };
  });

  const daysRemaining = Math.max(1, getDaysRemaining(roadmapSetup?.deadline) ?? 30);
  const perDay = getProblemsPerDay(roadmapSetup?.hoursPerDay, roadmapSetup?.dsaLevel);
  const totalBudget = perDay * daysRemaining;

  const allocations = allocateTopicBudgets(
    topicPools.map(({ topicKey, poolSize }) => ({ topicKey, poolSize })),
    totalBudget
  );
  const allocationByKey = Object.fromEntries(allocations.map((a) => [a.topicKey, a.allocated]));

  const selection = {};
  for (const topic of activeTopics) {
    const pool = topicPools.find((t) => t.topicKey === topic.key);
    const chosen = selectProblemsForTopic(topic, pool.unsolved, allocationByKey[topic.key] ?? 0);
    selection[topic.key] = {
      allocatedIds: chosen.map((p) => p.id),
      baselineSolvedIds: pool.baselineSolvedIds,
    };
  }

  // Build the calendar-dated day plan, ONCE, right now — this is what makes
  // "today," "missed," and "quota complete" well-defined concepts instead of
  // relative labels that get silently recomputed. day 1 = today's real date.
  const topicOrderKeys = activeTopics.map((t) => t.key);
  const flatQueue = [];
  for (const topicKey of topicOrderKeys) {
    const ids = selection[topicKey].allocatedIds;
    const probs = ids.map((id) => getProblem(id)).filter(Boolean).sort((a, b) => a.order - b.order);
    flatQueue.push(...probs);
  }

  const totalCapacity = perDay * daysRemaining;
  const actualPerDay = flatQueue.length > totalCapacity
    ? Math.ceil(flatQueue.length / daysRemaining)
    : perDay;

  const generationDate = new Date();
  const dayPlan = [];
  let idx = 0;
  for (let i = 0; i < daysRemaining && idx < flatQueue.length; i++) {
    const chunk = flatQueue.slice(idx, idx + actualPerDay);
    idx += actualPerDay;
    dayPlan.push({
      day: i + 1,
      date: toDateKey(addDays(generationDate, i)),
      problemIds: chunk.map((p) => p.id),
    });
  }

  const state = {
    settingsSignature: settingsSignature(roadmapSetup),
    generatedAt: Date.now(),
    topicOrder: topicOrderKeys,
    selection,
    dayPlan,
  };

  saveJSON(ROADMAP_STATE_KEY, state);
  return state;
}

export function getStoredRoadmapState() {
  return loadJSON(ROADMAP_STATE_KEY, null);
}

// getOrRegenerateRoadmapState — the auto-apply path for trigger #1
// (settings changed) plus first-ever generation. If there's no stored
// roadmap yet, or the stored one was generated under different settings
// than right now, it regenerates immediately and returns the fresh state —
// no confirmation needed, since a settings edit is already an explicit
// action the person just took on the Settings page.
export function getOrRegenerateRoadmapState(roadmapSetup) {
  const sig = settingsSignature(roadmapSetup);
  const stored = getStoredRoadmapState();
  if (!stored || stored.settingsSignature !== sig) {
    return generateRoadmap(roadmapSetup);
  }
  return stored;
}

// forceRegenerateRoadmap — trigger #2 (the "Recalculate ⚡" button) and,
// later, an ACCEPTED weak-point suggestion (trigger #3). Always
// regenerates regardless of whether settings changed.
export function forceRegenerateRoadmap(roadmapSetup) {
  return generateRoadmap(roadmapSetup);
}

// checkWeakPointRecalcSuggestion — SCAFFOLD ONLY. This is where trigger #3
// belongs: weak-point analysis (revision.js / weakPoints.js, not yet built)
// deciding the current roadmap should be reallocated. It should return
// either null ("nothing to suggest") or something like
// { reason: '...', topicKeys: [...] } describing what it thinks should
// change. The caller (RoadmapPage) is responsible for showing a banner and
// only calling forceRegenerateRoadmap() if the person accepts — never
// applying automatically. Returns null unconditionally until that's built.
export function checkWeakPointRecalcSuggestion(/* roadmapState */) {
  return null;
}

// resolveRoadmapBreakdown — turns a stored roadmap state into the full
// per-topic picture the UI needs, resolving the FROZEN id lists against
// LIVE solved status. Covers every topic in topics.js, not just ones in
// the roadmap, so excluded/upcoming topics can still be displayed.
export function resolveRoadmapBreakdown(roadmapState) {
  return topics.map((t) => {
    if (!t.seeded) {
      return {
        topicKey: t.key,
        label: t.label,
        seeded: false,
        inRoadmap: false,
        solvedProblems: [],
        selectedProblems: [],
        solved: 0,
        total: t.targetTotal || 0,
      };
    }

    const entry = roadmapState?.selection?.[t.key];

    if (!entry) {
      // Seeded, but not part of the generated roadmap (excluded at
      // generation time, or state doesn't exist yet) — still show past
      // progress, just not counted as part of the active plan.
      const solvedProblems = getProblemsByTopic(t.key).filter((p) => isProblemSolved(p.id));
      return {
        topicKey: t.key,
        label: t.label,
        seeded: true,
        inRoadmap: false,
        solvedProblems,
        selectedProblems: [],
        solved: solvedProblems.length,
        total: solvedProblems.length,
      };
    }

    const allocatedProblems = entry.allocatedIds.map((id) => getProblem(id)).filter(Boolean);
    const stillUnsolved = allocatedProblems.filter((p) => !isProblemSolved(p.id));
    const nowSolvedFromAllocated = allocatedProblems.filter((p) => isProblemSolved(p.id));
    const baselineSolvedProblems = entry.baselineSolvedIds.map((id) => getProblem(id)).filter(Boolean);
    const solvedProblems = [...baselineSolvedProblems, ...nowSolvedFromAllocated];

    return {
      topicKey: t.key,
      label: t.label,
      seeded: true,
      inRoadmap: true,
      solvedProblems,
      selectedProblems: stillUnsolved, // still-to-do, frozen set minus newly solved
      solved: solvedProblems.length,
      total: entry.allocatedIds.length + entry.baselineSolvedIds.length, // FIXED
    };
  });
}

// getRoadmapOverallProgress — roadmap-scoped "X / Y solved" + percent,
// resolved from the frozen state (so it inherits the same "total never
// shrinks from solving" property).
export function getRoadmapOverallProgress(roadmapState) {
  const breakdown = resolveRoadmapBreakdown(roadmapState);
  let totalSolved = 0;
  let totalProblems = 0;
  for (const t of breakdown) {
    if (!t.inRoadmap) continue;
    totalSolved += t.solved;
    totalProblems += t.total;
  }
  const percent = totalProblems > 0 ? Math.round((totalSolved / totalProblems) * 100) : 0;
  return { totalSolved, totalProblems, percent };
}

// getWeightedProblemQueue — kept for backwards compatibility with existing
// imports (e.g. DashboardPage.jsx). Returns the flat, still-to-do problem
// queue, strictly in topic order, resolved from the STORED roadmap state
// (auto-generating one if it doesn't exist yet or settings changed) rather
// than recomputing everything live — so this now inherits the same "won't
// silently reshuffle" property as the rest of the roadmap. If you'd rather
// this be renamed to something clearer (e.g. getRoadmapProblemQueue), happy
// to update the call site too.
export function getWeightedProblemQueue(roadmapSetup) {
  const state = getOrRegenerateRoadmapState(roadmapSetup);
  const breakdown = resolveRoadmapBreakdown(state);
  const topicOrder = state?.topicOrder || [];

  const queue = [];
  for (const topicKey of topicOrder) {
    const entry = breakdown.find((t) => t.topicKey === topicKey);
    if (!entry) continue;
    const sorted = [...entry.selectedProblems].sort((a, b) => a.order - b.order);
    queue.push(...sorted);
  }
  return queue;
}
// resolveDayPlan — resolves the FROZEN, calendar-dated day plan against
// LIVE solved status. Every problem in every day is included regardless of
// solved state (this is the fix for graying: solved problems stay visible,
// tagged `solved: true`, rather than vanishing from their day). Each day
// also gets isPast/isToday/isFuture and allSolved flags computed from the
// real current date, so the caller never needs its own date math.
export function resolveDayPlan(roadmapState) {
  const todayKey = todayDateKey();
  return (roadmapState?.dayPlan || []).map((entry) => {
    const problems = entry.problemIds
      .map((id) => getProblem(id))
      .filter(Boolean)
      .map((p) => ({ ...p, solved: isProblemSolved(p.id) }));
    const total = problems.length;
    const solvedCount = problems.filter((p) => p.solved).length;
    return {
      day: entry.day,
      date: entry.date,
      problems,
      total,
      solvedCount,
      isPast: entry.date < todayKey,
      isToday: entry.date === todayKey,
      isFuture: entry.date > todayKey,
      allSolved: total > 0 && solvedCount === total,
    };
  });
}

// getTodayPlan — the single resolved day whose date matches today, or null
// if today falls outside the stored plan (e.g. the deadline already passed
// without a regeneration — a good signal to prompt "Recalculate").
export function getTodayPlan(roadmapState) {
  return resolveDayPlan(roadmapState).find((d) => d.isToday) || null;
}

// isTodayQuotaComplete — true only when today has a real, non-empty plan
// and every problem in it is solved. This is what the completion
// celebration should key off.
export function isTodayQuotaComplete(roadmapState) {
  const today = getTodayPlan(roadmapState);
  return !!today && today.total > 0 && today.allSolved;
}

// getMissedProblems — every unsolved problem from a day whose date has
// already passed, flattened into one list with a `missedDate` tag. Per
// product decision, these are surfaced as a SEPARATE catch-up reminder —
// they are never merged into today's or any future day's quota, and
// today's/future quotas are computed completely independently of this list.
export function getMissedProblems(roadmapState) {
  const resolved = resolveDayPlan(roadmapState);
  const missed = [];
  for (const day of resolved) {
    if (!day.isPast) continue;
    for (const p of day.problems) {
      if (!p.solved) missed.push({ ...p, missedDate: day.date });
    }
  }
  return missed;
}