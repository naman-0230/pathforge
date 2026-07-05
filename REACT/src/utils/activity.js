import { loadJSON, saveJSON } from './storage.js';

// activity.js — "Streak + heatmap" from your feature spec, made real.
//
// The core data: a single object in localStorage mapping date → how many
// problems were solved that day, e.g. { "2026-07-03": 2, "2026-07-05": 1 }.
// Everything else (streak count, heatmap cells) is derived from this one log.

const ACTIVITY_KEY = 'pathforge:activityLog';

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function getActivityLog() {
  return loadJSON(ACTIVITY_KEY, {});
}

// recordSolve — call this once, the first time a problem gets marked solved
// (not on every render). Increments today's count by 1.
export function recordSolve(dateStr = todayStr()) {
  const log = getActivityLog();
  log[dateStr] = (log[dateStr] || 0) + 1;
  saveJSON(ACTIVITY_KEY, log);
  return log;
}

// getCurrentStreak — counts consecutive days of activity, walking backward
// from today. If today has no activity yet, the streak isn't broken until a
// full day is missed — so solving nothing *yet* today doesn't zero out a
// streak that's still "active" from yesterday.
export function getCurrentStreak() {
  const log = getActivityLog();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let cursor = new Date(today);

  // If today has no activity, start counting from yesterday instead —
  // today isn't "missed" yet, it's just not done yet.
  const todayKey = cursor.toISOString().slice(0, 10);
  if (!log[todayKey]) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (log[key] && log[key] > 0) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

// countToLevel — maps a day's solve count to one of the 5 heatmap shades
// (h0-h4) already defined in global.css. Thresholds are deliberately low —
// most days will realistically be 0-4 problems, not dozens.
function countToLevel(count) {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count <= 4) return 3;
  return 4;
}

// getHeatmapCells — returns the last `numDays` days (oldest first) as
// { date, count, level } — level is what actually picks the CSS class (h0-h4).
export function getHeatmapCells(numDays = 119) {
  const log = getActivityLog();
  const cells = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  cursor.setDate(cursor.getDate() - (numDays - 1));

  for (let i = 0; i < numDays; i++) {
    const key = cursor.toISOString().slice(0, 10);
    const count = log[key] || 0;
    cells.push({ date: key, count, level: countToLevel(count) });
    cursor.setDate(cursor.getDate() + 1);
  }

  return cells;
}

// getDaysSinceLastActivity — finds the most recent date with any solves and
// returns how many days ago that was. Returns null if nothing's been solved
// yet (brand new account) — the dashboard subtitle treats that the same as
// "on track," not as a gap to nudge about.
export function getDaysSinceLastActivity() {
  const log = getActivityLog();
  const dates = Object.keys(log).filter((d) => log[d] > 0).sort();
  if (dates.length === 0) return null;

  const mostRecent = dates[dates.length - 1];
  const past = new Date(mostRecent);
  const today = new Date();
  past.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return Math.round((today - past) / (1000 * 60 * 60 * 24));
}

export function getTotalSolvedFromLog() {
  const log = getActivityLog();
  return Object.values(log).reduce((sum, n) => sum + n, 0);
}

// getSolvedInLastNDays — used for the "↑ X this week" style delta text, so
// that number is real instead of a hardcoded placeholder.
export function getSolvedInLastNDays(n = 7) {
  const log = getActivityLog();
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  let total = 0;
  for (let i = 0; i < n; i++) {
    const key = cursor.toISOString().slice(0, 10);
    total += log[key] || 0;
    cursor.setDate(cursor.getDate() - 1);
  }
  return total;
}