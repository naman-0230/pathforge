// dataExport.js — backup/restore/clear for everything this app keeps in
// localStorage. Deliberately generic (scans by key prefix) rather than
// hardcoding a list of known keys — problem progress keys are per-id
// (`pathforge:problem:<id>`), and other modules (revision.js, activity.js)
// may have their own key names this file was never shown. Scanning by prefix
// means Export/Import/Clear stay correct even as new features add new keys,
// without this file needing to be updated every time.
//
// VERSION STAMP: exports are now wrapped in a small envelope with a version
// number and timestamp. This costs nothing today, but the moment the app
// ships anything that changes storage shape (attempts array replacing
// single-value confidence, backend migration, etc.), importAllData needs
// to know what shape the file it's reading was written in. Without a
// version stamp, old backup files become undecipherable. With one, we can
// route old-format imports through migration logic cleanly.
//
// The envelope also serves double-duty for backend migration: when users
// eventually export their local data to seed a new backend account, the
// server can accept the envelope directly and process any version.

const PREFIX = 'pathforge:';

// CURRENT_EXPORT_VERSION — bump this ONLY when the shape of individual
// stored records changes in a way that breaks reading them with the old
// import logic. Adding new pathforge:* keys does not require a bump (the
// prefix scan handles those automatically). Renaming/restructuring fields
// inside existing records DOES require a bump + a migration path in
// importAllData below.
const CURRENT_EXPORT_VERSION = 1;

function getAllAppKeys() {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(PREFIX)) keys.push(key);
  }
  return keys;
}

// collectRawData — the flat { key: parsedValue } map of localStorage
// contents. Kept as its own helper so exportAllData can wrap it in the
// versioned envelope without duplicating the collection logic.
function collectRawData() {
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

// exportAllData — returns the FULL export envelope:
//   { version, exportedAt, data: { key: parsedValue, ... } }
// Suitable for JSON.stringify and download as a backup file. The wrapper
// is what future importers will inspect to figure out how to interpret
// the payload.
export function exportAllData() {
  return {
    version: CURRENT_EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    data: collectRawData(),
  };
}

// downloadDataAsFile — triggers a browser download of the export as a JSON
// file, named with today's date so repeated exports don't collide.
export function downloadDataAsFile() {
  const envelope = exportAllData();
  const blob = new Blob([JSON.stringify(envelope, null, 2)], { type: 'application/json' });
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

// unwrapImport — accepts either the new versioned envelope OR a legacy
// flat map (pre-envelope backups written before this change), and returns
// { version, data } in a normalized shape for importAllData to consume.
//
// Detection rule: if the parsed object has BOTH a numeric `version` AND a
// `data` object, treat it as the new envelope. Otherwise assume it's a
// legacy flat map (pathforge:* keys at the top level) and coerce it into
// { version: 0, data: parsed }. Version 0 is the "no envelope existed
// yet" marker — any future migration logic can special-case it.
function unwrapImport(parsed) {
  if (
    parsed &&
    typeof parsed === 'object' &&
    typeof parsed.version === 'number' &&
    parsed.data &&
    typeof parsed.data === 'object'
  ) {
    return { version: parsed.version, data: parsed.data };
  }
  return { version: 0, data: parsed };
}

// importAllData — takes a parsed object (already JSON.parse'd from an
// uploaded file) and writes each key back to localStorage. Only writes keys
// that actually start with the expected prefix, so importing a malformed or
// unrelated JSON file can't pollute localStorage with arbitrary keys.
//
// Handles both new (envelope-wrapped, version >= 1) and legacy (flat map,
// treated as version 0) backups transparently. Future breaking-change
// migrations should branch on `version` here — e.g. if version 1's
// per-problem records get restructured for version 2, add a migrator
// that transforms version-1 records to version-2 shape before writing.
export function importAllData(parsed) {
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid backup file — expected a JSON object.');
  }
  const { version, data } = unwrapImport(parsed);
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid backup file — no data section found.');
  }
  // Reserved for future migration branches keyed on `version`. Currently
  // v0 (legacy) and v1 (current) have identical per-record shapes, so no
  // transformation is needed — same write logic handles both.
  void version;

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