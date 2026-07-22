import { topics } from '../data/topics.js';
import { getProblemsByTopic, getProblem } from '../data/problems.js';
import { getProblemDetails } from '../data/problemDetails.js';
import { getTopic } from '../data/topics.js';
import { isProblemSolved } from './progress.js';
import { loadJSON, saveJSON } from './storage.js';
import { recordUsageEvent } from './tierService.js';

// customTests.js — user-defined tests with saved templates.
//
// TWO DATA STRUCTURES:
//
//   Templates (pathforge:customTests:templates)
//     User-authored test configurations they can re-run.
//     Bounded at MAX_TEMPLATES to prevent abuse.
//     Editable, deletable. Renaming preserves history association.
//
//   History (pathforge:customTests:history)
//     Completed test sessions. Each entry references the template it
//     was run from (by id) so we can show "you've taken 'Interview
//     warmup' 5 times, scores: 60% -> 80% -> 100%".
//     Bounded at MAX_HISTORY to keep the blob size sensible.
//
// TEMPLATE SHAPE:
//   {
//     id: 'tpl-...',
//     name: 'Interview warmup',
//     createdAt: 1234567890,
//     updatedAt: 1234567890,
//     config: {
//       topicKeys: ['arrays', 'strings'],
//       difficultyMix: { easy: 20, medium: 60, hard: 20 },
//       problemCount: 5,
//       durationMinutes: 30,
//       studiedOnly: true,
//       patternFilter: null,        // or a specific pattern name
//       solvedFilter: 'any',        // 'any' | 'unsolved' | 'solved'
//       randomizeOnRerun: true,     // pick new problems each run
//       pinnedProblemIds: null,     // used when randomizeOnRerun=false
//     }
//   }
//
// PINNED PROBLEMS:
//   When randomizeOnRerun is false, the FIRST run generates a set of
//   problems and stores their IDs in pinnedProblemIds. Every subsequent
//   run uses THAT same set — useful for spaced repetition ("test me on
//   these exact 5 problems every week"). Setting randomizeOnRerun=true
//   clears pinnedProblemIds.

const TEMPLATES_KEY = 'pathforge:customTests:templates';
const HISTORY_KEY = 'pathforge:customTests:history';
const MAX_TEMPLATES = 20;
const MAX_HISTORY = 50;

// ============================================================
// TEMPLATE CRUD
// ============================================================

export function getTemplates() {
  return loadJSON(TEMPLATES_KEY, []);
}

export function getTemplate(id) {
  return getTemplates().find((t) => t.id === id) || null;
}

// createTemplate — persists a new template with the given config. Assigns
// an id + timestamps. Enforces MAX_TEMPLATES ceiling by throwing if reached
// (UI should catch and show upgrade / delete-old messaging).
export function createTemplate(name, config) {
  const templates = getTemplates();
  if (templates.length >= MAX_TEMPLATES) {
    throw new Error(`Maximum of ${MAX_TEMPLATES} templates reached. Delete an old one first.`);
  }

  const now = Date.now();
  const template = {
    id: `tpl-${now}-${Math.random().toString(36).slice(2, 8)}`,
    name: name.trim(),
    createdAt: now,
    updatedAt: now,
    config: normalizeConfig(config),
  };
  templates.push(template);
  saveJSON(TEMPLATES_KEY, templates);
  return template;
}

// updateTemplate — patches an existing template. Only pass fields you want
// to change. Bumps updatedAt. Clears pinnedProblemIds if randomizeOnRerun
// flipped to true (so next run generates fresh problems).
export function updateTemplate(id, patch) {
  const templates = getTemplates();
  const idx = templates.findIndex((t) => t.id === id);
  if (idx === -1) throw new Error('Template not found');

  const existing = templates[idx];
  const nextConfig = patch.config
    ? { ...existing.config, ...normalizeConfig(patch.config) }
    : existing.config;

  // If randomize just got enabled, wipe any pinned problems
  if (existing.config.randomizeOnRerun === false && nextConfig.randomizeOnRerun === true) {
    nextConfig.pinnedProblemIds = null;
  }

  templates[idx] = {
    ...existing,
    ...patch,
    config: nextConfig,
    updatedAt: Date.now(),
  };
  saveJSON(TEMPLATES_KEY, templates);
  return templates[idx];
}

export function deleteTemplate(id) {
  const templates = getTemplates().filter((t) => t.id !== id);
  saveJSON(TEMPLATES_KEY, templates);
}

// ============================================================
// TEST SESSION GENERATION
// ============================================================

// generateSession — builds a runnable test session from a template's
// config. Returns null if the pool can't fulfill the config (e.g. user
// asks for 5 Hard sliding-window problems and only 2 exist).
//
// PINNING BEHAVIOR:
//   If template.config.randomizeOnRerun === false AND pinnedProblemIds
//   already exists, use those exact problems (in stored order). Otherwise
//   generate a fresh set and — if randomizeOnRerun is false — pin them
//   back onto the template for next time.
export function generateSession(templateId) {
  const template = getTemplate(templateId);
  if (!template) return null;

  const { config } = template;

  // Path 1: reuse pinned problems
  if (config.randomizeOnRerun === false && config.pinnedProblemIds?.length > 0) {
        const pinnedProblems = config.pinnedProblemIds
      .map((id) => getProblem(id))
      .filter(Boolean);

    if (pinnedProblems.length === config.problemCount) {
      return buildSessionObject(template, pinnedProblems);
    }
    // If pinned set is stale (problems removed from data), fall through to regenerate
  }

  // Path 2: fresh generation
  const pool = buildProblemPool(config);
  if (pool.length < config.problemCount) return null;

  const selected = pickProblems(pool, config);
  if (selected.length < config.problemCount) return null;

  // If randomize is off, pin these for next time
  if (config.randomizeOnRerun === false) {
    updateTemplate(templateId, {
      config: { ...config, pinnedProblemIds: selected.map((p) => p.id) },
    });
  }

  return buildSessionObject(template, selected);
}

// buildSessionObject — enriches raw problem objects with statement +
// examples + constraints from problemDetails, and packages into a session.
function buildSessionObject(template, problems) {
  return {
    sessionId: `ct-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    templateId: template.id,
    templateName: template.name,
    durationMs: template.config.durationMinutes * 60 * 1000,
    problemCount: problems.length,
    problems: problems.map((p) => {
      const details = getProblemDetails(p.id);
      return {
        id: p.id,
        name: p.name,
        difficulty: p.difficulty,
        topicKey: p.topicKey,
        topicLabel: getTopic(p.topicKey)?.label || p.topicKey,
        pattern: p.pattern,
        leetcode: p.leetcode,
        statement: details?.statement || `A ${p.difficulty.toLowerCase()} ${getTopic(p.topicKey)?.label} problem`,
        examples: details?.examples || [],
        constraints: details?.constraints || [],
        requiredComplexity: details?.requiredComplexity || null,
      };
    }),
    startedAt: null,
  };
}

// buildProblemPool — apply all filters from the template config to the
// full problem universe. Order of filters matters for efficiency:
//   1. Topic filter (biggest cull)
//   2. Difficulty filter (via presence in mix)
//   3. Studied-only filter (needs storage reads, so we do it after cheaper filters)
//   4. Pattern filter (single field match, cheap but rarely used)
//   5. Solved filter (needs storage reads)
function buildProblemPool(config) {
  const topicKeys = config.topicKeys && config.topicKeys.length > 0
    ? config.topicKeys
    : topics.filter((t) => t.seeded).map((t) => t.key);

  let pool = [];
  for (const key of topicKeys) {
    pool.push(...getProblemsByTopic(key));
  }

  // Difficulty filter — must appear in mix with non-zero percentage
  pool = pool.filter((p) => (config.difficultyMix[p.difficulty.toLowerCase()] || 0) > 0);

  // Pattern filter
  if (config.patternFilter) {
    pool = pool.filter((p) => p.pattern === config.patternFilter);
  }

  // Studied-only filter
  if (config.studiedOnly) {
    const studiedSections = getStudiedSectionsMap(topicKeys);
    pool = pool.filter((p) => studiedSections.get(p.topicKey)?.has(p.section));
  }

  // Solved filter
  if (config.solvedFilter === 'unsolved') {
    pool = pool.filter((p) => !isProblemSolved(p.id));
  } else if (config.solvedFilter === 'solved') {
    pool = pool.filter((p) => isProblemSolved(p.id));
  }
  // 'any' = no filter

  return pool;
}

// getStudiedSectionsMap — for the given topics, returns a Map of
// topicKey -> Set of section names the user has engaged with.
// "Engaged" = solved OR any attempt with confidence rating.
function getStudiedSectionsMap(topicKeys) {
  const map = new Map();
  for (const key of topicKeys) {
    const problems = getProblemsByTopic(key);
    const sections = new Set();
    for (const p of problems) {
      if (sections.has(p.section)) continue;
      if (isProblemSolved(p.id)) {
        sections.add(p.section);
        continue;
      }
      const record = loadJSON(`pathforge:problem:${p.id}`, null);
      if (record?.attempts?.some((a) => a.confidenceRating != null)) {
        sections.add(p.section);
      }
    }
    map.set(key, sections);
  }
  return map;
}

// pickProblems — pick N problems from the filtered pool, distributed
// according to the difficulty mix. Same algorithm as Weekly Tests but
// respects the user-configured percentages.
function pickProblems(pool, config) {
  const grouped = { Easy: [], Medium: [], Hard: [] };
  for (const p of pool) grouped[p.difficulty]?.push(p);

  shuffle(grouped.Easy);
  shuffle(grouped.Medium);
  shuffle(grouped.Hard);

  const targets = distributeMix(config.problemCount, config.difficultyMix);
  const picked = [];

  for (const [difficulty, target] of Object.entries(targets)) {
    const avail = grouped[difficulty] || [];
    picked.push(...avail.slice(0, target));
  }

  // If short of target (not enough of some difficulty), fill from anywhere
  if (picked.length < config.problemCount) {
    const remaining = pool.filter((p) => !picked.includes(p));
    picked.push(...shuffle(remaining).slice(0, config.problemCount - picked.length));
  }

  return picked.slice(0, config.problemCount);
}

// distributeMix — turn percentages into counts, using largest-remainder
// method to hit the exact total.
function distributeMix(count, mix) {
  const raw = {
    Easy: (mix.easy / 100) * count,
    Medium: (mix.medium / 100) * count,
    Hard: (mix.hard / 100) * count,
  };
  const rounded = {
    Easy: Math.floor(raw.Easy),
    Medium: Math.floor(raw.Medium),
    Hard: Math.floor(raw.Hard),
  };
  const total = rounded.Easy + rounded.Medium + rounded.Hard;
  const leftover = count - total;
  if (leftover > 0) {
    const fractions = Object.entries(raw)
      .map(([diff, val]) => ({ diff, frac: val - Math.floor(val) }))
      .sort((a, b) => b.frac - a.frac);
    for (let i = 0; i < leftover; i++) {
      rounded[fractions[i % fractions.length].diff]++;
    }
  }
  return rounded;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ============================================================
// SESSION LIFECYCLE
// ============================================================

// recordSessionStart — server-side tracking. Not currently rate-limited
// for Advanced users (unlimited), but firing the event lets us build
// per-week or per-day analytics later without schema changes.
export async function recordSessionStart(userId, session) {
  return await recordUsageEvent(userId, 'custom_test_start', {
    templateId: session.templateId,
    templateName: session.templateName,
    problemCount: session.problemCount,
  });
}

// recordSessionResult — save completed test to local history.
// recordSessionResult — save completed test to local history.
// Extended to include per-problem editor results (attempted, passed, language, etc.)
// for combined scoring + analytics.
export function recordSessionResult(session, results) {
  const history = getSessionHistory();
  const editorResults = results.perProblemEditorResults || {};

  history.unshift({
    sessionId: session.sessionId,
    templateId: session.templateId,
    templateName: session.templateName,
    completedAt: Date.now(),
    problemCount: session.problemCount,
    score: results.score,
    timeSpentMs: results.timeSpentMs,
    // Preserve editor results at session-level for trend chart queries
    perProblemEditorResults: editorResults,
    problems: session.problems.map((p) => ({
      id: p.id,
      name: p.name,
      difficulty: p.difficulty,
      topicKey: p.topicKey,
      confidenceRating: results.perProblemRatings[p.id] ?? null,
      // Snapshot editor result per-problem inside problems array too
      // (redundant with perProblemEditorResults but easier for per-problem
      // rendering in history views)
      editorResult: editorResults[p.id] || null,
    })),
  });
  saveJSON(HISTORY_KEY, history.slice(0, MAX_HISTORY));
}

export function getSessionHistory() {
  return loadJSON(HISTORY_KEY, []);
}

// getHistoryForTemplate — filter history to just runs of a given template.
// Used on the template detail view to show its performance trend.
export function getHistoryForTemplate(templateId) {
  return getSessionHistory().filter((h) => h.templateId === templateId);
}

// ============================================================
// HELPERS
// ============================================================

// normalizeConfig — fill in defaults for any missing config fields,
// clamp numeric fields to valid ranges. Applied on create AND update
// so bad input can't sneak through.
function normalizeConfig(config = {}) {
  return {
    topicKeys: Array.isArray(config.topicKeys) ? config.topicKeys : [],
    difficultyMix: {
      easy: clampPct(config.difficultyMix?.easy ?? 33),
      medium: clampPct(config.difficultyMix?.medium ?? 34),
      hard: clampPct(config.difficultyMix?.hard ?? 33),
    },
    problemCount: clamp(config.problemCount ?? 3, 2, 10),
    durationMinutes: clamp(config.durationMinutes ?? 30, 15, 180),
    studiedOnly: !!config.studiedOnly,
    patternFilter: config.patternFilter || null,
    solvedFilter: ['any', 'unsolved', 'solved'].includes(config.solvedFilter)
      ? config.solvedFilter
      : 'any',
    randomizeOnRerun: config.randomizeOnRerun !== false, // default true
    pinnedProblemIds: config.pinnedProblemIds || null,
  };
}

function clamp(n, min, max) {
  const num = Number(n);
  if (isNaN(num)) return min;
  return Math.max(min, Math.min(max, num));
}

function clampPct(n) {
  return clamp(Math.round(n), 0, 100);
}


// ============================================================
// SCORING — combines editor result + self-rating
// ============================================================

// scoreProblem — decides whether one problem counts as "passed".
// Editor result takes priority; self-rating is fallback when no editor
// attempt exists.
//
// Rules:
//   1. Editor attempted + all tests passed → PASSED
//   2. Editor attempted + any test failed → NOT PASSED (self-rating can't override)
//   3. Editor NOT attempted + self-rating >= 3 → PASSED
//   4. Otherwise → NOT PASSED
export function scoreProblem(problemId, ratings, editorResults) {
  const editorResult = editorResults?.[problemId];
  if (editorResult?.attempted) {
    return editorResult.passed === true;
  }
  const rating = ratings?.[problemId];
  return rating != null && rating >= 3;
}

// computeSessionScore — total problems passed across the session
export function computeSessionScore(problems, ratings, editorResults) {
  return problems.reduce((sum, p) => {
    return scoreProblem(p.id, ratings, editorResults) ? sum + 1 : sum;
  }, 0);
}

// ============================================================
// EDITOR ANALYTICS — for CustomTestEditorTrend chart
// ============================================================

// getEditorEngagementStats — aggregate editor stats across all sessions
export function getEditorEngagementStats() {
  const history = getSessionHistory();
  let totalProblems = 0;
  let attemptedInEditor = 0;
  let passedInEditor = 0;

  for (const session of history) {
    // Prefer session-level record, fall back to per-problem record for
    // sessions saved before the editor field existed (backwards compat)
    const results = session.perProblemEditorResults || {};

    for (const problem of session.problems || []) {
      totalProblems += 1;
      // Try session-level first, then per-problem snapshot
      const editorResult = results[problem.id] || problem.editorResult;
      if (editorResult?.attempted) {
        attemptedInEditor += 1;
        if (editorResult.passed) passedInEditor += 1;
      }
    }
  }

  return {
    totalProblems,
    attemptedInEditor,
    passedInEditor,
    engagementRate: totalProblems > 0 ? attemptedInEditor / totalProblems : 0,
    passRate: attemptedInEditor > 0 ? passedInEditor / attemptedInEditor : null,
  };
}

// getEditorTrendData — per-session pass rate for chart display,
// ordered chronologically (oldest first).
export function getEditorTrendData() {
  const history = getSessionHistory();
  return history
    .slice()
    .reverse()
    .map((session) => {
      const results = session.perProblemEditorResults || {};
      const total = (session.problems || []).length;
      let attempted = 0;
      let passed = 0;

      for (const problem of session.problems || []) {
        const editorResult = results[problem.id] || problem.editorResult;
        if (editorResult?.attempted) {
          attempted += 1;
          if (editorResult.passed) passed += 1;
        }
      }

      return {
        completedAt: session.completedAt,
        templateName: session.templateName,
        totalProblems: total,
        attemptedCount: attempted,
        passedCount: passed,
        passRate: attempted > 0 ? (passed / attempted) * 100 : null,
      };
    });
}