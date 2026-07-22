// codeEditorState.js — localStorage helpers for the code editor.
//
// Handles per-problem, per-language code persistence, plus a few global
// preferences (last language used, split pane position).
//
// STORAGE KEYS:
//   pathforge:codeEditor:{problemId}:cpp     user's C++ code for this problem
//   pathforge:codeEditor:{problemId}:java    user's Java code
//   pathforge:codeEditor:{problemId}:python  user's Python code
//   pathforge:codeEditor:{problemId}:lastLang  which lang they last used here
//   pathforge:codeEditor:splitPosition       global % width for left column in coding mode
//   pathforge:codeEditor:globalDefaultLang   global default language (falls back to preferences.js)

import { loadJSON, saveJSON } from './storage.js';
import { getPreferences } from './preferences.js';

const KEY_PREFIX = 'pathforge:codeEditor';
const SPLIT_POSITION_KEY = `${KEY_PREFIX}:splitPosition`;
const GLOBAL_LANG_KEY = `${KEY_PREFIX}:globalDefaultLang`;

// ============================================================
// PER-PROBLEM CODE STORAGE
// ============================================================

function codeKey(problemId, language) {
  return `${KEY_PREFIX}:${problemId}:${language}`;
}

function lastLangKey(problemId) {
  return `${KEY_PREFIX}:${problemId}:lastLang`;
}

// getSavedCode — reads the user's saved code for a problem+language.
// Returns null if never edited (component should show starter code from
// the test case JSON, not empty string).
export function getSavedCode(problemId, language) {
  return loadJSON(codeKey(problemId, language), null);
}

// saveCode — persists the user's code. Called on debounced editor changes.
export function saveCode(problemId, language, code) {
  if (typeof code !== 'string') return;
  saveJSON(codeKey(problemId, language), code);
}

// resetCode — clears saved code for a problem+language. Used when user
// clicks "Reset code" button (with confirmation in the UI).
export function resetCode(problemId, language) {
  try {
    localStorage.removeItem(codeKey(problemId, language));
  } catch (e) {
    console.error('[codeEditorState] resetCode failed:', e);
  }
}

// ============================================================
// LANGUAGE PREFERENCES
// ============================================================

// getLastLanguageForProblem — which language did user last use for THIS
// problem? Falls back to global default, then to preferences.js default.
export function getLastLanguageForProblem(problemId) {
  const perProblem = loadJSON(lastLangKey(problemId), null);
  if (perProblem) return perProblem;
  const globalDefault = loadJSON(GLOBAL_LANG_KEY, null);
  if (globalDefault) return globalDefault;
  return getPreferences().defaultCodeLanguage || 'java';
}

// setLastLanguageForProblem — remembers which language was last used here.
// Also updates global default (so opening a NEW problem uses this language too).
export function setLastLanguageForProblem(problemId, language) {
  saveJSON(lastLangKey(problemId), language);
  saveJSON(GLOBAL_LANG_KEY, language);
}

// ============================================================
// SPLIT PANE POSITION (coding mode)
// ============================================================

// Split position stored as a number 25-75 representing left pane % width.
// Defaults to 40 (matches the "coding mode: 40/60" spec).
const DEFAULT_SPLIT = 40;
const MIN_SPLIT = 25;
const MAX_SPLIT = 55;

export function getSplitPosition() {
  const saved = loadJSON(SPLIT_POSITION_KEY, DEFAULT_SPLIT);
  if (typeof saved !== 'number') return DEFAULT_SPLIT;
  return Math.min(MAX_SPLIT, Math.max(MIN_SPLIT, saved));
}

export function saveSplitPosition(percent) {
  const clamped = Math.min(MAX_SPLIT, Math.max(MIN_SPLIT, Math.round(percent)));
  saveJSON(SPLIT_POSITION_KEY, clamped);
}