// getDaysRemaining — calculates whole days between now and a deadline date string
// (the same format the <input type="date"> in onboarding produces, e.g. "2026-09-01").
// Returns null if there's no deadline yet, so callers can fall back to placeholder text.
export function getDaysRemaining(deadlineStr) {
  if (!deadlineStr) return null;

  const deadline = new Date(deadlineStr);
  const today = new Date();

  deadline.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const msPerDay = 1000 * 60 * 60 * 24;
  const diff = Math.round((deadline - today) / msPerDay);

  return diff; // can be negative if the deadline has already passed — caller decides how to show that
}