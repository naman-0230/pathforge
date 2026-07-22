import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { canAccessAptitude } from '../utils/tierGate.js';
import { getSessionHistory } from '../utils/aptitude.js';
import { loadJSON, saveJSON } from '../utils/storage.js';

// AptitudeReminderCard — monthly-cadence dashboard nudge for users who
// have the aptitude add-on but haven't used it in a while.
//
// FIRING RULES:
//   - Only shown to users with aptitudeAccess=true
//   - Only if no aptitude session in last 30 days
//   - Only once per 30 days (dismissal cooldown)
//   - Dismissible with animation

const DISMISS_KEY = 'pathforge:aptitude:reminderDismissed';
const COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000;
const INACTIVITY_MS = 30 * 24 * 60 * 60 * 1000;

export default function AptitudeReminderCard() {
  const { user, tierLoaded } = useApp();
  const [dismissedAt, setDismissedAt] = useState(() => loadJSON(DISMISS_KEY, null));
  const [collapsing, setCollapsing] = useState(false);
  const [unmounted, setUnmounted] = useState(false);

  if (!tierLoaded) return null;
  if (unmounted) return null;
  if (!canAccessAptitude(user)) return null;

  if (typeof dismissedAt === 'number' && (Date.now() - dismissedAt) < COOLDOWN_MS) {
    return null;
  }

  // Check inactivity
  const history = getSessionHistory();
  const mostRecent = history[0]?.completedAt;
  if (mostRecent && (Date.now() - mostRecent) < INACTIVITY_MS) {
    return null;
  }

  function handleDismiss(e) {
    e.preventDefault();
    e.stopPropagation();
    const now = Date.now();
    saveJSON(DISMISS_KEY, now);
    setDismissedAt(now);
    setCollapsing(true);
    setTimeout(() => setUnmounted(true), 250);
  }

  const message = mostRecent
    ? "It's been a while since your last aptitude session. Stay sharp!"
    : "Aptitude prep is ready when you are.";

  return (
    <div className={`aptitude-reminder-card ${collapsing ? 'collapsing' : ''}`}>
      <div className="aptitude-reminder-icon">🧠</div>
      <div className="aptitude-reminder-body">
        <div className="aptitude-reminder-title">Aptitude & LR practice</div>
        <div className="aptitude-reminder-desc">{message}</div>
      </div>
      <Link to="/aptitude" className="btn btn-sm btn-primary">
        Practice now →
      </Link>
      <button
        className="aptitude-reminder-dismiss"
        onClick={handleDismiss}
        title="Hide for 30 days"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}