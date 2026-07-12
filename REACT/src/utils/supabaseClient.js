import { createClient } from '@supabase/supabase-js';

// supabaseClient.js — the single configured Supabase client instance.
//
// VITE_* prefix is required for Vite to expose env vars to the browser.
// The anon key is safe here because Row Level Security on every table
// ensures users can only access their own data — the key identifies the
// PROJECT, not the user. The user is identified by their session JWT,
// which Supabase attaches to every request automatically.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. ' +
    'Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file.'
  );
}

// ── "Keep me signed in" support ─────────────────────────────────────────
// Uses a custom storage adapter that dynamically picks localStorage
// (persistent — session survives browser close) or sessionStorage
// (ephemeral — session dies with the tab) based on the user's preference,
// which is itself persisted in localStorage.
//
// FLOW:
//   1. User checks/unchecks "Keep me signed in" on LoginPage.
//   2. Before calling signInWithPassword, LoginPage writes the boolean to
//      localStorage under KEEP_SIGNED_IN_KEY.
//   3. Supabase writes the new session token via our storage adapter's
//      setItem — which checks the preference and routes the token to
//      localStorage OR sessionStorage accordingly.
//   4. On subsequent page loads / requests, getItem checks BOTH storages
//      (localStorage first, then sessionStorage) so the session is found
//      regardless of where it was written.
//
// DEFAULT: keepSignedIn = true. Most users on personal devices prefer to
// stay signed in; those who don't will explicitly uncheck it.
export const KEEP_SIGNED_IN_KEY = 'pathforge:keepSignedIn';

function shouldPersist() {
  try {
    const pref = localStorage.getItem(KEEP_SIGNED_IN_KEY);
    // null = never set = default true (persistent)
    return pref === null ? true : pref === 'true';
  } catch {
    // localStorage unavailable (private mode, etc) — fall back to session
    return false;
  }
}

const dynamicStorage = {
  getItem: (key) => {
    try {
      // Prefer localStorage (persistent sessions), fall back to sessionStorage.
      // Order matters: if user was previously "keep me signed in" and switched
      // it off, the old localStorage token might linger until they log out
      // and back in. Reading localStorage first ensures they stay logged in
      // during that transition instead of getting mysteriously kicked out.
      const local = localStorage.getItem(key);
      if (local !== null) return local;
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },

  setItem: (key, value) => {
    try {
      if (shouldPersist()) {
        localStorage.setItem(key, value);
        // Clear the OTHER storage so we don't have stale tokens hanging around
        sessionStorage.removeItem(key);
      } else {
        sessionStorage.setItem(key, value);
        localStorage.removeItem(key);
      }
    } catch (err) {
      console.warn('PathForge auth: storage write failed', err);
    }
  },

  removeItem: (key) => {
    try {
      // Clear from both — logout/session-end should be thorough
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    } catch {
      /* noop */
    }
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Custom storage adapter — see comments above. Persists the session in
    // localStorage (default) OR sessionStorage (if user unchecked "Keep me
    // signed in" on last login). Supabase handles token refresh
    // automatically before expiry — you never manage JWTs manually.
    storage: dynamicStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});