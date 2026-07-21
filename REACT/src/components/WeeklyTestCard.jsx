import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from './Badge';
import { useApp } from '../context/AppContext.jsx';
import UpgradeTeaseCard from './UpgradeTeaseCard';
import WeeklyTestSampleChart from './samples/WeeklyTestSampleChart';
import '../styles/upgradeTeaseCard.css';
import { canAccess, getRequiredTier, getTierLabel, getTierPrice } from '../utils/tierGate.js';
import {
  getCurrentWeekTestStatus,
  getSkipMessage,
  hideCardForCurrentCycle,
  isCardHiddenForCurrentCycle,
} from '../utils/weeklyTests.js';

// WeeklyTestCard — dashboard entry point for Advanced-tier weekly tests.
// Renders in three modes:
//   1. Advanced user + test day + not yet taken → "Take test" CTA
//   2. Advanced user + not test day → "Next test on X" info
//   3. Free/Basic user → locked with upgrade CTA
//   4. Advanced user + test taken → "Completed this week" summary
//
// The card is deliberately non-blocking — never a red-alert modal or
// full-screen takeover. Weekly tests are optional infrastructure that
// makes other features work better, not a mandatory ritual.

export default function WeeklyTestCard() {
  const { user, tierLoaded } = useApp();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const userTier = user?.tier || 'free';
  const hasAccess = canAccess('weeklyTests', userTier);

  useEffect(() => {
    if (!user?.id) return;
    // Wait for the real tier to load before deciding what to render. This
    // prevents the "flash of Locked card" seen when the component mounts
    // with the temporary 'free' default before fetchUserTier resolves.
    if (!tierLoaded) return;

    if (!hasAccess) {
      setLoading(false);
      return;
    }

    let canceled = false;
    (async () => {
      const s = await getCurrentWeekTestStatus(user.id);
      if (!canceled) {
        setStatus(s);
        setLoading(false);
      }
    })();
    return () => { canceled = true; };
  }, [user?.id, hasAccess, tierLoaded]);

  // Don't render anything until we know the real tier. Prevents flashing
  // the wrong variant (locked → advanced or vice versa) on first mount.
  if (!tierLoaded || loading) return null;

  // Free/Basic tier — locked card with upgrade CTA
  if (!hasAccess) {
    return <LockedCard />;
  }

  // Advanced tier — show status
  return <AdvancedCard status={status} />;
}

function LockedCard() {
  const requiredTier = getRequiredTier('weeklyTests');
  return (
    <UpgradeTeaseCard
      featureId="weeklyTests"
      icon="🧪"
      title="Weekly Tests"
      description="Structured weekly measurement that keeps your weak-point signals accurate."
      bullets={[
        'Take a 3-problem test on your studied topics each week',
        'See score trends over time',
        'Sharper adaptive-difficulty and weak-point recommendations',
      ]}
      tier={requiredTier}
      previewChart={<WeeklyTestSampleChart />}
      ctaLabel="Learn more →"
      ctaHref="/weekly-test"
    />
  );
}

function AdvancedCard({ status }) {
  const [hidden, setHidden] = useState(() => isCardHiddenForCurrentCycle());

  if (!status) return null;

  const { isTestDay, alreadyTaken, alreadySkipped, nextTestDate, consecutiveSkips, weekId } = status;

  // Test taken this week — celebratory summary (not dismissible; it's
  // Test taken this week — celebratory summary. Dismissible so users who
  // don't want to see the confirmation on every dashboard visit can hide
  // it for the rest of the cycle.
  if (alreadyTaken) {
    if (hidden) return null;
    return (
      <div className="weekly-test-card weekly-test-card-done">
        <div className="weekly-test-card-icon">✅</div>
        <div className="weekly-test-card-body">
          <div className="weekly-test-card-title">
            Test complete for this week
          </div>
          <div className="weekly-test-card-desc">
            Nice — {weekId} test done. Next opportunity on {formatDate(nextTestDate)}.
          </div>
        </div>
        <button
          className="weekly-test-card-dismiss"
          onClick={() => {
            hideCardForCurrentCycle();
            setHidden(true);
          }}
          title="Hide until next week"
          aria-label="Hide this card"
        >
          ✕
        </button>
      </div>
    );
  }

  // Test day + not taken yet → CTA (NEVER dismissible — this is the
  // main call to action, must always be visible on its day)
  if (isTestDay) {
    return (
      <div className="weekly-test-card weekly-test-card-active">
        <div className="weekly-test-card-icon">🧪</div>
        <div className="weekly-test-card-body">
          <div className="weekly-test-card-title">
            Weekly test available
          </div>
          <div className="weekly-test-card-desc">
            {alreadySkipped
              ? `You skipped this week. Change your mind? You can still take it today.`
              : `Your ${weekId} weekly test is ready. Takes ~1 hour.`}
          </div>
        </div>
        <Link to="/weekly-test" className="btn btn-sm btn-primary">
          {alreadySkipped ? 'Take it anyway →' : 'Start test →'}
        </Link>
      </div>
    );
  }

  // Non-test-day info card — DISMISSIBLE. If user hid it for this week's
  // cycle, don't render at all until the cycle rolls over or test day
  // arrives (test-day rendering path above ignores the hide flag).
  if (hidden) return null;

  const skipMessage = consecutiveSkips >= 2
    ? getSkipMessage(consecutiveSkips)
    : null;

  function handleHide() {
    hideCardForCurrentCycle();
    setHidden(true);
  }

  return (
    <div className={`weekly-test-card ${skipMessage ? `weekly-test-card-warn-${skipMessage.tone}` : 'weekly-test-card-info'}`}>
      <div className="weekly-test-card-icon">
        {skipMessage ? '⚠️' : '📅'}
      </div>
      <div className="weekly-test-card-body">
        <div className="weekly-test-card-title">
          {skipMessage ? 'Weekly test streak broken' : 'Next weekly test'}
        </div>
        <div className="weekly-test-card-desc">
          {skipMessage
            ? skipMessage.text
            : `Available on ${formatDate(nextTestDate)}.`}
        </div>
      </div>
      <button
        className="weekly-test-card-dismiss"
        onClick={handleHide}
        title="Hide until next week"
        aria-label="Hide this card"
      >
        ✕
      </button>
    </div>
  );
}

function formatDate(date) {
  if (!date) return '—';
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}