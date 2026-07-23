import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import {
  getTierLabel,
  getTierPrice,
  APTITUDE_ADDON_PRICE,
  TIER_DURATION_MONTHS,
} from '../utils/tierGate.js';
import { getPendingUpgrades } from '../utils/upgradeFlow.js';

// TierPlanCard — shown at the top of Settings. Displays user's current
// tier + expiry + upgrade CTAs + aptitude add-on status.
//
// STATES:
//   - Free user: shows upgrade CTAs (Basic, Advanced)
//   - Basic user: shows upgrade to Advanced CTA + expiry info
//   - Advanced user: shows "current plan" state + expiry info
//   - Aptitude add-on section always shown separately
//   - Pending upgrade request: shows "processing" state instead of CTAs

function formatExpiry(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function daysUntilExpiry(dateStr) {
  if (!dateStr) return null;
  const now = Date.now();
  const expiry = new Date(dateStr).getTime();
  const days = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
  return days;
}

export default function TierPlanCard() {
  const { user } = useApp();
  const [pendingUpgrades, setPendingUpgrades] = useState([]);
  const [loadingPending, setLoadingPending] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    (async () => {
      const requests = await getPendingUpgrades(user.id);
      if (!cancelled) {
        setPendingUpgrades(requests);
        setLoadingPending(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user?.id]);

  if (!user) return null;

  const tier = user.tier || 'free';
  const tierExpiresAt = user.tierExpiresAt;
  const hasAptitude = !!user.aptitudeAccess;
  const isPaidTier = tier !== 'free';

  const expiryDate = formatExpiry(tierExpiresAt);
  const daysLeft = daysUntilExpiry(tierExpiresAt);
  const isExpiringSoon = daysLeft !== null && daysLeft > 0 && daysLeft <= 7;
  const isExpired = daysLeft !== null && daysLeft <= 0;

  // Check for pending upgrade requests
  const pendingTierUpgrade = pendingUpgrades.find((p) =>
    p.requested_tier === 'basic' || p.requested_tier === 'advanced'
  );
  const pendingAptitudeUpgrade = pendingUpgrades.find((p) =>
    p.requested_tier === 'aptitude_addon'
  );

  return (
    <div className="tier-plan-card">
      <div className="tier-plan-header">
        <div className="tier-plan-header-left">
          <div className="tier-plan-icon">
            {tier === 'free' ? '🆓' : tier === 'basic' ? '🚀' : '🏆'}
          </div>
          <div>
            <div className="tier-plan-label">Your plan</div>
            <div className="tier-plan-name">
              {getTierLabel(tier)} tier
              {isPaidTier && expiryDate && (
                <span className={`tier-plan-expiry ${isExpiringSoon ? 'expiring-soon' : ''} ${isExpired ? 'expired' : ''}`}>
                  {isExpired ? `Expired ${expiryDate}` : `Until ${expiryDate}`}
                </span>
              )}
            </div>
          </div>
        </div>

        {isPaidTier && daysLeft !== null && daysLeft > 0 && (
          <div className={`tier-plan-days-badge ${isExpiringSoon ? 'expiring' : ''}`}>
            {daysLeft} day{daysLeft === 1 ? '' : 's'} left
          </div>
        )}
      </div>

      {/* Pending tier upgrade banner */}
      {pendingTierUpgrade && (
        <div className="tier-plan-pending-banner">
          <div className="tier-plan-pending-icon">⏳</div>
          <div className="tier-plan-pending-body">
            <div className="tier-plan-pending-title">
              Upgrade to {getTierLabel(pendingTierUpgrade.requested_tier)} — pending verification
            </div>
            <div className="tier-plan-pending-desc">
              We received your request. Activation usually happens within 24 hours.
            </div>
          </div>
        </div>
      )}

      {/* Expiry warning banner */}
      {isPaidTier && isExpiringSoon && !isExpired && !pendingTierUpgrade && (
        <div className="tier-plan-warning-banner">
          <div className="tier-plan-warning-icon">⏰</div>
          <div className="tier-plan-warning-body">
            Your {getTierLabel(tier)} tier expires in {daysLeft} day{daysLeft === 1 ? '' : 's'}.
            Renew to keep full access.
          </div>
          <Link to={`/checkout?tier=${tier}`} className="btn btn-sm btn-primary">
            Renew
          </Link>
        </div>
      )}

      {isExpired && !pendingTierUpgrade && (
        <div className="tier-plan-warning-banner tier-plan-warning-critical">
          <div className="tier-plan-warning-icon">⚠️</div>
          <div className="tier-plan-warning-body">
            Your {getTierLabel(tier)} tier expired. You're in the 3-day grace period.
            Renew now to avoid dropping to Free.
          </div>
          <Link to={`/checkout?tier=${tier}`} className="btn btn-sm btn-primary">
            Renew now
          </Link>
        </div>
      )}

      {/* Upgrade CTAs (only shown if no pending upgrade) */}
      {!pendingTierUpgrade && (
        <div className="tier-plan-upgrade-section">
          {tier === 'free' && (
            <>
              <div className="tier-plan-upgrade-title">Unlock more with a paid tier</div>
              <div className="tier-plan-upgrade-options">
                <UpgradeOption
                  targetTier="basic"
                  currentTier={tier}
                  description="Unlimited interview sims + code editor on all problems"
                />
                <UpgradeOption
                  targetTier="advanced"
                  currentTier={tier}
                  description="Weekly tests, custom tests, DSA mocks, theory content"
                />
              </div>
            </>
          )}

          {tier === 'basic' && (
            <>
              <div className="tier-plan-upgrade-title">Ready for the full package?</div>
              <div className="tier-plan-upgrade-options">
                <UpgradeOption
                  targetTier="advanced"
                  currentTier={tier}
                  description="Weekly tests, custom tests, DSA mocks, theory content"
                />
              </div>
            </>
          )}

          {tier === 'advanced' && (
            <div className="tier-plan-max-tier">
              ✓ You're on the highest tier. Full access to every feature.
            </div>
          )}
        </div>
      )}

      {/* Aptitude add-on section (always shown) */}
      <div className="tier-plan-addon-section">
        <div className="tier-plan-addon-header">
          <div>
            <div className="tier-plan-addon-title">
              🧠 Aptitude Add-on
              {hasAptitude && <span className="tier-plan-addon-status">✓ Active</span>}
            </div>
            <div className="tier-plan-addon-desc">
              Lifetime access to Quant, LR, and Verbal practice + tests.
              {!hasAptitude && ' Stackable with any tier.'}
            </div>
          </div>

          {pendingAptitudeUpgrade ? (
            <div className="tier-plan-addon-pending">
              ⏳ Pending
            </div>
          ) : hasAptitude ? (
            <div className="tier-plan-addon-owned">
              Owned
            </div>
          ) : (
            <Link
              to="/checkout?tier=aptitude_addon"
              className="btn btn-sm btn-primary"
            >
              Get for ₹{APTITUDE_ADDON_PRICE}
            </Link>
          )}
        </div>
      </div>

      {/* Footer links */}
      <div className="tier-plan-footer">
        <Link to="/pricing" className="tier-plan-footer-link">
          See all plans + FAQ →
        </Link>
      </div>
    </div>
  );
}

// UpgradeOption — one upgrade CTA row in the plan card
function UpgradeOption({ targetTier, currentTier, description }) {
  const label = getTierLabel(targetTier);
  const price = getTierPrice(targetTier);
  const currentPrice = getTierPrice(currentTier);
  const diff = price - currentPrice;
  const showDiff = currentTier !== 'free' && diff > 0;

  return (
    <div className="tier-plan-upgrade-option">
      <div className="tier-plan-upgrade-option-body">
        <div className="tier-plan-upgrade-option-name">
          {label}
          <span className="tier-plan-upgrade-option-price">
            ₹{showDiff ? diff : price}
            {showDiff && <span className="tier-plan-upgrade-diff-note"> (upgrade price)</span>}
            {!showDiff && <span className="tier-plan-upgrade-diff-note"> for {TIER_DURATION_MONTHS} months</span>}
          </span>
        </div>
        <div className="tier-plan-upgrade-option-desc">{description}</div>
      </div>
      <Link
        to={`/checkout?tier=${targetTier}`}
        className="btn btn-sm btn-primary"
      >
        {currentTier === 'free' ? `Get ${label}` : `Upgrade`}
      </Link>
    </div>
  );
}