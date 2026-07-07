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
//
// A few sections deliberately contain ENFORCED-APPROACH DUPLICATE PAIRS from
// problems.js — the same LeetCode problem practiced once with
// `enforcedApproach: 'iterative'` and once with `enforcedApproach: 'recursive'`,
// because the two implementations build genuinely different intuition for
// that problem (not just "any recursive function could be rewritten
// iteratively"). Current pairs live in: Arrays > Binary Search (Binary
// Search itself), Linked Lists > Recursive Linked Lists (Reverse Linked List,
// Merge Two Sorted Lists), and Trees > DFS Traversals (Preorder, Inorder,
// Postorder). Their sectionInfo blurbs below call this out so the roadmap UI
// can explain why the same problem shows up twice.
export const topics = [
  {
    key: 'arrays',
    label: "Arrays",
    icon: "\ud83d\udce6",
    order: 1,
    seeded: true,
    sections: ["Basics", "Hashing", "Two Pointers", "Sliding Window", "Prefix Sum", "Binary Search", "Binary Search on Answer", "Sorting & Greedy", "Intervals", "Heaps", "2D Arrays", "Bit Manipulation", "Maths & Number Theory"],
    sectionInfo: {"Basics": "Traversal, searching, insertion, deletion, simulation.", "Hashing": "Frequency counting vs. hash lookup, sets, duplicate detection \u2014 the first true optimization technique.", "Two Pointers": "Opposite ends, same direction, partitioning.", "Sliding Window": "Fixed and variable windows \u2014 a natural extension of two pointers.", "Prefix Sum": "1D prefix sums, difference arrays, range queries \u2014 same family as sliding window.", "Binary Search": "Classic search (practiced both iteratively and recursively), search on rotated arrays, binary search + predicate, lower/upper bound.", "Binary Search on Answer": "Capacity problems, minimize the maximum, maximize the minimum.", "Sorting & Greedy": "Custom sorting, local/interval greedy, greedy after sorting.", "Heaps": "Top K, Kth element, merge K, streaming \u2014 requires comfort with ordering.", "2D Arrays": "Matrix traversal, spiral, rotation, simulation, prefix matrix, staircase/binary search on a matrix.", "Bit Manipulation": "Optional/advanced: XOR tricks, counting bits, bitmask ranges.", "Maths & Number Theory": "Optional/advanced: number theory, geometry, modular exponentiation, game theory."},
  },
  {
   
  key: 'strings',
  label: "Strings",
  icon: "🔥",
  order: 2,
  seeded: true,
  sections: [
    "Basics",
    "Hashing",
    "Two Pointers",
    "Sliding Window",
    "Parsing & Simulation",
    "Pattern Matching",
    "Backtracking",
    "Capstone"
  ],

  sectionInfo: {
    "Basics":
      "Character traversal, string manipulation, parsing fundamentals, simulation, formatting and building intuition for string operations.",

    "Hashing":
      "Character frequency counting, hash maps, anagrams, string mappings and lookup-based optimizations.",

    "Two Pointers":
      "Palindrome checking, subsequences, string comparison, compression and expand-around-center techniques.",

    "Sliding Window":
      "Fixed and variable windows, frequency maps, distinct character problems, minimum windows and rolling hash based optimizations.",

    "Parsing & Simulation":
      "Expression parsing, stacks, tokenization, formatting, serialization and complex string simulations.",

    "Pattern Matching":
      "Naive matching, KMP intuition, prefix-function problems and efficient substring searching algorithms.",

    "Backtracking":
      "DFS over characters and grids, recursive exploration and state-space search involving strings.",

    "Capstone":
      "Interview-level problems combining multiple patterns such as hashing, Trie, dynamic programming, parsing and advanced string manipulation."
  }

  },
  {
   key: 'stacks-queues',
  label: "Stacks & Queues",
  icon: "📚",
  order: 3,
  seeded: true,

  sections: [
    "Stack Basics",
    "Queue Basics",
    "Stack Simulation",
    "Expression Evaluation",
    "Greedy Parentheses",
    "Iterator / Design",
    "Monotonic Stack",
    "Monotonic Queue / Deque"
  ],
  sectionInfo: {

    "Stack Basics":
      "Learn push/pop operations, balanced parentheses, stack simulation, and stack design. Build intuition for recognizing stack problems.",

    "Queue Basics":
      "Understand FIFO processing through queue implementation, circular queues, and queue-based simulations—the foundation for BFS.",

    "Stack Simulation":
      "Use stacks to simulate nested structures, collisions, file paths, recursive processes, and parentheses transformations.",

    "Expression Evaluation":
      "Learn Reverse Polish Notation, arithmetic parsing, and calculator problems using stacks for expression evaluation.",

    "Greedy Parentheses":
      "Solve parentheses problems using greedy observations instead of explicit stack simulation.",

    "Iterator / Design":
      "Design custom iterators and lazy traversals where stacks support object-oriented problem solving.",

    "Monotonic Stack":
      "Master increasing/decreasing stacks for Next Greater Element, histogram problems, stock span, contribution counting, and greedy stack techniques.",

    "Monotonic Queue / Deque":
      "Advanced deque techniques for sliding-window optimization, maximum/minimum queries, and monotonic queue patterns."
  }

  },
  {
    key: 'recursion',
    label: "Recursion & Backtracking",
    icon: "\ud83d\udd04",
    order: 4,
    seeded: true,
    sections: [
  "Recursion Fundamentals",
  "Divide & Conquer",
  "Backtracking Fundamentals",
  "Grid & Constraint Backtracking",
  "Advanced Backtracking",
  "Capstone"
],

sectionInfo: {
  "Recursion Fundamentals":
    "Build recursive thinking: base case, recursive calls, recursion tree, divide problems into smaller subproblems, and simple recursive generation.",

  "Divide & Conquer":
    "Split a problem into independent subproblems, solve recursively, then combine results. Learn recursion beyond simple DFS.",

  "Backtracking Fundamentals":
    "Decision-tree recursion: choose, recurse, undo. Learn subsets, combinations, permutations, duplicate handling, pruning, and state-space exploration.",

  "Grid & Constraint Backtracking":
    "Apply backtracking under constraints using visited states, pruning, grids, buckets, and validity checks. Classic interview-style search problems.",

  "Advanced Backtracking":
    "Combine backtracking with advanced data structures and optimizations like Trie, memoization, game states, and state caching.",

  "Capstone":
    "Multi-pattern interview problems that combine recursion, backtracking, mathematics, combinatorics, design, or optimization into one solution."
},
  },
  {
    key: 'linked-lists',
    label: "Linked Lists",
    icon: "\ud83d\udd17",
    order: 5,
    seeded: true,
    sections: [
  "Singly Linked List Basics",
  "Two Pointer Patterns",
  "In-place Pointer Manipulation",
  "Recursive Linked Lists",
  "Doubly Linked Lists",
  "Sorting & Merging",
  "Linked List Design",
  "Circular Linked Lists"
],

sectionInfo: {
  "Singly Linked List Basics":
    "Build a strong foundation with traversal, insertion, deletion, dummy nodes, simulations, and fundamental singly linked list operations.",

  "Two Pointer Patterns":
    "Master fast & slow pointers, cycle detection, middle node, intersection, palindrome checks, and distance-based pointer techniques.",

  "In-place Pointer Manipulation":
    "Learn to reverse, reorder, swap, rotate, partition, split, and reconnect nodes by modifying pointers without using extra memory.",

  "Recursive Linked Lists":
    "Apply recursion to reverse and merge linked lists while understanding recursive pointer flow and recursive thinking.",

  "Doubly Linked Lists":
    "Work with previous pointers, multilevel lists, browser history, random pointers, and bidirectional traversal patterns.",

  "Sorting & Merging":
    "Solve interview problems involving merge sort, divide & conquer, merging multiple sorted lists, and linked-list-based sorting techniques.",

  "Linked List Design":
    "Design interview-class data structures by combining linked lists with hash maps, including LRU and LFU cache implementations.",

  "Circular Linked Lists":
    "Practice circular traversal, sorted insertion, fast & slow pointer techniques on circular lists, Josephus pattern, and classic circular linked list operations."
}
      },
  {
    key: 'trees',
    label: "Trees",
    icon: "\ud83c\udf32",
    order: 6,
    seeded: true,
    sections: [
  "Traversals",
  "Tree Fundamentals",
  "BFS",
  "DFS Path Problems",
  "Tree DP",
  "Tree Relationships",
  "Tree Views",
  "BST",
  "Tree Construction",
  "N-ary Trees",
  "Capstone"
],

sectionInfo: {
  "Traversals": "The foundation of tree problem solving. Learn recursive DFS, iterative stack-based traversals, two-stack and one-stack postorder, and advanced Morris traversal to understand different ways of walking a tree.",

  "Tree Fundamentals": "Build core tree intuition — height, depth, structure comparison, inversion, symmetry, subtree matching, balanced trees, and understanding recursion return values.",

  "BFS": "Master level-order thinking using queues. Covers level traversal, averages, right views, zigzag traversal, maximum width, and next-pointer problems.",

  "DFS Path Problems": "Learn how DFS solves path-based problems. Covers root-to-leaf paths, path sums, backtracking on trees, and maintaining state while traversing.",

  "Tree DP": "Advanced recursion patterns where child information is combined to solve larger problems. Includes diameter, maximum path sum, house robber, and state-based tree DP.",

  "Tree Relationships": "Problems involving relationships between nodes. Learn Lowest Common Ancestor, converting trees into graphs, and distance-based queries.",

  "Tree Views": "Understand how trees are viewed from different directions. Covers vertical traversal, boundary traversal, and coordinate-based tree representation.",

  "BST": "Master Binary Search Tree properties. Covers searching, insertion, deletion, validation, LCA, inorder-based problems, iterators, and advanced BST transformations.",

  "Tree Construction": "Learn how trees are rebuilt and represented. Covers constructing trees from traversals, flattening, serialization, and deserialization.",

  "N-ary Trees": "Extend binary tree concepts to trees with multiple children. Covers DFS, BFS, depth calculation, and traversal patterns.",

  "Capstone": "Interview-level tree problems combining multiple concepts such as serialization, recovery, tree DP, hashing, and advanced traversal patterns."
},
  },
  {
    key: 'graphs',
    label: "Graphs",
    icon: "\ud83d\udd78\ufe0f",
    order: 7,
    seeded: true,
    sections: [
  "Graph Fundamentals",
  "Grid Graphs",
  "Graph Traversal Patterns",
  "Topological Sort",
  "Union Find",
  "BFS Applications",
  "Shortest Path Algorithms",
  "Minimum Spanning Tree",
  "Advanced Graph Algorithms",
  "Graph Capstone"
],

sectionInfo: {
  "Graph Fundamentals": "Build the base of graph problem solving. Learn graph representation, adjacency lists, adjacency matrices, DFS, BFS, visited tracking, and connected components.",

  "Grid Graphs": "Learn how grids can be treated as graphs. Covers flood fill, island problems, boundary traversal, and connected components using DFS/BFS directions.",

  "Graph Traversal Patterns": "Master core graph traversal techniques. Covers cloning graphs, cycle detection, bipartite checking, and solving problems using DFS/BFS state tracking.",

  "Topological Sort": "Learn ordering problems on Directed Acyclic Graphs (DAGs). Covers Kahn's algorithm, DFS-based ordering, dependency resolution, course scheduling, and safe states.",

  "Union Find": "Master Disjoint Set Union (DSU) for connectivity problems. Covers union by rank, path compression, dynamic connections, and detecting redundant edges.",

  "BFS Applications": "Apply BFS beyond simple traversal. Covers multi-source BFS, shortest paths in unweighted graphs, reverse traversal, and spreading/expansion problems.",

  "Shortest Path Algorithms": "Learn algorithms for finding optimal paths. Covers Dijkstra, Bellman-Ford, Floyd-Warshall, weighted graphs, and priority queue based traversal.",

  "Minimum Spanning Tree": "Understand connecting all nodes with minimum cost. Covers Prim's algorithm, Kruskal's algorithm, and DSU-based MST construction.",

  "Advanced Graph Algorithms": "Interview-level graph algorithms. Covers Eulerian paths, Tarjan's bridge finding, articulation points, and advanced connectivity patterns.",

  "Graph Capstone": "Combine multiple graph patterns into complex interview problems. Includes advanced BFS, graph modeling, bitmask BFS, and multi-concept challenges."
},
  },
  {
    key: 'dp',
    label: "Dynamic Programming",
    icon: "\ud83e\udde9",
    order: 8,
    seeded: true,
    sections: [
  "DP Foundations",
  "1D DP Basics",
  "LIS Pattern",
  "Stock DP",
  "Knapsack DP",
  "Grid DP",
  "Advanced Grid DP",
  "String DP",
  "Interval DP",
  "Advanced DP",
  "DP Capstone"
],

sectionInfo: {
  "DP Foundations": 
    "Introduction to dynamic programming: recursion to memoization, tabulation, identifying states, transitions, and basic recurrence patterns using Fibonacci-style problems.",

  "1D DP Basics": 
    "Core one-dimensional DP patterns: take/not-take decisions, state transitions, circular DP, and solving problems by building optimal previous states.",

  "LIS Pattern": 
    "Subsequence-based dynamic programming: longest increasing subsequence, LIS variations, counting subsequences, and optimization using binary search.",

  "Stock DP": 
    "State machine dynamic programming: modeling buy, sell, cooldown, and transaction limits using changing states.",

  "Knapsack DP": 
    "Classic selection-based DP: 0/1 knapsack, unbounded knapsack, subset formation, target sums, and resource allocation problems.",

  "Grid DP": 
    "Dynamic programming on matrices: path counting, minimum cost paths, obstacle handling, and movement-based state transitions.",

  "Advanced Grid DP": 
    "Complex matrix DP problems involving multiple dimensions, reverse states, 3D DP, and DFS memoization.",

  "String DP": 
    "Dynamic programming on strings: LCS, edit distance, palindrome problems, pattern matching, and string transformation techniques.",

  "Interval DP": 
    "Range-based dynamic programming: splitting intervals, optimal partitioning, game theory, and solving problems by choosing boundaries.",

  "Advanced DP": 
    "Advanced optimization techniques including bitmask DP, digit DP, binary search optimization, and complex state compression problems.",

  "DP Capstone": 
    "Interview-level DP problems combining multiple patterns, requiring advanced state design, optimization, and mixed DP techniques."
}  
  },
];

export function getTopic(key) {
  return topics.find((t) => t.key === key);
}

export function getTopicsInOrder() {
  return [...topics].sort((a, b) => a.order - b.order);
}