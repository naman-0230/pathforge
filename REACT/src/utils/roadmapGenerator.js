import { topics } from '../data/topics.js';
import { getProblemsByTopic } from '../data/problems.js';
import { isProblemSolved } from './progress.js';
import { getWeakestTopics } from './weakPoints.js';
import { getDaysRemaining } from './date.js';

// roadmapGenerator.js — "Adaptive roadmap" from your feature spec, made real.
//
// The core idea, in plain terms: build a single ordered list of every unsolved
// problem across the person's selected topics, but interleave it so weaker
// topics show up MORE OFTEN than a simple "topic by topic" order would give
// them. That's what "re-routes as you progress" actually means in practice —
// there's no literal re-routing event, the queue just naturally shifts every
// time you solve something, because weakness scores are recalculated live
// from real progress data.
//
// getWeightedProblemQueue() → one flat ordered list (what to work on, in order)
// buildDayPlan() → that same list, chunked into days based on hours/day + deadline

// weightForTopic — how many "slots" a topic gets per round of interleaving.
// Weak topics get 3x priority, matching the spirit of "+3 extra problems
// added" language from the original static design.
function weightForTopic(topicKey, weakTopicKeys) {
  return weakTopicKeys.has(topicKey) ? 3 : 1;
}

const DIFFICULTY_RANK = { Easy: 0, Medium: 1, Hard: 2 };

// sortByLevel — this is where onboarding's dsaLevel actually gets used.
// "We'll calibrate the starting difficulty" from the onboarding copy means:
// within each topic, reorder its problems so the difficulty curve matches
// where the person said they're starting from.
//   - beginner:     strict Easy → Medium → Hard, so nothing overwhelming shows up early
//   - intermediate: left as-is (problems.js is already authored roughly Easy→Hard)
//   - advanced:     Easy problems pushed to the back — someone "comfortable
//                    with most topics" doesn't need to warm up on the basics first
function sortByLevel(problemsList, dsaLevel) {
  if (dsaLevel === 'beginner') {
    return [...problemsList].sort(
      (a, b) => DIFFICULTY_RANK[a.difficulty] - DIFFICULTY_RANK[b.difficulty]
    );
  }
  if (dsaLevel === 'advanced') {
    return [...problemsList].sort((a, b) => {
      const aEasy = a.difficulty === 'Easy' ? 1 : 0;
      const bEasy = b.difficulty === 'Easy' ? 1 : 0;
      return aEasy - bEasy; // non-Easy problems bubble to the front
    });
  }
  return problemsList; // 'intermediate' or unset — natural order
}

export function getWeightedProblemQueue(roadmapSetup) {
  const selectedTopicKeys = new Set(roadmapSetup?.selectedTopics || []);
  const dsaLevel = roadmapSetup?.dsaLevel;

  // Only topics that are both selected during onboarding AND actually seeded
  // with real problems — an unseeded selected topic (e.g. "Trees") has
  // nothing to schedule yet.
  const activeTopics = topics.filter((t) => t.seeded && (selectedTopicKeys.size === 0 || selectedTopicKeys.has(t.key)));

  const weakTopicKeys = new Set(getWeakestTopics().filter((t) => t.score > 2).map((t) => t.topicKey).slice(0, 2));

  // Build one unsolved-problem queue per topic, reordered by dsaLevel's
  // difficulty preference, in their existing order.
  const perTopicQueues = activeTopics.map((t) => ({
    topicKey: t.key,
    weight: weightForTopic(t.key, weakTopicKeys),
    queue: sortByLevel(getProblemsByTopic(t.key).filter((p) => !isProblemSolved(p.id)), dsaLevel),
  }));

  // Round-robin interleave, but weak topics contribute `weight` problems per
  // round instead of just 1 — this is what makes them show up more frequently
  // without hiding other topics entirely.
  const result = [];
  let remaining = perTopicQueues.some((t) => t.queue.length > 0);
  while (remaining) {
    remaining = false;
    for (const topicEntry of perTopicQueues) {
      for (let i = 0; i < topicEntry.weight; i++) {
        const next = topicEntry.queue.shift();
        if (next) {
          result.push({ ...next, topicKey: topicEntry.topicKey });
          remaining = remaining || topicEntry.queue.length > 0;
        }
      }
    }
  }

  return result;
}

// getProblemsPerDay — very rough capacity estimate: about 1.5 problems per
// hour of committed study time, minimum 1/day, adjusted slightly by dsaLevel —
// beginners likely spend longer per problem (more time re-reading/debugging),
// advanced learners likely move faster. This is still a rough estimate, not
// a real time-tracking model — a real version would learn this per-person
// from actual solve times over time.
const LEVEL_PACE_MULTIPLIER = { beginner: 0.8, intermediate: 1, advanced: 1.2 };

function getProblemsPerDay(hoursPerDay, dsaLevel) {
  const multiplier = LEVEL_PACE_MULTIPLIER[dsaLevel] ?? 1;
  return Math.max(1, Math.round((hoursPerDay || 2) * 1.5 * multiplier));
}

// buildDayPlan — chunks the weighted queue into day-by-day buckets, sized to
// fit between now and the deadline. If there are more problems than days can
// hold at this pace, later days just get more per day rather than problems
// being silently dropped — pace conflicts are surfaced, not hidden.
export function buildDayPlan(roadmapSetup) {
  const queue = getWeightedProblemQueue(roadmapSetup);
  const daysRemaining = Math.max(1, getDaysRemaining(roadmapSetup?.deadline) ?? 30);
  const perDay = getProblemsPerDay(roadmapSetup?.hoursPerDay, roadmapSetup?.dsaLevel);

  const totalCapacity = perDay * daysRemaining;
  const actualPerDay = queue.length > totalCapacity
    ? Math.ceil(queue.length / daysRemaining) // pace is too slow for the deadline — pack more in per day
    : perDay;

  const days = [];
  for (let i = 0; i < daysRemaining && queue.length > 0; i++) {
    days.push({ day: i + 1, problems: queue.splice(0, actualPerDay) });
  }
  return days;
}