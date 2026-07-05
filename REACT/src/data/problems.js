// problems.js — the actual problem bank. Each entry is metadata only (name,
// topic, difficulty, pattern, LeetCode number, order within its topic) — not
// full hint/solution content. That's intentional: metadata alone is everything
// the roadmap generator, weak-point engine, and SM-2 scheduler need to run and
// be tested against real variety. Full write-ups (hints, dry runs) get filled
// in problem-by-problem afterward, starting with the ones people hit first —
// see problemDetails.js for the ones that already have full content.
//
// difficultyType maps 'Easy'/'Medium'/'Hard' to the badge color classes
// already defined in global.css — see getDifficultyType() below.

export const problems = [
  // ── Arrays ──────────────────────────────────────────────
  { id: 'two-sum', name: 'Two Sum', topicKey: 'arrays', difficulty: 'Easy', pattern: 'Hash Map', leetcode: 1, order: 1 },
  { id: 'best-time-buy-sell-stock', name: 'Best Time to Buy and Sell Stock', topicKey: 'arrays', difficulty: 'Easy', pattern: 'Greedy', leetcode: 121, order: 2 },
  { id: 'contains-duplicate', name: 'Contains Duplicate', topicKey: 'arrays', difficulty: 'Easy', pattern: 'Hash Set', leetcode: 217, order: 3 },
  { id: 'product-of-array-except-self', name: 'Product of Array Except Self', topicKey: 'arrays', difficulty: 'Medium', pattern: 'Prefix Sum', leetcode: 238, order: 4 },
  { id: 'maximum-subarray', name: 'Maximum Subarray', topicKey: 'arrays', difficulty: 'Medium', pattern: "Kadane's", leetcode: 53, order: 5 },
  { id: 'maximum-product-subarray', name: 'Maximum Product Subarray', topicKey: 'arrays', difficulty: 'Medium', pattern: 'Dynamic Programming', leetcode: 152, order: 6 },
  { id: 'find-min-rotated-sorted-array', name: 'Find Minimum in Rotated Sorted Array', topicKey: 'arrays', difficulty: 'Medium', pattern: 'Binary Search', leetcode: 153, order: 7 },
  { id: 'search-rotated-sorted-array', name: 'Search in Rotated Sorted Array', topicKey: 'arrays', difficulty: 'Medium', pattern: 'Binary Search', leetcode: 33, order: 8 },
  { id: 'trapping-rain-water', name: 'Trapping Rain Water', topicKey: 'arrays', difficulty: 'Hard', pattern: 'Two Pointers', leetcode: 42, order: 9 },
  { id: 'merge-intervals', name: 'Merge Intervals', topicKey: 'arrays', difficulty: 'Medium', pattern: 'Sorting', leetcode: 56, order: 10 },

  // ── Hashing ─────────────────────────────────────────────
  { id: 'valid-anagram', name: 'Valid Anagram', topicKey: 'hashing', difficulty: 'Easy', pattern: 'Hash Map', leetcode: 242, order: 1 },
  { id: 'group-anagrams', name: 'Group Anagrams', topicKey: 'hashing', difficulty: 'Medium', pattern: 'Hash Map', leetcode: 49, order: 2 },
  { id: 'top-k-frequent-elements', name: 'Top K Frequent Elements', topicKey: 'hashing', difficulty: 'Medium', pattern: 'Hash Map + Heap', leetcode: 347, order: 3 },
  { id: 'longest-consecutive-sequence', name: 'Longest Consecutive Sequence', topicKey: 'hashing', difficulty: 'Medium', pattern: 'Hash Set', leetcode: 128, order: 4 },
  { id: 'subarray-sum-equals-k', name: 'Subarray Sum Equals K', topicKey: 'hashing', difficulty: 'Medium', pattern: 'Prefix Sum', leetcode: 560, order: 5 },
  { id: 'ransom-note', name: 'Ransom Note', topicKey: 'hashing', difficulty: 'Easy', pattern: 'Hash Map', leetcode: 383, order: 6 },
  { id: 'isomorphic-strings', name: 'Isomorphic Strings', topicKey: 'hashing', difficulty: 'Easy', pattern: 'Hash Map', leetcode: 205, order: 7 },
  { id: 'word-pattern', name: 'Word Pattern', topicKey: 'hashing', difficulty: 'Easy', pattern: 'Hash Map', leetcode: 290, order: 8 },

  // ── Two Pointers ────────────────────────────────────────
  { id: 'valid-palindrome', name: 'Valid Palindrome', topicKey: 'two-pointers', difficulty: 'Easy', pattern: 'Two Pointers', leetcode: 125, order: 1 },
  { id: 'two-sum-ii-sorted', name: 'Two Sum II - Input Array Is Sorted', topicKey: 'two-pointers', difficulty: 'Easy', pattern: 'Two Pointers', leetcode: 167, order: 2 },
  { id: '3sum', name: '3Sum', topicKey: 'two-pointers', difficulty: 'Medium', pattern: 'Two Pointers', leetcode: 15, order: 3 },
  { id: '3sum-closest', name: '3Sum Closest', topicKey: 'two-pointers', difficulty: 'Medium', pattern: 'Two Pointers', leetcode: 16, order: 4 },
  { id: 'container-with-most-water', name: 'Container With Most Water', topicKey: 'two-pointers', difficulty: 'Medium', pattern: 'Two Pointers', leetcode: 11, order: 5 },
  { id: 'sort-colors', name: 'Sort Colors', topicKey: 'two-pointers', difficulty: 'Medium', pattern: 'Two Pointers', leetcode: 75, order: 6 },
  { id: 'remove-duplicates-sorted-array', name: 'Remove Duplicates from Sorted Array', topicKey: 'two-pointers', difficulty: 'Easy', pattern: 'Two Pointers', leetcode: 26, order: 7 },

  // ── Sliding Window ──────────────────────────────────────
  { id: 'longest-substring-without-repeating', name: 'Longest Substring Without Repeating Characters', topicKey: 'sliding-window', difficulty: 'Medium', pattern: 'Sliding Window', leetcode: 3, order: 1 },
  { id: 'minimum-size-subarray-sum', name: 'Minimum Size Subarray Sum', topicKey: 'sliding-window', difficulty: 'Medium', pattern: 'Sliding Window', leetcode: 209, order: 2 },
  { id: 'longest-repeating-character-replacement', name: 'Longest Repeating Character Replacement', topicKey: 'sliding-window', difficulty: 'Medium', pattern: 'Sliding Window', leetcode: 424, order: 3 },
  { id: 'permutation-in-string', name: 'Permutation in String', topicKey: 'sliding-window', difficulty: 'Medium', pattern: 'Sliding Window', leetcode: 567, order: 4 },
  { id: 'find-all-anagrams-in-string', name: 'Find All Anagrams in a String', topicKey: 'sliding-window', difficulty: 'Medium', pattern: 'Sliding Window', leetcode: 438, order: 5 },
  { id: 'sliding-window-maximum', name: 'Sliding Window Maximum', topicKey: 'sliding-window', difficulty: 'Hard', pattern: 'Sliding Window + Deque', leetcode: 239, order: 6 },
  { id: 'fruit-into-baskets', name: 'Fruit Into Baskets', topicKey: 'sliding-window', difficulty: 'Medium', pattern: 'Sliding Window', leetcode: 904, order: 7 },

  // ── Linked Lists ────────────────────────────────────────
  { id: 'reverse-linked-list', name: 'Reverse Linked List', topicKey: 'linked-lists', difficulty: 'Easy', pattern: 'Linked List', leetcode: 206, order: 1 },
  { id: 'merge-two-sorted-lists', name: 'Merge Two Sorted Lists', topicKey: 'linked-lists', difficulty: 'Easy', pattern: 'Linked List', leetcode: 21, order: 2 },
  { id: 'linked-list-cycle', name: 'Linked List Cycle', topicKey: 'linked-lists', difficulty: 'Easy', pattern: 'Fast & Slow Pointers', leetcode: 141, order: 3 },
  { id: 'remove-nth-node-from-end', name: 'Remove Nth Node From End of List', topicKey: 'linked-lists', difficulty: 'Medium', pattern: 'Two Pointers', leetcode: 19, order: 4 },
  { id: 'reorder-list', name: 'Reorder List', topicKey: 'linked-lists', difficulty: 'Medium', pattern: 'Linked List', leetcode: 143, order: 5 },
  { id: 'add-two-numbers', name: 'Add Two Numbers', topicKey: 'linked-lists', difficulty: 'Medium', pattern: 'Linked List', leetcode: 2, order: 6 },
  { id: 'copy-list-with-random-pointer', name: 'Copy List with Random Pointer', topicKey: 'linked-lists', difficulty: 'Medium', pattern: 'Hash Map', leetcode: 138, order: 7 },
  { id: 'lru-cache', name: 'LRU Cache', topicKey: 'linked-lists', difficulty: 'Medium', pattern: 'Hash Map + Doubly Linked List', leetcode: 146, order: 8 },

  // ── Stacks & Queues ─────────────────────────────────────
  { id: 'valid-parentheses', name: 'Valid Parentheses', topicKey: 'stacks-queues', difficulty: 'Easy', pattern: 'Stack', leetcode: 20, order: 1 },
  { id: 'min-stack', name: 'Min Stack', topicKey: 'stacks-queues', difficulty: 'Medium', pattern: 'Stack', leetcode: 155, order: 2 },
  { id: 'evaluate-reverse-polish-notation', name: 'Evaluate Reverse Polish Notation', topicKey: 'stacks-queues', difficulty: 'Medium', pattern: 'Stack', leetcode: 150, order: 3 },
  { id: 'daily-temperatures', name: 'Daily Temperatures', topicKey: 'stacks-queues', difficulty: 'Medium', pattern: 'Monotonic Stack', leetcode: 739, order: 4 },
  { id: 'implement-queue-using-stacks', name: 'Implement Queue using Stacks', topicKey: 'stacks-queues', difficulty: 'Easy', pattern: 'Stack', leetcode: 232, order: 5 },
  { id: 'largest-rectangle-in-histogram', name: 'Largest Rectangle in Histogram', topicKey: 'stacks-queues', difficulty: 'Hard', pattern: 'Monotonic Stack', leetcode: 84, order: 6 },

  // ── Binary Search ───────────────────────────────────────
  { id: 'binary-search', name: 'Binary Search', topicKey: 'binary-search', difficulty: 'Easy', pattern: 'Binary Search', leetcode: 704, order: 1 },
  { id: 'search-insert-position', name: 'Search Insert Position', topicKey: 'binary-search', difficulty: 'Easy', pattern: 'Binary Search', leetcode: 35, order: 2 },
  { id: 'find-first-last-position', name: 'Find First and Last Position of Element in Sorted Array', topicKey: 'binary-search', difficulty: 'Medium', pattern: 'Binary Search', leetcode: 34, order: 3 },
  { id: 'koko-eating-bananas', name: 'Koko Eating Bananas', topicKey: 'binary-search', difficulty: 'Medium', pattern: 'Binary Search on Answer', leetcode: 875, order: 4 },
  { id: 'median-of-two-sorted-arrays', name: 'Median of Two Sorted Arrays', topicKey: 'binary-search', difficulty: 'Hard', pattern: 'Binary Search', leetcode: 4, order: 5 },
];

// getDifficultyType — maps a difficulty string to the Badge component's `type`
// prop, so every place that renders a problem doesn't need to repeat this
// if/else chain itself.
export function getDifficultyType(difficulty) {
  if (difficulty === 'Easy') return 'green';
  if (difficulty === 'Medium') return 'amber';
  if (difficulty === 'Hard') return 'red';
  return 'gray';
}

export function getProblemsByTopic(topicKey) {
  return problems
    .filter((p) => p.topicKey === topicKey)
    .sort((a, b) => a.order - b.order);
}

export function getProblem(id) {
  return problems.find((p) => p.id === id);
}