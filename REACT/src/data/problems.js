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
// MILESTONE TIERS (now applied across every topic): every problem carries:
//   tier       — 'foundation' | 'core' | 'mastery', the within-section
//                learning-order milestone.
//   bossFight  — true on the problems that close out a section: mixed/
//                synthesis problems combining everything the section taught.
//                These always sort last within their section (via `order`),
//                so the roadmap generator's existing "cut the tail of a
//                section first when budget is tight" trimming naturally
//                drops boss fights before foundation/core content — no
//                change to roadmapGenerator.js needed.
//
// HOW TIERS WERE ASSIGNED, TOPIC BY TOPIC:
//   - Arrays: fully hand-curated in an earlier pass — both the WITHIN-SECTION
//     ORDER and the tier/bossFight assignment were reworked together (see
//     git history / prior conversation), since Arrays' original order had
//     several difficulty-jump issues worth fixing at the same time.
//   - Strings, Stacks & Queues, Recursion & Backtracking, Linked Lists,
//     Trees, Graphs, Dynamic Programming: existing problem ORDER was left
//     completely untouched (it was already sound) — tier/bossFight were
//     assigned by splitting each section proportionally by POSITION
//     (~35% foundation, ~40% core, ~25% mastery) and marking the trailing
//     ~12% (min 1, max 3 per section, skipped for sections under 3 problems)
//     as bossFight. Sections that were already an explicit synthesis
//     section by design — Strings > Capstone, Recursion & Backtracking >
//     Capstone, Trees > Capstone, Graphs > Graph Capstone, DP > DP Capstone
//     — have EVERY problem marked bossFight: true, since that's literally
//     what those sections already are.
//   - Enforced-approach pairs (see below) always share one tier and are
//     never split by a bossFight boundary, regardless of the proportional
//     split — they're paired technique reps, not synthesis problems.
//
// A KNOWN DATA ISSUE, FLAGGED BUT NOT FIXED HERE: 9 problem `id`s are
// duplicated across two different topics (e.g. 'word-search' exists under
// both 'strings' and 'recursion'; 'maximum-subarray' under both 'arrays' and
// 'dp'). Since solved-status is keyed by `pathforge:problem:${id}` in
// localStorage (see progress.js), solving one currently marks BOTH copies
// solved. Full list: backspace-string-compare, decode-string, simplify-path,
// evaluate-reverse-polish-notation, word-search, restore-ip-addresses,
// fibonacci-number, regular-expression-matching, maximum-subarray. Fixing
// this means renaming ids (e.g. suffixing with topic) and needs a look at
// problemDetails.js too, since that keys off the same ids — deliberately
// left alone pending a decision on the renaming scheme.
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
// PATTERN NAMING: `pattern` captures "the main solving technique," not just a
// data structure or a generic traversal label, so the tag itself teaches
// *why* a problem's solution looks the way it does.
//
// ENFORCED-APPROACH DUPLICATE PAIRS: a handful of problems genuinely build
// different intuition depending on whether you solve them iteratively or
// recursively. These share a `leetcode` number but have distinct `id`s and an
// `enforcedApproach` field set to 'iterative' or 'recursive'. Per the global
// rule: the ITERATIVE version always sorts before the RECURSIVE version of
// the same problem, and the two stay adjacent — never split across tiers or
// sections.

export const problems = [
  // ══════════════════════════════════════════════════════
  // ARRAYS
  // ══════════════════════════════════════════════════════
  // ── Array Foundations ──

{ id: 'traverse-array', name: "Traverse an Array", topicKey: 'arrays', section: "Array Foundations", difficulty: 'Easy', pattern: "Array Traversal", order: 0.1, tier: 'foundation' },
{ id: 'find-largest-element', name: "Find Largest Element in Array", topicKey: 'arrays', section: "Array Foundations", difficulty: 'Easy', pattern: "Linear Scan", order: 0.2, tier: 'foundation' },
{ id: 'find-second-largest', name: "Find Second Largest Element", topicKey: 'arrays', section: "Array Foundations", difficulty: 'Easy', pattern: "Linear Scan", order: 0.3, tier: 'foundation' },
{ id: 'check-array-sorted', name: "Check if Array is Sorted", topicKey: 'arrays', section: "Array Foundations", difficulty: 'Easy', pattern: "Linear Scan", order: 0.4, tier: 'foundation' },
{ id: 'reverse-array', name: "Reverse an Array", topicKey: 'arrays', section: "Array Foundations", difficulty: 'Easy', pattern: "Two Pointers", order: 0.5, tier: 'foundation' },
{ id: 'linear-search', name: "Linear Search", topicKey: 'arrays', section: "Array Foundations", difficulty: 'Easy', pattern: "Searching", order: 0.6, tier: 'foundation' },
{ id: 'count-frequency-array', name: "Count Frequency of Elements", topicKey: 'arrays', section: "Array Foundations", difficulty: 'Easy', pattern: "Frequency Counting", order: 0.7, tier: 'foundation' },
{ id: 'remove-element', name: "Remove Element", topicKey: 'arrays', section: "Array Foundations", difficulty: 'Easy', pattern: "In-place Array Modification", leetcode: 27, order: 0.8, tier: 'foundation' },
{ id: 'move-zeroes-basic', name: "Move Zeroes", topicKey: 'arrays', section: "Array Foundations", difficulty: 'Easy', pattern: "Array Manipulation", leetcode: 283, order: 0.9, tier: 'foundation' },
{ id: 'left-rotate-array', name: "Left Rotate Array", topicKey: 'arrays', section: "Array Foundations", difficulty: 'Easy', pattern: "Array Rotation", order: 0.10, tier: 'foundation' },
{ id: 'leaders-in-array', name: "Leaders in an Array", topicKey: 'arrays', section: "Array Foundations", difficulty: 'Easy', pattern: "Right Traversal", order: 0.11, tier: 'core' },
{ id: 'maximum-consecutive-ones', name: "Max Consecutive Ones", topicKey: 'arrays', section: "Array Foundations", difficulty: 'Easy', pattern: "Linear Scan", leetcode: 485, order: 0.12, tier: 'core' },
  // ── Basics ──
  { id: 'pascals-triangle', name: "Pascal's Triangle", topicKey: 'arrays', section: "Basics", difficulty: 'Easy', pattern: "Array Construction", leetcode: 118, order: 0.15, tier: 'foundation' },
  { id: 'rotate-array', name: "Rotate Array", topicKey: 'arrays', section: "Basics", difficulty: 'Medium', pattern: "Array Manipulation", leetcode: 189, order: 2, tier: 'foundation' },
  { id: 'missing-number', name: "Missing Number", topicKey: 'arrays', section: "Basics", difficulty: 'Easy', pattern: "Cyclic Sort", leetcode: 268, order: 3, tier: 'foundation' },
  { id: 'find-disappeared-numbers', name: "Find All Numbers Disappeared in an Array", topicKey: 'arrays', section: "Basics", difficulty: 'Easy', pattern: "Cyclic Sort", leetcode: 448, order: 4, tier: 'core' },
  { id: 'find-duplicate-number', name: "Find the Duplicate Number", topicKey: 'arrays', section: "Basics", difficulty: 'Medium', pattern: "Cyclic Sort", leetcode: 287, order: 5, tier: 'core' },
  { id: 'majority-element', name: "Majority Element", topicKey: 'arrays', section: "Basics", difficulty: 'Easy', pattern: "Boyer-Moore Voting", leetcode: 169, order: 6, tier: 'core' },
  { id: 'majority-element-ii', name: "Majority Element II", topicKey: 'arrays', section: "Basics", difficulty: 'Medium', pattern: "Boyer-Moore Voting", leetcode: 229, order: 7, tier: 'mastery' },
  { id: 'next-permutation', name: "Next Permutation", topicKey: 'arrays', section: "Basics", difficulty: 'Medium', pattern: "Array Simulation", leetcode: 31, order: 8, tier: 'mastery' },
  { id: 'first-missing-positive', name: "First Missing Positive", topicKey: 'arrays', section: "Basics", difficulty: 'Hard', pattern: "Cyclic Sort", leetcode: 41, order: 9, tier: 'mastery', bossFight: true },
  // ── Hashing ──
  { id: 'design-hashmap', name: "Design HashMap", topicKey: 'arrays', section: "Hashing", difficulty: 'Easy', pattern: "Hash Map Design", leetcode: 706, order: 10, tier: 'foundation' },
  { id: 'design-hashset', name: "Design HashSet", topicKey: 'arrays', section: "Hashing", difficulty: 'Easy', pattern: "Hash Set Design", leetcode: 705, order: 11, tier: 'foundation' },
  { id: 'two-sum', name: "Two Sum", topicKey: 'arrays', section: "Hashing", difficulty: 'Easy', pattern: "Hash Lookup", leetcode: 1, order: 12, tier: 'foundation' },
  { id: 'contains-duplicate', name: "Contains Duplicate", topicKey: 'arrays', section: "Hashing", difficulty: 'Easy', pattern: "Hash Set", leetcode: 217, order: 13, tier: 'foundation' },
  { id: 'minimum-index-sum-of-two-lists', name: "Minimum Index Sum of Two Lists", topicKey: 'arrays', section: "Hashing", difficulty: 'Easy', pattern: "Hash Lookup", leetcode: 599, order: 14, tier: 'core' },
  { id: 'longest-consecutive-sequence', name: "Longest Consecutive Sequence", topicKey: 'arrays', section: "Hashing", difficulty: 'Medium', pattern: "Hash Set", leetcode: 128, order: 15, tier: 'core' },
  { id: 'four-sum-ii', name: "4Sum II", topicKey: 'arrays', section: "Hashing", difficulty: 'Medium', pattern: "Hash Lookup", leetcode: 454, order: 16, tier: 'core' },
  { id: 'brick-wall', name: "Brick Wall", topicKey: 'arrays', section: "Hashing", difficulty: 'Medium', pattern: "Frequency Counting", leetcode: 554, order: 17, tier: 'core' },
  { id: 'check-if-array-pairs-divisible-by-k', name: "Check If Array Pairs Are Divisible by k", topicKey: 'arrays', section: "Hashing", difficulty: 'Medium', pattern: "Frequency Counting", leetcode: 1497, order: 18, tier: 'core' },
  { id: 'pairs-of-songs-divisible-by-60', name: "Pairs of Songs With Total Durations Divisible by 60", topicKey: 'arrays', section: "Hashing", difficulty: 'Medium', pattern: "Frequency Counting", leetcode: 1010, order: 19, tier: 'mastery' },
  { id: 'subarray-sum-equals-k', name: "Subarray Sum Equals K", topicKey: 'arrays', section: "Hashing", difficulty: 'Medium', pattern: "Prefix Sum", leetcode: 560, order: 20, tier: 'mastery', bossFight: true },
  { id: 'contiguous-array', name: "Contiguous Array", topicKey: 'arrays', section: "Hashing", difficulty: 'Medium', pattern: "Hash Map + Prefix Sum", leetcode: 525, order: 21, tier: 'mastery', bossFight: true },
  // ── Two Pointers ──
  { id: 'move-zeroes', name: "Move Zeroes", topicKey: 'arrays', section: "Two Pointers", difficulty: 'Easy', pattern: "Two Pointers", leetcode: 283, order: 22, tier: 'foundation' },
  { id: 'remove-duplicates-sorted-array', name: "Remove Duplicates from Sorted Array", topicKey: 'arrays', section: "Two Pointers", difficulty: 'Easy', pattern: "Two Pointers", leetcode: 26, order: 23, tier: 'foundation' },
  { id: 'sort-array-by-parity', name: "Sort Array By Parity", topicKey: 'arrays', section: "Two Pointers", difficulty: 'Easy', pattern: "Two Pointers", leetcode: 905, order: 24, tier: 'foundation' },
  { id: 'squares-of-a-sorted-array', name: "Squares of a Sorted Array", topicKey: 'arrays', section: "Two Pointers", difficulty: 'Easy', pattern: "Two Pointers", leetcode: 977, order: 25, tier: 'foundation' },
  { id: 'two-sum-ii-sorted', name: "Two Sum II - Input Array Is Sorted", topicKey: 'arrays', section: "Two Pointers", difficulty: 'Easy', pattern: "Two Pointers", leetcode: 167, order: 26, tier: 'core' },
  { id: 'two-sum-less-than-k', name: "Two Sum Less Than K", topicKey: 'arrays', section: "Two Pointers", difficulty: 'Easy', pattern: "Two Pointers", leetcode: 1099, order: 27, tier: 'core' },
  { id: 'minimum-common-value', name: "Minimum Common Value", topicKey: 'arrays', section: "Two Pointers", difficulty: 'Easy', pattern: "Two Pointers", leetcode: 2540, order: 28, tier: 'core' },
  { id: 'merge-sorted-array', name: "Merge Sorted Array", topicKey: 'arrays', section: "Two Pointers", difficulty: 'Easy', pattern: "Two Pointers", leetcode: 88, order: 29, tier: 'core' },
  { id: 'max-number-of-k-sum-pairs', name: "Max Number of K-Sum Pairs", topicKey: 'arrays', section: "Two Pointers", difficulty: 'Medium', pattern: "Two Pointers", leetcode: 1679, order: 30, tier: 'core' },
  { id: 'remove-duplicates-sorted-array-ii', name: "Remove Duplicates from Sorted Array II", topicKey: 'arrays', section: "Two Pointers", difficulty: 'Medium', pattern: "Two Pointers", leetcode: 80, order: 31, tier: 'mastery' },
  { id: 'sort-colors', name: "Sort Colors", topicKey: 'arrays', section: "Two Pointers", difficulty: 'Medium', pattern: "Dutch National Flag", leetcode: 75, order: 32, tier: 'mastery' },
  { id: 'partition-array-according-to-pivot', name: "Partition Array According to Given Pivot", topicKey: 'arrays', section: "Two Pointers", difficulty: 'Medium', pattern: "Two Pointers", leetcode: 2161, order: 33, tier: 'mastery' },
  { id: 'boats-to-save-people', name: "Boats to Save People", topicKey: 'arrays', section: "Two Pointers", difficulty: 'Medium', pattern: "Greedy Two Pointers", leetcode: 881, order: 34, tier: 'mastery' },
  { id: '3sum-closest', name: "3Sum Closest", topicKey: 'arrays', section: "Two Pointers", difficulty: 'Medium', pattern: "Two Pointers", leetcode: 16, order: 35, tier: 'mastery' },
  { id: 'container-with-most-water', name: "Container With Most Water", topicKey: 'arrays', section: "Two Pointers", difficulty: 'Medium', pattern: "Two Pointers", leetcode: 11, order: 36, tier: 'mastery', bossFight: true },
  { id: '3sum', name: "3Sum", topicKey: 'arrays', section: "Two Pointers", difficulty: 'Medium', pattern: "Two Pointers", leetcode: 15, order: 37, tier: 'mastery', bossFight: true },
  { id: '4sum', name: "4Sum", topicKey: 'arrays', section: "Two Pointers", difficulty: 'Medium', pattern: "Two Pointers", leetcode: 18, order: 38, tier: 'mastery' },
  { id: 'trapping-rain-water', name: "Trapping Rain Water", topicKey: 'arrays', section: "Two Pointers", difficulty: 'Hard', pattern: "Two Pointers", leetcode: 42, order: 39, tier: 'mastery', bossFight: true },
  // ── Sliding Window ──
  { id: 'maximum-average-subarray-i', name: "Maximum Average Subarray I", topicKey: 'arrays', section: "Sliding Window", difficulty: 'Easy', pattern: "Sliding Window", leetcode: 643, order: 40, tier: 'foundation' },
  { id: 'minimum-swaps-group-all-1s', name: "Minimum Swaps to Group All 1s Together", topicKey: 'arrays', section: "Sliding Window", difficulty: 'Medium', pattern: "Fixed-size Sliding Window", leetcode: 1151, order: 41, tier: 'foundation' },
  { id: 'minimum-size-subarray-sum', name: "Minimum Size Subarray Sum", topicKey: 'arrays', section: "Sliding Window", difficulty: 'Medium', pattern: "Sliding Window", leetcode: 209, order: 42, tier: 'core' },
  { id: 'longest-subarray-after-deleting-one', name: "Longest Subarray of 1s After Deleting One Element", topicKey: 'arrays', section: "Sliding Window", difficulty: 'Medium', pattern: "Sliding Window", leetcode: 1493, order: 43, tier: 'core' },
  { id: 'max-consecutive-ones-iii', name: "Max Consecutive Ones III", topicKey: 'arrays', section: "Sliding Window", difficulty: 'Medium', pattern: "Sliding Window", leetcode: 1004, order: 44, tier: 'core' },
  { id: 'fruit-into-baskets', name: "Fruit Into Baskets", topicKey: 'arrays', section: "Sliding Window", difficulty: 'Medium', pattern: "Sliding Window", leetcode: 904, order: 45, tier: 'core' },
  { id: 'grumpy-bookstore-owner', name: "Grumpy Bookstore Owner", topicKey: 'arrays', section: "Sliding Window", difficulty: 'Medium', pattern: "Sliding Window", leetcode: 1052, order: 46, tier: 'core' },
  { id: 'frequency-of-most-frequent-element', name: "Frequency of the Most Frequent Element", topicKey: 'arrays', section: "Sliding Window", difficulty: 'Medium', pattern: "Sliding Window", leetcode: 1838, order: 47, tier: 'mastery' },
  { id: 'subarrays-with-k-different-integers', name: "Subarrays with K Different Integers", topicKey: 'arrays', section: "Sliding Window", difficulty: 'Hard', pattern: "Sliding Window (at most K)", leetcode: 992, order: 48, tier: 'mastery' },
  { id: 'count-nice-subarrays', name: "Count Number of Nice Subarrays", topicKey: 'arrays', section: "Sliding Window", difficulty: 'Medium', pattern: "Sliding Window (at most K)", leetcode: 1248, order: 49, tier: 'mastery' },
  { id: 'max-points-from-cards', name: "Maximum Points You Can Obtain from Cards", topicKey: 'arrays', section: "Sliding Window", difficulty: 'Medium', pattern: "Sliding Window (inverse)", leetcode: 1423, order: 50, tier: 'mastery' },
  { id: 'max-sum-two-non-overlapping-subarrays', name: "Maximum Sum of Two Non-Overlapping Subarrays", topicKey: 'arrays', section: "Sliding Window", difficulty: 'Medium', pattern: "Sliding Window", leetcode: 1031, order: 51, tier: 'mastery', bossFight: true },
  { id: 'sliding-window-median', name: "Sliding Window Median", topicKey: 'arrays', section: "Sliding Window", difficulty: 'Hard', pattern: "Sliding Window + Two Heaps", leetcode: 480, order: 52, tier: 'mastery', bossFight: true },
  // ── Prefix Sum ──
  { id: 'find-pivot-index', name: "Find Pivot Index", topicKey: 'arrays', section: "Prefix Sum", difficulty: 'Easy', pattern: "Prefix Sum", leetcode: 724, order: 53, tier: 'foundation' },
  { id: 'range-sum-query-immutable', name: "Range Sum Query - Immutable", topicKey: 'arrays', section: "Prefix Sum", difficulty: 'Easy', pattern: "Prefix Sum", leetcode: 303, order: 54, tier: 'foundation' },
  { id: 'maximum-subarray', name: "Maximum Subarray", topicKey: 'arrays', section: "Prefix Sum", difficulty: 'Medium', pattern: "Kadane's", leetcode: 53, order: 55, tier: 'core' },
  { id: 'product-of-array-except-self', name: "Product of Array Except Self", topicKey: 'arrays', section: "Prefix Sum", difficulty: 'Medium', pattern: "Prefix Sum", leetcode: 238, order: 56, tier: 'core' },
  { id: 'maximum-product-subarray', name: "Maximum Product Subarray", topicKey: 'arrays', section: "Prefix Sum", difficulty: 'Medium', pattern: "Kadane Variant", leetcode: 152, order: 57, tier: 'core' },
  { id: 'subarray-sums-divisible-by-k', name: "Subarray Sums Divisible by K", topicKey: 'arrays', section: "Prefix Sum", difficulty: 'Medium', pattern: "Prefix Sum", leetcode: 974, order: 58, tier: 'mastery' },
  { id: 'continuous-subarray-sum', name: "Continuous Subarray Sum", topicKey: 'arrays', section: "Prefix Sum", difficulty: 'Medium', pattern: "Prefix Sum", leetcode: 523, order: 59, tier: 'mastery' },
  { id: 'car-pooling', name: "Car Pooling", topicKey: 'arrays', section: "Prefix Sum", difficulty: 'Medium', pattern: "Difference Array", leetcode: 1094, order: 60, tier: 'mastery' },
  { id: 'corporate-flight-bookings', name: "Corporate Flight Bookings", topicKey: 'arrays', section: "Prefix Sum", difficulty: 'Medium', pattern: "Difference Array", leetcode: 1109, order: 61, tier: 'mastery' },
  { id: 'range-sum-query-2d-immutable', name: "Range Sum Query 2D - Immutable", topicKey: 'arrays', section: "Prefix Sum", difficulty: 'Medium', pattern: "Prefix Sum 2D", leetcode: 304, order: 62, tier: 'mastery', bossFight: true },
  // ── Intervals ──
  { id: 'merge-intervals', name: "Merge Intervals", topicKey: 'arrays', section: "Intervals", difficulty: 'Medium', pattern: "Sorting + Intervals", leetcode: 56, order: 63, tier: 'foundation' },
  { id: 'insert-interval', name: "Insert Interval", topicKey: 'arrays', section: "Intervals", difficulty: 'Medium', pattern: "Intervals", leetcode: 57, order: 64, tier: 'core' },
  { id: 'non-overlapping-intervals', name: "Non-overlapping Intervals", topicKey: 'arrays', section: "Intervals", difficulty: 'Medium', pattern: "Interval Greedy", leetcode: 435, order: 65, tier: 'core' },
  { id: 'minimum-arrows-burst-balloons', name: "Minimum Number of Arrows to Burst Balloons", topicKey: 'arrays', section: "Intervals", difficulty: 'Medium', pattern: "Interval Greedy", leetcode: 452, order: 66, tier: 'mastery' },
  { id: 'meeting-rooms-ii', name: "Meeting Rooms II", topicKey: 'arrays', section: "Intervals", difficulty: 'Medium', pattern: "Heap + Intervals", leetcode: 253, order: 67, tier: 'mastery', bossFight: true },
  // ── Binary Search ──
  { id: 'binary-search-iterative', name: "Binary Search", topicKey: 'arrays', section: "Binary Search", difficulty: 'Easy', pattern: "Classic Binary Search (Iterative)", leetcode: 704, order: 68, tier: 'foundation', enforcedApproach: 'iterative' },
  { id: 'binary-search-recursive', name: "Binary Search", topicKey: 'arrays', section: "Binary Search", difficulty: 'Easy', pattern: "Classic Binary Search (Recursive)", leetcode: 704, order: 69, tier: 'foundation', enforcedApproach: 'recursive' },
  { id: 'search-insert-position', name: "Search Insert Position", topicKey: 'arrays', section: "Binary Search", difficulty: 'Easy', pattern: "Classic Binary Search", leetcode: 35, order: 70, tier: 'foundation' },
  { id: 'find-first-last-position', name: "Find First and Last Position of Element in Sorted Array", topicKey: 'arrays', section: "Binary Search", difficulty: 'Medium', pattern: "Binary Search + Predicate", leetcode: 34, order: 71, tier: 'core' },
  { id: 'peak-index-in-mountain-array', name: "Peak Index in a Mountain Array", topicKey: 'arrays', section: "Binary Search", difficulty: 'Easy', pattern: "Binary Search + Predicate", leetcode: 852, order: 72, tier: 'core' },
  { id: 'sqrt-x', name: "Sqrt(x)", topicKey: 'arrays', section: "Binary Search", difficulty: 'Easy', pattern: "Binary Search on Value", leetcode: 69, order: 73, tier: 'core' },
  { id: 'valid-perfect-square', name: "Valid Perfect Square", topicKey: 'arrays', section: "Binary Search", difficulty: 'Easy', pattern: "Binary Search on Value", leetcode: 367, order: 74, tier: 'core' },
  { id: 'find-peak-element', name: "Find Peak Element", topicKey: 'arrays', section: "Binary Search", difficulty: 'Medium', pattern: "Binary Search + Predicate", leetcode: 162, order: 75, tier: 'mastery' },
  { id: 'find-smallest-letter-greater-than-target', name: "Find Smallest Letter Greater Than Target", topicKey: 'arrays', section: "Binary Search", difficulty: 'Easy', pattern: "Binary Search + Predicate", leetcode: 744, order: 76, tier: 'mastery' },
  { id: 'single-element-in-sorted-array', name: "Single Element in a Sorted Array", topicKey: 'arrays', section: "Binary Search", difficulty: 'Medium', pattern: "Binary Search + Predicate", leetcode: 540, order: 77, tier: 'mastery' },
  { id: 'find-min-rotated-sorted-array', name: "Find Minimum in Rotated Sorted Array", topicKey: 'arrays', section: "Binary Search", difficulty: 'Medium', pattern: "Binary Search on Rotated Array", leetcode: 153, order: 78, tier: 'mastery' },
  { id: 'search-rotated-sorted-array', name: "Search in Rotated Sorted Array", topicKey: 'arrays', section: "Binary Search", difficulty: 'Medium', pattern: "Binary Search on Rotated Array", leetcode: 33, order: 79, tier: 'mastery' },
  { id: 'search-rotated-sorted-array-ii', name: "Search in Rotated Sorted Array II", topicKey: 'arrays', section: "Binary Search", difficulty: 'Medium', pattern: "Binary Search on Rotated Array", leetcode: 81, order: 80, tier: 'mastery' },
  { id: 'find-min-rotated-sorted-array-ii', name: "Find Minimum in Rotated Sorted Array II", topicKey: 'arrays', section: "Binary Search", difficulty: 'Hard', pattern: "Binary Search on Rotated Array", leetcode: 154, order: 81, tier: 'mastery' },
  { id: 'time-based-key-value-store', name: "Time Based Key-Value Store", topicKey: 'arrays', section: "Binary Search", difficulty: 'Medium', pattern: "Binary Search + Design", leetcode: 981, order: 82, tier: 'mastery' },
  { id: 'random-pick-with-weight', name: "Random Pick with Weight", topicKey: 'arrays', section: "Binary Search", difficulty: 'Medium', pattern: "Binary Search + Prefix Sum", leetcode: 528, order: 83, tier: 'mastery' },
  { id: 'find-k-closest-elements', name: "Find K Closest Elements", topicKey: 'arrays', section: "Binary Search", difficulty: 'Medium', pattern: "Binary Search + Predicate", leetcode: 658, order: 84, tier: 'mastery' },
  { id: 'successful-pairs-of-spells-and-potions', name: "Successful Pairs of Spells and Potions", topicKey: 'arrays', section: "Binary Search", difficulty: 'Medium', pattern: "Binary Search", leetcode: 2300, order: 85, tier: 'mastery' },
  // ── Binary Search on Answer ──
  { id: 'koko-eating-bananas', name: "Koko Eating Bananas", topicKey: 'arrays', section: "Binary Search on Answer", difficulty: 'Medium', pattern: "Binary Search on Answer", leetcode: 875, order: 87, tier: 'foundation' },
  { id: 'capacity-to-ship-packages', name: "Capacity To Ship Packages Within D Days", topicKey: 'arrays', section: "Binary Search on Answer", difficulty: 'Medium', pattern: "Binary Search on Answer", leetcode: 1011, order: 88, tier: 'core' },
  { id: 'minimum-days-to-make-bouquets', name: "Minimum Number of Days to Make m Bouquets", topicKey: 'arrays', section: "Binary Search on Answer", difficulty: 'Medium', pattern: "Binary Search on Answer", leetcode: 1482, order: 89, tier: 'core' },
  { id: 'magnetic-force-between-two-balls', name: "Magnetic Force Between Two Balls", topicKey: 'arrays', section: "Binary Search on Answer", difficulty: 'Medium', pattern: "Binary Search on Answer", leetcode: 1552, order: 90, tier: 'core' },
  { id: 'maximum-number-of-removable-characters', name: "Maximum Number of Removable Characters", topicKey: 'arrays', section: "Binary Search on Answer", difficulty: 'Medium', pattern: "Binary Search on Answer", leetcode: 1898, order: 91, tier: 'mastery' },
  { id: 'split-array-largest-sum', name: "Split Array Largest Sum", topicKey: 'arrays', section: "Binary Search on Answer", difficulty: 'Hard', pattern: "Binary Search on Answer", leetcode: 410, order: 92, tier: 'mastery' },
  { id: 'nth-magical-number', name: "Nth Magical Number", topicKey: 'arrays', section: "Binary Search on Answer", difficulty: 'Hard', pattern: "Binary Search on Answer", leetcode: 878, order: 93, tier: 'mastery', bossFight: true },
  { id: 'median-of-two-sorted-arrays', name: "Median of Two Sorted Arrays", topicKey: 'arrays', section: "Binary Search", difficulty: 'Hard', pattern: "Binary Search on Partition", leetcode: 4, order: 93.5, tier: 'mastery', bossFight: true },
  // ── Sorting & Greedy ──
  { id: 'lemonade-change', name: "Lemonade Change", topicKey: 'arrays', section: "Sorting & Greedy", difficulty: 'Easy', pattern: "Simulation + Greedy", leetcode: 860, order: 94, tier: 'foundation' },
  { id: 'assign-cookies', name: "Assign Cookies", topicKey: 'arrays', section: "Sorting & Greedy", difficulty: 'Easy', pattern: "Sorting + Greedy", leetcode: 455, order: 95, tier: 'foundation' },
  { id: 'best-time-buy-sell-stock', name: "Best Time to Buy and Sell Stock", topicKey: 'arrays', section: "Sorting & Greedy", difficulty: 'Easy', pattern: "Local Greedy", leetcode: 121, order: 96, tier: 'foundation' },
  { id: 'best-time-buy-sell-stock-ii', name: "Best Time to Buy and Sell Stock II", topicKey: 'arrays', section: "Sorting & Greedy", difficulty: 'Medium', pattern: "Local Greedy", leetcode: 122, order: 97, tier: 'core' },
  { id: 'gas-station', name: "Gas Station", topicKey: 'arrays', section: "Sorting & Greedy", difficulty: 'Medium', pattern: "Simulation + Greedy", leetcode: 134, order: 98, tier: 'core' },
  { id: 'jump-game', name: "Jump Game", topicKey: 'arrays', section: "Sorting & Greedy", difficulty: 'Medium', pattern: "Greedy Reachability", leetcode: 55, order: 99, tier: 'core' },
  { id: 'jump-game-ii', name: "Jump Game II", topicKey: 'arrays', section: "Sorting & Greedy", difficulty: 'Medium', pattern: "Greedy Reachability", leetcode: 45, order: 100, tier: 'core' },
  { id: 'h-index', name: "H-Index", topicKey: 'arrays', section: "Sorting & Greedy", difficulty: 'Medium', pattern: "Sorting", leetcode: 274, order: 101, tier: 'mastery' },
  { id: 'largest-number', name: "Largest Number", topicKey: 'arrays', section: "Sorting & Greedy", difficulty: 'Medium', pattern: "Sorting + Greedy", leetcode: 179, order: 102, tier: 'mastery' },
  { id: 'two-city-scheduling', name: "Two City Scheduling", topicKey: 'arrays', section: "Sorting & Greedy", difficulty: 'Medium', pattern: "Sorting + Greedy", leetcode: 1029, order: 103, tier: 'mastery' },
  { id: 'queue-reconstruction-by-height', name: "Queue Reconstruction by Height", topicKey: 'arrays', section: "Sorting & Greedy", difficulty: 'Medium', pattern: "Sorting + Greedy", leetcode: 406, order: 104, tier: 'mastery' },
  { id: 'partition-labels', name: "Partition Labels", topicKey: 'arrays', section: "Sorting & Greedy", difficulty: 'Medium', pattern: "Interval Greedy", leetcode: 763, order: 105, tier: 'mastery' },
  { id: 'non-decreasing-array', name: "Non-decreasing Array", topicKey: 'arrays', section: "Sorting & Greedy", difficulty: 'Medium', pattern: "Local Greedy", leetcode: 665, order: 106, tier: 'mastery' },
  { id: 'monotone-increasing-digits', name: "Monotone Increasing Digits", topicKey: 'arrays', section: "Sorting & Greedy", difficulty: 'Medium', pattern: "Local Greedy", leetcode: 738, order: 107, tier: 'mastery' },
  { id: 'maximum-swap', name: "Maximum Swap", topicKey: 'arrays', section: "Sorting & Greedy", difficulty: 'Medium', pattern: "Local Greedy", leetcode: 670, order: 108, tier: 'mastery' },
  { id: 'minimum-domino-rotations', name: "Minimum Domino Rotations For Equal Row", topicKey: 'arrays', section: "Sorting & Greedy", difficulty: 'Medium', pattern: "Simulation + Greedy", leetcode: 1007, order: 109, tier: 'mastery' },
  { id: 'wiggle-sort-ii', name: "Wiggle Sort II", topicKey: 'arrays', section: "Sorting & Greedy", difficulty: 'Medium', pattern: "Sorting", leetcode: 324, order: 110, tier: 'mastery', bossFight: true },
  { id: 'wiggle-subsequence', name: "Wiggle Subsequence", topicKey: 'arrays', section: "Sorting & Greedy", difficulty: 'Medium', pattern: "Greedy / DP", leetcode: 376, order: 111, tier: 'mastery', bossFight: true },
  { id: 'broken-calculator', name: "Broken Calculator", topicKey: 'arrays', section: "Sorting & Greedy", difficulty: 'Medium', pattern: "Greedy (Reverse Thinking)", leetcode: 991, order: 112, tier: 'mastery', bossFight: true },
  { id: 'candy', name: "Candy", topicKey: 'arrays', section: "Sorting & Greedy", difficulty: 'Hard', pattern: "Greedy (Two-Pass)", leetcode: 135, order: 113, tier: 'mastery', bossFight: true },
  // ── Heaps ──
  { id: 'last-stone-weight', name: "Last Stone Weight", topicKey: 'arrays', section: "Heaps", difficulty: 'Easy', pattern: "Heap", leetcode: 1046, order: 114, tier: 'foundation' },
  { id: 'kth-largest-element-in-a-stream', name: "Kth Largest Element in a Stream", topicKey: 'arrays', section: "Heaps", difficulty: 'Easy', pattern: "Heap", leetcode: 703, order: 115, tier: 'foundation' },
  { id: 'kth-largest-element-in-an-array', name: "Kth Largest Element in an Array", topicKey: 'arrays', section: "Heaps", difficulty: 'Medium', pattern: "Heap / Quickselect", leetcode: 215, order: 116, tier: 'foundation' },
  { id: 'top-k-frequent-elements', name: "Top K Frequent Elements", topicKey: 'arrays', section: "Heaps", difficulty: 'Medium', pattern: "Frequency Counting + Heap", leetcode: 347, order: 117, tier: 'core' },
  { id: 'top-k-frequent-words', name: "Top K Frequent Words", topicKey: 'arrays', section: "Heaps", difficulty: 'Medium', pattern: "Heap", leetcode: 692, order: 118, tier: 'core' },
  { id: 'k-closest-points-to-origin', name: "K Closest Points to Origin", topicKey: 'arrays', section: "Heaps", difficulty: 'Medium', pattern: "Heap", leetcode: 973, order: 119, tier: 'core' },
  { id: 'kth-factor-of-n', name: "The kth Factor of n", topicKey: 'arrays', section: "Heaps", difficulty: 'Medium', pattern: "Heap / Math", leetcode: 1492, order: 120, tier: 'core' },
  { id: 'kth-smallest-element-in-sorted-matrix', name: "Kth Smallest Element in a Sorted Matrix", topicKey: 'arrays', section: "Heaps", difficulty: 'Medium', pattern: "Heap / Binary Search", leetcode: 378, order: 121, tier: 'core' },
  { id: 'task-scheduler', name: "Task Scheduler", topicKey: 'arrays', section: "Heaps", difficulty: 'Medium', pattern: "Greedy + Heap", leetcode: 621, order: 122, tier: 'core' },
  { id: 'reorganize-string', name: "Reorganize String", topicKey: 'arrays', section: "Heaps", difficulty: 'Medium', pattern: "Greedy + Heap", leetcode: 767, order: 123, tier: 'core' },
  { id: 'minimum-cost-to-connect-sticks', name: "Minimum Cost to Connect Sticks", topicKey: 'arrays', section: "Heaps", difficulty: 'Medium', pattern: "Greedy + Heap", leetcode: 1167, order: 124, tier: 'core' },
  { id: 'seat-reservation-manager', name: "Seat Reservation Manager", topicKey: 'arrays', section: "Heaps", difficulty: 'Medium', pattern: "Heap", leetcode: 1845, order: 125, tier: 'core' },
  { id: 'total-cost-to-hire-k-workers', name: "Total Cost to Hire K Workers", topicKey: 'arrays', section: "Heaps", difficulty: 'Medium', pattern: "Heap", leetcode: 2462, order: 126, tier: 'core' },
  { id: 'ugly-number-ii', name: "Ugly Number II", topicKey: 'arrays', section: "Heaps", difficulty: 'Medium', pattern: "Heap / DP", leetcode: 264, order: 127, tier: 'mastery' },
  { id: 'super-ugly-number', name: "Super Ugly Number", topicKey: 'arrays', section: "Heaps", difficulty: 'Medium', pattern: "Heap", leetcode: 313, order: 128, tier: 'mastery' },
  { id: 'design-twitter', name: "Design Twitter", topicKey: 'arrays', section: "Heaps", difficulty: 'Medium', pattern: "Heap + Hash Map", leetcode: 355, order: 129, tier: 'mastery' },
  { id: 'furthest-building-you-can-reach', name: "Furthest Building You Can Reach", topicKey: 'arrays', section: "Heaps", difficulty: 'Medium', pattern: "Heap + Greedy", leetcode: 1642, order: 130, tier: 'mastery' },
  { id: 'single-threaded-cpu', name: "Single-Threaded CPU", topicKey: 'arrays', section: "Heaps", difficulty: 'Medium', pattern: "Heap + Sorting", leetcode: 1834, order: 131, tier: 'mastery' },
  { id: 'process-tasks-using-servers', name: "Process Tasks Using Servers", topicKey: 'arrays', section: "Heaps", difficulty: 'Medium', pattern: "Heap", leetcode: 1882, order: 132, tier: 'mastery' },
  { id: 'rearrange-string-k-distance-apart', name: "Rearrange String k Distance Apart", topicKey: 'arrays', section: "Heaps", difficulty: 'Hard', pattern: "Heap + Greedy", leetcode: 358, order: 133, tier: 'mastery' },
  { id: 'find-median-from-data-stream', name: "Find Median from Data Stream", topicKey: 'arrays', section: "Heaps", difficulty: 'Hard', pattern: "Two Heaps", leetcode: 295, order: 134, tier: 'mastery' },
  { id: 'maximum-subsequence-score', name: "Maximum Subsequence Score", topicKey: 'arrays', section: "Heaps", difficulty: 'Hard', pattern: "Heap + Greedy", leetcode: 2542, order: 135, tier: 'mastery' },
  { id: 'maximum-performance-of-a-team', name: "Maximum Performance of a Team", topicKey: 'arrays', section: "Heaps", difficulty: 'Hard', pattern: "Heap + Sorting", leetcode: 1383, order: 136, tier: 'mastery', bossFight: true },
  { id: 'ipo', name: "IPO", topicKey: 'arrays', section: "Heaps", difficulty: 'Hard', pattern: "Two Heaps + Greedy", leetcode: 502, order: 137, tier: 'mastery', bossFight: true },
  { id: 'employee-free-time', name: "Employee Free Time", topicKey: 'arrays', section: "Heaps", difficulty: 'Hard', pattern: "Heap + Intervals", leetcode: 759, order: 138, tier: 'mastery', bossFight: true },
  { id: 'smallest-range-covering-k-lists', name: "Smallest Range Covering Elements from K Lists", topicKey: 'arrays', section: "Heaps", difficulty: 'Hard', pattern: "Heap", leetcode: 632, order: 139, tier: 'mastery', bossFight: true },
  // ── 2D Arrays ──
  { id: 'set-matrix-zeroes', name: "Set Matrix Zeroes", topicKey: 'arrays', section: "2D Arrays", difficulty: 'Medium', pattern: "2D Matrix", leetcode: 73, order: 140, tier: 'foundation' },
  { id: 'spiral-matrix', name: "Spiral Matrix", topicKey: 'arrays', section: "2D Arrays", difficulty: 'Medium', pattern: "2D Matrix", leetcode: 54, order: 141, tier: 'core' },
  { id: 'rotate-image', name: "Rotate Image", topicKey: 'arrays', section: "2D Arrays", difficulty: 'Medium', pattern: "2D Matrix", leetcode: 48, order: 142, tier: 'core' },
  { id: 'search-2d-matrix', name: "Search a 2D Matrix", topicKey: 'arrays', section: "2D Arrays", difficulty: 'Medium', pattern: "Binary Search on Matrix", leetcode: 74, order: 143, tier: 'core' },
  { id: 'search-2d-matrix-ii', name: "Search a 2D Matrix II", topicKey: 'arrays', section: "2D Arrays", difficulty: 'Medium', pattern: "Staircase Search", leetcode: 240, order: 144, tier: 'mastery', bossFight: true },
  { id: 'game-of-life', name: "Game of Life", topicKey: 'arrays', section: "2D Arrays", difficulty: 'Medium', pattern: "2D Matrix Simulation", leetcode: 289, order: 145, tier: 'mastery' },
  // ── Bit Manipulation ──
  { id: 'single-number', name: "Single Number", topicKey: 'arrays', section: "Bit Manipulation", difficulty: 'Easy', pattern: "XOR", leetcode: 136, order: 146, tier: 'foundation' },
  { id: 'find-the-difference', name: "Find the Difference", topicKey: 'arrays', section: "Bit Manipulation", difficulty: 'Easy', pattern: "XOR", leetcode: 389, order: 147, tier: 'foundation' },
  { id: 'number-of-1-bits', name: "Number of 1 Bits", topicKey: 'arrays', section: "Bit Manipulation", difficulty: 'Easy', pattern: "Bit Manipulation", leetcode: 191, order: 148, tier: 'foundation' },
  { id: 'counting-bits', name: "Counting Bits", topicKey: 'arrays', section: "Bit Manipulation", difficulty: 'Easy', pattern: "DP + Bit Manipulation", leetcode: 338, order: 149, tier: 'core' },
  { id: 'reverse-bits', name: "Reverse Bits", topicKey: 'arrays', section: "Bit Manipulation", difficulty: 'Easy', pattern: "Bit Manipulation", leetcode: 190, order: 150, tier: 'core' },
  { id: 'power-of-two', name: "Power of Two", topicKey: 'arrays', section: "Bit Manipulation", difficulty: 'Easy', pattern: "Bit Manipulation", leetcode: 231, order: 151, tier: 'core' },
  { id: 'power-of-four', name: "Power of Four", topicKey: 'arrays', section: "Bit Manipulation", difficulty: 'Easy', pattern: "Bit Manipulation", leetcode: 342, order: 152, tier: 'core' },
  { id: 'binary-number-alternating-bits', name: "Binary Number with Alternating Bits", topicKey: 'arrays', section: "Bit Manipulation", difficulty: 'Easy', pattern: "Bit Manipulation", leetcode: 693, order: 153, tier: 'core' },
  { id: 'single-number-ii', name: "Single Number II", topicKey: 'arrays', section: "Bit Manipulation", difficulty: 'Medium', pattern: "Bit Manipulation", leetcode: 137, order: 154, tier: 'mastery' },
  { id: 'single-number-iii', name: "Single Number III", topicKey: 'arrays', section: "Bit Manipulation", difficulty: 'Medium', pattern: "XOR", leetcode: 260, order: 155, tier: 'mastery' },
  { id: 'total-hamming-distance', name: "Total Hamming Distance", topicKey: 'arrays', section: "Bit Manipulation", difficulty: 'Medium', pattern: "Bit Manipulation", leetcode: 477, order: 156, tier: 'mastery' },
  { id: 'xor-queries-of-a-subarray', name: "XOR Queries of a Subarray", topicKey: 'arrays', section: "Bit Manipulation", difficulty: 'Medium', pattern: "Bit Manipulation + Prefix XOR", leetcode: 1310, order: 157, tier: 'mastery' },
  { id: 'sum-of-two-integers', name: "Sum of Two Integers", topicKey: 'arrays', section: "Bit Manipulation", difficulty: 'Medium', pattern: "Bit Manipulation", leetcode: 371, order: 158, tier: 'mastery' },
  { id: 'divide-two-integers', name: "Divide Two Integers", topicKey: 'arrays', section: "Bit Manipulation", difficulty: 'Medium', pattern: "Bit Manipulation", leetcode: 29, order: 159, tier: 'mastery' },
  { id: 'bitwise-and-of-numbers-range', name: "Bitwise AND of Numbers Range", topicKey: 'arrays', section: "Bit Manipulation", difficulty: 'Medium', pattern: "Bit Manipulation", leetcode: 201, order: 160, tier: 'mastery' },
  { id: 'minimum-flips-a-or-b-equals-c', name: "Minimum Flips to Make a OR b Equal to c", topicKey: 'arrays', section: "Bit Manipulation", difficulty: 'Medium', pattern: "Bit Manipulation", leetcode: 1318, order: 161, tier: 'mastery' },
  { id: 'utf-8-validation', name: "UTF-8 Validation", topicKey: 'arrays', section: "Bit Manipulation", difficulty: 'Medium', pattern: "Bit Manipulation", leetcode: 393, order: 162, tier: 'mastery', bossFight: true },
  // ── Maths & Number Theory ──
  { id: 'palindrome-number', name: "Palindrome Number", topicKey: 'arrays', section: "Maths & Number Theory", difficulty: 'Easy', pattern: "Math", leetcode: 9, order: 163, tier: 'foundation' },
  { id: 'reverse-integer', name: "Reverse Integer", topicKey: 'arrays', section: "Maths & Number Theory", difficulty: 'Medium', pattern: "Math", leetcode: 7, order: 164, tier: 'foundation' },
  { id: 'add-digits', name: "Add Digits", topicKey: 'arrays', section: "Maths & Number Theory", difficulty: 'Easy', pattern: "Math", leetcode: 258, order: 165, tier: 'foundation' },
  { id: 'self-dividing-numbers', name: "Self Dividing Numbers", topicKey: 'arrays', section: "Maths & Number Theory", difficulty: 'Easy', pattern: "Math", leetcode: 728, order: 166, tier: 'foundation' },
  { id: 'happy-number', name: "Happy Number", topicKey: 'arrays', section: "Maths & Number Theory", difficulty: 'Easy', pattern: "Math + Cycle Detection", leetcode: 202, order: 167, tier: 'core' },
  { id: 'ugly-number', name: "Ugly Number", topicKey: 'arrays', section: "Maths & Number Theory", difficulty: 'Easy', pattern: "Math", leetcode: 263, order: 168, tier: 'core' },
  { id: 'perfect-number', name: "Perfect Number", topicKey: 'arrays', section: "Maths & Number Theory", difficulty: 'Easy', pattern: "Math", leetcode: 507, order: 169, tier: 'core' },
  { id: 'excel-sheet-column-title', name: "Excel Sheet Column Title", topicKey: 'arrays', section: "Maths & Number Theory", difficulty: 'Easy', pattern: "Math", leetcode: 168, order: 170, tier: 'core' },
  { id: 'gcd-of-strings', name: "Greatest Common Divisor of Strings", topicKey: 'arrays', section: "Maths & Number Theory", difficulty: 'Easy', pattern: "Math (GCD)", leetcode: 1071, order: 171, tier: 'core' },
  { id: 'nim-game', name: "Nim Game", topicKey: 'arrays', section: "Maths & Number Theory", difficulty: 'Easy', pattern: "Game Theory", leetcode: 292, order: 172, tier: 'core' },
  { id: 'factorial-trailing-zeroes', name: "Factorial Trailing Zeroes", topicKey: 'arrays', section: "Maths & Number Theory", difficulty: 'Medium', pattern: "Math", leetcode: 172, order: 173, tier: 'mastery' },
  { id: 'count-primes', name: "Count Primes", topicKey: 'arrays', section: "Maths & Number Theory", difficulty: 'Medium', pattern: "Sieve of Eratosthenes", leetcode: 204, order: 174, tier: 'mastery' },
  { id: 'bulb-switcher', name: "Bulb Switcher", topicKey: 'arrays', section: "Maths & Number Theory", difficulty: 'Medium', pattern: "Math", leetcode: 319, order: 175, tier: 'mastery' },
  { id: 'minimum-moves-to-equal-array-elements', name: "Minimum Moves to Equal Array Elements", topicKey: 'arrays', section: "Maths & Number Theory", difficulty: 'Medium', pattern: "Math", leetcode: 453, order: 176, tier: 'mastery' },
  { id: 'super-pow', name: "Super Pow", topicKey: 'arrays', section: "Maths & Number Theory", difficulty: 'Medium', pattern: "Math (Modular Exponentiation)", leetcode: 372, order: 177, tier: 'mastery' },
  { id: 'rectangle-area', name: "Rectangle Area", topicKey: 'arrays', section: "Maths & Number Theory", difficulty: 'Medium', pattern: "Math / Geometry", leetcode: 223, order: 178, tier: 'mastery' },
  { id: 'valid-square', name: "Valid Square", topicKey: 'arrays', section: "Maths & Number Theory", difficulty: 'Medium', pattern: "Geometry", leetcode: 593, order: 179, tier: 'mastery' },
  { id: 'max-points-on-a-line', name: "Max Points on a Line", topicKey: 'arrays', section: "Maths & Number Theory", difficulty: 'Hard', pattern: "Math / Geometry", leetcode: 149, order: 180, tier: 'mastery', bossFight: true },
  { id: 'kth-smallest-in-lexicographical-order', name: "K-th Smallest in Lexicographical Order", topicKey: 'arrays', section: "Maths & Number Theory", difficulty: 'Hard', pattern: "Math", leetcode: 440, order: 181, tier: 'mastery', bossFight: true },
  // ══════════════════════════════════════════════════════
  // STRINGS
  // ══════════════════════════════════════════════════════
  // ── Basics ──
  { id: 'length-of-last-word', name: "Length of Last Word", topicKey: 'strings', section: "Basics", difficulty: 'Easy', pattern: "String Traversal", leetcode: 58, order: 1, tier: 'foundation' },
  { id: 'to-lower-case', name: "To Lower Case", topicKey: 'strings', section: "Basics", difficulty: 'Easy', pattern: "Character Traversal", leetcode: 709, order: 2, tier: 'foundation' },
  { id: 'detect-capital', name: "Detect Capital", topicKey: 'strings', section: "Basics", difficulty: 'Easy', pattern: "Character Traversal", leetcode: 520, order: 3, tier: 'foundation' },
  { id: 'longest-common-prefix', name: "Longest Common Prefix", topicKey: 'strings', section: "Basics", difficulty: 'Easy', pattern: "Common Prefix", leetcode: 14, order: 4, tier: 'foundation' },
  { id: 'reverse-string', name: "Reverse String", topicKey: 'strings', section: "Basics", difficulty: 'Easy', pattern: "String Traversal", leetcode: 344, order: 5, tier: 'foundation' },
  { id: 'reverse-string-ii', name: "Reverse String II", topicKey: 'strings', section: "Basics", difficulty: 'Easy', pattern: "String Traversal", leetcode: 541, order: 6, tier: 'foundation' },
  { id: 'merge-strings-alternately', name: "Merge Strings Alternately", topicKey: 'strings', section: "Basics", difficulty: 'Easy', pattern: "String Traversal", leetcode: 1768, order: 7, tier: 'core' },
  { id: 'roman-to-integer', name: "Roman to Integer", topicKey: 'strings', section: "Basics", difficulty: 'Easy', pattern: "String Parsing", leetcode: 13, order: 7.5, tier: 'mastery' },
  { id: 'shuffle-string', name: "Shuffle String", topicKey: 'strings', section: "Basics", difficulty: 'Easy', pattern: "Simulation", leetcode: 1528, order: 8, tier: 'core' },
  { id: 'sorting-the-sentence', name: "Sorting the Sentence", topicKey: 'strings', section: "Basics", difficulty: 'Easy', pattern: "Simulation", leetcode: 1859, order: 9, tier: 'core' },
  { id: 'reverse-prefix-of-word', name: "Reverse Prefix of Word", topicKey: 'strings', section: "Basics", difficulty: 'Easy', pattern: "Simulation", leetcode: 2000, order: 10, tier: 'core' },
  { id: 'reverse-words-in-a-string-iii', name: "Reverse Words in a String III", topicKey: 'strings', section: "Basics", difficulty: 'Easy', pattern: "Traversal + Simulation", leetcode: 557, order: 11, tier: 'core' },
  { id: 'reverse-words-in-a-string', name: "Reverse Words in a String", topicKey: 'strings', section: "Basics", difficulty: 'Medium', pattern: "Traversal + Simulation", leetcode: 151, order: 12, tier: 'core' },
  { id: 'add-strings', name: "Add Strings", topicKey: 'strings', section: "Basics", difficulty: 'Easy', pattern: "Digit Simulation", leetcode: 415, order: 13, tier: 'core' },
  { id: 'multiply-strings', name: "Multiply Strings", topicKey: 'strings', section: "Basics", difficulty: 'Medium', pattern: "Digit Simulation", leetcode: 43, order: 14, tier: 'mastery' },
  { id: 'zigzag-conversion', name: "Zigzag Conversion", topicKey: 'strings', section: "Basics", difficulty: 'Medium', pattern: "Simulation", leetcode: 6, order: 15, tier: 'mastery' },
  { id: 'count-and-say', name: "Count and Say", topicKey: 'strings', section: "Basics", difficulty: 'Medium', pattern: "Simulation", leetcode: 38, order: 16, tier: 'mastery' },
  { id: 'string-to-integer-atoi', name: "String to Integer (atoi)", topicKey: 'strings', section: "Basics", difficulty: 'Medium', pattern: "Parsing", leetcode: 8, order: 17, tier: 'mastery', bossFight: true },
  { id: 'compare-version-numbers', name: "Compare Version Numbers", topicKey: 'strings', section: "Basics", difficulty: 'Medium', pattern: "Parsing", leetcode: 165, order: 19, tier: 'mastery' },
  { id: 'license-key-formatting', name: "License Key Formatting", topicKey: 'strings', section: "Basics", difficulty: 'Easy', pattern: "Formatting", leetcode: 482, order: 20, tier: 'mastery', bossFight: true },
  // ── Hashing ──
  { id: 'valid-anagram', name: "Valid Anagram", topicKey: 'strings', section: "Hashing", difficulty: 'Easy', pattern: "Frequency Counting", leetcode: 242, order: 21, tier: 'foundation' },
  { id: 'ransom-note', name: "Ransom Note", topicKey: 'strings', section: "Hashing", difficulty: 'Easy', pattern: "Frequency Counting", leetcode: 383, order: 22, tier: 'foundation' },
  { id: 'first-unique-character-in-a-string', name: "First Unique Character in a String", topicKey: 'strings', section: "Hashing", difficulty: 'Easy', pattern: "Frequency Counting", leetcode: 387, order: 23, tier: 'core' },
  { id: 'find-common-characters', name: "Find Common Characters", topicKey: 'strings', section: "Hashing", difficulty: 'Easy', pattern: "Frequency Counting", leetcode: 1002, order: 24, tier: 'core' },
  { id: 'longest-palindrome', name: "Longest Palindrome", topicKey: 'strings', section: "Hashing", difficulty: 'Easy', pattern: "Frequency Counting", leetcode: 409, order: 25, tier: 'core' },
  { id: 'group-anagrams', name: "Group Anagrams", topicKey: 'strings', section: "Hashing", difficulty: 'Medium', pattern: "Frequency Counting", leetcode: 49, order: 26, tier: 'mastery' },
  { id: 'isomorphic-strings', name: "Isomorphic Strings", topicKey: 'strings', section: "Hashing", difficulty: 'Easy', pattern: "Hash Mapping", leetcode: 205, order: 27, tier: 'mastery' },
  { id: 'word-pattern', name: "Word Pattern", topicKey: 'strings', section: "Hashing", difficulty: 'Easy', pattern: "Hash Mapping", leetcode: 290, order: 28, tier: 'mastery', bossFight: true },
  // ── Two Pointers ──
  { id: 'valid-palindrome', name: "Valid Palindrome", topicKey: 'strings', section: "Two Pointers", difficulty: 'Easy', pattern: "Two Pointers", leetcode: 125, order: 29, tier: 'foundation' },
  { id: 'valid-palindrome-ii', name: "Valid Palindrome II", topicKey: 'strings', section: "Two Pointers", difficulty: 'Easy', pattern: "Two Pointers", leetcode: 680, order: 30, tier: 'foundation' },
  { id: 'is-subsequence', name: "Is Subsequence", topicKey: 'strings', section: "Two Pointers", difficulty: 'Easy', pattern: "Two Pointers", leetcode: 392, order: 31, tier: 'foundation' },
  { id: 'backspace-string-compare', name: "Backspace String Compare", topicKey: 'strings', section: "Two Pointers", difficulty: 'Easy', pattern: "Two Pointers", leetcode: 844, order: 32, tier: 'core' },
  { id: 'string-compression', name: "String Compression", topicKey: 'strings', section: "Two Pointers", difficulty: 'Medium', pattern: "Two Pointers", leetcode: 443, order: 33, tier: 'core' },
  { id: 'one-edit-distance', name: "One Edit Distance", topicKey: 'strings', section: "Two Pointers", difficulty: 'Medium', pattern: "Two Pointers", leetcode: 161, order: 34, tier: 'core' },
  { id: 'longest-palindromic-substring', name: "Longest Palindromic Substring", topicKey: 'strings', section: "Two Pointers", difficulty: 'Medium', pattern: "Expand Around Center", leetcode: 5, order: 35, tier: 'core' },
  { id: 'palindromic-substrings', name: "Palindromic Substrings", topicKey: 'strings', section: "Two Pointers", difficulty: 'Medium', pattern: "Expand Around Center", leetcode: 647, order: 36, tier: 'mastery' },
  { id: 'break-a-palindrome', name: "Break a Palindrome", topicKey: 'strings', section: "Two Pointers", difficulty: 'Medium', pattern: "Greedy", leetcode: 1328, order: 37, tier: 'mastery' },
  { id: 'shortest-distance-to-a-character', name: "Shortest Distance to a Character", topicKey: 'strings', section: "Two Pointers", difficulty: 'Easy', pattern: "Two Pass", leetcode: 821, order: 38, tier: 'mastery', bossFight: true },
  // ── Sliding Window ──
  { id: 'maximum-number-of-vowels-in-a-substring-of-given-length', name: "Maximum Number of Vowels in a Substring of Given Length", topicKey: 'strings', section: "Sliding Window", difficulty: 'Medium', pattern: "Fixed Sliding Window", leetcode: 1456, order: 39, tier: 'foundation' },
  { id: 'longest-substring-without-repeating-characters', name: "Longest Substring Without Repeating Characters", topicKey: 'strings', section: "Sliding Window", difficulty: 'Medium', pattern: "Variable Sliding Window", leetcode: 3, order: 40, tier: 'foundation' },
  { id: 'longest-substring-with-at-most-two-distinct-characters', name: "Longest Substring with At Most Two Distinct Characters", topicKey: 'strings', section: "Sliding Window", difficulty: 'Medium', pattern: "Variable Sliding Window", leetcode: 159, order: 41, tier: 'foundation' },
  { id: 'longest-substring-with-at-most-k-distinct-characters', name: "Longest Substring with At Most K Distinct Characters", topicKey: 'strings', section: "Sliding Window", difficulty: 'Medium', pattern: "Variable Sliding Window", leetcode: 340, order: 42, tier: 'foundation' },
  { id: 'permutation-in-string', name: "Permutation in String", topicKey: 'strings', section: "Sliding Window", difficulty: 'Medium', pattern: "Sliding Window + Frequency", leetcode: 567, order: 43, tier: 'core' },
  { id: 'find-all-anagrams-in-a-string', name: "Find All Anagrams in a String", topicKey: 'strings', section: "Sliding Window", difficulty: 'Medium', pattern: "Sliding Window + Frequency", leetcode: 438, order: 44, tier: 'core' },
  { id: 'longest-repeating-character-replacement', name: "Longest Repeating Character Replacement", topicKey: 'strings', section: "Sliding Window", difficulty: 'Medium', pattern: "Sliding Window + Frequency", leetcode: 424, order: 45, tier: 'core' },
  { id: 'minimum-window-substring', name: "Minimum Window Substring", topicKey: 'strings', section: "Sliding Window", difficulty: 'Hard', pattern: "Minimum Sliding Window", leetcode: 76, order: 46, tier: 'core' },
  { id: 'minimum-window-subsequence', name: "Minimum Window Subsequence", topicKey: 'strings', section: "Sliding Window", difficulty: 'Hard', pattern: "Advanced Sliding Window", leetcode: 727, order: 47, tier: 'mastery' },
  { id: 'substring-with-concatenation-of-all-words', name: "Substring with Concatenation of All Words", topicKey: 'strings', section: "Sliding Window", difficulty: 'Hard', pattern: "Sliding Window + Hash Map", leetcode: 30, order: 48, tier: 'mastery' },
  { id: 'repeated-dna-sequences', name: "Repeated DNA Sequences", topicKey: 'strings', section: "Sliding Window", difficulty: 'Medium', pattern: "Rolling Hash", leetcode: 187, order: 49, tier: 'mastery' },
  { id: 'minimum-deletions-to-make-character-frequencies-unique', name: "Minimum Deletions to Make Character Frequencies Unique", topicKey: 'strings', section: "Sliding Window", difficulty: 'Medium', pattern: "Greedy + Frequency", leetcode: 1647, order: 50, tier: 'mastery', bossFight: true },
  // ── Parsing & Simulation ──
  { id: 'valid-number', name: "Valid Number", topicKey: 'strings', section: "Parsing & Simulation", difficulty: 'Hard', pattern: "Parsing", leetcode: 65, order: 51, tier: 'foundation' },
  { id: 'decode-string', name: "Decode String", topicKey: 'strings', section: "Parsing & Simulation", difficulty: 'Medium', pattern: "Stack + Parsing", leetcode: 394, order: 52, tier: 'foundation' },
  { id: 'simplify-path', name: "Simplify Path", topicKey: 'strings', section: "Parsing & Simulation", difficulty: 'Medium', pattern: "Stack + Parsing", leetcode: 71, order: 53, tier: 'core' },
  { id: 'evaluate-reverse-polish-notation', name: "Evaluate Reverse Polish Notation", topicKey: 'strings', section: "Parsing & Simulation", difficulty: 'Medium', pattern: "Stack", leetcode: 150, order: 54, tier: 'core' },
  { id: 'restore-ip-addresses', name: "Restore IP Addresses", topicKey: 'strings', section: "Parsing & Simulation", difficulty: 'Medium', pattern: "Backtracking", leetcode: 93, order: 55, tier: 'mastery' },
  { id: 'text-justification', name: "Text Justification", topicKey: 'strings', section: "Parsing & Simulation", difficulty: 'Hard', pattern: "Simulation", leetcode: 68, order: 56, tier: 'mastery' },
  { id: 'integer-to-english-words', name: "Integer to English Words", topicKey: 'strings', section: "Parsing & Simulation", difficulty: 'Hard', pattern: "Simulation", leetcode: 273, order: 57, tier: 'mastery', bossFight: true },
  // ── Pattern Matching ──
  { id: 'implement-strstr', name: "Find the Index of the First Occurrence in a String", topicKey: 'strings', section: "Pattern Matching", difficulty: 'Easy', pattern: "Naive Pattern Matching", leetcode: 28, order: 58, tier: 'foundation' },
  { id: 'repeated-string-match', name: "Repeated String Match", topicKey: 'strings', section: "Pattern Matching", difficulty: 'Medium', pattern: "Pattern Matching", leetcode: 686, order: 59, tier: 'core' },
  { id: 'repeated-substring-pattern', name: "Repeated Substring Pattern", topicKey: 'strings', section: "Pattern Matching", difficulty: 'Easy', pattern: "KMP Insight", leetcode: 459, order: 60, tier: 'core' },
  { id: 'longest-happy-prefix', name: "Longest Happy Prefix", topicKey: 'strings', section: "Pattern Matching", difficulty: 'Hard', pattern: "KMP", leetcode: 1392, order: 61, tier: 'mastery' },
  { id: 'shortest-palindrome', name: "Shortest Palindrome", topicKey: 'strings', section: "Pattern Matching", difficulty: 'Hard', pattern: "KMP", leetcode: 214, order: 62, tier: 'mastery', bossFight: true },
  // ── Backtracking ──
  { id: 'word-search', name: "Word Search", topicKey: 'strings', section: "Backtracking", difficulty: 'Medium', pattern: "Grid DFS", leetcode: 79, order: 71, tier: 'foundation' },
  // ── Capstone ──
  { id: 'palindrome-pairs', name: "Palindrome Pairs", topicKey: 'strings', section: "Capstone", difficulty: 'Hard', pattern: "Trie + Hashing", leetcode: 336, order: 72, tier: 'mastery', bossFight: true },
  { id: 'encode-and-decode-strings', name: "Encode and Decode Strings", topicKey: 'strings', section: "Capstone", difficulty: 'Medium', pattern: "Serialization", leetcode: 271, order: 73, tier: 'mastery', bossFight: true },
  { id: 'find-and-replace-in-string', name: "Find And Replace in String", topicKey: 'strings', section: "Capstone", difficulty: 'Medium', pattern: "Simulation", leetcode: 833, order: 74, tier: 'mastery', bossFight: true },
  { id: 'regular-expression-matching', name: "Regular Expression Matching", topicKey: 'strings', section: "Capstone", difficulty: 'Hard', pattern: "DP", leetcode: 10, order: 75, tier: 'mastery', bossFight: true },
  // ══════════════════════════════════════════════════════
  // STACKS & QUEUES
  // ══════════════════════════════════════════════════════
  // ── Stack Basics ──
  { id: 'valid-parentheses', name: "Valid Parentheses", topicKey: 'stacks-queues', section: "Stack Basics", difficulty: 'Easy', pattern: "Stack Simulation", leetcode: 20, order: 1, tier: 'foundation' },
  { id: 'baseball-game', name: "Baseball Game", topicKey: 'stacks-queues', section: "Stack Basics", difficulty: 'Easy', pattern: "Stack Simulation", leetcode: 682, order: 2, tier: 'foundation' },
  { id: 'remove-outermost-parentheses', name: "Remove Outermost Parentheses", topicKey: 'stacks-queues', section: "Stack Basics", difficulty: 'Easy', pattern: "Parentheses Simulation", leetcode: 1021, order: 3, tier: 'core' },
  { id: 'backspace-string-compare', name: "Backspace String Compare", topicKey: 'stacks-queues', section: "Stack Basics", difficulty: 'Easy', pattern: "Stack Simulation", leetcode: 844, order: 4, tier: 'core' },
  { id: 'min-stack', name: "Min Stack", topicKey: 'stacks-queues', section: "Stack Basics", difficulty: 'Medium', pattern: "Stack Design", leetcode: 155, order: 5, tier: 'mastery' },
  { id: 'validate-stack-sequences', name: "Validate Stack Sequences", topicKey: 'stacks-queues', section: "Stack Basics", difficulty: 'Medium', pattern: "Stack Simulation", leetcode: 946, order: 6, tier: 'mastery' },
  { id: 'design-stack-with-increment', name: "Design a Stack With Increment Operation", topicKey: 'stacks-queues', section: "Stack Basics", difficulty: 'Medium', pattern: "Stack Design", leetcode: 1381, order: 7, tier: 'mastery', bossFight: true },
  // ── Queue Basics ──
  { id: 'implement-queue-using-stacks', name: "Implement Queue using Stacks", topicKey: 'stacks-queues', section: "Queue Basics", difficulty: 'Easy', pattern: "Stack Simulation", leetcode: 232, order: 8, tier: 'foundation' },
  { id: 'implement-stack-using-queues', name: "Implement Stack using Queues", topicKey: 'stacks-queues', section: "Queue Basics", difficulty: 'Easy', pattern: "Queue Simulation", leetcode: 225, order: 9, tier: 'core' },
  { id: 'number-of-recent-calls', name: "Number of Recent Calls", topicKey: 'stacks-queues', section: "Queue Basics", difficulty: 'Easy', pattern: "Queue", leetcode: 933, order: 10, tier: 'core' },
  { id: 'design-circular-queue', name: "Design Circular Queue", topicKey: 'stacks-queues', section: "Queue Basics", difficulty: 'Medium', pattern: "Queue Design", leetcode: 622, order: 11, tier: 'mastery' },
  { id: 'dota2-senate', name: "Dota2 Senate", topicKey: 'stacks-queues', section: "Queue Basics", difficulty: 'Medium', pattern: "Queue Simulation", leetcode: 649, order: 12, tier: 'mastery', bossFight: true },
  // ── Stack Simulation ──
  { id: 'asteroid-collision', name: "Asteroid Collision", topicKey: 'stacks-queues', section: "Stack Simulation", difficulty: 'Medium', pattern: "Stack Simulation", leetcode: 735, order: 13, tier: 'foundation' },
  { id: 'decode-string', name: "Decode String", topicKey: 'stacks-queues', section: "Stack Simulation", difficulty: 'Medium', pattern: "Stack Simulation", leetcode: 394, order: 14, tier: 'foundation' },
  { id: 'simplify-path', name: "Simplify Path", topicKey: 'stacks-queues', section: "Stack Simulation", difficulty: 'Medium', pattern: "Stack Simulation", leetcode: 71, order: 15, tier: 'core' },
  { id: 'remove-adjacent-duplicates-in-string', name: "Remove All Adjacent Duplicates In String", topicKey: 'stacks-queues', section: "Stack Simulation", difficulty: 'Easy', pattern: "Stack Simulation", leetcode: 1047, order: 16, tier: 'core' },
  { id: 'remove-adjacent-duplicates-in-string-ii', name: "Remove All Adjacent Duplicates in String II", topicKey: 'stacks-queues', section: "Stack Simulation", difficulty: 'Medium', pattern: "Stack Simulation", leetcode: 1209, order: 17, tier: 'core' },
  { id: 'exclusive-time-of-functions', name: "Exclusive Time of Functions", topicKey: 'stacks-queues', section: "Stack Simulation", difficulty: 'Medium', pattern: "Stack Simulation", leetcode: 636, order: 18, tier: 'mastery' },
  { id: 'score-of-parentheses', name: "Score of Parentheses", topicKey: 'stacks-queues', section: "Stack Simulation", difficulty: 'Medium', pattern: "Stack Simulation", leetcode: 856, order: 19, tier: 'mastery' },
  { id: 'minimum-remove-to-make-valid-parentheses', name: "Minimum Remove to Make Valid Parentheses", topicKey: 'stacks-queues', section: "Stack Simulation", difficulty: 'Medium', pattern: "Greedy + Stack", leetcode: 1249, order: 20, tier: 'mastery', bossFight: true },
  // ── Expression Evaluation ──
  { id: 'evaluate-reverse-polish-notation', name: "Evaluate Reverse Polish Notation", topicKey: 'stacks-queues', section: "Expression Evaluation", difficulty: 'Medium', pattern: "Stack Evaluation", leetcode: 150, order: 21, tier: 'foundation' },
  { id: 'basic-calculator', name: "Basic Calculator", topicKey: 'stacks-queues', section: "Expression Evaluation", difficulty: 'Hard', pattern: "Expression Parsing", leetcode: 224, order: 22, tier: 'core' },
  { id: 'basic-calculator-ii', name: "Basic Calculator II", topicKey: 'stacks-queues', section: "Expression Evaluation", difficulty: 'Medium', pattern: "Expression Parsing", leetcode: 227, order: 23, tier: 'mastery', bossFight: true },
  // ── Greedy Parentheses ──
  { id: 'minimum-add-to-make-parentheses-valid', name: "Minimum Add to Make Parentheses Valid", topicKey: 'stacks-queues', section: "Greedy Parentheses", difficulty: 'Medium', pattern: "Greedy", leetcode: 921, order: 24, tier: 'foundation' },
  { id: 'valid-parenthesis-string', name: "Valid Parenthesis String", topicKey: 'stacks-queues', section: "Greedy Parentheses", difficulty: 'Medium', pattern: "Greedy", leetcode: 678, order: 25, tier: 'core' },
  // ── Iterator / Design ──
  { id: 'flatten-nested-list-iterator', name: "Flatten Nested List Iterator", topicKey: 'stacks-queues', section: "Iterator / Design", difficulty: 'Medium', pattern: "Iterator Design", leetcode: 341, order: 26, tier: 'foundation' },
  // ── Monotonic Stack ──
  { id: 'next-greater-element-i', name: "Next Greater Element I", topicKey: 'stacks-queues', section: "Monotonic Stack", difficulty: 'Easy', pattern: "Monotonic Stack", leetcode: 496, order: 26.5, tier: 'foundation' },
  { id: 'daily-temperatures', name: "Daily Temperatures", topicKey: 'stacks-queues', section: "Monotonic Stack", difficulty: 'Medium', pattern: "Monotonic Stack", leetcode: 739, order: 27, tier: 'foundation' },
  { id: 'final-prices-with-special-discount', name: "Final Prices With a Special Discount in a Shop", topicKey: 'stacks-queues', section: "Monotonic Stack", difficulty: 'Easy', pattern: "Monotonic Stack", leetcode: 1475, order: 28, tier: 'foundation' },
  { id: 'next-greater-element-ii', name: "Next Greater Element II", topicKey: 'stacks-queues', section: "Monotonic Stack", difficulty: 'Medium', pattern: "Monotonic Stack", leetcode: 503, order: 30, tier: 'foundation' },
  { id: 'remove-k-digits', name: "Remove K Digits", topicKey: 'stacks-queues', section: "Monotonic Stack", difficulty: 'Medium', pattern: "Monotonic Stack", leetcode: 402, order: 31, tier: 'core' },
  { id: 'next-greater-element-iii', name: "Next Greater Element III", topicKey: 'stacks-queues', section: "Monotonic Stack", difficulty: 'Medium', pattern: "Monotonic Stack", leetcode: 556, order: 32, tier: 'core' },
  { id: 'largest-rectangle-in-histogram', name: "Largest Rectangle in Histogram", topicKey: 'stacks-queues', section: "Monotonic Stack", difficulty: 'Hard', pattern: "Monotonic Stack", leetcode: 84, order: 33, tier: 'core' },
  { id: 'maximal-rectangle', name: "Maximal Rectangle", topicKey: 'stacks-queues', section: "Monotonic Stack", difficulty: 'Hard', pattern: "Monotonic Stack", leetcode: 85, order: 34, tier: 'core' },
  { id: 'online-stock-span', name: "Online Stock Span", topicKey: 'stacks-queues', section: "Monotonic Stack", difficulty: 'Medium', pattern: "Monotonic Stack", leetcode: 901, order: 35, tier: 'core' },
  { id: 'car-fleet', name: "Car Fleet", topicKey: 'stacks-queues', section: "Monotonic Stack", difficulty: 'Medium', pattern: "Sorting + Stack", leetcode: 853, order: 36, tier: 'mastery' },
  { id: 'sum-of-subarray-minimums', name: "Sum of Subarray Minimums", topicKey: 'stacks-queues', section: "Monotonic Stack", difficulty: 'Medium', pattern: "Monotonic Stack", leetcode: 907, order: 37, tier: 'mastery' },
  { id: '132-pattern', name: "132 Pattern", topicKey: 'stacks-queues', section: "Monotonic Stack", difficulty: 'Medium', pattern: "Monotonic Stack", leetcode: 456, order: 38, tier: 'mastery' },
  { id: 'remove-duplicate-letters', name: "Remove Duplicate Letters", topicKey: 'stacks-queues', section: "Monotonic Stack", difficulty: 'Medium', pattern: "Greedy + Monotonic Stack", leetcode: 316, order: 39, tier: 'mastery', bossFight: true },
  { id: 'create-maximum-number', name: "Create Maximum Number", topicKey: 'stacks-queues', section: "Monotonic Stack", difficulty: 'Hard', pattern: "Greedy + Monotonic Stack", leetcode: 321, order: 40, tier: 'mastery', bossFight: true },
  // ── Monotonic Queue / Deque ──
  { id: 'sliding-window-maximum', name: "Sliding Window Maximum", topicKey: 'stacks-queues', section: "Monotonic Queue / Deque", difficulty: 'Hard', pattern: "Sliding Window + Deque", leetcode: 239, order: 41, tier: 'foundation' },
  { id: 'longest-subarray-abs-diff-limit', name: "Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit", topicKey: 'stacks-queues', section: "Monotonic Queue / Deque", difficulty: 'Medium', pattern: "Sliding Window + Deque", leetcode: 1438, order: 42, tier: 'core' },
  { id: 'shortest-subarray-with-sum-at-least-k', name: "Shortest Subarray with Sum at Least K", topicKey: 'stacks-queues', section: "Monotonic Queue / Deque", difficulty: 'Hard', pattern: "Prefix Sum + Monotonic Deque", leetcode: 862, order: 43, tier: 'mastery', bossFight: true },
  // ══════════════════════════════════════════════════════
  // RECURSION & BACKTRACKING
  // ══════════════════════════════════════════════════════
  // ── Recursion Fundamentals ──
  { id: 'fibonacci-number', name: "Fibonacci Number", topicKey: 'recursion', section: "Recursion Fundamentals", difficulty: 'Easy', pattern: "Basic Recursion", leetcode: 509, order: 1, tier: 'foundation' },
  { id: 'pow-x-n', name: "Pow(x, n)", topicKey: 'recursion', section: "Recursion Fundamentals", difficulty: 'Medium', pattern: "Divide & Conquer", leetcode: 50, order: 2, tier: 'core' },
  { id: 'count-numbers-with-unique-digits', name: "Count Numbers with Unique Digits", topicKey: 'recursion', section: "Recursion Fundamentals", difficulty: 'Medium', pattern: "Recursive Enumeration", leetcode: 357, order: 3, tier: 'mastery', bossFight: true },
  // ── Divide & Conquer ──
  { id: 'different-ways-to-add-parentheses', name: "Different Ways to Add Parentheses", topicKey: 'recursion', section: "Divide & Conquer", difficulty: 'Medium', pattern: "Divide & Conquer", leetcode: 241, order: 4, tier: 'foundation' },
  // ── Backtracking Fundamentals ──
  { id: 'letter-combinations-phone-number', name: "Letter Combinations of a Phone Number", topicKey: 'recursion', section: "Backtracking Fundamentals", difficulty: 'Medium', pattern: "Decision Tree", leetcode: 17, order: 5, tier: 'foundation' },
  { id: 'generate-parentheses', name: "Generate Parentheses", topicKey: 'recursion', section: "Backtracking Fundamentals", difficulty: 'Medium', pattern: "Decision Tree", leetcode: 22, order: 6, tier: 'foundation' },
  { id: 'subsets', name: "Subsets", topicKey: 'recursion', section: "Backtracking Fundamentals", difficulty: 'Medium', pattern: "Include / Exclude", leetcode: 78, order: 7, tier: 'foundation' },
  { id: 'subsets-ii', name: "Subsets II", topicKey: 'recursion', section: "Backtracking Fundamentals", difficulty: 'Medium', pattern: "Duplicate Handling", leetcode: 90, order: 8, tier: 'foundation' },
  { id: 'combinations', name: "Combinations", topicKey: 'recursion', section: "Backtracking Fundamentals", difficulty: 'Medium', pattern: "Choose / Skip", leetcode: 77, order: 9, tier: 'foundation' },
  { id: 'combination-sum', name: "Combination Sum", topicKey: 'recursion', section: "Backtracking Fundamentals", difficulty: 'Medium', pattern: "Choose Unlimited", leetcode: 39, order: 10, tier: 'core' },
  { id: 'combination-sum-ii', name: "Combination Sum II", topicKey: 'recursion', section: "Backtracking Fundamentals", difficulty: 'Medium', pattern: "Choose Once", leetcode: 40, order: 11, tier: 'core' },
  { id: 'combination-sum-iii', name: "Combination Sum III", topicKey: 'recursion', section: "Backtracking Fundamentals", difficulty: 'Medium', pattern: "Fixed Length", leetcode: 216, order: 12, tier: 'core' },
  { id: 'permutations', name: "Permutations", topicKey: 'recursion', section: "Backtracking Fundamentals", difficulty: 'Medium', pattern: "Visited Array", leetcode: 46, order: 13, tier: 'core' },
  { id: 'permutations-ii', name: "Permutations II", topicKey: 'recursion', section: "Backtracking Fundamentals", difficulty: 'Medium', pattern: "Visited + Duplicates", leetcode: 47, order: 14, tier: 'core' },
  { id: 'letter-case-permutation', name: "Letter Case Permutation", topicKey: 'recursion', section: "Backtracking Fundamentals", difficulty: 'Medium', pattern: "State Branching", leetcode: 784, order: 15, tier: 'core' },
  { id: 'generalized-abbreviation', name: "Generalized Abbreviation", topicKey: 'recursion', section: "Backtracking Fundamentals", difficulty: 'Medium', pattern: "State Branching", leetcode: 320, order: 16, tier: 'mastery' },
  { id: 'restore-ip-addresses', name: "Restore IP Addresses", topicKey: 'recursion', section: "Grid & Constraint Backtracking", difficulty: 'Medium', pattern: "Pruning", leetcode: 93, order: 16.5, tier: 'foundation' },
  { id: 'gray-code', name: "Gray Code", topicKey: 'recursion', section: "Backtracking Fundamentals", difficulty: 'Medium', pattern: "Recursive Construction", leetcode: 89, order: 17, tier: 'mastery' },
  { id: 'binary-watch', name: "Binary Watch", topicKey: 'recursion', section: "Backtracking Fundamentals", difficulty: 'Easy', pattern: "Combination Generation", leetcode: 401, order: 18, tier: 'mastery' },
  { id: 'factor-combinations', name: "Factor Combinations", topicKey: 'recursion', section: "Backtracking Fundamentals", difficulty: 'Medium', pattern: "Combination Search", leetcode: 254, order: 19, tier: 'mastery', bossFight: true },
  { id: 'kth-lexicographical-happy-string', name: "The k-th Lexicographical String of All Happy Strings of Length n", topicKey: 'recursion', section: "Backtracking Fundamentals", difficulty: 'Medium', pattern: "Lexicographic DFS", leetcode: 1415, order: 20, tier: 'mastery', bossFight: true },
  // ── Grid & Constraint Backtracking ──
  { id: 'word-search', name: "Word Search", topicKey: 'recursion', section: "Grid & Constraint Backtracking", difficulty: 'Medium', pattern: "Grid DFS", leetcode: 79, order: 21, tier: 'foundation' },
  { id: 'beautiful-arrangement', name: "Beautiful Arrangement", topicKey: 'recursion', section: "Grid & Constraint Backtracking", difficulty: 'Medium', pattern: "Constraint DFS", leetcode: 526, order: 23, tier: 'foundation' },
  { id: 'matchsticks-to-square', name: "Matchsticks to Square", topicKey: 'recursion', section: "Grid & Constraint Backtracking", difficulty: 'Medium', pattern: "Bucket Backtracking", leetcode: 473, order: 24, tier: 'foundation' },
  { id: 'partition-k-equal-sum-subsets', name: "Partition to K Equal Sum Subsets", topicKey: 'recursion', section: "Grid & Constraint Backtracking", difficulty: 'Medium', pattern: "Bucket Backtracking", leetcode: 698, order: 25, tier: 'core' },
  { id: 'splitting-string-descending-values', name: "Splitting a String Into Descending Consecutive Values", topicKey: 'recursion', section: "Grid & Constraint Backtracking", difficulty: 'Medium', pattern: "Pruning", leetcode: 1849, order: 26, tier: 'core' },
  { id: 'n-queens', name: "N-Queens", topicKey: 'recursion', section: "Grid & Constraint Backtracking", difficulty: 'Hard', pattern: "Constraint Backtracking", leetcode: 51, order: 27, tier: 'core' },
  { id: 'n-queens-ii', name: "N-Queens II", topicKey: 'recursion', section: "Grid & Constraint Backtracking", difficulty: 'Hard', pattern: "Constraint Backtracking", leetcode: 52, order: 28, tier: 'core' },
  { id: 'sudoku-solver', name: "Sudoku Solver", topicKey: 'recursion', section: "Grid & Constraint Backtracking", difficulty: 'Hard', pattern: "Constraint Backtracking", leetcode: 37, order: 29, tier: 'mastery' },
  { id: 'unique-paths-iii', name: "Unique Paths III", topicKey: 'recursion', section: "Grid & Constraint Backtracking", difficulty: 'Hard', pattern: "Grid Backtracking", leetcode: 980, order: 30, tier: 'mastery' },
  { id: 'expression-add-operators', name: "Expression Add Operators", topicKey: 'recursion', section: "Grid & Constraint Backtracking", difficulty: 'Hard', pattern: "Expression DFS", leetcode: 282, order: 31, tier: 'mastery' },
  { id: 'remove-invalid-parentheses', name: "Remove Invalid Parentheses", topicKey: 'recursion', section: "Grid & Constraint Backtracking", difficulty: 'Hard', pattern: "Backtracking + BFS", leetcode: 301, order: 32, tier: 'mastery', bossFight: true },
  { id: 'android-unlock-patterns', name: "Android Unlock Patterns", topicKey: 'recursion', section: "Grid & Constraint Backtracking", difficulty: 'Medium', pattern: "Constraint DFS", leetcode: 351, order: 33, tier: 'mastery', bossFight: true },
  // ── Advanced Backtracking ──
  { id: 'word-search-ii', name: "Word Search II", topicKey: 'recursion', section: "Advanced Backtracking", difficulty: 'Hard', pattern: "Trie + DFS", leetcode: 212, order: 34, tier: 'foundation' },
  { id: 'stickers-to-spell-word', name: "Stickers to Spell Word", topicKey: 'recursion', section: "Advanced Backtracking", difficulty: 'Hard', pattern: "Memoized DFS", leetcode: 691, order: 35, tier: 'core' },
  { id: 'flip-game-ii', name: "Flip Game II", topicKey: 'recursion', section: "Advanced Backtracking", difficulty: 'Medium', pattern: "Game DFS + Memoization", leetcode: 294, order: 36, tier: 'mastery', bossFight: true },
  // ── Capstone ──
  { id: 'permutation-sequence', name: "Permutation Sequence", topicKey: 'recursion', section: "Capstone", difficulty: 'Hard', pattern: "Recursion + Combinatorics", leetcode: 60, order: 37, tier: 'mastery', bossFight: true },
  { id: 'iterator-for-combination', name: "Iterator for Combination", topicKey: 'recursion', section: "Capstone", difficulty: 'Medium', pattern: "Design + Backtracking", leetcode: 1286, order: 38, tier: 'mastery', bossFight: true },
  // ══════════════════════════════════════════════════════
  // LINKED LISTS
  // ══════════════════════════════════════════════════════
  // ── Singly Linked List Basics ──
  { id: 'design-linked-list', name: "Design Linked List", topicKey: 'linked-lists', section: "Singly Linked List Basics", difficulty: 'Medium', pattern: "Linked List Design", leetcode: 707, order: 1, tier: 'foundation' },
  { id: 'remove-linked-list-elements', name: "Remove Linked List Elements", topicKey: 'linked-lists', section: "Singly Linked List Basics", difficulty: 'Easy', pattern: "Pointer Manipulation", leetcode: 203, order: 2, tier: 'foundation' },
  { id: 'delete-node-in-linked-list', name: "Delete Node in a Linked List", topicKey: 'linked-lists', section: "Singly Linked List Basics", difficulty: 'Medium', pattern: "Pointer Manipulation", leetcode: 237, order: 3, tier: 'core' },
  { id: 'add-two-numbers', name: "Add Two Numbers", topicKey: 'linked-lists', section: "Singly Linked List Basics", difficulty: 'Medium', pattern: "Simulation", leetcode: 2, order: 4, tier: 'core' },
  { id: 'convert-binary-number-linked-list', name: "Convert Binary Number in a Linked List to Integer", topicKey: 'linked-lists', section: "Singly Linked List Basics", difficulty: 'Easy', pattern: "Traversal", leetcode: 1290, order: 5, tier: 'mastery' },
  { id: 'remove-duplicates-sorted-list', name: "Remove Duplicates from Sorted List", topicKey: 'linked-lists', section: "Singly Linked List Basics", difficulty: 'Easy', pattern: "Traversal", leetcode: 83, order: 6, tier: 'mastery', bossFight: true },
  // ── Two Pointer Patterns ──
  { id: 'middle-of-linked-list', name: "Middle of the Linked List", topicKey: 'linked-lists', section: "Two Pointer Patterns", difficulty: 'Easy', pattern: "Fast & Slow Pointers", leetcode: 876, order: 7, tier: 'foundation' },
  { id: 'linked-list-cycle', name: "Linked List Cycle", topicKey: 'linked-lists', section: "Two Pointer Patterns", difficulty: 'Easy', pattern: "Fast & Slow Pointers", leetcode: 141, order: 8, tier: 'foundation' },
  { id: 'linked-list-cycle-ii', name: "Linked List Cycle II", topicKey: 'linked-lists', section: "Two Pointer Patterns", difficulty: 'Medium', pattern: "Fast & Slow Pointers", leetcode: 142, order: 9, tier: 'core' },
  { id: 'remove-nth-node-from-end', name: "Remove Nth Node From End of List", topicKey: 'linked-lists', section: "Two Pointer Patterns", difficulty: 'Medium', pattern: "Two Pointers", leetcode: 19, order: 10, tier: 'core' },
  { id: 'intersection-of-two-linked-lists', name: "Intersection of Two Linked Lists", topicKey: 'linked-lists', section: "Two Pointer Patterns", difficulty: 'Easy', pattern: "Two Pointers", leetcode: 160, order: 11, tier: 'mastery' },
  { id: 'palindrome-linked-list', name: "Palindrome Linked List", topicKey: 'linked-lists', section: "Two Pointer Patterns", difficulty: 'Easy', pattern: "Fast & Slow + Reverse", leetcode: 234, order: 12, tier: 'mastery', bossFight: true },
  // ── In-place Pointer Manipulation ──
  { id: 'reverse-linked-list-iterative', name: "Reverse Linked List", topicKey: 'linked-lists', section: "In-place Pointer Manipulation", difficulty: 'Easy', pattern: "Pointer Reversal", leetcode: 206, order: 13, tier: 'foundation', enforcedApproach: 'iterative' },
  { id: 'reverse-linked-list-ii', name: "Reverse Linked List II", topicKey: 'linked-lists', section: "In-place Pointer Manipulation", difficulty: 'Medium', pattern: "Sublist Reversal", leetcode: 92, order: 14, tier: 'foundation' },
  { id: 'swap-nodes-in-pairs', name: "Swap Nodes in Pairs", topicKey: 'linked-lists', section: "In-place Pointer Manipulation", difficulty: 'Medium', pattern: "Pointer Swapping", leetcode: 24, order: 15, tier: 'foundation' },
  { id: 'swap-nodes-in-linked-list', name: "Swapping Nodes in a Linked List", topicKey: 'linked-lists', section: "In-place Pointer Manipulation", difficulty: 'Medium', pattern: "Pointer Manipulation", leetcode: 1721, order: 16, tier: 'foundation' },
  { id: 'odd-even-linked-list', name: "Odd Even Linked List", topicKey: 'linked-lists', section: "In-place Pointer Manipulation", difficulty: 'Medium', pattern: "Pointer Rearrangement", leetcode: 328, order: 17, tier: 'core' },
  { id: 'partition-list', name: "Partition List", topicKey: 'linked-lists', section: "In-place Pointer Manipulation", difficulty: 'Medium', pattern: "Dummy Lists", leetcode: 86, order: 18, tier: 'core' },
  { id: 'rotate-list', name: "Rotate List", topicKey: 'linked-lists', section: "In-place Pointer Manipulation", difficulty: 'Medium', pattern: "Circular Transformation", leetcode: 61, order: 19, tier: 'core' },
  { id: 'split-linked-list-in-parts', name: "Split Linked List in Parts", topicKey: 'linked-lists', section: "In-place Pointer Manipulation", difficulty: 'Medium', pattern: "Pointer Manipulation", leetcode: 725, order: 20, tier: 'core' },
  { id: 'reorder-list', name: "Reorder List", topicKey: 'linked-lists', section: "In-place Pointer Manipulation", difficulty: 'Medium', pattern: "Split + Reverse + Merge", leetcode: 143, order: 21, tier: 'mastery' },
  { id: 'remove-duplicates-sorted-list-ii', name: "Remove Duplicates from Sorted List II", topicKey: 'linked-lists', section: "In-place Pointer Manipulation", difficulty: 'Medium', pattern: "Pointer Manipulation", leetcode: 82, order: 22, tier: 'mastery' },
  { id: 'reverse-nodes-in-k-group', name: "Reverse Nodes in k-Group", topicKey: 'linked-lists', section: "In-place Pointer Manipulation", difficulty: 'Hard', pattern: "Segment Reversal", leetcode: 25, order: 23, tier: 'mastery', bossFight: true },
  // ── Recursive Linked Lists ──
  { id: 'reverse-linked-list-recursive', name: "Reverse Linked List", topicKey: 'linked-lists', section: "Recursive Linked Lists", difficulty: 'Easy', pattern: "Recursive Reversal", leetcode: 206, order: 24, tier: 'foundation', enforcedApproach: 'recursive' },
  { id: 'merge-two-sorted-lists-recursive', name: "Merge Two Sorted Lists", topicKey: 'linked-lists', section: "Recursive Linked Lists", difficulty: 'Easy', pattern: "Recursive Merge", leetcode: 21, order: 25.1, tier: 'core', bossFight: true, enforcedApproach: 'recursive' },
  // ── Doubly Linked Lists ──
  { id: 'flatten-multilevel-doubly-linked-list', name: "Flatten a Multilevel Doubly Linked List", topicKey: 'linked-lists', section: "Doubly Linked Lists", difficulty: 'Medium', pattern: "DFS", leetcode: 430, order: 26, tier: 'foundation' },
  { id: 'design-browser-history', name: "Design Browser History", topicKey: 'linked-lists', section: "Doubly Linked Lists", difficulty: 'Medium', pattern: "Doubly Linked List", leetcode: 1472, order: 27, tier: 'core' },
  { id: 'copy-list-with-random-pointer', name: "Copy List with Random Pointer", topicKey: 'linked-lists', section: "Doubly Linked Lists", difficulty: 'Medium', pattern: "Hash Map", leetcode: 138, order: 28, tier: 'mastery', bossFight: true },
  // ── Sorting & Merging ──
  { id: 'sort-list', name: "Sort List", topicKey: 'linked-lists', section: "Sorting & Merging", difficulty: 'Medium', pattern: "Merge Sort", leetcode: 148, order: 29, tier: 'foundation' },
  { id: 'merge-two-sorted-lists-iterative', name: "Merge Two Sorted Lists", topicKey: 'linked-lists', section: "Recursive Linked Lists", difficulty: 'Easy', pattern: "Merge", leetcode: 21, order: 29.5, tier: 'core', bossFight: true, enforcedApproach: 'iterative' },
  { id: 'merge-k-sorted-lists', name: "Merge k Sorted Lists", topicKey: 'linked-lists', section: "Sorting & Merging", difficulty: 'Hard', pattern: "Divide & Conquer + Heap", leetcode: 23, order: 30, tier: 'core' },
  // ── Linked List Design ──
  { id: 'lru-cache', name: "LRU Cache", topicKey: 'linked-lists', section: "Linked List Design", difficulty: 'Medium', pattern: "Hash Map + Doubly Linked List", leetcode: 146, order: 31, tier: 'foundation' },
  { id: 'lfu-cache', name: "LFU Cache", topicKey: 'linked-lists', section: "Linked List Design", difficulty: 'Hard', pattern: "Hash Map + Doubly Linked List", leetcode: 460, order: 32, tier: 'core' },
  // ── Circular Linked Lists ──
  { id: 'insert-into-a-sorted-circular-linked-list', name: "Insert into a Sorted Circular Linked List", topicKey: 'linked-lists', section: "Circular Linked Lists", difficulty: 'Medium', pattern: "Circular Pointer Manipulation", leetcode: 708, order: 33, tier: 'foundation' },
  { id: 'josephus-problem', name: "Josephus Problem", topicKey: 'linked-lists', section: "Circular Linked Lists", difficulty: 'Medium', pattern: "Circular Simulation", platform: "GFG", order: 34, tier: 'core' },
  { id: 'split-a-circular-linked-list-into-two-halves', name: "Split a Circular Linked List into Two Halves", topicKey: 'linked-lists', section: "Circular Linked Lists", difficulty: 'Medium', pattern: "Fast & Slow Pointers", platform: "GFG", order: 35, tier: 'mastery' },
  { id: 'sorted-insert-for-circular-linked-list', name: "Sorted Insert for Circular Linked List", topicKey: 'linked-lists', section: "Circular Linked Lists", difficulty: 'Medium', pattern: "Circular Pointer Manipulation", platform: "GFG", order: 36, tier: 'mastery', bossFight: true },
  // ══════════════════════════════════════════════════════
  // TREES
  // ══════════════════════════════════════════════════════
  // ── Traversals ──
  { id: 'binary-tree-inorder-traversal-recursive', name: "Binary Tree Inorder Traversal", topicKey: 'trees', section: "Traversals", difficulty: 'Easy', pattern: "Recursive DFS", leetcode: 94, order: 1, tier: 'foundation', enforcedApproach: 'recursive' },
  { id: 'binary-tree-inorder-traversal-iterative', name: "Binary Tree Inorder Traversal", topicKey: 'trees', section: "Traversals", difficulty: 'Easy', pattern: "Iterative DFS + Stack", leetcode: 94, order: 2, tier: 'foundation', enforcedApproach: 'iterative' },
  { id: 'binary-tree-preorder-traversal-recursive', name: "Binary Tree Preorder Traversal", topicKey: 'trees', section: "Traversals", difficulty: 'Easy', pattern: "Recursive DFS", leetcode: 144, order: 3, tier: 'foundation', enforcedApproach: 'recursive' },
  { id: 'binary-tree-preorder-traversal-iterative', name: "Binary Tree Preorder Traversal", topicKey: 'trees', section: "Traversals", difficulty: 'Easy', pattern: "Iterative DFS + Stack", leetcode: 144, order: 4, tier: 'foundation', enforcedApproach: 'iterative' },
  { id: 'binary-tree-postorder-traversal-recursive', name: "Binary Tree Postorder Traversal", topicKey: 'trees', section: "Traversals", difficulty: 'Easy', pattern: "Recursive DFS", leetcode: 145, order: 5, tier: 'core', enforcedApproach: 'recursive' },
  { id: 'binary-tree-postorder-two-stack', name: "Binary Tree Postorder Traversal (Two Stack)", topicKey: 'trees', section: "Traversals", difficulty: 'Easy', pattern: "Iterative DFS + Two Stack", leetcode: 145, order: 6, tier: 'core' },
  { id: 'binary-tree-postorder-one-stack', name: "Binary Tree Postorder Traversal (One Stack)", topicKey: 'trees', section: "Traversals", difficulty: 'Medium', pattern: "Iterative DFS + Last Visited", leetcode: 145, order: 7, tier: 'mastery' },
  { id: 'morris-inorder-traversal', name: "Morris Inorder Traversal", topicKey: 'trees', section: "Traversals", difficulty: 'Medium', pattern: "Threaded Binary Tree", leetcode: null, order: 8, tier: 'mastery' },
  { id: 'morris-preorder-traversal', name: "Morris Preorder Traversal", topicKey: 'trees', section: "Traversals", difficulty: 'Medium', pattern: "Threaded Binary Tree", leetcode: null, order: 9, tier: 'mastery', bossFight: true },
  // ── Tree Fundamentals ──
  { id: 'maximum-depth-of-binary-tree', name: "Maximum Depth of Binary Tree", topicKey: 'trees', section: "Tree Fundamentals", difficulty: 'Easy', pattern: "DFS + Height", leetcode: 104, order: 10, tier: 'foundation' },
  { id: 'minimum-depth-of-binary-tree', name: "Minimum Depth of Binary Tree", topicKey: 'trees', section: "Tree Fundamentals", difficulty: 'Easy', pattern: "BFS + Depth", leetcode: 111, order: 11, tier: 'foundation' },
  { id: 'same-tree', name: "Same Tree", topicKey: 'trees', section: "Tree Fundamentals", difficulty: 'Easy', pattern: "DFS + Structural Comparison", leetcode: 100, order: 12, tier: 'core' },
  { id: 'invert-binary-tree', name: "Invert Binary Tree", topicKey: 'trees', section: "Tree Fundamentals", difficulty: 'Easy', pattern: "DFS / BFS", leetcode: 226, order: 13, tier: 'core' },
  { id: 'symmetric-tree', name: "Symmetric Tree", topicKey: 'trees', section: "Tree Fundamentals", difficulty: 'Easy', pattern: "DFS + Mirror Comparison", leetcode: 101, order: 14, tier: 'core' },
  { id: 'subtree-of-another-tree', name: "Subtree of Another Tree", topicKey: 'trees', section: "Tree Fundamentals", difficulty: 'Easy', pattern: "DFS + Subtree Matching", leetcode: 572, order: 15, tier: 'mastery' },
  { id: 'diameter-of-binary-tree', name: "Diameter of Binary Tree", topicKey: 'trees', section: "Tree Fundamentals", difficulty: 'Easy', pattern: "Postorder DFS", leetcode: 543, order: 15.5, tier: 'foundation' },
  { id: 'balanced-binary-tree', name: "Balanced Binary Tree", topicKey: 'trees', section: "Tree Fundamentals", difficulty: 'Easy', pattern: "DFS + Height", leetcode: 110, order: 16, tier: 'mastery' },
  { id: 'count-complete-tree-nodes', name: "Count Complete Tree Nodes", topicKey: 'trees', section: "Tree Fundamentals", difficulty: 'Medium', pattern: "Tree Height", leetcode: 222, order: 17, tier: 'mastery', bossFight: true },
  // ── BFS ──
  { id: 'binary-tree-level-order-traversal', name: "Binary Tree Level Order Traversal", topicKey: 'trees', section: "BFS", difficulty: 'Medium', pattern: "Queue BFS", leetcode: 102, order: 18, tier: 'foundation' },
  { id: 'average-of-levels-in-binary-tree', name: "Average of Levels in Binary Tree", topicKey: 'trees', section: "BFS", difficulty: 'Easy', pattern: "Level BFS", leetcode: 637, order: 19, tier: 'foundation' },
  { id: 'binary-tree-right-side-view', name: "Binary Tree Right Side View", topicKey: 'trees', section: "BFS", difficulty: 'Medium', pattern: "Level BFS", leetcode: 199, order: 20, tier: 'core' },
  { id: 'binary-tree-zigzag-level-order', name: "Binary Tree Zigzag Level Order Traversal", topicKey: 'trees', section: "BFS", difficulty: 'Medium', pattern: "BFS + Direction Change", leetcode: 103, order: 21, tier: 'core' },
  { id: 'maximum-width-of-binary-tree', name: "Maximum Width of Binary Tree", topicKey: 'trees', section: "BFS", difficulty: 'Medium', pattern: "Indexed BFS", leetcode: 662, order: 22, tier: 'mastery' },
  { id: 'populate-next-right-pointers', name: "Populating Next Right Pointers", topicKey: 'trees', section: "BFS", difficulty: 'Medium', pattern: "BFS + Next Pointer", leetcode: 116, order: 23, tier: 'mastery' },
  { id: 'populate-next-right-pointers-ii', name: "Populating Next Right Pointers II", topicKey: 'trees', section: "BFS", difficulty: 'Medium', pattern: "BFS", leetcode: 117, order: 24, tier: 'mastery', bossFight: true },
  // ── DFS Path Problems ──
  { id: 'path-sum', name: "Path Sum", topicKey: 'trees', section: "DFS Path Problems", difficulty: 'Easy', pattern: "Root-to-Leaf DFS", leetcode: 112, order: 25, tier: 'foundation' },
  { id: 'path-sum-ii', name: "Path Sum II", topicKey: 'trees', section: "DFS Path Problems", difficulty: 'Medium', pattern: "DFS + Backtracking", leetcode: 113, order: 26, tier: 'core' },
  { id: 'path-sum-iii', name: "Path Sum III", topicKey: 'trees', section: "DFS Path Problems", difficulty: 'Medium', pattern: "DFS + Prefix Sum", leetcode: 437, order: 27, tier: 'core' },
  { id: 'sum-root-to-leaf-numbers', name: "Sum Root to Leaf Numbers", topicKey: 'trees', section: "DFS Path Problems", difficulty: 'Medium', pattern: "Path Construction", leetcode: 129, order: 28, tier: 'mastery' },
  { id: 'count-good-nodes', name: "Count Good Nodes in Binary Tree", topicKey: 'trees', section: "DFS Path Problems", difficulty: 'Medium', pattern: "Path Maximum Tracking", leetcode: 1448, order: 29, tier: 'mastery', bossFight: true },
  // ── Tree DP ──
  { id: 'binary-tree-maximum-path-sum', name: "Binary Tree Maximum Path Sum", topicKey: 'trees', section: "Tree DP", difficulty: 'Hard', pattern: "Tree DP", leetcode: 124, order: 31, tier: 'core' },
  { id: 'house-robber-iii', name: "House Robber III", topicKey: 'trees', section: "Tree DP", difficulty: 'Medium', pattern: "Tree DP", leetcode: 337, order: 32, tier: 'mastery' },
  { id: 'longest-zigzag-path', name: "Longest ZigZag Path in Binary Tree", topicKey: 'trees', section: "Tree DP", difficulty: 'Medium', pattern: "DFS State DP", leetcode: 1372, order: 33, tier: 'mastery', bossFight: true },
  // ── Tree Relationships ──
  { id: 'lowest-common-ancestor-binary-tree', name: "Lowest Common Ancestor of Binary Tree", topicKey: 'trees', section: "Tree Relationships", difficulty: 'Medium', pattern: "DFS Divide & Conquer", leetcode: 236, order: 34, tier: 'foundation' },
  { id: 'all-nodes-distance-k', name: "All Nodes Distance K", topicKey: 'trees', section: "Tree Relationships", difficulty: 'Medium', pattern: "Tree To Graph + BFS", leetcode: 863, order: 35, tier: 'core' },
  // ── Tree Views ──
  { id: 'vertical-order-traversal', name: "Vertical Order Traversal", topicKey: 'trees', section: "Tree Views", difficulty: 'Hard', pattern: "DFS + Sorting", leetcode: 987, order: 36, tier: 'foundation' },
  { id: 'boundary-traversal', name: "Boundary Traversal", topicKey: 'trees', section: "Tree Views", difficulty: 'Medium', pattern: "Tree Traversal", leetcode: null, order: 37, tier: 'core' },
  // ── BST ──
  { id: 'search-in-bst', name: "Search in a Binary Search Tree", topicKey: 'trees', section: "BST", difficulty: 'Easy', pattern: "BST Search", leetcode: 700, order: 38, tier: 'foundation' },
  { id: 'validate-bst', name: "Validate Binary Search Tree", topicKey: 'trees', section: "BST", difficulty: 'Medium', pattern: "BST Rules", leetcode: 98, order: 39, tier: 'foundation' },
  { id: 'insert-into-bst', name: "Insert into BST", topicKey: 'trees', section: "BST", difficulty: 'Medium', pattern: "BST", leetcode: 701, order: 40, tier: 'core' },
  { id: 'delete-node-bst', name: "Delete Node in BST", topicKey: 'trees', section: "BST", difficulty: 'Medium', pattern: "BST", leetcode: 450, order: 41, tier: 'core' },
  { id: 'lowest-common-ancestor-bst', name: "Lowest Common Ancestor BST", topicKey: 'trees', section: "BST", difficulty: 'Medium', pattern: "BST", leetcode: 235, order: 42, tier: 'mastery' },
  { id: 'kth-smallest-bst', name: "Kth Smallest Element in BST", topicKey: 'trees', section: "BST", difficulty: 'Medium', pattern: "Inorder", leetcode: 230, order: 43, tier: 'mastery', bossFight: true },
  // ── Tree Construction ──
  { id: 'sorted-array-to-bst', name: "Convert Sorted Array to BST", topicKey: 'trees', section: "Tree Construction", difficulty: 'Easy', pattern: "Divide & Conquer", leetcode: 108, order: 44, tier: 'foundation' },
  { id: 'construct-preorder-inorder', name: "Construct Tree Preorder + Inorder", topicKey: 'trees', section: "Tree Construction", difficulty: 'Medium', pattern: "Divide & Conquer", leetcode: 105, order: 45, tier: 'core' },
  { id: 'construct-inorder-postorder', name: "Construct Tree Inorder + Postorder", topicKey: 'trees', section: "Tree Construction", difficulty: 'Medium', pattern: "Divide & Conquer", leetcode: 106, order: 46, tier: 'core' },
  { id: 'flatten-tree-linked-list', name: "Flatten Binary Tree to Linked List", topicKey: 'trees', section: "Tree Construction", difficulty: 'Medium', pattern: "DFS", leetcode: 114, order: 47, tier: 'mastery' },
  { id: 'serialize-deserialize-tree', name: "Serialize and Deserialize Binary Tree", topicKey: 'trees', section: "Tree Construction", difficulty: 'Hard', pattern: "DFS / BFS", leetcode: 297, order: 48, tier: 'mastery', bossFight: true },
  // ── N-ary Trees ──
  { id: 'nary-preorder', name: "N-ary Tree Preorder Traversal", topicKey: 'trees', section: "N-ary Trees", difficulty: 'Easy', pattern: "DFS", leetcode: 589, order: 49, tier: 'foundation' },
  { id: 'nary-postorder', name: "N-ary Tree Postorder Traversal", topicKey: 'trees', section: "N-ary Trees", difficulty: 'Easy', pattern: "DFS", leetcode: 590, order: 50, tier: 'core' },
  { id: 'nary-level-order', name: "N-ary Tree Level Order Traversal", topicKey: 'trees', section: "N-ary Trees", difficulty: 'Medium', pattern: "BFS", leetcode: 429, order: 51, tier: 'mastery' },
  { id: 'maximum-depth-nary-tree', name: "Maximum Depth of N-ary Tree", topicKey: 'trees', section: "N-ary Trees", difficulty: 'Easy', pattern: "DFS Height", leetcode: 559, order: 52, tier: 'mastery', bossFight: true },
  // ── Capstone ──
  { id: 'find-duplicate-subtrees', name: "Find Duplicate Subtrees", topicKey: 'trees', section: "Capstone", difficulty: 'Medium', pattern: "Serialization + HashMap", leetcode: 652, order: 53, tier: 'mastery', bossFight: true },
  { id: 'recover-bst', name: "Recover Binary Search Tree", topicKey: 'trees', section: "Capstone", difficulty: 'Hard', pattern: "BST + Inorder", leetcode: 99, order: 54, tier: 'mastery', bossFight: true },
  { id: 'binary-tree-cameras', name: "Binary Tree Cameras", topicKey: 'trees', section: "Capstone", difficulty: 'Hard', pattern: "Tree DP", leetcode: 968, order: 55, tier: 'mastery', bossFight: true },
  // ══════════════════════════════════════════════════════
  // GRAPHS
  // ══════════════════════════════════════════════════════
  // ── Graph Fundamentals ──
  { id: 'graph-representation', name: "Graph Representation (Adjacency List + Matrix)", topicKey: 'graphs', section: "Graph Fundamentals", difficulty: 'Easy', pattern: "Graph Basics", leetcode: null, order: 1, tier: 'foundation' },
  { id: 'dfs-of-graph', name: "DFS Traversal of Graph", topicKey: 'graphs', section: "Graph Fundamentals", difficulty: 'Easy', pattern: "DFS", leetcode: null, order: 2, tier: 'core' },
  { id: 'bfs-of-graph', name: "BFS Traversal of Graph", topicKey: 'graphs', section: "Graph Fundamentals", difficulty: 'Easy', pattern: "BFS", leetcode: null, order: 3, tier: 'mastery' },
  { id: 'number-of-connected-components', name: "Number of Connected Components", topicKey: 'graphs', section: "Graph Fundamentals", difficulty: 'Medium', pattern: "DFS/BFS Components", leetcode: 323, order: 4, tier: 'mastery', bossFight: true },
  // ── Grid Graphs ──
  { id: 'flood-fill', name: "Flood Fill", topicKey: 'graphs', section: "Grid Graphs", difficulty: 'Easy', pattern: "DFS/BFS Grid", leetcode: 733, order: 5, tier: 'foundation' },
  { id: 'number-of-islands', name: "Number of Islands", topicKey: 'graphs', section: "Grid Graphs", difficulty: 'Medium', pattern: "DFS/BFS Grid", leetcode: 200, order: 6, tier: 'core' },
  { id: 'max-area-of-island', name: "Max Area of Island", topicKey: 'graphs', section: "Grid Graphs", difficulty: 'Medium', pattern: "DFS/BFS Grid", leetcode: 695, order: 7, tier: 'core' },
  { id: 'surrounded-regions', name: "Surrounded Regions", topicKey: 'graphs', section: "Grid Graphs", difficulty: 'Medium', pattern: "Boundary DFS", leetcode: 130, order: 8, tier: 'mastery' },
  { id: 'number-of-provinces', name: "Number of Provinces", topicKey: 'graphs', section: "Grid Graphs", difficulty: 'Medium', pattern: "DFS + Components", leetcode: 547, order: 9, tier: 'mastery', bossFight: true },
  // ── Graph Traversal Patterns ──
  { id: 'clone-graph', name: "Clone Graph", topicKey: 'graphs', section: "Graph Traversal Patterns", difficulty: 'Medium', pattern: "DFS/BFS + HashMap", leetcode: 133, order: 10, tier: 'foundation' },
  { id: 'cycle-undirected-dfs', name: "Detect Cycle in Undirected Graph (DFS)", topicKey: 'graphs', section: "Graph Traversal Patterns", difficulty: 'Medium', pattern: "DFS Cycle Detection", leetcode: null, order: 11, tier: 'foundation' },
  { id: 'cycle-undirected-bfs', name: "Detect Cycle in Undirected Graph (BFS)", topicKey: 'graphs', section: "Graph Traversal Patterns", difficulty: 'Medium', pattern: "BFS Cycle Detection", leetcode: null, order: 12, tier: 'core' },
  { id: 'cycle-directed-dfs', name: "Detect Cycle in Directed Graph", topicKey: 'graphs', section: "Graph Traversal Patterns", difficulty: 'Medium', pattern: "DFS Recursion Stack", leetcode: null, order: 13, tier: 'core' },
  { id: 'is-graph-bipartite', name: "Is Graph Bipartite?", topicKey: 'graphs', section: "Graph Traversal Patterns", difficulty: 'Medium', pattern: "BFS Coloring", leetcode: 785, order: 14, tier: 'mastery' },
  { id: 'possible-bipartition', name: "Possible Bipartition", topicKey: 'graphs', section: "Graph Traversal Patterns", difficulty: 'Medium', pattern: "Bipartite Coloring", leetcode: 886, order: 15, tier: 'mastery', bossFight: true },
  // ── Topological Sort ──
  { id: 'dfs-topological-sort', name: "DFS Topological Sort", topicKey: 'graphs', section: "Topological Sort", difficulty: 'Medium', pattern: "DFS Topological Sort", leetcode: null , order: 15.5, tier: 'foundation' },
  { id: 'course-schedule', name: "Course Schedule", topicKey: 'graphs', section: "Topological Sort", difficulty: 'Medium', pattern: "Kahn's Algorithm", leetcode: 207, order: 16, tier: 'foundation' },
  { id: 'course-schedule-ii', name: "Course Schedule II", topicKey: 'graphs', section: "Topological Sort", difficulty: 'Medium', pattern: "Topological Ordering", leetcode: 210, order: 17, tier: 'core' },
  { id: 'alien-dictionary', name: "Alien Dictionary", topicKey: 'graphs', section: "Topological Sort", difficulty: 'Hard', pattern: "Topological Sort", leetcode: 269, order: 18, tier: 'core' },
  { id: 'find-eventual-safe-states', name: "Find Eventual Safe States", topicKey: 'graphs', section: "Topological Sort", difficulty: 'Medium', pattern: "DFS/Kahn", leetcode: 802, order: 19, tier: 'mastery' },
  { id: 'parallel-courses', name: "Parallel Courses", topicKey: 'graphs', section: "Topological Sort", difficulty: 'Medium', pattern: "Topological Sort", leetcode: 1136, order: 20, tier: 'mastery', bossFight: true },
  // ── Union Find ──
  {
  id: 'disjoint-set-union',
  name: "Disjoint Set Union (Union Find)",
  topicKey: 'graphs',
  section: "Union Find",
  difficulty: 'Easy',
  pattern: "DSU Implementation",
  leetcode: null,
  order: 20.1,
  tier: 'founation'
},
{
  id: 'union-by-rank-path-compression',
  name: "Union by Rank + Path Compression",
  topicKey: 'graphs',
  section: "Union Find",
  difficulty: 'Easy',
  pattern: "DSU Optimization",
  leetcode: null,
  order: 20.2,
  tier: 'founation'
},
  { id: 'graph-valid-tree', name: "Graph Valid Tree", topicKey: 'graphs', section: "Union Find", difficulty: 'Medium', pattern: "DSU", leetcode: 261, order: 21, tier: 'foundation' },
  { id: 'redundant-connection', name: "Redundant Connection", topicKey: 'graphs', section: "Union Find", difficulty: 'Medium', pattern: "DSU", leetcode: 684, order: 22, tier: 'core' },
  { id: 'accounts-merge', name: "Accounts Merge", topicKey: 'graphs', section: "Union Find", difficulty: 'Medium', pattern: "DSU", leetcode: 721, order: 23, tier: 'core' },
  { id: 'satisfiability-equations', name: "Satisfiability of Equality Equations", topicKey: 'graphs', section: "Union Find", difficulty: 'Medium', pattern: "DSU", leetcode: 990, order: 24, tier: 'mastery' },
  { id: 'number-of-islands-ii', name: "Number of Islands II", topicKey: 'graphs', section: "Union Find", difficulty: 'Hard', pattern: "Dynamic DSU", leetcode: 305, order: 25, tier: 'mastery', bossFight: true },
  // ── BFS Applications ──
  { id: 'rotting-oranges', name: "Rotting Oranges", topicKey: 'graphs', section: "BFS Applications", difficulty: 'Medium', pattern: "Multi-source BFS", leetcode: 994, order: 26, tier: 'foundation' },
  { id: 'shortest-path-binary-matrix', name: "Shortest Path in Binary Matrix", topicKey: 'graphs', section: "BFS Applications", difficulty: 'Medium', pattern: "Grid BFS", leetcode: 1091, order: 27, tier: 'core' },
  { id: 'walls-and-gates', name: "Walls and Gates", topicKey: 'graphs', section: "BFS Applications", difficulty: 'Medium', pattern: "Multi-source BFS", leetcode: 286, order: 28, tier: 'core' },
  { id: 'pacific-atlantic-water-flow', name: "Pacific Atlantic Water Flow", topicKey: 'graphs', section: "BFS Applications", difficulty: 'Medium', pattern: "Reverse DFS/BFS", leetcode: 417, order: 29, tier: 'mastery' },
  { id: 'shortest-bridge', name: "Shortest Bridge", topicKey: 'graphs', section: "BFS Applications", difficulty: 'Medium', pattern: "DFS + BFS", leetcode: 934, order: 30, tier: 'mastery', bossFight: true },
  // ── Shortest Path Algorithms ──
  { id: 'shortest-path-in-dag', name: "Shortest Path in DAG", topicKey: 'graphs', section: "Shortest Path Algorithms", difficulty: 'Medium', pattern: "Topological Sort + Relaxation", leetcode: null, order: 30.5, tier: 'foundation' },
  {
  id: 'zero-one-bfs',
  name: "0-1 BFS",
  topicKey: 'graphs',
  section: "Shortest Path Algorithms",
  difficulty: 'Medium',
  pattern: "Deque BFS",
  leetcode: null,
  order: 30.6,
  tier:'foundation'
},

// NEW
{
  id: 'bellman-ford-algorithm',
  name: "Bellman Ford Algorithm",
  topicKey: 'graphs',
  section: "Shortest Path Algorithms",
  difficulty: 'Medium',
  pattern: "Edge Relaxation",
  leetcode: null,
  order: 30.7,
  tier:'foundation'
},
  { id: 'network-delay-time', name: "Network Delay Time", topicKey: 'graphs', section: "Shortest Path Algorithms", difficulty: 'Medium', pattern: "Dijkstra", leetcode: 743, order: 31, tier: 'foundation' },
  { id: 'cheapest-flights', name: "Cheapest Flights Within K Stops", topicKey: 'graphs', section: "Shortest Path Algorithms", difficulty: 'Medium', pattern: "Bellman Ford", leetcode: 787, order: 32, tier: 'foundation' },
  { id: 'evaluate-division', name: "Evaluate Division", topicKey: 'graphs', section: "Shortest Path Algorithms", difficulty: 'Medium', pattern: "Weighted Graph DFS", leetcode: 399, order: 33, tier: 'core' },
  { id: 'path-minimum-effort', name: "Path With Minimum Effort", topicKey: 'graphs', section: "Shortest Path Algorithms", difficulty: 'Medium', pattern: "Dijkstra", leetcode: 1631, order: 34, tier: 'core' },
  { id: 'swim-rising-water', name: "Swim in Rising Water", topicKey: 'graphs', section: "Shortest Path Algorithms", difficulty: 'Hard', pattern: "Dijkstra/Binary Search", leetcode: 778, order: 35, tier: 'mastery' },
  { id: 'floyd-warshall', name: "Floyd Warshall Algorithm", topicKey: 'graphs', section: "Shortest Path Algorithms", difficulty: 'Medium', pattern: "All Pair Shortest Path", leetcode: null, order: 36, tier: 'mastery', bossFight: true },
  // ── Minimum Spanning Tree ──
  { id: 'prim-algorithm', name: "Prim's Algorithm", topicKey: 'graphs', section: "Minimum Spanning Tree", difficulty: 'Medium', pattern: "MST", leetcode: null, order: 37, tier: 'foundation' },
  { id: 'kruskal-algorithm', name: "Kruskal's Algorithm", topicKey: 'graphs', section: "Minimum Spanning Tree", difficulty: 'Medium', pattern: "MST + DSU", leetcode: null, order: 38, tier: 'core' },
  { id: 'min-cost-connect-points', name: "Min Cost to Connect All Points", topicKey: 'graphs', section: "Minimum Spanning Tree", difficulty: 'Medium', pattern: "Prim's MST", leetcode: 1584, order: 39, tier: 'mastery' },
  { id: 'critical-mst-edges', name: "Critical and Pseudo-Critical Edges in MST", topicKey: 'graphs', section: "Minimum Spanning Tree", difficulty: 'Hard', pattern: "Kruskal MST", leetcode: 1489, order: 40, tier: 'mastery', bossFight: true },
  // ── Advanced Graph Algorithms ──
  {
  id: 'kosaraju-algorithm',
  name: "Kosaraju Algorithm",
  topicKey: 'graphs',
  section: "Advanced Graph Algorithms",
  difficulty: 'Hard',
  pattern: "Strongly Connected Components",
  leetcode: null,
  order: 40.5,
  tier: 'foundation'
},
  { id: 'reconstruct-itinerary', name: "Reconstruct Itinerary", topicKey: 'graphs', section: "Advanced Graph Algorithms", difficulty: 'Hard', pattern: "Eulerian Path", leetcode: 332, order: 41, tier: 'foundation' },
  { id: 'critical-connections', name: "Critical Connections in a Network", topicKey: 'graphs', section: "Advanced Graph Algorithms", difficulty: 'Hard', pattern: "Tarjan Bridges", leetcode: 1192, order: 42, tier: 'core' },
  { id: 'articulation-points', name: "Articulation Points", topicKey: 'graphs', section: "Advanced Graph Algorithms", difficulty: 'Hard', pattern: "Tarjan Algorithm", leetcode: null, order: 43, tier: 'mastery', bossFight: true },
  // ── Graph Capstone ──
  { id: 'word-ladder', name: "Word Ladder", topicKey: 'graphs', section: "Graph Capstone", difficulty: 'Hard', pattern: "BFS", leetcode: 127, order: 44, tier: 'mastery', bossFight: true },
  { id: 'word-ladder-ii', name: "Word Ladder II", topicKey: 'graphs', section: "Graph Capstone", difficulty: 'Hard', pattern: "BFS + Backtracking", leetcode: 126, order: 45, tier: 'mastery', bossFight: true },
  { id: 'shortest-path-visiting-all-nodes', name: "Shortest Path Visiting All Nodes", topicKey: 'graphs', section: "Graph Capstone", difficulty: 'Hard', pattern: "BFS + Bitmask", leetcode: 847, order: 46, tier: 'mastery', bossFight: true },
  { id: 'bus-routes', name: "Bus Routes", topicKey: 'graphs', section: "Graph Capstone", difficulty: 'Hard', pattern: "BFS", leetcode: 815, order: 47, tier: 'mastery', bossFight: true },
  // ══════════════════════════════════════════════════════
  // DYNAMIC PROGRAMMING
  // ══════════════════════════════════════════════════════
  // ── DP Foundations ──
  { id: 'fibonacci-number', name: "Fibonacci Number", topicKey: 'dp', section: "DP Foundations", difficulty: 'Easy', pattern: "Memoization + Tabulation", leetcode: 509, order: 1, tier: 'foundation' },
  { id: 'climbing-stairs', name: "Climbing Stairs", topicKey: 'dp', section: "DP Foundations", difficulty: 'Easy', pattern: "1D DP", leetcode: 70, order: 2, tier: 'core' },
  { id: 'min-cost-climbing-stairs', name: "Min Cost Climbing Stairs", topicKey: 'dp', section: "DP Foundations", difficulty: 'Easy', pattern: "1D DP", leetcode: 746, order: 3, tier: 'mastery', bossFight: true },
  // ── 1D DP Basics ──
  { id: 'house-robber', name: "House Robber", topicKey: 'dp', section: "1D DP Basics", difficulty: 'Medium', pattern: "Take / Not Take DP", leetcode: 198, order: 4, tier: 'foundation' },
  { id: 'decode-ways', name: "Decode Ways", topicKey: 'dp', section: "1D DP Basics", difficulty: 'Medium', pattern: "State DP", leetcode: 91, order: 5, tier: 'core' },
  { id: 'paint-house', name: "Paint House", topicKey: 'dp', section: "1D DP Basics", difficulty: 'Medium', pattern: "State Transition DP", leetcode: 256, order: 6, tier: 'core' },
  { id: 'delete-and-earn', name: "Delete and Earn", topicKey: 'dp', section: "1D DP Basics", difficulty: 'Medium', pattern: "Take / Not Take DP", leetcode: 740, order: 7, tier: 'mastery' },
  { id: 'house-robber-ii', name: "House Robber II", topicKey: 'dp', section: "1D DP Basics", difficulty: 'Medium', pattern: "Circular DP", leetcode: 213, order: 8, tier: 'mastery', bossFight: true },
  // ── LIS Pattern ──
  { id: 'longest-increasing-subsequence', name: "Longest Increasing Subsequence", topicKey: 'dp', section: "LIS Pattern", difficulty: 'Medium', pattern: "LIS DP", leetcode: 300, order: 9, tier: 'foundation' },
  { id: 'largest-divisible-subset', name: "Largest Divisible Subset", topicKey: 'dp', section: "LIS Pattern", difficulty: 'Medium', pattern: "LIS Variant", leetcode: 368, order: 10, tier: 'core' },
  { id: 'number-of-lis', name: "Number of Longest Increasing Subsequence", topicKey: 'dp', section: "LIS Pattern", difficulty: 'Medium', pattern: "LIS Counting", leetcode: 673, order: 11, tier: 'core' },
  { id: 'russian-doll-envelopes', name: "Russian Doll Envelopes", topicKey: 'dp', section: "LIS Pattern", difficulty: 'Hard', pattern: "LIS + Binary Search", leetcode: 354, order: 12, tier: 'mastery' },
  { id: 'minimum-removals-mountain-array', name: "Minimum Removals to Make Mountain Array", topicKey: 'dp', section: "LIS Pattern", difficulty: 'Hard', pattern: "LIS", leetcode: 1671, order: 13, tier: 'mastery', bossFight: true },
  // ── Stock DP ──
  { id: 'best-time-buy-sell-stock-iii', name: "Best Time to Buy and Sell Stock III", topicKey: 'dp', section: "Stock DP", difficulty: 'Hard', pattern: "State Machine DP", leetcode: 123, order: 14, tier: 'foundation' },
  { id: 'best-time-buy-sell-stock-iv', name: "Best Time to Buy and Sell Stock IV", topicKey: 'dp', section: "Stock DP", difficulty: 'Hard', pattern: "State Machine DP", leetcode: 188, order: 15, tier: 'core' },
  { id: 'best-time-buy-sell-stock-cooldown', name: "Best Time to Buy and Sell Stock with Cooldown", topicKey: 'dp', section: "Stock DP", difficulty: 'Medium', pattern: "State Machine DP", leetcode: 309, order: 16, tier: 'mastery' },
  { id: 'best-time-buy-sell-stock-fee', name: "Best Time to Buy and Sell Stock with Transaction Fee", topicKey: 'dp', section: "Stock DP", difficulty: 'Medium', pattern: "State Machine DP", leetcode: 714, order: 17, tier: 'mastery', bossFight: true },
  // ── Knapsack DP ──
  { id: 'partition-equal-subset-sum', name: "Partition Equal Subset Sum", topicKey: 'dp', section: "Knapsack DP", difficulty: 'Medium', pattern: "0/1 Knapsack", leetcode: 416, order: 18, tier: 'foundation' },
  { id: 'target-sum', name: "Target Sum", topicKey: 'dp', section: "Knapsack DP", difficulty: 'Medium', pattern: "0/1 Knapsack", leetcode: 494, order: 19, tier: 'foundation' },
  { id: 'ones-and-zeroes', name: "Ones and Zeroes", topicKey: 'dp', section: "Knapsack DP", difficulty: 'Medium', pattern: "2D Knapsack", leetcode: 474, order: 20, tier: 'core' },
  { id: 'coin-change', name: "Coin Change", topicKey: 'dp', section: "Knapsack DP", difficulty: 'Medium', pattern: "Unbounded Knapsack", leetcode: 322, order: 21, tier: 'core' },
  { id: 'coin-change-ii', name: "Coin Change II", topicKey: 'dp', section: "Knapsack DP", difficulty: 'Medium', pattern: "Unbounded Knapsack", leetcode: 518, order: 22, tier: 'mastery' },
  { id: 'perfect-squares', name: "Perfect Squares", topicKey: 'dp', section: "Knapsack DP", difficulty: 'Medium', pattern: "Unbounded Knapsack", leetcode: 279, order: 23, tier: 'mastery' },
  { id: 'combination-sum-iv', name: "Combination Sum IV", topicKey: 'dp', section: "Knapsack DP", difficulty: 'Medium', pattern: "Permutation DP", leetcode: 377, order: 24, tier: 'mastery', bossFight: true },
  // ── Grid DP ──
  { id: 'unique-paths', name: "Unique Paths", topicKey: 'dp', section: "Grid DP", difficulty: 'Medium', pattern: "Grid DP", leetcode: 62, order: 25, tier: 'foundation' },
  { id: 'unique-paths-ii', name: "Unique Paths II", topicKey: 'dp', section: "Grid DP", difficulty: 'Medium', pattern: "Grid DP", leetcode: 63, order: 26, tier: 'core' },
  { id: 'minimum-path-sum', name: "Minimum Path Sum", topicKey: 'dp', section: "Grid DP", difficulty: 'Medium', pattern: "Grid DP", leetcode: 64, order: 27, tier: 'core' },
  { id: 'triangle', name: "Triangle", topicKey: 'dp', section: "Grid DP", difficulty: 'Medium', pattern: "Grid DP", leetcode: 120, order: 28, tier: 'mastery' },
  { id: 'minimum-falling-path-sum', name: "Minimum Falling Path Sum", topicKey: 'dp', section: "Grid DP", difficulty: 'Medium', pattern: "Grid DP", leetcode: 931, order: 29, tier: 'mastery', bossFight: true },
  // ── Advanced Grid DP ──
  { id: 'maximal-square', name: "Maximal Square", topicKey: 'dp', section: "Advanced Grid DP", difficulty: 'Medium', pattern: "2D DP", leetcode: 221, order: 30, tier: 'foundation' },
  { id: 'count-square-submatrices', name: "Count Square Submatrices with All Ones", topicKey: 'dp', section: "Advanced Grid DP", difficulty: 'Medium', pattern: "2D DP", leetcode: 1277, order: 31, tier: 'core' },
  { id: 'dungeon-game', name: "Dungeon Game", topicKey: 'dp', section: "Advanced Grid DP", difficulty: 'Hard', pattern: "Reverse DP", leetcode: 174, order: 32, tier: 'mastery' },
  { id: 'cherry-pickup-ii', name: "Cherry Pickup II", topicKey: 'dp', section: "Advanced Grid DP", difficulty: 'Hard', pattern: "3D DP", leetcode: 1463, order: 33, tier: 'mastery', bossFight: true },
  // ── String DP ──
  { id: 'longest-common-subsequence', name: "Longest Common Subsequence", topicKey: 'dp', section: "String DP", difficulty: 'Medium', pattern: "2D DP", leetcode: 1143, order: 34, tier: 'foundation' },
  { id: 'edit-distance', name: "Edit Distance", topicKey: 'dp', section: "String DP", difficulty: 'Hard', pattern: "2D DP", leetcode: 72, order: 35, tier: 'foundation' },
  { id: 'distinct-subsequences', name: "Distinct Subsequences", topicKey: 'dp', section: "String DP", difficulty: 'Hard', pattern: "2D DP", leetcode: 115, order: 36, tier: 'core' },
  { id: 'longest-palindromic-subsequence', name: "Longest Palindromic Subsequence", topicKey: 'dp', section: "String DP", difficulty: 'Medium', pattern: "Palindrome DP", leetcode: 516, order: 37, tier: 'core' },
  { id: 'word-break', name: "Word Break", topicKey: 'dp', section: "String DP", difficulty: 'Medium', pattern: "DP + Hashing", leetcode: 139, order: 38, tier: 'core' },
  { id: 'interleaving-string', name: "Interleaving String", topicKey: 'dp', section: "String DP", difficulty: 'Medium', pattern: "2D DP", leetcode: 97, order: 39, tier: 'mastery' },
  { id: 'regular-expression-matching', name: "Regular Expression Matching", topicKey: 'dp', section: "String DP", difficulty: 'Hard', pattern: "Pattern Matching DP", leetcode: 10, order: 40, tier: 'mastery' },
  { id: 'wildcard-matching', name: "Wildcard Matching", topicKey: 'dp', section: "String DP", difficulty: 'Hard', pattern: "Pattern Matching DP", leetcode: 44, order: 41, tier: 'mastery', bossFight: true },
  // ── Interval DP ──
  { id: 'burst-balloons', name: "Burst Balloons", topicKey: 'dp', section: "Interval DP", difficulty: 'Hard', pattern: "Interval DP", leetcode: 312, order: 42, tier: 'foundation' },
  { id: 'minimum-cost-tree', name: "Minimum Cost Tree From Leaf Values", topicKey: 'dp', section: "Interval DP", difficulty: 'Medium', pattern: "Interval DP", leetcode: 1130, order: 43, tier: 'core' },
  { id: 'minimum-cost-cut-stick', name: "Minimum Cost to Cut a Stick", topicKey: 'dp', section: "Interval DP", difficulty: 'Hard', pattern: "Interval DP", leetcode: 1547, order: 44, tier: 'mastery' },
  { id: 'stone-game', name: "Stone Game", topicKey: 'dp', section: "Interval DP", difficulty: 'Medium', pattern: "Game DP", leetcode: 877, order: 45, tier: 'mastery', bossFight: true },
  // ── Advanced DP ──
  { id: 'super-egg-drop', name: "Super Egg Drop", topicKey: 'dp', section: "Advanced DP", difficulty: 'Hard', pattern: "DP + Binary Search", leetcode: 887, order: 46, tier: 'foundation' },
  { id: 'minimum-cost-connect-groups', name: "Minimum Cost to Connect Two Groups", topicKey: 'dp', section: "Advanced DP", difficulty: 'Hard', pattern: "Bitmask DP", leetcode: 1595, order: 47, tier: 'core' },
  { id: 'shortest-superstring', name: "Shortest Superstring", topicKey: 'dp', section: "Advanced DP", difficulty: 'Hard', pattern: "Bitmask DP", leetcode: 943, order: 48, tier: 'mastery' },
  { id: 'numbers-with-repeated-digits', name: "Numbers With Repeated Digits", topicKey: 'dp', section: "Advanced DP", difficulty: 'Hard', pattern: "Digit DP", leetcode: 1012, order: 49, tier: 'mastery', bossFight: true },
  // ── DP Capstone ──
  { id: 'maximum-subarray', name: "Maximum Subarray", topicKey: 'dp', section: "DP Capstone", difficulty: 'Medium', pattern: "Kadane DP", leetcode: 53, order: 50, tier: 'mastery', bossFight: true },
  { id: 'job-scheduling', name: "Maximum Profit Job Scheduling", topicKey: 'dp', section: "DP Capstone", difficulty: 'Hard', pattern: "DP + Binary Search", leetcode: 1235, order: 51, tier: 'mastery', bossFight: true },
  { id: 'burst-balloons-capstone', name: "Burst Balloons", topicKey: 'dp', section: "DP Capstone", difficulty: 'Hard', pattern: "Interval DP", leetcode: 312, order: 52, tier: 'mastery', bossFight: true },];

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

// getProblemsByTier — for any topic/section, returns its problems already
// split into { foundation, core, mastery } buckets plus a separate
// `bossFight` list, so the Roadmap UI can render the
// "Foundation -> Core -> Mastery -> Boss Fight" milestone structure directly
// instead of re-deriving it from raw order numbers. Now works for every
// topic, not just Arrays.
export function getProblemsByTier(topicKey, section) {
  const sectionProblems = getProblemsBySection(topicKey, section);
  const buckets = { foundation: [], core: [], mastery: [], bossFight: [] };
  for (const p of sectionProblems) {
    if (p.bossFight) buckets.bossFight.push(p);
    else if (p.tier && buckets[p.tier]) buckets[p.tier].push(p);
  }
  return buckets;
}