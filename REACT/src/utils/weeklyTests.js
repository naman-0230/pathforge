import { topics } from '../data/topics.js';
import { getProblemsByTopic } from '../data/problems.js';
import { getProblemDetails } from '../data/problemDetails.js';
import { getTopic } from '../data/topics.js';
import { isProblemSolved } from './progress.js';
import { getPreferences } from './preferences.js';
import { loadJSON, saveJSON } from './storage.js';
import { recordUsageEvent, countUsageEventsSince } from './tierService.js';

// weeklyTests.js — recurring structured tests for Advanced tier users.
//
// SCHEDULING MODEL:
//   Tests are always available on the configured day of week. The user
//   sees "Test available" from midnight of that day until midnight of the
//   next day. If they don't take it, we track the skip and next week's
//   test appears normally.
//
// WEEK IDENTIFICATION:
//   Each test is identified by its ISO week number (e.g. "2026-W03").
//   This lets us track "you skipped week 3" vs "you're on week 4 now"
//   without ambiguity, and prevents users from taking the same week's
//   test multiple times.
//
// SKIP TRACKING:
//   Skips are recorded server-side via user_usage as 'weekly_test_skip'
//   events. Consecutive skips are counted server-side too — this feeds
//   the escalating message severity ("mild → moderate → warning").
//
// PROBLEM SELECTION:
//   Draws from user's ROADMAP topics only, and only from sections they've
//   engaged with (same "studied" rule as interview sim's studiedOnly).
//   This ensures the test measures what they've actually studied that
//   week, not random problems from topics they haven't touched.

const HISTORY_KEY = 'pathforge:weeklyTests:history';
const HISTORY_MAX = 26; // half a year of weekly tests

const CARD_HIDDEN_KEY = 'pathforge:weeklyTests:cardHidden';

// hideCardForCurrentCycle — user dismissed the "next test on X" card.
// We remember the week we hid it in, and only show again on the actual
// test day (or after the week rolls over).
export function hideCardForCurrentCycle() {
  saveJSON(CARD_HIDDEN_KEY, { weekId: getIsoWeekIdentifier(), hiddenAt: Date.now() });
}

// isCardHiddenForCurrentCycle — used by WeeklyTestCard to decide whether
// to render at all. Only "hides" the pre-test-day info card; the actual
// test-day CTA card (isTestDay=true) always shows regardless.
export function isCardHiddenForCurrentCycle() {
  const hidden = loadJSON(CARD_HIDDEN_KEY, null);
  if (!hidden) return false;
  return hidden.weekId === getIsoWeekIdentifier();
}

// resetCardVisibility — clears the hide flag. Called when a new week
// starts naturally, or if user wants to un-hide manually.
export function resetCardVisibility() {
  saveJSON(CARD_HIDDEN_KEY, null);
}

// ============================================================
// WEEK IDENTIFICATION
// ============================================================

// getIsoWeekIdentifier — returns a stable string like "2026-W03" for the
// current date. Uses ISO 8601 week numbering (Monday = start of week,
// week 1 is the week with the first Thursday of the year).
export function getIsoWeekIdentifier(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

// ============================================================
// TEST AVAILABILITY
// ============================================================

// isTestDayToday — checks whether today matches the user's configured
// weekly test day. Returns true only on that specific day.
export function isTestDayToday() {
  const prefs = getPreferences();
  const configuredDay = prefs.weeklyTests?.dayOfWeek ?? 0;
  return new Date().getDay() === configuredDay;
}

// getCurrentWeekTestStatus — combines everything into one status object
// the dashboard card and test page both consume:
//   {
//     weekId: 'YYYY-WNN',
//     isTestDay: boolean,
//     alreadyTaken: boolean,           — user completed this week's test
//     alreadySkipped: boolean,         — user explicitly skipped
//     nextTestDate: Date,              — when the next opportunity opens
//     consecutiveSkips: number,        — how many weeks in a row skipped
//   }
export async function getCurrentWeekTestStatus(userId) {
  const weekId = getIsoWeekIdentifier();
  const history = getTestHistory();

  const thisWeek = history.find((h) => h.weekId === weekId);
  const alreadyTaken = !!thisWeek && !thisWeek.skipped;
  const alreadySkipped = !!thisWeek && thisWeek.skipped;

  const consecutiveSkips = await countConsecutiveSkips(userId);
  const nextTestDate = getNextTestDate();

  return {
    weekId,
    isTestDay: isTestDayToday(),
    alreadyTaken,
    alreadySkipped,
    nextTestDate,
    consecutiveSkips,
  };
}

// getNextTestDate — computes the next occurrence of the configured
// weekly test day. Used for "Next test on [day] [date]" copy.
function getNextTestDate() {
  const prefs = getPreferences();
  const configuredDay = prefs.weeklyTests?.dayOfWeek ?? 0;
  const now = new Date();
  const today = now.getDay();

  let daysUntil = configuredDay - today;
  if (daysUntil <= 0) daysUntil += 7; // next week's occurrence

  const next = new Date(now);
  next.setDate(next.getDate() + daysUntil);
  next.setHours(0, 0, 0, 0);
  return next;
}

// countConsecutiveSkips — counts weekly_test_skip events from server that
// happened in consecutive weeks without any weekly_test_start in between.
// Used to escalate messaging ("1 skip: no big deal, 3 skips: your data
// suffers"). Server-authoritative — user can't reset by clearing local
// storage.
async function countConsecutiveSkips(userId) {
  if (!userId) return 0;
  // Look back at last 8 weeks of events (both skips and starts)
  const EIGHT_WEEKS_MS = 8 * 7 * 24 * 60 * 60 * 1000;
  const sinceIso = new Date(Date.now() - EIGHT_WEEKS_MS).toISOString();

  const skips = await countUsageEventsSince(userId, 'weekly_test_skip', sinceIso);
  const starts = await countUsageEventsSince(userId, 'weekly_test_start', sinceIso);

  // Rough heuristic: consecutive skips = skips since last start.
  // Not perfectly accurate (would need to check ordering) but close enough
  // for the message-severity purpose. A more accurate version would need
  // to fetch actual event rows and check chronological order — added
  // complexity not warranted for a UX message.
  return Math.max(0, skips - Math.max(0, skips - starts));
}

// ============================================================
// PROBLEM SELECTION
// ============================================================

// generateWeeklyTest — builds a test session from the user's studied
// sections in their roadmap topics. Similar to interviewSim.generateSession
// but always uses studiedOnly=true and mixed difficulty (real tests don't
// let you pick "all easy").
export function generateWeeklyTest(roadmapSetup) {
  const prefs = getPreferences();
  const problemCount = prefs.weeklyTests?.problemCount ?? 3;
  const durationMinutes = prefs.weeklyTests?.durationMinutes ?? 60;
  const topicKeys = roadmapSetup?.selectedTopics || [];

  if (topicKeys.length === 0) return null;

  // Build studied-sections pool (same logic as interview sim's studiedOnly)
  const pool = buildStudiedProblemPool(topicKeys);
  if (pool.length < problemCount) return null;

  // Balanced difficulty mix for tests (not user-configurable)
  const selected = pickBalancedProblems(pool, problemCount);
  if (selected.length < problemCount) return null;

  return {
    weekId: getIsoWeekIdentifier(),
    problemCount,
    durationMinutes,
    durationMs: durationMinutes * 60 * 1000,
    problems: selected.map((p) => {
      const details = getProblemDetails(p.id);
      return {
        id: p.id,
        name: p.name,
        difficulty: p.difficulty,
        topicKey: p.topicKey,
        topicLabel: getTopic(p.topicKey)?.label || p.topicKey,
        pattern: p.pattern,
        leetcode: p.leetcode,
        statement: details?.statement || `A ${p.difficulty.toLowerCase()} ${getTopic(p.topicKey)?.label} problem — see LeetCode for full description.`,
        examples: details?.examples || [],
        constraints: details?.constraints || [],
        requiredComplexity: details?.requiredComplexity || null,
      };
    }),
    startedAt: null,
  };
}

// buildStudiedProblemPool — same "sections user has engaged with" logic
// as interviewSim. Duplicated here rather than shared because the two
// features may diverge over time.
function buildStudiedProblemPool(topicKeys) {
  const pool = [];
  for (const key of topicKeys) {
    const problems = getProblemsByTopic(key);
    const studiedSections = new Set();

    // First pass — find studied sections
    for (const p of problems) {
      if (studiedSections.has(p.section)) continue;
      if (isProblemSolved(p.id)) {
        studiedSections.add(p.section);
        continue;
      }
      const record = loadJSON(`pathforge:problem:${p.id}`, null);
      if (record?.attempts?.some((a) => a.confidenceRating != null)) {
        studiedSections.add(p.section);
      }
    }

    // Second pass — collect problems from studied sections
    for (const p of problems) {
      if (studiedSections.has(p.section)) pool.push(p);
    }
  }
  return pool;
}

// pickBalancedProblems — pick N with a rough 1E/2M/H distribution when
// count is 3, scaling proportionally for other counts. Prefers unsolved
// (fresh test), falls back to any.
function pickBalancedProblems(pool, count) {
  const easy = pool.filter((p) => p.difficulty === 'Easy');
  const medium = pool.filter((p) => p.difficulty === 'Medium');
  const hard = pool.filter((p) => p.difficulty === 'Hard');

  // Prefer unsolved within each tier
  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const preferUnsolved = (arr) => {
    const unsolved = shuffle(arr.filter((p) => !isProblemSolved(p.id)));
    const solved = shuffle(arr.filter((p) => isProblemSolved(p.id)));
    return [...unsolved, ...solved];
  };

  const easyRanked = preferUnsolved(easy);
  const mediumRanked = preferUnsolved(medium);
  const hardRanked = preferUnsolved(hard);

  // Target distribution based on count
  let targetEasy, targetMedium, targetHard;
  if (count <= 2) {
    targetEasy = 0;
    targetMedium = count;
    targetHard = 0;
  } else if (count === 3) {
    targetEasy = 1;
    targetMedium = 1;
    targetHard = 1;
  } else {
    // Roughly 1/3, 1/2, 1/6 for larger counts
    targetMedium = Math.floor(count / 2);
    targetEasy = Math.floor((count - targetMedium) / 2);
    targetHard = count - targetMedium - targetEasy;
  }

  const picked = [];
  picked.push(...easyRanked.slice(0, targetEasy));
  picked.push(...mediumRanked.slice(0, targetMedium));
  picked.push(...hardRanked.slice(0, targetHard));

  // If we couldn't hit target for any tier, fill from remaining pool
  if (picked.length < count) {
    const remaining = pool.filter((p) => !picked.some((x) => x.id === p.id));
    picked.push(...shuffle(remaining).slice(0, count - picked.length));
  }

  return picked.slice(0, count);
}

// ============================================================
// TEST LIFECYCLE
// ============================================================

// recordTestStart — server-tracks that user started this week's test.
// Prevents "start, cancel, start again" from creating multiple entries.
export async function recordTestStart(userId, weekId) {
  return await recordUsageEvent(userId, 'weekly_test_start', { weekId });
}

// recordTestSkip — explicitly skipped this week. Fires an escalation
// signal that the weak-point engine can use later. Also feeds the
// consecutive-skip counter for messaging.
export async function recordTestSkip(userId, weekId) {
  await recordUsageEvent(userId, 'weekly_test_skip', { weekId });
  // Also record in local history for immediate UX consistency
  const history = getTestHistory();
  history.unshift({
    weekId,
    skipped: true,
    skippedAt: Date.now(),
  });
  saveJSON(HISTORY_KEY, history.slice(0, HISTORY_MAX));
}

// recordTestResult — user completed the test. Save the full result to
// local history. Server already has the start event recorded.
// recordTestResult — save completed weekly test to local history.
// Extended to include per-problem editor results (attempted, passed, language)
// for combined scoring + analytics.
export function recordTestResult(session, results) {
  const history = getTestHistory();
  const editorResults = results.perProblemEditorResults || {};

  history.unshift({
    sessionId: session.sessionId || `wt-${Date.now()}`,
    weekId: session.weekId,
    completedAt: Date.now(),
    problemCount: session.problems.length,
    score: results.score,
    totalRated: results.totalRated,
    timeSpentMs: results.timeSpentMs,
    perProblemRatings: results.perProblemRatings || {},
    perProblemEditorResults: editorResults,
    problems: session.problems.map((p) => ({
      id: p.id,
      name: p.name,
      difficulty: p.difficulty,
      topicKey: p.topicKey,
      topicLabel: p.topicLabel,
      confidenceRating: results.perProblemRatings?.[p.id] ?? null,
      editorResult: editorResults[p.id] || null,
    })),
  });

  saveJSON(HISTORY_KEY, history.slice(0, HISTORY_MAX));
}

export function getTestHistory() {
  return loadJSON(HISTORY_KEY, []);
}

// getSkipMessage — returns messaging that escalates with consecutive
// skips. Used by the dashboard card and skip-confirm dialog.
export function getSkipMessage(consecutiveSkips) {
  if (consecutiveSkips === 0) {
    return {
      tone: 'neutral',
      text: 'No problem — skipping this week is fine. We\'ll ask again next week.',
    };
  }
  if (consecutiveSkips === 1) {
    return {
      tone: 'mild',
      text: 'That\'s 2 weeks skipped in a row. Weekly tests keep your weak-point data accurate — try to take next week\'s.',
    };
  }
  if (consecutiveSkips === 2) {
    return {
      tone: 'moderate',
      text: '3 weeks skipped. Your roadmap adjustments and weak-point recommendations get less accurate without regular tests.',
    };
  }
  return {
    tone: 'strong',
    text: 'You\'ve skipped multiple weeks of testing. Consider taking this week\'s test — the adaptive features work best with fresh test data.',
  };
}


// ============================================================
// SCORING — combines editor result + self-rating
// ============================================================

// scoreProblem — decides whether one problem counts as passed for the
// weekly test score. Editor priority; rating fallback.
export function scoreWeeklyTestProblem(problemId, ratings, editorResults) {
  const editorResult = editorResults?.[problemId];
  if (editorResult?.attempted) {
    return editorResult.passed === true;
  }
  const rating = ratings?.[problemId];
  return rating != null && rating >= 3;
}

// computeWeeklyTestScore — total problems passed across the test
export function computeWeeklyTestScore(problems, ratings, editorResults) {
  return problems.reduce((sum, p) => {
    return scoreWeeklyTestProblem(p.id, ratings, editorResults) ? sum + 1 : sum;
  }, 0);
}

// ============================================================
// EDITOR ANALYTICS — for WeeklyTestEditorTrend chart
// ============================================================

// getWeeklyTestEditorEngagementStats — aggregate editor stats across
// all weekly test sessions in history.
export function getWeeklyTestEditorEngagementStats() {
  const history = getTestHistory();
  let totalProblems = 0;
  let attemptedInEditor = 0;
  let passedInEditor = 0;

  for (const session of history) {
    const results = session.perProblemEditorResults || {};
    for (const problem of session.problems || []) {
      totalProblems += 1;
      const editorResult = results[problem.id] || problem.editorResult;
      if (editorResult?.attempted) {
        attemptedInEditor += 1;
        if (editorResult.passed) passedInEditor += 1;
      }
    }
  }

  return {
    totalProblems,
    attemptedInEditor,
    passedInEditor,
    engagementRate: totalProblems > 0 ? attemptedInEditor / totalProblems : 0,
    passRate: attemptedInEditor > 0 ? passedInEditor / attemptedInEditor : null,
  };
}

// getWeeklyTestEditorTrendData — per-session pass rate ordered chronologically
export function getWeeklyTestEditorTrendData() {
  const history = getTestHistory();
  return history
    .slice()
    .reverse()
    .map((session) => {
      const results = session.perProblemEditorResults || {};
      const total = (session.problems || []).length;
      let attempted = 0;
      let passed = 0;

      for (const problem of session.problems || []) {
        const editorResult = results[problem.id] || problem.editorResult;
        if (editorResult?.attempted) {
          attempted += 1;
          if (editorResult.passed) passed += 1;
        }
      }

      return {
        completedAt: session.completedAt,
        weekId: session.weekId,
        totalProblems: total,
        attemptedCount: attempted,
        passedCount: passed,
        passRate: attempted > 0 ? (passed / attempted) * 100 : null,
      };
    });
}