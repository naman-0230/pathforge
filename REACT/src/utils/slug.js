// slug.js — turns a section name into a URL-safe anchor id, e.g.
// "Binary Search on Answer" -> "binary-search-on-answer"
// "Monotonic Queue / Deque" -> "monotonic-queue-deque"
// "Sorting & Greedy"        -> "sorting-and-greedy"
//
// Used both when building each section's <section id={slug}> in
// TopicFundamentalsPage.jsx and when linking to it (#slug) from the table of
// contents or a future deep-link from the Dashboard — both sides call this
// same function, so they can never drift out of sync with each other.
export function slugify(str) {
  return str
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}