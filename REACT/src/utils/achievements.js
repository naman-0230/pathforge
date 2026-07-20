import { topics } from '../data/topics.js';
import { getProblemsByTopic, getProblem } from '../data/problems.js';
import { isProblemSolved, getProblemSignals, getProblemAttempts } from './progress.js';
import { getCurrentStreak, getTotalSolvedFromLog, getActivityLog, localDateStr } from './activity.js';
import { getSessionHistory as getPatternHistory } from './patternEngine.js';
import { getDrillHistory } from './drillEngine.js';
import { getAllApproaches } from './approachLibrary.js';
import { loadJSON, saveJSON } from './storage.js';

// achievements.js — pure display feature. All achievements are computed
// live from existing data (activity log, progress records, pattern stats,
// drill history, etc.). Nothing is persisted about "earned" status
// itself — we just re-evaluate on every request.
//
// PERSISTED:
//   pathforge:achievements:seen — set of achievement IDs the user has
//   already been notified about (via toast). Prevents re-firing toasts on
//   every page load for achievements earned long ago.
//
// DESIGN:
//   Each achievement has:
//     - id           string, stable identifier
//     - name         short display name
//     - description  what unlocks it
//     - icon         emoji
//     - category     for grouping in the UI
//     - tier         'bronze' | 'silver' | 'gold' | 'single' — single-tier
//                    ones don't get bronze/silver/gold coloring
//     - evaluate()   function that returns { unlocked, progress?, target? }
//                    progress/target are optional — used for tiered achievements
//                    to show "43/50" style progress bars on locked badges
//
// TIERED ACHIEVEMENTS:
//   For milestones like "solve N problems", we have separate achievement
//   entries for 10 / 50 / 200. Each is independent — user unlocks bronze,
//   then eventually silver, then gold as their count grows. This mirrors
//   how most games handle it (rather than one achievement that upgrades).

const SEEN_ACHIEVEMENTS_KEY = 'pathforge:achievements:seen';

// ============================================================
// ACHIEVEMENT DEFINITIONS
// ============================================================

export const CATEGORIES = {
  streaks: { label: 'Streaks', icon: '🔥', order: 1 },
  solving: { label: 'Solving', icon: '✅', order: 2 },
  learning: { label: 'Learning', icon: '📚', order: 3 },
  exploration: { label: 'Exploration', icon: '🗺️', order: 4 },
  meta: { label: 'Meta', icon: '🎯', order: 5 },
};

export const ACHIEVEMENTS = [
  // ── STREAKS ────────────────────────────────────────────────────────
  {
    id: 'streak-3',
    name: 'Warming Up',
    description: 'Maintain a 3-day streak',
    icon: '🔥',
    category: 'streaks',
    tier: 'bronze',
    evaluate: () => {
      const streak = getCurrentStreak();
      return { unlocked: streak >= 3, progress: streak, target: 3 };
    },
  },
  {
    id: 'streak-7',
    name: 'One Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    category: 'streaks',
    tier: 'silver',
    evaluate: () => {
      const streak = getCurrentStreak();
      return { unlocked: streak >= 7, progress: streak, target: 7 };
    },
  },
  {
    id: 'streak-30',
    name: 'Iron Discipline',
    description: 'Maintain a 30-day streak',
    icon: '🔥',
    category: 'streaks',
    tier: 'gold',
    evaluate: () => {
      const streak = getCurrentStreak();
      return { unlocked: streak >= 30, progress: streak, target: 30 };
    },
  },
  {
    id: 'streak-100',
    name: 'Centurion',
    description: 'Maintain a 100-day streak',
    icon: '👑',
    category: 'streaks',
    tier: 'gold',
    evaluate: () => {
      const streak = getCurrentStreak();
      return { unlocked: streak >= 100, progress: streak, target: 100 };
    },
  },

  // ── SOLVING ────────────────────────────────────────────────────────
  {
    id: 'first-blood',
    name: 'First Blood',
    description: 'Solve your first problem',
    icon: '⚔️',
    category: 'solving',
    tier: 'single',
    evaluate: () => {
      const total = getTotalSolvedFromLog();
      return { unlocked: total >= 1 };
    },
  },
  {
    id: 'solve-10',
    name: 'Getting Started',
    description: 'Solve 10 problems',
    icon: '✅',
    category: 'solving',
    tier: 'bronze',
    evaluate: () => {
      const total = getTotalSolvedFromLog();
      return { unlocked: total >= 10, progress: total, target: 10 };
    },
  },
  {
    id: 'solve-50',
    name: 'Grinder',
    description: 'Solve 50 problems',
    icon: '⚙️',
    category: 'solving',
    tier: 'silver',
    evaluate: () => {
      const total = getTotalSolvedFromLog();
      return { unlocked: total >= 50, progress: total, target: 50 };
    },
  },
  {
    id: 'solve-200',
    name: 'Machine',
    description: 'Solve 200 problems',
    icon: '🤖',
    category: 'solving',
    tier: 'gold',
    evaluate: () => {
      const total = getTotalSolvedFromLog();
      return { unlocked: total >= 200, progress: total, target: 200 };
    },
  },
  {
    id: 'daily-5',
    name: 'Full Court Press',
    description: 'Solve 5 problems in a single day',
    icon: '⚡',
    category: 'solving',
    tier: 'silver',
    evaluate: () => {
      const log = getActivityLog();
      const max = Math.max(0, ...Object.values(log));
      return { unlocked: max >= 5, progress: max, target: 5 };
    },
  },
  {
    id: 'boss-vanquisher',
    name: 'Boss Vanquisher',
    description: 'Defeat your first boss-fight problem',
    icon: '🐉',
    category: 'solving',
    tier: 'single',
    evaluate: () => {
      // Scan all problems for bossFight flag and check if any is solved
      for (const topic of topics) {
        if (!topic.seeded) continue;
        const problems = getProblemsByTopic(topic.key);
        for (const p of problems) {
          if (p.bossFight && isProblemSolved(p.id)) {
            return { unlocked: true };
          }
        }
      }
      return { unlocked: false };
    },
  },
  {
    id: 'boss-slayer',
    name: 'Boss Slayer',
    description: 'Defeat 5 boss-fight problems',
    icon: '⚔️',
    category: 'solving',
    tier: 'gold',
    evaluate: () => {
      let count = 0;
      for (const topic of topics) {
        if (!topic.seeded) continue;
        const problems = getProblemsByTopic(topic.key);
        for (const p of problems) {
          if (p.bossFight && isProblemSolved(p.id)) count++;
        }
      }
      return { unlocked: count >= 5, progress: count, target: 5 };
    },
  },

  // ── LEARNING ───────────────────────────────────────────────────────
  {
    id: 'section-slayer',
    name: 'Section Slayer',
    description: 'Complete your first section',
    icon: '📖',
    category: 'learning',
    tier: 'single',
    evaluate: () => {
      for (const topic of topics) {
        if (!topic.seeded) continue;
        for (const sectionName of topic.sections) {
          const problems = getProblemsByTopic(topic.key).filter((p) => p.section === sectionName);
          if (problems.length === 0) continue;
          if (problems.every((p) => isProblemSolved(p.id))) return { unlocked: true };
        }
      }
      return { unlocked: false };
    },
  },
  {
    id: 'topic-complete-1',
    name: 'Topic Mastered',
    description: 'Complete every problem in a topic',
    icon: '🏆',
    category: 'learning',
    tier: 'silver',
    evaluate: () => {
      for (const topic of topics) {
        if (!topic.seeded) continue;
        const problems = getProblemsByTopic(topic.key);
        if (problems.length === 0) continue;
        if (problems.every((p) => isProblemSolved(p.id))) return { unlocked: true };
      }
      return { unlocked: false };
    },
  },
  {
    id: 'topic-complete-3',
    name: 'Triple Threat',
    description: 'Complete 3 topics fully',
    icon: '🥇',
    category: 'learning',
    tier: 'gold',
    evaluate: () => {
      let count = 0;
      for (const topic of topics) {
        if (!topic.seeded) continue;
        const problems = getProblemsByTopic(topic.key);
        if (problems.length === 0) continue;
        if (problems.every((p) => isProblemSolved(p.id))) count++;
      }
      return { unlocked: count >= 3, progress: count, target: 3 };
    },
  },
  {
    id: 'perfect-week',
    name: 'Perfect Week',
    description: 'Solve at least 1 problem every day for 7 consecutive days',
    icon: '🌟',
    category: 'learning',
    tier: 'silver',
    evaluate: () => {
      // Same as streak-7, but only if it's a rolling window (currently active)
      const streak = getCurrentStreak();
      return { unlocked: streak >= 7 };
    },
  },
  {
    id: 'confident-solver',
    name: 'Confident Solver',
    description: 'Rate 20 solves as confidence 4 (Easy)',
    icon: '🚀',
    category: 'learning',
    tier: 'silver',
    evaluate: () => {
      let count = 0;
      for (const topic of topics) {
        if (!topic.seeded) continue;
        const problems = getProblemsByTopic(topic.key);
        for (const p of problems) {
          const sig = getProblemSignals(p.id);
          if (sig.confidenceRating === 4) count++;
        }
      }
      return { unlocked: count >= 20, progress: count, target: 20 };
    },
  },

  // ── EXPLORATION ────────────────────────────────────────────────────
  {
    id: 'polyglot',
    name: 'Polyglot',
    description: 'Solve at least one problem in 5 different topics',
    icon: '🌐',
    category: 'exploration',
    tier: 'silver',
    evaluate: () => {
      let count = 0;
      for (const topic of topics) {
        if (!topic.seeded) continue;
        const problems = getProblemsByTopic(topic.key);
        if (problems.some((p) => isProblemSolved(p.id))) count++;
      }
      return { unlocked: count >= 5, progress: count, target: 5 };
    },
  },
  {
    id: 'pattern-hunter',
    name: 'Pattern Hunter',
    description: 'Complete 10 pattern training rounds',
    icon: '🧩',
    category: 'exploration',
    tier: 'bronze',
    evaluate: () => {
      const history = getPatternHistory();
      return { unlocked: history.length >= 10, progress: history.length, target: 10 };
    },
  },
  {
    id: 'pattern-master',
    name: 'Pattern Master',
    description: 'Score 100% on a pattern training round',
    icon: '💯',
    category: 'exploration',
    tier: 'gold',
    evaluate: () => {
      const history = getPatternHistory();
      const perfect = history.some((s) => s.score === s.totalQuestions);
      return { unlocked: perfect };
    },
  },
  {
    id: 'drill-sergeant',
    name: 'Drill Sergeant',
    description: 'Complete 5 pattern drills',
    icon: '🎯',
    category: 'exploration',
    tier: 'bronze',
    evaluate: () => {
      const drills = getDrillHistory();
      return { unlocked: drills.length >= 5, progress: drills.length, target: 5 };
    },
  },

  // ── META ───────────────────────────────────────────────────────────
  {
    id: 'approach-author',
    name: 'Approach Author',
    description: 'Write 25 approach sketches',
    icon: '💭',
    category: 'meta',
    tier: 'silver',
    evaluate: () => {
      const count = getAllApproaches().length;
      return { unlocked: count >= 25, progress: count, target: 25 };
    },
  },
  {
    id: 'note-taker',
    name: 'Note Taker',
    description: 'Write notes on 10 problems',
    icon: '📝',
    category: 'meta',
    tier: 'bronze',
    evaluate: () => {
      let count = 0;
      for (const topic of topics) {
        if (!topic.seeded) continue;
        const problems = getProblemsByTopic(topic.key);
        for (const p of problems) {
          const record = loadJSON(`pathforge:problem:${p.id}`, null);
          if (record?.notes && record.notes.trim().length > 0) count++;
        }
      }
      return { unlocked: count >= 10, progress: count, target: 10 };
    },
  },
  {
    id: 'revision-veteran',
    name: 'Revision Veteran',
    description: 'Complete 10 revision sessions',
    icon: '🔁',
    category: 'meta',
    tier: 'silver',
    evaluate: () => {
      // Load revision history — try both storage keys used across the app
      const legacyHistory = loadJSON('pathforge:revision:history', []);
      const count = Array.isArray(legacyHistory) ? legacyHistory.length : 0;
      return { unlocked: count >= 10, progress: count, target: 10 };
    },
  },
  {
    id: 'self-aware',
    name: 'Self-Aware',
    description: 'Log a reason for opening the solution 10 times',
    icon: '🧠',
    category: 'meta',
    tier: 'bronze',
    evaluate: () => {
      let count = 0;
      for (const topic of topics) {
        if (!topic.seeded) continue;
        const problems = getProblemsByTopic(topic.key);
        for (const p of problems) {
          const attempts = getProblemAttempts(p.id);
          for (const a of attempts) {
            if (a.peekReason) count++;
          }
        }
      }
      return { unlocked: count >= 10, progress: count, target: 10 };
    },
  },
];

// ============================================================
// PUBLIC API
// ============================================================

// evaluateAll — returns every achievement with its current unlock state
// and progress. Called by AchievementsPage for the full shelf, and by
// AchievementShelf on the dashboard for recent unlocks.
export function evaluateAll() {
  return ACHIEVEMENTS.map((a) => {
    const result = a.evaluate();
    return {
      ...a,
      unlocked: result.unlocked,
      progress: result.progress,
      target: result.target,
    };
  });
}

// getUnlockedAchievements — just the unlocked ones, sorted by category order.
export function getUnlockedAchievements() {
  return evaluateAll().filter((a) => a.unlocked);
}

// getGroupedAchievements — organized by category for the full shelf.
export function getGroupedAchievements() {
  const all = evaluateAll();
  const grouped = {};
  for (const cat of Object.keys(CATEGORIES)) {
    grouped[cat] = { ...CATEGORIES[cat], key: cat, items: [] };
  }
  for (const a of all) {
    if (grouped[a.category]) grouped[a.category].items.push(a);
  }
  return Object.values(grouped).sort((a, b) => a.order - b.order);
}

// getNewlyUnlockedAchievements — achievements the user has unlocked but
// hasn't been shown a toast for yet. Called by Dashboard on mount; each
// returned achievement gets its own toast, then marked as seen.
export function getNewlyUnlockedAchievements() {
  const seen = new Set(loadJSON(SEEN_ACHIEVEMENTS_KEY, []));
  return evaluateAll().filter((a) => a.unlocked && !seen.has(a.id));
}

// markAchievementsAsSeen — called after toasts fire, so we don't re-toast
// on every page load.
export function markAchievementsAsSeen(ids) {
  const seen = new Set(loadJSON(SEEN_ACHIEVEMENTS_KEY, []));
  for (const id of ids) seen.add(id);
  saveJSON(SEEN_ACHIEVEMENTS_KEY, Array.from(seen));
}

// getRecentUnlocked — the last N unlocked achievements, most recent first.
// "Recent" here is defined by definition order in the ACHIEVEMENTS array —
// since we don't persist unlock timestamps, we approximate. Good enough for
// the dashboard "recently unlocked" mini-shelf. Users who want the full
// history can visit /achievements.
export function getRecentUnlocked(limit = 3) {
  const unlocked = getUnlockedAchievements();
  // Prefer higher-tier and category order — surface the "best" recent stuff
  const tierRank = { gold: 3, silver: 2, bronze: 1, single: 0 };
  unlocked.sort((a, b) => {
    if (tierRank[b.tier] !== tierRank[a.tier]) return tierRank[b.tier] - tierRank[a.tier];
    return CATEGORIES[a.category].order - CATEGORIES[b.category].order;
  });
  return unlocked.slice(0, limit);
}

// getStats — overall progress for the achievement page header
export function getAchievementStats() {
  const all = evaluateAll();
  const unlocked = all.filter((a) => a.unlocked).length;
  return {
    unlocked,
    total: all.length,
    percent: Math.round((unlocked / all.length) * 100),
  };
}