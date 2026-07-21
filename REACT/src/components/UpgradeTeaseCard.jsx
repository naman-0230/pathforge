
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { getTierLabel, getTierPrice } from '../utils/tierGate.js';
import { loadJSON, saveJSON } from '../utils/storage.js';

// UpgradeTeaseCard - reusable upgrade tease card for the Dashboard.
// Used for weekly tests, unlimited interview sims, and any other
// tier-gated feature we want to tease.
//
// DISMISSAL BEHAVIOR:
//   - Dismissal stores a TIMESTAMP (not boolean) so cooldown works
//   - Cooldown is 30 days; after that the tease reappears naturally
//   - Legacy `true` values from earlier versions treated as expired
//   - Dismiss triggers a smooth collapse animation (~250ms), then unmounts

const DISMISS_KEY_PREFIX = 'pathforge:upgradeTease:dismissed:';
const DISMISS_COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000;
const COLLAPSE_ANIMATION_MS = 250;

function isDismissedFresh(dismissedAt) {
  if (typeof dismissedAt !== 'number') return false;
  return (Date.now() - dismissedAt) < DISMISS_COOLDOWN_MS;
}

export default function UpgradeTeaseCard({
  featureId,
  icon,
  title,
  description,
  bullets,
  tier,
  previewChart,
  ctaLabel,
  ctaHref,
}) {
  const storageKey = DISMISS_KEY_PREFIX + featureId;

  const [dismissedAt, setDismissedAt] = useState(() => {
    const stored = loadJSON(storageKey, null);
    if (typeof stored === 'number') return stored;
    return null;
  });

  const [collapsing, setCollapsing] = useState(false);
  const [unmounted, setUnmounted] = useState(false);
  const collapseTimerRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(collapseTimerRef.current);
  }, []);

  if (unmounted) return null;
  if (isDismissedFresh(dismissedAt) && !collapsing) return null;

  const tierLabel = getTierLabel(tier);
  const tierPrice = getTierPrice(tier);
  const finalIcon = icon || 'star';
  const finalCtaLabel = ctaLabel || 'Learn more';

  function handleDismiss(e) {
    e.preventDefault();
    e.stopPropagation();

    const now = Date.now();
    saveJSON(storageKey, now);

    setCollapsing(true);
    setDismissedAt(now);

    collapseTimerRef.current = setTimeout(() => {
      setUnmounted(true);
    }, COLLAPSE_ANIMATION_MS);
  }

  return (
    <div className={'upgrade-tease-card' + (collapsing ? ' collapsing' : '')}>
      <div className="upgrade-tease-card-header">
        <div className="upgrade-tease-card-icon-wrap">
          <span className="upgrade-tease-card-icon">{finalIcon}</span>
        </div>
        <div className="upgrade-tease-card-headline">
          <div className="upgrade-tease-card-title">
            {title}
            <span className="upgrade-tease-card-tier-badge">
              {tierLabel} - Rs {tierPrice}
            </span>
          </div>
          <div className="upgrade-tease-card-description">{description}</div>
        </div>
        <button
          className="upgrade-tease-card-dismiss"
          onClick={handleDismiss}
          title="Hide for 30 days"
          aria-label="Dismiss"
        >
          X
        </button>
      </div>

      {(previewChart || bullets) && (
        <div className="upgrade-tease-card-body">
          {previewChart && (
            <div className="upgrade-tease-card-preview">
              <div className="upgrade-tease-card-sample-label">Sample</div>
              {previewChart}
            </div>
          )}
          {bullets && (
            <ul className="upgrade-tease-card-bullets">
              {bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          )}
        </div>
      )}

      <div className="upgrade-tease-card-footer">
        <Link to={ctaHref} className="btn btn-sm upgrade-tease-card-cta">
          {finalCtaLabel}
        </Link>
        <Link to="/settings" className="btn btn-sm btn-primary">
          Upgrade to {tierLabel}
        </Link>
      </div>
    </div>
  );
}