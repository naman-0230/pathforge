import { supabase } from './supabaseClient.js';
import { exportAllData, importAllData } from './dataExport.js';

// sync.js — the bridge between localStorage and Supabase.
//
// ARCHITECTURE:
//   All existing utils (progress.js, revision.js, activity.js, etc.)
//   continue reading/writing localStorage exactly as before — they are
//   completely unaware of Supabase. This file is the only place that
//   knows about both sides.
//
//   Flow:
//     Login  → pullUserData() → importAllData() → localStorage hydrated
//     Change → (debounced 3s) → exportAllData() → pushUserData() → Supabase
//     Logout → clearLocalData() → localStorage wiped
//
// CONFLICT HANDLING:
//   Last-write-wins. If the same user is logged in on two devices and
//   both save within the debounce window, one overwrites the other.
//   For a solo study tool this is acceptable — the data is personal and
//   the probability of simultaneous edits from two devices is very low.
//   The updated_at column records when each save happened.

let autoSyncTimer = null;
let autoSyncEnabled = false;

// pullUserData — fetches the user's blob from Supabase and hydrates
// localStorage. Returns 'new_user' if no row exists yet (first login
// after signup), 'ok' on success, 'error' on failure.
export async function pullUserData(userId) {
  try {
        const { data, error } = await supabase
      .from('user_data')
      .select('blob, blob_version')
      .eq('id', userId)
      .maybeSingle();

        if (error) {
      // PGRST116 = no rows found = new user, no data yet. That's fine.
      // 406 can also mean no rows when using .single() in some client versions.
      if (error.code === 'PGRST116' || error.status === 406 || error.code === '406') {
        return 'new_user';
      }
      throw error;
    }

        if (!data) {
      // No row yet — brand new user. That's fine, their first push
      // will create the row.
      return 'new_user';
    }

    if (data.blob) {
      importAllData({ version: data.blob_version ?? 1, data: data.blob });
    }

    return 'ok';
  } catch (err) {
    console.error('PathForge sync: pull failed', err);
    return 'error';
  }
}

// pushUserData — serializes all localStorage data and upserts to Supabase.
// upsert = insert if no row exists, update if it does. Safe to call
// repeatedly — idempotent, no duplicates.
export async function pushUserData(userId) {
  if (!userId) return 'no_user';

  // Verify we actually have an authenticated session before pushing.
  // If there's no session (e.g. email not confirmed yet, or token
  // expired), skip the push silently instead of hitting a 401.
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    console.warn('PathForge sync: skipping push — no active session');
    return 'no_session';
  }

  try {
    const envelope = exportAllData();

    const { error } = await supabase
      .from('user_data')
      .upsert(
        {
          id: userId,
          blob: envelope.data,
          blob_version: envelope.version,
        },
        { onConflict: 'id' }
      );

    if (error) throw error;
    return 'ok';
  } catch (err) {
    console.error('PathForge sync: push failed', err);
    return 'error';
  }
}

// clearLocalData — wipes all pathforge:* keys from localStorage.
// Called on logout and account deletion.
export function clearLocalData() {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('pathforge:')) keys.push(key);
  }
  keys.forEach((k) => localStorage.removeItem(k));
}

// triggerSync — schedules a push after a 3-second debounce. Calling this
// repeatedly (e.g. on every problem save) only results in one push 3
// seconds after the last call — no flooding the database.
export function triggerSync(userId) {
  if (!autoSyncEnabled || !userId) return;
  clearTimeout(autoSyncTimer);
  autoSyncTimer = setTimeout(() => {
    pushUserData(userId);
  }, 3000);
}

// enableAutoSync — called once after a successful login/pull. From this
// point on, triggerSync() will actually schedule pushes.
export function enableAutoSync() {
  autoSyncEnabled = true;
}

// disableAutoSync — called on logout. Cancels any pending push and
// stops future pushes until the next login.
export function disableAutoSync() {
  autoSyncEnabled = false;
  clearTimeout(autoSyncTimer);
}

// setupPeriodicSync — pushes every 5 minutes as a safety net to catch
// any writes that don't explicitly call triggerSync() — revision
// completions, fundamentals read tracking, motivation state, activity
// log updates, etc. Returns a cleanup function to stop the interval.
export function setupPeriodicSync(userId) {
  if (!userId) return () => {};
  const interval = setInterval(() => {
    if (autoSyncEnabled) pushUserData(userId);
  }, 5 * 60 * 1000);
  return () => clearInterval(interval);
}