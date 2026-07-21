import { useState, useEffect } from 'react';
import { getActiveBannerReminders, dismissReminder, snoozeReminder, markReminderCompleted } from '../utils/reminders.js';
import { triggerSync } from '../utils/sync.js';
import { useApp } from '../context/AppContext.jsx';

// ReminderBanner — renders any currently-active reminders as a stack of
// dismissible banners on top of the Dashboard. Each banner shows:
//   - The reminder message
//   - Progress status if applicable (e.g. "1/3 solved today")
//   - Actions: Snooze, Dismiss, and for daily reminders, "Mark done"
//
// FREQUENCY:
//   Re-evaluates active reminders every 60 seconds while mounted, so a
//   reminder that becomes due mid-session appears without a page refresh.

const TYPE_ICONS = {
  daily: '📝',
  weekly: '🔄',
  'streak-protect': '🔥',
};
// REFRESH_INTERVAL_MS — how often the banner re-evaluates whether any
// reminders have become active. 15 seconds is a good balance: fast
// enough that reminders appear within seconds of their trigger time
// (not sitting stale for a full minute), slow enough that we're not
// thrashing localStorage reads on every render cycle.
//
// Reminders have minute-precision timestamps, so 15s means users see
// the banner within at most 15 seconds of the reminder's trigger
// minute. Feels responsive without being wasteful.
const REFRESH_INTERVAL_MS = 15 * 1000;

// VISIBILITY_REFRESH — additional trigger: when the tab becomes visible
// (user switches back to it after being away), immediately re-check.
// This is what makes reminders "just work" when you come back to the
// tab after leaving it open in the background for a while — otherwise
// you'd wait up to REFRESH_INTERVAL_MS before seeing overdue reminders.
export default function ReminderBanner() {
  const [active, setActive] = useState(() => getActiveBannerReminders());
  const { user } = useApp();

  useEffect(() => {
    const refresh = () => setActive(getActiveBannerReminders());
    const intervalId = setInterval(refresh, REFRESH_INTERVAL_MS);

    // Also refresh whenever the tab becomes visible again
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  function handleDismiss(reminder) {
    dismissReminder(reminder.id, reminder.targetDate);
    setActive(getActiveBannerReminders());
    if (user?.id) triggerSync(user.id);
  }

  function handleSnooze(reminder) {
    snoozeReminder(reminder.id, 60);
    setActive(getActiveBannerReminders());
    if (user?.id) triggerSync(user.id);
  }

  function handleMarkDone(reminder) {
    markReminderCompleted(reminder.id, reminder.targetDate);
    setActive(getActiveBannerReminders());
    if (user?.id) triggerSync(user.id);
  }

  if (active.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
      {active.map((r) => (
        <div
          key={r.id}
          className="reminder-banner"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 14px',
            background: r.type === 'streak-protect'
              ? 'rgba(227, 91, 91, 0.08)'
              : 'rgba(232, 115, 45, 0.06)',
            border: `1px solid ${r.type === 'streak-protect' ? 'var(--red, #e35b5b)' : 'var(--accent-mid, #e8732d)'}`,
            borderRadius: 10,
            animation: 'fadeSlideUp 300ms cubic-bezier(0.4,0,0.2,1) both',
          }}
        >
          <span style={{ fontSize: 22, flexShrink: 0 }}>
            {TYPE_ICONS[r.type] || '🔔'}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-high)', marginBottom: 2 }}>
              {r.label || defaultLabel(r)}
            </div>
            {r.autoStatus && (
              <div style={{ fontSize: 11, color: 'var(--text-mid)' }}>
                {r.autoStatus}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            {r.type === 'daily' && (
              <button
                className="btn btn-sm"
                onClick={() => handleMarkDone(r)}
                title="Mark this reminder as done for today"
              >
                Done
              </button>
            )}
            <button
              className="btn btn-sm"
              onClick={() => handleSnooze(r)}
              title="Snooze for 1 hour"
            >
              Snooze
            </button>
            <button
              className="btn btn-sm"
              onClick={() => handleDismiss(r)}
              title="Dismiss for today"
              style={{ background: 'none', border: 'none', padding: '4px 8px', color: 'var(--text-low)' }}
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function defaultLabel(reminder) {
  if (reminder.type === 'daily') return `Time to solve ${reminder.problemCount} problem${reminder.problemCount === 1 ? '' : 's'}`;
  if (reminder.type === 'weekly') return 'Weekly review time';
  if (reminder.type === 'streak-protect') return 'Your streak is at risk!';
  return 'Reminder';
}