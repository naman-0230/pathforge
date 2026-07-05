// getTimeGreeting — returns "Good morning" / "Good afternoon" / "Good evening" / "Good night"
// based on the person's local device time. Pure function, no state needed —
// this is exactly the kind of plain-JS logic your roadmap engine (SM-2, weak point
// scoring) will also live in later, in this same utils folder.
export function getTimeGreeting(date = new Date()) {
  const hour = date.getHours();

  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  if (hour >= 17 && hour < 21) return 'Good evening';
  return 'Good night'; // 9pm–5am — still shows for late-night grinders
}