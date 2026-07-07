import { getProblemsByTopic } from '../data/problems.js';
import { topics } from '../data/topics.js';
import { getProblemSignals } from './progress.js';

// weakPoints.js — "Weak point detection" from your feature spec, made real.
// The formula:
//
//   scores[pattern] += hintsOpened * 1
//                    + (solutionPeeked ? 3 : 0)
//                    + (5 - confidenceRating)
//                    + timeComponent
//
// The idea: every hint you needed, every time you peeked the solution, every
// low confidence rating, and unusually long attempt time all push a topic's
// score up. A HIGH score means you struggled — the opposite of what you'd
// assume from "score" in a game.
//
// FIX (was): only isSolved problems counted at all. That meant someone who
// opened every hint, peeked the solution, and never clicked "Mark solved"
// contributed NOTHING to the score — not even the peek, the single strongest
// struggle signal. A topic where every attempt ended in "gave up, saw the
// answer, closed the tab" would show solvedCount: 0 and be silently excluded
// from ranking entirely — the exact opposite of what should happen.
//
// FIX (now): an attempt counts once it has a concluded outcome to judge —
// confidenceRating is set AND (isSolved OR solutionPeeked). Confidence rating
// is now required (in ProblemPage.jsx) before the solution can be viewed, so
// in practice every peeked attempt already carries a rating; solved-without-
// peeking attempts count too if a rating was given, and are simply skipped
// (no signal, not scored either way) if it wasn't — same "no signal, don't
// guess" philosophy the file already had, just no longer gated on isSolved.
//
// FIX (time): timeSpentSeconds (see progress.js) is a FROZEN per-attempt
// snapshot, normalized against a per-difficulty baseline and capped, so one
// outlier session (or someone who simply solves slowly in general) can't
// swamp the hint/peek/confidence signal. Under-baseline contributes 0 —
// finishing fast is never penalized, only unusually long attempts add weight.

// Rough "shouldn't need longer than this if it's going fine" baseline, in
// seconds, per difficulty. Deliberately generous — the point is to catch
// clear struggle, not to penalize anyone who reads carefully.
const TIME_BASELINE_SECONDS = { Easy: 600, Medium: 1200, Hard: 2400 }; // 10 / 20 / 40 min

// How much the time component alone can contribute to a single problem's
// score — kept modest relative to hints (uncapped, but typically 0-4) and
// peek (flat 3), so a long session nudges the score rather than dominating it.
const MAX_TIME_COMPONENT = 2;

function computeTimeComponent(timeSpentSeconds, difficulty) {
  if (timeSpentSeconds == null) return 0; // no snapshot captured — contribute nothing, not a penalty
  const baseline = TIME_BASELINE_SECONDS[difficulty] ?? TIME_BASELINE_SECONDS.Medium;
  const ratio = timeSpentSeconds / baseline;
  return Math.min(MAX_TIME_COMPONENT, Math.max(0, ratio - 1));
}

// A topic needs at least this many concluded attempts before it's eligible
// to be flagged "weak" at all — otherwise a single shaky problem (one low
// confidence rating alone can already clear the score>2 threshold) could
// flag an entire topic off a sample size of one.
const MIN_ATTEMPTS_FOR_WEAK_FLAG = 2;

export function getTopicWeaknessScore(topicKey) {
  const topicProblems = getProblemsByTopic(topicKey);
  let score = 0;
  let attemptedCount = 0;

  for (const problem of topicProblems) {
    const signals = getProblemSignals(problem.id);

    // Nothing to judge yet: no confidence rating given, or the attempt
    // hasn't concluded (not solved, not peeked — e.g. hints opened but still
    // actively in progress).
    if (signals.confidenceRating == null) continue;
    if (!signals.isSolved && !signals.solutionPeeked) continue;

    attemptedCount += 1;
    const timeComponent = computeTimeComponent(signals.timeSpentSeconds, problem.difficulty);
    score +=
      signals.hintsOpened * 1 +
      (signals.solutionPeeked ? 3 : 0) +
      (5 - signals.confidenceRating) +
      timeComponent;
  }

  // Average per attempted problem, not a raw total — otherwise a topic with
  // 10 attempted problems would always look "weaker" than one with 2, just
  // because there were more chances to accumulate points. This way topics
  // are comparable regardless of how many problems have been attempted.
  const averageScore = attemptedCount > 0 ? score / attemptedCount : 0;

  return { score: averageScore, attemptedCount };
}

// getWeakestTopics — ranks every seeded topic with at least one concluded
// attempt, weakest (highest average score) first. Topics with nothing
// concluded yet are excluded — there's no signal to rank them on.
export function getWeakestTopics() {
  return topics
    .filter((t) => t.seeded)
    .map((t) => ({ topicKey: t.key, label: t.label, ...getTopicWeaknessScore(t.key) }))
    .filter((t) => t.attemptedCount > 0)
    .sort((a, b) => b.score - a.score);
}

// isTopicWeak — a topic is flagged "weak" if it's ranked among the roughly
// top-third weakest topics (by score), has a meaningfully high score (> 2
// average points per problem), AND has enough attempts behind it to trust
// that score (MIN_ATTEMPTS_FOR_WEAK_FLAG) — without that last check, one
// rough problem alone could flag a topic that's otherwise going fine.
export function isTopicWeak(topicKey) {
  const ranked = getWeakestTopics();
  if (ranked.length === 0) return false;

  const entry = ranked.find((t) => t.topicKey === topicKey);
  if (!entry || entry.score <= 2) return false;
  if (entry.attemptedCount < MIN_ATTEMPTS_FOR_WEAK_FLAG) return false;

  const cutoffIndex = Math.max(1, Math.ceil(ranked.length / 3));
  const weakSet = new Set(ranked.slice(0, cutoffIndex).map((t) => t.topicKey));
  return weakSet.has(topicKey);
}