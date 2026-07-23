// upgradeFlow.js — abstraction for upgrade payment flow.
//
// CURRENT: manual payment collection (UPI + WhatsApp verification).
// FUTURE: swap ADAPTER constant to 'razorpay' when payment gateway
// integration lands. Everything else stays the same.
//
// PUBLIC API:
//   CONTACT_INFO         → payment contact placeholders
//   submitUpgradeRequest → creates pending_upgrades row + returns confirmation
//   getPendingUpgrades   → fetch user's pending requests (for status display)

import { supabase } from './supabaseClient.js';

// ═══════════════════════════════════════════════════════════════
// CONTACT INFO — EDIT THESE WHEN READY TO ACCEPT PAYMENTS
// ═══════════════════════════════════════════════════════════════
export const CONTACT_INFO = {
  upi: '<YOUR_UPI_ID>',
  whatsapp: '<YOUR_WHATSAPP>',
  email: '<YOUR_EMAIL>',
  // Optional bank details for large transfers
  bankName: null,
  bankAccount: null,
  bankIfsc: null,
};

// ADAPTER — 'manual' today, 'razorpay' when integration lands.
// Change this ONE constant when ready to switch.
const ADAPTER = 'manual';

// ═══════════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════════

// submitUpgradeRequest — records the user's intent to upgrade.
//
// Manual flow: creates pending_upgrades row. You verify payment via
// WhatsApp screenshot, then manually update user_tier via SQL.
//
// Razorpay flow (future): opens Razorpay checkout, on success calls
// server webhook which upgrades tier atomically.
//
// Returns { success: bool, requestId?, error? }
export async function submitUpgradeRequest({
  userId,
  currentTier,
  currentAptitudeAccess,
  requestedTier,           // 'basic' | 'advanced' | 'aptitude_addon'
  priceInr,                // what they should pay (accounts for upgrade discount)
  transactionId,           // optional
  notes,                   // optional
}) {
  if (ADAPTER === 'manual') {
    return submitManualRequest({
      userId,
      currentTier,
      currentAptitudeAccess,
      requestedTier,
      priceInr,
      transactionId,
      notes,
    });
  }

  // Placeholder for future adapters
  return {
    success: false,
    error: `Unknown adapter: ${ADAPTER}`,
  };
}

// getPendingUpgrades — fetch user's pending requests (most recent first).
// Used in Settings to show "your upgrade request is being processed."
export async function getPendingUpgrades(userId) {
  if (!userId) return [];
  try {
    const { data, error } = await supabase
      .from('pending_upgrades')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'pending')
      .order('requested_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('[upgradeFlow] Failed to fetch pending upgrades:', err);
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════
// MANUAL ADAPTER
// ═══════════════════════════════════════════════════════════════

async function submitManualRequest({
  userId,
  currentTier,
  currentAptitudeAccess,
  requestedTier,
  priceInr,
  transactionId,
  notes,
}) {
  if (!userId) {
    return { success: false, error: 'Not logged in' };
  }

  try {
    const { data, error } = await supabase
      .from('pending_upgrades')
      .insert({
        user_id: userId,
        requested_tier: requestedTier,
        price_paid_inr: priceInr,
        transaction_id: transactionId || null,
        notes: notes || null,
        from_tier: currentTier,
        from_aptitude_access: currentAptitudeAccess || false,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      requestId: data.id,
    };
  } catch (err) {
    console.error('[upgradeFlow] Manual request failed:', err);
    return {
      success: false,
      error: err.message || 'Failed to submit request',
    };
  }
}