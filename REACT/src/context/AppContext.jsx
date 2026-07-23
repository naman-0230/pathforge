import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { loadJSON, saveJSON } from '../utils/storage.js';
import { supabase } from '../utils/supabaseClient.js';
import { pullUserData, enableAutoSync, disableAutoSync, clearLocalData, setupPeriodicSync } from '../utils/sync.js';
import { fetchUserTier } from '../utils/tierService.js';
import { subscribeToTierChanges } from '../utils/tierRealtime.js';
import UpgradeSuccessToast from '../components/UpgradeSuccessToast';
// AppContext — now backed by real Supabase auth instead of manual
// localStorage. The `user` object reflects the actual Supabase session.
//
// TIER LOADING:
//   Tier is fetched from the RLS-protected `user_tier` table (not from
//   user_metadata, which is client-writable). While we wait for that
//   fetch, `tierLoaded` is false so tier-gated components can hold
//   their render decision and avoid flashing the wrong variant.
//
// STATE:
//   user         — { id, email, name, tier, tierExpiresAt, aptitudeAccess }
//                  or null if not logged in
//   roadmapSetup — still in localStorage (pathforge:roadmapSetup)
//   loading      — Supabase is checking for existing session on first load
//   syncing      — pulling user's data blob from Supabase after login
//   tierLoaded   — true only after fetchUserTier resolves. Components
//                  should wait for this before deciding tier-gated UI.

const AppContext = createContext(null);
const ROADMAP_SETUP_KEY = 'pathforge:roadmapSetup';

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [roadmapSetup, setRoadmapSetup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  // tierLoaded — becomes true only AFTER fetchUserTier resolves for the
  // current user. Prevents "flash of Free UI" on tier-gated components
  // while the tier is being fetched from the server. Components can
  // gate on this: `if (!tierLoaded) return null` OR show a skeleton.
  const [tierLoaded, setTierLoaded] = useState(false);

  // Prevent re-pulling the same user's blob every time Supabase emits
  // SIGNED_IN again (which can happen on tab focus / session refresh).
  const hasHydratedSessionRef = useRef(false);
  const hydratedUserIdRef = useRef(null);
    const [recentUpgrade, setRecentUpgrade] = useState(null); 

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

          // Compute shouldHydrate FIRST so we know whether this is a
          // genuine hydration event or a tab-focus echo. Only hydration
          // events should reset user state — echoes must preserve the
          // existing user (including their fetched tier) or the tier
          // will flip back to 'free' every time the tab regains focus.
          const isFirstHydration = !hasHydratedSessionRef.current;
          const isDifferentUser = hydratedUserIdRef.current !== supabaseUser.id;
          const shouldHydrate =
            event === 'INITIAL_SESSION' ||
            (event === 'SIGNED_IN' && (isFirstHydration || isDifferentUser));

          if (shouldHydrate) {
            // Real hydration — set user with 'free' default, then fetch
            // real tier from server and patch it in.
            setUser({
              id: supabaseUser.id,
              email: supabaseUser.email,
              name,
              provider: supabaseUser.app_metadata?.provider || 'email',
              tier: 'free', // temporary default until fetchUserTier resolves
              tierExpiresAt: null,
              aptitudeAccess: false,
            });

            setTierLoaded(false);
            fetchUserTier(supabaseUser.id).then((tierData) => {
              setUser((prev) => prev ? {
                ...prev,
                tier: tierData.tier,
                tierExpiresAt: tierData.tierExpiresAt,
                aptitudeAccess: tierData.aptitudeAccess,
              } : prev);
              setTierLoaded(true);
            });
          } else {
            // Tab-focus echo or token refresh for the SAME user. Don't
            // overwrite the user object — that would blow away the tier
            // we already fetched and force a "flash of free tier" until
            // the user refreshes. Just update any metadata fields that
            // might have changed (name, email) without touching tier.
            setUser((prev) => prev ? {
              ...prev,
              email: supabaseUser.email,
              name,
              provider: supabaseUser.app_metadata?.provider || 'email',
            } : prev);
          }

          if (shouldHydrate) {
            setSyncing(true);
            const pullResult = await pullUserData(supabaseUser.id);

            // Check local storage first (same-device signup flow)
            let localRoadmap = loadJSON(ROADMAP_SETUP_KEY, null);

            // If no local roadmap AND user is brand new, check user_metadata
            // for pending onboarding (cross-device signup flow — user signed up
            // on Device A, confirmed on Device B, logged in on Device C)
            if (!localRoadmap && pullResult === 'new_user') {
              const pending = supabaseUser.user_metadata?.pending_onboarding;
              if (pending) {
                saveJSON(ROADMAP_SETUP_KEY, pending);
                localRoadmap = pending;

                // Clear pending_onboarding from metadata after moving it,
                // so it doesn't get re-applied on future logins
                await supabase.auth.updateUser({
                  data: { pending_onboarding: null },
                });
              }
            }

            setRoadmapSetup(localRoadmap);

            // For new users with roadmap data, push initial blob immediately
            // so Supabase has it and future devices can pull it
            if (pullResult === 'new_user' && localRoadmap) {
              const { pushUserData } = await import('../utils/sync.js');
              await pushUserData(supabaseUser.id);
            }

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
          setTierLoaded(false);
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

  // ── Realtime tier changes subscription ─────────────────────────────
// Subscribes to updates on the user's user_tier row. When admin
// upgrades tier via SQL, this fires and updates the user's state
// live — no reload needed. Also triggers celebration toast.
useEffect(() => {
  if (!user?.id) return;

  const unsubscribe = subscribeToTierChanges(user.id, (changeData) => {
    // Update user state with new tier data
    setUser((prev) => prev ? {
      ...prev,
      tier: changeData.tier,
      tierExpiresAt: changeData.tierExpiresAt,
      aptitudeAccess: changeData.aptitudeAccess,
    } : prev);

    // Trigger celebration toast for upgrades (not downgrades or expiry)
    if (changeData._wasTierUpgrade || changeData._wasAptitudeGrant) {
      setRecentUpgrade({
        newTier: changeData.tier,
        isTierUpgrade: changeData._wasTierUpgrade,
        isAptitudeGrant: changeData._wasAptitudeGrant,
      });
    }
  });

  return () => unsubscribe();
}, [user?.id]);

  const value = {
    user,
    setUser,
    roadmapSetup,
    setRoadmapSetup,
    loading,
    syncing,
    tierLoaded,
  };

   return (
    <AppContext.Provider value={value}>
      {children}
      <UpgradeSuccessToast
        upgrade={recentUpgrade}
        onDismiss={() => setRecentUpgrade(null)}
      />
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