import { loadJSON } from './storage.js';
import { getProblemsByTopic } from '../data/problems.js';
import { topics } from '../data/topics.js';

// isProblemSolved — checks the same localStorage key ProblemPage saves progress
// under (`pathforge:problem:${id}`) and reads its isSolved flag. This is how
// Roadmap/Dashboard know which problems are actually done, without needing a
// backend yet — same "single source of truth" localStorage already gives us.
export function isProblemSolved(id) {
  const saved = loadJSON(`pathforge:problem:${id}`, null);
  return saved?.isSolved || false;
}

export function getProblemProgress(id) {
  return loadJSON(`pathforge:problem:${id}`, null);
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