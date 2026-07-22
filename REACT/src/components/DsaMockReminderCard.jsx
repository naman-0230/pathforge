import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { canAccess } from '../utils/tierGate.js';
import { getSessionHistory } from '../utils/dsaMocks.js';
import { loadJSON, saveJSON } from '../utils/storage.js';

// DsaMockReminderCard — small dashboard nudge for advanced-tier users
// who haven't done a mock test in a while.
//
// FIRING RULES:
//   - Only shown to users with canAccess('theoryTests', tier)
//   - Only if no DSA mock session in last 14 days
//   - Only once per 14 days (short-dismiss cooldown)
//
// "DON'T SHOW AGAIN" LONG COOLDOWN:
//   User can click "Don't show for a while" — sets a 90-day (~3 months)
//   silent cooldown. Card doesn't appear again until 3 months pass. Shows
//   a small toast confirming they can find DSA mocks in the sidebar anytime.
//
// COMPACT STYLING:
//   Card is intentionally smaller than aptitude reminder — this is core
//   interview prep, but shouldn't dominate the dashboard's visual weight.

const SHORT_DISMISS_KEY = 'pathforge:dsaMocks:reminderDismissed';
const LONG_DISMISS_KEY = 'pathforge:dsaMocks:reminderLongDismissed';
const SHORT_COOLDOWN_MS = 14 * 24 * 60 * 60 * 1000;
const LONG_COOLDOWN_MS = 90 * 24 * 60 * 60 * 1000;
const INACTIVITY_MS = 14 * 24 * 60 * 60 * 1000;

export default function DsaMockReminderCard() {
  const { user, tierLoaded } = useApp();
  const userTier = user?.tier || 'free';
  const [shortDismissedAt, setShortDismissedAt] = useState(() => loadJSON(SHORT_DISMISS_KEY, null));
  const [longDismissedAt] = useState(() => loadJSON(LONG_DISMISS_KEY, null));
  const [collapsing, setCollapsing] = useState(false);
  const [unmounted, setUnmounted] = useState(false);
  const [showLongDismissToast, setShowLongDismissToast] = useState(false);

  if (!tierLoaded) return null;
  if (unmounted) return null;
  if (!canAccess('theoryTests', userTier)) return null;

  // Long cooldown check first — takes priority
  if (typeof longDismissedAt === 'number' && (Date.now() - longDismissedAt) < LONG_COOLDOWN_MS) {
    return null;
  }

  // Short cooldown
  if (typeof shortDismissedAt === 'number' && (Date.now() - shortDismissedAt) < SHORT_COOLDOWN_MS) {
    return null;
  }

  // Inactivity check
  const history = getSessionHistory();
  const mostRecent = history[0]?.completedAt;
  if (mostRecent && (Date.now() - mostRecent) < INACTIVITY_MS) {
    return null;
  }

  function handleShortDismiss(e) {
    e?.preventDefault();
    e?.stopPropagation();
    const now = Date.now();
    saveJSON(SHORT_DISMISS_KEY, now);
    setShortDismissedAt(now);
    setCollapsing(true);
    setTimeout(() => setUnmounted(true), 250);
  }

  function handleLongDismiss(e) {
    e?.preventDefault();
    e?.stopPropagation();
    const now = Date.now();
    saveJSON(LONG_DISMISS_KEY, now);
    setShowLongDismissToast(true);
    // Toast for 3 seconds, then collapse
    setTimeout(() => {
      setShowLongDismissToast(false);
      setCollapsing(true);
      setTimeout(() => setUnmounted(true), 250);
    }, 3000);
  }

  const message = mostRecent
    ? "Been a while — quick refresher?"
    : "Prep DSA theory before interviews.";

  return (
    <>
      <div className={`dsa-reminder-card ${collapsing ? 'collapsing' : ''}`}>
        <div className="dsa-reminder-icon">📝</div>
        <div className="dsa-reminder-body">
          <div className="dsa-reminder-title">DSA Mock Tests</div>
          <div className="dsa-reminder-desc">{message}</div>
        </div>
        <Link to="/dsa-mocks" className="btn btn-sm btn-primary">
          Practice →
        </Link>
        <div className="dsa-reminder-dismiss-group">
          <button
            className="dsa-reminder-dismiss-btn"
            onClick={handleShortDismiss}
            title="Hide for 2 weeks"
            aria-label="Dismiss for 2 weeks"
          >
            ✕
          </button>
          <button
            className="dsa-reminder-dismiss-long"
            onClick={handleLongDismiss}
            title="Don't show for a while"
          >
            Don't show for a while
          </button>
        </div>
      </div>

      {showLongDismissToast && (
        <div className="dsa-reminder-toast">
          ✓ Hidden. Find DSA Mock Tests in the sidebar whenever you're ready.
        </div>
      )}
    </>
  );
}