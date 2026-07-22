// aptitudeFundamentals.js — loads and checks aptitude fundamentals content.
//
// STUB DETECTION:
//   Stub files contain the phrase "content coming soon" so we can detect
//   them without loading content. When you write real content for a
//   subcategory, remove that phrase — the "Read fundamentals" link will
//   auto-appear in the UI.
//
// LOADING STRATEGY:
//   Uses Vite's import.meta.glob to lazy-load all markdown files at build
//   time. Same pattern as your existing DSA fundamentals if applicable.

const STUB_MARKER = 'content coming soon';

// Lazy-load all fundamentals markdown files
// eager: false → dynamic imports, loaded on demand
// as: 'raw' → get file contents as string
const FUNDAMENTALS_MODULES = import.meta.glob('../data/aptitude/fundamentals/**/*.md', {
  eager: true,
  as: 'raw',
});

// Convert glob paths to slugs
// e.g. '../data/aptitude/fundamentals/quant/percentage.md' -> 'quant:percentage'
function pathToKey(path) {
  const match = path.match(/aptitude\/fundamentals\/(\w+)\/([^/]+)\.md$/);
  if (!match) return null;
  return `${match[1]}:${match[2]}`;
}

// Build map of "category:subcategory" -> content
const FUNDAMENTALS_MAP = {};
for (const [path, content] of Object.entries(FUNDAMENTALS_MODULES)) {
  const key = pathToKey(path);
  if (key) FUNDAMENTALS_MAP[key] = content;
}

// ============================================================
// PUBLIC API
// ============================================================

// hasContent — returns true if there's real (non-stub) content for a
// subcategory. UI uses this to decide whether to show "Read fundamentals"
// links.
export function hasContent(category, subcategory) {
  const key = `${category}:${subcategory}`;
  const raw = FUNDAMENTALS_MAP[key];
  if (!raw) return false;
  return !raw.toLowerCase().includes(STUB_MARKER);
}

// getContent — returns raw markdown string for a subcategory, or null
// if no content exists (stub or missing).
export function getContent(category, subcategory) {
  const key = `${category}:${subcategory}`;
  const raw = FUNDAMENTALS_MAP[key];
  if (!raw || raw.toLowerCase().includes(STUB_MARKER)) return null;
  return raw;
}

// getContentStats — for the fundamentals hub, tells how many subcategories
// per category have real content.
export function getContentStats() {
  const stats = { quant: 0, logical: 0, verbal: 0 };
  for (const [key, raw] of Object.entries(FUNDAMENTALS_MAP)) {
    const [category] = key.split(':');
    if (!raw.toLowerCase().includes(STUB_MARKER)) {
      stats[category] = (stats[category] || 0) + 1;
    }
  }
  return stats;
}

// listAllWithStatus — returns [{category, subcategory, hasContent}] for
// every subcategory. Used by the fundamentals hub to show what's
// available vs stubbed.
export function listAllWithStatus() {
  const list = [];
  for (const [key, raw] of Object.entries(FUNDAMENTALS_MAP)) {
    const [category, subcategory] = key.split(':');
    list.push({
      category,
      subcategory,
      hasContent: !raw.toLowerCase().includes(STUB_MARKER),
    });
  }
  return list;
}