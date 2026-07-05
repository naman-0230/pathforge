// sm2.js — the actual SM-2 spaced-repetition algorithm, exactly as specified:
// given how long since the last review (prevInterval), how "easy" this topic
// has been to retain (prevEF — ease factor), and how well the last revision
// went (quality, 0-5), calculate the next interval and ease factor.
//
// This is a pure function — no state, no storage. revision.js (next file)
// is what actually calls this and persists the result per topic.

export const DEFAULT_EASE_FACTOR = 2.5;
export const DEFAULT_INTERVAL_DAYS = 1;

export function sm2(prevInterval, prevEF, quality) {
  // Ease factor never drops below 1.3 — that's the standard SM-2 floor,
  // otherwise repeatedly-forgotten topics would spiral toward 0 and never
  // get scheduled far apart even after eventually being learned well.
  const newEF = Math.max(1.3, prevEF + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  // quality < 3 means "this didn't really stick" — reset to reviewing
  // tomorrow instead of stretching the interval further.
  const newInterval = quality < 3 ? 1 : Math.round(prevInterval * newEF);

  return { interval: newInterval, ef: newEF };
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