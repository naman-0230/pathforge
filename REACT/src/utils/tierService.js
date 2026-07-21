import { supabase } from './supabaseClient.js';

// tierService.js — server-authoritative tier and usage tracking.
//
// SECURITY MODEL:
//   - user_tier table: read-only for clients (RLS policy blocks all client
//     UPDATE attempts). Tier changes happen server-side only, via payment
//     webhooks or admin action in Supabase dashboard.
//   - user_usage table: append-only. Clients can INSERT (record their own
//     actions) and SELECT (read their own counts). No UPDATE, no DELETE —
//     users can't clear their own usage to bypass limits.
//
// This means:
//   1. Client cannot upgrade its own tier (RLS blocks writes)
//   2. Client cannot fake usage counters (server counts append-only events)
//   3. Even if attacker modifies frontend to show "unlimited", the actual
//      usage query still returns real numbers from the server
//
// WHAT'S STILL BYPASSABLE (Phase C would fix):
//   - Attacker can modify React to bypass client-side canAccess() checks
//     and SEE gated UI, but any server-affecting action fails against
//     real counters/tier.
//   - Purely-local features (e.g. interview sim flow after start) trust
//     the client. Only the START is server-verified.

// ============================================================
// TIER LOOKUP
// ============================================================

// fetchUserTier — reads the user's current tier from user_tier table.
// Returns 'free' if no row exists (shouldn't happen with the trigger,
// but defensive). This is the ONLY function that should ever tell us
// what tier a user has — never trust user_metadata or client state.
export async function fetchUserTier(userId) {
  if (!userId) return { tier: 'free', tierExpiresAt: null, aptitudeAccess: false };

  try {
    const { data, error } = await supabase
      .from('user_tier')
      .select('tier, tier_expires_at, aptitude_access')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('[tierService] Failed to fetch tier:', error);
      return { tier: 'free', tierExpiresAt: null, aptitudeAccess: false };
    }

    if (!data) {
      // No row yet — trigger should have created one, but defensive fallback.
      // Try to insert a free row (RLS allows this per the insert policy).
      await supabase.from('user_tier').insert({ user_id: userId, tier: 'free' });
      return { tier: 'free', tierExpiresAt: null, aptitudeAccess: false };
    }

    // Check expiry — if tier_expires_at is in the past, treat as free.
    // This lets us not have to run a background job to downgrade — the
    // moment they load the app after expiry, they're back to free tier.
    const now = new Date();
    if (data.tier_expires_at && new Date(data.tier_expires_at) < now) {
      return {
        tier: 'free',
        tierExpiresAt: data.tier_expires_at,
        aptitudeAccess: data.aptitude_access,
      };
    }

    return {
      tier: data.tier,
      tierExpiresAt: data.tier_expires_at,
      aptitudeAccess: data.aptitude_access,
    };
  } catch (err) {
    console.error('[tierService] fetchUserTier error:', err);
    return { tier: 'free', tierExpiresAt: null, aptitudeAccess: false };
  }
}

// ============================================================
// USAGE TRACKING
// ============================================================

// recordUsageEvent — inserts a new usage event into user_usage.
// This is the ONLY way to track something like "user started a sim."
// LocalStorage counters are gone — server row is truth.
//
// Returns the created row on success, null on failure. Failure to record
// SHOULD NOT block the user's action (we don't want a network hiccup to
// break their session), but their next check might not see the event.
// Acceptable trade-off: worst case a free-tier user gets 2 sims in one
// hour instead of 1. Not the end of the world.
export async function recordUsageEvent(userId, eventType, metadata = {}) {
  if (!userId || !eventType) return null;

  try {
    const { data, error } = await supabase
      .from('user_usage')
      .insert({
        user_id: userId,
        event_type: eventType,
        metadata,
      })
      .select()
      .single();

    if (error) {
      console.error('[tierService] Failed to record usage:', error);
      return null;
    }
    return data;
  } catch (err) {
    console.error('[tierService] recordUsageEvent error:', err);
    return null;
  }
}

// countUsageEventsSince — server-authoritative count of usage events of
// a given type since a given timestamp. This is what gates weekly-limit
// features like Free tier interview sims.
//
// Returns the count, or 0 on error (defensive: on network failure, don't
// falsely block the user).
export async function countUsageEventsSince(userId, eventType, sinceIsoTimestamp) {
  if (!userId || !eventType) return 0;

  try {
    const { count, error } = await supabase
      .from('user_usage')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('event_type', eventType)
      .gte('created_at', sinceIsoTimestamp);

    if (error) {
      console.error('[tierService] Failed to count usage:', error);
      return 0;
    }
    return count || 0;
  } catch (err) {
    console.error('[tierService] countUsageEventsSince error:', err);
    return 0;
  }
}

// getOldestUsageEventSince — returns the timestamp of the oldest event
// of a given type within the given window. Used to compute "next available"
// countdown for weekly limits ("your first sim was 3 days ago, next slot
// available in 4 days").
export async function getOldestUsageEventSince(userId, eventType, sinceIsoTimestamp) {
  if (!userId || !eventType) return null;

  try {
    const { data, error } = await supabase
      .from('user_usage')
      .select('created_at')
      .eq('user_id', userId)
      .eq('event_type', eventType)
      .gte('created_at', sinceIsoTimestamp)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;
    return data.created_at;
  } catch (err) {
    console.error('[tierService] getOldestUsageEventSince error:', err);
    return null;
  }
}

// ============================================================
// USAGE-BASED FEATURE CHECKS
// ============================================================

// canStartInterviewSim — server-authoritative check for whether user can
// start a new interview simulation. Combines tier check + weekly usage.
//
// Returns:
//   { allowed: true, remaining?: number }  — go ahead
//   { allowed: false, reason: 'weekly-cap', nextAvailableAt?: timestamp }
export async function canStartInterviewSim(userId, userTier) {
  // Basic and Advanced: unlimited
  if (userTier === 'basic' || userTier === 'advanced') {
    return { allowed: true };
  }

  // Free tier: check weekly usage from SERVER, not localStorage
  const FREE_TIER_WEEKLY_LIMIT = 1;
  const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
  const sinceIso = new Date(Date.now() - WEEK_MS).toISOString();

  const used = await countUsageEventsSince(userId, 'interview_sim_start', sinceIso);

  if (used < FREE_TIER_WEEKLY_LIMIT) {
    return { allowed: true, remaining: FREE_TIER_WEEKLY_LIMIT - used };
  }

  // Cap hit — compute when the next slot opens (oldest sim + 7 days)
  const oldestIso = await getOldestUsageEventSince(userId, 'interview_sim_start', sinceIso);
  const nextAvailableAt = oldestIso
    ? new Date(oldestIso).getTime() + WEEK_MS
    : null;

  return {
    allowed: false,
    reason: 'weekly-cap',
    nextAvailableAt,
  };
}