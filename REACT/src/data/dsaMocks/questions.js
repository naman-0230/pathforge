// dsaMocks/questions.js — seed question bank for DSA Mock Tests.
//
// QUESTION SHAPE:
//   id            unique string ('dsa-<topic>-<section>-<n>')
//   category      topic key from topics.js ('arrays', 'trees', etc.)
//   subcategory   section slug (slugified section name from topics.js)
//   difficulty    'easy' | 'medium' | 'hard'
//   goalModes     array of ['interview' | 'viva' | 'general']
//   type          'complexity' | 'behavior' | 'output' | 'trace' | 'concept'
//   question      the prompt
//   codeSnippet   OPTIONAL — code to show above the question
//   language      OPTIONAL — required if codeSnippet present (for syntax highlighting)
//   options       array of 4 answer strings
//   correctIndex  0-3 index into options
//   explanation   why the answer is correct
//
// GROWTH:
//   Seed with ~150 questions across all 8 topics. Sections have 3-5
//   questions each. To add more, just append to DSA_MOCK_QUESTIONS.

// ============================================================
// CATEGORIES (topics from your topics.js)
// ============================================================

export const DSA_MOCK_CATEGORIES = {
  'arrays':       { key: 'arrays', label: 'Arrays', icon: '📦', shortLabel: 'Arrays' },
  'strings':      { key: 'strings', label: 'Strings', icon: '🔥', shortLabel: 'Strings' },
  'stacks-queues': { key: 'stacks-queues', label: 'Stacks & Queues', icon: '📚', shortLabel: 'Stacks/Q' },
  'recursion':    { key: 'recursion', label: 'Recursion & Backtracking', icon: '🔄', shortLabel: 'Recursion' },
  'linked-lists': { key: 'linked-lists', label: 'Linked Lists', icon: '🔗', shortLabel: 'LinkedList' },
  'trees':        { key: 'trees', label: 'Trees', icon: '🌲', shortLabel: 'Trees' },
  'graphs':       { key: 'graphs', label: 'Graphs', icon: '🕸️', shortLabel: 'Graphs' },
  'dp':           { key: 'dp', label: 'Dynamic Programming', icon: '🧩', shortLabel: 'DP' },
};

// SECTIONS — slugs match slugify() of section names in topics.js so
// deep-links to /fundamentals/:topicKey#section-slug work.
export const DSA_MOCK_SECTIONS = {
  arrays: [
    { slug: 'basics', label: 'Basics' },
    { slug: 'hashing', label: 'Hashing' },
    { slug: 'two-pointers', label: 'Two Pointers' },
    { slug: 'sliding-window', label: 'Sliding Window' },
    { slug: 'prefix-sum', label: 'Prefix Sum' },
    { slug: 'binary-search', label: 'Binary Search' },
    { slug: 'sorting-greedy', label: 'Sorting & Greedy' },
    { slug: 'heaps', label: 'Heaps' },
  ],
  strings: [
    { slug: 'basics', label: 'Basics' },
    { slug: 'hashing', label: 'Hashing' },
    { slug: 'two-pointers', label: 'Two Pointers' },
    { slug: 'sliding-window', label: 'Sliding Window' },
    { slug: 'pattern-matching', label: 'Pattern Matching' },
  ],
  'stacks-queues': [
    { slug: 'stack-basics', label: 'Stack Basics' },
    { slug: 'queue-basics', label: 'Queue Basics' },
    { slug: 'expression-evaluation', label: 'Expression Evaluation' },
    { slug: 'monotonic-stack', label: 'Monotonic Stack' },
    { slug: 'monotonic-queue-deque', label: 'Monotonic Queue / Deque' },
  ],
  recursion: [
    { slug: 'recursion-fundamentals', label: 'Recursion Fundamentals' },
    { slug: 'divide-conquer', label: 'Divide & Conquer' },
    { slug: 'backtracking-fundamentals', label: 'Backtracking Fundamentals' },
    { slug: 'grid-constraint-backtracking', label: 'Grid & Constraint Backtracking' },
  ],
  'linked-lists': [
    { slug: 'singly-linked-list-basics', label: 'Singly Linked List Basics' },
    { slug: 'two-pointer-patterns', label: 'Two Pointer Patterns' },
    { slug: 'in-place-pointer-manipulation', label: 'In-place Pointer Manipulation' },
    { slug: 'doubly-linked-lists', label: 'Doubly Linked Lists' },
    { slug: 'linked-list-design', label: 'Linked List Design' },
  ],
  trees: [
    { slug: 'traversals', label: 'Traversals' },
    { slug: 'tree-fundamentals', label: 'Tree Fundamentals' },
    { slug: 'bfs', label: 'BFS' },
    { slug: 'dfs-path-problems', label: 'DFS Path Problems' },
    { slug: 'bst', label: 'BST' },
    { slug: 'tree-construction', label: 'Tree Construction' },
  ],
  graphs: [
    { slug: 'graph-fundamentals', label: 'Graph Fundamentals' },
    { slug: 'grid-graphs', label: 'Grid Graphs' },
    { slug: 'topological-sort', label: 'Topological Sort' },
    { slug: 'union-find', label: 'Union Find' },
    { slug: 'bfs-applications', label: 'BFS Applications' },
    { slug: 'shortest-path-algorithms', label: 'Shortest Path Algorithms' },
    { slug: 'minimum-spanning-tree', label: 'Minimum Spanning Tree' },
  ],
  dp: [
    { slug: 'dp-foundations', label: 'DP Foundations' },
    { slug: '1d-dp-basics', label: '1D DP Basics' },
    { slug: 'lis-pattern', label: 'LIS Pattern' },
    { slug: 'knapsack-dp', label: 'Knapsack DP' },
    { slug: 'grid-dp', label: 'Grid DP' },
    { slug: 'string-dp', label: 'String DP' },
    { slug: 'interval-dp', label: 'Interval DP' },
  ],
};

// ============================================================
// QUESTION BANK — ~150 questions
// ============================================================

export const DSA_MOCK_QUESTIONS = [
  // ══════════════════════════════════════════════════════════
  // ARRAYS
  // ══════════════════════════════════════════════════════════

  // Arrays > Basics
  {
    id: 'dsa-arr-basics-1', category: 'arrays', subcategory: 'basics',
    difficulty: 'easy', goalModes: ['interview', 'viva'], type: 'concept',
    question: 'What is the time complexity of accessing an element at index i in an array?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correctIndex: 0,
    explanation: 'Arrays support constant-time random access because element addresses are computed directly from the base address + i × element_size.',
  },
  {
    id: 'dsa-arr-basics-2', category: 'arrays', subcategory: 'basics',
    difficulty: 'easy', goalModes: ['viva'], type: 'concept',
    question: 'Which of these is a limitation of a static array (fixed-size)?',
    options: [
      'Cannot access elements by index',
      'Size cannot be changed after allocation',
      'Cannot store objects',
      'Elements must be sorted',
    ],
    correctIndex: 1,
    explanation: 'Static arrays are allocated with a fixed size at declaration and cannot grow or shrink. Dynamic arrays (like vector/ArrayList) handle resizing internally.',
  },
  {
    id: 'dsa-arr-basics-3', category: 'arrays', subcategory: 'basics',
    difficulty: 'medium', goalModes: ['interview'], type: 'complexity',
    codeSnippet: `for (int i = 0; i < n; i++) {
  for (int j = 0; j < n; j++) {
    arr[i][j] = i + j;
  }
}`,
    language: 'cpp',
    question: 'What is the time complexity of the above code?',
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'],
    correctIndex: 2,
    explanation: 'Two nested loops each running n times = O(n × n) = O(n²).',
  },
  {
    id: 'dsa-arr-basics-4', category: 'arrays', subcategory: 'basics',
    difficulty: 'medium', goalModes: ['interview', 'viva'], type: 'complexity',
    question: 'What is the amortized time complexity of appending to a dynamic array (like Python list or Java ArrayList)?',
    options: ['O(1) amortized', 'O(log n)', 'O(n)', 'O(n log n)'],
    correctIndex: 0,
    explanation: 'Dynamic arrays double capacity when full. Most appends are O(1); occasional resize is O(n). Averaged over many operations, this is O(1) amortized.',
  },

  // Arrays > Hashing
  {
    id: 'dsa-arr-hash-1', category: 'arrays', subcategory: 'hashing',
    difficulty: 'easy', goalModes: ['interview', 'viva'], type: 'concept',
    question: 'What is the average-case time complexity of insert/lookup in a hash table?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correctIndex: 0,
    explanation: 'Hash tables provide O(1) average-case insert and lookup. Worst case is O(n) with heavy collisions, but a good hash function makes this rare.',
  },
  {
    id: 'dsa-arr-hash-2', category: 'arrays', subcategory: 'hashing',
    difficulty: 'medium', goalModes: ['interview'], type: 'behavior',
    question: 'What is the worst-case time complexity of a hash table operation?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    correctIndex: 2,
    explanation: 'If all keys hash to the same bucket (worst case), operations degrade to O(n) since the entire chain must be traversed.',
  },
  {
    id: 'dsa-arr-hash-3', category: 'arrays', subcategory: 'hashing',
    difficulty: 'medium', goalModes: ['interview', 'viva'], type: 'concept',
    question: 'Which technique is used to handle hash collisions?',
    options: [
      'Binary search',
      'Chaining or open addressing',
      'Sorting the keys',
      'Recursion',
    ],
    correctIndex: 1,
    explanation: 'Two main strategies: chaining (linked list at each bucket) or open addressing (linear/quadratic probing to find next slot).',
  },
  {
    id: 'dsa-arr-hash-4', category: 'arrays', subcategory: 'hashing',
    difficulty: 'hard', goalModes: ['interview'], type: 'complexity',
    codeSnippet: `unordered_map<int, int> mp;
for (int i = 0; i < n; i++) {
  if (mp.count(target - arr[i])) return true;
  mp[arr[i]] = i;
}
return false;`,
    language: 'cpp',
    question: 'What is the time complexity of the above Two Sum solution?',
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
    correctIndex: 0,
    explanation: 'Single pass through the array (n iterations) with O(1) average hash operations per iteration = O(n).',
  },

  // Arrays > Two Pointers
  {
    id: 'dsa-arr-tp-1', category: 'arrays', subcategory: 'two-pointers',
    difficulty: 'easy', goalModes: ['interview', 'viva'], type: 'concept',
    question: 'When is the two-pointer technique most useful?',
    options: [
      'On unsorted arrays with unique elements',
      'On sorted arrays or when searching for pairs with a specific property',
      'Only for linked lists',
      'When memory is unlimited',
    ],
    correctIndex: 1,
    explanation: 'Two pointers excel on sorted arrays (for pair-sum, palindrome checking, etc.) or when partitioning based on a condition.',
  },
  {
    id: 'dsa-arr-tp-2', category: 'arrays', subcategory: 'two-pointers',
    difficulty: 'medium', goalModes: ['interview'], type: 'complexity',
    question: 'What is the time complexity of the two-pointer approach for finding a pair with a given sum in a sorted array?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    correctIndex: 2,
    explanation: 'Each element is visited at most once by either pointer. Total work = O(n).',
  },
  {
    id: 'dsa-arr-tp-3', category: 'arrays', subcategory: 'two-pointers',
    difficulty: 'hard', goalModes: ['interview'], type: 'output',
    codeSnippet: `int arr[] = {1, 2, 3, 4, 5};
int l = 0, r = 4, sum = 0;
while (l < r) {
  sum += arr[l] + arr[r];
  l++; r--;
}
cout << sum;`,
    language: 'cpp',
    question: 'What is the output?',
    options: ['12', '15', '10', '6'],
    correctIndex: 0,
    explanation: 'Iteration 1: sum = 1+5 = 6. Iteration 2: sum = 6+2+4 = 12. Loop exits when l=2, r=2. Middle element skipped.',
  },

  // Arrays > Sliding Window
  {
    id: 'dsa-arr-sw-1', category: 'arrays', subcategory: 'sliding-window',
    difficulty: 'medium', goalModes: ['interview', 'viva'], type: 'concept',
    question: 'What is the key advantage of sliding window over brute-force iteration?',
    options: [
      'It uses less memory',
      'It avoids redundant recomputation by reusing previous window results',
      'It only works on sorted arrays',
      'It uses recursion',
    ],
    correctIndex: 1,
    explanation: 'Sliding window incrementally updates the window state (add new, remove old) in O(1), reducing total time from O(n·k) to O(n).',
  },
  {
    id: 'dsa-arr-sw-2', category: 'arrays', subcategory: 'sliding-window',
    difficulty: 'medium', goalModes: ['interview'], type: 'complexity',
    question: 'What is the time complexity of finding the maximum sum subarray of size k using sliding window?',
    options: ['O(n·k)', 'O(n)', 'O(n log n)', 'O(k²)'],
    correctIndex: 1,
    explanation: 'Sliding window computes each new sum in O(1) by adding the new element and subtracting the removed one. Total = O(n).',
  },
  {
    id: 'dsa-arr-sw-3', category: 'arrays', subcategory: 'sliding-window',
    difficulty: 'hard', goalModes: ['interview'], type: 'behavior',
    question: 'Variable-size sliding window is best used when:',
    options: [
      'The window size is always fixed',
      'You need to find the longest/shortest subarray meeting a condition',
      'The array is unsorted',
      'You need to sort the array',
    ],
    correctIndex: 1,
    explanation: 'Variable-size windows shrink or expand based on a condition being satisfied — ideal for "longest with sum ≤ K" or "shortest with sum ≥ K" problems.',
  },

  // Arrays > Prefix Sum
  {
    id: 'dsa-arr-ps-1', category: 'arrays', subcategory: 'prefix-sum',
    difficulty: 'easy', goalModes: ['interview', 'viva'], type: 'concept',
    question: 'What is the main benefit of computing prefix sums?',
    options: [
      'O(1) range sum queries after O(n) preprocessing',
      'Reduces space complexity',
      'Works only on sorted arrays',
      'Enables in-place sorting',
    ],
    correctIndex: 0,
    explanation: 'After building prefix[i] = arr[0] + ... + arr[i] in O(n), any range sum arr[l..r] = prefix[r] - prefix[l-1] in O(1).',
  },
  {
    id: 'dsa-arr-ps-2', category: 'arrays', subcategory: 'prefix-sum',
    difficulty: 'medium', goalModes: ['interview'], type: 'complexity',
    question: 'What is Kadane\'s algorithm time complexity for maximum subarray sum?',
    options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n²)'],
    correctIndex: 1,
    explanation: 'Kadane\'s algorithm makes a single pass, maintaining running sum and resetting when negative. O(n) time, O(1) space.',
  },

  // Arrays > Binary Search
  {
    id: 'dsa-arr-bs-1', category: 'arrays', subcategory: 'binary-search',
    difficulty: 'easy', goalModes: ['interview', 'viva'], type: 'concept',
    question: 'What is the prerequisite for using binary search?',
    options: [
      'Array must be sorted',
      'Array must be unique',
      'Array must be a power of 2',
      'Array must have negative numbers',
    ],
    correctIndex: 0,
    explanation: 'Binary search relies on the sorted property to eliminate half the search space each iteration.',
  },
  {
    id: 'dsa-arr-bs-2', category: 'arrays', subcategory: 'binary-search',
    difficulty: 'easy', goalModes: ['interview', 'viva'], type: 'complexity',
    question: 'What is the time complexity of binary search?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correctIndex: 1,
    explanation: 'Each iteration halves the search space, resulting in log₂(n) iterations.',
  },
  {
    id: 'dsa-arr-bs-3', category: 'arrays', subcategory: 'binary-search',
    difficulty: 'medium', goalModes: ['interview'], type: 'behavior',
    question: 'In `mid = (low + high) / 2`, what problem can occur for large values?',
    options: [
      'Division by zero',
      'Integer overflow',
      'Infinite loop',
      'Stack overflow',
    ],
    correctIndex: 1,
    explanation: 'If low + high exceeds INT_MAX, it overflows. Safer: mid = low + (high - low) / 2.',
  },
  {
    id: 'dsa-arr-bs-4', category: 'arrays', subcategory: 'binary-search',
    difficulty: 'hard', goalModes: ['interview'], type: 'trace',
    codeSnippet: `int arr[] = {1, 3, 5, 7, 9, 11};
// Binary search for target = 7
int lo = 0, hi = 5;`,
    language: 'cpp',
    question: 'After the first iteration of binary search for target 7, what are lo and hi?',
    options: ['lo=0, hi=2', 'lo=3, hi=5', 'lo=2, hi=5', 'lo=3, hi=4'],
    correctIndex: 1,
    explanation: 'mid = (0+5)/2 = 2. arr[2] = 5 < 7, so lo = mid + 1 = 3. hi stays 5.',
  },

  // Arrays > Sorting & Greedy
  {
    id: 'dsa-arr-sg-1', category: 'arrays', subcategory: 'sorting-greedy',
    difficulty: 'easy', goalModes: ['viva'], type: 'concept',
    question: 'What is the best-case time complexity of Quicksort?',
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
    correctIndex: 1,
    explanation: 'Best case: pivot always splits array evenly, giving log n depth × n work per level = O(n log n).',
  },
  {
    id: 'dsa-arr-sg-2', category: 'arrays', subcategory: 'sorting-greedy',
    difficulty: 'medium', goalModes: ['interview', 'viva'], type: 'behavior',
    question: 'What is the worst-case time complexity of Quicksort?',
    options: ['O(n log n)', 'O(n²)', 'O(n)', 'O(2ⁿ)'],
    correctIndex: 1,
    explanation: 'When pivot is always the smallest or largest element (e.g. sorted array with first-element pivot), recursion depth = n, giving O(n²).',
  },
  {
    id: 'dsa-arr-sg-3', category: 'arrays', subcategory: 'sorting-greedy',
    difficulty: 'medium', goalModes: ['interview'], type: 'concept',
    question: 'Which sorting algorithm is guaranteed O(n log n) in the worst case AND stable?',
    options: ['Quicksort', 'Heapsort', 'Merge sort', 'Selection sort'],
    correctIndex: 2,
    explanation: 'Merge sort is O(n log n) worst case AND stable (preserves order of equal elements). Heapsort is O(n log n) but not stable.',
  },
  {
    id: 'dsa-arr-sg-4', category: 'arrays', subcategory: 'sorting-greedy',
    difficulty: 'medium', goalModes: ['viva'], type: 'concept',
    question: 'A "stable" sorting algorithm means:',
    options: [
      'It uses no extra memory',
      'It doesn\'t crash',
      'Equal elements retain their relative order after sorting',
      'It works on any data type',
    ],
    correctIndex: 2,
    explanation: 'Stability matters when sorting by multiple keys — e.g. sorting by grade after sorting by name preserves alphabetic order within same grade.',
  },
  {
    id: 'dsa-arr-sg-5', category: 'arrays', subcategory: 'sorting-greedy',
    difficulty: 'hard', goalModes: ['interview'], type: 'concept',
    question: 'A greedy algorithm always produces the optimal solution when the problem has:',
    options: [
      'Overlapping subproblems',
      'Optimal substructure and greedy choice property',
      'A recursive definition',
      'Sorted input',
    ],
    correctIndex: 1,
    explanation: 'Greedy works when locally optimal choice + optimal substructure lead to a globally optimal solution. Otherwise, DP is needed.',
  },

  // Arrays > Heaps
  {
    id: 'dsa-arr-heap-1', category: 'arrays', subcategory: 'heaps',
    difficulty: 'easy', goalModes: ['interview', 'viva'], type: 'concept',
    question: 'What is the time complexity of extracting the minimum from a min-heap?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correctIndex: 1,
    explanation: 'Peek is O(1), but removing the min requires re-heapifying which is O(log n) due to tree height.',
  },
  {
    id: 'dsa-arr-heap-2', category: 'arrays', subcategory: 'heaps',
    difficulty: 'medium', goalModes: ['interview'], type: 'complexity',
    question: 'What is the time complexity to build a heap from an unsorted array of n elements?',
    options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(n²)'],
    correctIndex: 0,
    explanation: 'Building a heap bottom-up (heapify from n/2 down to 0) is O(n) due to the amortized cost of sifting elements at lower levels.',
  },
  {
    id: 'dsa-arr-heap-3', category: 'arrays', subcategory: 'heaps',
    difficulty: 'medium', goalModes: ['interview', 'viva'], type: 'concept',
    question: 'To find the K largest elements in an array of size n, which is optimal?',
    options: [
      'Sort the array — O(n log n)',
      'Use a min-heap of size K — O(n log K)',
      'Two loops — O(n²)',
      'Recursion — O(2ⁿ)',
    ],
    correctIndex: 1,
    explanation: 'Maintain a min-heap of size K; for each element, if larger than heap min, pop and push. O(n log K), better than O(n log n) when K << n.',
  },

  // ══════════════════════════════════════════════════════════
  // STRINGS
  // ══════════════════════════════════════════════════════════

  // Strings > Basics
  {
    id: 'dsa-str-basics-1', category: 'strings', subcategory: 'basics',
    difficulty: 'easy', goalModes: ['viva'], type: 'concept',
    question: 'In most languages, strings are:',
    options: [
      'Always mutable',
      'Immutable (Java, Python, C#) or mutable (C)',
      'Always sorted',
      'Numeric arrays',
    ],
    correctIndex: 1,
    explanation: 'Strings in Java/Python/C# are immutable — modifications create new strings. In C, char arrays are mutable.',
  },
  {
    id: 'dsa-str-basics-2', category: 'strings', subcategory: 'basics',
    difficulty: 'medium', goalModes: ['interview'], type: 'complexity',
    codeSnippet: `String result = "";
for (int i = 0; i < n; i++) {
  result += s.charAt(i);
}`,
    language: 'java',
    question: 'What is the time complexity of this Java code?',
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
    correctIndex: 2,
    explanation: 'String concatenation in Java creates a new string each time (immutability), giving O(n) per iteration × n iterations = O(n²). Use StringBuilder for O(n).',
  },

  // Strings > Hashing
  {
    id: 'dsa-str-hash-1', category: 'strings', subcategory: 'hashing',
    difficulty: 'medium', goalModes: ['interview', 'viva'], type: 'complexity',
    question: 'What is the time complexity to check if two strings are anagrams using a hash map?',
    options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n²)'],
    correctIndex: 1,
    explanation: 'Count character frequencies in one pass over each string (O(n)), then compare counts (O(1) for fixed alphabet).',
  },
  {
    id: 'dsa-str-hash-2', category: 'strings', subcategory: 'hashing',
    difficulty: 'hard', goalModes: ['interview'], type: 'concept',
    question: 'Rolling hash (Rabin-Karp) is primarily used for:',
    options: [
      'Sorting strings',
      'Finding substring matches in O(n) average time',
      'Compressing strings',
      'Reversing strings',
    ],
    correctIndex: 1,
    explanation: 'Rolling hash computes hash of each window in O(1) after initial O(m) setup, enabling substring search in O(n+m) average.',
  },

  // Strings > Two Pointers
  {
    id: 'dsa-str-tp-1', category: 'strings', subcategory: 'two-pointers',
    difficulty: 'easy', goalModes: ['interview', 'viva'], type: 'concept',
    question: 'What is the time complexity of checking if a string is a palindrome using two pointers?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    correctIndex: 2,
    explanation: 'One pointer from each end, moving toward center. Each character visited once = O(n).',
  },
  {
    id: 'dsa-str-tp-2', category: 'strings', subcategory: 'two-pointers',
    difficulty: 'medium', goalModes: ['interview'], type: 'output',
    codeSnippet: `string s = "hello";
int l = 0, r = s.length() - 1;
while (l < r) {
  swap(s[l], s[r]);
  l++; r--;
}
cout << s;`,
    language: 'cpp',
    question: 'What is the output?',
    options: ['hello', 'olleh', 'ohlle', 'lohel'],
    correctIndex: 1,
    explanation: 'Two pointers swap chars from both ends: h↔o, e↔l. Result: "olleh" (reversed string).',
  },

  // Strings > Sliding Window
  {
    id: 'dsa-str-sw-1', category: 'strings', subcategory: 'sliding-window',
    difficulty: 'medium', goalModes: ['interview'], type: 'complexity',
    question: 'What is the time complexity of finding the longest substring without repeating characters using sliding window?',
    options: ['O(n)', 'O(n²)', 'O(n log n)', 'O(n · k)'],
    correctIndex: 0,
    explanation: 'Each character enters and leaves the window at most once. Total work = O(n).',
  },

  // Strings > Pattern Matching
  {
    id: 'dsa-str-pm-1', category: 'strings', subcategory: 'pattern-matching',
    difficulty: 'medium', goalModes: ['interview', 'viva'], type: 'complexity',
    question: 'What is the time complexity of naive pattern matching (checking every position)?',
    options: ['O(n)', 'O(n + m)', 'O(n · m)', 'O(n log m)'],
    correctIndex: 2,
    explanation: 'For each of n positions in text, compare up to m chars of pattern = O(n · m). KMP improves this to O(n + m).',
  },
  {
    id: 'dsa-str-pm-2', category: 'strings', subcategory: 'pattern-matching',
    difficulty: 'hard', goalModes: ['interview'], type: 'concept',
    question: 'KMP algorithm improves pattern matching by:',
    options: [
      'Sorting the text first',
      'Using a failure function to skip already-compared prefixes',
      'Hashing the pattern',
      'Recursion',
    ],
    correctIndex: 1,
    explanation: 'KMP precomputes a failure/LPS array so when a mismatch occurs, we skip characters we already know match, achieving O(n+m).',
  },

  // ══════════════════════════════════════════════════════════
  // STACKS & QUEUES
  // ══════════════════════════════════════════════════════════

  // Stacks & Queues > Stack Basics
  {
    id: 'dsa-sq-stack-1', category: 'stacks-queues', subcategory: 'stack-basics',
    difficulty: 'easy', goalModes: ['interview', 'viva'], type: 'concept',
    question: 'A stack follows which order?',
    options: ['FIFO', 'LIFO', 'Random', 'Priority-based'],
    correctIndex: 1,
    explanation: 'Stack is LIFO (Last In First Out) — the last element pushed is the first popped.',
  },
  {
    id: 'dsa-sq-stack-2', category: 'stacks-queues', subcategory: 'stack-basics',
    difficulty: 'easy', goalModes: ['interview', 'viva'], type: 'concept',
    question: 'What is the time complexity of push and pop operations on a stack?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correctIndex: 0,
    explanation: 'Both push and pop operate at the top of the stack in constant time.',
  },
  {
    id: 'dsa-sq-stack-3', category: 'stacks-queues', subcategory: 'stack-basics',
    difficulty: 'medium', goalModes: ['viva', 'general'], type: 'concept',
    question: 'A stack can be implemented using:',
    options: [
      'Only arrays',
      'Only linked lists',
      'Arrays or linked lists',
      'Neither',
    ],
    correctIndex: 2,
    explanation: 'Both work: array-based has O(1) amortized push (dynamic resize); linked-list-based has true O(1) but per-node overhead.',
  },

  // Stacks & Queues > Queue Basics
  {
    id: 'dsa-sq-queue-1', category: 'stacks-queues', subcategory: 'queue-basics',
    difficulty: 'easy', goalModes: ['interview', 'viva'], type: 'concept',
    question: 'A queue follows which order?',
    options: ['LIFO', 'FIFO', 'Random', 'Priority-based'],
    correctIndex: 1,
    explanation: 'Queue is FIFO (First In First Out) — first element enqueued is first dequeued.',
  },
  {
    id: 'dsa-sq-queue-2', category: 'stacks-queues', subcategory: 'queue-basics',
    difficulty: 'medium', goalModes: ['interview'], type: 'concept',
    question: 'Which real algorithm most commonly uses a queue?',
    options: [
      'DFS',
      'BFS',
      'Quicksort',
      'Binary search',
    ],
    correctIndex: 1,
    explanation: 'BFS uses a queue to process nodes level-by-level. DFS uses a stack (or recursion).',
  },
  {
    id: 'dsa-sq-queue-3', category: 'stacks-queues', subcategory: 'queue-basics',
    difficulty: 'medium', goalModes: ['viva'], type: 'concept',
    question: 'What is a circular queue?',
    options: [
      'A queue with negative indices',
      'A queue where the end wraps around to the beginning to reuse empty slots',
      'A queue with priorities',
      'A queue implemented with recursion',
    ],
    correctIndex: 1,
    explanation: 'Circular queues use modular arithmetic to reuse array slots freed by dequeues, avoiding the "false full" issue of linear queues.',
  },

  // Stacks & Queues > Expression Evaluation
  {
    id: 'dsa-sq-expr-1', category: 'stacks-queues', subcategory: 'expression-evaluation',
    difficulty: 'medium', goalModes: ['interview', 'viva'], type: 'concept',
    question: 'Which data structure is used to evaluate a postfix (RPN) expression?',
    options: ['Queue', 'Stack', 'Heap', 'Tree'],
    correctIndex: 1,
    explanation: 'Postfix evaluation uses a stack: push operands, pop two on operator, push result.',
  },
  {
    id: 'dsa-sq-expr-2', category: 'stacks-queues', subcategory: 'expression-evaluation',
    difficulty: 'hard', goalModes: ['interview'], type: 'output',
    codeSnippet: `// Postfix expression: 3 4 + 2 *
// Evaluate step by step`,
    language: 'text',
    question: 'What is the result of evaluating "3 4 + 2 *"?',
    options: ['14', '10', '11', '20'],
    correctIndex: 0,
    explanation: '3 4 + = 7. Then 7 2 * = 14.',
  },

  // Stacks & Queues > Monotonic Stack
  {
    id: 'dsa-sq-ms-1', category: 'stacks-queues', subcategory: 'monotonic-stack',
    difficulty: 'medium', goalModes: ['interview'], type: 'concept',
    question: 'A monotonic stack is used for which classic problem?',
    options: [
      'Binary search',
      'Next Greater Element',
      'Sorting',
      'Hashing',
    ],
    correctIndex: 1,
    explanation: 'Monotonic stacks efficiently find next/previous greater/smaller element in O(n) total time.',
  },
  {
    id: 'dsa-sq-ms-2', category: 'stacks-queues', subcategory: 'monotonic-stack',
    difficulty: 'hard', goalModes: ['interview'], type: 'complexity',
    question: 'What is the time complexity of solving "Largest Rectangle in Histogram" using monotonic stack?',
    options: ['O(n log n)', 'O(n²)', 'O(n)', 'O(n · h)'],
    correctIndex: 2,
    explanation: 'Each element is pushed and popped at most once, giving O(n) total. Classic monotonic-stack application.',
  },

  // Stacks & Queues > Monotonic Queue / Deque
  {
    id: 'dsa-sq-mq-1', category: 'stacks-queues', subcategory: 'monotonic-queue-deque',
    difficulty: 'hard', goalModes: ['interview'], type: 'complexity',
    question: 'Sliding Window Maximum using a monotonic deque runs in:',
    options: ['O(n · k)', 'O(n log k)', 'O(n)', 'O(n²)'],
    correctIndex: 2,
    explanation: 'Each element is added and removed from deque at most once. Total O(n), better than O(n log k) with a heap.',
  },

  // ══════════════════════════════════════════════════════════
  // RECURSION & BACKTRACKING
  // ══════════════════════════════════════════════════════════

  // Recursion > Fundamentals
  {
    id: 'dsa-rec-fund-1', category: 'recursion', subcategory: 'recursion-fundamentals',
    difficulty: 'easy', goalModes: ['interview', 'viva'], type: 'concept',
    question: 'A recursive function MUST have:',
    options: [
      'A loop',
      'A base case to terminate recursion',
      'A global variable',
      'Dynamic memory allocation',
    ],
    correctIndex: 1,
    explanation: 'Without a base case, recursion never terminates → stack overflow.',
  },
  {
    id: 'dsa-rec-fund-2', category: 'recursion', subcategory: 'recursion-fundamentals',
    difficulty: 'medium', goalModes: ['interview'], type: 'complexity',
    codeSnippet: `int fib(int n) {
  if (n <= 1) return n;
  return fib(n-1) + fib(n-2);
}`,
    language: 'cpp',
    question: 'What is the time complexity of this naive Fibonacci?',
    options: ['O(n)', 'O(n log n)', 'O(2ⁿ)', 'O(n²)'],
    correctIndex: 2,
    explanation: 'Each call spawns two more, forming a binary recursion tree of depth n → O(2ⁿ). Memoization reduces to O(n).',
  },
  {
    id: 'dsa-rec-fund-3', category: 'recursion', subcategory: 'recursion-fundamentals',
    difficulty: 'medium', goalModes: ['viva'], type: 'concept',
    question: 'What is tail recursion?',
    options: [
      'Recursion inside a loop',
      'A recursive call as the last operation in the function',
      'Recursion with multiple base cases',
      'Recursion without base cases',
    ],
    correctIndex: 1,
    explanation: 'Tail recursion means the recursive call is the last thing done — no work after. Some compilers optimize this to a loop (tail call optimization).',
  },
  {
    id: 'dsa-rec-fund-4', category: 'recursion', subcategory: 'recursion-fundamentals',
    difficulty: 'hard', goalModes: ['interview'], type: 'behavior',
    question: 'A stack overflow in recursion typically indicates:',
    options: [
      'Compiler bug',
      'Missing base case or excessive recursion depth',
      'Memory leak',
      'Integer overflow',
    ],
    correctIndex: 1,
    explanation: 'Stack overflow happens when recursion depth exceeds the call stack size — typically from missing/wrong base case or genuinely too-deep recursion.',
  },

  // Recursion > Divide & Conquer
  {
    id: 'dsa-rec-dc-1', category: 'recursion', subcategory: 'divide-conquer',
    difficulty: 'medium', goalModes: ['interview', 'viva'], type: 'concept',
    question: 'The three steps of Divide & Conquer are:',
    options: [
      'Sort, Search, Return',
      'Divide, Conquer (recursively solve), Combine',
      'Iterate, Compare, Swap',
      'Push, Pop, Peek',
    ],
    correctIndex: 1,
    explanation: 'D&C: divide problem into subproblems, solve each recursively, then combine results (e.g. merge sort, quicksort).',
  },
  {
    id: 'dsa-rec-dc-2', category: 'recursion', subcategory: 'divide-conquer',
    difficulty: 'hard', goalModes: ['interview'], type: 'complexity',
    question: 'What is the time complexity of merge sort using the Master Theorem for T(n) = 2T(n/2) + O(n)?',
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
    correctIndex: 1,
    explanation: 'Case 2 of Master Theorem: a=2, b=2, f(n)=n, log_b(a)=1, n^1 = n = f(n). Result: O(n log n).',
  },

  // Recursion > Backtracking Fundamentals
  {
    id: 'dsa-rec-bt-1', category: 'recursion', subcategory: 'backtracking-fundamentals',
    difficulty: 'medium', goalModes: ['interview', 'viva'], type: 'concept',
    question: 'Backtracking differs from brute-force by:',
    options: [
      'Being faster in the worst case',
      'Pruning invalid partial solutions early',
      'Not using recursion',
      'Only working on graphs',
    ],
    correctIndex: 1,
    explanation: 'Backtracking prunes: if a partial solution can\'t possibly lead to a valid answer, we abandon it without exploring further.',
  },
  {
    id: 'dsa-rec-bt-2', category: 'recursion', subcategory: 'backtracking-fundamentals',
    difficulty: 'hard', goalModes: ['interview'], type: 'complexity',
    question: 'What is the time complexity of generating all subsets of an array of size n?',
    options: ['O(n)', 'O(n²)', 'O(2ⁿ)', 'O(n!)'],
    correctIndex: 2,
    explanation: 'Each element has 2 choices (include or exclude), giving 2ⁿ subsets. Generating each takes O(n), so total = O(n · 2ⁿ).',
  },
  {
    id: 'dsa-rec-bt-3', category: 'recursion', subcategory: 'backtracking-fundamentals',
    difficulty: 'hard', goalModes: ['interview'], type: 'complexity',
    question: 'What is the time complexity of generating all permutations of n distinct elements?',
    options: ['O(n²)', 'O(2ⁿ)', 'O(n!)', 'O(n · n!)'],
    correctIndex: 3,
    explanation: 'n! permutations, each of length n to build/print → O(n · n!).',
  },

  // Recursion > Grid Backtracking
  {
    id: 'dsa-rec-grid-1', category: 'recursion', subcategory: 'grid-constraint-backtracking',
    difficulty: 'hard', goalModes: ['interview'], type: 'concept',
    question: 'When backtracking on a grid (like N-Queens), the "visited" state is usually:',
    options: [
      'A global counter',
      'Sets/arrays tracking used rows, columns, and diagonals',
      'A queue',
      'A heap',
    ],
    correctIndex: 1,
    explanation: 'N-Queens tracks which rows, cols, and both diagonals are attacked. Each recursion places a queen; on backtrack, marks are cleared.',
  },

  // ══════════════════════════════════════════════════════════
  // LINKED LISTS
  // ══════════════════════════════════════════════════════════

  {
    id: 'dsa-ll-basics-1', category: 'linked-lists', subcategory: 'singly-linked-list-basics',
    difficulty: 'easy', goalModes: ['interview', 'viva'], type: 'concept',
    question: 'What is the time complexity of accessing the nth element of a singly linked list?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correctIndex: 2,
    explanation: 'Linked lists don\'t support random access — you must traverse from head, one node at a time. O(n).',
  },
  {
    id: 'dsa-ll-basics-2', category: 'linked-lists', subcategory: 'singly-linked-list-basics',
    difficulty: 'easy', goalModes: ['interview', 'viva'], type: 'concept',
    question: 'What is the time complexity of inserting at the head of a singly linked list?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    correctIndex: 0,
    explanation: 'Update new node\'s next to current head, then update head pointer. Constant time.',
  },
  {
    id: 'dsa-ll-basics-3', category: 'linked-lists', subcategory: 'singly-linked-list-basics',
    difficulty: 'medium', goalModes: ['viva'], type: 'concept',
    question: 'Which of these is a disadvantage of linked lists compared to arrays?',
    options: [
      'Slower insertion at head',
      'No random access — must traverse for indexed access',
      'Can\'t store objects',
      'Fixed size',
    ],
    correctIndex: 1,
    explanation: 'Arrays offer O(1) random access; linked lists require O(n) traversal. Linked lists trade this for O(1) insert/delete at known positions.',
  },
  {
    id: 'dsa-ll-basics-4', category: 'linked-lists', subcategory: 'singly-linked-list-basics',
    difficulty: 'medium', goalModes: ['interview', 'viva'], type: 'concept',
    question: 'Why do linked list problems often use a "dummy" (sentinel) node?',
    options: [
      'To make the list circular',
      'To simplify edge cases like insertion/deletion at the head',
      'To save memory',
      'To make traversal faster',
    ],
    correctIndex: 1,
    explanation: 'A dummy head lets you treat the head like any other node, avoiding special-case code when the head changes.',
  },

  // Linked Lists > Two Pointer
  {
    id: 'dsa-ll-tp-1', category: 'linked-lists', subcategory: 'two-pointer-patterns',
    difficulty: 'medium', goalModes: ['interview', 'viva'], type: 'concept',
    question: 'Floyd\'s cycle detection ("tortoise and hare") uses:',
    options: [
      'Two pointers moving at the same speed',
      'Two pointers where fast moves 2 steps and slow moves 1',
      'A hash set of visited nodes',
      'Recursion',
    ],
    correctIndex: 1,
    explanation: 'Fast pointer moves 2 steps, slow moves 1. If there\'s a cycle, they eventually meet inside it. O(n) time, O(1) space.',
  },
  {
    id: 'dsa-ll-tp-2', category: 'linked-lists', subcategory: 'two-pointer-patterns',
    difficulty: 'medium', goalModes: ['interview'], type: 'complexity',
    question: 'What is the time and space complexity of Floyd\'s cycle detection?',
    options: [
      'O(n) time, O(n) space',
      'O(n) time, O(1) space',
      'O(n²) time, O(1) space',
      'O(log n) time, O(1) space',
    ],
    correctIndex: 1,
    explanation: 'Traverses list once (O(n)) using only two pointers (O(1) extra space). Better than hash-set approach.',
  },
  {
    id: 'dsa-ll-tp-3', category: 'linked-lists', subcategory: 'two-pointer-patterns',
    difficulty: 'medium', goalModes: ['interview'], type: 'concept',
    question: 'To find the middle of a linked list in one pass:',
    options: [
      'Count nodes then traverse half',
      'Use fast (2x) and slow (1x) pointers; when fast reaches end, slow is at middle',
      'Recurse to end',
      'Use a stack',
    ],
    correctIndex: 1,
    explanation: 'Fast/slow pointer technique finds middle in a single pass, O(n) time O(1) space.',
  },

  // Linked Lists > In-place manipulation
  {
    id: 'dsa-ll-inp-1', category: 'linked-lists', subcategory: 'in-place-pointer-manipulation',
    difficulty: 'medium', goalModes: ['interview'], type: 'concept',
    question: 'Reversing a singly linked list iteratively requires:',
    options: [
      'A stack',
      'Three pointers: prev, curr, next',
      'A hash map',
      'Two arrays',
    ],
    correctIndex: 1,
    explanation: 'Standard iterative reversal uses prev/curr/next pointers, reversing links as you traverse. O(n) time, O(1) space.',
  },
  {
    id: 'dsa-ll-inp-2', category: 'linked-lists', subcategory: 'in-place-pointer-manipulation',
    difficulty: 'hard', goalModes: ['interview'], type: 'complexity',
    question: 'What is the space complexity of recursive vs iterative linked list reversal?',
    options: [
      'Both O(1)',
      'Recursive O(n) stack, iterative O(1)',
      'Both O(n)',
      'Recursive O(1), iterative O(n)',
    ],
    correctIndex: 1,
    explanation: 'Recursion uses O(n) call stack; iterative uses O(1) with just a few pointer variables.',
  },

  // Linked Lists > Doubly
  {
    id: 'dsa-ll-dll-1', category: 'linked-lists', subcategory: 'doubly-linked-lists',
    difficulty: 'medium', goalModes: ['viva', 'interview'], type: 'concept',
    question: 'A doubly linked list allows O(1) removal of a node when:',
    options: [
      'You have the node\'s index',
      'You have a pointer to the node itself',
      'The list is sorted',
      'The node is the head',
    ],
    correctIndex: 1,
    explanation: 'With prev/next pointers, given a node reference, you can bypass it in O(1). Singly linked list needs O(n) to find the previous node.',
  },

  // Linked Lists > Design
  {
    id: 'dsa-ll-design-1', category: 'linked-lists', subcategory: 'linked-list-design',
    difficulty: 'hard', goalModes: ['interview'], type: 'concept',
    question: 'LRU Cache is typically implemented with:',
    options: [
      'Array + heap',
      'Doubly linked list + hash map',
      'Two stacks',
      'BST',
    ],
    correctIndex: 1,
    explanation: 'Hash map gives O(1) key lookup pointing to a doubly linked list node. DLL enables O(1) removal on access + O(1) LRU eviction from tail.',
  },
  {
    id: 'dsa-ll-design-2', category: 'linked-lists', subcategory: 'linked-list-design',
    difficulty: 'hard', goalModes: ['interview'], type: 'complexity',
    question: 'What is the time complexity of get() and put() in an LRU Cache using hash map + DLL?',
    options: ['O(log n)', 'O(1)', 'O(n)', 'O(n log n)'],
    correctIndex: 1,
    explanation: 'Hash map lookup O(1), DLL node removal O(1), insertion at head O(1). All operations O(1).',
  },

  // ══════════════════════════════════════════════════════════
  // TREES
  // ══════════════════════════════════════════════════════════

  {
    id: 'dsa-tree-trav-1', category: 'trees', subcategory: 'traversals',
    difficulty: 'easy', goalModes: ['interview', 'viva'], type: 'concept',
    question: 'What is the time complexity of any tree traversal (DFS or BFS)?',
    options: ['O(log n)', 'O(n)', 'O(n log n)', 'O(n²)'],
    correctIndex: 1,
    explanation: 'Every node is visited exactly once, giving O(n) regardless of traversal type.',
  },
  {
    id: 'dsa-tree-trav-2', category: 'trees', subcategory: 'traversals',
    difficulty: 'easy', goalModes: ['viva'], type: 'concept',
    question: 'Inorder traversal of a BST produces:',
    options: [
      'Random order',
      'Sorted ascending order',
      'Reverse sorted order',
      'Level order',
    ],
    correctIndex: 1,
    explanation: 'Inorder (left → root → right) on a BST visits nodes in ascending order — a key property.',
  },
  {
    id: 'dsa-tree-trav-3', category: 'trees', subcategory: 'traversals',
    difficulty: 'medium', goalModes: ['interview'], type: 'concept',
    question: 'Which traversal visits root before children?',
    options: ['Inorder', 'Preorder', 'Postorder', 'Level order'],
    correctIndex: 1,
    explanation: 'Preorder = root → left → right. Useful for copying/cloning a tree.',
  },
  {
    id: 'dsa-tree-trav-4', category: 'trees', subcategory: 'traversals',
    difficulty: 'medium', goalModes: ['interview'], type: 'concept',
    question: 'Which traversal visits children before root?',
    options: ['Inorder', 'Preorder', 'Postorder', 'Level order'],
    correctIndex: 2,
    explanation: 'Postorder = left → right → root. Useful for deleting/deallocating trees safely.',
  },
  {
    id: 'dsa-tree-trav-5', category: 'trees', subcategory: 'traversals',
    difficulty: 'hard', goalModes: ['interview'], type: 'complexity',
    question: 'What is the space complexity of DFS on a binary tree in the worst case (skewed tree)?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    correctIndex: 2,
    explanation: 'Skewed trees have height n, so the recursion stack (or explicit stack) grows to O(n). Balanced trees give O(log n).',
  },

  // Trees > Fundamentals
  {
    id: 'dsa-tree-fund-1', category: 'trees', subcategory: 'tree-fundamentals',
    difficulty: 'easy', goalModes: ['viva'], type: 'concept',
    question: 'A "balanced" binary tree has:',
    options: [
      'Equal number of nodes on each side',
      'Height difference between left and right subtree ≤ 1 at every node',
      'All leaves at the same level',
      'Only 2 nodes at each level',
    ],
    correctIndex: 1,
    explanation: 'Balanced BST (like AVL) keeps height O(log n) by ensuring the subtree height difference is bounded.',
  },
  {
    id: 'dsa-tree-fund-2', category: 'trees', subcategory: 'tree-fundamentals',
    difficulty: 'medium', goalModes: ['interview', 'viva'], type: 'concept',
    question: 'What is the maximum number of nodes in a binary tree of height h (root height = 0)?',
    options: ['2^h', '2^(h+1) - 1', '2h', 'h²'],
    correctIndex: 1,
    explanation: 'Complete binary tree has 1 + 2 + 4 + ... + 2^h = 2^(h+1) - 1 nodes.',
  },
  {
    id: 'dsa-tree-fund-3', category: 'trees', subcategory: 'tree-fundamentals',
    difficulty: 'medium', goalModes: ['interview'], type: 'behavior',
    question: 'The minimum height of a binary tree with n nodes is:',
    options: ['log₂(n)', '⌊log₂(n)⌋', 'n', 'n/2'],
    correctIndex: 1,
    explanation: 'Complete binary tree with n nodes has height ⌊log₂(n)⌋ — the tightest possible packing.',
  },

  // Trees > BFS
  {
    id: 'dsa-tree-bfs-1', category: 'trees', subcategory: 'bfs',
    difficulty: 'easy', goalModes: ['interview', 'viva'], type: 'concept',
    question: 'BFS on a tree uses which data structure?',
    options: ['Stack', 'Queue', 'Heap', 'Set'],
    correctIndex: 1,
    explanation: 'Queue for FIFO processing of nodes level-by-level.',
  },
  {
    id: 'dsa-tree-bfs-2', category: 'trees', subcategory: 'bfs',
    difficulty: 'medium', goalModes: ['interview'], type: 'complexity',
    question: 'What is the space complexity of BFS on a binary tree in the worst case?',
    options: ['O(1)', 'O(log n)', 'O(n/2)', 'O(n)'],
    correctIndex: 3,
    explanation: 'The last level of a complete tree has ~n/2 nodes — all sit in the queue at once. So O(n).',
  },

  // Trees > DFS Path
  {
    id: 'dsa-tree-dfs-1', category: 'trees', subcategory: 'dfs-path-problems',
    difficulty: 'medium', goalModes: ['interview'], type: 'concept',
    question: 'To find all root-to-leaf paths in a binary tree, you typically use:',
    options: ['BFS', 'DFS with backtracking', 'Union-Find', 'Binary search'],
    correctIndex: 1,
    explanation: 'DFS explores each path fully; backtracking un-adds the current node on return so paths aren\'t polluted.',
  },

  // Trees > BST
  {
    id: 'dsa-tree-bst-1', category: 'trees', subcategory: 'bst',
    difficulty: 'easy', goalModes: ['interview', 'viva'], type: 'concept',
    question: 'What is the average time complexity of search in a BST?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correctIndex: 1,
    explanation: 'For a balanced BST, search is O(log n). Worst case (degenerate/skewed BST) is O(n).',
  },
  {
    id: 'dsa-tree-bst-2', category: 'trees', subcategory: 'bst',
    difficulty: 'medium', goalModes: ['interview', 'viva'], type: 'behavior',
    question: 'What is the worst-case time complexity of BST search?',
    options: ['O(log n)', 'O(n)', 'O(n log n)', 'O(1)'],
    correctIndex: 1,
    explanation: 'A skewed BST (essentially a linked list) has height n, giving O(n) search. Self-balancing BSTs (AVL, Red-Black) guarantee O(log n).',
  },
  {
    id: 'dsa-tree-bst-3', category: 'trees', subcategory: 'bst',
    difficulty: 'hard', goalModes: ['interview'], type: 'concept',
    question: 'Which self-balancing BST guarantees O(log n) height?',
    options: ['Random BST', 'AVL tree', 'B+ tree only', 'Trie'],
    correctIndex: 1,
    explanation: 'AVL trees maintain a strict balance factor (|left height - right height| ≤ 1) at every node, guaranteeing O(log n) height.',
  },
  {
    id: 'dsa-tree-bst-4', category: 'trees', subcategory: 'bst',
    difficulty: 'hard', goalModes: ['interview'], type: 'behavior',
    question: 'The inorder successor of a node in a BST is:',
    options: [
      'Its right child',
      'Leftmost node of its right subtree, or an ancestor',
      'Its parent',
      'Its left child',
    ],
    correctIndex: 1,
    explanation: 'If right subtree exists: leftmost node in it. Otherwise: walk up until you\'re a left child; that parent is the successor.',
  },

  // Trees > Construction
  {
    id: 'dsa-tree-cons-1', category: 'trees', subcategory: 'tree-construction',
    difficulty: 'medium', goalModes: ['interview'], type: 'concept',
    question: 'Can a binary tree be uniquely reconstructed from only its preorder traversal?',
    options: [
      'Yes',
      'No — you need at least preorder + inorder or postorder + inorder',
      'Only for BST',
      'Only for balanced trees',
    ],
    correctIndex: 1,
    explanation: 'Preorder alone is ambiguous. You need inorder + one of preorder/postorder for unique reconstruction (or BST property).',
  },

  // ══════════════════════════════════════════════════════════
  // GRAPHS
  // ══════════════════════════════════════════════════════════

  {
    id: 'dsa-gr-fund-1', category: 'graphs', subcategory: 'graph-fundamentals',
    difficulty: 'easy', goalModes: ['viva', 'interview'], type: 'concept',
    question: 'For a sparse graph, which representation is more space-efficient?',
    options: [
      'Adjacency matrix',
      'Adjacency list',
      'Edge list only',
      'Neither',
    ],
    correctIndex: 1,
    explanation: 'Adjacency matrix uses O(V²) regardless of edges. Adjacency list uses O(V + E), much better for sparse graphs (E << V²).',
  },
  {
    id: 'dsa-gr-fund-2', category: 'graphs', subcategory: 'graph-fundamentals',
    difficulty: 'medium', goalModes: ['interview', 'viva'], type: 'complexity',
    question: 'What is the time complexity of BFS or DFS on a graph with V vertices and E edges?',
    options: ['O(V)', 'O(E)', 'O(V + E)', 'O(V · E)'],
    correctIndex: 2,
    explanation: 'Every vertex is visited once (O(V)) and every edge is explored once (O(E)). Total O(V + E).',
  },
  {
    id: 'dsa-gr-fund-3', category: 'graphs', subcategory: 'graph-fundamentals',
    difficulty: 'medium', goalModes: ['viva'], type: 'concept',
    question: 'A graph is called "connected" when:',
    options: [
      'All nodes have the same degree',
      'There\'s a path between every pair of vertices',
      'It has no cycles',
      'It has ≥ V edges',
    ],
    correctIndex: 1,
    explanation: 'Connected = every pair of vertices has a path between them. A disconnected graph has multiple components.',
  },
  {
    id: 'dsa-gr-fund-4', category: 'graphs', subcategory: 'graph-fundamentals',
    difficulty: 'medium', goalModes: ['interview'], type: 'concept',
    question: 'DFS on a graph uses:',
    options: [
      'Queue',
      'Stack (or recursion)',
      'Heap',
      'Union-Find',
    ],
    correctIndex: 1,
    explanation: 'DFS goes deep before wide — LIFO behavior matches a stack. Recursion uses the call stack implicitly.',
  },

  // Graphs > Grid
  {
    id: 'dsa-gr-grid-1', category: 'graphs', subcategory: 'grid-graphs',
    difficulty: 'medium', goalModes: ['interview'], type: 'complexity',
    question: 'What is the time complexity of flood-fill on an m × n grid?',
    options: ['O(m · n)', 'O((m · n)²)', 'O(m + n)', 'O(log(m · n))'],
    correctIndex: 0,
    explanation: 'Each cell is visited at most once. Total O(m · n).',
  },

  // Graphs > Topological Sort
  {
    id: 'dsa-gr-topo-1', category: 'graphs', subcategory: 'topological-sort',
    difficulty: 'medium', goalModes: ['interview', 'viva'], type: 'concept',
    question: 'Topological sort is applicable to which type of graph?',
    options: [
      'Any graph',
      'Directed Acyclic Graph (DAG) only',
      'Undirected graph',
      'Weighted graph only',
    ],
    correctIndex: 1,
    explanation: 'Topo sort requires no cycles and directed edges. It orders vertices so all edges go left→right.',
  },
  {
    id: 'dsa-gr-topo-2', category: 'graphs', subcategory: 'topological-sort',
    difficulty: 'medium', goalModes: ['interview'], type: 'complexity',
    question: 'What is the time complexity of Kahn\'s algorithm for topological sort?',
    options: ['O(V)', 'O(E)', 'O(V + E)', 'O(V · E)'],
    correctIndex: 2,
    explanation: 'Kahn\'s: initial indegree calculation O(V+E), then process each vertex/edge once. Total O(V + E).',
  },

  // Graphs > Union Find
  {
    id: 'dsa-gr-uf-1', category: 'graphs', subcategory: 'union-find',
    difficulty: 'medium', goalModes: ['interview', 'viva'], type: 'concept',
    question: 'Union-Find (DSU) is used for:',
    options: [
      'Sorting',
      'Tracking connected components / detecting cycles in undirected graphs',
      'Finding shortest paths',
      'Depth-first search',
    ],
    correctIndex: 1,
    explanation: 'DSU efficiently tracks disjoint sets — useful for MST (Kruskal), cycle detection, and connectivity queries.',
  },
  {
    id: 'dsa-gr-uf-2', category: 'graphs', subcategory: 'union-find',
    difficulty: 'hard', goalModes: ['interview'], type: 'complexity',
    question: 'With union by rank + path compression, what is the amortized time per operation?',
    options: ['O(1)', 'O(α(n)) ≈ O(1)', 'O(log n)', 'O(n)'],
    correctIndex: 1,
    explanation: 'Both optimizations combined give near-constant amortized time — O(α(n)) where α is the inverse Ackermann function (< 5 for practical n).',
  },

  // Graphs > BFS Applications
  {
    id: 'dsa-gr-bfs-1', category: 'graphs', subcategory: 'bfs-applications',
    difficulty: 'medium', goalModes: ['interview'], type: 'concept',
    question: 'BFS finds the shortest path in:',
    options: [
      'Any graph',
      'Unweighted graphs only',
      'Weighted graphs only',
      'Trees only',
    ],
    correctIndex: 1,
    explanation: 'BFS gives shortest path in unweighted graphs. For weighted graphs, use Dijkstra or Bellman-Ford.',
  },

  // Graphs > Shortest Path
  {
    id: 'dsa-gr-sp-1', category: 'graphs', subcategory: 'shortest-path-algorithms',
    difficulty: 'medium', goalModes: ['interview', 'viva'], type: 'concept',
    question: 'Dijkstra\'s algorithm does NOT work with:',
    options: [
      'Positive-weight graphs',
      'Negative-weight edges',
      'Undirected graphs',
      'Sparse graphs',
    ],
    correctIndex: 1,
    explanation: 'Dijkstra assumes non-negative edges. With negative edges, use Bellman-Ford (handles negative weights but is slower).',
  },
  {
    id: 'dsa-gr-sp-2', category: 'graphs', subcategory: 'shortest-path-algorithms',
    difficulty: 'medium', goalModes: ['interview'], type: 'complexity',
    question: 'What is the time complexity of Dijkstra using a min-heap (priority queue)?',
    options: ['O(V²)', 'O(V log V)', 'O((V + E) log V)', 'O(V · E)'],
    correctIndex: 2,
    explanation: 'Each vertex processed once (V log V for extract-min), each edge relaxed once (E log V for decrease-key). Total O((V + E) log V).',
  },
  {
    id: 'dsa-gr-sp-3', category: 'graphs', subcategory: 'shortest-path-algorithms',
    difficulty: 'hard', goalModes: ['interview', 'viva'], type: 'concept',
    question: 'Bellman-Ford differs from Dijkstra by:',
    options: [
      'Being faster',
      'Handling negative-weight edges and detecting negative cycles',
      'Not using edges',
      'Only working on trees',
    ],
    correctIndex: 1,
    explanation: 'Bellman-Ford: O(V·E), slower than Dijkstra, but handles negative edges and detects negative cycles.',
  },
  {
    id: 'dsa-gr-sp-4', category: 'graphs', subcategory: 'shortest-path-algorithms',
    difficulty: 'hard', goalModes: ['interview'], type: 'complexity',
    question: 'Floyd-Warshall algorithm has time complexity:',
    options: ['O(V log V)', 'O(V²)', 'O(V³)', 'O(V · E)'],
    correctIndex: 2,
    explanation: 'Three nested loops over vertices to compute all-pairs shortest paths. O(V³) time, O(V²) space.',
  },

  // Graphs > MST
  {
    id: 'dsa-gr-mst-1', category: 'graphs', subcategory: 'minimum-spanning-tree',
    difficulty: 'medium', goalModes: ['interview', 'viva'], type: 'concept',
    question: 'A Minimum Spanning Tree of a graph with V vertices has how many edges?',
    options: ['V', 'V - 1', 'V + 1', '2V'],
    correctIndex: 1,
    explanation: 'A spanning tree of a connected graph has exactly V - 1 edges (a tree property).',
  },
  {
    id: 'dsa-gr-mst-2', category: 'graphs', subcategory: 'minimum-spanning-tree',
    difficulty: 'medium', goalModes: ['interview'], type: 'concept',
    question: 'Kruskal\'s algorithm uses which data structure to detect cycles?',
    options: [
      'Priority queue',
      'Union-Find (DSU)',
      'Stack',
      'Queue',
    ],
    correctIndex: 1,
    explanation: 'Kruskal picks smallest edge; DSU efficiently checks whether the two endpoints are already connected (would form cycle).',
  },
  {
    id: 'dsa-gr-mst-3', category: 'graphs', subcategory: 'minimum-spanning-tree',
    difficulty: 'hard', goalModes: ['interview'], type: 'complexity',
    question: 'What is the time complexity of Kruskal\'s MST algorithm?',
    options: ['O(V + E)', 'O(V²)', 'O(E log E)', 'O(V · E)'],
    correctIndex: 2,
    explanation: 'Sort edges O(E log E), then process each with near-O(1) DSU ops. Total O(E log E).',
  },

  // ══════════════════════════════════════════════════════════
  // DYNAMIC PROGRAMMING
  // ══════════════════════════════════════════════════════════

  {
    id: 'dsa-dp-fund-1', category: 'dp', subcategory: 'dp-foundations',
    difficulty: 'easy', goalModes: ['interview', 'viva'], type: 'concept',
    question: 'Dynamic Programming applies when a problem has:',
    options: [
      'Sorted input',
      'Overlapping subproblems and optimal substructure',
      'Recursion only',
      'A tree structure',
    ],
    correctIndex: 1,
    explanation: 'DP\'s two hallmarks: overlapping subproblems (same computed multiple times) + optimal substructure (optimal solution built from optimal subsolutions).',
  },
  {
    id: 'dsa-dp-fund-2', category: 'dp', subcategory: 'dp-foundations',
    difficulty: 'medium', goalModes: ['interview', 'viva'], type: 'concept',
    question: 'Top-down DP is also called:',
    options: [
      'Tabulation',
      'Memoization',
      'Iteration',
      'Backtracking',
    ],
    correctIndex: 1,
    explanation: 'Top-down (memoization) = recursion + cache. Bottom-up (tabulation) = iterative filling of a DP table.',
  },
  {
    id: 'dsa-dp-fund-3', category: 'dp', subcategory: 'dp-foundations',
    difficulty: 'medium', goalModes: ['interview'], type: 'complexity',
    question: 'What is the time complexity of Fibonacci with memoization?',
    options: ['O(1)', 'O(n)', 'O(2ⁿ)', 'O(n log n)'],
    correctIndex: 1,
    explanation: 'Each of n subproblems computed once and cached. O(n) time, O(n) space.',
  },

  // DP > 1D DP
  {
    id: 'dsa-dp-1d-1', category: 'dp', subcategory: '1d-dp-basics',
    difficulty: 'easy', goalModes: ['interview'], type: 'concept',
    question: 'The Climbing Stairs problem (n steps, 1 or 2 at a time) has a recurrence that matches:',
    options: [
      'Factorial',
      'Fibonacci',
      'Powers of 2',
      'Prime numbers',
    ],
    correctIndex: 1,
    explanation: 'f(n) = f(n-1) + f(n-2). Identical to Fibonacci — you can reach step n from n-1 or n-2.',
  },
  {
    id: 'dsa-dp-1d-2', category: 'dp', subcategory: '1d-dp-basics',
    difficulty: 'medium', goalModes: ['interview'], type: 'concept',
    question: 'House Robber DP uses the recurrence:',
    options: [
      'dp[i] = dp[i-1] + dp[i-2]',
      'dp[i] = max(dp[i-1], dp[i-2] + nums[i])',
      'dp[i] = min(dp[i-1], dp[i-2])',
      'dp[i] = nums[i] + nums[i-1]',
    ],
    correctIndex: 1,
    explanation: 'At each house: either skip (take dp[i-1]) or rob it (dp[i-2] + nums[i]). Take max.',
  },

  // DP > LIS
  {
    id: 'dsa-dp-lis-1', category: 'dp', subcategory: 'lis-pattern',
    difficulty: 'medium', goalModes: ['interview'], type: 'complexity',
    question: 'What is the time complexity of the standard DP for Longest Increasing Subsequence?',
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'],
    correctIndex: 2,
    explanation: 'For each i, check all j < i. Total O(n²). Can be optimized to O(n log n) with binary search on tails array.',
  },
  {
    id: 'dsa-dp-lis-2', category: 'dp', subcategory: 'lis-pattern',
    difficulty: 'hard', goalModes: ['interview'], type: 'concept',
    question: 'How does the O(n log n) LIS algorithm work?',
    options: [
      'Sort the array first',
      'Maintain a "tails" array where tails[i] = smallest tail of LIS of length i+1, using binary search',
      'Divide and conquer',
      'Union-Find',
    ],
    correctIndex: 1,
    explanation: 'Binary search finds the position to insert/replace in tails. Length of tails = LIS length.',
  },

  // DP > Knapsack
  {
    id: 'dsa-dp-knap-1', category: 'dp', subcategory: 'knapsack-dp',
    difficulty: 'medium', goalModes: ['interview', 'viva'], type: 'complexity',
    question: 'What is the time complexity of the 0/1 Knapsack DP?',
    options: ['O(n)', 'O(n · W)', 'O(2ⁿ)', 'O(n²)'],
    correctIndex: 1,
    explanation: 'DP table is n items × W capacity. Each cell filled in O(1). Total O(n · W) — pseudo-polynomial.',
  },
  {
    id: 'dsa-dp-knap-2', category: 'dp', subcategory: 'knapsack-dp',
    difficulty: 'medium', goalModes: ['interview'], type: 'concept',
    question: 'The difference between 0/1 Knapsack and Unbounded Knapsack is:',
    options: [
      'Different item weights',
      '0/1 uses each item at most once; Unbounded allows unlimited copies',
      'Different capacity',
      'One is recursive, other iterative',
    ],
    correctIndex: 1,
    explanation: '0/1: each item picked ≤ once. Unbounded: any item can be used as many times as fits.',
  },

  // DP > Grid
  {
    id: 'dsa-dp-grid-1', category: 'dp', subcategory: 'grid-dp',
    difficulty: 'easy', goalModes: ['interview'], type: 'concept',
    question: 'For "Unique Paths in m × n grid" (move right or down only), the recurrence is:',
    options: [
      'dp[i][j] = dp[i-1][j] * dp[i][j-1]',
      'dp[i][j] = dp[i-1][j] + dp[i][j-1]',
      'dp[i][j] = min(dp[i-1][j], dp[i][j-1])',
      'dp[i][j] = max(dp[i-1][j], dp[i][j-1])',
    ],
    correctIndex: 1,
    explanation: 'Cell (i,j) reached from (i-1,j) or (i,j-1). Total paths = sum of both.',
  },
  {
    id: 'dsa-dp-grid-2', category: 'dp', subcategory: 'grid-dp',
    difficulty: 'medium', goalModes: ['interview'], type: 'complexity',
    question: 'What is the time and space complexity of Unique Paths DP?',
    options: [
      'O(m + n) time, O(1) space',
      'O(m · n) time, O(m · n) space (can be optimized to O(min(m,n)))',
      'O(2^(m+n)) time',
      'O(log(m·n)) time',
    ],
    correctIndex: 1,
    explanation: 'Fill m·n cells in O(1) each = O(m·n) time. Space O(m·n) with 2D array, optimizable to O(min(m,n)) by keeping only previous row.',
  },

  // DP > String
  {
    id: 'dsa-dp-str-1', category: 'dp', subcategory: 'string-dp',
    difficulty: 'medium', goalModes: ['interview', 'viva'], type: 'complexity',
    question: 'What is the time complexity of Longest Common Subsequence DP?',
    options: ['O(n + m)', 'O(n · m)', 'O(n · m²)', 'O(2^(n+m))'],
    correctIndex: 1,
    explanation: 'DP table n × m, each cell O(1). Total O(n · m).',
  },
  {
    id: 'dsa-dp-str-2', category: 'dp', subcategory: 'string-dp',
    difficulty: 'hard', goalModes: ['interview'], type: 'concept',
    question: 'Edit Distance (Levenshtein) computes the minimum operations to convert one string to another. Which are the 3 allowed operations?',
    options: [
      'Insert, Delete, Reverse',
      'Insert, Delete, Replace',
      'Swap, Insert, Delete',
      'Replace, Copy, Swap',
    ],
    correctIndex: 1,
    explanation: 'Levenshtein: insert, delete, replace — each costs 1. DP: dp[i][j] = min of these three transitions + 1.',
  },

  // DP > Interval
  {
    id: 'dsa-dp-int-1', category: 'dp', subcategory: 'interval-dp',
    difficulty: 'hard', goalModes: ['interview'], type: 'complexity',
    question: 'What is the time complexity of Matrix Chain Multiplication DP?',
    options: ['O(n²)', 'O(n³)', 'O(n · log n)', 'O(2ⁿ)'],
    correctIndex: 1,
    explanation: 'Interval DP: O(n²) subproblems (i, j pairs), each takes O(n) to split. Total O(n³).',
  },
];

// ============================================================
// HELPERS
// ============================================================

export function getSectionsForCategory(topicKey) {
  return DSA_MOCK_SECTIONS[topicKey] || [];
}

export function getSectionLabel(topicKey, slug) {
  const list = getSectionsForCategory(topicKey);
  return list.find((s) => s.slug === slug)?.label || slug;
}

export function getQuestionsByCategory(topicKey) {
  return DSA_MOCK_QUESTIONS.filter((q) => q.category === topicKey);
}

export function getQuestionsBySection(topicKey, sectionSlug) {
  return DSA_MOCK_QUESTIONS.filter(
    (q) => q.category === topicKey && q.subcategory === sectionSlug
  );
}

// getQuestionsByFilter — the main query. Supports filtering by topic (category),
// section (subcategory), difficulty, and goalMode.
export function getQuestionsByFilter({
  category,
  subcategory,
  difficulty,
  goalMode,
}) {
  return DSA_MOCK_QUESTIONS.filter((q) => {
    if (category && category !== 'all' && q.category !== category) return false;
    if (subcategory && subcategory !== 'all' && q.subcategory !== subcategory) return false;
    if (difficulty && difficulty !== 'all' && q.difficulty !== difficulty) return false;
    if (goalMode && goalMode !== 'all') {
      if (!q.goalModes || !q.goalModes.includes(goalMode)) return false;
    }
    return true;
  });
}

export function getQuestion(id) {
  return DSA_MOCK_QUESTIONS.find((q) => q.id === id);
}

// getCategoryStats — for the hub. Total questions per topic + breakdown by
// difficulty AND by goal mode.
export function getCategoryStats() {
  const stats = {};
  for (const [key, info] of Object.entries(DSA_MOCK_CATEGORIES)) {
    const questions = getQuestionsByCategory(key);
    stats[key] = {
      ...info,
      total: questions.length,
      sectionCount: DSA_MOCK_SECTIONS[key]?.length || 0,
      byDifficulty: {
        easy: questions.filter((q) => q.difficulty === 'easy').length,
        medium: questions.filter((q) => q.difficulty === 'medium').length,
        hard: questions.filter((q) => q.difficulty === 'hard').length,
      },
      byGoalMode: {
        interview: questions.filter((q) => q.goalModes?.includes('interview')).length,
        viva: questions.filter((q) => q.goalModes?.includes('viva')).length,
        general: questions.filter((q) => q.goalModes?.includes('general')).length,
      },
    };
  }
  return stats;
}

// getSectionStats — for the topic picker. All sections + counts.
export function getSectionStats(topicKey) {
  return getSectionsForCategory(topicKey).map((sec) => {
    const questions = getQuestionsBySection(topicKey, sec.slug);
    return {
      ...sec,
      total: questions.length,
      byDifficulty: {
        easy: questions.filter((q) => q.difficulty === 'easy').length,
        medium: questions.filter((q) => q.difficulty === 'medium').length,
        hard: questions.filter((q) => q.difficulty === 'hard').length,
      },
    };
  });
}

// getSampleQuestions — for the landing view. Returns 3 curated sample
// questions (easy Arrays, medium Trees, hard DP) for free/basic tier
// users to try before purchasing Advanced tier.
export function getSampleQuestions() {
  const samples = [
    'dsa-arr-basics-1',   // Easy Arrays — array access complexity
    'dsa-tree-bst-1',     // Easy Trees — BST search complexity
    'dsa-dp-fund-1',      // Easy DP — when to use DP
  ];
  return samples.map((id) => getQuestion(id)).filter(Boolean);
}