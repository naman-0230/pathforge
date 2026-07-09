import { getProblemsByTopic } from '../data/problems.js';
import { topics } from '../data/topics.js';
import { getProblemSignals, getProblemAttempts } from './progress.js';
import { getPreferences } from './preferences.js';

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

// FIX (sensitivity): Settings' "weak-point sensitivity" (low/medium/high) was
// saved to preferences but never actually read anywhere — the threshold,
// sample-size requirement, and top-fraction cutoff below were all hardcoded
// to one fixed value, so the setting was purely decorative. Now all three
// knobs come from whichever sensitivity level is selected:
//   - scoreThreshold: how high the average score must be to even be eligible
//   - minAttempts:    how many concluded attempts are required to trust that
//                      score at all (this is the old MIN_ATTEMPTS_FOR_WEAK_FLAG,
//                      now sensitivity-dependent instead of fixed at 2)
//   - topFraction:    what slice of the ranked list can be flagged "weak" —
//                      "high" sensitivity flags more generously (top half),
//                      "low" only flags the clearest outliers (top fifth)
const SENSITIVITY_CONFIG = {
  low: { scoreThreshold: 3.5, minAttempts: 3, topFraction: 1 / 5 },
  medium: { scoreThreshold: 2, minAttempts: 2, topFraction: 1 / 3 },
  high: { scoreThreshold: 1, minAttempts: 1, topFraction: 1 / 2 },
};

export function getTopicWeaknessScore(topicKey) {
  const topicProblems = getProblemsByTopic(topicKey);
  let score = 0;
  let attemptedCount = 0;

  for (const problem of topicProblems) {
    const attempts = getProblemAttempts(problem.id);

    if (attempts.length > 0) {
      // New path: aggregate across all recorded attempts for this problem.
      // Each concluded attempt contributes its own score; we average across
      // attempts for this problem first, then that average feeds the
      // topic-level average. This means a problem solved 3 times counts the
      // same as one solved once — we're measuring struggle intensity, not
      // total struggle volume.
      //
      // Concluded attempt filter: same rule as before — confidenceRating set
      // AND (solutionPeeked OR the flat isSolved flag). For attempts in the
      // array, we use solutionPeeked directly since there's no per-attempt
      // isSolved (isSolved is a property of the problem, not one attempt).
      const concludedAttempts = attempts.filter(
        (a) => a.confidenceRating != null && (a.solutionPeeked || getProblemSignals(problem.id).isSolved)
      );
      if (concludedAttempts.length === 0) continue;

      let problemScore = 0;
      for (const attempt of concludedAttempts) {
        const timeComponent = computeTimeComponent(attempt.timeSpentSeconds, problem.difficulty);
        problemScore +=
          attempt.hintsOpened * 1 +
          (attempt.solutionPeeked ? 3 : 0) +
          (5 - attempt.confidenceRating) +
          timeComponent;
      }

      score += problemScore / concludedAttempts.length;
      attemptedCount += 1;
    } else {
      // Fallback path: no attempts array yet (record not yet normalized, or
      // problem was never concluded). Fall back to the flat signals so
      // scoring keeps working during the migration window — no problem
      // silently drops out of weak-point detection just because it hasn't
      // been touched since this change shipped.
      const signals = getProblemSignals(problem.id);
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

// isTopicWeak — a topic is flagged "weak" if it's ranked among the top
// fraction of weakest topics for the current sensitivity level, has a score
// above that level's threshold, AND has enough attempts behind it to trust
// that score. All three thresholds now come from Settings' weakPoints
// .sensitivity preference (defaults to "medium" if unset or unrecognized) —
// this used to be hardcoded regardless of what Settings said.
export function isTopicWeak(topicKey) {
  const ranked = getWeakestTopics();
  if (ranked.length === 0) return false;

  const entry = ranked.find((t) => t.topicKey === topicKey);
  if (!entry) return false;

  const prefs = getPreferences();
  const config = SENSITIVITY_CONFIG[prefs?.weakPoints?.sensitivity] || SENSITIVITY_CONFIG.medium;

  if (entry.score <= config.scoreThreshold) return false;
  if (entry.attemptedCount < config.minAttempts) return false;

  const cutoffIndex = Math.max(1, Math.ceil(ranked.length * config.topFraction));
  const weakSet = new Set(ranked.slice(0, cutoffIndex).map((t) => t.topicKey));
  return weakSet.has(topicKey);
}