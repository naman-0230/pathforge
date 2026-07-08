import { problems, getDifficultyType } from '../data/problems.js';
import { topics } from '../data/topics.js';
import { isProblemSolved, getTopicStats } from './progress.js';
import { getActivityLog } from './activity.js';

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
// score for the radar chart. Deliberately a BLEND of two signals, not just
// raw solve percentage:
//   - breadth: how much of the topic has been attempted (solved/total)
//   - quality: inverted from the weak-point engine's score (low struggle = high quality)
// A topic you've solved 100% of, but always with 3 hints and low confidence,
// should show up weaker on this chart than a topic solved just as much but
// cleanly — that's the whole point of a "strength" radar vs. a plain progress bar.
export function getTopicStrengthData() {
  return topics
    .filter((t) => t.seeded)
    .map((t) => {
      const { solved, total } = getTopicStats(t.key);
      if (total === 0) return { topic: t.label, mastery: 0 };

      const breadth = solved / total; // 0..1
      // Reuse the same per-topic weakness score idea from weakPoints.js,
      // inlined here rather than imported to avoid a circular import
      // (weakPoints.js doesn't currently need analytics.js, but keeping this
      // self-contained is simpler than restructuring that module boundary).
      let strugglePoints = 0;
      let scoredCount = 0;
      for (const p of getTopicProblemsFor(t.key)) {
        const saved = getProgressFor(p.id);
        if (!saved?.isSolved) continue;
        scoredCount += 1;
        const confidence = saved.confidenceRating ?? 3;
        strugglePoints +=
          (saved.unlockedHints?.length ?? 0) * 1 +
          (saved.solutionEverViewed ? 3 : 0) +
          (5 - confidence);
      }
      const avgStruggle = scoredCount > 0 ? strugglePoints / scoredCount : 0;
      // Normalize: assume ~10 struggle points is "quite rough," cap quality at 0
      const quality = Math.max(0, 1 - avgStruggle / 10);

      const mastery = Math.round(breadth * 0.5 * 100 + quality * 0.5 * 100);
      return { topic: t.label, mastery };
    });
}

// Small local helpers so getTopicStrengthData doesn't need extra imports
// beyond what's already pulled in above.
function getTopicProblemsFor(topicKey) {
  return problems.filter((p) => p.topicKey === topicKey);
}
function getProgressFor(id) {
  try {
    const raw = localStorage.getItem(`pathforge:problem:${id}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// getWeeklyActivityTrend — buckets the daily activity log into the last
// `weeks` calendar weeks, summing solves per week. Daily data is too noisy
// for a trend line; weekly smooths it out.
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
      const key = cursor.toISOString().slice(0, 10);
      total += log[key] || 0;
      cursor.setDate(cursor.getDate() + 1);
    }

    const label = `${weekStart.getMonth() + 1}/${weekStart.getDate()}`;
    buckets.push({ week: label, solved: total });
  }

  return buckets;
}

export { getDifficultyType };