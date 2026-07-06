// problems.js — the actual problem bank. Each entry is metadata only (name,
// topic, section, difficulty, pattern, LeetCode number, order within its topic) —
// not full hint/solution content. That's intentional: metadata alone is
// everything the roadmap generator, weak-point engine, and SM-2 scheduler need
// to run and be tested against real variety.
//
// STRUCTURE (three-level hierarchy, per the dependency-ordered roadmap):
//   Topic      (topicKey)  — one of the 8 topics in topics.js, in learning order
//   Section    (section)   — the pattern-group within a topic, also in learning
//                            order (see topics.js `sections` per topic)
//   Pattern    (pattern)   — the specific technique/subpattern, e.g. 'Monotonic
//                            Stack' or 'Fast & Slow Pointers'
//
// Topic order follows minimum-cognitive-load dependencies: Arrays teaches
// iteration/hashing/two pointers/sliding window/prefix sum/binary search/
// sorting/heaps/2D arrays up front since almost everything later reuses these.
// Strings reuses those same techniques on a new data shape (no new structure).
// Stacks & Queues introduce the first real abstract data structure — and go
// BEFORE recursion on purpose, since an explicit stack demystifies the call
// stack recursion relies on. Recursion & Backtracking then unlocks Linked
// Lists (many elegant LL problems are recursive), which unlocks Trees (built on
// recursion), which unlocks Graphs (trees + cycles + disconnected components).
// Dynamic Programming is last since it borrows from literally everything above.
//
// A few former standalone topics were folded in as sections rather than kept
// separate, since the new ordering treats them as patterns, not topics:
//   - Hashing, Two Pointers, Sliding Window, Binary Search, Heaps, Greedy,
//     Bit Manipulation, and Maths & Number Theory -> sections under Arrays
//     (or under Strings/Stacks & Queues where the problem is fundamentally
//     about strings or uses a monotonic stack/queue).
//   - Tries -> 'Advanced Trees' section under Trees.
//   - String-heavy DP (LCS, Edit Distance, word break, palindrome DP, ...) and
//     Tree DP (House Robber III, Binary Tree Cameras) -> sections under DP.
//   - Backtracking-flavored string problems (generate parentheses, letter
//     combinations, divide & conquer parenthesization) -> sections under
//     Recursion & Backtracking.
// Every problem still lives in exactly ONE place — nothing is duplicated across
// topics/sections even where a problem could plausibly fit more than one.
//
// difficultyType maps 'Easy'/'Medium'/'Hard' to the badge color classes already
// defined in global.css — see getDifficultyType() below.
//
// PATTERN NAMING (revised): `pattern` is meant to capture "the main solving
// technique," not just a data structure or a generic traversal label. Overly
// broad tags like plain "DFS", "Linked List", "Binary Search", "Greedy", "Stack",
// and "Hash Map" have been split into more specific variants (e.g. "DFS +
// Postorder", "In-place Pointer Reversal", "Binary Search + Predicate",
// "Local Greedy", "Stack Simulation", "Frequency Counting" / "Hash Lookup")
// so the tag itself teaches *why* a problem's solution looks the way it does,
// not just *that* it uses DFS/a stack/a hash map/etc.
//
// ENFORCED-APPROACH DUPLICATE PAIRS: a handful of problems genuinely build
// different intuition depending on whether you solve them iteratively or
// recursively (not "any recursive function could technically be rewritten
// iteratively" — that's true of almost everything and would be noise; these
// are cases where the two approaches feel meaningfully different to write).
// For those, instead of one entry we keep TWO entries that share the same
// `leetcode` number but have distinct `id`s and an `enforcedApproach` field
// set to 'iterative' or 'recursive'. This lets the scheduler/roadmap treat
// "solve X iteratively" and "solve X recursively" as separate reps. Current
// pairs: Reverse Linked List, Merge Two Sorted Lists, Binary Tree Preorder/
// Inorder/Postorder Traversal, and Binary Search.

export const problems = [
  // ══════════════════════════════════════════════════════
  // ARRAYS
  // ══════════════════════════════════════════════════════
  // ── Basics ──
  { id: 'rotate-array', name: "Rotate Array", topicKey: 'arrays', section: "Basics", difficulty: 'Medium', pattern: "Array Manipulation", leetcode: 189, order: 1 },
  { id: 'next-permutation', name: "Next Permutation", topicKey: 'arrays', section: "Basics", difficulty: 'Medium', pattern: "Array Simulation", leetcode: 31, order: 2 },
  { id: 'missing-number', name: "Missing Number", topicKey: 'arrays', section: "Basics", difficulty: 'Easy', pattern: "Cyclic Sort", leetcode: 268, order: 3 },
  { id: 'find-disappeared-numbers', name: "Find All Numbers Disappeared in an Array", topicKey: 'arrays', section: "Basics", difficulty: 'Easy', pattern: "Cyclic Sort", leetcode: 448, order: 4 },
  { id: 'find-duplicate-number', name: "Find the Duplicate Number", topicKey: 'arrays', section: "Basics", difficulty: 'Medium', pattern: "Cyclic Sort", leetcode: 287, order: 5 },
  { id: 'first-missing-positive', name: "First Missing Positive", topicKey: 'arrays', section: "Basics", difficulty: 'Hard', pattern: "Cyclic Sort", leetcode: 41, order: 6 },
  { id: 'majority-element', name: "Majority Element", topicKey: 'arrays', section: "Basics", difficulty: 'Easy', pattern: "Boyer-Moore Voting", leetcode: 169, order: 7 },
  { id: 'majority-element-ii', name: "Majority Element II", topicKey: 'arrays', section: "Basics", difficulty: 'Medium', pattern: "Boyer-Moore Voting", leetcode: 229, order: 8 },
  { id: 'pascals-triangle', name: "Pascal's Triangle", topicKey: 'arrays', section: "Basics", difficulty: 'Easy', pattern: "Array Construction", leetcode: 118, order: 9 },
  // ── Hashing ──
  { id: 'two-sum', name: "Two Sum", topicKey: 'arrays', section: "Hashing", difficulty: 'Easy', pattern: "Hash Lookup", leetcode: 1, order: 10 },
  { id: 'contains-duplicate', name: "Contains Duplicate", topicKey: 'arrays', section: "Hashing", difficulty: 'Easy', pattern: "Hash Set", leetcode: 217, order: 11 },
  { id: 'longest-consecutive-sequence', name: "Longest Consecutive Sequence", topicKey: 'arrays', section: "Hashing", difficulty: 'Medium', pattern: "Hash Set", leetcode: 128, order: 12 },
  { id: 'subarray-sum-equals-k', name: "Subarray Sum Equals K", topicKey: 'arrays', section: "Hashing", difficulty: 'Medium', pattern: "Prefix Sum", leetcode: 560, order: 13 },
  { id: 'four-sum-ii', name: "4Sum II", topicKey: 'arrays', section: "Hashing", difficulty: 'Medium', pattern: "Hash Lookup", leetcode: 454, order: 14 },
  { id: 'contiguous-array', name: "Contiguous Array", topicKey: 'arrays', section: "Hashing", difficulty: 'Medium', pattern: "Hash Map + Prefix Sum", leetcode: 525, order: 15 },
  { id: 'design-hashmap', name: "Design HashMap", topicKey: 'arrays', section: "Hashing", difficulty: 'Easy', pattern: "Hash Map Design", leetcode: 706, order: 16 },
  { id: 'design-hashset', name: "Design HashSet", topicKey: 'arrays', section: "Hashing", difficulty: 'Easy', pattern: "Hash Set Design", leetcode: 705, order: 17 },
  { id: 'insert-delete-getrandom-o1', name: "Insert Delete GetRandom O(1)", topicKey: 'arrays', section: "Hashing", difficulty: 'Medium', pattern: "Hash Map + Array", leetcode: 380, order: 18 },
  { id: 'encode-and-decode-tinyurl', name: "Encode and Decode TinyURL", topicKey: 'arrays', section: "Hashing", difficulty: 'Medium', pattern: "Hash Lookup", leetcode: 535, order: 20 },
  { id: 'brick-wall', name: "Brick Wall", topicKey: 'arrays', section: "Hashing", difficulty: 'Medium', pattern: "Frequency Counting", leetcode: 554, order: 21 },
  { id: 'check-if-array-pairs-divisible-by-k', name: "Check If Array Pairs Are Divisible by k", topicKey: 'arrays', section: "Hashing", difficulty: 'Medium', pattern: "Frequency Counting", leetcode: 1497, order: 22 },
  { id: 'pairs-of-songs-divisible-by-60', name: "Pairs of Songs With Total Durations Divisible by 60", topicKey: 'arrays', section: "Hashing", difficulty: 'Medium', pattern: "Frequency Counting", leetcode: 1010, order: 23 },
  { id: 'minimum-index-sum-of-two-lists', name: "Minimum Index Sum of Two Lists", topicKey: 'arrays', section: "Hashing", difficulty: 'Easy', pattern: "Hash Lookup", leetcode: 599, order: 24 },
  // ── Two Pointers ──
  { id: 'trapping-rain-water', name: "Trapping Rain Water", topicKey: 'arrays', section: "Two Pointers", difficulty: 'Hard', pattern: "Two Pointers", leetcode: 42, order: 25 },
  { id: 'move-zeroes', name: "Move Zeroes", topicKey: 'arrays', section: "Two Pointers", difficulty: 'Easy', pattern: "Two Pointers", leetcode: 283, order: 26 },
  { id: 'merge-sorted-array', name: "Merge Sorted Array", topicKey: 'arrays', section: "Two Pointers", difficulty: 'Easy', pattern: "Two Pointers", leetcode: 88, order: 27 },
  { id: 'two-sum-ii-sorted', name: "Two Sum II - Input Array Is Sorted", topicKey: 'arrays', section: "Two Pointers", difficulty: 'Easy', pattern: "Two Pointers", leetcode: 167, order: 28 },
  { id: '3sum', name: "3Sum", topicKey: 'arrays', section: "Two Pointers", difficulty: 'Medium', pattern: "Two Pointers", leetcode: 15, order: 29 },
  { id: '3sum-closest', name: "3Sum Closest", topicKey: 'arrays', section: "Two Pointers", difficulty: 'Medium', pattern: "Two Pointers", leetcode: 16, order: 30 },
  { id: '4sum', name: "4Sum", topicKey: 'arrays', section: "Two Pointers", difficulty: 'Medium', pattern: "Two Pointers", leetcode: 18, order: 31 },
  { id: 'container-with-most-water', name: "Container With Most Water", topicKey: 'arrays', section: "Two Pointers", difficulty: 'Medium', pattern: "Two Pointers", leetcode: 11, order: 32 },
  { id: 'sort-colors', name: "Sort Colors", topicKey: 'arrays', section: "Two Pointers", difficulty: 'Medium', pattern: "Dutch National Flag", leetcode: 75, order: 33 },
  { id: 'remove-duplicates-sorted-array', name: "Remove Duplicates from Sorted Array", topicKey: 'arrays', section: "Two Pointers", difficulty: 'Easy', pattern: "Two Pointers", leetcode: 26, order: 34 },
  { id: 'remove-duplicates-sorted-array-ii', name: "Remove Duplicates from Sorted Array II", topicKey: 'arrays', section: "Two Pointers", difficulty: 'Medium', pattern: "Two Pointers", leetcode: 80, order: 35 },
  { id: 'boats-to-save-people', name: "Boats to Save People", topicKey: 'arrays', section: "Two Pointers", difficulty: 'Medium', pattern: "Greedy Two Pointers", leetcode: 881, order: 36 },
  { id: 'sort-array-by-parity', name: "Sort Array By Parity", topicKey: 'arrays', section: "Two Pointers", difficulty: 'Easy', pattern: "Two Pointers", leetcode: 905, order: 37 },
  { id: 'squares-of-a-sorted-array', name: "Squares of a Sorted Array", topicKey: 'arrays', section: "Two Pointers", difficulty: 'Easy', pattern: "Two Pointers", leetcode: 977, order: 38 },
  { id: 'two-sum-less-than-k', name: "Two Sum Less Than K", topicKey: 'arrays', section: "Two Pointers", difficulty: 'Easy', pattern: "Two Pointers", leetcode: 1099, order: 39 },
  { id: 'max-number-of-k-sum-pairs', name: "Max Number of K-Sum Pairs", topicKey: 'arrays', section: "Two Pointers", difficulty: 'Medium', pattern: "Two Pointers", leetcode: 1679, order: 40 },
  { id: 'minimum-common-value', name: "Minimum Common Value", topicKey: 'arrays', section: "Two Pointers", difficulty: 'Easy', pattern: "Two Pointers", leetcode: 2540, order: 41 },
  { id: 'partition-array-according-to-pivot', name: "Partition Array According to Given Pivot", topicKey: 'arrays', section: "Two Pointers", difficulty: 'Medium', pattern: "Two Pointers", leetcode: 2161, order: 42 },
  // ── Sliding Window ──
  { id: 'minimum-size-subarray-sum', name: "Minimum Size Subarray Sum", topicKey: 'arrays', section: "Sliding Window", difficulty: 'Medium', pattern: "Sliding Window", leetcode: 209, order: 43 },
  { id: 'fruit-into-baskets', name: "Fruit Into Baskets", topicKey: 'arrays', section: "Sliding Window", difficulty: 'Medium', pattern: "Sliding Window", leetcode: 904, order: 44 },
  { id: 'max-consecutive-ones-iii', name: "Max Consecutive Ones III", topicKey: 'arrays', section: "Sliding Window", difficulty: 'Medium', pattern: "Sliding Window", leetcode: 1004, order: 45 },
  { id: 'subarrays-with-k-different-integers', name: "Subarrays with K Different Integers", topicKey: 'arrays', section: "Sliding Window", difficulty: 'Hard', pattern: "Sliding Window (at most K)", leetcode: 992, order: 46 },
  { id: 'count-nice-subarrays', name: "Count Number of Nice Subarrays", topicKey: 'arrays', section: "Sliding Window", difficulty: 'Medium', pattern: "Sliding Window (at most K)", leetcode: 1248, order: 47 },
  { id: 'max-points-from-cards', name: "Maximum Points You Can Obtain from Cards", topicKey: 'arrays', section: "Sliding Window", difficulty: 'Medium', pattern: "Sliding Window (inverse)", leetcode: 1423, order: 48 },
  { id: 'longest-subarray-after-deleting-one', name: "Longest Subarray of 1s After Deleting One Element", topicKey: 'arrays', section: "Sliding Window", difficulty: 'Medium', pattern: "Sliding Window", leetcode: 1493, order: 49 },
  { id: 'maximum-average-subarray-i', name: "Maximum Average Subarray I", topicKey: 'arrays', section: "Sliding Window", difficulty: 'Easy', pattern: "Sliding Window", leetcode: 643, order: 50 },
  { id: 'grumpy-bookstore-owner', name: "Grumpy Bookstore Owner", topicKey: 'arrays', section: "Sliding Window", difficulty: 'Medium', pattern: "Sliding Window", leetcode: 1052, order: 51 },
  { id: 'max-sum-two-non-overlapping-subarrays', name: "Maximum Sum of Two Non-Overlapping Subarrays", topicKey: 'arrays', section: "Sliding Window", difficulty: 'Medium', pattern: "Sliding Window", leetcode: 1031, order: 52 },
  { id: 'frequency-of-most-frequent-element', name: "Frequency of the Most Frequent Element", topicKey: 'arrays', section: "Sliding Window", difficulty: 'Medium', pattern: "Sliding Window", leetcode: 1838, order: 53 },
  { id: 'sliding-window-median', name: "Sliding Window Median", topicKey: 'arrays', section: "Sliding Window", difficulty: 'Hard', pattern: "Sliding Window + Two Heaps", leetcode: 480, order: 54 },
  { id: 'minimum-swaps-group-all-1s', name: "Minimum Swaps to Group All 1s Together", topicKey: 'arrays', section: "Sliding Window", difficulty: 'Medium', pattern: "Fixed-size Sliding Window", leetcode: 1151, order: 55 },
  // ── Prefix Sum ──
  { id: 'find-pivot-index', name: "Find Pivot Index", topicKey: 'arrays', section: "Prefix Sum", difficulty: 'Easy', pattern: "Prefix Sum", leetcode: 724, order: 55.1 },
  { id: 'maximum-product-subarray', name: "Maximum Product Subarray", topicKey: 'arrays', section: "Prefix Sum", difficulty: 'Medium', pattern: "Kadane Variant", leetcode: 152, order: 55.2 },
  { id: 'product-of-array-except-self', name: "Product of Array Except Self", topicKey: 'arrays', section: "Prefix Sum", difficulty: 'Medium', pattern: "Prefix Sum", leetcode: 238, order: 56 },
  { id: 'maximum-subarray', name: "Maximum Subarray", topicKey: 'arrays', section: "Prefix Sum", difficulty: 'Medium', pattern: "Kadane's", leetcode: 53, order: 57 },
  { id: 'range-sum-query-immutable', name: "Range Sum Query - Immutable", topicKey: 'arrays', section: "Prefix Sum", difficulty: 'Easy', pattern: "Prefix Sum", leetcode: 303, order: 58 },
  { id: 'range-sum-query-2d-immutable', name: "Range Sum Query 2D - Immutable", topicKey: 'arrays', section: "Prefix Sum", difficulty: 'Medium', pattern: "Prefix Sum 2D", leetcode: 304, order: 59 },
  { id: 'subarray-sums-divisible-by-k', name: "Subarray Sums Divisible by K", topicKey: 'arrays', section: "Prefix Sum", difficulty: 'Medium', pattern: "Prefix Sum", leetcode: 974, order: 60 },
  { id: 'continuous-subarray-sum', name: "Continuous Subarray Sum", topicKey: 'arrays', section: "Prefix Sum", difficulty: 'Medium', pattern: "Prefix Sum", leetcode: 523, order: 61 },
  { id: 'car-pooling', name: "Car Pooling", topicKey: 'arrays', section: "Prefix Sum", difficulty: 'Medium', pattern: "Difference Array", leetcode: 1094, order: 62 },
  { id: 'corporate-flight-bookings', name: "Corporate Flight Bookings", topicKey: 'arrays', section: "Prefix Sum", difficulty: 'Medium', pattern: "Difference Array", leetcode: 1109, order: 63 },
  // ── Binary Search ──
  { id: 'find-min-rotated-sorted-array', name: "Find Minimum in Rotated Sorted Array", topicKey: 'arrays', section: "Binary Search", difficulty: 'Medium', pattern: "Binary Search on Rotated Array", leetcode: 153, order: 64 },
  { id: 'search-rotated-sorted-array', name: "Search in Rotated Sorted Array", topicKey: 'arrays', section: "Binary Search", difficulty: 'Medium', pattern: "Binary Search on Rotated Array", leetcode: 33, order: 65 },
  { id: 'search-rotated-sorted-array-ii', name: "Search in Rotated Sorted Array II", topicKey: 'arrays', section: "Binary Search", difficulty: 'Medium', pattern: "Binary Search on Rotated Array", leetcode: 81, order: 66 },
  { id: 'binary-search-iterative', name: "Binary Search", topicKey: 'arrays', section: "Binary Search", difficulty: 'Easy', pattern: "Classic Binary Search (Iterative)", leetcode: 704, order: 67, enforcedApproach: 'iterative' },
  { id: 'binary-search-recursive', name: "Binary Search", topicKey: 'arrays', section: "Binary Search", difficulty: 'Easy', pattern: "Classic Binary Search (Recursive)", leetcode: 704, order: 67.1, enforcedApproach: 'recursive' },
  { id: 'search-insert-position', name: "Search Insert Position", topicKey: 'arrays', section: "Binary Search", difficulty: 'Easy', pattern: "Classic Binary Search", leetcode: 35, order: 68 },
  { id: 'find-first-last-position', name: "Find First and Last Position of Element in Sorted Array", topicKey: 'arrays', section: "Binary Search", difficulty: 'Medium', pattern: "Binary Search + Predicate", leetcode: 34, order: 69 },
  { id: 'median-of-two-sorted-arrays', name: "Median of Two Sorted Arrays", topicKey: 'arrays', section: "Binary Search", difficulty: 'Hard', pattern: "Binary Search on Partition", leetcode: 4, order: 70 },
  { id: 'sqrt-x', name: "Sqrt(x)", topicKey: 'arrays', section: "Binary Search", difficulty: 'Easy', pattern: "Binary Search on Value", leetcode: 69, order: 71 },
  { id: 'find-peak-element', name: "Find Peak Element", topicKey: 'arrays', section: "Binary Search", difficulty: 'Medium', pattern: "Binary Search + Predicate", leetcode: 162, order: 72 },
  { id: 'find-smallest-letter-greater-than-target', name: "Find Smallest Letter Greater Than Target", topicKey: 'arrays', section: "Binary Search", difficulty: 'Easy', pattern: "Binary Search + Predicate", leetcode: 744, order: 73 },
  { id: 'random-pick-with-weight', name: "Random Pick with Weight", topicKey: 'arrays', section: "Binary Search", difficulty: 'Medium', pattern: "Binary Search + Prefix Sum", leetcode: 528, order: 74 },
  { id: 'find-k-closest-elements', name: "Find K Closest Elements", topicKey: 'arrays', section: "Binary Search", difficulty: 'Medium', pattern: "Binary Search + Predicate", leetcode: 658, order: 75 },
  { id: 'divide-two-integers', name: "Divide Two Integers", topicKey: 'arrays', section: "Binary Search", difficulty: 'Medium', pattern: "Binary Search on Value", leetcode: 29, order: 76 },
  { id: 'single-element-in-sorted-array', name: "Single Element in a Sorted Array", topicKey: 'arrays', section: "Binary Search", difficulty: 'Medium', pattern: "Binary Search + Predicate", leetcode: 540, order: 77 },
  { id: 'count-of-smaller-numbers-after-self', name: "Count of Smaller Numbers After Self", topicKey: 'arrays', section: "Binary Search", difficulty: 'Hard', pattern: "Binary Search + BIT", leetcode: 315, order: 78 },
  { id: 'find-min-rotated-sorted-array-ii', name: "Find Minimum in Rotated Sorted Array II", topicKey: 'arrays', section: "Binary Search", difficulty: 'Hard', pattern: "Binary Search on Rotated Array", leetcode: 154, order: 79 },
  { id: 'peak-index-in-mountain-array', name: "Peak Index in a Mountain Array", topicKey: 'arrays', section: "Binary Search", difficulty: 'Easy', pattern: "Binary Search + Predicate", leetcode: 852, order: 80 },
  { id: 'time-based-key-value-store', name: "Time Based Key-Value Store", topicKey: 'arrays', section: "Binary Search", difficulty: 'Medium', pattern: "Binary Search + Design", leetcode: 981, order: 81 },
  { id: 'valid-perfect-square', name: "Valid Perfect Square", topicKey: 'arrays', section: "Binary Search", difficulty: 'Easy', pattern: "Binary Search on Value", leetcode: 367, order: 82 },
  // ── Binary Search on Answer ──
  { id: 'capacity-to-ship-packages', name: "Capacity To Ship Packages Within D Days", topicKey: 'arrays', section: "Binary Search on Answer", difficulty: 'Medium', pattern: "Binary Search on Answer", leetcode: 1011, order: 83 },
  { id: 'split-array-largest-sum', name: "Split Array Largest Sum", topicKey: 'arrays', section: "Binary Search on Answer", difficulty: 'Hard', pattern: "Binary Search on Answer", leetcode: 410, order: 84 },
  { id: 'koko-eating-bananas', name: "Koko Eating Bananas", topicKey: 'arrays', section: "Binary Search on Answer", difficulty: 'Medium', pattern: "Binary Search on Answer", leetcode: 875, order: 85 },
  { id: 'minimum-days-to-make-bouquets', name: "Minimum Number of Days to Make m Bouquets", topicKey: 'arrays', section: "Binary Search on Answer", difficulty: 'Medium', pattern: "Binary Search on Answer", leetcode: 1482, order: 86 },
  { id: 'magnetic-force-between-two-balls', name: "Magnetic Force Between Two Balls", topicKey: 'arrays', section: "Binary Search on Answer", difficulty: 'Medium', pattern: "Binary Search on Answer", leetcode: 1552, order: 87 },
  { id: 'nth-magical-number', name: "Nth Magical Number", topicKey: 'arrays', section: "Binary Search on Answer", difficulty: 'Hard', pattern: "Binary Search on Answer", leetcode: 878, order: 88 },
  { id: 'maximum-number-of-removable-characters', name: "Maximum Number of Removable Characters", topicKey: 'arrays', section: "Binary Search on Answer", difficulty: 'Medium', pattern: "Binary Search on Answer", leetcode: 1898, order: 89 },
  { id: 'successful-pairs-of-spells-and-potions', name: "Successful Pairs of Spells and Potions", topicKey: 'arrays', section: "Binary Search on Answer", difficulty: 'Medium', pattern: "Binary Search on Answer", leetcode: 2300, order: 90 },
  // ── Sorting & Greedy ──
  { id: 'best-time-buy-sell-stock', name: "Best Time to Buy and Sell Stock", topicKey: 'arrays', section: "Sorting & Greedy", difficulty: 'Easy', pattern: "Local Greedy", leetcode: 121, order: 91 },
  { id: 'best-time-buy-sell-stock-ii', name: "Best Time to Buy and Sell Stock II", topicKey: 'arrays', section: "Sorting & Greedy", difficulty: 'Medium', pattern: "Local Greedy", leetcode: 122, order: 92 },
  { id: 'merge-intervals', name: "Merge Intervals", topicKey: 'arrays', section: "Sorting & Greedy", difficulty: 'Medium', pattern: "Sorting", leetcode: 56, order: 93 },
  { id: 'insert-interval', name: "Insert Interval", topicKey: 'arrays', section: "Sorting & Greedy", difficulty: 'Medium', pattern: "Intervals", leetcode: 57, order: 94 },
  { id: 'non-overlapping-intervals', name: "Non-overlapping Intervals", topicKey: 'arrays', section: "Sorting & Greedy", difficulty: 'Medium', pattern: "Interval Greedy", leetcode: 435, order: 95 },
  { id: 'gas-station', name: "Gas Station", topicKey: 'arrays', section: "Sorting & Greedy", difficulty: 'Medium', pattern: "Simulation + Greedy", leetcode: 134, order: 96 },
  { id: 'jump-game', name: "Jump Game", topicKey: 'arrays', section: "Sorting & Greedy", difficulty: 'Medium', pattern: "Greedy Reachability", leetcode: 55, order: 97 },
  { id: 'jump-game-ii', name: "Jump Game II", topicKey: 'arrays', section: "Sorting & Greedy", difficulty: 'Medium', pattern: "Greedy Reachability", leetcode: 45, order: 98 },
  { id: 'h-index', name: "H-Index", topicKey: 'arrays', section: "Sorting & Greedy", difficulty: 'Medium', pattern: "Sorting", leetcode: 274, order: 99 },
  { id: 'wiggle-sort-ii', name: "Wiggle Sort II", topicKey: 'arrays', section: "Sorting & Greedy", difficulty: 'Medium', pattern: "Sorting", leetcode: 324, order: 100 },
  { id: 'partition-labels', name: "Partition Labels", topicKey: 'arrays', section: "Sorting & Greedy", difficulty: 'Medium', pattern: "Interval Greedy", leetcode: 763, order: 101 },
  { id: 'candy', name: "Candy", topicKey: 'arrays', section: "Sorting & Greedy", difficulty: 'Hard', pattern: "Greedy (Two-Pass)", leetcode: 135, order: 102 },
  { id: 'minimum-arrows-burst-balloons', name: "Minimum Number of Arrows to Burst Balloons", topicKey: 'arrays', section: "Sorting & Greedy", difficulty: 'Medium', pattern: "Interval Greedy", leetcode: 452, order: 103 },
  { id: 'queue-reconstruction-by-height', name: "Queue Reconstruction by Height", topicKey: 'arrays', section: "Sorting & Greedy", difficulty: 'Medium', pattern: "Sorting + Greedy", leetcode: 406, order: 104 },
  { id: 'assign-cookies', name: "Assign Cookies", topicKey: 'arrays', section: "Sorting & Greedy", difficulty: 'Easy', pattern: "Sorting + Greedy", leetcode: 455, order: 105 },
  { id: 'lemonade-change', name: "Lemonade Change", topicKey: 'arrays', section: "Sorting & Greedy", difficulty: 'Easy', pattern: "Simulation + Greedy", leetcode: 860, order: 106 },
  { id: 'maximum-swap', name: "Maximum Swap", topicKey: 'arrays', section: "Sorting & Greedy", difficulty: 'Medium', pattern: "Local Greedy", leetcode: 670, order: 107 },
  { id: 'two-city-scheduling', name: "Two City Scheduling", topicKey: 'arrays', section: "Sorting & Greedy", difficulty: 'Medium', pattern: "Sorting + Greedy", leetcode: 1029, order: 108 },
  { id: 'broken-calculator', name: "Broken Calculator", topicKey: 'arrays', section: "Sorting & Greedy", difficulty: 'Medium', pattern: "Greedy (Reverse Thinking)", leetcode: 991, order: 109 },
  { id: 'largest-number', name: "Largest Number", topicKey: 'arrays', section: "Sorting & Greedy", difficulty: 'Medium', pattern: "Sorting + Greedy", leetcode: 179, order: 110 },
  { id: 'minimum-domino-rotations', name: "Minimum Domino Rotations For Equal Row", topicKey: 'arrays', section: "Sorting & Greedy", difficulty: 'Medium', pattern: "Simulation + Greedy", leetcode: 1007, order: 111 },
  { id: 'non-decreasing-array', name: "Non-decreasing Array", topicKey: 'arrays', section: "Sorting & Greedy", difficulty: 'Medium', pattern: "Local Greedy", leetcode: 665, order: 112 },
  { id: 'wiggle-subsequence', name: "Wiggle Subsequence", topicKey: 'arrays', section: "Sorting & Greedy", difficulty: 'Medium', pattern: "Greedy / DP", leetcode: 376, order: 113 },
  { id: 'monotone-increasing-digits', name: "Monotone Increasing Digits", topicKey: 'arrays', section: "Sorting & Greedy", difficulty: 'Medium', pattern: "Local Greedy", leetcode: 738, order: 114 },
  // ── Heaps ──
  { id: 'meeting-rooms-ii', name: "Meeting Rooms II", topicKey: 'arrays', section: "Heaps", difficulty: 'Medium', pattern: "Heap + Intervals", leetcode: 253, order: 115 },
  { id: 'top-k-frequent-elements', name: "Top K Frequent Elements", topicKey: 'arrays', section: "Heaps", difficulty: 'Medium', pattern: "Frequency Counting + Heap", leetcode: 347, order: 116 },
  { id: 'task-scheduler', name: "Task Scheduler", topicKey: 'arrays', section: "Heaps", difficulty: 'Medium', pattern: "Greedy + Heap", leetcode: 621, order: 117 },
  { id: 'minimum-cost-to-connect-sticks', name: "Minimum Cost to Connect Sticks", topicKey: 'arrays', section: "Heaps", difficulty: 'Medium', pattern: "Greedy + Heap", leetcode: 1167, order: 118 },
  { id: 'reorganize-string', name: "Reorganize String", topicKey: 'arrays', section: "Heaps", difficulty: 'Medium', pattern: "Greedy + Heap", leetcode: 767, order: 119 },
  { id: 'kth-largest-element-in-an-array', name: "Kth Largest Element in an Array", topicKey: 'arrays', section: "Heaps", difficulty: 'Medium', pattern: "Heap / Quickselect", leetcode: 215, order: 120 },
  { id: 'find-median-from-data-stream', name: "Find Median from Data Stream", topicKey: 'arrays', section: "Heaps", difficulty: 'Hard', pattern: "Two Heaps", leetcode: 295, order: 121 },
  { id: 'top-k-frequent-words', name: "Top K Frequent Words", topicKey: 'arrays', section: "Heaps", difficulty: 'Medium', pattern: "Heap", leetcode: 692, order: 122 },
  { id: 'k-closest-points-to-origin', name: "K Closest Points to Origin", topicKey: 'arrays', section: "Heaps", difficulty: 'Medium', pattern: "Heap", leetcode: 973, order: 123 },
  { id: 'ugly-number-ii', name: "Ugly Number II", topicKey: 'arrays', section: "Heaps", difficulty: 'Medium', pattern: "Heap / DP", leetcode: 264, order: 124 },
  { id: 'super-ugly-number', name: "Super Ugly Number", topicKey: 'arrays', section: "Heaps", difficulty: 'Medium', pattern: "Heap", leetcode: 313, order: 125 },
  { id: 'kth-smallest-element-in-sorted-matrix', name: "Kth Smallest Element in a Sorted Matrix", topicKey: 'arrays', section: "Heaps", difficulty: 'Medium', pattern: "Heap / Binary Search", leetcode: 378, order: 126 },
  { id: 'last-stone-weight', name: "Last Stone Weight", topicKey: 'arrays', section: "Heaps", difficulty: 'Easy', pattern: "Heap", leetcode: 1046, order: 127 },
  { id: 'kth-factor-of-n', name: "The kth Factor of n", topicKey: 'arrays', section: "Heaps", difficulty: 'Medium', pattern: "Heap / Math", leetcode: 1492, order: 128 },
  { id: 'furthest-building-you-can-reach', name: "Furthest Building You Can Reach", topicKey: 'arrays', section: "Heaps", difficulty: 'Medium', pattern: "Heap + Greedy", leetcode: 1642, order: 129 },
  { id: 'process-tasks-using-servers', name: "Process Tasks Using Servers", topicKey: 'arrays', section: "Heaps", difficulty: 'Medium', pattern: "Heap", leetcode: 1882, order: 130 },
  { id: 'single-threaded-cpu', name: "Single-Threaded CPU", topicKey: 'arrays', section: "Heaps", difficulty: 'Medium', pattern: "Heap + Sorting", leetcode: 1834, order: 131 },
  { id: 'maximum-performance-of-a-team', name: "Maximum Performance of a Team", topicKey: 'arrays', section: "Heaps", difficulty: 'Hard', pattern: "Heap + Sorting", leetcode: 1383, order: 132 },
  { id: 'ipo', name: "IPO", topicKey: 'arrays', section: "Heaps", difficulty: 'Hard', pattern: "Two Heaps + Greedy", leetcode: 502, order: 133 },
  { id: 'employee-free-time', name: "Employee Free Time", topicKey: 'arrays', section: "Heaps", difficulty: 'Hard', pattern: "Heap + Intervals", leetcode: 759, order: 134 },
  { id: 'smallest-range-covering-k-lists', name: "Smallest Range Covering Elements from K Lists", topicKey: 'arrays', section: "Heaps", difficulty: 'Hard', pattern: "Heap", leetcode: 632, order: 135 },
  { id: 'rearrange-string-k-distance-apart', name: "Rearrange String k Distance Apart", topicKey: 'arrays', section: "Heaps", difficulty: 'Hard', pattern: "Heap + Greedy", leetcode: 358, order: 136 },
  { id: 'design-twitter', name: "Design Twitter", topicKey: 'arrays', section: "Heaps", difficulty: 'Medium', pattern: "Heap + Hash Map", leetcode: 355, order: 137 },
  { id: 'total-cost-to-hire-k-workers', name: "Total Cost to Hire K Workers", topicKey: 'arrays', section: "Heaps", difficulty: 'Medium', pattern: "Heap", leetcode: 2462, order: 138 },
  { id: 'seat-reservation-manager', name: "Seat Reservation Manager", topicKey: 'arrays', section: "Heaps", difficulty: 'Medium', pattern: "Heap", leetcode: 1845, order: 139 },
  { id: 'maximum-subsequence-score', name: "Maximum Subsequence Score", topicKey: 'arrays', section: "Heaps", difficulty: 'Hard', pattern: "Heap + Greedy", leetcode: 2542, order: 140 },
  { id: 'kth-largest-element-in-a-stream', name: "Kth Largest Element in a Stream", topicKey: 'arrays', section: "Heaps", difficulty: 'Easy', pattern: "Heap", leetcode: 703, order: 141 },
  // ── 2D Arrays ──
  { id: 'set-matrix-zeroes', name: "Set Matrix Zeroes", topicKey: 'arrays', section: "2D Arrays", difficulty: 'Medium', pattern: "2D Matrix", leetcode: 73, order: 142 },
  { id: 'spiral-matrix', name: "Spiral Matrix", topicKey: 'arrays', section: "2D Arrays", difficulty: 'Medium', pattern: "2D Matrix", leetcode: 54, order: 143 },
  { id: 'rotate-image', name: "Rotate Image", topicKey: 'arrays', section: "2D Arrays", difficulty: 'Medium', pattern: "2D Matrix", leetcode: 48, order: 144 },
  { id: 'search-2d-matrix', name: "Search a 2D Matrix", topicKey: 'arrays', section: "2D Arrays", difficulty: 'Medium', pattern: "Binary Search on Matrix", leetcode: 74, order: 145 },
  { id: 'search-2d-matrix-ii', name: "Search a 2D Matrix II", topicKey: 'arrays', section: "2D Arrays", difficulty: 'Medium', pattern: "Staircase Search", leetcode: 240, order: 146 },
  { id: 'game-of-life', name: "Game of Life", topicKey: 'arrays', section: "2D Arrays", difficulty: 'Medium', pattern: "2D Matrix Simulation", leetcode: 289, order: 147 },
  // ── Bit Manipulation ──
  { id: 'single-number', name: "Single Number", topicKey: 'arrays', section: "Bit Manipulation", difficulty: 'Easy', pattern: "XOR", leetcode: 136, order: 148 },
  { id: 'single-number-ii', name: "Single Number II", topicKey: 'arrays', section: "Bit Manipulation", difficulty: 'Medium', pattern: "Bit Manipulation", leetcode: 137, order: 149 },
  { id: 'single-number-iii', name: "Single Number III", topicKey: 'arrays', section: "Bit Manipulation", difficulty: 'Medium', pattern: "XOR", leetcode: 260, order: 150 },
  { id: 'number-of-1-bits', name: "Number of 1 Bits", topicKey: 'arrays', section: "Bit Manipulation", difficulty: 'Easy', pattern: "Bit Manipulation", leetcode: 191, order: 151 },
  { id: 'counting-bits', name: "Counting Bits", topicKey: 'arrays', section: "Bit Manipulation", difficulty: 'Easy', pattern: "DP + Bit Manipulation", leetcode: 338, order: 152 },
  { id: 'reverse-bits', name: "Reverse Bits", topicKey: 'arrays', section: "Bit Manipulation", difficulty: 'Easy', pattern: "Bit Manipulation", leetcode: 190, order: 153 },
  { id: 'sum-of-two-integers', name: "Sum of Two Integers", topicKey: 'arrays', section: "Bit Manipulation", difficulty: 'Medium', pattern: "Bit Manipulation", leetcode: 371, order: 154 },
  { id: 'bitwise-and-of-numbers-range', name: "Bitwise AND of Numbers Range", topicKey: 'arrays', section: "Bit Manipulation", difficulty: 'Medium', pattern: "Bit Manipulation", leetcode: 201, order: 155 },
  { id: 'power-of-two', name: "Power of Two", topicKey: 'arrays', section: "Bit Manipulation", difficulty: 'Easy', pattern: "Bit Manipulation", leetcode: 231, order: 156 },
  { id: 'power-of-four', name: "Power of Four", topicKey: 'arrays', section: "Bit Manipulation", difficulty: 'Easy', pattern: "Bit Manipulation", leetcode: 342, order: 157 },
  { id: 'utf-8-validation', name: "UTF-8 Validation", topicKey: 'arrays', section: "Bit Manipulation", difficulty: 'Medium', pattern: "Bit Manipulation", leetcode: 393, order: 158 },
  { id: 'total-hamming-distance', name: "Total Hamming Distance", topicKey: 'arrays', section: "Bit Manipulation", difficulty: 'Medium', pattern: "Bit Manipulation", leetcode: 477, order: 159 },
  { id: 'find-the-difference', name: "Find the Difference", topicKey: 'arrays', section: "Bit Manipulation", difficulty: 'Easy', pattern: "XOR", leetcode: 389, order: 160 },
  { id: 'minimum-flips-a-or-b-equals-c', name: "Minimum Flips to Make a OR b Equal to c", topicKey: 'arrays', section: "Bit Manipulation", difficulty: 'Medium', pattern: "Bit Manipulation", leetcode: 1318, order: 161 },
  { id: 'binary-number-alternating-bits', name: "Binary Number with Alternating Bits", topicKey: 'arrays', section: "Bit Manipulation", difficulty: 'Easy', pattern: "Bit Manipulation", leetcode: 693, order: 162 },
  { id: 'xor-queries-of-a-subarray', name: "XOR Queries of a Subarray", topicKey: 'arrays', section: "Bit Manipulation", difficulty: 'Medium', pattern: "Bit Manipulation + Prefix XOR", leetcode: 1310, order: 163 },
  // ── Maths & Number Theory ──
  { id: 'palindrome-number', name: "Palindrome Number", topicKey: 'arrays', section: "Maths & Number Theory", difficulty: 'Easy', pattern: "Math", leetcode: 9, order: 164 },
  { id: 'reverse-integer', name: "Reverse Integer", topicKey: 'arrays', section: "Maths & Number Theory", difficulty: 'Medium', pattern: "Math", leetcode: 7, order: 165 },
  { id: 'excel-sheet-column-title', name: "Excel Sheet Column Title", topicKey: 'arrays', section: "Maths & Number Theory", difficulty: 'Easy', pattern: "Math", leetcode: 168, order: 166 },
  { id: 'factorial-trailing-zeroes', name: "Factorial Trailing Zeroes", topicKey: 'arrays', section: "Maths & Number Theory", difficulty: 'Medium', pattern: "Math", leetcode: 172, order: 168 },
  { id: 'happy-number', name: "Happy Number", topicKey: 'arrays', section: "Maths & Number Theory", difficulty: 'Easy', pattern: "Math + Cycle Detection", leetcode: 202, order: 169 },
  { id: 'count-primes', name: "Count Primes", topicKey: 'arrays', section: "Maths & Number Theory", difficulty: 'Medium', pattern: "Sieve of Eratosthenes", leetcode: 204, order: 170 },
  { id: 'ugly-number', name: "Ugly Number", topicKey: 'arrays', section: "Maths & Number Theory", difficulty: 'Easy', pattern: "Math", leetcode: 263, order: 171 },
  { id: 'perfect-number', name: "Perfect Number", topicKey: 'arrays', section: "Maths & Number Theory", difficulty: 'Easy', pattern: "Math", leetcode: 507, order: 172 },
  { id: 'add-digits', name: "Add Digits", topicKey: 'arrays', section: "Maths & Number Theory", difficulty: 'Easy', pattern: "Math", leetcode: 258, order: 173 },
  { id: 'rectangle-area', name: "Rectangle Area", topicKey: 'arrays', section: "Maths & Number Theory", difficulty: 'Medium', pattern: "Math / Geometry", leetcode: 223, order: 174 },
  { id: 'valid-square', name: "Valid Square", topicKey: 'arrays', section: "Maths & Number Theory", difficulty: 'Medium', pattern: "Geometry", leetcode: 593, order: 176 },
  { id: 'max-points-on-a-line', name: "Max Points on a Line", topicKey: 'arrays', section: "Maths & Number Theory", difficulty: 'Hard', pattern: "Math / Geometry", leetcode: 149, order: 177 },
  { id: 'gcd-of-strings', name: "Greatest Common Divisor of Strings", topicKey: 'arrays', section: "Maths & Number Theory", difficulty: 'Easy', pattern: "Math (GCD)", leetcode: 1071, order: 178 },
  { id: 'nim-game', name: "Nim Game", topicKey: 'arrays', section: "Maths & Number Theory", difficulty: 'Easy', pattern: "Game Theory", leetcode: 292, order: 179 },
  { id: 'bulb-switcher', name: "Bulb Switcher", topicKey: 'arrays', section: "Maths & Number Theory", difficulty: 'Medium', pattern: "Math", leetcode: 319, order: 180 },
  { id: 'super-pow', name: "Super Pow", topicKey: 'arrays', section: "Maths & Number Theory", difficulty: 'Medium', pattern: "Math (Modular Exponentiation)", leetcode: 372, order: 181 },
  { id: 'kth-smallest-in-lexicographical-order', name: "K-th Smallest in Lexicographical Order", topicKey: 'arrays', section: "Maths & Number Theory", difficulty: 'Hard', pattern: "Math", leetcode: 440, order: 182 },
  { id: 'minimum-moves-to-equal-array-elements', name: "Minimum Moves to Equal Array Elements", topicKey: 'arrays', section: "Maths & Number Theory", difficulty: 'Medium', pattern: "Math", leetcode: 453, order: 183 },
  { id: 'self-dividing-numbers', name: "Self Dividing Numbers", topicKey: 'arrays', section: "Maths & Number Theory", difficulty: 'Easy', pattern: "Math", leetcode: 728, order: 184 },
  // ══════════════════════════════════════════════════════
  // STRINGS
  // ══════════════════════════════════════════════════════
  // ── Basics ──
  { id: 'longest-palindromic-substring', name: "Longest Palindromic Substring", topicKey: 'strings', section: "Basics", difficulty: 'Medium', pattern: "Expand Around Center", leetcode: 5, order: 1 },
  { id: 'palindromic-substrings', name: "Palindromic Substrings", topicKey: 'strings', section: "Basics", difficulty: 'Medium', pattern: "Expand Around Center", leetcode: 647, order: 2 },
  { id: 'longest-common-prefix', name: "Longest Common Prefix", topicKey: 'strings', section: "Basics", difficulty: 'Easy', pattern: "String Simulation", leetcode: 14, order: 3 },
  { id: 'string-to-integer-atoi', name: "String to Integer (atoi)", topicKey: 'strings', section: "Basics", difficulty: 'Medium', pattern: "Parsing", leetcode: 8, order: 4 },
  { id: 'zigzag-conversion', name: "Zigzag Conversion", topicKey: 'strings', section: "Basics", difficulty: 'Medium', pattern: "Simulation", leetcode: 6, order: 5 },
  { id: 'count-and-say', name: "Count and Say", topicKey: 'strings', section: "Basics", difficulty: 'Medium', pattern: "Simulation", leetcode: 38, order: 6 },
  { id: 'compare-version-numbers', name: "Compare Version Numbers", topicKey: 'strings', section: "Basics", difficulty: 'Medium', pattern: "Parsing", leetcode: 165, order: 7 },
  { id: 'multiply-strings', name: "Multiply Strings", topicKey: 'strings', section: "Basics", difficulty: 'Medium', pattern: "Simulation", leetcode: 43, order: 8 },
  { id: 'add-strings', name: "Add Strings", topicKey: 'strings', section: "Basics", difficulty: 'Easy', pattern: "Simulation", leetcode: 415, order: 9 },
  { id: 'reverse-words-in-a-string', name: "Reverse Words in a String", topicKey: 'strings', section: "Basics", difficulty: 'Medium', pattern: "String Manipulation", leetcode: 151, order: 10 },
  { id: 'valid-number', name: "Valid Number", topicKey: 'strings', section: "Basics", difficulty: 'Hard', pattern: "Parsing", leetcode: 65, order: 11 },
  { id: 'integer-to-english-words', name: "Integer to English Words", topicKey: 'strings', section: "Basics", difficulty: 'Hard', pattern: "Simulation", leetcode: 273, order: 12 },
  { id: 'roman-to-integer', name: "Roman to Integer", topicKey: 'strings', section: "Basics", difficulty: 'Easy', pattern: "Hash Lookup", leetcode: 13, order: 13 },
  { id: 'integer-to-roman', name: "Integer to Roman", topicKey: 'strings', section: "Basics", difficulty: 'Medium', pattern: "Greedy", leetcode: 12, order: 14 },
  { id: 'text-justification', name: "Text Justification", topicKey: 'strings', section: "Basics", difficulty: 'Hard', pattern: "Simulation", leetcode: 68, order: 15 },
  // ── Hashing ──
  { id: 'valid-anagram', name: "Valid Anagram", topicKey: 'strings', section: "Hashing", difficulty: 'Easy', pattern: "Frequency Counting", leetcode: 242, order: 16 },
  { id: 'group-anagrams', name: "Group Anagrams", topicKey: 'strings', section: "Hashing", difficulty: 'Medium', pattern: "Frequency Counting", leetcode: 49, order: 17 },
  { id: 'ransom-note', name: "Ransom Note", topicKey: 'strings', section: "Hashing", difficulty: 'Easy', pattern: "Frequency Counting", leetcode: 383, order: 18 },
  { id: 'isomorphic-strings', name: "Isomorphic Strings", topicKey: 'strings', section: "Hashing", difficulty: 'Easy', pattern: "Hash Lookup", leetcode: 205, order: 19 },
  { id: 'word-pattern', name: "Word Pattern", topicKey: 'strings', section: "Hashing", difficulty: 'Easy', pattern: "Hash Lookup", leetcode: 290, order: 20 },
  { id: 'first-unique-character-in-a-string', name: "First Unique Character in a String", topicKey: 'strings', section: "Hashing", difficulty: 'Easy', pattern: "Frequency Counting", leetcode: 387, order: 21 },
  { id: 'longest-palindrome', name: "Longest Palindrome", topicKey: 'strings', section: "Hashing", difficulty: 'Easy', pattern: "Frequency Counting", leetcode: 409, order: 22 },
  { id: 'group-shifted-strings', name: "Group Shifted Strings", topicKey: 'strings', section: "Hashing", difficulty: 'Medium', pattern: "Hash Lookup", leetcode: 249, order: 23 },
  // ── Two Pointers ──
  { id: 'valid-palindrome', name: "Valid Palindrome", topicKey: 'strings', section: "Two Pointers", difficulty: 'Easy', pattern: "Two Pointers", leetcode: 125, order: 24 },
  { id: 'valid-palindrome-ii', name: "Valid Palindrome II", topicKey: 'strings', section: "Two Pointers", difficulty: 'Easy', pattern: "Two Pointers", leetcode: 680, order: 25 },
  { id: 'reverse-string', name: "Reverse String", topicKey: 'strings', section: "Two Pointers", difficulty: 'Easy', pattern: "Two Pointers", leetcode: 344, order: 26 },
  { id: 'backspace-string-compare', name: "Backspace String Compare", topicKey: 'strings', section: "Two Pointers", difficulty: 'Easy', pattern: "Two Pointers", leetcode: 844, order: 27 },
  { id: 'is-subsequence', name: "Is Subsequence", topicKey: 'strings', section: "Two Pointers", difficulty: 'Easy', pattern: "Two Pointers", leetcode: 392, order: 28 },
  { id: 'merge-strings-alternately', name: "Merge Strings Alternately", topicKey: 'strings', section: "Two Pointers", difficulty: 'Easy', pattern: "Two Pointers", leetcode: 1768, order: 29 },
  { id: 'string-compression', name: "String Compression", topicKey: 'strings', section: "Two Pointers", difficulty: 'Medium', pattern: "Two Pointers", leetcode: 443, order: 30 },
  { id: 'one-edit-distance', name: "One Edit Distance", topicKey: 'strings', section: "Two Pointers", difficulty: 'Medium', pattern: "Two Pointers", leetcode: 161, order: 31 },
  // ── Sliding Window ──
  { id: 'longest-substring-without-repeating', name: "Longest Substring Without Repeating Characters", topicKey: 'strings', section: "Sliding Window", difficulty: 'Medium', pattern: "Sliding Window", leetcode: 3, order: 32 },
  { id: 'longest-repeating-character-replacement', name: "Longest Repeating Character Replacement", topicKey: 'strings', section: "Sliding Window", difficulty: 'Medium', pattern: "Sliding Window", leetcode: 424, order: 33 },
  { id: 'permutation-in-string', name: "Permutation in String", topicKey: 'strings', section: "Sliding Window", difficulty: 'Medium', pattern: "Sliding Window", leetcode: 567, order: 34 },
  { id: 'find-all-anagrams-in-string', name: "Find All Anagrams in a String", topicKey: 'strings', section: "Sliding Window", difficulty: 'Medium', pattern: "Sliding Window", leetcode: 438, order: 35 },
  { id: 'minimum-window-substring', name: "Minimum Window Substring", topicKey: 'strings', section: "Sliding Window", difficulty: 'Hard', pattern: "Sliding Window", leetcode: 76, order: 36 },
  { id: 'longest-substring-two-distinct', name: "Longest Substring with At Most Two Distinct Characters", topicKey: 'strings', section: "Sliding Window", difficulty: 'Medium', pattern: "Sliding Window", leetcode: 340, order: 37 },
  { id: 'substring-concatenation-all-words', name: "Substring with Concatenation of All Words", topicKey: 'strings', section: "Sliding Window", difficulty: 'Hard', pattern: "Sliding Window + Hash Map", leetcode: 30, order: 38 },
  // ── Advanced ──
  { id: 'implement-strstr', name: "Find the Index of the First Occurrence in a String", topicKey: 'strings', section: "Advanced", difficulty: 'Easy', pattern: "Pattern Matching", leetcode: 28, order: 39 },
  { id: 'repeated-substring-pattern', name: "Repeated Substring Pattern", topicKey: 'strings', section: "Advanced", difficulty: 'Easy', pattern: "Pattern Matching", leetcode: 459, order: 40 },
  { id: 'shortest-palindrome', name: "Shortest Palindrome", topicKey: 'strings', section: "Advanced", difficulty: 'Hard', pattern: "KMP", leetcode: 214, order: 41 },
  { id: 'repeated-string-match', name: "Repeated String Match", topicKey: 'strings', section: "Advanced", difficulty: 'Medium', pattern: "Pattern Matching", leetcode: 686, order: 42 },
  // ══════════════════════════════════════════════════════
  // STACKS & QUEUES
  // ══════════════════════════════════════════════════════
  // ── Stack Basics ──
  { id: 'valid-parentheses', name: "Valid Parentheses", topicKey: 'stacks-queues', section: "Stack Basics", difficulty: 'Easy', pattern: "Stack Simulation", leetcode: 20, order: 1 },
  { id: 'min-stack', name: "Min Stack", topicKey: 'stacks-queues', section: "Stack Basics", difficulty: 'Medium', pattern: "Stack Design", leetcode: 155, order: 2 },
  { id: 'validate-stack-sequences', name: "Validate Stack Sequences", topicKey: 'stacks-queues', section: "Stack Basics", difficulty: 'Medium', pattern: "Stack Simulation", leetcode: 946, order: 3 },
  { id: 'design-stack-with-increment', name: "Design a Stack With Increment Operation", topicKey: 'stacks-queues', section: "Stack Basics", difficulty: 'Medium', pattern: "Stack Design", leetcode: 1381, order: 4 },
  // ── Queue Basics ──
  { id: 'implement-queue-using-stacks', name: "Implement Queue using Stacks", topicKey: 'stacks-queues', section: "Queue Basics", difficulty: 'Easy', pattern: "Stack Simulation", leetcode: 232, order: 5 },
  { id: 'implement-stack-using-queues', name: "Implement Stack using Queues", topicKey: 'stacks-queues', section: "Queue Basics", difficulty: 'Easy', pattern: "Queue Simulation", leetcode: 225, order: 6 },
  { id: 'design-circular-queue', name: "Design Circular Queue", topicKey: 'stacks-queues', section: "Queue Basics", difficulty: 'Medium', pattern: "Queue Design", leetcode: 622, order: 7 },
  { id: 'dota2-senate', name: "Dota2 Senate", topicKey: 'stacks-queues', section: "Queue Basics", difficulty: 'Medium', pattern: "Greedy + Queue", leetcode: 649, order: 8 },
  // ── Stack Applications ──
  { id: 'evaluate-reverse-polish-notation', name: "Evaluate Reverse Polish Notation", topicKey: 'stacks-queues', section: "Stack Applications", difficulty: 'Medium', pattern: "Stack Simulation", leetcode: 150, order: 9 },
  { id: 'basic-calculator', name: "Basic Calculator", topicKey: 'stacks-queues', section: "Stack Applications", difficulty: 'Hard', pattern: "Stack Simulation", leetcode: 224, order: 10 },
  { id: 'basic-calculator-ii', name: "Basic Calculator II", topicKey: 'stacks-queues', section: "Stack Applications", difficulty: 'Medium', pattern: "Stack Simulation", leetcode: 227, order: 11 },
  { id: 'asteroid-collision', name: "Asteroid Collision", topicKey: 'stacks-queues', section: "Stack Applications", difficulty: 'Medium', pattern: "Stack Simulation", leetcode: 735, order: 12 },
  { id: 'decode-string', name: "Decode String", topicKey: 'stacks-queues', section: "Stack Applications", difficulty: 'Medium', pattern: "Stack Simulation", leetcode: 394, order: 13 },
  { id: 'simplify-path', name: "Simplify Path", topicKey: 'stacks-queues', section: "Stack Applications", difficulty: 'Medium', pattern: "Stack Simulation", leetcode: 71, order: 14 },
  { id: 'remove-adjacent-duplicates-in-string', name: "Remove All Adjacent Duplicates In String", topicKey: 'stacks-queues', section: "Stack Applications", difficulty: 'Easy', pattern: "Stack Simulation", leetcode: 1047, order: 15 },
  { id: 'remove-adjacent-duplicates-in-string-ii', name: "Remove All Adjacent Duplicates in String II", topicKey: 'stacks-queues', section: "Stack Applications", difficulty: 'Medium', pattern: "Stack Simulation", leetcode: 1209, order: 16 },
  { id: 'exclusive-time-of-functions', name: "Exclusive Time of Functions", topicKey: 'stacks-queues', section: "Stack Applications", difficulty: 'Medium', pattern: "Stack Simulation", leetcode: 636, order: 17 },
  { id: 'score-of-parentheses', name: "Score of Parentheses", topicKey: 'stacks-queues', section: "Stack Applications", difficulty: 'Medium', pattern: "Stack Simulation", leetcode: 856, order: 18 },
  { id: 'flatten-nested-list-iterator', name: "Flatten Nested List Iterator", topicKey: 'stacks-queues', section: "Stack Applications", difficulty: 'Medium', pattern: "Stack + Queue", leetcode: 341, order: 19 },
  { id: 'minimum-add-to-make-parentheses-valid', name: "Minimum Add to Make Parentheses Valid", topicKey: 'stacks-queues', section: "Stack Applications", difficulty: 'Medium', pattern: "Local Greedy", leetcode: 921, order: 20 },
  { id: 'minimum-remove-to-make-valid-parentheses', name: "Minimum Remove to Make Valid Parentheses", topicKey: 'stacks-queues', section: "Stack Applications", difficulty: 'Medium', pattern: "Greedy + Stack", leetcode: 1249, order: 21 },
  { id: 'valid-parenthesis-string', name: "Valid Parenthesis String", topicKey: 'stacks-queues', section: "Stack Applications", difficulty: 'Medium', pattern: "Local Greedy", leetcode: 678, order: 22 },
  // ── Monotonic Stack ──
  { id: 'daily-temperatures', name: "Daily Temperatures", topicKey: 'stacks-queues', section: "Monotonic Stack", difficulty: 'Medium', pattern: "Monotonic Stack", leetcode: 739, order: 23 },
  { id: 'largest-rectangle-in-histogram', name: "Largest Rectangle in Histogram", topicKey: 'stacks-queues', section: "Monotonic Stack", difficulty: 'Hard', pattern: "Monotonic Stack", leetcode: 84, order: 24 },
  { id: 'next-greater-element-i', name: "Next Greater Element I", topicKey: 'stacks-queues', section: "Monotonic Stack", difficulty: 'Easy', pattern: "Monotonic Stack", leetcode: 496, order: 25 },
  { id: 'next-greater-element-ii', name: "Next Greater Element II", topicKey: 'stacks-queues', section: "Monotonic Stack", difficulty: 'Medium', pattern: "Monotonic Stack", leetcode: 503, order: 26 },
  { id: 'remove-k-digits', name: "Remove K Digits", topicKey: 'stacks-queues', section: "Monotonic Stack", difficulty: 'Medium', pattern: "Monotonic Stack", leetcode: 402, order: 27 },
  { id: 'next-greater-element-iii', name: "Next Greater Element III", topicKey: 'stacks-queues', section: "Monotonic Stack", difficulty: 'Medium', pattern: "Monotonic Stack", leetcode: 556, order: 27.1 },
  { id: 'maximal-rectangle', name: "Maximal Rectangle", topicKey: 'stacks-queues', section: "Monotonic Stack", difficulty: 'Hard', pattern: "Monotonic Stack", leetcode: 85, order: 28 },
  { id: 'online-stock-span', name: "Online Stock Span", topicKey: 'stacks-queues', section: "Monotonic Stack", difficulty: 'Medium', pattern: "Monotonic Stack", leetcode: 901, order: 29 },
  { id: 'car-fleet', name: "Car Fleet", topicKey: 'stacks-queues', section: "Monotonic Stack", difficulty: 'Medium', pattern: "Monotonic Stack", leetcode: 853, order: 30 },
  { id: 'sum-of-subarray-minimums', name: "Sum of Subarray Minimums", topicKey: 'stacks-queues', section: "Monotonic Stack", difficulty: 'Medium', pattern: "Monotonic Stack", leetcode: 907, order: 31 },
  { id: '132-pattern', name: "132 Pattern", topicKey: 'stacks-queues', section: "Monotonic Stack", difficulty: 'Medium', pattern: "Monotonic Stack", leetcode: 456, order: 32 },
  { id: 'remove-duplicate-letters', name: "Remove Duplicate Letters", topicKey: 'stacks-queues', section: "Monotonic Stack", difficulty: 'Medium', pattern: "Greedy + Monotonic Stack", leetcode: 316, order: 33 },
  { id: 'create-maximum-number', name: "Create Maximum Number", topicKey: 'stacks-queues', section: "Monotonic Stack", difficulty: 'Hard', pattern: "Greedy + Monotonic Stack", leetcode: 321, order: 34 },
  // ── Monotonic Queue / Deque ──
  { id: 'sliding-window-maximum', name: "Sliding Window Maximum", topicKey: 'stacks-queues', section: "Monotonic Queue / Deque", difficulty: 'Hard', pattern: "Sliding Window + Deque", leetcode: 239, order: 35 },
  { id: 'longest-subarray-abs-diff-limit', name: "Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit", topicKey: 'stacks-queues', section: "Monotonic Queue / Deque", difficulty: 'Medium', pattern: "Sliding Window + Deque", leetcode: 1438, order: 36 },
  // ══════════════════════════════════════════════════════
  // RECURSION & BACKTRACKING
  // ══════════════════════════════════════════════════════
  // ── Recursion Fundamentals ──
  { id: 'count-numbers-with-unique-digits', name: "Count Numbers with Unique Digits", topicKey: 'recursion', section: "Recursion Fundamentals", difficulty: 'Medium', pattern: "Recursion / Math", leetcode: 357, order: 1 },
  { id: 'fibonacci-number', name: "Fibonacci Number", topicKey: 'recursion', section: "Recursion Fundamentals", difficulty: 'Easy', pattern: "Basic Recursion", leetcode: 509, order: 2 },
  { id: 'permutation-sequence', name: "Permutation Sequence", topicKey: 'recursion', section: "Recursion Fundamentals", difficulty: 'Hard', pattern: "Recursion / Math", leetcode: 60, order: 3 },
  // ── Divide and Conquer ──
  { id: 'different-ways-to-add-parentheses', name: "Different Ways to Add Parentheses", topicKey: 'recursion', section: "Divide and Conquer", difficulty: 'Medium', pattern: "Divide and Conquer", leetcode: 241, order: 4 },
  { id: 'pow-x-n', name: "Pow(x, n)", topicKey: 'recursion', section: "Divide and Conquer", difficulty: 'Medium', pattern: "Divide and Conquer", leetcode: 50, order: 5 },
  // ── Backtracking Fundamentals ──
  { id: 'letter-combinations-phone-number', name: "Letter Combinations of a Phone Number", topicKey: 'recursion', section: "Backtracking Fundamentals", difficulty: 'Medium', pattern: "Backtracking", leetcode: 17, order: 6 },
  { id: 'generate-parentheses', name: "Generate Parentheses", topicKey: 'recursion', section: "Backtracking Fundamentals", difficulty: 'Medium', pattern: "Backtracking", leetcode: 22, order: 7 },
  { id: 'subsets', name: "Subsets", topicKey: 'recursion', section: "Backtracking Fundamentals", difficulty: 'Medium', pattern: "Backtracking", leetcode: 78, order: 8 },
  { id: 'subsets-ii', name: "Subsets II", topicKey: 'recursion', section: "Backtracking Fundamentals", difficulty: 'Medium', pattern: "Backtracking", leetcode: 90, order: 9 },
  { id: 'permutations', name: "Permutations", topicKey: 'recursion', section: "Backtracking Fundamentals", difficulty: 'Medium', pattern: "Backtracking", leetcode: 46, order: 10 },
  { id: 'permutations-ii', name: "Permutations II", topicKey: 'recursion', section: "Backtracking Fundamentals", difficulty: 'Medium', pattern: "Backtracking", leetcode: 47, order: 11 },
  { id: 'combinations', name: "Combinations", topicKey: 'recursion', section: "Backtracking Fundamentals", difficulty: 'Medium', pattern: "Backtracking", leetcode: 77, order: 12 },
  { id: 'combination-sum', name: "Combination Sum", topicKey: 'recursion', section: "Backtracking Fundamentals", difficulty: 'Medium', pattern: "Backtracking", leetcode: 39, order: 13 },
  { id: 'combination-sum-ii', name: "Combination Sum II", topicKey: 'recursion', section: "Backtracking Fundamentals", difficulty: 'Medium', pattern: "Backtracking", leetcode: 40, order: 14 },
  { id: 'combination-sum-iii', name: "Combination Sum III", topicKey: 'recursion', section: "Backtracking Fundamentals", difficulty: 'Medium', pattern: "Backtracking", leetcode: 216, order: 15 },
  { id: 'letter-case-permutation', name: "Letter Case Permutation", topicKey: 'recursion', section: "Backtracking Fundamentals", difficulty: 'Medium', pattern: "Backtracking", leetcode: 784, order: 16 },
  { id: 'factor-combinations', name: "Factor Combinations", topicKey: 'recursion', section: "Backtracking Fundamentals", difficulty: 'Medium', pattern: "Backtracking", leetcode: 254, order: 17 },
  { id: 'kth-lexicographical-happy-string', name: "The k-th Lexicographical String of All Happy Strings of Length n", topicKey: 'recursion', section: "Backtracking Fundamentals", difficulty: 'Medium', pattern: "Backtracking", leetcode: 1415, order: 18 },
  { id: 'gray-code', name: "Gray Code", topicKey: 'recursion', section: "Backtracking Fundamentals", difficulty: 'Medium', pattern: "Backtracking", leetcode: 89, order: 19 },
  { id: 'generalized-abbreviation', name: "Generalized Abbreviation", topicKey: 'recursion', section: "Backtracking Fundamentals", difficulty: 'Medium', pattern: "Backtracking", leetcode: 320, order: 20 },
  { id: 'binary-watch', name: "Binary Watch", topicKey: 'recursion', section: "Backtracking Fundamentals", difficulty: 'Easy', pattern: "Backtracking", leetcode: 401, order: 21 },
  { id: 'iterator-for-combination', name: "Iterator for Combination", topicKey: 'recursion', section: "Backtracking Fundamentals", difficulty: 'Medium', pattern: "Backtracking", leetcode: 1286, order: 22 },
  // ── Constraint Backtracking ──
  { id: 'n-queens', name: "N-Queens", topicKey: 'recursion', section: "Constraint Backtracking", difficulty: 'Hard', pattern: "Backtracking", leetcode: 51, order: 23 },
  { id: 'n-queens-ii', name: "N-Queens II", topicKey: 'recursion', section: "Constraint Backtracking", difficulty: 'Hard', pattern: "Backtracking", leetcode: 52, order: 24 },
  { id: 'sudoku-solver', name: "Sudoku Solver", topicKey: 'recursion', section: "Constraint Backtracking", difficulty: 'Hard', pattern: "Backtracking", leetcode: 37, order: 25 },
  { id: 'word-search', name: "Word Search", topicKey: 'recursion', section: "Constraint Backtracking", difficulty: 'Medium', pattern: "Backtracking Grid", leetcode: 79, order: 26 },
  { id: 'word-search-ii', name: "Word Search II", topicKey: 'recursion', section: "Constraint Backtracking", difficulty: 'Hard', pattern: "Backtracking + Trie", leetcode: 212, order: 27 },
  { id: 'restore-ip-addresses', name: "Restore IP Addresses", topicKey: 'recursion', section: "Constraint Backtracking", difficulty: 'Medium', pattern: "Backtracking", leetcode: 93, order: 28 },
  { id: 'beautiful-arrangement', name: "Beautiful Arrangement", topicKey: 'recursion', section: "Constraint Backtracking", difficulty: 'Medium', pattern: "Backtracking", leetcode: 526, order: 29 },
  { id: 'matchsticks-to-square', name: "Matchsticks to Square", topicKey: 'recursion', section: "Constraint Backtracking", difficulty: 'Medium', pattern: "Backtracking", leetcode: 473, order: 30 },
  { id: 'partition-k-equal-sum-subsets', name: "Partition to K Equal Sum Subsets", topicKey: 'recursion', section: "Constraint Backtracking", difficulty: 'Medium', pattern: "Backtracking", leetcode: 698, order: 31 },
  { id: 'splitting-string-descending-values', name: "Splitting a String Into Descending Consecutive Values", topicKey: 'recursion', section: "Constraint Backtracking", difficulty: 'Medium', pattern: "Backtracking", leetcode: 1849, order: 32 },
  { id: 'expression-add-operators', name: "Expression Add Operators", topicKey: 'recursion', section: "Constraint Backtracking", difficulty: 'Hard', pattern: "Backtracking", leetcode: 282, order: 33 },
  { id: 'remove-invalid-parentheses', name: "Remove Invalid Parentheses", topicKey: 'recursion', section: "Constraint Backtracking", difficulty: 'Hard', pattern: "Backtracking + BFS", leetcode: 301, order: 34 },
  { id: 'unique-paths-iii', name: "Unique Paths III", topicKey: 'recursion', section: "Constraint Backtracking", difficulty: 'Hard', pattern: "Backtracking Grid", leetcode: 980, order: 35 },
  { id: 'android-unlock-patterns', name: "Android Unlock Patterns", topicKey: 'recursion', section: "Constraint Backtracking", difficulty: 'Medium', pattern: "Backtracking", leetcode: 351, order: 36 },
  { id: 'stickers-to-spell-word', name: "Stickers to Spell Word", topicKey: 'recursion', section: "Constraint Backtracking", difficulty: 'Hard', pattern: "Backtracking + Memoization", leetcode: 691, order: 37 },
  { id: 'flip-game-ii', name: "Flip Game II", topicKey: 'recursion', section: "Constraint Backtracking", difficulty: 'Medium', pattern: "Backtracking + Memoization", leetcode: 294, order: 38 },
  // ══════════════════════════════════════════════════════
  // LINKED LISTS
  // ══════════════════════════════════════════════════════
  // ── Basics ──
  { id: 'add-two-numbers', name: "Add Two Numbers", topicKey: 'linked-lists', section: "Basics", difficulty: 'Medium', pattern: "Simulation", leetcode: 2, order: 1 },
  { id: 'remove-linked-list-elements', name: "Remove Linked List Elements", topicKey: 'linked-lists', section: "Basics", difficulty: 'Easy', pattern: "Pointer Manipulation", leetcode: 203, order: 2 },
  { id: 'design-linked-list', name: "Design Linked List", topicKey: 'linked-lists', section: "Basics", difficulty: 'Medium', pattern: "Linked List Design", leetcode: 707, order: 3 },
  { id: 'delete-node-in-linked-list', name: "Delete Node in a Linked List", topicKey: 'linked-lists', section: "Basics", difficulty: 'Medium', pattern: "Pointer Manipulation", leetcode: 237, order: 4 },
  { id: 'convert-binary-number-linked-list', name: "Convert Binary Number in a Linked List to Integer", topicKey: 'linked-lists', section: "Basics", difficulty: 'Easy', pattern: "Traversal + Bit Manipulation", leetcode: 1290, order: 5 },
  // ── Pointer Patterns ──
  { id: 'linked-list-cycle', name: "Linked List Cycle", topicKey: 'linked-lists', section: "Pointer Patterns", difficulty: 'Easy', pattern: "Fast & Slow Pointers", leetcode: 141, order: 6 },
  { id: 'remove-nth-node-from-end', name: "Remove Nth Node From End of List", topicKey: 'linked-lists', section: "Pointer Patterns", difficulty: 'Medium', pattern: "Two Pointers", leetcode: 19, order: 7 },
  { id: 'linked-list-cycle-ii', name: "Linked List Cycle II", topicKey: 'linked-lists', section: "Pointer Patterns", difficulty: 'Medium', pattern: "Fast & Slow Pointers", leetcode: 142, order: 8 },
  { id: 'palindrome-linked-list', name: "Palindrome Linked List", topicKey: 'linked-lists', section: "Pointer Patterns", difficulty: 'Easy', pattern: "Fast & Slow Pointers", leetcode: 234, order: 9 },
  { id: 'intersection-of-two-linked-lists', name: "Intersection of Two Linked Lists", topicKey: 'linked-lists', section: "Pointer Patterns", difficulty: 'Easy', pattern: "Two Pointers", leetcode: 160, order: 10 },
  { id: 'middle-of-linked-list', name: "Middle of the Linked List", topicKey: 'linked-lists', section: "Pointer Patterns", difficulty: 'Easy', pattern: "Fast & Slow Pointers", leetcode: 876, order: 11 },
  // ── In-place Manipulation ──
  { id: 'reorder-list', name: "Reorder List", topicKey: 'linked-lists', section: "In-place Manipulation", difficulty: 'Medium', pattern: "Split + Reverse + Merge", leetcode: 143, order: 12 },
  { id: 'odd-even-linked-list', name: "Odd Even Linked List", topicKey: 'linked-lists', section: "In-place Manipulation", difficulty: 'Medium', pattern: "Pointer Manipulation", leetcode: 328, order: 13 },
  { id: 'swap-nodes-in-pairs', name: "Swap Nodes in Pairs", topicKey: 'linked-lists', section: "In-place Manipulation", difficulty: 'Medium', pattern: "Pointer Manipulation", leetcode: 24, order: 14 },
  { id: 'reverse-linked-list-ii', name: "Reverse Linked List II", topicKey: 'linked-lists', section: "In-place Manipulation", difficulty: 'Medium', pattern: "In-place Pointer Reversal", leetcode: 92, order: 15 },
  { id: 'rotate-list', name: "Rotate List", topicKey: 'linked-lists', section: "In-place Manipulation", difficulty: 'Medium', pattern: "Circular Linked List", leetcode: 61, order: 16 },
  { id: 'partition-list', name: "Partition List", topicKey: 'linked-lists', section: "In-place Manipulation", difficulty: 'Medium', pattern: "Pointer Manipulation", leetcode: 86, order: 17 },
  { id: 'split-linked-list-in-parts', name: "Split Linked List in Parts", topicKey: 'linked-lists', section: "In-place Manipulation", difficulty: 'Medium', pattern: "Pointer Manipulation", leetcode: 725, order: 18 },
  { id: 'remove-duplicates-sorted-list-ii', name: "Remove Duplicates from Sorted List II", topicKey: 'linked-lists', section: "In-place Manipulation", difficulty: 'Medium', pattern: "Pointer Manipulation", leetcode: 82, order: 19 },
  // ── Recursive Linked Lists ──
  { id: 'reverse-linked-list-iterative', name: "Reverse Linked List", topicKey: 'linked-lists', section: "Recursive Linked Lists", difficulty: 'Easy', pattern: "In-place Pointer Reversal (Iterative)", leetcode: 206, order: 20, enforcedApproach: 'iterative' },
  { id: 'reverse-linked-list-recursive', name: "Reverse Linked List", topicKey: 'linked-lists', section: "Recursive Linked Lists", difficulty: 'Easy', pattern: "In-place Pointer Reversal (Recursive)", leetcode: 206, order: 20.1, enforcedApproach: 'recursive' },
  { id: 'merge-two-sorted-lists-iterative', name: "Merge Two Sorted Lists", topicKey: 'linked-lists', section: "Recursive Linked Lists", difficulty: 'Easy', pattern: "Merge (Iterative)", leetcode: 21, order: 21, enforcedApproach: 'iterative' },
  { id: 'merge-two-sorted-lists-recursive', name: "Merge Two Sorted Lists", topicKey: 'linked-lists', section: "Recursive Linked Lists", difficulty: 'Easy', pattern: "Merge (Recursive)", leetcode: 21, order: 21.1, enforcedApproach: 'recursive' },
  { id: 'remove-duplicates-sorted-list', name: "Remove Duplicates from Sorted List", topicKey: 'linked-lists', section: "Recursive Linked Lists", difficulty: 'Easy', pattern: "Pointer Manipulation", leetcode: 83, order: 22 },
  // ── Advanced ──
  { id: 'copy-list-with-random-pointer', name: "Copy List with Random Pointer", topicKey: 'linked-lists', section: "Advanced", difficulty: 'Medium', pattern: "Hash Map", leetcode: 138, order: 23 },
  { id: 'lru-cache', name: "LRU Cache", topicKey: 'linked-lists', section: "Advanced", difficulty: 'Medium', pattern: "Hash Map + Doubly Linked List", leetcode: 146, order: 24 },
  { id: 'sort-list', name: "Sort List", topicKey: 'linked-lists', section: "Advanced", difficulty: 'Medium', pattern: "Merge Sort", leetcode: 148, order: 25 },
  { id: 'merge-k-sorted-lists', name: "Merge k Sorted Lists", topicKey: 'linked-lists', section: "Advanced", difficulty: 'Hard', pattern: "Divide and Conquer + Heap", leetcode: 23, order: 26 },
  { id: 'flatten-multilevel-doubly-linked-list', name: "Flatten a Multilevel Doubly Linked List", topicKey: 'linked-lists', section: "Advanced", difficulty: 'Medium', pattern: "Linked List + DFS", leetcode: 430, order: 27 },
  { id: 'lfu-cache', name: "LFU Cache", topicKey: 'linked-lists', section: "Advanced", difficulty: 'Hard', pattern: "Hash Map + Doubly Linked List", leetcode: 460, order: 28 },
  // ══════════════════════════════════════════════════════
  // TREES
  // ══════════════════════════════════════════════════════
  // ── Foundations ──
  { id: 'maximum-depth-of-binary-tree', name: "Maximum Depth of Binary Tree", topicKey: 'trees', section: "Foundations", difficulty: 'Easy', pattern: "DFS + Height", leetcode: 104, order: 1 },
  { id: 'minimum-depth-of-binary-tree', name: "Minimum Depth of Binary Tree", topicKey: 'trees', section: "Foundations", difficulty: 'Easy', pattern: "BFS", leetcode: 111, order: 2 },
  // ── DFS Traversals ──
  { id: 'same-tree', name: "Same Tree", topicKey: 'trees', section: "DFS Traversals", difficulty: 'Easy', pattern: "DFS + Structural Comparison", leetcode: 100, order: 3 },
  { id: 'invert-binary-tree', name: "Invert Binary Tree", topicKey: 'trees', section: "DFS Traversals", difficulty: 'Easy', pattern: "DFS / BFS", leetcode: 226, order: 4 },
  { id: 'symmetric-tree', name: "Symmetric Tree", topicKey: 'trees', section: "DFS Traversals", difficulty: 'Easy', pattern: "DFS + Mirror Comparison", leetcode: 101, order: 5 },
  { id: 'binary-tree-inorder-traversal-recursive', name: "Binary Tree Inorder Traversal", topicKey: 'trees', section: "DFS Traversals", difficulty: 'Easy', pattern: "Recursive DFS", leetcode: 94, order: 6, enforcedApproach: 'recursive' },
  { id: 'binary-tree-inorder-traversal-iterative', name: "Binary Tree Inorder Traversal", topicKey: 'trees', section: "DFS Traversals", difficulty: 'Easy', pattern: "Iterative DFS + Stack", leetcode: 94, order: 6.1, enforcedApproach: 'iterative' },
  { id: 'binary-tree-preorder-traversal-recursive', name: "Binary Tree Preorder Traversal", topicKey: 'trees', section: "DFS Traversals", difficulty: 'Easy', pattern: "Recursive DFS", leetcode: 144, order: 7, enforcedApproach: 'recursive' },
  { id: 'binary-tree-preorder-traversal-iterative', name: "Binary Tree Preorder Traversal", topicKey: 'trees', section: "DFS Traversals", difficulty: 'Easy', pattern: "Iterative DFS + Stack", leetcode: 144, order: 7.1, enforcedApproach: 'iterative' },
  { id: 'binary-tree-postorder-traversal-recursive', name: "Binary Tree Postorder Traversal", topicKey: 'trees', section: "DFS Traversals", difficulty: 'Easy', pattern: "Recursive DFS", leetcode: 145, order: 8, enforcedApproach: 'recursive' },
  { id: 'binary-tree-postorder-traversal-iterative', name: "Binary Tree Postorder Traversal", topicKey: 'trees', section: "DFS Traversals", difficulty: 'Easy', pattern: "Iterative DFS + Two Stacks", leetcode: 145, order: 8.1, enforcedApproach: 'iterative' },
  { id: 'subtree-of-another-tree', name: "Subtree of Another Tree", topicKey: 'trees', section: "DFS Traversals", difficulty: 'Easy', pattern: "DFS + Subtree Matching", leetcode: 572, order: 9 },
  // ── BFS ──
  { id: 'binary-tree-level-order-traversal', name: "Binary Tree Level Order Traversal", topicKey: 'trees', section: "BFS", difficulty: 'Medium', pattern: "BFS", leetcode: 102, order: 10 },
  { id: 'binary-tree-zigzag-level-order', name: "Binary Tree Zigzag Level Order Traversal", topicKey: 'trees', section: "BFS", difficulty: 'Medium', pattern: "BFS", leetcode: 103, order: 11 },
  { id: 'populate-next-right-pointers', name: "Populating Next Right Pointers in Each Node", topicKey: 'trees', section: "BFS", difficulty: 'Medium', pattern: "BFS", leetcode: 116, order: 12 },
  { id: 'binary-tree-right-side-view', name: "Binary Tree Right Side View", topicKey: 'trees', section: "BFS", difficulty: 'Medium', pattern: "BFS", leetcode: 199, order: 13 },
  { id: 'maximum-width-of-binary-tree', name: "Maximum Width of Binary Tree", topicKey: 'trees', section: "BFS", difficulty: 'Medium', pattern: "BFS", leetcode: 662, order: 14 },
  { id: 'n-ary-tree-level-order-traversal', name: "N-ary Tree Level Order Traversal", topicKey: 'trees', section: "BFS", difficulty: 'Medium', pattern: "BFS", leetcode: 429, order: 15 },
  { id: 'average-of-levels-in-binary-tree', name: "Average of Levels in Binary Tree", topicKey: 'trees', section: "BFS", difficulty: 'Easy', pattern: "BFS", leetcode: 637, order: 16 },
  // ── DFS Problem Solving ──
  { id: 'path-sum', name: "Path Sum", topicKey: 'trees', section: "DFS Problem Solving", difficulty: 'Easy', pattern: "Root-to-Leaf DFS", leetcode: 112, order: 17 },
  { id: 'path-sum-ii', name: "Path Sum II", topicKey: 'trees', section: "DFS Problem Solving", difficulty: 'Medium', pattern: "Root-to-Leaf DFS + Backtracking", leetcode: 113, order: 18 },
  { id: 'path-sum-iii', name: "Path Sum III", topicKey: 'trees', section: "DFS Problem Solving", difficulty: 'Medium', pattern: "DFS + Prefix Sum", leetcode: 437, order: 19 },
  { id: 'binary-tree-maximum-path-sum', name: "Binary Tree Maximum Path Sum", topicKey: 'trees', section: "DFS Problem Solving", difficulty: 'Hard', pattern: "Tree DP", leetcode: 124, order: 20 },
  { id: 'diameter-of-binary-tree', name: "Diameter of Binary Tree", topicKey: 'trees', section: "DFS Problem Solving", difficulty: 'Easy', pattern: "DFS + Postorder", leetcode: 543, order: 21 },
  { id: 'balanced-binary-tree', name: "Balanced Binary Tree", topicKey: 'trees', section: "DFS Problem Solving", difficulty: 'Easy', pattern: "DFS + Height", leetcode: 110, order: 22 },
  { id: 'lowest-common-ancestor-binary-tree', name: "Lowest Common Ancestor of a Binary Tree", topicKey: 'trees', section: "DFS Problem Solving", difficulty: 'Medium', pattern: "DFS + Divide & Conquer", leetcode: 236, order: 23 },
  { id: 'count-good-nodes-in-binary-tree', name: "Count Good Nodes in Binary Tree", topicKey: 'trees', section: "DFS Problem Solving", difficulty: 'Medium', pattern: "DFS + Path Tracking", leetcode: 1448, order: 24 },
  { id: 'sum-root-to-leaf-numbers', name: "Sum Root to Leaf Numbers", topicKey: 'trees', section: "DFS Problem Solving", difficulty: 'Medium', pattern: "Root-to-Leaf DFS", leetcode: 129, order: 25 },
  { id: 'vertical-order-traversal', name: "Vertical Order Traversal of a Binary Tree", topicKey: 'trees', section: "DFS Problem Solving", difficulty: 'Hard', pattern: "BFS/DFS + Sorting", leetcode: 987, order: 26 },
  { id: 'all-nodes-distance-k', name: "All Nodes Distance K in Binary Tree", topicKey: 'trees', section: "DFS Problem Solving", difficulty: 'Medium', pattern: "Graph Conversion + BFS", leetcode: 863, order: 27 },
  { id: 'boundary-of-binary-tree', name: "Boundary of Binary Tree", topicKey: 'trees', section: "DFS Problem Solving", difficulty: 'Medium', pattern: "DFS + Boundary Traversal", leetcode: 545, order: 28 },
  { id: 'find-duplicate-subtrees', name: "Find Duplicate Subtrees", topicKey: 'trees', section: "DFS Problem Solving", difficulty: 'Medium', pattern: "Postorder DFS + Hash Map", leetcode: 652, order: 29 },
  // ── BST ──
  { id: 'lowest-common-ancestor-bst', name: "Lowest Common Ancestor of a Binary Search Tree", topicKey: 'trees', section: "BST", difficulty: 'Medium', pattern: "BST", leetcode: 235, order: 30 },
  { id: 'validate-binary-search-tree', name: "Validate Binary Search Tree", topicKey: 'trees', section: "BST", difficulty: 'Medium', pattern: "BST", leetcode: 98, order: 31 },
  { id: 'kth-smallest-element-in-bst', name: "Kth Smallest Element in a BST", topicKey: 'trees', section: "BST", difficulty: 'Medium', pattern: "BST + Inorder", leetcode: 230, order: 32 },
  { id: 'insert-into-bst', name: "Insert into a Binary Search Tree", topicKey: 'trees', section: "BST", difficulty: 'Medium', pattern: "BST", leetcode: 701, order: 33 },
  { id: 'delete-node-in-bst', name: "Delete Node in a BST", topicKey: 'trees', section: "BST", difficulty: 'Medium', pattern: "BST", leetcode: 450, order: 34 },
  { id: 'convert-sorted-array-to-bst', name: "Convert Sorted Array to Binary Search Tree", topicKey: 'trees', section: "BST", difficulty: 'Easy', pattern: "BST", leetcode: 108, order: 35 },
  { id: 'recover-binary-search-tree', name: "Recover Binary Search Tree", topicKey: 'trees', section: "BST", difficulty: 'Hard', pattern: "BST + Inorder", leetcode: 99, order: 36 },
  { id: 'unique-binary-search-trees', name: "Unique Binary Search Trees", topicKey: 'trees', section: "BST", difficulty: 'Medium', pattern: "DP + Catalan Number", leetcode: 96, order: 37 },
  { id: 'trim-a-binary-search-tree', name: "Trim a Binary Search Tree", topicKey: 'trees', section: "BST", difficulty: 'Medium', pattern: "BST", leetcode: 669, order: 38 },
  { id: 'two-sum-iv-input-is-bst', name: "Two Sum IV - Input is a BST", topicKey: 'trees', section: "BST", difficulty: 'Easy', pattern: "BST + Hash Set", leetcode: 653, order: 39 },
  // ── Tree Construction ──
  { id: 'construct-tree-preorder-inorder', name: "Construct Binary Tree from Preorder and Inorder Traversal", topicKey: 'trees', section: "Tree Construction", difficulty: 'Medium', pattern: "Divide and Conquer", leetcode: 105, order: 40 },
  { id: 'construct-tree-inorder-postorder', name: "Construct Binary Tree from Inorder and Postorder Traversal", topicKey: 'trees', section: "Tree Construction", difficulty: 'Medium', pattern: "Divide and Conquer", leetcode: 106, order: 41 },
  { id: 'serialize-deserialize-binary-tree', name: "Serialize and Deserialize Binary Tree", topicKey: 'trees', section: "Tree Construction", difficulty: 'Hard', pattern: "DFS / BFS", leetcode: 297, order: 42 },
  { id: 'flatten-binary-tree-to-linked-list', name: "Flatten Binary Tree to Linked List", topicKey: 'trees', section: "Tree Construction", difficulty: 'Medium', pattern: "DFS", leetcode: 114, order: 43 },
  { id: 'unique-binary-search-trees-ii', name: "Unique Binary Search Trees II", topicKey: 'trees', section: "Tree Construction", difficulty: 'Medium', pattern: "Backtracking", leetcode: 95, order: 44 },
  // ── Advanced Trees ──
  { id: 'implement-trie-prefix-tree', name: "Implement Trie (Prefix Tree)", topicKey: 'trees', section: "Advanced Trees", difficulty: 'Medium', pattern: "Trie", leetcode: 208, order: 45 },
  { id: 'design-add-search-words-data-structure', name: "Design Add and Search Words Data Structure", topicKey: 'trees', section: "Advanced Trees", difficulty: 'Medium', pattern: "Trie + DFS", leetcode: 211, order: 46 },
  { id: 'replace-words', name: "Replace Words", topicKey: 'trees', section: "Advanced Trees", difficulty: 'Medium', pattern: "Trie", leetcode: 648, order: 47 },
  { id: 'map-sum-pairs', name: "Map Sum Pairs", topicKey: 'trees', section: "Advanced Trees", difficulty: 'Medium', pattern: "Trie", leetcode: 677, order: 48 },
  { id: 'longest-word-in-dictionary', name: "Longest Word in Dictionary", topicKey: 'trees', section: "Advanced Trees", difficulty: 'Medium', pattern: "Trie", leetcode: 720, order: 49 },
  { id: 'maximum-xor-of-two-numbers', name: "Maximum XOR of Two Numbers in an Array", topicKey: 'trees', section: "Advanced Trees", difficulty: 'Medium', pattern: "Trie + Bit Manipulation", leetcode: 421, order: 50 },
  { id: 'palindrome-pairs', name: "Palindrome Pairs", topicKey: 'trees', section: "Advanced Trees", difficulty: 'Hard', pattern: "Trie", leetcode: 336, order: 51 },
  { id: 'stream-of-characters', name: "Stream of Characters", topicKey: 'trees', section: "Advanced Trees", difficulty: 'Hard', pattern: "Trie", leetcode: 1032, order: 52 },
  { id: 'design-search-autocomplete-system', name: "Design Search Autocomplete System", topicKey: 'trees', section: "Advanced Trees", difficulty: 'Hard', pattern: "Trie", leetcode: 642, order: 53 },
  { id: 'short-encoding-of-words', name: "Short Encoding of Words", topicKey: 'trees', section: "Advanced Trees", difficulty: 'Medium', pattern: "Trie", leetcode: 820, order: 54 },
  { id: 'word-squares', name: "Word Squares", topicKey: 'trees', section: "Advanced Trees", difficulty: 'Hard', pattern: "Trie + Backtracking", leetcode: 425, order: 55 },
  { id: 'concatenated-words', name: "Concatenated Words", topicKey: 'trees', section: "Advanced Trees", difficulty: 'Hard', pattern: "Trie + DP", leetcode: 472, order: 56 },
  { id: 'index-pairs-of-a-string', name: "Index Pairs of a String", topicKey: 'trees', section: "Advanced Trees", difficulty: 'Easy', pattern: "Trie", leetcode: 1065, order: 57 },
  { id: 'prefix-and-suffix-search', name: "Prefix and Suffix Search", topicKey: 'trees', section: "Advanced Trees", difficulty: 'Hard', pattern: "Trie", leetcode: 745, order: 58 },
  // ══════════════════════════════════════════════════════
  // GRAPHS
  // ══════════════════════════════════════════════════════
  // ── Graph Basics ──
  { id: 'number-of-islands', name: "Number of Islands", topicKey: 'graphs', section: "Graph Basics", difficulty: 'Medium', pattern: "DFS/BFS Grid", leetcode: 200, order: 1 },
  { id: 'max-area-of-island', name: "Max Area of Island", topicKey: 'graphs', section: "Graph Basics", difficulty: 'Medium', pattern: "DFS/BFS Grid", leetcode: 695, order: 2 },
  { id: 'clone-graph', name: "Clone Graph", topicKey: 'graphs', section: "Graph Basics", difficulty: 'Medium', pattern: "DFS/BFS", leetcode: 133, order: 3 },
  { id: 'surrounded-regions', name: "Surrounded Regions", topicKey: 'graphs', section: "Graph Basics", difficulty: 'Medium', pattern: "DFS/BFS Grid", leetcode: 130, order: 4 },
  { id: 'number-of-connected-components', name: "Number of Connected Components in an Undirected Graph", topicKey: 'graphs', section: "Graph Basics", difficulty: 'Medium', pattern: "Union-Find", leetcode: 323, order: 5 },
  { id: 'flood-fill', name: "Flood Fill", topicKey: 'graphs', section: "Graph Basics", difficulty: 'Easy', pattern: "DFS/BFS Grid", leetcode: 733, order: 6 },
  { id: 'find-the-town-judge', name: "Find the Town Judge", topicKey: 'graphs', section: "Graph Basics", difficulty: 'Easy', pattern: "Graph Degree", leetcode: 997, order: 7 },
  // ── Traversal Applications ──
  { id: 'course-schedule', name: "Course Schedule", topicKey: 'graphs', section: "Traversal Applications", difficulty: 'Medium', pattern: "Topological Sort", leetcode: 207, order: 8 },
  { id: 'course-schedule-ii', name: "Course Schedule II", topicKey: 'graphs', section: "Traversal Applications", difficulty: 'Medium', pattern: "Topological Sort", leetcode: 210, order: 9 },
  { id: 'graph-valid-tree', name: "Graph Valid Tree", topicKey: 'graphs', section: "Traversal Applications", difficulty: 'Medium', pattern: "Union-Find", leetcode: 261, order: 10 },
  { id: 'redundant-connection', name: "Redundant Connection", topicKey: 'graphs', section: "Traversal Applications", difficulty: 'Medium', pattern: "Union-Find", leetcode: 684, order: 11 },
  { id: 'accounts-merge', name: "Accounts Merge", topicKey: 'graphs', section: "Traversal Applications", difficulty: 'Medium', pattern: "Union-Find", leetcode: 721, order: 12 },
  { id: 'is-graph-bipartite', name: "Is Graph Bipartite?", topicKey: 'graphs', section: "Traversal Applications", difficulty: 'Medium', pattern: "Bipartite / BFS Coloring", leetcode: 785, order: 13 },
  { id: 'alien-dictionary', name: "Alien Dictionary", topicKey: 'graphs', section: "Traversal Applications", difficulty: 'Hard', pattern: "Topological Sort", leetcode: 269, order: 14 },
  { id: 'number-of-provinces', name: "Number of Provinces", topicKey: 'graphs', section: "Traversal Applications", difficulty: 'Medium', pattern: "Union-Find / DFS", leetcode: 547, order: 15 },
  { id: 'possible-bipartition', name: "Possible Bipartition", topicKey: 'graphs', section: "Traversal Applications", difficulty: 'Medium', pattern: "Bipartite / BFS Coloring", leetcode: 886, order: 16 },
  { id: 'minimum-height-trees', name: "Minimum Height Trees", topicKey: 'graphs', section: "Traversal Applications", difficulty: 'Medium', pattern: "Topological Sort / BFS", leetcode: 310, order: 17 },
  { id: 'all-paths-source-to-target', name: "All Paths From Source to Target", topicKey: 'graphs', section: "Traversal Applications", difficulty: 'Medium', pattern: "DFS Backtracking", leetcode: 797, order: 18 },
  { id: 'satisfiability-of-equality-equations', name: "Satisfiability of Equality Equations", topicKey: 'graphs', section: "Traversal Applications", difficulty: 'Medium', pattern: "Union-Find", leetcode: 990, order: 19 },
  { id: 'find-eventual-safe-states', name: "Find Eventual Safe States", topicKey: 'graphs', section: "Traversal Applications", difficulty: 'Medium', pattern: "DFS Cycle Detection", leetcode: 802, order: 20 },
  { id: 'minimum-vertices-to-reach-all-nodes', name: "Minimum Number of Vertices to Reach All Nodes", topicKey: 'graphs', section: "Traversal Applications", difficulty: 'Medium', pattern: "Graph In-degree", leetcode: 1557, order: 21 },
  { id: 'loud-and-rich', name: "Loud and Rich", topicKey: 'graphs', section: "Traversal Applications", difficulty: 'Medium', pattern: "DFS + Topological Sort", leetcode: 851, order: 22 },
  { id: 'parallel-courses', name: "Parallel Courses", topicKey: 'graphs', section: "Traversal Applications", difficulty: 'Medium', pattern: "Topological Sort", leetcode: 1136, order: 23 },
  // ── Shortest Paths ──
  { id: 'pacific-atlantic-water-flow', name: "Pacific Atlantic Water Flow", topicKey: 'graphs', section: "Shortest Paths", difficulty: 'Medium', pattern: "Multi-source DFS/BFS", leetcode: 417, order: 24 },
  { id: 'rotting-oranges', name: "Rotting Oranges", topicKey: 'graphs', section: "Shortest Paths", difficulty: 'Medium', pattern: "Multi-source BFS", leetcode: 994, order: 25 },
  { id: 'word-ladder', name: "Word Ladder", topicKey: 'graphs', section: "Shortest Paths", difficulty: 'Hard', pattern: "BFS", leetcode: 127, order: 26 },
  { id: 'word-ladder-ii', name: "Word Ladder II", topicKey: 'graphs', section: "Shortest Paths", difficulty: 'Hard', pattern: "BFS + Backtracking", leetcode: 126, order: 27 },
  { id: 'network-delay-time', name: "Network Delay Time", topicKey: 'graphs', section: "Shortest Paths", difficulty: 'Medium', pattern: "Dijkstra's Algorithm", leetcode: 743, order: 28 },
  { id: 'cheapest-flights-within-k-stops', name: "Cheapest Flights Within K Stops", topicKey: 'graphs', section: "Shortest Paths", difficulty: 'Medium', pattern: "Bellman-Ford", leetcode: 787, order: 29 },
  { id: 'path-with-minimum-effort', name: "Path With Minimum Effort", topicKey: 'graphs', section: "Shortest Paths", difficulty: 'Medium', pattern: "Dijkstra's / Binary Search", leetcode: 1631, order: 30 },
  { id: 'swim-in-rising-water', name: "Swim in Rising Water", topicKey: 'graphs', section: "Shortest Paths", difficulty: 'Hard', pattern: "Dijkstra's / Binary Search", leetcode: 778, order: 31 },
  { id: 'evaluate-division', name: "Evaluate Division", topicKey: 'graphs', section: "Shortest Paths", difficulty: 'Medium', pattern: "Weighted Graph + DFS", leetcode: 399, order: 32 },
  { id: 'shortest-path-in-binary-matrix', name: "Shortest Path in Binary Matrix", topicKey: 'graphs', section: "Shortest Paths", difficulty: 'Medium', pattern: "BFS Grid", leetcode: 1091, order: 33 },
  { id: 'walls-and-gates', name: "Walls and Gates", topicKey: 'graphs', section: "Shortest Paths", difficulty: 'Medium', pattern: "Multi-source BFS", leetcode: 286, order: 34 },
  { id: 'shortest-path-visiting-all-nodes', name: "Shortest Path Visiting All Nodes", topicKey: 'graphs', section: "Shortest Paths", difficulty: 'Hard', pattern: "BFS + Bitmask", leetcode: 847, order: 35 },
  { id: 'the-maze', name: "The Maze", topicKey: 'graphs', section: "Shortest Paths", difficulty: 'Medium', pattern: "DFS/BFS Grid", leetcode: 490, order: 36 },
  { id: 'as-far-from-land-as-possible', name: "As Far from Land as Possible", topicKey: 'graphs', section: "Shortest Paths", difficulty: 'Medium', pattern: "Multi-source BFS", leetcode: 1162, order: 37 },
  { id: 'shortest-bridge', name: "Shortest Bridge", topicKey: 'graphs', section: "Shortest Paths", difficulty: 'Medium', pattern: "DFS + BFS", leetcode: 934, order: 38 },
  { id: 'count-sub-islands', name: "Count Sub Islands", topicKey: 'graphs', section: "Shortest Paths", difficulty: 'Medium', pattern: "DFS Grid", leetcode: 1905, order: 39 },
  { id: 'detonate-the-maximum-bombs', name: "Detonate the Maximum Bombs", topicKey: 'graphs', section: "Shortest Paths", difficulty: 'Medium', pattern: "DFS/BFS Graph", leetcode: 2101, order: 40 },
  { id: 'bus-routes', name: "Bus Routes", topicKey: 'graphs', section: "Shortest Paths", difficulty: 'Hard', pattern: "BFS", leetcode: 815, order: 41 },
  // ── MST ──
  { id: 'min-cost-to-connect-all-points', name: "Min Cost to Connect All Points", topicKey: 'graphs', section: "MST", difficulty: 'Medium', pattern: "MST (Prim's)", leetcode: 1584, order: 42 },
  { id: 'critical-edges-in-mst', name: "Find Critical and Pseudo-Critical Edges in Minimum Spanning Tree", topicKey: 'graphs', section: "MST", difficulty: 'Hard', pattern: "MST (Kruskal's)", leetcode: 1489, order: 43 },
  // ── Advanced ──
  { id: 'reconstruct-itinerary', name: "Reconstruct Itinerary", topicKey: 'graphs', section: "Advanced", difficulty: 'Hard', pattern: "Eulerian Path (Hierholzer's)", leetcode: 332, order: 44 },
  { id: 'critical-connections-in-network', name: "Critical Connections in a Network", topicKey: 'graphs', section: "Advanced", difficulty: 'Hard', pattern: "Tarjan's Bridge Finding", leetcode: 1192, order: 45 },
  { id: 'number-of-islands-ii', name: "Number of Islands II", topicKey: 'graphs', section: "Advanced", difficulty: 'Hard', pattern: "Union-Find", leetcode: 305, order: 46 },
  // ══════════════════════════════════════════════════════
  // DYNAMIC PROGRAMMING
  // ══════════════════════════════════════════════════════
  // ── DP Fundamentals ──
  { id: 'climbing-stairs', name: "Climbing Stairs", topicKey: 'dp', section: "DP Fundamentals", difficulty: 'Easy', pattern: "1D DP", leetcode: 70, order: 1 },
  { id: 'house-robber', name: "House Robber", topicKey: 'dp', section: "DP Fundamentals", difficulty: 'Medium', pattern: "1D DP", leetcode: 198, order: 2 },
  // ── Linear DP ──
  { id: 'maximum-product-subarray-dp', name: "Maximum Product Subarray", topicKey: 'dp', section: "Linear DP", difficulty: 'Medium', pattern: "Dynamic Programming", leetcode: 152, order: 3 },
  { id: 'decode-ways', name: "Decode Ways", topicKey: 'dp', section: "Linear DP", difficulty: 'Medium', pattern: "DP", leetcode: 91, order: 4 },
  { id: 'house-robber-ii', name: "House Robber II", topicKey: 'dp', section: "Linear DP", difficulty: 'Medium', pattern: "1D DP", leetcode: 213, order: 5 },
  { id: 'longest-increasing-subsequence', name: "Longest Increasing Subsequence", topicKey: 'dp', section: "Linear DP", difficulty: 'Medium', pattern: "LIS", leetcode: 300, order: 6 },
  { id: 'best-time-buy-sell-stock-iii', name: "Best Time to Buy and Sell Stock III", topicKey: 'dp', section: "Linear DP", difficulty: 'Hard', pattern: "Stock DP", leetcode: 123, order: 7 },
  { id: 'best-time-buy-sell-stock-iv', name: "Best Time to Buy and Sell Stock IV", topicKey: 'dp', section: "Linear DP", difficulty: 'Hard', pattern: "Stock DP", leetcode: 188, order: 8 },
  { id: 'best-time-buy-sell-stock-cooldown', name: "Best Time to Buy and Sell Stock with Cooldown", topicKey: 'dp', section: "Linear DP", difficulty: 'Medium', pattern: "Stock DP", leetcode: 309, order: 9 },
  { id: 'best-time-buy-sell-stock-fee', name: "Best Time to Buy and Sell Stock with Transaction Fee", topicKey: 'dp', section: "Linear DP", difficulty: 'Medium', pattern: "Stock DP", leetcode: 714, order: 10 },
  { id: 'super-egg-drop', name: "Super Egg Drop", topicKey: 'dp', section: "Linear DP", difficulty: 'Hard', pattern: "DP + Binary Search", leetcode: 887, order: 11 },
  { id: 'paint-house', name: "Paint House", topicKey: 'dp', section: "Linear DP", difficulty: 'Medium', pattern: "1D DP", leetcode: 256, order: 12 },
  { id: 'paint-house-ii', name: "Paint House II", topicKey: 'dp', section: "Linear DP", difficulty: 'Hard', pattern: "1D DP", leetcode: 265, order: 13 },
  { id: 'paint-fence', name: "Paint Fence", topicKey: 'dp', section: "Linear DP", difficulty: 'Medium', pattern: "1D DP", leetcode: 276, order: 14 },
  { id: 'delete-and-earn', name: "Delete and Earn", topicKey: 'dp', section: "Linear DP", difficulty: 'Medium', pattern: "1D DP", leetcode: 740, order: 15 },
  { id: 'partition-array-for-maximum-sum', name: "Partition Array for Maximum Sum", topicKey: 'dp', section: "Linear DP", difficulty: 'Medium', pattern: "1D DP", leetcode: 1043, order: 16 },
  { id: 'count-vowels-permutation', name: "Count Vowels Permutation", topicKey: 'dp', section: "Linear DP", difficulty: 'Hard', pattern: "DP", leetcode: 1220, order: 17 },
  { id: 'domino-and-tromino-tiling', name: "Domino and Tromino Tiling", topicKey: 'dp', section: "Linear DP", difficulty: 'Medium', pattern: "1D DP", leetcode: 790, order: 18 },
  { id: 'largest-divisible-subset', name: "Largest Divisible Subset", topicKey: 'dp', section: "Linear DP", difficulty: 'Medium', pattern: "LIS variant", leetcode: 368, order: 19 },
  { id: 'russian-doll-envelopes', name: "Russian Doll Envelopes", topicKey: 'dp', section: "Linear DP", difficulty: 'Hard', pattern: "LIS + Binary Search", leetcode: 354, order: 20 },
  { id: 'number-of-longest-increasing-subsequence', name: "Number of Longest Increasing Subsequence", topicKey: 'dp', section: "Linear DP", difficulty: 'Medium', pattern: "LIS", leetcode: 673, order: 21 },
  { id: 'minimum-removals-mountain-array', name: "Minimum Number of Removals to Make Mountain Array", topicKey: 'dp', section: "Linear DP", difficulty: 'Hard', pattern: "LIS", leetcode: 1671, order: 22 },
  { id: 'longest-arithmetic-subsequence', name: "Longest Arithmetic Subsequence", topicKey: 'dp', section: "Linear DP", difficulty: 'Medium', pattern: "DP", leetcode: 1027, order: 23 },
  { id: 'arithmetic-slices', name: "Arithmetic Slices", topicKey: 'dp', section: "Linear DP", difficulty: 'Medium', pattern: "1D DP", leetcode: 413, order: 24 },
  { id: 'minimum-number-of-refueling-stops', name: "Minimum Number of Refueling Stops", topicKey: 'dp', section: "Linear DP", difficulty: 'Hard', pattern: "DP + Greedy", leetcode: 871, order: 25 },
  { id: 'maximum-profit-job-scheduling', name: "Maximum Profit in Job Scheduling", topicKey: 'dp', section: "Linear DP", difficulty: 'Hard', pattern: "DP + Binary Search", leetcode: 1235, order: 26 },
  { id: 'minimum-cost-for-tickets', name: "Minimum Cost For Tickets", topicKey: 'dp', section: "Linear DP", difficulty: 'Medium', pattern: "1D DP", leetcode: 983, order: 27 },
  { id: 'new-21-game', name: "New 21 Game", topicKey: 'dp', section: "Linear DP", difficulty: 'Medium', pattern: "Sliding Window DP", leetcode: 837, order: 28 },
  // ── Knapsack Family ──
  { id: 'coin-change', name: "Coin Change", topicKey: 'dp', section: "Knapsack Family", difficulty: 'Medium', pattern: "Unbounded Knapsack", leetcode: 322, order: 29 },
  { id: 'coin-change-ii', name: "Coin Change II", topicKey: 'dp', section: "Knapsack Family", difficulty: 'Medium', pattern: "Unbounded Knapsack", leetcode: 518, order: 30 },
  { id: 'partition-equal-subset-sum', name: "Partition Equal Subset Sum", topicKey: 'dp', section: "Knapsack Family", difficulty: 'Medium', pattern: "0/1 Knapsack", leetcode: 416, order: 31 },
  { id: 'target-sum', name: "Target Sum", topicKey: 'dp', section: "Knapsack Family", difficulty: 'Medium', pattern: "0/1 Knapsack", leetcode: 494, order: 32 },
  { id: 'perfect-squares', name: "Perfect Squares", topicKey: 'dp', section: "Knapsack Family", difficulty: 'Medium', pattern: "Unbounded Knapsack", leetcode: 279, order: 33 },
  { id: 'combination-sum-iv', name: "Combination Sum IV", topicKey: 'dp', section: "Knapsack Family", difficulty: 'Medium', pattern: "Unbounded Knapsack / Permutation DP", leetcode: 377, order: 34 },
  { id: 'shopping-offers', name: "Shopping Offers", topicKey: 'dp', section: "Knapsack Family", difficulty: 'Medium', pattern: "Knapsack + Backtracking", leetcode: 638, order: 35 },
  { id: 'ones-and-zeroes', name: "Ones and Zeroes", topicKey: 'dp', section: "Knapsack Family", difficulty: 'Medium', pattern: "2D Knapsack", leetcode: 474, order: 36 },
  { id: 'profitable-schemes', name: "Profitable Schemes", topicKey: 'dp', section: "Knapsack Family", difficulty: 'Hard', pattern: "Knapsack DP", leetcode: 879, order: 37 },
  // ── Grid DP ──
  { id: 'unique-paths', name: "Unique Paths", topicKey: 'dp', section: "Grid DP", difficulty: 'Medium', pattern: "Grid DP", leetcode: 62, order: 38 },
  { id: 'unique-paths-ii', name: "Unique Paths II", topicKey: 'dp', section: "Grid DP", difficulty: 'Medium', pattern: "Grid DP", leetcode: 63, order: 39 },
  { id: 'minimum-path-sum', name: "Minimum Path Sum", topicKey: 'dp', section: "Grid DP", difficulty: 'Medium', pattern: "Grid DP", leetcode: 64, order: 40 },
  { id: 'triangle', name: "Triangle", topicKey: 'dp', section: "Grid DP", difficulty: 'Medium', pattern: "Grid DP", leetcode: 120, order: 41 },
  { id: 'maximal-square', name: "Maximal Square", topicKey: 'dp', section: "Grid DP", difficulty: 'Medium', pattern: "2D DP", leetcode: 221, order: 42 },
  { id: 'count-square-submatrices-with-all-ones', name: "Count Square Submatrices with All Ones", topicKey: 'dp', section: "Grid DP", difficulty: 'Medium', pattern: "2D DP", leetcode: 1277, order: 43 },
  { id: 'dungeon-game', name: "Dungeon Game", topicKey: 'dp', section: "Grid DP", difficulty: 'Hard', pattern: "2D DP", leetcode: 174, order: 44 },
  { id: 'cherry-pickup', name: "Cherry Pickup", topicKey: 'dp', section: "Grid DP", difficulty: 'Hard', pattern: "2D DP", leetcode: 741, order: 45 },
  { id: 'cherry-pickup-ii', name: "Cherry Pickup II", topicKey: 'dp', section: "Grid DP", difficulty: 'Hard', pattern: "3D DP", leetcode: 1463, order: 46 },
  { id: 'minimum-falling-path-sum', name: "Minimum Falling Path Sum", topicKey: 'dp', section: "Grid DP", difficulty: 'Medium', pattern: "Grid DP", leetcode: 931, order: 47 },
  { id: 'out-of-boundary-paths', name: "Out of Boundary Paths", topicKey: 'dp', section: "Grid DP", difficulty: 'Medium', pattern: "Grid DP + Memoization", leetcode: 576, order: 48 },
  { id: 'knight-probability-in-chessboard', name: "Knight Probability in Chessboard", topicKey: 'dp', section: "Grid DP", difficulty: 'Medium', pattern: "Grid DP", leetcode: 688, order: 49 },
  { id: 'number-of-ways-to-stay-same-place', name: "Number of Ways to Stay in the Same Place After Some Steps", topicKey: 'dp', section: "Grid DP", difficulty: 'Hard', pattern: "Grid DP", leetcode: 1269, order: 50 },
  { id: 'longest-increasing-path-in-matrix', name: "Longest Increasing Path in a Matrix", topicKey: 'dp', section: "Grid DP", difficulty: 'Hard', pattern: "Grid DP + DFS Memoization", leetcode: 329, order: 51 },
  { id: 'maximum-length-of-repeated-subarray', name: "Maximum Length of Repeated Subarray", topicKey: 'dp', section: "Grid DP", difficulty: 'Medium', pattern: "2D DP", leetcode: 718, order: 52 },
  { id: 'largest-plus-sign', name: "Largest Plus Sign", topicKey: 'dp', section: "Grid DP", difficulty: 'Medium', pattern: "2D DP", leetcode: 764, order: 53 },
  // ── String DP ──
  { id: 'word-break', name: "Word Break", topicKey: 'dp', section: "String DP", difficulty: 'Medium', pattern: "DP + Hash Set", leetcode: 139, order: 54 },
  { id: 'word-break-ii', name: "Word Break II", topicKey: 'dp', section: "String DP", difficulty: 'Hard', pattern: "DP + Backtracking", leetcode: 140, order: 55 },
  { id: 'longest-palindromic-subsequence', name: "Longest Palindromic Subsequence", topicKey: 'dp', section: "String DP", difficulty: 'Medium', pattern: "DP", leetcode: 516, order: 56 },
  { id: 'edit-distance', name: "Edit Distance", topicKey: 'dp', section: "String DP", difficulty: 'Hard', pattern: "DP", leetcode: 72, order: 57 },
  { id: 'distinct-subsequences', name: "Distinct Subsequences", topicKey: 'dp', section: "String DP", difficulty: 'Hard', pattern: "DP", leetcode: 115, order: 58 },
  { id: 'interleaving-string', name: "Interleaving String", topicKey: 'dp', section: "String DP", difficulty: 'Medium', pattern: "DP", leetcode: 97, order: 59 },
  { id: 'regular-expression-matching', name: "Regular Expression Matching", topicKey: 'dp', section: "String DP", difficulty: 'Hard', pattern: "DP", leetcode: 10, order: 60 },
  { id: 'wildcard-matching', name: "Wildcard Matching", topicKey: 'dp', section: "String DP", difficulty: 'Hard', pattern: "DP", leetcode: 44, order: 61 },
  { id: 'longest-common-subsequence', name: "Longest Common Subsequence", topicKey: 'dp', section: "String DP", difficulty: 'Medium', pattern: "DP", leetcode: 1143, order: 62 },
  { id: 'delete-operation-two-strings', name: "Delete Operation for Two Strings", topicKey: 'dp', section: "String DP", difficulty: 'Medium', pattern: "DP", leetcode: 583, order: 63 },
  { id: 'minimum-insertion-steps-palindrome', name: "Minimum Insertion Steps to Make a String Palindrome", topicKey: 'dp', section: "String DP", difficulty: 'Hard', pattern: "DP", leetcode: 1312, order: 64 },
  { id: 'minimum-ascii-delete-sum', name: "Minimum ASCII Delete Sum for Two Strings", topicKey: 'dp', section: "String DP", difficulty: 'Medium', pattern: "2D DP", leetcode: 712, order: 65 },
  // ── Interval DP ──
  { id: 'palindrome-partitioning', name: "Palindrome Partitioning", topicKey: 'dp', section: "Interval DP", difficulty: 'Medium', pattern: "Backtracking + DP", leetcode: 131, order: 66 },
  { id: 'burst-balloons', name: "Burst Balloons", topicKey: 'dp', section: "Interval DP", difficulty: 'Hard', pattern: "Interval DP", leetcode: 312, order: 67 },
  { id: 'minimum-cost-tree-from-leaf-values', name: "Minimum Cost Tree From Leaf Values", topicKey: 'dp', section: "Interval DP", difficulty: 'Medium', pattern: "Interval DP", leetcode: 1130, order: 68 },
  { id: 'stone-game', name: "Stone Game", topicKey: 'dp', section: "Interval DP", difficulty: 'Medium', pattern: "Interval DP / Game Theory", leetcode: 877, order: 69 },
  { id: 'predict-the-winner', name: "Predict the Winner", topicKey: 'dp', section: "Interval DP", difficulty: 'Medium', pattern: "Interval DP / Game Theory", leetcode: 486, order: 70 },
  { id: 'minimum-cost-to-cut-a-stick', name: "Minimum Cost to Cut a Stick", topicKey: 'dp', section: "Interval DP", difficulty: 'Hard', pattern: "Interval DP", leetcode: 1547, order: 71 },
  { id: 'count-different-palindromic-subsequences', name: "Count Different Palindromic Subsequences", topicKey: 'dp', section: "Interval DP", difficulty: 'Hard', pattern: "Interval DP", leetcode: 730, order: 72 },
  // ── Tree DP ──
  { id: 'house-robber-iii', name: "House Robber III", topicKey: 'dp', section: "Tree DP", difficulty: 'Medium', pattern: "Tree DP", leetcode: 337, order: 73 },
  { id: 'binary-tree-cameras', name: "Binary Tree Cameras", topicKey: 'dp', section: "Tree DP", difficulty: 'Hard', pattern: "Tree DP + Greedy", leetcode: 968, order: 74 },
  // ── Advanced DP (Optional) ──
  { id: 'min-cost-connect-two-groups-of-points', name: "Minimum Cost to Connect Two Groups of Points", topicKey: 'dp', section: "Advanced DP (Optional)", difficulty: 'Hard', pattern: "Bitmask DP", leetcode: 1595, order: 75 },
  { id: 'find-shortest-superstring', name: "Find the Shortest Superstring", topicKey: 'dp', section: "Advanced DP (Optional)", difficulty: 'Hard', pattern: "Bitmask DP", leetcode: 943, order: 76 },
  { id: 'tallest-billboard', name: "Tallest Billboard", topicKey: 'dp', section: "Advanced DP (Optional)", difficulty: 'Hard', pattern: "Subset DP", leetcode: 956, order: 77 },
  { id: 'numbers-with-repeated-digits', name: "Numbers With Repeated Digits", topicKey: 'dp', section: "Advanced DP (Optional)", difficulty: 'Hard', pattern: "Digit DP", leetcode: 1012, order: 78 },
  { id: 'numbers-at-most-n-given-digit-set', name: "Numbers At Most N Given Digit Set", topicKey: 'dp', section: "Advanced DP (Optional)", difficulty: 'Hard', pattern: "Digit DP", leetcode: 902, order: 79 },
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

export function getProblemsBySection(topicKey, section) {
  return problems
    .filter((p) => p.topicKey === topicKey && p.section === section)
    .sort((a, b) => a.order - b.order);
}

export function getProblem(id) {
  return problems.find((p) => p.id === id);
}

// getEnforcedApproachPairs — utility for consumers (e.g. the roadmap UI) that
// want to surface iterative/recursive duplicate pairs together, since they
// share a leetcode number but have distinct ids.
export function getEnforcedApproachPairs() {
  const byLeetcode = {};
  for (const p of problems) {
    if (!p.enforcedApproach) continue;
    if (!byLeetcode[p.leetcode]) byLeetcode[p.leetcode] = [];
    byLeetcode[p.leetcode].push(p);
  }
  return Object.values(byLeetcode).filter((group) => group.length > 1);
}