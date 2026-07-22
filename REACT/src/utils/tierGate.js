// tierGate.js — checks whether the current user's tier allows access to
// a specific feature. Used by pages/components to conditionally show
// upgrade prompts instead of the feature itself.
//
// This is the ONLY file that knows which features belong to which tier.
// Every other file calls canAccess('featureName', userTier) and acts on
// the boolean.
//
// SPECIAL CASES:
//   Some features have USAGE LIMITS rather than binary access — Free tier
//   gets 1 interview sim per week, then it's gated. Those use canUse()
//   which takes a callback for the current usage snapshot. Binary access
//   uses canAccess().
//
// TIER LEVELS:
//   free      — signed up, no payment
//   basic     — ₹199 until deadline
//   advanced  — ₹399 until deadline
//
// ADD-ONS:
//   aptitude  — ₹99, stackable on any tier, checked separately via
//               user.aptitudeAccess (not part of tier hierarchy)

const TIER_ORDER = { free: 0, basic: 1, advanced: 2 };

const FEATURE_TIERS = {
  // ── Free (all tiers) ─────────────────────────────────────────────
  roadmap: 'free',
  problems: 'free',
  revision: 'free',
  analytics: 'free',
  weakPoints: 'free',
  fundamentals: 'free',
  motivation: 'free',
  patternTraining: 'free',
  drills: 'free',
  achievements: 'free',
  reminders: 'free',

  // ── Basic (₹199) ─────────────────────────────────────────────────
  interviewSimulation: 'basic',     // Free gets 1/week; Basic+ unlimited
  codeEditor: 'basic',              // Free only for first 2 sections of Arrays
  unlimitedTopics: 'basic',         // Free: Arrays only in day plan
  unlimitedInterviewSims: 'basic',  // Explicit gate for "unlimited" — used with weekly cap

  // ── Advanced (₹399) ──────────────────────────────────────────────
  weeklyTests: 'advanced',
  customTests: 'advanced',
  theoryContent: 'advanced',
  theoryTests: 'advanced',
  mockInterviewRounds: 'advanced',
  aiApproachFeedback: 'advanced',

    // ── Add-on features (₹99, purchased separately) ─────────────────
  // These are NOT in the tier hierarchy — they use canAccessAptitude()
  // to check the aptitude_access boolean on user_tier. Kept here as
  // documentation so future features know the pattern for add-ons.
  // ── Add-on (₹99) — checked separately via user.aptitudeAccess ───
  // aptitude: not in this map — see canAccessAptitude()
};

// ============================================================
// PUBLIC API
// ============================================================

// canAccess — binary feature check. Returns true if the user's tier
// meets or exceeds the required tier. For features that Free users
// have LIMITED access to (like interview sims), use canAccess with
// the "unlimited" variant, e.g. canAccess('unlimitedInterviewSims').
export function canAccess(feature, userTier = 'free') {
  const requiredTier = FEATURE_TIERS[feature];
  if (!requiredTier) return true; // unknown feature = allow (fail-open)
  return (TIER_ORDER[userTier] ?? 0) >= (TIER_ORDER[requiredTier] ?? 0);
}

// canAccessAptitude — the aptitude add-on is orthogonal to tier. Users
// buy it as a one-time flag on their account. Checked here as a
// separate function so tier hierarchy stays clean.
export function canAccessAptitude(user) {
  return !!user?.aptitudeAccess;
}

// getRequiredTier — for building "Upgrade to X" prompts. Returns the
// tier name (string) that would unlock this feature.
export function getRequiredTier(feature) {
  return FEATURE_TIERS[feature] || 'free';
}

// getTierLabel — display name for a tier code. Used in upgrade prompts.
export function getTierLabel(tier) {
  const labels = { free: 'Free', basic: 'Basic', advanced: 'Advanced' };
  return labels[tier] || 'Free';
}

// getTierPrice — display price for a tier code. Used in upgrade prompts.
// Kept here so pricing changes only touch one file.
export function getTierPrice(tier) {
  const prices = { free: 0, basic: 199, advanced: 399 };
  return prices[tier] ?? 0;
}

// isFreeUser / isBasicUser / isAdvancedUser — convenience helpers for
// common checks that come up in many components.
export function isFreeUser(userTier) {
  return (TIER_ORDER[userTier] ?? 0) === 0;
}

export function isBasicUser(userTier) {
  return (TIER_ORDER[userTier] ?? 0) === 1;
}

export function isAdvancedUser(userTier) {
  return (TIER_ORDER[userTier] ?? 0) === 2;
}