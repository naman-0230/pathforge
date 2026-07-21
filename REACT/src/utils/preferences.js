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
    enabled: true,
  },
  approach: {
    // When true, opening a solution with an empty approach shows the
    // "Sketch your approach first?" nudge modal. Off = solution opens
    // immediately regardless of whether an approach was written.
    // Default on because that's what makes the feature valuable — the
    // whole point of the panel is the "write before viewing" habit, and
    // most users won't do it if the nudge isn't there. Users who find
    // it annoying can turn it off in Settings.
    promptIfEmpty: true,
  },
    failureArchive: {
    // When true, opening a solution prompts a one-tap "what made you
    // open this?" question BEFORE the solution renders. Data feeds the
    // Analytics "Why you open solutions" chart, which is one of the more
    // actionable insights the app produces ("72% pattern-recognition
    // failures → do more pattern training"). Default on because the data
    // value is high and the friction is low (one tap or skip); users who
    // find the modal annoying can turn it off here.
    promptOnPeek: true,
  },
    reminders: {
    // Master switch. When false, all reminders are silenced regardless
    // of individual reminder enabled flags. Useful for "vacation mode"
    // without deleting individual reminders.
    enabled: true,

    // Whether to attempt browser notifications (Notification API). Even
    // when true, the browser may deny — in-app banners work regardless
    // as long as the app is open at reminder time. Requested via a
    // permission prompt on first-enable, not automatically.
    browserNotifications: false,

    // The actual reminder list. Each entry:
    //   {
    //     id            string, uuid-ish
    //     type          'daily' | 'weekly' | 'streak-protect'
    //     enabled       bool
    //     time          'HH:MM' string (24h)
    //     dayOfWeek     0-6 (Sun-Sat), only used for 'weekly'
    //     problemCount  number, only used for 'daily' (auto-complete threshold)
    //     label         string (short display name)
    //   }
    //
    // Cap of 5 reminders enforced in the UI (Settings).
    items: [],
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
    approach: { ...defaultPreferences.approach, ...(saved?.approach || {}) },
        failureArchive: { ...defaultPreferences.failureArchive, ...(saved?.failureArchive || {}) },
    reminders: {
      ...defaultPreferences.reminders,
      ...(saved?.reminders || {}),
      items: Array.isArray(saved?.reminders?.items) ? saved.reminders.items : [],
    },
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