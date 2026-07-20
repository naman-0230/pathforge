import { topics } from '../data/topics.js';
import { getProblemsByTopic } from '../data/problems.js';
import { loadJSON } from './storage.js';
import { REASONS } from '../components/FailureReasonPrompt.jsx';

// failureArchive.js — read-only aggregation of every peekReason logged
// across every attempt. Feeds the Analytics chart that tells users
// "here's why you actually give up, categorically."
//
// SOURCE OF TRUTH:
//   peekReason is stored per-attempt inside progress records
//   (pathforge:problem:<id>.attempts[i].peekReason). We walk every seeded
//   problem's storage key and pull out attempts that have a reason set.
//
// SKIPPED PROMPTS:
//   Users who skip the prompt have `solutionEverViewed: true` but no
//   `peekReason` on that attempt. These are counted in "total peeks" but
//   NOT in the categorical breakdown — we only classify what we actually
//   have data for.
//
// ACTIONABLE INSIGHT:
//   The primary output is not just "here's a pie chart" — it's a
//   RECOMMENDATION derived from the dominant category. If pattern misses
//   dominate → suggest pattern training. If implementation dominates →
//   suggest re-solving without hints. This is what turns raw data into
//   a useful nudge.

// ============================================================
// PUBLIC API
// ============================================================

// getPeekReasonStats — walks all seeded problems and returns aggregate
// stats: total peeks, breakdown by reason, dominant category.
export function getPeekReasonStats() {
  const breakdown = {};
  for (const r of REASONS) {
    breakdown[r.key] = 0;
  }
  let totalWithReason = 0;
  let totalPeeks = 0;

  for (const t of topics) {
    if (!t.seeded) continue;
    const problems = getProblemsByTopic(t.key);
    for (const p of problems) {
      const record = loadJSON(`pathforge:problem:${p.id}`, null);
      if (!record?.attempts?.length) continue;
      for (const attempt of record.attempts) {
        if (attempt.solutionPeeked) totalPeeks += 1;
        if (attempt.peekReason && breakdown.hasOwnProperty(attempt.peekReason)) {
          breakdown[attempt.peekReason] += 1;
          totalWithReason += 1;
        }
      }
    }
  }

  // Compute percentages relative to categorized peeks (not total peeks)
  // so the chart adds to 100% even when some peeks were skipped.
  const withPercentages = REASONS.map((r) => ({
    ...r,
    count: breakdown[r.key],
    percent: totalWithReason > 0 ? Math.round((breakdown[r.key] / totalWithReason) * 100) : 0,
  }));

  // Sort dominant-first for chart display
  const sorted = [...withPercentages].sort((a, b) => b.count - a.count);
  const dominant = sorted[0]?.count > 0 ? sorted[0] : null;

  return {
    breakdown: sorted,
    totalPeeks,
    totalWithReason,
    dominant,
    insight: buildInsight(dominant, totalWithReason),
  };
}

// buildInsight — turns the dominant reason into a specific action
// recommendation. This is the "so what?" of the whole feature.
function buildInsight(dominant, totalWithReason) {
  if (!dominant || totalWithReason < 3) return null;

  const insights = {
    pattern: {
      title: 'Most of your peeks are pattern-recognition failures',
      action: 'Pattern Training would help you most right now.',
      link: '/pattern-training',
      linkLabel: 'Go to Pattern Training',
    },
    implementation: {
      title: 'You usually know the pattern but struggle to implement it',
      action: 'Focus on re-solving without hints, or use drills on your struggling patterns.',
      link: '/dashboard',
      linkLabel: 'See dashboard for drills',
    },
    'edge-case': {
      title: 'Edge cases trip you up most often',
      action: 'Slow down on Hard problems and read every constraint before starting.',
      link: null,
      linkLabel: null,
    },
    time: {
      title: 'Running out of time is your main blocker',
      action: 'Try shorter focused sessions on Easy/Medium problems first, then scale up.',
      link: null,
      linkLabel: null,
    },
    compare: {
      title: "You mostly peek to compare approaches — that's healthy curiosity",
      action: 'Keep it up. Nothing to change.',
      link: null,
      linkLabel: null,
    },
  };

  return insights[dominant.key] || null;
}