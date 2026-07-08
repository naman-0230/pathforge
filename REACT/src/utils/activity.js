import { loadJSON, saveJSON } from './storage.js';
import { getPreferences } from './preferences.js';

// activity.js — "Streak + heatmap" from your feature spec, made real.
//
// The core data: a single object in localStorage mapping date → how many
// problems were solved that day, e.g. { "2026-07-03": 2, "2026-07-05": 1 }.
// Everything else (streak count, heatmap cells) is derived from this one log.
//
// FIX: every date-key in this file used to come from toISOString().slice(0,10)
// — that's the UTC calendar date, not local. This is the exact same bug
// class fixed in date.js/revision.js earlier: for anyone west of UTC, "today"
// in UTC can still be "yesterday" locally (or vice versa near midnight),
// silently mis-recording which day a solve counts toward, breaking streaks
// and shifting heatmap cells by a day. All date-key construction below now
// goes through localDateStr()/parseLocalDate(), which never round-trips
// through UTC.

const ACTIVITY_KEY = 'pathforge:activityLog';

function pad2(n) {
  return String(n).padStart(2, '0');
}

// localDateStr — formats a Date object as YYYY-MM-DD using ITS OWN local
// getFullYear/getMonth/getDate — never toISOString(), which converts to UTC
// first and can silently shift the calendar day. Exported so other files
// (analytics.js) reuse this instead of re-implementing their own copy.
export function localDateStr(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

// parseLocalDate — the inverse: turns a YYYY-MM-DD string back into a Date
// via the multi-argument constructor (always local), not `new Date(str)`
// (which parses bare date strings as UTC per spec — the actual root cause
// of the bug this fix closes).
export function parseLocalDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function todayStr() {
  return localDateStr(new Date());
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

// getCurrentStreak — counts consecutive days of activity, walking backward.
//
// Normal (not frozen) behavior, unchanged from before: walk backward from
// today (or yesterday, if today has no activity yet — today isn't "missed"
// until the day is actually over), stopping at the first empty day.
//
// FROZEN behavior (motivation.streakFreeze in preferences — "vacation
// mode"): the walk starts from the LAST DAY ANY ACTIVITY HAPPENED instead of
// from today, and counts backward from there exactly as normal. This "pauses
// the clock" — however many days have passed since your last solve, the
// streak stays exactly what it was at that point, instead of either
// breaking (no freeze) or incorrectly bridging together unrelated activity
// from further back in history (which a naive "just skip empty days
// forever" implementation would do).
export function getCurrentStreak() {
  const log = getActivityLog();
  const prefs = getPreferences();
  const freezeActive = !!prefs?.motivation?.streakFreeze;

  let anchor;
  let anchorIsGuaranteedActive = false;

  if (freezeActive) {
    const activeDates = Object.keys(log).filter((d) => log[d] > 0).sort();
    if (activeDates.length === 0) return 0; // nothing solved yet — nothing to freeze
    anchor = parseLocalDate(activeDates[activeDates.length - 1]);
    anchorIsGuaranteedActive = true; // by construction, this day has log[key] > 0
  } else {
    anchor = new Date();
    anchor.setHours(0, 0, 0, 0);
  }

  let streak = 0;
  const cursor = new Date(anchor);

  // Only relevant on the non-frozen path — the frozen anchor is BY
  // DEFINITION a day with activity, so this "today not done yet" adjustment
  // doesn't apply there.
  if (!anchorIsGuaranteedActive) {
    const anchorKey = localDateStr(cursor);
    if (!log[anchorKey]) {
      cursor.setDate(cursor.getDate() - 1);
    }
  }

  while (true) {
    const key = localDateStr(cursor);
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
    const key = localDateStr(cursor);
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
  const past = parseLocalDate(mostRecent);
  const today = new Date();
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
    const key = localDateStr(cursor);
    total += log[key] || 0;
    cursor.setDate(cursor.getDate() - 1);
  }
  return total;
}