import { loadJSON } from './storage.js';
import { getProblemsByTopic } from '../data/problems.js';

// isProblemSolved — checks the same localStorage key ProblemPage saves progress
// under (`pathforge:problem:${id}`) and reads its isSolved flag. This is how
// Roadmap/Dashboard know which problems are actually done, without needing a
// backend yet — same "single source of truth" localStorage already gives us.
export function isProblemSolved(id) {
  const saved = loadJSON(`pathforge:problem:${id}`, null);
  return saved?.isSolved || false;
}

export function getProblemProgress(id) {
  return loadJSON(`pathforge:problem:${id}`, null);
}

// getProblemSignals — the exact inputs the weak-point scoring engine needs
// for one problem: how many hints were opened, whether the solution was ever
// peeked, and what confidence rating was given. Returns null fields for a
// problem that was never touched (nothing to score there yet).
export function getProblemSignals(id) {
  const saved = getProblemProgress(id);
  return {
    hintsOpened: saved?.unlockedHints?.length ?? 0,
    solutionPeeked: saved?.solutionEverViewed ?? false,
    confidenceRating: saved?.confidenceRating ?? null,
    isSolved: saved?.isSolved ?? false,
  };
}

// getTopicStats — solved/total count for one topic, used by both the Roadmap
// topic sections and the Dashboard topic progress rows so they never disagree
// with each other (both read from the same data + localStorage).
export function getTopicStats(topicKey) {
  const topicProblems = getProblemsByTopic(topicKey);
  const solved = topicProblems.filter((p) => isProblemSolved(p.id)).length;
  return { solved, total: topicProblems.length, problems: topicProblems };
}