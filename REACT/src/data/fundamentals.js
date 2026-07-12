import { topics } from './topics.js';

// fundamentals.js — freeform theory content per topic/section, meant to be
// read before starting a new topic or section's problems.
//
// CONTENT STORAGE: content lives in individual .md files under
// data/fundamentals-content/[topic-key]/[section-slug].md — this makes
// writing/editing pleasant (VS Code Markdown preview, no JS escaping) and
// copy-pasting from ChatGPT is friction-free.
//
// STRUCTURE: derived from topics.js's `sections` array at runtime, so the
// two files can never drift. Add or rename a section in topics.js and this
// page picks it up automatically (falling back to a placeholder until a
// matching .md file exists).
//
// ADDING CONTENT — the entire workflow:
//   1. Find the section name in topics.js (copy it exactly)
//   2. Convert it to a filename slug using the mapping table below
//      (or just check the SECTION_SLUGS constant for the exact expected name)
//   3. Create data/fundamentals-content/[topic-key]/[slug].md
//   4. Paste your Markdown content — NO escaping, NO wrapping
//   5. Save. Reload the app. Done.
//
// No JS edits needed — the glob importer picks up new files automatically.

// ── Slug map ────────────────────────────────────────────────────────────
// Section names in topics.js contain characters that don't slugify cleanly
// (ampersands, slashes, parentheses). This map defines the EXACT filename
// expected for every section — no ambiguity, no accidental collisions.
//
// If you add a new section to topics.js, add its slug here too. Missing
// entries fall back to a naive slugify, which usually works but may not.
const SECTION_SLUGS = {
  // ── Arrays ──────────────────────────────────────────────────────────
  'Array Foundations': 'array-foundations',
  'Basics': 'basics',
  'Hashing': 'hashing',
  'Two Pointers': 'two-pointers',
  'Sliding Window': 'sliding-window',
  'Prefix Sum': 'prefix-sum',
  'Intervals': 'intervals',
  'Binary Search': 'binary-search',
  'Binary Search on Answer': 'binary-search-on-answer',
  'Sorting & Greedy': 'sorting-and-greedy',
  'Heaps': 'heaps',
  '2D Arrays': '2d-arrays',
  'Bit Manipulation': 'bit-manipulation',
  'Maths & Number Theory': 'maths-and-number-theory',

  // ── Strings ─────────────────────────────────────────────────────────
  // 'Basics', 'Hashing', 'Two Pointers', 'Sliding Window' shared above
  'Parsing & Simulation': 'parsing-and-simulation',
  'Pattern Matching': 'pattern-matching',
  'Backtracking': 'backtracking',
  'Capstone': 'capstone',

  // ── Stacks & Queues ─────────────────────────────────────────────────
  'Stack Basics': 'stack-basics',
  'Queue Basics': 'queue-basics',
  'Stack Simulation': 'stack-simulation',
  'Expression Evaluation': 'expression-evaluation',
  'Greedy Parentheses': 'greedy-parentheses',
  'Iterator / Design': 'iterator-design',
  'Monotonic Stack': 'monotonic-stack',
  'Monotonic Queue / Deque': 'monotonic-queue-deque',

  // ── Recursion & Backtracking ────────────────────────────────────────
  'Recursion Fundamentals': 'recursion-fundamentals',
  'Divide & Conquer': 'divide-and-conquer',
  'Backtracking Fundamentals': 'backtracking-fundamentals',
  'Grid & Constraint Backtracking': 'grid-and-constraint-backtracking',
  'Advanced Backtracking': 'advanced-backtracking',

  // ── Linked Lists ────────────────────────────────────────────────────
  'Singly Linked List Basics': 'singly-linked-list-basics',
  'Two Pointer Patterns': 'two-pointer-patterns',
  'In-place Pointer Manipulation': 'in-place-pointer-manipulation',
  'Recursive Linked Lists': 'recursive-linked-lists',
  'Doubly Linked Lists': 'doubly-linked-lists',
  'Sorting & Merging': 'sorting-and-merging',
  'Linked List Design': 'linked-list-design',
  'Circular Linked Lists': 'circular-linked-lists',

  // ── Trees ───────────────────────────────────────────────────────────
  'Traversals': 'traversals',
  'Tree Fundamentals': 'tree-fundamentals',
  'BFS': 'bfs',
  'DFS Path Problems': 'dfs-path-problems',
  'Tree DP': 'tree-dp',
  'Tree Relationships': 'tree-relationships',
  'Tree Views': 'tree-views',
  'BST': 'bst',
  'Tree Construction': 'tree-construction',
  'N-ary Trees': 'n-ary-trees',

  // ── Graphs ──────────────────────────────────────────────────────────
  'Graph Fundamentals': 'graph-fundamentals',
  'Grid Graphs': 'grid-graphs',
  'Graph Traversal Patterns': 'graph-traversal-patterns',
  'Topological Sort': 'topological-sort',
  'Union Find': 'union-find',
  'BFS Applications': 'bfs-applications',
  'Shortest Path Algorithms': 'shortest-path-algorithms',
  'Minimum Spanning Tree': 'minimum-spanning-tree',
  'Advanced Graph Algorithms': 'advanced-graph-algorithms',
  'Graph Capstone': 'graph-capstone',

  // ── Dynamic Programming ─────────────────────────────────────────────
  'DP Foundations': 'dp-foundations',
  '1D DP Basics': '1d-dp-basics',
  'LIS Pattern': 'lis-pattern',
  'Stock DP': 'stock-dp',
  'Knapsack DP': 'knapsack-dp',
  'Grid DP': 'grid-dp',
  'Advanced Grid DP': 'advanced-grid-dp',
  'String DP': 'string-dp',
  'Interval DP': 'interval-dp',
  'Advanced DP': 'advanced-dp',
  'DP Capstone': 'dp-capstone',
};

// Fallback slugifier for any section not in the map above. Handles the
// common cases (spaces, case, punctuation) but won't be perfect for
// unusual characters — prefer adding to SECTION_SLUGS instead.
function fallbackSlugify(name) {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\//g, '-')
    .replace(/\(|\)/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function slugForSection(sectionName) {
  return SECTION_SLUGS[sectionName] || fallbackSlugify(sectionName);
}

// ── Content loader ──────────────────────────────────────────────────────
// Vite's import.meta.glob eagerly imports every .md file under the
// fundamentals-content folder as a raw string, keyed by their file path.
// This means adding a new .md file is picked up automatically on next
// dev-server reload — no import statements to maintain.
const contentModules = import.meta.glob('./fundamentals-content/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

function getContent(topicKey, sectionName) {
  const slug = slugForSection(sectionName);
  const path = `./fundamentals-content/${topicKey}/${slug}.md`;
  return contentModules[path] || null;
}

const PLACEHOLDER = `_Fundamentals for this section haven't been written yet._`;

// getTopicFundamentals — everything TopicFundamentalsPage.jsx needs to render
// one topic's page: label/icon from topics.js, and each section in curriculum
// order with its blurb (reused from topics.js's sectionInfo, so the two pages
// stay consistent) and its content (real if a matching .md exists, placeholder
// if not).
export function getTopicFundamentals(topicKey) {
  const topic = topics.find((t) => t.key === topicKey);
  if (!topic) return null;

  return {
    key: topic.key,
    label: topic.label,
    icon: topic.icon,
    sections: topic.sections.map((sectionName) => {
      const content = getContent(topicKey, sectionName);
      return {
        name: sectionName,
        blurb: topic.sectionInfo?.[sectionName] || '',
        content: content || PLACEHOLDER,
        isPlaceholder: !content,
      };
    }),
  };
}

export function getSectionFundamentals(topicKey, sectionName) {
  const topicData = getTopicFundamentals(topicKey);
  return topicData?.sections.find((s) => s.name === sectionName) || null;
}

// listFundamentalsTopics — for the index/browse page (FundamentalsPage.jsx).
// sectionCount/writtenCount let that page show at-a-glance progress, e.g.
// "3 / 12 sections written", without needing its own separate tracking.
export function listFundamentalsTopics() {
  return topics.map((t) => {
    const writtenCount = t.sections.filter((s) => getContent(t.key, s)).length;
    return {
      key: t.key,
      label: t.label,
      icon: t.icon,
      sectionCount: t.sections.length,
      writtenCount,
    };
  });
}