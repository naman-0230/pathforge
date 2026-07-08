import { topics } from './topics.js';

// fundamentals.js — freeform theory content per topic/section, meant to be
// read before starting a new topic or section's problems.
//
// KEY DESIGN CHOICE: the topic/section STRUCTURE below is not hand-duplicated
// from topics.js — getTopicFundamentals() derives it live from topics.js's
// own `sections` array every time it's called. Only the actual markdown
// CONTENT lives in this file, in `contentByTopic` below. This means the two
// files can never silently drift out of sync the way problems.js/topics.js
// almost did earlier — add or rename a section in topics.js, and this page
// picks it up automatically (falling back to a placeholder until you paste
// real content in for it).
//
// TO ADD CONTENT: find the topic below, add a key matching the section name
// EXACTLY as it appears in topics.js's `sections` array (copy-paste it to be
// safe), and paste in a markdown string. That's the entire process — nothing
// else needs to change.
//
// Example:
//   arrays: {
//     "Basics": `## Arrays: The Basics\n\nAn array is...`,
//     "Hashing": `## Hashing\n\n...`,
//   },

const PLACEHOLDER = `_Fundamentals for this section haven't been written yet._`;

const contentByTopic = {
  arrays: {
    // "Basics": ``,
    // "Hashing": ``,
    // "Two Pointers": ``,
    // "Sliding Window": ``,
    // "Prefix Sum": ``,
    // "Binary Search": ``,
    // "Binary Search on Answer": ``,
    // "Sorting & Greedy": ``,
    // "Heaps": ``,
    // "2D Arrays": ``,
    // "Bit Manipulation": ``,
    // "Maths & Number Theory": ``,
  },
  strings: {
    // "Basics": ``,
    // "Hashing": ``,
    // "Two Pointers": ``,
    // "Sliding Window": ``,
    // "Advanced": ``,
  },
  'stacks-queues': {
    // "Stack Basics": ``,
    // "Queue Basics": ``,
    // "Stack Applications": ``,
    // "Monotonic Stack": ``,
    // "Monotonic Queue / Deque": ``,
  },
  recursion: {
    // "Recursion Fundamentals": ``,
    // "Divide and Conquer": ``,
    // "Backtracking Fundamentals": ``,
    // "Constraint Backtracking": ``,
  },
  'linked-lists': {
    // "Basics": ``,
    // "Pointer Patterns": ``,
    // "In-place Manipulation": ``,
    // "Recursive Linked Lists": ``,
    // "Advanced": ``,
  },
  trees: {
    // "Foundations": ``,
    // "DFS Traversals": ``,
    // "BFS": ``,
    // "DFS Problem Solving": ``,
    // "BST": ``,
    // "Tree Construction": ``,
    // "Advanced Trees": ``,
  },
  graphs: {
    // "Graph Basics": ``,
    // "Traversal Applications": ``,
    // "Shortest Paths": ``,
    // "MST": ``,
    // "Advanced": ``,
  },
  dp: {
    // "DP Fundamentals": ``,
    // "Linear DP": ``,
    // "Knapsack Family": ``,
    // "Grid DP": ``,
    // "String DP": ``,
    // "Interval DP": ``,
    // "Tree DP": ``,
    // "Advanced DP (Optional)": ``,
  },
};

// getTopicFundamentals — everything TopicFundamentalsPage.jsx needs to render
// one topic's page: label/icon from topics.js, and each section in curriculum
// order with its blurb (reused from topics.js's sectionInfo, so the two pages
// stay consistent) and its content (real if pasted in above, placeholder if not).
export function getTopicFundamentals(topicKey) {
  const topic = topics.find((t) => t.key === topicKey);
  if (!topic) return null;

  const overrides = contentByTopic[topicKey] || {};

  return {
    key: topic.key,
    label: topic.label,
    icon: topic.icon,
    sections: topic.sections.map((sectionName) => ({
      name: sectionName,
      blurb: topic.sectionInfo?.[sectionName] || '',
      content: overrides[sectionName] || PLACEHOLDER,
      isPlaceholder: !overrides[sectionName],
    })),
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
    const overrides = contentByTopic[t.key] || {};
    const writtenCount = t.sections.filter((s) => overrides[s]).length;
    return {
      key: t.key,
      label: t.label,
      icon: t.icon,
      sectionCount: t.sections.length,
      writtenCount,
    };
  });
}