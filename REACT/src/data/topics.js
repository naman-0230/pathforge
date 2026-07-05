// topics.js — the master list of the 8 topics, ordered by minimum cognitive
// load / prerequisite dependency (see the roadmap-ordering discussion this was
// built from):
//
//   1. Arrays   — iteration, complexity, brute force -> optimization thinking.
//                 Broadest topic: also owns Hashing, Two Pointers, Sliding
//                 Window, Prefix Sum, Binary Search (+ on Answer), Sorting &
//                 Greedy, Heaps, 2D Arrays, and optional Bit Manipulation /
//                 Maths as sections — nearly everything later reuses these.
//   2. Strings  — specialized arrays; reuses two pointers/sliding window/
//                 hashing rather than teaching a new data structure.
//   3. Stacks & Queues — first abstract data structure; placed before
//                 recursion on purpose (an explicit stack demystifies the
//                 recursive call stack later).
//   4. Recursion & Backtracking — now easy, since stack frames are already
//                 familiar. Prepares directly for Trees.
//   5. Linked Lists — placed after recursion (not before, unlike most
//                 roadmaps) so recursive pointer manipulation clicks alongside
//                 the iterative approach.
//   6. Trees    — nearly every traversal is recursive; belongs right after
//                 Recursion & Linked Lists. Owns Tries as 'Advanced Trees'.
//   7. Graphs   — trees + cycles + disconnected components; DFS/BFS/queues/
//                 recursion are all already in place.
//   8. Dynamic Programming — always last; borrows from every topic above.
//
// Each topic also lists its `sections` in learning order — the middle level of
// the Topic -> Section -> Pattern hierarchy used in problems.js. `sectionInfo`
// gives a one-line blurb per section for the roadmap UI.
export const topics = [
  {
    key: 'arrays',
    label: "Arrays",
    icon: "\ud83d\udce6",
    order: 1,
    seeded: true,
    sections: ["Basics", "Hashing", "Two Pointers", "Sliding Window", "Prefix Sum", "Binary Search", "Binary Search on Answer", "Sorting & Greedy", "Heaps", "2D Arrays", "Bit Manipulation", "Maths & Number Theory"],
    sectionInfo: {"Basics": "Traversal, searching, insertion, deletion, simulation.", "Hashing": "Frequency counting, maps, sets, duplicate detection \u2014 the first true optimization technique.", "Two Pointers": "Opposite ends, same direction, partitioning.", "Sliding Window": "Fixed and variable windows \u2014 a natural extension of two pointers.", "Prefix Sum": "1D prefix sums, difference arrays, range queries \u2014 same family as sliding window.", "Binary Search": "Classic search, lower/upper bound, search space reduction.", "Binary Search on Answer": "Capacity problems, minimize the maximum, maximize the minimum.", "Sorting & Greedy": "Custom sorting, greedy after sorting, intervals, merging, sweeping.", "Heaps": "Top K, Kth element, merge K, streaming \u2014 requires comfort with ordering.", "2D Arrays": "Matrix traversal, spiral, rotation, simulation, prefix matrix.", "Bit Manipulation": "Optional/advanced: XOR tricks, counting bits, bitmask ranges.", "Maths & Number Theory": "Optional/advanced: number theory, geometry, modular exponentiation, game theory."},
  },
  {
    key: 'strings',
    label: "Strings",
    icon: "\ud83d\udd24",
    order: 2,
    seeded: true,
    sections: ["Basics", "Hashing", "Two Pointers", "Sliding Window", "Advanced"],
    sectionInfo: {"Basics": "Manipulation, ASCII, character arrays, palindrome basics.", "Hashing": "Frequency, anagrams, grouping, character counts.", "Two Pointers": "Palindrome checks, reverse words, compression.", "Sliding Window": "Longest substring, minimum window, permutation, find anagrams \u2014 easy once frequency maps are mastered.", "Advanced": "Optional: KMP-style pattern matching and related string algorithms."},
  },
  {
    key: 'stacks-queues',
    label: "Stacks & Queues",
    icon: "\ud83d\udcda",
    order: 3,
    seeded: true,
    sections: ["Stack Basics", "Queue Basics", "Stack Applications", "Monotonic Stack", "Monotonic Queue / Deque"],
    sectionInfo: {"Stack Basics": "Next greater (simple), balanced parentheses, undo, simulation.", "Queue Basics": "Circular queue, deque, BFS introduction.", "Stack Applications": "Expression evaluation, RPN, calculator, infix/postfix.", "Monotonic Stack": "Next greater, daily temperatures, histogram, rain water, stock span.", "Monotonic Queue / Deque": "Optional: sliding window maximum \u2014 a rarer interview pattern."},
  },
  {
    key: 'recursion',
    label: "Recursion & Backtracking",
    icon: "\ud83d\udd04",
    order: 4,
    seeded: true,
    sections: ["Recursion Fundamentals", "Divide and Conquer", "Backtracking Fundamentals", "Constraint Backtracking"],
    sectionInfo: {"Recursion Fundamentals": "Call stack, base case, recurrence, tree visualization.", "Divide and Conquer": "Recursion beyond \"choose / not choose\".", "Backtracking Fundamentals": "Subsets, permutations, combination sum.", "Constraint Backtracking": "N-Queens, Sudoku, word search, graph coloring."},
  },
  {
    key: 'linked-lists',
    label: "Linked Lists",
    icon: "\ud83d\udd17",
    order: 5,
    seeded: true,
    sections: ["Basics", "Pointer Patterns", "In-place Manipulation", "Recursive Linked Lists", "Advanced"],
    sectionInfo: {"Basics": "Construction, traversal, insertion, deletion, dummy node.", "Pointer Patterns": "Fast/slow, middle, cycle, intersection.", "In-place Manipulation": "Reverse, reverse K, swap, partition, reorder.", "Recursive Linked Lists": "Reverse, merge, and delete recursively \u2014 deeper intuition beyond the iterative approach.", "Advanced": "Random pointer, flatten, LRU/LFU cache, multi-level lists."},
  },
  {
    key: 'trees',
    label: "Trees",
    icon: "\ud83c\udf32",
    order: 6,
    seeded: true,
    sections: ["Foundations", "DFS Traversals", "BFS", "DFS Problem Solving", "BST", "Tree Construction", "Advanced Trees"],
    sectionInfo: {"Foundations": "Terminology, representation, recursive traversal.", "DFS Traversals": "Pre, in, post, iterative, Morris traversal.", "BFS": "Level order, views, width, zigzag.", "DFS Problem Solving": "Diameter, balanced, LCA, path sum, maximum path, ancestor problems.", "BST": "Insert, delete, search, validation, iterator, Kth smallest.", "Tree Construction": "Build tree, serialize, deserialize, flatten.", "Advanced Trees": "Optional: tries, and related prefix-tree structures."},
  },
  {
    key: 'graphs',
    label: "Graphs",
    icon: "\ud83d\udd78\ufe0f",
    order: 7,
    seeded: true,
    sections: ["Graph Basics", "Traversal Applications", "Shortest Paths", "MST", "Advanced"],
    sectionInfo: {"Graph Basics": "Representation, DFS, BFS, connected components, flood fill.", "Traversal Applications": "Cycle detection, bipartite check, topological sort, course schedule.", "Shortest Paths": "Multi-source BFS, Dijkstra, 0-1 BFS, Bellman-Ford.", "MST": "Prim's, Kruskal's, Union-Find.", "Advanced": "SCC, bridges, articulation points, Euler path, network flow."},
  },
  {
    key: 'dp',
    label: "Dynamic Programming",
    icon: "\ud83e\udde9",
    order: 8,
    seeded: true,
    sections: ["DP Fundamentals", "Linear DP", "Knapsack Family", "Grid DP", "String DP", "Interval DP", "Tree DP", "Advanced DP (Optional)"],
    sectionInfo: {"DP Fundamentals": "Memoization, tabulation, space optimization, state design.", "Linear DP": "Fibonacci, climbing stairs, house robber, decode ways.", "Knapsack Family": "0/1, unbounded, coin change, target sum, partition, subset sum.", "Grid DP": "Unique paths, minimum path, cherry pickup, dungeon game.", "String DP": "LCS, edit distance, palindrome DP, distinct subsequences, interleaving string.", "Interval DP": "Burst balloons, matrix chain, palindrome partitioning.", "Tree DP": "House Robber III, maximum independent set, diameter variants.", "Advanced DP (Optional)": "Bitmask DP (traveling salesman, assignment, subset DP) and digit DP."},
  },
];

export function getTopic(key) {
  return topics.find((t) => t.key === key);
}

export function getTopicsInOrder() {
  return [...topics].sort((a, b) => a.order - b.order);
}