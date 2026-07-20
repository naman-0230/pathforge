import { topics } from '../data/topics.js';
import { getProblemsByTopic } from '../data/problems.js';
import { loadJSON } from './storage.js';

// thinkingTime.js — aggregation of timeToFirstWriteMs across all attempts,
// grouped by topic. Feeds the Analytics ThinkingTimeChart.
//
// SOURCE OF TRUTH:
//   timeToFirstWriteMs is stored per-attempt inside progress records
//   (pathforge:problem:<id>.attempts[i].timeToFirstWriteMs). We walk every
//   seeded problem's storage and collect attempts that have a value set.
//
// NULL HANDLING:
//   Attempts without timeToFirstWriteMs (older data, re-visits of solved
//   problems, or attempts where user rated confidence without typing) are
//   excluded from the aggregation. They don't count as 0 — they count as
//   "no data available" and are silently skipped.
//
// OUTLIER FILTERING:
//   We cap individual attempt times at 30 minutes (1,800,000 ms). Longer
//   than that almost always means the user opened the problem, walked
//   away, and came back later. Including those would distort the average.
//   Values above the cap are treated as "no data" — same as nulls.
//
// TREND METRIC:
//   For each topic, we compute:
//     - avgMs across ALL attempts
//     - avgMsRecent (last 5 attempts)
//     - trend: 'improving' if recent < all-time by >20%, 'declining' if
//       recent > all-time by >20%, 'stable' otherwise
//   This is what surfaces "your Trees thinking time is DROPPING" as a
//   visible pattern, not just a raw number.

const OUTLIER_CAP_MS = 30 * 60 * 1000; // 30 minutes
const RECENT_ATTEMPT_COUNT = 5;
const TREND_THRESHOLD = 0.2; // 20%

// ============================================================
// PUBLIC API
// ============================================================

// getThinkingTimeStats — per-topic breakdown with averages, recent
// averages, and trend classification. Returns array sorted with most-
// attempted topics first (that's where trend data is most reliable).
export function getThinkingTimeStats() {
  const perTopic = [];

  for (const topic of topics) {
    if (!topic.seeded) continue;
    const attempts = collectAttemptsForTopic(topic.key);
    const validTimes = attempts
      .map((a) => a.timeToFirstWriteMs)
      .filter((t) => typeof t === 'number' && t > 0 && t <= OUTLIER_CAP_MS);

    if (validTimes.length === 0) continue; // no data for this topic

    const avgMs = Math.round(validTimes.reduce((s, t) => s + t, 0) / validTimes.length);

    // Recent = last N valid data points (assumes attempts array is
    // chronological, which it is — we push new attempts to the end)
    const recentTimes = validTimes.slice(-RECENT_ATTEMPT_COUNT);
    const avgMsRecent = recentTimes.length >= 2
      ? Math.round(recentTimes.reduce((s, t) => s + t, 0) / recentTimes.length)
      : null;

    let trend = 'stable';
    if (avgMsRecent !== null && validTimes.length >= RECENT_ATTEMPT_COUNT) {
      const ratio = avgMsRecent / avgMs;
      if (ratio < 1 - TREND_THRESHOLD) trend = 'improving';
      else if (ratio > 1 + TREND_THRESHOLD) trend = 'declining';
    }

    perTopic.push({
      topicKey: topic.key,
      topicLabel: topic.label,
      icon: topic.icon,
      sampleCount: validTimes.length,
      avgMs,
      avgMsRecent,
      trend,
    });
  }

  // Sort by sample count descending — more data = more reliable trend
  perTopic.sort((a, b) => b.sampleCount - a.sampleCount);
  return perTopic;
}

// getOverallThinkingTime — single number across every topic, plus a
// simple label. Used for the summary line above the topic breakdown.
export function getOverallThinkingTime() {
  const stats = getThinkingTimeStats();
  if (stats.length === 0) return null;

  let totalMs = 0;
  let totalSamples = 0;
  for (const s of stats) {
    totalMs += s.avgMs * s.sampleCount;
    totalSamples += s.sampleCount;
  }

  return {
    avgMs: totalSamples > 0 ? Math.round(totalMs / totalSamples) : 0,
    totalSamples,
  };
}

// formatDuration — human-readable "3m 20s" or "45s" from milliseconds.
// Used across the chart component for consistent formatting.
export function formatDuration(ms) {
  if (ms == null || ms < 0) return '—';
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  if (remainder === 0) return `${minutes}m`;
  return `${minutes}m ${remainder}s`;
}

// ============================================================
// HELPERS
// ============================================================

function collectAttemptsForTopic(topicKey) {
  const problems = getProblemsByTopic(topicKey);
  const attempts = [];
  for (const p of problems) {
    const record = loadJSON(`pathforge:problem:${p.id}`, null);
    if (!record?.attempts?.length) continue;
    for (const a of record.attempts) {
      attempts.push(a);
    }
  }
  return attempts;
}