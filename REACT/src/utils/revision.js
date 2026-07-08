import { loadJSON, saveJSON } from './storage.js';
import { sm2, confidenceToQuality, DEFAULT_EASE_FACTOR, DEFAULT_INTERVAL_DAYS } from './sm2.js';
import { getDaysRemaining } from './date.js';
import { getProblemsByTopic } from '../data/problems.js';
import { topics } from '../data/topics.js';
import { getProblemSignals, getProblemProgress, isProblemSolved } from './progress.js';
import { isTopicWeak } from './weakPoints.js';

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
//   4. getProblemsForRevision(topicKey, count) — picks which problems a
//      revision session should actually re-attempt (see below).
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

// --- Section-level revision tuning knobs -------------------------------------
// These are intentionally module-level constants (not read from preferences
// yet) so they're trivially easy to lift into Settings later — you just
// swap the constant read for a preferences read, no other logic changes.
// Defaults picked to match what we discussed: first section revision after
// ~4 days, stuck-section trigger at 5 days idle with a 7-day first review,
// and manually-flagged problems get pulled forward to a 2-day first review.
const SECTION_COMPLETE_INITIAL_INTERVAL = 4;
const STUCK_SECTION_DAYS_THRESHOLD = 5;
const STUCK_SECTION_INITIAL_INTERVAL = 7;
const MANUAL_FLAG_INITIAL_INTERVAL = 2;

// How many problems to surface per section revision session. Weak topics get
// the wider slice (more likely to have actually faded), non-weak sections get
// the tighter slice — but always at least 1 and never more than the cap, so
// tiny sections don't get "0 problems" and huge sections don't dump 15 at once.
const WEAK_TOPIC_SECTION_PICK_FRACTION = 0.5;
const NORMAL_TOPIC_SECTION_PICK_FRACTION = 0.25;
const MIN_SECTION_PICK = 1;
const MAX_SECTION_PICK = 5;

function storageKey(topicKey) {
  return `pathforge:revision:${topicKey}`;
}

// Section-scoped storage keys — separate namespace from topic-level state so
// the two systems can coexist without stepping on each other's records.
function sectionStorageKey(topicKey, sectionName) {
  return `pathforge:revision:section:${topicKey}::${slugifySection(sectionName)}`;
}

// section-activity tracker (Option B stuck-detection): stores the last-seen
// solved-count for an in-progress section along with when we saw it. If the
// count doesn't move for STUCK_SECTION_DAYS_THRESHOLD days, the section is
// considered "stuck" and eligible for a revision nudge.
function sectionActivityKey(topicKey, sectionName) {
  return `pathforge:revision:section-activity:${topicKey}::${slugifySection(sectionName)}`;
}

// slugifySection — sections are just display strings in topics.js ("Two
// Pointers", "Binary Search on Answer"), so we normalize them into stable,
// filesystem-safe storage-key fragments. Lowercase + hyphens + strip anything
// that isn't alphanumeric or hyphen. Deterministic — same input always
// produces the same slug, so stored state stays reachable across sessions.
function slugifySection(sectionName) {
  return String(sectionName)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
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

// getProblemsForRevision — picks `count` problems from a topic to re-attempt
// during a revision session. Prioritizes problems that were solved with LOW
// confidence originally (the ones most likely to have actually faded), not
// just a random sample — that's the whole point of spaced revision being
// targeted rather than "redo everything."
export function getProblemsForRevision(topicKey, count = 3) {
  const topicProblems = getProblemsByTopic(topicKey);
  const solvedWithSignals = topicProblems
    .map((p) => ({ ...p, signals: getProblemSignals(p.id) }))
    .filter((p) => p.signals.isSolved);

  // Sort ascending by confidence (1 = shakiest, most worth revisiting first).
  // Ties broken randomly so the same 3 problems don't get picked every time.
  const shuffled = [...solvedWithSignals].sort(() => Math.random() - 0.5);
  shuffled.sort((a, b) => (a.signals.confidenceRating ?? 3) - (b.signals.confidenceRating ?? 3));

  return shuffled.slice(0, count);
}

// =============================================================================
// SECTION-LEVEL REVISION SYSTEM
// =============================================================================
// Everything above this line is the original topic-level revision system,
// unchanged. The section-level system below is a parallel track: same SM-2
// engine, same storage backend, same date helpers — but keyed per-section
// instead of per-topic, and with three different triggers:
//
//   - section-complete: every problem in the section is solved -> seed a
//                       first revision SECTION_COMPLETE_INITIAL_INTERVAL days
//                       out. SM-2 takes over from there.
//   - stuck-section:    section is partially done AND no new problem in it
//                       has been solved for STUCK_SECTION_DAYS_THRESHOLD
//                       days -> seed a first revision STUCK_SECTION_INITIAL_
//                       INTERVAL days out. SM-2 takes over from there.
//   - manual-flag:      user flagged a problem in this section with
//                       flaggedForRevision -> seed a first revision
//                       MANUAL_FLAG_INITIAL_INTERVAL days out. SM-2 takes
//                       over from there. Manual flag is the strongest signal,
//                       so it wins over the other two on the initial interval
//                       if multiple sources fire for the same section.
//
// Which PROBLEMS get pulled into a section revision is deliberately curated,
// not "everything solved in this section":
//   1. every manually-flagged problem in the section (always included)
//   2. plus struggle-ranked solved problems, using the same signals the
//      weak-points engine uses (hints + peek + low confidence + long time),
//      with a bigger slice if isTopicWeak(topicKey) is true.
// Unattempted problems are never included — revision is for consolidating
// what you've seen, not for surfacing brand-new problems.

// ---- section membership + progress -----------------------------------------

// getSectionProblems — every problem in a topic that belongs to the given
// section name. Sections are just strings in topics.js and match by exact
// string equality on the problem's `section` field — no case folding, no
// trimming, so a typo in either place will silently produce an empty set
// (deliberate: safer to surface "no revision here" than to guess).
function getSectionProblems(topicKey, sectionName) {
  return getProblemsByTopic(topicKey).filter((p) => p.section === sectionName);
}

function getSectionStats(topicKey, sectionName) {
  const problems = getSectionProblems(topicKey, sectionName);
  const solved = problems.filter((p) => isProblemSolved(p.id)).length;
  return { solved, total: problems.length, problems };
}

// ---- section SM-2 state (mirrors the topic-level API) -----------------------

export function getSectionRevisionState(topicKey, sectionName) {
  return loadJSON(sectionStorageKey(topicKey, sectionName), null);
}

// ensureSectionRevisionScheduled — creates the initial SM-2 state for a
// section revision if none exists yet. `source` picks the initial interval
// (see the SECTION_COMPLETE_INITIAL_INTERVAL / STUCK_SECTION_INITIAL_INTERVAL
// / MANUAL_FLAG_INITIAL_INTERVAL constants at the top). Idempotent — safe to
// call from render paths and orchestrator sweeps; if state already exists it
// just returns it untouched, so SM-2's own scheduling isn't clobbered.
export function ensureSectionRevisionScheduled(topicKey, sectionName, source = 'section-complete') {
  const existing = getSectionRevisionState(topicKey, sectionName);
  if (existing) return existing;

  let initialInterval;
  switch (source) {
    case 'manual-flag':
      initialInterval = MANUAL_FLAG_INITIAL_INTERVAL;
      break;
    case 'stuck-section':
      initialInterval = STUCK_SECTION_INITIAL_INTERVAL;
      break;
    case 'section-complete':
    default:
      initialInterval = SECTION_COMPLETE_INITIAL_INTERVAL;
      break;
  }

  const today = todayStr();
  const initial = {
    interval: initialInterval,
    ef: DEFAULT_EASE_FACTOR,
    reps: 0,
    lastReviewed: today,
    nextReview: addDays(today, initialInterval),
    history: [],
    source, // remembered so UI/analytics can show WHY this revision exists
  };
  saveJSON(sectionStorageKey(topicKey, sectionName), initial);
  return initial;
}

export function completeSectionRevisionSession(topicKey, sectionName, confidenceRating) {
  const current = getSectionRevisionState(topicKey, sectionName) || {
    interval: DEFAULT_INTERVAL_DAYS,
    ef: DEFAULT_EASE_FACTOR,
    reps: 0,
    history: [],
    source: 'section-complete',
  };

  const quality = confidenceToQuality(confidenceRating);
  const { interval, ef, reps } = sm2(current.interval, current.ef, quality, current.reps || 0);

  const today = todayStr();
  const historyEntry = { date: today, confidenceRating, quality, interval, ef };
  const history = [...(current.history || []), historyEntry].slice(-MAX_HISTORY_ENTRIES);

  const updated = {
    ...current,
    interval,
    ef,
    reps,
    lastReviewed: today,
    nextReview: addDays(today, interval),
    history,
  };
  saveJSON(sectionStorageKey(topicKey, sectionName), updated);
  return updated;
}

export function isSectionRevisionDue(topicKey, sectionName) {
  const state = getSectionRevisionState(topicKey, sectionName);
  if (!state) return false;
  return getDaysRemaining(state.nextReview) <= 0;
}

export function getDaysUntilSectionRevision(topicKey, sectionName) {
  const state = getSectionRevisionState(topicKey, sectionName);
  if (!state) return null;
  return getDaysRemaining(state.nextReview);
}

// ---- section problem picking ------------------------------------------------

// Per-problem local "struggle score" — same shape as the weak-points formula
// (hints + peek + inverse confidence + time-over-baseline), but computed
// LOCALLY for ranking within a section. This is NOT the same as flagging a
// problem "weak" globally — weakPoints.js keeps that concept topic-level, as
// discussed. This just answers "of the problems I've already solved in this
// section, which ones did I struggle most with?" so the revision picker can
// prefer those over problems that went smoothly.
function localStruggleScore(signals, difficulty) {
  if (!signals || signals.confidenceRating == null) return 0;
  const timeBaseline = { Easy: 600, Medium: 1200, Hard: 2400 }[difficulty] ?? 1200;
  const timeComponent =
    signals.timeSpentSeconds == null
      ? 0
      : Math.min(2, Math.max(0, signals.timeSpentSeconds / timeBaseline - 1));
  return (
    signals.hintsOpened * 1 +
    (signals.solutionPeeked ? 3 : 0) +
    (5 - signals.confidenceRating) +
    timeComponent
  );
}

function isProblemFlaggedForRevision(problemId) {
  const record = getProblemProgress(problemId);
  return record?.flaggedForRevision === true;
}

// getProblemsForSectionRevision — the curated pick for a section's revision
// session. Order of inclusion:
//   1. every manually-flagged problem in the section (always in, no matter
//      what — user's explicit signal overrides everything else)
//   2. then attempted-but-not-flagged problems from the same section, ranked
//      by local struggle score descending, until we hit the target count.
// Target count scales with isTopicWeak — a weak topic gets a bigger slice
// (more likely to have actually faded), a normal topic gets the tighter
// slice. Bounded by MIN_SECTION_PICK/MAX_SECTION_PICK so tiny sections still
// return at least one problem and huge sections don't dump 15 at once.
export function getProblemsForSectionRevision(topicKey, sectionName) {
  const sectionProblems = getSectionProblems(topicKey, sectionName);
  if (sectionProblems.length === 0) return [];

  const withSignals = sectionProblems.map((p) => ({
    ...p,
    signals: getProblemSignals(p.id),
    flagged: isProblemFlaggedForRevision(p.id),
  }));

  const flagged = withSignals.filter((p) => p.flagged);

  // "Attempted" for picking purposes = solved. We don't pull in half-done
  // problems for revision — revision is consolidation, not backlog cleanup.
  const attempted = withSignals.filter((p) => !p.flagged && p.signals.isSolved);

  const fraction = isTopicWeak(topicKey)
    ? WEAK_TOPIC_SECTION_PICK_FRACTION
    : NORMAL_TOPIC_SECTION_PICK_FRACTION;
  const targetCount = Math.max(
    MIN_SECTION_PICK,
    Math.min(MAX_SECTION_PICK, Math.ceil(sectionProblems.length * fraction))
  );

  // Rank the non-flagged attempted problems by struggle, hardest first.
  // Tie-break with a shuffle so identical scores don't always resolve in the
  // same order (keeps sessions from feeling repetitive across weeks).
  const ranked = [...attempted]
    .sort(() => Math.random() - 0.5)
    .sort((a, b) => localStruggleScore(b.signals, b.difficulty) - localStruggleScore(a.signals, a.difficulty));

  // Flagged problems always come first and always count against targetCount —
  // if there are already `targetCount` flagged problems, no struggle picks
  // are added (the user's explicit signal has fully filled the session).
  const remainingSlots = Math.max(0, targetCount - flagged.length);
  return [...flagged, ...ranked.slice(0, remainingSlots)];
}

// ---- stuck-section detection (Option B, self-contained) ---------------------
// No timestamp field exists on progress records, so we can't ask "when was
// the last problem in this section solved?" directly. Instead, every time
// checkAndScheduleSectionRevisions runs, we snapshot each in-progress
// section's current solved-count with today's date. On the next sweep, if
// the count hasn't moved AND enough days have passed since that snapshot,
// the section is stuck. First-ever sweep just plants the snapshot and can't
// possibly report "stuck" — the clock starts from feature-ship day. This is
// the tradeoff we accepted: zero cross-file changes, but no retroactive
// stuck-detection for sections already idle before the feature landed.

function getSectionActivity(topicKey, sectionName) {
  return loadJSON(sectionActivityKey(topicKey, sectionName), null);
}

function updateSectionActivity(topicKey, sectionName, solvedCount) {
  const existing = getSectionActivity(topicKey, sectionName);
  const today = todayStr();
  // Only rewrite the snapshot when the solved-count actually changes —
  // otherwise `lastChangedOn` would move to today on every sweep and nothing
  // would ever look "stuck." Preserving the old lastChangedOn is what makes
  // the days-idle math meaningful.
  if (existing && existing.solvedCount === solvedCount) {
    return existing;
  }
  const next = { solvedCount, lastChangedOn: today };
  saveJSON(sectionActivityKey(topicKey, sectionName), next);
  return next;
}

function daysSince(dateStr) {
  // getDaysRemaining(past) returns a negative number; we want positive
  // "days ago", so we negate and floor at 0.
  return Math.max(0, -getDaysRemaining(dateStr));
}

// ---- orchestrator: the one function to call from anywhere -------------------

// checkAndScheduleSectionRevisions — sweep every section of a topic and
// schedule revisions for any that qualify. Safe to call on every render / on
// app load / after solving a problem — ensureSectionRevisionScheduled is
// idempotent, so re-runs never clobber existing SM-2 state.
//
// Rules per section:
//   - fully solved (solved === total, total > 0) -> schedule as 'section-complete'
//   - partially solved AND idle >= STUCK_SECTION_DAYS_THRESHOLD days
//     -> schedule as 'stuck-section' (only if not already scheduled)
//   - any problem in the section has flaggedForRevision=true
//     -> schedule as 'manual-flag' (only if not already scheduled)
//
// Manual-flag wins the initial-interval race if multiple sources qualify for
// the same section on the SAME sweep, by being processed last with the
// shortest interval — but since ensureSectionRevisionScheduled is idempotent,
// whichever source fires FIRST in the section's lifetime is the one that
// sticks. In practice this means: if you flag a problem BEFORE the section
// completes, manual-flag wins; if you flag AFTER section-complete already
// scheduled a revision, the existing SM-2 schedule just keeps running (the
// flagged problem still gets picked into the next session by
// getProblemsForSectionRevision — so nothing is lost, it just doesn't reset
// the schedule).
export function checkAndScheduleSectionRevisions(topicKey) {
  const topic = topics.find((t) => t.key === topicKey);
  if (!topic || !Array.isArray(topic.sections)) return;

  for (const sectionName of topic.sections) {
    const { solved, total } = getSectionStats(topicKey, sectionName);
    if (total === 0) continue; // section defined in topics.js but no problems seeded yet

    // Refresh the activity snapshot every sweep so stuck-detection has fresh
    // data to compare against on the NEXT sweep.
    const activity = updateSectionActivity(topicKey, sectionName, solved);

    // Trigger 1: section fully complete.
    if (solved === total) {
      ensureSectionRevisionScheduled(topicKey, sectionName, 'section-complete');
      continue; // no need to also check stuck/flag — schedule is in place
    }

    // Trigger 2: manual flag on any problem in this section.
    const sectionProblems = getSectionProblems(topicKey, sectionName);
    const hasFlagged = sectionProblems.some((p) => isProblemFlaggedForRevision(p.id));
    if (hasFlagged) {
      ensureSectionRevisionScheduled(topicKey, sectionName, 'manual-flag');
      continue;
    }

    // Trigger 3: stuck (partially done, no progress for N days). Only meaningful
    // if the user has actually started the section — solved > 0 — otherwise
    // "stuck" would fire for every section they simply haven't started yet.
    if (solved > 0 && daysSince(activity.lastChangedOn) >= STUCK_SECTION_DAYS_THRESHOLD) {
      ensureSectionRevisionScheduled(topicKey, sectionName, 'stuck-section');
    }
  }
}

// checkAndScheduleAllRevisions — convenience sweep across every seeded topic,
// for callers (Dashboard/RevisionPage on mount) that don't want to loop
// themselves. Only touches seeded topics — unseeded ones have no problems to
// evaluate against.
export function checkAndScheduleAllRevisions() {
  for (const topic of topics) {
    if (topic.seeded) checkAndScheduleSectionRevisions(topic.key);
  }
}

// ---- unified "what's due right now?" view ----------------------------------

// Priority order for getAllDueRevisions, applied when both are due on the
// same day. Higher-priority sources sort first so the UI can show the most
// important revisions at the top of the list.
const SOURCE_PRIORITY = {
  'manual-flag': 5,
  'topic': 4, // legacy topic-level revision (kept for parallel-system compat)
  'section-complete': 3,
  'stuck-section': 2,
};

// getAllDueRevisions — the unified feed the Dashboard/RevisionPage will
// consume. Returns BOTH topic-level (legacy) and section-level (new) due
// revisions in one list, so UI code doesn't need to know about the split.
// Each entry carries enough info to render a row and route to the right
// session flow:
//   { kind: 'topic' | 'section',
//     topicKey, topicLabel,
//     sectionName?,                       // only for kind === 'section'
//     source: 'topic' | 'section-complete' | 'stuck-section' | 'manual-flag',
//     nextReview, daysOverdue,            // daysOverdue >= 0; 0 = due today
//     state }                             // raw SM-2 state for advanced UIs
//
// Sort: highest source priority first, then most-overdue first (biggest
// daysOverdue at the top within the same priority band). This means a
// manually-flagged section revision that just came due today outranks a
// topic-level revision that's been overdue for a week — matches the "manual
// flag is the strongest signal" rule the whole system is built around.
//
// This function does NOT trigger checkAndScheduleAllRevisions itself —
// callers should invoke that first (typically on page mount) so the due list
// reflects the latest state. Kept separate so read-only consumers (analytics,
// badges) can query without side effects.
export function getAllDueRevisions() {
  const due = [];

  for (const topic of topics) {
    if (!topic.seeded) continue;

    // Topic-level (legacy) — still surfaced so nothing that already works stops working.
    if (isRevisionDue(topic.key)) {
      const state = getRevisionState(topic.key);
      due.push({
        kind: 'topic',
        topicKey: topic.key,
        topicLabel: topic.label,
        source: 'topic',
        nextReview: state.nextReview,
        daysOverdue: Math.max(0, -getDaysRemaining(state.nextReview)),
        state,
      });
    }

    // Section-level (new).
    if (!Array.isArray(topic.sections)) continue;
    for (const sectionName of topic.sections) {
      if (!isSectionRevisionDue(topic.key, sectionName)) continue;
      const state = getSectionRevisionState(topic.key, sectionName);
      due.push({
        kind: 'section',
        topicKey: topic.key,
        topicLabel: topic.label,
        sectionName,
        source: state.source || 'section-complete',
        nextReview: state.nextReview,
        daysOverdue: Math.max(0, -getDaysRemaining(state.nextReview)),
        state,
      });
    }
  }

  due.sort((a, b) => {
    const pa = SOURCE_PRIORITY[a.source] ?? 0;
    const pb = SOURCE_PRIORITY[b.source] ?? 0;
    if (pa !== pb) return pb - pa;
    return b.daysOverdue - a.daysOverdue;
  });

  return due;
}