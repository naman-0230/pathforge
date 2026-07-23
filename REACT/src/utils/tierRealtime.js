// tierRealtime.js — Supabase Realtime subscription for user_tier.
//
// When you manually update user_tier via SQL (e.g. after verifying
// a WhatsApp payment), Realtime broadcasts the change to the user's
// browser. Their app auto-detects the update within ~1 second and
// refreshes their tier state — no reload needed.
//
// REQUIRES: Realtime enabled on user_tier table. Run this SQL once:
//   alter publication supabase_realtime add table public.user_tier;
//
// USAGE (in AppContext):
//   const unsubscribe = subscribeToTierChanges(userId, (newTierData) => {
//     setUser(prev => ({ ...prev, ...newTierData }));
//     // Show celebration toast
//   });
//   return unsubscribe; // in useEffect cleanup

import { supabase } from './supabaseClient.js';

// subscribeToTierChanges — sets up a Realtime subscription to user_tier
// rows for a specific user. Fires callback when row is UPDATED (which
// happens when you manually change their tier).
//
// Returns an unsubscribe function.
export function subscribeToTierChanges(userId, onChange) {
  if (!userId) return () => {};

  const channel = supabase
    .channel(`user_tier_${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'user_tier',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        const newRow = payload.new;
        if (!newRow) return;

        // Check if tier actually changed (avoid duplicate notifications)
        const oldRow = payload.old;
        const tierChanged = oldRow?.tier !== newRow.tier;
        const aptitudeChanged = oldRow?.aptitude_access !== newRow.aptitude_access;

        if (!tierChanged && !aptitudeChanged) return;

        onChange({
          tier: newRow.tier,
          tierExpiresAt: newRow.tier_expires_at,
          aptitudeAccess: newRow.aptitude_access,
          _wasTierUpgrade: tierChanged,
          _wasAptitudeGrant: aptitudeChanged && newRow.aptitude_access === true,
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}