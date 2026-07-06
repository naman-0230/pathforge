// dataExport.js — backup/restore/clear for everything this app keeps in
// localStorage. Deliberately generic (scans by key prefix) rather than
// hardcoding a list of known keys — problem progress keys are per-id
// (`pathforge:problem:<id>`), and other modules (revision.js, activity.js)
// may have their own key names this file was never shown. Scanning by prefix
// means Export/Import/Clear stay correct even as new features add new keys,
// without this file needing to be updated every time.

const PREFIX = 'pathforge:';

function getAllAppKeys() {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(PREFIX)) keys.push(key);
  }
  return keys;
}

// exportAllData — returns a plain object of { key: parsedValue }, suitable
// for JSON.stringify and download as a backup file.
export function exportAllData() {
  const data = {};
  for (const key of getAllAppKeys()) {
    try {
      const raw = localStorage.getItem(key);
      data[key] = raw === null ? null : JSON.parse(raw);
    } catch {
      // If a value somehow isn't valid JSON, skip it rather than corrupt
      // the whole export.
    }
  }
  return data;
}

// downloadDataAsFile — triggers a browser download of the export as a JSON
// file, named with today's date so repeated exports don't collide.
export function downloadDataAsFile() {
  const data = exportAllData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `pathforge-backup-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// importAllData — takes a parsed object (already JSON.parse'd from an
// uploaded file) and writes each key back to localStorage. Only writes keys
// that actually start with the expected prefix, so importing a malformed or
// unrelated JSON file can't pollute localStorage with arbitrary keys.
export function importAllData(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid backup file — expected a JSON object.');
  }
  let importedCount = 0;
  for (const [key, value] of Object.entries(data)) {
    if (!key.startsWith(PREFIX)) continue;
    localStorage.setItem(key, JSON.stringify(value));
    importedCount++;
  }
  return importedCount;
}

// clearAllData — wipes every pathforge: key. Used by both "Clear all
// progress" (Settings) and "Delete account" (which clears data, then also
// signs the user out at the call site).
export function clearAllData() {
  for (const key of getAllAppKeys()) {
    localStorage.removeItem(key);
  }
}