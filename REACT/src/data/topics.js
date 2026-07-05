// topics.js — the master list of all 16 topics (matches onboarding's topic list).
//
// `seeded: true` topics have real problems in problems.js right now.
// `seeded: false` topics are "upcoming" — they have a targetTotal (a rough estimate
// of how many problems that topic will eventually need) but 0 real problems yet.
// This mirrors exactly what your original static roadmap.html already showed:
// Linked Lists/Trees/Graphs/DP were "Upcoming, 0/X" placeholders.
export const topics = [
  { key: 'arrays', label: 'Arrays', icon: '📦', seeded: true },
  { key: 'hashing', label: 'Hashing', icon: '🗂️', seeded: true },
  { key: 'two-pointers', label: 'Two Pointers', icon: '👆👆', seeded: true },
  { key: 'sliding-window', label: 'Sliding Window', icon: '🪟', seeded: true },
  { key: 'linked-lists', label: 'Linked Lists', icon: '🔗', seeded: true },
  { key: 'stacks-queues', label: 'Stacks & Queues', icon: '📚', seeded: true },
  { key: 'binary-search', label: 'Binary Search', icon: '🔍', seeded: true },

  // Not seeded yet — targetTotal is a placeholder estimate for the roadmap UI,
  // matching the "0/28", "0/35" style upcoming counts from the original design.
  { key: 'trees', label: 'Trees', icon: '🌲', seeded: false, targetTotal: 28 },
  { key: 'graphs', label: 'Graphs', icon: '🕸️', seeded: false, targetTotal: 35 },
  { key: 'recursion', label: 'Recursion', icon: '🔄', seeded: false, targetTotal: 20 },
  { key: 'dp', label: 'Dynamic Programming', icon: '🧩', seeded: false, targetTotal: 40 },
  { key: 'greedy', label: 'Greedy', icon: '⛰️', seeded: false, targetTotal: 15 },
  { key: 'heaps', label: 'Heaps / Priority Queue', icon: '🔺', seeded: false, targetTotal: 15 },
  { key: 'tries', label: 'Tries', icon: '🌳', seeded: false, targetTotal: 10 },
  { key: 'bit-manipulation', label: 'Bit Manipulation', icon: '📐', seeded: false, targetTotal: 12 },
  { key: 'maths', label: 'Maths & Number Theory', icon: '🧮', seeded: false, targetTotal: 15 },
];

export function getTopic(key) {
  return topics.find((t) => t.key === key);
}