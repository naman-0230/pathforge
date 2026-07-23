import { Link } from 'react-router-dom';
import { TIER_FEATURES, getTierPrice, TIER_DURATION_MONTHS } from '../utils/tierGate.js';

// PricingTierCard — reusable tier card component.
//
// Modes:
//   'full'    → full pricing page card with all features
//   'compact' → landing page preview (top 4 features only)
//
// currentTier: user's actual tier. Determines button state:
//   - Same tier: "Current plan" (disabled)
//   - Lower tier than card: "Get [Tier]" or "Upgrade to [Tier]"
//   - Higher tier than card: "You're on a higher plan" (info)

const TIER_ORDER_MAP = { free: 0, basic: 1, advanced: 2 };

const TIER_META = {
  free: {
    icon: '🆓',
    tagline: 'Perfect for starting out',
    color: 'var(--text-mid)',
  },
  basic: {
    icon: '🚀',
    tagline: 'Serious about interviews',
    color: 'var(--accent, #e8732d)',
  },
  advanced: {
    icon: '🏆',
    tagline: 'Full-stack placement prep',
    color: 'var(--accent, #e8732d)',
  },
};

export default function PricingTierCard({
  tier,               // 'free' | 'basic' | 'advanced'
  currentTier,        // user's current tier or null (logged out)
  mode = 'full',      // 'full' | 'compact'
  highlighted = false,
  loggedIn = false,
}) {
  const meta = TIER_META[tier];
  const price = getTierPrice(tier);
  const features = TIER_FEATURES[tier].included;
  const displayFeatures = mode === 'compact' ? features.slice(0, 4) : features;
  const hiddenFeatureCount = mode === 'compact' ? Math.max(0, features.length - 4) : 0;

  // Determine button state
  const currentTierRank = TIER_ORDER_MAP[currentTier ?? 'free'] ?? 0;
  const cardTierRank = TIER_ORDER_MAP[tier];
  const isCurrentTier = currentTier === tier;
  const isLowerThanCurrent = cardTierRank < currentTierRank;

  let buttonNode;
  if (!loggedIn) {
    if (tier === 'free') {
      buttonNode = (
        <Link to="/signup" className="btn btn-primary pricing-tier-btn">
          Sign up free
        </Link>
      );
    } else {
      buttonNode = (
        <Link to={`/signup?intent=${tier}`} className="btn btn-primary pricing-tier-btn">
          Get {tier === 'basic' ? 'Basic' : 'Advanced'}
        </Link>
      );
    }
  } else if (isCurrentTier) {
    buttonNode = (
      <button className="btn pricing-tier-btn pricing-tier-btn-current" disabled>
        ✓ Current plan
      </button>
    );
  } else if (isLowerThanCurrent) {
    buttonNode = (
      <button className="btn pricing-tier-btn pricing-tier-btn-info" disabled>
        You're on a higher plan
      </button>
    );
  } else {
    // Higher than current — upgrade path
    const buttonLabel = currentTier === 'free'
      ? `Get ${tier === 'basic' ? 'Basic' : 'Advanced'}`
      : `Upgrade to ${tier === 'basic' ? 'Basic' : 'Advanced'}`;
    buttonNode = (
      <Link
        to={`/checkout?tier=${tier}`}
        className="btn btn-primary pricing-tier-btn"
      >
        {buttonLabel} →
      </Link>
    );
  }

  return (
    <div className={`pricing-tier-card pricing-tier-card-${tier} ${highlighted ? 'pricing-tier-highlighted' : ''} pricing-tier-mode-${mode}`}>
      {highlighted && (
        <div className="pricing-tier-badge">Most popular</div>
      )}

      <div className="pricing-tier-header">
        <div className="pricing-tier-icon">{meta.icon}</div>
        <div className="pricing-tier-name">
          {tier === 'free' ? 'Free' : tier === 'basic' ? 'Basic' : 'Advanced'}
        </div>
        <div className="pricing-tier-tagline">{meta.tagline}</div>
      </div>

      <div className="pricing-tier-price">
        {price === 0 ? (
          <div className="pricing-tier-price-main">Free</div>
        ) : (
          <>
            <div className="pricing-tier-price-main">
              ₹{price}
            </div>
            <div className="pricing-tier-price-sub">
              for {TIER_DURATION_MONTHS} months
            </div>
          </>
        )}
      </div>

      <ul className="pricing-tier-features">
        {displayFeatures.map((f, i) => (
          <li key={i}>
            <span className="pricing-tier-feature-check">✓</span> {f}
          </li>
        ))}
        {hiddenFeatureCount > 0 && (
          <li className="pricing-tier-more-features">
            + {hiddenFeatureCount} more feature{hiddenFeatureCount === 1 ? '' : 's'}
          </li>
        )}
      </ul>

      <div className="pricing-tier-action">
        {buttonNode}
      </div>
    </div>
  );
}