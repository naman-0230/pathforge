import { APTITUDE_QUESTIONS, CATEGORIES, getQuestionsByFilter, getQuestion } from '../data/aptitude/questions.js';
import { loadJSON, saveJSON } from './storage.js';
import { recordUsageEvent } from './tierService.js';

// aptitude.js — engine for aptitude add-on. Handles:
//   - Practice session generation (single-category, filterable difficulty)
//   - Test session generation (mixed OR sectional)
//   - Session grading + result persistence
//   - Per-category and per-question analytics
//
// SESSION SHAPES:
//   Practice — no timer, single-question flow, feedback per question
//   Test     — timer, batch of questions, results only at end
//
// STORAGE:
//   pathforge:aptitude:history — completed sessions (both modes)
//   pathforge:aptitude:questionStats — per-question seen/correct counts
//     Used for analytics ("your weak subcategories") and to avoid
//     repeating recently-attempted questions.

const HISTORY_KEY = 'pathforge:aptitude:history';
const QUESTION_STATS_KEY = 'pathforge:aptitude:questionStats';
const HISTORY_MAX = 50;

// ============================================================
// SESSION GENERATION
// ============================================================

// generatePracticeSession — one category, optional difficulty filter,
// N questions. Returns a session object with questions in the order they
// should be shown. Prefers questions the user hasn't seen recently.
export function generatePracticeSession({ category, subcategory = null, difficulty = 'all', count = 10 }) {
  const pool = getQuestionsByFilter({ category, subcategory, difficulty });
  if (pool.length === 0) return null;

  const stats = loadJSON(QUESTION_STATS_KEY, {});
  const shuffled = weightedShuffle(pool, stats);
  const selected = shuffled.slice(0, Math.min(count, pool.length));

  return {
    sessionId: `apt-p-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    mode: 'practice',
    category,
    difficulty,
    questions: selected,
    startedAt: null,
  };
}

// generateTestSession — timed test with either mixed or sectional format.
//   'mixed'     — questions drawn from ALL categories proportionally
//   'sectional' — all questions from ONE category (like real placement tests)
export function generateTestSession({ mode = 'mixed', category = null, durationMinutes = 30, count = 20 }) {
  let pool;
  if (mode === 'sectional' && category) {
    pool = getQuestionsByFilter({ category });
  } else {
    // Mixed: proportional draw across categories
    pool = APTITUDE_QUESTIONS;
  }

  if (pool.length < count) return null;

  const stats = loadJSON(QUESTION_STATS_KEY, {});
  const selected = balancedTestSelection(pool, count, mode, stats);

  return {
    sessionId: `apt-t-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    mode: mode === 'sectional' ? 'sectional-test' : 'mixed-test',
    category: mode === 'sectional' ? category : null,
    durationMinutes,
    durationMs: durationMinutes * 60 * 1000,
    questions: selected,
    startedAt: null,
  };
}

// balancedTestSelection — for mixed tests, distribute questions evenly
// across categories AND difficulties. Reduces "all easy quant" flukes.
function balancedTestSelection(pool, count, mode, stats) {
  if (mode === 'sectional') {
    return weightedShuffle(pool, stats).slice(0, count);
  }

  // Mixed mode: aim for roughly equal parts per category
  const categoryKeys = Object.keys(CATEGORIES);
  const perCategory = Math.floor(count / categoryKeys.length);
  const remainder = count % categoryKeys.length;

  const selected = [];
  for (let i = 0; i < categoryKeys.length; i++) {
    const cat = categoryKeys[i];
    const target = perCategory + (i < remainder ? 1 : 0);
    const catQuestions = pool.filter((q) => q.category === cat);
    const shuffled = weightedShuffle(catQuestions, stats);
    selected.push(...shuffled.slice(0, target));
  }

  // Shuffle final selection so categories interleave (better test feel)
  return shuffleArray(selected);
}

// weightedShuffle — prefers questions the user hasn't seen recently.
// Bumps unattempted questions to the front, then shuffles.
function weightedShuffle(pool, stats) {
  const unseen = pool.filter((q) => !stats[q.id]);
  const seen = pool.filter((q) => stats[q.id]);
  // Sort seen questions by last-seen ascending (oldest first = prefer older)
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

// recordSessionStart — server-side tracking. Not gated for add-on users
// (no limits), just useful for future analytics.
export async function recordSessionStart(userId, session) {
  return await recordUsageEvent(userId, 'aptitude_session_start', {
    mode: session.mode,
    category: session.category,
    questionCount: session.questions.length,
  });
}

// gradeAnswer — for a single question in practice mode. Returns whether
// correct + updates the question's stats.
export function gradeAnswer(question, selectedIndex) {
  const correct = selectedIndex === question.correctIndex;
  updateQuestionStat(question.id, correct);
  return {
    correct,
    correctIndex: question.correctIndex,
    explanation: question.explanation,
  };
}

// updateQuestionStat — increments seen count + correct count for one
// question. Called on every answer (practice + test). Used for analytics
// and question rotation.
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

// recordSessionResult — saves the full session outcome to history.
// For tests, this is the whole thing. For practice, this fires when
// user ends the session (not per-question).
export function recordSessionResult(session, answers) {
  const history = getSessionHistory();
  const correctCount = session.questions.reduce((sum, q, i) => {
    return answers[i] === q.correctIndex ? sum + 1 : sum;
  }, 0);

  // For test mode, we didn't grade per-question during the flow — do it
  // now so question stats reflect the final answers.
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
    category: session.category || 'mixed',
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

// getCategoryPerformance — aggregate correct/total per category from
// all completed sessions. Feeds the Analytics view.
export function getCategoryPerformance() {
  const stats = getQuestionStats();
  const perCategory = {
    quant: { seen: 0, correct: 0 },
    logical: { seen: 0, correct: 0 },
    verbal: { seen: 0, correct: 0 },
  };

  for (const [qId, s] of Object.entries(stats)) {
    const q = getQuestion(qId);
    if (!q || !perCategory[q.category]) continue;
    perCategory[q.category].seen += s.seen;
    perCategory[q.category].correct += s.correct;
  }

  return Object.entries(perCategory).map(([cat, s]) => ({
    category: cat,
    label: CATEGORIES[cat].label,
    icon: CATEGORIES[cat].icon,
    seen: s.seen,
    correct: s.correct,
    accuracy: s.seen > 0 ? Math.round((s.correct / s.seen) * 100) : null,
  }));
}

// getWeakSubcategories — which subcategories (percentages, series, etc.)
// the user gets wrong most. Used for "focus your practice here" hints.
export function getWeakSubcategories({ minSeen = 3, maxResults = 5 } = {}) {
  const stats = getQuestionStats();
  const bySubcategory = {};

  for (const [qId, s] of Object.entries(stats)) {
    const q = getQuestion(qId);
    if (!q || !q.subcategory) continue;
    const key = `${q.category}:${q.subcategory}`;
    if (!bySubcategory[key]) {
      bySubcategory[key] = { category: q.category, subcategory: q.subcategory, seen: 0, correct: 0 };
    }
    bySubcategory[key].seen += s.seen;
    bySubcategory[key].correct += s.correct;
  }

  return Object.values(bySubcategory)
    .filter((s) => s.seen >= minSeen)
    .map((s) => ({ ...s, accuracy: s.correct / s.seen }))
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, maxResults);
}