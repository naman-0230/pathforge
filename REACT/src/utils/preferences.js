import { loadJSON, saveJSON } from './storage.js';

// preferences.js — one place for every "how the app behaves" toggle that
// isn't per-problem progress and isn't the onboarding/roadmap setup (that
// stays in AppContext's roadmapSetup, since roadmapGenerator.js already reads
// it directly). Everything here is read fresh from localStorage on demand
// (getPreferences()) rather than kept in React context, since most consumers
// (ProblemPage, weakPoints.js, revision.js) just need a one-off read at
// render/compute time, not live reactivity across tabs.

const PREFERENCES_KEY = 'pathforge:preferences';

// REVISION_PRESETS — three named tuning profiles + Custom. `preset: 'custom'`
// means "ignore these values, use the individual `sectionCompleteInterval` etc.
// fields below." Anything else means "these values ARE the individual fields,
// updated whenever a preset is picked so the Custom view shows what the
// preset actually resolves to."
export const REVISION_PRESETS = {
  aggressive: {
    sectionCompleteInterval: 2,
    stuckThresholdDays: 3,
    longRunningThresholdDays: 10,
    manualFlagInterval: 1,
    problemsPerSession: 5,
  },
  balanced: {
    sectionCompleteInterval: 4,
    stuckThresholdDays: 5,
    longRunningThresholdDays: 14,
    manualFlagInterval: 2,
    problemsPerSession: 3,
  },
  relaxed: {
    sectionCompleteInterval: 7,
    stuckThresholdDays: 10,
    longRunningThresholdDays: 21,
    manualFlagInterval: 4,
    problemsPerSession: 2,
  },
};

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
    // Named preset the user selected — 'aggressive' | 'balanced' | 'relaxed'
    // | 'custom'. Anything but 'custom' means the tuning fields below MUST
    // equal the corresponding REVISION_PRESETS[preset] values (SettingsPage
    // keeps them in sync when a preset is picked). This redundancy is
    // intentional: revision.js just reads the tuning fields directly, so it
    // doesn't need to know or care about preset names.
    preset: 'balanced',
    sectionCompleteInterval: 4, // days
    stuckThresholdDays: 5, // days idle before section is "stuck"
    longRunningThresholdDays: 14, // days in-progress before "long-running"
    manualFlagInterval: 2, // days for first review after flagging
    problemsPerSession: 3, // target problem count per section revision
  },
  weakPoints: {
    sensitivity: 'medium', // 'low' | 'medium' | 'high'
    showCallouts: true,
  },
    motivation: {
    showGreeting: true,
    streakFreeze: false,
  },
  adaptive: {
    // adaptiveEngine.js reads this: when false, no automatic difficulty
    // adjustments (accelerate/ease/boss-unlock) are applied. Existing
    // adjustments already in the roadmap state STAY until the user clicks
    // "Recalculate ⚡" — turning this off just stops NEW adjustments, it
    // doesn't retroactively wipe past ones.
    enabled: true,
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
    adaptive: { ...defaultPreferences.adaptive, ...(saved?.adaptive || {}) },
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