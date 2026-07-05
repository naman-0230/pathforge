import { loadJSON, saveJSON } from './storage.js';
import { sm2, confidenceToQuality, DEFAULT_EASE_FACTOR, DEFAULT_INTERVAL_DAYS } from './sm2.js';
import { getDaysRemaining } from './date.js';

// revision.js — this is "Spaced revision (SM-2)" from your feature spec, made real.
//
// Each topic gets its own saved state: { interval, ef, lastReviewed, nextReview }.
// The flow matches your spec exactly: "after finishing each topic, revision
// sessions are scheduled using SM-2, not fixed intervals."
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

function storageKey(topicKey) {
  return `pathforge:revision:${topicKey}`;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
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
    lastReviewed: today,
    nextReview: addDays(today, DEFAULT_INTERVAL_DAYS),
  };
  saveJSON(storageKey(topicKey), initial);
  return initial;
}

export function completeRevisionSession(topicKey, confidenceRating) {
  const current = getRevisionState(topicKey) || {
    interval: DEFAULT_INTERVAL_DAYS,
    ef: DEFAULT_EASE_FACTOR,
  };

  const quality = confidenceToQuality(confidenceRating);
  const { interval, ef } = sm2(current.interval, current.ef, quality);

  const today = todayStr();
  const updated = { interval, ef, lastReviewed: today, nextReview: addDays(today, interval) };
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