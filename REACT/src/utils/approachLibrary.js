import { getProblem, getProblemsByTopic } from '../data/problems.js';
import { getTopic } from '../data/topics.js';
import { topics } from '../data/topics.js';
import { loadJSON } from './storage.js';

// approachLibrary.js — read-only aggregation of every approach the user
// has ever written across every problem. Feeds Analytics' cheatsheet view
// and Revision's "you wrote this before" surface.
//
// SOURCE OF TRUTH:
//   Approaches live inside each problem's progress record's `attempts`
//   array as `approach` field. No separate storage — this file walks the
//   existing per-problem records and pulls them out.
//
// LATEST vs ALL:
//   We surface the MOST RECENT non-empty approach per problem. Historical
//   approaches from earlier attempts are ignored — user's current
//   understanding is what matters.

export function getAllApproaches() {
  const all = [];
  for (const t of topics) {
    if (!t.seeded) continue;
    const problemIds = getProblemsByTopic(t.key).map((p) => p.id);
    for (const id of problemIds) {
      const record = loadJSON(`pathforge:problem:${id}`, null);
      if (!record?.attempts?.length) continue;

      let latest = null;
      for (let i = record.attempts.length - 1; i >= 0; i--) {
        const a = record.attempts[i];
        if (a?.approach && a.approach.trim().length > 0) {
          latest = a;
          break;
        }
      }
      if (!latest) continue;

      const problem = getProblem(id);
      if (!problem) continue;

      all.push({
        problemId: id,
        problemName: problem.name,
        topicKey: problem.topicKey,
        topicLabel: getTopic(problem.topicKey)?.label || problem.topicKey,
        pattern: problem.pattern,
        difficulty: problem.difficulty,
        approach: latest.approach,
        writtenAt: latest.approachWrittenAt || null,
        date: latest.date || null,
        isSolved: record.isSolved,
      });
    }
  }

  all.sort((a, b) => (b.writtenAt || 0) - (a.writtenAt || 0));
  return all;
}

export function getApproachesGroupedByPattern() {
  const all = getAllApproaches();
  const grouped = {};
  for (const a of all) {
    if (!a.pattern) continue;
    if (!grouped[a.pattern]) grouped[a.pattern] = [];
    grouped[a.pattern].push(a);
  }
  return Object.entries(grouped)
    .map(([pattern, approaches]) => ({ pattern, approaches }))
    .sort((a, b) => b.approaches.length - a.approaches.length);
}

export function searchApproaches(query) {
  if (!query || query.trim().length === 0) return getAllApproaches();
  const q = query.toLowerCase().trim();
  return getAllApproaches().filter((a) => {
    return (
      a.approach.toLowerCase().includes(q) ||
      a.problemName.toLowerCase().includes(q) ||
      a.pattern?.toLowerCase().includes(q) ||
      a.topicLabel.toLowerCase().includes(q)
    );
  });
}

export function getApproachForProblem(problemId) {
  const record = loadJSON(`pathforge:problem:${problemId}`, null);
  if (!record?.attempts?.length) return null;

  for (let i = record.attempts.length - 1; i >= 0; i--) {
    const a = record.attempts[i];
    if (a?.approach && a.approach.trim().length > 0) {
      return {
        text: a.approach,
        writtenAt: a.approachWrittenAt || null,
        date: a.date || null,
        confidenceRating: a.confidenceRating,
      };
    }
  }
  return null;
}