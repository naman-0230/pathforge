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

// getTopicStats — solved/total count for one topic, used by both the Roadmap
// topic sections and the Dashboard topic progress rows so they never disagree
// with each other (both read from the same data + localStorage).
export function getTopicStats(topicKey) {
  const topicProblems = getProblemsByTopic(topicKey);
  const solved = topicProblems.filter((p) => isProblemSolved(p.id)).length;
  return { solved, total: topicProblems.length, problems: topicProblems };
}