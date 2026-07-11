// tierGate.js — checks whether the current user's tier allows
// access to a specific feature. Used by pages/components to
// conditionally show upgrade prompts instead of the feature itself.
//
// This is the ONLY file that knows which features belong to which
// tier. Every other file just calls canAccess('featureName') and
// gets a boolean.

const TIER_ORDER = { free: 0, basic: 1, advanced: 2 };

const FEATURE_TIERS = {
  // Free features
  roadmap: 'free',
  problems: 'free',
  revision: 'free',
  analytics: 'free',
  weakPoints: 'free',
  fundamentals: 'free',
  motivation: 'free',

  // Basic features (199 INR)
  weeklyTests: 'basic',
  codeEditor: 'basic',
  unlimitedTopics: 'basic',

  // Advanced features (399 INR)
  customTests: 'advanced',
  theoryContent: 'advanced',
  theoryTests: 'advanced',

  // Add-on (99 INR) — separate flag, not tier-based
  // aptitude: handled separately via user_metadata.aptitudeAccess
};

export function canAccess(feature, userTier = 'free') {
  const requiredTier = FEATURE_TIERS[feature];
  if (!requiredTier) return true; // unknown feature = allow
  return (TIER_ORDER[userTier] ?? 0) >= (TIER_ORDER[requiredTier] ?? 0);
}

export function getRequiredTier(feature) {
  return FEATURE_TIERS[feature] || 'free';
}

export function getTierLabel(tier) {
  const labels = { free: 'Free', basic: 'Basic', advanced: 'Advanced' };
  return labels[tier] || 'Free';
}