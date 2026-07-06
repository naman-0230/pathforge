import { topics } from '../data/topics.js';
import { getProblemsByTopic } from '../data/problems.js';
import { isProblemSolved } from './progress.js';
import { getDaysRemaining } from './date.js';

// roadmapGenerator.js — BUDGET-AWARE, SEQUENTIAL roadmap.
//
// The roadmap is generated in ONE PASS, upfront:
//   1. Figure out the total number of problems the person can realistically
//      do (their "budget"), from hoursPerDay + time until deadline.
//   2. Decide how that budget is split across their SELECTED topics.
//   3. Within each topic, decide exactly which problems make the cut.
//   4. Lay the result out day-by-day, strictly in topic order.
//
// This replaces the earlier "gate topic N+1 until topic N is 100% solved"
// design. That model only decided the ORDER of an unbounded queue and never
// asked "how much can this person actually finish?" — so a tight deadline
// just meant "more crammed into fewer days," never "a curated subset."  Now
// the size of the roadmap is decided first, and topic/section selection
// flows from that.
//
// ── BUDGET SPLIT ACROSS TOPICS (proportional, with a floor) ──────────────
// Every selected+seeded topic first gets a guaranteed floor of 1 problem, so
// no selected topic is ever fully invisible from the roadmap. Whatever
// budget remains after the floor is then split proportionally to each
// topic's unsolved-problem pool size (a topic with 184 problems reasonably
// gets a bigger slice than one with 42), using the largest-remainder method
// so the totals add up exactly to the budget instead of drifting from
// naive rounding.
//
// ── WITHIN A TOPIC: WHICH PROBLEMS MAKE THE CUT ───────────────────────────
// A topic's sections (topics.js `sections`, already in dependency order) are
// walked front to back. A section is included IN FULL as long as the
// topic's remaining slice can fit it. The first section that can't fully
// fit gets a PARTIAL cut — just its first N problems, in their existing
// (easy-to-hard-within-pattern) order, i.e. its harder/capstone problems at
// the tail are the first thing trimmed. Every section after that point is
// skipped entirely.
//
// Because topics.js already places optional/advanced sections last within
// every topic (Bit Manipulation & Maths for Arrays, Advanced Trees for
// Trees, Advanced DP for DP, etc.), this walk-in-order-then-stop approach
// means advanced sections are naturally the first thing cut when a topic's
// slice is tight — without needing a separate "optional sections" list to
// maintain. If the slice is smaller than even the very first section, that
// first section itself gets partially cut rather than leaving the topic
// empty — better to go a little into "Basics" than show nothing for a
// selected topic.
//
// ── DAY PLAN ───────────────────────────────────────────────────────────
// Once the full problem list is decided, it's laid out strictly
// sequentially: every Arrays problem before every Strings problem, etc.
// (topics.js `order`). No interleaving.
//
// NOTE ON WEAK-TOPIC REINFORCEMENT: intentionally not handled here anymore.
// Reinforcing a topic the person is weak in means resurfacing SOLVED
// problems, which is a revision concern (revision.js / weakPoints.js), not
// an initial-roadmap concern — to be wired in separately.

// getProblemsPerDay — rough capacity estimate: ~1.5 problems per hour of
// committed study time, minimum 1/day, adjusted by dsaLevel (beginners
// assumed slower per problem, advanced learners faster). This is the one
// place dsaLevel still matters — it affects PACE (and therefore the total
// budget), never problem order or section trimming.
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

// allocateTopicBudgets — proportional split with a guaranteed floor of 1 per
// topic, largest-remainder rounding so allocations sum exactly to
// totalBudget (never more, and never less unless the total unsolved pool
// itself is smaller than the budget — in which case everyone just gets
// their full pool, no trimming needed at all).
function allocateTopicBudgets(topicPools, totalBudget) {
  const totalPool = topicPools.reduce((sum, t) => sum + t.poolSize, 0);

  // Budget is generous enough to cover everything selected — no trimming.
  if (totalPool <= totalBudget) {
    return topicPools.map((t) => ({ topicKey: t.topicKey, allocated: t.poolSize }));
  }

  const topicCount = topicPools.length;

  // Not even enough budget for a floor of 1 per topic — hand out 1 at a time
  // in topic (dependency) order until the budget runs out. Earlier topics
  // win ties, since they're prerequisites for everything after them.
  if (totalBudget <= topicCount) {
    return topicPools.map((t, i) => ({ topicKey: t.topicKey, allocated: i < totalBudget ? 1 : 0 }));
  }

  // Reserve the floor, then distribute the rest proportionally to pool size.
  const remainingBudget = totalBudget - topicCount;
  const raw = topicPools.map((t) => (t.poolSize / totalPool) * remainingBudget);
  const floors = raw.map((r) => Math.floor(r));
  let distributed = floors.reduce((sum, f) => sum + f, 0);
  let leftover = remainingBudget - distributed;

  // Largest-remainder method: hand out the leftover one-by-one to whichever
  // topic's fractional part was closest to rounding up.
  const remainderOrder = raw
    .map((r, i) => ({ i, remainder: r - floors[i] }))
    .sort((a, b) => b.remainder - a.remainder);

  const extra = new Array(topicCount).fill(0);
  for (let k = 0; k < leftover; k++) {
    extra[remainderOrder[k % topicCount].i] += 1;
  }

  return topicPools.map((t, i) => ({
    topicKey: t.topicKey,
    allocated: Math.min(t.poolSize, 1 + floors[i] + extra[i]), // +1 for the floor
  }));
}

// selectProblemsForTopic — walks a topic's sections in order, taking whole
// sections while the slice allows, partially cutting the first section that
// doesn't fit, and skipping everything after that.
function selectProblemsForTopic(topic, unsolvedProblems, allocated) {
  if (allocated >= unsolvedProblems.length) return unsolvedProblems;

  const selected = [];
  let remaining = allocated;

  for (const sectionName of topic.sections) {
    if (remaining <= 0) break;

    const sectionProblems = unsolvedProblems.filter((p) => p.section === sectionName);
    if (sectionProblems.length === 0) continue; // nothing unsolved left in this section

    if (sectionProblems.length <= remaining) {
      // Whole section fits — take all of it.
      selected.push(...sectionProblems);
      remaining -= sectionProblems.length;
    } else {
      // Partial cut: take the front N (easier / earlier-in-pattern problems
      // first), drop the harder tail, then stop entirely — every section
      // after this one is skipped.
      selected.push(...sectionProblems.slice(0, remaining));
      remaining = 0;
      break;
    }
  }

  return selected;
}

// getRoadmapBudgetBreakdown — exposed for the UI (e.g. RoadmapPage) to show
// "Arrays: 22 problems, Strings: 9 problems, ..." before/after generation.
export function getRoadmapBudgetBreakdown(roadmapSetup) {
  const selectedTopicKeys = new Set(roadmapSetup?.selectedTopics || []);
  const activeTopics = getActiveTopicsInOrder(selectedTopicKeys);

  const topicPools = activeTopics.map((t) => ({
    topicKey: t.key,
    label: t.label,
    poolSize: getProblemsByTopic(t.key).filter((p) => !isProblemSolved(p.id)).length,
  }));

  const daysRemaining = Math.max(1, getDaysRemaining(roadmapSetup?.deadline) ?? 30);
  const perDay = getProblemsPerDay(roadmapSetup?.hoursPerDay, roadmapSetup?.dsaLevel);
  const totalBudget = perDay * daysRemaining;

  const allocations = allocateTopicBudgets(topicPools, totalBudget);
  const allocationByKey = Object.fromEntries(allocations.map((a) => [a.topicKey, a.allocated]));

  return {
    totalBudget,
    daysRemaining,
    perDay,
    topics: topicPools.map((t) => ({ ...t, allocated: allocationByKey[t.topicKey] ?? 0 })),
  };
}

// getWeightedProblemQueue — kept this name for backwards compatibility with
// existing imports (DashboardPage/RoadmapPage etc.) even though it's no
// longer "weighted" in the old round-robin sense. Happy to rename + update
// call sites if you'd rather it be called something like
// getSequentialProblemQueue().
export function getWeightedProblemQueue(roadmapSetup) {
  const selectedTopicKeys = new Set(roadmapSetup?.selectedTopics || []);
  const activeTopics = getActiveTopicsInOrder(selectedTopicKeys);

  const topicPools = activeTopics.map((t) => {
    const unsolved = getProblemsByTopic(t.key).filter((p) => !isProblemSolved(p.id));
    return { topicKey: t.key, unsolved, poolSize: unsolved.length };
  });

  const daysRemaining = Math.max(1, getDaysRemaining(roadmapSetup?.deadline) ?? 30);
  const perDay = getProblemsPerDay(roadmapSetup?.hoursPerDay, roadmapSetup?.dsaLevel);
  const totalBudget = perDay * daysRemaining;

  const allocations = allocateTopicBudgets(
    topicPools.map(({ topicKey, poolSize }) => ({ topicKey, poolSize })),
    totalBudget
  );
  const allocationByKey = Object.fromEntries(allocations.map((a) => [a.topicKey, a.allocated]));

  const result = [];
  for (const topic of activeTopics) {
    const pool = topicPools.find((t) => t.topicKey === topic.key);
    const allocated = allocationByKey[topic.key] ?? 0;
    const chosen = selectProblemsForTopic(topic, pool.unsolved, allocated);
    for (const problem of chosen) {
      result.push({ ...problem });
    }
  }

  return result;
}

// buildDayPlan — chunks the sequential, budget-trimmed queue into
// day-by-day buckets. Since the queue is already sized to fit the budget,
// `actualPerDay` should rarely need to exceed `perDay` — the safety branch
// is kept only in case of rounding edge cases.
export function buildDayPlan(roadmapSetup) {
  const queue = getWeightedProblemQueue(roadmapSetup);
  const daysRemaining = Math.max(1, getDaysRemaining(roadmapSetup?.deadline) ?? 30);
  const perDay = getProblemsPerDay(roadmapSetup?.hoursPerDay, roadmapSetup?.dsaLevel);

  const totalCapacity = perDay * daysRemaining;
  const actualPerDay = queue.length > totalCapacity
    ? Math.ceil(queue.length / daysRemaining)
    : perDay;

  const days = [];
  for (let i = 0; i < daysRemaining && queue.length > 0; i++) {
    days.push({ day: i + 1, problems: queue.splice(0, actualPerDay) });
  }
  return days;
}