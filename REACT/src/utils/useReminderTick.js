import { useEffect } from 'react';
import { runReminderTick } from './reminders.js';

// useReminderTick — mounts a background interval that periodically checks
// due reminders and fires browser notifications. Called once from
// AppContext or App-level component so it runs whenever the app is open.
//
// FREQUENCY:
//   Every 60 seconds. More frequent is wasteful (reminders are minute-
//   precision at best); less frequent risks missing the trigger window
//   if the user closes the tab right after the minute they set.
//
// STARTUP:
//   Fires once immediately on mount, in case the app was opened AT the
//   exact minute of a reminder — otherwise the first tick wouldn't fire
//   until 60 seconds later.

const TICK_INTERVAL_MS = 60 * 1000;

export function useReminderTick() {
  useEffect(() => {
    // Immediate check on mount
    runReminderTick();

    // Periodic checks
    const intervalId = setInterval(runReminderTick, TICK_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, []);
}