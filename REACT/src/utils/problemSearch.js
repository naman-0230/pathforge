import { topics } from '../data/topics.js';
import { getProblemsByTopic } from '../data/problems.js';
import { getTopic } from '../data/topics.js';
import { isProblemSolved } from './progress.js';

// problemSearch.js — global search across every seeded problem in the
// data set. Used by RoadmapSearch (and potentially other search surfaces
// later — e.g. quick-open in Settings, or a global palette).
//
// MATCHING:
//   Case-insensitive substring across:
//     - problem name (weight 3 — most common search intent)
//     - LeetCode number (weight 3 — direct-lookup match)
//     - pattern (weight 2 — "sliding window" finds every sliding-window problem)
//     - topic label (weight 2 — "arrays" finds every array problem)
//     - section name (weight 1 — helpful for narrow drill-downs)
//   Score is summed across all matching fields; higher = better match.
//
// RANKING BOOST (roadmap membership):
//   Problems currently in the user's active roadmap get a +10 boost.
//   This is a hard tier separator — a roadmap problem with a weak match
//   still ranks above a perfect non-roadmap match, because the primary
//   use case is finding something you're working on.
//
// RESULT LIMIT:
//   Default 10. Search dropdown UI shows 10 max; anything more is noise.
//
// PERFORMANCE:
//   O(N) over all seeded problems (~500). At this scale, no need for
//   indexing or caching. Debounce on the UI side is what keeps it fast
//   under rapid typing.

const ROADMAP_BOOST = 10;
const FIELD_WEIGHTS = {
  name: 3,
  leetcode: 3,
  pattern: 2,
  topic: 2,
  section: 1,
};

// searchProblems — main entry point. Returns ranked, enriched results.
//   query           - user's search string (empty returns [])
//   roadmapIds      - Set of problem IDs currently in the active roadmap,
//                     used for the ranking boost. Pass null/empty Set to
//                     skip the boost entirely (e.g. non-roadmap contexts).
//   limit           - max results to return
export function searchProblems(query, roadmapIds = new Set(), limit = 10) {
  const q = (query || '').trim().toLowerCase();
  if (q.length === 0) return [];

  const results = [];
  for (const topic of topics) {
    if (!topic.seeded) continue;
    const topicLabel = topic.label.toLowerCase();
    const problems = getProblemsByTopic(topic.key);

    for (const p of problems) {
      const score = scoreMatch(p, topic, topicLabel, q);
      if (score === 0) continue;

      const isInRoadmap = roadmapIds.has(p.id);
      const finalScore = score + (isInRoadmap ? ROADMAP_BOOST : 0);

      results.push({
        id: p.id,
        name: p.name,
        difficulty: p.difficulty,
        leetcode: p.leetcode,
        pattern: p.pattern,
        section: p.section,
        topicKey: p.topicKey,
        topicLabel: topic.label,
        topicIcon: topic.icon,
        isInRoadmap,
        isSolved: isProblemSolved(p.id),
        score: finalScore,
      });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}

// scoreMatch — computes weighted match score for one problem against the
// query. Returns 0 if no field matches. Deliberately simple substring
// matching — no fuzzy, no stemming. Works well enough for problem names
// and DSA vocabulary; anything smarter would be over-engineering.
function scoreMatch(problem, topic, topicLabelLower, q) {
  let score = 0;

  const nameLower = problem.name.toLowerCase();
  if (nameLower.includes(q)) {
    score += FIELD_WEIGHTS.name;
    // Bonus for prefix match — "two sum" typed → "Two Sum" ranks above
    // "Two Sum II - Sorted Array". Prefix match is a strong intent signal.
    if (nameLower.startsWith(q)) score += 2;
  }

  // LeetCode number can be searched directly by typing digits
  if (problem.leetcode != null && String(problem.leetcode).includes(q)) {
    score += FIELD_WEIGHTS.leetcode;
  }

  if (problem.pattern && problem.pattern.toLowerCase().includes(q)) {
    score += FIELD_WEIGHTS.pattern;
  }

  if (topicLabelLower.includes(q)) {
    score += FIELD_WEIGHTS.topic;
  }

  if (problem.section && problem.section.toLowerCase().includes(q)) {
    score += FIELD_WEIGHTS.section;
  }

  return score;
}