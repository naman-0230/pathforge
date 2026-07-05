// getDashboardSubtitle — picks the header subtitle based on how long it's been
// since the person last solved something.
//
// Tone matters here on purpose: this is meant to nudge, not guilt-trip. No
// "you're falling behind" or "you broke your streak" language — just a gentle,
// factual invitation back in. Falls back to the normal "X problems scheduled"
// copy when the person is actively on track (0-1 days since last activity, or
// unknown/first-time).
export function getDashboardSubtitle({ daysSinceLastActivity, problemsToday, daysRemainingLabel }) {
  if (daysSinceLastActivity === null || daysSinceLastActivity <= 1) {
    return `${problemsToday} problems scheduled today · ${daysRemainingLabel}`;
  }

  if (daysSinceLastActivity === 2) {
    return `It's been a couple days — pick up right where you left off?`;
  }

  if (daysSinceLastActivity <= 5) {
    return `${daysSinceLastActivity} days since your last problem — even one today keeps things moving.`;
  }

  return `Welcome back — your roadmap is right where you left it. Ready for one problem today?`;
}