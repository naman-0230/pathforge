import { getProblemsByTopic } from '../data/problems.js';
import { topics } from '../data/topics.js';
import { getProblemSignals } from './progress.js';

// weakPoints.js — "Weak point detection" from your feature spec, made real.
// This is the exact formula from your original plan:
//
//   scores[pattern] += hintsOpened * 1
//                    + (solutionPeeked ? 3 : 0)
//                    + (5 - confidenceRating)
//
// The idea: every hint you needed, every time you peeked the solution, and
// every low confidence rating all push a topic's score up. A HIGH score means
// you struggled — the opposite of what you'd assume from "score" in a game.
// Only solved problems count (there's nothing to score for something you
// haven't attempted yet).

export function getTopicWeaknessScore(topicKey) {
  const topicProblems = getProblemsByTopic(topicKey);
  let score = 0;
  let solvedCount = 0;

  for (const problem of topicProblems) {
    const signals = getProblemSignals(problem.id);
    if (!signals.isSolved) continue; // nothing to score yet — only real attempts count

    solvedCount += 1;
    const confidence = signals.confidenceRating ?? 3; // assume neutral if somehow unset
    score +=
      signals.hintsOpened * 1 +
      (signals.solutionPeeked ? 3 : 0) +
      (5 - confidence);
  }

  // Average per solved problem, not a raw total — otherwise a topic with 10
  // solved problems would always look "weaker" than one with 2, just because
  // there were more chances to accumulate points. This way topics are
  // comparable regardless of how many problems have been attempted so far.
  const averageScore = solvedCount > 0 ? score / solvedCount : 0;

  return { score: averageScore, solvedCount };
}

// getWeakestTopics — ranks every seeded topic with at least one solved
// problem, weakest (highest average score) first. Topics with nothing solved
// yet are excluded — there's no signal to rank them on.
export function getWeakestTopics() {
  return topics
    .filter((t) => t.seeded)
    .map((t) => ({ topicKey: t.key, label: t.label, ...getTopicWeaknessScore(t.key) }))
    .filter((t) => t.solvedCount > 0)
    .sort((a, b) => b.score - a.score);
}

// isTopicWeak — a topic is flagged "weak" if it's ranked among the roughly
// top-third weakest topics (by score) AND has a meaningfully high score
// (> 2 average points per problem — i.e., averaging at least a couple hints
// or one low-confidence rating per problem). This second condition matters:
// without it, whichever topic happens to score highest would always get
// flagged "weak" even if every topic was actually going great.
export function isTopicWeak(topicKey) {
  const ranked = getWeakestTopics();
  if (ranked.length === 0) return false;

  const entry = ranked.find((t) => t.topicKey === topicKey);
  if (!entry || entry.score <= 2) return false;

  const cutoffIndex = Math.max(1, Math.ceil(ranked.length / 3));
  const weakSet = new Set(ranked.slice(0, cutoffIndex).map((t) => t.topicKey));
  return weakSet.has(topicKey);
}