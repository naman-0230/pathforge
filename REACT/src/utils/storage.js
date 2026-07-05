// storage.js — thin wrapper around localStorage.
//
// Why wrap it instead of calling localStorage directly everywhere: localStorage
// only stores strings, so every read/write needs JSON.parse/stringify, and it can
// throw (private browsing mode, storage quota, corrupted data). Wrapping it once
// here means every other file just calls loadJSON/saveJSON and never has to think
// about try/catch or JSON parsing again.
export function loadJSON(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Couldn't read "${key}" from localStorage:`, err);
    return fallback;
  }
}

export function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Couldn't save "${key}" to localStorage:`, err);
  }
}

export function removeItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.warn(`Couldn't remove "${key}" from localStorage:`, err);
  }
}