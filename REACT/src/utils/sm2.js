// sm2.js — the actual SM-2 spaced-repetition algorithm, exactly as specified:
// given how long since the last review (prevInterval), how "easy" this topic
// has been to retain (prevEF — ease factor), how well the last revision went
// (quality, 0-5), and how many consecutive successful reviews came before
// this one (prevReps), calculate the next interval, ease factor, and rep count.
//
// This is a pure function — no state, no storage. revision.js (next file)
// is what actually calls this and persists the result per topic.
//
// FIX: canonical SM-2 hardcodes the first two successful intervals to 1 day
// then 6 days, and only starts multiplying by EF from the third successful
// review onward. The previous version multiplied by EF immediately after the
// very first review, which produces a noticeably steeper ramp (e.g. jumping
// to ~3 days instead of 1, then further out instead of the standard 6-day
// second step) than the spacing most people are used to from SM-2-based tools.
// Tracking `reps` (consecutive successes) is what makes the correct ramp
// possible — it resets to 0 on any quality < 3, same as a fresh start.

export const DEFAULT_EASE_FACTOR = 2.5;
export const DEFAULT_INTERVAL_DAYS = 1;

// Nothing gets scheduled further out than this, regardless of how high EF
// climbs — a purely practical ceiling so a long streak of "Easy" ratings on
// one topic doesn't schedule its next review 2+ years out.
export const MAX_INTERVAL_DAYS = 180;

export function sm2(prevInterval, prevEF, quality, prevReps = 0) {
  // Ease factor never drops below 1.3 — that's the standard SM-2 floor,
  // otherwise repeatedly-forgotten topics would spiral toward 0 and never
  // get scheduled far apart even after eventually being learned well.
  const newEF = Math.max(1.3, prevEF + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  let newReps;
  let newInterval;

  if (quality < 3) {
    // quality < 3 means "this didn't really stick" — reset the rep streak
    // and go back to reviewing tomorrow instead of stretching the interval.
    newReps = 0;
    newInterval = 1;
  } else {
    newReps = prevReps + 1;
    if (newReps === 1) {
      newInterval = 1; // first successful review: tomorrow
    } else if (newReps === 2) {
      newInterval = 6; // second successful review: canonical SM-2 fixed step
    } else {
      newInterval = Math.round(prevInterval * newEF); // third+: EF-driven growth
    }
  }

  newInterval = Math.min(newInterval, MAX_INTERVAL_DAYS);

  return { interval: newInterval, ef: newEF, reps: newReps };
}

// mapConfidenceToQuality — your confidence self-rating is 1-4 ("Clueless" to
// "Easy"), but SM-2's `quality` is a 0-5 scale. This is the conversion table.
// Only "Got it" (3) and "Easy" (4) count as quality >= 3, meaning only those
// two extend the revision interval — "Clueless" and "Needed hints" both reset
// to reviewing again tomorrow, which matches how spaced repetition is supposed
// to work: if it didn't stick, review it again soon, don't push it further out.
const CONFIDENCE_TO_QUALITY = { 1: 1, 2: 2.5, 3: 4, 4: 5 };

export function confidenceToQuality(confidenceRating) {
  return CONFIDENCE_TO_QUALITY[confidenceRating] ?? 2.5;
}