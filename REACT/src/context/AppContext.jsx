import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { loadJSON, saveJSON } from '../utils/storage.js';
import { supabase } from '../utils/supabaseClient.js';
import { pullUserData, enableAutoSync, disableAutoSync, clearLocalData, setupPeriodicSync } from '../utils/sync.js';

// AppContext — now backed by real Supabase auth instead of manual
// localStorage. The `user` object reflects the actual Supabase session.
//
// STATE:
//   user         — { id, email, name } from Supabase session + metadata,
//                  or null if not logged in
//   roadmapSetup — still stored in localStorage (pathforge:roadmapSetup),
//                  loaded on mount, saved on change. Gets synced to
//                  Supabase as part of the blob on every triggerSync() call.
//   loading      — true while Supabase is checking for an existing session
//                  on first app load. Prevents flash of empty/wrong state.
//   syncing      — true while pulling the user's data blob from Supabase
//                  after login. Prevents dashboard rendering before data
//                  is hydrated into localStorage.

const AppContext = createContext(null);
const ROADMAP_SETUP_KEY = 'pathforge:roadmapSetup';

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [roadmapSetup, setRoadmapSetup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // Prevent re-pulling the same user's blob every time Supabase emits
  // SIGNED_IN again (which can happen on tab focus / session refresh).
  const hasHydratedSessionRef = useRef(false);
  const hydratedUserIdRef = useRef(null);

  // ── Roadmap setup persistence ──────────────────────────────────────────
  // This still lives in localStorage because it's part of the blob that
  // gets synced to Supabase. No change to how it works.
  useEffect(() => {
    if (roadmapSetup !== null) {
      saveJSON(ROADMAP_SETUP_KEY, roadmapSetup);
    }
  }, [roadmapSetup]);

  // ── Auth state listener ────────────────────────────────────────────────
  // onAuthStateChange fires on:
  //   INITIAL_SESSION — app just loaded, Supabase found a stored session
  //   SIGNED_IN       — user just logged in or session was refreshed
  //   SIGNED_OUT      — user logged out or session expired
  //   TOKEN_REFRESHED — Supabase auto-refreshed the JWT (transparent)
  //
  // This is the single source of truth for who is logged in.
  useEffect(() => {
       const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const supabaseUser = session.user;
          const name = supabaseUser.user_metadata?.name
            || supabaseUser.user_metadata?.full_name
            || supabaseUser.email?.split('@')[0]
            || 'User';

          setUser({
            id: supabaseUser.id,
            email: supabaseUser.email,
            name,
            provider: supabaseUser.app_metadata?.provider || 'email',
          });

          // Only hydrate localStorage from Supabase when:
          //   1. app first restores a session (INITIAL_SESSION)
          //   2. a genuinely different user signs in
          //
          // Supabase can emit SIGNED_IN again on tab focus / session sync
          // between tabs. We do NOT want to show the big syncing screen
          // or re-pull the same blob in that case.
          const isFirstHydration = !hasHydratedSessionRef.current;
          const isDifferentUser = hydratedUserIdRef.current !== supabaseUser.id;
          const shouldHydrate =
            event === 'INITIAL_SESSION' ||
            (event === 'SIGNED_IN' && (isFirstHydration || isDifferentUser));

          if (shouldHydrate) {
            setSyncing(true);
            await pullUserData(supabaseUser.id);
            setRoadmapSetup(loadJSON(ROADMAP_SETUP_KEY, null));
            enableAutoSync();
            setupPeriodicSync(supabaseUser.id);
            hydratedUserIdRef.current = supabaseUser.id;
            hasHydratedSessionRef.current = true;
            setSyncing(false);
          } else if (roadmapSetup === null) {
            // No re-pull needed, but still ensure roadmapSetup exists from
            // whatever is already in localStorage.
            setRoadmapSetup(loadJSON(ROADMAP_SETUP_KEY, null));
            enableAutoSync();
          }
        } else {
          // No session — user is logged out
          setUser(null);
          setRoadmapSetup(null);
          disableAutoSync();
          hasHydratedSessionRef.current = false;
          hydratedUserIdRef.current = null;
        }

        setLoading(false);
      }
    );

    // Cleanup: unsubscribe when AppProvider unmounts (app closes)
    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    setUser,
    roadmapSetup,
    setRoadmapSetup,
    loading,
    syncing,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used inside an <AppProvider>');
  }
  return context;
}