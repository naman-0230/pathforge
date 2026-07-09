import { loadJSON, saveJSON } from './storage.js';
import { getProblemsByTopic } from '../data/problems.js';
import { topics } from '../data/topics.js';

function getLocalDateStr(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function normalizeProblemRecord(record, id) {
  if (!record) return record;
  if (Array.isArray(record.attempts)) return record;

  const seededAttempt =
    record.confidenceRating != null && (record.isSolved || record.solutionEverViewed)
      ? [
          {
            date: getLocalDateStr(),
            confidenceRating: record.confidenceRating,
            timeSpentSeconds: record.timeSpentSeconds ?? null,
            hintsOpened: record.unlockedHints?.length ?? 0,
            solutionPeeked: record.solutionEverViewed ?? false,
            context: 'practice',
          },
        ]
      : [];

   // solvedAt / firstSolvedAt — if the old record was solved, we genuinely
  // don't know when (the old shape never stored a date). Set both to null
  // rather than fabricate a date. New solves going forward get real dates.
    const migrated = {
    ...record,
    attempts: seededAttempt,
    solvedAt: record.solvedAt ?? null,
    firstSolvedAt: record.firstSolvedAt ?? null,
  };
  saveJSON(`pathforge:problem:${id}`, migrated);
  return migrated;
}

// isProblemSolved — checks the same localStorage key ProblemPage saves progress
// under (`pathforge:problem:${id}`) and reads its isSolved flag. This is how
// Roadmap/Dashboard know which problems are actually done, without needing a
// backend yet — same "single source of truth" localStorage already gives us.
export function isProblemSolved(id) {
  const saved = loadJSON(`pathforge:problem:${id}`, null);
  return saved?.isSolved || false;
}

export function getProblemProgress(id) {
  const raw = loadJSON(`pathforge:problem:${id}`, null);
  return normalizeProblemRecord(raw, id);
}

// getProblemSignals — the exact inputs the weak-point scoring engine needs
// for one problem: how many hints were opened, whether the solution was ever
// peeked, what confidence rating was given, and how long the attempt took.
// Returns null/false/0 fields for a problem that was never touched (nothing
// to score there yet).
//
// timeSpentSeconds is a FROZEN snapshot — ProblemPage.jsx captures it once,
// at the moment of the first real signal (confidence rating given, or
// solution viewed), and never overwrites it again. It is NOT the live
// stopwatch value — reading a live-running timer here would be meaningless
// by the time anyone actually looks at weak-point data.
export function getProblemSignals(id) {
  const saved = getProblemProgress(id);
  return {
    hintsOpened: saved?.unlockedHints?.length ?? 0,
    solutionPeeked: saved?.solutionEverViewed ?? false,
    confidenceRating: saved?.confidenceRating ?? null,
    isSolved: saved?.isSolved ?? false,
    timeSpentSeconds: saved?.timeSpentSeconds ?? null,
    solvedAt: saved?.solvedAt ?? null,
    firstSolvedAt: saved?.firstSolvedAt ?? null,
  };
}

// getTopicStats — solved/total count for one topic, used by both the Roadmap
// topic sections and the Dashboard topic progress rows so they never disagree
// with each other (both read from the same data + localStorage).
export function getTopicStats(topicKey) {
  const topicProblems = getProblemsByTopic(topicKey);
  const solved = topicProblems.filter((p) => isProblemSolved(p.id)).length;
  return { solved, total: topicProblems.length, problems: topicProblems };
}

// getOverallProgress — the single source of truth for "X / Y problems solved
// overall" and the percent that goes with it. Both DashboardPage's "Roadmap
// progress" stat card and RoadmapPage's overall progress bar call this same
// function, so they can never disagree with each other. Seeded topics count
// their real solved/total; unseeded (upcoming) topics count 0 solved against
// their targetTotal, since that content doesn't exist yet but is still
// "part of the plan" for percent purposes.
export function getOverallProgress() {
  let totalSolved = 0;
  let totalProblems = 0;

  for (const topic of topics) {
    if (topic.seeded) {
      const stats = getTopicStats(topic.key);
      totalSolved += stats.solved;
      totalProblems += stats.total;
    } else {
      totalProblems += topic.targetTotal || 0;
    }
  }

  const percent = totalProblems > 0 ? Math.round((totalSolved / totalProblems) * 100) : 0;
  return { totalSolved, totalProblems, percent };
}

// getProblemNotes — the raw markdown string a user has written for this
// problem (or empty string if none). Read-only helper; writes go through
// ProblemPage's normal auto-save path along with everything else in the
// progress record. Kept as a separate export so consumers that ONLY need
// notes (like the "has notes?" indicator on Roadmap rows) don't have to
// pull the whole signals object.
export function getProblemNotes(id) {
  const saved = getProblemProgress(id);
  return saved?.notes ?? '';
}

// hasNotes — quick boolean for the 📝 indicator on problem rows across the
// app (Roadmap, Today's problems, Test page later). Whitespace-only strings
// count as no notes so a stray Enter keypress doesn't leave a permanent
// indicator with nothing behind it.
export function hasNotes(id) {
  const notes = getProblemNotes(id);
  return notes.trim().length > 0;
}

// getProblemAttempts — the full attempts array for a problem, newest first.
// Empty array if no concluded attempts yet. Consumers that need history or
// trend data use this; consumers that only need the current state use the
// flat fields via getProblemProgress / getProblemSignals as before.
export function getProblemAttempts(id) {
  const record = getProblemProgress(id);
  if (!record?.attempts) return [];
  return [...record.attempts].reverse();
}

// getLatestAttempt — the most recent concluded attempt, or null if none.
// Used by display consumers that need to show "last time you rated this 3/4"
// type information without knowing about the full history.
export function getLatestAttempt(id) {
  const record = getProblemProgress(id);
  if (!record?.attempts?.length) return null;
  return record.attempts[record.attempts.length - 1];
}

// getMarkedHard — whether the user flagged this problem as "hard for me,"
// independent of its data-file difficulty. This is a stronger struggle
// signal than any inferred metric (time, hints, confidence) because it's
// the user's explicit self-report. weakPoints.js can weight this heavily
// once wired up, and the Roadmap/Dashboard indicator uses it directly.
export function getMarkedHard(id) {
  const saved = getProblemProgress(id);
  return saved?.markedHard === true;
}