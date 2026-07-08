import { problems, getDifficultyType } from '../data/problems.js';
import { topics } from '../data/topics.js';
import { isProblemSolved, getTopicStats } from './progress.js';
import { getActivityLog, localDateStr } from './activity.js';
import { getTopicWeaknessScore } from './weakPoints.js';

// analytics.js — data shaping for the Analytics page. Nothing here computes
// anything new — it's all built on top of progress.js / activity.js /
// weakPoints.js, just reshaped into the exact arrays each chart needs.

// getDifficultyBreakdown — counts solved problems by difficulty across the
// whole bank. Used for the Easy/Medium/Hard bar chart.
export function getDifficultyBreakdown() {
  const counts = { Easy: 0, Medium: 0, Hard: 0 };
  for (const p of problems) {
    if (isProblemSolved(p.id)) counts[p.difficulty] = (counts[p.difficulty] || 0) + 1;
  }
  return [
    { difficulty: 'Easy', count: counts.Easy, fill: '#4ADE80' },
    { difficulty: 'Medium', count: counts.Medium, fill: '#FBB040' },
    { difficulty: 'Hard', count: counts.Hard, fill: '#F87171' },
  ];
}

// getTopicStrengthData — one entry per seeded topic with a 0-100 "mastery"
// score for the radar chart. A BLEND of two signals, not just raw solve
// percentage:
//   - breadth: how much of the topic has actually been SOLVED (solved/total)
//   - quality: inverted from the weak-point engine's struggle score
//     (low struggle = high quality) — reflects how cleanly the concluded
//     attempts went, whether they ended in a solve or a give-up-and-peek.
// A topic you've solved 100% of, but always with 3 hints and low confidence,
// shows up weaker here than a topic solved just as much but cleanly — that's
// the whole point of a "strength" radar vs. a plain progress bar.
//
// FIX: this used to reimplement the struggle-score loop inline instead of
// reusing weakPoints.js's getTopicWeaknessScore() — the comment justifying
// that (avoiding "a circular import") wasn't actually accurate, since
// weakPoints.js doesn't import this file, so analytics.js -> weakPoints.js is
// a perfectly safe one-way import. Being a hand-duplicated copy meant this
// silently drifted out of sync with the real fixes already made to
// weakPoints.js (attempted-including-peeked criteria, the time component) —
// and, separately, had its own bug: when a topic had ZERO solved problems,
// the inline loop's scoredCount was 0, so avgStruggle defaulted to 0 ("no
// struggle at all" = a PERFECT score) instead of "no data" — inflating every
// untouched topic to mastery=50 regardless of real progress. That's exactly
// the flat, similar-looking blob across untouched topics you were seeing.
// Untouched topics (solved === 0) now short-circuit to mastery: 0, full stop.
export function getTopicStrengthData() {
  return topics
    .filter((t) => t.seeded)
    .map((t) => {
      const { solved, total } = getTopicStats(t.key);
      if (total === 0 || solved === 0) {
        return { topic: t.label, mastery: 0 };
      }

      const breadth = solved / total; // 0..1

      const { score, attemptedCount } = getTopicWeaknessScore(t.key);
      // Normalize: assume ~10 struggle points is "quite rough," cap quality
      // at 0. If somehow solved > 0 but attemptedCount === 0 (solved without
      // ever rating confidence — allowed, since Mark Solved isn't gated on a
      // rating), there's genuinely no quality signal either way; default to
      // a neutral 0.5 rather than falsely rewarding (1.0, the old bug) or
      // falsely punishing (0) an unrated clean solve.
      const quality = attemptedCount > 0 ? Math.max(0, 1 - score / 10) : 0.5;

      const mastery = Math.round(breadth * 0.5 * 100 + quality * 0.5 * 100);
      return { topic: t.label, mastery };
    });
}

// getWeeklyActivityTrend — buckets the daily activity log into the last
// `weeks` calendar weeks, summing solves per week. Daily data is too noisy
// for a trend line; weekly smooths it out.
//
// FIX: date-key construction now goes through activity.js's localDateStr()
// instead of toISOString().slice(0,10) — the same UTC/local timezone bug
// fixed in date.js/revision.js/activity.js earlier (bare date strings from
// toISOString() are UTC, which can silently disagree with local "today" for
// anyone west of UTC). Reusing activity.js's exported helper here instead of
// a third hand-rolled copy of the same logic.
export function getWeeklyActivityTrend(weeks = 8) {
  const log = getActivityLog();
  const buckets = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let w = weeks - 1; w >= 0; w--) {
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() - w * 7);
    const weekStart = new Date(weekEnd);
    weekStart.setDate(weekStart.getDate() - 6);

    let total = 0;
    const cursor = new Date(weekStart);
    while (cursor <= weekEnd) {
      const key = localDateStr(cursor);
      total += log[key] || 0;
      cursor.setDate(cursor.getDate() + 1);
    }

    const label = `${weekStart.getMonth() + 1}/${weekStart.getDate()}`;
    buckets.push({ week: label, solved: total });
  }

  return buckets;
}

export { getDifficultyType };