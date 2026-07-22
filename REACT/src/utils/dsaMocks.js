import { DSA_MOCK_QUESTIONS, DSA_MOCK_CATEGORIES, getQuestionsByFilter, getQuestion } from '../data/dsaMocks/questions.js';
import { loadJSON, saveJSON } from './storage.js';
import { recordUsageEvent } from './tierService.js';

// dsaMocks.js — engine for the DSA Mock Tests feature. Mirror of aptitude.js:
//   - Practice session generation (topic + optional subcategory + goal mode filters)
//   - Test session generation (mixed OR sectional)
//   - Session grading + persistence
//   - Per-topic and per-section analytics
//
// SESSION SHAPES:
//   Practice — free navigation, per-Q feedback, submit anytime
//   Test     — timer, all-questions visible, submit-only feedback
//
// STORAGE (localStorage):
//   pathforge:dsaMocks:history           completed sessions (last 50)
//   pathforge:dsaMocks:questionStats     per-question seen/correct/lastSeenAt
//
// SERVER TRACKING (via existing user_usage table — no schema changes):
//   event_type: 'dsa_mock_session_start'
//   metadata:   { mode, topicKey, subcategory, goalMode, questionCount, difficulty }
//
// Why a separate module (not refactoring aptitude.js): keeping two parallel
// engines is uglier but safer. Aptitude ships to real users; touching it to
// generalize risks regressions. When both features have proven stable, they
// can be merged into a shared session engine.

const HISTORY_KEY = 'pathforge:dsaMocks:history';
const QUESTION_STATS_KEY = 'pathforge:dsaMocks:questionStats';
const HISTORY_MAX = 50;

// ============================================================
// SESSION GENERATION
// ============================================================

// generatePracticeSession — one topic (or 'all'), optional subcategory,
// optional difficulty, optional goal mode filter. Returns session object
// with questions in the order they should be shown. Prefers questions the
// user hasn't seen recently (weighted shuffle).
export function generatePracticeSession({
  topicKey,
  subcategory = null,
  difficulty = 'all',
  goalMode = 'all',
  count = 10,
}) {
  const pool = getQuestionsByFilter({
    category: topicKey,
    subcategory,
    difficulty,
    goalMode,
  });
  if (pool.length === 0) return null;

  const stats = loadJSON(QUESTION_STATS_KEY, {});
  const shuffled = weightedShuffle(pool, stats);
  const selected = shuffled.slice(0, Math.min(count, pool.length));

  return {
    sessionId: `dsa-p-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    mode: 'practice',
    topicKey,
    subcategory,
    difficulty,
    goalMode,
    questions: selected,
    startedAt: null,
  };
}

// generateTestSession — timed test.
//   'mixed'     — questions from ALL topics, balanced across topics
//   'sectional' — all questions from one topic (optionally one subcategory)
export function generateTestSession({
  mode = 'mixed',
  topicKey = null,
  subcategory = null,
  goalMode = 'all',
  durationMinutes = 15,
  count = 20,
}) {
  let pool;
  if (mode === 'sectional' && topicKey) {
    pool = getQuestionsByFilter({ category: topicKey, subcategory, goalMode });
  } else {
    pool = getQuestionsByFilter({ goalMode });
  }

  if (pool.length < Math.min(count, 5)) return null;

  const stats = loadJSON(QUESTION_STATS_KEY, {});
  const selected = balancedTestSelection(pool, count, mode, stats);

  return {
    sessionId: `dsa-t-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    mode: mode === 'sectional' ? 'sectional-test' : 'mixed-test',
    topicKey: mode === 'sectional' ? topicKey : null,
    subcategory: mode === 'sectional' ? subcategory : null,
    goalMode,
    durationMinutes,
    durationMs: durationMinutes * 60 * 1000,
    questions: selected,
    startedAt: null,
  };
}

// balancedTestSelection — for mixed tests, distribute questions evenly
// across topics AND difficulty. Reduces "all easy Arrays" flukes.
function balancedTestSelection(pool, count, mode, stats) {
  if (mode === 'sectional') {
    return weightedShuffle(pool, stats).slice(0, count);
  }

  // Mixed: aim for roughly equal parts per topic
  const topicKeys = Object.keys(DSA_MOCK_CATEGORIES);
  const perTopic = Math.floor(count / topicKeys.length);
  const remainder = count % topicKeys.length;

  const selected = [];
  for (let i = 0; i < topicKeys.length; i++) {
    const tk = topicKeys[i];
    const target = perTopic + (i < remainder ? 1 : 0);
    const topicQuestions = pool.filter((q) => q.category === tk);
    const shuffled = weightedShuffle(topicQuestions, stats);
    selected.push(...shuffled.slice(0, target));
  }

  // Shuffle final order so topics interleave (better test feel)
  return shuffleArray(selected);
}

// weightedShuffle — prefers questions the user hasn't seen recently.
// Unseen questions go first, then seen ones sorted by oldest-seen-first.
function weightedShuffle(pool, stats) {
  const unseen = pool.filter((q) => !stats[q.id]);
  const seen = pool.filter((q) => stats[q.id]);
  seen.sort((a, b) => (stats[a.id].lastSeenAt || 0) - (stats[b.id].lastSeenAt || 0));
  return [...shuffleArray(unseen), ...seen];
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ============================================================
// SESSION LIFECYCLE
// ============================================================

// recordSessionStart — server-side event tracking via existing user_usage
// table (no new table needed). Safe to fire-and-forget; failure doesn't
// block the user.
export async function recordSessionStart(userId, session) {
  return await recordUsageEvent(userId, 'dsa_mock_session_start', {
    mode: session.mode,
    topicKey: session.topicKey,
    subcategory: session.subcategory,
    goalMode: session.goalMode,
    questionCount: session.questions.length,
    difficulty: session.difficulty || 'all',
  });
}

// gradeAnswer — for a single question in practice mode. Returns correctness
// + updates that question's stats.
export function gradeAnswer(question, selectedIndex) {
  const correct = selectedIndex === question.correctIndex;
  updateQuestionStat(question.id, correct);
  return {
    correct,
    correctIndex: question.correctIndex,
    explanation: question.explanation,
  };
}

function updateQuestionStat(questionId, correct) {
  const stats = loadJSON(QUESTION_STATS_KEY, {});
  if (!stats[questionId]) {
    stats[questionId] = { seen: 0, correct: 0, lastSeenAt: 0 };
  }
  stats[questionId].seen += 1;
  if (correct) stats[questionId].correct += 1;
  stats[questionId].lastSeenAt = Date.now();
  saveJSON(QUESTION_STATS_KEY, stats);
}

// recordSessionResult — saves final session outcome to history. Called
// once when the user submits. For test mode, we also grade each answer
// here (since practice grades in-flight but test doesn't).
export function recordSessionResult(session, answers) {
  const history = getSessionHistory();
  const correctCount = session.questions.reduce((sum, q, i) => {
    return answers[i] === q.correctIndex ? sum + 1 : sum;
  }, 0);

  if (session.mode !== 'practice') {
    session.questions.forEach((q, i) => {
      if (answers[i] != null) {
        updateQuestionStat(q.id, answers[i] === q.correctIndex);
      }
    });
  }

  history.unshift({
    sessionId: session.sessionId,
    mode: session.mode,
    topicKey: session.topicKey || 'mixed',
    subcategory: session.subcategory || null,
    goalMode: session.goalMode || 'all',
    completedAt: Date.now(),
    questionCount: session.questions.length,
    correctCount,
    timeSpentMs: session.timeSpentMs || 0,
    questionIds: session.questions.map((q) => q.id),
    answers,
  });
  saveJSON(HISTORY_KEY, history.slice(0, HISTORY_MAX));
}

export function getSessionHistory() {
  return loadJSON(HISTORY_KEY, []);
}

export function getQuestionStats() {
  return loadJSON(QUESTION_STATS_KEY, {});
}

// ============================================================
// ANALYTICS
// ============================================================

// getTopicPerformance — per-topic seen/correct aggregation. Feeds the
// Analytics view.
export function getTopicPerformance() {
  const stats = getQuestionStats();
  const perTopic = {};
  for (const key of Object.keys(DSA_MOCK_CATEGORIES)) {
    perTopic[key] = { seen: 0, correct: 0 };
  }

  for (const [qId, s] of Object.entries(stats)) {
    const q = getQuestion(qId);
    if (!q || !perTopic[q.category]) continue;
    perTopic[q.category].seen += s.seen;
    perTopic[q.category].correct += s.correct;
  }

  return Object.entries(perTopic).map(([tk, s]) => {
    const info = DSA_MOCK_CATEGORIES[tk];
    return {
      topicKey: tk,
      label: info.label,
      icon: info.icon,
      seen: s.seen,
      correct: s.correct,
      accuracy: s.seen > 0 ? Math.round((s.correct / s.seen) * 100) : null,
    };
  });
}

// getWeakSubcategories — which sections user gets wrong most. Deep-links
// from Analytics into the topic picker with that section preselected.
export function getWeakSubcategories({ minSeen = 3, maxResults = 5 } = {}) {
  const stats = getQuestionStats();
  const bySection = {};

  for (const [qId, s] of Object.entries(stats)) {
    const q = getQuestion(qId);
    if (!q || !q.subcategory) continue;
    const key = `${q.category}:${q.subcategory}`;
    if (!bySection[key]) {
      bySection[key] = {
        topicKey: q.category,
        subcategory: q.subcategory,
        seen: 0,
        correct: 0,
      };
    }
    bySection[key].seen += s.seen;
    bySection[key].correct += s.correct;
  }

  return Object.values(bySection)
    .filter((s) => s.seen >= minSeen)
    .map((s) => ({ ...s, accuracy: s.correct / s.seen }))
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, maxResults);
}

// getGoalModePerformance — split analytics by interview / viva / general
// so the user sees "you're 80% on interview questions, 45% on viva."
export function getGoalModePerformance() {
  const stats = getQuestionStats();
  const perMode = {
    interview: { seen: 0, correct: 0 },
    viva: { seen: 0, correct: 0 },
    general: { seen: 0, correct: 0 },
  };

  for (const [qId, s] of Object.entries(stats)) {
    const q = getQuestion(qId);
    if (!q) continue;
    for (const mode of q.goalModes || []) {
      if (perMode[mode]) {
        perMode[mode].seen += s.seen;
        perMode[mode].correct += s.correct;
      }
    }
  }

  return Object.entries(perMode).map(([mode, s]) => ({
    mode,
    seen: s.seen,
    correct: s.correct,
    accuracy: s.seen > 0 ? Math.round((s.correct / s.seen) * 100) : null,
  }));
}