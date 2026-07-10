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

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Persist the session in localStorage so the user stays logged in
    // across browser refreshes and tabs. Supabase handles token refresh
    // automatically before expiry — you never manage JWTs manually.
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});