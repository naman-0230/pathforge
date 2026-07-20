import { getProblemsByTopic } from '../data/problems.js';
import { getTopic } from '../data/topics.js';
import { getProblemDetails } from '../data/problemDetails.js';
import { loadJSON, saveJSON } from './storage.js';

// patternEngine.js — question generation, scoring, and history for the
// Pattern Recognition Training feature.
//
// TWO QUESTION TYPES:
//   'identify-pattern' — one problem shown, user picks the pattern from 4 options
//   'match-pair'       — three problems shown, user picks the two that share a pattern
//
// WHY BOTH:
//   Identify trains recognition ("what would I use for this?").
//   Match-pair trains discrimination ("what's the shared underlying idea?").
//   Both are actual interview skills that solving-100-problems doesn't teach.
//
// PROBLEM POOL:
//   Only problems from user's SELECTED topics are used — otherwise a user
//   who deselected Trees would get Tree pattern questions they can't answer.
//   Difficulty filter is also respected.
//
// SESSION HISTORY:
//   Stored under pathforge:patternTraining:history as an array of session
//   records. Kept small (last 50 sessions) so it syncs cheaply. Consumers
//   can compute rolling stats from this without needing per-question storage.
//
// PATTERN WEAKNESS SIGNAL:
//   Every wrong answer records a per-pattern miss. Aggregated in
//   pathforge:patternTraining:patternStats — { patternName: { seen, missed } }.
//   Analytics can surface "your weakest patterns" from this later.

const HISTORY_KEY = 'pathforge:patternTraining:history';
const PATTERN_STATS_KEY = 'pathforge:patternTraining:patternStats';
const HISTORY_MAX = 50;

// ============================================================
// PUBLIC API
// ============================================================

// generateQuestions — builds an array of N questions from the given topic
// keys and difficulty filter. Mix of both question types (roughly 60/40
// identify vs match-pair). Returns [] if the pool is too small (need
// enough problems to have variety and correct answers).
export function generateQuestions({ topicKeys, difficulties, count = 10 }) {
  const pool = buildProblemPool(topicKeys, difficulties);
  if (pool.length < 6) return []; // need at least 6 problems for meaningful questions

  const patternGroups = groupByPattern(pool);
  const patternsWithEnough = Object.entries(patternGroups)
    .filter(([, probs]) => probs.length >= 2);
  if (patternsWithEnough.length < 3) return []; // need at least 3 distinct patterns

  const questions = [];
  const identifyCount = Math.ceil(count * 0.6);
  const matchCount = count - identifyCount;

  // Build identify-pattern questions
  for (let i = 0; i < identifyCount; i++) {
    const q = buildIdentifyQuestion(pool, patternGroups, patternsWithEnough);
    if (q) questions.push(q);
  }

  // Build match-pair questions
  for (let i = 0; i < matchCount; i++) {
    const q = buildMatchPairQuestion(pool, patternGroups, patternsWithEnough);
    if (q) questions.push(q);
  }

  return shuffle(questions);
}

// gradeAnswer — checks if a user's answer to a question is correct.
// For identify: correct if userAnswer matches the correct pattern string.
// For match-pair: correct if the two selected problem IDs share a pattern.
export function gradeAnswer(question, userAnswer) {
  if (question.type === 'identify-pattern') {
    return userAnswer === question.correctPattern;
  }
  if (question.type === 'match-pair') {
    // userAnswer is an array of 2 problem ids
    if (!Array.isArray(userAnswer) || userAnswer.length !== 2) return false;
    return question.correctPair.every((id) => userAnswer.includes(id));
  }
  return false;
}

// getExplanation — returns human-readable text explaining the answer.
// Used for the immediate feedback after each question.
export function getExplanation(question, userWasCorrect) {
  if (question.type === 'identify-pattern') {
    if (userWasCorrect) {
      return `Correct — "${question.problem.name}" uses ${question.correctPattern}.`;
    }
    return `The correct pattern is ${question.correctPattern}. This problem is a classic ${question.correctPattern} question.`;
  }
  if (question.type === 'match-pair') {
    const [a, b] = question.correctPair;
    const nameA = question.problems.find((p) => p.id === a)?.name;
    const nameB = question.problems.find((p) => p.id === b)?.name;
    if (userWasCorrect) {
      return `Correct — "${nameA}" and "${nameB}" both use ${question.sharedPattern}.`;
    }
    return `The matching pair was "${nameA}" and "${nameB}", both ${question.sharedPattern}.`;
  }
  return '';
}

// recordSessionResult — persists a completed session to history AND updates
// per-pattern miss stats for future analytics.
export function recordSessionResult(session) {
  // Append to history (bounded)
  const history = loadJSON(HISTORY_KEY, []);
  history.unshift({
    ...session,
    completedAt: Date.now(),
  });
  saveJSON(HISTORY_KEY, history.slice(0, HISTORY_MAX));

  // Update pattern stats
  const stats = loadJSON(PATTERN_STATS_KEY, {});
  for (const q of session.questions) {
    const pattern = q.type === 'identify-pattern' ? q.correctPattern : q.sharedPattern;
    if (!stats[pattern]) stats[pattern] = { seen: 0, missed: 0 };
    stats[pattern].seen += 1;
    if (!q.correct) stats[pattern].missed += 1;
  }
  saveJSON(PATTERN_STATS_KEY, stats);
}

export function getSessionHistory() {
  return loadJSON(HISTORY_KEY, []);
}

export function getPatternStats() {
  return loadJSON(PATTERN_STATS_KEY, {});
}

// getWeakPatterns — returns patterns where miss rate exceeds threshold AND
// seen count is high enough to be meaningful. Sorted worst-first.
export function getWeakPatterns({ minSeen = 3, minMissRate = 0.4 } = {}) {
  const stats = getPatternStats();
  return Object.entries(stats)
    .filter(([, s]) => s.seen >= minSeen && (s.missed / s.seen) >= minMissRate)
    .map(([pattern, s]) => ({
      pattern,
      seen: s.seen,
      missed: s.missed,
      missRate: s.missed / s.seen,
    }))
    .sort((a, b) => b.missRate - a.missRate);
}

// ============================================================
// QUESTION BUILDERS
// ============================================================

function buildIdentifyQuestion(pool, patternGroups, patternsWithEnough) {
  const problem = randomFrom(pool);
  if (!problem?.pattern) return null;

  const otherPatterns = patternsWithEnough
    .map(([p]) => p)
    .filter((p) => p !== problem.pattern);
  if (otherPatterns.length < 3) return null;

  const distractors = shuffle(otherPatterns).slice(0, 3);
  const options = shuffle([problem.pattern, ...distractors]);

  return {
    type: 'identify-pattern',
    problem: {
      id: problem.id,
      name: problem.name,
      difficulty: problem.difficulty,
      topicLabel: getTopic(problem.topicKey)?.label || problem.topicKey,
      statement: problem.statement,
    },
    options,
    correctPattern: problem.pattern,
  };
}

function buildMatchPairQuestion(pool, patternGroups, patternsWithEnough) {
  const [sharedPattern, sharedProblems] = randomFrom(patternsWithEnough);
  if (!sharedProblems || sharedProblems.length < 2) return null;

  const pair = shuffle(sharedProblems).slice(0, 2);

  const otherPools = Object.entries(patternGroups)
    .filter(([p]) => p !== sharedPattern)
    .flatMap(([, probs]) => probs);
  if (otherPools.length === 0) return null;
  const distractor = randomFrom(otherPools);

  const problems = shuffle([...pair, distractor]).map((p) => ({
    id: p.id,
    name: p.name,
    difficulty: p.difficulty,
    topicLabel: getTopic(p.topicKey)?.label || p.topicKey,
    statement: p.statement,
  }));

  return {
    type: 'match-pair',
    problems,
    correctPair: pair.map((p) => p.id),
    sharedPattern,
  };
}

// ============================================================
// HELPERS
// ============================================================

// buildProblemPool — collect problems from selected topics/difficulties,
// enriched with their statement (from problemDetails.js if available, or
// a synthesized one-liner otherwise). Every problem in the pool has a
// non-empty statement — meaningful pattern recognition needs the actual
// problem description, not just the name.
function buildProblemPool(topicKeys, difficulties) {
  const pool = [];
  const diffSet = new Set(difficulties && difficulties.length > 0 ? difficulties : ['Easy', 'Medium', 'Hard']);

  for (const key of topicKeys) {
    const problems = getProblemsByTopic(key);
    for (const p of problems) {
      if (!p.pattern) continue;
      if (!diffSet.has(p.difficulty)) continue;

      // Get statement from problemDetails if a full write-up exists,
      // otherwise synthesize a minimal descriptive line so we at least
      // give the user SOMETHING to reason about beyond just the name.
      const details = getProblemDetails(p.id);
      const statement = details?.statement || synthesizeStatement(p);

      pool.push({ ...p, statement });
    }
  }
  return pool;
}

// synthesizeStatement — for problems without a full write-up, generate a
// minimal descriptive line from the metadata we DO have. Not as good as a
// real statement, but "Given an array... [Easy problem about Array
// Traversal]" is meaningfully better than just the problem name for
// pattern recognition purposes.
function synthesizeStatement(problem) {
  const topic = getTopic(problem.topicKey);
  const topicName = topic?.label || problem.topicKey;
  return `A ${problem.difficulty.toLowerCase()} ${topicName} problem involving ${problem.pattern.toLowerCase()}. (See LeetCode for full description.)`;
}

function groupByPattern(problems) {
  const groups = {};
  for (const p of problems) {
    if (!groups[p.pattern]) groups[p.pattern] = [];
    groups[p.pattern].push(p);
  }
  return groups;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}