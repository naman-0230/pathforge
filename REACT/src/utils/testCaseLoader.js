// testCaseLoader.js — loads test case JSON files for problems.
//
// Uses Vite's import.meta.glob to auto-discover all .json files in
// src/data/testCases/ AND any subfolders (organized by topic).
//
// FOLDER STRUCTURE:
//   src/data/testCases/
//     arrays/two-sum.json
//     arrays/contains-duplicate.json
//     strings/valid-anagram.json
//     trees/invert-binary-tree.json
//     ...
//
// Filename (minus .json) IS the problem ID. Subfolder is purely for
// organization — doesn't affect lookup. This means problem IDs must
// still be globally unique across all topics.

const TEST_CASE_MODULES = import.meta.glob('../data/testCases/**/*.json');

// Build a filename → path lookup map at module load.
// Given problem ID 'two-sum', find its full path regardless of subfolder.
const PATH_LOOKUP = {};
for (const path of Object.keys(TEST_CASE_MODULES)) {
  const match = path.match(/\/([^/]+)\.json$/);
  if (match) {
    const problemId = match[1];
    if (PATH_LOOKUP[problemId]) {
      console.warn(
        `[testCaseLoader] Duplicate problem ID "${problemId}" found. ` +
        `Existing: ${PATH_LOOKUP[problemId]}, new: ${path}. Using new.`
      );
    }
    PATH_LOOKUP[problemId] = path;
  }
}

const cache = new Map();

// ============================================================
// PUBLIC API
// ============================================================

export async function loadTestCases(problemId) {
  if (cache.has(problemId)) return cache.get(problemId);

  const path = PATH_LOOKUP[problemId];
  if (!path) {
    cache.set(problemId, null);
    return null;
  }

  const loader = TEST_CASE_MODULES[path];
  if (!loader) {
    cache.set(problemId, null);
    return null;
  }

  try {
    const module = await loader();
    const spec = module.default || module;
    cache.set(problemId, spec);
    return spec;
  } catch (err) {
    console.error(`[testCaseLoader] Failed to load ${problemId}:`, err);
    cache.set(problemId, null);
    return null;
  }
}

export function hasTestCases(problemId) {
  return !!PATH_LOOKUP[problemId];
}

export function getVisibleTestCases(spec) {
  if (!spec?.testCases) return [];
  return spec.testCases.filter((tc) => !tc.isHidden);
}

export function getHiddenTestCases(spec) {
  if (!spec?.testCases) return [];
  return spec.testCases.filter((tc) => tc.isHidden);
}

export function getAllSupportedProblemIds() {
  return Object.keys(PATH_LOOKUP);
}