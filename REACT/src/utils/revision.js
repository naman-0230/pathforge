import { loadJSON, saveJSON } from './storage.js';
import { sm2, confidenceToQuality, DEFAULT_EASE_FACTOR, DEFAULT_INTERVAL_DAYS } from './sm2.js';
import { getDaysRemaining } from './date.js';

// revision.js — this is "Spaced revision (SM-2)" from your feature spec, made real.
//
// Each topic gets its own saved state: { interval, ef, reps, lastReviewed,
// nextReview, history }. The flow matches your spec exactly: "after finishing
// each topic, revision sessions are scheduled using SM-2, not fixed intervals."
//
//   1. getRevisionState(topicKey) — reads what's saved, or null if this topic
//      has never had a revision scheduled.
//   2. ensureRevisionScheduled(topicKey) — call this once a topic hits 100%
//      solved. If nothing's scheduled yet, it creates the very first schedule
//      (review again in DEFAULT_INTERVAL_DAYS days). If something's already
//      there, it does nothing — this makes it safe to call on every render.
//   3. completeRevisionSession(topicKey, confidenceRating) — call this when
//      someone actually does a revision session. It runs the real SM-2 math
//      and pushes nextReview further out (or resets it to tomorrow) based on
//      how well the revision went.
//
// FIX: todayStr()/addDays() previously used `toISOString().slice(0, 10)`,
// which is the UTC calendar date — but date.js's getDaysRemaining() (used by
// isRevisionDue/getDaysUntilRevision below) compares against `new Date()` in
// LOCAL time. Anyone not at UTC+0 could see a revision marked due a day early
// or late depending on the time of day, since the two files disagreed on what
// "today" meant. Both helpers below now build/format dates in local time,
// matching date.js's semantics exactly, so there's one consistent notion of
// "today" across the whole revision system.

// How many past sessions to keep per topic — enough for a future "revision
// quality over time" view without the array growing unbounded forever.
const MAX_HISTORY_ENTRIES = 20;

function storageKey(topicKey) {
  return `pathforge:revision:${topicKey}`;
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

// Local-time "today", formatted as YYYY-MM-DD — deliberately NOT using
// toISOString(), which would silently shift to UTC and disagree with date.js.
function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

// addDays — parses a YYYY-MM-DD string as a LOCAL date (not UTC — the plain
// `new Date(dateStr)` constructor treats bare date strings as UTC midnight,
// which is exactly the mismatch this fix is closing), adds `days`, and
// re-formats as YYYY-MM-DD in local time.
function addDays(dateStr, days) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function getRevisionState(topicKey) {
  return loadJSON(storageKey(topicKey), null);
}

export function ensureRevisionScheduled(topicKey) {
  const existing = getRevisionState(topicKey);
  if (existing) return existing;

  const today = todayStr();
  const initial = {
    interval: DEFAULT_INTERVAL_DAYS,
    ef: DEFAULT_EASE_FACTOR,
    reps: 0,
    lastReviewed: today,
    nextReview: addDays(today, DEFAULT_INTERVAL_DAYS),
    history: [],
  };
  saveJSON(storageKey(topicKey), initial);
  return initial;
}

export function completeRevisionSession(topicKey, confidenceRating) {
  const current = getRevisionState(topicKey) || {
    interval: DEFAULT_INTERVAL_DAYS,
    ef: DEFAULT_EASE_FACTOR,
    reps: 0,
    history: [],
  };

  const quality = confidenceToQuality(confidenceRating);
  const { interval, ef, reps } = sm2(current.interval, current.ef, quality, current.reps || 0);

  const today = todayStr();
  const historyEntry = { date: today, confidenceRating, quality, interval, ef };
  const history = [...(current.history || []), historyEntry].slice(-MAX_HISTORY_ENTRIES);

  const updated = {
    interval,
    ef,
    reps,
    lastReviewed: today,
    nextReview: addDays(today, interval),
    history,
  };
  saveJSON(storageKey(topicKey), updated);
  return updated;
}

// isRevisionDue — true if today is on or past the scheduled nextReview date.
export function isRevisionDue(topicKey) {
  const state = getRevisionState(topicKey);
  if (!state) return false;
  return getDaysRemaining(state.nextReview) <= 0;
}

// getDaysUntilRevision — convenience for display: negative/0 means due now,
// positive means "due in N days".
export function getDaysUntilRevision(topicKey) {
  const state = getRevisionState(topicKey);
  if (!state) return null;
  return getDaysRemaining(state.nextReview);
}