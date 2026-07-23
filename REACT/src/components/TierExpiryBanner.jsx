import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { getTierLabel } from '../utils/tierGate.js';
import { loadJSON, saveJSON } from '../utils/storage.js';

// TierExpiryBanner — dashboard warning banner shown when user's paid tier
// is about to expire or has expired (grace period).
//
// SHOWS WHEN:
//   - User has paid tier (basic or advanced)
//   - tier_expires_at is within 7 days OR in the past (grace period)
//
// DISMISSIBLE:
//   User can dismiss for 24 hours. Comes back next day if still expiring.

const DISMISS_KEY = 'pathforge:tierExpiryBanner:dismissed';
const DISMISS_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

function daysUntilExpiry(dateStr) {
  if (!dateStr) return null;
  const now = Date.now();
  const expiry = new Date(dateStr).getTime();
  return Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
}

export default function TierExpiryBanner() {
  const { user, tierLoaded } = useApp();
  const [dismissedAt, setDismissedAt] = useState(() => loadJSON(DISMISS_KEY, null));
  const [collapsing, setCollapsing] = useState(false);
  const [unmounted, setUnmounted] = useState(false);

  if (!tierLoaded || !user) return null;
  if (unmounted) return null;

  const tier = user.tier;
  const tierExpiresAt = user.tierExpiresAt;

  // Only for paid tiers
  if (tier !== 'basic' && tier !== 'advanced') return null;
  if (!tierExpiresAt) return null;

  const daysLeft = daysUntilExpiry(tierExpiresAt);
  if (daysLeft === null) return null;

  // Only show if expiring within 7 days or expired
  const isExpiringSoon = daysLeft > 0 && daysLeft <= 7;
  const isExpired = daysLeft <= 0;
  if (!isExpiringSoon && !isExpired) return null;

  // Check dismiss cooldown
  if (typeof dismissedAt === 'number' && (Date.now() - dismissedAt) < DISMISS_COOLDOWN_MS) {
    return null;
  }

  function handleDismiss(e) {
    e?.preventDefault();
    e?.stopPropagation();
    const now = Date.now();
    saveJSON(DISMISS_KEY, now);
    setDismissedAt(now);
    setCollapsing(true);
    setTimeout(() => setUnmounted(true), 250);
  }

  const tierLabel = getTierLabel(tier);
  const isCritical = isExpired || daysLeft <= 3;

  return (
    <div className={`tier-expiry-banner ${collapsing ? 'collapsing' : ''} ${isCritical ? 'critical' : ''}`}>
      <div className="tier-expiry-icon">
        {isExpired ? '⚠️' : '⏰'}
      </div>
      <div className="tier-expiry-body">
        <div className="tier-expiry-title">
          {isExpired
            ? `Your ${tierLabel} tier expired`
            : `Your ${tierLabel} tier expires in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`}
        </div>
        <div className="tier-expiry-desc">
          {isExpired
            ? `3-day grace period active. Renew now to avoid dropping to Free tier.`
            : `Renew to keep uninterrupted access to all your ${tierLabel} features.`}
        </div>
      </div>
      <Link to={`/checkout?tier=${tier}`} className="btn btn-sm btn-primary">
        Renew now →
      </Link>
      <button
        className="tier-expiry-dismiss"
        onClick={handleDismiss}
        title="Hide for 24 hours"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}