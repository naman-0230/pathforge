// date.js

// FIX: new Date("2026-07-10") — a bare date-only string — is parsed as UTC
// MIDNIGHT per the JS spec, always, regardless of the caller's timezone.
// The old getDaysSince/getDaysRemaining then called .setHours(0,0,0,0) on
// that result, which reinterprets the already-UTC instant in LOCAL time.
// For anyone west of UTC (e.g. the Americas), UTC midnight of "2026-07-10"
// is still July 9th evening locally, so setHours silently snapped it back
// to July 9th — a real, silent off-by-one-day bug for about half the
// world's timezones. Parsing manually via the multi-argument Date
// constructor (new Date(year, monthIndex, day)) sidesteps this entirely,
// since that constructor is ALWAYS local time — no UTC round-trip to
// accidentally shift across.
function parseLocalDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

// getDaysSince — how many whole days have passed since a given date.
// Used for streak-aware copy: "it's been 3 days since you last solved something."
export function getDaysSince(dateStr) {
  if (!dateStr) return null;

  const past = parseLocalDate(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((today - past) / msPerDay);
}


// getDaysRemaining — calculates whole days between now and a deadline date string
// (the same format the <input type="date"> in onboarding produces, e.g. "2026-09-01").
// Returns null if there's no deadline yet, so callers can fall back to placeholder text.

export function getDaysRemaining(deadlineStr) {
  if (!deadlineStr) return null;

  const deadline = parseLocalDate(deadlineStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const msPerDay = 1000 * 60 * 60 * 24;
  const diff = Math.round((deadline - today) / msPerDay);

  return diff; // can be negative if the deadline has already passed — caller decides how to show that
}