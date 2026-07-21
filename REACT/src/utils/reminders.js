import { getActivityLog, localDateStr, getCurrentStreak } from './activity.js';
import { getPreferences, savePreferences } from './preferences.js';
import { loadJSON, saveJSON } from './storage.js';

// reminders.js — scheduling, evaluation, and state management for
// custom reminders. All local — no push server, no background workers.
//
// TWO NOTIFICATION SURFACES:
//   1. Browser notifications (Notification API) — fires even if the tab
//      is backgrounded. Requires user permission. Opt-in via Settings.
//   2. In-app banner — always available whenever the app is open at
//      reminder time. This is the fallback + primary surface for users
//      who declined browser notifications.
//
// STATE STORAGE:
//   pathforge:reminders:state — per-reminder daily state:
//     {
//       "<reminderId>": {
//         lastFiredDate: 'YYYY-MM-DD',      // last day we fired for this
//         dismissedForDate: 'YYYY-MM-DD',   // dismissed for this day
//         snoozedUntil: timestamp,          // snooze deadline
//         completedForDate: 'YYYY-MM-DD',   // marked complete
//       }
//     }
//   Reset happens implicitly — comparing today's date to lastFiredDate.
//   No cleanup needed; entries stay small.
//
// EVALUATION FLOW:
//   getActiveBannerReminders() called from Dashboard on mount/interval.
//   For each reminder that is currently "due" (past its trigger time,
//   not dismissed, not snoozed, not already completed for today),
//   return an entry for the banner UI.
//
// AUTO-COMPLETION:
//   For 'daily' type: if today's activity log entry >= problemCount,
//   auto-mark as completed. User doesn't have to click anything.
//   For 'streak-protect': auto-satisfied if today's activity > 0.
//   For 'weekly': never auto-completes (user has to explicitly dismiss).

const REMINDER_STATE_KEY = 'pathforge:reminders:state';

// ============================================================
// PUBLIC API
// ============================================================

// getActiveBannerReminders — the reminders that should be shown in the
// dashboard banner RIGHT NOW. Filters out dismissed, snoozed, completed,
// and not-yet-due reminders.
export function getActiveBannerReminders() {
  const prefs = getPreferences();
  if (!prefs.reminders.enabled) return [];

  const state = loadJSON(REMINDER_STATE_KEY, {});
  const now = new Date();
  const today = localDateStr(now);
  const activityLog = getActivityLog();
  const todayActivity = activityLog[today] || 0;
  const currentStreak = getCurrentStreak();

  const active = [];
  for (const reminder of prefs.reminders.items) {
    if (!reminder.enabled) continue;

    const s = state[reminder.id] || {};

    // Snoozed?
    if (s.snoozedUntil && s.snoozedUntil > Date.now()) continue;

    // Dismissed today (or for the target date if weekly)?
    const targetDate = getTargetDateForReminder(reminder, now);
    if (!targetDate) continue; // not applicable today
    if (s.dismissedForDate === targetDate) continue;
    if (s.completedForDate === targetDate) continue;

    // Check auto-completion
    if (isReminderAutoComplete(reminder, todayActivity, currentStreak)) {
      // Mark as completed silently, don't show banner
      markReminderCompleted(reminder.id, targetDate);
      continue;
    }

    // Check if it's time yet
    if (!isReminderDue(reminder, now)) continue;

    active.push({
      ...reminder,
      targetDate,
      autoStatus: getAutoStatus(reminder, todayActivity, currentStreak),
    });
  }

  return active;
}

// isReminderDue — for a given reminder and current time, has the trigger
// moment passed today (or on the target day for weekly)?
function isReminderDue(reminder, now) {
  const [hh, mm] = reminder.time.split(':').map(Number);

  if (reminder.type === 'weekly') {
    // Weekly: due only on the specified day of week, after the specified time
    if (now.getDay() !== reminder.dayOfWeek) return false;
    if (now.getHours() < hh) return false;
    if (now.getHours() === hh && now.getMinutes() < mm) return false;
    return true;
  }

  // Daily / streak-protect: due today after specified time
  if (now.getHours() < hh) return false;
  if (now.getHours() === hh && now.getMinutes() < mm) return false;
  return true;
}

// getTargetDateForReminder — the date this reminder is "for". Usually
// today, but weekly reminders may target their specific day of week.
// Returns null if the reminder doesn't apply today (e.g. weekly on
// Wednesday when today is Friday).
function getTargetDateForReminder(reminder, now) {
  if (reminder.type === 'weekly') {
    // Weekly only applies on its day of week
    if (now.getDay() !== reminder.dayOfWeek) return null;
  }
  return localDateStr(now);
}

// isReminderAutoComplete — checks whether the user has already satisfied
// this reminder's purpose without needing to see the banner.
function isReminderAutoComplete(reminder, todayActivity, currentStreak) {
  if (reminder.type === 'daily') {
    return todayActivity >= (reminder.problemCount || 1);
  }
  if (reminder.type === 'streak-protect') {
    // Streak is safe if they've solved anything today, OR they have no
    // streak to protect (streak = 0 means nothing to lose).
    return todayActivity > 0 || currentStreak === 0;
  }
  // Weekly: never auto-completes
  return false;
}

// getAutoStatus — for the banner display, a short status string showing
// progress toward auto-completion. e.g. "1 / 3 solved today" for daily.
function getAutoStatus(reminder, todayActivity, currentStreak) {
  if (reminder.type === 'daily') {
    return `${todayActivity} / ${reminder.problemCount} solved today`;
  }
  if (reminder.type === 'streak-protect') {
    return `${currentStreak}-day streak · nothing solved today`;
  }
  return null;
}

// ============================================================
// STATE MUTATIONS
// ============================================================

export function dismissReminder(id, forDate) {
  const state = loadJSON(REMINDER_STATE_KEY, {});
  if (!state[id]) state[id] = {};
  state[id].dismissedForDate = forDate;
  saveJSON(REMINDER_STATE_KEY, state);
}

export function snoozeReminder(id, minutes = 60) {
  const state = loadJSON(REMINDER_STATE_KEY, {});
  if (!state[id]) state[id] = {};
  state[id].snoozedUntil = Date.now() + minutes * 60 * 1000;
  saveJSON(REMINDER_STATE_KEY, state);
}

export function markReminderCompleted(id, forDate) {
  const state = loadJSON(REMINDER_STATE_KEY, {});
  if (!state[id]) state[id] = {};
  state[id].completedForDate = forDate;
  saveJSON(REMINDER_STATE_KEY, state);
}

export function markReminderFired(id, forDate) {
  const state = loadJSON(REMINDER_STATE_KEY, {});
  if (!state[id]) state[id] = {};
  state[id].lastFiredDate = forDate;
  saveJSON(REMINDER_STATE_KEY, state);
}

// ============================================================
// REMINDER CRUD (used by Settings)
// ============================================================

export function addReminder(reminder) {
  const prefs = getPreferences();
  if (prefs.reminders.items.length >= 5) {
    throw new Error('Maximum of 5 reminders reached');
  }
  const withId = { ...reminder, id: reminder.id || `rem-${Date.now()}-${Math.random().toString(36).slice(2, 8)}` };
  const updated = {
    ...prefs,
    reminders: {
      ...prefs.reminders,
      items: [...prefs.reminders.items, withId],
    },
  };
  savePreferences(updated);
  return withId;
}

export function updateReminder(id, patch) {
  const prefs = getPreferences();
  const items = prefs.reminders.items.map((r) => (r.id === id ? { ...r, ...patch } : r));
  savePreferences({ ...prefs, reminders: { ...prefs.reminders, items } });
}

export function deleteReminder(id) {
  const prefs = getPreferences();
  const items = prefs.reminders.items.filter((r) => r.id !== id);
  savePreferences({ ...prefs, reminders: { ...prefs.reminders, items } });
  // Clean up state entry
  const state = loadJSON(REMINDER_STATE_KEY, {});
  delete state[id];
  saveJSON(REMINDER_STATE_KEY, state);
}

// ============================================================
// BROWSER NOTIFICATIONS
// ============================================================

// requestNotificationPermission — wraps the Notification API request.
// Returns true if granted, false otherwise. Safe to call multiple times;
// the API only prompts once per browser.
export async function requestNotificationPermission() {
  if (typeof Notification === 'undefined') return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  try {
    const result = await Notification.requestPermission();
    return result === 'granted';
  } catch {
    return false;
  }
}

export function hasNotificationPermission() {
  if (typeof Notification === 'undefined') return false;
  return Notification.permission === 'granted';
}

// fireBrowserNotification — best-effort browser notification. No-op if
// permissions not granted or Notification API unavailable.
export function fireBrowserNotification(title, body) {
  if (!hasNotificationPermission()) return;
  try {
    new Notification(title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'pathforge-reminder', // replaces previous unread reminder
    });
  } catch (err) {
    console.warn('Notification failed', err);
  }
}

// ============================================================
// TICK — the periodic check that fires notifications for background tabs
// ============================================================

// runReminderTick — called on interval by useReminderTick(). Checks all
// due reminders, fires browser notifications for ones we haven't fired
// today yet. In-app banners are separate — they're derived from state
// on every render.
export function runReminderTick() {
  const prefs = getPreferences();
  if (!prefs.reminders.enabled) return;
  if (!prefs.reminders.browserNotifications) return;

  const active = getActiveBannerReminders();
  const state = loadJSON(REMINDER_STATE_KEY, {});
  const today = localDateStr(new Date());

  for (const reminder of active) {
    const s = state[reminder.id] || {};
    if (s.lastFiredDate === reminder.targetDate) continue;

    const { title, body } = buildNotificationText(reminder);
    fireBrowserNotification(title, body);
    markReminderFired(reminder.id, reminder.targetDate);
  }
}

function buildNotificationText(reminder) {
  if (reminder.type === 'daily') {
    return {
      title: reminder.label || 'Time to solve',
      body: `${reminder.autoStatus} — target: ${reminder.problemCount} problems`,
    };
  }
  if (reminder.type === 'weekly') {
    return {
      title: reminder.label || 'Weekly review',
      body: 'Take a moment to review this week\'s progress.',
    };
  }
  if (reminder.type === 'streak-protect') {
    return {
      title: '🔥 Streak at risk',
      body: reminder.autoStatus,
    };
  }
  return { title: 'PathForge reminder', body: '' };
}