import { loadJSON, saveJSON } from './storage.js';

// preferences.js — one place for every "how the app behaves" toggle that
// isn't per-problem progress and isn't the onboarding/roadmap setup (that
// stays in AppContext's roadmapSetup, since roadmapGenerator.js already reads
// it directly). Everything here is read fresh from localStorage on demand
// (getPreferences()) rather than kept in React context, since most consumers
// (ProblemPage, weakPoints.js, revision.js) just need a one-off read at
// render/compute time, not live reactivity across tabs.

const PREFERENCES_KEY = 'pathforge:preferences';

export const defaultPreferences = {
  defaultCodeLanguage: 'java', // 'java' | 'cpp' | 'python'
  gate: {
    enabled: true,
    minSeconds: 180,
    scaleByDifficulty: true, // Easy/Medium/Hard get shorter/longer minimums
    bypassIfAlreadyDone: true, // don't re-gate a problem you've already solved or viewed
  },
  revision: {
    dailyGoal: 5,
    weakTopicsPriority: true,
  },
  weakPoints: {
    sensitivity: 'medium', // 'low' | 'medium' | 'high'
    showCallouts: true,
  },
  motivation: {
    showGreeting: true,
    streakFreeze: false,
  },
  timezone: (() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return 'UTC';
    }
  })(),
};

// Shallow-merging saved prefs on top of defaults isn't enough — a saved
// object missing a newly-added nested field (e.g. someone saved prefs before
// `gate.bypassIfAlreadyDone` existed) would silently drop that field instead
// of falling back to its default. Merge one level deep into each known
// nested group instead.
function mergeWithDefaults(saved) {
  return {
    ...defaultPreferences,
    ...saved,
    gate: { ...defaultPreferences.gate, ...(saved?.gate || {}) },
    revision: { ...defaultPreferences.revision, ...(saved?.revision || {}) },
    weakPoints: { ...defaultPreferences.weakPoints, ...(saved?.weakPoints || {}) },
    motivation: { ...defaultPreferences.motivation, ...(saved?.motivation || {}) },
  };
}

export function getPreferences() {
  return mergeWithDefaults(loadJSON(PREFERENCES_KEY, {}));
}

export function savePreferences(prefs) {
  saveJSON(PREFERENCES_KEY, prefs);
}

export function resetPreferences() {
  saveJSON(PREFERENCES_KEY, defaultPreferences);
  return defaultPreferences;
}