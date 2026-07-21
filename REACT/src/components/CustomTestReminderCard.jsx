import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { canAccess } from '../utils/tierGate.js';
import { getTemplates } from '../utils/customTests.js';
import { loadJSON, saveJSON } from '../utils/storage.js';

// CustomTestReminderCard — monthly-cadence dashboard nudge for Advanced
// users to build/re-run a custom test. Never shown to Free/Basic (they
// see nothing about custom tests on Dashboard; the /custom-tests page
// landing tease is enough).
//
// FIRING RULES:
//   - Only Advanced tier
//   - Only if user has 0 templates OR hasn't run any template in 30+ days
//   - Only once per 30 days (dismissal cooldown)
//   - Dismissible

const REMINDER_DISMISS_KEY = 'pathforge:customTests:reminderDismissed';
const REMINDER_COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const INACTIVITY_THRESHOLD_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export default function CustomTestReminderCard() {
  const { user, tierLoaded } = useApp();
  const [dismissedAt, setDismissedAt] = useState(() => loadJSON(REMINDER_DISMISS_KEY, null));
  const [collapsing, setCollapsing] = useState(false);
  const [unmounted, setUnmounted] = useState(false);

  if (!tierLoaded) return null;
  if (unmounted) return null;

  const userTier = user?.tier || 'free';
  if (!canAccess('customTests', userTier)) return null;

  // Respect dismissal cooldown
  if (typeof dismissedAt === 'number' && (Date.now() - dismissedAt) < REMINDER_COOLDOWN_MS) {
    return null;
  }

  const templates = getTemplates();
  const hasTemplates = templates.length > 0;

  // Check inactivity — if templates exist but none run in 30 days, show reminder
  let showReminder = false;
  let message = null;

  if (!hasTemplates) {
    showReminder = true;
    message = 'You haven\'t created any custom tests yet. Build a personalized practice set.';
  } else {
    // Check if any template was run recently
    const history = loadJSON('pathforge:customTests:history', []);
    const mostRecentRun = history[0]?.completedAt;
    if (!mostRecentRun || (Date.now() - mostRecentRun) > INACTIVITY_THRESHOLD_MS) {
      showReminder = true;
      message = `It's been a while since your last custom test. You have ${templates.length} template${templates.length === 1 ? '' : 's'} ready to run.`;
    }
  }

  if (!showReminder) return null;

  function handleDismiss(e) {
    e.preventDefault();
    e.stopPropagation();
    const now = Date.now();
    saveJSON(REMINDER_DISMISS_KEY, now);
    setDismissedAt(now);
    setCollapsing(true);
    setTimeout(() => setUnmounted(true), 250);
  }

  return (
    <div className={`custom-tests-reminder-card ${collapsing ? 'collapsing' : ''}`}>
      <div className="custom-tests-reminder-icon">🧰</div>
      <div className="custom-tests-reminder-body">
        <div className="custom-tests-reminder-title">Custom Tests</div>
        <div className="custom-tests-reminder-desc">{message}</div>
      </div>
      <Link to="/custom-tests" className="btn btn-sm btn-primary">
        {hasTemplates ? 'Run a test →' : 'Create test →'}
      </Link>
      <button
        className="custom-tests-reminder-dismiss"
        onClick={handleDismiss}
        title="Hide for 30 days"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}