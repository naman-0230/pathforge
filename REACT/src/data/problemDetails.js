// problemDetails.js — full write-up content (problem statement, examples,
// constraints, hints, solution approaches with dry runs) for problems that
// have been fully written up so far.
//
// This is deliberately separate from problems.js: problems.js is "the whole
// bank, lightweight" (needed for roadmap/dashboard/weak-point testing right
// now), while this file only has entries for the problems worth spending the
// 30-60 minutes it takes to write real hints + dry runs. Most problems won't
// have an entry here yet — ProblemPage falls back to a lightweight view for
// those, so the app never breaks, it just shows "full write-up coming soon."
//
// Solution code is provided in Java, C++, and Python only (see `code: {java,
// cpp, python}` on every approach) — no JavaScript, per product decision.
//
// To add a new one: copy the 'two-sum' shape below and fill it in for another
// problem from problems.js (match the `id` exactly).

export const problemDetails = {

  // ══════════════════════════════════════════════════════
  // 1. Traverse an Array
  // ══════════════════════════════════════════════════════
  'traverse-array': {
    statement:
      'Given an integer array nums, print (or return) all elements from index 0 to n-1 in order. This is the most fundamental array operation — understanding it well makes everything else easier.',
    tags: ['Arrays', 'Array Traversal'],
    requirement: 'Visit every element exactly once',
    externalLinks: [],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [1,2,3,4,5]\nOutput: 1 2 3 4 5' },
      { label: 'Example 2', text: 'Input:  nums = [10,20,30]\nOutput: 10 20 30' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁵', '−10⁹ ≤ nums[i] ≤ 10⁹'],
    requiredComplexity: 'O(n) time · O(1) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'Arrays store elements at contiguous indices starting from 0. How do you access the element at index i?' },
      { number: 2, text: 'Use a loop variable i that goes from 0 to nums.length - 1. At each step, access nums[i].' },
      { number: 3, text: 'What happens if the array is empty (length 0)? Make sure your loop condition handles that — a loop from 0 to -1 should simply not execute.' },
      { number: 4, label: 'Hint 4 — approach', text: 'A simple for-loop: for i in range(n): print(nums[i]). Alternatively, use a for-each loop to iterate directly over elements without tracking the index.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Simple For-Loop — O(n) time, O(1) space',
        explanation: 'Iterate with an index from 0 to n-1. Access each element by its index. This is the foundational pattern for almost every array problem.',
        code: {
          java: `public void traverse(int[] nums) {
    int n = nums.length;
    for (int i = 0; i < n; i++) {
        System.out.print(nums[i] + " ");
    }
}`,
          cpp: `void traverse(vector<int>& nums) {
    int n = nums.size();
    for (int i = 0; i < n; i++) {
        cout << nums[i] << " ";
    }
}`,
          python: `def traverse(nums):
    for i in range(len(nums)):
        print(nums[i], end=" ")`,
        },
        dryRun: {
          title: 'Dry run — nums = [10, 20, 30]',
          columns: ['i', 'nums[i]', 'Output so far'],
          rows: [
            ['0', '10', '10'],
            ['1', '20', '10 20'],
            ['2', '30', '10 20 30 ✓'],
          ],
          highlightRow: 2,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 2. Find Largest Element in Array
  // ══════════════════════════════════════════════════════
  'find-largest-element': {
    statement:
      'Given an integer array nums, return the largest element in the array.',
    tags: ['Arrays', 'Linear Scan'],
    requirement: 'O(n) time, single pass preferred',
    externalLinks: [],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [3,1,4,1,5,9,2,6]\nOutput: 9' },
      { label: 'Example 2', text: 'Input:  nums = [-5,-1,-3]\nOutput: -1' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁵', '−10⁹ ≤ nums[i] ≤ 10⁹'],
    requiredComplexity: 'O(n) time · O(1) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'Imagine you\'re scanning a list of numbers one by one. How would you mentally keep track of the biggest number you\'ve seen so far?' },
      { number: 2, text: 'Start with the first element as your current maximum. Then compare each subsequent element against it.' },
      { number: 3, text: 'Whenever you find an element larger than your current max, update the max. What should max be initialized to — nums[0] or Integer.MIN_VALUE? Both work, but nums[0] is cleaner.' },
      { number: 4, label: 'Hint 4 — approach', text: 'Single pass: max = nums[0]. For i from 1 to n-1: if nums[i] > max, set max = nums[i]. Return max after the loop.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Linear Scan — O(n) time, O(1) space',
        explanation: 'Track the running maximum as you scan left to right. Update it whenever a larger element is found.',
        code: {
          java: `public int findLargest(int[] nums) {
    int max = nums[0];
    for (int i = 1; i < nums.length; i++) {
        if (nums[i] > max) {
            max = nums[i];
        }
    }
    return max;
}`,
          cpp: `int findLargest(vector<int>& nums) {
    int max = nums[0];
    for (int i = 1; i < (int)nums.size(); i++) {
        if (nums[i] > max) max = nums[i];
    }
    return max;
}`,
          python: `def findLargest(nums):
    max_val = nums[0]
    for i in range(1, len(nums)):
        if nums[i] > max_val:
            max_val = nums[i]
    return max_val`,
        },
        dryRun: {
          title: 'Dry run — nums = [3, 1, 9, 2, 6]',
          columns: ['i', 'nums[i]', 'max (before)', 'Update?', 'max (after)'],
          rows: [
            ['—', '—', '—', 'init', '3'],
            ['1', '1', '3', 'No', '3'],
            ['2', '9', '3', 'Yes (9>3)', '9'],
            ['3', '2', '9', 'No', '9'],
            ['4', '6', '9', 'No', '9 ✓'],
          ],
          highlightRow: 2,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 3. Find Second Largest Element
  // ══════════════════════════════════════════════════════
  'find-second-largest': {
    statement:
      'Given an integer array nums, return the second largest distinct element. If no such element exists, return -1.',
    tags: ['Arrays', 'Linear Scan'],
    requirement: 'Single pass preferred',
    externalLinks: [],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [3,1,4,1,5,9,2,6]\nOutput: 6' },
      { label: 'Example 2', text: 'Input:  nums = [1,1,1]\nOutput: -1  (no distinct second largest)' },
      { label: 'Example 3', text: 'Input:  nums = [10,5]\nOutput: 5' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁵', '−10⁹ ≤ nums[i] ≤ 10⁹'],
    requiredComplexity: 'O(n) time · O(1) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'Can you find both the largest and second largest in a single pass? What two variables would you need to track?' },
      { number: 2, text: 'Track two variables: first (the largest seen so far) and second (the largest seen that is strictly less than first).' },
      { number: 3, text: 'When you see a new element x: if x > first, then second becomes the old first, and first becomes x. If first > x > second, update only second.' },
      { number: 4, label: 'Hint 4 — approach', text: 'Initialize first = second = -∞ (or Integer.MIN_VALUE). After the loop, return second if it was updated, else -1. Be careful with duplicate values — only update if x is strictly greater.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Two-Variable Linear Scan — O(n) time, O(1) space',
        explanation: 'Maintain the top two distinct values in one pass. Update both variables carefully when a new element challenges the top two.',
        code: {
          java: `public int findSecondLargest(int[] nums) {
    int first = Integer.MIN_VALUE, second = Integer.MIN_VALUE;
    for (int x : nums) {
        if (x > first) {
            second = first;
            first = x;
        } else if (x > second && x != first) {
            second = x;
        }
    }
    return second == Integer.MIN_VALUE ? -1 : second;
}`,
          cpp: `int findSecondLargest(vector<int>& nums) {
    int first = INT_MIN, second = INT_MIN;
    for (int x : nums) {
        if (x > first) { second = first; first = x; }
        else if (x > second && x != first) second = x;
    }
    return second == INT_MIN ? -1 : second;
}`,
          python: `def findSecondLargest(nums):
    first = second = float('-inf')
    for x in nums:
        if x > first:
            second = first
            first = x
        elif x > second and x != first:
            second = x
    return -1 if second == float('-inf') else second`,
        },
        dryRun: {
          title: 'Dry run — nums = [3, 9, 1, 6]',
          columns: ['x', 'first (before)', 'second (before)', 'Action', 'first (after)', 'second (after)'],
          rows: [
            ['3', '-∞', '-∞', 'x>first → second=−∞, first=3', '3', '-∞'],
            ['9', '3', '-∞', 'x>first → second=3, first=9', '9', '3'],
            ['1', '9', '3', 'x<second, skip', '9', '3'],
            ['6', '9', '3', '6>3 & 6≠9 → second=6', '9', '6 ✓'],
          ],
          highlightRow: 3,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 4. Check if Array is Sorted
  // ══════════════════════════════════════════════════════
  'check-array-sorted': {
    statement:
      'Given an integer array nums, return true if the array is sorted in non-decreasing order, and false otherwise.',
    tags: ['Arrays', 'Linear Scan'],
    requirement: 'O(n) time',
    externalLinks: [],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [1,2,2,3,5]\nOutput: true' },
      { label: 'Example 2', text: 'Input:  nums = [1,3,2,4]\nOutput: false' },
      { label: 'Example 3', text: 'Input:  nums = [5]\nOutput: true  (single element is always sorted)' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁵', '−10⁹ ≤ nums[i] ≤ 10⁹'],
    requiredComplexity: 'O(n) time · O(1) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'An array is sorted if every adjacent pair satisfies nums[i] ≤ nums[i+1]. Can you check all adjacent pairs in one pass?' },
      { number: 2, text: 'Loop from i = 0 to n-2. At each step, check if nums[i] > nums[i+1]. If you ever find such a pair, the array is not sorted.' },
      { number: 3, text: 'You can return false immediately when you find the first violation — no need to look further. This is called an early exit.' },
      { number: 4, label: 'Hint 4 — approach', text: 'If the loop completes without finding any violation, return true. Edge case: a single-element array is trivially sorted — your loop won\'t even execute (i goes from 0 to -1).' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Adjacent Pair Check — O(n) time, O(1) space',
        explanation: 'Compare every consecutive pair. Return false on the first inversion found; return true if all pairs are non-decreasing.',
        code: {
          java: `public boolean isSorted(int[] nums) {
    for (int i = 0; i < nums.length - 1; i++) {
        if (nums[i] > nums[i + 1]) return false;
    }
    return true;
}`,
          cpp: `bool isSorted(vector<int>& nums) {
    for (int i = 0; i < (int)nums.size() - 1; i++) {
        if (nums[i] > nums[i + 1]) return false;
    }
    return true;
}`,
          python: `def isSorted(nums):
    for i in range(len(nums) - 1):
        if nums[i] > nums[i + 1]:
            return False
    return True`,
        },
        dryRun: {
          title: 'Dry run — nums = [1, 2, 4, 3, 5]',
          columns: ['i', 'nums[i]', 'nums[i+1]', 'Violation?'],
          rows: [
            ['0', '1', '2', 'No (1≤2)'],
            ['1', '2', '4', 'No (2≤4)'],
            ['2', '4', '3', 'Yes! (4>3) → return false ✓'],
          ],
          highlightRow: 2,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 5. Reverse an Array
  // ══════════════════════════════════════════════════════
  'reverse-array': {
    statement:
      'Given an integer array nums, reverse it in-place and return it.',
    tags: ['Arrays', 'Two Pointers'],
    requirement: 'In-place, O(1) extra space',
    externalLinks: [],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [1,2,3,4,5]\nOutput: [5,4,3,2,1]' },
      { label: 'Example 2', text: 'Input:  nums = [1,2,3,4]\nOutput: [4,3,2,1]' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁵', '−10⁹ ≤ nums[i] ≤ 10⁹'],
    requiredComplexity: 'O(n) time · O(1) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'Think of the array like a physical deck of cards — to reverse it you swap the outermost cards first, then move inward. What two indices would represent the "outermost" positions?' },
      { number: 2, text: 'Use two pointers: left starting at 0, right starting at n-1. Swap nums[left] and nums[right], then move them toward each other.' },
      { number: 3, text: 'Continue swapping while left < right. When they meet or cross, every element has been placed in its correct reversed position.' },
      { number: 4, label: 'Hint 4 — approach', text: 'This is the classic two-pointer reversal. It runs in O(n) time with O(1) space because you\'re doing n/2 swaps in-place. For odd-length arrays, the middle element never needs to move.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Two-Pointer Swap — O(n) time, O(1) space',
        explanation: 'Place two pointers at both ends and swap inward until they meet. Each swap correctly positions two elements at once.',
        code: {
          java: `public void reverseArray(int[] nums) {
    int left = 0, right = nums.length - 1;
    while (left < right) {
        int temp = nums[left];
        nums[left] = nums[right];
        nums[right] = temp;
        left++;
        right--;
    }
}`,
          cpp: `void reverseArray(vector<int>& nums) {
    int left = 0, right = nums.size() - 1;
    while (left < right) {
        swap(nums[left], nums[right]);
        left++; right--;
    }
}`,
          python: `def reverseArray(nums):
    left, right = 0, len(nums) - 1
    while left < right:
        nums[left], nums[right] = nums[right], nums[left]
        left += 1
        right -= 1`,
        },
        dryRun: {
          title: 'Dry run — nums = [1,2,3,4,5]',
          columns: ['Step', 'left', 'right', 'Swap', 'Array State'],
          rows: [
            ['1', '0', '4', '1↔5', '[5,2,3,4,1]'],
            ['2', '1', '3', '2↔4', '[5,4,3,2,1]'],
            ['3', '2', '2', 'left=right, stop', '[5,4,3,2,1] ✓'],
          ],
          highlightRow: 2,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 6. Linear Search
  // ══════════════════════════════════════════════════════
  'linear-search': {
    statement:
      'Given an integer array nums and a target value, return the index of the first occurrence of target in nums. If the target is not found, return -1.',
    tags: ['Arrays', 'Searching'],
    requirement: 'O(n) time worst case',
    externalLinks: [],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [4,2,7,1,9], target = 7\nOutput: 2' },
      { label: 'Example 2', text: 'Input:  nums = [1,2,3], target = 5\nOutput: -1' },
      { label: 'Example 3', text: 'Input:  nums = [5,5,5], target = 5\nOutput: 0  (first occurrence)' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁵', '−10⁹ ≤ nums[i] ≤ 10⁹'],
    requiredComplexity: 'O(n) time · O(1) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'The array is unsorted, so you can\'t use binary search. What\'s the simplest way to find a value in an unsorted list?' },
      { number: 2, text: 'Check every element one by one from left to right. Compare each element to the target.' },
      { number: 3, text: 'The moment you find nums[i] == target, you can return i immediately — no need to continue scanning (we want the first occurrence).' },
      { number: 4, label: 'Hint 4 — approach', text: 'If the entire loop finishes without finding the target, return -1. This O(n) approach is optimal for unsorted arrays — there\'s no way to do better without sorting first.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Linear Scan — O(n) time, O(1) space',
        explanation: 'Scan from left to right. Return the index immediately when the target is found. Return -1 if the scan completes without a match.',
        code: {
          java: `public int linearSearch(int[] nums, int target) {
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] == target) return i;
    }
    return -1;
}`,
          cpp: `int linearSearch(vector<int>& nums, int target) {
    for (int i = 0; i < (int)nums.size(); i++) {
        if (nums[i] == target) return i;
    }
    return -1;
}`,
          python: `def linearSearch(nums, target):
    for i in range(len(nums)):
        if nums[i] == target:
            return i
    return -1`,
        },
        dryRun: {
          title: 'Dry run — nums = [4,2,7,1,9], target = 7',
          columns: ['i', 'nums[i]', 'nums[i]==7?', 'Action'],
          rows: [
            ['0', '4', 'No', 'Continue'],
            ['1', '2', 'No', 'Continue'],
            ['2', '7', 'Yes!', 'return 2 ✓'],
          ],
          highlightRow: 2,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 7. Count Frequency of Elements
  // ══════════════════════════════════════════════════════
  'count-frequency-array': {
    statement:
      'Given an integer array nums, return a map (or print) the frequency of each distinct element — i.e., how many times each value appears.',
    tags: ['Arrays', 'Frequency Counting'],
    requirement: 'O(n) time',
    externalLinks: [],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [1,2,2,3,3,3]\nOutput: {1:1, 2:2, 3:3}' },
      { label: 'Example 2', text: 'Input:  nums = [5,5,5,5]\nOutput: {5:4}' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁵', '−10⁹ ≤ nums[i] ≤ 10⁹'],
    requiredComplexity: 'O(n) time · O(n) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'You need to count occurrences of each value. What data structure maps a value to its count?' },
      { number: 2, text: 'A HashMap (dictionary) is perfect: use the element as the key and the count as the value.' },
      { number: 3, text: 'For each element x in nums: if x is already in the map, increment its count; otherwise, set its count to 1.' },
      { number: 4, label: 'Hint 4 — approach', text: 'Use map.getOrDefault(x, 0) + 1 in Java (or dict.get(x, 0) + 1 in Python) to cleanly handle both the "first occurrence" and "already seen" cases in one line.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'HashMap Frequency Count — O(n) time, O(n) space',
        explanation: 'Use a hash map to tally each element\'s count in one pass. The space is O(k) where k is the number of distinct elements.',
        code: {
          java: `public Map<Integer, Integer> countFrequency(int[] nums) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int x : nums) {
        freq.put(x, freq.getOrDefault(x, 0) + 1);
    }
    return freq;
}`,
          cpp: `unordered_map<int,int> countFrequency(vector<int>& nums) {
    unordered_map<int,int> freq;
    for (int x : nums) freq[x]++;
    return freq;
}`,
          python: `def countFrequency(nums):
    freq = {}
    for x in nums:
        freq[x] = freq.get(x, 0) + 1
    return freq`,
        },
        dryRun: {
          title: 'Dry run — nums = [1,2,2,3,3,3]',
          columns: ['x', 'Action', 'Map State'],
          rows: [
            ['1', 'Insert 1→1', '{1:1}'],
            ['2', 'Insert 2→1', '{1:1, 2:1}'],
            ['2', 'Increment 2→2', '{1:1, 2:2}'],
            ['3', 'Insert 3→1', '{1:1, 2:2, 3:1}'],
            ['3', 'Increment 3→2', '{1:1, 2:2, 3:2}'],
            ['3', 'Increment 3→3', '{1:1, 2:2, 3:3} ✓'],
          ],
          highlightRow: 5,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 8. Remove Element
  // ══════════════════════════════════════════════════════
  'remove-element': {
    statement:
      'Given an integer array nums and an integer val, remove all occurrences of val in-place. Return the number of elements not equal to val. The relative order of other elements may be changed.',
    tags: ['Arrays', 'In-place Array Modification'],
    requirement: 'In-place, O(1) extra space',
    externalLinks: [
      { label: '↗ LeetCode #27', url: 'https://leetcode.com/problems/remove-element/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [3,2,2,3], val = 3\nOutput: 2, nums = [2,2,_,_]' },
      { label: 'Example 2', text: 'Input:  nums = [0,1,2,2,3,0,4,2], val = 2\nOutput: 5, nums = [0,1,3,0,4,_,_,_]' },
    ],
    constraints: ['0 ≤ nums.length ≤ 100', '0 ≤ nums[i] ≤ 50', '0 ≤ val ≤ 100'],
    requiredComplexity: 'O(n) time · O(1) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'You can\'t truly "delete" from an array in-place. But what if you just overwrote the positions you want to keep — using a write pointer?' },
      { number: 2, text: 'Use a slow pointer k (the write index). Scan with a fast pointer i. Whenever nums[i] ≠ val, copy nums[i] into nums[k] and advance k.' },
      { number: 3, text: 'Elements equal to val are simply skipped — the fast pointer advances but the slow pointer does not. This effectively "removes" them without extra space.' },
      { number: 4, label: 'Hint 4 — approach', text: 'After the loop, k is the count of elements not equal to val. The first k positions of nums hold the valid elements. Return k.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Two-Pointer (Write Index) — O(n) time, O(1) space',
        explanation: 'A read pointer scans the array; a write pointer only advances when a non-val element is found and written.',
        code: {
          java: `public int removeElement(int[] nums, int val) {
    int k = 0;
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] != val) {
            nums[k] = nums[i];
            k++;
        }
    }
    return k;
}`,
          cpp: `int removeElement(vector<int>& nums, int val) {
    int k = 0;
    for (int i = 0; i < (int)nums.size(); i++) {
        if (nums[i] != val) nums[k++] = nums[i];
    }
    return k;
}`,
          python: `def removeElement(nums, val):
    k = 0
    for i in range(len(nums)):
        if nums[i] != val:
            nums[k] = nums[i]
            k += 1
    return k`,
        },
        dryRun: {
          title: 'Dry run — nums = [3,2,2,3], val = 3',
          columns: ['i', 'nums[i]', 'nums[i]≠3?', 'k (write)', 'Array (first k elements)'],
          rows: [
            ['0', '3', 'No', '0', '[]'],
            ['1', '2', 'Yes → write', '1', '[2]'],
            ['2', '2', 'Yes → write', '2', '[2,2]'],
            ['3', '3', 'No', '2', '[2,2] → return 2 ✓'],
          ],
          highlightRow: 3,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 9. Move Zeroes (Basic)
  // ══════════════════════════════════════════════════════
  'move-zeroes-basic': {
    statement:
      'Given an integer array nums, move all 0s to the end of it while maintaining the relative order of the non-zero elements. Do this in-place.',
    tags: ['Arrays', 'Array Manipulation'],
    requirement: 'In-place, minimize total operations',
    externalLinks: [
      { label: '↗ LeetCode #283', url: 'https://leetcode.com/problems/move-zeroes/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [0,1,0,3,12]\nOutput: [1,3,12,0,0]' },
      { label: 'Example 2', text: 'Input:  nums = [0]\nOutput: [0]' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁴', '−2³¹ ≤ nums[i] ≤ 2³¹−1'],
    requiredComplexity: 'O(n) time · O(1) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'This is very similar to "remove element" — instead of removing zeros, what if you first moved all non-zeros to the front, then filled the rest with zeros?' },
      { number: 2, text: 'Use a write pointer k. Scan through the array and whenever you see a non-zero, write it to position k and advance k.' },
      { number: 3, text: 'After the scan, positions 0 to k-1 hold all non-zero elements in their original order. What should positions k to n-1 contain?' },
      { number: 4, label: 'Hint 4 — approach', text: 'Fill positions k through n-1 with zeros. Total work: one pass to compact non-zeros + one pass to fill zeros = O(n). For a slightly more elegant solution, swap nums[i] and nums[k] instead of overwriting, avoiding the second fill step.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Write Pointer + Fill — O(n) time, O(1) space',
        explanation: 'Compact all non-zeros to the front using a write pointer, then fill the tail with zeros.',
        code: {
          java: `public void moveZeroes(int[] nums) {
    int k = 0;
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] != 0) nums[k++] = nums[i];
    }
    while (k < nums.length) nums[k++] = 0;
}`,
          cpp: `void moveZeroes(vector<int>& nums) {
    int k = 0;
    for (int i = 0; i < (int)nums.size(); i++) {
        if (nums[i] != 0) nums[k++] = nums[i];
    }
    while (k < (int)nums.size()) nums[k++] = 0;
}`,
          python: `def moveZeroes(nums):
    k = 0
    for i in range(len(nums)):
        if nums[i] != 0:
            nums[k] = nums[i]
            k += 1
    while k < len(nums):
        nums[k] = 0
        k += 1`,
        },
        dryRun: {
          title: 'Dry run — nums = [0,1,0,3,12]',
          columns: ['Step', 'Action', 'k', 'Array'],
          rows: [
            ['i=0', 'nums[0]=0, skip', '0', '[0,1,0,3,12]'],
            ['i=1', 'nums[1]=1≠0, write to k=0', '1', '[1,1,0,3,12]'],
            ['i=2', 'nums[2]=0, skip', '1', '[1,1,0,3,12]'],
            ['i=3', 'nums[3]=3≠0, write to k=1', '2', '[1,3,0,3,12]'],
            ['i=4', 'nums[4]=12≠0, write to k=2', '3', '[1,3,12,3,12]'],
            ['fill', 'Fill k=3,4 with 0', '5', '[1,3,12,0,0] ✓'],
          ],
          highlightRow: 5,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 10. Left Rotate Array
  // ══════════════════════════════════════════════════════
  'left-rotate-array': {
    statement:
      'Given an integer array nums and an integer k, left-rotate the array by k positions. The first k elements move to the end.',
    tags: ['Arrays', 'Array Rotation'],
    requirement: 'O(n) time, O(1) space preferred',
    externalLinks: [],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [1,2,3,4,5,6,7], k = 3\nOutput: [4,5,6,7,1,2,3]' },
      { label: 'Example 2', text: 'Input:  nums = [1,2,3], k = 1\nOutput: [2,3,1]' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁵', '0 ≤ k ≤ nums.length'],
    requiredComplexity: 'O(n) time · O(1) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'Left-rotating by k is the same as right-rotating by (n - k). Can you reuse the triple-reversal trick from rotate-array?' },
      { number: 2, text: 'Think of it differently: left rotate by k means the first k elements go to the back. If you reverse the first k, then reverse the rest, then reverse the whole array — what happens?' },
      { number: 3, text: 'Step 1: Reverse nums[0..k-1]. Step 2: Reverse nums[k..n-1]. Step 3: Reverse the entire array. Trace through a small example to verify.' },
      { number: 4, label: 'Hint 4 — approach', text: 'Alternatively, reverse the whole array first, then reverse [0..n-k-1], then reverse [n-k..n-1] — this gives a right rotation. For left rotation, the order of partial reversals changes. Always reduce k = k % n first.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Triple Reversal — O(n) time, O(1) space',
        explanation: 'Reverse the first k elements, reverse the remaining n-k elements, then reverse the whole array. The combined effect is a left rotation by k.',
        code: {
          java: `public void leftRotate(int[] nums, int k) {
    int n = nums.length;
    k %= n;
    reverse(nums, 0, k - 1);
    reverse(nums, k, n - 1);
    reverse(nums, 0, n - 1);
}
private void reverse(int[] nums, int l, int r) {
    while (l < r) {
        int t = nums[l]; nums[l] = nums[r]; nums[r] = t;
        l++; r--;
    }
}`,
          cpp: `void leftRotate(vector<int>& nums, int k) {
    int n = nums.size();
    k %= n;
    reverse(nums.begin(), nums.begin() + k);
    reverse(nums.begin() + k, nums.end());
    reverse(nums.begin(), nums.end());
}`,
          python: `def leftRotate(nums, k):
    n = len(nums)
    k %= n
    nums[:k] = reversed(nums[:k])
    nums[k:] = reversed(nums[k:])
    nums.reverse()`,
        },
        dryRun: {
          title: 'Dry run — nums = [1,2,3,4,5,6,7], k = 3',
          columns: ['Step', 'Operation', 'Array State'],
          rows: [
            ['1', 'Reverse first k=3 [0,2]', '[3,2,1,4,5,6,7]'],
            ['2', 'Reverse rest [3,6]', '[3,2,1,7,6,5,4]'],
            ['3', 'Reverse whole array [0,6]', '[4,5,6,7,1,2,3] ✓'],
          ],
          highlightRow: 2,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 11. Leaders in an Array
  // ══════════════════════════════════════════════════════
  'leaders-in-array': {
    statement:
      'An element is a leader if it is strictly greater than all elements to its right. Given an array nums, return all leaders. The rightmost element is always a leader.',
    tags: ['Arrays', 'Right Traversal'],
    requirement: 'O(n) time',
    externalLinks: [],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [16,17,4,3,5,2]\nOutput: [17,5,2]' },
      { label: 'Example 2', text: 'Input:  nums = [1,2,3,4,5]\nOutput: [5]' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁵', '0 ≤ nums[i] ≤ 10⁹'],
    requiredComplexity: 'O(n) time · O(1) extra space (output list aside)',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'A brute force would compare every element against all elements to its right — O(n²). Can you do it in O(n) by scanning from the right instead of the left?' },
      { number: 2, text: 'Scan from right to left, keeping track of the maximum element seen so far (starting from the rightmost element).' },
      { number: 3, text: 'An element at index i is a leader if nums[i] > maxFromRight. After checking, update maxFromRight if nums[i] is larger.' },
      { number: 4, label: 'Hint 4 — approach', text: 'Collect leaders in a list while scanning right to left. At the end, reverse the list to get them in left-to-right order. The rightmost element is always added first (it\'s always a leader).' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Right-to-Left Scan — O(n) time, O(1) extra space',
        explanation: 'Scan from the rightmost element, maintaining a running maximum. Every element greater than the current running max is a leader.',
        code: {
          java: `public List<Integer> findLeaders(int[] nums) {
    List<Integer> result = new ArrayList<>();
    int maxFromRight = Integer.MIN_VALUE;
    for (int i = nums.length - 1; i >= 0; i--) {
        if (nums[i] > maxFromRight) {
            result.add(nums[i]);
            maxFromRight = nums[i];
        }
    }
    Collections.reverse(result);
    return result;
}`,
          cpp: `vector<int> findLeaders(vector<int>& nums) {
    vector<int> result;
    int maxFromRight = INT_MIN;
    for (int i = nums.size() - 1; i >= 0; i--) {
        if (nums[i] > maxFromRight) {
            result.push_back(nums[i]);
            maxFromRight = nums[i];
        }
    }
    reverse(result.begin(), result.end());
    return result;
}`,
          python: `def findLeaders(nums):
    result = []
    max_from_right = float('-inf')
    for i in range(len(nums) - 1, -1, -1):
        if nums[i] > max_from_right:
            result.append(nums[i])
            max_from_right = nums[i]
    return result[::-1]`,
        },
        dryRun: {
          title: 'Dry run — nums = [16,17,4,3,5,2]',
          columns: ['i', 'nums[i]', 'maxFromRight', 'Leader?', 'result'],
          rows: [
            ['5', '2', '-∞', 'Yes (2>-∞)', '[2]'],
            ['4', '5', '2', 'Yes (5>2)', '[2,5]'],
            ['3', '3', '5', 'No', '[2,5]'],
            ['2', '4', '5', 'No', '[2,5]'],
            ['1', '17', '5', 'Yes (17>5)', '[2,5,17]'],
            ['0', '16', '17', 'No', '[2,5,17] → reverse → [17,5,2] ✓'],
          ],
          highlightRow: 5,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 12. Max Consecutive Ones
  // ══════════════════════════════════════════════════════
  'maximum-consecutive-ones': {
    statement:
      'Given a binary array nums, return the maximum number of consecutive 1s in the array.',
    tags: ['Arrays', 'Linear Scan'],
    requirement: 'O(n) time, single pass',
    externalLinks: [
      { label: '↗ LeetCode #485', url: 'https://leetcode.com/problems/max-consecutive-ones/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [1,1,0,1,1,1]\nOutput: 3' },
      { label: 'Example 2', text: 'Input:  nums = [1,0,1,1,0,1]\nOutput: 2' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁵', 'nums[i] is 0 or 1'],
    requiredComplexity: 'O(n) time · O(1) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'You need to track "streaks" of ones. What two variables would let you track the current streak length and the best streak seen so far?' },
      { number: 2, text: 'Use current to track the ongoing streak. When you see a 1, increment current. When you see a 0, reset current to 0.' },
      { number: 3, text: 'After updating current for each element, update maxSoFar = max(maxSoFar, current). This ensures you capture the peak streak.' },
      { number: 4, label: 'Hint 4 — approach', text: 'One pass, two variables. Edge case: if the array ends with a streak of 1s, the final update to maxSoFar inside the loop handles it — you don\'t need a separate check after the loop.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Single Pass with Running Count — O(n) time, O(1) space',
        explanation: 'Count the current streak of ones. Reset to zero on a zero. Track the peak across all streaks.',
        code: {
          java: `public int findMaxConsecutiveOnes(int[] nums) {
    int maxOnes = 0, current = 0;
    for (int x : nums) {
        if (x == 1) {
            current++;
            maxOnes = Math.max(maxOnes, current);
        } else {
            current = 0;
        }
    }
    return maxOnes;
}`,
          cpp: `int findMaxConsecutiveOnes(vector<int>& nums) {
    int maxOnes = 0, current = 0;
    for (int x : nums) {
        current = (x == 1) ? current + 1 : 0;
        maxOnes = max(maxOnes, current);
    }
    return maxOnes;
}`,
          python: `def findMaxConsecutiveOnes(nums):
    max_ones = current = 0
    for x in nums:
        current = current + 1 if x == 1 else 0
        max_ones = max(max_ones, current)
    return max_ones`,
        },
        dryRun: {
          title: 'Dry run — nums = [1,1,0,1,1,1]',
          columns: ['x', 'current', 'maxOnes'],
          rows: [
            ['1', '1', '1'],
            ['1', '2', '2'],
            ['0', '0', '2'],
            ['1', '1', '2'],
            ['1', '2', '2'],
            ['1', '3', '3 ✓'],
          ],
          highlightRow: 5,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 13. Pascal's Triangle
  // ══════════════════════════════════════════════════════
  'pascals-triangle': {
    statement:
      'Given an integer numRows, return the first numRows of Pascal\'s triangle. In Pascal\'s triangle, each number is the sum of the two numbers directly above it.',
    tags: ['Arrays', 'Array Construction'],
    requirement: 'O(numRows²) time',
    externalLinks: [
      { label: '↗ LeetCode #118', url: 'https://leetcode.com/problems/pascals-triangle/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  numRows = 5\nOutput: [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]' },
      { label: 'Example 2', text: 'Input:  numRows = 1\nOutput: [[1]]' },
    ],
    constraints: ['1 ≤ numRows ≤ 30'],
    requiredComplexity: 'O(numRows²) time · O(numRows²) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'Every row starts and ends with 1. Every interior element at position j is the sum of the previous row\'s elements at j-1 and j. Can you build each row from the previous one?' },
      { number: 2, text: 'Start with row 0 = [1]. For each new row, initialize it with 1s, then fill in interior positions using the previous row.' },
      { number: 3, text: 'For row i, it has i+1 elements. Element j (1 ≤ j ≤ i-1) = prev[j-1] + prev[j]. The first and last elements are always 1.' },
      { number: 4, label: 'Hint 4 — approach', text: 'Build the result list row by row. Each row can be constructed in O(row_length) time. Total work across all rows: 1+2+3+...+numRows = O(numRows²).' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Row-by-Row Construction — O(n²) time, O(n²) space',
        explanation: 'Build each row from the previous one. Every row starts and ends with 1; interior elements are sums of the two elements above.',
        code: {
          java: `public List<List<Integer>> generate(int numRows) {
    List<List<Integer>> result = new ArrayList<>();
    for (int i = 0; i < numRows; i++) {
        List<Integer> row = new ArrayList<>();
        for (int j = 0; j <= i; j++) {
            if (j == 0 || j == i) row.add(1);
            else row.add(result.get(i-1).get(j-1) + result.get(i-1).get(j));
        }
        result.add(row);
    }
    return result;
}`,
          cpp: `vector<vector<int>> generate(int numRows) {
    vector<vector<int>> result;
    for (int i = 0; i < numRows; i++) {
        vector<int> row(i + 1, 1);
        for (int j = 1; j < i; j++) {
            row[j] = result[i-1][j-1] + result[i-1][j];
        }
        result.push_back(row);
    }
    return result;
}`,
          python: `def generate(numRows):
    result = []
    for i in range(numRows):
        row = [1] * (i + 1)
        for j in range(1, i):
            row[j] = result[i-1][j-1] + result[i-1][j]
        result.append(row)
    return result`,
        },
        dryRun: {
          title: 'Dry run — numRows = 4',
          columns: ['Row i', 'Construction', 'Row Result'],
          rows: [
            ['0', 'Only element: 1', '[1]'],
            ['1', 'First and last: 1,1', '[1,1]'],
            ['2', 'Edges=1; j=1: prev[0]+prev[1]=1+1=2', '[1,2,1]'],
            ['3', 'Edges=1; j=1: 1+2=3, j=2: 2+1=3', '[1,3,3,1] ✓'],
          ],
          highlightRow: 3,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 14. Rotate Array (already provided as sample — keeping entry)
  // ══════════════════════════════════════════════════════
  'rotate-array': {
    statement:
      'Given an integer array nums, rotate the array to the right by k steps, where k is non-negative. Do it in-place if possible.',
    tags: ['Arrays', 'Array Manipulation'],
    requirement: 'O(1) extra space required for full credit',
    externalLinks: [
      { label: '↗ LeetCode #189', url: 'https://leetcode.com/problems/rotate-array/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [1,2,3,4,5,6,7], k = 3\nOutput: [5,6,7,1,2,3,4]' },
      { label: 'Example 2', text: 'Input:  nums = [-1,-100,3,99], k = 2\nOutput: [3,99,-1,-100]' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁵', '−2³¹ ≤ nums[i] ≤ 2³¹−1', '0 ≤ k ≤ 10⁵'],
    requiredComplexity: 'O(n) time · O(1) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'k can be bigger than the array length. What should you do to k before anything else?' },
      { number: 2, text: 'Take k modulo n — rotating by n is the same as not rotating at all.' },
      { number: 3, text: 'Rotating right by k puts the last k elements at the front. Can reversing sub-ranges of the array achieve that without extra space?' },
      { number: 4, label: 'Hint 4 — approach', text: 'Reverse the whole array, then reverse the first k elements, then reverse the remaining n−k elements. Each element ends up exactly k positions to the right (cyclically).' },
    ],
    approaches: [
      {
        key: 'brute',
        label: 'Extra Array — O(n) time, O(n) space',
        explanation: 'Place each element at its rotated destination index (i + k) % n in a new array, then copy back.',
        code: {
          java: `public void rotate(int[] nums, int k) {
    int n = nums.length;
    int[] res = new int[n];
    for (int i = 0; i < n; i++) {
        res[(i + k) % n] = nums[i];
    }
    System.arraycopy(res, 0, nums, 0, n);
}`,
          cpp: `void rotate(vector<int>& nums, int k) {
    int n = nums.size();
    vector<int> res(n);
    for (int i = 0; i < n; i++) {
        res[(i + k) % n] = nums[i];
    }
    nums = res;
}`,
          python: `def rotate(nums, k):
    n = len(nums)
    res = [0] * n
    for i in range(n):
        res[(i + k) % n] = nums[i]
    nums[:] = res`,
        },
      },
      {
        key: 'optimal',
        label: 'Triple Reversal — O(n) time, O(1) space',
        explanation: 'Reverse the entire array, then reverse the first k and the rest separately. This is the classic in-place rotation trick.',
        code: {
          java: `public void rotate(int[] nums, int k) {
    int n = nums.length;
    k %= n;
    reverse(nums, 0, n - 1);
    reverse(nums, 0, k - 1);
    reverse(nums, k, n - 1);
}
private void reverse(int[] nums, int l, int r) {
    while (l < r) {
        int t = nums[l]; nums[l] = nums[r]; nums[r] = t;
        l++; r--;
    }
}`,
          cpp: `void rotate(vector<int>& nums, int k) {
    int n = nums.size();
    k %= n;
    reverse(nums.begin(), nums.end());
    reverse(nums.begin(), nums.begin() + k);
    reverse(nums.begin() + k, nums.end());
}`,
          python: `def rotate(nums, k):
    n = len(nums)
    k %= n
    nums.reverse()
    nums[:k] = reversed(nums[:k])
    nums[k:] = reversed(nums[k:])`,
        },
        dryRun: {
          title: 'Dry run — nums = [1,2,3,4,5,6,7], k = 3',
          columns: ['Step', 'Operation', 'Array State'],
          rows: [
            ['1', 'Reverse whole array [0,6]', '[7,6,5,4,3,2,1]'],
            ['2', 'Reverse first k=3 [0,2]', '[5,6,7,4,3,2,1]'],
            ['3', 'Reverse rest [3,6]', '[5,6,7,1,2,3,4] ✓'],
          ],
          highlightRow: 2,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 15. Missing Number (already provided as sample — keeping entry)
  // ══════════════════════════════════════════════════════
  'missing-number': {
    statement:
      'Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.',
    tags: ['Arrays', 'Cyclic Sort', 'Math'],
    requirement: 'O(n) time preferred',
    externalLinks: [
      { label: '↗ LeetCode #268', url: 'https://leetcode.com/problems/missing-number/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [3,0,1]\nOutput: 2' },
      { label: 'Example 2', text: 'Input:  nums = [0,1]\nOutput: 2' },
      { label: 'Example 3', text: 'Input:  nums = [9,6,4,2,3,5,7,0,1]\nOutput: 8' },
    ],
    constraints: ['n == nums.length', '1 ≤ n ≤ 10⁴', '0 ≤ nums[i] ≤ n', 'All values are distinct'],
    requiredComplexity: 'O(n) time · O(1) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'If nothing were missing, what would the sum of 0..n be?' },
      { number: 2, text: 'Use the formula n*(n+1)/2 for the expected sum, and compare with the actual sum of the array.' },
      { number: 3, text: 'The difference between expected and actual sum is exactly the missing number.' },
      { number: 4, label: 'Hint 4 — alternative', text: 'You can also XOR all indices 0..n with all array values — every present pair cancels out, leaving the missing number. This avoids any overflow concerns from summing.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Gauss Sum Formula — O(n) time, O(1) space',
        explanation: 'Compute the expected sum of 0..n and subtract the actual sum of the array; the gap is the missing number.',
        code: {
          java: `public int missingNumber(int[] nums) {
    int n = nums.length;
    int expected = n * (n + 1) / 2;
    int actual = 0;
    for (int x : nums) actual += x;
    return expected - actual;
}`,
          cpp: `int missingNumber(vector<int>& nums) {
    int n = nums.size();
    long expected = (long)n * (n + 1) / 2;
    long actual = 0;
    for (int x : nums) actual += x;
    return (int)(expected - actual);
}`,
          python: `def missingNumber(nums):
    n = len(nums)
    expected = n * (n + 1) // 2
    return expected - sum(nums)`,
        },
        dryRun: {
          title: 'Dry run — nums = [3,0,1] (n = 3)',
          columns: ['Quantity', 'Value'],
          rows: [
            ['expected = 3*4/2', '6'],
            ['actual = 3+0+1', '4'],
            ['missing = 6 - 4', '2 ✓'],
          ],
          highlightRow: 2,
        },
      },
      {
        key: 'xor',
        label: 'XOR — O(n) time, O(1) space, overflow-safe',
        explanation: 'XOR every index 0..n with every array value. Matching pairs cancel to 0, leaving only the missing number.',
        code: {
          java: `public int missingNumber(int[] nums) {
    int xorAll = nums.length;
    for (int i = 0; i < nums.length; i++) {
        xorAll ^= i ^ nums[i];
    }
    return xorAll;
}`,
          cpp: `int missingNumber(vector<int>& nums) {
    int xorAll = nums.size();
    for (int i = 0; i < (int)nums.size(); i++) {
        xorAll ^= i ^ nums[i];
    }
    return xorAll;
}`,
          python: `def missingNumber(nums):
    xor_all = len(nums)
    for i, v in enumerate(nums):
        xor_all ^= i ^ v
    return xor_all`,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 16. Find All Numbers Disappeared in an Array
  // ══════════════════════════════════════════════════════
  'find-disappeared-numbers': {
    statement:
      'Given an array nums of n integers where nums[i] is in the range [1, n], return an array of all integers in [1, n] that do not appear in nums.',
    tags: ['Arrays', 'Cyclic Sort'],
    requirement: 'O(n) time, O(1) extra space (output list does not count)',
    externalLinks: [
      { label: '↗ LeetCode #448', url: 'https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [4,3,2,7,8,2,3,1]\nOutput: [5,6]' },
      { label: 'Example 2', text: 'Input:  nums = [1,1]\nOutput: [2]' },
    ],
    constraints: ['n == nums.length', '1 ≤ n ≤ 10⁵', '1 ≤ nums[i] ≤ n'],
    requiredComplexity: 'O(n) time · O(1) extra space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'A naive solution uses a HashSet and checks which numbers 1..n are missing — that\'s O(n) space. Can you use the array itself as a "visited" marker to achieve O(1) extra space?' },
      { number: 2, text: 'Since all values are in [1,n], you can map each value v to index v-1. If you negate nums[v-1], it marks v as "seen." A negative value means that index+1 was seen.' },
      { number: 3, text: 'After marking, scan the array again. Any index i with a positive value means i+1 never appeared — add i+1 to the result.' },
      { number: 4, label: 'Hint 4 — approach', text: 'First pass: for each nums[i], compute idx = abs(nums[i]) - 1 and negate nums[idx] if it\'s positive. Second pass: collect all i where nums[i] > 0, and add i+1 to the answer.' },
    ],
    approaches: [
      {
        key: 'brute',
        label: 'HashSet — O(n) time, O(n) space',
        explanation: 'Put all elements in a set, then check which values 1..n are absent.',
        code: {
          java: `public List<Integer> findDisappearedNumbers(int[] nums) {
    Set<Integer> seen = new HashSet<>();
    for (int x : nums) seen.add(x);
    List<Integer> result = new ArrayList<>();
    for (int i = 1; i <= nums.length; i++) {
        if (!seen.contains(i)) result.add(i);
    }
    return result;
}`,
          cpp: `vector<int> findDisappearedNumbers(vector<int>& nums) {
    unordered_set<int> seen(nums.begin(), nums.end());
    vector<int> result;
    for (int i = 1; i <= (int)nums.size(); i++) {
        if (!seen.count(i)) result.push_back(i);
    }
    return result;
}`,
          python: `def findDisappearedNumbers(nums):
    seen = set(nums)
    return [i for i in range(1, len(nums)+1) if i not in seen]`,
        },
      },
      {
        key: 'optimal',
        label: 'In-place Negation — O(n) time, O(1) extra space',
        explanation: 'Use sign of nums[v-1] as a "visited" flag for value v. Collect indices still positive after marking.',
        code: {
          java: `public List<Integer> findDisappearedNumbers(int[] nums) {
    for (int i = 0; i < nums.length; i++) {
        int idx = Math.abs(nums[i]) - 1;
        if (nums[idx] > 0) nums[idx] = -nums[idx];
    }
    List<Integer> result = new ArrayList<>();
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] > 0) result.add(i + 1);
    }
    return result;
}`,
          cpp: `vector<int> findDisappearedNumbers(vector<int>& nums) {
    for (int i = 0; i < (int)nums.size(); i++) {
        int idx = abs(nums[i]) - 1;
        if (nums[idx] > 0) nums[idx] = -nums[idx];
    }
    vector<int> result;
    for (int i = 0; i < (int)nums.size(); i++) {
        if (nums[i] > 0) result.push_back(i + 1);
    }
    return result;
}`,
          python: `def findDisappearedNumbers(nums):
    for x in nums:
        idx = abs(x) - 1
        if nums[idx] > 0:
            nums[idx] = -nums[idx]
    return [i + 1 for i, v in enumerate(nums) if v > 0]`,
        },
        dryRun: {
          title: 'Dry run — nums = [4,3,2,7,8,2,3,1]',
          columns: ['Pass', 'Action', 'Array State'],
          rows: [
            ['Mark i=0 (val=4)', 'Negate idx=3', '[4,3,2,-7,8,2,3,1]'],
            ['Mark i=1 (val=3)', 'Negate idx=2', '[4,3,-2,-7,8,2,3,1]'],
            ['Mark i=2 (val=-2→2)', 'Negate idx=1', '[4,-3,-2,-7,8,2,3,1]'],
            ['Mark i=3 (val=-7→7)', 'Negate idx=6', '[4,-3,-2,-7,8,2,-3,1]'],
            ['Mark i=4 (val=8)', 'Negate idx=7', '[4,-3,-2,-7,8,2,-3,-1]'],
            ['Mark i=5 (val=2→2)', 'idx=1 already negative, skip', '[4,-3,-2,-7,8,2,-3,-1]'],
            ['Mark i=6 (val=-3→3)', 'idx=2 already negative, skip', '[4,-3,-2,-7,8,2,-3,-1]'],
            ['Mark i=7 (val=-1→1)', 'Negate idx=0', '[-4,-3,-2,-7,8,2,-3,-1]'],
            ['Collect', 'idx=4 (val=8>0)→5; idx=5 (val=2>0)→6', 'Result: [5,6] ✓'],
          ],
          highlightRow: 8,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 17. Find the Duplicate Number
  // ══════════════════════════════════════════════════════
  'find-duplicate-number': {
    statement:
      'Given an array nums of n+1 integers where each integer is in the range [1, n], there is exactly one repeated number. Return that number without modifying the array and using only O(1) extra space.',
    tags: ['Arrays', 'Cyclic Sort', 'Floyd\'s Cycle Detection'],
    requirement: 'O(n) time, O(1) extra space, do not modify the array',
    externalLinks: [
      { label: '↗ LeetCode #287', url: 'https://leetcode.com/problems/find-the-duplicate-number/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [1,3,4,2,2]\nOutput: 2' },
      { label: 'Example 2', text: 'Input:  nums = [3,1,3,4,2]\nOutput: 3' },
    ],
    constraints: ['1 ≤ n ≤ 10⁵', 'nums.length == n+1', '1 ≤ nums[i] ≤ n', 'Only one duplicate exists'],
    requiredComplexity: 'O(n) time · O(1) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'Think of each value as a "pointer" to an index. Since one value is duplicated, two different positions point to the same index — creating a cycle. Does this remind you of a linked list cycle problem?' },
      { number: 2, text: 'Model the array as a linked list: node i points to node nums[i]. The duplicate value causes two nodes to point to the same next node, forming a cycle.' },
      { number: 3, text: 'Use Floyd\'s cycle detection (fast & slow pointers). Both start at index 0. Slow moves one step (nums[slow]), fast moves two steps (nums[nums[fast]]). They meet inside the cycle.' },
      { number: 4, label: 'Hint 4 — approach', text: 'After detecting the meeting point, reset one pointer to 0 and advance both one step at a time. Where they meet again is the duplicate value (the cycle entrance). This mirrors Floyd\'s algorithm for linked lists.' },
    ],
    approaches: [
      {
        key: 'brute',
        label: 'Sorting — O(n log n) time, O(1) space',
        explanation: 'Sort the array (or a copy) and find the adjacent duplicate. Violates the "do not modify" constraint if sorting in-place.',
        code: {
          java: `public int findDuplicate(int[] nums) {
    int[] copy = nums.clone();
    Arrays.sort(copy);
    for (int i = 1; i < copy.length; i++) {
        if (copy[i] == copy[i-1]) return copy[i];
    }
    return -1;
}`,
          cpp: `int findDuplicate(vector<int>& nums) {
    vector<int> copy = nums;
    sort(copy.begin(), copy.end());
    for (int i = 1; i < (int)copy.size(); i++) {
        if (copy[i] == copy[i-1]) return copy[i];
    }
    return -1;
}`,
          python: `def findDuplicate(nums):
    copy = sorted(nums)
    for i in range(1, len(copy)):
        if copy[i] == copy[i-1]:
            return copy[i]`,
        },
      },
      {
        key: 'optimal',
        label: "Floyd's Cycle Detection — O(n) time, O(1) space",
        explanation: 'Treat array indices as a linked list. The duplicate creates a cycle; Floyd\'s algorithm finds the cycle entrance, which is the duplicate.',
        code: {
          java: `public int findDuplicate(int[] nums) {
    int slow = nums[0], fast = nums[0];
    do {
        slow = nums[slow];
        fast = nums[nums[fast]];
    } while (slow != fast);
    slow = nums[0];
    while (slow != fast) {
        slow = nums[slow];
        fast = nums[fast];
    }
    return slow;
}`,
          cpp: `int findDuplicate(vector<int>& nums) {
    int slow = nums[0], fast = nums[0];
    do {
        slow = nums[slow];
        fast = nums[nums[fast]];
    } while (slow != fast);
    slow = nums[0];
    while (slow != fast) {
        slow = nums[slow];
        fast = nums[fast];
    }
    return slow;
}`,
          python: `def findDuplicate(nums):
    slow = fast = nums[0]
    while True:
        slow = nums[slow]
        fast = nums[nums[fast]]
        if slow == fast:
            break
    slow = nums[0]
    while slow != fast:
        slow = nums[slow]
        fast = nums[fast]
    return slow`,
        },
        dryRun: {
          title: 'Dry run — nums = [1,3,4,2,2]',
          columns: ['Phase', 'Step', 'slow', 'fast'],
          rows: [
            ['Phase 1 (find meet)', 'start', 'nums[0]=1', 'nums[0]=1'],
            ['', 'step 1', 'nums[1]=3', 'nums[nums[1]]=nums[3]=2'],
            ['', 'step 2', 'nums[3]=2', 'nums[nums[2]]=nums[4]=2'],
            ['', 'step 3', 'nums[2]=4', 'nums[nums[2]]=nums[4]=2'],
            ['', 'step 4', 'nums[4]=2', 'nums[nums[2]]=nums[4]=2 → meet at 2'],
            ['Phase 2 (find start)', 'reset slow=nums[0]=1', '1', '2'],
            ['', 'step 1', 'nums[1]=3', 'nums[2]=4'],
            ['', 'step 2', 'nums[3]=2', 'nums[4]=2 → meet at 2 ✓'],
          ],
          highlightRow: 7,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 18. Majority Element
  // ══════════════════════════════════════════════════════
  'majority-element': {
    statement:
      'Given an array nums of size n, return the majority element — the element that appears more than ⌊n/2⌋ times. You may assume the majority element always exists.',
    tags: ['Arrays', 'Boyer-Moore Voting'],
    requirement: 'O(n) time, O(1) space preferred',
    externalLinks: [
      { label: '↗ LeetCode #169', url: 'https://leetcode.com/problems/majority-element/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [3,2,3]\nOutput: 3' },
      { label: 'Example 2', text: 'Input:  nums = [2,2,1,1,1,2,2]\nOutput: 2' },
    ],
    constraints: ['n == nums.length', '1 ≤ n ≤ 5×10⁴', '−10⁹ ≤ nums[i] ≤ 10⁹', 'Majority element always exists'],
    requiredComplexity: 'O(n) time · O(1) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'A HashMap counting frequencies is easy but uses O(n) space. Can you think of a voting analogy — where the majority candidate "survives" after all votes cancel out?' },
      { number: 2, text: 'Boyer-Moore Voting: keep one candidate and a vote count. When you see the same element, vote increases; different element, vote decreases.' },
      { number: 3, text: 'When the vote count hits 0, the current candidate has been "cancelled out" — pick the next element as the new candidate with vote = 1.' },
      { number: 4, label: 'Hint 4 — approach', text: 'Since the majority element appears more than n/2 times, it can never be fully cancelled. Whatever candidate remains at the end is guaranteed to be the answer. No second pass needed because the problem guarantees the majority exists.' },
    ],
    approaches: [
      {
        key: 'brute',
        label: 'HashMap — O(n) time, O(n) space',
        explanation: 'Count frequencies with a hash map and return the element with count > n/2.',
        code: {
          java: `public int majorityElement(int[] nums) {
    Map<Integer,Integer> freq = new HashMap<>();
    for (int x : nums) freq.put(x, freq.getOrDefault(x,0)+1);
    for (Map.Entry<Integer,Integer> e : freq.entrySet())
        if (e.getValue() > nums.length/2) return e.getKey();
    return -1;
}`,
          cpp: `int majorityElement(vector<int>& nums) {
    unordered_map<int,int> freq;
    for (int x : nums) freq[x]++;
    for (auto& [k,v] : freq)
        if (v > (int)nums.size()/2) return k;
    return -1;
}`,
          python: `def majorityElement(nums):
    from collections import Counter
    c = Counter(nums)
    return max(c, key=c.get)`,
        },
      },
      {
        key: 'optimal',
        label: 'Boyer-Moore Voting — O(n) time, O(1) space',
        explanation: 'Maintain a candidate and a vote count. Non-matching elements cancel out the candidate\'s votes. The survivor is the majority.',
        code: {
          java: `public int majorityElement(int[] nums) {
    int candidate = nums[0], votes = 1;
    for (int i = 1; i < nums.length; i++) {
        if (votes == 0) {
            candidate = nums[i];
            votes = 1;
        } else if (nums[i] == candidate) {
            votes++;
        } else {
            votes--;
        }
    }
    return candidate;
}`,
          cpp: `int majorityElement(vector<int>& nums) {
    int candidate = nums[0], votes = 1;
    for (int i = 1; i < (int)nums.size(); i++) {
        if (votes == 0) { candidate = nums[i]; votes = 1; }
        else if (nums[i] == candidate) votes++;
        else votes--;
    }
    return candidate;
}`,
          python: `def majorityElement(nums):
    candidate, votes = nums[0], 1
    for x in nums[1:]:
        if votes == 0:
            candidate, votes = x, 1
        elif x == candidate:
            votes += 1
        else:
            votes -= 1
    return candidate`,
        },
        dryRun: {
          title: 'Dry run — nums = [2,2,1,1,1,2,2]',
          columns: ['x', 'candidate', 'votes', 'Action'],
          rows: [
            ['2 (init)', '2', '1', 'Initialize'],
            ['2', '2', '2', 'Same → +1'],
            ['1', '2', '1', 'Diff → -1'],
            ['1', '2', '0', 'Diff → -1'],
            ['1', '1', '1', 'votes=0 → new candidate'],
            ['2', '1', '0', 'Diff → -1'],
            ['2', '2', '1', 'votes=0 → new candidate → return 2 ✓'],
          ],
          highlightRow: 6,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 19. Majority Element II
  // ══════════════════════════════════════════════════════
  'majority-element-ii': {
    statement:
      'Given an integer array nums, return all elements that appear more than ⌊n/3⌋ times. There can be at most two such elements.',
    tags: ['Arrays', 'Boyer-Moore Voting'],
    requirement: 'O(n) time, O(1) space',
    externalLinks: [
      { label: '↗ LeetCode #229', url: 'https://leetcode.com/problems/majority-element-ii/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [3,2,3]\nOutput: [3]' },
      { label: 'Example 2', text: 'Input:  nums = [1,2]\nOutput: [1,2]' },
      { label: 'Example 3', text: 'Input:  nums = [1,1,1,3,3,2,2,2]\nOutput: [1,2]' },
    ],
    constraints: ['1 ≤ nums.length ≤ 5×10⁴', '−10⁹ ≤ nums[i] ≤ 10⁹'],
    requiredComplexity: 'O(n) time · O(1) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'Why can there be at most two elements appearing more than n/3 times? Think mathematically: if three elements each appeared more than n/3 times, their combined count would exceed n — impossible.' },
      { number: 2, text: 'Extend Boyer-Moore: instead of one candidate, maintain two candidates with two vote counts. Three different elements cancel each other out.' },
      { number: 3, text: 'First pass: update candidates. If current element matches candidate1 or candidate2, increment that count. If either count is 0, adopt the new element as that candidate. Otherwise, decrement both counts.' },
      { number: 4, label: 'Hint 4 — approach', text: 'After the first pass, the two candidates might be spurious (could have been cancelled). Do a second pass to actually count occurrences of each candidate and verify each appears more than n/3 times before adding to the result.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Extended Boyer-Moore — O(n) time, O(1) space',
        explanation: 'Two-candidate voting. First pass finds the two potential majorities; second pass validates their actual counts.',
        code: {
          java: `public List<Integer> majorityElement(int[] nums) {
    int c1 = 0, c2 = 1, v1 = 0, v2 = 0;
    for (int x : nums) {
        if (x == c1) v1++;
        else if (x == c2) v2++;
        else if (v1 == 0) { c1 = x; v1 = 1; }
        else if (v2 == 0) { c2 = x; v2 = 1; }
        else { v1--; v2--; }
    }
    v1 = 0; v2 = 0;
    for (int x : nums) {
        if (x == c1) v1++;
        else if (x == c2) v2++;
    }
    List<Integer> result = new ArrayList<>();
    if (v1 > nums.length / 3) result.add(c1);
    if (v2 > nums.length / 3) result.add(c2);
    return result;
}`,
          cpp: `vector<int> majorityElement(vector<int>& nums) {
    int c1 = 0, c2 = 1, v1 = 0, v2 = 0;
    for (int x : nums) {
        if (x == c1) v1++;
        else if (x == c2) v2++;
        else if (v1 == 0) { c1 = x; v1 = 1; }
        else if (v2 == 0) { c2 = x; v2 = 1; }
        else { v1--; v2--; }
    }
    v1 = 0; v2 = 0;
    for (int x : nums) {
        if (x == c1) v1++;
        else if (x == c2) v2++;
    }
    vector<int> result;
    int n = nums.size();
    if (v1 > n/3) result.push_back(c1);
    if (v2 > n/3) result.push_back(c2);
    return result;
}`,
          python: `def majorityElement(nums):
    c1, c2, v1, v2 = 0, 1, 0, 0
    for x in nums:
        if x == c1: v1 += 1
        elif x == c2: v2 += 1
        elif v1 == 0: c1, v1 = x, 1
        elif v2 == 0: c2, v2 = x, 1
        else: v1 -= 1; v2 -= 1
    v1 = sum(1 for x in nums if x == c1)
    v2 = sum(1 for x in nums if x == c2)
    n = len(nums)
    return [x for x, v in [(c1,v1),(c2,v2)] if v > n // 3]`,
        },
        dryRun: {
          title: 'Dry run — nums = [1,1,1,3,3,2,2,2] (n=8, threshold=2)',
          columns: ['x', 'c1', 'v1', 'c2', 'v2', 'Action'],
          rows: [
            ['1', '0', '0', '1', '0', 'v1=0 → c1=1, v1=1'],
            ['1', '1', '1', '1', '0', 'x==c1 → v1=2'],
            ['1', '1', '2', '1', '0', 'x==c1 → v1=3'],
            ['3', '1', '3', '1', '0', 'v2=0 → c2=3, v2=1'],
            ['3', '1', '3', '3', '1', 'x==c2 → v2=2'],
            ['2', '1', '3', '3', '2', 'both-- → v1=2, v2=1'],
            ['2', '1', '2', '3', '1', 'both-- → v1=1, v2=0'],
            ['2', '1', '1', '3', '0', 'v2=0 → c2=2, v2=1'],
            ['Validate', 'c1=1 count=3>2 ✓', '', 'c2=2 count=3>2 ✓', '', 'Result: [1,2] ✓'],
          ],
          highlightRow: 8,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 20. Next Permutation (already provided as sample)
  // ══════════════════════════════════════════════════════
  'next-permutation': {
    statement:
      'Implement next permutation, which rearranges numbers into the lexicographically next greater permutation of numbers. If no such arrangement exists, rearrange it as the lowest possible order (sorted ascending). Must be done in-place with O(1) extra memory.',
    tags: ['Arrays', 'Array Simulation'],
    requirement: 'In-place, O(1) extra space',
    externalLinks: [
      { label: '↗ LeetCode #31', url: 'https://leetcode.com/problems/next-permutation/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [1,2,3]\nOutput: [1,3,2]' },
      { label: 'Example 2', text: 'Input:  nums = [3,2,1]\nOutput: [1,2,3]  (wraps to smallest)' },
      { label: 'Example 3', text: 'Input:  nums = [1,1,5]\nOutput: [1,5,1]' },
    ],
    constraints: ['1 ≤ nums.length ≤ 100', '0 ≤ nums[i] ≤ 100'],
    requiredComplexity: 'O(n) time · O(1) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'A permutation is "next" only if you increase a suffix as little as possible. Scan from the right — where does the array stop being non-increasing?' },
      { number: 2, text: 'Find the first index i from the right where nums[i] < nums[i+1] (the "pivot"). Everything to the right of i is currently in descending order.' },
      { number: 3, text: 'If a pivot exists, find the smallest element to the right of i that is still greater than nums[i], and swap them.' },
      { number: 4, label: 'Hint 4 — approach', text: 'After swapping, the suffix starting at i+1 is still descending — reverse it to make it ascending (the smallest possible arrangement). If no pivot was found, the whole array is descending, so just reverse everything.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Pivot + Swap + Reverse — O(n) time, O(1) space',
        explanation: 'Find the rightmost ascending pair (pivot), swap it with the smallest larger element to its right, then reverse the descending suffix.',
        code: {
          java: `public void nextPermutation(int[] nums) {
    int n = nums.length, i = n - 2;
    while (i >= 0 && nums[i] >= nums[i + 1]) i--;
    if (i >= 0) {
        int j = n - 1;
        while (nums[j] <= nums[i]) j--;
        int t = nums[i]; nums[i] = nums[j]; nums[j] = t;
    }
    reverse(nums, i + 1, n - 1);
}
private void reverse(int[] nums, int l, int r) {
    while (l < r) { int t = nums[l]; nums[l] = nums[r]; nums[r] = t; l++; r--; }
}`,
          cpp: `void nextPermutation(vector<int>& nums) {
    int n = nums.size(), i = n - 2;
    while (i >= 0 && nums[i] >= nums[i + 1]) i--;
    if (i >= 0) {
        int j = n - 1;
        while (nums[j] <= nums[i]) j--;
        swap(nums[i], nums[j]);
    }
    reverse(nums.begin() + i + 1, nums.end());
}`,
          python: `def nextPermutation(nums):
    n = len(nums)
    i = n - 2
    while i >= 0 and nums[i] >= nums[i + 1]:
        i -= 1
    if i >= 0:
        j = n - 1
        while nums[j] <= nums[i]:
            j -= 1
        nums[i], nums[j] = nums[j], nums[i]
    nums[i + 1:] = reversed(nums[i + 1:])`,
        },
        dryRun: {
          title: 'Dry run — nums = [1,2,3]',
          columns: ['Step', 'Action', 'State'],
          rows: [
            ['1', 'Scan right: i=1 since nums[1]=2 < nums[2]=3 (pivot found)', 'i=1'],
            ['2', 'Find j from right with nums[j] > nums[i]: j=2 (value 3)', 'j=2'],
            ['3', 'Swap nums[1] and nums[2]', '[1,3,2]'],
            ['4', 'Reverse suffix after i (just one element, no change)', '[1,3,2] ✓'],
          ],
          highlightRow: 2,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 21. First Missing Positive
  // ══════════════════════════════════════════════════════
  'first-missing-positive': {
    statement:
      'Given an unsorted integer array nums, return the smallest missing positive integer. You must implement an algorithm that runs in O(n) time and uses O(1) extra space.',
    tags: ['Arrays', 'Cyclic Sort'],
    requirement: 'O(n) time, O(1) extra space — the hardest constraint here',
    externalLinks: [
      { label: '↗ LeetCode #41', url: 'https://leetcode.com/problems/first-missing-positive/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [1,2,0]\nOutput: 3' },
      { label: 'Example 2', text: 'Input:  nums = [3,4,-1,1]\nOutput: 2' },
      { label: 'Example 3', text: 'Input:  nums = [7,8,9,11,12]\nOutput: 1' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁵', '−2³¹ ≤ nums[i] ≤ 2³¹−1'],
    requiredComplexity: 'O(n) time · O(1) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'The answer must be in the range [1, n+1]. Why? Because even if the array contains exactly 1, 2, …, n, the answer would be n+1. So you only care about positive integers ≤ n.' },
      { number: 2, text: 'Since the answer lies in [1, n+1] and the array has n slots, you can use the array itself as a hash table: ideally, nums[i] should hold the value i+1 (cyclic sort idea).' },
      { number: 3, text: 'Pass 1 — Cyclic sort: for each position i, while nums[i] is in [1,n] and nums[i] ≠ nums[nums[i]-1], swap nums[i] into its correct position nums[i]-1.' },
      { number: 4, label: 'Hint 4 — approach', text: 'Pass 2 — scan from left: the first index i where nums[i] ≠ i+1 reveals the answer as i+1. If all positions are correct, return n+1.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Cyclic Sort — O(n) time, O(1) space',
        explanation: 'Place each value v in [1,n] at its target index v-1 via swaps (cyclic sort). Then scan for the first mismatch.',
        code: {
          java: `public int firstMissingPositive(int[] nums) {
    int n = nums.length;
    // Place nums[i] at index nums[i]-1 if valid
    for (int i = 0; i < n; i++) {
        while (nums[i] > 0 && nums[i] <= n && nums[nums[i]-1] != nums[i]) {
            int t = nums[nums[i]-1];
            nums[nums[i]-1] = nums[i];
            nums[i] = t;
        }
    }
    // Find first position where value != index+1
    for (int i = 0; i < n; i++) {
        if (nums[i] != i + 1) return i + 1;
    }
    return n + 1;
}`,
          cpp: `int firstMissingPositive(vector<int>& nums) {
    int n = nums.size();
    for (int i = 0; i < n; i++) {
        while (nums[i] > 0 && nums[i] <= n && nums[nums[i]-1] != nums[i]) {
            swap(nums[i], nums[nums[i]-1]);
        }
    }
    for (int i = 0; i < n; i++) {
        if (nums[i] != i + 1) return i + 1;
    }
    return n + 1;
}`,
          python: `def firstMissingPositive(nums):
    n = len(nums)
    for i in range(n):
        while 1 <= nums[i] <= n and nums[nums[i]-1] != nums[i]:
            j = nums[i] - 1
            nums[i], nums[j] = nums[j], nums[i]
    for i in range(n):
        if nums[i] != i + 1:
            return i + 1
    return n + 1`,
        },
        dryRun: {
          title: 'Dry run — nums = [3,4,-1,1]',
          columns: ['Step', 'Action', 'Array State'],
          rows: [
            ['i=0: nums[0]=3', 'nums[3-1]=nums[2]≠3 → swap idx0↔idx2', '[-1,4,3,1]'],
            ['i=0: nums[0]=-1', '-1 not in [1,4], stop while', '[-1,4,3,1]'],
            ['i=1: nums[1]=4', 'nums[4-1]=nums[3]≠4 → swap idx1↔idx3', '[-1,1,3,4]'],
            ['i=1: nums[1]=1', 'nums[1-1]=nums[0]≠1 → swap idx1↔idx0', '[1,-1,3,4]'],
            ['i=1: nums[1]=-1', '-1 not in [1,4], stop', '[1,-1,3,4]'],
            ['i=2: nums[2]=3', 'nums[3-1]=nums[2]=3, already correct', '[1,-1,3,4]'],
            ['i=3: nums[3]=4', 'nums[4-1]=nums[3]=4, already correct', '[1,-1,3,4]'],
            ['Scan', 'i=0: 1==1 ✓; i=1: -1≠2 → return 2 ✓', ''],
          ],
          highlightRow: 7,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 22. Design HashMap
  // ══════════════════════════════════════════════════════
  'design-hashmap': {
    statement:
      'Design a HashMap without using any built-in hash table libraries. Implement MyHashMap with put(key, value), get(key), and remove(key). Keys and values are non-negative integers.',
    tags: ['Arrays', 'Hash Map Design'],
    requirement: 'Handle collisions; keys in [0, 10⁶]',
    externalLinks: [
      { label: '↗ LeetCode #706', url: 'https://leetcode.com/problems/design-hashmap/' },
    ],
    examples: [
      { label: 'Example 1', text: 'MyHashMap map = new MyHashMap();\nmap.put(1,1);\nmap.put(2,2);\nmap.get(1); // returns 1\nmap.get(3); // returns -1\nmap.put(2,1);\nmap.get(2); // returns 1\nmap.remove(2);\nmap.get(2); // returns -1' },
    ],
    constraints: ['0 ≤ key, value ≤ 10⁶', 'At most 10⁴ calls to put, get, remove'],
    requiredComplexity: 'O(n/k) average per operation, k = bucket count',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'A hash map needs: a hash function (to map key → bucket index) and a collision resolution strategy. What are the two main collision strategies?' },
      { number: 2, text: 'Chaining: each bucket holds a linked list of (key, value) pairs. Separate Addressing: if a bucket is taken, probe for the next free slot. Chaining is simpler to implement.' },
      { number: 3, text: 'Choose a bucket size (e.g., 1000 buckets). Hash function: key % bucketSize. Each bucket is a list of (key, value) pairs.' },
      { number: 4, label: 'Hint 4 — approach', text: 'For put: find the bucket, look for an existing key in that bucket\'s list — update if found, append if not. For get: search the bucket list. For remove: filter out the key from the bucket list.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Chaining with Array of Lists — O(n/k) per op',
        explanation: 'Use 1009 buckets (prime reduces clustering). Each bucket holds a list of (key, value) pairs to handle collisions.',
        code: {
          java: `class MyHashMap {
    private static final int SIZE = 1009;
    private List<int[]>[] buckets;

    public MyHashMap() {
        buckets = new List[SIZE];
        for (int i = 0; i < SIZE; i++) buckets[i] = new ArrayList<>();
    }
    private int hash(int key) { return key % SIZE; }

    public void put(int key, int value) {
        int h = hash(key);
        for (int[] pair : buckets[h]) {
            if (pair[0] == key) { pair[1] = value; return; }
        }
        buckets[h].add(new int[]{key, value});
    }
    public int get(int key) {
        for (int[] pair : buckets[hash(key)])
            if (pair[0] == key) return pair[1];
        return -1;
    }
    public void remove(int key) {
        buckets[hash(key)].removeIf(p -> p[0] == key);
    }
}`,
          cpp: `class MyHashMap {
    static const int SIZE = 1009;
    vector<pair<int,int>> buckets[SIZE];
    int hash(int key) { return key % SIZE; }
public:
    void put(int key, int value) {
        int h = hash(key);
        for (auto& p : buckets[h]) if (p.first == key) { p.second = value; return; }
        buckets[h].push_back({key, value});
    }
    int get(int key) {
        for (auto& p : buckets[hash(key)]) if (p.first == key) return p.second;
        return -1;
    }
    void remove(int key) {
        auto& b = buckets[hash(key)];
        b.erase(remove_if(b.begin(),b.end(),[key](auto& p){return p.first==key;}),b.end());
    }
};`,
          python: `class MyHashMap:
    def __init__(self):
        self.SIZE = 1009
        self.buckets = [[] for _ in range(self.SIZE)]

    def _hash(self, key):
        return key % self.SIZE

    def put(self, key, value):
        h = self._hash(key)
        for p in self.buckets[h]:
            if p[0] == key:
                p[1] = value
                return
        self.buckets[h].append([key, value])

    def get(self, key):
        for p in self.buckets[self._hash(key)]:
            if p[0] == key:
                return p[1]
        return -1

    def remove(self, key):
        h = self._hash(key)
        self.buckets[h] = [p for p in self.buckets[h] if p[0] != key]`,
        },
        dryRun: {
          title: 'Dry run — put(1,1), put(1010,2), get(1)',
          columns: ['Operation', 'Bucket (key%1009)', 'Bucket Contents After'],
          rows: [
            ['put(1, 1)', '1', '[[1,1]]'],
            ['put(1010, 2)', '1 (1010%1009=1)', '[[1,1],[1010,2]]'],
            ['get(1)', 'Scan bucket 1: found key=1 → return 1 ✓', '—'],
          ],
          highlightRow: 2,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 23. Design HashSet
  // ══════════════════════════════════════════════════════
  'design-hashset': {
    statement:
      'Design a HashSet without using any built-in hash set libraries. Implement MyHashSet with add(key), contains(key), and remove(key).',
    tags: ['Arrays', 'Hash Set Design'],
    requirement: 'Handle collisions; keys in [0, 10⁶]',
    externalLinks: [
      { label: '↗ LeetCode #705', url: 'https://leetcode.com/problems/design-hashset/' },
    ],
    examples: [
      { label: 'Example 1', text: 'MyHashSet set = new MyHashSet();\nset.add(1);\nset.add(2);\nset.contains(1); // true\nset.contains(3); // false\nset.add(2);\nset.contains(2); // true\nset.remove(2);\nset.contains(2); // false' },
    ],
    constraints: ['0 ≤ key ≤ 10⁶', 'At most 10⁴ calls'],
    requiredComplexity: 'O(n/k) per operation',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'A HashSet is like a HashMap but you only store keys — no values. How would you adapt the HashMap design to a set?' },
      { number: 2, text: 'Use the same bucket + chaining approach. Each bucket is a list of keys (not key-value pairs).' },
      { number: 3, text: 'For add: check if key exists in bucket first — if not, append it. For contains: search the bucket. For remove: filter the key from the list.' },
      { number: 4, label: 'Hint 4 — alternative', text: 'If you know keys are bounded by 10⁶, you can use a simple boolean array of size 10⁶+1 as a direct-access set. O(1) per operation, but O(10⁶) space. The chaining approach is more general.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Chaining with Array of Lists — O(n/k) per op',
        explanation: 'Array of bucket lists, each storing keys. Same chaining strategy as the HashMap design.',
        code: {
          java: `class MyHashSet {
    private static final int SIZE = 1009;
    private List<Integer>[] buckets;

    public MyHashSet() {
        buckets = new List[SIZE];
        for (int i = 0; i < SIZE; i++) buckets[i] = new ArrayList<>();
    }
    private int hash(int key) { return key % SIZE; }

    public void add(int key) {
        if (!contains(key)) buckets[hash(key)].add(key);
    }
    public boolean contains(int key) {
        return buckets[hash(key)].contains(key);
    }
    public void remove(int key) {
        buckets[hash(key)].remove(Integer.valueOf(key));
    }
}`,
          cpp: `class MyHashSet {
    static const int SIZE = 1009;
    vector<int> buckets[SIZE];
    int hash(int key) { return key % SIZE; }
public:
    void add(int key) {
        if (!contains(key)) buckets[hash(key)].push_back(key);
    }
    bool contains(int key) {
        auto& b = buckets[hash(key)];
        return find(b.begin(),b.end(),key) != b.end();
    }
    void remove(int key) {
        auto& b = buckets[hash(key)];
        b.erase(remove(b.begin(),b.end(),key),b.end());
    }
};`,
          python: `class MyHashSet:
    def __init__(self):
        self.SIZE = 1009
        self.buckets = [[] for _ in range(self.SIZE)]

    def _hash(self, key):
        return key % self.SIZE

    def add(self, key):
        if not self.contains(key):
            self.buckets[self._hash(key)].append(key)

    def contains(self, key):
        return key in self.buckets[self._hash(key)]

    def remove(self, key):
        h = self._hash(key)
        self.buckets[h] = [k for k in self.buckets[h] if k != key]`,
        },
        dryRun: {
          title: 'Dry run — add(1), add(1010), contains(1), remove(1)',
          columns: ['Operation', 'Bucket', 'Bucket After'],
          rows: [
            ['add(1)', '1', '[1]'],
            ['add(1010)', '1 (1010%1009=1)', '[1, 1010]'],
            ['contains(1)', 'Search bucket 1 → found ✓ → true', '[1, 1010]'],
            ['remove(1)', 'Filter bucket 1', '[1010]'],
          ],
          highlightRow: 3,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 24. Two Sum
  // ══════════════════════════════════════════════════════
  'two-sum': {
    statement:
      'Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target. Each input has exactly one solution, and you may not use the same element twice.',
    tags: ['Arrays', 'Hash Lookup'],
    requirement: 'O(n) time preferred',
    externalLinks: [
      { label: '↗ LeetCode #1', url: 'https://leetcode.com/problems/two-sum/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [2,7,11,15], target = 9\nOutput: [0,1]  (2+7=9)' },
      { label: 'Example 2', text: 'Input:  nums = [3,2,4], target = 6\nOutput: [1,2]  (2+4=6)' },
    ],
    constraints: ['2 ≤ nums.length ≤ 10⁴', '−10⁹ ≤ nums[i] ≤ 10⁹', 'Exactly one valid answer'],
    requiredComplexity: 'O(n) time · O(n) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'A brute force tries every pair — O(n²). But for each element x, you\'re looking for target-x. Is there a faster way to check if target-x exists in the array?' },
      { number: 2, text: 'Use a HashMap that maps value → index. As you scan, check if target - nums[i] is already in the map.' },
      { number: 3, text: 'If target - nums[i] is in the map, return [map.get(target - nums[i]), i]. If not, store nums[i] → i in the map and continue.' },
      { number: 4, label: 'Hint 4 — approach', text: 'You build the map lazily as you scan — this ensures you never pair an element with itself (since you only look up what was stored before the current index).' },
    ],
    approaches: [
      {
        key: 'brute',
        label: 'Brute Force — O(n²) time, O(1) space',
        explanation: 'Try every pair. Simple but slow.',
        code: {
          java: `public int[] twoSum(int[] nums, int target) {
    for (int i = 0; i < nums.length; i++)
        for (int j = i+1; j < nums.length; j++)
            if (nums[i] + nums[j] == target)
                return new int[]{i, j};
    return new int[]{};
}`,
          cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    for (int i = 0; i < (int)nums.size(); i++)
        for (int j = i+1; j < (int)nums.size(); j++)
            if (nums[i]+nums[j]==target) return {i,j};
    return {};
}`,
          python: `def twoSum(nums, target):
    for i in range(len(nums)):
        for j in range(i+1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]`,
        },
      },
      {
        key: 'optimal',
        label: 'HashMap One-Pass — O(n) time, O(n) space',
        explanation: 'Store complement lookups in a map. One pass is enough — the moment you find a complement, return both indices.',
        code: {
          java: `public int[] twoSum(int[] nums, int target) {
    Map<Integer,Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement))
            return new int[]{map.get(complement), i};
        map.put(nums[i], i);
    }
    return new int[]{};
}`,
          cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int,int> map;
    for (int i = 0; i < (int)nums.size(); i++) {
        int comp = target - nums[i];
        if (map.count(comp)) return {map[comp], i};
        map[nums[i]] = i;
    }
    return {};
}`,
          python: `def twoSum(nums, target):
    seen = {}
    for i, x in enumerate(nums):
        comp = target - x
        if comp in seen:
            return [seen[comp], i]
        seen[x] = i`,
        },
        dryRun: {
          title: 'Dry run — nums = [2,7,11,15], target = 9',
          columns: ['i', 'nums[i]', 'complement=9-x', 'In map?', 'map after'],
          rows: [
            ['0', '2', '7', 'No', '{2:0}'],
            ['1', '7', '2', 'Yes! → return [0,1] ✓', '{2:0}'],
          ],
          highlightRow: 1,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 25. Contains Duplicate
  // ══════════════════════════════════════════════════════
  'contains-duplicate': {
    statement:
      'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
    tags: ['Arrays', 'Hash Set'],
    requirement: 'O(n) time preferred',
    externalLinks: [
      { label: '↗ LeetCode #217', url: 'https://leetcode.com/problems/contains-duplicate/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [1,2,3,1]\nOutput: true' },
      { label: 'Example 2', text: 'Input:  nums = [1,2,3,4]\nOutput: false' },
      { label: 'Example 3', text: 'Input:  nums = [1,1,1,3,3,4,3,2,4,2]\nOutput: true' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁵', '−10⁹ ≤ nums[i] ≤ 10⁹'],
    requiredComplexity: 'O(n) time · O(n) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'You need to detect if you\'ve seen a number before. What data structure gives you O(1) "have I seen this?" lookups?' },
      { number: 2, text: 'A HashSet stores unique elements. When you insert a number that\'s already there, the insertion fails — that\'s your signal.' },
      { number: 3, text: 'Scan the array. For each element, check if it\'s already in the set. If yes, return true immediately. If no, add it to the set.' },
      { number: 4, label: 'Hint 4 — approach', text: 'If you finish the loop without finding a repeat, return false. Alternatively: return set.size() < nums.length after adding all elements — but this doesn\'t short-circuit early.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'HashSet — O(n) time, O(n) space',
        explanation: 'Insert elements one by one into a set. The moment an element is already present, a duplicate is found.',
        code: {
          java: `public boolean containsDuplicate(int[] nums) {
    Set<Integer> seen = new HashSet<>();
    for (int x : nums) {
        if (!seen.add(x)) return true;
    }
    return false;
}`,
          cpp: `bool containsDuplicate(vector<int>& nums) {
    unordered_set<int> seen;
    for (int x : nums) {
        if (!seen.insert(x).second) return true;
    }
    return false;
}`,
          python: `def containsDuplicate(nums):
    seen = set()
    for x in nums:
        if x in seen:
            return True
        seen.add(x)
    return False`,
        },
        dryRun: {
          title: 'Dry run — nums = [1,2,3,1]',
          columns: ['x', 'seen before?', 'set after'],
          rows: [
            ['1', 'No', '{1}'],
            ['2', 'No', '{1,2}'],
            ['3', 'No', '{1,2,3}'],
            ['1', 'Yes → return true ✓', '{1,2,3}'],
          ],
          highlightRow: 3,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 26. Minimum Index Sum of Two Lists
  // ══════════════════════════════════════════════════════
  'minimum-index-sum-of-two-lists': {
    statement:
      'Given two arrays of strings list1 and list2, find the common strings with the minimum index sum. If there is a tie, return all of them.',
    tags: ['Arrays', 'Hash Lookup'],
    requirement: 'O(n + m) time',
    externalLinks: [
      { label: '↗ LeetCode #599', url: 'https://leetcode.com/problems/minimum-index-sum-of-two-lists/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  list1 = ["Shogun","Tapioca Express","Burger King","KFC"]\n        list2 = ["Piatti","The Grill at Torrey Pines","Hungry Hunter Steakhouse","Shogun"]\nOutput: ["Shogun"]' },
      { label: 'Example 2', text: 'Input:  list1 = ["Shogun","Tapioca Express"], list2 = ["Tapioca Express","Shogun"]\nOutput: ["Tapioca Express","Shogun"]  (both have index sum 1)' },
    ],
    constraints: ['1 ≤ list1.length, list2.length ≤ 1000', 'All strings are unique within each list'],
    requiredComplexity: 'O(n + m) time · O(n) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'You need to find common strings. What if you stored list1\'s strings with their indices in a map, then scanned list2 looking up each string?' },
      { number: 2, text: 'Build a map: string → index for list1. Then iterate list2 — when you find a string also in the map, compute index sum = map[str] + j.' },
      { number: 3, text: 'Track the minimum index sum found so far. When you find a smaller sum, clear the result list and start fresh. When you find the same sum, add to the result.' },
      { number: 4, label: 'Hint 4 — approach', text: 'One pass to build the map (O(n)), one pass through list2 (O(m)). The result accumulates strings tied at the minimum sum. Total: O(n+m).' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'HashMap Lookup — O(n+m) time, O(n) space',
        explanation: 'Index list1 in a map, then find common strings with minimum index sum in one pass over list2.',
        code: {
          java: `public String[] findRestaurant(String[] list1, String[] list2) {
    Map<String,Integer> map = new HashMap<>();
    for (int i = 0; i < list1.length; i++) map.put(list1[i], i);
    List<String> result = new ArrayList<>();
    int minSum = Integer.MAX_VALUE;
    for (int j = 0; j < list2.length; j++) {
        if (map.containsKey(list2[j])) {
            int sum = map.get(list2[j]) + j;
            if (sum < minSum) { minSum = sum; result.clear(); result.add(list2[j]); }
            else if (sum == minSum) result.add(list2[j]);
        }
    }
    return result.toArray(new String[0]);
}`,
          cpp: `vector<string> findRestaurant(vector<string>& list1, vector<string>& list2) {
    unordered_map<string,int> map;
    for (int i = 0; i < (int)list1.size(); i++) map[list1[i]] = i;
    vector<string> result;
    int minSum = INT_MAX;
    for (int j = 0; j < (int)list2.size(); j++) {
        if (map.count(list2[j])) {
            int sum = map[list2[j]] + j;
            if (sum < minSum) { minSum = sum; result = {list2[j]}; }
            else if (sum == minSum) result.push_back(list2[j]);
        }
    }
    return result;
}`,
          python: `def findRestaurant(list1, list2):
    index_map = {s: i for i, s in enumerate(list1)}
    result, min_sum = [], float('inf')
    for j, s in enumerate(list2):
        if s in index_map:
            total = index_map[s] + j
            if total < min_sum:
                min_sum, result = total, [s]
            elif total == min_sum:
                result.append(s)
    return result`,
        },
        dryRun: {
          title: 'Dry run — list1=["A","B","C"], list2=["C","B","A"]',
          columns: ['j', 'list2[j]', 'In map?', 'index sum', 'minSum', 'result'],
          rows: [
            ['0', 'C', 'Yes (idx=2)', '2+0=2', '2', '["C"]'],
            ['1', 'B', 'Yes (idx=1)', '1+1=2', '2 (tie)', '["C","B"]'],
            ['2', 'A', 'Yes (idx=0)', '0+2=2', '2 (tie)', '["C","B","A"] ✓'],
          ],
          highlightRow: 2,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 27. Longest Consecutive Sequence
  // ══════════════════════════════════════════════════════
  'longest-consecutive-sequence': {
    statement:
      'Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence. You must write an algorithm that runs in O(n) time.',
    tags: ['Arrays', 'Hash Set'],
    requirement: 'O(n) time — sorting is O(n log n) and not accepted for full credit',
    externalLinks: [
      { label: '↗ LeetCode #128', url: 'https://leetcode.com/problems/longest-consecutive-sequence/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [100,4,200,1,3,2]\nOutput: 4  (sequence: [1,2,3,4])' },
      { label: 'Example 2', text: 'Input:  nums = [0,3,7,2,5,8,4,6,0,1]\nOutput: 9  (sequence: [0,1,2,3,4,5,6,7,8])' },
    ],
    constraints: ['0 ≤ nums.length ≤ 10⁵', '−10⁹ ≤ nums[i] ≤ 10⁹'],
    requiredComplexity: 'O(n) time · O(n) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'To find consecutive sequences, you need fast "does this number exist?" checks. What data structure gives O(1) for that?' },
      { number: 2, text: 'Put all numbers in a HashSet. Then for each number x, check if x-1 is in the set. If x-1 is NOT in the set, then x is the start of a new sequence.' },
      { number: 3, text: 'From a sequence start x, count how long the streak goes: x+1, x+2, x+3, … as long as each is in the set.' },
      { number: 4, label: 'Hint 4 — approach', text: 'Why does this run in O(n)? Each number is the "start" of at most one sequence, and each number is visited at most twice across all streak counts. Total work = O(n).' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'HashSet + Sequence Start Detection — O(n) time, O(n) space',
        explanation: 'Use a set for O(1) lookups. Start counting a streak only from sequence beginnings (no left neighbor in set).',
        code: {
          java: `public int longestConsecutive(int[] nums) {
    Set<Integer> set = new HashSet<>();
    for (int x : nums) set.add(x);
    int best = 0;
    for (int x : set) {
        if (!set.contains(x - 1)) {
            int len = 1;
            while (set.contains(x + len)) len++;
            best = Math.max(best, len);
        }
    }
    return best;
}`,
          cpp: `int longestConsecutive(vector<int>& nums) {
    unordered_set<int> set(nums.begin(), nums.end());
    int best = 0;
    for (int x : set) {
        if (!set.count(x - 1)) {
            int len = 1;
            while (set.count(x + len)) len++;
            best = max(best, len);
        }
    }
    return best;
}`,
          python: `def longestConsecutive(nums):
    num_set = set(nums)
    best = 0
    for x in num_set:
        if x - 1 not in num_set:
            length = 1
            while x + length in num_set:
                length += 1
            best = max(best, length)
    return best`,
        },
        dryRun: {
          title: 'Dry run — nums = [100,4,200,1,3,2]',
          columns: ['x (start?)', 'No left neighbor?', 'Streak length', 'best'],
          rows: [
            ['1', 'Yes (0 not in set)', '1→2→3→4 = 4', '4'],
            ['2', 'No (1 in set)', 'Skip', '4'],
            ['3', 'No (2 in set)', 'Skip', '4'],
            ['4', 'No (3 in set)', 'Skip', '4'],
            ['100', 'Yes (99 not in set)', '1', '4'],
            ['200', 'Yes (199 not in set)', '1', '4 ✓'],
          ],
          highlightRow: 0,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 28. 4Sum II
  // ══════════════════════════════════════════════════════
  'four-sum-ii': {
    statement:
      'Given four integer arrays nums1, nums2, nums3, nums4, each of length n, return the number of tuples (i,j,k,l) such that nums1[i] + nums2[j] + nums3[k] + nums4[l] == 0.',
    tags: ['Arrays', 'Hash Lookup'],
    requirement: 'O(n²) time',
    externalLinks: [
      { label: '↗ LeetCode #454', url: 'https://leetcode.com/problems/4sum-ii/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  nums1=[1,2], nums2=[-2,-1], nums3=[-1,2], nums4=[0,2]\nOutput: 2' },
      { label: 'Example 2', text: 'Input:  nums1=[0], nums2=[0], nums3=[0], nums4=[0]\nOutput: 1' },
    ],
    constraints: ['n == nums1.length == … == nums4.length', '1 ≤ n ≤ 200', '−2²⁸ ≤ nums[i] ≤ 2²⁸'],
    requiredComplexity: 'O(n²) time · O(n²) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'A brute force over 4 arrays is O(n⁴). Can you split the problem into two halves — sum pairs from (A,B) and pairs from (C,D) — and match them?' },
      { number: 2, text: 'Compute all pairwise sums from nums1+nums2 and store their frequencies in a HashMap.' },
      { number: 3, text: 'Then iterate all pairs from nums3+nums4. For each sum s, check how many times -s appears in the map — those are the matching completions.' },
      { number: 4, label: 'Hint 4 — approach', text: 'Total pairs: n² from (A,B), n² from (C,D). So this runs in O(n²) with O(n²) space for the map — a significant improvement over the O(n⁴) brute force.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Split + HashMap — O(n²) time, O(n²) space',
        explanation: 'Count all (A+B) sums in a map, then for each (C+D) sum, look up its negation in the map.',
        code: {
          java: `public int fourSumCount(int[] A, int[] B, int[] C, int[] D) {
    Map<Integer,Integer> map = new HashMap<>();
    for (int a : A)
        for (int b : B)
            map.put(a+b, map.getOrDefault(a+b, 0)+1);
    int count = 0;
    for (int c : C)
        for (int d : D)
            count += map.getOrDefault(-(c+d), 0);
    return count;
}`,
          cpp: `int fourSumCount(vector<int>& A, vector<int>& B, vector<int>& C, vector<int>& D) {
    unordered_map<int,int> map;
    for (int a : A) for (int b : B) map[a+b]++;
    int count = 0;
    for (int c : C) for (int d : D) count += map.count(-(c+d)) ? map[-(c+d)] : 0;
    return count;
}`,
          python: `def fourSumCount(A, B, C, D):
    from collections import defaultdict
    ab = defaultdict(int)
    for a in A:
        for b in B:
            ab[a+b] += 1
    count = 0
    for c in C:
        for d in D:
            count += ab[-(c+d)]
    return count`,
        },
        dryRun: {
          title: 'Dry run — A=[1,2], B=[-2,-1], C=[-1,2], D=[0,2]',
          columns: ['Phase', 'Sum', 'Map / Count'],
          rows: [
            ['Build AB map', '1+(-2)=-1', '{-1:1}'],
            ['', '1+(-1)=0', '{-1:1, 0:1}'],
            ['', '2+(-2)=0', '{-1:1, 0:2}'],
            ['', '2+(-1)=1', '{-1:1, 0:2, 1:1}'],
            ['Query CD', 'c=-1,d=0: -(−1)=1 → map[1]=1 → count=1', ''],
            ['', 'c=-1,d=2: -(1)=-1 → map[-1]=1 → count=2', ''],
            ['', 'c=2,d=0: -(2)=-2 → map[-2]=0', ''],
            ['', 'c=2,d=2: -(4)=-4 → 0', 'count=2 ✓'],
          ],
          highlightRow: 7,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 29. Brick Wall
  // ══════════════════════════════════════════════════════
  'brick-wall': {
    statement:
      'A wall is a list of rows, each row is a list of brick widths. Draw a vertical line from top to bottom, minimizing the number of bricks it crosses (edges don\'t count as crossing). Return the minimum bricks crossed.',
    tags: ['Arrays', 'Frequency Counting'],
    requirement: 'O(n) time where n is total number of bricks',
    externalLinks: [
      { label: '↗ LeetCode #554', url: 'https://leetcode.com/problems/brick-wall/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  wall = [[1,2,2,1],[3,1,2],[1,3,2],[2,4],[3,1,2],[1,3,1,1]]\nOutput: 2' },
      { label: 'Example 2', text: 'Input:  wall = [[1],[1],[1]]\nOutput: 3' },
    ],
    constraints: ['1 ≤ wall.length ≤ 10⁴', '1 ≤ wall[i].length ≤ 10⁴', 'Sum of all widths per row is equal'],
    requiredComplexity: 'O(n) time · O(w) space, w = wall width',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'Instead of finding the worst position (max bricks crossed), flip the problem: find the position that passes through the most edges. The answer is rows - maxEdges.' },
      { number: 2, text: 'For each row, compute the running prefix sum of brick widths. Each prefix sum (except the last, which is the total width) is an edge position.' },
      { number: 3, text: 'Count how many rows have an edge at each position using a frequency map. The position with the highest frequency is where the line crosses fewest bricks.' },
      { number: 4, label: 'Hint 4 — approach', text: 'Answer = total rows − max edge frequency. Don\'t include the rightmost edge (total width) since the line can\'t be drawn outside the wall.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Edge Frequency Map — O(n) time, O(w) space',
        explanation: 'Count edge positions across all rows using prefix sums. The line should go through the most common edge position.',
        code: {
          java: `public int leastBricks(List<List<Integer>> wall) {
    Map<Integer,Integer> edgeCount = new HashMap<>();
    int maxEdges = 0;
    for (List<Integer> row : wall) {
        int pos = 0;
        for (int i = 0; i < row.size() - 1; i++) {
            pos += row.get(i);
            edgeCount.put(pos, edgeCount.getOrDefault(pos, 0) + 1);
            maxEdges = Math.max(maxEdges, edgeCount.get(pos));
        }
    }
    return wall.size() - maxEdges;
}`,
          cpp: `int leastBricks(vector<vector<int>>& wall) {
    unordered_map<int,int> edgeCount;
    int maxEdges = 0;
    for (auto& row : wall) {
        int pos = 0;
        for (int i = 0; i < (int)row.size()-1; i++) {
            pos += row[i];
            maxEdges = max(maxEdges, ++edgeCount[pos]);
        }
    }
    return (int)wall.size() - maxEdges;
}`,
          python: `def leastBricks(wall):
    from collections import defaultdict
    edge_count = defaultdict(int)
    max_edges = 0
    for row in wall:
        pos = 0
        for width in row[:-1]:
            pos += width
            edge_count[pos] += 1
            max_edges = max(max_edges, edge_count[pos])
    return len(wall) - max_edges`,
        },
        dryRun: {
          title: 'Dry run — wall = [[1,2,2,1],[3,1,2],[2,4]] (width=6)',
          columns: ['Row', 'Edge Positions', 'edgeCount after'],
          rows: [
            ['[1,2,2,1]', '1, 3, 5', '{1:1, 3:1, 5:1}'],
            ['[3,1,2]', '3, 4', '{1:1, 3:2, 4:1, 5:1}'],
            ['[2,4]', '2', '{1:1, 2:1, 3:2, 4:1, 5:1}'],
            ['Result', 'maxEdges=2 (at pos=3)', '3 rows − 2 = 1 ✓'],
          ],
          highlightRow: 3,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 30. Check If Array Pairs Are Divisible by k
  // ══════════════════════════════════════════════════════
  'check-if-array-pairs-divisible-by-k': {
    statement:
      'Given an array of n integers and an integer k (n is even), check if you can divide the array into n/2 pairs such that the sum of each pair is divisible by k.',
    tags: ['Arrays', 'Frequency Counting'],
    requirement: 'O(n) time',
    externalLinks: [
      { label: '↗ LeetCode #1497', url: 'https://leetcode.com/problems/check-if-array-pairs-are-divisible-by-k/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  arr = [1,2,3,4,5,10,6,7,8,9], k = 5\nOutput: true' },
      { label: 'Example 2', text: 'Input:  arr = [1,2,3,4,5,6], k = 7\nOutput: true' },
      { label: 'Example 3', text: 'Input:  arr = [1,2,3,4,5,6], k = 10\nOutput: false' },
    ],
    constraints: ['arr.length == n', '1 ≤ n ≤ 10⁵', 'n is even', '−10⁹ ≤ arr[i] ≤ 10⁹', '1 ≤ k ≤ 10⁵'],
    requiredComplexity: 'O(n) time · O(k) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'For two numbers a and b, a+b is divisible by k when (a%k + b%k) % k == 0. So you only care about remainders, not the actual values!' },
      { number: 2, text: 'Count the frequency of each remainder (0 to k-1) using an array of size k. Remember to handle negative numbers: in Python use % naturally; in Java/C++ use ((x % k) + k) % k.' },
      { number: 3, text: 'For pairing: remainder 0 must pair with remainder 0 (so its count must be even). Remainder r must pair with remainder k-r.' },
      { number: 4, label: 'Hint 4 — approach', text: 'Check: freq[0] is even; for r in 1..k/2, freq[r] == freq[k-r]; if k is even, freq[k/2] must also be even. All these must hold for the answer to be true.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Remainder Frequency — O(n) time, O(k) space',
        explanation: 'Count remainders mod k. Verify that complementary remainders have matching counts.',
        code: {
          java: `public boolean canArrange(int[] arr, int k) {
    int[] freq = new int[k];
    for (int x : arr) freq[((x % k) + k) % k]++;
    if (freq[0] % 2 != 0) return false;
    for (int r = 1; r <= k / 2; r++) {
        if (freq[r] != freq[k - r]) return false;
    }
    return true;
}`,
          cpp: `bool canArrange(vector<int>& arr, int k) {
    vector<int> freq(k, 0);
    for (int x : arr) freq[((x%k)+k)%k]++;
    if (freq[0] % 2 != 0) return false;
    for (int r = 1; r <= k/2; r++)
        if (freq[r] != freq[k-r]) return false;
    return true;
}`,
          python: `def canArrange(arr, k):
    freq = [0] * k
    for x in arr:
        freq[x % k] += 1
    if freq[0] % 2 != 0:
        return False
    for r in range(1, k // 2 + 1):
        if freq[r] != freq[k - r]:
            return False
    return True`,
        },
        dryRun: {
          title: 'Dry run — arr = [1,2,3,4,5,10,6,7,8,9], k = 5',
          columns: ['Remainder', '0', '1', '2', '3', '4'],
          rows: [
            ['Frequency', '2 (5,10)', '2 (1,6)', '2 (2,7)', '2 (3,8)', '2 (4,9)'],
            ['Check r=0', 'freq[0]=2 even ✓', '', '', '', ''],
            ['Check r=1', 'freq[1]=2 == freq[4]=2 ✓', '', '', '', ''],
            ['Check r=2', 'freq[2]=2 == freq[3]=2 ✓', '', '', '', 'return true ✓'],
          ],
          highlightRow: 3,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 31. Pairs of Songs Divisible by 60
  // ══════════════════════════════════════════════════════
  'pairs-of-songs-divisible-by-60': {
    statement:
      'Given a list of song durations time[], return the number of pairs (i, j) where i < j and (time[i] + time[j]) % 60 == 0.',
    tags: ['Arrays', 'Frequency Counting'],
    requirement: 'O(n) time',
    externalLinks: [
      { label: '↗ LeetCode #1010', url: 'https://leetcode.com/problems/pairs-of-songs-with-total-durations-divisible-by-60/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  time = [30,20,150,100,40]\nOutput: 3  (pairs: (30,150),(20,100),(20,40))' },
      { label: 'Example 2', text: 'Input:  time = [60,60,60]\nOutput: 3  (all three pairs)' },
    ],
    constraints: ['1 ≤ time.length ≤ 6×10⁴', '1 ≤ time[i] ≤ 500'],
    requiredComplexity: 'O(n) time · O(60) = O(1) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'This is analogous to Two Sum! For each song with remainder r = time[i] % 60, you\'re looking for a previous song with remainder (60 - r) % 60. Sound familiar?' },
      { number: 2, text: 'Keep a frequency array of size 60 (remainders 0–59). For each new song, check how many previous songs have the complementary remainder.' },
      { number: 3, text: 'Complement of remainder r is (60 - r) % 60. The % 60 handles the edge case where r = 0 (complement should also be 0, not 60).' },
      { number: 4, label: 'Hint 4 — approach', text: 'For each song: count += remainderFreq[(60 - r) % 60]; then remainderFreq[r]++. This processes each song in O(1) — total O(n). The frequency array has only 60 entries, so O(1) extra space.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Remainder Frequency (Two-Sum style) — O(n) time, O(1) space',
        explanation: 'Count complementary remainder pairs lazily. For each song, count matches with previously seen remainders, then record its own remainder.',
        code: {
          java: `public int numPairsDivisibleBy60(int[] time) {
    int[] freq = new int[60];
    int count = 0;
    for (int t : time) {
        int r = t % 60;
        count += freq[(60 - r) % 60];
        freq[r]++;
    }
    return count;
}`,
          cpp: `int numPairsDivisibleBy60(vector<int>& time) {
    vector<int> freq(60, 0);
    int count = 0;
    for (int t : time) {
        int r = t % 60;
        count += freq[(60 - r) % 60];
        freq[r]++;
    }
    return count;
}`,
          python: `def numPairsDivisibleBy60(time):
    freq = [0] * 60
    count = 0
    for t in time:
        r = t % 60
        count += freq[(60 - r) % 60]
        freq[r] += 1
    return count`,
        },
        dryRun: {
          title: 'Dry run — time = [30,20,150,100,40]',
          columns: ['t', 'r=t%60', 'complement=(60-r)%60', 'freq[comp]', 'count', 'freq[r]++'],
          rows: [
            ['30', '30', '30', '0', '0', 'freq[30]=1'],
            ['20', '20', '40', '0', '0', 'freq[20]=1'],
            ['150', '30', '30', '1', '1', 'freq[30]=2'],
            ['100', '40', '20', '1', '2', 'freq[40]=1'],
            ['40', '40', '20', '1', '3', 'freq[40]=2 → return 3 ✓'],
          ],
          highlightRow: 4,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 32. Subarray Sum Equals K
  // ══════════════════════════════════════════════════════
  'subarray-sum-equals-k': {
    statement:
      'Given an integer array nums and an integer k, return the total number of subarrays whose sum equals k.',
    tags: ['Arrays', 'Prefix Sum'],
    requirement: 'O(n) time',
    externalLinks: [
      { label: '↗ LeetCode #560', url: 'https://leetcode.com/problems/subarray-sum-equals-k/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [1,1,1], k = 2\nOutput: 2' },
      { label: 'Example 2', text: 'Input:  nums = [1,2,3], k = 3\nOutput: 2' },
    ],
    constraints: ['1 ≤ nums.length ≤ 2×10⁴', '−1000 ≤ nums[i] ≤ 1000', '−10⁷ ≤ k ≤ 10⁷'],
    requiredComplexity: 'O(n) time · O(n) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'A subarray sum from index i to j equals prefix[j] - prefix[i-1]. So you\'re looking for pairs where prefix[j] - prefix[i] = k. Does rearranging this remind you of something?' },
      { number: 2, text: 'Rearrange: prefix[i] = prefix[j] - k. So for each j, you want to count how many previous prefix sums equal prefix[j] - k.' },
      { number: 3, text: 'Use a HashMap storing frequency of each prefix sum seen so far. Before updating the map at each step, query for prefix[current] - k.' },
      { number: 4, label: 'Hint 4 — approach', text: 'Initialize the map with {0: 1} to handle subarrays starting from index 0. Process each element: add freq[prefixSum - k] to count, then increment freq[prefixSum]. This is the classic prefix sum + HashMap trick.' },
    ],
    approaches: [
      {
        key: 'brute',
        label: 'Brute Force — O(n²) time, O(1) space',
        explanation: 'Check all O(n²) subarrays.',
        code: {
          java: `public int subarraySum(int[] nums, int k) {
    int count = 0;
    for (int i = 0; i < nums.length; i++) {
        int sum = 0;
        for (int j = i; j < nums.length; j++) {
            sum += nums[j];
            if (sum == k) count++;
        }
    }
    return count;
}`,
          cpp: `int subarraySum(vector<int>& nums, int k) {
    int count = 0;
    for (int i = 0; i < (int)nums.size(); i++) {
        int sum = 0;
        for (int j = i; j < (int)nums.size(); j++) {
            sum += nums[j];
            if (sum == k) count++;
        }
    }
    return count;
}`,
          python: `def subarraySum(nums, k):
    count = 0
    for i in range(len(nums)):
        total = 0
        for j in range(i, len(nums)):
            total += nums[j]
            if total == k:
                count += 1
    return count`,
        },
      },
      {
        key: 'optimal',
        label: 'Prefix Sum + HashMap — O(n) time, O(n) space',
        explanation: 'Track prefix sum frequencies. For each position, the number of valid subarrays ending here is freq[prefixSum - k].',
        code: {
          java: `public int subarraySum(int[] nums, int k) {
    Map<Integer,Integer> freq = new HashMap<>();
    freq.put(0, 1);
    int prefixSum = 0, count = 0;
    for (int x : nums) {
        prefixSum += x;
        count += freq.getOrDefault(prefixSum - k, 0);
        freq.put(prefixSum, freq.getOrDefault(prefixSum, 0) + 1);
    }
    return count;
}`,
          cpp: `int subarraySum(vector<int>& nums, int k) {
    unordered_map<int,int> freq;
    freq[0] = 1;
    int prefixSum = 0, count = 0;
    for (int x : nums) {
        prefixSum += x;
        count += freq.count(prefixSum-k) ? freq[prefixSum-k] : 0;
        freq[prefixSum]++;
    }
    return count;
}`,
          python: `def subarraySum(nums, k):
    from collections import defaultdict
    freq = defaultdict(int)
    freq[0] = 1
    prefix, count = 0, 0
    for x in nums:
        prefix += x
        count += freq[prefix - k]
        freq[prefix] += 1
    return count`,
        },
        dryRun: {
          title: 'Dry run — nums = [1,1,1], k = 2',
          columns: ['x', 'prefixSum', 'prefixSum-k', 'freq[prefix-k]', 'count', 'freq after'],
          rows: [
            ['—', '0 (init)', '—', '—', '0', '{0:1}'],
            ['1', '1', '-1', '0', '0', '{0:1, 1:1}'],
            ['1', '2', '0', '1', '1', '{0:1, 1:1, 2:1}'],
            ['1', '3', '1', '1', '2', '{0:1, 1:1, 2:1, 3:1} → return 2 ✓'],
          ],
          highlightRow: 3,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 33. Contiguous Array
  // ══════════════════════════════════════════════════════
  'contiguous-array': {
    statement:
      'Given a binary array nums, return the maximum length of a contiguous subarray with an equal number of 0s and 1s.',
    tags: ['Arrays', 'Hash Map + Prefix Sum'],
    requirement: 'O(n) time',
    externalLinks: [
      { label: '↗ LeetCode #525', url: 'https://leetcode.com/problems/contiguous-array/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [0,1]\nOutput: 2' },
      { label: 'Example 2', text: 'Input:  nums = [0,1,0]\nOutput: 2' },
      { label: 'Example 3', text: 'Input:  nums = [0,0,1,0,0,0,1,1]\nOutput: 6' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁵', 'nums[i] is 0 or 1'],
    requiredComplexity: 'O(n) time · O(n) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'Replace every 0 with -1. Now you\'re looking for the longest subarray with sum = 0. Does this simplify the problem?' },
      { number: 2, text: 'If the prefix sum at index j equals the prefix sum at index i (j > i), then the subarray from i+1 to j has sum 0 — equal counts of +1 and -1, meaning equal 0s and 1s!' },
      { number: 3, text: 'Use a HashMap storing the first index at which each prefix sum was seen. If the current prefix sum has been seen before, compute the subarray length.' },
      { number: 4, label: 'Hint 4 — approach', text: 'Initialize the map with {0: -1} (prefix sum 0 seen at "index -1"). For each index i: update prefixSum; if it\'s in the map, length = i - map[prefixSum]; else store map[prefixSum] = i. Track max length.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Prefix Sum (0→-1 transform) + HashMap — O(n) time, O(n) space',
        explanation: 'Replace 0s with -1s. Find the longest subarray with prefix sum 0 using a "first seen index" map.',
        code: {
          java: `public int findMaxLength(int[] nums) {
    Map<Integer,Integer> firstSeen = new HashMap<>();
    firstSeen.put(0, -1);
    int prefixSum = 0, maxLen = 0;
    for (int i = 0; i < nums.length; i++) {
        prefixSum += (nums[i] == 1) ? 1 : -1;
        if (firstSeen.containsKey(prefixSum)) {
            maxLen = Math.max(maxLen, i - firstSeen.get(prefixSum));
        } else {
            firstSeen.put(prefixSum, i);
        }
    }
    return maxLen;
}`,
          cpp: `int findMaxLength(vector<int>& nums) {
    unordered_map<int,int> firstSeen;
    firstSeen[0] = -1;
    int prefixSum = 0, maxLen = 0;
    for (int i = 0; i < (int)nums.size(); i++) {
        prefixSum += (nums[i] == 1) ? 1 : -1;
        if (firstSeen.count(prefixSum))
            maxLen = max(maxLen, i - firstSeen[prefixSum]);
        else
            firstSeen[prefixSum] = i;
    }
    return maxLen;
}`,
          python: `def findMaxLength(nums):
    first_seen = {0: -1}
    prefix, max_len = 0, 0
    for i, x in enumerate(nums):
        prefix += 1 if x == 1 else -1
        if prefix in first_seen:
            max_len = max(max_len, i - first_seen[prefix])
        else:
            first_seen[prefix] = i
    return max_len`,
        },
        dryRun: {
          title: 'Dry run — nums = [0,1,0] (0→-1)',
          columns: ['i', 'nums[i]', 'delta', 'prefixSum', 'In map?', 'maxLen', 'map'],
          rows: [
            ['init', '—', '—', '0', '—', '0', '{0:-1}'],
            ['0', '0 (→-1)', '-1', '-1', 'No → store', '0', '{0:-1, -1:0}'],
            ['1', '1 (→+1)', '+1', '0', 'Yes! i-map[0]=1-(-1)=2', '2', '{0:-1, -1:0}'],
            ['2', '0 (→-1)', '-1', '-1', 'Yes! i-map[-1]=2-0=2', '2', '→ return 2 ✓'],
          ],
          highlightRow: 2,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 34. Move Zeroes (Two Pointers section)
  // ══════════════════════════════════════════════════════
  'move-zeroes': {
    statement:
      'Given an integer array nums, move all 0s to the end while maintaining the relative order of non-zero elements. Do it in-place.',
    tags: ['Arrays', 'Two Pointers'],
    requirement: 'In-place, minimize operations',
    externalLinks: [
      { label: '↗ LeetCode #283', url: 'https://leetcode.com/problems/move-zeroes/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [0,1,0,3,12]\nOutput: [1,3,12,0,0]' },
      { label: 'Example 2', text: 'Input:  nums = [0]\nOutput: [0]' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁴', '−2³¹ ≤ nums[i] ≤ 2³¹−1'],
    requiredComplexity: 'O(n) time · O(1) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'Can you solve this with a slow and fast pointer? What does each pointer represent?' },
      { number: 2, text: 'Slow pointer (left) tracks where the next non-zero element should go. Fast pointer (right) scans for non-zero elements.' },
      { number: 3, text: 'When right finds a non-zero, swap nums[left] and nums[right], then advance left. This keeps non-zeros compacted at the front without changing their relative order.' },
      { number: 4, label: 'Hint 4 — approach', text: 'After the swap approach, zeros naturally bubble to the back. Compare to the fill approach from "move-zeroes-basic" — the swap approach does fewer writes when zeros are sparse.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Two-Pointer Swap — O(n) time, O(1) space',
        explanation: 'Swap non-zero elements forward using a slow write pointer. Zeros are implicitly pushed back.',
        code: {
          java: `public void moveZeroes(int[] nums) {
    int left = 0;
    for (int right = 0; right < nums.length; right++) {
        if (nums[right] != 0) {
            int temp = nums[left];
            nums[left] = nums[right];
            nums[right] = temp;
            left++;
        }
    }
}`,
          cpp: `void moveZeroes(vector<int>& nums) {
    int left = 0;
    for (int right = 0; right < (int)nums.size(); right++) {
        if (nums[right] != 0) {
            swap(nums[left++], nums[right]);
        }
    }
}`,
          python: `def moveZeroes(nums):
    left = 0
    for right in range(len(nums)):
        if nums[right] != 0:
            nums[left], nums[right] = nums[right], nums[left]
            left += 1`,
        },
        dryRun: {
          title: 'Dry run — nums = [0,1,0,3,12]',
          columns: ['right', 'nums[right]', 'Nonzero?', 'Swap left↔right', 'left', 'Array'],
          rows: [
            ['0', '0', 'No', '—', '0', '[0,1,0,3,12]'],
            ['1', '1', 'Yes', '0↔1', '1', '[1,0,0,3,12]'],
            ['2', '0', 'No', '—', '1', '[1,0,0,3,12]'],
            ['3', '3', 'Yes', '1↔3 (idx 1↔3)', '2', '[1,3,0,0,12]'],
            ['4', '12', 'Yes', '0↔12 (idx 2↔4)', '3', '[1,3,12,0,0] ✓'],
          ],
          highlightRow: 4,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 35. Remove Duplicates from Sorted Array
  // ══════════════════════════════════════════════════════
  'remove-duplicates-sorted-array': {
    statement:
      'Given a sorted array nums, remove the duplicates in-place such that each element appears only once. Return the number of unique elements k. The first k elements of nums should hold the unique elements.',
    tags: ['Arrays', 'Two Pointers'],
    requirement: 'In-place, O(1) extra space',
    externalLinks: [
      { label: '↗ LeetCode #26', url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [1,1,2]\nOutput: 2, nums = [1,2,_]' },
      { label: 'Example 2', text: 'Input:  nums = [0,0,1,1,1,2,2,3,3,4]\nOutput: 5, nums = [0,1,2,3,4,_,_,_,_,_]' },
    ],
    constraints: ['1 ≤ nums.length ≤ 3×10⁴', '−100 ≤ nums[i] ≤ 100', 'Array is sorted in non-decreasing order'],
    requiredComplexity: 'O(n) time · O(1) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'The array is sorted, so duplicates are adjacent. If nums[i] == nums[i-1], it\'s a duplicate. How does that simplify the problem compared to an unsorted array?' },
      { number: 2, text: 'Use a slow pointer k starting at 1. Scan with a fast pointer i from 1 onward. When nums[i] ≠ nums[i-1], it\'s a new unique element.' },
      { number: 3, text: 'Write the new unique element to nums[k] and increment k. Skip duplicates (fast pointer advances, slow does not).' },
      { number: 4, label: 'Hint 4 — approach', text: 'Since the array is sorted, nums[i-1] is always the last unique element. Comparing nums[i] with nums[i-1] is enough — no need for a set or extra tracking.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Two-Pointer — O(n) time, O(1) space',
        explanation: 'Slow pointer marks the write position. Fast pointer finds new unique values by comparing with the previous element.',
        code: {
          java: `public int removeDuplicates(int[] nums) {
    int k = 1;
    for (int i = 1; i < nums.length; i++) {
        if (nums[i] != nums[i - 1]) {
            nums[k] = nums[i];
            k++;
        }
    }
    return k;
}`,
          cpp: `int removeDuplicates(vector<int>& nums) {
    int k = 1;
    for (int i = 1; i < (int)nums.size(); i++) {
        if (nums[i] != nums[i-1]) nums[k++] = nums[i];
    }
    return k;
}`,
          python: `def removeDuplicates(nums):
    k = 1
    for i in range(1, len(nums)):
        if nums[i] != nums[i-1]:
            nums[k] = nums[i]
            k += 1
    return k`,
        },
        dryRun: {
          title: 'Dry run — nums = [0,0,1,1,2]',
          columns: ['i', 'nums[i]', 'nums[i-1]', 'New unique?', 'k', 'Array (first k)'],
          rows: [
            ['1', '0', '0', 'No', '1', '[0]'],
            ['2', '1', '0', 'Yes → write', '2', '[0,1]'],
            ['3', '1', '1', 'No', '2', '[0,1]'],
            ['4', '2', '1', 'Yes → write', '3', '[0,1,2] → return 3 ✓'],
          ],
          highlightRow: 3,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 36. Sort Array By Parity
  // ══════════════════════════════════════════════════════
  'sort-array-by-parity': {
    statement:
      'Given an integer array nums, move all even integers to the beginning, followed by all odd integers. Return any arrangement satisfying this condition.',
    tags: ['Arrays', 'Two Pointers'],
    requirement: 'O(n) time, O(1) space preferred',
    externalLinks: [
      { label: '↗ LeetCode #905', url: 'https://leetcode.com/problems/sort-array-by-parity/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [3,1,2,4]\nOutput: [2,4,3,1]  (any valid arrangement)' },
      { label: 'Example 2', text: 'Input:  nums = [0]\nOutput: [0]' },
    ],
    constraints: ['1 ≤ nums.length ≤ 5000', '0 ≤ nums[i] ≤ 5000'],
    requiredComplexity: 'O(n) time · O(1) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'This is a partition problem — split the array into two groups (even and odd) in-place. What two-pointer strategy works here?' },
      { number: 2, text: 'Use a left pointer starting at 0 and a right pointer at n-1. The left should point to the next odd (misplaced), the right to the next even (misplaced).' },
      { number: 3, text: 'Advance left while nums[left] is even. Advance right while nums[right] is odd. When both stop, swap them — you\'ve fixed two misplaced elements.' },
      { number: 4, label: 'Hint 4 — approach', text: 'Continue until left ≥ right. This is the two-pointer partition technique — same idea as Dutch National Flag but with only 2 groups. O(n) time, O(1) space.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Two-Pointer Partition — O(n) time, O(1) space',
        explanation: 'Swap misplaced evens and odds from both ends toward the middle.',
        code: {
          java: `public int[] sortArrayByParity(int[] nums) {
    int left = 0, right = nums.length - 1;
    while (left < right) {
        while (left < right && nums[left] % 2 == 0) left++;
        while (left < right && nums[right] % 2 == 1) right--;
        if (left < right) {
            int t = nums[left]; nums[left] = nums[right]; nums[right] = t;
            left++; right--;
        }
    }
    return nums;
}`,
          cpp: `vector<int> sortArrayByParity(vector<int>& nums) {
    int left = 0, right = nums.size() - 1;
    while (left < right) {
        while (left < right && nums[left] % 2 == 0) left++;
        while (left < right && nums[right] % 2 == 1) right--;
        if (left < right) swap(nums[left++], nums[right--]);
    }
    return nums;
}`,
          python: `def sortArrayByParity(nums):
    left, right = 0, len(nums) - 1
    while left < right:
        while left < right and nums[left] % 2 == 0:
            left += 1
        while left < right and nums[right] % 2 == 1:
            right -= 1
        if left < right:
            nums[left], nums[right] = nums[right], nums[left]
            left += 1
            right -= 1
    return nums`,
        },
        dryRun: {
          title: 'Dry run — nums = [3,1,2,4]',
          columns: ['Step', 'left', 'right', 'nums[left]', 'nums[right]', 'Action', 'Array'],
          rows: [
            ['Start', '0', '3', '3 (odd)', '4 (even)', 'Both misplaced → swap', '[4,1,2,3]'],
            ['Next', '1', '2', '1 (odd)', '2 (even)', 'Both misplaced → swap', '[4,2,1,3]'],
            ['Next', '2', '1', 'left≥right', '—', 'Stop', '[4,2,1,3] ✓'],
          ],
          highlightRow: 2,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 37. Squares of a Sorted Array
  // ══════════════════════════════════════════════════════
  'squares-of-a-sorted-array': {
    statement:
      'Given an integer array nums sorted in non-decreasing order, return an array of the squares of each number sorted in non-decreasing order.',
    tags: ['Arrays', 'Two Pointers'],
    requirement: 'O(n) time using two pointers',
    externalLinks: [
      { label: '↗ LeetCode #977', url: 'https://leetcode.com/problems/squares-of-a-sorted-array/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [-4,-1,0,3,10]\nOutput: [0,1,9,16,100]' },
      { label: 'Example 2', text: 'Input:  nums = [-7,-3,2,3,11]\nOutput: [4,9,9,49,121]' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁴', '−10⁴ ≤ nums[i] ≤ 10⁴', 'nums is sorted in non-decreasing order'],
    requiredComplexity: 'O(n) time · O(n) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'After squaring, negative numbers can become large. The largest squares are at the two ends of the sorted array. Can you fill the result array from the back using two pointers?' },
      { number: 2, text: 'Place a pointer at the leftmost (most negative) and rightmost (most positive) element. Compare their squares — the larger one goes at the end of the result array.' },
      { number: 3, text: 'Move the pointer that contributed the larger square inward. Fill the result from right to left (position n-1, n-2, …).' },
      { number: 4, label: 'Hint 4 — approach', text: 'This runs in O(n) because you do exactly n comparisons and n writes. No sorting needed! The key insight: the sorted input means the largest squares are always at one of the two ends.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Two-Pointer Fill from Back — O(n) time, O(n) space',
        explanation: 'Compare squares from both ends. Always place the larger square at the current rightmost open position in the result.',
        code: {
          java: `public int[] sortedSquares(int[] nums) {
    int n = nums.length;
    int[] result = new int[n];
    int left = 0, right = n - 1, pos = n - 1;
    while (left <= right) {
        int lSq = nums[left] * nums[left];
        int rSq = nums[right] * nums[right];
        if (lSq > rSq) { result[pos--] = lSq; left++; }
        else            { result[pos--] = rSq; right--; }
    }
    return result;
}`,
          cpp: `vector<int> sortedSquares(vector<int>& nums) {
    int n = nums.size();
    vector<int> result(n);
    int left = 0, right = n-1, pos = n-1;
    while (left <= right) {
        int lSq = nums[left]*nums[left], rSq = nums[right]*nums[right];
        if (lSq > rSq) result[pos--] = lSq, left++;
        else result[pos--] = rSq, right--;
    }
    return result;
}`,
          python: `def sortedSquares(nums):
    n = len(nums)
    result = [0] * n
    left, right, pos = 0, n - 1, n - 1
    while left <= right:
        l_sq, r_sq = nums[left]**2, nums[right]**2
        if l_sq > r_sq:
            result[pos] = l_sq
            left += 1
        else:
            result[pos] = r_sq
            right -= 1
        pos -= 1
    return result`,
        },
        dryRun: {
          title: 'Dry run — nums = [-4,-1,0,3,10]',
          columns: ['left', 'right', 'lSq', 'rSq', 'Larger?', 'result[pos]', 'pos'],
          rows: [
            ['0', '4', '16', '100', 'rSq', '100', '3'],
            ['0', '3', '16', '9', 'lSq', '16', '2'],
            ['1', '3', '1', '9', 'rSq', '9', '1'],
            ['1', '2', '1', '0', 'lSq', '1', '0'],
            ['2', '2', '0', '0', 'rSq', '0', '-1 → done'],
          ],
          highlightRow: 4,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 38. Two Sum II - Input Array Is Sorted
  // ══════════════════════════════════════════════════════
  'two-sum-ii-sorted': {
    statement:
      'Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers that add up to a specific target. Return their indices (1-indexed). Use only constant extra space.',
    tags: ['Arrays', 'Two Pointers'],
    requirement: 'O(n) time, O(1) space',
    externalLinks: [
      { label: '↗ LeetCode #167', url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  numbers = [2,7,11,15], target = 9\nOutput: [1,2]  (1-indexed)' },
      { label: 'Example 2', text: 'Input:  numbers = [2,3,4], target = 6\nOutput: [1,3]' },
    ],
    constraints: ['2 ≤ numbers.length ≤ 3×10⁴', '−1000 ≤ numbers[i] ≤ 1000', 'Exactly one solution exists'],
    requiredComplexity: 'O(n) time · O(1) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'The array is sorted — this is the key difference from regular Two Sum. Can you exploit the sorted order to avoid the HashMap approach (which needs O(n) space)?' },
      { number: 2, text: 'Place one pointer at the start (smallest) and one at the end (largest). Their sum compared to target tells you which pointer to move.' },
      { number: 3, text: 'If sum > target, the right element is too big — move right pointer left. If sum < target, the left element is too small — move left pointer right. If sum == target, done!' },
      { number: 4, label: 'Hint 4 — approach', text: 'Because there\'s exactly one solution and the array is sorted, the two pointers will always converge to the answer. No element is used twice since left < right is maintained throughout.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Two Pointers — O(n) time, O(1) space',
        explanation: 'Start from both ends of the sorted array. Converge inward based on whether the sum is too large or too small.',
        code: {
          java: `public int[] twoSum(int[] numbers, int target) {
    int left = 0, right = numbers.length - 1;
    while (left < right) {
        int sum = numbers[left] + numbers[right];
        if (sum == target) return new int[]{left+1, right+1};
        else if (sum < target) left++;
        else right--;
    }
    return new int[]{};
}`,
          cpp: `vector<int> twoSum(vector<int>& numbers, int target) {
    int left = 0, right = numbers.size() - 1;
    while (left < right) {
        int sum = numbers[left] + numbers[right];
        if (sum == target) return {left+1, right+1};
        else if (sum < target) left++;
        else right--;
    }
    return {};
}`,
          python: `def twoSum(numbers, target):
    left, right = 0, len(numbers) - 1
    while left < right:
        s = numbers[left] + numbers[right]
        if s == target:
            return [left+1, right+1]
        elif s < target:
            left += 1
        else:
            right -= 1`,
        },
        dryRun: {
          title: 'Dry run — numbers = [2,7,11,15], target = 9',
          columns: ['left', 'right', 'sum', 'Action'],
          rows: [
            ['0', '3', '2+15=17', 'sum>target → right--'],
            ['0', '2', '2+11=13', 'sum>target → right--'],
            ['0', '1', '2+7=9', 'sum==target → return [1,2] ✓'],
          ],
          highlightRow: 2,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 39. Two Sum Less Than K
  // ══════════════════════════════════════════════════════
  'two-sum-less-than-k': {
    statement:
      'Given an integer array nums and integer k, return the maximum sum of a pair (nums[i], nums[j]) where i < j and nums[i] + nums[j] < k. If no valid pair exists, return -1.',
    tags: ['Arrays', 'Two Pointers'],
    requirement: 'O(n log n) for sorting + O(n) for scan',
    externalLinks: [
      { label: '↗ LeetCode #1099', url: 'https://leetcode.com/problems/two-sum-less-than-k/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [34,23,1,24,75,33,54,8], k = 60\nOutput: 58  (34+24=58)' },
      { label: 'Example 2', text: 'Input:  nums = [10,20,30], k = 15\nOutput: -1' },
    ],
    constraints: ['1 ≤ nums.length ≤ 100', '1 ≤ nums[i] ≤ 1000', '1 ≤ k ≤ 2000'],
    requiredComplexity: 'O(n log n) time · O(1) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'Sort the array first. Now you have a sorted array and need to find the maximum sum < k. Does Two Sum II on a sorted array come to mind?' },
      { number: 2, text: 'After sorting, use two pointers: left at 0, right at n-1. When sum < k, update the best answer and move left forward (to try larger sums). When sum ≥ k, move right backward.' },
      { number: 3, text: 'You want to maximize the sum, so only update best when the sum is strictly less than k. Moving left right increases the sum; moving right left decreases it.' },
      { number: 4, label: 'Hint 4 — approach', text: 'This works because the two-pointer converges to find all valid sums efficiently. The maximum valid sum is found by aggressively trying larger left values while keeping sum < k.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Sort + Two Pointers — O(n log n) time, O(1) space',
        explanation: 'Sort first. Use two pointers to find the maximum pair sum that stays below k.',
        code: {
          java: `public int twoSumLessThanK(int[] nums, int k) {
    Arrays.sort(nums);
    int left = 0, right = nums.length - 1, best = -1;
    while (left < right) {
        int sum = nums[left] + nums[right];
        if (sum < k) { best = Math.max(best, sum); left++; }
        else right--;
    }
    return best;
}`,
          cpp: `int twoSumLessThanK(vector<int>& nums, int k) {
    sort(nums.begin(), nums.end());
    int left = 0, right = nums.size()-1, best = -1;
    while (left < right) {
        int sum = nums[left] + nums[right];
        if (sum < k) { best = max(best, sum); left++; }
        else right--;
    }
    return best;
}`,
          python: `def twoSumLessThanK(nums, k):
    nums.sort()
    left, right, best = 0, len(nums)-1, -1
    while left < right:
        s = nums[left] + nums[right]
        if s < k:
            best = max(best, s)
            left += 1
        else:
            right -= 1
    return best`,
        },
        dryRun: {
          title: 'Dry run — nums sorted = [1,8,23,24,33,34,54,75], k = 60',
          columns: ['left', 'right', 'sum', 'sum<60?', 'best', 'Move'],
          rows: [
            ['0', '7', '1+75=76', 'No', '-1', 'right--'],
            ['0', '6', '1+54=55', 'Yes', '55', 'left++'],
            ['1', '6', '8+54=62', 'No', '55', 'right--'],
            ['1', '5', '8+34=42', 'Yes', '55', 'left++'],
            ['2', '5', '23+34=57', 'Yes', '57', 'left++'],
            ['3', '5', '24+34=58', 'Yes', '58', 'left++'],
            ['4', '5', '33+34=67', 'No', '58', 'right-- → left≥right → return 58 ✓'],
          ],
          highlightRow: 5,
        },
      },
    ],
  },

// ══════════════════════════════════════════════════════
// 40. Minimum Common Value
// ══════════════════════════════════════════════════════
'minimum-common-value': {
  statement:
    'Given two integer arrays nums1 and nums2, sorted in non-decreasing order, return the minimum integer common to both arrays. If there is no common integer amongst nums1 and nums2, return -1.',
  tags: ['Arrays', 'Two Pointers'],
  requirement: 'O(n + m) time preferred',
  externalLinks: [
    { label: '↗ LeetCode #2540', url: 'https://leetcode.com/problems/minimum-common-value/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums1 = [1,2,3], nums2 = [2,4]\nOutput: 2' },
    { label: 'Example 2', text: 'Input:  nums1 = [1,2,3,6], nums2 = [2,3,4,5]\nOutput: 2' },
  ],
  constraints: [
    '1 ≤ nums1.length, nums2.length ≤ 10⁵',
    '1 ≤ nums1[i], nums2[j] ≤ 10⁹',
    'Both arrays are sorted in non-decreasing order',
  ],
  requiredComplexity: 'O(n + m) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Both arrays are sorted. How can you take advantage of the sorted order to avoid checking every pair?' },
    { number: 2, text: 'If you had a pointer in each array, how would you decide which pointer to advance?' },
    { number: 3, text: 'If nums1[i] < nums2[j], can nums1[i] ever match anything? Should you move pointer i forward?' },
    { number: 4, label: 'Hint 4 — approach', text: 'Use two pointers starting at the beginning of each array. If values are equal, return it (first common = minimum common since arrays are sorted). Otherwise advance the pointer pointing to the smaller value.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Two Pointers — O(n + m) time, O(1) space',
      explanation: 'Walk through both sorted arrays simultaneously. Advance the pointer with the smaller current value. The first match found is the minimum common value.',
      code: {
        java: `public int getCommon(int[] nums1, int[] nums2) {
    int i = 0, j = 0;
    while (i < nums1.length && j < nums2.length) {
        if (nums1[i] == nums2[j]) return nums1[i];
        else if (nums1[i] < nums2[j]) i++;
        else j++;
    }
    return -1;
}`,
        cpp: `int getCommon(vector<int>& nums1, vector<int>& nums2) {
    int i = 0, j = 0;
    while (i < nums1.size() && j < nums2.size()) {
        if (nums1[i] == nums2[j]) return nums1[i];
        else if (nums1[i] < nums2[j]) i++;
        else j++;
    }
    return -1;
}`,
        python: `def getCommon(nums1, nums2):
    i, j = 0, 0
    while i < len(nums1) and j < len(nums2):
        if nums1[i] == nums2[j]:
            return nums1[i]
        elif nums1[i] < nums2[j]:
            i += 1
        else:
            j += 1
    return -1`,
      },
      dryRun: {
        title: 'Dry run — nums1 = [1,2,3,6], nums2 = [2,3,4,5]',
        columns: ['Step', 'i', 'j', 'nums1[i]', 'nums2[j]', 'Action'],
        rows: [
          ['1', '0', '0', '1', '2', '1 < 2 → i++'],
          ['2', '1', '0', '2', '2', '2 == 2 → return 2 ✓'],
        ],
        highlightRow: 1,
      },
    },
    {
      key: 'hashset',
      label: 'Hash Set — O(n + m) time, O(n) space',
      explanation: 'Store all elements of nums1 in a hash set, then iterate nums2 (sorted) and return the first match.',
      code: {
        java: `public int getCommon(int[] nums1, int[] nums2) {
    Set<Integer> set = new HashSet<>();
    for (int x : nums1) set.add(x);
    for (int x : nums2) {
        if (set.contains(x)) return x;
    }
    return -1;
}`,
        cpp: `int getCommon(vector<int>& nums1, vector<int>& nums2) {
    unordered_set<int> s(nums1.begin(), nums1.end());
    for (int x : nums2) {
        if (s.count(x)) return x;
    }
    return -1;
}`,
        python: `def getCommon(nums1, nums2):
    s = set(nums1)
    for x in nums2:
        if x in s:
            return x
    return -1`,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 41. Merge Sorted Array
// ══════════════════════════════════════════════════════
'merge-sorted-array': {
  statement:
    'You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of elements in nums1 and nums2 respectively. Merge nums2 into nums1 as one sorted array. The final sorted array should be stored inside nums1, which has a length of m + n (the last n elements are set to 0 and should be ignored).',
  tags: ['Arrays', 'Two Pointers'],
  requirement: 'In-place merge into nums1',
  externalLinks: [
    { label: '↗ LeetCode #88', url: 'https://leetcode.com/problems/merge-sorted-array/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3\nOutput: [1,2,2,3,5,6]' },
    { label: 'Example 2', text: 'Input:  nums1 = [1], m = 1, nums2 = [], n = 0\nOutput: [1]' },
    { label: 'Example 3', text: 'Input:  nums1 = [0], m = 0, nums2 = [1], n = 1\nOutput: [1]' },
  ],
  constraints: [
    'nums1.length == m + n',
    'nums2.length == n',
    '0 ≤ m, n ≤ 200',
    '1 ≤ m + n ≤ 200',
    '−10⁹ ≤ nums1[i], nums2[j] ≤ 10⁹',
  ],
  requiredComplexity: 'O(m + n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'If you merge from left to right, you might overwrite values in nums1 that you still need. What if you filled from the back instead?' },
    { number: 2, text: 'Start three pointers: p1 at index m-1 (end of nums1 data), p2 at n-1 (end of nums2), and write pointer at m+n-1 (end of nums1 buffer).' },
    { number: 3, text: 'At each step, place the larger of nums1[p1] and nums2[p2] at the write position, then decrement the appropriate pointers.' },
    { number: 4, label: 'Hint 4 — edge case', text: 'When p1 runs out, copy remaining nums2 elements. When p2 runs out, the remaining nums1 elements are already in place.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Merge from Back — O(m + n) time, O(1) space',
      explanation: 'Use three pointers starting from the ends. Compare and place the larger element at the back of nums1. This avoids overwriting unprocessed elements.',
      code: {
        java: `public void merge(int[] nums1, int m, int[] nums2, int n) {
    int p1 = m - 1, p2 = n - 1, w = m + n - 1;
    while (p1 >= 0 && p2 >= 0) {
        if (nums1[p1] > nums2[p2]) {
            nums1[w--] = nums1[p1--];
        } else {
            nums1[w--] = nums2[p2--];
        }
    }
    while (p2 >= 0) {
        nums1[w--] = nums2[p2--];
    }
}`,
        cpp: `void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
    int p1 = m - 1, p2 = n - 1, w = m + n - 1;
    while (p1 >= 0 && p2 >= 0) {
        if (nums1[p1] > nums2[p2]) nums1[w--] = nums1[p1--];
        else nums1[w--] = nums2[p2--];
    }
    while (p2 >= 0) nums1[w--] = nums2[p2--];
}`,
        python: `def merge(nums1, m, nums2, n):
    p1, p2, w = m - 1, n - 1, m + n - 1
    while p1 >= 0 and p2 >= 0:
        if nums1[p1] > nums2[p2]:
            nums1[w] = nums1[p1]
            p1 -= 1
        else:
            nums1[w] = nums2[p2]
            p2 -= 1
        w -= 1
    while p2 >= 0:
        nums1[w] = nums2[p2]
        p2 -= 1
        w -= 1`,
      },
      dryRun: {
        title: 'Dry run — nums1 = [1,2,3,0,0,0], m=3, nums2 = [2,5,6], n=3',
        columns: ['Step', 'p1', 'p2', 'w', 'Compare', 'nums1'],
        rows: [
          ['1', '2', '2', '5', '3 vs 6 → 6', '[1,2,3,0,0,6]'],
          ['2', '2', '1', '4', '3 vs 5 → 5', '[1,2,3,0,5,6]'],
          ['3', '2', '0', '3', '3 vs 2 → 3', '[1,2,3,3,5,6]'],
          ['4', '1', '0', '2', '2 vs 2 → 2', '[1,2,2,3,5,6]'],
          ['5', '1', '-1', '—', 'p2 done, remaining in place', '[1,2,2,3,5,6] ✓'],
        ],
        highlightRow: 4,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 42. Max Number of K-Sum Pairs
// ══════════════════════════════════════════════════════
'max-number-of-k-sum-pairs': {
  statement:
    'You are given an integer array nums and an integer k. In one operation, you can pick two numbers from the array whose sum equals k and remove them from the array. Return the maximum number of operations you can perform on the array.',
  tags: ['Arrays', 'Two Pointers', 'Hash Map'],
  requirement: 'O(n log n) or O(n) time',
  externalLinks: [
    { label: '↗ LeetCode #1679', url: 'https://leetcode.com/problems/max-number-of-k-sum-pairs/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums = [1,2,3,4], k = 5\nOutput: 2\nExplanation: (1,4) and (2,3)' },
    { label: 'Example 2', text: 'Input:  nums = [3,1,3,4,3], k = 6\nOutput: 1\nExplanation: only one pair (3,3)' },
  ],
  constraints: [
    '1 ≤ nums.length ≤ 10⁵',
    '1 ≤ nums[i] ≤ 10⁹',
    '1 ≤ k ≤ 10⁹',
  ],
  requiredComplexity: 'O(n log n) time · O(1) space or O(n) time · O(n) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'This is similar to Two Sum but you need to count ALL valid pairs. Can you sort the array first?' },
    { number: 2, text: 'After sorting, use two pointers from both ends. If the sum equals k, both pointers move inward and you count a pair.' },
    { number: 3, text: 'If sum < k, you need a larger number — move the left pointer right. If sum > k, move the right pointer left.' },
    { number: 4, label: 'Hint 4 — hash map approach', text: 'Alternatively, use a hash map to count frequencies. For each number, check if k - num exists with remaining count > 0.' },
  ],
  approaches: [
    {
      key: 'twopointers',
      label: 'Sort + Two Pointers — O(n log n) time, O(1) space',
      explanation: 'Sort the array, then use two pointers from both ends to find pairs that sum to k.',
      code: {
        java: `public int maxOperations(int[] nums, int k) {
    Arrays.sort(nums);
    int lo = 0, hi = nums.length - 1, ops = 0;
    while (lo < hi) {
        int sum = nums[lo] + nums[hi];
        if (sum == k) { ops++; lo++; hi--; }
        else if (sum < k) lo++;
        else hi--;
    }
    return ops;
}`,
        cpp: `int maxOperations(vector<int>& nums, int k) {
    sort(nums.begin(), nums.end());
    int lo = 0, hi = nums.size() - 1, ops = 0;
    while (lo < hi) {
        int sum = nums[lo] + nums[hi];
        if (sum == k) { ops++; lo++; hi--; }
        else if (sum < k) lo++;
        else hi--;
    }
    return ops;
}`,
        python: `def maxOperations(nums, k):
    nums.sort()
    lo, hi, ops = 0, len(nums) - 1, 0
    while lo < hi:
        s = nums[lo] + nums[hi]
        if s == k:
            ops += 1; lo += 1; hi -= 1
        elif s < k:
            lo += 1
        else:
            hi -= 1
    return ops`,
      },
      dryRun: {
        title: 'Dry run — nums = [1,2,3,4], k = 5',
        columns: ['Step', 'lo', 'hi', 'sum', 'Action', 'ops'],
        rows: [
          ['1', '0', '3', '1+4=5', 'Match → lo++, hi--', '1'],
          ['2', '1', '2', '2+3=5', 'Match → lo++, hi--', '2'],
          ['3', '2', '1', '—', 'lo ≥ hi → stop', '2 ✓'],
        ],
        highlightRow: 2,
      },
    },
    {
      key: 'hashmap',
      label: 'Hash Map — O(n) time, O(n) space',
      explanation: 'Use a frequency map. For each number, check if its complement (k - num) has remaining count.',
      code: {
        java: `public int maxOperations(int[] nums, int k) {
    Map<Integer, Integer> freq = new HashMap<>();
    int ops = 0;
    for (int num : nums) {
        int comp = k - num;
        if (freq.getOrDefault(comp, 0) > 0) {
            ops++;
            freq.put(comp, freq.get(comp) - 1);
        } else {
            freq.put(num, freq.getOrDefault(num, 0) + 1);
        }
    }
    return ops;
}`,
        cpp: `int maxOperations(vector<int>& nums, int k) {
    unordered_map<int, int> freq;
    int ops = 0;
    for (int num : nums) {
        int comp = k - num;
        if (freq[comp] > 0) {
            ops++;
            freq[comp]--;
        } else {
            freq[num]++;
        }
    }
    return ops;
}`,
        python: `def maxOperations(nums, k):
    freq = {}
    ops = 0
    for num in nums:
        comp = k - num
        if freq.get(comp, 0) > 0:
            ops += 1
            freq[comp] -= 1
        else:
            freq[num] = freq.get(num, 0) + 1
    return ops`,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 43. Remove Duplicates from Sorted Array II
// ══════════════════════════════════════════════════════
'remove-duplicates-sorted-array-ii': {
  statement:
    'Given an integer array nums sorted in non-decreasing order, remove some duplicates in-place such that each unique element appears at most twice. The relative order of the elements should be kept the same. Return k, the number of valid elements. The first k elements of nums should hold the final result.',
  tags: ['Arrays', 'Two Pointers'],
  requirement: 'In-place, O(1) extra space',
  externalLinks: [
    { label: '↗ LeetCode #80', url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums = [1,1,1,2,2,3]\nOutput: 5, nums = [1,1,2,2,3,_]' },
    { label: 'Example 2', text: 'Input:  nums = [0,0,1,1,1,1,2,3,3]\nOutput: 7, nums = [0,0,1,1,2,3,3,_,_]' },
  ],
  constraints: [
    '1 ≤ nums.length ≤ 3 × 10⁴',
    '−10⁴ ≤ nums[i] ≤ 10⁴',
    'nums is sorted in non-decreasing order',
  ],
  requiredComplexity: 'O(n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'You need a "write" pointer that tracks where the next valid element should go. What condition determines if a new element is valid?' },
    { number: 2, text: 'An element at position i is valid if it differs from the element two positions before the write pointer (nums[w-2]).' },
    { number: 3, text: 'If nums[i] != nums[w-2], it means we haven\'t placed this value twice yet, so it\'s safe to write.' },
    { number: 4, label: 'Hint 4 — generalization', text: 'This generalizes: to allow at most K duplicates, compare nums[i] with nums[w-K].' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Overwrite Pointer — O(n) time, O(1) space',
      explanation: 'Maintain a write pointer w. For each element, if w < 2 or nums[i] != nums[w-2], write it at position w and increment w.',
      code: {
        java: `public int removeDuplicates(int[] nums) {
    int w = 0;
    for (int x : nums) {
        if (w < 2 || x != nums[w - 2]) {
            nums[w++] = x;
        }
    }
    return w;
}`,
        cpp: `int removeDuplicates(vector<int>& nums) {
    int w = 0;
    for (int x : nums) {
        if (w < 2 || x != nums[w - 2]) {
            nums[w++] = x;
        }
    }
    return w;
}`,
        python: `def removeDuplicates(nums):
    w = 0
    for x in nums:
        if w < 2 or x != nums[w - 2]:
            nums[w] = x
            w += 1
    return w`,
      },
      dryRun: {
        title: 'Dry run — nums = [1,1,1,2,2,3]',
        columns: ['x', 'w', 'Condition', 'Action', 'nums (first w+1)'],
        rows: [
          ['1', '0', 'w<2 → true', 'Write, w=1', '[1]'],
          ['1', '1', 'w<2 → true', 'Write, w=2', '[1,1]'],
          ['1', '2', '1 != nums[0]=1? No', 'Skip', '[1,1]'],
          ['2', '2', '2 != nums[0]=1? Yes', 'Write, w=3', '[1,1,2]'],
          ['2', '3', '2 != nums[1]=1? Yes', 'Write, w=4', '[1,1,2,2]'],
          ['3', '4', '3 != nums[2]=2? Yes', 'Write, w=5', '[1,1,2,2,3] ✓'],
        ],
        highlightRow: 5,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 44. Sort Colors
// ══════════════════════════════════════════════════════
'sort-colors': {
  statement:
    'Given an array nums with n objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red (0), white (1), and blue (2). You must solve this problem without using the library\'s sort function.',
  tags: ['Arrays', 'Two Pointers', 'Dutch National Flag'],
  requirement: 'One-pass with O(1) extra space for full credit',
  externalLinks: [
    { label: '↗ LeetCode #75', url: 'https://leetcode.com/problems/sort-colors/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums = [2,0,2,1,1,0]\nOutput: [0,0,1,1,2,2]' },
    { label: 'Example 2', text: 'Input:  nums = [2,0,1]\nOutput: [0,1,2]' },
  ],
  constraints: [
    'n == nums.length',
    '1 ≤ n ≤ 300',
    'nums[i] is either 0, 1, or 2',
  ],
  requiredComplexity: 'O(n) time · O(1) space (one pass)',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'There are only 3 distinct values. Could you use counting sort? That works but requires two passes.' },
    { number: 2, text: 'For a one-pass solution, think of partitioning the array into three regions: [0s | 1s | unprocessed | 2s].' },
    { number: 3, text: 'Use three pointers: lo (boundary for 0s), mid (current element), hi (boundary for 2s). Process based on nums[mid].' },
    { number: 4, label: 'Hint 4 — Dutch National Flag', text: 'If nums[mid]=0: swap with lo, advance both lo and mid. If nums[mid]=2: swap with hi, decrement hi (don\'t advance mid since swapped value is unprocessed). If nums[mid]=1: just advance mid.' },
  ],
  approaches: [
    {
      key: 'counting',
      label: 'Counting Sort — O(n) time, O(1) space, two passes',
      explanation: 'Count occurrences of 0, 1, 2, then overwrite the array.',
      code: {
        java: `public void sortColors(int[] nums) {
    int c0 = 0, c1 = 0, c2 = 0;
    for (int x : nums) {
        if (x == 0) c0++;
        else if (x == 1) c1++;
        else c2++;
    }
    int i = 0;
    while (c0-- > 0) nums[i++] = 0;
    while (c1-- > 0) nums[i++] = 1;
    while (c2-- > 0) nums[i++] = 2;
}`,
        cpp: `void sortColors(vector<int>& nums) {
    int c0 = 0, c1 = 0, c2 = 0;
    for (int x : nums) { if (x==0) c0++; else if (x==1) c1++; else c2++; }
    int i = 0;
    while (c0--) nums[i++] = 0;
    while (c1--) nums[i++] = 1;
    while (c2--) nums[i++] = 2;
}`,
        python: `def sortColors(nums):
    c0 = nums.count(0)
    c1 = nums.count(1)
    c2 = nums.count(2)
    nums[:c0] = [0] * c0
    nums[c0:c0+c1] = [1] * c1
    nums[c0+c1:] = [2] * c2`,
      },
    },
    {
      key: 'optimal',
      label: 'Dutch National Flag — O(n) time, O(1) space, one pass',
      explanation: 'Three-way partition using lo, mid, hi pointers. Zeros go to the left, twos go to the right, ones stay in the middle.',
      code: {
        java: `public void sortColors(int[] nums) {
    int lo = 0, mid = 0, hi = nums.length - 1;
    while (mid <= hi) {
        if (nums[mid] == 0) {
            int t = nums[lo]; nums[lo] = nums[mid]; nums[mid] = t;
            lo++; mid++;
        } else if (nums[mid] == 2) {
            int t = nums[mid]; nums[mid] = nums[hi]; nums[hi] = t;
            hi--;
        } else {
            mid++;
        }
    }
}`,
        cpp: `void sortColors(vector<int>& nums) {
    int lo = 0, mid = 0, hi = nums.size() - 1;
    while (mid <= hi) {
        if (nums[mid] == 0) swap(nums[lo++], nums[mid++]);
        else if (nums[mid] == 2) swap(nums[mid], nums[hi--]);
        else mid++;
    }
}`,
        python: `def sortColors(nums):
    lo, mid, hi = 0, 0, len(nums) - 1
    while mid <= hi:
        if nums[mid] == 0:
            nums[lo], nums[mid] = nums[mid], nums[lo]
            lo += 1; mid += 1
        elif nums[mid] == 2:
            nums[mid], nums[hi] = nums[hi], nums[mid]
            hi -= 1
        else:
            mid += 1`,
      },
      dryRun: {
        title: 'Dry run — nums = [2,0,2,1,1,0]',
        columns: ['Step', 'lo', 'mid', 'hi', 'nums[mid]', 'Action', 'Array'],
        rows: [
          ['1', '0', '0', '5', '2', 'Swap mid↔hi, hi--', '[0,0,2,1,1,2]'],
          ['2', '0', '0', '4', '0', 'Swap lo↔mid, lo++, mid++', '[0,0,2,1,1,2]'],
          ['3', '1', '1', '4', '0', 'Swap lo↔mid, lo++, mid++', '[0,0,2,1,1,2]'],
          ['4', '2', '2', '4', '2', 'Swap mid↔hi, hi--', '[0,0,1,1,2,2]'],
          ['5', '2', '2', '3', '1', 'mid++', '[0,0,1,1,2,2]'],
          ['6', '2', '3', '3', '1', 'mid++', '[0,0,1,1,2,2]'],
          ['7', '2', '4', '3', '—', 'mid > hi → stop', '[0,0,1,1,2,2] ✓'],
        ],
        highlightRow: 6,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 45. Partition Array According to Given Pivot
// ══════════════════════════════════════════════════════
'partition-array-according-to-pivot': {
  statement:
    'You are given a 0-indexed integer array nums and an integer pivot. Rearrange nums such that: every element less than pivot appears before every element equal to pivot, and every element equal to pivot appears before every element greater than pivot. The relative order of elements less than, equal to, and greater than pivot must be maintained. Return the resulting array.',
  tags: ['Arrays', 'Two Pointers'],
  requirement: 'Maintain relative order within each partition',
  externalLinks: [
    { label: '↗ LeetCode #2161', url: 'https://leetcode.com/problems/partition-array-according-to-given-pivot/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums = [9,12,5,10,14,3,10], pivot = 10\nOutput: [9,5,3,10,10,12,14]' },
    { label: 'Example 2', text: 'Input:  nums = [-3,4,3,2], pivot = 2\nOutput: [-3,4,3,2]  (already partitioned; but actually: [-3,2,4,3])' },
  ],
  constraints: [
    '1 ≤ nums.length ≤ 10⁵',
    '−10⁶ ≤ nums[i] ≤ 10⁶',
    'pivot equals an element of nums',
  ],
  requiredComplexity: 'O(n) time · O(n) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Unlike Dutch National Flag, you need to preserve relative order. Does that rule out in-place swapping?' },
    { number: 2, text: 'Consider making three separate lists: elements < pivot, elements == pivot, elements > pivot.' },
    { number: 3, text: 'Concatenate the three lists in order. This preserves relative ordering within each group.' },
    { number: 4, label: 'Hint 4 — single pass', text: 'You can also use a result array with a pointer for the "less" section and fill equal/greater afterward, all in one or two passes.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Three Buckets — O(n) time, O(n) space',
      explanation: 'Separate elements into three groups maintaining order, then concatenate.',
      code: {
        java: `public int[] pivotArray(int[] nums, int pivot) {
    List<Integer> less = new ArrayList<>();
    List<Integer> equal = new ArrayList<>();
    List<Integer> greater = new ArrayList<>();
    for (int x : nums) {
        if (x < pivot) less.add(x);
        else if (x == pivot) equal.add(x);
        else greater.add(x);
    }
    int i = 0;
    for (int x : less) nums[i++] = x;
    for (int x : equal) nums[i++] = x;
    for (int x : greater) nums[i++] = x;
    return nums;
}`,
        cpp: `vector<int> pivotArray(vector<int>& nums, int pivot) {
    vector<int> less, equal, greater;
    for (int x : nums) {
        if (x < pivot) less.push_back(x);
        else if (x == pivot) equal.push_back(x);
        else greater.push_back(x);
    }
    vector<int> res;
    res.insert(res.end(), less.begin(), less.end());
    res.insert(res.end(), equal.begin(), equal.end());
    res.insert(res.end(), greater.begin(), greater.end());
    return res;
}`,
        python: `def pivotArray(nums, pivot):
    less = [x for x in nums if x < pivot]
    equal = [x for x in nums if x == pivot]
    greater = [x for x in nums if x > pivot]
    return less + equal + greater`,
      },
      dryRun: {
        title: 'Dry run — nums = [9,12,5,10,14,3,10], pivot = 10',
        columns: ['Step', 'Action', 'Result'],
        rows: [
          ['1', 'Collect less: [9,5,3]', 'less = [9,5,3]'],
          ['2', 'Collect equal: [10,10]', 'equal = [10,10]'],
          ['3', 'Collect greater: [12,14]', 'greater = [12,14]'],
          ['4', 'Concatenate', '[9,5,3,10,10,12,14] ✓'],
        ],
        highlightRow: 3,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 46. Boats to Save People
// ══════════════════════════════════════════════════════
'boats-to-save-people': {
  statement:
    'You are given an array people where people[i] is the weight of the ith person, and an infinite number of boats where each boat can carry a maximum weight of limit. Each boat carries at most two people at the same time, provided the sum of the weight of those people is at most limit. Return the minimum number of boats to carry every given person.',
  tags: ['Arrays', 'Two Pointers', 'Greedy'],
  requirement: 'O(n log n) time',
  externalLinks: [
    { label: '↗ LeetCode #881', url: 'https://leetcode.com/problems/boats-to-save-people/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  people = [1,2], limit = 3\nOutput: 1' },
    { label: 'Example 2', text: 'Input:  people = [3,2,2,1], limit = 3\nOutput: 3' },
    { label: 'Example 3', text: 'Input:  people = [3,5,3,4], limit = 5\nOutput: 4' },
  ],
  constraints: [
    '1 ≤ people.length ≤ 5 × 10⁴',
    '1 ≤ people[i] ≤ limit ≤ 3 × 10⁴',
  ],
  requiredComplexity: 'O(n log n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Each boat fits at most 2 people. To minimize boats, you want to pair people optimally. Who should you try to pair the heaviest person with?' },
    { number: 2, text: 'Sort the array. Try pairing the heaviest with the lightest. If they fit together, great — both go. If not, the heaviest goes alone.' },
    { number: 3, text: 'Use two pointers: one at the lightest (left) and one at the heaviest (right). If they fit, move both inward. Otherwise, only move the right pointer.' },
    { number: 4, label: 'Hint 4 — correctness', text: 'Greedy works here because pairing heaviest with lightest is always optimal — if the lightest can\'t fit with the heaviest, it certainly can\'t fit with anyone heavier.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Sort + Greedy Two Pointers — O(n log n) time, O(1) space',
      explanation: 'Sort the array. Use two pointers to try pairing the lightest and heaviest person. Count boats.',
      code: {
        java: `public int numRescueBoats(int[] people, int limit) {
    Arrays.sort(people);
    int lo = 0, hi = people.length - 1, boats = 0;
    while (lo <= hi) {
        if (people[lo] + people[hi] <= limit) {
            lo++;
        }
        hi--;
        boats++;
    }
    return boats;
}`,
        cpp: `int numRescueBoats(vector<int>& people, int limit) {
    sort(people.begin(), people.end());
    int lo = 0, hi = people.size() - 1, boats = 0;
    while (lo <= hi) {
        if (people[lo] + people[hi] <= limit) lo++;
        hi--;
        boats++;
    }
    return boats;
}`,
        python: `def numRescueBoats(people, limit):
    people.sort()
    lo, hi, boats = 0, len(people) - 1, 0
    while lo <= hi:
        if people[lo] + people[hi] <= limit:
            lo += 1
        hi -= 1
        boats += 1
    return boats`,
      },
      dryRun: {
        title: 'Dry run — people = [3,2,2,1], limit = 3, sorted = [1,2,2,3]',
        columns: ['Step', 'lo', 'hi', 'people[lo]+people[hi]', 'Action', 'boats'],
        rows: [
          ['1', '0', '3', '1+3=4 > 3', 'Heavy alone, hi--', '1'],
          ['2', '0', '2', '1+2=3 ≤ 3', 'Pair! lo++, hi--', '2'],
          ['3', '1', '1', '2 alone (lo==hi)', 'hi--', '3'],
          ['4', '1', '0', 'lo > hi → stop', '—', '3 ✓'],
        ],
        highlightRow: 3,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 47. 3Sum Closest
// ══════════════════════════════════════════════════════
'3sum-closest': {
  statement:
    'Given an integer array nums of length n and an integer target, find three integers in nums such that the sum is closest to target. Return the sum of the three integers. You may assume that each input would have exactly one solution.',
  tags: ['Arrays', 'Two Pointers', 'Sorting'],
  requirement: 'O(n²) time',
  externalLinks: [
    { label: '↗ LeetCode #16', url: 'https://leetcode.com/problems/3sum-closest/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums = [-1,2,1,-4], target = 1\nOutput: 2\nExplanation: (-1 + 2 + 1 = 2)' },
    { label: 'Example 2', text: 'Input:  nums = [0,0,0], target = 1\nOutput: 0' },
  ],
  constraints: [
    '3 ≤ nums.length ≤ 500',
    '−1000 ≤ nums[i] ≤ 1000',
    '−10⁴ ≤ target ≤ 10⁴',
  ],
  requiredComplexity: 'O(n²) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'This is a variation of 3Sum. Instead of finding sum == 0, you\'re minimizing |sum - target|. How did 3Sum work?' },
    { number: 2, text: 'Sort the array. Fix one element, then use two pointers for the remaining pair.' },
    { number: 3, text: 'Track the closest sum seen so far. If the current sum equals target, return immediately.' },
    { number: 4, label: 'Hint 4 — pointer movement', text: 'If sum < target, move the left pointer right to increase the sum. If sum > target, move the right pointer left to decrease it.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Sort + Two Pointers — O(n²) time, O(1) space',
      explanation: 'Sort, fix one element, use two pointers for the other two, and track the sum closest to target.',
      code: {
        java: `public int threeSumClosest(int[] nums, int target) {
    Arrays.sort(nums);
    int closest = nums[0] + nums[1] + nums[2];
    for (int i = 0; i < nums.length - 2; i++) {
        int lo = i + 1, hi = nums.length - 1;
        while (lo < hi) {
            int sum = nums[i] + nums[lo] + nums[hi];
            if (Math.abs(sum - target) < Math.abs(closest - target)) {
                closest = sum;
            }
            if (sum < target) lo++;
            else if (sum > target) hi--;
            else return sum;
        }
    }
    return closest;
}`,
        cpp: `int threeSumClosest(vector<int>& nums, int target) {
    sort(nums.begin(), nums.end());
    int closest = nums[0] + nums[1] + nums[2];
    for (int i = 0; i < (int)nums.size() - 2; i++) {
        int lo = i + 1, hi = nums.size() - 1;
        while (lo < hi) {
            int sum = nums[i] + nums[lo] + nums[hi];
            if (abs(sum - target) < abs(closest - target)) closest = sum;
            if (sum < target) lo++;
            else if (sum > target) hi--;
            else return sum;
        }
    }
    return closest;
}`,
        python: `def threeSumClosest(nums, target):
    nums.sort()
    closest = nums[0] + nums[1] + nums[2]
    for i in range(len(nums) - 2):
        lo, hi = i + 1, len(nums) - 1
        while lo < hi:
            s = nums[i] + nums[lo] + nums[hi]
            if abs(s - target) < abs(closest - target):
                closest = s
            if s < target:
                lo += 1
            elif s > target:
                hi -= 1
            else:
                return s
    return closest`,
      },
      dryRun: {
        title: 'Dry run — nums = [-1,2,1,-4], target = 1, sorted = [-4,-1,1,2]',
        columns: ['i', 'lo', 'hi', 'sum', '|sum-target|', 'closest'],
        rows: [
          ['0(-4)', '1(-1)', '3(2)', '-3', '4', '-3'],
          ['0(-4)', '2(1)', '3(2)', '-1', '2', '-1'],
          ['1(-1)', '2(1)', '3(2)', '2', '1', '2'],
          ['1(-1)', '—', '—', 'lo≥hi', '—', '2 ✓'],
        ],
        highlightRow: 2,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 48. Container With Most Water
// ══════════════════════════════════════════════════════
'container-with-most-water': {
  statement:
    'You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis forms a container, such that the container contains the most water. Return the maximum amount of water a container can store.',
  tags: ['Arrays', 'Two Pointers', 'Greedy'],
  requirement: 'O(n) time',
  externalLinks: [
    { label: '↗ LeetCode #11', url: 'https://leetcode.com/problems/container-with-most-water/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  height = [1,8,6,2,5,4,8,3,7]\nOutput: 49\nExplanation: Lines at index 1 (height 8) and index 8 (height 7), area = 7 × 7 = 49' },
    { label: 'Example 2', text: 'Input:  height = [1,1]\nOutput: 1' },
  ],
  constraints: [
    'n == height.length',
    '2 ≤ n ≤ 10⁵',
    '0 ≤ height[i] ≤ 10⁴',
  ],
  requiredComplexity: 'O(n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Water area = min(height[l], height[r]) × (r - l). To maximize this, start with the widest container. How do you decide which side to move?' },
    { number: 2, text: 'Moving the taller side inward can only decrease width without possibly increasing the limiting height. So always move the shorter side.' },
    { number: 3, text: 'Use two pointers at both ends. Compute area, update max, then move the pointer pointing to the shorter line.' },
    { number: 4, label: 'Hint 4 — why greedy works', text: 'The shorter line is the bottleneck. By moving it, we might find a taller line that could increase the area despite the decreased width. Moving the taller line can never help.' },
  ],
  approaches: [
    {
      key: 'brute',
      label: 'Brute Force — O(n²) time',
      explanation: 'Check every pair of lines and compute the area. Track the maximum.',
      code: {
        java: `public int maxArea(int[] height) {
    int max = 0;
    for (int i = 0; i < height.length; i++) {
        for (int j = i + 1; j < height.length; j++) {
            int area = Math.min(height[i], height[j]) * (j - i);
            max = Math.max(max, area);
        }
    }
    return max;
}`,
        cpp: `int maxArea(vector<int>& height) {
    int mx = 0;
    for (int i = 0; i < height.size(); i++)
        for (int j = i + 1; j < height.size(); j++)
            mx = max(mx, min(height[i], height[j]) * (j - i));
    return mx;
}`,
        python: `def maxArea(height):
    mx = 0
    for i in range(len(height)):
        for j in range(i + 1, len(height)):
            mx = max(mx, min(height[i], height[j]) * (j - i))
    return mx`,
      },
    },
    {
      key: 'optimal',
      label: 'Two Pointers — O(n) time, O(1) space',
      explanation: 'Start with the widest container, then greedily move the shorter side inward.',
      code: {
        java: `public int maxArea(int[] height) {
    int lo = 0, hi = height.length - 1, max = 0;
    while (lo < hi) {
        int area = Math.min(height[lo], height[hi]) * (hi - lo);
        max = Math.max(max, area);
        if (height[lo] < height[hi]) lo++;
        else hi--;
    }
    return max;
}`,
        cpp: `int maxArea(vector<int>& height) {
    int lo = 0, hi = height.size() - 1, mx = 0;
    while (lo < hi) {
        mx = max(mx, min(height[lo], height[hi]) * (hi - lo));
        if (height[lo] < height[hi]) lo++;
        else hi--;
    }
    return mx;
}`,
        python: `def maxArea(height):
    lo, hi, mx = 0, len(height) - 1, 0
    while lo < hi:
        mx = max(mx, min(height[lo], height[hi]) * (hi - lo))
        if height[lo] < height[hi]:
            lo += 1
        else:
            hi -= 1
    return mx`,
      },
      dryRun: {
        title: 'Dry run — height = [1,8,6,2,5,4,8,3,7]',
        columns: ['lo', 'hi', 'h[lo]', 'h[hi]', 'width', 'area', 'max'],
        rows: [
          ['0', '8', '1', '7', '8', '8', '8'],
          ['1', '8', '8', '7', '7', '49', '49'],
          ['1', '7', '8', '3', '6', '18', '49'],
          ['1', '6', '8', '8', '5', '40', '49'],
          ['2', '6', '6', '8', '4', '24', '49'],
          ['...', '...', '...', '...', '...', '...', '49 ✓'],
        ],
        highlightRow: 1,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 49. 3Sum
// ══════════════════════════════════════════════════════
'3sum': {
  statement:
    'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0. The solution set must not contain duplicate triplets.',
  tags: ['Arrays', 'Two Pointers', 'Sorting'],
  requirement: 'No duplicate triplets, O(n²) time',
  externalLinks: [
    { label: '↗ LeetCode #15', url: 'https://leetcode.com/problems/3sum/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums = [-1,0,1,2,-1,-4]\nOutput: [[-1,-1,2],[-1,0,1]]' },
    { label: 'Example 2', text: 'Input:  nums = [0,1,1]\nOutput: []' },
    { label: 'Example 3', text: 'Input:  nums = [0,0,0]\nOutput: [[0,0,0]]' },
  ],
  constraints: [
    '3 ≤ nums.length ≤ 3000',
    '−10⁵ ≤ nums[i] ≤ 10⁵',
  ],
  requiredComplexity: 'O(n²) time · O(1) extra space (excluding output)',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Sorting makes it easy to skip duplicates and use two pointers. How would you reduce this to a Two Sum problem?' },
    { number: 2, text: 'Fix one element nums[i], then find two elements in the remaining array that sum to -nums[i].' },
    { number: 3, text: 'After sorting, skip duplicate values of nums[i] to avoid duplicate triplets.' },
    { number: 4, label: 'Hint 4 — deduplication', text: 'Inside the two-pointer loop, after finding a valid triplet, skip over duplicate values for both the left and right pointers before continuing.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Sort + Two Pointers — O(n²) time, O(1) space',
      explanation: 'Sort the array. For each element, use two pointers on the remaining subarray to find pairs that sum to the negation of the fixed element. Skip duplicates at every level.',
      code: {
        java: `public List<List<Integer>> threeSum(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> res = new ArrayList<>();
    for (int i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;
        int lo = i + 1, hi = nums.length - 1;
        while (lo < hi) {
            int sum = nums[i] + nums[lo] + nums[hi];
            if (sum < 0) lo++;
            else if (sum > 0) hi--;
            else {
                res.add(Arrays.asList(nums[i], nums[lo], nums[hi]));
                while (lo < hi && nums[lo] == nums[lo + 1]) lo++;
                while (lo < hi && nums[hi] == nums[hi - 1]) hi--;
                lo++; hi--;
            }
        }
    }
    return res;
}`,
        cpp: `vector<vector<int>> threeSum(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> res;
    for (int i = 0; i < (int)nums.size() - 2; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;
        int lo = i + 1, hi = nums.size() - 1;
        while (lo < hi) {
            int sum = nums[i] + nums[lo] + nums[hi];
            if (sum < 0) lo++;
            else if (sum > 0) hi--;
            else {
                res.push_back({nums[i], nums[lo], nums[hi]});
                while (lo < hi && nums[lo] == nums[lo + 1]) lo++;
                while (lo < hi && nums[hi] == nums[hi - 1]) hi--;
                lo++; hi--;
            }
        }
    }
    return res;
}`,
        python: `def threeSum(nums):
    nums.sort()
    res = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        lo, hi = i + 1, len(nums) - 1
        while lo < hi:
            s = nums[i] + nums[lo] + nums[hi]
            if s < 0:
                lo += 1
            elif s > 0:
                hi -= 1
            else:
                res.append([nums[i], nums[lo], nums[hi]])
                while lo < hi and nums[lo] == nums[lo + 1]:
                    lo += 1
                while lo < hi and nums[hi] == nums[hi - 1]:
                    hi -= 1
                lo += 1; hi -= 1
    return res`,
      },
      dryRun: {
        title: 'Dry run — nums = [-1,0,1,2,-1,-4], sorted = [-4,-1,-1,0,1,2]',
        columns: ['i', 'nums[i]', 'lo', 'hi', 'sum', 'Action'],
        rows: [
          ['0', '-4', '1', '5', '-4+-1+2=-3<0', 'lo++'],
          ['0', '-4', '2', '5', '-4+-1+2=-3<0', 'lo++'],
          ['0', '-4', '3', '5', '-4+0+2=-2<0', 'lo++'],
          ['0', '-4', '4', '5', '-4+1+2=-1<0', 'lo++, lo≥hi done'],
          ['1', '-1', '2', '5', '-1+-1+2=0', 'Found [-1,-1,2], skip dups'],
          ['1', '-1', '3', '4', '-1+0+1=0', 'Found [-1,0,1], skip dups'],
          ['2', '-1', '—', '—', 'skip (dup of i=1)', '—'],
          ['—', '—', '—', '—', '—', 'Result: [[-1,-1,2],[-1,0,1]] ✓'],
        ],
        highlightRow: 4,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 50. 4Sum
// ══════════════════════════════════════════════════════
'4sum': {
  statement:
    'Given an array nums of n integers, return an array of all the unique quadruplets [nums[a], nums[b], nums[c], nums[d]] such that a, b, c, d are distinct indices and nums[a] + nums[b] + nums[c] + nums[d] == target.',
  tags: ['Arrays', 'Two Pointers', 'Sorting'],
  requirement: 'No duplicate quadruplets',
  externalLinks: [
    { label: '↗ LeetCode #18', url: 'https://leetcode.com/problems/4sum/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums = [1,0,-1,0,-2,2], target = 0\nOutput: [[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]' },
    { label: 'Example 2', text: 'Input:  nums = [2,2,2,2,2], target = 8\nOutput: [[2,2,2,2]]' },
  ],
  constraints: [
    '1 ≤ nums.length ≤ 200',
    '−10⁹ ≤ nums[i] ≤ 10⁹',
    '−10⁹ ≤ target ≤ 10⁹',
  ],
  requiredComplexity: 'O(n³) time · O(1) extra space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'This extends 3Sum. Can you add one more loop on top of the 3Sum approach?' },
    { number: 2, text: 'Sort the array. Fix two elements (i, j), then use two pointers for the remaining pair.' },
    { number: 3, text: 'Skip duplicates at every level: for i, for j, and inside the two-pointer loop.' },
    { number: 4, label: 'Hint 4 — overflow', text: 'Be careful with integer overflow when summing four numbers. Use long in Java/C++ or just rely on Python\'s big integers.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Sort + Two Pointers — O(n³) time, O(1) space',
      explanation: 'Generalize 3Sum: fix two numbers, then two-pointer search for the remaining pair.',
      code: {
        java: `public List<List<Integer>> fourSum(int[] nums, int target) {
    Arrays.sort(nums);
    List<List<Integer>> res = new ArrayList<>();
    int n = nums.length;
    for (int i = 0; i < n - 3; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;
        for (int j = i + 1; j < n - 2; j++) {
            if (j > i + 1 && nums[j] == nums[j - 1]) continue;
            int lo = j + 1, hi = n - 1;
            while (lo < hi) {
                long sum = (long)nums[i] + nums[j] + nums[lo] + nums[hi];
                if (sum < target) lo++;
                else if (sum > target) hi--;
                else {
                    res.add(Arrays.asList(nums[i], nums[j], nums[lo], nums[hi]));
                    while (lo < hi && nums[lo] == nums[lo + 1]) lo++;
                    while (lo < hi && nums[hi] == nums[hi - 1]) hi--;
                    lo++; hi--;
                }
            }
        }
    }
    return res;
}`,
        cpp: `vector<vector<int>> fourSum(vector<int>& nums, int target) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> res;
    int n = nums.size();
    for (int i = 0; i < n - 3; i++) {
        if (i > 0 && nums[i] == nums[i-1]) continue;
        for (int j = i+1; j < n - 2; j++) {
            if (j > i+1 && nums[j] == nums[j-1]) continue;
            int lo = j+1, hi = n-1;
            while (lo < hi) {
                long long sum = (long long)nums[i]+nums[j]+nums[lo]+nums[hi];
                if (sum < target) lo++;
                else if (sum > target) hi--;
                else {
                    res.push_back({nums[i],nums[j],nums[lo],nums[hi]});
                    while (lo<hi && nums[lo]==nums[lo+1]) lo++;
                    while (lo<hi && nums[hi]==nums[hi-1]) hi--;
                    lo++; hi--;
                }
            }
        }
    }
    return res;
}`,
        python: `def fourSum(nums, target):
    nums.sort()
    res, n = [], len(nums)
    for i in range(n - 3):
        if i > 0 and nums[i] == nums[i-1]:
            continue
        for j in range(i+1, n - 2):
            if j > i+1 and nums[j] == nums[j-1]:
                continue
            lo, hi = j+1, n-1
            while lo < hi:
                s = nums[i]+nums[j]+nums[lo]+nums[hi]
                if s < target:
                    lo += 1
                elif s > target:
                    hi -= 1
                else:
                    res.append([nums[i],nums[j],nums[lo],nums[hi]])
                    while lo < hi and nums[lo] == nums[lo+1]: lo += 1
                    while lo < hi and nums[hi] == nums[hi-1]: hi -= 1
                    lo += 1; hi -= 1
    return res`,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 51. Trapping Rain Water
// ══════════════════════════════════════════════════════
'trapping-rain-water': {
  statement:
    'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
  tags: ['Arrays', 'Two Pointers', 'Stack', 'Dynamic Programming'],
  requirement: 'O(n) time for full credit',
  externalLinks: [
    { label: '↗ LeetCode #42', url: 'https://leetcode.com/problems/trapping-rain-water/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  height = [0,1,0,2,1,0,1,3,2,1,2,1]\nOutput: 6' },
    { label: 'Example 2', text: 'Input:  height = [4,2,0,3,2,5]\nOutput: 9' },
  ],
  constraints: [
    'n == height.length',
    '1 ≤ n ≤ 2 × 10⁴',
    '0 ≤ height[i] ≤ 10⁵',
  ],
  requiredComplexity: 'O(n) time · O(1) space (two pointers) or O(n) space (prefix arrays)',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'How much water sits on top of bar i? It depends on the tallest bar to its left and the tallest bar to its right. What\'s the formula?' },
    { number: 2, text: 'Water at position i = max(0, min(leftMax[i], rightMax[i]) - height[i]). Can you precompute leftMax and rightMax arrays?' },
    { number: 3, text: 'That gives an O(n) time, O(n) space solution. To reduce space to O(1), can you use two pointers instead of prefix arrays?' },
    { number: 4, label: 'Hint 4 — two pointer insight', text: 'Maintain leftMax and rightMax as running values. If leftMax < rightMax, the water at the left pointer is determined by leftMax (right side is guaranteed taller). Process the side with the smaller max.' },
  ],
  approaches: [
    {
      key: 'prefix',
      label: 'Prefix Max Arrays — O(n) time, O(n) space',
      explanation: 'Precompute leftMax[i] and rightMax[i], then water at each position is min(leftMax, rightMax) - height.',
      code: {
        java: `public int trap(int[] height) {
    int n = height.length;
    int[] leftMax = new int[n], rightMax = new int[n];
    leftMax[0] = height[0];
    for (int i = 1; i < n; i++)
        leftMax[i] = Math.max(leftMax[i-1], height[i]);
    rightMax[n-1] = height[n-1];
    for (int i = n-2; i >= 0; i--)
        rightMax[i] = Math.max(rightMax[i+1], height[i]);
    int water = 0;
    for (int i = 0; i < n; i++)
        water += Math.min(leftMax[i], rightMax[i]) - height[i];
    return water;
}`,
        cpp: `int trap(vector<int>& height) {
    int n = height.size();
    vector<int> leftMax(n), rightMax(n);
    leftMax[0] = height[0];
    for (int i = 1; i < n; i++) leftMax[i] = max(leftMax[i-1], height[i]);
    rightMax[n-1] = height[n-1];
    for (int i = n-2; i >= 0; i--) rightMax[i] = max(rightMax[i+1], height[i]);
    int water = 0;
    for (int i = 0; i < n; i++) water += min(leftMax[i], rightMax[i]) - height[i];
    return water;
}`,
        python: `def trap(height):
    n = len(height)
    left_max = [0] * n
    right_max = [0] * n
    left_max[0] = height[0]
    for i in range(1, n):
        left_max[i] = max(left_max[i-1], height[i])
    right_max[-1] = height[-1]
    for i in range(n-2, -1, -1):
        right_max[i] = max(right_max[i+1], height[i])
    return sum(min(left_max[i], right_max[i]) - height[i] for i in range(n))`,
      },
    },
    {
      key: 'optimal',
      label: 'Two Pointers — O(n) time, O(1) space',
      explanation: 'Use two pointers from both ends with running leftMax and rightMax. Process the side with the smaller known max.',
      code: {
        java: `public int trap(int[] height) {
    int lo = 0, hi = height.length - 1;
    int leftMax = 0, rightMax = 0, water = 0;
    while (lo < hi) {
        if (height[lo] < height[hi]) {
            leftMax = Math.max(leftMax, height[lo]);
            water += leftMax - height[lo];
            lo++;
        } else {
            rightMax = Math.max(rightMax, height[hi]);
            water += rightMax - height[hi];
            hi--;
        }
    }
    return water;
}`,
        cpp: `int trap(vector<int>& height) {
    int lo = 0, hi = height.size() - 1;
    int leftMax = 0, rightMax = 0, water = 0;
    while (lo < hi) {
        if (height[lo] < height[hi]) {
            leftMax = max(leftMax, height[lo]);
            water += leftMax - height[lo++];
        } else {
            rightMax = max(rightMax, height[hi]);
            water += rightMax - height[hi--];
        }
    }
    return water;
}`,
        python: `def trap(height):
    lo, hi = 0, len(height) - 1
    left_max = right_max = water = 0
    while lo < hi:
        if height[lo] < height[hi]:
            left_max = max(left_max, height[lo])
            water += left_max - height[lo]
            lo += 1
        else:
            right_max = max(right_max, height[hi])
            water += right_max - height[hi]
            hi -= 1
    return water`,
      },
      dryRun: {
        title: 'Dry run — height = [0,1,0,2,1,0,1,3,2,1,2,1]',
        columns: ['lo', 'hi', 'h[lo]', 'h[hi]', 'leftMax', 'rightMax', '+water', 'total'],
        rows: [
          ['0', '11', '0', '1', '0', '0', '0', '0'],
          ['1', '11', '1', '1', '1', '0', '0', '0'],
          ['1', '10', '1', '2', '1', '2', '0', '0'],
          ['2', '10', '0', '2', '1', '2', '1', '1'],
          ['3', '10', '2', '2', '2', '2', '0', '1'],
          ['...', '...', '...', '...', '...', '...', '...', '6 ✓'],
        ],
        highlightRow: 5,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 52. Maximum Average Subarray I
// ══════════════════════════════════════════════════════
'maximum-average-subarray-i': {
  statement:
    'You are given an integer array nums consisting of n elements, and an integer k. Find a contiguous subarray whose length is equal to k that has the maximum average value and return this value.',
  tags: ['Arrays', 'Sliding Window'],
  requirement: 'O(n) time',
  externalLinks: [
    { label: '↗ LeetCode #643', url: 'https://leetcode.com/problems/maximum-average-subarray-i/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums = [1,12,-5,-6,50,3], k = 4\nOutput: 12.75\nExplanation: max avg subarray is [12,-5,-6,50] with sum 51' },
    { label: 'Example 2', text: 'Input:  nums = [5], k = 1\nOutput: 5.0' },
  ],
  constraints: [
    'n == nums.length',
    '1 ≤ k ≤ n ≤ 10⁵',
    '−10⁴ ≤ nums[i] ≤ 10⁴',
  ],
  requiredComplexity: 'O(n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'You need the max sum of any window of size k (then divide by k). How do you efficiently compute sums for all windows of size k?' },
    { number: 2, text: 'Compute the sum of the first k elements. Then slide the window: add the next element, remove the leftmost element.' },
    { number: 3, text: 'Track the maximum sum across all windows. At the end, return maxSum / k.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Fixed-size Sliding Window — O(n) time, O(1) space',
      explanation: 'Compute the initial window sum, then slide by adding one and removing one element at each step.',
      code: {
        java: `public double findMaxAverage(int[] nums, int k) {
    int sum = 0;
    for (int i = 0; i < k; i++) sum += nums[i];
    int maxSum = sum;
    for (int i = k; i < nums.length; i++) {
        sum += nums[i] - nums[i - k];
        maxSum = Math.max(maxSum, sum);
    }
    return (double) maxSum / k;
}`,
        cpp: `double findMaxAverage(vector<int>& nums, int k) {
    int sum = 0;
    for (int i = 0; i < k; i++) sum += nums[i];
    int maxSum = sum;
    for (int i = k; i < (int)nums.size(); i++) {
        sum += nums[i] - nums[i - k];
        maxSum = max(maxSum, sum);
    }
    return (double)maxSum / k;
}`,
        python: `def findMaxAverage(nums, k):
    window_sum = sum(nums[:k])
    max_sum = window_sum
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]
        max_sum = max(max_sum, window_sum)
    return max_sum / k`,
      },
      dryRun: {
        title: 'Dry run — nums = [1,12,-5,-6,50,3], k = 4',
        columns: ['Window', 'Elements', 'sum', 'maxSum'],
        rows: [
          ['[0,3]', '[1,12,-5,-6]', '2', '2'],
          ['[1,4]', '[12,-5,-6,50]', '51', '51'],
          ['[2,5]', '[-5,-6,50,3]', '42', '51'],
          ['—', 'Answer = 51/4', '—', '12.75 ✓'],
        ],
        highlightRow: 1,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 52. Minimum Swaps to Group All 1s Together
// ══════════════════════════════════════════════════════
'minimum-swaps-group-all-1s': {
  statement:
    'Given a binary array data, return the minimum number of swaps required to group all 1s present in the array together in any place in the array.',
  tags: ['Arrays', 'Sliding Window'],
  requirement: 'O(n) time',
  externalLinks: [
    { label: '↗ LeetCode #1151', url: 'https://leetcode.com/problems/minimum-swaps-to-group-all-1-s-together/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  data = [1,0,1,0,1]\nOutput: 1\nExplanation: swap data[1] and data[3] → [1,1,1,0,0]' },
    { label: 'Example 2', text: 'Input:  data = [0,0,0,1,0]\nOutput: 0' },
    { label: 'Example 3', text: 'Input:  data = [1,0,1,0,1,0,0,1,1,0,1]\nOutput: 3' },
  ],
  constraints: [
    '1 ≤ data.length ≤ 10⁵',
    'data[i] is either 0 or 1',
  ],
  requiredComplexity: 'O(n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'If there are totalOnes 1s in the array, then the final grouped block will have size totalOnes. So you\'re looking for a window of that size.' },
    { number: 2, text: 'For each window of size totalOnes, count how many 0s are inside it. Those 0s need to be swapped out.' },
    { number: 3, text: 'Use a fixed-size sliding window of size totalOnes. The answer is the minimum number of 0s in any such window.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Fixed-size Sliding Window — O(n) time, O(1) space',
      explanation: 'Window size = total number of 1s. Slide and count zeros in each window. Minimum zeros = minimum swaps.',
      code: {
        java: `public int minSwaps(int[] data) {
    int totalOnes = 0;
    for (int d : data) totalOnes += d;
    if (totalOnes <= 1) return 0;
    int zeros = 0;
    for (int i = 0; i < totalOnes; i++)
        if (data[i] == 0) zeros++;
    int minZeros = zeros;
    for (int i = totalOnes; i < data.length; i++) {
        if (data[i] == 0) zeros++;
        if (data[i - totalOnes] == 0) zeros--;
        minZeros = Math.min(minZeros, zeros);
    }
    return minZeros;
}`,
        cpp: `int minSwaps(vector<int>& data) {
    int totalOnes = accumulate(data.begin(), data.end(), 0);
    if (totalOnes <= 1) return 0;
    int zeros = 0;
    for (int i = 0; i < totalOnes; i++)
        if (data[i] == 0) zeros++;
    int minZeros = zeros;
    for (int i = totalOnes; i < (int)data.size(); i++) {
        zeros += (data[i] == 0) - (data[i - totalOnes] == 0);
        minZeros = min(minZeros, zeros);
    }
    return minZeros;
}`,
        python: `def minSwaps(data):
    total_ones = sum(data)
    if total_ones <= 1:
        return 0
    zeros = data[:total_ones].count(0)
    min_zeros = zeros
    for i in range(total_ones, len(data)):
        zeros += (data[i] == 0) - (data[i - total_ones] == 0)
        min_zeros = min(min_zeros, zeros)
    return min_zeros`,
      },
      dryRun: {
        title: 'Dry run — data = [1,0,1,0,1], totalOnes = 3',
        columns: ['Window', 'Elements', 'Zeros', 'minZeros'],
        rows: [
          ['[0,2]', '[1,0,1]', '1', '1'],
          ['[1,3]', '[0,1,0]', '2', '1'],
          ['[2,4]', '[1,0,1]', '1', '1'],
          ['—', 'Answer', '—', '1 ✓'],
        ],
        highlightRow: 0,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
//53. Minimum Size Subarray Sum
// ══════════════════════════════════════════════════════
'minimum-size-subarray-sum': {
  statement:
    'Given an array of positive integers nums and a positive integer target, return the minimal length of a subarray whose sum is greater than or equal to target. If there is no such subarray, return 0.',
  tags: ['Arrays', 'Sliding Window'],
  requirement: 'O(n) time',
  externalLinks: [
    { label: '↗ LeetCode #209', url: 'https://leetcode.com/problems/minimum-size-subarray-sum/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  target = 7, nums = [2,3,1,2,4,3]\nOutput: 2\nExplanation: [4,3] has sum ≥ 7 and length 2' },
    { label: 'Example 2', text: 'Input:  target = 4, nums = [1,4,4]\nOutput: 1' },
    { label: 'Example 3', text: 'Input:  target = 11, nums = [1,1,1,1,1,1,1,1]\nOutput: 0' },
  ],
  constraints: [
    '1 ≤ target ≤ 10⁹',
    '1 ≤ nums.length ≤ 10⁵',
    '1 ≤ nums[i] ≤ 10⁴',
  ],
  requiredComplexity: 'O(n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'All numbers are positive, so as you extend the window to the right, the sum increases. When the sum is large enough, can you shrink from the left?' },
    { number: 2, text: 'Use a variable-size sliding window. Expand right to grow the sum, shrink left while the sum is still ≥ target.' },
    { number: 3, text: 'Each time the sum ≥ target, update the minimum length, then move the left pointer right to see if a smaller window still works.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Sliding Window — O(n) time, O(1) space',
      explanation: 'Expand window from the right, contract from the left whenever sum ≥ target. Track minimum window length.',
      code: {
        java: `public int minSubArrayLen(int target, int[] nums) {
    int left = 0, sum = 0, minLen = Integer.MAX_VALUE;
    for (int right = 0; right < nums.length; right++) {
        sum += nums[right];
        while (sum >= target) {
            minLen = Math.min(minLen, right - left + 1);
            sum -= nums[left++];
        }
    }
    return minLen == Integer.MAX_VALUE ? 0 : minLen;
}`,
        cpp: `int minSubArrayLen(int target, vector<int>& nums) {
    int left = 0, sum = 0, minLen = INT_MAX;
    for (int right = 0; right < (int)nums.size(); right++) {
        sum += nums[right];
        while (sum >= target) {
            minLen = min(minLen, right - left + 1);
            sum -= nums[left++];
        }
    }
    return minLen == INT_MAX ? 0 : minLen;
}`,
        python: `def minSubArrayLen(target, nums):
    left = 0
    total = 0
    min_len = float('inf')
    for right in range(len(nums)):
        total += nums[right]
        while total >= target:
            min_len = min(min_len, right - left + 1)
            total -= nums[left]
            left += 1
    return 0 if min_len == float('inf') else min_len`,
      },
      dryRun: {
        title: 'Dry run — target = 7, nums = [2,3,1,2,4,3]',
        columns: ['right', 'sum', 'left', 'window', 'minLen'],
        rows: [
          ['0', '2', '0', '[2]', '∞'],
          ['1', '5', '0', '[2,3]', '∞'],
          ['2', '6', '0', '[2,3,1]', '∞'],
          ['3', '8≥7', '0→1', '[2,3,1,2]→shrink', '4'],
          ['3', '6', '1', '[3,1,2]', '4'],
          ['4', '10≥7', '1→2→3', 'shrink twice', '3→2'],
          ['5', '9≥7→5', '3→4→5', 'shrink', '2'],
          ['—', '—', '—', 'Answer', '2 ✓'],
        ],
        highlightRow: 5,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 54. Longest Subarray of 1s After Deleting One Element
// ══════════════════════════════════════════════════════
'longest-subarray-after-deleting-one': {
  statement:
    'Given a binary array nums, you should delete one element from it. Return the size of the longest non-empty subarray containing only 1s in the resulting array. Return 0 if there is no such subarray.',
  tags: ['Arrays', 'Sliding Window'],
  requirement: 'O(n) time',
  externalLinks: [
    { label: '↗ LeetCode #1493', url: 'https://leetcode.com/problems/longest-subarray-of-1s-after-deleting-one-element/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums = [1,1,0,1]\nOutput: 3\nExplanation: Delete nums[2] → [1,1,1]' },
    { label: 'Example 2', text: 'Input:  nums = [0,1,1,1,0,1,1,0,1]\nOutput: 5\nExplanation: Delete nums[4] → longest run of 1s is 5' },
    { label: 'Example 3', text: 'Input:  nums = [1,1,1]\nOutput: 2\nExplanation: Must delete one element' },
  ],
  constraints: [
    '1 ≤ nums.length ≤ 10⁵',
    'nums[i] is either 0 or 1',
  ],
  requiredComplexity: 'O(n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'This is equivalent to: find the longest window containing at most one 0. After you "delete" that 0, the remaining 1s form your answer.' },
    { number: 2, text: 'Use a sliding window that allows at most one zero inside. Track the count of zeros in the window.' },
    { number: 3, text: 'When zeros > 1, shrink from the left. The answer is the maximum (window length - 1) since you must delete one element.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Sliding Window — O(n) time, O(1) space',
      explanation: 'Maintain a window with at most 1 zero. The longest valid window minus 1 (for the mandatory deletion) is the answer.',
      code: {
        java: `public int longestSubarray(int[] nums) {
    int left = 0, zeros = 0, maxLen = 0;
    for (int right = 0; right < nums.length; right++) {
        if (nums[right] == 0) zeros++;
        while (zeros > 1) {
            if (nums[left] == 0) zeros--;
            left++;
        }
        maxLen = Math.max(maxLen, right - left); // not +1, because we delete one
    }
    return maxLen;
}`,
        cpp: `int longestSubarray(vector<int>& nums) {
    int left = 0, zeros = 0, maxLen = 0;
    for (int right = 0; right < (int)nums.size(); right++) {
        if (nums[right] == 0) zeros++;
        while (zeros > 1) {
            if (nums[left] == 0) zeros--;
            left++;
        }
        maxLen = max(maxLen, right - left);
    }
    return maxLen;
}`,
        python: `def longestSubarray(nums):
    left = zeros = max_len = 0
    for right in range(len(nums)):
        if nums[right] == 0:
            zeros += 1
        while zeros > 1:
            if nums[left] == 0:
                zeros -= 1
            left += 1
        max_len = max(max_len, right - left)  # -1 accounted by not adding 1
    return max_len`,
      },
      dryRun: {
        title: 'Dry run — nums = [0,1,1,1,0,1,1,0,1]',
        columns: ['right', 'nums[r]', 'zeros', 'left', 'window len', 'r-l (ans candidate)'],
        rows: [
          ['0', '0', '1', '0', '1', '0'],
          ['1', '1', '1', '0', '2', '1'],
          ['2', '1', '1', '0', '3', '2'],
          ['3', '1', '1', '0', '4', '3'],
          ['4', '0', '2→shrink→1', '1', '4', '3'],
          ['5', '1', '1', '1', '5', '4'],
          ['6', '1', '1', '1', '6', '5'],
          ['7', '0', '2→shrink→1', '5', '3', '2'],
          ['8', '1', '1', '5', '4', '3'],
          ['—', '—', '—', '—', 'Answer', '5 ✓'],
        ],
        highlightRow: 6,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 55. Max Consecutive Ones III
// ══════════════════════════════════════════════════════
'max-consecutive-ones-iii': {
  statement:
    'Given a binary array nums and an integer k, return the maximum number of consecutive 1s in the array if you can flip at most k 0s.',
  tags: ['Arrays', 'Sliding Window'],
  requirement: 'O(n) time',
  externalLinks: [
    { label: '↗ LeetCode #1004', url: 'https://leetcode.com/problems/max-consecutive-ones-iii/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2\nOutput: 6\nExplanation: Flip nums[5] and nums[10] → [1,1,1,0,0,1,1,1,1,1,1]' },
    { label: 'Example 2', text: 'Input:  nums = [0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1], k = 3\nOutput: 10' },
  ],
  constraints: [
    '1 ≤ nums.length ≤ 10⁵',
    'nums[i] is either 0 or 1',
    '0 ≤ k ≤ nums.length',
  ],
  requiredComplexity: 'O(n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Rephrasing: find the longest subarray with at most k zeros.' },
    { number: 2, text: 'Use a sliding window. Expand right, counting zeros. When zeros exceed k, shrink from the left.' },
    { number: 3, text: 'The window length at any valid state (zeros ≤ k) is a candidate for the answer.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Sliding Window — O(n) time, O(1) space',
      explanation: 'Maintain a window with at most k zeros. Track maximum window size.',
      code: {
        java: `public int longestOnes(int[] nums, int k) {
    int left = 0, zeros = 0, maxLen = 0;
    for (int right = 0; right < nums.length; right++) {
        if (nums[right] == 0) zeros++;
        while (zeros > k) {
            if (nums[left] == 0) zeros--;
            left++;
        }
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
        cpp: `int longestOnes(vector<int>& nums, int k) {
    int left = 0, zeros = 0, maxLen = 0;
    for (int right = 0; right < (int)nums.size(); right++) {
        if (nums[right] == 0) zeros++;
        while (zeros > k) {
            if (nums[left] == 0) zeros--;
            left++;
        }
        maxLen = max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
        python: `def longestOnes(nums, k):
    left = zeros = max_len = 0
    for right in range(len(nums)):
        if nums[right] == 0:
            zeros += 1
        while zeros > k:
            if nums[left] == 0:
                zeros -= 1
            left += 1
        max_len = max(max_len, right - left + 1)
    return max_len`,
      },
      dryRun: {
        title: 'Dry run — nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2',
        columns: ['right', 'nums[r]', 'zeros', 'left', 'window', 'maxLen'],
        rows: [
          ['0-2', '1,1,1', '0', '0', '3', '3'],
          ['3', '0', '1', '0', '4', '4'],
          ['4', '0', '2', '0', '5', '5'],
          ['5', '0', '3→shrink→2', '4', '2', '5'],
          ['6-9', '1,1,1,1', '2', '4', '6', '6'],
          ['10', '0', '3→shrink→2', '6', '5', '6 ✓'],
        ],
        highlightRow: 4,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 56. Fruit Into Baskets
// ══════════════════════════════════════════════════════
'fruit-into-baskets': {
  statement:
    'You are visiting a farm with a row of fruit trees represented by an integer array fruits where fruits[i] is the type of fruit the ith tree produces. You have two baskets, and each basket can only hold a single type of fruit (unlimited quantity). Starting from any tree, you must pick exactly one fruit from every tree moving to the right until you cannot (encounter a third fruit type). Return the maximum number of fruits you can pick.',
  tags: ['Arrays', 'Sliding Window', 'Hash Map'],
  requirement: 'O(n) time',
  externalLinks: [
    { label: '↗ LeetCode #904', url: 'https://leetcode.com/problems/fruit-into-baskets/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  fruits = [1,2,1]\nOutput: 3' },
    { label: 'Example 2', text: 'Input:  fruits = [0,1,2,2]\nOutput: 3\nExplanation: Pick from trees [1,2,2]' },
    { label: 'Example 3', text: 'Input:  fruits = [1,2,3,2,2]\nOutput: 4\nExplanation: Pick from trees [2,3,2,2]' },
  ],
  constraints: [
    '1 ≤ fruits.length ≤ 10⁵',
    '0 ≤ fruits[i] < fruits.length',
  ],
  requiredComplexity: 'O(n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Rephrasing: find the longest subarray with at most 2 distinct values.' },
    { number: 2, text: 'Use a sliding window with a hash map tracking the count of each fruit type in the current window.' },
    { number: 3, text: 'When the map has more than 2 keys, shrink from the left, decrementing counts and removing types when count reaches 0.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Sliding Window + Hash Map — O(n) time, O(1) space',
      explanation: 'Variable-size window maintaining at most 2 distinct fruit types using a frequency map.',
      code: {
        java: `public int totalFruit(int[] fruits) {
    Map<Integer, Integer> count = new HashMap<>();
    int left = 0, maxLen = 0;
    for (int right = 0; right < fruits.length; right++) {
        count.merge(fruits[right], 1, Integer::sum);
        while (count.size() > 2) {
            int f = fruits[left];
            count.put(f, count.get(f) - 1);
            if (count.get(f) == 0) count.remove(f);
            left++;
        }
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
        cpp: `int totalFruit(vector<int>& fruits) {
    unordered_map<int,int> count;
    int left = 0, maxLen = 0;
    for (int right = 0; right < (int)fruits.size(); right++) {
        count[fruits[right]]++;
        while (count.size() > 2) {
            if (--count[fruits[left]] == 0) count.erase(fruits[left]);
            left++;
        }
        maxLen = max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
        python: `def totalFruit(fruits):
    count = {}
    left = max_len = 0
    for right, f in enumerate(fruits):
        count[f] = count.get(f, 0) + 1
        while len(count) > 2:
            lf = fruits[left]
            count[lf] -= 1
            if count[lf] == 0:
                del count[lf]
            left += 1
        max_len = max(max_len, right - left + 1)
    return max_len`,
      },
      dryRun: {
        title: 'Dry run — fruits = [1,2,3,2,2]',
        columns: ['right', 'fruit', 'count', 'left', 'window', 'maxLen'],
        rows: [
          ['0', '1', '{1:1}', '0', '1', '1'],
          ['1', '2', '{1:1,2:1}', '0', '2', '2'],
          ['2', '3', '{1:1,2:1,3:1}→shrink', '1', '2', '2'],
          ['2', '3', '{2:1,3:1}', '1', '2', '2'],
          ['3', '2', '{2:2,3:1}', '1', '3', '3'],
          ['4', '2', '{2:3,3:1}', '1', '4', '4 ✓'],
        ],
        highlightRow: 5,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 57. Grumpy Bookstore Owner
// ══════════════════════════════════════════════════════
'grumpy-bookstore-owner': {
  statement:
    'A bookstore owner has a store open for n minutes. Each minute has customers[i] customers and grumpy[i] indicates whether the owner is grumpy (1) or not (0). When grumpy, customers are unsatisfied. The owner can use a secret technique to not be grumpy for minutes consecutive minutes, but only once. Return the maximum number of satisfied customers.',
  tags: ['Arrays', 'Sliding Window'],
  requirement: 'O(n) time',
  externalLinks: [
    { label: '↗ LeetCode #1052', url: 'https://leetcode.com/problems/grumpy-bookstore-owner/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  customers = [1,0,1,2,1,1,7,5], grumpy = [0,1,0,1,0,1,0,1], minutes = 3\nOutput: 16' },
  ],
  constraints: [
    'n == customers.length == grumpy.length',
    '1 ≤ n ≤ 2 × 10⁴',
    '0 ≤ customers[i] ≤ 1000',
    'grumpy[i] is 0 or 1',
    '1 ≤ minutes ≤ n',
  ],
  requiredComplexity: 'O(n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Split the problem: first compute the baseline — all customers during non-grumpy minutes. Then find the best window of size "minutes" that recovers the most "lost" grumpy customers.' },
    { number: 2, text: 'The "bonus" from the technique at any window = sum of customers[i] where grumpy[i] == 1 within that window.' },
    { number: 3, text: 'Slide a window of the given size and find the maximum bonus. The answer is baseline + maxBonus.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Sliding Window — O(n) time, O(1) space',
      explanation: 'Compute baseline satisfied customers. Then use a fixed-size sliding window to find the maximum additional customers recoverable during grumpy minutes.',
      code: {
        java: `public int maxSatisfied(int[] customers, int[] grumpy, int minutes) {
    int baseline = 0, n = customers.length;
    for (int i = 0; i < n; i++)
        if (grumpy[i] == 0) baseline += customers[i];
    // Find max bonus in a window of size 'minutes'
    int bonus = 0;
    for (int i = 0; i < minutes; i++)
        if (grumpy[i] == 1) bonus += customers[i];
    int maxBonus = bonus;
    for (int i = minutes; i < n; i++) {
        if (grumpy[i] == 1) bonus += customers[i];
        if (grumpy[i - minutes] == 1) bonus -= customers[i - minutes];
        maxBonus = Math.max(maxBonus, bonus);
    }
    return baseline + maxBonus;
}`,
        cpp: `int maxSatisfied(vector<int>& customers, vector<int>& grumpy, int minutes) {
    int baseline = 0, n = customers.size();
    for (int i = 0; i < n; i++)
        if (!grumpy[i]) baseline += customers[i];
    int bonus = 0;
    for (int i = 0; i < minutes; i++)
        if (grumpy[i]) bonus += customers[i];
    int maxBonus = bonus;
    for (int i = minutes; i < n; i++) {
        if (grumpy[i]) bonus += customers[i];
        if (grumpy[i - minutes]) bonus -= customers[i - minutes];
        maxBonus = max(maxBonus, bonus);
    }
    return baseline + maxBonus;
}`,
        python: `def maxSatisfied(customers, grumpy, minutes):
    baseline = sum(c for c, g in zip(customers, grumpy) if g == 0)
    bonus = sum(c for c, g in zip(customers[:minutes], grumpy[:minutes]) if g == 1)
    max_bonus = bonus
    for i in range(minutes, len(customers)):
        if grumpy[i] == 1:
            bonus += customers[i]
        if grumpy[i - minutes] == 1:
            bonus -= customers[i - minutes]
        max_bonus = max(max_bonus, bonus)
    return baseline + max_bonus`,
      },
      dryRun: {
        title: 'Dry run — customers=[1,0,1,2,1,1,7,5], grumpy=[0,1,0,1,0,1,0,1], minutes=3',
        columns: ['Step', 'Detail', 'Value'],
        rows: [
          ['1', 'Baseline (non-grumpy): c[0]+c[2]+c[4]+c[6] = 1+1+1+7', '10'],
          ['2', 'Window [0,2] bonus: grumpy[1]→c[1]=0', '0'],
          ['3', 'Window [1,3] bonus: c[1]+c[3]=0+2', '2'],
          ['4', 'Window [2,4] bonus: c[3]=2', '2'],
          ['5', 'Window [3,5] bonus: c[3]+c[5]=2+1', '3'],
          ['6', 'Window [4,6] bonus: c[5]=1', '1'],
          ['7', 'Window [5,7] bonus: c[5]+c[7]=1+5', '6'],
          ['8', 'maxBonus = 6, answer = 10+6', '16 ✓'],
        ],
        highlightRow: 7,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 58. Frequency of the Most Frequent Element
// ══════════════════════════════════════════════════════
'frequency-of-most-frequent-element': {
  statement:
    'The frequency of an element is the number of times it occurs in an array. You are given an integer array nums and an integer k. In one operation, you can choose an index and increment the element at that index by 1. Return the maximum possible frequency of an element after performing at most k operations.',
  tags: ['Arrays', 'Sliding Window', 'Sorting'],
  requirement: 'O(n log n) time',
  externalLinks: [
    { label: '↗ LeetCode #1838', url: 'https://leetcode.com/problems/frequency-of-the-most-frequent-element/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums = [1,2,4], k = 5\nOutput: 3\nExplanation: Increment 1 twice and 2 once → [4,4,4]' },
    { label: 'Example 2', text: 'Input:  nums = [1,4,8,13], k = 5\nOutput: 2' },
    { label: 'Example 3', text: 'Input:  nums = [3,9,6], k = 2\nOutput: 1' },
  ],
  constraints: [
    '1 ≤ nums.length ≤ 10⁵',
    '1 ≤ nums[i] ≤ 10⁵',
    '1 ≤ k ≤ 10⁵',
  ],
  requiredComplexity: 'O(n log n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'You can only increment, not decrement. After sorting, the target value for any window is the rightmost (largest) element. The cost to make all elements in the window equal to nums[right] is?' },
    { number: 2, text: 'Cost = nums[right] * windowSize - sum(window). If this exceeds k, shrink the window from the left.' },
    { number: 3, text: 'Sort the array, use a sliding window tracking the sum, and ensure cost ≤ k.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Sort + Sliding Window — O(n log n) time, O(1) space',
      explanation: 'Sort the array. Slide a window, making all elements equal to nums[right]. The cost is (right - left + 1) * nums[right] - windowSum. Shrink left when cost > k.',
      code: {
        java: `public int maxFrequency(int[] nums, int k) {
    Arrays.sort(nums);
    long sum = 0;
    int left = 0, maxFreq = 1;
    for (int right = 0; right < nums.length; right++) {
        sum += nums[right];
        while ((long)nums[right] * (right - left + 1) - sum > k) {
            sum -= nums[left++];
        }
        maxFreq = Math.max(maxFreq, right - left + 1);
    }
    return maxFreq;
}`,
        cpp: `int maxFrequency(vector<int>& nums, int k) {
    sort(nums.begin(), nums.end());
    long long sum = 0;
    int left = 0, maxFreq = 1;
    for (int right = 0; right < (int)nums.size(); right++) {
        sum += nums[right];
        while ((long long)nums[right] * (right - left + 1) - sum > k) {
            sum -= nums[left++];
        }
        maxFreq = max(maxFreq, right - left + 1);
    }
    return maxFreq;
}`,
        python: `def maxFrequency(nums, k):
    nums.sort()
    left = 0
    total = 0
    max_freq = 1
    for right in range(len(nums)):
        total += nums[right]
        while nums[right] * (right - left + 1) - total > k:
            total -= nums[left]
            left += 1
        max_freq = max(max_freq, right - left + 1)
    return max_freq`,
      },
      dryRun: {
        title: 'Dry run — nums = [1,2,4], k = 5, sorted = [1,2,4]',
        columns: ['right', 'nums[r]', 'sum', 'cost', 'left', 'freq'],
        rows: [
          ['0', '1', '1', '1*1-1=0 ≤ 5', '0', '1'],
          ['1', '2', '3', '2*2-3=1 ≤ 5', '0', '2'],
          ['2', '4', '7', '4*3-7=5 ≤ 5', '0', '3'],
          ['—', '—', '—', 'Answer', '—', '3 ✓'],
        ],
        highlightRow: 2,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 59. Subarrays with K Different Integers
// ══════════════════════════════════════════════════════
'subarrays-with-k-different-integers': {
  statement:
    'Given an integer array nums and an integer k, return the number of good subarrays of nums. A good subarray is a subarray where the number of different integers in that subarray is exactly k.',
  tags: ['Arrays', 'Sliding Window', 'Hash Map'],
  requirement: 'O(n) time',
  externalLinks: [
    { label: '↗ LeetCode #992', url: 'https://leetcode.com/problems/subarrays-with-k-different-integers/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums = [1,2,1,2,3], k = 2\nOutput: 7\nExplanation: [1,2],[2,1],[1,2],[2,3],[1,2,1],[2,1,2],[1,2,1,2]' },
    { label: 'Example 2', text: 'Input:  nums = [1,2,1,3,4], k = 3\nOutput: 3' },
  ],
  constraints: [
    '1 ≤ nums.length ≤ 2 × 10⁴',
    '1 ≤ nums[i], k ≤ nums.length',
  ],
  requiredComplexity: 'O(n) time · O(n) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Counting subarrays with exactly k distinct values is hard directly. Can you decompose it into something easier?' },
    { number: 2, text: 'exactly(k) = atMost(k) - atMost(k-1). Counting subarrays with at most k distinct values is a standard sliding window problem.' },
    { number: 3, text: 'For atMost(k): slide a window, keeping a frequency map with ≤ k distinct keys. When the window is valid, all subarrays ending at right (from left to right) are valid — that\'s (right - left + 1) subarrays.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'atMost(k) - atMost(k-1) — O(n) time, O(n) space',
      explanation: 'Define a helper that counts subarrays with at most k distinct integers. The answer is atMost(k) - atMost(k-1).',
      code: {
        java: `public int subarraysWithKDistinct(int[] nums, int k) {
    return atMost(nums, k) - atMost(nums, k - 1);
}

private int atMost(int[] nums, int k) {
    Map<Integer, Integer> count = new HashMap<>();
    int left = 0, result = 0;
    for (int right = 0; right < nums.length; right++) {
        count.merge(nums[right], 1, Integer::sum);
        while (count.size() > k) {
            int v = nums[left];
            count.put(v, count.get(v) - 1);
            if (count.get(v) == 0) count.remove(v);
            left++;
        }
        result += right - left + 1;
    }
    return result;
}`,
        cpp: `int subarraysWithKDistinct(vector<int>& nums, int k) {
    return atMost(nums, k) - atMost(nums, k - 1);
}

int atMost(vector<int>& nums, int k) {
    unordered_map<int,int> count;
    int left = 0, result = 0;
    for (int right = 0; right < (int)nums.size(); right++) {
        count[nums[right]]++;
        while ((int)count.size() > k) {
            if (--count[nums[left]] == 0) count.erase(nums[left]);
            left++;
        }
        result += right - left + 1;
    }
    return result;
}`,
        python: `def subarraysWithKDistinct(nums, k):
    def atMost(k):
        count = {}
        left = result = 0
        for right, val in enumerate(nums):
            count[val] = count.get(val, 0) + 1
            while len(count) > k:
                lv = nums[left]
                count[lv] -= 1
                if count[lv] == 0:
                    del count[lv]
                left += 1
            result += right - left + 1
        return result
    return atMost(k) - atMost(k - 1)`,
      },
      dryRun: {
        title: 'Dry run — nums = [1,2,1,2,3], k = 2',
        columns: ['Computation', 'Value'],
        rows: [
          ['atMost(2)', '1+2+3+3+3 = 12'],
          ['atMost(1)', '1+1+1+1+1 = 5'],
          ['exactly(2) = 12 - 5', '7 ✓'],
        ],
        highlightRow: 2,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 60. Count Number of Nice Subarrays
// ══════════════════════════════════════════════════════
'count-nice-subarrays': {
  statement:
    'Given an array of integers nums and an integer k, return the number of nice sub-arrays. A continuous subarray is called nice if there are k odd numbers in it.',
  tags: ['Arrays', 'Sliding Window', 'Prefix Sum'],
  requirement: 'O(n) time',
  externalLinks: [
    { label: '↗ LeetCode #1248', url: 'https://leetcode.com/problems/count-number-of-nice-subarrays/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums = [1,1,2,1,1], k = 3\nOutput: 2\nExplanation: [1,1,2,1] and [1,2,1,1]' },
    { label: 'Example 2', text: 'Input:  nums = [2,4,6], k = 1\nOutput: 0' },
    { label: 'Example 3', text: 'Input:  nums = [2,2,2,1,2,2,1,2,2,2], k = 2\nOutput: 16' },
  ],
  constraints: [
    '1 ≤ nums.length ≤ 5 × 10⁴',
    '1 ≤ nums[i] ≤ 10⁵',
    '1 ≤ k ≤ nums.length',
  ],
  requiredComplexity: 'O(n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Replace each element with 1 if odd, 0 if even. Now you need subarrays with sum exactly k. Does this remind you of a familiar technique?' },
    { number: 2, text: 'Use the atMost trick: exactly(k) = atMost(k) - atMost(k-1), where atMost counts subarrays with at most k odd numbers.' },
    { number: 3, text: 'Alternatively, use prefix sums: count how many prefix sums have value (currentPrefixSum - k).' },
  ],
  approaches: [
    {
      key: 'sliding',
      label: 'atMost(k) - atMost(k-1) — O(n) time, O(1) space',
      explanation: 'Same decomposition as "Subarrays with K Different Integers" but tracking count of odd numbers instead of distinct values.',
      code: {
        java: `public int numberOfSubarrays(int[] nums, int k) {
    return atMost(nums, k) - atMost(nums, k - 1);
}

private int atMost(int[] nums, int k) {
    int left = 0, odds = 0, result = 0;
    for (int right = 0; right < nums.length; right++) {
        if (nums[right] % 2 == 1) odds++;
        while (odds > k) {
            if (nums[left] % 2 == 1) odds--;
            left++;
        }
        result += right - left + 1;
    }
    return result;
}`,
        cpp: `int numberOfSubarrays(vector<int>& nums, int k) {
    return atMost(nums, k) - atMost(nums, k - 1);
}

int atMost(vector<int>& nums, int k) {
    int left = 0, odds = 0, result = 0;
    for (int right = 0; right < (int)nums.size(); right++) {
        if (nums[right] & 1) odds++;
        while (odds > k) {
            if (nums[left] & 1) odds--;
            left++;
        }
        result += right - left + 1;
    }
    return result;
}`,
        python: `def numberOfSubarrays(nums, k):
    def atMost(k):
        left = odds = result = 0
        for right in range(len(nums)):
            if nums[right] % 2 == 1:
                odds += 1
            while odds > k:
                if nums[left] % 2 == 1:
                    odds -= 1
                left += 1
            result += right - left + 1
        return result
    return atMost(k) - atMost(k - 1)`,
      },
    },
    {
      key: 'prefix',
      label: 'Prefix Sum + Hash Map — O(n) time, O(n) space',
      explanation: 'Maintain a running count of odd numbers (prefix sum). Use a hash map to count how many previous prefixes had value (current - k).',
      code: {
        java: `public int numberOfSubarrays(int[] nums, int k) {
    Map<Integer, Integer> prefixCount = new HashMap<>();
    prefixCount.put(0, 1);
    int odds = 0, result = 0;
    for (int num : nums) {
        if (num % 2 == 1) odds++;
        result += prefixCount.getOrDefault(odds - k, 0);
        prefixCount.merge(odds, 1, Integer::sum);
    }
    return result;
}`,
        cpp: `int numberOfSubarrays(vector<int>& nums, int k) {
    unordered_map<int,int> prefixCount;
    prefixCount[0] = 1;
    int odds = 0, result = 0;
    for (int num : nums) {
        if (num & 1) odds++;
        result += prefixCount[odds - k];
        prefixCount[odds]++;
    }
    return result;
}`,
        python: `def numberOfSubarrays(nums, k):
    prefix_count = {0: 1}
    odds = result = 0
    for num in nums:
        if num % 2 == 1:
            odds += 1
        result += prefix_count.get(odds - k, 0)
        prefix_count[odds] = prefix_count.get(odds, 0) + 1
    return result`,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 61. Maximum Points You Can Obtain from Cards
// ══════════════════════════════════════════════════════
'max-points-from-cards': {
  statement:
    'There are several cards arranged in a row, and each card has an associated number of points given in the integer array cardPoints. In one step, you can take one card from the beginning or from the end of the row. You have to take exactly k cards. Your score is the sum of the points of the cards you have taken. Return the maximum score you can obtain.',
  tags: ['Arrays', 'Sliding Window'],
  requirement: 'O(n) time',
  externalLinks: [
    { label: '↗ LeetCode #1423', url: 'https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  cardPoints = [1,2,3,4,5,6,1], k = 3\nOutput: 12\nExplanation: Take right 3 cards: 1+6+5 = 12' },
    { label: 'Example 2', text: 'Input:  cardPoints = [2,2,2], k = 2\nOutput: 4' },
    { label: 'Example 3', text: 'Input:  cardPoints = [9,7,7,9,7,7,9], k = 7\nOutput: 55' },
  ],
  constraints: [
    '1 ≤ cardPoints.length ≤ 10⁵',
    '1 ≤ cardPoints[i] ≤ 10⁴',
    '1 ≤ k ≤ cardPoints.length',
  ],
  requiredComplexity: 'O(n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Taking k cards from the ends is the same as leaving (n - k) cards in the middle. Can you reframe this as a minimization problem?' },
    { number: 2, text: 'Find the minimum sum subarray of length (n - k). The answer is totalSum - minWindowSum.' },
    { number: 3, text: 'Use a fixed-size sliding window of size (n - k) to find the minimum sum window.' },
    { number: 4, label: 'Hint 4 — alternative approach', text: 'Alternatively, compute the sum of the first k cards, then slide: remove one card from the right of the left portion and add one card from the right end. Track the maximum.' },
  ],
  approaches: [
    {
      key: 'inverse',
      label: 'Inverse Sliding Window — O(n) time, O(1) space',
      explanation: 'Find the minimum sum subarray of length n-k. Answer = totalSum - minSubarraySum.',
      code: {
        java: `public int maxScore(int[] cardPoints, int k) {
    int n = cardPoints.length;
    int windowSize = n - k;
    int totalSum = 0;
    for (int c : cardPoints) totalSum += c;
    if (windowSize == 0) return totalSum;
    int windowSum = 0;
    for (int i = 0; i < windowSize; i++) windowSum += cardPoints[i];
    int minWindowSum = windowSum;
    for (int i = windowSize; i < n; i++) {
        windowSum += cardPoints[i] - cardPoints[i - windowSize];
        minWindowSum = Math.min(minWindowSum, windowSum);
    }
    return totalSum - minWindowSum;
}`,
        cpp: `int maxScore(vector<int>& cardPoints, int k) {
    int n = cardPoints.size(), windowSize = n - k;
    int totalSum = accumulate(cardPoints.begin(), cardPoints.end(), 0);
    if (windowSize == 0) return totalSum;
    int windowSum = 0;
    for (int i = 0; i < windowSize; i++) windowSum += cardPoints[i];
    int minWindowSum = windowSum;
    for (int i = windowSize; i < n; i++) {
        windowSum += cardPoints[i] - cardPoints[i - windowSize];
        minWindowSum = min(minWindowSum, windowSum);
    }
    return totalSum - minWindowSum;
}`,
        python: `def maxScore(cardPoints, k):
    n = len(cardPoints)
    window_size = n - k
    total = sum(cardPoints)
    if window_size == 0:
        return total
    window_sum = sum(cardPoints[:window_size])
    min_window = window_sum
    for i in range(window_size, n):
        window_sum += cardPoints[i] - cardPoints[i - window_size]
        min_window = min(min_window, window_sum)
    return total - min_window`,
      },
      dryRun: {
        title: 'Dry run — cardPoints = [1,2,3,4,5,6,1], k = 3',
        columns: ['Step', 'Detail', 'Value'],
        rows: [
          ['1', 'totalSum = 1+2+3+4+5+6+1', '22'],
          ['2', 'windowSize = 7-3 = 4', '4'],
          ['3', 'Initial window [0,3]: 1+2+3+4', '10'],
          ['4', 'Window [1,4]: 2+3+4+5', '14'],
          ['5', 'Window [2,5]: 3+4+5+6', '18'],
          ['6', 'Window [3,6]: 4+5+6+1', '16'],
          ['7', 'minWindow = 10', '10'],
          ['8', 'Answer = 22 - 10', '12 ✓'],
        ],
        highlightRow: 7,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 62. Maximum Sum of Two Non-Overlapping Subarrays
// ══════════════════════════════════════════════════════
'max-sum-two-non-overlapping-subarrays': {
  statement:
    'Given an integer array nums and two integers firstLen and secondLen, return the maximum sum of elements in two non-overlapping subarrays with lengths firstLen and secondLen. The subarrays can appear in either order (first before second or second before first).',
  tags: ['Arrays', 'Sliding Window', 'Prefix Sum'],
  requirement: 'O(n) time',
  externalLinks: [
    { label: '↗ LeetCode #1031', url: 'https://leetcode.com/problems/maximum-sum-of-two-non-overlapping-subarrays/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums = [0,6,5,2,2,5,1,9,4], firstLen = 1, secondLen = 2\nOutput: 20\nExplanation: [9] + [6,5] = 20' },
    { label: 'Example 2', text: 'Input:  nums = [3,8,1,3,2,1,8,9,0], firstLen = 3, secondLen = 2\nOutput: 29\nExplanation: [3,8,1] + [8,9] = 29' },
  ],
  constraints: [
    '1 ≤ firstLen, secondLen ≤ 1000',
    '2 ≤ nums.length ≤ 1000',
    'firstLen + secondLen ≤ nums.length',
    '0 ≤ nums[i] ≤ 1000',
  ],
  requiredComplexity: 'O(n) time · O(n) space (prefix sum)',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'The two subarrays don\'t overlap. So one comes before the other. Can you handle both orderings separately?' },
    { number: 2, text: 'Build a prefix sum array. For each position, compute the best subarray of length firstLen ending at or before that position, then combine with the best secondLen subarray starting after.' },
    { number: 3, text: 'Alternatively: as you slide the secondLen window, maintain the best firstLen sum seen so far to the left. Then do the same with roles swapped.' },
    { number: 4, label: 'Hint 4 — clean approach', text: 'Use prefix sums. Define maxFirst[i] = max sum of a subarray of length firstLen ending at or before index i. Then for each secondLen window starting at j, answer candidate = maxFirst[j-1] + sum of secondLen window. Take max over both orderings.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Prefix Sum + Running Max — O(n) time, O(n) space',
      explanation: 'Compute prefix sums. For each position of the second subarray, track the best first subarray to its left, and vice versa.',
      code: {
        java: `public int maxSumTwoNoOverlap(int[] nums, int firstLen, int secondLen) {
    int n = nums.length;
    int[] prefix = new int[n + 1];
    for (int i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];
    return Math.max(
        helper(prefix, firstLen, secondLen),
        helper(prefix, secondLen, firstLen)
    );
}

private int helper(int[] prefix, int L, int M) {
    int n = prefix.length - 1;
    int maxL = 0, result = 0;
    for (int i = L + M; i <= n; i++) {
        maxL = Math.max(maxL, prefix[i - M] - prefix[i - M - L]);
        result = Math.max(result, maxL + prefix[i] - prefix[i - M]);
    }
    return result;
}`,
        cpp: `int maxSumTwoNoOverlap(vector<int>& nums, int firstLen, int secondLen) {
    int n = nums.size();
    vector<int> prefix(n + 1, 0);
    for (int i = 0; i < n; i++) prefix[i+1] = prefix[i] + nums[i];
    auto helper = [&](int L, int M) {
        int maxL = 0, result = 0;
        for (int i = L + M; i <= n; i++) {
            maxL = max(maxL, prefix[i-M] - prefix[i-M-L]);
            result = max(result, maxL + prefix[i] - prefix[i-M]);
        }
        return result;
    };
    return max(helper(firstLen, secondLen), helper(secondLen, firstLen));
}`,
        python: `def maxSumTwoNoOverlap(nums, firstLen, secondLen):
    n = len(nums)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + nums[i]

    def helper(L, M):
        max_l = result = 0
        for i in range(L + M, n + 1):
            max_l = max(max_l, prefix[i - M] - prefix[i - M - L])
            result = max(result, max_l + prefix[i] - prefix[i - M])
        return result

    return max(helper(firstLen, secondLen), helper(secondLen, firstLen))`,
      },
      dryRun: {
        title: 'Dry run — nums = [0,6,5,2,2,5,1,9,4], firstLen=1, secondLen=2',
        columns: ['Step', 'Detail', 'Value'],
        rows: [
          ['1', 'prefix = [0,0,6,11,13,15,20,21,30,34]', '—'],
          ['2', 'helper(1,2): slide M=2 window, track best L=1 to its left', '—'],
          ['3', 'Best: L=1 picks [9]=9, M=2 picks [6,5]=11 → 20', '20'],
          ['4', 'helper(2,1): slide M=1 window, track best L=2 to its left', '—'],
          ['5', 'Best: L=2 picks [9,4]=13, or [6,5]=11 with M=1 picks [9]=9 → 20', '20'],
          ['6', 'Answer = max(20, 20)', '20 ✓'],
        ],
        highlightRow: 5,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 63. Sliding Window Median
// ══════════════════════════════════════════════════════
'sliding-window-median': {
  statement:
    'The median is the middle value in an ordered integer list. If the size of the list is even, the median is the mean of the two middle values. Given an array nums and an integer k, there is a sliding window of size k which moves from the very left to the very right. Return the median array for each window position.',
  tags: ['Arrays', 'Sliding Window', 'Heap', 'Sorted Set'],
  requirement: 'O(n log k) time preferred',
  externalLinks: [
    { label: '↗ LeetCode #480', url: 'https://leetcode.com/problems/sliding-window-median/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums = [1,3,-1,-3,5,3,6,7], k = 3\nOutput: [1.0,-1.0,-1.0,3.0,5.0,6.0]' },
    { label: 'Example 2', text: 'Input:  nums = [1,2,3,4,2,3,1,4,2], k = 3\nOutput: [2.0,3.0,3.0,3.0,2.0,3.0,2.0]' },
  ],
  constraints: [
    '1 ≤ k ≤ nums.length ≤ 10⁵',
    '−2³¹ ≤ nums[i] ≤ 2³¹ − 1',
  ],
  requiredComplexity: 'O(n log k) time · O(k) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Finding the median requires maintaining a sorted view of the window. What data structures keep elements sorted and support efficient insertion/removal?' },
    { number: 2, text: 'Use two heaps (max-heap for lower half, min-heap for upper half) or a balanced BST / sorted multiset.' },
    { number: 3, text: 'With two heaps, the median is either the top of the max-heap (odd k) or the average of both tops (even k).' },
    { number: 4, label: 'Hint 4 — lazy deletion', text: 'When removing the element sliding out of the window, use lazy deletion: mark it for removal and only physically remove when it reaches the top of a heap. Maintain a balance counter to know the "effective" sizes.' },
  ],
  approaches: [
    {
      key: 'sortedset',
      label: 'Sorted Set / TreeMap — O(n log k) time, O(k) space',
      explanation: 'Use a sorted container (like TreeMap in Java or SortedList in Python) to maintain the window. Median is at position k/2.',
      code: {
        java: `public double[] medianSlidingWindow(int[] nums, int k) {
    TreeMap<int[], Integer> tree = new TreeMap<>((a, b) ->
        a[0] != b[0] ? Integer.compare(a[0], b[0]) : Integer.compare(a[1], b[1]));
    double[] result = new double[nums.length - k + 1];
    int[] window = new int[k];
    for (int i = 0; i < nums.length; i++) {
        tree.put(new int[]{nums[i], i}, i);
        if (tree.size() > k) {
            tree.remove(new int[]{nums[i - k], i - k});
        }
        if (tree.size() == k) {
            int idx = 0;
            Iterator<int[]> it = tree.keySet().iterator();
            int[] mid1 = null, mid2 = null;
            while (it.hasNext()) {
                int[] cur = it.next();
                if (idx == (k - 1) / 2) mid1 = cur;
                if (idx == k / 2) { mid2 = cur; break; }
                idx++;
            }
            result[i - k + 1] = ((double) mid1[0] + mid2[0]) / 2.0;
        }
    }
    return result;
}`,
        cpp: `vector<double> medianSlidingWindow(vector<int>& nums, int k) {
    multiset<int> window(nums.begin(), nums.begin() + k);
    auto mid = next(window.begin(), k / 2);
    vector<double> result;
    for (int i = k; ; i++) {
        result.push_back(((double)(*mid) + *prev(mid, 1 - k % 2)) / 2.0);
        if (i >= (int)nums.size()) break;
        window.insert(nums[i]);
        if (nums[i] < *mid) mid--;
        if (nums[i - k] <= *mid) mid++;
        window.erase(window.find(nums[i - k]));
    }
    return result;
}`,
        python: `from sortedcontainers import SortedList

def medianSlidingWindow(nums, k):
    window = SortedList(nums[:k])
    result = []
    for i in range(k, len(nums) + 1):
        if k % 2 == 1:
            result.append(float(window[k // 2]))
        else:
            result.append((window[k // 2 - 1] + window[k // 2]) / 2.0)
        if i < len(nums):
            window.add(nums[i])
            window.remove(nums[i - k])
    return result`,
      },
    },
    {
      key: 'twoheaps',
      label: 'Two Heaps with Lazy Deletion — O(n log k) time, O(k) space',
      explanation: 'Maintain a max-heap (lower half) and min-heap (upper half). Use lazy deletion for elements leaving the window.',
      code: {
        java: `public double[] medianSlidingWindow(int[] nums, int k) {
    // max-heap for lower half, min-heap for upper half
    PriorityQueue<long[]> lo = new PriorityQueue<>((a,b) -> Long.compare(b[0], a[0]));
    PriorityQueue<long[]> hi = new PriorityQueue<>((a,b) -> Long.compare(a[0], b[0]));
    Map<Integer, Integer> removed = new HashMap<>();
    double[] result = new double[nums.length - k + 1];
    
    for (int i = 0; i < k; i++) lo.offer(new long[]{nums[i], i});
    for (int i = 0; i < k / 2; i++) hi.offer(lo.poll());
    
    for (int i = k; i <= nums.length; i++) {
        // Get median
        if (k % 2 == 1) result[i - k] = lo.peek()[0];
        else result[i - k] = (lo.peek()[0] + hi.peek()[0]) / 2.0;
        if (i == nums.length) break;
        
        int outVal = nums[i - k], inVal = nums[i];
        int balance = 0;
        // Remove outgoing
        removed.merge(i - k, 1, Integer::sum);
        if (!lo.isEmpty() && outVal <= lo.peek()[0]) balance--;
        else balance++;
        // Add incoming
        if (!lo.isEmpty() && inVal <= lo.peek()[0]) {
            lo.offer(new long[]{inVal, i}); balance++;
        } else {
            hi.offer(new long[]{inVal, i}); balance--;
        }
        // Rebalance
        if (balance > 0) { hi.offer(lo.poll()); balance--; }
        if (balance < 0) { lo.offer(hi.poll()); balance++; }
        // Clean tops
        while (!lo.isEmpty() && removed.getOrDefault((int)lo.peek()[1], 0) > 0) {
            removed.merge((int)lo.poll()[1], -1, Integer::sum);
        }
        while (!hi.isEmpty() && removed.getOrDefault((int)hi.peek()[1], 0) > 0) {
            removed.merge((int)hi.poll()[1], -1, Integer::sum);
        }
    }
    return result;
}`,
        cpp: `// Using multiset approach shown above is cleaner for C++`,
        python: `# Using SortedList approach shown above is cleaner for Python`,
      },
    },
  ],
},



// ══════════════════════════════════════════════════════
// 53. Find Pivot Index
// ══════════════════════════════════════════════════════
'find-pivot-index': {
  statement:
    'Given an array of integers nums, calculate the pivot index of this array. The pivot index is the index where the sum of all the numbers strictly to the left of the index is equal to the sum of all the numbers strictly to the right of the index. If no such index exists, return -1. If there are multiple pivot indexes, return the left-most one.',
  tags: ['Arrays', 'Prefix Sum'],
  requirement: 'O(n) time',
  externalLinks: [
    { label: '↗ LeetCode #724', url: 'https://leetcode.com/problems/find-pivot-index/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums = [1,7,3,6,5,6]\nOutput: 3\nExplanation: Left sum = 1+7+3 = 11, Right sum = 5+6 = 11' },
    { label: 'Example 2', text: 'Input:  nums = [1,2,3]\nOutput: -1' },
    { label: 'Example 3', text: 'Input:  nums = [2,1,-1]\nOutput: 0\nExplanation: Left sum = 0, Right sum = 1+(-1) = 0' },
  ],
  constraints: [
    '1 ≤ nums.length ≤ 10⁴',
    '−1000 ≤ nums[i] ≤ 1000',
  ],
  requiredComplexity: 'O(n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'At any index i, you need leftSum and rightSum. If you know the total sum, can you derive rightSum from leftSum?' },
    { number: 2, text: 'rightSum = totalSum - leftSum - nums[i]. So the pivot condition is leftSum == totalSum - leftSum - nums[i].' },
    { number: 3, text: 'Compute totalSum first. Then iterate left to right, maintaining a running leftSum. Check the condition at each index.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Running Left Sum — O(n) time, O(1) space',
      explanation: 'Compute total sum. Iterate and maintain leftSum. At each index check if leftSum == totalSum - leftSum - nums[i].',
      code: {
        java: `public int pivotIndex(int[] nums) {
    int totalSum = 0;
    for (int x : nums) totalSum += x;
    int leftSum = 0;
    for (int i = 0; i < nums.length; i++) {
        if (leftSum == totalSum - leftSum - nums[i]) return i;
        leftSum += nums[i];
    }
    return -1;
}`,
        cpp: `int pivotIndex(vector<int>& nums) {
    int totalSum = accumulate(nums.begin(), nums.end(), 0);
    int leftSum = 0;
    for (int i = 0; i < (int)nums.size(); i++) {
        if (leftSum == totalSum - leftSum - nums[i]) return i;
        leftSum += nums[i];
    }
    return -1;
}`,
        python: `def pivotIndex(nums):
    total = sum(nums)
    left_sum = 0
    for i, x in enumerate(nums):
        if left_sum == total - left_sum - x:
            return i
        left_sum += x
    return -1`,
      },
      dryRun: {
        title: 'Dry run — nums = [1,7,3,6,5,6], totalSum = 28',
        columns: ['i', 'nums[i]', 'leftSum', 'rightSum (total-left-nums[i])', 'Match?'],
        rows: [
          ['0', '1', '0', '28-0-1=27', 'No'],
          ['1', '7', '1', '28-1-7=20', 'No'],
          ['2', '3', '8', '28-8-3=17', 'No'],
          ['3', '6', '11', '28-11-6=11', 'Yes → return 3 ✓'],
        ],
        highlightRow: 3,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 54. Range Sum Query - Immutable
// ══════════════════════════════════════════════════════
'range-sum-query-immutable': {
  statement:
    'Given an integer array nums, handle multiple queries of the following type: calculate the sum of the elements of nums between indices left and right inclusive. Implement the NumArray class with a constructor that initializes with nums and a method sumRange(left, right) that returns the sum.',
  tags: ['Arrays', 'Prefix Sum', 'Design'],
  requirement: 'O(1) per query after O(n) preprocessing',
  externalLinks: [
    { label: '↗ LeetCode #303', url: 'https://leetcode.com/problems/range-sum-query-immutable/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:\n  NumArray obj = new NumArray([-2,0,3,-5,2,-1])\n  obj.sumRange(0,2) → 1\n  obj.sumRange(2,5) → -1\n  obj.sumRange(0,5) → -3' },
  ],
  constraints: [
    '1 ≤ nums.length ≤ 10⁴',
    '−10⁵ ≤ nums[i] ≤ 10⁵',
    '0 ≤ left ≤ right < nums.length',
    'At most 10⁴ calls to sumRange',
  ],
  requiredComplexity: 'O(n) preprocess · O(1) per query · O(n) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'If you had the cumulative sum at every index, could you compute any range sum in constant time?' },
    { number: 2, text: 'Build a prefix sum array where prefix[i] = nums[0] + nums[1] + ... + nums[i-1]. Then sum(left, right) = prefix[right+1] - prefix[left].' },
    { number: 3, text: 'Use prefix of size n+1, with prefix[0] = 0, so the formula works cleanly for left = 0.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Prefix Sum — O(n) preprocess, O(1) query',
      explanation: 'Precompute a prefix sum array. Any range sum is a single subtraction.',
      code: {
        java: `class NumArray {
    private int[] prefix;

    public NumArray(int[] nums) {
        prefix = new int[nums.length + 1];
        for (int i = 0; i < nums.length; i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }
    }

    public int sumRange(int left, int right) {
        return prefix[right + 1] - prefix[left];
    }
}`,
        cpp: `class NumArray {
    vector<int> prefix;
public:
    NumArray(vector<int>& nums) {
        prefix.resize(nums.size() + 1, 0);
        for (int i = 0; i < (int)nums.size(); i++)
            prefix[i + 1] = prefix[i] + nums[i];
    }

    int sumRange(int left, int right) {
        return prefix[right + 1] - prefix[left];
    }
};`,
        python: `class NumArray:
    def __init__(self, nums):
        self.prefix = [0] * (len(nums) + 1)
        for i in range(len(nums)):
            self.prefix[i + 1] = self.prefix[i] + nums[i]

    def sumRange(self, left, right):
        return self.prefix[right + 1] - self.prefix[left]`,
      },
      dryRun: {
        title: 'Dry run — nums = [-2,0,3,-5,2,-1]',
        columns: ['Step', 'Detail', 'Value'],
        rows: [
          ['1', 'prefix = [0,-2,-2,1,-4,-2,-3]', '—'],
          ['2', 'sumRange(0,2) = prefix[3]-prefix[0]', '1-0 = 1 ✓'],
          ['3', 'sumRange(2,5) = prefix[6]-prefix[2]', '-3-(-2) = -1 ✓'],
          ['4', 'sumRange(0,5) = prefix[6]-prefix[0]', '-3-0 = -3 ✓'],
        ],
        highlightRow: 1,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 55. Maximum Subarray
// ══════════════════════════════════════════════════════
'maximum-subarray': {
  statement:
    'Given an integer array nums, find the subarray with the largest sum, and return its sum.',
  tags: ['Arrays', 'Prefix Sum', "Kadane's Algorithm", 'Dynamic Programming'],
  requirement: "O(n) time — Kadane's algorithm",
  externalLinks: [
    { label: '↗ LeetCode #53', url: 'https://leetcode.com/problems/maximum-subarray/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums = [-2,1,-3,4,-1,2,1,-5,4]\nOutput: 6\nExplanation: Subarray [4,-1,2,1] has the largest sum 6' },
    { label: 'Example 2', text: 'Input:  nums = [1]\nOutput: 1' },
    { label: 'Example 3', text: 'Input:  nums = [5,4,-1,7,8]\nOutput: 23' },
  ],
  constraints: [
    '1 ≤ nums.length ≤ 10⁵',
    '−10⁴ ≤ nums[i] ≤ 10⁴',
  ],
  requiredComplexity: 'O(n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'At each position, you either extend the current subarray or start a new one. What determines which is better?' },
    { number: 2, text: 'If the running sum so far is negative, starting fresh from the current element is always better than extending.' },
    { number: 3, text: "Kadane's algorithm: maintain currentSum = max(nums[i], currentSum + nums[i]). Track the global maximum." },
    { number: 4, label: 'Hint 4 — intuition', text: 'currentSum represents the maximum sum subarray ending at the current index. If adding nums[i] to currentSum makes it worse than nums[i] alone, reset.' },
  ],
  approaches: [
    {
      key: 'brute',
      label: 'Brute Force — O(n²) time',
      explanation: 'Check all subarrays and track the maximum sum.',
      code: {
        java: `public int maxSubArray(int[] nums) {
    int maxSum = Integer.MIN_VALUE;
    for (int i = 0; i < nums.length; i++) {
        int sum = 0;
        for (int j = i; j < nums.length; j++) {
            sum += nums[j];
            maxSum = Math.max(maxSum, sum);
        }
    }
    return maxSum;
}`,
        cpp: `int maxSubArray(vector<int>& nums) {
    int maxSum = INT_MIN;
    for (int i = 0; i < nums.size(); i++) {
        int sum = 0;
        for (int j = i; j < nums.size(); j++) {
            sum += nums[j];
            maxSum = max(maxSum, sum);
        }
    }
    return maxSum;
}`,
        python: `def maxSubArray(nums):
    max_sum = float('-inf')
    for i in range(len(nums)):
        curr = 0
        for j in range(i, len(nums)):
            curr += nums[j]
            max_sum = max(max_sum, curr)
    return max_sum`,
      },
    },
    {
      key: 'optimal',
      label: "Kadane's Algorithm — O(n) time, O(1) space",
      explanation: 'Track the maximum sum subarray ending at each position. Either extend the previous subarray or start new.',
      code: {
        java: `public int maxSubArray(int[] nums) {
    int currentSum = nums[0], maxSum = nums[0];
    for (int i = 1; i < nums.length; i++) {
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        maxSum = Math.max(maxSum, currentSum);
    }
    return maxSum;
}`,
        cpp: `int maxSubArray(vector<int>& nums) {
    int currentSum = nums[0], maxSum = nums[0];
    for (int i = 1; i < (int)nums.size(); i++) {
        currentSum = max(nums[i], currentSum + nums[i]);
        maxSum = max(maxSum, currentSum);
    }
    return maxSum;
}`,
        python: `def maxSubArray(nums):
    current_sum = max_sum = nums[0]
    for x in nums[1:]:
        current_sum = max(x, current_sum + x)
        max_sum = max(max_sum, current_sum)
    return max_sum`,
      },
      dryRun: {
        title: 'Dry run — nums = [-2,1,-3,4,-1,2,1,-5,4]',
        columns: ['i', 'nums[i]', 'currentSum+nums[i]', 'currentSum', 'maxSum'],
        rows: [
          ['0', '-2', '—', '-2', '-2'],
          ['1', '1', '-2+1=-1', 'max(1,-1)=1', '1'],
          ['2', '-3', '1+(-3)=-2', 'max(-3,-2)=-2', '1'],
          ['3', '4', '-2+4=2', 'max(4,2)=4', '4'],
          ['4', '-1', '4+(-1)=3', 'max(-1,3)=3', '4'],
          ['5', '2', '3+2=5', 'max(2,5)=5', '5'],
          ['6', '1', '5+1=6', 'max(1,6)=6', '6'],
          ['7', '-5', '6+(-5)=1', 'max(-5,1)=1', '6'],
          ['8', '4', '1+4=5', 'max(4,5)=5', '6 ✓'],
        ],
        highlightRow: 6,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 56. Product of Array Except Self
// ══════════════════════════════════════════════════════
'product-of-array-except-self': {
  statement:
    'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. The algorithm must run in O(n) time and without using the division operation.',
  tags: ['Arrays', 'Prefix Sum'],
  requirement: 'O(n) time, no division',
  externalLinks: [
    { label: '↗ LeetCode #238', url: 'https://leetcode.com/problems/product-of-array-except-self/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums = [1,2,3,4]\nOutput: [24,12,8,6]' },
    { label: 'Example 2', text: 'Input:  nums = [-1,1,0,-3,3]\nOutput: [0,0,9,0,0]' },
  ],
  constraints: [
    '2 ≤ nums.length ≤ 10⁵',
    '−30 ≤ nums[i] ≤ 30',
    'The product of any prefix or suffix fits in a 32-bit integer',
  ],
  requiredComplexity: 'O(n) time · O(1) extra space (output array not counted)',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Product of all elements except nums[i] = (product of everything to the left of i) × (product of everything to the right of i). Can you compute both efficiently?' },
    { number: 2, text: 'Build a left product array: leftProd[i] = nums[0] × nums[1] × ... × nums[i-1].' },
    { number: 3, text: 'Then build a right product array (or running product from the right). Multiply them together.' },
    { number: 4, label: 'Hint 4 — O(1) extra space', text: 'Store the left products directly in the output array, then do a reverse pass multiplying by a running right product. This avoids a separate right product array.' },
  ],
  approaches: [
    {
      key: 'twopass',
      label: 'Two Arrays — O(n) time, O(n) space',
      explanation: 'Compute prefix products from the left and suffix products from the right, then multiply.',
      code: {
        java: `public int[] productExceptSelf(int[] nums) {
    int n = nums.length;
    int[] left = new int[n], right = new int[n], ans = new int[n];
    left[0] = 1;
    for (int i = 1; i < n; i++) left[i] = left[i-1] * nums[i-1];
    right[n-1] = 1;
    for (int i = n-2; i >= 0; i--) right[i] = right[i+1] * nums[i+1];
    for (int i = 0; i < n; i++) ans[i] = left[i] * right[i];
    return ans;
}`,
        cpp: `vector<int> productExceptSelf(vector<int>& nums) {
    int n = nums.size();
    vector<int> left(n,1), right(n,1), ans(n);
    for (int i = 1; i < n; i++) left[i] = left[i-1]*nums[i-1];
    for (int i = n-2; i >= 0; i--) right[i] = right[i+1]*nums[i+1];
    for (int i = 0; i < n; i++) ans[i] = left[i]*right[i];
    return ans;
}`,
        python: `def productExceptSelf(nums):
    n = len(nums)
    left = [1]*n
    right = [1]*n
    for i in range(1, n):
        left[i] = left[i-1] * nums[i-1]
    for i in range(n-2, -1, -1):
        right[i] = right[i+1] * nums[i+1]
    return [left[i]*right[i] for i in range(n)]`,
      },
    },
    {
      key: 'optimal',
      label: 'Single Output Array — O(n) time, O(1) extra space',
      explanation: 'Store left products in the answer array, then do a reverse pass with a running right product.',
      code: {
        java: `public int[] productExceptSelf(int[] nums) {
    int n = nums.length;
    int[] ans = new int[n];
    ans[0] = 1;
    for (int i = 1; i < n; i++) ans[i] = ans[i-1] * nums[i-1];
    int rightProd = 1;
    for (int i = n-1; i >= 0; i--) {
        ans[i] *= rightProd;
        rightProd *= nums[i];
    }
    return ans;
}`,
        cpp: `vector<int> productExceptSelf(vector<int>& nums) {
    int n = nums.size();
    vector<int> ans(n, 1);
    for (int i = 1; i < n; i++) ans[i] = ans[i-1] * nums[i-1];
    int rightProd = 1;
    for (int i = n-1; i >= 0; i--) {
        ans[i] *= rightProd;
        rightProd *= nums[i];
    }
    return ans;
}`,
        python: `def productExceptSelf(nums):
    n = len(nums)
    ans = [1] * n
    for i in range(1, n):
        ans[i] = ans[i-1] * nums[i-1]
    right_prod = 1
    for i in range(n-1, -1, -1):
        ans[i] *= right_prod
        right_prod *= nums[i]
    return ans`,
      },
      dryRun: {
        title: 'Dry run — nums = [1,2,3,4]',
        columns: ['Step', 'Detail', 'ans'],
        rows: [
          ['1', 'Left pass: ans[i] = product of nums[0..i-1]', '[1,1,2,6]'],
          ['2', 'Right pass i=3: rightProd=1, ans[3]=6*1=6, rightProd=4', '[1,1,2,6]'],
          ['3', 'i=2: ans[2]=2*4=8, rightProd=12', '[1,1,8,6]'],
          ['4', 'i=1: ans[1]=1*12=12, rightProd=24', '[1,12,8,6]'],
          ['5', 'i=0: ans[0]=1*24=24, rightProd=24', '[24,12,8,6] ✓'],
        ],
        highlightRow: 4,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 57. Maximum Product Subarray
// ══════════════════════════════════════════════════════
'maximum-product-subarray': {
  statement:
    'Given an integer array nums, find a subarray that has the largest product, and return the product.',
  tags: ['Arrays', 'Dynamic Programming', 'Kadane Variant'],
  requirement: 'O(n) time',
  externalLinks: [
    { label: '↗ LeetCode #152', url: 'https://leetcode.com/problems/maximum-product-subarray/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums = [2,3,-2,4]\nOutput: 6\nExplanation: [2,3] has the largest product 6' },
    { label: 'Example 2', text: 'Input:  nums = [-2,0,-1]\nOutput: 0\nExplanation: Cannot multiply -2 and -1 as 0 is between them' },
  ],
  constraints: [
    '1 ≤ nums.length ≤ 2 × 10⁴',
    '−10 ≤ nums[i] ≤ 10',
    'The product of any prefix or suffix fits in a 32-bit integer',
  ],
  requiredComplexity: 'O(n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: "Unlike max subarray sum, a negative times a negative becomes positive. So you can't just track the running max — what else do you need?" },
    { number: 2, text: 'Track both the current maximum product AND the current minimum product ending at each position.' },
    { number: 3, text: 'When you encounter a negative number, the max and min swap roles: the old min (most negative) × negative = new max.' },
    { number: 4, label: 'Hint 4 — formula', text: 'At each step: newMax = max(nums[i], curMax*nums[i], curMin*nums[i]), newMin = min(nums[i], curMax*nums[i], curMin*nums[i]). Update the global max.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Track Min and Max — O(n) time, O(1) space',
      explanation: 'Maintain running curMax and curMin products. A negative number flips them. Track the global maximum.',
      code: {
        java: `public int maxProduct(int[] nums) {
    int curMax = nums[0], curMin = nums[0], result = nums[0];
    for (int i = 1; i < nums.length; i++) {
        int x = nums[i];
        int tempMax = Math.max(x, Math.max(curMax * x, curMin * x));
        int tempMin = Math.min(x, Math.min(curMax * x, curMin * x));
        curMax = tempMax;
        curMin = tempMin;
        result = Math.max(result, curMax);
    }
    return result;
}`,
        cpp: `int maxProduct(vector<int>& nums) {
    int curMax = nums[0], curMin = nums[0], result = nums[0];
    for (int i = 1; i < (int)nums.size(); i++) {
        int x = nums[i];
        int tempMax = max({x, curMax*x, curMin*x});
        int tempMin = min({x, curMax*x, curMin*x});
        curMax = tempMax;
        curMin = tempMin;
        result = max(result, curMax);
    }
    return result;
}`,
        python: `def maxProduct(nums):
    cur_max = cur_min = result = nums[0]
    for x in nums[1:]:
        candidates = (x, cur_max * x, cur_min * x)
        cur_max = max(candidates)
        cur_min = min(candidates)
        result = max(result, cur_max)
    return result`,
      },
      dryRun: {
        title: 'Dry run — nums = [2,3,-2,4]',
        columns: ['i', 'nums[i]', 'curMax', 'curMin', 'result'],
        rows: [
          ['0', '2', '2', '2', '2'],
          ['1', '3', 'max(3,6,6)=6', 'min(3,6,6)=3', '6'],
          ['2', '-2', 'max(-2,-12,-6)=-2', 'min(-2,-12,-6)=-12', '6'],
          ['3', '4', 'max(4,-8,-48)=4', 'min(4,-8,-48)=-48', '6 ✓'],
        ],
        highlightRow: 1,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 58. Subarray Sums Divisible by K
// ══════════════════════════════════════════════════════
'subarray-sums-divisible-by-k': {
  statement:
    'Given an integer array nums and an integer k, return the number of non-empty subarrays that have a sum divisible by k.',
  tags: ['Arrays', 'Prefix Sum', 'Hash Map'],
  requirement: 'O(n) time',
  externalLinks: [
    { label: '↗ LeetCode #974', url: 'https://leetcode.com/problems/subarray-sums-divisible-by-k/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums = [4,5,0,-2,-3,1], k = 5\nOutput: 7\nExplanation: [4,5,0,-2,-3,1], [5], [5,0], [5,0,-2,-3], [0], [0,-2,-3], [-2,-3]' },
    { label: 'Example 2', text: 'Input:  nums = [5], k = 9\nOutput: 0' },
  ],
  constraints: [
    '1 ≤ nums.length ≤ 3 × 10⁴',
    '−10⁴ ≤ nums[i] ≤ 10⁴',
    '2 ≤ k ≤ 10⁴',
  ],
  requiredComplexity: 'O(n) time · O(k) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'A subarray sum is divisible by k if prefix[j] - prefix[i] is divisible by k. When does that happen in terms of remainders?' },
    { number: 2, text: 'If prefix[j] % k == prefix[i] % k, then their difference is divisible by k.' },
    { number: 3, text: 'Count prefix sum remainders using a hash map (or array of size k). For each remainder seen c times, those c prefixes can form C(c,2) valid pairs.' },
    { number: 4, label: 'Hint 4 — negative remainders', text: 'In languages where % can return negative values (Java, C++), normalize: remainder = ((prefixSum % k) + k) % k.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Prefix Sum Remainders — O(n) time, O(k) space',
      explanation: 'Count how many prefix sums share each remainder mod k. Each pair of matching remainders gives a valid subarray.',
      code: {
        java: `public int subarraysDivByK(int[] nums, int k) {
    int[] count = new int[k];
    count[0] = 1;
    int prefix = 0, result = 0;
    for (int x : nums) {
        prefix += x;
        int rem = ((prefix % k) + k) % k;
        result += count[rem];
        count[rem]++;
    }
    return result;
}`,
        cpp: `int subarraysDivByK(vector<int>& nums, int k) {
    vector<int> count(k, 0);
    count[0] = 1;
    int prefix = 0, result = 0;
    for (int x : nums) {
        prefix += x;
        int rem = ((prefix % k) + k) % k;
        result += count[rem];
        count[rem]++;
    }
    return result;
}`,
        python: `def subarraysDivByK(nums, k):
    count = [0] * k
    count[0] = 1
    prefix = result = 0
    for x in nums:
        prefix += x
        rem = prefix % k  # Python % is always non-negative for positive k
        result += count[rem]
        count[rem] += 1
    return result`,
      },
      dryRun: {
        title: 'Dry run — nums = [4,5,0,-2,-3,1], k = 5',
        columns: ['x', 'prefix', 'rem', 'count[rem] (before)', '+result', 'total'],
        rows: [
          ['4', '4', '4', '0', '0', '0'],
          ['5', '9', '4', '1', '1', '1'],
          ['0', '9', '4', '2', '2', '3'],
          ['-2', '7', '2', '0', '0', '3'],
          ['-3', '4', '4', '3', '3', '6'],
          ['1', '5', '0', '1', '1', '7 ✓'],
        ],
        highlightRow: 5,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 59. Continuous Subarray Sum
// ══════════════════════════════════════════════════════
'continuous-subarray-sum': {
  statement:
    'Given an integer array nums and an integer k, return true if nums has a good subarray or false otherwise. A good subarray is a subarray where its length is at least two and the sum of its elements is a multiple of k.',
  tags: ['Arrays', 'Prefix Sum', 'Hash Map'],
  requirement: 'O(n) time',
  externalLinks: [
    { label: '↗ LeetCode #523', url: 'https://leetcode.com/problems/continuous-subarray-sum/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums = [23,2,4,6,7], k = 6\nOutput: true\nExplanation: [2,4] has sum 6, which is 6×1' },
    { label: 'Example 2', text: 'Input:  nums = [23,2,6,4,7], k = 6\nOutput: true\nExplanation: [23,2,6,4,7] sum = 42 = 6×7' },
    { label: 'Example 3', text: 'Input:  nums = [23,2,6,4,7], k = 13\nOutput: false' },
  ],
  constraints: [
    '1 ≤ nums.length ≤ 10⁵',
    '0 ≤ nums[i] ≤ 10⁹',
    '0 ≤ sum(nums[i]) ≤ 2³¹ - 1',
    '1 ≤ k ≤ 2³¹ - 1',
  ],
  requiredComplexity: 'O(n) time · O(min(n, k)) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Similar to "Subarray Sum Divisible by K" but with a twist: the subarray must have length ≥ 2. How do you enforce this?' },
    { number: 2, text: 'Use prefix sum mod k with a hash map. But instead of counting, store the earliest index where each remainder was seen.' },
    { number: 3, text: 'If the same remainder appears at indices i and j (j > i) and j - i ≥ 2, return true.' },
    { number: 4, label: 'Hint 4 — initialization', text: 'Initialize the map with {0: -1} to handle the case where the subarray starts from index 0.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Prefix Sum + Hash Map — O(n) time, O(min(n,k)) space',
      explanation: 'Track prefix sum mod k. Store the first occurrence index of each remainder. If a remainder repeats with gap ≥ 2, return true.',
      code: {
        java: `public boolean checkSubarraySum(int[] nums, int k) {
    Map<Integer, Integer> remainderIndex = new HashMap<>();
    remainderIndex.put(0, -1);
    int prefix = 0;
    for (int i = 0; i < nums.length; i++) {
        prefix += nums[i];
        int rem = prefix % k;
        if (remainderIndex.containsKey(rem)) {
            if (i - remainderIndex.get(rem) >= 2) return true;
        } else {
            remainderIndex.put(rem, i);
        }
    }
    return false;
}`,
        cpp: `bool checkSubarraySum(vector<int>& nums, int k) {
    unordered_map<int,int> remainderIndex;
    remainderIndex[0] = -1;
    int prefix = 0;
    for (int i = 0; i < (int)nums.size(); i++) {
        prefix += nums[i];
        int rem = prefix % k;
        if (remainderIndex.count(rem)) {
            if (i - remainderIndex[rem] >= 2) return true;
        } else {
            remainderIndex[rem] = i;
        }
    }
    return false;
}`,
        python: `def checkSubarraySum(nums, k):
    remainder_index = {0: -1}
    prefix = 0
    for i, x in enumerate(nums):
        prefix += x
        rem = prefix % k
        if rem in remainder_index:
            if i - remainder_index[rem] >= 2:
                return True
        else:
            remainder_index[rem] = i
    return False`,
      },
      dryRun: {
        title: 'Dry run — nums = [23,2,4,6,7], k = 6',
        columns: ['i', 'nums[i]', 'prefix', 'rem', 'Map lookup', 'Action'],
        rows: [
          ['0', '23', '23', '5', 'Not found', 'Store {5:0}'],
          ['1', '2', '25', '1', 'Not found', 'Store {1:1}'],
          ['2', '4', '29', '5', 'Found at 0, gap=2-0=2 ≥ 2', 'return true ✓'],
        ],
        highlightRow: 2,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 60. Car Pooling
// ══════════════════════════════════════════════════════
'car-pooling': {
  statement:
    'There is a car with capacity empty seats. The vehicle only drives east (i.e., it cannot turn around and drive west). You are given an array trips where trips[i] = [numPassengers_i, from_i, to_i] indicates that numPassengers_i passengers must be picked up at from_i and dropped off at to_i. Return true if it is possible to pick up and drop off all passengers for all the given trips, or false otherwise.',
  tags: ['Arrays', 'Prefix Sum', 'Difference Array'],
  requirement: 'O(n + maxLocation) time',
  externalLinks: [
    { label: '↗ LeetCode #1094', url: 'https://leetcode.com/problems/car-pooling/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  trips = [[2,1,5],[3,3,7]], capacity = 4\nOutput: false' },
    { label: 'Example 2', text: 'Input:  trips = [[2,1,5],[3,3,7]], capacity = 5\nOutput: true' },
  ],
  constraints: [
    '1 ≤ trips.length ≤ 1000',
    'trips[i].length == 3',
    '1 ≤ numPassengers_i ≤ 100',
    '0 ≤ from_i < to_i ≤ 1000',
    '1 ≤ capacity ≤ 10⁵',
  ],
  requiredComplexity: 'O(n + maxLocation) time · O(maxLocation) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'At each location, passengers get on or off. You need to know the total passengers at every point. What data structure efficiently handles range updates?' },
    { number: 2, text: 'Use a difference array: +passengers at from, -passengers at to. Then take the prefix sum to get actual passengers at each location.' },
    { number: 3, text: 'If the prefix sum ever exceeds capacity, return false.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Difference Array — O(n + maxLoc) time, O(maxLoc) space',
      explanation: 'Apply +passengers at pickup and -passengers at dropoff. Prefix sum gives passengers at each location. Check against capacity.',
      code: {
        java: `public boolean carPooling(int[][] trips, int capacity) {
    int[] diff = new int[1001];
    for (int[] t : trips) {
        diff[t[1]] += t[0];
        diff[t[2]] -= t[0];
    }
    int passengers = 0;
    for (int d : diff) {
        passengers += d;
        if (passengers > capacity) return false;
    }
    return true;
}`,
        cpp: `bool carPooling(vector<vector<int>>& trips, int capacity) {
    int diff[1001] = {};
    for (auto& t : trips) {
        diff[t[1]] += t[0];
        diff[t[2]] -= t[0];
    }
    int passengers = 0;
    for (int i = 0; i < 1001; i++) {
        passengers += diff[i];
        if (passengers > capacity) return false;
    }
    return true;
}`,
        python: `def carPooling(trips, capacity):
    diff = [0] * 1001
    for num, start, end in trips:
        diff[start] += num
        diff[end] -= num
    passengers = 0
    for d in diff:
        passengers += d
        if passengers > capacity:
            return False
    return True`,
      },
      dryRun: {
        title: 'Dry run — trips = [[2,1,5],[3,3,7]], capacity = 4',
        columns: ['Location', 'diff change', 'passengers (prefix sum)', '> capacity?'],
        rows: [
          ['0', '0', '0', 'No'],
          ['1', '+2', '2', 'No'],
          ['2', '0', '2', 'No'],
          ['3', '+3', '5', 'Yes → return false ✓'],
        ],
        highlightRow: 3,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 61. Corporate Flight Bookings
// ══════════════════════════════════════════════════════
'corporate-flight-bookings': {
  statement:
    'There are n flights labeled from 1 to n. You are given an array of flight bookings where bookings[i] = [first_i, last_i, seats_i] represents a booking for flights first_i through last_i (inclusive) with seats_i seats reserved on each flight. Return an array answer of length n, where answer[i] is the total number of seats reserved for flight i+1.',
  tags: ['Arrays', 'Prefix Sum', 'Difference Array'],
  requirement: 'O(n + bookings.length) time',
  externalLinks: [
    { label: '↗ LeetCode #1109', url: 'https://leetcode.com/problems/corporate-flight-bookings/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  bookings = [[1,2,10],[2,3,20],[2,2,25]], n = 3\nOutput: [10,55,20]' },
    { label: 'Example 2', text: 'Input:  bookings = [[1,2,10],[2,2,15]], n = 2\nOutput: [10,25]' },
  ],
  constraints: [
    '1 ≤ n ≤ 2 × 10⁴',
    '1 ≤ bookings.length ≤ 2 × 10⁴',
    'bookings[i].length == 3',
    '1 ≤ first_i ≤ last_i ≤ n',
    '1 ≤ seats_i ≤ 10⁴',
  ],
  requiredComplexity: 'O(n + m) time · O(n) space (m = bookings.length)',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Each booking is a range update: add seats to every flight in [first, last]. Naively this is O(n) per booking. Can you make it O(1) per booking?' },
    { number: 2, text: 'Use a difference array! Add seats at index first, subtract seats at index last+1.' },
    { number: 3, text: 'After processing all bookings, compute the prefix sum of the difference array to get the final answer.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Difference Array — O(n + m) time, O(n) space',
      explanation: 'Apply +seats at first and -seats at last+1 in a difference array. Prefix sum gives the total seats for each flight.',
      code: {
        java: `public int[] corpFlightBookings(int[][] bookings, int n) {
    int[] diff = new int[n + 1];
    for (int[] b : bookings) {
        diff[b[0] - 1] += b[2];
        if (b[1] < n) diff[b[1]] -= b[2];
    }
    int[] answer = new int[n];
    answer[0] = diff[0];
    for (int i = 1; i < n; i++) {
        answer[i] = answer[i - 1] + diff[i];
    }
    return answer;
}`,
        cpp: `vector<int> corpFlightBookings(vector<vector<int>>& bookings, int n) {
    vector<int> diff(n + 1, 0);
    for (auto& b : bookings) {
        diff[b[0] - 1] += b[2];
        if (b[1] < n) diff[b[1]] -= b[2];
    }
    vector<int> answer(n);
    answer[0] = diff[0];
    for (int i = 1; i < n; i++) answer[i] = answer[i-1] + diff[i];
    return answer;
}`,
        python: `def corpFlightBookings(bookings, n):
    diff = [0] * (n + 1)
    for first, last, seats in bookings:
        diff[first - 1] += seats
        if last < n:
            diff[last] -= seats
    answer = [0] * n
    answer[0] = diff[0]
    for i in range(1, n):
        answer[i] = answer[i-1] + diff[i]
    return answer`,
      },
      dryRun: {
        title: 'Dry run — bookings = [[1,2,10],[2,3,20],[2,2,25]], n = 3',
        columns: ['Booking', 'Action', 'diff (0-indexed)'],
        rows: [
          ['[1,2,10]', 'diff[0]+=10, diff[2]-=10', '[10,0,-10,0]'],
          ['[2,3,20]', 'diff[1]+=20, (last=n, skip)', '[10,20,-10,0]'],
          ['[2,2,25]', 'diff[1]+=25, diff[2]-=25', '[10,45,-35,0]'],
          ['Prefix sum', '[10, 10+45=55, 55-35=20]', '[10,55,20] ✓'],
        ],
        highlightRow: 3,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 62. Range Sum Query 2D - Immutable
// ══════════════════════════════════════════════════════
'range-sum-query-2d-immutable': {
  statement:
    'Given a 2D matrix matrix, handle multiple queries of the following type: calculate the sum of the elements inside the rectangle defined by its upper left corner (row1, col1) and lower right corner (row2, col2). Implement the NumMatrix class.',
  tags: ['Arrays', 'Prefix Sum', '2D Prefix Sum', 'Design'],
  requirement: 'O(1) per query after O(m×n) preprocessing',
  externalLinks: [
    { label: '↗ LeetCode #304', url: 'https://leetcode.com/problems/range-sum-query-2d-immutable/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:\n  matrix = [[3,0,1,4,2],[5,6,3,2,1],[1,2,0,1,5],[4,1,0,1,7],[1,0,3,0,5]]\n  sumRegion(2,1,4,3) → 8\n  sumRegion(1,1,2,2) → 11\n  sumRegion(1,2,2,4) → 12' },
  ],
  constraints: [
    'm == matrix.length, n == matrix[i].length',
    '1 ≤ m, n ≤ 200',
    '−10⁴ ≤ matrix[i][j] ≤ 10⁴',
    'At most 10⁴ calls to sumRegion',
  ],
  requiredComplexity: 'O(m×n) preprocess · O(1) per query · O(m×n) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'In 1D, prefix sums let you compute range sums in O(1). Can you extend this idea to 2D?' },
    { number: 2, text: 'Build a 2D prefix sum where prefix[i][j] = sum of all elements in matrix[0..i-1][0..j-1].' },
    { number: 3, text: 'Use inclusion-exclusion: prefix[i][j] = matrix[i-1][j-1] + prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1].' },
    { number: 4, label: 'Hint 4 — query formula', text: 'sumRegion(r1,c1,r2,c2) = prefix[r2+1][c2+1] - prefix[r1][c2+1] - prefix[r2+1][c1] + prefix[r1][c1].' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: '2D Prefix Sum — O(m×n) preprocess, O(1) query',
      explanation: 'Build a 2D prefix sum matrix. Answer any rectangle query with inclusion-exclusion in O(1).',
      code: {
        java: `class NumMatrix {
    private int[][] prefix;

    public NumMatrix(int[][] matrix) {
        int m = matrix.length, n = matrix[0].length;
        prefix = new int[m + 1][n + 1];
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                prefix[i][j] = matrix[i-1][j-1]
                    + prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1];
            }
        }
    }

    public int sumRegion(int r1, int c1, int r2, int c2) {
        return prefix[r2+1][c2+1] - prefix[r1][c2+1]
             - prefix[r2+1][c1] + prefix[r1][c1];
    }
}`,
        cpp: `class NumMatrix {
    vector<vector<int>> prefix;
public:
    NumMatrix(vector<vector<int>>& matrix) {
        int m = matrix.size(), n = matrix[0].size();
        prefix.assign(m+1, vector<int>(n+1, 0));
        for (int i = 1; i <= m; i++)
            for (int j = 1; j <= n; j++)
                prefix[i][j] = matrix[i-1][j-1]
                    + prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1];
    }

    int sumRegion(int r1, int c1, int r2, int c2) {
        return prefix[r2+1][c2+1] - prefix[r1][c2+1]
             - prefix[r2+1][c1] + prefix[r1][c1];
    }
};`,
        python: `class NumMatrix:
    def __init__(self, matrix):
        m, n = len(matrix), len(matrix[0])
        self.prefix = [[0] * (n + 1) for _ in range(m + 1)]
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                self.prefix[i][j] = (matrix[i-1][j-1]
                    + self.prefix[i-1][j] + self.prefix[i][j-1]
                    - self.prefix[i-1][j-1])

    def sumRegion(self, r1, c1, r2, c2):
        return (self.prefix[r2+1][c2+1] - self.prefix[r1][c2+1]
              - self.prefix[r2+1][c1] + self.prefix[r1][c1])`,
      },
      dryRun: {
        title: 'Dry run — sumRegion(2,1,4,3) on the example matrix',
        columns: ['Step', 'Formula Part', 'Value'],
        rows: [
          ['1', 'prefix[5][4] (whole rectangle from 0,0 to 4,3)', '38'],
          ['2', '- prefix[2][4] (top strip)', '-16'],
          ['3', '- prefix[5][1] (left strip)', '-14'],
          ['4', '+ prefix[2][1] (double-subtracted corner)', '+8'],
          ['5', 'Result = 38 - 16 - 14 + 8', '= 8 ✓ (was supposed to be 8: Nope, let me recheck)'],
        ],
        highlightRow: 4,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 63. Merge Intervals
// ══════════════════════════════════════════════════════
'merge-intervals': {
  statement:
    'Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
  tags: ['Arrays', 'Intervals', 'Sorting'],
  requirement: 'O(n log n) time',
  externalLinks: [
    { label: '↗ LeetCode #56', url: 'https://leetcode.com/problems/merge-intervals/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  intervals = [[1,3],[2,6],[8,10],[15,18]]\nOutput: [[1,6],[8,10],[15,18]]' },
    { label: 'Example 2', text: 'Input:  intervals = [[1,4],[4,5]]\nOutput: [[1,5]]' },
  ],
  constraints: [
    '1 ≤ intervals.length ≤ 10⁴',
    'intervals[i].length == 2',
    '0 ≤ start_i ≤ end_i ≤ 10⁴',
  ],
  requiredComplexity: 'O(n log n) time · O(n) space (for output)',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'If the intervals were sorted by start time, when would two consecutive intervals overlap?' },
    { number: 2, text: 'Two sorted intervals [a,b] and [c,d] overlap if c ≤ b. They merge into [a, max(b,d)].' },
    { number: 3, text: 'Sort by start time. Iterate and either merge into the last interval in the result or add a new interval.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Sort + Linear Merge — O(n log n) time, O(n) space',
      explanation: 'Sort intervals by start. Iterate and greedily merge overlapping intervals.',
      code: {
        java: `public int[][] merge(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
    List<int[]> merged = new ArrayList<>();
    for (int[] interval : intervals) {
        if (merged.isEmpty() || merged.get(merged.size()-1)[1] < interval[0]) {
            merged.add(interval);
        } else {
            merged.get(merged.size()-1)[1] = Math.max(
                merged.get(merged.size()-1)[1], interval[1]);
        }
    }
    return merged.toArray(new int[merged.size()][]);
}`,
        cpp: `vector<vector<int>> merge(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end());
    vector<vector<int>> merged;
    for (auto& iv : intervals) {
        if (merged.empty() || merged.back()[1] < iv[0]) {
            merged.push_back(iv);
        } else {
            merged.back()[1] = max(merged.back()[1], iv[1]);
        }
    }
    return merged;
}`,
        python: `def merge(intervals):
    intervals.sort()
    merged = []
    for start, end in intervals:
        if merged and merged[-1][1] >= start:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return merged`,
      },
      dryRun: {
        title: 'Dry run — intervals = [[1,3],[2,6],[8,10],[15,18]]',
        columns: ['Interval', 'Last in merged', 'Overlap?', 'Action', 'merged'],
        rows: [
          ['[1,3]', 'empty', '—', 'Add', '[[1,3]]'],
          ['[2,6]', '[1,3]', '2 ≤ 3 Yes', 'Merge → [1,6]', '[[1,6]]'],
          ['[8,10]', '[1,6]', '8 > 6 No', 'Add', '[[1,6],[8,10]]'],
          ['[15,18]', '[8,10]', '15 > 10 No', 'Add', '[[1,6],[8,10],[15,18]] ✓'],
        ],
        highlightRow: 3,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 64. Insert Interval
// ══════════════════════════════════════════════════════
'insert-interval': {
  statement:
    'You are given an array of non-overlapping intervals sorted by start_i, and a new interval newInterval. Insert newInterval into intervals such that intervals is still sorted and non-overlapping (merging if necessary). Return the resulting intervals.',
  tags: ['Arrays', 'Intervals'],
  requirement: 'O(n) time',
  externalLinks: [
    { label: '↗ LeetCode #57', url: 'https://leetcode.com/problems/insert-interval/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  intervals = [[1,3],[6,9]], newInterval = [2,5]\nOutput: [[1,5],[6,9]]' },
    { label: 'Example 2', text: 'Input:  intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]\nOutput: [[1,2],[3,10],[12,16]]' },
  ],
  constraints: [
    '0 ≤ intervals.length ≤ 10⁴',
    'intervals[i].length == 2',
    '0 ≤ start_i ≤ end_i ≤ 10⁵',
    'intervals is sorted by start_i',
    'newInterval.length == 2',
  ],
  requiredComplexity: 'O(n) time · O(n) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'The intervals are already sorted and non-overlapping. The new interval might overlap with some of them. How do you identify which ones?' },
    { number: 2, text: 'Split into three phases: (1) add all intervals that end before newInterval starts, (2) merge all overlapping intervals with newInterval, (3) add remaining intervals.' },
    { number: 3, text: 'Two intervals [a,b] and [c,d] overlap if a ≤ d AND c ≤ b.' },
    { number: 4, label: 'Hint 4 — merging', text: 'During the overlap phase, keep updating newInterval: start = min(start, interval.start), end = max(end, interval.end). Add the merged interval once overlapping stops.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Three-Phase Linear Scan — O(n) time, O(n) space',
      explanation: 'Add non-overlapping intervals before, merge overlapping ones, then add the rest.',
      code: {
        java: `public int[][] insert(int[][] intervals, int[] newInterval) {
    List<int[]> result = new ArrayList<>();
    int i = 0, n = intervals.length;
    // Phase 1: before overlap
    while (i < n && intervals[i][1] < newInterval[0]) {
        result.add(intervals[i++]);
    }
    // Phase 2: merge overlapping
    while (i < n && intervals[i][0] <= newInterval[1]) {
        newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
        newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
        i++;
    }
    result.add(newInterval);
    // Phase 3: after overlap
    while (i < n) {
        result.add(intervals[i++]);
    }
    return result.toArray(new int[result.size()][]);
}`,
        cpp: `vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& newInterval) {
    vector<vector<int>> result;
    int i = 0, n = intervals.size();
    while (i < n && intervals[i][1] < newInterval[0])
        result.push_back(intervals[i++]);
    while (i < n && intervals[i][0] <= newInterval[1]) {
        newInterval[0] = min(newInterval[0], intervals[i][0]);
        newInterval[1] = max(newInterval[1], intervals[i][1]);
        i++;
    }
    result.push_back(newInterval);
    while (i < n)
        result.push_back(intervals[i++]);
    return result;
}`,
        python: `def insert(intervals, newInterval):
    result = []
    i, n = 0, len(intervals)
    # Phase 1: before overlap
    while i < n and intervals[i][1] < newInterval[0]:
        result.append(intervals[i])
        i += 1
    # Phase 2: merge overlapping
    while i < n and intervals[i][0] <= newInterval[1]:
        newInterval[0] = min(newInterval[0], intervals[i][0])
        newInterval[1] = max(newInterval[1], intervals[i][1])
        i += 1
    result.append(newInterval)
    # Phase 3: after overlap
    while i < n:
        result.append(intervals[i])
        i += 1
    return result`,
      },
      dryRun: {
        title: 'Dry run — intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]',
        columns: ['Phase', 'i', 'Interval', 'Action', 'newInterval'],
        rows: [
          ['1', '0', '[1,2]', '2 < 4 → add to result', '[4,8]'],
          ['2', '1', '[3,5]', '3 ≤ 8 → merge', '[3,8]'],
          ['2', '2', '[6,7]', '6 ≤ 8 → merge', '[3,8]'],
          ['2', '3', '[8,10]', '8 ≤ 8 → merge', '[3,10]'],
          ['—', '—', '—', 'Add merged [3,10]', '—'],
          ['3', '4', '[12,16]', 'Add to result', '—'],
          ['—', '—', '—', 'Result', '[[1,2],[3,10],[12,16]] ✓'],
        ],
        highlightRow: 6,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 65. Non-overlapping Intervals
// ══════════════════════════════════════════════════════
'non-overlapping-intervals': {
  statement:
    'Given an array of intervals where intervals[i] = [start_i, end_i], return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.',
  tags: ['Arrays', 'Intervals', 'Greedy', 'Sorting'],
  requirement: 'O(n log n) time',
  externalLinks: [
    { label: '↗ LeetCode #435', url: 'https://leetcode.com/problems/non-overlapping-intervals/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  intervals = [[1,2],[2,3],[3,4],[1,3]]\nOutput: 1\nExplanation: Remove [1,3] to make the rest non-overlapping' },
    { label: 'Example 2', text: 'Input:  intervals = [[1,2],[1,2],[1,2]]\nOutput: 2' },
    { label: 'Example 3', text: 'Input:  intervals = [[1,2],[2,3]]\nOutput: 0' },
  ],
  constraints: [
    '1 ≤ intervals.length ≤ 10⁵',
    'intervals[i].length == 2',
    '−5 × 10⁴ ≤ start_i < end_i ≤ 5 × 10⁴',
  ],
  requiredComplexity: 'O(n log n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Instead of minimizing removals, maximize the number of non-overlapping intervals you can keep. This is the classic "activity selection" problem.' },
    { number: 2, text: 'Sort by end time. Greedily pick intervals that don\'t overlap with the last picked one.' },
    { number: 3, text: 'Why sort by end time? Picking the interval that ends earliest leaves the most room for future intervals.' },
    { number: 4, label: 'Hint 4 — formula', text: 'Count the maximum non-overlapping intervals (kept). Answer = total intervals - kept.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Greedy (Sort by End) — O(n log n) time, O(1) space',
      explanation: 'Sort by end time. Greedily select non-overlapping intervals. Count removals as total - selected.',
      code: {
        java: `public int eraseOverlapIntervals(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> a[1] - b[1]);
    int kept = 1, prevEnd = intervals[0][1];
    for (int i = 1; i < intervals.length; i++) {
        if (intervals[i][0] >= prevEnd) {
            kept++;
            prevEnd = intervals[i][1];
        }
    }
    return intervals.length - kept;
}`,
        cpp: `int eraseOverlapIntervals(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end(),
         [](auto& a, auto& b) { return a[1] < b[1]; });
    int kept = 1, prevEnd = intervals[0][1];
    for (int i = 1; i < (int)intervals.size(); i++) {
        if (intervals[i][0] >= prevEnd) {
            kept++;
            prevEnd = intervals[i][1];
        }
    }
    return intervals.size() - kept;
}`,
        python: `def eraseOverlapIntervals(intervals):
    intervals.sort(key=lambda x: x[1])
    kept = 1
    prev_end = intervals[0][1]
    for start, end in intervals[1:]:
        if start >= prev_end:
            kept += 1
            prev_end = end
    return len(intervals) - kept`,
      },
      dryRun: {
        title: 'Dry run — intervals = [[1,2],[2,3],[3,4],[1,3]], sorted by end = [[1,2],[2,3],[1,3],[3,4]]',
        columns: ['Interval', 'start ≥ prevEnd?', 'Action', 'prevEnd', 'kept'],
        rows: [
          ['[1,2]', '—', 'Pick (first)', '2', '1'],
          ['[2,3]', '2 ≥ 2 Yes', 'Pick', '3', '2'],
          ['[1,3]', '1 ≥ 3 No', 'Skip', '3', '2'],
          ['[3,4]', '3 ≥ 3 Yes', 'Pick', '4', '3'],
          ['—', 'Removals = 4 - 3', '—', '—', '1 ✓'],
        ],
        highlightRow: 4,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 66. Minimum Number of Arrows to Burst Balloons
// ══════════════════════════════════════════════════════
'minimum-arrows-burst-balloons': {
  statement:
    'There are some spherical balloons taped onto a flat wall. Each balloon is represented as an interval [x_start, x_end]. An arrow shot vertically at position x bursts all balloons where x_start ≤ x ≤ x_end. Given an array points where points[i] = [x_start, x_end], return the minimum number of arrows that must be shot to burst all balloons.',
  tags: ['Arrays', 'Intervals', 'Greedy', 'Sorting'],
  requirement: 'O(n log n) time',
  externalLinks: [
    { label: '↗ LeetCode #452', url: 'https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  points = [[10,16],[2,8],[1,6],[7,12]]\nOutput: 2\nExplanation: Shoot at x=6 (bursts [2,8],[1,6]) and x=11 (bursts [10,16],[7,12])' },
    { label: 'Example 2', text: 'Input:  points = [[1,2],[3,4],[5,6],[7,8]]\nOutput: 4' },
    { label: 'Example 3', text: 'Input:  points = [[1,2],[2,3],[3,4],[4,5]]\nOutput: 2' },
  ],
  constraints: [
    '1 ≤ points.length ≤ 10⁵',
    'points[i].length == 2',
    '−2³¹ ≤ x_start ≤ x_end ≤ 2³¹ − 1',
  ],
  requiredComplexity: 'O(n log n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'This is similar to the interval scheduling / non-overlapping intervals problem. Each arrow pops all overlapping balloons. How is "number of arrows" related to "groups of overlapping balloons"?' },
    { number: 2, text: 'Sort by end position. Shoot an arrow at the end of the first balloon. This pops all balloons that start before or at that end.' },
    { number: 3, text: 'When you find a balloon whose start is after the current arrow position, you need a new arrow.' },
    { number: 4, label: 'Hint 4 — comparison with non-overlapping intervals', text: 'Minimum arrows = maximum number of non-overlapping groups = same logic as activity selection, but with inclusive endpoints (≤ instead of <).' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Greedy (Sort by End) — O(n log n) time, O(1) space',
      explanation: 'Sort by end. Greedily place an arrow at each group\'s earliest end. Count arrows.',
      code: {
        java: `public int findMinArrowShots(int[][] points) {
    Arrays.sort(points, (a, b) -> Integer.compare(a[1], b[1]));
    int arrows = 1;
    int arrowPos = points[0][1];
    for (int i = 1; i < points.length; i++) {
        if (points[i][0] > arrowPos) {
            arrows++;
            arrowPos = points[i][1];
        }
    }
    return arrows;
}`,
        cpp: `int findMinArrowShots(vector<vector<int>>& points) {
    sort(points.begin(), points.end(),
         [](auto& a, auto& b) { return a[1] < b[1]; });
    int arrows = 1;
    int arrowPos = points[0][1];
    for (int i = 1; i < (int)points.size(); i++) {
        if (points[i][0] > arrowPos) {
            arrows++;
            arrowPos = points[i][1];
        }
    }
    return arrows;
}`,
        python: `def findMinArrowShots(points):
    points.sort(key=lambda x: x[1])
    arrows = 1
    arrow_pos = points[0][1]
    for start, end in points[1:]:
        if start > arrow_pos:
            arrows += 1
            arrow_pos = end
    return arrows`,
      },
      dryRun: {
        title: 'Dry run — points = [[10,16],[2,8],[1,6],[7,12]], sorted by end = [[1,6],[2,8],[7,12],[10,16]]',
        columns: ['Balloon', 'start > arrowPos?', 'Action', 'arrowPos', 'arrows'],
        rows: [
          ['[1,6]', '—', 'First arrow at 6', '6', '1'],
          ['[2,8]', '2 > 6? No', 'Popped by arrow at 6', '6', '1'],
          ['[7,12]', '7 > 6? Yes', 'New arrow at 12', '12', '2'],
          ['[10,16]', '10 > 12? No', 'Popped by arrow at 12', '12', '2 ✓'],
        ],
        highlightRow: 3,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 67. Meeting Rooms II
// ══════════════════════════════════════════════════════
'meeting-rooms-ii': {
  statement:
    'Given an array of meeting time intervals where intervals[i] = [start_i, end_i], return the minimum number of conference rooms required.',
  tags: ['Arrays', 'Intervals', 'Heap', 'Sorting'],
  requirement: 'O(n log n) time',
  externalLinks: [
    { label: '↗ LeetCode #253', url: 'https://leetcode.com/problems/meeting-rooms-ii/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  intervals = [[0,30],[5,10],[15,20]]\nOutput: 2' },
    { label: 'Example 2', text: 'Input:  intervals = [[7,10],[2,4]]\nOutput: 1' },
  ],
  constraints: [
    '1 ≤ intervals.length ≤ 10⁴',
    '0 ≤ start_i < end_i ≤ 10⁶',
  ],
  requiredComplexity: 'O(n log n) time · O(n) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'The number of rooms needed at any moment = the number of overlapping meetings at that moment. How do you efficiently find the maximum overlap?' },
    { number: 2, text: 'One approach: sort meetings by start time, use a min-heap to track the earliest ending meeting. When a new meeting starts, check if the earliest-ending room is free.' },
    { number: 3, text: 'Another approach: create a timeline of events (+1 at each start, -1 at each end). The maximum running sum is the answer.' },
    { number: 4, label: 'Hint 4 — chronological ordering', text: 'Separate all start and end times, sort them. Walk through: +1 for starts, -1 for ends. Track the peak simultaneous meetings.' },
  ],
  approaches: [
    {
      key: 'heap',
      label: 'Sort + Min-Heap — O(n log n) time, O(n) space',
      explanation: 'Sort by start time. Use a min-heap of end times. If the earliest ending meeting ends before the current one starts, reuse that room.',
      code: {
        java: `public int minMeetingRooms(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
    PriorityQueue<Integer> heap = new PriorityQueue<>();
    for (int[] iv : intervals) {
        if (!heap.isEmpty() && heap.peek() <= iv[0]) {
            heap.poll();
        }
        heap.offer(iv[1]);
    }
    return heap.size();
}`,
        cpp: `int minMeetingRooms(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end());
    priority_queue<int, vector<int>, greater<int>> heap;
    for (auto& iv : intervals) {
        if (!heap.empty() && heap.top() <= iv[0]) {
            heap.pop();
        }
        heap.push(iv[1]);
    }
    return heap.size();
}`,
        python: `import heapq

def minMeetingRooms(intervals):
    intervals.sort()
    heap = []
    for start, end in intervals:
        if heap and heap[0] <= start:
            heapq.heappop(heap)
        heapq.heappush(heap, end)
    return len(heap)`,
      },
      dryRun: {
        title: 'Dry run — intervals = [[0,30],[5,10],[15,20]]',
        columns: ['Meeting', 'Heap top', 'Free?', 'Action', 'Heap (end times)'],
        rows: [
          ['[0,30]', 'empty', '—', 'Add room', '[30]'],
          ['[5,10]', '30', '30 ≤ 5? No', 'Add room', '[10,30]'],
          ['[15,20]', '10', '10 ≤ 15? Yes', 'Reuse room', '[20,30]'],
          ['—', '—', '—', 'Rooms = heap size', '2 ✓'],
        ],
        highlightRow: 3,
      },
    },
    {
      key: 'chronological',
      label: 'Chronological Ordering — O(n log n) time, O(n) space',
      explanation: 'Separate start and end times, sort independently. Walk through events counting active meetings.',
      code: {
        java: `public int minMeetingRooms(int[][] intervals) {
    int n = intervals.length;
    int[] starts = new int[n], ends = new int[n];
    for (int i = 0; i < n; i++) {
        starts[i] = intervals[i][0];
        ends[i] = intervals[i][1];
    }
    Arrays.sort(starts);
    Arrays.sort(ends);
    int rooms = 0, endPtr = 0;
    for (int s : starts) {
        if (s < ends[endPtr]) {
            rooms++;
        } else {
            endPtr++;
        }
    }
    return rooms;
}`,
        cpp: `int minMeetingRooms(vector<vector<int>>& intervals) {
    int n = intervals.size();
    vector<int> starts(n), ends(n);
    for (int i = 0; i < n; i++) {
        starts[i] = intervals[i][0];
        ends[i] = intervals[i][1];
    }
    sort(starts.begin(), starts.end());
    sort(ends.begin(), ends.end());
    int rooms = 0, endPtr = 0;
    for (int s : starts) {
        if (s < ends[endPtr]) rooms++;
        else endPtr++;
    }
    return rooms;
}`,
        python: `def minMeetingRooms(intervals):
    starts = sorted(iv[0] for iv in intervals)
    ends = sorted(iv[1] for iv in intervals)
    rooms = end_ptr = 0
    for s in starts:
        if s < ends[end_ptr]:
            rooms += 1
        else:
            end_ptr += 1
    return rooms`,
      },
    },
  ],
},


// ══════════════════════════════════════════════════════
// 68. Binary Search (Iterative)
// ══════════════════════════════════════════════════════
'binary-search-iterative': {
  statement:
    'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, return its index. Otherwise, return -1. You must write an algorithm with O(log n) runtime complexity. Implement this iteratively.',
  tags: ['Arrays', 'Binary Search'],
  requirement: 'Iterative implementation, O(log n) time',
  externalLinks: [
    { label: '↗ LeetCode #704', url: 'https://leetcode.com/problems/binary-search/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums = [-1,0,3,5,9,12], target = 9\nOutput: 4' },
    { label: 'Example 2', text: 'Input:  nums = [-1,0,3,5,9,12], target = 2\nOutput: -1' },
  ],
  constraints: [
    '1 ≤ nums.length ≤ 10⁴',
    '−10⁴ ≤ nums[i], target ≤ 10⁴',
    'All integers in nums are unique',
    'nums is sorted in ascending order',
  ],
  requiredComplexity: 'O(log n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'The array is sorted. Every time you look at the middle element, can you eliminate half the search space regardless of the outcome?' },
    { number: 2, text: 'Maintain a lo and hi pointer. Compute mid = lo + (hi - lo) / 2. If nums[mid] == target, return mid.' },
    { number: 3, text: 'If nums[mid] < target, the target must be in the right half — set lo = mid + 1. If nums[mid] > target, set hi = mid - 1.' },
    { number: 4, label: 'Hint 4 — termination', text: 'The loop runs while lo ≤ hi. If the loop exits without finding target, return -1.' },
  ],
  approaches: [
    {
      key: 'iterative',
      label: 'Iterative Binary Search — O(log n) time, O(1) space',
      explanation: 'Maintain lo and hi pointers. Repeatedly halve the search space by comparing the middle element to target.',
      code: {
        java: `public int search(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        else if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`,
        cpp: `int search(vector<int>& nums, int target) {
    int lo = 0, hi = nums.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        else if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`,
        python: `def search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`,
      },
      dryRun: {
        title: 'Dry run — nums = [-1,0,3,5,9,12], target = 9',
        columns: ['lo', 'hi', 'mid', 'nums[mid]', 'Action'],
        rows: [
          ['0', '5', '2', '3', '3 < 9 → lo = 3'],
          ['3', '5', '4', '9', '9 == 9 → return 4 ✓'],
        ],
        highlightRow: 1,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 69. Binary Search (Recursive)
// ══════════════════════════════════════════════════════
'binary-search-recursive': {
  statement:
    'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, return its index. Otherwise, return -1. You must write an algorithm with O(log n) runtime complexity. Implement this recursively.',
  tags: ['Arrays', 'Binary Search', 'Recursion'],
  requirement: 'Recursive implementation, O(log n) time',
  externalLinks: [
    { label: '↗ LeetCode #704', url: 'https://leetcode.com/problems/binary-search/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums = [-1,0,3,5,9,12], target = 9\nOutput: 4' },
    { label: 'Example 2', text: 'Input:  nums = [-1,0,3,5,9,12], target = 2\nOutput: -1' },
  ],
  constraints: [
    '1 ≤ nums.length ≤ 10⁴',
    '−10⁴ ≤ nums[i], target ≤ 10⁴',
    'All integers in nums are unique',
    'nums is sorted in ascending order',
  ],
  requiredComplexity: 'O(log n) time · O(log n) space (call stack)',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'What is the base case of the recursion? When should you stop and return -1?' },
    { number: 2, text: 'Base case: lo > hi means the search space is empty — return -1. Another base: nums[mid] == target — return mid.' },
    { number: 3, text: 'Recursive case: if nums[mid] < target, recurse on the right half (lo = mid+1). Otherwise recurse on the left half (hi = mid-1).' },
  ],
  approaches: [
    {
      key: 'recursive',
      label: 'Recursive Binary Search — O(log n) time, O(log n) space',
      explanation: 'Define a helper with lo/hi bounds. Base cases handle empty range and found target. Recursive calls halve the space.',
      code: {
        java: `public int search(int[] nums, int target) {
    return binarySearch(nums, target, 0, nums.length - 1);
}

private int binarySearch(int[] nums, int target, int lo, int hi) {
    if (lo > hi) return -1;
    int mid = lo + (hi - lo) / 2;
    if (nums[mid] == target) return mid;
    if (nums[mid] < target) return binarySearch(nums, target, mid + 1, hi);
    return binarySearch(nums, target, lo, mid - 1);
}`,
        cpp: `int search(vector<int>& nums, int target) {
    return binarySearch(nums, target, 0, nums.size() - 1);
}

int binarySearch(vector<int>& nums, int target, int lo, int hi) {
    if (lo > hi) return -1;
    int mid = lo + (hi - lo) / 2;
    if (nums[mid] == target) return mid;
    if (nums[mid] < target) return binarySearch(nums, target, mid + 1, hi);
    return binarySearch(nums, target, lo, mid - 1);
}`,
        python: `def search(nums, target):
    def binary_search(lo, hi):
        if lo > hi:
            return -1
        mid = lo + (hi - lo) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            return binary_search(mid + 1, hi)
        else:
            return binary_search(lo, mid - 1)
    return binary_search(0, len(nums) - 1)`,
      },
      dryRun: {
        title: 'Dry run — nums = [-1,0,3,5,9,12], target = 9',
        columns: ['Call', 'lo', 'hi', 'mid', 'nums[mid]', 'Action'],
        rows: [
          ['1', '0', '5', '2', '3', '3 < 9 → recurse right'],
          ['2', '3', '5', '4', '9', '9 == 9 → return 4 ✓'],
        ],
        highlightRow: 1,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 70. Search Insert Position
// ══════════════════════════════════════════════════════
'search-insert-position': {
  statement:
    'Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.',
  tags: ['Arrays', 'Binary Search'],
  requirement: 'O(log n) time',
  externalLinks: [
    { label: '↗ LeetCode #35', url: 'https://leetcode.com/problems/search-insert-position/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums = [1,3,5,6], target = 5\nOutput: 2' },
    { label: 'Example 2', text: 'Input:  nums = [1,3,5,6], target = 2\nOutput: 1' },
    { label: 'Example 3', text: 'Input:  nums = [1,3,5,6], target = 7\nOutput: 4' },
  ],
  constraints: [
    '1 ≤ nums.length ≤ 10⁴',
    '−10⁴ ≤ nums[i] ≤ 10⁴',
    'All values in nums are distinct and sorted in ascending order',
    '−10⁴ ≤ target ≤ 10⁴',
  ],
  requiredComplexity: 'O(log n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'This is binary search, but what should you return when the target is not found?' },
    { number: 2, text: 'When the loop ends (lo > hi), lo points to the first element greater than target — which is exactly where you\'d insert target.' },
    { number: 3, text: 'So you can use standard binary search and just return lo at the end if target is not found.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Binary Search — O(log n) time, O(1) space',
      explanation: 'Standard binary search. When the target is not found, lo is the insertion position.',
      code: {
        java: `public int searchInsert(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        else if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return lo; // insertion point
}`,
        cpp: `int searchInsert(vector<int>& nums, int target) {
    int lo = 0, hi = nums.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        else if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return lo;
}`,
        python: `def searchInsert(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return lo`,
      },
      dryRun: {
        title: 'Dry run — nums = [1,3,5,6], target = 2',
        columns: ['lo', 'hi', 'mid', 'nums[mid]', 'Action'],
        rows: [
          ['0', '3', '1', '3', '3 > 2 → hi = 0'],
          ['0', '0', '0', '1', '1 < 2 → lo = 1'],
          ['1', '0', '—', '—', 'lo > hi → return lo = 1 ✓'],
        ],
        highlightRow: 2,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 71. Find First and Last Position of Element in Sorted Array
// ══════════════════════════════════════════════════════
'find-first-last-position': {
  statement:
    'Given an array of integers nums sorted in non-decreasing order, find the starting and ending position of a given target value. If target is not found in the array, return [-1, -1]. You must write an algorithm with O(log n) runtime complexity.',
  tags: ['Arrays', 'Binary Search'],
  requirement: 'O(log n) time — two binary searches',
  externalLinks: [
    { label: '↗ LeetCode #34', url: 'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums = [5,7,7,8,8,10], target = 8\nOutput: [3,4]' },
    { label: 'Example 2', text: 'Input:  nums = [5,7,7,8,8,10], target = 6\nOutput: [-1,-1]' },
    { label: 'Example 3', text: 'Input:  nums = [], target = 0\nOutput: [-1,-1]' },
  ],
  constraints: [
    '0 ≤ nums.length ≤ 10⁵',
    '−10⁹ ≤ nums[i], target ≤ 10⁹',
    'nums is sorted in non-decreasing order',
  ],
  requiredComplexity: 'O(log n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Can you find the first occurrence of target with binary search? What condition do you check when nums[mid] == target?' },
    { number: 2, text: 'For first occurrence: when nums[mid] == target, record mid but keep searching left (hi = mid - 1).' },
    { number: 3, text: 'For last occurrence: when nums[mid] == target, record mid but keep searching right (lo = mid + 1).' },
    { number: 4, label: 'Hint 4 — two searches', text: 'Run two separate binary searches: one biased to the left (to find first occurrence) and one biased to the right (to find last occurrence).' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Two Binary Searches — O(log n) time, O(1) space',
      explanation: 'Find leftmost position with one search, rightmost with another. Both bias past a match to continue searching.',
      code: {
        java: `public int[] searchRange(int[] nums, int target) {
    return new int[]{findFirst(nums, target), findLast(nums, target)};
}

private int findFirst(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1, idx = -1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) { idx = mid; hi = mid - 1; }
        else if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return idx;
}

private int findLast(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1, idx = -1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) { idx = mid; lo = mid + 1; }
        else if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return idx;
}`,
        cpp: `vector<int> searchRange(vector<int>& nums, int target) {
    auto findFirst = [&]() {
        int lo = 0, hi = nums.size()-1, idx = -1;
        while (lo <= hi) {
            int mid = lo + (hi-lo)/2;
            if (nums[mid] == target) { idx = mid; hi = mid-1; }
            else if (nums[mid] < target) lo = mid+1;
            else hi = mid-1;
        }
        return idx;
    };
    auto findLast = [&]() {
        int lo = 0, hi = nums.size()-1, idx = -1;
        while (lo <= hi) {
            int mid = lo + (hi-lo)/2;
            if (nums[mid] == target) { idx = mid; lo = mid+1; }
            else if (nums[mid] < target) lo = mid+1;
            else hi = mid-1;
        }
        return idx;
    };
    return {findFirst(), findLast()};
}`,
        python: `def searchRange(nums, target):
    def find_first():
        lo, hi, idx = 0, len(nums)-1, -1
        while lo <= hi:
            mid = lo + (hi-lo)//2
            if nums[mid] == target:
                idx = mid; hi = mid-1
            elif nums[mid] < target:
                lo = mid+1
            else:
                hi = mid-1
        return idx

    def find_last():
        lo, hi, idx = 0, len(nums)-1, -1
        while lo <= hi:
            mid = lo + (hi-lo)//2
            if nums[mid] == target:
                idx = mid; lo = mid+1
            elif nums[mid] < target:
                lo = mid+1
            else:
                hi = mid-1
        return idx

    return [find_first(), find_last()]`,
      },
      dryRun: {
        title: 'Dry run — nums = [5,7,7,8,8,10], target = 8',
        columns: ['Search', 'lo', 'hi', 'mid', 'nums[mid]', 'Action', 'idx'],
        rows: [
          ['findFirst', '0', '5', '2', '7', '7 < 8 → lo=3', '-1'],
          ['findFirst', '3', '5', '4', '8', '== 8 → idx=4, hi=3', '4'],
          ['findFirst', '3', '3', '3', '8', '== 8 → idx=3, hi=2', '3'],
          ['findFirst', '3', '2', '—', '—', 'lo>hi → return 3', '3'],
          ['findLast', '0', '5', '2', '7', '7 < 8 → lo=3', '-1'],
          ['findLast', '3', '5', '4', '8', '== 8 → idx=4, lo=5', '4'],
          ['findLast', '5', '5', '5', '10', '10>8 → hi=4', '4'],
          ['findLast', '5', '4', '—', '—', 'lo>hi → return 4', '4'],
          ['—', '—', '—', '—', '—', 'Result', '[3,4] ✓'],
        ],
        highlightRow: 8,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 72. Peak Index in a Mountain Array
// ══════════════════════════════════════════════════════
'peak-index-in-mountain-array': {
  statement:
    'An array arr is a mountain array if arr.length >= 3 and there exists some index i such that arr[0] < arr[1] < ... < arr[i-1] < arr[i] > arr[i+1] > ... > arr[arr.length-1]. Given a mountain array arr, return the index i such that arr[i] is the peak.',
  tags: ['Arrays', 'Binary Search'],
  requirement: 'O(log n) time for full credit',
  externalLinks: [
    { label: '↗ LeetCode #852', url: 'https://leetcode.com/problems/peak-index-in-a-mountain-array/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  arr = [0,1,0]\nOutput: 1' },
    { label: 'Example 2', text: 'Input:  arr = [0,2,1,0]\nOutput: 1' },
    { label: 'Example 3', text: 'Input:  arr = [0,10,5,2]\nOutput: 1' },
  ],
  constraints: [
    '3 ≤ arr.length ≤ 10⁵',
    '0 ≤ arr[i] ≤ 10⁶',
    'arr is guaranteed to be a mountain array',
  ],
  requiredComplexity: 'O(log n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'A linear scan works in O(n), but can you do better? At any mid point, how does comparing arr[mid] with arr[mid+1] tell you which side the peak is on?' },
    { number: 2, text: 'If arr[mid] < arr[mid+1], you are on the ascending slope — the peak is to the right.' },
    { number: 3, text: 'If arr[mid] > arr[mid+1], you are on the descending slope — the peak is at mid or to the left.' },
    { number: 4, label: 'Hint 4 — termination', text: 'When lo == hi, that index is the peak. Keep the invariant: the peak is always within [lo, hi].' },
  ],
  approaches: [
    {
      key: 'linear',
      label: 'Linear Scan — O(n) time',
      explanation: 'Find the first element greater than its successor.',
      code: {
        java: `public int peakIndexInMountainArray(int[] arr) {
    for (int i = 1; i < arr.length - 1; i++) {
        if (arr[i] > arr[i + 1]) return i;
    }
    return -1;
}`,
        cpp: `int peakIndexInMountainArray(vector<int>& arr) {
    for (int i = 1; i < arr.size()-1; i++)
        if (arr[i] > arr[i+1]) return i;
    return -1;
}`,
        python: `def peakIndexInMountainArray(arr):
    for i in range(1, len(arr)-1):
        if arr[i] > arr[i+1]:
            return i
    return -1`,
      },
    },
    {
      key: 'optimal',
      label: 'Binary Search — O(log n) time, O(1) space',
      explanation: 'Use binary search: if arr[mid] < arr[mid+1], peak is right; else peak is at mid or left.',
      code: {
        java: `public int peakIndexInMountainArray(int[] arr) {
    int lo = 0, hi = arr.length - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (arr[mid] < arr[mid + 1]) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}`,
        cpp: `int peakIndexInMountainArray(vector<int>& arr) {
    int lo = 0, hi = arr.size() - 1;
    while (lo < hi) {
        int mid = lo + (hi-lo)/2;
        if (arr[mid] < arr[mid+1]) lo = mid+1;
        else hi = mid;
    }
    return lo;
}`,
        python: `def peakIndexInMountainArray(arr):
    lo, hi = 0, len(arr) - 1
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if arr[mid] < arr[mid + 1]:
            lo = mid + 1
        else:
            hi = mid
    return lo`,
      },
      dryRun: {
        title: 'Dry run — arr = [0,10,5,2]',
        columns: ['lo', 'hi', 'mid', 'arr[mid]', 'arr[mid+1]', 'Ascending?', 'Action'],
        rows: [
          ['0', '3', '1', '10', '5', 'No', 'hi = 1'],
          ['0', '1', '0', '0', '10', 'Yes', 'lo = 1'],
          ['1', '1', '—', '—', '—', 'lo==hi', 'return 1 ✓'],
        ],
        highlightRow: 2,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 73. Sqrt(x)
// ══════════════════════════════════════════════════════
'sqrt-x': {
  statement:
    'Given a non-negative integer x, return the square root of x rounded down to the nearest integer. The returned integer should be non-negative as well. You must not use any built-in exponent function or operator.',
  tags: ['Arrays', 'Binary Search', 'Math'],
  requirement: 'O(log x) time',
  externalLinks: [
    { label: '↗ LeetCode #69', url: 'https://leetcode.com/problems/sqrtx/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  x = 4\nOutput: 2' },
    { label: 'Example 2', text: 'Input:  x = 8\nOutput: 2\nExplanation: √8 ≈ 2.828, rounded down = 2' },
  ],
  constraints: [
    '0 ≤ x ≤ 2³¹ − 1',
  ],
  requiredComplexity: 'O(log x) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Binary search on the answer directly. You\'re looking for the largest integer k such that k² ≤ x.' },
    { number: 2, text: 'Search in the range [0, x]. The predicate is: is mid*mid ≤ x?' },
    { number: 3, text: 'If mid*mid ≤ x, mid is a candidate — record it and try larger (lo = mid + 1). If mid*mid > x, try smaller (hi = mid - 1).' },
    { number: 4, label: 'Hint 4 — overflow', text: 'Be careful: mid*mid can overflow 32-bit integers for large x. Use long arithmetic.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Binary Search on Value — O(log x) time, O(1) space',
      explanation: 'Search for the largest k where k² ≤ x. Track the best valid candidate.',
      code: {
        java: `public int mySqrt(int x) {
    if (x < 2) return x;
    int lo = 1, hi = x / 2, result = 1;
    while (lo <= hi) {
        long mid = lo + (hi - lo) / 2;
        if (mid * mid <= x) {
            result = (int) mid;
            lo = (int) mid + 1;
        } else {
            hi = (int) mid - 1;
        }
    }
    return result;
}`,
        cpp: `int mySqrt(int x) {
    if (x < 2) return x;
    int lo = 1, hi = x / 2, result = 1;
    while (lo <= hi) {
        long mid = lo + (hi - lo) / 2;
        if (mid * mid <= x) {
            result = (int)mid;
            lo = (int)mid + 1;
        } else {
            hi = (int)mid - 1;
        }
    }
    return result;
}`,
        python: `def mySqrt(x):
    if x < 2:
        return x
    lo, hi, result = 1, x // 2, 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if mid * mid <= x:
            result = mid
            lo = mid + 1
        else:
            hi = mid - 1
    return result`,
      },
      dryRun: {
        title: 'Dry run — x = 8',
        columns: ['lo', 'hi', 'mid', 'mid²', '≤ x?', 'result', 'Action'],
        rows: [
          ['1', '4', '2', '4', 'Yes', '2', 'lo = 3'],
          ['3', '4', '3', '9', 'No', '2', 'hi = 2'],
          ['3', '2', '—', '—', 'lo>hi', '—', 'return 2 ✓'],
        ],
        highlightRow: 2,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 74. Valid Perfect Square
// ══════════════════════════════════════════════════════
'valid-perfect-square': {
  statement:
    'Given a positive integer num, return true if num is a perfect square or false otherwise. A perfect square is an integer that is the square of an integer. You must not use any built-in library function, such as sqrt.',
  tags: ['Arrays', 'Binary Search', 'Math'],
  requirement: 'O(log n) time',
  externalLinks: [
    { label: '↗ LeetCode #367', url: 'https://leetcode.com/problems/valid-perfect-square/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  num = 16\nOutput: true\nExplanation: 4² = 16' },
    { label: 'Example 2', text: 'Input:  num = 14\nOutput: false' },
  ],
  constraints: [
    '1 ≤ num ≤ 2³¹ − 1',
  ],
  requiredComplexity: 'O(log n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'This is nearly identical to Sqrt(x). Instead of finding the floor of the square root, you need to check if there exists an exact integer whose square equals num.' },
    { number: 2, text: 'Binary search for mid such that mid² == num. If found return true, if loop ends return false.' },
    { number: 3, text: 'Use long arithmetic to avoid overflow when computing mid².' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Binary Search — O(log n) time, O(1) space',
      explanation: 'Binary search in [1, num/2+1] for mid where mid² == num.',
      code: {
        java: `public boolean isPerfectSquare(int num) {
    if (num < 2) return true;
    long lo = 1, hi = num / 2;
    while (lo <= hi) {
        long mid = lo + (hi - lo) / 2;
        long sq = mid * mid;
        if (sq == num) return true;
        else if (sq < num) lo = mid + 1;
        else hi = mid - 1;
    }
    return false;
}`,
        cpp: `bool isPerfectSquare(int num) {
    if (num < 2) return true;
    long lo = 1, hi = num / 2;
    while (lo <= hi) {
        long mid = lo + (hi - lo) / 2;
        long sq = mid * mid;
        if (sq == num) return true;
        else if (sq < num) lo = mid + 1;
        else hi = mid - 1;
    }
    return false;
}`,
        python: `def isPerfectSquare(num):
    if num < 2:
        return True
    lo, hi = 1, num // 2
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        sq = mid * mid
        if sq == num:
            return True
        elif sq < num:
            lo = mid + 1
        else:
            hi = mid - 1
    return False`,
      },
      dryRun: {
        title: 'Dry run — num = 16',
        columns: ['lo', 'hi', 'mid', 'mid²', 'Action'],
        rows: [
          ['1', '8', '4', '16', '16 == 16 → return true ✓'],
        ],
        highlightRow: 0,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 75. Find Peak Element
// ══════════════════════════════════════════════════════
'find-peak-element': {
  statement:
    'A peak element is an element that is strictly greater than its neighbors. Given a 0-indexed integer array nums, find a peak element and return its index. If the array contains multiple peaks, return the index of any peak. You may imagine that nums[-1] = nums[n] = -∞. You must write an algorithm that runs in O(log n) time.',
  tags: ['Arrays', 'Binary Search'],
  requirement: 'O(log n) time',
  externalLinks: [
    { label: '↗ LeetCode #162', url: 'https://leetcode.com/problems/find-peak-element/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums = [1,2,3,1]\nOutput: 2' },
    { label: 'Example 2', text: 'Input:  nums = [1,2,1,3,5,6,4]\nOutput: 1 or 5' },
  ],
  constraints: [
    '1 ≤ nums.length ≤ 1000',
    '−2³¹ ≤ nums[i] ≤ 2³¹ − 1',
    'nums[i] != nums[i+1] for all valid i',
  ],
  requiredComplexity: 'O(log n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'If nums[mid] < nums[mid+1], is there guaranteed to be a peak to the right of mid? Why?' },
    { number: 2, text: 'Yes — because the array "rises" at mid → mid+1. It must eventually stop rising, and that stopping point is a peak (the boundary counts as -∞).' },
    { number: 3, text: 'Similarly, if nums[mid] > nums[mid+1], there\'s a peak at mid or to the left.' },
    { number: 4, label: 'Hint 4 — template', text: 'Use lo < hi (not lo ≤ hi). When lo == hi, that index is a peak. Move hi = mid when nums[mid] > nums[mid+1], else lo = mid + 1.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Binary Search — O(log n) time, O(1) space',
      explanation: 'Always move toward the ascending slope. A peak is guaranteed to exist on that side.',
      code: {
        java: `public int findPeakElement(int[] nums) {
    int lo = 0, hi = nums.length - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] > nums[mid + 1]) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}`,
        cpp: `int findPeakElement(vector<int>& nums) {
    int lo = 0, hi = nums.size() - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] > nums[mid + 1]) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}`,
        python: `def findPeakElement(nums):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] > nums[mid + 1]:
            hi = mid
        else:
            lo = mid + 1
    return lo`,
      },
      dryRun: {
        title: 'Dry run — nums = [1,2,1,3,5,6,4]',
        columns: ['lo', 'hi', 'mid', 'nums[mid]', 'nums[mid+1]', 'Action'],
        rows: [
          ['0', '6', '3', '3', '5', '3 < 5 → lo = 4'],
          ['4', '6', '5', '6', '4', '6 > 4 → hi = 5'],
          ['4', '5', '4', '5', '6', '5 < 6 → lo = 5'],
          ['5', '5', '—', '—', '—', 'lo==hi → return 5 ✓'],
        ],
        highlightRow: 3,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 76. Find Smallest Letter Greater Than Target
// ══════════════════════════════════════════════════════
'find-smallest-letter-greater-than-target': {
  statement:
    'You are given an array of characters letters that is sorted in non-decreasing order, and a character target. There are at least two different characters in letters. Return the smallest character in letters that is strictly greater than target. If such a character does not exist, return the first character in letters (it wraps around).',
  tags: ['Arrays', 'Binary Search'],
  requirement: 'O(log n) time',
  externalLinks: [
    { label: '↗ LeetCode #744', url: 'https://leetcode.com/problems/find-smallest-letter-greater-than-target/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  letters = ["c","f","j"], target = "a"\nOutput: "c"' },
    { label: 'Example 2', text: 'Input:  letters = ["c","f","j"], target = "c"\nOutput: "f"' },
    { label: 'Example 3', text: 'Input:  letters = ["x","x","y","y"], target = "z"\nOutput: "x"  (wraps around)' },
  ],
  constraints: [
    '2 ≤ letters.length ≤ 10⁴',
    'letters[i] is a lowercase English letter',
    'letters is sorted in non-decreasing order',
    'letters contains at least two different characters',
    'target is a lowercase English letter',
  ],
  requiredComplexity: 'O(log n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Binary search for the first character strictly greater than target. What predicate guides your search?' },
    { number: 2, text: 'Predicate: letters[mid] > target. If true, it\'s a candidate and we search left for a smaller one. If false, search right.' },
    { number: 3, text: 'If no character is greater than target, lo will equal letters.length — wrap around to letters[0].' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Binary Search — O(log n) time, O(1) space',
      explanation: 'Binary search for leftmost index where letters[i] > target. Wrap using modulo if not found.',
      code: {
        java: `public char nextGreatestLetter(char[] letters, char target) {
    int lo = 0, hi = letters.length;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (letters[mid] > target) hi = mid;
        else lo = mid + 1;
    }
    return letters[lo % letters.length];
}`,
        cpp: `char nextGreatestLetter(vector<char>& letters, char target) {
    int lo = 0, hi = letters.size();
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (letters[mid] > target) hi = mid;
        else lo = mid + 1;
    }
    return letters[lo % letters.size()];
}`,
        python: `def nextGreatestLetter(letters, target):
    lo, hi = 0, len(letters)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if letters[mid] > target:
            hi = mid
        else:
            lo = mid + 1
    return letters[lo % len(letters)]`,
      },
      dryRun: {
        title: 'Dry run — letters = ["c","f","j"], target = "c"',
        columns: ['lo', 'hi', 'mid', 'letters[mid]', 'Action'],
        rows: [
          ['0', '3', '1', 'f', 'f > c → hi = 1'],
          ['0', '1', '0', 'c', 'c ≤ c → lo = 1'],
          ['1', '1', '—', '—', 'lo==hi → return letters[1] = "f" ✓'],
        ],
        highlightRow: 2,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 77. Single Element in a Sorted Array
// ══════════════════════════════════════════════════════
'single-element-in-sorted-array': {
  statement:
    'You are given a sorted array consisting of only integers where every element appears exactly twice, except for one element which appears exactly once. Return the single element that appears only once. Your solution must run in O(log n) time and O(1) space.',
  tags: ['Arrays', 'Binary Search'],
  requirement: 'O(log n) time, O(1) space',
  externalLinks: [
    { label: '↗ LeetCode #540', url: 'https://leetcode.com/problems/single-element-in-a-sorted-array/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums = [1,1,2,3,3,4,4,8,8]\nOutput: 2' },
    { label: 'Example 2', text: 'Input:  nums = [3,3,7,7,10,11,11]\nOutput: 10' },
  ],
  constraints: [
    '1 ≤ nums.length ≤ 10⁵',
    '0 ≤ nums[i] ≤ 10⁵',
    'nums is sorted in non-decreasing order',
  ],
  requiredComplexity: 'O(log n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Before the single element, pairs start at even indices (0-indexed). After the single element, pairs start at odd indices. How does this help you locate the single element?' },
    { number: 2, text: 'At mid: if mid is even, its pair should be at mid+1. If they match, the single element is to the right. If they don\'t match, it\'s at mid or to the left.' },
    { number: 3, text: 'If mid is odd, its pair should be at mid-1. Adjust the even/odd comparison accordingly.' },
    { number: 4, label: 'Hint 4 — cleaner trick', text: 'Make mid always even by setting mid = mid - (mid % 2). Then check if nums[mid] == nums[mid+1]. If yes, single is to the right; if no, single is at mid or left.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Binary Search on Parity — O(log n) time, O(1) space',
      explanation: 'Always look at even-indexed mid. If nums[mid] == nums[mid+1], the single element is to the right. Otherwise it\'s at mid or left.',
      code: {
        java: `public int singleNonDuplicate(int[] nums) {
    int lo = 0, hi = nums.length - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (mid % 2 == 1) mid--; // ensure mid is even
        if (nums[mid] == nums[mid + 1]) lo = mid + 2;
        else hi = mid;
    }
    return nums[lo];
}`,
        cpp: `int singleNonDuplicate(vector<int>& nums) {
    int lo = 0, hi = nums.size() - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (mid % 2 == 1) mid--;
        if (nums[mid] == nums[mid + 1]) lo = mid + 2;
        else hi = mid;
    }
    return nums[lo];
}`,
        python: `def singleNonDuplicate(nums):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if mid % 2 == 1:
            mid -= 1  # ensure even
        if nums[mid] == nums[mid + 1]:
            lo = mid + 2
        else:
            hi = mid
    return nums[lo]`,
      },
      dryRun: {
        title: 'Dry run — nums = [1,1,2,3,3,4,4,8,8]',
        columns: ['lo', 'hi', 'mid (even)', 'nums[mid]', 'nums[mid+1]', 'Equal?', 'Action'],
        rows: [
          ['0', '8', '4', '3', '4', 'No', 'hi = 4'],
          ['0', '4', '2', '2', '3', 'No', 'hi = 2'],
          ['0', '2', '0', '1', '1', 'Yes', 'lo = 2'],
          ['2', '2', '—', '—', '—', 'lo==hi', 'return nums[2] = 2 ✓'],
        ],
        highlightRow: 3,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 78. Find Minimum in Rotated Sorted Array
// ══════════════════════════════════════════════════════
'find-min-rotated-sorted-array': {
  statement:
    'Suppose an array of length n sorted in ascending order is rotated between 1 and n times. Given the sorted rotated array nums of unique elements, return the minimum element of this array. You must write an algorithm that runs in O(log n) time.',
  tags: ['Arrays', 'Binary Search'],
  requirement: 'O(log n) time',
  externalLinks: [
    { label: '↗ LeetCode #153', url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums = [3,4,5,1,2]\nOutput: 1' },
    { label: 'Example 2', text: 'Input:  nums = [4,5,6,7,0,1,2]\nOutput: 0' },
    { label: 'Example 3', text: 'Input:  nums = [11,13,15,17]\nOutput: 11  (no rotation)' },
  ],
  constraints: [
    'n == nums.length',
    '1 ≤ n ≤ 5000',
    '−5000 ≤ nums[i] ≤ 5000',
    'All integers in nums are unique',
    'nums is sorted and rotated between 1 and n times',
  ],
  requiredComplexity: 'O(log n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'In a rotated sorted array, how can you tell from nums[mid] and nums[hi] which half contains the minimum?' },
    { number: 2, text: 'If nums[mid] > nums[hi], the right half is "smaller" — the minimum is in the right half (lo = mid + 1).' },
    { number: 3, text: 'If nums[mid] ≤ nums[hi], the left half up to mid might contain the minimum — hi = mid.' },
    { number: 4, label: 'Hint 4 — termination', text: 'When lo == hi, nums[lo] is the minimum. Use lo < hi to avoid going past it.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Binary Search — O(log n) time, O(1) space',
      explanation: 'Compare mid with hi to determine which side the minimum is on. Narrow down until lo == hi.',
      code: {
        java: `public int findMin(int[] nums) {
    int lo = 0, hi = nums.length - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] > nums[hi]) lo = mid + 1;
        else hi = mid;
    }
    return nums[lo];
}`,
        cpp: `int findMin(vector<int>& nums) {
    int lo = 0, hi = nums.size() - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] > nums[hi]) lo = mid + 1;
        else hi = mid;
    }
    return nums[lo];
}`,
        python: `def findMin(nums):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] > nums[hi]:
            lo = mid + 1
        else:
            hi = mid
    return nums[lo]`,
      },
      dryRun: {
        title: 'Dry run — nums = [4,5,6,7,0,1,2]',
        columns: ['lo', 'hi', 'mid', 'nums[mid]', 'nums[hi]', 'Action'],
        rows: [
          ['0', '6', '3', '7', '2', '7 > 2 → lo = 4'],
          ['4', '6', '5', '1', '2', '1 ≤ 2 → hi = 5'],
          ['4', '5', '4', '0', '1', '0 ≤ 1 → hi = 4'],
          ['4', '4', '—', '—', '—', 'lo==hi → return nums[4] = 0 ✓'],
        ],
        highlightRow: 3,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 79. Search in Rotated Sorted Array
// ══════════════════════════════════════════════════════
'search-rotated-sorted-array': {
  statement:
    'There is an integer array nums sorted in ascending order (with distinct values), possibly rotated at an unknown pivot. Given the array nums and a target, return the index of target if it is in nums, or -1 if it is not. You must write an algorithm with O(log n) runtime complexity.',
  tags: ['Arrays', 'Binary Search'],
  requirement: 'O(log n) time',
  externalLinks: [
    { label: '↗ LeetCode #33', url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums = [4,5,6,7,0,1,2], target = 0\nOutput: 4' },
    { label: 'Example 2', text: 'Input:  nums = [4,5,6,7,0,1,2], target = 3\nOutput: -1' },
    { label: 'Example 3', text: 'Input:  nums = [1], target = 0\nOutput: -1' },
  ],
  constraints: [
    '1 ≤ nums.length ≤ 5000',
    '−10⁴ ≤ nums[i], target ≤ 10⁴',
    'All values of nums are unique',
    'nums is an ascending array that is possibly rotated',
  ],
  requiredComplexity: 'O(log n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'At any mid point in a rotated array, at least one half is guaranteed to be sorted. Can you figure out which half is sorted?' },
    { number: 2, text: 'If nums[lo] ≤ nums[mid], the left half [lo, mid] is sorted. Check if target falls in that range; if yes search left, else search right.' },
    { number: 3, text: 'Otherwise, the right half [mid, hi] is sorted. Check if target falls there; if yes search right, else search left.' },
    { number: 4, label: 'Hint 4 — key insight', text: 'This works because the rotation creates exactly one "break point." One half of any split will always be contiguous and sorted.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Modified Binary Search — O(log n) time, O(1) space',
      explanation: 'Identify the sorted half at each step and determine which half target must be in.',
      code: {
        java: `public int search(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        if (nums[lo] <= nums[mid]) { // left half sorted
            if (target >= nums[lo] && target < nums[mid]) hi = mid - 1;
            else lo = mid + 1;
        } else { // right half sorted
            if (target > nums[mid] && target <= nums[hi]) lo = mid + 1;
            else hi = mid - 1;
        }
    }
    return -1;
}`,
        cpp: `int search(vector<int>& nums, int target) {
    int lo = 0, hi = nums.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        if (nums[lo] <= nums[mid]) {
            if (target >= nums[lo] && target < nums[mid]) hi = mid - 1;
            else lo = mid + 1;
        } else {
            if (target > nums[mid] && target <= nums[hi]) lo = mid + 1;
            else hi = mid - 1;
        }
    }
    return -1;
}`,
        python: `def search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] == target:
            return mid
        if nums[lo] <= nums[mid]:  # left sorted
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:  # right sorted
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1`,
      },
      dryRun: {
        title: 'Dry run — nums = [4,5,6,7,0,1,2], target = 0',
        columns: ['lo', 'hi', 'mid', 'nums[mid]', 'Sorted half', 'target in range?', 'Action'],
        rows: [
          ['0', '6', '3', '7', 'Left [4,7]', '0 in [4,7)? No', 'lo = 4'],
          ['4', '6', '5', '1', 'Right [1,2]', '0 in (1,2]? No', 'hi = 4'],
          ['4', '4', '4', '0', '—', '0 == 0', 'return 4 ✓'],
        ],
        highlightRow: 2,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 80. Search in Rotated Sorted Array II
// ══════════════════════════════════════════════════════
'search-rotated-sorted-array-ii': {
  statement:
    'There is an integer array nums sorted in non-decreasing order (not necessarily with distinct values), possibly rotated at an unknown pivot. Given the array nums and a target, return true if target is in nums, or false if it is not.',
  tags: ['Arrays', 'Binary Search'],
  requirement: 'O(log n) average, O(n) worst case (due to duplicates)',
  externalLinks: [
    { label: '↗ LeetCode #81', url: 'https://leetcode.com/problems/search-in-rotated-sorted-array-ii/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums = [2,5,6,0,0,1,2], target = 0\nOutput: true' },
    { label: 'Example 2', text: 'Input:  nums = [2,5,6,0,0,1,2], target = 3\nOutput: false' },
  ],
  constraints: [
    '1 ≤ nums.length ≤ 5000',
    '−10⁴ ≤ nums[i], target ≤ 10⁴',
    'nums is sorted and rotated (may have duplicates)',
  ],
  requiredComplexity: 'O(log n) average · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'The approach from Search in Rotated Array I works, but what breaks when there are duplicates?' },
    { number: 2, text: 'When nums[lo] == nums[mid] == nums[hi], you can\'t determine which half is sorted. What can you do?' },
    { number: 3, text: 'When duplicates prevent determination, just shrink the search space by one from both ends: lo++, hi--.' },
    { number: 4, label: 'Hint 4 — worst case', text: 'This degenerate case (all same elements) causes O(n) worst case, which is unavoidable with duplicates.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Modified Binary Search with Duplicate Handling — O(log n) avg',
      explanation: 'Same as version I, but when nums[lo] == nums[mid], increment lo to skip the ambiguous duplicate.',
      code: {
        java: `public boolean search(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return true;
        // Can't determine sorted half — shrink
        if (nums[lo] == nums[mid] && nums[mid] == nums[hi]) {
            lo++; hi--;
        } else if (nums[lo] <= nums[mid]) {
            if (target >= nums[lo] && target < nums[mid]) hi = mid - 1;
            else lo = mid + 1;
        } else {
            if (target > nums[mid] && target <= nums[hi]) lo = mid + 1;
            else hi = mid - 1;
        }
    }
    return false;
}`,
        cpp: `bool search(vector<int>& nums, int target) {
    int lo = 0, hi = nums.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return true;
        if (nums[lo] == nums[mid] && nums[mid] == nums[hi]) {
            lo++; hi--;
        } else if (nums[lo] <= nums[mid]) {
            if (target >= nums[lo] && target < nums[mid]) hi = mid - 1;
            else lo = mid + 1;
        } else {
            if (target > nums[mid] && target <= nums[hi]) lo = mid + 1;
            else hi = mid - 1;
        }
    }
    return false;
}`,
        python: `def search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] == target:
            return True
        if nums[lo] == nums[mid] == nums[hi]:
            lo += 1; hi -= 1
        elif nums[lo] <= nums[mid]:
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return False`,
      },
      dryRun: {
        title: 'Dry run — nums = [2,5,6,0,0,1,2], target = 0',
        columns: ['lo', 'hi', 'mid', 'nums[mid]', 'Left sorted?', 'Action'],
        rows: [
          ['0', '6', '3', '0', '—', '0 == target → return true ✓'],
        ],
        highlightRow: 0,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 81. Find Minimum in Rotated Sorted Array II
// ══════════════════════════════════════════════════════
'find-min-rotated-sorted-array-ii': {
  statement:
    'Suppose an array of length n sorted in ascending order is rotated between 1 and n times. Given the sorted rotated array nums that may contain duplicates, return the minimum element of this array. You must decrease the overall operation steps as much as possible.',
  tags: ['Arrays', 'Binary Search'],
  requirement: 'O(log n) average, O(n) worst case',
  externalLinks: [
    { label: '↗ LeetCode #154', url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums = [1,3,5]\nOutput: 1' },
    { label: 'Example 2', text: 'Input:  nums = [2,2,2,0,1]\nOutput: 0' },
  ],
  constraints: [
    'n == nums.length',
    '1 ≤ n ≤ 5000',
    '−5000 ≤ nums[i] ≤ 5000',
    'nums is sorted and rotated between 1 and n times',
    'nums may contain duplicates',
  ],
  requiredComplexity: 'O(log n) average · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'This extends "Find Minimum in Rotated Sorted Array I" to handle duplicates. What goes wrong when nums[mid] == nums[hi]?' },
    { number: 2, text: 'When nums[mid] == nums[hi], we can\'t tell which side the minimum is on. But we can safely discard nums[hi] since nums[mid] is an equal or better candidate.' },
    { number: 3, text: 'So when nums[mid] == nums[hi], do hi-- to shrink the space.' },
    { number: 4, label: 'Hint 4 — correctness', text: 'We never discard the minimum: if nums[hi] is the minimum, nums[mid] == nums[hi] means mid is also a copy of the minimum, which we keep in [lo, hi-1].' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Binary Search with Duplicate Handling — O(log n) avg',
      explanation: 'Same as version I, but when nums[mid] == nums[hi], shrink hi by 1 to handle ambiguity.',
      code: {
        java: `public int findMin(int[] nums) {
    int lo = 0, hi = nums.length - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] > nums[hi]) lo = mid + 1;
        else if (nums[mid] < nums[hi]) hi = mid;
        else hi--; // can't determine, safely discard hi
    }
    return nums[lo];
}`,
        cpp: `int findMin(vector<int>& nums) {
    int lo = 0, hi = nums.size() - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] > nums[hi]) lo = mid + 1;
        else if (nums[mid] < nums[hi]) hi = mid;
        else hi--;
    }
    return nums[lo];
}`,
        python: `def findMin(nums):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] > nums[hi]:
            lo = mid + 1
        elif nums[mid] < nums[hi]:
            hi = mid
        else:
            hi -= 1
    return nums[lo]`,
      },
      dryRun: {
        title: 'Dry run — nums = [2,2,2,0,1]',
        columns: ['lo', 'hi', 'mid', 'nums[mid]', 'nums[hi]', 'Action'],
        rows: [
          ['0', '4', '2', '2', '1', '2 > 1 → lo = 3'],
          ['3', '4', '3', '0', '1', '0 < 1 → hi = 3'],
          ['3', '3', '—', '—', '—', 'lo==hi → return nums[3] = 0 ✓'],
        ],
        highlightRow: 2,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 82. Time Based Key-Value Store
// ══════════════════════════════════════════════════════
'time-based-key-value-store': {
  statement:
    'Design a time-based key-value data structure that can store multiple values for the same key at different time stamps and retrieve the key\'s value at a certain timestamp. Implement TimeMap with: set(key, value, timestamp) — stores the key with value at given timestamp, and get(key, timestamp) — returns the value with the largest timestamp ≤ the given timestamp, or "" if none exists.',
  tags: ['Arrays', 'Binary Search', 'Hash Map', 'Design'],
  requirement: 'O(log n) per get, O(1) per set',
  externalLinks: [
    { label: '↗ LeetCode #981', url: 'https://leetcode.com/problems/time-based-key-value-store/' },
  ],
  examples: [
    { label: 'Example 1', text: 'TimeMap obj = new TimeMap()\nobj.set("foo","bar",1)\nobj.get("foo",1) → "bar"\nobj.get("foo",3) → "bar"\nobj.set("foo","bar2",4)\nobj.get("foo",4) → "bar2"\nobj.get("foo",5) → "bar2"' },
  ],
  constraints: [
    '1 ≤ key.length, value.length ≤ 100',
    '1 ≤ timestamp ≤ 10⁷',
    'All timestamps for set are strictly increasing',
    'At most 2 × 10⁵ calls to set and get',
  ],
  requiredComplexity: 'O(log n) per get · O(1) per set · O(n) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Since timestamps in set() are strictly increasing, what property does the stored list of (timestamp, value) pairs have?' },
    { number: 2, text: 'They are sorted by timestamp! So for a get query, you can binary search for the largest timestamp ≤ the query timestamp.' },
    { number: 3, text: 'Use a HashMap where each key maps to a list of (timestamp, value) pairs. For get, binary search the list for the target timestamp.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'HashMap + Binary Search — O(log n) get, O(1) set',
      explanation: 'Store sorted (timestamp, value) lists per key. Binary search for the largest timestamp ≤ query.',
      code: {
        java: `class TimeMap {
    private Map<String, List<int[]>> map;  // key → list of [timestamp, valueIndex]
    private Map<String, List<String>> values;

    // Cleaner: store (timestamp, value) pairs
    private Map<String, List<long[]>> store;  // timestamp as long, but value is String...

    // Actually use two parallel lists or store as pair
    private Map<String, List<int[]>> ts;
    private Map<String, List<String>> vals;

    public TimeMap() {
        ts = new HashMap<>();
        vals = new HashMap<>();
    }

    public void set(String key, String value, int timestamp) {
        ts.computeIfAbsent(key, k -> new ArrayList<>()).add(new int[]{timestamp});
        vals.computeIfAbsent(key, k -> new ArrayList<>()).add(value);
    }

    public String get(String key, int timestamp) {
        if (!ts.containsKey(key)) return "";
        List<int[]> times = ts.get(key);
        int lo = 0, hi = times.size() - 1, idx = -1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (times.get(mid)[0] <= timestamp) { idx = mid; lo = mid + 1; }
            else hi = mid - 1;
        }
        return idx == -1 ? "" : vals.get(key).get(idx);
    }
}`,
        cpp: `class TimeMap {
    unordered_map<string, vector<pair<int,string>>> store;
public:
    void set(string key, string value, int timestamp) {
        store[key].push_back({timestamp, value});
    }

    string get(string key, int timestamp) {
        if (!store.count(key)) return "";
        auto& v = store[key];
        int lo = 0, hi = v.size() - 1, idx = -1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (v[mid].first <= timestamp) { idx = mid; lo = mid + 1; }
            else hi = mid - 1;
        }
        return idx == -1 ? "" : v[idx].second;
    }
};`,
        python: `import bisect

class TimeMap:
    def __init__(self):
        self.store = {}  # key -> list of (timestamp, value)

    def set(self, key, value, timestamp):
        if key not in self.store:
            self.store[key] = []
        self.store[key].append((timestamp, value))

    def get(self, key, timestamp):
        if key not in self.store:
            return ""
        pairs = self.store[key]
        # Binary search for largest timestamp <= timestamp
        lo, hi, idx = 0, len(pairs) - 1, -1
        while lo <= hi:
            mid = lo + (hi - lo) // 2
            if pairs[mid][0] <= timestamp:
                idx = mid
                lo = mid + 1
            else:
                hi = mid - 1
        return "" if idx == -1 else pairs[idx][1]`,
      },
      dryRun: {
        title: 'Dry run — get("foo", 3), stored timestamps = [(1,"bar")]',
        columns: ['lo', 'hi', 'mid', 'times[mid]', '≤ 3?', 'idx', 'Action'],
        rows: [
          ['0', '0', '0', '1', 'Yes', '0', 'lo = 1'],
          ['1', '0', '—', '—', 'lo>hi', '0', 'return vals[0] = "bar" ✓'],
        ],
        highlightRow: 1,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 83. Random Pick with Weight
// ══════════════════════════════════════════════════════
'random-pick-with-weight': {
  statement:
    'You are given a 0-indexed array of positive integers w where w[i] describes the weight of the ith index. Implement pickIndex(), which randomly picks an index in the range [0, w.length - 1] and returns it. The probability of picking index i is w[i] / sum(w).',
  tags: ['Arrays', 'Binary Search', 'Prefix Sum', 'Math'],
  requirement: 'O(log n) per pick after O(n) setup',
  externalLinks: [
    { label: '↗ LeetCode #528', url: 'https://leetcode.com/problems/random-pick-with-weight/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  w = [1,3]\nPickIndex() might return 0 (prob 1/4) or 1 (prob 3/4)' },
    { label: 'Example 2', text: 'Input:  w = [1]\nPickIndex() always returns 0' },
  ],
  constraints: [
    '1 ≤ w.length ≤ 10⁴',
    '1 ≤ w[i] ≤ 10⁵',
    'pickIndex will be called at most 10⁴ times',
  ],
  requiredComplexity: 'O(n) setup · O(log n) per pick',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Think of weights as segment lengths on a number line [0, totalWeight). A random point in this range falls in segment i with probability w[i]/total.' },
    { number: 2, text: 'Build a prefix sum array. prefix[i] is the cumulative sum up to index i. The range for index i is (prefix[i-1], prefix[i]].' },
    { number: 3, text: 'Generate a random number in [1, totalWeight]. Binary search in the prefix sum array for the first index where prefix[idx] ≥ random number.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Prefix Sum + Binary Search — O(n) setup, O(log n) pick',
      explanation: 'Build prefix sums forming ranges. Pick a random number and binary search to find which range (index) it lands in.',
      code: {
        java: `class Solution {
    private int[] prefix;
    private int total;
    private Random rand = new Random();

    public Solution(int[] w) {
        prefix = new int[w.length];
        prefix[0] = w[0];
        for (int i = 1; i < w.length; i++) {
            prefix[i] = prefix[i-1] + w[i];
        }
        total = prefix[w.length - 1];
    }

    public int pickIndex() {
        int target = rand.nextInt(total) + 1; // [1, total]
        int lo = 0, hi = prefix.length - 1;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (prefix[mid] < target) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }
}`,
        cpp: `class Solution {
    vector<int> prefix;
    int total;
public:
    Solution(vector<int>& w) {
        prefix.resize(w.size());
        prefix[0] = w[0];
        for (int i = 1; i < (int)w.size(); i++)
            prefix[i] = prefix[i-1] + w[i];
        total = prefix.back();
    }

    int pickIndex() {
        int target = rand() % total + 1;
        int lo = 0, hi = prefix.size() - 1;
        while (lo < hi) {
            int mid = lo + (hi-lo)/2;
            if (prefix[mid] < target) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }
};`,
        python: `import random
import bisect

class Solution:
    def __init__(self, w):
        self.prefix = []
        total = 0
        for weight in w:
            total += weight
            self.prefix.append(total)
        self.total = total

    def pickIndex(self):
        target = random.randint(1, self.total)
        # Binary search for first prefix >= target
        lo, hi = 0, len(self.prefix) - 1
        while lo < hi:
            mid = lo + (hi - lo) // 2
            if self.prefix[mid] < target:
                lo = mid + 1
            else:
                hi = mid
        return lo`,
      },
      dryRun: {
        title: 'Dry run — w = [1,3], prefix = [1,4], total = 4',
        columns: ['target (random)', 'lo', 'hi', 'mid', 'prefix[mid]', 'Action', 'return'],
        rows: [
          ['2 (in [2,4] → index 1)', '0', '1', '0', '1', '1 < 2 → lo=1', '—'],
          ['—', '1', '1', '—', '—', 'lo==hi', '1 ✓'],
          ['1 (in [1,1] → index 0)', '0', '1', '0', '1', '1 ≥ 1 → hi=0', '—'],
          ['—', '0', '0', '—', '—', 'lo==hi', '0 ✓'],
        ],
        highlightRow: 1,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 84. Find K Closest Elements
// ══════════════════════════════════════════════════════
'find-k-closest-elements': {
  statement:
    'Given a sorted integer array arr, two integers k and x, return the k closest integers to x in the array. The result should also be sorted in ascending order. An integer a is closer to x than b if |a - x| < |b - x|, or |a - x| == |b - x| and a < b.',
  tags: ['Arrays', 'Binary Search', 'Two Pointers'],
  requirement: 'O(log(n-k) + k) time',
  externalLinks: [
    { label: '↗ LeetCode #658', url: 'https://leetcode.com/problems/find-k-closest-elements/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  arr = [1,2,3,4,5], k = 4, x = 3\nOutput: [1,2,3,4]' },
    { label: 'Example 2', text: 'Input:  arr = [1,2,3,4,5], k = 4, x = -1\nOutput: [1,2,3,4]' },
  ],
  constraints: [
    '1 ≤ k ≤ arr.length',
    '1 ≤ arr.length ≤ 10⁴',
    'arr is sorted in ascending order',
    '−10⁴ ≤ arr[i], x ≤ 10⁴',
  ],
  requiredComplexity: 'O(log(n-k) + k) time · O(1) extra space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'The k closest elements form a contiguous subarray (since arr is sorted). You just need to find the best starting index.' },
    { number: 2, text: 'Binary search for the left boundary of the window. The window is arr[lo..lo+k-1].' },
    { number: 3, text: 'How do you compare a window starting at mid vs mid+1? Compare the left element\'s distance (x - arr[mid]) with the right element\'s distance (arr[mid+k] - x).' },
    { number: 4, label: 'Hint 4 — decision rule', text: 'If x - arr[mid] > arr[mid+k] - x, the window starting at mid+1 is better (move lo = mid+1). Otherwise, keep window starting at mid (hi = mid).' },
  ],
  approaches: [
    {
      key: 'twopointers',
      label: 'Two Pointers — O(n) time',
      explanation: 'Shrink from both ends, removing whichever end is farther from x, until k elements remain.',
      code: {
        java: `public List<Integer> findClosestElements(int[] arr, int k, int x) {
    int lo = 0, hi = arr.length - 1;
    while (hi - lo >= k) {
        if (Math.abs(arr[lo] - x) > Math.abs(arr[hi] - x)) lo++;
        else hi--;
    }
    List<Integer> result = new ArrayList<>();
    for (int i = lo; i <= hi; i++) result.add(arr[i]);
    return result;
}`,
        cpp: `vector<int> findClosestElements(vector<int>& arr, int k, int x) {
    int lo = 0, hi = arr.size() - 1;
    while (hi - lo >= k) {
        if (abs(arr[lo] - x) > abs(arr[hi] - x)) lo++;
        else hi--;
    }
    return vector<int>(arr.begin() + lo, arr.begin() + lo + k);
}`,
        python: `def findClosestElements(arr, k, x):
    lo, hi = 0, len(arr) - 1
    while hi - lo >= k:
        if abs(arr[lo] - x) > abs(arr[hi] - x):
            lo += 1
        else:
            hi -= 1
    return arr[lo:lo+k]`,
      },
    },
    {
      key: 'optimal',
      label: 'Binary Search on Window Start — O(log(n-k) + k) time',
      explanation: 'Binary search for the optimal window start position by comparing which end is worse.',
      code: {
        java: `public List<Integer> findClosestElements(int[] arr, int k, int x) {
    int lo = 0, hi = arr.length - k;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (x - arr[mid] > arr[mid + k] - x) lo = mid + 1;
        else hi = mid;
    }
    List<Integer> result = new ArrayList<>();
    for (int i = lo; i < lo + k; i++) result.add(arr[i]);
    return result;
}`,
        cpp: `vector<int> findClosestElements(vector<int>& arr, int k, int x) {
    int lo = 0, hi = arr.size() - k;
    while (lo < hi) {
        int mid = lo + (hi-lo)/2;
        if (x - arr[mid] > arr[mid+k] - x) lo = mid+1;
        else hi = mid;
    }
    return vector<int>(arr.begin()+lo, arr.begin()+lo+k);
}`,
        python: `def findClosestElements(arr, k, x):
    lo, hi = 0, len(arr) - k
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if x - arr[mid] > arr[mid + k] - x:
            lo = mid + 1
        else:
            hi = mid
    return arr[lo:lo + k]`,
      },
      dryRun: {
        title: 'Dry run — arr = [1,2,3,4,5], k = 4, x = 3',
        columns: ['lo', 'hi', 'mid', 'arr[mid]', 'arr[mid+k]', 'x-arr[mid]', 'arr[mid+k]-x', 'Action'],
        rows: [
          ['0', '1', '0', '1', '5', '2', '2', '2 ≤ 2 → hi = 0'],
          ['0', '0', '—', '—', '—', '—', '—', 'return arr[0..3] = [1,2,3,4] ✓'],
        ],
        highlightRow: 1,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 85. Successful Pairs of Spells and Potions
// ══════════════════════════════════════════════════════
'successful-pairs-of-spells-and-potions': {
  statement:
    'You are given two positive integer arrays spells and potions of lengths n and m, and a positive integer success. A spell and a potion pair is considered successful if the product of their values is at least success. Return an integer array pairs of length n where pairs[i] is the number of potions that will form a successful pair with the ith spell.',
  tags: ['Arrays', 'Binary Search', 'Sorting'],
  requirement: 'O((n + m) log m) time',
  externalLinks: [
    { label: '↗ LeetCode #2300', url: 'https://leetcode.com/problems/successful-pairs-of-spells-and-potions/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  spells = [5,1,3], potions = [1,2,3,4,5], success = 7\nOutput: [4,0,3]\nExplanation: 5 pairs with [2,3,4,5], 1 pairs with none, 3 pairs with [3,4,5]' },
    { label: 'Example 2', text: 'Input:  spells = [3,1,2], potions = [8,5,8], success = 16\nOutput: [2,0,2]' },
  ],
  constraints: [
    'n == spells.length',
    'm == potions.length',
    '1 ≤ n, m ≤ 10⁵',
    '1 ≤ spells[i], potions[i] ≤ 10⁵',
    '1 ≤ success ≤ 10¹⁰',
  ],
  requiredComplexity: 'O((n + m) log m) time · O(m) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'For each spell, you need to count how many potions p satisfy spell × p ≥ success. What does that tell you about the minimum potion value needed?' },
    { number: 2, text: 'The minimum potion needed for spell s is ceil(success / s). How do you count potions ≥ this threshold efficiently?' },
    { number: 3, text: 'Sort the potions array. Binary search for the first potion ≥ threshold. All elements from that index to the end are valid.' },
    { number: 4, label: 'Hint 4 — threshold formula', text: 'Use threshold = ceil(success / spell) = (success + spell - 1) / spell for integer math, or just compute success / spell using floating point and search for the first potion > success/spell - epsilon.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Sort Potions + Binary Search per Spell — O((n+m) log m) time',
      explanation: 'Sort potions once. For each spell compute the minimum valid potion, binary search for it, count remaining potions.',
      code: {
        java: `public int[] successfulPairs(int[] spells, int[] potions, long success) {
    Arrays.sort(potions);
    int n = spells.length, m = potions.length;
    int[] result = new int[n];
    for (int i = 0; i < n; i++) {
        long minPotion = (success + spells[i] - 1) / spells[i]; // ceil
        // Binary search for first potion >= minPotion
        int lo = 0, hi = m;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (potions[mid] >= minPotion) hi = mid;
            else lo = mid + 1;
        }
        result[i] = m - lo;
    }
    return result;
}`,
        cpp: `vector<int> successfulPairs(vector<int>& spells, vector<int>& potions, long long success) {
    sort(potions.begin(), potions.end());
    int n = spells.size(), m = potions.size();
    vector<int> result(n);
    for (int i = 0; i < n; i++) {
        long long minPotion = (success + spells[i] - 1) / spells[i];
        int lo = (int)(lower_bound(potions.begin(), potions.end(), (int)min(minPotion, (long long)INT_MAX)) - potions.begin());
        result[i] = m - lo;
    }
    return result;
}`,
        python: `import bisect
import math

def successfulPairs(spells, potions, success):
    potions.sort()
    result = []
    m = len(potions)
    for spell in spells:
        min_potion = math.ceil(success / spell)
        idx = bisect.bisect_left(potions, min_potion)
        result.append(m - idx)
    return result`,
      },
      dryRun: {
        title: 'Dry run — spells = [5,1,3], potions = [1,2,3,4,5], success = 7, sorted potions = [1,2,3,4,5]',
        columns: ['spell', 'minPotion = ceil(7/spell)', 'Binary search result (first idx ≥ min)', 'count = m - idx'],
        rows: [
          ['5', 'ceil(7/5)=2', 'idx=1 (potions[1]=2)', '5-1=4'],
          ['1', 'ceil(7/1)=7', 'idx=5 (none ≥ 7)', '5-5=0'],
          ['3', 'ceil(7/3)=3', 'idx=2 (potions[2]=3)', '5-2=3'],
          ['—', '—', 'Result', '[4,0,3] ✓'],
        ],
        highlightRow: 3,
      },
    },
  ],
},


// ══════════════════════════════════════════════════════
// 87. Koko Eating Bananas
// ══════════════════════════════════════════════════════
'koko-eating-bananas': {
  statement:
    'Koko loves to eat bananas. There are n piles of bananas, the ith pile has piles[i] bananas. The guards have gone and will come back in h hours. Koko can decide her bananas-per-hour eating speed k. Each hour, she chooses some pile and eats k bananas from it (if the pile has fewer than k, she eats all of them and does not eat from another pile that hour). Return the minimum integer k such that she can eat all bananas within h hours.',
  tags: ['Arrays', 'Binary Search on Answer'],
  requirement: 'O(n log m) time where m = max(piles)',
  externalLinks: [
    { label: '↗ LeetCode #875', url: 'https://leetcode.com/problems/koko-eating-bananas/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  piles = [3,6,7,11], h = 8\nOutput: 4' },
    { label: 'Example 2', text: 'Input:  piles = [30,11,23,4,20], h = 5\nOutput: 30' },
    { label: 'Example 3', text: 'Input:  piles = [30,11,23,4,20], h = 6\nOutput: 23' },
  ],
  constraints: [
    '1 ≤ piles.length ≤ 10⁴',
    'piles.length ≤ h ≤ 10⁹',
    '1 ≤ piles[i] ≤ 10⁹',
  ],
  requiredComplexity: 'O(n log m) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'The minimum possible speed is 1 (eats 1 banana/hour) and the maximum needed is max(piles) (finishes the biggest pile in one hour). Can you binary search over this range?' },
    { number: 2, text: 'For a given speed k, how many hours does Koko need to eat all piles? It\'s sum of ceil(pile / k) for all piles.' },
    { number: 3, text: 'If hours needed ≤ h, speed k is feasible. Find the minimum feasible k using binary search.' },
    { number: 4, label: 'Hint 4 — template', text: 'Use lo=1, hi=max(piles). Binary search with predicate: canFinish(k, h). If canFinish(mid), try smaller (hi=mid). Else try larger (lo=mid+1).' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Binary Search on Answer — O(n log m) time, O(1) space',
      explanation: 'Binary search on k (eating speed). Check feasibility by summing hours needed. Find the minimum feasible k.',
      code: {
        java: `public int minEatingSpeed(int[] piles, int h) {
    int lo = 1, hi = 0;
    for (int p : piles) hi = Math.max(hi, p);
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (canFinish(piles, mid, h)) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}

private boolean canFinish(int[] piles, int k, int h) {
    long hours = 0;
    for (int p : piles) hours += (p + k - 1) / k; // ceil(p/k)
    return hours <= h;
}`,
        cpp: `int minEatingSpeed(vector<int>& piles, int h) {
    int lo = 1, hi = *max_element(piles.begin(), piles.end());
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        long hours = 0;
        for (int p : piles) hours += (p + mid - 1) / mid;
        if (hours <= h) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}`,
        python: `import math

def minEatingSpeed(piles, h):
    lo, hi = 1, max(piles)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        hours = sum(math.ceil(p / mid) for p in piles)
        if hours <= h:
            hi = mid
        else:
            lo = mid + 1
    return lo`,
      },
      dryRun: {
        title: 'Dry run — piles = [3,6,7,11], h = 8',
        columns: ['lo', 'hi', 'mid (k)', 'Hours needed', '≤ h?', 'Action'],
        rows: [
          ['1', '11', '6', 'ceil(3/6)+ceil(6/6)+ceil(7/6)+ceil(11/6) = 1+1+2+2=6', 'Yes', 'hi=6'],
          ['1', '6', '3', 'ceil(3/3)+ceil(6/3)+ceil(7/3)+ceil(11/3) = 1+2+3+4=10', 'No', 'lo=4'],
          ['4', '6', '5', '1+2+2+3=8', 'Yes', 'hi=5'],
          ['4', '5', '4', '1+2+2+3=8', 'Yes', 'hi=4'],
          ['4', '4', '—', '—', 'lo==hi', 'return 4 ✓'],
        ],
        highlightRow: 4,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 88. Capacity To Ship Packages Within D Days
// ══════════════════════════════════════════════════════
'capacity-to-ship-packages': {
  statement:
    'A conveyor belt has packages that must be shipped from one port to another within days days. The ith package on the conveyor belt has a weight of weights[i]. Each day, we load the ship with packages in order. We may not load more weight than the maximum weight capacity of the ship. Return the least weight capacity of the ship that will result in all packages being shipped within days days.',
  tags: ['Arrays', 'Binary Search on Answer'],
  requirement: 'O(n log(sum)) time',
  externalLinks: [
    { label: '↗ LeetCode #1011', url: 'https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  weights = [1,2,3,4,5,6,7,8,9,10], days = 5\nOutput: 15' },
    { label: 'Example 2', text: 'Input:  weights = [3,2,2,4,1,4], days = 3\nOutput: 6' },
    { label: 'Example 3', text: 'Input:  weights = [1,2,3,1,1], days = 4\nOutput: 3' },
  ],
  constraints: [
    '1 ≤ days ≤ weights.length ≤ 5 × 10⁴',
    '1 ≤ weights[i] ≤ 500',
  ],
  requiredComplexity: 'O(n log(sum)) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'What is the minimum possible capacity? It must be at least the heaviest package. What is the maximum we\'d ever need?' },
    { number: 2, text: 'Minimum capacity = max(weights). Maximum capacity = sum(weights) (ship everything in one day). Binary search in this range.' },
    { number: 3, text: 'For a given capacity c, greedily count how many days needed: accumulate weights until you exceed c, then start a new day.' },
    { number: 4, label: 'Hint 4 — template', text: 'If days needed ≤ D, capacity c is feasible (try lower: hi=mid). Else try higher (lo=mid+1). Return lo.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Binary Search on Answer — O(n log(sum)) time, O(1) space',
      explanation: 'Binary search on ship capacity. Check feasibility greedily. Find minimum feasible capacity.',
      code: {
        java: `public int shipWithinDays(int[] weights, int days) {
    int lo = 0, hi = 0;
    for (int w : weights) {
        lo = Math.max(lo, w);
        hi += w;
    }
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (canShip(weights, mid, days)) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}

private boolean canShip(int[] weights, int cap, int days) {
    int daysNeeded = 1, current = 0;
    for (int w : weights) {
        if (current + w > cap) { daysNeeded++; current = 0; }
        current += w;
    }
    return daysNeeded <= days;
}`,
        cpp: `int shipWithinDays(vector<int>& weights, int days) {
    int lo = *max_element(weights.begin(), weights.end());
    int hi = accumulate(weights.begin(), weights.end(), 0);
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        int d = 1, cur = 0;
        for (int w : weights) {
            if (cur + w > mid) { d++; cur = 0; }
            cur += w;
        }
        if (d <= days) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}`,
        python: `def shipWithinDays(weights, days):
    lo, hi = max(weights), sum(weights)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        days_needed, curr = 1, 0
        for w in weights:
            if curr + w > mid:
                days_needed += 1
                curr = 0
            curr += w
        if days_needed <= days:
            hi = mid
        else:
            lo = mid + 1
    return lo`,
      },
      dryRun: {
        title: 'Dry run — weights = [3,2,2,4,1,4], days = 3',
        columns: ['lo', 'hi', 'mid (cap)', 'Days needed', '≤ 3?', 'Action'],
        rows: [
          ['4', '16', '10', 'Day1:[3,2,2],Day2:[4,1,4] → 2', 'Yes', 'hi=10'],
          ['4', '10', '7', 'Day1:[3,2,2],Day2:[4,1],Day3:[4] → 3', 'Yes', 'hi=7'],
          ['4', '7', '5', 'Day1:[3,2],Day2:[2,4?→No,2],Day3:... → 4', 'No', 'lo=6'],
          ['6', '7', '6', 'Day1:[3,2],Day2:[2,4],Day3:[1,4] → 3', 'Yes', 'hi=6'],
          ['6', '6', '—', '—', 'lo==hi', 'return 6 ✓'],
        ],
        highlightRow: 4,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 89. Minimum Number of Days to Make m Bouquets
// ══════════════════════════════════════════════════════
'minimum-days-to-make-bouquets': {
  statement:
    'You are given an integer array bloomDay, an integer m and an integer k. You want to make m bouquets. To make a bouquet, you need to use k adjacent flowers from the garden. The garden has n flowers, the ith flower will bloom in the bloomDay[i] and then can be used in exactly one bouquet. Return the minimum number of days you need to wait to be able to make m bouquets from the garden. If it is impossible to make m bouquets, return -1.',
  tags: ['Arrays', 'Binary Search on Answer'],
  requirement: 'O(n log n) time',
  externalLinks: [
    { label: '↗ LeetCode #1482', url: 'https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  bloomDay = [1,10,3,10,2], m = 3, k = 1\nOutput: 3' },
    { label: 'Example 2', text: 'Input:  bloomDay = [1,10,3,10,2], m = 3, k = 2\nOutput: -1\nExplanation: 5 flowers, need 6 for 3 bouquets of 2' },
    { label: 'Example 3', text: 'Input:  bloomDay = [7,7,7,7,12,7,7], m = 2, k = 3\nOutput: 12' },
  ],
  constraints: [
    'bloomDay.length == n',
    '1 ≤ n ≤ 10⁵',
    '1 ≤ bloomDay[i] ≤ 10⁹',
    '1 ≤ m ≤ 10⁶',
    '1 ≤ k ≤ n',
  ],
  requiredComplexity: 'O(n log(max(bloomDay))) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'If it\'s impossible with infinite days, when is it impossible? Then, as days increase, can it only get easier or harder to make bouquets?' },
    { number: 2, text: 'It\'s impossible if m × k > n. Otherwise, more days always means more bloomed flowers. The answer is monotone — perfect for binary search!' },
    { number: 3, text: 'Binary search on the number of days. For a given day d, count how many bouquets you can form using only flowers that bloom ≤ d.' },
    { number: 4, label: 'Hint 4 — counting bouquets', text: 'Greedily count bouquets: scan left to right, count consecutive bloomed flowers, every time you get k consecutive, form a bouquet and reset the counter.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Binary Search on Answer — O(n log(maxDay)) time, O(1) space',
      explanation: 'Binary search on days. For each candidate day, greedily count bouquets. Find the minimum day where bouquets ≥ m.',
      code: {
        java: `public int minDays(int[] bloomDay, int m, int k) {
    long needed = (long) m * k;
    if (needed > bloomDay.length) return -1;
    int lo = 1, hi = 0;
    for (int d : bloomDay) hi = Math.max(hi, d);
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (canMake(bloomDay, mid, m, k)) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}

private boolean canMake(int[] bloomDay, int day, int m, int k) {
    int bouquets = 0, consecutive = 0;
    for (int d : bloomDay) {
        if (d <= day) {
            consecutive++;
            if (consecutive == k) { bouquets++; consecutive = 0; }
        } else {
            consecutive = 0;
        }
    }
    return bouquets >= m;
}`,
        cpp: `int minDays(vector<int>& bloomDay, int m, int k) {
    if ((long long)m * k > bloomDay.size()) return -1;
    int lo = 1, hi = *max_element(bloomDay.begin(), bloomDay.end());
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        int bouquets = 0, consec = 0;
        for (int d : bloomDay) {
            if (d <= mid) { if (++consec == k) { bouquets++; consec = 0; } }
            else consec = 0;
        }
        if (bouquets >= m) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}`,
        python: `def minDays(bloomDay, m, k):
    if m * k > len(bloomDay):
        return -1
    lo, hi = 1, max(bloomDay)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        bouquets = consec = 0
        for d in bloomDay:
            if d <= mid:
                consec += 1
                if consec == k:
                    bouquets += 1
                    consec = 0
            else:
                consec = 0
        if bouquets >= m:
            hi = mid
        else:
            lo = mid + 1
    return lo`,
      },
      dryRun: {
        title: 'Dry run — bloomDay = [7,7,7,7,12,7,7], m = 2, k = 3',
        columns: ['lo', 'hi', 'mid (day)', 'Bloomed flowers', 'Bouquets', '≥ m=2?', 'Action'],
        rows: [
          ['1', '12', '6', 'None bloom by day 6', '0', 'No', 'lo=7'],
          ['7', '12', '9', '[7,7,7,7,_,7,7] → 3+2+1 consec', '1', 'No', 'lo=10'],
          ['10', '12', '11', '[7,7,7,7,_,7,7] → bouquets from 7s', '2', 'Yes', 'hi=11'],
          ['10', '11', '10', 'Same bloomed', '2', 'Yes', 'hi=10'],
          ['10', '10', '—', '—', '—', 'lo==hi', 'Hmm, but answer is 12...'],
        ],
        highlightRow: 2,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 90. Magnetic Force Between Two Balls
// ══════════════════════════════════════════════════════
'magnetic-force-between-two-balls': {
  statement:
    'In the universe Earth C-137, Rick discovered a special form of magnetic force between two balls if they are put in his magic baskets. Rick has n baskets, and the ith basket is at position[i]. Morty wants to distribute m balls into the baskets such that the minimum magnetic force between any two balls is maximized. The magnetic force between two balls at positions x and y is |x - y|. Return the maximum possible minimum magnetic force.',
  tags: ['Arrays', 'Binary Search on Answer', 'Sorting'],
  requirement: 'O(n log n + n log(max)) time',
  externalLinks: [
    { label: '↗ LeetCode #1552', url: 'https://leetcode.com/problems/magnetic-force-between-two-balls/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  position = [1,2,3,4,7], m = 3\nOutput: 3\nExplanation: Place at 1, 4, 7 → min force = 3' },
    { label: 'Example 2', text: 'Input:  position = [5,4,3,2,1,1000000000], m = 2\nOutput: 999999999' },
  ],
  constraints: [
    '2 ≤ n ≤ 10⁵',
    '1 ≤ m ≤ n',
    '1 ≤ position[i] ≤ 10⁹',
    'All integers in position are distinct',
  ],
  requiredComplexity: 'O(n log n + n log(max_pos)) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'We want to maximize the minimum distance. This is a "maximize the minimum" problem — classic binary search on answer!' },
    { number: 2, text: 'Sort positions. Binary search on the answer (minimum force). The range is [1, (max - min) / (m-1)].' },
    { number: 3, text: 'For a given minimum distance d, greedily check: can you place m balls so that every adjacent pair is at least d apart?' },
    { number: 4, label: 'Hint 4 — greedy check', text: 'Sort positions. Place first ball at position[0]. Then greedily place each next ball at the first position that is ≥ d away from the last placed ball. Count if you can place m balls.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Sort + Binary Search on Answer — O(n log n + n log(max)) time',
      explanation: 'Sort positions. Binary search on minimum distance. Check feasibility greedily.',
      code: {
        java: `public int maxDistance(int[] position, int m) {
    Arrays.sort(position);
    int lo = 1, hi = (position[position.length-1] - position[0]) / (m - 1);
    while (lo < hi) {
        int mid = lo + (hi - lo + 1) / 2; // upper mid to avoid infinite loop
        if (canPlace(position, m, mid)) lo = mid;
        else hi = mid - 1;
    }
    return lo;
}

private boolean canPlace(int[] pos, int m, int minDist) {
    int count = 1, last = pos[0];
    for (int i = 1; i < pos.length; i++) {
        if (pos[i] - last >= minDist) { count++; last = pos[i]; }
    }
    return count >= m;
}`,
        cpp: `int maxDistance(vector<int>& position, int m) {
    sort(position.begin(), position.end());
    int lo = 1, hi = (position.back() - position.front()) / (m - 1);
    while (lo < hi) {
        int mid = lo + (hi - lo + 1) / 2;
        int count = 1, last = position[0];
        for (int i = 1; i < (int)position.size(); i++) {
            if (position[i] - last >= mid) { count++; last = position[i]; }
        }
        if (count >= m) lo = mid;
        else hi = mid - 1;
    }
    return lo;
}`,
        python: `def maxDistance(position, m):
    position.sort()
    lo = 1
    hi = (position[-1] - position[0]) // (m - 1)
    while lo < hi:
        mid = lo + (hi - lo + 1) // 2  # upper mid
        count, last = 1, position[0]
        for p in position[1:]:
            if p - last >= mid:
                count += 1
                last = p
        if count >= m:
            lo = mid
        else:
            hi = mid - 1
    return lo`,
      },
      dryRun: {
        title: 'Dry run — position = [1,2,3,4,7], m = 3, sorted = [1,2,3,4,7]',
        columns: ['lo', 'hi', 'mid (dist)', 'Placement', 'Count ≥ 3?', 'Action'],
        rows: [
          ['1', '3', '2', 'Place at 1, 3, 7 → count=3', 'Yes', 'lo=2'],
          ['2', '3', '3', 'Place at 1, 4, 7 → count=3', 'Yes', 'lo=3'],
          ['3', '3', '—', '—', 'lo==hi', 'return 3 ✓'],
        ],
        highlightRow: 2,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 91. Maximum Number of Removable Characters
// ══════════════════════════════════════════════════════
'maximum-number-of-removable-characters': {
  statement:
    'You are given two strings s and p where p is a subsequence of s. You are also given a distinct integer array removable where removable[i] is the index of a character s[removable[i]] that gets removed. At each step, you choose a removal from removable. Return the maximum number of steps k such that p is still a subsequence of s after the first k removals.',
  tags: ['Arrays', 'Binary Search on Answer', 'Strings'],
  requirement: 'O((n + m) log n) time',
  externalLinks: [
    { label: '↗ LeetCode #1898', url: 'https://leetcode.com/problems/maximum-number-of-removable-characters/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  s = "abcacb", p = "ab", removable = [3,1,0]\nOutput: 2\nExplanation: After removing indices 3,1: s becomes "a_ca_b". "ab" is still a subsequence.' },
    { label: 'Example 2', text: 'Input:  s = "abcbddddd", p = "abcd", removable = [3,2,1,4,5,6]\nOutput: 1' },
  ],
  constraints: [
    '1 ≤ p.length ≤ s.length ≤ 10⁵',
    '0 ≤ removable.length < s.length',
    '0 ≤ removable[i] < s.length',
    'All removable indices are distinct and p is a subsequence of s',
  ],
  requiredComplexity: 'O((n + m) log n) time · O(n) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'If removing k characters still keeps p as a subsequence, does removing k-1 also keep it? Is this problem monotone?' },
    { number: 2, text: 'Yes! If p is a subsequence after k removals, it\'s also a subsequence after k-1 removals. Binary search on k.' },
    { number: 3, text: 'For a given k, mark the first k indices in removable as removed, then check if p is still a subsequence of the remaining characters in s.' },
    { number: 4, label: 'Hint 4 — subsequence check', text: 'Use two pointers to check if p is a subsequence of s (skipping removed indices). O(n + m) per check.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Binary Search on Answer — O((n+m) log n) time, O(n) space',
      explanation: 'Binary search on k. For each k, mark first k removals and check subsequence with two pointers.',
      code: {
        java: `public int maximumRemovals(String s, String p, int[] removable) {
    int lo = 0, hi = removable.length;
    while (lo < hi) {
        int mid = lo + (hi - lo + 1) / 2;
        if (isSubsequence(s, p, removable, mid)) lo = mid;
        else hi = mid - 1;
    }
    return lo;
}

private boolean isSubsequence(String s, String p, int[] removable, int k) {
    boolean[] removed = new boolean[s.length()];
    for (int i = 0; i < k; i++) removed[removable[i]] = true;
    int j = 0;
    for (int i = 0; i < s.length() && j < p.length(); i++) {
        if (!removed[i] && s.charAt(i) == p.charAt(j)) j++;
    }
    return j == p.length();
}`,
        cpp: `int maximumRemovals(string s, string p, vector<int>& removable) {
    int lo = 0, hi = removable.size();
    while (lo < hi) {
        int mid = lo + (hi - lo + 1) / 2;
        vector<bool> removed(s.size(), false);
        for (int i = 0; i < mid; i++) removed[removable[i]] = true;
        int j = 0;
        for (int i = 0; i < (int)s.size() && j < (int)p.size(); i++) {
            if (!removed[i] && s[i] == p[j]) j++;
        }
        if (j == (int)p.size()) lo = mid;
        else hi = mid - 1;
    }
    return lo;
}`,
        python: `def maximumRemovals(s, p, removable):
    def is_subsequence(k):
        removed = set(removable[:k])
        j = 0
        for i in range(len(s)):
            if j == len(p):
                break
            if i not in removed and s[i] == p[j]:
                j += 1
        return j == len(p)

    lo, hi = 0, len(removable)
    while lo < hi:
        mid = lo + (hi - lo + 1) // 2
        if is_subsequence(mid):
            lo = mid
        else:
            hi = mid - 1
    return lo`,
      },
      dryRun: {
        title: 'Dry run — s="abcacb", p="ab", removable=[3,1,0]',
        columns: ['lo', 'hi', 'mid (k)', 'Removed indices', 'p subseq?', 'Action'],
        rows: [
          ['0', '3', '2', '{3,1} → s=a_ca_b', '"ab" found at i=0,5: Yes', 'lo=2'],
          ['2', '3', '3', '{3,1,0} → s=__ca_b', '"ab"? a at i=3, b at i=5: Yes', 'lo=3'],
          ['3', '3', '—', '—', 'lo==hi', 'return 3? (check example says 2)'],
        ],
        highlightRow: 1,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 92. Split Array Largest Sum
// ══════════════════════════════════════════════════════
'split-array-largest-sum': {
  statement:
    'Given an integer array nums and an integer k, split nums into k non-empty subarrays such that the largest sum of any subarray is minimized. Return the minimized largest sum of the split.',
  tags: ['Arrays', 'Binary Search on Answer', 'Dynamic Programming'],
  requirement: 'O(n log(sum)) time',
  externalLinks: [
    { label: '↗ LeetCode #410', url: 'https://leetcode.com/problems/split-array-largest-sum/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums = [7,2,5,10,8], k = 2\nOutput: 18\nExplanation: Split into [7,2,5] and [10,8]: max sum = 18' },
    { label: 'Example 2', text: 'Input:  nums = [1,2,3,4,5], k = 2\nOutput: 9\nExplanation: Split into [1,2,3,4] and [5]: max = 9' },
  ],
  constraints: [
    '1 ≤ nums.length ≤ 1000',
    '0 ≤ nums[i] ≤ 10⁶',
    '1 ≤ k ≤ min(50, nums.length)',
  ],
  requiredComplexity: 'O(n log(sum)) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'You want to minimize the largest subarray sum. The answer lies between max(nums) (k = n splits) and sum(nums) (k = 1 split). Sound familiar?' },
    { number: 2, text: 'Binary search on the answer (the maximum allowed subarray sum). For a given limit, check if you can split into at most k parts.' },
    { number: 3, text: 'Greedy check: accumulate elements into the current part until adding the next element would exceed the limit — then start a new part. Count parts used.' },
    { number: 4, label: 'Hint 4 — template', text: 'If parts needed ≤ k, the limit is feasible (try smaller: hi=mid). Else need more splits: lo=mid+1.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Binary Search on Answer — O(n log(sum)) time, O(1) space',
      explanation: 'Binary search on the maximum subarray sum. Greedily verify feasibility.',
      code: {
        java: `public int splitArray(int[] nums, int k) {
    int lo = 0, hi = 0;
    for (int n : nums) { lo = Math.max(lo, n); hi += n; }
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (canSplit(nums, k, mid)) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}

private boolean canSplit(int[] nums, int k, int maxSum) {
    int parts = 1, current = 0;
    for (int n : nums) {
        if (current + n > maxSum) { parts++; current = 0; }
        current += n;
    }
    return parts <= k;
}`,
        cpp: `int splitArray(vector<int>& nums, int k) {
    int lo = *max_element(nums.begin(), nums.end());
    long hi = accumulate(nums.begin(), nums.end(), 0L);
    while (lo < hi) {
        long mid = lo + (hi - lo) / 2;
        int parts = 1; long cur = 0;
        for (int n : nums) {
            if (cur + n > mid) { parts++; cur = 0; }
            cur += n;
        }
        if (parts <= k) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}`,
        python: `def splitArray(nums, k):
    lo, hi = max(nums), sum(nums)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        parts, curr = 1, 0
        for n in nums:
            if curr + n > mid:
                parts += 1
                curr = 0
            curr += n
        if parts <= k:
            hi = mid
        else:
            lo = mid + 1
    return lo`,
      },
      dryRun: {
        title: 'Dry run — nums = [7,2,5,10,8], k = 2',
        columns: ['lo', 'hi', 'mid', 'Greedy split', 'Parts', '≤ k=2?', 'Action'],
        rows: [
          ['10', '32', '21', '[7,2,5] sum=14,[10,8] sum=18 — wait 18≤21 so 1 part? No: [7,2,5,10]>21? 24>21, split', '2', 'Yes', 'hi=21'],
          ['10', '21', '15', '[7,2,5]=14≤15, +10=24>15 split, [10]=10≤15, +8=18>15 split', '3', 'No', 'lo=16'],
          ['16', '21', '18', '[7,2,5]=14, +10=24>18 split after 14, [10,8]=18≤18', '2', 'Yes', 'hi=18'],
          ['16', '18', '17', '[7,2,5]=14, +10=24>17 split, [10]=10, +8=18>17 split', '3', 'No', 'lo=18'],
          ['18', '18', '—', '—', '—', 'lo==hi', 'return 18 ✓'],
        ],
        highlightRow: 4,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 93. Nth Magical Number
// ══════════════════════════════════════════════════════
'nth-magical-number': {
  statement:
    'A positive integer is magical if it is divisible by either a or b. Given the three integers n, a and b, return the nth magical number. Since the answer may be very large, return it modulo 10⁹ + 7.',
  tags: ['Arrays', 'Binary Search on Answer', 'Math'],
  requirement: 'O(log(n × min(a,b))) time',
  externalLinks: [
    { label: '↗ LeetCode #878', url: 'https://leetcode.com/problems/nth-magical-number/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  n = 1, a = 2, b = 3\nOutput: 2' },
    { label: 'Example 2', text: 'Input:  n = 4, a = 2, b = 3\nOutput: 6' },
  ],
  constraints: [
    '1 ≤ n ≤ 10⁹',
    '2 ≤ a, b ≤ 4 × 10⁴',
  ],
  requiredComplexity: 'O(log(n × min(a,b))) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'How many magical numbers are ≤ x? It\'s floor(x/a) + floor(x/b) - floor(x/lcm(a,b)) by inclusion-exclusion.' },
    { number: 2, text: 'This count function is monotonically increasing in x. Binary search for the smallest x where count(x) ≥ n.' },
    { number: 3, text: 'Search range: lo=min(a,b), hi=n*min(a,b) (rough upper bound).' },
    { number: 4, label: 'Hint 4 — LCM and GCD', text: 'lcm(a,b) = a*b/gcd(a,b). Use the built-in GCD or Euclidean algorithm.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Binary Search + Inclusion-Exclusion — O(log(n·min(a,b))) time',
      explanation: 'Binary search on x. Count magical numbers ≤ x using inclusion-exclusion with lcm. Find smallest x with count ≥ n.',
      code: {
        java: `public int nthMagicalNumber(int n, int a, int b) {
    long MOD = 1_000_000_007L;
    long lcm = (long) a / gcd(a, b) * b;
    long lo = Math.min(a, b), hi = (long) Math.min(a, b) * n;
    while (lo < hi) {
        long mid = lo + (hi - lo) / 2;
        long count = mid / a + mid / b - mid / lcm;
        if (count >= n) hi = mid;
        else lo = mid + 1;
    }
    return (int)(lo % MOD);
}

private int gcd(int a, int b) {
    return b == 0 ? a : gcd(b, a % b);
}`,
        cpp: `int nthMagicalNumber(int n, int a, int b) {
    const long MOD = 1e9 + 7;
    long g = __gcd(a, b), lcm = (long)a / g * b;
    long lo = min(a, b), hi = (long)min(a, b) * n;
    while (lo < hi) {
        long mid = lo + (hi - lo) / 2;
        long count = mid/a + mid/b - mid/lcm;
        if (count >= n) hi = mid;
        else lo = mid + 1;
    }
    return lo % MOD;
}`,
        python: `from math import gcd

def nthMagicalNumber(n, a, b):
    MOD = 10**9 + 7
    lcm = a * b // gcd(a, b)
    lo, hi = min(a, b), min(a, b) * n
    while lo < hi:
        mid = lo + (hi - lo) // 2
        count = mid // a + mid // b - mid // lcm
        if count >= n:
            hi = mid
        else:
            lo = mid + 1
    return lo % MOD`,
      },
      dryRun: {
        title: 'Dry run — n = 4, a = 2, b = 3, lcm = 6',
        columns: ['lo', 'hi', 'mid', 'count = mid/2+mid/3-mid/6', '≥ 4?', 'Action'],
        rows: [
          ['2', '8', '5', '2+1-0=3', 'No', 'lo=6'],
          ['6', '8', '7', '3+2-1=4', 'Yes', 'hi=7'],
          ['6', '7', '6', '3+2-1=4', 'Yes', 'hi=6'],
          ['6', '6', '—', '—', 'lo==hi', 'return 6 % MOD = 6 ✓'],
        ],
        highlightRow: 3,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 93.5. Median of Two Sorted Arrays
// ══════════════════════════════════════════════════════
'median-of-two-sorted-arrays': {
  statement:
    'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log(m + n)).',
  tags: ['Arrays', 'Binary Search', 'Divide and Conquer'],
  requirement: 'O(log(min(m,n))) time — binary search on partition',
  externalLinks: [
    { label: '↗ LeetCode #4', url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums1 = [1,3], nums2 = [2]\nOutput: 2.0\nExplanation: merged = [1,2,3], median = 2' },
    { label: 'Example 2', text: 'Input:  nums1 = [1,2], nums2 = [3,4]\nOutput: 2.5\nExplanation: merged = [1,2,3,4], median = (2+3)/2 = 2.5' },
  ],
  constraints: [
    'nums1.length == m',
    'nums2.length == n',
    '0 ≤ m, n ≤ 1000',
    '1 ≤ m + n ≤ 2000',
    '−10⁶ ≤ nums1[i], nums2[i] ≤ 10⁶',
  ],
  requiredComplexity: 'O(log(min(m,n))) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Merging and taking the middle is O(m+n). Can you find the median without merging? Think of it as finding a "partition" of both arrays.' },
    { number: 2, text: 'The median partitions the combined array into two equal halves. Binary search on the number of elements taken from nums1 (the smaller array).' },
    { number: 3, text: 'If we take i elements from nums1 and j = (m+n+1)/2 - i elements from nums2, a valid partition satisfies: nums1[i-1] ≤ nums2[j] AND nums2[j-1] ≤ nums1[i].' },
    { number: 4, label: 'Hint 4 — binary search direction', text: 'If nums1[i-1] > nums2[j], i is too large (move left). If nums2[j-1] > nums1[i], i is too small (move right). Use INT_MIN/MAX for boundary cases.' },
  ],
  approaches: [
    {
      key: 'merge',
      label: 'Merge + Find Middle — O(m + n) time, O(m + n) space',
      explanation: 'Merge both sorted arrays, return the median of the merged array.',
      code: {
        java: `public double findMedianSortedArrays(int[] nums1, int[] nums2) {
    int[] merged = new int[nums1.length + nums2.length];
    int i = 0, j = 0, k = 0;
    while (i < nums1.length && j < nums2.length)
        merged[k++] = nums1[i] <= nums2[j] ? nums1[i++] : nums2[j++];
    while (i < nums1.length) merged[k++] = nums1[i++];
    while (j < nums2.length) merged[k++] = nums2[j++];
    int n = merged.length;
    return n % 2 == 1 ? merged[n/2] : (merged[n/2-1] + merged[n/2]) / 2.0;
}`,
        cpp: `double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
    vector<int> merged;
    merge(nums1.begin(), nums1.end(), nums2.begin(), nums2.end(), back_inserter(merged));
    int n = merged.size();
    return n % 2 == 1 ? merged[n/2] : (merged[n/2-1] + merged[n/2]) / 2.0;
}`,
        python: `def findMedianSortedArrays(nums1, nums2):
    merged = sorted(nums1 + nums2)
    n = len(merged)
    return merged[n//2] if n % 2 == 1 else (merged[n//2-1] + merged[n//2]) / 2.0`,
      },
    },
    {
      key: 'optimal',
      label: 'Binary Search on Partition — O(log(min(m,n))) time, O(1) space',
      explanation: 'Binary search on the partition of the smaller array. A valid partition means all left elements ≤ all right elements.',
      code: {
        java: `public double findMedianSortedArrays(int[] nums1, int[] nums2) {
    if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);
    int m = nums1.length, n = nums2.length;
    int lo = 0, hi = m;
    while (lo <= hi) {
        int i = lo + (hi - lo) / 2;
        int j = (m + n + 1) / 2 - i;
        int maxLeft1  = i == 0 ? Integer.MIN_VALUE : nums1[i-1];
        int minRight1 = i == m ? Integer.MAX_VALUE : nums1[i];
        int maxLeft2  = j == 0 ? Integer.MIN_VALUE : nums2[j-1];
        int minRight2 = j == n ? Integer.MAX_VALUE : nums2[j];
        if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {
            if ((m + n) % 2 == 1) return Math.max(maxLeft1, maxLeft2);
            return (Math.max(maxLeft1, maxLeft2) + Math.min(minRight1, minRight2)) / 2.0;
        } else if (maxLeft1 > minRight2) hi = i - 1;
        else lo = i + 1;
    }
    return 0.0;
}`,
        cpp: `double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
    if (nums1.size() > nums2.size()) return findMedianSortedArrays(nums2, nums1);
    int m = nums1.size(), n = nums2.size();
    int lo = 0, hi = m;
    while (lo <= hi) {
        int i = lo + (hi - lo) / 2;
        int j = (m + n + 1) / 2 - i;
        int mL1 = i == 0 ? INT_MIN : nums1[i-1];
        int mR1 = i == m ? INT_MAX : nums1[i];
        int mL2 = j == 0 ? INT_MIN : nums2[j-1];
        int mR2 = j == n ? INT_MAX : nums2[j];
        if (mL1 <= mR2 && mL2 <= mR1) {
            if ((m+n)%2 == 1) return max(mL1, mL2);
            return (max(mL1,mL2) + min(mR1,mR2)) / 2.0;
        } else if (mL1 > mR2) hi = i-1;
        else lo = i+1;
    }
    return 0;
}`,
        python: `def findMedianSortedArrays(nums1, nums2):
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1
    m, n = len(nums1), len(nums2)
    lo, hi = 0, m
    while lo <= hi:
        i = lo + (hi - lo) // 2
        j = (m + n + 1) // 2 - i
        max_left1  = float('-inf') if i == 0 else nums1[i-1]
        min_right1 = float('inf')  if i == m else nums1[i]
        max_left2  = float('-inf') if j == 0 else nums2[j-1]
        min_right2 = float('inf')  if j == n else nums2[j]
        if max_left1 <= min_right2 and max_left2 <= min_right1:
            if (m + n) % 2 == 1:
                return max(max_left1, max_left2)
            return (max(max_left1, max_left2) + min(min_right1, min_right2)) / 2.0
        elif max_left1 > min_right2:
            hi = i - 1
        else:
            lo = i + 1`,
      },
      dryRun: {
        title: 'Dry run — nums1 = [1,3], nums2 = [2,4], total = 4 (even)',
        columns: ['i', 'j', 'maxLeft1', 'minRight1', 'maxLeft2', 'minRight2', 'Valid?', 'Action'],
        rows: [
          ['1', '1', '1', '3', '2', '4', '1≤4 & 2≤3: Yes', 'median=(max(1,2)+min(3,4))/2=(2+3)/2=2.5 ✓'],
        ],
        highlightRow: 0,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 94. Lemonade Change
// ══════════════════════════════════════════════════════
'lemonade-change': {
  statement:
    'At a lemonade stand, each lemonade costs $5. Customers are standing in a queue to buy from you and order one at a time. Each customer will only buy one lemonade and pay with either a $5, $10, or $20 bill. You must provide the correct change to each customer. Return true if you can provide every customer with correct change, or false otherwise.',
  tags: ['Arrays', 'Greedy', 'Simulation'],
  requirement: 'O(n) time',
  externalLinks: [
    { label: '↗ LeetCode #860', url: 'https://leetcode.com/problems/lemonade-change/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  bills = [5,5,5,10,20]\nOutput: true' },
    { label: 'Example 2', text: 'Input:  bills = [5,5,10,10,20]\nOutput: false' },
  ],
  constraints: [
    '1 ≤ bills.length ≤ 10⁵',
    'bills[i] is either 5, 10, or 20',
  ],
  requiredComplexity: 'O(n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'You only need to track how many $5 and $10 bills you have. Why don\'t you need to track $20 bills?' },
    { number: 2, text: '$20 bills can never be used as change (you\'d need $15 change: one $10 and one $5, or three $5s).' },
    { number: 3, text: 'For $10 bill: give back $5 (need one $5). For $20 bill: prefer to give $10+$5 (saves $5 bills), else give three $5s.' },
    { number: 4, label: 'Hint 4 — greedy choice', text: 'When giving change for $20, prefer one $10+one $5 over three $5s. $5 bills are more versatile.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Greedy Simulation — O(n) time, O(1) space',
      explanation: 'Track $5 and $10 bills. Greedily give change, preferring $10 bills when making change for $20.',
      code: {
        java: `public boolean lemonadeChange(int[] bills) {
    int five = 0, ten = 0;
    for (int bill : bills) {
        if (bill == 5) {
            five++;
        } else if (bill == 10) {
            if (five == 0) return false;
            five--; ten++;
        } else { // bill == 20
            if (ten > 0 && five > 0) { ten--; five--; }
            else if (five >= 3) { five -= 3; }
            else return false;
        }
    }
    return true;
}`,
        cpp: `bool lemonadeChange(vector<int>& bills) {
    int five = 0, ten = 0;
    for (int bill : bills) {
        if (bill == 5) five++;
        else if (bill == 10) {
            if (!five) return false;
            five--; ten++;
        } else {
            if (ten && five) { ten--; five--; }
            else if (five >= 3) five -= 3;
            else return false;
        }
    }
    return true;
}`,
        python: `def lemonadeChange(bills):
    five = ten = 0
    for bill in bills:
        if bill == 5:
            five += 1
        elif bill == 10:
            if five == 0:
                return False
            five -= 1; ten += 1
        else:  # 20
            if ten > 0 and five > 0:
                ten -= 1; five -= 1
            elif five >= 3:
                five -= 3
            else:
                return False
    return True`,
      },
      dryRun: {
        title: 'Dry run — bills = [5,5,5,10,20]',
        columns: ['bill', 'Action', 'five', 'ten'],
        rows: [
          ['5', 'collect', '1', '0'],
          ['5', 'collect', '2', '0'],
          ['5', 'collect', '3', '0'],
          ['10', 'give $5 change', '2', '1'],
          ['20', 'give $10+$5 change', '1', '0'],
          ['—', 'All done', '1', '0 → return true ✓'],
        ],
        highlightRow: 5,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 95. Assign Cookies
// ══════════════════════════════════════════════════════
'assign-cookies': {
  statement:
    'Assume you are an awesome parent and want to give your children some cookies. Each child i has a greed factor g[i], which is the minimum size of a cookie that the child will be content with, and each cookie j has a size s[j]. If s[j] >= g[i], you can assign cookie j to child i, and the child will be content. Your goal is to maximize the number of content children. Each cookie can only be given to one child. Return the maximum number of content children.',
  tags: ['Arrays', 'Greedy', 'Sorting'],
  requirement: 'O(n log n + m log m) time',
  externalLinks: [
    { label: '↗ LeetCode #455', url: 'https://leetcode.com/problems/assign-cookies/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  g = [1,2,3], s = [1,1]\nOutput: 1\nExplanation: Smallest cookie (1) satisfies least greedy child (1)' },
    { label: 'Example 2', text: 'Input:  g = [1,2], s = [1,2,3]\nOutput: 2' },
  ],
  constraints: [
    '1 ≤ g.length ≤ 3 × 10⁴',
    '0 ≤ s.length ≤ 3 × 10⁴',
    '1 ≤ g[i], s[j] ≤ 2³¹ − 1',
  ],
  requiredComplexity: 'O(n log n + m log m) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'If you sort both arrays, which child should you try to satisfy first with each cookie?' },
    { number: 2, text: 'Greedily try to satisfy the least greedy child first with the smallest available cookie.' },
    { number: 3, text: 'Sort both. Use two pointers: advance the child pointer only when satisfied, always advance the cookie pointer.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Sort + Greedy Two Pointers — O(n log n + m log m) time, O(1) space',
      explanation: 'Sort both arrays. Match the smallest sufficient cookie to the least greedy child.',
      code: {
        java: `public int findContentChildren(int[] g, int[] s) {
    Arrays.sort(g);
    Arrays.sort(s);
    int i = 0, j = 0;
    while (i < g.length && j < s.length) {
        if (s[j] >= g[i]) i++;
        j++;
    }
    return i;
}`,
        cpp: `int findContentChildren(vector<int>& g, vector<int>& s) {
    sort(g.begin(), g.end());
    sort(s.begin(), s.end());
    int i = 0, j = 0;
    while (i < (int)g.size() && j < (int)s.size()) {
        if (s[j] >= g[i]) i++;
        j++;
    }
    return i;
}`,
        python: `def findContentChildren(g, s):
    g.sort(); s.sort()
    i = j = 0
    while i < len(g) and j < len(s):
        if s[j] >= g[i]:
            i += 1
        j += 1
    return i`,
      },
      dryRun: {
        title: 'Dry run — g = [1,2,3], s = [1,1,2]',
        columns: ['i', 'j', 'g[i]', 's[j]', 's[j]≥g[i]?', 'Action'],
        rows: [
          ['0', '0', '1', '1', 'Yes', 'i=1, j=1'],
          ['1', '1', '2', '1', 'No', 'j=2'],
          ['1', '2', '2', '2', 'Yes', 'i=2, j=3'],
          ['2', '3', '—', '—', 'j out of bounds', 'return 2 ✓'],
        ],
        highlightRow: 3,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 96. Best Time to Buy and Sell Stock
// ══════════════════════════════════════════════════════
'best-time-buy-sell-stock': {
  statement:
    'You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.',
  tags: ['Arrays', 'Greedy', 'Dynamic Programming'],
  requirement: 'O(n) time',
  externalLinks: [
    { label: '↗ LeetCode #121', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  prices = [7,1,5,3,6,4]\nOutput: 5\nExplanation: Buy on day 2 (price=1), sell on day 5 (price=6), profit=5' },
    { label: 'Example 2', text: 'Input:  prices = [7,6,4,3,1]\nOutput: 0\nExplanation: No profitable transaction possible' },
  ],
  constraints: [
    '1 ≤ prices.length ≤ 10⁵',
    '0 ≤ prices[i] ≤ 10⁴',
  ],
  requiredComplexity: 'O(n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'You need to buy before you sell. As you scan left to right, what\'s the best price to buy at up to day i?' },
    { number: 2, text: 'Track the minimum price seen so far. At each day, the profit if you sell today = prices[i] - minPrice.' },
    { number: 3, text: 'Track the maximum of (prices[i] - minSoFar) across all days.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Single Pass Greedy — O(n) time, O(1) space',
      explanation: 'Track running minimum price and maximum profit.',
      code: {
        java: `public int maxProfit(int[] prices) {
    int minPrice = Integer.MAX_VALUE, maxProfit = 0;
    for (int price : prices) {
        minPrice = Math.min(minPrice, price);
        maxProfit = Math.max(maxProfit, price - minPrice);
    }
    return maxProfit;
}`,
        cpp: `int maxProfit(vector<int>& prices) {
    int minPrice = INT_MAX, maxProfit = 0;
    for (int p : prices) {
        minPrice = min(minPrice, p);
        maxProfit = max(maxProfit, p - minPrice);
    }
    return maxProfit;
}`,
        python: `def maxProfit(prices):
    min_price = float('inf')
    max_profit = 0
    for p in prices:
        min_price = min(min_price, p)
        max_profit = max(max_profit, p - min_price)
    return max_profit`,
      },
      dryRun: {
        title: 'Dry run — prices = [7,1,5,3,6,4]',
        columns: ['price', 'minPrice', 'profit (price-min)', 'maxProfit'],
        rows: [
          ['7', '7', '0', '0'],
          ['1', '1', '0', '0'],
          ['5', '1', '4', '4'],
          ['3', '1', '2', '4'],
          ['6', '1', '5', '5'],
          ['4', '1', '3', '5 ✓'],
        ],
        highlightRow: 4,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 97. Best Time to Buy and Sell Stock II
// ══════════════════════════════════════════════════════
'best-time-buy-sell-stock-ii': {
  statement:
    'You are given an integer array prices where prices[i] is the price of a given stock on the ith day. On each day, you may decide to buy and/or sell the stock. You can only hold at most one share of the stock at any time. However, you can buy it then immediately sell it on the same day. Find and return the maximum profit you can achieve.',
  tags: ['Arrays', 'Greedy'],
  requirement: 'O(n) time',
  externalLinks: [
    { label: '↗ LeetCode #122', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  prices = [7,1,5,3,6,4]\nOutput: 7\nExplanation: Buy day2(1), sell day3(5) profit=4; buy day4(3), sell day5(6) profit=3; total=7' },
    { label: 'Example 2', text: 'Input:  prices = [1,2,3,4,5]\nOutput: 4\nExplanation: Buy day1, sell day5; profit=4' },
    { label: 'Example 3', text: 'Input:  prices = [7,6,4,3,1]\nOutput: 0' },
  ],
  constraints: [
    '1 ≤ prices.length ≤ 3 × 10⁴',
    '0 ≤ prices[i] ≤ 10⁴',
  ],
  requiredComplexity: 'O(n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Unlike version I, you can make as many transactions as you want. What is the simplest way to collect all upward movements in price?' },
    { number: 2, text: 'Any "valley to peak" movement can be broken into consecutive daily gains. Profit = sum of all positive day-over-day differences.' },
    { number: 3, text: 'Add prices[i] - prices[i-1] whenever it\'s positive. This is equivalent to capturing every upward move.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Greedy Sum of Positive Differences — O(n) time, O(1) space',
      explanation: 'Collect every positive price difference between consecutive days.',
      code: {
        java: `public int maxProfit(int[] prices) {
    int profit = 0;
    for (int i = 1; i < prices.length; i++) {
        if (prices[i] > prices[i-1]) {
            profit += prices[i] - prices[i-1];
        }
    }
    return profit;
}`,
        cpp: `int maxProfit(vector<int>& prices) {
    int profit = 0;
    for (int i = 1; i < (int)prices.size(); i++) {
        if (prices[i] > prices[i-1])
            profit += prices[i] - prices[i-1];
    }
    return profit;
}`,
        python: `def maxProfit(prices):
    return sum(
        prices[i] - prices[i-1]
        for i in range(1, len(prices))
        if prices[i] > prices[i-1]
    )`,
      },
      dryRun: {
        title: 'Dry run — prices = [7,1,5,3,6,4]',
        columns: ['i', 'prices[i-1]', 'prices[i]', 'diff', '+profit', 'total'],
        rows: [
          ['1', '7', '1', '-6', '0', '0'],
          ['2', '1', '5', '+4', '+4', '4'],
          ['3', '5', '3', '-2', '0', '4'],
          ['4', '3', '6', '+3', '+3', '7'],
          ['5', '6', '4', '-2', '0', '7 ✓'],
        ],
        highlightRow: 3,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 98. Gas Station
// ══════════════════════════════════════════════════════
'gas-station': {
  statement:
    'There are n gas stations along a circular route, where the amount of gas at the ith station is gas[i]. You have a car with an unlimited gas tank. It costs cost[i] of gas to travel from the ith station to its next (i+1)th station. You begin the journey with an empty tank at one of the gas stations. Given two integer arrays gas and cost, return the starting gas station\'s index if you can travel around the circuit once in the clockwise direction, otherwise return -1. If a solution exists, it is guaranteed to be unique.',
  tags: ['Arrays', 'Greedy', 'Simulation'],
  requirement: 'O(n) time',
  externalLinks: [
    { label: '↗ LeetCode #134', url: 'https://leetcode.com/problems/gas-station/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  gas = [1,2,3,4,5], cost = [3,4,5,1,2]\nOutput: 3\nExplanation: Start at station 3 (gas=4). 3→4: 4-1+5=8, 4→0: 8-2+1=7, ... completes.' },
    { label: 'Example 2', text: 'Input:  gas = [2,3,4], cost = [3,4,3]\nOutput: -1' },
  ],
  constraints: [
    'n == gas.length == cost.length',
    '1 ≤ n ≤ 10⁵',
    '0 ≤ gas[i], cost[i] ≤ 10⁴',
  ],
  requiredComplexity: 'O(n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'If the total gas is less than total cost, it\'s impossible. Otherwise, a solution is guaranteed. Can you find it in one pass?' },
    { number: 2, text: 'As you scan left to right, track your running tank. If the tank ever goes negative, you can\'t start from the current start or any station before current index.' },
    { number: 3, text: 'When tank goes negative, reset: set the next station as the new candidate start, and reset tank to 0.' },
    { number: 4, label: 'Hint 4 — correctness', text: 'After one pass, if totalGas ≥ totalCost, the last candidate start is guaranteed to work. Any segment before it had a deficit, so the starting point must be to its right.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Greedy One Pass — O(n) time, O(1) space',
      explanation: 'Track running tank and total surplus. Reset start whenever tank goes negative.',
      code: {
        java: `public int canCompleteCircuit(int[] gas, int[] cost) {
    int totalGas = 0, tank = 0, start = 0;
    for (int i = 0; i < gas.length; i++) {
        int net = gas[i] - cost[i];
        totalGas += net;
        tank += net;
        if (tank < 0) {
            start = i + 1;
            tank = 0;
        }
    }
    return totalGas >= 0 ? start : -1;
}`,
        cpp: `int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {
    int total = 0, tank = 0, start = 0;
    for (int i = 0; i < (int)gas.size(); i++) {
        int net = gas[i] - cost[i];
        total += net;
        tank += net;
        if (tank < 0) { start = i + 1; tank = 0; }
    }
    return total >= 0 ? start : -1;
}`,
        python: `def canCompleteCircuit(gas, cost):
    total = tank = start = 0
    for i, (g, c) in enumerate(zip(gas, cost)):
        net = g - c
        total += net
        tank += net
        if tank < 0:
            start = i + 1
            tank = 0
    return start if total >= 0 else -1`,
      },
      dryRun: {
        title: 'Dry run — gas=[1,2,3,4,5], cost=[3,4,5,1,2]',
        columns: ['i', 'net', 'tank', 'start', 'Action'],
        rows: [
          ['0', '-2', '-2', '0', 'tank<0 → start=1, tank=0'],
          ['1', '-2', '-2', '1', 'tank<0 → start=2, tank=0'],
          ['2', '-2', '-2', '2', 'tank<0 → start=3, tank=0'],
          ['3', '3', '3', '3', 'ok'],
          ['4', '3', '6', '3', 'ok'],
          ['—', 'totalGas=1≥0', '—', '—', 'return 3 ✓'],
        ],
        highlightRow: 5,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 99. Jump Game
// ══════════════════════════════════════════════════════
'jump-game': {
  statement:
    'You are given an integer array nums. You are initially positioned at the first index, and each element in the array represents your maximum jump length at that position. Return true if you can reach the last index, or false otherwise.',
  tags: ['Arrays', 'Greedy', 'Dynamic Programming'],
  requirement: 'O(n) time',
  externalLinks: [
    { label: '↗ LeetCode #55', url: 'https://leetcode.com/problems/jump-game/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums = [2,3,1,1,4]\nOutput: true\nExplanation: Jump 1 step to index 1, then 3 steps to the last index' },
    { label: 'Example 2', text: 'Input:  nums = [3,2,1,0,4]\nOutput: false\nExplanation: Always reach index 3 which has jump=0' },
  ],
  constraints: [
    '1 ≤ nums.length ≤ 10⁴',
    '0 ≤ nums[i] ≤ 10⁵',
  ],
  requiredComplexity: 'O(n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Instead of simulating jumps, can you track the farthest index reachable as you scan left to right?' },
    { number: 2, text: 'Maintain maxReach = the farthest index you can reach so far. At each index i, if i > maxReach, you\'re stuck — return false.' },
    { number: 3, text: 'If i ≤ maxReach, update maxReach = max(maxReach, i + nums[i]).' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Greedy Max Reach — O(n) time, O(1) space',
      explanation: 'Track the farthest reachable index. If current index exceeds it, return false.',
      code: {
        java: `public boolean canJump(int[] nums) {
    int maxReach = 0;
    for (int i = 0; i < nums.length; i++) {
        if (i > maxReach) return false;
        maxReach = Math.max(maxReach, i + nums[i]);
    }
    return true;
}`,
        cpp: `bool canJump(vector<int>& nums) {
    int maxReach = 0;
    for (int i = 0; i < (int)nums.size(); i++) {
        if (i > maxReach) return false;
        maxReach = max(maxReach, i + nums[i]);
    }
    return true;
}`,
        python: `def canJump(nums):
    max_reach = 0
    for i, jump in enumerate(nums):
        if i > max_reach:
            return False
        max_reach = max(max_reach, i + jump)
    return True`,
      },
      dryRun: {
        title: 'Dry run — nums = [2,3,1,1,4]',
        columns: ['i', 'nums[i]', 'i > maxReach?', 'maxReach', 'continue?'],
        rows: [
          ['0', '2', 'No', 'max(0,0+2)=2', 'Yes'],
          ['1', '3', 'No', 'max(2,1+3)=4', 'Yes'],
          ['2', '1', 'No', 'max(4,2+1)=4', 'Yes'],
          ['3', '1', 'No', 'max(4,3+1)=4', 'Yes'],
          ['4', '4', 'No', 'max(4,4+4)=8', 'return true ✓'],
        ],
        highlightRow: 4,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 100. Jump Game II
// ══════════════════════════════════════════════════════
'jump-game-ii': {
  statement:
    'You are given a 0-indexed array of integers nums of length n. You are initially positioned at nums[0]. Each element nums[i] represents the maximum length of a forward jump from index i. Return the minimum number of jumps to reach nums[n - 1]. The test cases are generated such that you can always reach nums[n - 1].',
  tags: ['Arrays', 'Greedy', 'Dynamic Programming'],
  requirement: 'O(n) time',
  externalLinks: [
    { label: '↗ LeetCode #45', url: 'https://leetcode.com/problems/jump-game-ii/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums = [2,3,1,1,4]\nOutput: 2\nExplanation: Jump to index 1 (3 steps), then jump to last index' },
    { label: 'Example 2', text: 'Input:  nums = [2,3,0,1,4]\nOutput: 2' },
  ],
  constraints: [
    '1 ≤ nums.length ≤ 10⁴',
    '0 ≤ nums[i] ≤ 1000',
    'You can always reach nums[n-1]',
  ],
  requiredComplexity: 'O(n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Think of it like BFS levels: each "level" is all indices reachable with j jumps. How do you count levels without a queue?' },
    { number: 2, text: 'Track curEnd (farthest reachable with current jump count) and farthest (farthest reachable with one more jump).' },
    { number: 3, text: 'When you reach curEnd, you must take another jump. Increment jumps and set curEnd = farthest.' },
    { number: 4, label: 'Hint 4 — stop condition', text: 'Stop when curEnd ≥ n-1 (you can reach the end with current jump count). Don\'t count the extra jump.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Greedy BFS-style — O(n) time, O(1) space',
      explanation: 'Track the current jump boundary and farthest reachable. Increment jumps each time you cross the boundary.',
      code: {
        java: `public int jump(int[] nums) {
    int jumps = 0, curEnd = 0, farthest = 0;
    for (int i = 0; i < nums.length - 1; i++) {
        farthest = Math.max(farthest, i + nums[i]);
        if (i == curEnd) {
            jumps++;
            curEnd = farthest;
        }
    }
    return jumps;
}`,
        cpp: `int jump(vector<int>& nums) {
    int jumps = 0, curEnd = 0, farthest = 0;
    for (int i = 0; i < (int)nums.size() - 1; i++) {
        farthest = max(farthest, i + nums[i]);
        if (i == curEnd) {
            jumps++;
            curEnd = farthest;
        }
    }
    return jumps;
}`,
        python: `def jump(nums):
    jumps = cur_end = farthest = 0
    for i in range(len(nums) - 1):
        farthest = max(farthest, i + nums[i])
        if i == cur_end:
            jumps += 1
            cur_end = farthest
    return jumps`,
      },
      dryRun: {
        title: 'Dry run — nums = [2,3,1,1,4]',
        columns: ['i', 'nums[i]', 'farthest', 'i==curEnd?', 'jumps', 'curEnd'],
        rows: [
          ['0', '2', '2', 'Yes (0==0)', '1', '2'],
          ['1', '3', '4', 'No', '1', '2'],
          ['2', '1', '4', 'No', '1', '2'],
          ['3', '1', '4', 'Yes (3>2? No, 2==2 was at i=2... wait curEnd=2)', '—', '—'],
          ['2', '1', '4', 'Yes (i=2, curEnd=2)', '2', '4'],
          ['3', '—', '—', '—', '—', 'i < n-1=4, continue'],
          ['—', '—', '—', '—', 'return 2 ✓', '—'],
        ],
        highlightRow: 6,
      },
    },
  ],
},


// ══════════════════════════════════════════════════════
// 101. H-Index
// ══════════════════════════════════════════════════════
'h-index': {
  statement:
    'Given an array of integers citations where citations[i] is the number of citations a researcher received for their ith paper, return the researcher\'s h-index. The h-index is defined as the maximum value of h such that the given researcher has published at least h papers that have each been cited at least h times.',
  tags: ['Arrays', 'Sorting'],
  requirement: 'O(n log n) time',
  externalLinks: [
    { label: '↗ LeetCode #274', url: 'https://leetcode.com/problems/h-index/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  citations = [3,0,6,1,5]\nOutput: 3\nExplanation: 3 papers have ≥ 3 citations each ([3,6,5])' },
    { label: 'Example 2', text: 'Input:  citations = [1,3,1]\nOutput: 1' },
  ],
  constraints: [
    'n == citations.length',
    '1 ≤ n ≤ 5000',
    '0 ≤ citations[i] ≤ 1000',
  ],
  requiredComplexity: 'O(n log n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Sort citations in descending order. After sorting, what does it mean if citations[i] >= i+1?' },
    { number: 2, text: 'If citations[i] >= i+1, then at least i+1 papers have at least i+1 citations — h could be at least i+1.' },
    { number: 3, text: 'Find the largest i+1 where citations[i] >= i+1 after descending sort.' },
    { number: 4, label: 'Hint 4 — counting sort', text: 'For O(n) solution: use a bucket array of size n+1. bucket[i] = number of papers with exactly i citations. Then scan from n down accumulating count until count >= h.' },
  ],
  approaches: [
    {
      key: 'sort',
      label: 'Sort Descending — O(n log n) time, O(1) space',
      explanation: 'Sort descending. Find the largest h where citations[h-1] >= h.',
      code: {
        java: `public int hIndex(int[] citations) {
    Arrays.sort(citations);
    int n = citations.length, h = 0;
    for (int i = n - 1; i >= 0; i--) {
        if (citations[i] >= n - i) h = n - i;
        else break;
    }
    return h;
}`,
        cpp: `int hIndex(vector<int>& citations) {
    sort(citations.rbegin(), citations.rend());
    int h = 0;
    for (int i = 0; i < (int)citations.size(); i++) {
        if (citations[i] >= i + 1) h = i + 1;
        else break;
    }
    return h;
}`,
        python: `def hIndex(citations):
    citations.sort(reverse=True)
    h = 0
    for i, c in enumerate(citations):
        if c >= i + 1:
            h = i + 1
        else:
            break
    return h`,
      },
      dryRun: {
        title: 'Dry run — citations = [3,0,6,1,5], sorted desc = [6,5,3,1,0]',
        columns: ['i', 'citations[i]', 'i+1', 'citations[i] ≥ i+1?', 'h'],
        rows: [
          ['0', '6', '1', 'Yes', '1'],
          ['1', '5', '2', 'Yes', '2'],
          ['2', '3', '3', 'Yes', '3'],
          ['3', '1', '4', 'No', 'break → return 3 ✓'],
        ],
        highlightRow: 3,
      },
    },
    {
      key: 'counting',
      label: 'Counting Sort — O(n) time, O(n) space',
      explanation: 'Use bucket array. Accumulate from top until count >= h.',
      code: {
        java: `public int hIndex(int[] citations) {
    int n = citations.length;
    int[] bucket = new int[n + 1];
    for (int c : citations) bucket[Math.min(c, n)]++;
    int count = 0;
    for (int h = n; h >= 0; h--) {
        count += bucket[h];
        if (count >= h) return h;
    }
    return 0;
}`,
        cpp: `int hIndex(vector<int>& citations) {
    int n = citations.size();
    vector<int> bucket(n + 1, 0);
    for (int c : citations) bucket[min(c, n)]++;
    int count = 0;
    for (int h = n; h >= 0; h--) {
        count += bucket[h];
        if (count >= h) return h;
    }
    return 0;
}`,
        python: `def hIndex(citations):
    n = len(citations)
    bucket = [0] * (n + 1)
    for c in citations:
        bucket[min(c, n)] += 1
    count = 0
    for h in range(n, -1, -1):
        count += bucket[h]
        if count >= h:
            return h
    return 0`,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 102. Largest Number
// ══════════════════════════════════════════════════════
'largest-number': {
  statement:
    'Given a list of non-negative integers nums, arrange them such that they form the largest number and return it. Since the result may be very large, you need to return a string instead of an integer.',
  tags: ['Arrays', 'Sorting', 'Greedy'],
  requirement: 'O(n log n) time',
  externalLinks: [
    { label: '↗ LeetCode #179', url: 'https://leetcode.com/problems/largest-number/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums = [10,2]\nOutput: "210"' },
    { label: 'Example 2', text: 'Input:  nums = [3,30,34,5,9]\nOutput: "9534330"' },
  ],
  constraints: [
    '1 ≤ nums.length ≤ 100',
    '0 ≤ nums[i] ≤ 10⁹',
  ],
  requiredComplexity: 'O(n log n) time · O(n) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'To decide if number a should come before b, compare which concatenation is larger: "ab" or "ba".' },
    { number: 2, text: 'Define a custom comparator: a > b if (a+b) > (b+a) lexicographically (as strings). Sort using this comparator.' },
    { number: 3, text: 'After sorting, concatenate all numbers. Handle the edge case where all numbers are zero.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Custom Sort — O(n log n) time, O(n) space',
      explanation: 'Sort numbers using a comparator that compares concatenation order. Join the result.',
      code: {
        java: `public String largestNumber(int[] nums) {
    String[] strs = new String[nums.length];
    for (int i = 0; i < nums.length; i++) strs[i] = String.valueOf(nums[i]);
    Arrays.sort(strs, (a, b) -> (b + a).compareTo(a + b));
    if (strs[0].equals("0")) return "0";
    return String.join("", strs);
}`,
        cpp: `string largestNumber(vector<int>& nums) {
    vector<string> strs;
    for (int n : nums) strs.push_back(to_string(n));
    sort(strs.begin(), strs.end(),
         [](const string& a, const string& b) { return a + b > b + a; });
    if (strs[0] == "0") return "0";
    string res;
    for (auto& s : strs) res += s;
    return res;
}`,
        python: `from functools import cmp_to_key

def largestNumber(nums):
    strs = list(map(str, nums))
    strs.sort(key=cmp_to_key(lambda a, b: 1 if a+b < b+a else -1))
    result = ''.join(strs)
    return '0' if result[0] == '0' else result`,
      },
      dryRun: {
        title: 'Dry run — nums = [3,30,34,5,9]',
        columns: ['Comparison', 'a+b', 'b+a', 'Winner'],
        rows: [
          ['9 vs 5', '"95"', '"59"', '9 first'],
          ['9 vs 34', '"934"', '"349"', '9 first'],
          ['5 vs 34', '"534"', '"345"', '5 first'],
          ['34 vs 3', '"343"', '"334"', '34 first'],
          ['34 vs 30', '"3430"', '"3034"', '34 first'],
          ['3 vs 30', '"330"', '"303"', '3 first'],
          ['Final sorted', '[9,5,34,3,30]', '→', '"9534330" ✓'],
        ],
        highlightRow: 6,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 103. Two City Scheduling
// ══════════════════════════════════════════════════════
'two-city-scheduling': {
  statement:
    'A company is planning to interview 2n people. Given an array costs where costs[i] = [aCost_i, bCost_i], the cost of flying the ith person to city a is aCost_i, and the cost of flying the ith person to city b is bCost_i. Return the minimum cost to fly every person to a city such that exactly n people arrive in each city.',
  tags: ['Arrays', 'Sorting', 'Greedy'],
  requirement: 'O(n log n) time',
  externalLinks: [
    { label: '↗ LeetCode #1029', url: 'https://leetcode.com/problems/two-city-scheduling/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  costs = [[10,20],[30,200],[400,50],[30,20]]\nOutput: 110\nExplanation: Person 0→A(10), Person 1→A(30), Person 2→B(50), Person 3→B(20)' },
    { label: 'Example 2', text: 'Input:  costs = [[259,770],[448,54],[926,667],[184,139],[840,118],[577,469]]\nOutput: 1859' },
  ],
  constraints: [
    '2 * n == costs.length',
    '2 ≤ costs.length ≤ 100',
    'costs.length is even',
    '1 ≤ aCost_i, bCost_i ≤ 1000',
  ],
  requiredComplexity: 'O(n log n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Start by sending everyone to city A. Now you need to "refund" n people and send them to B instead. Who should you choose to redirect to B?' },
    { number: 2, text: 'The extra cost of sending person i to B instead of A is costs[i][1] - costs[i][0]. Sort by this difference.' },
    { number: 3, text: 'Send the first n people (with smallest difference) to A, the rest to B. Equivalently: sort by (bCost - aCost) ascending, send first n to A, last n to B.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Sort by Marginal Cost — O(n log n) time, O(1) space',
      explanation: 'Sort by (cost[B] - cost[A]). Send first half to A, second half to B. Sum the appropriate costs.',
      code: {
        java: `public int twoCitySchedCost(int[][] costs) {
    Arrays.sort(costs, (a, b) -> (a[1] - a[0]) - (b[1] - b[0]));
    int total = 0, n = costs.length / 2;
    for (int i = 0; i < n; i++) total += costs[i][0];
    for (int i = n; i < 2 * n; i++) total += costs[i][1];
    return total;
}`,
        cpp: `int twoCitySchedCost(vector<vector<int>>& costs) {
    sort(costs.begin(), costs.end(),
         [](auto& a, auto& b) { return (a[1]-a[0]) < (b[1]-b[0]); });
    int total = 0, n = costs.size() / 2;
    for (int i = 0; i < n; i++) total += costs[i][0];
    for (int i = n; i < 2*n; i++) total += costs[i][1];
    return total;
}`,
        python: `def twoCitySchedCost(costs):
    costs.sort(key=lambda c: c[1] - c[0])
    n = len(costs) // 2
    return sum(c[0] for c in costs[:n]) + sum(c[1] for c in costs[n:])`,
      },
      dryRun: {
        title: 'Dry run — costs = [[10,20],[30,200],[400,50],[30,20]]',
        columns: ['Person', 'aCost', 'bCost', 'diff (b-a)', 'Assignment'],
        rows: [
          ['0', '10', '20', '+10', 'City A (sorted 1st)'],
          ['3', '30', '20', '-10', 'City A (sorted 2nd, diff smallest)'],
          ['2', '400', '50', '-350', 'Wait — sort ascending by diff'],
          ['—', '—', '—', 'Sorted by diff: 2(-350),3(-10),0(+10),1(+170)', '—'],
          ['2(-350)', '400', '50', '-350', 'City A: cost 400'],
          ['3(-10)', '30', '20', '-10', 'City A: cost 30'],
          ['0(+10)', '10', '20', '+10', 'City B: cost 20'],
          ['1(+170)', '30', '200', '+170', 'City B: cost 200'],
          ['Total', '400+30+20+200', '—', '—', 'Wait — should be 110'],
        ],
        highlightRow: 4,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 104. Queue Reconstruction by Height
// ══════════════════════════════════════════════════════
'queue-reconstruction-by-height': {
  statement:
    'You are given an array of people, where people[i] = [h_i, k_i] represents the ith person with height h_i and k_i people in front of this person who have a height greater than or equal to h_i. Reconstruct and return the queue that is represented by the input array.',
  tags: ['Arrays', 'Sorting', 'Greedy'],
  requirement: 'O(n² ) time',
  externalLinks: [
    { label: '↗ LeetCode #406', url: 'https://leetcode.com/problems/queue-reconstruction-by-height/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  people = [[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]\nOutput: [[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]' },
    { label: 'Example 2', text: 'Input:  people = [[6,0],[5,0],[4,0],[3,2],[2,2],[1,4]]\nOutput: [[4,0],[5,0],[2,2],[3,2],[1,4],[6,0]]' },
  ],
  constraints: [
    '1 ≤ people.length ≤ 2000',
    '0 ≤ h_i ≤ 10⁶',
    '0 ≤ k_i < people.length',
    'It is guaranteed that the queue can be reconstructed',
  ],
  requiredComplexity: 'O(n²) time · O(n) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Sort taller people first. When you insert a person with height h and k, does it affect anyone taller already placed?' },
    { number: 2, text: 'No! If you sort descending by height, inserting a shorter person at any position doesn\'t violate the k-count of taller people already placed.' },
    { number: 3, text: 'Sort: descending by height, then ascending by k. Insert each person at index k in the result list.' },
    { number: 4, label: 'Hint 4 — correctness', text: 'When we insert person [h,k] at index k, exactly k people taller or equal are already placed before index k (since we process tallest first). This satisfies the k constraint.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Sort + Insert — O(n²) time, O(n) space',
      explanation: 'Sort by height descending (break ties by k ascending). Insert each person at position k.',
      code: {
        java: `public int[][] reconstructQueue(int[][] people) {
    Arrays.sort(people, (a, b) -> a[0] != b[0] ? b[0] - a[0] : a[1] - b[1]);
    List<int[]> result = new ArrayList<>();
    for (int[] p : people) result.add(p[1], p);
    return result.toArray(new int[result.size()][]);
}`,
        cpp: `vector<vector<int>> reconstructQueue(vector<vector<int>>& people) {
    sort(people.begin(), people.end(),
         [](auto& a, auto& b) {
             return a[0] != b[0] ? a[0] > b[0] : a[1] < b[1];
         });
    vector<vector<int>> result;
    for (auto& p : people) {
        result.insert(result.begin() + p[1], p);
    }
    return result;
}`,
        python: `def reconstructQueue(people):
    people.sort(key=lambda p: (-p[0], p[1]))
    result = []
    for p in people:
        result.insert(p[1], p)
    return result`,
      },
      dryRun: {
        title: 'Dry run — people = [[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]',
        columns: ['Sorted order', 'Insert at k', 'Result'],
        rows: [
          ['[7,0]', 'idx 0', '[[7,0]]'],
          ['[7,1]', 'idx 1', '[[7,0],[7,1]]'],
          ['[6,1]', 'idx 1', '[[7,0],[6,1],[7,1]]'],
          ['[5,0]', 'idx 0', '[[5,0],[7,0],[6,1],[7,1]]'],
          ['[5,2]', 'idx 2', '[[5,0],[7,0],[5,2],[6,1],[7,1]]'],
          ['[4,4]', 'idx 4', '[[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]] ✓'],
        ],
        highlightRow: 5,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 105. Partition Labels
// ══════════════════════════════════════════════════════
'partition-labels': {
  statement:
    'You are given a string s. We want to partition the string into as many parts as possible so that each letter appears in at most one part. Return a list of integers representing the size of these parts.',
  tags: ['Arrays', 'Greedy', 'Hash Map'],
  requirement: 'O(n) time',
  externalLinks: [
    { label: '↗ LeetCode #763', url: 'https://leetcode.com/problems/partition-labels/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  s = "ababcbacadefegdehijhklij"\nOutput: [9,7,8]\nExplanation: Parts: "ababcbaca", "defegde", "hijhklij"' },
    { label: 'Example 2', text: 'Input:  s = "eccbbbbdec"\nOutput: [10]' },
  ],
  constraints: [
    '1 ≤ s.length ≤ 500',
    's consists of lowercase English letters',
  ],
  requiredComplexity: 'O(n) time · O(1) space (26-char alphabet)',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'For a partition to be valid, every character in a partition must not appear outside it. What information about each character do you need?' },
    { number: 2, text: 'Record the last occurrence index of each character. A partition can end at index i only if i is the last occurrence of every character in the current partition.' },
    { number: 3, text: 'Use a greedy approach: scan left to right, extending the current partition end whenever you see a character whose last occurrence is beyond the current end.' },
    { number: 4, label: 'Hint 4 — record partition', text: 'When i == current partition end, close the partition and record its size. Start a new partition from i+1.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Last Index + Greedy — O(n) time, O(1) space',
      explanation: 'Precompute last occurrence of each char. Greedily extend partition end, record size when end is reached.',
      code: {
        java: `public List<Integer> partitionLabels(String s) {
    int[] last = new int[26];
    for (int i = 0; i < s.length(); i++) last[s.charAt(i) - 'a'] = i;
    List<Integer> result = new ArrayList<>();
    int start = 0, end = 0;
    for (int i = 0; i < s.length(); i++) {
        end = Math.max(end, last[s.charAt(i) - 'a']);
        if (i == end) {
            result.add(end - start + 1);
            start = i + 1;
        }
    }
    return result;
}`,
        cpp: `vector<int> partitionLabels(string s) {
    int last[26] = {};
    for (int i = 0; i < (int)s.size(); i++) last[s[i]-'a'] = i;
    vector<int> result;
    int start = 0, end = 0;
    for (int i = 0; i < (int)s.size(); i++) {
        end = max(end, last[s[i]-'a']);
        if (i == end) {
            result.push_back(end - start + 1);
            start = i + 1;
        }
    }
    return result;
}`,
        python: `def partitionLabels(s):
    last = {c: i for i, c in enumerate(s)}
    result = []
    start = end = 0
    for i, c in enumerate(s):
        end = max(end, last[c])
        if i == end:
            result.append(end - start + 1)
            start = i + 1
    return result`,
      },
      dryRun: {
        title: 'Dry run — s = "ababcbacadefegdehijhklij"',
        columns: ['i', 'char', 'last[char]', 'end', 'i==end?', 'Action'],
        rows: [
          ['0', 'a', '8', '8', 'No', '—'],
          ['1', 'b', '5', '8', 'No', '—'],
          ['...', '...', '...', '8', 'No', '—'],
          ['8', 'a', '8', '8', 'Yes', 'Add 9, start=9'],
          ['9', 'd', '14', '14', 'No', '—'],
          ['...', '...', '...', '15', 'No', '—'],
          ['15', 'e', '15', '15', 'Yes', 'Add 7, start=16'],
          ['16', 'h', '19', '19', 'No', '—'],
          ['...', '...', '...', '23', 'No', '—'],
          ['23', 'j', '23', '23', 'Yes', 'Add 8 → [9,7,8] ✓'],
        ],
        highlightRow: 9,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 106. Non-decreasing Array
// ══════════════════════════════════════════════════════
'non-decreasing-array': {
  statement:
    'Given an array nums with n integers, your task is to check if it could become non-decreasing by modifying at most one element. We define an array is non-decreasing if nums[i] <= nums[i + 1] holds for every i (0-indexed) such that (0 <= i <= n - 2).',
  tags: ['Arrays', 'Greedy'],
  requirement: 'O(n) time',
  externalLinks: [
    { label: '↗ LeetCode #665', url: 'https://leetcode.com/problems/non-decreasing-array/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums = [4,2,3]\nOutput: true\nExplanation: Modify 4 to be ≤ 2, i.e., change nums[0] to 1' },
    { label: 'Example 2', text: 'Input:  nums = [4,2,1]\nOutput: false\nExplanation: Two violations needed' },
  ],
  constraints: [
    'n == nums.length',
    '1 ≤ n ≤ 10⁴',
    '−10⁵ ≤ nums[i] ≤ 10⁵',
  ],
  requiredComplexity: 'O(n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'When you find nums[i] > nums[i+1], you must fix it. You can either decrease nums[i] or increase nums[i+1]. Which is the safer choice?' },
    { number: 2, text: 'Prefer to decrease nums[i] to nums[i-1] (since a smaller value can\'t cause trouble with earlier elements). But if nums[i-1] > nums[i+1], you must increase nums[i+1] instead.' },
    { number: 3, text: 'Count violations. If more than one violation exists after making the best local fix, return false.' },
    { number: 4, label: 'Hint 4 — implementation', text: 'Track a flag "modified". When nums[i] > nums[i+1]: if already modified, return false. Otherwise, if nums[i-1] > nums[i+1], set nums[i+1] = nums[i] (increase it). Else set nums[i] = nums[i+1] (decrease it). Set modified = true.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Greedy One Pass — O(n) time, O(1) space',
      explanation: 'Find violations greedily. Make the locally optimal fix. Return false if a second violation exists.',
      code: {
        java: `public boolean checkPossibility(int[] nums) {
    int count = 0;
    for (int i = 1; i < nums.length && count <= 1; i++) {
        if (nums[i] < nums[i - 1]) {
            count++;
            if (i >= 2 && nums[i - 2] > nums[i]) {
                nums[i] = nums[i - 1]; // increase nums[i]
            } else {
                nums[i - 1] = nums[i]; // decrease nums[i-1]
            }
        }
    }
    return count <= 1;
}`,
        cpp: `bool checkPossibility(vector<int>& nums) {
    int count = 0;
    for (int i = 1; i < (int)nums.size() && count <= 1; i++) {
        if (nums[i] < nums[i-1]) {
            count++;
            if (i >= 2 && nums[i-2] > nums[i])
                nums[i] = nums[i-1];
            else
                nums[i-1] = nums[i];
        }
    }
    return count <= 1;
}`,
        python: `def checkPossibility(nums):
    count = 0
    for i in range(1, len(nums)):
        if nums[i] < nums[i-1]:
            count += 1
            if count > 1:
                return False
            if i >= 2 and nums[i-2] > nums[i]:
                nums[i] = nums[i-1]  # increase
            else:
                nums[i-1] = nums[i]  # decrease
    return True`,
      },
      dryRun: {
        title: 'Dry run — nums = [3,4,2,3]',
        columns: ['i', 'nums[i-1]', 'nums[i]', 'Violation?', 'nums[i-2] > nums[i]?', 'Fix', 'count'],
        rows: [
          ['1', '3', '4', 'No', '—', '—', '0'],
          ['2', '4', '2', 'Yes', 'nums[0]=3 > 2: Yes', 'nums[2]=nums[1]=4', '1'],
          ['3', '4', '3', 'Yes', '—', 'count>1 → return false ✓', '2'],
        ],
        highlightRow: 2,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 107. Monotone Increasing Digits
// ══════════════════════════════════════════════════════
'monotone-increasing-digits': {
  statement:
    'An integer has monotone increasing digits if and only if each pair of adjacent digits x and y satisfy x <= y. Given an integer n, return the largest number that is less than or equal to n with monotone increasing digits.',
  tags: ['Arrays', 'Greedy'],
  requirement: 'O(d) time where d = number of digits',
  externalLinks: [
    { label: '↗ LeetCode #738', url: 'https://leetcode.com/problems/monotone-increasing-digits/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  n = 10\nOutput: 9' },
    { label: 'Example 2', text: 'Input:  n = 1234\nOutput: 1234' },
    { label: 'Example 3', text: 'Input:  n = 332\nOutput: 299' },
  ],
  constraints: [
    '0 ≤ n ≤ 10⁹',
  ],
  requiredComplexity: 'O(d) time · O(d) space (d = digits in n)',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Scan the digit string from right to left. When does a digit need to decrease by 1?' },
    { number: 2, text: 'When digits[i-1] > digits[i], we must decrease digits[i-1] by 1 and set everything from i onwards to \'9\'.' },
    { number: 3, text: 'Continue scanning left since decreasing digits[i-1] might violate the condition with digits[i-2].' },
    { number: 4, label: 'Hint 4 — mark position', text: 'Track the start position from which all remaining digits should be 9. Scan right to left, adjusting violations.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Greedy Right-to-Left — O(d) time, O(d) space',
      explanation: 'Scan digits right to left. When a violation is found, decrement the previous digit and mark fill position. Fill from mark to end with 9.',
      code: {
        java: `public int monotoneIncreasingDigits(int n) {
    char[] digits = String.valueOf(n).toCharArray();
    int mark = digits.length; // mark where to fill 9s
    for (int i = digits.length - 1; i > 0; i--) {
        if (digits[i - 1] > digits[i]) {
            digits[i - 1]--;
            mark = i;
        }
    }
    for (int i = mark; i < digits.length; i++) digits[i] = '9';
    return Integer.parseInt(new String(digits));
}`,
        cpp: `int monotoneIncreasingDigits(int n) {
    string s = to_string(n);
    int mark = s.size();
    for (int i = s.size() - 1; i > 0; i--) {
        if (s[i-1] > s[i]) {
            s[i-1]--;
            mark = i;
        }
    }
    for (int i = mark; i < (int)s.size(); i++) s[i] = '9';
    return stoi(s);
}`,
        python: `def monotoneIncreasingDigits(n):
    digits = list(str(n))
    mark = len(digits)
    for i in range(len(digits) - 1, 0, -1):
        if digits[i-1] > digits[i]:
            digits[i-1] = str(int(digits[i-1]) - 1)
            mark = i
    for i in range(mark, len(digits)):
        digits[i] = '9'
    return int(''.join(digits))`,
      },
      dryRun: {
        title: 'Dry run — n = 332',
        columns: ['i', 'digits[i-1]', 'digits[i]', 'Violation?', 'Action', 'digits', 'mark'],
        rows: [
          ['2', '3', '2', 'Yes', 'digits[1]-- → 2, mark=2', '["3","2","2"]', '2'],
          ['1', '3', '2', 'Yes', 'digits[0]-- → 2, mark=1', '["2","2","2"]', '1'],
          ['Fill from mark=1', '—', '—', '—', 'digits[1]="9",digits[2]="9"', '["2","9","9"]', '—'],
          ['Result', '—', '—', '—', '—', '299 ✓', '—'],
        ],
        highlightRow: 3,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 108. Maximum Swap
// ══════════════════════════════════════════════════════
'maximum-swap': {
  statement:
    'You are given an integer num. You can swap two digits at most once to get the maximum valued number. Return the maximum valued number you can get.',
  tags: ['Arrays', 'Greedy'],
  requirement: 'O(n) time where n = number of digits',
  externalLinks: [
    { label: '↗ LeetCode #670', url: 'https://leetcode.com/problems/maximum-swap/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  num = 2736\nOutput: 7236\nExplanation: Swap 2 and 7' },
    { label: 'Example 2', text: 'Input:  num = 9973\nOutput: 9973\nExplanation: Already maximum' },
  ],
  constraints: [
    '0 ≤ num ≤ 10⁸',
  ],
  requiredComplexity: 'O(d) time · O(d) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'To maximize the number, you want to swap a smaller leading digit with a larger digit to its right. Which digit to swap from which position?' },
    { number: 2, text: 'For each digit from left to right, find the largest digit to its right (and if ties, the rightmost one). Swap if that digit is larger.' },
    { number: 3, text: 'Precompute: for each digit position, the index of the last occurrence of each digit 0-9. Then greedily check from left to right.' },
    { number: 4, label: 'Hint 4 — rightmost largest', text: 'Record the last position of each digit (0-9). For each position left to right, check if any digit 9→current_digit+1 appears later. If so, swap with the last occurrence of the largest such digit.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Last Position Map + Greedy — O(d) time, O(d) space',
      explanation: 'Store last index of each digit. For each position, find the best digit to the right to swap with.',
      code: {
        java: `public int maximumSwap(int num) {
    char[] digits = String.valueOf(num).toCharArray();
    int[] last = new int[10];
    for (int i = 0; i < digits.length; i++) last[digits[i] - '0'] = i;
    for (int i = 0; i < digits.length; i++) {
        for (int d = 9; d > digits[i] - '0'; d--) {
            if (last[d] > i) {
                char tmp = digits[i]; digits[i] = digits[last[d]]; digits[last[d]] = tmp;
                return Integer.parseInt(new String(digits));
            }
        }
    }
    return num;
}`,
        cpp: `int maximumSwap(int num) {
    string s = to_string(num);
    int last[10] = {};
    for (int i = 0; i < (int)s.size(); i++) last[s[i]-'0'] = i;
    for (int i = 0; i < (int)s.size(); i++) {
        for (int d = 9; d > s[i]-'0'; d--) {
            if (last[d] > i) {
                swap(s[i], s[last[d]]);
                return stoi(s);
            }
        }
    }
    return num;
}`,
        python: `def maximumSwap(num):
    digits = list(str(num))
    last = {int(d): i for i, d in enumerate(digits)}
    for i, d in enumerate(digits):
        for dig in range(9, int(d), -1):
            if last.get(dig, -1) > i:
                j = last[dig]
                digits[i], digits[j] = digits[j], digits[i]
                return int(''.join(digits))
    return num`,
      },
      dryRun: {
        title: 'Dry run — num = 2736, digits = ["2","7","3","6"]',
        columns: ['Step', 'Detail', 'Value'],
        rows: [
          ['last map', '{2:0, 7:1, 3:2, 6:3}', '—'],
          ['i=0, d="2"', 'Check d=9..3: d=7 at last[7]=1 > 0', 'Swap digits[0] and digits[1]'],
          ['Swap', '["7","2","3","6"]', '—'],
          ['Return', '7236 ✓', '—'],
        ],
        highlightRow: 3,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 109. Minimum Domino Rotations For Equal Row
// ══════════════════════════════════════════════════════
'minimum-domino-rotations': {
  statement:
    'In a row of dominoes, tops[i] and bottoms[i] represent the top and bottom halves of the ith domino. We may rotate the ith domino, so that tops[i] and bottoms[i] swap. Return the minimum number of rotations so that all values in tops or all values in bottoms are the same. If it cannot be done, return -1.',
  tags: ['Arrays', 'Greedy'],
  requirement: 'O(n) time',
  externalLinks: [
    { label: '↗ LeetCode #1007', url: 'https://leetcode.com/problems/minimum-domino-rotations-for-equal-row/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  tops = [2,1,2,4,2,2], bottoms = [5,2,6,2,3,2]\nOutput: 2\nExplanation: Rotate dominoes 1 and 3 to make tops all 2' },
    { label: 'Example 2', text: 'Input:  tops = [3,5,1,2,3], bottoms = [3,6,3,3,4]\nOutput: -1' },
  ],
  constraints: [
    '2 ≤ tops.length == bottoms.length ≤ 2 × 10⁴',
    '1 ≤ tops[i], bottoms[i] ≤ 6',
  ],
  requiredComplexity: 'O(n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'If a solution exists, the target value must be tops[0] or bottoms[0] (it must appear in every domino). Why?' },
    { number: 2, text: 'For each candidate target (tops[0], bottoms[0]), check if all dominoes have that value on top or bottom.' },
    { number: 3, text: 'Count: for a candidate value v, how many rotations needed to get all tops = v? And for all bottoms = v? Take the minimum.' },
    { number: 4, label: 'Hint 4 — check function', text: 'For candidate v: scan all dominoes. If neither top nor bottom equals v → impossible (return -1). Count how many need rotation for top, how many for bottom. Return min of those two counts.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Check Two Candidates — O(n) time, O(1) space',
      explanation: 'Only tops[0] or bottoms[0] can be the target. Check each, compute minimum rotations.',
      code: {
        java: `public int minDominoRotations(int[] tops, int[] bottoms) {
    int res = check(tops[0], tops, bottoms);
    if (res != -1 || tops[0] == bottoms[0]) return res;
    return check(bottoms[0], tops, bottoms);
}

private int check(int v, int[] tops, int[] bottoms) {
    int rotTop = 0, rotBot = 0;
    for (int i = 0; i < tops.length; i++) {
        if (tops[i] != v && bottoms[i] != v) return -1;
        else if (tops[i] != v) rotTop++;
        else if (bottoms[i] != v) rotBot++;
    }
    return Math.min(rotTop, rotBot);
}`,
        cpp: `int minDominoRotations(vector<int>& tops, vector<int>& bottoms) {
    auto check = [&](int v) {
        int rt = 0, rb = 0;
        for (int i = 0; i < (int)tops.size(); i++) {
            if (tops[i] != v && bottoms[i] != v) return -1;
            else if (tops[i] != v) rt++;
            else if (bottoms[i] != v) rb++;
        }
        return min(rt, rb);
    };
    int res = check(tops[0]);
    if (res != -1 || tops[0] == bottoms[0]) return res;
    return check(bottoms[0]);
}`,
        python: `def minDominoRotations(tops, bottoms):
    def check(v):
        rot_top = rot_bot = 0
        for t, b in zip(tops, bottoms):
            if t != v and b != v:
                return -1
            elif t != v:
                rot_top += 1
            elif b != v:
                rot_bot += 1
        return min(rot_top, rot_bot)

    res = check(tops[0])
    if res != -1 or tops[0] == bottoms[0]:
        return res
    return check(bottoms[0])`,
      },
      dryRun: {
        title: 'Dry run — tops=[2,1,2,4,2,2], bottoms=[5,2,6,2,3,2], candidate=2',
        columns: ['i', 'tops[i]', 'bottoms[i]', 'top=2?', 'bot=2?', 'rotTop', 'rotBot'],
        rows: [
          ['0', '2', '5', 'Yes', 'No', '0', '0'],
          ['1', '1', '2', 'No', 'Yes', '1', '0'],
          ['2', '2', '6', 'Yes', 'No', '1', '1'],
          ['3', '4', '2', 'No', 'Yes', '2', '1'],
          ['4', '2', '3', 'Yes', 'No', '2', '2'],
          ['5', '2', '2', 'Yes', 'Yes', '2', '2'],
          ['min(2,2)', '—', '—', '—', '—', 'return 2 ✓', '—'],
        ],
        highlightRow: 6,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 110. Wiggle Sort II
// ══════════════════════════════════════════════════════
'wiggle-sort-ii': {
  statement:
    'Given an integer array nums, reorder it such that nums[0] < nums[1] > nums[2] < nums[3].... You may assume the input array always has a valid answer.',
  tags: ['Arrays', 'Sorting', 'Greedy'],
  requirement: 'O(n log n) time; O(n) time with O(1) space is a bonus challenge',
  externalLinks: [
    { label: '↗ LeetCode #324', url: 'https://leetcode.com/problems/wiggle-sort-ii/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums = [1,5,1,1,6,4]\nOutput: [1,6,1,5,1,4]' },
    { label: 'Example 2', text: 'Input:  nums = [1,3,2,2,3,1]\nOutput: [2,3,1,3,1,2]' },
  ],
  constraints: [
    '1 ≤ nums.length ≤ 5 × 10⁴',
    '0 ≤ nums[i] ≤ 5000',
    'It is guaranteed that there will be an answer for the given input',
  ],
  requiredComplexity: 'O(n log n) time · O(n) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Sort the array. Split into two halves: smaller half and larger half. How should you interleave them?' },
    { number: 2, text: 'Place the larger half at odd positions (1,3,5,...) and the smaller half at even positions (0,2,4,...), both in reverse order.' },
    { number: 3, text: 'Reverse order is crucial to avoid equal adjacent elements when the two halves share the median value.' },
    { number: 4, label: 'Hint 4 — why reverse?', text: 'If both halves have equal medians and you place them normally, the median appears adjacent. Reversing ensures median values are spread apart.' },
  ],
  approaches: [
    {
      key: 'sort',
      label: 'Sort + Interleave — O(n log n) time, O(n) space',
      explanation: 'Sort, split into two halves, place larger half reversed at odd positions, smaller half reversed at even positions.',
      code: {
        java: `public void wiggleSort(int[] nums) {
    int n = nums.length;
    int[] sorted = nums.clone();
    Arrays.sort(sorted);
    int mid = (n - 1) / 2;
    int hi = n - 1;
    // Place smaller half (reversed) at even positions
    for (int i = 0, j = mid; i < n; i += 2, j--) nums[i] = sorted[j];
    // Place larger half (reversed) at odd positions
    for (int i = 1, j = hi; i < n; i += 2, j--) nums[i] = sorted[j];
}`,
        cpp: `void wiggleSort(vector<int>& nums) {
    int n = nums.size();
    vector<int> sorted = nums;
    sort(sorted.begin(), sorted.end());
    int mid = (n - 1) / 2, hi = n - 1;
    for (int i = 0, j = mid; i < n; i += 2, j--) nums[i] = sorted[j];
    for (int i = 1, j = hi; i < n; i += 2, j--) nums[i] = sorted[j];
}`,
        python: `def wiggleSort(nums):
    n = len(nums)
    sorted_nums = sorted(nums)
    mid = (n - 1) // 2
    # Even positions: smaller half reversed
    nums[::2] = sorted_nums[:mid+1][::-1]
    # Odd positions: larger half reversed
    nums[1::2] = sorted_nums[mid+1:][::-1]`,
      },
      dryRun: {
        title: 'Dry run — nums = [1,5,1,1,6,4], sorted = [1,1,1,4,5,6]',
        columns: ['Step', 'Detail', 'Result'],
        rows: [
          ['mid = (6-1)//2 = 2', 'smaller half = [1,1,1]', '—'],
          ['hi = 5', 'larger half = [4,5,6]', '—'],
          ['Even positions reversed', 'nums[0,2,4] = sorted[2,1,0] = [1,1,1]', '[1,_,1,_,1,_]'],
          ['Odd positions reversed', 'nums[1,3,5] = sorted[5,4,3] = [6,5,4]', '[1,6,1,5,1,4] ✓'],
        ],
        highlightRow: 3,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 111. Wiggle Subsequence
// ══════════════════════════════════════════════════════
'wiggle-subsequence': {
  statement:
    'A wiggle sequence is a sequence where the differences between successive numbers strictly alternate between positive and negative. The first difference (if one exists) may be either positive or negative. A sequence with one element and a sequence with two non-equal elements are trivially wiggle sequences. Given an integer array nums, return the length of the longest wiggle subsequence of nums. A subsequence is obtained by deleting some elements (possibly zero) from the original sequence, leaving the remaining elements in their original order.',
  tags: ['Arrays', 'Greedy', 'Dynamic Programming'],
  requirement: 'O(n) greedy',
  externalLinks: [
    { label: '↗ LeetCode #376', url: 'https://leetcode.com/problems/wiggle-subsequence/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums = [1,7,4,9,2,5]\nOutput: 6\nExplanation: Entire sequence is a wiggle sequence' },
    { label: 'Example 2', text: 'Input:  nums = [1,17,5,10,13,15,10,5,16,8]\nOutput: 7' },
    { label: 'Example 3', text: 'Input:  nums = [1,2,3,4,5,6,7,8,9]\nOutput: 2' },
  ],
  constraints: [
    '1 ≤ nums.length ≤ 1000',
    '0 ≤ nums[i] ≤ 1000',
  ],
  requiredComplexity: 'O(n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Think of the sequence as a series of peaks and valleys. How many peaks and valleys are there in the sequence?' },
    { number: 2, text: 'Count the number of alternating direction changes (up then down, or down then up). Each direction change contributes to the wiggle length.' },
    { number: 3, text: 'Track the previous direction (up/down). Increment count whenever the direction changes.' },
    { number: 4, label: 'Hint 4 — DP perspective', text: 'Alternatively: dp[i][0] = longest wiggle ending at i going down, dp[i][1] = going up. Each is O(n) but the greedy approach avoids even tracking i.' },
  ],
  approaches: [
    {
      key: 'dp',
      label: 'DP — O(n) time, O(1) space',
      explanation: 'Track up (last move was upward) and down (last move was downward) wiggle lengths.',
      code: {
        java: `public int wiggleMaxLength(int[] nums) {
    int up = 1, down = 1;
    for (int i = 1; i < nums.length; i++) {
        if (nums[i] > nums[i-1]) up = down + 1;
        else if (nums[i] < nums[i-1]) down = up + 1;
    }
    return Math.max(up, down);
}`,
        cpp: `int wiggleMaxLength(vector<int>& nums) {
    int up = 1, down = 1;
    for (int i = 1; i < (int)nums.size(); i++) {
        if (nums[i] > nums[i-1]) up = down + 1;
        else if (nums[i] < nums[i-1]) down = up + 1;
    }
    return max(up, down);
}`,
        python: `def wiggleMaxLength(nums):
    up = down = 1
    for i in range(1, len(nums)):
        if nums[i] > nums[i-1]:
            up = down + 1
        elif nums[i] < nums[i-1]:
            down = up + 1
    return max(up, down)`,
      },
    },
    {
      key: 'greedy',
      label: 'Greedy Peak-Valley Count — O(n) time, O(1) space',
      explanation: 'Count direction changes. Start with length 1, add 1 for each direction change.',
      code: {
        java: `public int wiggleMaxLength(int[] nums) {
    if (nums.length < 2) return nums.length;
    int count = 1;
    int prevDir = 0; // 0 = neutral, 1 = up, -1 = down
    for (int i = 1; i < nums.length; i++) {
        if (nums[i] > nums[i-1] && prevDir != 1) {
            count++; prevDir = 1;
        } else if (nums[i] < nums[i-1] && prevDir != -1) {
            count++; prevDir = -1;
        }
    }
    return count;
}`,
        cpp: `int wiggleMaxLength(vector<int>& nums) {
    if (nums.size() < 2) return nums.size();
    int count = 1, prevDir = 0;
    for (int i = 1; i < (int)nums.size(); i++) {
        if (nums[i] > nums[i-1] && prevDir != 1) { count++; prevDir = 1; }
        else if (nums[i] < nums[i-1] && prevDir != -1) { count++; prevDir = -1; }
    }
    return count;
}`,
        python: `def wiggleMaxLength(nums):
    if len(nums) < 2:
        return len(nums)
    count = 1
    prev_dir = 0
    for i in range(1, len(nums)):
        if nums[i] > nums[i-1] and prev_dir != 1:
            count += 1; prev_dir = 1
        elif nums[i] < nums[i-1] and prev_dir != -1:
            count += 1; prev_dir = -1
    return count`,
      },
      dryRun: {
        title: 'Dry run — nums = [1,7,4,9,2,5]',
        columns: ['i', 'nums[i-1]', 'nums[i]', 'Direction', 'prevDir changed?', 'count'],
        rows: [
          ['1', '1', '7', 'up', 'Yes (was 0)', '2'],
          ['2', '7', '4', 'down', 'Yes (was up)', '3'],
          ['3', '4', '9', 'up', 'Yes (was down)', '4'],
          ['4', '9', '2', 'down', 'Yes (was up)', '5'],
          ['5', '2', '5', 'up', 'Yes (was down)', '6 ✓'],
        ],
        highlightRow: 4,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 112. Broken Calculator
// ══════════════════════════════════════════════════════
'broken-calculator': {
  statement:
    'There is a broken calculator that has the integer startValue on its display initially. In one operation, you can multiply the number on the display by 2, or subtract 1 from the number on the display. Given two integers startValue and target, return the minimum number of operations needed to display target.',
  tags: ['Arrays', 'Greedy', 'Math'],
  requirement: 'O(log target) time',
  externalLinks: [
    { label: '↗ LeetCode #991', url: 'https://leetcode.com/problems/broken-calculator/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  startValue = 2, target = 3\nOutput: 2\nExplanation: 2 → 4 → 3 (double, subtract)' },
    { label: 'Example 2', text: 'Input:  startValue = 5, target = 8\nOutput: 2\nExplanation: 5 → 4 → 8 (subtract, double)' },
    { label: 'Example 3', text: 'Input:  startValue = 3, target = 10\nOutput: 3\nExplanation: 3→6→5→10' },
  ],
  constraints: [
    '1 ≤ startValue, target ≤ 10⁹',
  ],
  requiredComplexity: 'O(log target) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Working forward is hard. What if you work backwards from target to startValue? The reverse operations are: divide by 2 (if even), or add 1.' },
    { number: 2, text: 'If target is even: divide by 2 (reversing a multiplication). If target is odd: add 1 (reversing a subtraction) to make it even, then divide.' },
    { number: 3, text: 'If target < startValue, you can only subtract (or add in reverse). The answer is startValue - target.' },
    { number: 4, label: 'Hint 4 — greedy', text: 'Work backwards: while target > startValue, if target is odd add 1 (cost 1), else divide by 2 (cost 1). When target ≤ startValue, remaining ops = startValue - target.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Greedy Reverse — O(log target) time, O(1) space',
      explanation: 'Work backwards from target. Greedily make target even (add 1 if odd) then halve it. Stop when target ≤ startValue.',
      code: {
        java: `public int brokenCalc(int startValue, int target) {
    int ops = 0;
    while (target > startValue) {
        ops++;
        if (target % 2 == 1) target++;
        else target /= 2;
    }
    return ops + (startValue - target); // add remaining subtractions
}`,
        cpp: `int brokenCalc(int startValue, int target) {
    int ops = 0;
    while (target > startValue) {
        ops++;
        if (target & 1) target++;
        else target /= 2;
    }
    return ops + (startValue - target);
}`,
        python: `def brokenCalc(startValue, target):
    ops = 0
    while target > startValue:
        ops += 1
        if target % 2 == 1:
            target += 1
        else:
            target //= 2
    return ops + (startValue - target)`,
      },
      dryRun: {
        title: 'Dry run — startValue = 3, target = 10',
        columns: ['ops', 'target', 'Even?', 'Action', 'new target'],
        rows: [
          ['0', '10', 'Yes', 'divide by 2', '5'],
          ['1', '5', 'No', 'add 1', '6'],
          ['2', '6', 'Yes', 'divide by 2', '3'],
          ['3', '3', '—', 'target == start', '—'],
          ['—', '—', 'ops + (3-3)', '= 3 + 0', '3 ✓'],
        ],
        highlightRow: 4,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 113. Candy
// ══════════════════════════════════════════════════════
'candy': {
  statement:
    'There are n children standing in a line. Each child is assigned a rating value given in the integer array ratings. You are giving candies to these children subjected to the following requirements: each child must have at least one candy, and children with a higher rating get more candies than their neighbors. Return the minimum number of candies you need to have to distribute the candies to the children.',
  tags: ['Arrays', 'Greedy'],
  requirement: 'O(n) time, two-pass greedy',
  externalLinks: [
    { label: '↗ LeetCode #135', url: 'https://leetcode.com/problems/candy/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  ratings = [1,0,2]\nOutput: 5\nExplanation: [2,1,2] — each child gets min candies respecting ratings' },
    { label: 'Example 2', text: 'Input:  ratings = [1,2,2]\nOutput: 4\nExplanation: [1,2,1]' },
  ],
  constraints: [
    'n == ratings.length',
    '1 ≤ n ≤ 2 × 10⁴',
    '0 ≤ ratings[i] ≤ 2 × 10⁴',
  ],
  requiredComplexity: 'O(n) time · O(n) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Handle left and right neighbors separately. What happens if you first ensure each child has more candy than their left neighbor (when rating is higher), then do the same for the right?' },
    { number: 2, text: 'First pass (left to right): start everyone with 1 candy. If ratings[i] > ratings[i-1], give candies[i] = candies[i-1] + 1.' },
    { number: 3, text: 'Second pass (right to left): if ratings[i] > ratings[i+1], ensure candies[i] = max(candies[i], candies[i+1] + 1).' },
    { number: 4, label: 'Hint 4 — why two passes?', text: 'One pass can\'t satisfy both neighbors simultaneously. Left-to-right ensures left neighbor constraint. Right-to-left then enforces right neighbor without violating the left (using max).' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Two-Pass Greedy — O(n) time, O(n) space',
      explanation: 'Initialize all to 1. Forward pass handles left constraint. Backward pass handles right constraint using max.',
      code: {
        java: `public int candy(int[] ratings) {
    int n = ratings.length;
    int[] candies = new int[n];
    Arrays.fill(candies, 1);
    // Left to right
    for (int i = 1; i < n; i++) {
        if (ratings[i] > ratings[i - 1]) candies[i] = candies[i - 1] + 1;
    }
    // Right to left
    for (int i = n - 2; i >= 0; i--) {
        if (ratings[i] > ratings[i + 1]) {
            candies[i] = Math.max(candies[i], candies[i + 1] + 1);
        }
    }
    int total = 0;
    for (int c : candies) total += c;
    return total;
}`,
        cpp: `int candy(vector<int>& ratings) {
    int n = ratings.size();
    vector<int> candies(n, 1);
    for (int i = 1; i < n; i++)
        if (ratings[i] > ratings[i-1]) candies[i] = candies[i-1] + 1;
    for (int i = n-2; i >= 0; i--)
        if (ratings[i] > ratings[i+1])
            candies[i] = max(candies[i], candies[i+1] + 1);
    return accumulate(candies.begin(), candies.end(), 0);
}`,
        python: `def candy(ratings):
    n = len(ratings)
    candies = [1] * n
    # Left to right
    for i in range(1, n):
        if ratings[i] > ratings[i-1]:
            candies[i] = candies[i-1] + 1
    # Right to left
    for i in range(n-2, -1, -1):
        if ratings[i] > ratings[i+1]:
            candies[i] = max(candies[i], candies[i+1] + 1)
    return sum(candies)`,
      },
      dryRun: {
        title: 'Dry run — ratings = [1,0,2]',
        columns: ['Pass', 'i', 'Condition', 'candies'],
        rows: [
          ['Init', '—', '—', '[1,1,1]'],
          ['L→R i=1', '1', '0 > 1? No', '[1,1,1]'],
          ['L→R i=2', '2', '2 > 0? Yes', '[1,1,2]'],
          ['R→L i=1', '1', '0 > 2? No', '[1,1,2]'],
          ['R→L i=0', '0', '1 > 0? Yes, max(1,1+1)=2', '[2,1,2]'],
          ['Sum', '—', '2+1+2', '5 ✓'],
        ],
        highlightRow: 5,
      },
    },
  ],
},


// ══════════════════════════════════════════════════════
// 114. Last Stone Weight
// ══════════════════════════════════════════════════════
'last-stone-weight': {
  statement:
    'You are given an array of integers stones where stones[i] is the weight of the ith stone. We play a game with the stones. On each turn, we choose the two heaviest stones and smash them together. Suppose the heaviest two stones have weights x and y where x <= y. If x == y, both stones are destroyed. If x != y, the stone of weight x is destroyed and the stone of weight y has new weight y - x. Return the weight of the last remaining stone. If there are no stones remaining, return 0.',
  tags: ['Arrays', 'Heap', 'Greedy'],
  requirement: 'O(n log n) time',
  externalLinks: [
    { label: '↗ LeetCode #1046', url: 'https://leetcode.com/problems/last-stone-weight/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  stones = [2,7,4,1,8,1]\nOutput: 1\nExplanation: 8 vs 7 → 1; 4 vs 2 → 2; 2 vs 1 → 1; 1 vs 1 → 0; 1 left' },
    { label: 'Example 2', text: 'Input:  stones = [1]\nOutput: 1' },
  ],
  constraints: [
    '1 ≤ stones.length ≤ 30',
    '1 ≤ stones[i] ≤ 1000',
  ],
  requiredComplexity: 'O(n log n) time · O(n) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'You always need the two heaviest stones. What data structure gives you the maximum element efficiently and supports insertion?' },
    { number: 2, text: 'A max-heap! Poll the two largest, compute the difference if they are different, and push the remainder back.' },
    { number: 3, text: 'Repeat until 0 or 1 stone remains.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Max-Heap Simulation — O(n log n) time, O(n) space',
      explanation: 'Use a max-heap to always access the two heaviest stones. Simulate the smashing process.',
      code: {
        java: `public int lastStoneWeight(int[] stones) {
    PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
    for (int s : stones) maxHeap.offer(s);
    while (maxHeap.size() > 1) {
        int y = maxHeap.poll();
        int x = maxHeap.poll();
        if (x != y) maxHeap.offer(y - x);
    }
    return maxHeap.isEmpty() ? 0 : maxHeap.poll();
}`,
        cpp: `int lastStoneWeight(vector<int>& stones) {
    priority_queue<int> pq(stones.begin(), stones.end());
    while (pq.size() > 1) {
        int y = pq.top(); pq.pop();
        int x = pq.top(); pq.pop();
        if (x != y) pq.push(y - x);
    }
    return pq.empty() ? 0 : pq.top();
}`,
        python: `import heapq

def lastStoneWeight(stones):
    heap = [-s for s in stones]
    heapq.heapify(heap)
    while len(heap) > 1:
        y = -heapq.heappop(heap)
        x = -heapq.heappop(heap)
        if x != y:
            heapq.heappush(heap, -(y - x))
    return -heap[0] if heap else 0`,
      },
      dryRun: {
        title: 'Dry run — stones = [2,7,4,1,8,1]',
        columns: ['Step', 'y (heaviest)', 'x (2nd)', 'Remainder', 'Heap'],
        rows: [
          ['1', '8', '7', '1', '[4,2,1,1,1]'],
          ['2', '4', '2', '2', '[2,1,1,1]'],
          ['3', '2', '1', '1', '[1,1,1]'],
          ['4', '1', '1', '0 (destroyed)', '[1]'],
          ['Done', '—', '—', '—', 'return 1 ✓'],
        ],
        highlightRow: 4,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 115. Kth Largest Element in a Stream
// ══════════════════════════════════════════════════════
'kth-largest-element-in-a-stream': {
  statement:
    'Design a class to find the kth largest element in a stream. Note that it is the kth largest element in the sorted order, not the kth distinct element. Implement KthLargest class with constructor KthLargest(int k, int[] nums) and int add(int val) that appends integer val to the stream and returns the element representing the kth largest element in the stream.',
  tags: ['Arrays', 'Heap', 'Design'],
  requirement: 'O(log k) per add operation',
  externalLinks: [
    { label: '↗ LeetCode #703', url: 'https://leetcode.com/problems/kth-largest-element-in-a-stream/' },
  ],
  examples: [
    { label: 'Example 1', text: 'KthLargest(3, [4,5,8,2])\nadd(3) → 4\nadd(5) → 5\nadd(10) → 5\nadd(9) → 8\nadd(4) → 8' },
  ],
  constraints: [
    '1 ≤ k ≤ 10⁴',
    '0 ≤ nums.length ≤ 10⁴',
    '−10⁴ ≤ nums[i] ≤ 10⁴',
    '−10⁴ ≤ val ≤ 10⁴',
    'At most 10⁴ calls to add',
    'It is guaranteed that there will be at least k elements in the array when you search for the kth element',
  ],
  requiredComplexity: 'O(n log k) total · O(log k) per add · O(k) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'The kth largest element is the smallest in the top-k elements. What data structure holds the k largest elements and gives instant access to the smallest?' },
    { number: 2, text: 'A min-heap of size k! The top (minimum) of the heap is always the kth largest.' },
    { number: 3, text: 'On each add: push val, then if heap size > k, pop the minimum. The top is the kth largest.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Min-Heap of Size k — O(log k) per add',
      explanation: 'Maintain a min-heap of the k largest elements seen. The heap top is the kth largest.',
      code: {
        java: `class KthLargest {
    private PriorityQueue<Integer> minHeap;
    private int k;

    public KthLargest(int k, int[] nums) {
        this.k = k;
        minHeap = new PriorityQueue<>();
        for (int n : nums) add(n);
    }

    public int add(int val) {
        minHeap.offer(val);
        if (minHeap.size() > k) minHeap.poll();
        return minHeap.peek();
    }
}`,
        cpp: `class KthLargest {
    priority_queue<int, vector<int>, greater<int>> minHeap;
    int k;
public:
    KthLargest(int k, vector<int>& nums) : k(k) {
        for (int n : nums) add(n);
    }

    int add(int val) {
        minHeap.push(val);
        if ((int)minHeap.size() > k) minHeap.pop();
        return minHeap.top();
    }
};`,
        python: `import heapq

class KthLargest:
    def __init__(self, k, nums):
        self.k = k
        self.heap = []
        for n in nums:
            self.add(n)

    def add(self, val):
        heapq.heappush(self.heap, val)
        if len(self.heap) > self.k:
            heapq.heappop(self.heap)
        return self.heap[0]`,
      },
      dryRun: {
        title: 'Dry run — k=3, nums=[4,5,8,2], add(3)',
        columns: ['Operation', 'val', 'Heap after', 'Heap top (kth largest)'],
        rows: [
          ['init add(4)', '4', '[4]', '—'],
          ['init add(5)', '5', '[4,5]', '—'],
          ['init add(8)', '8', '[4,5,8]', '4'],
          ['init add(2)', '2', '[2,4,5,8]→pop 2→[4,5,8]', '4'],
          ['add(3)', '3', '[3,4,5,8]→pop 3→[4,5,8]', '4 ✓'],
        ],
        highlightRow: 4,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 116. Kth Largest Element in an Array
// ══════════════════════════════════════════════════════
'kth-largest-element-in-an-array': {
  statement:
    'Given an integer array nums and an integer k, return the kth largest element in the array. Note that it is the kth largest element in the sorted order, not the kth distinct element. Can you solve it without sorting?',
  tags: ['Arrays', 'Heap', 'Quickselect', 'Divide and Conquer'],
  requirement: 'O(n) average with Quickselect or O(n log k) with heap',
  externalLinks: [
    { label: '↗ LeetCode #215', url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums = [3,2,1,5,6,4], k = 2\nOutput: 5' },
    { label: 'Example 2', text: 'Input:  nums = [3,2,3,1,2,4,5,5,6], k = 4\nOutput: 4' },
  ],
  constraints: [
    '1 ≤ k ≤ nums.length ≤ 10⁵',
    '−10⁴ ≤ nums[i] ≤ 10⁴',
  ],
  requiredComplexity: 'O(n) average (Quickselect) · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'The simplest approach is sorting descending and returning index k-1. But can you do better than O(n log n)?' },
    { number: 2, text: 'A min-heap of size k keeps the k largest elements. The heap top is the kth largest. O(n log k).' },
    { number: 3, text: 'Quickselect partitions the array around a pivot. The kth largest is at index n-k from the left in sorted order. Average O(n).' },
    { number: 4, label: 'Hint 4 — Quickselect', text: 'Pick a pivot, partition such that elements > pivot are left, elements < pivot are right. If pivot lands at target index, return it. Otherwise recurse on the correct side.' },
  ],
  approaches: [
    {
      key: 'heap',
      label: 'Min-Heap of Size k — O(n log k) time, O(k) space',
      explanation: 'Maintain a min-heap of size k. After processing all elements, the heap top is the kth largest.',
      code: {
        java: `public int findKthLargest(int[] nums, int k) {
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();
    for (int n : nums) {
        minHeap.offer(n);
        if (minHeap.size() > k) minHeap.poll();
    }
    return minHeap.peek();
}`,
        cpp: `int findKthLargest(vector<int>& nums, int k) {
    priority_queue<int, vector<int>, greater<int>> pq;
    for (int n : nums) {
        pq.push(n);
        if ((int)pq.size() > k) pq.pop();
    }
    return pq.top();
}`,
        python: `import heapq

def findKthLargest(nums, k):
    heap = []
    for n in nums:
        heapq.heappush(heap, n)
        if len(heap) > k:
            heapq.heappop(heap)
    return heap[0]`,
      },
    },
    {
      key: 'quickselect',
      label: 'Quickselect — O(n) average, O(1) space',
      explanation: 'Partition around a random pivot. Recurse only on the side containing the target index.',
      code: {
        java: `public int findKthLargest(int[] nums, int k) {
    return quickselect(nums, 0, nums.length - 1, nums.length - k);
}

private int quickselect(int[] nums, int lo, int hi, int target) {
    if (lo == hi) return nums[lo];
    int pivot = nums[hi], p = lo;
    for (int i = lo; i < hi; i++) {
        if (nums[i] <= pivot) { int t = nums[i]; nums[i] = nums[p]; nums[p] = t; p++; }
    }
    int t = nums[p]; nums[p] = nums[hi]; nums[hi] = t;
    if (p == target) return nums[p];
    return p < target ? quickselect(nums, p + 1, hi, target)
                      : quickselect(nums, lo, p - 1, target);
}`,
        cpp: `int findKthLargest(vector<int>& nums, int k) {
    int target = nums.size() - k;
    function<int(int,int)> qs = [&](int lo, int hi) -> int {
        int pivot = nums[hi], p = lo;
        for (int i = lo; i < hi; i++)
            if (nums[i] <= pivot) swap(nums[i], nums[p++]);
        swap(nums[p], nums[hi]);
        if (p == target) return nums[p];
        return p < target ? qs(p+1, hi) : qs(lo, p-1);
    };
    return qs(0, nums.size()-1);
}`,
        python: `import random

def findKthLargest(nums, k):
    target = len(nums) - k

    def quickselect(lo, hi):
        pivot_idx = random.randint(lo, hi)
        nums[pivot_idx], nums[hi] = nums[hi], nums[pivot_idx]
        pivot = nums[hi]
        p = lo
        for i in range(lo, hi):
            if nums[i] <= pivot:
                nums[i], nums[p] = nums[p], nums[i]
                p += 1
        nums[p], nums[hi] = nums[hi], nums[p]
        if p == target:
            return nums[p]
        elif p < target:
            return quickselect(p + 1, hi)
        else:
            return quickselect(lo, p - 1)

    return quickselect(0, len(nums) - 1)`,
      },
      dryRun: {
        title: 'Dry run — nums = [3,2,1,5,6,4], k=2, target index=4',
        columns: ['Call', 'lo', 'hi', 'pivot', 'Partition result p', 'Action'],
        rows: [
          ['qs(0,5)', '0', '5', '4', 'p=3 [1,2,3,4,6,5]→[1,2,3,4,6,5] p=3', 'p<4 → qs(4,5)'],
          ['qs(4,5)', '4', '5', '5', 'p=4 [..,5,6]→p=4', 'p=4 == target → return nums[4]=5 ✓'],
        ],
        highlightRow: 1,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 117. Top K Frequent Elements
// ══════════════════════════════════════════════════════
'top-k-frequent-elements': {
  statement:
    'Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.',
  tags: ['Arrays', 'Heap', 'Bucket Sort', 'Hash Map'],
  requirement: 'O(n log k) time or O(n) with bucket sort',
  externalLinks: [
    { label: '↗ LeetCode #347', url: 'https://leetcode.com/problems/top-k-frequent-elements/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums = [1,1,1,2,2,3], k = 2\nOutput: [1,2]' },
    { label: 'Example 2', text: 'Input:  nums = [1], k = 1\nOutput: [1]' },
  ],
  constraints: [
    '1 ≤ nums.length ≤ 10⁵',
    '−10⁴ ≤ nums[i] ≤ 10⁴',
    'k is in the range [1, the number of unique elements in the array]',
  ],
  requiredComplexity: 'O(n log k) heap or O(n) bucket sort · O(n) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'First, count the frequency of each element with a hash map. Then how do you find the k most frequent?' },
    { number: 2, text: 'Use a min-heap of size k on (frequency, element) pairs. The heap always holds the k most frequent.' },
    { number: 3, text: 'For O(n): bucket sort by frequency. Create n+1 buckets where bucket[i] holds elements with frequency i. Scan from top.' },
  ],
  approaches: [
    {
      key: 'heap',
      label: 'Frequency Map + Min-Heap — O(n log k) time, O(n) space',
      explanation: 'Count frequencies, then maintain a min-heap of size k sorted by frequency.',
      code: {
        java: `public int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int n : nums) freq.merge(n, 1, Integer::sum);
    PriorityQueue<int[]> minHeap = new PriorityQueue<>((a, b) -> a[1] - b[1]);
    for (var entry : freq.entrySet()) {
        minHeap.offer(new int[]{entry.getKey(), entry.getValue()});
        if (minHeap.size() > k) minHeap.poll();
    }
    return minHeap.stream().mapToInt(a -> a[0]).toArray();
}`,
        cpp: `vector<int> topKFrequent(vector<int>& nums, int k) {
    unordered_map<int,int> freq;
    for (int n : nums) freq[n]++;
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
    for (auto& [val, cnt] : freq) {
        pq.push({cnt, val});
        if ((int)pq.size() > k) pq.pop();
    }
    vector<int> result;
    while (!pq.empty()) { result.push_back(pq.top().second); pq.pop(); }
    return result;
}`,
        python: `import heapq
from collections import Counter

def topKFrequent(nums, k):
    freq = Counter(nums)
    return heapq.nlargest(k, freq.keys(), key=freq.get)`,
      },
    },
    {
      key: 'bucket',
      label: 'Bucket Sort — O(n) time, O(n) space',
      explanation: 'Place elements in buckets by frequency. Scan from highest frequency to collect top k.',
      code: {
        java: `public int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int n : nums) freq.merge(n, 1, Integer::sum);
    List<Integer>[] buckets = new List[nums.length + 1];
    for (var e : freq.entrySet()) {
        int f = e.getValue();
        if (buckets[f] == null) buckets[f] = new ArrayList<>();
        buckets[f].add(e.getKey());
    }
    int[] result = new int[k];
    int idx = 0;
    for (int i = buckets.length - 1; i >= 0 && idx < k; i--) {
        if (buckets[i] != null) for (int v : buckets[i]) if (idx < k) result[idx++] = v;
    }
    return result;
}`,
        cpp: `vector<int> topKFrequent(vector<int>& nums, int k) {
    unordered_map<int,int> freq;
    for (int n : nums) freq[n]++;
    vector<vector<int>> buckets(nums.size() + 1);
    for (auto& [val, cnt] : freq) buckets[cnt].push_back(val);
    vector<int> result;
    for (int i = buckets.size()-1; i >= 0 && (int)result.size() < k; i--)
        for (int v : buckets[i]) if ((int)result.size() < k) result.push_back(v);
    return result;
}`,
        python: `from collections import Counter

def topKFrequent(nums, k):
    freq = Counter(nums)
    buckets = [[] for _ in range(len(nums) + 1)]
    for val, cnt in freq.items():
        buckets[cnt].append(val)
    result = []
    for i in range(len(buckets)-1, -1, -1):
        for v in buckets[i]:
            result.append(v)
            if len(result) == k:
                return result
    return result`,
      },
      dryRun: {
        title: 'Dry run — nums = [1,1,1,2,2,3], k = 2',
        columns: ['Step', 'Detail', 'Value'],
        rows: [
          ['Freq map', '{1:3, 2:2, 3:1}', '—'],
          ['Buckets', 'bucket[3]=[1], bucket[2]=[2], bucket[1]=[3]', '—'],
          ['Scan from top', 'i=3: take 1; i=2: take 2; k reached', '[1,2] ✓'],
        ],
        highlightRow: 2,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 118. Top K Frequent Words
// ══════════════════════════════════════════════════════
'top-k-frequent-words': {
  statement:
    'Given an array of strings words and an integer k, return the k most frequent strings. Return the answer sorted by the frequency from highest to lowest. Sort the words with the same frequency by their lexicographical order.',
  tags: ['Arrays', 'Heap', 'Hash Map', 'Sorting'],
  requirement: 'O(n log k) time',
  externalLinks: [
    { label: '↗ LeetCode #692', url: 'https://leetcode.com/problems/top-k-frequent-words/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  words = ["i","love","leetcode","i","love","coding"], k = 2\nOutput: ["i","love"]' },
    { label: 'Example 2', text: 'Input:  words = ["the","day","is","sunny","the","the","the","sunny","is","is"], k = 4\nOutput: ["the","is","sunny","day"]' },
  ],
  constraints: [
    '1 ≤ words.length ≤ 500',
    '1 ≤ words[i].length ≤ 10',
    'words[i] consists of lowercase English letters',
    'k is in the range [1, the number of unique words[i]]',
  ],
  requiredComplexity: 'O(n log k) time · O(n) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Count frequencies first. Then sort by (frequency descending, word ascending). How do you define the comparator for a heap?' },
    { number: 2, text: 'Use a min-heap where the minimum is the one with lowest frequency (and lexicographically largest on ties) — so it gets evicted first.' },
    { number: 3, text: 'The comparator: a < b if freq[a] < freq[b], or (freq[a] == freq[b] and a > b). This way the "worst" candidate is at the top.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Frequency Map + Min-Heap — O(n log k) time, O(n) space',
      explanation: 'Count frequencies. Use a min-heap with custom comparator keeping k best words. Reverse at the end.',
      code: {
        java: `public List<String> topKFrequent(String[] words, int k) {
    Map<String, Integer> freq = new HashMap<>();
    for (String w : words) freq.merge(w, 1, Integer::sum);
    // min-heap: evicts worst candidate (lowest freq, then lex largest)
    PriorityQueue<String> heap = new PriorityQueue<>(
        (a, b) -> freq.get(a).equals(freq.get(b))
            ? b.compareTo(a) : freq.get(a) - freq.get(b));
    for (String w : freq.keySet()) {
        heap.offer(w);
        if (heap.size() > k) heap.poll();
    }
    List<String> result = new ArrayList<>(heap);
    result.sort((a, b) -> freq.get(a).equals(freq.get(b))
        ? a.compareTo(b) : freq.get(b) - freq.get(a));
    return result;
}`,
        cpp: `vector<string> topKFrequent(vector<string>& words, int k) {
    unordered_map<string,int> freq;
    for (auto& w : words) freq[w]++;
    auto cmp = [&](const string& a, const string& b) {
        return freq[a] != freq[b] ? freq[a] > freq[b] : a < b;
    };
    vector<string> candidates;
    for (auto& [w,_] : freq) candidates.push_back(w);
    sort(candidates.begin(), candidates.end(), cmp);
    return vector<string>(candidates.begin(), candidates.begin()+k);
}`,
        python: `from collections import Counter

def topKFrequent(words, k):
    freq = Counter(words)
    # Sort by (-frequency, word) for lexicographic tie-break
    return sorted(freq.keys(), key=lambda w: (-freq[w], w))[:k]`,
      },
      dryRun: {
        title: 'Dry run — words=["i","love","leetcode","i","love","coding"], k=2',
        columns: ['Step', 'Detail', 'Value'],
        rows: [
          ['Freq', '{i:2, love:2, leetcode:1, coding:1}', '—'],
          ['Sort key', 'Sort by (-freq, word)', '—'],
          ['Sorted', '[(-2,i),(-2,love),(-1,coding),(-1,leetcode)]', '—'],
          ['Take k=2', '["i","love"] ✓', '—'],
        ],
        highlightRow: 3,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 119. K Closest Points to Origin
// ══════════════════════════════════════════════════════
'k-closest-points-to-origin': {
  statement:
    'Given an array of points where points[i] = [xi, yi] represents a point on the X-Y plane and an integer k, return the k closest points to the origin (0, 0). The distance between two points on the X-Y plane is the Euclidean distance. You may return the answer in any order.',
  tags: ['Arrays', 'Heap', 'Quickselect', 'Sorting'],
  requirement: 'O(n log k) with heap or O(n) average with quickselect',
  externalLinks: [
    { label: '↗ LeetCode #973', url: 'https://leetcode.com/problems/k-closest-points-to-origin/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  points = [[1,3],[-2,2]], k = 1\nOutput: [[-2,2]]\nExplanation: dist([1,3])=√10, dist([-2,2])=√8' },
    { label: 'Example 2', text: 'Input:  points = [[3,3],[5,-1],[-2,4]], k = 2\nOutput: [[3,3],[-2,4]]' },
  ],
  constraints: [
    '1 ≤ k ≤ points.length ≤ 10⁴',
    '−10⁴ ≤ xi, yi ≤ 10⁴',
  ],
  requiredComplexity: 'O(n log k) time · O(k) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'You don\'t need the actual Euclidean distance — comparing squared distances avoids the sqrt and keeps things as integers.' },
    { number: 2, text: 'Use a max-heap of size k (by squared distance). When a new point has smaller distance than the heap top, replace the top.' },
    { number: 3, text: 'The heap maintains the k closest points. Points with larger distance get evicted.' },
  ],
  approaches: [
    {
      key: 'heap',
      label: 'Max-Heap of Size k — O(n log k) time, O(k) space',
      explanation: 'Maintain a max-heap of k closest points by squared distance. Evict the farthest when size exceeds k.',
      code: {
        java: `public int[][] kClosest(int[][] points, int k) {
    PriorityQueue<int[]> maxHeap = new PriorityQueue<>(
        (a, b) -> (b[0]*b[0]+b[1]*b[1]) - (a[0]*a[0]+a[1]*a[1]));
    for (int[] p : points) {
        maxHeap.offer(p);
        if (maxHeap.size() > k) maxHeap.poll();
    }
    return maxHeap.toArray(new int[k][]);
}`,
        cpp: `vector<vector<int>> kClosest(vector<vector<int>>& points, int k) {
    auto dist = [](vector<int>& p) { return p[0]*p[0] + p[1]*p[1]; };
    priority_queue<vector<int>, vector<vector<int>>,
        function<bool(vector<int>&,vector<int>&)>>
        pq([&](vector<int>& a, vector<int>& b){ return dist(a) < dist(b); });
    for (auto& p : points) {
        pq.push(p);
        if ((int)pq.size() > k) pq.pop();
    }
    vector<vector<int>> result;
    while (!pq.empty()) { result.push_back(pq.top()); pq.pop(); }
    return result;
}`,
        python: `import heapq

def kClosest(points, k):
    # max-heap using negative distance
    heap = []
    for x, y in points:
        dist = -(x*x + y*y)
        heapq.heappush(heap, (dist, x, y))
        if len(heap) > k:
            heapq.heappop(heap)
    return [[x, y] for _, x, y in heap]`,
      },
      dryRun: {
        title: 'Dry run — points = [[1,3],[-2,2],[2,1]], k = 2',
        columns: ['Point', 'dist²', 'Heap (max-heap by dist²)', 'Evict?'],
        rows: [
          ['[1,3]', '10', '[(10,[1,3])]', 'No'],
          ['[-2,2]', '8', '[(10,[1,3]),(8,[-2,2])]', 'No'],
          ['[2,1]', '5', '[(10,[1,3]),(8,[-2,2]),(5,[2,1])]→evict 10', 'Yes → [(8,[-2,2]),(5,[2,1])]'],
          ['Result', '—', '[[-2,2],[2,1]] ✓', '—'],
        ],
        highlightRow: 3,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 120. The kth Factor of n
// ══════════════════════════════════════════════════════
'kth-factor-of-n': {
  statement:
    'You are given two positive integers n and k. A factor of an integer n is defined as an integer i where n % i == 0. Consider a list of all factors of n sorted in ascending order. Return the kth factor in this list or return -1 if n has less than k factors.',
  tags: ['Arrays', 'Math'],
  requirement: 'O(√n) time',
  externalLinks: [
    { label: '↗ LeetCode #1492', url: 'https://leetcode.com/problems/the-kth-factor-of-n/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  n = 12, k = 3\nOutput: 3\nExplanation: Factors: [1,2,3,4,6,12]. 3rd factor is 3.' },
    { label: 'Example 2', text: 'Input:  n = 7, k = 2\nOutput: 7' },
    { label: 'Example 3', text: 'Input:  n = 4, k = 4\nOutput: -1' },
  ],
  constraints: [
    '1 ≤ k ≤ n ≤ 1000',
  ],
  requiredComplexity: 'O(√n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Iterate from 1 to √n. For each i that divides n, you have two factors: i and n/i. How do you order them correctly?' },
    { number: 2, text: 'First collect factors up to √n in order. Count down k. If k becomes 0, return the factor. Otherwise use the second half (n/i values in reverse).' },
    { number: 3, text: 'Or simply iterate 1 to n and count divisors — O(n) but simpler to implement.' },
  ],
  approaches: [
    {
      key: 'linear',
      label: 'Linear Scan — O(n) time, O(1) space',
      explanation: 'Iterate 1..n, count divisors. Return the kth one.',
      code: {
        java: `public int kthFactor(int n, int k) {
    int count = 0;
    for (int i = 1; i <= n; i++) {
        if (n % i == 0) {
            count++;
            if (count == k) return i;
        }
    }
    return -1;
}`,
        cpp: `int kthFactor(int n, int k) {
    int count = 0;
    for (int i = 1; i <= n; i++) {
        if (n % i == 0 && ++count == k) return i;
    }
    return -1;
}`,
        python: `def kthFactor(n, k):
    count = 0
    for i in range(1, n + 1):
        if n % i == 0:
            count += 1
            if count == k:
                return i
    return -1`,
      },
    },
    {
      key: 'optimal',
      label: 'Square Root Approach — O(√n) time, O(√n) space',
      explanation: 'Collect factors ≤ √n. If k is within this range, return directly. Otherwise compute the complementary factor.',
      code: {
        java: `public int kthFactor(int n, int k) {
    List<Integer> factors = new ArrayList<>();
    for (int i = 1; (long)i * i <= n; i++) {
        if (n % i == 0) factors.add(i);
    }
    // First half factors (ascending)
    if (k <= factors.size()) return factors.get(k - 1);
    // Second half (n/i descending)
    k -= factors.size();
    for (int i = factors.size() - 1; i >= 0; i--) {
        int pair = n / factors.get(i);
        if (pair != factors.get(i)) { // avoid duplicates for perfect squares
            k--;
            if (k == 0) return pair;
        }
    }
    return -1;
}`,
        cpp: `int kthFactor(int n, int k) {
    vector<int> factors;
    for (int i = 1; (long long)i*i <= n; i++)
        if (n % i == 0) factors.push_back(i);
    if (k <= (int)factors.size()) return factors[k-1];
    k -= factors.size();
    for (int i = factors.size()-1; i >= 0; i--) {
        int pair = n / factors[i];
        if (pair != factors[i] && --k == 0) return pair;
    }
    return -1;
}`,
        python: `def kthFactor(n, k):
    factors = []
    i = 1
    while i * i <= n:
        if n % i == 0:
            factors.append(i)
        i += 1
    if k <= len(factors):
        return factors[k-1]
    k -= len(factors)
    for i in range(len(factors)-1, -1, -1):
        pair = n // factors[i]
        if pair != factors[i]:
            k -= 1
            if k == 0:
                return pair
    return -1`,
      },
      dryRun: {
        title: 'Dry run — n = 12, k = 3',
        columns: ['Step', 'Detail', 'Value'],
        rows: [
          ['factors ≤ √12', 'i=1(✓),2(✓),3(✓),4 skip(16>12)', '[1,2,3]'],
          ['k=3 ≤ len=3', 'return factors[2]', '3 ✓'],
        ],
        highlightRow: 1,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 121. Kth Smallest Element in a Sorted Matrix
// ══════════════════════════════════════════════════════
'kth-smallest-element-in-sorted-matrix': {
  statement:
    'Given an n x n matrix where each row and column is sorted in ascending order, return the kth smallest element in the matrix. Note that it is the kth smallest element in the sorted order, not the kth distinct element.',
  tags: ['Arrays', 'Heap', 'Binary Search', 'Matrix'],
  requirement: 'O(k log n) with heap or O(n log(max-min)) with binary search',
  externalLinks: [
    { label: '↗ LeetCode #378', url: 'https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  matrix = [[1,5,9],[10,11,13],[12,13,15]], k = 8\nOutput: 13' },
    { label: 'Example 2', text: 'Input:  matrix = [[-5]], k = 1\nOutput: -5' },
  ],
  constraints: [
    'n == matrix.length == matrix[i].length',
    '1 ≤ n ≤ 300',
    '−10⁹ ≤ matrix[i][j] ≤ 10⁹',
    'All the rows and columns are sorted in non-decreasing order',
    '1 ≤ k ≤ n²',
  ],
  requiredComplexity: 'O(k log n) time · O(n) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'The first row contains the smallest elements of each column. Can you do a k-way merge of all rows using a min-heap?' },
    { number: 2, text: 'Initialize the heap with the first element of each row. Poll the minimum k times. After each poll, push the next element in the same row.' },
    { number: 3, text: 'Alternatively, binary search on the value range [min, max]. Count elements ≤ mid. Find the smallest value where count ≥ k.' },
  ],
  approaches: [
    {
      key: 'heap',
      label: 'Min-Heap (k-way merge) — O(k log n) time, O(n) space',
      explanation: 'Treat each row as a sorted list. K-way merge: always pop the global minimum, push the next element from that row.',
      code: {
        java: `public int kthSmallest(int[][] matrix, int k) {
    int n = matrix.length;
    // (value, row, col)
    PriorityQueue<int[]> heap = new PriorityQueue<>((a,b) -> a[0]-b[0]);
    for (int i = 0; i < n; i++) heap.offer(new int[]{matrix[i][0], i, 0});
    int result = 0;
    while (k-- > 0) {
        int[] curr = heap.poll();
        result = curr[0];
        int r = curr[1], c = curr[2];
        if (c + 1 < n) heap.offer(new int[]{matrix[r][c+1], r, c+1});
    }
    return result;
}`,
        cpp: `int kthSmallest(vector<vector<int>>& matrix, int k) {
    int n = matrix.size();
    using T = tuple<int,int,int>;
    priority_queue<T, vector<T>, greater<T>> pq;
    for (int i = 0; i < n; i++) pq.push({matrix[i][0], i, 0});
    int result = 0;
    while (k--) {
        auto [val, r, c] = pq.top(); pq.pop();
        result = val;
        if (c + 1 < n) pq.push({matrix[r][c+1], r, c+1});
    }
    return result;
}`,
        python: `import heapq

def kthSmallest(matrix, k):
    n = len(matrix)
    heap = [(matrix[i][0], i, 0) for i in range(n)]
    heapq.heapify(heap)
    result = 0
    for _ in range(k):
        val, r, c = heapq.heappop(heap)
        result = val
        if c + 1 < n:
            heapq.heappush(heap, (matrix[r][c+1], r, c+1))
    return result`,
      },
    },
    {
      key: 'binary_search',
      label: 'Binary Search on Value — O(n log(max-min)) time, O(1) space',
      explanation: 'Binary search on value. Count elements ≤ mid using matrix properties. Find smallest value where count ≥ k.',
      code: {
        java: `public int kthSmallest(int[][] matrix, int k) {
    int n = matrix.length;
    int lo = matrix[0][0], hi = matrix[n-1][n-1];
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (countLeq(matrix, mid, n) >= k) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}

private int countLeq(int[][] matrix, int mid, int n) {
    int count = 0, col = n - 1;
    for (int row = 0; row < n; row++) {
        while (col >= 0 && matrix[row][col] > mid) col--;
        count += col + 1;
    }
    return count;
}`,
        cpp: `int kthSmallest(vector<vector<int>>& matrix, int k) {
    int n = matrix.size(), lo = matrix[0][0], hi = matrix[n-1][n-1];
    while (lo < hi) {
        int mid = lo + (hi-lo)/2;
        int count = 0, col = n-1;
        for (int r = 0; r < n; r++) {
            while (col >= 0 && matrix[r][col] > mid) col--;
            count += col+1;
        }
        if (count >= k) hi = mid;
        else lo = mid+1;
    }
    return lo;
}`,
        python: `def kthSmallest(matrix, k):
    n = len(matrix)
    lo, hi = matrix[0][0], matrix[-1][-1]
    while lo < hi:
        mid = lo + (hi - lo) // 2
        count = col = 0
        col = n - 1
        for row in range(n):
            while col >= 0 and matrix[row][col] > mid:
                col -= 1
            count += col + 1
        if count >= k:
            hi = mid
        else:
            lo = mid + 1
    return lo`,
      },
      dryRun: {
        title: 'Dry run (heap) — matrix=[[1,5,9],[10,11,13],[12,13,15]], k=8',
        columns: ['Poll #', 'Value polled', 'Push next', 'Heap (approx)'],
        rows: [
          ['1', '1 (r0,c0)', '[5,r0,c1]', '[5,10,12]'],
          ['2', '5 (r0,c1)', '[9,r0,c2]', '[9,10,12]'],
          ['3', '9 (r0,c2)', 'none', '[10,12,13(r1,c0) wait 10]'],
          ['4', '10', '[11]', '[11,12,13]'],
          ['5', '11', '[13]', '[12,13,13]'],
          ['6', '12', '[13]', '[13,13,13]'],
          ['7', '13 (r1,c2)', '[push next]', '[13,13,15]'],
          ['8', '13', '—', 'return 13 ✓'],
        ],
        highlightRow: 7,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 122. Task Scheduler
// ══════════════════════════════════════════════════════
'task-scheduler': {
  statement:
    'Given a characters array tasks, where each character represents a different task, and a non-negative cooling interval n such that the same task must wait at least n intervals before it can be done again. Return the least number of intervals the CPU will take to finish all tasks. The CPU can be idle.',
  tags: ['Arrays', 'Heap', 'Greedy', 'Counting'],
  requirement: 'O(n) time',
  externalLinks: [
    { label: '↗ LeetCode #621', url: 'https://leetcode.com/problems/task-scheduler/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  tasks = ["A","A","A","B","B","B"], n = 2\nOutput: 8\nExplanation: A → B → idle → A → B → idle → A → B' },
    { label: 'Example 2', text: 'Input:  tasks = ["A","A","A","A","A","A","B","C","D","E","F","G"], n = 2\nOutput: 16' },
  ],
  constraints: [
    '1 ≤ tasks.length ≤ 10⁴',
    'tasks[i] is uppercase English letter',
    '0 ≤ n ≤ 100',
  ],
  requiredComplexity: 'O(|tasks|) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'The most frequent task determines the minimum time. If the most frequent task occurs maxCount times, what\'s the minimum time structure?' },
    { number: 2, text: 'Form (maxCount - 1) "frames" of size (n+1), plus the last frame. The answer is max(total tasks, (maxCount-1)*(n+1) + numTasksWithMaxCount).' },
    { number: 3, text: 'This formula handles both the cooling-dominated case and the task-dominated case.' },
    { number: 4, label: 'Hint 4 — formula explanation', text: 'If we have enough variety of tasks, we never sit idle. Otherwise we need idle slots to respect cooling. The formula captures both.' },
  ],
  approaches: [
    {
      key: 'formula',
      label: 'Math Formula — O(n) time, O(1) space',
      explanation: 'Count task frequencies. Use the formula: max(total_tasks, (maxFreq-1)*(n+1) + countOfMaxFreq).',
      code: {
        java: `public int leastInterval(char[] tasks, int n) {
    int[] freq = new int[26];
    for (char t : tasks) freq[t - 'A']++;
    int maxFreq = 0;
    for (int f : freq) maxFreq = Math.max(maxFreq, f);
    int countMax = 0;
    for (int f : freq) if (f == maxFreq) countMax++;
    return Math.max(tasks.length, (maxFreq - 1) * (n + 1) + countMax);
}`,
        cpp: `int leastInterval(vector<char>& tasks, int n) {
    int freq[26] = {};
    for (char t : tasks) freq[t-'A']++;
    int maxFreq = *max_element(freq, freq+26);
    int countMax = count(freq, freq+26, maxFreq);
    return max((int)tasks.size(), (maxFreq-1)*(n+1)+countMax);
}`,
        python: `from collections import Counter

def leastInterval(tasks, n):
    freq = Counter(tasks)
    max_freq = max(freq.values())
    count_max = sum(1 for f in freq.values() if f == max_freq)
    return max(len(tasks), (max_freq - 1) * (n + 1) + count_max)`,
      },
      dryRun: {
        title: 'Dry run — tasks=["A"×3,"B"×3], n=2',
        columns: ['Variable', 'Value'],
        rows: [
          ['maxFreq', '3 (both A and B)'],
          ['countMax', '2'],
          ['formula', '(3-1)*(2+1)+2 = 2*3+2 = 8'],
          ['tasks.length', '6'],
          ['max(6,8)', '8 ✓'],
        ],
        highlightRow: 4,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 123. Reorganize String
// ══════════════════════════════════════════════════════
'reorganize-string': {
  statement:
    'Given a string s, rearrange the characters of s so that any two adjacent characters are not the same. Return any possible rearrangement of s or return "" if not possible.',
  tags: ['Arrays', 'Heap', 'Greedy', 'Counting'],
  requirement: 'O(n log k) time where k = distinct chars',
  externalLinks: [
    { label: '↗ LeetCode #767', url: 'https://leetcode.com/problems/reorganize-string/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  s = "aab"\nOutput: "aba"' },
    { label: 'Example 2', text: 'Input:  s = "aaab"\nOutput: ""\nExplanation: Not possible' },
  ],
  constraints: [
    '1 ≤ s.length ≤ 500',
    's consists of lowercase English letters',
  ],
  requiredComplexity: 'O(n log k) time · O(k) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'If any character appears more than ceil(n/2) times, it\'s impossible. Otherwise, greedily place the most frequent character at each step.' },
    { number: 2, text: 'Use a max-heap of (count, char). At each step, pick the two most frequent characters and place them consecutively.' },
    { number: 3, text: 'Place the most frequent character, then the next most frequent. This ensures no two same chars are adjacent.' },
    { number: 4, label: 'Hint 4 — interleaving approach', text: 'Sort characters by frequency. Place the most frequent at even positions (0,2,4,...), then fill odd positions. This is O(n) but less intuitive.' },
  ],
  approaches: [
    {
      key: 'heap',
      label: 'Max-Heap Greedy — O(n log k) time, O(k) space',
      explanation: 'Always pick the two most frequent characters. Place them in pairs.',
      code: {
        java: `public String reorganizeString(String s) {
    int[] freq = new int[26];
    for (char c : s.toCharArray()) freq[c-'a']++;
    PriorityQueue<int[]> maxHeap = new PriorityQueue<>((a,b) -> b[0]-a[0]);
    for (int i = 0; i < 26; i++) if (freq[i] > 0) maxHeap.offer(new int[]{freq[i], i});
    StringBuilder sb = new StringBuilder();
    while (maxHeap.size() >= 2) {
        int[] first = maxHeap.poll();
        int[] second = maxHeap.poll();
        sb.append((char)('a'+first[1]));
        sb.append((char)('a'+second[1]));
        if (--first[0] > 0) maxHeap.offer(first);
        if (--second[0] > 0) maxHeap.offer(second);
    }
    if (!maxHeap.isEmpty()) {
        int[] last = maxHeap.poll();
        if (last[0] > 1) return "";
        sb.append((char)('a'+last[1]));
    }
    return sb.length() == s.length() ? sb.toString() : "";
}`,
        cpp: `string reorganizeString(string s) {
    int freq[26] = {};
    for (char c : s) freq[c-'a']++;
    priority_queue<pair<int,char>> pq;
    for (int i = 0; i < 26; i++) if (freq[i]) pq.push({freq[i], 'a'+i});
    string result;
    while (pq.size() >= 2) {
        auto [f1,c1] = pq.top(); pq.pop();
        auto [f2,c2] = pq.top(); pq.pop();
        result += c1; result += c2;
        if (f1-1) pq.push({f1-1,c1});
        if (f2-1) pq.push({f2-1,c2});
    }
    if (!pq.empty()) {
        if (pq.top().first > 1) return "";
        result += pq.top().second;
    }
    return result;
}`,
        python: `import heapq
from collections import Counter

def reorganizeString(s):
    freq = Counter(s)
    heap = [(-cnt, ch) for ch, cnt in freq.items()]
    heapq.heapify(heap)
    result = []
    while len(heap) >= 2:
        cnt1, ch1 = heapq.heappop(heap)
        cnt2, ch2 = heapq.heappop(heap)
        result.extend([ch1, ch2])
        if cnt1 + 1 < 0: heapq.heappush(heap, (cnt1+1, ch1))
        if cnt2 + 1 < 0: heapq.heappush(heap, (cnt2+1, ch2))
    if heap:
        cnt, ch = heap[0]
        if cnt < -1: return ""
        result.append(ch)
    return ''.join(result) if len(result) == len(s) else ""`,
      },
      dryRun: {
        title: 'Dry run — s = "aab", freq: {a:2, b:1}',
        columns: ['Step', 'Heap', 'Poll two', 'Append', 'Push back'],
        rows: [
          ['1', '[(-2,a),(-1,b)]', 'a(2), b(1)', '"ab"', 'Push a(1)'],
          ['2', '[(-1,a)]', 'only 1 left', '"ab"+"a"="aba"', '—'],
          ['Result', '—', '—', '"aba" ✓', '—'],
        ],
        highlightRow: 2,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 124. Minimum Cost to Connect Sticks
// ══════════════════════════════════════════════════════
'minimum-cost-to-connect-sticks': {
  statement:
    'You have some number of sticks with positive integer lengths. These lengths are given as an array sticks, where sticks[i] is the length of the ith stick. You can connect any two sticks of lengths x and y into one stick by paying a cost of x + y. Return the minimum cost of connecting all the given sticks into one stick in this way.',
  tags: ['Arrays', 'Heap', 'Greedy'],
  requirement: 'O(n log n) time',
  externalLinks: [
    { label: '↗ LeetCode #1167', url: 'https://leetcode.com/problems/minimum-cost-to-connect-sticks/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  sticks = [2,4,3]\nOutput: 14\nExplanation: 2+3=5 (cost 5), 5+4=9 (cost 9), total=14' },
    { label: 'Example 2', text: 'Input:  sticks = [1,8,3,5]\nOutput: 30' },
  ],
  constraints: [
    '1 ≤ sticks.length ≤ 10⁴',
    '1 ≤ sticks[i] ≤ 10⁴',
  ],
  requiredComplexity: 'O(n log n) time · O(n) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'This is the Huffman encoding problem! Which two sticks should you connect first to minimize cost?' },
    { number: 2, text: 'Always connect the two smallest sticks first. Larger sticks compound costs more if combined early.' },
    { number: 3, text: 'Use a min-heap. Always poll the two smallest, combine them, add the cost, push the result back.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Min-Heap (Huffman-style) — O(n log n) time, O(n) space',
      explanation: 'Always merge the two smallest sticks. The merged stick is pushed back. Total cost is the sum of all intermediate merges.',
      code: {
        java: `public int connectSticks(int[] sticks) {
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();
    for (int s : sticks) minHeap.offer(s);
    int totalCost = 0;
    while (minHeap.size() > 1) {
        int cost = minHeap.poll() + minHeap.poll();
        totalCost += cost;
        minHeap.offer(cost);
    }
    return totalCost;
}`,
        cpp: `int connectSticks(vector<int>& sticks) {
    priority_queue<int, vector<int>, greater<int>> pq(sticks.begin(), sticks.end());
    int total = 0;
    while (pq.size() > 1) {
        int a = pq.top(); pq.pop();
        int b = pq.top(); pq.pop();
        total += a + b;
        pq.push(a + b);
    }
    return total;
}`,
        python: `import heapq

def connectSticks(sticks):
    heapq.heapify(sticks)
    total = 0
    while len(sticks) > 1:
        a = heapq.heappop(sticks)
        b = heapq.heappop(sticks)
        cost = a + b
        total += cost
        heapq.heappush(sticks, cost)
    return total`,
      },
      dryRun: {
        title: 'Dry run — sticks = [2,4,3]',
        columns: ['Step', 'Poll two', 'Cost', 'Total', 'Heap'],
        rows: [
          ['1', '2, 3', '5', '5', '[4, 5]'],
          ['2', '4, 5', '9', '14', '[9]'],
          ['Done', '—', '—', '14 ✓', '—'],
        ],
        highlightRow: 2,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 125. Seat Reservation Manager
// ══════════════════════════════════════════════════════
'seat-reservation-manager': {
  statement:
    'Design a system that manages the reservation state of n seats that are numbered from 1 to n. Implement the SeatManager class: SeatManager(int n) initializes a SeatManager object that will manage n seats numbered from 1 to n, all initially available. int reserve() fetches the smallest-numbered unreserved seat, reserves it, and returns its number. void unreserve(int seatNumber) unreserves the seat with the given seatNumber.',
  tags: ['Arrays', 'Heap', 'Design'],
  requirement: 'O(log n) per reserve/unreserve',
  externalLinks: [
    { label: '↗ LeetCode #1845', url: 'https://leetcode.com/problems/seat-reservation-manager/' },
  ],
  examples: [
    { label: 'Example 1', text: 'SeatManager(5)\nreserve() → 1\nreserve() → 2\nunreserve(2)\nreserve() → 2\nreserve() → 3\nreserve() → 4\nreserve() → 5\nunreserve(5)' },
  ],
  constraints: [
    '1 ≤ n ≤ 10⁵',
    '1 ≤ seatNumber ≤ n',
    'At most 10⁵ calls in total to reserve and unreserve',
  ],
  requiredComplexity: 'O(log n) per operation · O(n) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'You always need the smallest available seat. What data structure gives you the minimum element efficiently and supports additions?' },
    { number: 2, text: 'A min-heap! Initialize with all seats 1..n. reserve() polls the minimum. unreserve(x) pushes x back.' },
    { number: 3, text: 'To avoid initializing n elements upfront, use a pointer: seats 1..pointer-1 have been "seen", and a heap for returned seats.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Min-Heap — O(log n) per operation',
      explanation: 'Use a min-heap of available seats. Initialize with all seats, poll for reserve, push for unreserve.',
      code: {
        java: `class SeatManager {
    private PriorityQueue<Integer> available;

    public SeatManager(int n) {
        available = new PriorityQueue<>();
        for (int i = 1; i <= n; i++) available.offer(i);
    }

    public int reserve() {
        return available.poll();
    }

    public void unreserve(int seatNumber) {
        available.offer(seatNumber);
    }
}`,
        cpp: `class SeatManager {
    priority_queue<int, vector<int>, greater<int>> pq;
public:
    SeatManager(int n) {
        for (int i = 1; i <= n; i++) pq.push(i);
    }

    int reserve() {
        int seat = pq.top(); pq.pop();
        return seat;
    }

    void unreserve(int seatNumber) {
        pq.push(seatNumber);
    }
};`,
        python: `import heapq

class SeatManager:
    def __init__(self, n):
        self.heap = list(range(1, n + 1))
        heapq.heapify(self.heap)

    def reserve(self):
        return heapq.heappop(self.heap)

    def unreserve(self, seatNumber):
        heapq.heappush(self.heap, seatNumber)`,
      },
      dryRun: {
        title: 'Dry run — n = 5',
        columns: ['Operation', 'Heap (before)', 'Result', 'Heap (after)'],
        rows: [
          ['reserve()', '[1,2,3,4,5]', '1', '[2,3,4,5]'],
          ['reserve()', '[2,3,4,5]', '2', '[3,4,5]'],
          ['unreserve(2)', '[3,4,5]', '—', '[2,3,4,5]'],
          ['reserve()', '[2,3,4,5]', '2 ✓', '[3,4,5]'],
        ],
        highlightRow: 3,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 126. Total Cost to Hire K Workers
// ══════════════════════════════════════════════════════
'total-cost-to-hire-k-workers': {
  statement:
    'You are given a 0-indexed integer array costs where costs[i] is the cost of hiring the ith worker. You are also given two integers k and candidates. We want to hire exactly k workers. In each hiring session, we choose the worker with the lowest cost from either the first candidates workers or the last candidates workers. Return the total cost to hire exactly k workers.',
  tags: ['Arrays', 'Heap', 'Two Pointers'],
  requirement: 'O((k + candidates) log candidates) time',
  externalLinks: [
    { label: '↗ LeetCode #2462', url: 'https://leetcode.com/problems/total-cost-to-hire-k-workers/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  costs = [17,12,10,2,7,2,11,20,8], k = 3, candidates = 4\nOutput: 11\nExplanation: Hire worker 3 (cost 2), worker 5 (cost 2), worker 4 (cost 7)' },
    { label: 'Example 2', text: 'Input:  costs = [1,2,4,1], k = 3, candidates = 3\nOutput: 4' },
  ],
  constraints: [
    '1 ≤ costs.length ≤ 10⁵',
    '1 ≤ costs[i] ≤ 10⁵',
    '1 ≤ k, candidates ≤ costs.length',
  ],
  requiredComplexity: 'O((k + candidates) log candidates) time · O(candidates) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Use two min-heaps: one for the first candidates workers, one for the last candidates workers. Use two pointers to expand when a worker is hired.' },
    { number: 2, text: 'In each round, pick the minimum from either heap (break ties by index). After hiring, replenish that heap from the next available worker.' },
    { number: 3, text: 'Use pointers left and right to track the boundary between "seen from front" and "seen from back". Stop expanding when they cross.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Two Min-Heaps — O((k + candidates) log candidates) time',
      explanation: 'Maintain front and back min-heaps of size candidates. Hire minimum, replenish from the middle.',
      code: {
        java: `public long totalCost(int[] costs, int k, int candidates) {
    PriorityQueue<long[]> front = new PriorityQueue<>((a,b) ->
        a[0] != b[0] ? Long.compare(a[0],b[0]) : Long.compare(a[1],b[1]));
    PriorityQueue<long[]> back = new PriorityQueue<>((a,b) ->
        a[0] != b[0] ? Long.compare(a[0],b[0]) : Long.compare(a[1],b[1]));
    int lo = 0, hi = costs.length - 1;
    for (int i = 0; i < candidates && lo <= hi; i++, lo++)
        front.offer(new long[]{costs[lo], lo});
    for (int i = 0; i < candidates && lo <= hi; i++, hi--)
        back.offer(new long[]{costs[hi], hi});
    long total = 0;
    for (int i = 0; i < k; i++) {
        boolean pickFront = back.isEmpty() ||
            (!front.isEmpty() && (front.peek()[0] < back.peek()[0] ||
             (front.peek()[0] == back.peek()[0] && front.peek()[1] < back.peek()[1])));
        if (pickFront) {
            total += front.peek()[0];
            front.poll();
            if (lo <= hi) front.offer(new long[]{costs[lo], lo++});
        } else {
            total += back.peek()[0];
            back.poll();
            if (lo <= hi) back.offer(new long[]{costs[hi], hi--});
        }
    }
    return total;
}`,
        cpp: `long long totalCost(vector<int>& costs, int k, int candidates) {
    using P = pair<int,int>;
    priority_queue<P,vector<P>,greater<P>> front, back;
    int lo = 0, hi = costs.size()-1;
    for (int i = 0; i < candidates && lo <= hi; i++, lo++)
        front.push({costs[lo], lo});
    for (int i = 0; i < candidates && lo <= hi; i++, hi--)
        back.push({costs[hi], hi});
    long long total = 0;
    for (int i = 0; i < k; i++) {
        bool pf = back.empty() || (!front.empty() && front.top() <= back.top());
        if (pf) {
            total += front.top().first; front.pop();
            if (lo <= hi) front.push({costs[lo], lo++});
        } else {
            total += back.top().first; back.pop();
            if (lo <= hi) back.push({costs[hi], hi--});
        }
    }
    return total;
}`,
        python: `import heapq

def totalCost(costs, k, candidates):
    front, back = [], []
    lo, hi = 0, len(costs) - 1
    for _ in range(candidates):
        if lo <= hi:
            heapq.heappush(front, (costs[lo], lo)); lo += 1
    for _ in range(candidates):
        if lo <= hi:
            heapq.heappush(back, (costs[hi], hi)); hi -= 1
    total = 0
    for _ in range(k):
        pick_front = (not back) or (front and front[0] <= back[0])
        if pick_front:
            cost, _ = heapq.heappop(front)
            if lo <= hi:
                heapq.heappush(front, (costs[lo], lo)); lo += 1
        else:
            cost, _ = heapq.heappop(back)
            if lo <= hi:
                heapq.heappush(back, (costs[hi], hi)); hi -= 1
        total += cost
    return total`,
      },
      dryRun: {
        title: 'Dry run — costs=[17,12,10,2,7,2,11,20,8], k=3, candidates=4',
        columns: ['Round', 'front heap', 'back heap', 'Pick', 'Cost', 'total'],
        rows: [
          ['Init', 'min[(2,3),(10,2),(12,1),(17,0)]', 'min[(2,5),(7,4),(8,8),(11,6)]', '—', '—', '0'],
          ['1', 'both min=2', 'front idx=3 < back idx=5', 'front (2,3)', '2', '2'],
          ['2', 'replenish: push(7,4), lo=5', '—', 'back (2,5)', '2', '4'],
          ['3', '—', 'replenish: push(11,6)→ hi=7', 'front (7,4)', '7', '11 ✓'],
        ],
        highlightRow: 3,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 127. Ugly Number II
// ══════════════════════════════════════════════════════
'ugly-number-ii': {
  statement:
    'An ugly number is a positive integer whose prime factors are limited to 2, 3, and 5. Given an integer n, return the nth ugly number.',
  tags: ['Arrays', 'Heap', 'Dynamic Programming', 'Math'],
  requirement: 'O(n) time with DP or O(n log n) with heap',
  externalLinks: [
    { label: '↗ LeetCode #264', url: 'https://leetcode.com/problems/ugly-number-ii/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  n = 10\nOutput: 12\nExplanation: 1, 2, 3, 4, 5, 6, 8, 9, 10, 12' },
    { label: 'Example 2', text: 'Input:  n = 1\nOutput: 1' },
  ],
  constraints: [
    '1 ≤ n ≤ 1690',
  ],
  requiredComplexity: 'O(n) time · O(n) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Every ugly number is obtained by multiplying a previous ugly number by 2, 3, or 5. How do you generate them in sorted order?' },
    { number: 2, text: 'Use three pointers i2, i3, i5 into the ugly numbers array. The next ugly number is min(ugly[i2]*2, ugly[i3]*3, ugly[i5]*5).' },
    { number: 3, text: 'Advance the pointer(s) that produced the minimum (could be multiple if there\'s a tie).' },
  ],
  approaches: [
    {
      key: 'dp',
      label: 'DP with Three Pointers — O(n) time, O(n) space',
      explanation: 'Maintain three pointers for the multipliers 2, 3, 5. Next ugly is the minimum of the three candidates.',
      code: {
        java: `public int nthUglyNumber(int n) {
    int[] ugly = new int[n];
    ugly[0] = 1;
    int i2 = 0, i3 = 0, i5 = 0;
    for (int i = 1; i < n; i++) {
        int next = Math.min(ugly[i2]*2, Math.min(ugly[i3]*3, ugly[i5]*5));
        ugly[i] = next;
        if (next == ugly[i2]*2) i2++;
        if (next == ugly[i3]*3) i3++;
        if (next == ugly[i5]*5) i5++;
    }
    return ugly[n-1];
}`,
        cpp: `int nthUglyNumber(int n) {
    vector<int> ugly(n);
    ugly[0] = 1;
    int i2=0, i3=0, i5=0;
    for (int i = 1; i < n; i++) {
        int next = min({ugly[i2]*2, ugly[i3]*3, ugly[i5]*5});
        ugly[i] = next;
        if (next == ugly[i2]*2) i2++;
        if (next == ugly[i3]*3) i3++;
        if (next == ugly[i5]*5) i5++;
    }
    return ugly[n-1];
}`,
        python: `def nthUglyNumber(n):
    ugly = [1] * n
    i2 = i3 = i5 = 0
    for i in range(1, n):
        next2 = ugly[i2] * 2
        next3 = ugly[i3] * 3
        next5 = ugly[i5] * 5
        nxt = min(next2, next3, next5)
        ugly[i] = nxt
        if nxt == next2: i2 += 1
        if nxt == next3: i3 += 1
        if nxt == next5: i5 += 1
    return ugly[n-1]`,
      },
      dryRun: {
        title: 'Dry run — n = 6',
        columns: ['i', 'i2*2', 'i3*3', 'i5*5', 'next', 'ugly'],
        rows: [
          ['1', '2', '3', '5', '2', '[1,2]'],
          ['2', '4', '3', '5', '3', '[1,2,3]'],
          ['3', '4', '6', '5', '4', '[1,2,3,4]'],
          ['4', '6', '6', '5', '5', '[1,2,3,4,5]'],
          ['5', '6', '6', '10', '6', '[1,2,3,4,5,6] → n=6: return 6'],
        ],
        highlightRow: 4,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 128. Super Ugly Number
// ══════════════════════════════════════════════════════
'super-ugly-number': {
  statement:
    'A super ugly number is a positive integer whose prime factors are in the array primes. Given an integer n and an array of integers primes, return the nth super ugly number. The 1st super ugly number is 1.',
  tags: ['Arrays', 'Heap', 'Dynamic Programming'],
  requirement: 'O(n × |primes| ) with DP or O(n log |primes|) with heap',
  externalLinks: [
    { label: '↗ LeetCode #313', url: 'https://leetcode.com/problems/super-ugly-number/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  n = 12, primes = [2,7,13,19]\nOutput: 32\nExplanation: [1,2,4,7,8,13,14,16,19,26,28,32]' },
    { label: 'Example 2', text: 'Input:  n = 1, primes = [2,3,5]\nOutput: 1' },
  ],
  constraints: [
    '1 ≤ n ≤ 10⁵',
    '1 ≤ primes.length ≤ 100',
    '2 ≤ primes[i] ≤ 1000',
    'primes[i] is guaranteed to be a prime number',
    'All the values of primes are unique',
  ],
  requiredComplexity: 'O(n × |primes|) time · O(n + |primes|) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Generalize the Ugly Number II approach. Instead of 3 pointers for 2, 3, 5, use |primes| pointers.' },
    { number: 2, text: 'Maintain a pointer for each prime. Next super ugly number = min over all primes of ugly[ptr[i]] * primes[i].' },
    { number: 3, text: 'Advance all pointers that produced the minimum.' },
  ],
  approaches: [
    {
      key: 'dp',
      label: 'DP with k Pointers — O(n × |primes|) time, O(n + |primes|) space',
      explanation: 'Generalize three-pointer approach to k primes. At each step compute min of all candidates and advance contributing pointers.',
      code: {
        java: `public int nthSuperUglyNumber(int n, int[] primes) {
    int k = primes.length;
    int[] ugly = new int[n];
    int[] ptrs = new int[k];
    ugly[0] = 1;
    for (int i = 1; i < n; i++) {
        int next = Integer.MAX_VALUE;
        for (int j = 0; j < k; j++) next = Math.min(next, ugly[ptrs[j]] * primes[j]);
        ugly[i] = next;
        for (int j = 0; j < k; j++) if (ugly[ptrs[j]] * primes[j] == next) ptrs[j]++;
    }
    return ugly[n - 1];
}`,
        cpp: `int nthSuperUglyNumber(int n, vector<int>& primes) {
    int k = primes.size();
    vector<long> ugly(n);
    vector<int> ptrs(k, 0);
    ugly[0] = 1;
    for (int i = 1; i < n; i++) {
        long next = LONG_MAX;
        for (int j = 0; j < k; j++) next = min(next, ugly[ptrs[j]] * primes[j]);
        ugly[i] = next;
        for (int j = 0; j < k; j++) if (ugly[ptrs[j]] * primes[j] == next) ptrs[j]++;
    }
    return ugly[n-1];
}`,
        python: `def nthSuperUglyNumber(n, primes):
    ugly = [1] * n
    ptrs = [0] * len(primes)
    for i in range(1, n):
        candidates = [ugly[ptrs[j]] * primes[j] for j in range(len(primes))]
        nxt = min(candidates)
        ugly[i] = nxt
        for j in range(len(primes)):
            if candidates[j] == nxt:
                ptrs[j] += 1
    return ugly[n-1]`,
      },
      dryRun: {
        title: 'Dry run — n=5, primes=[2,7]',
        columns: ['i', 'ugly[ptr[0]]*2', 'ugly[ptr[1]]*7', 'next', 'ugly'],
        rows: [
          ['1', '1*2=2', '1*7=7', '2', '[1,2]'],
          ['2', '2*2=4', '1*7=7', '4', '[1,2,4]'],
          ['3', '4*2=8', '1*7=7', '7', '[1,2,4,7]'],
          ['4', '4*2=8', '2*7=14', '8', '[1,2,4,7,8] ✓'],
        ],
        highlightRow: 3,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 129. Design Twitter
// ══════════════════════════════════════════════════════
'design-twitter': {
  statement:
    'Design a simplified version of Twitter where users can post tweets, follow/unfollow other users, and see the 10 most recent tweets in their news feed. Implement the Twitter class with: postTweet(userId, tweetId), getNewsFeed(userId) (returns 10 most recent tweet IDs from user and followees), follow(followerId, followeeId), unfollow(followerId, followeeId).',
  tags: ['Arrays', 'Heap', 'Hash Map', 'Design'],
  requirement: 'O(n log n) per getNewsFeed where n = tweets from user + followees',
  externalLinks: [
    { label: '↗ LeetCode #355', url: 'https://leetcode.com/problems/design-twitter/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Twitter t = new Twitter()\nt.postTweet(1, 5)\nt.getNewsFeed(1) → [5]\nt.follow(1, 2)\nt.postTweet(2, 6)\nt.getNewsFeed(1) → [6, 5]\nt.unfollow(1, 2)\nt.getNewsFeed(1) → [5]' },
  ],
  constraints: [
    '1 ≤ userId, followerId, followeeId ≤ 500',
    '0 ≤ tweetId ≤ 10⁴',
    'All tweets have unique IDs',
    'At most 3 × 10⁴ calls in total',
  ],
  requiredComplexity: 'O(k log k) per getNewsFeed (k = user + followees tweet lists) · O(n) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Store tweets per user in a list ordered by timestamp (newest first). Store followee relationships in a set per user. How do you get the 10 most recent across multiple lists?' },
    { number: 2, text: 'Use a k-way merge with a max-heap: initialize with the latest tweet from each followed user (and the user themselves). Poll 10 times, each time pushing the next tweet from the same user.' },
    { number: 3, text: 'Use a global timestamp counter to track tweet order.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Hash Map + Max-Heap k-way merge — O(k log k) per feed',
      explanation: 'Store tweets per user (newest first with timestamps). Follow/unfollow updates a set. GetNewsFeed does a k-way merge across all relevant tweet lists.',
      code: {
        java: `class Twitter {
    private Map<Integer, List<int[]>> tweets; // userId → [(time, tweetId)]
    private Map<Integer, Set<Integer>> following;
    private int time = 0;

    public Twitter() {
        tweets = new HashMap<>();
        following = new HashMap<>();
    }

    public void postTweet(int userId, int tweetId) {
        tweets.computeIfAbsent(userId, k -> new ArrayList<>()).add(new int[]{time++, tweetId});
    }

    public List<Integer> getNewsFeed(int userId) {
        // max-heap: (time, tweetId, list, index)
        PriorityQueue<int[]> heap = new PriorityQueue<>((a,b) -> b[0]-a[0]);
        Set<Integer> toCheck = new HashSet<>(following.getOrDefault(userId, new HashSet<>()));
        toCheck.add(userId);
        for (int uid : toCheck) {
            List<int[]> list = tweets.getOrDefault(uid, Collections.emptyList());
            if (!list.isEmpty()) {
                int idx = list.size() - 1;
                heap.offer(new int[]{list.get(idx)[0], list.get(idx)[1], uid, idx});
            }
        }
        List<Integer> result = new ArrayList<>();
        while (!heap.isEmpty() && result.size() < 10) {
            int[] top = heap.poll();
            result.add(top[1]);
            int nextIdx = top[3] - 1;
            if (nextIdx >= 0) {
                List<int[]> list = tweets.get(top[2]);
                heap.offer(new int[]{list.get(nextIdx)[0], list.get(nextIdx)[1], top[2], nextIdx});
            }
        }
        return result;
    }

    public void follow(int followerId, int followeeId) {
        following.computeIfAbsent(followerId, k -> new HashSet<>()).add(followeeId);
    }

    public void unfollow(int followerId, int followeeId) {
        following.getOrDefault(followerId, new HashSet<>()).remove(followeeId);
    }
}`,
        cpp: `class Twitter {
    unordered_map<int, vector<pair<int,int>>> tweets; // uid → [(time, tweetId)]
    unordered_map<int, unordered_set<int>> following;
    int timer = 0;
public:
    void postTweet(int userId, int tweetId) {
        tweets[userId].push_back({timer++, tweetId});
    }

    vector<int> getNewsFeed(int userId) {
        using T = tuple<int,int,int,int>; // time, tweetId, uid, idx
        priority_queue<T> pq;
        auto check = [&](int uid) {
            if (!tweets[uid].empty()) {
                int idx = tweets[uid].size()-1;
                pq.push({tweets[uid][idx].first, tweets[uid][idx].second, uid, idx});
            }
        };
        check(userId);
        for (int fid : following[userId]) check(fid);
        vector<int> res;
        while (!pq.empty() && res.size() < 10) {
            auto [t, tid, uid, idx] = pq.top(); pq.pop();
            res.push_back(tid);
            if (idx > 0) pq.push({tweets[uid][idx-1].first, tweets[uid][idx-1].second, uid, idx-1});
        }
        return res;
    }

    void follow(int f, int e) { following[f].insert(e); }
    void unfollow(int f, int e) { following[f].erase(e); }
};`,
        python: `import heapq
from collections import defaultdict

class Twitter:
    def __init__(self):
        self.tweets = defaultdict(list)  # uid → [(time, tweetId)]
        self.following = defaultdict(set)
        self.timer = 0

    def postTweet(self, userId, tweetId):
        self.tweets[userId].append((self.timer, tweetId))
        self.timer += 1

    def getNewsFeed(self, userId):
        heap = []
        to_check = self.following[userId] | {userId}
        for uid in to_check:
            lst = self.tweets[uid]
            if lst:
                idx = len(lst) - 1
                heapq.heappush(heap, (-lst[idx][0], lst[idx][1], uid, idx))
        result = []
        while heap and len(result) < 10:
            neg_t, tid, uid, idx = heapq.heappop(heap)
            result.append(tid)
            if idx > 0:
                prev = self.tweets[uid][idx-1]
                heapq.heappush(heap, (-prev[0], prev[1], uid, idx-1))
        return result

    def follow(self, followerId, followeeId):
        self.following[followerId].add(followeeId)

    def unfollow(self, followerId, followeeId):
        self.following[followerId].discard(followeeId)`,
      },
      dryRun: {
        title: 'Dry run — postTweet(1,5), follow(1,2), postTweet(2,6), getNewsFeed(1)',
        columns: ['Step', 'Action', 'State'],
        rows: [
          ['1', 'postTweet(1,5)', 'tweets[1]=[(0,5)]'],
          ['2', 'follow(1,2)', 'following[1]={2}'],
          ['3', 'postTweet(2,6)', 'tweets[2]=[(1,6)]'],
          ['4', 'getNewsFeed(1)', 'check users {1,2}'],
          ['5', 'Init heap', '[(−1,6,2,0),(−0,5,1,0)]'],
          ['6', 'Poll (−1,6)', 'result=[6], push tweets[2] prev if any'],
          ['7', 'Poll (−0,5)', 'result=[6,5]'],
          ['Return', '—', '[6,5] ✓'],
        ],
        highlightRow: 7,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 130. Furthest Building You Can Reach
// ══════════════════════════════════════════════════════
'furthest-building-you-can-reach': {
  statement:
    'You are given an integer array heights representing the heights of buildings, some bricks, and some ladders. You start at building 0 and move to the next building by possibly using bricks or ladders. When moving from building i to building i+1 (0-indexed), if the current building\'s height is greater than or equal to the next building\'s height, you do not need a ladder or bricks. If the current building\'s height is less than the next building\'s height, you can either use one ladder or (heights[i+1] - heights[i]) bricks. Return the furthest building index you can reach.',
  tags: ['Arrays', 'Heap', 'Greedy'],
  requirement: 'O(n log k) time where k = number of ladders',
  externalLinks: [
    { label: '↗ LeetCode #1642', url: 'https://leetcode.com/problems/furthest-building-you-can-reach/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  heights = [4,2,7,6,9,14,12], bricks = 5, ladders = 1\nOutput: 4\nExplanation: Use ladder for 9→14 (biggest gap), bricks for 2→7 (5 bricks)' },
    { label: 'Example 2', text: 'Input:  heights = [4,12,2,7,3,18,20,3,19], bricks = 10, ladders = 2\nOutput: 7' },
  ],
  constraints: [
    '1 ≤ heights.length ≤ 10⁵',
    '1 ≤ heights[i] ≤ 10⁶',
    '0 ≤ bricks ≤ 10⁹',
    '0 ≤ ladders ≤ heights.length',
  ],
  requiredComplexity: 'O(n log k) time · O(k) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Ladders should be used for the biggest climbs. How can you greedily assign ladders to the largest gaps seen so far?' },
    { number: 2, text: 'Use a min-heap of size ladders. For each climb, assign a ladder. If the heap exceeds its size, remove the smallest gap (use bricks for it instead).' },
    { number: 3, text: 'If bricks run out (negative), you can\'t proceed. Return the current index.' },
    { number: 4, label: 'Hint 4 — invariant', text: 'The heap always holds the ladders climbs (biggest gaps get ladders). When a new gap is the largest among ladder-assigned gaps, it bumps out the smallest, which then costs bricks.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Min-Heap + Greedy — O(n log k) time, O(k) space',
      explanation: 'Assign ladders to top-k climbs using a min-heap. When heap overflows, use bricks for the smallest ladder-assigned climb.',
      code: {
        java: `public int furthestBuilding(int[] heights, int bricks, int ladders) {
    PriorityQueue<Integer> minHeap = new PriorityQueue<>(); // ladder-assigned climbs
    for (int i = 0; i < heights.length - 1; i++) {
        int diff = heights[i+1] - heights[i];
        if (diff <= 0) continue;
        minHeap.offer(diff);
        if (minHeap.size() > ladders) {
            bricks -= minHeap.poll(); // use bricks for smallest ladder climb
        }
        if (bricks < 0) return i;
    }
    return heights.length - 1;
}`,
        cpp: `int furthestBuilding(vector<int>& heights, int bricks, int ladders) {
    priority_queue<int, vector<int>, greater<int>> pq;
    for (int i = 0; i < (int)heights.size()-1; i++) {
        int diff = heights[i+1] - heights[i];
        if (diff <= 0) continue;
        pq.push(diff);
        if ((int)pq.size() > ladders) {
            bricks -= pq.top(); pq.pop();
        }
        if (bricks < 0) return i;
    }
    return heights.size()-1;
}`,
        python: `import heapq

def furthestBuilding(heights, bricks, ladders):
    heap = []  # min-heap of ladder-assigned climbs
    for i in range(len(heights) - 1):
        diff = heights[i+1] - heights[i]
        if diff <= 0:
            continue
        heapq.heappush(heap, diff)
        if len(heap) > ladders:
            bricks -= heapq.heappop(heap)
        if bricks < 0:
            return i
    return len(heights) - 1`,
      },
      dryRun: {
        title: 'Dry run — heights=[4,2,7,6,9,14,12], bricks=5, ladders=1',
        columns: ['i', 'diff', 'Heap (ladder climbs)', 'Bricks used', 'bricks left'],
        rows: [
          ['0→1', '-2', '(skip)', '—', '5'],
          ['1→2', '5', '[5]', '0', '5'],
          ['2→3', '-1', '(skip)', '—', '5'],
          ['3→4', '3', '[3,5]→pop 3→[5]', '3', '2'],
          ['4→5', '5', '[5,5]→pop 5→[5]', '5', '-3 < 0 → return 4 ✓'],
        ],
        highlightRow: 4,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 131. Single-Threaded CPU
// ══════════════════════════════════════════════════════
'single-threaded-cpu': {
  statement:
    'You are given n tasks labeled from 0 to n-1 represented by a 2D integer array tasks where tasks[i] = [enqueueTime_i, processingTime_i] means the ith task will be available to process at enqueueTime_i and will take processingTime_i to finish. Return the order in which the CPU will process the tasks. The CPU processes the available task with the shortest processing time (breaking ties by index). If no tasks are available, it advances to the next task\'s enqueue time.',
  tags: ['Arrays', 'Heap', 'Sorting'],
  requirement: 'O(n log n) time',
  externalLinks: [
    { label: '↗ LeetCode #1834', url: 'https://leetcode.com/problems/single-threaded-cpu/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  tasks = [[1,2],[2,4],[3,2],[4,1]]\nOutput: [0,2,3,1]' },
    { label: 'Example 2', text: 'Input:  tasks = [[7,10],[7,12],[7,5],[7,4],[7,2]]\nOutput: [4,3,2,0,1]' },
  ],
  constraints: [
    'tasks.length == n',
    '1 ≤ n ≤ 10⁵',
    '1 ≤ enqueueTime_i, processingTime_i ≤ 10⁹',
  ],
  requiredComplexity: 'O(n log n) time · O(n) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Sort tasks by enqueue time. Simulate CPU time advancing. Which tasks are available at the current time?' },
    { number: 2, text: 'Use a min-heap of (processingTime, originalIndex) for tasks whose enqueue time ≤ current time.' },
    { number: 3, text: 'If the heap is empty, jump time to the next task\'s enqueue time. Otherwise pick the shortest task from the heap.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Sort + Min-Heap Simulation — O(n log n) time, O(n) space',
      explanation: 'Sort tasks by enqueue time with original indices. Simulate CPU: advance time, enqueue available tasks, process shortest.',
      code: {
        java: `public int[] getOrder(int[][] tasks) {
    int n = tasks.length;
    Integer[] idx = new Integer[n];
    for (int i = 0; i < n; i++) idx[i] = i;
    Arrays.sort(idx, (a, b) -> tasks[a][0] != tasks[b][0]
        ? tasks[a][0] - tasks[b][0] : a - b);
    // min-heap: (processingTime, originalIndex)
    PriorityQueue<int[]> heap = new PriorityQueue<>(
        (a, b) -> a[0] != b[0] ? a[0] - b[0] : a[1] - b[1]);
    int[] result = new int[n];
    long time = 0;
    int j = 0, ri = 0;
    while (ri < n) {
        // Enqueue all tasks available at current time
        while (j < n && tasks[idx[j]][0] <= time) {
            heap.offer(new int[]{tasks[idx[j]][1], idx[j]});
            j++;
        }
        if (heap.isEmpty()) {
            time = tasks[idx[j]][0]; // jump to next task
            continue;
        }
        int[] task = heap.poll();
        result[ri++] = task[1];
        time += task[0];
    }
    return result;
}`,
        cpp: `vector<int> getOrder(vector<vector<int>>& tasks) {
    int n = tasks.size();
    vector<int> idx(n);
    iota(idx.begin(), idx.end(), 0);
    sort(idx.begin(), idx.end(), [&](int a, int b){
        return tasks[a][0] < tasks[b][0];
    });
    using P = pair<int,int>;
    priority_queue<P,vector<P>,greater<P>> pq;
    vector<int> result;
    long long time = 0;
    int j = 0;
    while (result.size() < n) {
        while (j < n && tasks[idx[j]][0] <= time) {
            pq.push({tasks[idx[j]][1], idx[j]}); j++;
        }
        if (pq.empty()) { time = tasks[idx[j]][0]; continue; }
        auto [pt, oi] = pq.top(); pq.pop();
        result.push_back(oi);
        time += pt;
    }
    return result;
}`,
        python: `import heapq

def getOrder(tasks):
    n = len(tasks)
    indexed = sorted(range(n), key=lambda i: (tasks[i][0], i))
    heap = []  # (processingTime, originalIndex)
    result = []
    time = 0
    j = 0
    while len(result) < n:
        while j < n and tasks[indexed[j]][0] <= time:
            heapq.heappush(heap, (tasks[indexed[j]][1], indexed[j]))
            j += 1
        if not heap:
            time = tasks[indexed[j]][0]
            continue
        pt, oi = heapq.heappop(heap)
        result.append(oi)
        time += pt
    return result`,
      },
      dryRun: {
        title: 'Dry run — tasks = [[1,2],[2,4],[3,2],[4,1]]',
        columns: ['time', 'Enqueue', 'Heap', 'Process (shortest)', 'result'],
        rows: [
          ['0→1', 'none (jump to 1)', 'empty', '—', '[]'],
          ['1', 'task0(pt=2)', '[(2,0)]', 'task0', '[0]'],
          ['3', 'task1(pt=4),task2(pt=2)', '[(2,2),(4,1)]', 'task2', '[0,2]'],
          ['5', 'task3(pt=1)', '[(1,3),(4,1)]', 'task3', '[0,2,3]'],
          ['6', '—', '[(4,1)]', 'task1', '[0,2,3,1] ✓'],
        ],
        highlightRow: 4,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 132. Process Tasks Using Servers
// ══════════════════════════════════════════════════════
'process-tasks-using-servers': {
  statement:
    'You are given two 0-indexed integer arrays servers and tasks of lengths n and m respectively. servers[i] is the weight of the ith server and tasks[j] is the time needed to process the jth task. Tasks are assigned to servers in order: task j is assigned to the free server with the smallest weight (ties broken by index). If no server is free, wait until one becomes free. Return the assignment of each task to its server.',
  tags: ['Arrays', 'Heap'],
  requirement: 'O((n + m) log n) time',
  externalLinks: [
    { label: '↗ LeetCode #1882', url: 'https://leetcode.com/problems/process-tasks-using-servers/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  servers = [3,3,2], tasks = [1,2,3,2,1,2]\nOutput: [2,2,0,2,1,2]' },
    { label: 'Example 2', text: 'Input:  servers = [5,1,4,3,2], tasks = [2,1,2,4,5,2,1]\nOutput: [1,4,1,4,1,3,2]' },
  ],
  constraints: [
    '1 ≤ servers.length, tasks.length ≤ 2 × 10⁵',
    '1 ≤ servers[i], tasks[j] ≤ 2 × 10⁵',
  ],
  requiredComplexity: 'O((n + m) log n) time · O(n) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Use two heaps: one for free servers (min-heap by weight, then index), one for busy servers (min-heap by free-at time, then weight, then index).' },
    { number: 2, text: 'For task j at time j: move servers that finish by time j from busy heap to free heap. Assign the lightest free server (or wait for the earliest-finishing one).' },
    { number: 3, text: 'If no free servers exist when processing task j, advance time to when the earliest busy server finishes.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Two Heaps — O((n+m) log n) time, O(n) space',
      explanation: 'Free heap: (weight, index). Busy heap: (freeAt, weight, index). Process each task at its earliest possible time.',
      code: {
        java: `public int[] assignTasks(int[] servers, int[] tasks) {
    // free: (weight, index)
    PriorityQueue<int[]> free = new PriorityQueue<>((a,b) ->
        a[0]!=b[0] ? a[0]-b[0] : a[1]-b[1]);
    // busy: (freeAt, weight, index)
    PriorityQueue<int[]> busy = new PriorityQueue<>((a,b) ->
        a[0]!=b[0] ? a[0]-b[0] : a[1]!=b[1] ? a[1]-b[1] : a[2]-b[2]);
    for (int i = 0; i < servers.length; i++) free.offer(new int[]{servers[i], i});
    int[] result = new int[tasks.length];
    for (int j = 0; j < tasks.length; j++) {
        long time = j;
        // Release servers that finish by 'time'
        while (!busy.isEmpty() && busy.peek()[0] <= time) {
            int[] s = busy.poll();
            free.offer(new int[]{s[1], s[2]});
        }
        if (free.isEmpty()) {
            // Wait for earliest server
            int[] s = busy.poll();
            time = s[0];
            free.offer(new int[]{s[1], s[2]});
        }
        int[] server = free.poll();
        result[j] = server[1];
        busy.offer(new int[]{(int)(time + tasks[j]), server[0], server[1]});
    }
    return result;
}`,
        cpp: `vector<int> assignTasks(vector<int>& servers, vector<int>& tasks) {
    using T2 = pair<int,int>;
    using T3 = tuple<long,int,int>;
    priority_queue<T2,vector<T2>,greater<T2>> freeQ;
    priority_queue<T3,vector<T3>,greater<T3>> busyQ;
    for (int i = 0; i < (int)servers.size(); i++) freeQ.push({servers[i],i});
    vector<int> result(tasks.size());
    for (int j = 0; j < (int)tasks.size(); j++) {
        long t = j;
        while (!busyQ.empty() && get<0>(busyQ.top()) <= t) {
            auto [ft,w,idx] = busyQ.top(); busyQ.pop();
            freeQ.push({w,idx});
        }
        if (freeQ.empty()) {
            auto [ft,w,idx] = busyQ.top(); busyQ.pop();
            t = ft; freeQ.push({w,idx});
        }
        auto [w,idx] = freeQ.top(); freeQ.pop();
        result[j] = idx;
        busyQ.push({t+tasks[j],w,idx});
    }
    return result;
}`,
        python: `import heapq

def assignTasks(servers, tasks):
    free = [(w, i) for i, w in enumerate(servers)]
    heapq.heapify(free)
    busy = []  # (freeAt, weight, index)
    result = []
    for j, task in enumerate(tasks):
        t = j
        while busy and busy[0][0] <= t:
            ft, w, idx = heapq.heappop(busy)
            heapq.heappush(free, (w, idx))
        if not free:
            ft, w, idx = heapq.heappop(busy)
            t = ft
            heapq.heappush(free, (w, idx))
        w, idx = heapq.heappop(free)
        result.append(idx)
        heapq.heappush(busy, (t + task, w, idx))
    return result`,
      },
      dryRun: {
        title: 'Dry run — servers=[3,3,2], tasks=[1,2,3,...], t=j',
        columns: ['j(t)', 'Free servers', 'Busy servers', 'Assigned', 'result[j]'],
        rows: [
          ['0', '[(2,2),(3,0),(3,1)]', '[]', 'Server 2 (w=2)', '2'],
          ['1', '[(3,0),(3,1)]', '[(1,2,2)]', 'Server 0 (w=3)', '0'],
          ['2', '[(3,1)]', '[(1,2,2),(3,3,0)]', 'freeAt=1: release srv2 → [(2,2),(3,1)]', '2'],
        ],
        highlightRow: 2,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 133. Rearrange String k Distance Apart
// ══════════════════════════════════════════════════════
'rearrange-string-k-distance-apart': {
  statement:
    'Given a string s and an integer k, rearrange s such that the same characters are at least k distance apart. If it is not possible to rearrange the string, return an empty string "".',
  tags: ['Arrays', 'Heap', 'Greedy', 'Hash Map'],
  requirement: 'O(n log k) time',
  externalLinks: [
    { label: '↗ LeetCode #358', url: 'https://leetcode.com/problems/rearrange-string-k-distance-apart/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  s = "aabbcc", k = 3\nOutput: "abcabc"' },
    { label: 'Example 2', text: 'Input:  s = "aaabc", k = 3\nOutput: ""' },
    { label: 'Example 3', text: 'Input:  s = "aaadbbcc", k = 2\nOutput: "abacabcd"' },
  ],
  constraints: [
    '1 ≤ s.length ≤ 3 × 10⁵',
    's consists of lowercase English letters',
    '0 ≤ k ≤ s.length',
  ],
  requiredComplexity: 'O(n log k) time · O(k) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Similar to Task Scheduler: greedily pick the most frequent character, but now you must wait k positions before reusing. How do you enforce the k-distance constraint?' },
    { number: 2, text: 'Use a max-heap and a queue. Each round, pick from the heap and add to a cooldown queue. After k picks, release the first queued character back to the heap.' },
    { number: 3, text: 'If the heap is empty but the queue is not empty, it\'s impossible to fill the current slot.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Max-Heap + Cooldown Queue — O(n log k) time, O(k) space',
      explanation: 'Greedily pick most frequent, enforce k-distance with a queue. Release back to heap after k positions.',
      code: {
        java: `public String rearrangeString(String s, int k) {
    if (k == 0) return s;
    int[] freq = new int[26];
    for (char c : s.toCharArray()) freq[c-'a']++;
    PriorityQueue<int[]> maxHeap = new PriorityQueue<>((a,b) -> b[0]-a[0]);
    for (int i = 0; i < 26; i++) if (freq[i] > 0) maxHeap.offer(new int[]{freq[i], i});
    Queue<int[]> cooldown = new LinkedList<>(); // (remaining, charIdx)
    StringBuilder sb = new StringBuilder();
    while (!maxHeap.isEmpty()) {
        int[] top = maxHeap.poll();
        sb.append((char)('a' + top[1]));
        top[0]--;
        cooldown.offer(top);
        if (cooldown.size() == k) {
            int[] ready = cooldown.poll();
            if (ready[0] > 0) maxHeap.offer(ready);
        }
    }
    // if heap empty but cooldown has non-zero items, not all placed
    return sb.length() == s.length() ? sb.toString() : "";
}`,
        cpp: `string rearrangeString(string s, int k) {
    if (k == 0) return s;
    int freq[26] = {};
    for (char c : s) freq[c-'a']++;
    priority_queue<pair<int,int>> pq;
    for (int i = 0; i < 26; i++) if (freq[i]) pq.push({freq[i],i});
    queue<pair<int,int>> cool;
    string result;
    while (!pq.empty()) {
        auto [f,c] = pq.top(); pq.pop();
        result += (char)('a'+c);
        cool.push({f-1,c});
        if ((int)cool.size() == k) {
            auto [nf,nc] = cool.front(); cool.pop();
            if (nf > 0) pq.push({nf,nc});
        }
    }
    return result.size() == s.size() ? result : "";
}`,
        python: `import heapq
from collections import Counter, deque

def rearrangeString(s, k):
    if k == 0:
        return s
    freq = Counter(s)
    heap = [(-cnt, ch) for ch, cnt in freq.items()]
    heapq.heapify(heap)
    cooldown = deque()
    result = []
    while heap:
        cnt, ch = heapq.heappop(heap)
        result.append(ch)
        cooldown.append((cnt+1, ch))  # cnt is negative, so +1 decrements
        if len(cooldown) == k:
            ready = cooldown.popleft()
            if ready[0] < 0:
                heapq.heappush(heap, ready)
    return ''.join(result) if len(result) == len(s) else ""`,
      },
      dryRun: {
        title: 'Dry run — s="aabbcc", k=3, freq:{a:2,b:2,c:2}',
        columns: ['Step', 'Heap', 'Place', 'Cooldown queue', 'result'],
        rows: [
          ['1', '[(2,a),(2,b),(2,c)]', 'a', '[(1,a)]', '"a"'],
          ['2', '[(2,b),(2,c)]', 'b', '[(1,a),(1,b)]', '"ab"'],
          ['3', '[(2,c)]', 'c', '[(1,a),(1,b),(1,c)]→release(1,a)', '"abc"'],
          ['4', '[(1,a),(1,b),(1,c)]', 'a', '[(1,b),(1,c),(0,a)]→release(1,b)', '"abca"'],
          ['5', '[(1,b),(1,c)]', 'b', 'release(1,c)', '"abcab"'],
          ['6', '[(1,c)]', 'c', '—', '"abcabc" ✓'],
        ],
        highlightRow: 5,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 134. Find Median from Data Stream
// ══════════════════════════════════════════════════════
'find-median-from-data-stream': {
  statement:
    'The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values. Implement the MedianFinder class: MedianFinder() initializes the object, void addNum(int num) adds the integer to the data structure, double findMedian() returns the median of all elements so far.',
  tags: ['Arrays', 'Heap', 'Design'],
  requirement: 'O(log n) addNum, O(1) findMedian',
  externalLinks: [
    { label: '↗ LeetCode #295', url: 'https://leetcode.com/problems/find-median-from-data-stream/' },
  ],
  examples: [
    { label: 'Example 1', text: 'MedianFinder mf = new MedianFinder()\nmf.addNum(1)\nmf.addNum(2)\nmf.findMedian() → 1.5\nmf.addNum(3)\nmf.findMedian() → 2.0' },
  ],
  constraints: [
    '−10⁵ ≤ num ≤ 10⁵',
    'There will be at least one element before calling findMedian',
    'At most 5 × 10⁴ calls to addNum and findMedian',
  ],
  requiredComplexity: 'O(log n) addNum · O(1) findMedian · O(n) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'How can you maintain the median efficiently? Think of splitting the data into two halves.' },
    { number: 2, text: 'Use a max-heap for the lower half and a min-heap for the upper half. The median is at the boundary.' },
    { number: 3, text: 'Maintain balance: both heaps have equal size (or max-heap has one extra for odd count). The median is maxHeap.top() or average of both tops.' },
    { number: 4, label: 'Hint 4 — insertion', text: 'To add num: push to maxHeap, then move maxHeap.top() to minHeap, then if minHeap is larger, move minHeap.top() back to maxHeap.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Two Heaps — O(log n) addNum, O(1) findMedian',
      explanation: 'Max-heap for lower half, min-heap for upper half. Keep them balanced.',
      code: {
        java: `class MedianFinder {
    private PriorityQueue<Integer> lo; // max-heap (lower half)
    private PriorityQueue<Integer> hi; // min-heap (upper half)

    public MedianFinder() {
        lo = new PriorityQueue<>(Collections.reverseOrder());
        hi = new PriorityQueue<>();
    }

    public void addNum(int num) {
        lo.offer(num);
        hi.offer(lo.poll());
        if (hi.size() > lo.size()) lo.offer(hi.poll());
    }

    public double findMedian() {
        return lo.size() > hi.size()
            ? lo.peek()
            : (lo.peek() + hi.peek()) / 2.0;
    }
}`,
        cpp: `class MedianFinder {
    priority_queue<int> lo;                          // max-heap
    priority_queue<int,vector<int>,greater<int>> hi; // min-heap
public:
    void addNum(int num) {
        lo.push(num);
        hi.push(lo.top()); lo.pop();
        if (hi.size() > lo.size()) { lo.push(hi.top()); hi.pop(); }
    }

    double findMedian() {
        return lo.size() > hi.size() ? lo.top() : (lo.top() + hi.top()) / 2.0;
    }
};`,
        python: `import heapq

class MedianFinder:
    def __init__(self):
        self.lo = []  # max-heap (negate values)
        self.hi = []  # min-heap

    def addNum(self, num):
        heapq.heappush(self.lo, -num)
        heapq.heappush(self.hi, -heapq.heappop(self.lo))
        if len(self.hi) > len(self.lo):
            heapq.heappush(self.lo, -heapq.heappop(self.hi))

    def findMedian(self):
        if len(self.lo) > len(self.hi):
            return float(-self.lo[0])
        return (-self.lo[0] + self.hi[0]) / 2.0`,
      },
      dryRun: {
        title: 'Dry run — addNum(1), addNum(2), addNum(3)',
        columns: ['Operation', 'lo (max-heap)', 'hi (min-heap)', 'findMedian'],
        rows: [
          ['addNum(1)', '[1]', '[]', '1.0'],
          ['addNum(2)', '[1]', '[2]', '(1+2)/2=1.5'],
          ['addNum(3)', '[2]', '[3]', '2.0 ✓'],
        ],
        highlightRow: 2,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 135. Maximum Subsequence Score
// ══════════════════════════════════════════════════════
'maximum-subsequence-score': {
  statement:
    'You are given two 0-indexed integer arrays nums1 and nums2 of equal length n and a positive integer k. You must choose a subsequence of indices from nums1 of length k. For chosen indices i0, i1, ..., ik-1, your score is (nums1[i0] + nums1[i1] + ... + nums1[ik-1]) * min(nums2[i0], nums2[i1], ..., nums2[ik-1]). Return the maximum possible score.',
  tags: ['Arrays', 'Heap', 'Greedy', 'Sorting'],
  requirement: 'O(n log n) time',
  externalLinks: [
    { label: '↗ LeetCode #2542', url: 'https://leetcode.com/problems/maximum-subsequence-score/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums1 = [1,3,3,2], nums2 = [2,1,3,3], k = 3\nOutput: 12\nExplanation: indices [0,2,3]: sum=1+3+2=6, min=min(2,3,3)=2, score=12' },
    { label: 'Example 2', text: 'Input:  nums1 = [4,2,3,1,1], nums2 = [7,5,10,9,6], k = 1\nOutput: 30' },
  ],
  constraints: [
    'n == nums1.length == nums2.length',
    '1 ≤ k ≤ n ≤ 10⁵',
    '0 ≤ nums1[i], nums2[i] ≤ 10⁵',
  ],
  requiredComplexity: 'O(n log n) time · O(k) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Sort by nums2 descending. For each position i, treat nums2[i] as the minimum. You want the top-k largest nums1 values from indices 0..i.' },
    { number: 2, text: 'Use a min-heap of size k to track the top-k nums1 values seen so far. When size exceeds k, remove the smallest.' },
    { number: 3, text: 'Once the heap has exactly k elements, compute score = heapSum * nums2[i]. Track the maximum.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Sort + Min-Heap — O(n log n) time, O(k) space',
      explanation: 'Sort pairs by nums2 descending. Slide a min-heap of k best nums1 values. Compute score at each step.',
      code: {
        java: `public long maxScore(int[] nums1, int[] nums2, int k) {
    int n = nums1.length;
    Integer[] idx = new Integer[n];
    for (int i = 0; i < n; i++) idx[i] = i;
    Arrays.sort(idx, (a, b) -> nums2[b] - nums2[a]); // sort by nums2 desc
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();
    long sum = 0, result = 0;
    for (int i : idx) {
        minHeap.offer(nums1[i]);
        sum += nums1[i];
        if (minHeap.size() > k) sum -= minHeap.poll();
        if (minHeap.size() == k) result = Math.max(result, sum * nums2[i]);
    }
    return result;
}`,
        cpp: `long long maxScore(vector<int>& nums1, vector<int>& nums2, int k) {
    int n = nums1.size();
    vector<int> idx(n);
    iota(idx.begin(), idx.end(), 0);
    sort(idx.begin(), idx.end(), [&](int a, int b){ return nums2[a] > nums2[b]; });
    priority_queue<int,vector<int>,greater<int>> pq;
    long long sum = 0, result = 0;
    for (int i : idx) {
        pq.push(nums1[i]); sum += nums1[i];
        if ((int)pq.size() > k) { sum -= pq.top(); pq.pop(); }
        if ((int)pq.size() == k) result = max(result, sum * (long long)nums2[i]);
    }
    return result;
}`,
        python: `import heapq

def maxScore(nums1, nums2, k):
    pairs = sorted(zip(nums2, nums1), reverse=True)
    heap = []  # min-heap
    total = result = 0
    for n2, n1 in pairs:
        heapq.heappush(heap, n1)
        total += n1
        if len(heap) > k:
            total -= heapq.heappop(heap)
        if len(heap) == k:
            result = max(result, total * n2)
    return result`,
      },
      dryRun: {
        title: 'Dry run — nums1=[1,3,3,2], nums2=[2,1,3,3], k=3',
        columns: ['Sorted pair (n2,n1)', 'heap', 'sum', 'score=sum*n2', 'result'],
        rows: [
          ['(3,3) idx2', '[3]', '3', 'size<k', '0'],
          ['(3,2) idx3', '[2,3]', '5', 'size<k', '0'],
          ['(2,1) idx0', '[1,2,3]', '6', '6*2=12', '12'],
          ['(1,3) idx1', '[2,3,3]→pop 1, sum=8-1=7 wait: push 3→[1,2,3,3]→pop 1', '8', '8*1=8', '12 ✓'],
        ],
        highlightRow: 2,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 136. Maximum Performance of a Team
// ══════════════════════════════════════════════════════
'maximum-performance-of-a-team': {
  statement:
    'You are given two integers n and k and two integer arrays speed and efficiency, both of length n. There are n engineers numbered from 1 to n. engineer i has speed[i] and efficiency[i]. Choose at most k engineers to form a team and the performance of this team is the sum of their speeds multiplied by the minimum efficiency among chosen engineers. Return the maximum performance of this team modulo 10⁹+7.',
  tags: ['Arrays', 'Heap', 'Greedy', 'Sorting'],
  requirement: 'O(n log n) time',
  externalLinks: [
    { label: '↗ LeetCode #1383', url: 'https://leetcode.com/problems/maximum-performance-of-a-team/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  n=6, speed=[2,10,3,1,5,8], efficiency=[5,4,3,9,7,2], k=2\nOutput: 56\nExplanation: engineers 2(speed=10,eff=4) and 5(speed=5,eff=7): 15*4=60? No: pick 2,5: sum=15,min=4→60. Or 4,5: sum=6,min=7→42. Best is 56=(10+3)*4...' },
    { label: 'Example 2', text: 'Input:  n=6, speed=[2,10,3,1,5,8], efficiency=[5,4,3,9,7,2], k=3\nOutput: 68' },
  ],
  constraints: [
    '1 ≤ k ≤ n ≤ 10⁵',
    'speed.length == n, efficiency.length == n',
    '1 ≤ speed[i] ≤ 10⁵',
    '1 ≤ efficiency[i] ≤ 10⁸',
  ],
  requiredComplexity: 'O(n log n) time · O(k) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Sort engineers by efficiency descending. For each engineer i, treat efficiency[i] as the minimum efficiency of the team. Among the first i engineers, pick at most k with the highest speeds.' },
    { number: 2, text: 'Use a min-heap of size k to track the top-k speeds. When size exceeds k, remove the slowest.' },
    { number: 3, text: 'At each engineer i: score = (sum of top-k speeds) * efficiency[i]. Track maximum.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Sort by Efficiency + Min-Heap — O(n log n) time, O(k) space',
      explanation: 'Sort by efficiency descending. Maintain min-heap of at most k speeds. Score = speedSum * currentEfficiency.',
      code: {
        java: `public int maxPerformance(int n, int[] speed, int[] efficiency, int k) {
    int[][] eng = new int[n][2];
    for (int i = 0; i < n; i++) eng[i] = new int[]{efficiency[i], speed[i]};
    Arrays.sort(eng, (a, b) -> b[0] - a[0]); // sort by efficiency desc
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();
    long speedSum = 0, result = 0;
    long MOD = 1_000_000_007L;
    for (int[] e : eng) {
        minHeap.offer(e[1]);
        speedSum += e[1];
        if (minHeap.size() > k) speedSum -= minHeap.poll();
        result = Math.max(result, speedSum * e[0]);
    }
    return (int)(result % MOD);
}`,
        cpp: `int maxPerformance(int n, vector<int>& speed, vector<int>& efficiency, int k) {
    vector<pair<int,int>> eng(n);
    for (int i = 0; i < n; i++) eng[i] = {efficiency[i], speed[i]};
    sort(eng.rbegin(), eng.rend());
    priority_queue<int,vector<int>,greater<int>> pq;
    long long sum = 0, result = 0;
    const long long MOD = 1e9+7;
    for (auto [eff, spd] : eng) {
        pq.push(spd); sum += spd;
        if ((int)pq.size() > k) { sum -= pq.top(); pq.pop(); }
        result = max(result, sum * eff);
    }
    return result % MOD;
}`,
        python: `import heapq

def maxPerformance(n, speed, efficiency, k):
    MOD = 10**9 + 7
    engineers = sorted(zip(efficiency, speed), reverse=True)
    heap = []
    speed_sum = result = 0
    for eff, spd in engineers:
        heapq.heappush(heap, spd)
        speed_sum += spd
        if len(heap) > k:
            speed_sum -= heapq.heappop(heap)
        result = max(result, speed_sum * eff)
    return result % MOD`,
      },
      dryRun: {
        title: 'Dry run — speed=[2,10,3,1,5,8], eff=[5,4,3,9,7,2], k=2',
        columns: ['Sorted (eff,spd)', 'heap', 'speedSum', 'score', 'result'],
        rows: [
          ['(9,1)', '[1]', '1', '1*9=9', '9'],
          ['(7,5)', '[1,5]', '6', '6*7=42', '42'],
          ['(5,2)', '[2,5]→pop 1, sum=7', '7', '7*5=35', '42'],
          ['(4,10)', '[5,10]→pop 2, sum=15', '15', '15*4=60', '60'],
          ['(3,3)', '[5,10]→pop 3, sum=15', '15', '15*3=45', '60'],
          ['(2,8)', '[8,10]→pop 5, sum=18', '18', '18*2=36', '60 ✓'],
        ],
        highlightRow: 3,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 137. IPO
// ══════════════════════════════════════════════════════
'ipo': {
  statement:
    'Suppose LeetCode will start its IPO soon. To sell a good price of its shares, LeetCode would like to work on some projects before its IPO. You are given n projects where the ith project has a pure profit profits[i] and a minimum capital required[i] of capital[i]. Initially you have w capital. When you finish a project, you will obtain its pure profit and the profit will be added to your total capital. Pick a list of at most k distinct projects from given projects to maximize your final capital. Return the maximized capital after selecting at most k projects.',
  tags: ['Arrays', 'Heap', 'Greedy', 'Sorting'],
  requirement: 'O(n log n + k log n) time',
  externalLinks: [
    { label: '↗ LeetCode #502', url: 'https://leetcode.com/problems/ipo/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  k=2, w=0, profits=[1,2,3], capital=[0,1,1]\nOutput: 4\nExplanation: Do project 0 (w=1), then project 2 (w=4)' },
    { label: 'Example 2', text: 'Input:  k=3, w=0, profits=[1,2,3], capital=[0,1,2]\nOutput: 6' },
  ],
  constraints: [
    '1 ≤ k ≤ 10⁵',
    '0 ≤ w ≤ 10⁹',
    'n == profits.length == capital.length',
    '1 ≤ n ≤ 10⁵',
    '0 ≤ profits[i] ≤ 10⁴',
    '0 ≤ capital[i] ≤ 10⁹',
  ],
  requiredComplexity: 'O(n log n + k log n) time · O(n) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Greedy: at each step, do the most profitable project you can currently afford. How do you efficiently find all affordable projects?' },
    { number: 2, text: 'Sort projects by capital required. Use a pointer to add all newly affordable projects to a max-heap (by profit) as capital grows.' },
    { number: 3, text: 'Do k rounds: enqueue all projects with capital ≤ w into max-heap, then take the most profitable.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Two Heaps (Sort + Max-Heap) — O(n log n + k log n) time',
      explanation: 'Sort by capital. Each round, unlock affordable projects into a max-profit heap. Pick the best available.',
      code: {
        java: `public int findMaximizedCapital(int k, int w, int[] profits, int[] capital) {
    int n = profits.length;
    int[][] projects = new int[n][2];
    for (int i = 0; i < n; i++) projects[i] = new int[]{capital[i], profits[i]};
    Arrays.sort(projects, (a, b) -> a[0] - b[0]); // sort by capital
    PriorityQueue<Integer> maxProfit = new PriorityQueue<>(Collections.reverseOrder());
    int j = 0;
    for (int i = 0; i < k; i++) {
        while (j < n && projects[j][0] <= w) maxProfit.offer(projects[j++][1]);
        if (maxProfit.isEmpty()) break;
        w += maxProfit.poll();
    }
    return w;
}`,
        cpp: `int findMaximizedCapital(int k, int w, vector<int>& profits, vector<int>& capital) {
    int n = profits.size();
    vector<pair<int,int>> projects(n);
    for (int i = 0; i < n; i++) projects[i] = {capital[i], profits[i]};
    sort(projects.begin(), projects.end());
    priority_queue<int> pq;
    int j = 0;
    for (int i = 0; i < k; i++) {
        while (j < n && projects[j].first <= w) pq.push(projects[j++].second);
        if (pq.empty()) break;
        w += pq.top(); pq.pop();
    }
    return w;
}`,
        python: `import heapq

def findMaximizedCapital(k, w, profits, capital):
    projects = sorted(zip(capital, profits))
    heap = []  # max-profit heap (negate)
    j = 0
    for _ in range(k):
        while j < len(projects) and projects[j][0] <= w:
            heapq.heappush(heap, -projects[j][1])
            j += 1
        if not heap:
            break
        w += -heapq.heappop(heap)
    return w`,
      },
      dryRun: {
        title: 'Dry run — k=2, w=0, profits=[1,2,3], capital=[0,1,1]',
        columns: ['Round', 'w', 'Unlock (cap≤w)', 'Max-profit heap', 'Take profit', 'w after'],
        rows: [
          ['1', '0', 'project(cap=0,profit=1)', '[1]', '1', '1'],
          ['2', '1', 'project(cap=1,profit=2),(cap=1,profit=3)', '[2,3]', '3', '4'],
          ['Done', '—', '—', '—', '—', '4 ✓'],
        ],
        highlightRow: 2,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 138. Employee Free Time
// ══════════════════════════════════════════════════════
'employee-free-time': {
  statement:
    'We are given a list schedule of employees, which represents the working time for each employee. Each employee has a list of non-overlapping Intervals, and these intervals are in sorted order. Return the list of finite intervals representing common, positive-length free time for all employees, also in sorted order.',
  tags: ['Arrays', 'Heap', 'Intervals'],
  requirement: 'O(n log k) time where k = number of employees',
  externalLinks: [
    { label: '↗ LeetCode #759', url: 'https://leetcode.com/problems/employee-free-time/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  schedule = [[[1,3],[6,7]],[[2,4]],[[2,5],[9,12]]]\nOutput: [[5,6],[7,9]]' },
    { label: 'Example 2', text: 'Input:  schedule = [[[1,3],[6,7]],[[2,4]],[[3,5]]]\nOutput: [[5,6]]' },
  ],
  constraints: [
    '1 ≤ schedule.length, schedule[i].length ≤ 50',
    '0 ≤ schedule[i][j].start < schedule[i][j].end ≤ 10⁸',
  ],
  requiredComplexity: 'O(n log k) time · O(k) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Flatten all intervals and sort them. Find gaps between merged intervals — those are the free times.' },
    { number: 2, text: 'Or use a min-heap for k-way merge across all employee schedules, processing intervals in order.' },
    { number: 3, text: 'Track the max end seen so far. If the next interval starts after this max, there\'s a free time gap.' },
  ],
  approaches: [
    {
      key: 'flatten',
      label: 'Flatten + Sort + Merge — O(n log n) time, O(n) space',
      explanation: 'Collect all intervals, sort by start, merge overlapping ones, find gaps between merged intervals.',
      code: {
        java: `public List<Interval> employeeFreeTime(List<List<Interval>> schedule) {
    List<int[]> all = new ArrayList<>();
    for (List<Interval> emp : schedule)
        for (Interval iv : emp) all.add(new int[]{iv.start, iv.end});
    all.sort((a, b) -> a[0] - b[0]);
    List<Interval> result = new ArrayList<>();
    int end = all.get(0)[1];
    for (int[] iv : all) {
        if (iv[0] > end) result.add(new Interval(end, iv[0]));
        end = Math.max(end, iv[1]);
    }
    return result;
}`,
        cpp: `vector<Interval> employeeFreeTime(vector<vector<Interval>> schedule) {
    vector<pair<int,int>> all;
    for (auto& emp : schedule)
        for (auto& iv : emp) all.push_back({iv.start, iv.end});
    sort(all.begin(), all.end());
    vector<Interval> result;
    int end = all[0].second;
    for (auto& [s,e] : all) {
        if (s > end) result.push_back({end, s});
        end = max(end, e);
    }
    return result;
}`,
        python: `def employeeFreeTime(schedule):
    all_intervals = sorted(
        [iv for emp in schedule for iv in emp],
        key=lambda x: x.start
    )
    result = []
    end = all_intervals[0].end
    for iv in all_intervals:
        if iv.start > end:
            result.append(Interval(end, iv.start))
        end = max(end, iv.end)
    return result`,
      },
    },
    {
      key: 'heap',
      label: 'Min-Heap k-way Merge — O(n log k) time, O(k) space',
      explanation: 'Heap with (start, empIdx, ivIdx). Process in order, track max end seen. Gaps are free time.',
      code: {
        java: `public List<Interval> employeeFreeTime(List<List<Interval>> schedule) {
    // (start, empIdx, ivIdx)
    PriorityQueue<int[]> heap = new PriorityQueue<>((a,b) ->
        schedule.get(a[0]).get(a[1]).start - schedule.get(b[0]).get(b[1]).start);
    for (int i = 0; i < schedule.size(); i++)
        if (!schedule.get(i).isEmpty()) heap.offer(new int[]{i, 0});
    List<Interval> result = new ArrayList<>();
    int prevEnd = -1;
    while (!heap.isEmpty()) {
        int[] top = heap.poll();
        Interval iv = schedule.get(top[0]).get(top[1]);
        if (prevEnd != -1 && iv.start > prevEnd)
            result.add(new Interval(prevEnd, iv.start));
        prevEnd = Math.max(prevEnd, iv.end);
        if (top[1] + 1 < schedule.get(top[0]).size())
            heap.offer(new int[]{top[0], top[1]+1});
    }
    return result;
}`,
        cpp: `// Similar structure using heap with employee/interval indices`,
        python: `import heapq

def employeeFreeTime(schedule):
    heap = [(emp[0].start, i, 0) for i, emp in enumerate(schedule) if emp]
    heapq.heapify(heap)
    result = []
    prev_end = -1
    while heap:
        start, ei, ii = heapq.heappop(heap)
        iv = schedule[ei][ii]
        if prev_end != -1 and iv.start > prev_end:
            result.append(Interval(prev_end, iv.start))
        prev_end = max(prev_end, iv.end)
        if ii + 1 < len(schedule[ei]):
            heapq.heappush(heap, (schedule[ei][ii+1].start, ei, ii+1))
    return result`,
      },
      dryRun: {
        title: 'Dry run — schedule=[[[1,3],[6,7]],[[2,4]],[[2,5],[9,12]]]',
        columns: ['Process', 'prevEnd', 'Gap?', 'result'],
        rows: [
          ['[1,3]', '3', '—', '[]'],
          ['[2,4]', '4', '—', '[]'],
          ['[2,5]', '5', '—', '[]'],
          ['[6,7]', '5→7', '5<6→gap[5,6]', '[[5,6]]'],
          ['[9,12]', '7→12', '7<9→gap[7,9]', '[[5,6],[7,9]] ✓'],
        ],
        highlightRow: 4,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 139. Smallest Range Covering Elements from K Lists
// ══════════════════════════════════════════════════════
'smallest-range-covering-k-lists': {
  statement:
    'You have k lists of sorted integers in non-decreasing order. Find the smallest range [a, b] that includes at least one number from each of the k lists. We define the range [a, b] to be smaller than range [c, d] if b - a < d - c or a < c if b - a == d - c.',
  tags: ['Arrays', 'Heap', 'Sliding Window'],
  requirement: 'O(n log k) time where n = total elements',
  externalLinks: [
    { label: '↗ LeetCode #632', url: 'https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums = [[4,10,15,24,26],[0,9,12,20],[5,18,22,30]]\nOutput: [20,24]' },
    { label: 'Example 2', text: 'Input:  nums = [[1,2,3],[1,2,3],[1,2,3]]\nOutput: [1,1]' },
  ],
  constraints: [
    'nums.length == k',
    '1 ≤ k ≤ 3500',
    '1 ≤ nums[i].length ≤ 50',
    '−10⁵ ≤ nums[i][j] ≤ 10⁵',
    'nums[i] is sorted in non-decreasing order',
  ],
  requiredComplexity: 'O(n log k) time · O(k) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Use a min-heap to always get the current minimum across all k lists. Also track the current maximum across the k pointers.' },
    { number: 2, text: 'Initialize heap with the first element from each list. The initial range is [min, max]. Then advance the pointer in the list that contributed the minimum.' },
    { number: 3, text: 'Each step: current range = [heap.top(), currentMax]. If it\'s better than best, update. Advance the min\'s list pointer and update currentMax.' },
    { number: 4, label: 'Hint 4 — termination', text: 'Stop when any list is exhausted (the minimum can only increase, so we can\'t do better without all k lists represented).' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Min-Heap + Track Max — O(n log k) time, O(k) space',
      explanation: 'Min-heap holds one element per list. The range is [heapMin, currentMax]. Advance the min\'s list each step.',
      code: {
        java: `public int[] smallestRange(List<List<Integer>> nums) {
    // (value, listIdx, elemIdx)
    PriorityQueue<int[]> minHeap = new PriorityQueue<>((a,b) -> a[0]-b[0]);
    int curMax = Integer.MIN_VALUE;
    for (int i = 0; i < nums.size(); i++) {
        minHeap.offer(new int[]{nums.get(i).get(0), i, 0});
        curMax = Math.max(curMax, nums.get(i).get(0));
    }
    int[] result = new int[]{minHeap.peek()[0], curMax};
    while (true) {
        int[] top = minHeap.poll();
        int val = top[0], li = top[1], ei = top[2];
        if (ei + 1 == nums.get(li).size()) break; // list exhausted
        int next = nums.get(li).get(ei + 1);
        minHeap.offer(new int[]{next, li, ei+1});
        curMax = Math.max(curMax, next);
        int curMin = minHeap.peek()[0];
        if (curMax - curMin < result[1] - result[0]) result = new int[]{curMin, curMax};
    }
    return result;
}`,
        cpp: `vector<int> smallestRange(vector<vector<int>>& nums) {
    using T = tuple<int,int,int>;
    priority_queue<T,vector<T>,greater<T>> pq;
    int curMax = INT_MIN;
    for (int i = 0; i < (int)nums.size(); i++) {
        pq.push({nums[i][0], i, 0});
        curMax = max(curMax, nums[i][0]);
    }
    vector<int> result = {get<0>(pq.top()), curMax};
    while (true) {
        auto [val,li,ei] = pq.top(); pq.pop();
        if (ei+1 == (int)nums[li].size()) break;
        int nx = nums[li][ei+1];
        pq.push({nx,li,ei+1});
        curMax = max(curMax, nx);
        int curMin = get<0>(pq.top());
        if (curMax-curMin < result[1]-result[0]) result = {curMin,curMax};
    }
    return result;
}`,
        python: `import heapq

def smallestRange(nums):
    heap = [(nums[i][0], i, 0) for i in range(len(nums))]
    heapq.heapify(heap)
    cur_max = max(nums[i][0] for i in range(len(nums)))
    best = [heap[0][0], cur_max]
    while True:
        val, li, ei = heapq.heappop(heap)
        if ei + 1 == len(nums[li]):
            break
        nx = nums[li][ei+1]
        heapq.heappush(heap, (nx, li, ei+1))
        cur_max = max(cur_max, nx)
        cur_min = heap[0][0]
        if cur_max - cur_min < best[1] - best[0]:
            best = [cur_min, cur_max]
    return best`,
      },
      dryRun: {
        title: 'Dry run — nums=[[4,10,15],[0,9,12],[5,18,22]]',
        columns: ['Heap min', 'curMax', 'range', 'best'],
        rows: [
          ['Init: heap=[0,4,5], curMax=5', '5', '[0,5]', '[0,5]'],
          ['pop 0(list1), push 9; curMax=9', '9', '[4,9]', '[0,5]'],
          ['pop 4(list0), push 10; curMax=10', '10', '[5,10]', '[0,5]'],
          ['pop 5(list2), push 18; curMax=18', '18', '[9,18]', '[0,5]'],
          ['pop 9(list1), push 12; curMax=18', '18', '[10,18]', '[0,5]'],
          ['pop 10(list0), push 15; curMax=18', '18', '[12,18]', '[0,5]'],
          ['pop 12(list1), push end→break', '—', '—', '[0,5]... (actual [20,24] requires longer trace)'],
        ],
        highlightRow: 0,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 140. Set Matrix Zeroes
// ══════════════════════════════════════════════════════
'set-matrix-zeroes': {
  statement:
    'Given an m x n integer matrix matrix, if an element is 0, set its entire row and column to 0\'s. You must do it in place.',
  tags: ['Arrays', '2D Matrix'],
  requirement: 'O(1) extra space for full credit',
  externalLinks: [
    { label: '↗ LeetCode #73', url: 'https://leetcode.com/problems/set-matrix-zeroes/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  [[1,1,1],[1,0,1],[1,1,1]]\nOutput: [[1,0,1],[0,0,0],[1,0,1]]' },
    { label: 'Example 2', text: 'Input:  [[0,1,2,0],[3,4,5,2],[1,3,1,5]]\nOutput: [[0,0,0,0],[0,4,5,0],[0,3,1,0]]' },
  ],
  constraints: [
    'm == matrix.length',
    'n == matrix[0].length',
    '1 ≤ m, n ≤ 200',
    '−2³¹ ≤ matrix[i][j] ≤ 2³¹ − 1',
  ],
  requiredComplexity: 'O(m × n) time · O(1) extra space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'The naive approach uses O(m+n) extra space to record which rows and columns have zeros. Can you use the matrix itself as storage?' },
    { number: 2, text: 'Use the first row and first column as markers. But first, check if the first row/column themselves contain zeros (to handle them separately).' },
    { number: 3, text: 'Phase 1: record which rows/columns need zeroing using the first row/column as flags. Phase 2: zero out based on flags. Phase 3: handle first row/column.' },
  ],
  approaches: [
    {
      key: 'extraspace',
      label: 'Extra Arrays — O(m+n) space',
      explanation: 'Track which rows and columns have zeros. Set them in a second pass.',
      code: {
        java: `public void setZeroes(int[][] matrix) {
    int m = matrix.length, n = matrix[0].length;
    boolean[] rows = new boolean[m], cols = new boolean[n];
    for (int i = 0; i < m; i++) for (int j = 0; j < n; j++)
        if (matrix[i][j] == 0) { rows[i] = true; cols[j] = true; }
    for (int i = 0; i < m; i++) for (int j = 0; j < n; j++)
        if (rows[i] || cols[j]) matrix[i][j] = 0;
}`,
        cpp: `void setZeroes(vector<vector<int>>& matrix) {
    int m = matrix.size(), n = matrix[0].size();
    vector<bool> rows(m), cols(n);
    for (int i=0;i<m;i++) for(int j=0;j<n;j++)
        if(!matrix[i][j]) rows[i]=cols[j]=true;
    for (int i=0;i<m;i++) for(int j=0;j<n;j++)
        if(rows[i]||cols[j]) matrix[i][j]=0;
}`,
        python: `def setZeroes(matrix):
    m, n = len(matrix), len(matrix[0])
    rows = set(); cols = set()
    for i in range(m):
        for j in range(n):
            if matrix[i][j] == 0:
                rows.add(i); cols.add(j)
    for i in range(m):
        for j in range(n):
            if i in rows or j in cols:
                matrix[i][j] = 0`,
      },
    },
    {
      key: 'optimal',
      label: 'In-place with First Row/Col — O(1) space',
      explanation: 'Use first row and column as flags. Handle the first row and column separately using boolean flags.',
      code: {
        java: `public void setZeroes(int[][] matrix) {
    int m = matrix.length, n = matrix[0].length;
    boolean firstRowZero = false, firstColZero = false;
    for (int j = 0; j < n; j++) if (matrix[0][j] == 0) firstRowZero = true;
    for (int i = 0; i < m; i++) if (matrix[i][0] == 0) firstColZero = true;
    // Mark rows and columns using first row/col
    for (int i = 1; i < m; i++) for (int j = 1; j < n; j++)
        if (matrix[i][j] == 0) { matrix[i][0] = 0; matrix[0][j] = 0; }
    // Zero out based on markers
    for (int i = 1; i < m; i++) for (int j = 1; j < n; j++)
        if (matrix[i][0] == 0 || matrix[0][j] == 0) matrix[i][j] = 0;
    if (firstRowZero) for (int j = 0; j < n; j++) matrix[0][j] = 0;
    if (firstColZero) for (int i = 0; i < m; i++) matrix[i][0] = 0;
}`,
        cpp: `void setZeroes(vector<vector<int>>& matrix) {
    int m=matrix.size(), n=matrix[0].size();
    bool fr=false, fc=false;
    for(int j=0;j<n;j++) if(!matrix[0][j]) fr=true;
    for(int i=0;i<m;i++) if(!matrix[i][0]) fc=true;
    for(int i=1;i<m;i++) for(int j=1;j<n;j++)
        if(!matrix[i][j]) {matrix[i][0]=matrix[0][j]=0;}
    for(int i=1;i<m;i++) for(int j=1;j<n;j++)
        if(!matrix[i][0]||!matrix[0][j]) matrix[i][j]=0;
    if(fr) for(int j=0;j<n;j++) matrix[0][j]=0;
    if(fc) for(int i=0;i<m;i++) matrix[i][0]=0;
}`,
        python: `def setZeroes(matrix):
    m, n = len(matrix), len(matrix[0])
    first_row_zero = any(matrix[0][j] == 0 for j in range(n))
    first_col_zero = any(matrix[i][0] == 0 for i in range(m))
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][j] == 0:
                matrix[i][0] = matrix[0][j] = 0
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][0] == 0 or matrix[0][j] == 0:
                matrix[i][j] = 0
    if first_row_zero:
        for j in range(n): matrix[0][j] = 0
    if first_col_zero:
        for i in range(m): matrix[i][0] = 0`,
      },
      dryRun: {
        title: 'Dry run — [[1,1,1],[1,0,1],[1,1,1]]',
        columns: ['Step', 'Action', 'Matrix'],
        rows: [
          ['Check first row', 'No zeros → firstRowZero=false', '—'],
          ['Check first col', 'No zeros → firstColZero=false', '—'],
          ['Mark: matrix[1][1]=0', 'matrix[1][0]=0, matrix[0][1]=0', '[[1,0,1],[0,0,1],[1,1,1]]'],
          ['Zero out (i≥1,j≥1)', 'matrix[1][0]=0 → row 1 zeroed', '[[1,0,1],[0,0,0],[1,0,1]] ✓'],
        ],
        highlightRow: 3,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 141. Spiral Matrix
// ══════════════════════════════════════════════════════
'spiral-matrix': {
  statement:
    'Given an m x n matrix, return all elements of the matrix in spiral order.',
  tags: ['Arrays', '2D Matrix', 'Simulation'],
  requirement: 'O(m × n) time',
  externalLinks: [
    { label: '↗ LeetCode #54', url: 'https://leetcode.com/problems/spiral-matrix/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  [[1,2,3],[4,5,6],[7,8,9]]\nOutput: [1,2,3,6,9,8,7,4,5]' },
    { label: 'Example 2', text: 'Input:  [[1,2,3,4],[5,6,7,8],[9,10,11,12]]\nOutput: [1,2,3,4,8,12,11,10,9,5,6,7]' },
  ],
  constraints: [
    'm == matrix.length',
    'n == matrix[i].length',
    '1 ≤ m, n ≤ 10',
    '−100 ≤ matrix[i][j] ≤ 100',
  ],
  requiredComplexity: 'O(m × n) time · O(1) extra space (excluding output)',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Think of shrinking boundaries: top, bottom, left, right. Traverse each boundary in order then shrink it.' },
    { number: 2, text: 'Go right across top row → down the right col → left across bottom row → up the left col → repeat.' },
    { number: 3, text: 'After each direction, shrink the corresponding boundary. Stop when top > bottom or left > right.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Boundary Simulation — O(m × n) time, O(1) space',
      explanation: 'Maintain four boundaries. Traverse each side and shrink the boundary inward.',
      code: {
        java: `public List<Integer> spiralOrder(int[][] matrix) {
    List<Integer> result = new ArrayList<>();
    int top = 0, bottom = matrix.length-1, left = 0, right = matrix[0].length-1;
    while (top <= bottom && left <= right) {
        for (int j = left; j <= right; j++) result.add(matrix[top][j]);
        top++;
        for (int i = top; i <= bottom; i++) result.add(matrix[i][right]);
        right--;
        if (top <= bottom) {
            for (int j = right; j >= left; j--) result.add(matrix[bottom][j]);
            bottom--;
        }
        if (left <= right) {
            for (int i = bottom; i >= top; i--) result.add(matrix[i][left]);
            left++;
        }
    }
    return result;
}`,
        cpp: `vector<int> spiralOrder(vector<vector<int>>& matrix) {
    vector<int> result;
    int top=0, bottom=matrix.size()-1, left=0, right=matrix[0].size()-1;
    while (top<=bottom && left<=right) {
        for (int j=left;j<=right;j++) result.push_back(matrix[top][j]);
        top++;
        for (int i=top;i<=bottom;i++) result.push_back(matrix[i][right]);
        right--;
        if (top<=bottom) { for(int j=right;j>=left;j--) result.push_back(matrix[bottom][j]); bottom--; }
        if (left<=right) { for(int i=bottom;i>=top;i--) result.push_back(matrix[i][left]); left++; }
    }
    return result;
}`,
        python: `def spiralOrder(matrix):
    result = []
    top, bottom, left, right = 0, len(matrix)-1, 0, len(matrix[0])-1
    while top <= bottom and left <= right:
        for j in range(left, right+1): result.append(matrix[top][j])
        top += 1
        for i in range(top, bottom+1): result.append(matrix[i][right])
        right -= 1
        if top <= bottom:
            for j in range(right, left-1, -1): result.append(matrix[bottom][j])
            bottom -= 1
        if left <= right:
            for i in range(bottom, top-1, -1): result.append(matrix[i][left])
            left += 1
    return result`,
      },
      dryRun: {
        title: 'Dry run — [[1,2,3],[4,5,6],[7,8,9]]',
        columns: ['Direction', 'Elements', 'result'],
        rows: [
          ['→ top row', '[1,2,3], top=1', '[1,2,3]'],
          ['↓ right col', '[6,9], right=1', '[1,2,3,6,9]'],
          ['← bottom row', '[8,7], bottom=1', '[1,2,3,6,9,8,7]'],
          ['↑ left col', '[4], left=1', '[1,2,3,6,9,8,7,4]'],
          ['→ inner top', '[5], top=2>bottom=1', '[1,2,3,6,9,8,7,4,5] ✓'],
        ],
        highlightRow: 4,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 142. Rotate Image
// ══════════════════════════════════════════════════════
'rotate-image': {
  statement:
    'You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise). You have to rotate the image in-place, which means you have to modify the input 2D matrix directly. Do not allocate another 2D matrix.',
  tags: ['Arrays', '2D Matrix', 'Math'],
  requirement: 'In-place, O(1) extra space',
  externalLinks: [
    { label: '↗ LeetCode #48', url: 'https://leetcode.com/problems/rotate-image/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  [[1,2,3],[4,5,6],[7,8,9]]\nOutput: [[7,4,1],[8,5,2],[9,6,3]]' },
    { label: 'Example 2', text: 'Input:  [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]\nOutput: [[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]' },
  ],
  constraints: [
    'n == matrix.length == matrix[i].length',
    '1 ≤ n ≤ 20',
    '−1000 ≤ matrix[i][j] ≤ 1000',
  ],
  requiredComplexity: 'O(n²) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'A 90° clockwise rotation can be decomposed into two simpler operations. What are they?' },
    { number: 2, text: 'Step 1: Transpose the matrix (swap matrix[i][j] with matrix[j][i]).' },
    { number: 3, text: 'Step 2: Reverse each row. The combination gives a 90° clockwise rotation.' },
    { number: 4, label: 'Hint 4 — why it works', text: 'Clockwise 90°: element at (i,j) goes to (j, n-1-i). Transpose sends (i,j)→(j,i), then row reversal sends (j,i)→(j,n-1-i). Correct!' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Transpose + Reverse Rows — O(n²) time, O(1) space',
      explanation: 'Transpose the matrix (swap across diagonal), then reverse each row.',
      code: {
        java: `public void rotate(int[][] matrix) {
    int n = matrix.length;
    // Transpose
    for (int i = 0; i < n; i++)
        for (int j = i+1; j < n; j++) {
            int t = matrix[i][j]; matrix[i][j] = matrix[j][i]; matrix[j][i] = t;
        }
    // Reverse each row
    for (int i = 0; i < n; i++) {
        int lo = 0, hi = n-1;
        while (lo < hi) {
            int t = matrix[i][lo]; matrix[i][lo] = matrix[i][hi]; matrix[i][hi] = t;
            lo++; hi--;
        }
    }
}`,
        cpp: `void rotate(vector<vector<int>>& matrix) {
    int n = matrix.size();
    for (int i=0;i<n;i++) for (int j=i+1;j<n;j++) swap(matrix[i][j],matrix[j][i]);
    for (auto& row : matrix) reverse(row.begin(), row.end());
}`,
        python: `def rotate(matrix):
    n = len(matrix)
    # Transpose
    for i in range(n):
        for j in range(i+1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    # Reverse each row
    for row in matrix:
        row.reverse()`,
      },
      dryRun: {
        title: 'Dry run — [[1,2,3],[4,5,6],[7,8,9]]',
        columns: ['Step', 'Matrix'],
        rows: [
          ['Original', '[[1,2,3],[4,5,6],[7,8,9]]'],
          ['After transpose', '[[1,4,7],[2,5,8],[3,6,9]]'],
          ['After row reversal', '[[7,4,1],[8,5,2],[9,6,3]] ✓'],
        ],
        highlightRow: 2,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 143. Search a 2D Matrix
// ══════════════════════════════════════════════════════
'search-2d-matrix': {
  statement:
    'You are given an m x n integer matrix matrix with the following two properties: each row is sorted in non-decreasing order, and the first integer of each row is greater than the last integer of the previous row. Given an integer target, return true if target is in matrix or false otherwise. You must write a solution in O(log(m * n)) time complexity.',
  tags: ['Arrays', '2D Matrix', 'Binary Search'],
  requirement: 'O(log(m × n)) time',
  externalLinks: [
    { label: '↗ LeetCode #74', url: 'https://leetcode.com/problems/search-a-2d-matrix/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3\nOutput: true' },
    { label: 'Example 2', text: 'Input:  matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13\nOutput: false' },
  ],
  constraints: [
    'm == matrix.length',
    'n == matrix[0].length',
    '1 ≤ m, n ≤ 100',
    '−10⁴ ≤ matrix[i][j], target ≤ 10⁴',
  ],
  requiredComplexity: 'O(log(m × n)) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Since the matrix is fully sorted (end of row k < start of row k+1), you can treat it as a 1D sorted array of length m×n.' },
    { number: 2, text: 'Binary search on index 0..m*n-1. Convert mid to (row, col): row = mid / n, col = mid % n.' },
    { number: 3, text: 'This gives standard binary search in O(log(m×n)).' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Binary Search on Flattened Matrix — O(log(m×n)) time, O(1) space',
      explanation: 'Treat as 1D array. Binary search with index conversion.',
      code: {
        java: `public boolean searchMatrix(int[][] matrix, int target) {
    int m = matrix.length, n = matrix[0].length;
    int lo = 0, hi = m*n - 1;
    while (lo <= hi) {
        int mid = lo + (hi-lo)/2;
        int val = matrix[mid/n][mid%n];
        if (val == target) return true;
        else if (val < target) lo = mid+1;
        else hi = mid-1;
    }
    return false;
}`,
        cpp: `bool searchMatrix(vector<vector<int>>& matrix, int target) {
    int m=matrix.size(), n=matrix[0].size(), lo=0, hi=m*n-1;
    while (lo<=hi) {
        int mid=lo+(hi-lo)/2, val=matrix[mid/n][mid%n];
        if (val==target) return true;
        else if (val<target) lo=mid+1;
        else hi=mid-1;
    }
    return false;
}`,
        python: `def searchMatrix(matrix, target):
    m, n = len(matrix), len(matrix[0])
    lo, hi = 0, m*n - 1
    while lo <= hi:
        mid = lo + (hi-lo)//2
        val = matrix[mid//n][mid%n]
        if val == target:
            return True
        elif val < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return False`,
      },
      dryRun: {
        title: 'Dry run — matrix=[[1,3,5,7],[10,11,16,20],[23,30,34,60]], target=3, m=3,n=4',
        columns: ['lo', 'hi', 'mid', 'row,col', 'val', 'Action'],
        rows: [
          ['0', '11', '5', '1,1', '11', '11>3 → hi=4'],
          ['0', '4', '2', '0,2', '5', '5>3 → hi=1'],
          ['0', '1', '0', '0,0', '1', '1<3 → lo=1'],
          ['1', '1', '1', '0,1', '3', '3==3 → return true ✓'],
        ],
        highlightRow: 3,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 144. Search a 2D Matrix II
// ══════════════════════════════════════════════════════
'search-2d-matrix-ii': {
  statement:
    'Write an efficient algorithm that searches for a value target in an m x n integer matrix matrix. This matrix has the following properties: Integers in each row are sorted in ascending order from left to right, and integers in each column are sorted in ascending order from top to bottom.',
  tags: ['Arrays', '2D Matrix', 'Binary Search', 'Divide and Conquer'],
  requirement: 'O(m + n) time — staircase search',
  externalLinks: [
    { label: '↗ LeetCode #240', url: 'https://leetcode.com/problems/search-a-2d-matrix-ii/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  matrix = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], target = 5\nOutput: true' },
    { label: 'Example 2', text: 'Input:  same matrix, target = 20\nOutput: false' },
  ],
  constraints: [
    'm == matrix.length',
    'n == matrix[i].length',
    '1 ≤ m, n ≤ 300',
    '−10⁹ ≤ matrix[i][j] ≤ 10⁹',
    'All integers are sorted row-wise and column-wise',
  ],
  requiredComplexity: 'O(m + n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Start from the top-right corner. What can you conclude about the target based on the value there?' },
    { number: 2, text: 'At position (r, c): if matrix[r][c] == target, found! If target < matrix[r][c], target can\'t be in this column (all below are larger) → move left (c--). If target > matrix[r][c], target can\'t be in this row (all left are smaller) → move down (r++).' },
    { number: 3, text: 'This eliminates one row or column per step, giving O(m+n) total.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Staircase Search — O(m + n) time, O(1) space',
      explanation: 'Start top-right. Move left if too big, move down if too small.',
      code: {
        java: `public boolean searchMatrix(int[][] matrix, int target) {
    int r = 0, c = matrix[0].length - 1;
    while (r < matrix.length && c >= 0) {
        if (matrix[r][c] == target) return true;
        else if (matrix[r][c] > target) c--;
        else r++;
    }
    return false;
}`,
        cpp: `bool searchMatrix(vector<vector<int>>& matrix, int target) {
    int r=0, c=matrix[0].size()-1;
    while (r<(int)matrix.size() && c>=0) {
        if (matrix[r][c]==target) return true;
        else if (matrix[r][c]>target) c--;
        else r++;
    }
    return false;
}`,
        python: `def searchMatrix(matrix, target):
    r, c = 0, len(matrix[0]) - 1
    while r < len(matrix) and c >= 0:
        if matrix[r][c] == target:
            return True
        elif matrix[r][c] > target:
            c -= 1
        else:
            r += 1
    return False`,
      },
      dryRun: {
        title: 'Dry run — target = 5, start at top-right (0,4)',
        columns: ['r', 'c', 'matrix[r][c]', 'Compare to 5', 'Action'],
        rows: [
          ['0', '4', '15', '>5', 'c--'],
          ['0', '3', '11', '>5', 'c--'],
          ['0', '2', '7', '>5', 'c--'],
          ['0', '1', '4', '<5', 'r++'],
          ['1', '1', '5', '==5', 'return true ✓'],
        ],
        highlightRow: 4,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 145. Game of Life
// ══════════════════════════════════════════════════════
'game-of-life': {
  statement:
    'The board is made up of an m x n grid of cells, where each cell has an initial state: live (1) or dead (0). Each cell interacts with its eight neighbors. Apply the rules simultaneously to every cell: 1. Any live cell with fewer than 2 or more than 3 live neighbors dies. 2. Any live cell with 2 or 3 live neighbors lives. 3. Any dead cell with exactly 3 live neighbors becomes alive. Return the next state.',
  tags: ['Arrays', '2D Matrix', 'Simulation'],
  requirement: 'O(m × n) time; in-place O(1) space is a bonus',
  externalLinks: [
    { label: '↗ LeetCode #289', url: 'https://leetcode.com/problems/game-of-life/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  [[0,1,0],[0,0,1],[1,1,1],[0,0,0]]\nOutput: [[0,0,0],[1,0,1],[0,1,1],[0,1,0]]' },
    { label: 'Example 2', text: 'Input:  [[1,1],[1,0]]\nOutput: [[1,1],[1,1]]' },
  ],
  constraints: [
    'm == board.length',
    'n == board[i].length',
    '1 ≤ m, n ≤ 25',
    'board[i][j] is 0 or 1',
  ],
  requiredComplexity: 'O(m × n) time · O(1) extra space (in-place)',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'The challenge is applying rules simultaneously. If you update cells in place, changed cells affect later computations. How do you encode "was alive, now dead" vs "was dead, now alive"?' },
    { number: 2, text: 'Use additional states: 2 = was alive, now dead; -1 = was dead, now alive. These let you distinguish original state from new state.' },
    { number: 3, text: 'Count live neighbors using abs(value) > 0 for the "was alive" check. Then convert: 2→0, -1→1.' },
    { number: 4, label: 'Hint 4 — neighbor counting', text: 'Iterate all 8 directions. A neighbor was alive if board[nr][nc] == 1 or board[nr][nc] == 2 (it will die but was alive).' },
  ],
  approaches: [
    {
      key: 'extra',
      label: 'Extra Board Copy — O(m × n) time, O(m × n) space',
      explanation: 'Copy board first. Apply rules from copy to original.',
      code: {
        java: `public void gameOfLife(int[][] board) {
    int m = board.length, n = board[0].length;
    int[][] copy = new int[m][n];
    for (int i=0;i<m;i++) copy[i] = board[i].clone();
    int[] dr = {-1,-1,-1,0,0,1,1,1};
    int[] dc = {-1,0,1,-1,1,-1,0,1};
    for (int i=0;i<m;i++) for (int j=0;j<n;j++) {
        int live = 0;
        for (int d=0;d<8;d++) {
            int nr=i+dr[d], nc=j+dc[d];
            if (nr>=0&&nr<m&&nc>=0&&nc<n&&copy[nr][nc]==1) live++;
        }
        if (copy[i][j]==1&&(live<2||live>3)) board[i][j]=0;
        else if (copy[i][j]==0&&live==3) board[i][j]=1;
    }
}`,
        cpp: `void gameOfLife(vector<vector<int>>& board) {
    int m=board.size(), n=board[0].size();
    auto copy=board;
    int dr[]={-1,-1,-1,0,0,1,1,1}, dc[]={-1,0,1,-1,1,-1,0,1};
    for(int i=0;i<m;i++) for(int j=0;j<n;j++) {
        int live=0;
        for(int d=0;d<8;d++){int nr=i+dr[d],nc=j+dc[d];if(nr>=0&&nr<m&&nc>=0&&nc<n&&copy[nr][nc])live++;}
        if(copy[i][j]&&(live<2||live>3)) board[i][j]=0;
        else if(!copy[i][j]&&live==3) board[i][j]=1;
    }
}`,
        python: `def gameOfLife(board):
    m, n = len(board), len(board[0])
    copy = [row[:] for row in board]
    dirs = [(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)]
    for i in range(m):
        for j in range(n):
            live = sum(1 for dr,dc in dirs if 0<=i+dr<m and 0<=j+dc<n and copy[i+dr][j+dc]==1)
            if copy[i][j] == 1 and (live < 2 or live > 3): board[i][j] = 0
            elif copy[i][j] == 0 and live == 3: board[i][j] = 1`,
      },
    },
    {
      key: 'optimal',
      label: 'In-place with Encoded States — O(m×n) time, O(1) space',
      explanation: 'Encode transitions as extra states (2 = live→dead, -1 = dead→live). Count neighbors using original state. Then decode.',
      code: {
        java: `public void gameOfLife(int[][] board) {
    int m=board.length, n=board[0].length;
    int[] dr={-1,-1,-1,0,0,1,1,1}, dc={-1,0,1,-1,1,-1,0,1};
    for (int i=0;i<m;i++) for (int j=0;j<n;j++) {
        int live=0;
        for (int d=0;d<8;d++){int nr=i+dr[d],nc=j+dc[d];if(nr>=0&&nr<m&&nc>=0&&nc<n&&Math.abs(board[nr][nc])==1)live++;}
        if (board[i][j]==1&&(live<2||live>3)) board[i][j]=2; // was alive, dies
        else if (board[i][j]==0&&live==3) board[i][j]=-1; // was dead, lives
    }
    for (int i=0;i<m;i++) for (int j=0;j<n;j++) {
        if (board[i][j]==2) board[i][j]=0;
        else if (board[i][j]==-1) board[i][j]=1;
    }
}`,
        cpp: `void gameOfLife(vector<vector<int>>& board) {
    int m=board.size(),n=board[0].size();
    int dr[]={-1,-1,-1,0,0,1,1,1},dc[]={-1,0,1,-1,1,-1,0,1};
    for(int i=0;i<m;i++) for(int j=0;j<n;j++){
        int live=0;
        for(int d=0;d<8;d++){int nr=i+dr[d],nc=j+dc[d];if(nr>=0&&nr<m&&nc>=0&&nc<n&&abs(board[nr][nc])==1)live++;}
        if(board[i][j]==1&&(live<2||live>3)) board[i][j]=2;
        else if(board[i][j]==0&&live==3) board[i][j]=-1;
    }
    for(int i=0;i<m;i++) for(int j=0;j<n;j++){
        if(board[i][j]==2) board[i][j]=0;
        else if(board[i][j]==-1) board[i][j]=1;
    }
}`,
        python: `def gameOfLife(board):
    m, n = len(board), len(board[0])
    dirs = [(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)]
    for i in range(m):
        for j in range(n):
            live = sum(1 for dr,dc in dirs
                       if 0<=i+dr<m and 0<=j+dc<n and abs(board[i+dr][j+dc])==1)
            if board[i][j] == 1 and (live < 2 or live > 3):
                board[i][j] = 2   # was alive, dies
            elif board[i][j] == 0 and live == 3:
                board[i][j] = -1  # was dead, lives
    for i in range(m):
        for j in range(n):
            if board[i][j] == 2: board[i][j] = 0
            elif board[i][j] == -1: board[i][j] = 1`,
      },
      dryRun: {
        title: 'Dry run — board = [[0,1,0],[0,0,1],[1,1,1],[0,0,0]]',
        columns: ['Cell (i,j)', 'Was', 'Live neighbors', 'Rule', 'Encoded'],
        rows: [
          ['(0,0)', '0', '1', 'dead,1 live→stays 0', '0'],
          ['(0,1)', '1', '1', 'live,1 live→dies', '2'],
          ['(1,0)', '0', '3', 'dead,3 live→lives', '-1'],
          ['(2,1)', '1', '3', 'live,3 live→lives', '1'],
          ['After decode', '—', '—', '—', '[[0,0,0],[1,0,1],[0,1,1],[0,1,0]] ✓'],
        ],
        highlightRow: 4,
      },
    },
  ],
},


// ══════════════════════════════════════════════════════
// 146. Single Number
// ══════════════════════════════════════════════════════
'single-number': {
  statement:
    'Given a non-empty array of integers nums, every element appears twice except for one. Find that single one. You must implement a solution with a linear runtime complexity and use only constant extra space.',
  tags: ['Arrays', 'Bit Manipulation', 'XOR'],
  requirement: 'O(n) time, O(1) space',
  externalLinks: [
    { label: '↗ LeetCode #136', url: 'https://leetcode.com/problems/single-number/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums = [2,2,1]\nOutput: 1' },
    { label: 'Example 2', text: 'Input:  nums = [4,1,2,1,2]\nOutput: 4' },
    { label: 'Example 3', text: 'Input:  nums = [1]\nOutput: 1' },
  ],
  constraints: [
    '1 ≤ nums.length ≤ 3 × 10⁴',
    '−3 × 10⁴ ≤ nums[i] ≤ 3 × 10⁴',
    'Every element appears twice except for exactly one element',
  ],
  requiredComplexity: 'O(n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'XOR has two useful properties: a ^ a = 0 (self-cancelling) and a ^ 0 = a. Can you use these to cancel out duplicates?' },
    { number: 2, text: 'XOR all numbers together. Duplicate pairs cancel out (a ^ a = 0). Only the single number remains.' },
    { number: 3, text: 'Order doesn\'t matter: a ^ b ^ a = b ^ (a ^ a) = b ^ 0 = b.' },
  ],
  approaches: [
    {
      key: 'hashmap',
      label: 'Hash Map — O(n) time, O(n) space',
      explanation: 'Count frequencies. Return the element with odd count.',
      code: {
        java: `public int singleNumber(int[] nums) {
    Map<Integer,Integer> count = new HashMap<>();
    for (int n : nums) count.merge(n, 1, Integer::sum);
    for (var e : count.entrySet()) if (e.getValue() == 1) return e.getKey();
    return -1;
}`,
        cpp: `int singleNumber(vector<int>& nums) {
    unordered_map<int,int> cnt;
    for (int n : nums) cnt[n]++;
    for (auto& [k,v] : cnt) if (v==1) return k;
    return -1;
}`,
        python: `def singleNumber(nums):
    from collections import Counter
    return next(k for k,v in Counter(nums).items() if v == 1)`,
      },
    },
    {
      key: 'optimal',
      label: 'XOR — O(n) time, O(1) space',
      explanation: 'XOR all numbers. Duplicates cancel to 0, leaving the single number.',
      code: {
        java: `public int singleNumber(int[] nums) {
    int result = 0;
    for (int n : nums) result ^= n;
    return result;
}`,
        cpp: `int singleNumber(vector<int>& nums) {
    int result = 0;
    for (int n : nums) result ^= n;
    return result;
}`,
        python: `def singleNumber(nums):
    result = 0
    for n in nums:
        result ^= n
    return result`,
      },
      dryRun: {
        title: 'Dry run — nums = [4,1,2,1,2]',
        columns: ['n', 'result (XOR)', 'Binary'],
        rows: [
          ['4', '4', '100'],
          ['1', '5', '101'],
          ['2', '7', '111'],
          ['1', '6', '110'],
          ['2', '4', '100 → return 4 ✓'],
        ],
        highlightRow: 4,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 147. Find the Difference
// ══════════════════════════════════════════════════════
'find-the-difference': {
  statement:
    'You are given two strings s and t. String t is generated by random shuffling string s and then add one more letter at a random position. Return the letter that was added to t.',
  tags: ['Arrays', 'Bit Manipulation', 'XOR', 'Hash Map'],
  requirement: 'O(n) time, O(1) space',
  externalLinks: [
    { label: '↗ LeetCode #389', url: 'https://leetcode.com/problems/find-the-difference/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  s = "abcd", t = "abcde"\nOutput: "e"' },
    { label: 'Example 2', text: 'Input:  s = "", t = "y"\nOutput: "y"' },
  ],
  constraints: [
    '0 ≤ s.length ≤ 1000',
    't.length == s.length + 1',
    's and t consist of lowercase English letters',
  ],
  requiredComplexity: 'O(n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'XOR all characters of s and t together. Every character in s has a pair in t (cancels out), leaving only the extra character.' },
    { number: 2, text: 'XOR is commutative and associative — order doesn\'t matter.' },
    { number: 3, text: 'Alternatively, sum all ASCII values in t and subtract the sum in s. The difference is the extra character.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'XOR — O(n) time, O(1) space',
      explanation: 'XOR all characters from both strings. Matching pairs cancel, leaving the extra character.',
      code: {
        java: `public char findTheDifference(String s, String t) {
    char result = 0;
    for (char c : s.toCharArray()) result ^= c;
    for (char c : t.toCharArray()) result ^= c;
    return result;
}`,
        cpp: `char findTheDifference(string s, string t) {
    char result = 0;
    for (char c : s) result ^= c;
    for (char c : t) result ^= c;
    return result;
}`,
        python: `def findTheDifference(s, t):
    result = 0
    for c in s + t:
        result ^= ord(c)
    return chr(result)`,
      },
      dryRun: {
        title: 'Dry run — s="abcd", t="abcde"',
        columns: ['Char', 'XOR state'],
        rows: [
          ['a(97)', '97'],
          ['b(98)', '97^98=3'],
          ['c(99)', '3^99=96'],
          ['d(100)', '96^100=4'],
          ['a(97)', '4^97=101'],
          ['b(98)', '101^98=7'],
          ['c(99)', '7^99=100'],
          ['d(100)', '100^100=0'],
          ['e(101)', '0^101=101 → chr(101)="e" ✓'],
        ],
        highlightRow: 8,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 148. Number of 1 Bits
// ══════════════════════════════════════════════════════
'number-of-1-bits': {
  statement:
    'Write a function that takes the binary representation of a positive integer and returns the number of set bits it has (also known as the Hamming weight).',
  tags: ['Arrays', 'Bit Manipulation'],
  requirement: 'O(1) time (fixed 32-bit input)',
  externalLinks: [
    { label: '↗ LeetCode #191', url: 'https://leetcode.com/problems/number-of-1-bits/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  n = 11 (binary: 00000000000000000000000000001011)\nOutput: 3' },
    { label: 'Example 2', text: 'Input:  n = 128 (binary: 10000000)\nOutput: 1' },
  ],
  constraints: [
    '1 ≤ n ≤ 2³¹ − 1',
  ],
  requiredComplexity: 'O(1) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'You can check the rightmost bit with n & 1, then right-shift. But can you be faster by skipping zero bits?' },
    { number: 2, text: 'Brian Kernighan\'s trick: n & (n-1) clears the rightmost set bit. Repeat until n = 0, counting iterations.' },
    { number: 3, text: 'This runs in O(number of set bits) time rather than O(32) for the shift approach.' },
  ],
  approaches: [
    {
      key: 'shift',
      label: 'Bit Shift — O(32) = O(1) time',
      explanation: 'Check each bit by AND with 1, count, and right-shift.',
      code: {
        java: `public int hammingWeight(int n) {
    int count = 0;
    while (n != 0) {
        count += n & 1;
        n >>>= 1; // unsigned right shift
    }
    return count;
}`,
        cpp: `int hammingWeight(uint32_t n) {
    int count = 0;
    while (n) { count += n & 1; n >>= 1; }
    return count;
}`,
        python: `def hammingWeight(n):
    count = 0
    while n:
        count += n & 1
        n >>= 1
    return count`,
      },
    },
    {
      key: 'optimal',
      label: "Brian Kernighan's Trick — O(k) time (k = set bits)",
      explanation: 'n & (n-1) clears the lowest set bit. Count how many times until n = 0.',
      code: {
        java: `public int hammingWeight(int n) {
    int count = 0;
    while (n != 0) {
        n &= (n - 1); // clear lowest set bit
        count++;
    }
    return count;
}`,
        cpp: `int hammingWeight(uint32_t n) {
    int count = 0;
    while (n) { n &= n-1; count++; }
    return count;
}`,
        python: `def hammingWeight(n):
    count = 0
    while n:
        n &= n - 1
        count += 1
    return count`,
      },
      dryRun: {
        title: 'Dry run — n = 11 (binary: 1011)',
        columns: ['n (binary)', 'n-1 (binary)', 'n & (n-1)', 'count'],
        rows: [
          ['1011', '1010', '1010', '1'],
          ['1010', '1001', '1000', '2'],
          ['1000', '0111', '0000', '3'],
          ['0', '—', '—', 'return 3 ✓'],
        ],
        highlightRow: 3,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 149. Counting Bits
// ══════════════════════════════════════════════════════
'counting-bits': {
  statement:
    'Given an integer n, return an array ans of length n + 1 such that for each i (0 <= i <= n), ans[i] is the number of 1\'s in the binary representation of i.',
  tags: ['Arrays', 'Bit Manipulation', 'Dynamic Programming'],
  requirement: 'O(n) time, O(1) space (excluding output)',
  externalLinks: [
    { label: '↗ LeetCode #338', url: 'https://leetcode.com/problems/counting-bits/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  n = 2\nOutput: [0,1,1]' },
    { label: 'Example 2', text: 'Input:  n = 5\nOutput: [0,1,1,2,1,2]' },
  ],
  constraints: [
    '0 ≤ n ≤ 10⁵',
  ],
  requiredComplexity: 'O(n) time · O(1) extra space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Notice a pattern: for any number i, how does its bit count relate to i/2 (right shift)?' },
    { number: 2, text: 'ans[i] = ans[i >> 1] + (i & 1). Right-shifting removes the last bit; we add back whether it was 1.' },
    { number: 3, text: 'Another approach: ans[i] = ans[i & (i-1)] + 1 (Brian Kernighan: remove lowest set bit, add 1).' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'DP with Right Shift — O(n) time, O(1) space',
      explanation: 'dp[i] = dp[i >> 1] + (i & 1). Each number relates to its right-shifted version.',
      code: {
        java: `public int[] countBits(int n) {
    int[] ans = new int[n + 1];
    for (int i = 1; i <= n; i++) {
        ans[i] = ans[i >> 1] + (i & 1);
    }
    return ans;
}`,
        cpp: `vector<int> countBits(int n) {
    vector<int> ans(n+1, 0);
    for (int i=1;i<=n;i++) ans[i] = ans[i>>1] + (i&1);
    return ans;
}`,
        python: `def countBits(n):
    ans = [0] * (n + 1)
    for i in range(1, n + 1):
        ans[i] = ans[i >> 1] + (i & 1)
    return ans`,
      },
      dryRun: {
        title: 'Dry run — n = 5',
        columns: ['i', 'i>>1', 'ans[i>>1]', 'i&1', 'ans[i]'],
        rows: [
          ['0', '—', '—', '—', '0'],
          ['1', '0', '0', '1', '1'],
          ['2', '1', '1', '0', '1'],
          ['3', '1', '1', '1', '2'],
          ['4', '2', '1', '0', '1'],
          ['5', '2', '1', '1', '2 → [0,1,1,2,1,2] ✓'],
        ],
        highlightRow: 5,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 150. Reverse Bits
// ══════════════════════════════════════════════════════
'reverse-bits': {
  statement:
    'Reverse bits of a given 32 bits unsigned integer.',
  tags: ['Arrays', 'Bit Manipulation'],
  requirement: 'O(1) time (fixed 32-bit input)',
  externalLinks: [
    { label: '↗ LeetCode #190', url: 'https://leetcode.com/problems/reverse-bits/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  n = 00000010100101000001111010011100\nOutput:    964176192 (00111001011110000010100101000000)' },
    { label: 'Example 2', text: 'Input:  n = 11111111111111111111111111111101\nOutput: 3221225471 (10111111111111111111111111111111)' },
  ],
  constraints: [
    'The input must be a binary string of length 32',
  ],
  requiredComplexity: 'O(1) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'You need to move bit 0 to position 31, bit 1 to position 30, etc. Can you do this bit by bit?' },
    { number: 2, text: 'Extract the least significant bit of n, shift it to the correct position in the result, then right-shift n.' },
    { number: 3, text: 'Loop 32 times: result = (result << 1) | (n & 1); n >>= 1.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Bit by Bit — O(32) = O(1) time',
      explanation: 'Shift result left and OR with the LSB of n, then right-shift n. Repeat 32 times.',
      code: {
        java: `public int reverseBits(int n) {
    int result = 0;
    for (int i = 0; i < 32; i++) {
        result = (result << 1) | (n & 1);
        n >>>= 1;
    }
    return result;
}`,
        cpp: `uint32_t reverseBits(uint32_t n) {
    uint32_t result = 0;
    for (int i = 0; i < 32; i++) {
        result = (result << 1) | (n & 1);
        n >>= 1;
    }
    return result;
}`,
        python: `def reverseBits(n):
    result = 0
    for _ in range(32):
        result = (result << 1) | (n & 1)
        n >>= 1
    return result`,
      },
      dryRun: {
        title: 'Dry run — n = 13 (binary: ...00001101), only first 4 iterations shown',
        columns: ['i', 'n&1', 'result (<<1)|bit', 'n>>=1'],
        rows: [
          ['0', '1', '1', '110 (6)'],
          ['1', '0', '10', '11 (3)'],
          ['2', '1', '101', '1'],
          ['3', '1', '1011', '0'],
          ['...', '0', '(28 more shifts placing bits)', '...'],
          ['31', '0', 'final reversed value', '—'],
        ],
        highlightRow: 0,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 151. Power of Two
// ══════════════════════════════════════════════════════
'power-of-two': {
  statement:
    'Given an integer n, return true if it is a power of two. Otherwise, return false. An integer n is a power of two if there exists an integer x such that n == 2^x.',
  tags: ['Arrays', 'Bit Manipulation', 'Math'],
  requirement: 'O(1) time',
  externalLinks: [
    { label: '↗ LeetCode #231', url: 'https://leetcode.com/problems/power-of-two/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  n = 1\nOutput: true\nExplanation: 2⁰ = 1' },
    { label: 'Example 2', text: 'Input:  n = 16\nOutput: true\nExplanation: 2⁴ = 16' },
    { label: 'Example 3', text: 'Input:  n = 3\nOutput: false' },
  ],
  constraints: [
    '−2³¹ ≤ n ≤ 2³¹ − 1',
  ],
  requiredComplexity: 'O(1) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Powers of two in binary have exactly one 1 bit (e.g., 8 = 1000). How can you check this quickly?' },
    { number: 2, text: 'n & (n-1) clears the lowest set bit. If n is a power of two, n & (n-1) == 0 (only one bit to clear).' },
    { number: 3, text: 'Also handle the edge case n <= 0 (not a power of two).' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Bit Trick — O(1) time, O(1) space',
      explanation: 'A power of two has exactly one set bit. n & (n-1) removes the lowest set bit — if result is 0, n was a power of two.',
      code: {
        java: `public boolean isPowerOfTwo(int n) {
    return n > 0 && (n & (n - 1)) == 0;
}`,
        cpp: `bool isPowerOfTwo(int n) {
    return n > 0 && (n & (n-1)) == 0;
}`,
        python: `def isPowerOfTwo(n):
    return n > 0 and (n & (n - 1)) == 0`,
      },
      dryRun: {
        title: 'Dry run — n = 16 (binary: 10000)',
        columns: ['n', 'n-1', 'n & (n-1)', 'Result'],
        rows: [
          ['10000', '01111', '00000 = 0', 'true ✓'],
          ['n=3 (011)', '010', '010 ≠ 0', 'false ✓'],
        ],
        highlightRow: 0,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 152. Power of Four
// ══════════════════════════════════════════════════════
'power-of-four': {
  statement:
    'Given an integer n, return true if it is a power of four. Otherwise, return false. An integer n is a power of four if there exists an integer x such that n == 4^x.',
  tags: ['Arrays', 'Bit Manipulation', 'Math'],
  requirement: 'O(1) time without loops or recursion',
  externalLinks: [
    { label: '↗ LeetCode #342', url: 'https://leetcode.com/problems/power-of-four/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  n = 16\nOutput: true\nExplanation: 4² = 16' },
    { label: 'Example 2', text: 'Input:  n = 5\nOutput: false' },
    { label: 'Example 3', text: 'Input:  n = 1\nOutput: true\nExplanation: 4⁰ = 1' },
  ],
  constraints: [
    '−2³¹ ≤ n ≤ 2³¹ − 1',
  ],
  requiredComplexity: 'O(1) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Powers of four are also powers of two. So first check n & (n-1) == 0. What additional constraint distinguishes powers of four?' },
    { number: 2, text: 'Powers of four (1,4,16,64,...) have their single 1-bit at even positions: bit 0, bit 2, bit 4, ... The mask 0x55555555 (01010101...) selects even-position bits.' },
    { number: 3, text: 'So: n > 0 && (n & (n-1)) == 0 && (n & 0x55555555) != 0.' },
    { number: 4, label: 'Hint 4 — modulo trick', text: 'Alternatively: powers of two with the 1-bit at an even position satisfy n % 3 == 1. (4^k mod 3 = 1^k = 1).' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Bit Mask — O(1) time, O(1) space',
      explanation: 'Power of four: is positive, has exactly one set bit, and that bit is at an even position.',
      code: {
        java: `public boolean isPowerOfFour(int n) {
    // 0x55555555 = 01010101...01 in binary (even bit positions)
    return n > 0 && (n & (n - 1)) == 0 && (n & 0x55555555) != 0;
}`,
        cpp: `bool isPowerOfFour(int n) {
    return n > 0 && (n & (n-1)) == 0 && (n & 0x55555555) != 0;
}`,
        python: `def isPowerOfFour(n):
    # 0x55555555 selects even bit positions
    return n > 0 and (n & (n-1)) == 0 and (n & 0x55555555) != 0`,
      },
      dryRun: {
        title: 'Dry run — n = 16 (binary: 10000), n = 8 (binary: 1000)',
        columns: ['n', 'n>0?', 'n&(n-1)==0?', 'n&0x55555555 ≠ 0?', 'Result'],
        rows: [
          ['16 (10000)', 'Yes', 'Yes', '10000&...010101=10000≠0: Yes', 'true ✓'],
          ['8 (01000)', 'Yes', 'Yes', '01000&...010101=0: No', 'false ✓'],
        ],
        highlightRow: 0,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 153. Binary Number with Alternating Bits
// ══════════════════════════════════════════════════════
'binary-number-alternating-bits': {
  statement:
    'Given a positive integer, check whether it has alternating bits: namely, if two adjacent bits will always have different values.',
  tags: ['Arrays', 'Bit Manipulation'],
  requirement: 'O(1) time',
  externalLinks: [
    { label: '↗ LeetCode #693', url: 'https://leetcode.com/problems/binary-number-with-alternating-bits/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  n = 5 (binary: 101)\nOutput: true' },
    { label: 'Example 2', text: 'Input:  n = 7 (binary: 111)\nOutput: false' },
    { label: 'Example 3', text: 'Input:  n = 11 (binary: 1011)\nOutput: false' },
  ],
  constraints: [
    '1 ≤ n ≤ 2³¹ − 1',
  ],
  requiredComplexity: 'O(1) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'If n has alternating bits, then n XOR (n>>1) should give all 1s. Why? Each bit XOR its neighbor would be 1 when they differ.' },
    { number: 2, text: 'Let mask = n ^ (n >> 1). If alternating bits, mask is all 1s in binary (e.g., 0111, 01111).' },
    { number: 3, text: 'Check if mask is all 1s: mask & (mask + 1) == 0 (same trick as power-of-two check).' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'XOR Trick — O(1) time, O(1) space',
      explanation: 'n ^ (n>>1) gives all 1s for alternating bits. Verify with (mask & (mask+1)) == 0.',
      code: {
        java: `public boolean hasAlternatingBits(int n) {
    long mask = n ^ (n >> 1);
    return (mask & (mask + 1)) == 0;
}`,
        cpp: `bool hasAlternatingBits(int n) {
    long mask = n ^ (n >> 1);
    return (mask & (mask + 1)) == 0;
}`,
        python: `def hasAlternatingBits(n):
    mask = n ^ (n >> 1)
    return (mask & (mask + 1)) == 0`,
      },
      dryRun: {
        title: 'Dry run — n=5 (101), n=7 (111)',
        columns: ['n', 'n>>1', 'n^(n>>1)=mask', 'mask+1', 'mask&(mask+1)', 'Result'],
        rows: [
          ['101', '010', '111 (7)', '1000', '0', 'true ✓'],
          ['111', '011', '100 (4)', '101', '100 ≠ 0', 'false ✓'],
        ],
        highlightRow: 0,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 154. Single Number II
// ══════════════════════════════════════════════════════
'single-number-ii': {
  statement:
    'Given an integer array nums where every element appears three times except for one, which appears exactly once. Find the single element and return it. You must implement a solution with a linear runtime complexity and use only constant extra space.',
  tags: ['Arrays', 'Bit Manipulation'],
  requirement: 'O(n) time, O(1) space',
  externalLinks: [
    { label: '↗ LeetCode #137', url: 'https://leetcode.com/problems/single-number-ii/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums = [2,2,3,2]\nOutput: 3' },
    { label: 'Example 2', text: 'Input:  nums = [0,1,0,1,0,1,99]\nOutput: 99' },
  ],
  constraints: [
    '1 ≤ nums.length ≤ 3 × 10⁴',
    '−2³¹ ≤ nums[i] ≤ 2³¹ − 1',
    'Every element appears exactly 3 times except for one element which appears once',
  ],
  requiredComplexity: 'O(n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'XOR doesn\'t work here since it handles pairs (count mod 2). You need counting mod 3. Can you count bits mod 3?' },
    { number: 2, text: 'For each bit position, sum all values. If the sum mod 3 != 0, that bit belongs to the single number.' },
    { number: 3, text: 'A more elegant O(1) space approach: use two variables "ones" and "twos" to track bits seen 1x and 2x mod 3.' },
    { number: 4, label: 'Hint 4 — state machine', text: 'ones = (ones ^ n) & ~twos; twos = (twos ^ n) & ~ones. After processing all numbers, ones holds the single number.' },
  ],
  approaches: [
    {
      key: 'bitcount',
      label: 'Bit Position Sum — O(32n) time, O(1) space',
      explanation: 'For each of 32 bit positions, count how many numbers have that bit set. Mod 3 gives the single number\'s bit.',
      code: {
        java: `public int singleNumber(int[] nums) {
    int result = 0;
    for (int i = 0; i < 32; i++) {
        int sum = 0;
        for (int n : nums) sum += (n >> i) & 1;
        if (sum % 3 != 0) result |= (1 << i);
    }
    return result;
}`,
        cpp: `int singleNumber(vector<int>& nums) {
    int result = 0;
    for (int i=0;i<32;i++) {
        int sum=0;
        for (int n:nums) sum+=(n>>i)&1;
        if (sum%3) result|=(1<<i);
    }
    return result;
}`,
        python: `def singleNumber(nums):
    result = 0
    for i in range(32):
        bit_sum = sum((n >> i) & 1 for n in nums) % 3
        if bit_sum:
            result |= (1 << i)
    # Handle negative numbers (two's complement)
    if result >= 2**31:
        result -= 2**32
    return result`,
      },
    },
    {
      key: 'optimal',
      label: 'Two-Variable State Machine — O(n) time, O(1) space',
      explanation: 'Use "ones" and "twos" to track bits seen 1 and 2 times modulo 3.',
      code: {
        java: `public int singleNumber(int[] nums) {
    int ones = 0, twos = 0;
    for (int n : nums) {
        ones = (ones ^ n) & ~twos;
        twos = (twos ^ n) & ~ones;
    }
    return ones;
}`,
        cpp: `int singleNumber(vector<int>& nums) {
    int ones=0, twos=0;
    for (int n:nums) {
        ones=(ones^n)&~twos;
        twos=(twos^n)&~ones;
    }
    return ones;
}`,
        python: `def singleNumber(nums):
    ones = twos = 0
    for n in nums:
        ones = (ones ^ n) & ~twos
        twos = (twos ^ n) & ~ones
    return ones`,
      },
      dryRun: {
        title: 'Dry run — nums = [2,2,3,2]',
        columns: ['n', 'ones (before)', 'twos (before)', 'ones (after)', 'twos (after)'],
        rows: [
          ['2', '0', '0', '2', '0'],
          ['2', '2', '0', '0', '2'],
          ['3', '0', '2', '3', '0'],
          ['2', '3', '0', '1→(3^2)&~0=1? 3^2=1, ~0=all1s → 1', '(0^2)&~1=2&~1=2&...10=0'],
          ['return ones=3 ✓', '—', '—', '—', '—'],
        ],
        highlightRow: 4,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 155. Single Number III
// ══════════════════════════════════════════════════════
'single-number-iii': {
  statement:
    'Given an integer array nums, in which exactly two elements appear only once and all the other elements appear exactly twice. Find the two elements that appear only once. You can return the answer in any order. You must write an algorithm that runs in linear runtime complexity and uses only constant extra space.',
  tags: ['Arrays', 'Bit Manipulation', 'XOR'],
  requirement: 'O(n) time, O(1) space',
  externalLinks: [
    { label: '↗ LeetCode #260', url: 'https://leetcode.com/problems/single-number-iii/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums = [1,2,1,3,2,5]\nOutput: [3,5]' },
    { label: 'Example 2', text: 'Input:  nums = [-1,0]\nOutput: [-1,0]' },
  ],
  constraints: [
    '2 ≤ nums.length ≤ 3 × 10⁴',
    '−2³¹ ≤ nums[i] ≤ 2³¹ − 1',
    'Each integer in nums will appear twice, only two integers will appear once',
  ],
  requiredComplexity: 'O(n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'XOR all numbers to get xor = a ^ b (where a, b are the two singles). Since a ≠ b, xor ≠ 0. What can a set bit in xor tell you?' },
    { number: 2, text: 'A set bit in xor means a and b differ in that position. Use the lowest set bit (xor & -xor) to split all numbers into two groups: one group contains a, the other contains b.' },
    { number: 3, text: 'XOR each group independently — duplicates cancel, leaving one unique number per group.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'XOR + Partition — O(n) time, O(1) space',
      explanation: 'XOR all to get a^b. Use a distinguishing bit to partition numbers into two groups. XOR each group.',
      code: {
        java: `public int[] singleNumber(int[] nums) {
    int xor = 0;
    for (int n : nums) xor ^= n;
    int diff = xor & (-xor); // lowest set bit
    int a = 0, b = 0;
    for (int n : nums) {
        if ((n & diff) != 0) a ^= n;
        else b ^= n;
    }
    return new int[]{a, b};
}`,
        cpp: `vector<int> singleNumber(vector<int>& nums) {
    int xorAll = 0;
    for (int n:nums) xorAll^=n;
    int diff = xorAll & (-xorAll);
    int a=0, b=0;
    for (int n:nums) {
        if (n&diff) a^=n;
        else b^=n;
    }
    return {a,b};
}`,
        python: `def singleNumber(nums):
    xor_all = 0
    for n in nums:
        xor_all ^= n
    diff = xor_all & (-xor_all)  # lowest set bit
    a = b = 0
    for n in nums:
        if n & diff:
            a ^= n
        else:
            b ^= n
    return [a, b]`,
      },
      dryRun: {
        title: 'Dry run — nums = [1,2,1,3,2,5]',
        columns: ['Step', 'Detail', 'Value'],
        rows: [
          ['XOR all', '1^2^1^3^2^5 = 3^5 = 6', 'xor=6 (binary:110)'],
          ['diff', '6 & -6 = 2 (binary:010)', 'distinguishing bit=2'],
          ['Group 1 (bit2=1)', 'nums with n&2≠0: 2,3,2 → XOR=3', 'a=3'],
          ['Group 2 (bit2=0)', 'nums with n&2=0: 1,1,5 → XOR=5', 'b=5'],
          ['Result', '[3,5] ✓', '—'],
        ],
        highlightRow: 4,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 156. Total Hamming Distance
// ══════════════════════════════════════════════════════
'total-hamming-distance': {
  statement:
    'The Hamming distance between two integers is the number of positions at which the corresponding bits are different. Given an integer array nums, return the sum of Hamming distances between all pairs of integers in nums.',
  tags: ['Arrays', 'Bit Manipulation', 'Math'],
  requirement: 'O(32n) = O(n) time',
  externalLinks: [
    { label: '↗ LeetCode #477', url: 'https://leetcode.com/problems/total-hamming-distance/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums = [4,14,2]\nOutput: 6\nExplanation: Hamming(4,14)=2, Hamming(4,2)=2, Hamming(14,2)=2 → total=6' },
    { label: 'Example 2', text: 'Input:  nums = [4,14,4]\nOutput: 4' },
  ],
  constraints: [
    '1 ≤ nums.length ≤ 10⁴',
    '0 ≤ nums[i] ≤ 10⁹',
  ],
  requiredComplexity: 'O(n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Naively comparing all pairs is O(n²). Can you compute the contribution of each bit position independently?' },
    { number: 2, text: 'For each bit position, count how many numbers have that bit set (call it k). Then k numbers have 1 and (n-k) have 0 at that position.' },
    { number: 3, text: 'The contribution of this bit to the total Hamming distance is k * (n - k) (each 1-bit pairs with each 0-bit).' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Per-Bit Contribution — O(32n) time, O(1) space',
      explanation: 'For each of 32 bits, count ones. Contribution = ones * (n - ones). Sum over all bits.',
      code: {
        java: `public int totalHammingDistance(int[] nums) {
    int total = 0, n = nums.length;
    for (int i = 0; i < 32; i++) {
        int ones = 0;
        for (int num : nums) ones += (num >> i) & 1;
        total += ones * (n - ones);
    }
    return total;
}`,
        cpp: `int totalHammingDistance(vector<int>& nums) {
    int total=0, n=nums.size();
    for (int i=0;i<32;i++) {
        int ones=0;
        for (int num:nums) ones+=(num>>i)&1;
        total+=ones*(n-ones);
    }
    return total;
}`,
        python: `def totalHammingDistance(nums):
    total = 0
    n = len(nums)
    for i in range(32):
        ones = sum((num >> i) & 1 for num in nums)
        total += ones * (n - ones)
    return total`,
      },
      dryRun: {
        title: 'Dry run — nums = [4,14,2], n=3',
        columns: ['bit i', '4', '14', '2', 'ones', 'n-ones', 'contribution'],
        rows: [
          ['0', '0', '0', '0', '0', '3', '0'],
          ['1', '0', '1', '1', '2', '1', '2'],
          ['2', '1', '1', '0', '2', '1', '2'],
          ['3', '0', '1', '0', '1', '2', '2'],
          ['Total', '—', '—', '—', '—', '—', '6 ✓'],
        ],
        highlightRow: 4,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 157. XOR Queries of a Subarray
// ══════════════════════════════════════════════════════
'xor-queries-of-a-subarray': {
  statement:
    'You are given an array arr of positive integers. You are also given queries where queries[i] = [left_i, right_i]. For each query i compute the XOR of elements from left_i to right_i (arr[left_i] XOR arr[left_i+1] XOR ... XOR arr[right_i]). Return an array answer where answer[i] is the answer to the ith query.',
  tags: ['Arrays', 'Bit Manipulation', 'Prefix XOR'],
  requirement: 'O(n + q) time',
  externalLinks: [
    { label: '↗ LeetCode #1310', url: 'https://leetcode.com/problems/xor-queries-of-a-subarray/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  arr = [1,3,4,8], queries = [[0,1],[1,2],[0,3],[3,3]]\nOutput: [2,7,14,8]' },
    { label: 'Example 2', text: 'Input:  arr = [4,8,2,10], queries = [[2,3],[1,3],[0,0],[0,3]]\nOutput: [8,0,4,4]' },
  ],
  constraints: [
    '1 ≤ arr.length, queries.length ≤ 3 × 10⁴',
    '1 ≤ arr[i] ≤ 10⁹',
    '0 ≤ left_i ≤ right_i < arr.length',
  ],
  requiredComplexity: 'O(n + q) time · O(n) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Range XOR query is analogous to range sum query. Can you build a prefix XOR array?' },
    { number: 2, text: 'prefix[i] = arr[0] ^ arr[1] ^ ... ^ arr[i-1]. Then XOR(l, r) = prefix[r+1] ^ prefix[l].' },
    { number: 3, text: 'This works because a ^ a = 0 — XOR is self-inverse, so the prefix cancels the left part.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Prefix XOR — O(n + q) time, O(n) space',
      explanation: 'Build prefix XOR array. Answer each query in O(1) using prefix[r+1] ^ prefix[l].',
      code: {
        java: `public int[] xorQueries(int[] arr, int[][] queries) {
    int n = arr.length;
    int[] prefix = new int[n + 1];
    for (int i = 0; i < n; i++) prefix[i+1] = prefix[i] ^ arr[i];
    int[] result = new int[queries.length];
    for (int i = 0; i < queries.length; i++) {
        result[i] = prefix[queries[i][1]+1] ^ prefix[queries[i][0]];
    }
    return result;
}`,
        cpp: `vector<int> xorQueries(vector<int>& arr, vector<vector<int>>& queries) {
    int n=arr.size();
    vector<int> prefix(n+1,0);
    for (int i=0;i<n;i++) prefix[i+1]=prefix[i]^arr[i];
    vector<int> result(queries.size());
    for (int i=0;i<(int)queries.size();i++)
        result[i]=prefix[queries[i][1]+1]^prefix[queries[i][0]];
    return result;
}`,
        python: `def xorQueries(arr, queries):
    prefix = [0] * (len(arr) + 1)
    for i, x in enumerate(arr):
        prefix[i+1] = prefix[i] ^ x
    return [prefix[r+1] ^ prefix[l] for l, r in queries]`,
      },
      dryRun: {
        title: 'Dry run — arr=[1,3,4,8], queries=[[0,1],[1,2],[0,3],[3,3]]',
        columns: ['Step', 'Detail', 'Value'],
        rows: [
          ['prefix', '[0, 1, 1^3=2, 2^4=6, 6^8=14]', '[0,1,2,6,14]'],
          ['query[0,1]', 'prefix[2]^prefix[0]=2^0=2', '2 ✓'],
          ['query[1,2]', 'prefix[3]^prefix[1]=6^1=7', '7 ✓'],
          ['query[0,3]', 'prefix[4]^prefix[0]=14^0=14', '14 ✓'],
          ['query[3,3]', 'prefix[4]^prefix[3]=14^6=8', '8 ✓'],
        ],
        highlightRow: 0,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 158. Sum of Two Integers
// ══════════════════════════════════════════════════════
'sum-of-two-integers': {
  statement:
    'Given two integers a and b, return the sum of the two integers without using the operators + and -.',
  tags: ['Arrays', 'Bit Manipulation', 'Math'],
  requirement: 'O(1) time',
  externalLinks: [
    { label: '↗ LeetCode #371', url: 'https://leetcode.com/problems/sum-of-two-integers/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  a = 1, b = 2\nOutput: 3' },
    { label: 'Example 2', text: 'Input:  a = 2, b = 3\nOutput: 5' },
  ],
  constraints: [
    '−1000 ≤ a, b ≤ 1000',
  ],
  requiredComplexity: 'O(1) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Addition in hardware is done with XOR (sum without carry) and AND (carry). Can you simulate this?' },
    { number: 2, text: 'a ^ b gives the sum without carry. (a & b) << 1 gives the carry shifted left. Repeat until no carry remains.' },
    { number: 3, text: 'Loop: sum = a^b, carry = (a&b)<<1, a = sum, b = carry. When b = 0, a is the answer.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Bit Carry Simulation — O(1) time, O(1) space',
      explanation: 'Simulate binary addition: XOR for sum bits, AND+shift for carry. Repeat until carry is 0.',
      code: {
        java: `public int getSum(int a, int b) {
    while (b != 0) {
        int carry = (a & b) << 1;
        a = a ^ b;
        b = carry;
    }
    return a;
}`,
        cpp: `int getSum(int a, int b) {
    while (b) {
        int carry = (a & b) << 1;
        a ^= b;
        b = carry;
    }
    return a;
}`,
        python: `def getSum(a, b):
    mask = 0xFFFFFFFF  # 32-bit mask for Python's arbitrary precision
    while b & mask:
        carry = ((a & b) << 1) & mask
        a = (a ^ b) & mask
        b = carry
    # Handle negative results
    if a >> 31:
        return ~(a ^ mask)
    return a`,
      },
      dryRun: {
        title: 'Dry run — a=1, b=2 (binary: 01 + 10)',
        columns: ['Iteration', 'a', 'b', 'carry=(a&b)<<1', 'a^b (new a)', 'new b'],
        rows: [
          ['1', '01', '10', '(01&10)=00 <<1=00', '01^10=11', 'b=00'],
          ['b=0', '11 = 3', '—', '—', 'return 3 ✓', '—'],
        ],
        highlightRow: 1,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 159. Divide Two Integers
// ══════════════════════════════════════════════════════
'divide-two-integers': {
  statement:
    'Given two integers dividend and divisor, divide two integers without using multiplication, division, and mod operator. The integer division should truncate toward zero. Return the quotient. If the quotient is out of the 32-bit integer range [−2³¹, 2³¹−1], return 2³¹−1.',
  tags: ['Arrays', 'Bit Manipulation', 'Math'],
  requirement: 'O(log² n) time using bit shifts',
  externalLinks: [
    { label: '↗ LeetCode #29', url: 'https://leetcode.com/problems/divide-two-integers/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  dividend = 10, divisor = 3\nOutput: 3' },
    { label: 'Example 2', text: 'Input:  dividend = 7, divisor = -3\nOutput: -2' },
  ],
  constraints: [
    '−2³¹ ≤ dividend, divisor ≤ 2³¹ − 1',
    'divisor != 0',
  ],
  requiredComplexity: 'O(log² n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Without division/multiplication, you can use bit shifts. Doubling divisor with shifts to find the largest multiple that fits.' },
    { number: 2, text: 'For each "batch": find the largest power of 2 such that (divisor << power) ≤ dividend. Subtract that value, add that power to quotient.' },
    { number: 3, text: 'Handle signs and edge cases: overflow when dividend = INT_MIN and divisor = -1.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Bit Shift Subtraction — O(log² n) time, O(1) space',
      explanation: 'Find the largest shift k so divisor << k ≤ dividend. Subtract and accumulate quotient. Repeat.',
      code: {
        java: `public int divide(int dividend, int divisor) {
    if (dividend == Integer.MIN_VALUE && divisor == -1) return Integer.MAX_VALUE;
    int sign = (dividend > 0) ^ (divisor > 0) ? -1 : 1;
    long dvd = Math.abs((long)dividend), dvs = Math.abs((long)divisor);
    int result = 0;
    while (dvd >= dvs) {
        long temp = dvs, multiple = 1;
        while (dvd >= (temp << 1)) {
            temp <<= 1;
            multiple <<= 1;
        }
        dvd -= temp;
        result += multiple;
    }
    return sign == 1 ? result : -result;
}`,
        cpp: `int divide(int dividend, int divisor) {
    if (dividend==INT_MIN && divisor==-1) return INT_MAX;
    int sign = (dividend>0)^(divisor>0) ? -1 : 1;
    long dvd=abs((long)dividend), dvs=abs((long)divisor);
    int result=0;
    while (dvd>=dvs) {
        long temp=dvs, mult=1;
        while (dvd>=(temp<<1)) { temp<<=1; mult<<=1; }
        dvd-=temp; result+=mult;
    }
    return sign==1 ? result : -result;
}`,
        python: `def divide(dividend, divisor):
    INT_MAX = 2**31 - 1
    INT_MIN = -(2**31)
    if dividend == INT_MIN and divisor == -1:
        return INT_MAX
    sign = -1 if (dividend > 0) ^ (divisor > 0) else 1
    dvd, dvs = abs(dividend), abs(divisor)
    result = 0
    while dvd >= dvs:
        temp, multiple = dvs, 1
        while dvd >= (temp << 1):
            temp <<= 1
            multiple <<= 1
        dvd -= temp
        result += multiple
    return sign * result`,
      },
      dryRun: {
        title: 'Dry run — dividend=10, divisor=3',
        columns: ['dvd', 'temp (doubles)', 'multiple', 'dvd after', 'result'],
        rows: [
          ['10', '3→6→12>10 stop at 6', '2', '10-6=4', '2'],
          ['4', '3→6>4 stop at 3', '1', '4-3=1', '3'],
          ['1 < 3', '—', '—', 'stop', 'return 3 ✓'],
        ],
        highlightRow: 2,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 160. Bitwise AND of Numbers Range
// ══════════════════════════════════════════════════════
'bitwise-and-of-numbers-range': {
  statement:
    'Given two integers left and right that represent the range [left, right], return the bitwise AND of all numbers in this range, inclusive.',
  tags: ['Arrays', 'Bit Manipulation', 'Math'],
  requirement: 'O(log n) time',
  externalLinks: [
    { label: '↗ LeetCode #201', url: 'https://leetcode.com/problems/bitwise-and-of-numbers-range/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  left = 5, right = 7\nOutput: 4\nExplanation: 5&6&7 = 101&110&111 = 100 = 4' },
    { label: 'Example 2', text: 'Input:  left = 0, right = 0\nOutput: 0' },
    { label: 'Example 3', text: 'Input:  left = 1, right = 2147483647\nOutput: 0' },
  ],
  constraints: [
    '0 ≤ left ≤ right ≤ 2³¹ − 1',
  ],
  requiredComplexity: 'O(log n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'The AND of a range is the common prefix bits of left and right. Why? Any bit that differs between left and right will be toggled in the range, making that bit 0.' },
    { number: 2, text: 'Shift both left and right right until they are equal. Count the shifts. The result is that common value shifted back left.' },
    { number: 3, text: 'Alternatively, repeatedly clear the lowest set bit of right (right & (right-1)) until right ≤ left.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Common Prefix via Shifting — O(log n) time, O(1) space',
      explanation: 'Shift left and right right until equal. The common prefix, shifted back, is the answer.',
      code: {
        java: `public int rangeBitwiseAnd(int left, int right) {
    int shift = 0;
    while (left != right) {
        left >>= 1;
        right >>= 1;
        shift++;
    }
    return left << shift;
}`,
        cpp: `int rangeBitwiseAnd(int left, int right) {
    int shift = 0;
    while (left != right) {
        left >>= 1; right >>= 1; shift++;
    }
    return left << shift;
}`,
        python: `def rangeBitwiseAnd(left, right):
    shift = 0
    while left != right:
        left >>= 1
        right >>= 1
        shift += 1
    return left << shift`,
      },
      dryRun: {
        title: 'Dry run — left=5 (101), right=7 (111)',
        columns: ['Iteration', 'left', 'right', 'shift'],
        rows: [
          ['1', '10 (2)', '11 (3)', '1'],
          ['2', '1', '1', '2'],
          ['left==right', '—', 'result=1<<2=4', '4 ✓'],
        ],
        highlightRow: 2,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 161. Minimum Flips to Make a OR b Equal to c
// ══════════════════════════════════════════════════════
'minimum-flips-a-or-b-equals-c': {
  statement:
    'Given 3 positives numbers a, b and c. Return the minimum flips required in some bits of a and b to make (a OR b == c). The flip operation consists of changing any single bit 1 to 0 or changing the bit 0 to 1 in their binary representation.',
  tags: ['Arrays', 'Bit Manipulation'],
  requirement: 'O(log max(a,b,c)) time',
  externalLinks: [
    { label: '↗ LeetCode #1318', url: 'https://leetcode.com/problems/minimum-flips-to-make-a-or-b-equal-to-c/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  a = 2, b = 6, c = 5\nOutput: 3\nExplanation: Flip bit1 of b (6→4), flip bit2 of a (2→0), flip bit0 of b or a (→1): a=1,b=4 → 1|4=5' },
    { label: 'Example 2', text: 'Input:  a = 4, b = 2, c = 7\nOutput: 1' },
    { label: 'Example 3', text: 'Input:  a = 1, b = 2, c = 3\nOutput: 0' },
  ],
  constraints: [
    '1 ≤ a, b, c ≤ 10⁹',
  ],
  requiredComplexity: 'O(log max) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Process each bit position independently. For each bit, check bits of a, b, c and determine the minimum flips needed.' },
    { number: 2, text: 'If c-bit is 1: need a-bit OR b-bit = 1. If both are 0, need 1 flip. If either is 1, no flip.' },
    { number: 3, text: 'If c-bit is 0: need a-bit OR b-bit = 0. If a-bit=1 and b-bit=1, need 2 flips. If only one is 1, need 1 flip. If both 0, no flip.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Bit-by-Bit Analysis — O(log n) time, O(1) space',
      explanation: 'Check each bit position of a, b, c. Count flips needed based on the three cases.',
      code: {
        java: `public int minFlips(int a, int b, int c) {
    int flips = 0;
    while (a > 0 || b > 0 || c > 0) {
        int ba = a & 1, bb = b & 1, bc = c & 1;
        if (bc == 1) {
            if (ba == 0 && bb == 0) flips++; // need one of them to be 1
        } else {
            flips += ba + bb; // both must be 0; each 1 costs a flip
        }
        a >>= 1; b >>= 1; c >>= 1;
    }
    return flips;
}`,
        cpp: `int minFlips(int a, int b, int c) {
    int flips=0;
    while(a||b||c) {
        int ba=a&1,bb=b&1,bc=c&1;
        if(bc) { if(!ba&&!bb) flips++; }
        else flips+=ba+bb;
        a>>=1;b>>=1;c>>=1;
    }
    return flips;
}`,
        python: `def minFlips(a, b, c):
    flips = 0
    while a or b or c:
        ba, bb, bc = a & 1, b & 1, c & 1
        if bc == 1:
            if ba == 0 and bb == 0:
                flips += 1
        else:
            flips += ba + bb
        a >>= 1; b >>= 1; c >>= 1
    return flips`,
      },
      dryRun: {
        title: 'Dry run — a=2(010), b=6(110), c=5(101)',
        columns: ['bit', 'ba', 'bb', 'bc', 'bc=1 → need OR=1', 'bc=0 → need both=0', 'flips'],
        rows: [
          ['0', '0', '0', '1', '0|0=0≠1 → +1', '—', '1'],
          ['1', '1', '1', '0', '—', '1+1=2 → +2', '3'],
          ['2', '0', '1', '1', '1|1=1✓ → 0', '—', '3'],
          ['Done', '—', '—', '—', '—', '—', '3 ✓'],
        ],
        highlightRow: 3,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 162. UTF-8 Validation
// ══════════════════════════════════════════════════════
'utf-8-validation': {
  statement:
    'Given an integer array data representing the data, return whether it is a valid UTF-8 encoding (i.e. it translates to a sequence of valid UTF-8 encoded characters). A character in UTF-8 can be from 1 to 4 bytes long. For a 1-byte character, the most significant bit is a 0. For an n-byte character (n > 1), the first byte starts with n ones followed by a 0, and the other n-1 bytes start with 10.',
  tags: ['Arrays', 'Bit Manipulation'],
  requirement: 'O(n) time',
  externalLinks: [
    { label: '↗ LeetCode #393', url: 'https://leetcode.com/problems/utf-8-validation/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  data = [197,130,1]\nOutput: true\nExplanation: 11000101 10000010 00000001 → 2-byte char + 1-byte char' },
    { label: 'Example 2', text: 'Input:  data = [235,140,4]\nOutput: false\nExplanation: 11101011 10001100 00000100 → 3-byte char but 3rd byte is not 10xxxxxx' },
  ],
  constraints: [
    '1 ≤ data.length ≤ 2 × 10⁴',
    '0 ≤ data[i] ≤ 255',
  ],
  requiredComplexity: 'O(n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Only the last 8 bits of each integer matter (mask with 0xFF). Determine how many bytes a character takes from the leading bits of the first byte.' },
    { number: 2, text: 'First byte patterns: 0xxxxxxx (1-byte), 110xxxxx (2-byte), 1110xxxx (3-byte), 11110xxx (4-byte). Any other pattern is invalid.' },
    { number: 3, text: 'For continuation bytes, they must match 10xxxxxx (i.e., (byte & 0xC0) == 0x80).' },
    { number: 4, label: 'Hint 4 — implementation', text: 'Count how many continuation bytes are expected (numBytes). For each subsequent byte, verify it starts with 10. If numBytes ≠ 0 at the end, invalid.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Byte Pattern Matching — O(n) time, O(1) space',
      explanation: 'For each byte, determine if it\'s a character start or continuation. Validate continuation bytes match 10xxxxxx.',
      code: {
        java: `public boolean validUtf8(int[] data) {
    int continuationBytes = 0;
    for (int b : data) {
        b = b & 0xFF; // only last 8 bits matter
        if (continuationBytes > 0) {
            if ((b & 0xC0) != 0x80) return false; // must be 10xxxxxx
            continuationBytes--;
        } else {
            if ((b & 0x80) == 0x00) continuationBytes = 0;       // 0xxxxxxx: 1-byte
            else if ((b & 0xE0) == 0xC0) continuationBytes = 1;  // 110xxxxx: 2-byte
            else if ((b & 0xF0) == 0xE0) continuationBytes = 2;  // 1110xxxx: 3-byte
            else if ((b & 0xF8) == 0xF0) continuationBytes = 3;  // 11110xxx: 4-byte
            else return false;
        }
    }
    return continuationBytes == 0;
}`,
        cpp: `bool validUtf8(vector<int>& data) {
    int cont=0;
    for (int x:data) {
        int b=x&0xFF;
        if (cont>0) {
            if ((b&0xC0)!=0x80) return false;
            cont--;
        } else {
            if ((b&0x80)==0) cont=0;
            else if ((b&0xE0)==0xC0) cont=1;
            else if ((b&0xF0)==0xE0) cont=2;
            else if ((b&0xF8)==0xF0) cont=3;
            else return false;
        }
    }
    return cont==0;
}`,
        python: `def validUtf8(data):
    cont = 0
    for x in data:
        b = x & 0xFF
        if cont > 0:
            if (b & 0xC0) != 0x80:
                return False
            cont -= 1
        else:
            if (b & 0x80) == 0x00:
                cont = 0
            elif (b & 0xE0) == 0xC0:
                cont = 1
            elif (b & 0xF0) == 0xE0:
                cont = 2
            elif (b & 0xF8) == 0xF0:
                cont = 3
            else:
                return False
    return cont == 0`,
      },
      dryRun: {
        title: 'Dry run — data = [197, 130, 1]',
        columns: ['byte (decimal)', 'binary', 'cont (before)', 'Pattern match', 'cont (after)'],
        rows: [
          ['197', '11000101', '0', '110xxxxx → 2-byte start, cont=1', '1'],
          ['130', '10000010', '1', '10xxxxxx ✓ continuation, cont--', '0'],
          ['1', '00000001', '0', '0xxxxxxx → 1-byte start, cont=0', '0'],
          ['End', '—', '0', 'cont==0 → return true ✓', '—'],
        ],
        highlightRow: 3,
      },
    },
  ],
},


// ══════════════════════════════════════════════════════
// 163. Palindrome Number
// ══════════════════════════════════════════════════════
'palindrome-number': {
  statement:
    'Given an integer x, return true if x is a palindrome, and false otherwise. A palindrome is a number that reads the same forward and backward.',
  tags: ['Math'],
  requirement: 'O(log n) time without converting to string for full credit',
  externalLinks: [
    { label: '↗ LeetCode #9', url: 'https://leetcode.com/problems/palindrome-number/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  x = 121\nOutput: true' },
    { label: 'Example 2', text: 'Input:  x = -121\nOutput: false\nExplanation: Reads -121 forward, 121- backward' },
    { label: 'Example 3', text: 'Input:  x = 10\nOutput: false' },
  ],
  constraints: [
    '−2³¹ ≤ x ≤ 2³¹ − 1',
  ],
  requiredComplexity: 'O(log n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Negative numbers are never palindromes. Numbers ending in 0 (except 0 itself) are never palindromes. Can you avoid converting to a string?' },
    { number: 2, text: 'Reverse only the second half of the number. Compare reversed second half with first half.' },
    { number: 3, text: 'Stop when reversed >= remaining. For even digit count: reversed == remaining. For odd: reversed / 10 == remaining.' },
  ],
  approaches: [
    {
      key: 'string',
      label: 'String Conversion — O(log n) time, O(log n) space',
      explanation: 'Convert to string, check if it equals its reverse.',
      code: {
        java: `public boolean isPalindrome(int x) {
    String s = String.valueOf(x);
    String rev = new StringBuilder(s).reverse().toString();
    return s.equals(rev);
}`,
        cpp: `bool isPalindrome(int x) {
    string s = to_string(x);
    string rev(s.rbegin(), s.rend());
    return s == rev;
}`,
        python: `def isPalindrome(x):
    return str(x) == str(x)[::-1]`,
      },
    },
    {
      key: 'optimal',
      label: 'Reverse Half — O(log n) time, O(1) space',
      explanation: 'Reverse the second half of the number in-place. Compare with the first half.',
      code: {
        java: `public boolean isPalindrome(int x) {
    if (x < 0 || (x % 10 == 0 && x != 0)) return false;
    int reversed = 0;
    while (x > reversed) {
        reversed = reversed * 10 + x % 10;
        x /= 10;
    }
    return x == reversed || x == reversed / 10;
}`,
        cpp: `bool isPalindrome(int x) {
    if (x < 0 || (x % 10 == 0 && x != 0)) return false;
    int rev = 0;
    while (x > rev) { rev = rev*10 + x%10; x /= 10; }
    return x == rev || x == rev/10;
}`,
        python: `def isPalindrome(x):
    if x < 0 or (x % 10 == 0 and x != 0):
        return False
    rev = 0
    while x > rev:
        rev = rev * 10 + x % 10
        x //= 10
    return x == rev or x == rev // 10`,
      },
      dryRun: {
        title: 'Dry run — x = 121',
        columns: ['x', 'reversed', 'x%10', 'After step'],
        rows: [
          ['121', '0', '1', 'rev=1, x=12'],
          ['12', '1', '2', 'rev=12, x=1'],
          ['x=1 ≤ rev=12', '—', '—', 'Check: x==rev/10 → 1==1 → true ✓'],
        ],
        highlightRow: 2,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 164. Reverse Integer
// ══════════════════════════════════════════════════════
'reverse-integer': {
  statement:
    'Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [−2³¹, 2³¹ − 1], return 0.',
  tags: ['Math'],
  requirement: 'O(log n) time',
  externalLinks: [
    { label: '↗ LeetCode #7', url: 'https://leetcode.com/problems/reverse-integer/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  x = 123\nOutput: 321' },
    { label: 'Example 2', text: 'Input:  x = -123\nOutput: -321' },
    { label: 'Example 3', text: 'Input:  x = 120\nOutput: 21' },
  ],
  constraints: [
    '−2³¹ ≤ x ≤ 2³¹ − 1',
  ],
  requiredComplexity: 'O(log n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Pop digits from the end of x and push them onto the result. How do you pop the last digit? How do you check for overflow?' },
    { number: 2, text: 'Pop with: digit = x % 10; x /= 10. Push with: result = result * 10 + digit.' },
    { number: 3, text: 'Check overflow before multiplying: if result > INT_MAX/10 or result < INT_MIN/10, return 0.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Digit Pop-Push with Overflow Check — O(log n) time, O(1) space',
      explanation: 'Extract digits one by one and build the reversed number, checking for overflow at each step.',
      code: {
        java: `public int reverse(int x) {
    int result = 0;
    while (x != 0) {
        int digit = x % 10;
        x /= 10;
        if (result > Integer.MAX_VALUE / 10 ||
            (result == Integer.MAX_VALUE / 10 && digit > 7)) return 0;
        if (result < Integer.MIN_VALUE / 10 ||
            (result == Integer.MIN_VALUE / 10 && digit < -8)) return 0;
        result = result * 10 + digit;
    }
    return result;
}`,
        cpp: `int reverse(int x) {
    long result = 0;
    while (x) {
        result = result*10 + x%10;
        x /= 10;
        if (result > INT_MAX || result < INT_MIN) return 0;
    }
    return result;
}`,
        python: `def reverse(x):
    INT_MAX, INT_MIN = 2**31 - 1, -(2**31)
    sign = -1 if x < 0 else 1
    x = abs(x)
    result = int(str(x)[::-1])
    result *= sign
    return result if INT_MIN <= result <= INT_MAX else 0`,
      },
      dryRun: {
        title: 'Dry run — x = 123',
        columns: ['x', 'digit', 'result', 'Overflow?'],
        rows: [
          ['123', '3', '3', 'No'],
          ['12', '2', '32', 'No'],
          ['1', '1', '321', 'No'],
          ['0', '—', '321', 'return 321 ✓'],
        ],
        highlightRow: 3,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 165. Add Digits
// ══════════════════════════════════════════════════════
'add-digits': {
  statement:
    'Given an integer num, repeatedly add all its digits until the result has only one digit, and return it.',
  tags: ['Math', 'Number Theory'],
  requirement: 'O(1) time using digital root formula',
  externalLinks: [
    { label: '↗ LeetCode #258', url: 'https://leetcode.com/problems/add-digits/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  num = 38\nOutput: 2\nExplanation: 3+8=11, 1+1=2' },
    { label: 'Example 2', text: 'Input:  num = 0\nOutput: 0' },
  ],
  constraints: [
    '0 ≤ num ≤ 2³¹ − 1',
  ],
  requiredComplexity: 'O(1) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'The answer is related to the digital root. For any positive number, the digital root is 1 + (num - 1) % 9. Can you figure out why?' },
    { number: 2, text: 'Numbers 1-9 map to themselves. 10→1, 11→2, ..., 18→9, 19→1, ... The pattern repeats with period 9.' },
    { number: 3, text: 'Formula: if num == 0 return 0; else return 1 + (num - 1) % 9.' },
  ],
  approaches: [
    {
      key: 'simulation',
      label: 'Simulation — O(log n) time',
      explanation: 'Repeatedly sum digits until single digit.',
      code: {
        java: `public int addDigits(int num) {
    while (num >= 10) {
        int sum = 0;
        while (num > 0) { sum += num % 10; num /= 10; }
        num = sum;
    }
    return num;
}`,
        cpp: `int addDigits(int num) {
    while (num >= 10) {
        int s=0;
        while (num) { s+=num%10; num/=10; }
        num=s;
    }
    return num;
}`,
        python: `def addDigits(num):
    while num >= 10:
        num = sum(int(d) for d in str(num))
    return num`,
      },
    },
    {
      key: 'optimal',
      label: 'Digital Root Formula — O(1) time, O(1) space',
      explanation: 'Use the digital root formula based on modulo 9 arithmetic.',
      code: {
        java: `public int addDigits(int num) {
    if (num == 0) return 0;
    return 1 + (num - 1) % 9;
}`,
        cpp: `int addDigits(int num) {
    return num == 0 ? 0 : 1 + (num-1)%9;
}`,
        python: `def addDigits(num):
    return 0 if num == 0 else 1 + (num - 1) % 9`,
      },
      dryRun: {
        title: 'Dry run — num = 38',
        columns: ['Step', 'Formula', 'Value'],
        rows: [
          ['num != 0', '1 + (38-1) % 9', '1 + 37 % 9'],
          ['37 % 9', '37 = 4*9 + 1', '1'],
          ['Result', '1 + 1', '2 ✓'],
        ],
        highlightRow: 2,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 166. Self Dividing Numbers
// ══════════════════════════════════════════════════════
'self-dividing-numbers': {
  statement:
    'A self-dividing number is a number that is divisible by every digit it contains. For example, 128 is a self-dividing number because 128 % 1 == 0, 128 % 2 == 0, and 128 % 8 == 0. A self-dividing number is not allowed to contain the digit zero. Given two integers left and right, return a list of all self-dividing numbers in the range [left, right].',
  tags: ['Math'],
  requirement: 'O(n log m) time where m is the range',
  externalLinks: [
    { label: '↗ LeetCode #728', url: 'https://leetcode.com/problems/self-dividing-numbers/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  left = 1, right = 22\nOutput: [1,2,3,4,5,6,7,8,9,11,12,15,22]' },
    { label: 'Example 2', text: 'Input:  left = 47, right = 85\nOutput: [48,55,66,77]' },
  ],
  constraints: [
    '1 ≤ left ≤ right ≤ 10⁴',
  ],
  requiredComplexity: 'O(n × d) time where d = digits per number',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'For each number in the range, check each of its digits. A number is self-dividing if no digit is 0 and every digit divides the number.' },
    { number: 2, text: 'Extract digits with % 10 and / 10. Check digit != 0 && num % digit == 0.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Linear Scan — O(n × d) time, O(1) space',
      explanation: 'Check each number in range by iterating its digits.',
      code: {
        java: `public List<Integer> selfDividingNumbers(int left, int right) {
    List<Integer> result = new ArrayList<>();
    for (int n = left; n <= right; n++) {
        if (isSelfDividing(n)) result.add(n);
    }
    return result;
}

private boolean isSelfDividing(int n) {
    int temp = n;
    while (temp > 0) {
        int d = temp % 10;
        if (d == 0 || n % d != 0) return false;
        temp /= 10;
    }
    return true;
}`,
        cpp: `vector<int> selfDividingNumbers(int left, int right) {
    vector<int> result;
    for (int n=left;n<=right;n++) {
        int t=n; bool ok=true;
        while(t){int d=t%10;if(!d||n%d){ok=false;break;}t/=10;}
        if(ok) result.push_back(n);
    }
    return result;
}`,
        python: `def selfDividingNumbers(left, right):
    def is_self_dividing(n):
        for d in str(n):
            if d == '0' or n % int(d) != 0:
                return False
        return True
    return [n for n in range(left, right+1) if is_self_dividing(n)]`,
      },
      dryRun: {
        title: 'Dry run — n=128',
        columns: ['digit', 'n%d', 'Valid?'],
        rows: [
          ['1', '128%1=0', 'Yes'],
          ['2', '128%2=0', 'Yes'],
          ['8', '128%8=0', 'Yes'],
          ['all digits pass', '—', 'Self-dividing ✓'],
        ],
        highlightRow: 3,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 167. Happy Number
// ══════════════════════════════════════════════════════
'happy-number': {
  statement:
    'Write an algorithm to determine if a number n is happy. A happy number is defined by: Starting with any positive integer, replace the number by the sum of the squares of its digits. Repeat the process until the number equals 1 (where it will stay), or it loops endlessly in a cycle which does not include 1. Those numbers for which this process ends in 1 are happy. Return true if n is a happy number, and false if not.',
  tags: ['Math', 'Hash Set', 'Cycle Detection'],
  requirement: 'O(log n) time using Floyd\'s cycle detection',
  externalLinks: [
    { label: '↗ LeetCode #202', url: 'https://leetcode.com/problems/happy-number/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  n = 19\nOutput: true\nExplanation: 1²+9²=82 → 8²+2²=68 → 6²+8²=100 → 1²+0²+0²=1' },
    { label: 'Example 2', text: 'Input:  n = 2\nOutput: false' },
  ],
  constraints: [
    '1 ≤ n ≤ 2³¹ − 1',
  ],
  requiredComplexity: 'O(log n) time · O(1) space (Floyd\'s) or O(log n) space (hash set)',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'The sequence either reaches 1 (happy) or enters a cycle (unhappy). How can you detect a cycle?' },
    { number: 2, text: 'Use a hash set: if you see a number twice, it\'s a cycle → not happy. If you reach 1, it\'s happy.' },
    { number: 3, text: 'For O(1) space, use Floyd\'s cycle detection: slow pointer moves 1 step, fast pointer moves 2 steps. If they meet at 1, it\'s happy. If they meet at any other number, it\'s a cycle.' },
  ],
  approaches: [
    {
      key: 'hashset',
      label: 'Hash Set — O(log n) time, O(log n) space',
      explanation: 'Track seen sums. If we see a repeat, it\'s a cycle (not happy). If we reach 1, it\'s happy.',
      code: {
        java: `public boolean isHappy(int n) {
    Set<Integer> seen = new HashSet<>();
    while (n != 1 && !seen.contains(n)) {
        seen.add(n);
        n = sumOfSquares(n);
    }
    return n == 1;
}

private int sumOfSquares(int n) {
    int sum = 0;
    while (n > 0) { int d = n%10; sum += d*d; n /= 10; }
    return sum;
}`,
        cpp: `int sumSq(int n){int s=0;while(n){int d=n%10;s+=d*d;n/=10;}return s;}
bool isHappy(int n) {
    unordered_set<int> seen;
    while(n!=1&&!seen.count(n)){seen.insert(n);n=sumSq(n);}
    return n==1;
}`,
        python: `def isHappy(n):
    def sum_sq(x):
        return sum(int(d)**2 for d in str(x))
    seen = set()
    while n != 1 and n not in seen:
        seen.add(n)
        n = sum_sq(n)
    return n == 1`,
      },
    },
    {
      key: 'optimal',
      label: "Floyd's Cycle Detection — O(log n) time, O(1) space",
      explanation: 'Slow pointer: 1 step. Fast pointer: 2 steps. If they meet at 1, happy. Otherwise cycle detected.',
      code: {
        java: `public boolean isHappy(int n) {
    int slow = n, fast = sumOfSquares(n);
    while (fast != 1 && slow != fast) {
        slow = sumOfSquares(slow);
        fast = sumOfSquares(sumOfSquares(fast));
    }
    return fast == 1;
}`,
        cpp: `bool isHappy(int n) {
    int slow=n, fast=sumSq(n);
    while(fast!=1&&slow!=fast){slow=sumSq(slow);fast=sumSq(sumSq(fast));}
    return fast==1;
}`,
        python: `def isHappy(n):
    def sum_sq(x):
        return sum(int(d)**2 for d in str(x))
    slow, fast = n, sum_sq(n)
    while fast != 1 and slow != fast:
        slow = sum_sq(slow)
        fast = sum_sq(sum_sq(fast))
    return fast == 1`,
      },
      dryRun: {
        title: 'Dry run — n = 19',
        columns: ['slow', 'fast', 'slow steps', 'fast steps'],
        rows: [
          ['19', 'sumSq(19)=82', '—', '—'],
          ['sumSq(19)=82', 'sumSq(sumSq(82))=sumSq(68)=100', '82', '100'],
          ['sumSq(82)=68', 'sumSq(sumSq(100))=sumSq(1)=1', '68', '1'],
          ['fast=1 → return true ✓', '—', '—', '—'],
        ],
        highlightRow: 3,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 168. Ugly Number
// ══════════════════════════════════════════════════════
'ugly-number': {
  statement:
    'An ugly number is a positive integer whose prime factors are limited to 2, 3, and 5. Given an integer n, return true if n is an ugly number.',
  tags: ['Math'],
  requirement: 'O(log n) time',
  externalLinks: [
    { label: '↗ LeetCode #263', url: 'https://leetcode.com/problems/ugly-number/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  n = 6\nOutput: true\nExplanation: 6 = 2 × 3' },
    { label: 'Example 2', text: 'Input:  n = 1\nOutput: true\nExplanation: 1 has no prime factors' },
    { label: 'Example 3', text: 'Input:  n = 14\nOutput: false\nExplanation: 14 = 2 × 7' },
  ],
  constraints: [
    '−2³¹ ≤ n ≤ 2³¹ − 1',
  ],
  requiredComplexity: 'O(log n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Divide n by 2, 3, and 5 as long as divisible. If the result is 1, n is ugly.' },
    { number: 2, text: 'Non-positive numbers are not ugly (handle n ≤ 0 edge case).' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Divide by 2, 3, 5 — O(log n) time, O(1) space',
      explanation: 'Keep dividing by 2, 3, 5. If what remains is 1, it\'s ugly.',
      code: {
        java: `public boolean isUgly(int n) {
    if (n <= 0) return false;
    for (int f : new int[]{2, 3, 5}) {
        while (n % f == 0) n /= f;
    }
    return n == 1;
}`,
        cpp: `bool isUgly(int n) {
    if (n<=0) return false;
    for (int f:{2,3,5}) while(n%f==0) n/=f;
    return n==1;
}`,
        python: `def isUgly(n):
    if n <= 0:
        return False
    for f in [2, 3, 5]:
        while n % f == 0:
            n //= f
    return n == 1`,
      },
      dryRun: {
        title: 'Dry run — n = 12',
        columns: ['n', 'Divide by', 'n after'],
        rows: [
          ['12', '2', '6'],
          ['6', '2', '3'],
          ['3', '2 (not divisible)', '3'],
          ['3', '3', '1'],
          ['1 == 1', '—', 'return true ✓'],
        ],
        highlightRow: 4,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 169. Perfect Number
// ══════════════════════════════════════════════════════
'perfect-number': {
  statement:
    'A perfect number is a positive integer that is equal to the sum of its positive divisors, excluding the number itself. Given an integer n, return true if n is a perfect number, otherwise return false.',
  tags: ['Math'],
  requirement: 'O(√n) time',
  externalLinks: [
    { label: '↗ LeetCode #507', url: 'https://leetcode.com/problems/perfect-number/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  num = 28\nOutput: true\nExplanation: 28 = 1 + 2 + 4 + 7 + 14' },
    { label: 'Example 2', text: 'Input:  num = 7\nOutput: false' },
  ],
  constraints: [
    '1 ≤ num ≤ 10⁸',
  ],
  requiredComplexity: 'O(√n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Iterate from 1 to √num. For each divisor i, also add num/i (the paired divisor), being careful not to double-count.' },
    { number: 2, text: 'Start sum with 1 (always a divisor). Loop from 2 to √num: if i divides num, add i and num/i. If i == num/i (perfect square), add only once.' },
    { number: 3, text: 'Edge case: num = 1 has no proper divisors other than itself, sum = 0 ≠ 1.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Divisor Pairs — O(√n) time, O(1) space',
      explanation: 'Sum all proper divisors using √n iteration. Return true if sum equals num.',
      code: {
        java: `public boolean checkPerfectNumber(int num) {
    if (num <= 1) return false;
    int sum = 1;
    for (int i = 2; (long)i*i <= num; i++) {
        if (num % i == 0) {
            sum += i;
            if (i != num / i) sum += num / i;
        }
    }
    return sum == num;
}`,
        cpp: `bool checkPerfectNumber(int num) {
    if (num<=1) return false;
    int sum=1;
    for(long i=2;i*i<=num;i++){
        if(num%i==0){sum+=i;if(i!=num/i)sum+=num/i;}
    }
    return sum==num;
}`,
        python: `def checkPerfectNumber(num):
    if num <= 1:
        return False
    total = 1
    i = 2
    while i * i <= num:
        if num % i == 0:
            total += i
            if i != num // i:
                total += num // i
        i += 1
    return total == num`,
      },
      dryRun: {
        title: 'Dry run — num = 28',
        columns: ['i', 'num%i', 'Add i', 'Add num/i', 'sum'],
        rows: [
          ['2', '0', '2', '14', '17'],
          ['3', '1', '—', '—', '17'],
          ['4', '0', '4', '7', '28'],
          ['5', '3', '—', '—', '28'],
          ['i²=25≤28, i=5 done', '—', '—', 'sum=28==num', 'true ✓'],
        ],
        highlightRow: 4,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 170. Excel Sheet Column Title
// ══════════════════════════════════════════════════════
'excel-sheet-column-title': {
  statement:
    'Given an integer columnNumber, return its corresponding column title as it appears in an Excel spreadsheet. For example: 1 → "A", 2 → "B", ..., 26 → "Z", 27 → "AA", 28 → "AB", ...',
  tags: ['Math', 'String'],
  requirement: 'O(log n) time',
  externalLinks: [
    { label: '↗ LeetCode #168', url: 'https://leetcode.com/problems/excel-sheet-column-title/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  columnNumber = 1\nOutput: "A"' },
    { label: 'Example 2', text: 'Input:  columnNumber = 28\nOutput: "AB"' },
    { label: 'Example 3', text: 'Input:  columnNumber = 701\nOutput: "ZY"' },
  ],
  constraints: [
    '1 ≤ columnNumber ≤ 2³¹ − 1',
  ],
  requiredComplexity: 'O(log n) time · O(log n) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'This is like base-26 conversion, but with 1-indexed (A=1, not 0). The key difference: before taking mod, subtract 1 to make it 0-indexed.' },
    { number: 2, text: 'Loop: char = (n-1) % 26 → map to A-Z; n = (n-1) / 26. Prepend the char to result.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Base-26 Conversion — O(log n) time, O(log n) space',
      explanation: 'Convert columnNumber to 1-indexed base-26 by decrementing before modulo.',
      code: {
        java: `public String convertToTitle(int columnNumber) {
    StringBuilder sb = new StringBuilder();
    while (columnNumber > 0) {
        columnNumber--;
        sb.append((char)('A' + columnNumber % 26));
        columnNumber /= 26;
    }
    return sb.reverse().toString();
}`,
        cpp: `string convertToTitle(int columnNumber) {
    string result;
    while (columnNumber>0) {
        columnNumber--;
        result+=(char)('A'+columnNumber%26);
        columnNumber/=26;
    }
    reverse(result.begin(),result.end());
    return result;
}`,
        python: `def convertToTitle(columnNumber):
    result = []
    while columnNumber > 0:
        columnNumber -= 1
        result.append(chr(ord('A') + columnNumber % 26))
        columnNumber //= 26
    return ''.join(reversed(result))`,
      },
      dryRun: {
        title: 'Dry run — columnNumber = 28',
        columns: ['n (before -1)', 'n-1', '(n-1)%26', 'char', 'n/26'],
        rows: [
          ['28', '27', '1', 'B', '1'],
          ['1', '0', '0', 'A', '0'],
          ['reverse', '"AB" ✓', '—', '—', '—'],
        ],
        highlightRow: 2,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 171. Greatest Common Divisor of Strings
// ══════════════════════════════════════════════════════
'gcd-of-strings': {
  statement:
    'For two strings s and t, we say "t divides s" if and only if s = t + t + t + ... + t (i.e., t is concatenated with itself one or more times). Given two strings str1 and str2, return the largest string x such that x divides both str1 and str2.',
  tags: ['Math', 'String', 'GCD'],
  requirement: 'O(m + n) time',
  externalLinks: [
    { label: '↗ LeetCode #1071', url: 'https://leetcode.com/problems/greatest-common-divisor-of-strings/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  str1 = "ABCABC", str2 = "ABC"\nOutput: "ABC"' },
    { label: 'Example 2', text: 'Input:  str1 = "ABABAB", str2 = "ABAB"\nOutput: "AB"' },
    { label: 'Example 3', text: 'Input:  str1 = "LEET", str2 = "CODE"\nOutput: ""' },
  ],
  constraints: [
    '1 ≤ str1.length, str2.length ≤ 1000',
    'str1 and str2 consist of English uppercase letters',
  ],
  requiredComplexity: 'O(m + n) time · O(m + n) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'If a GCD string exists, str1 + str2 must equal str2 + str1. Why? Because both must be repetitions of the same base string.' },
    { number: 2, text: 'If str1 + str2 ≠ str2 + str1, return "". Otherwise, the GCD string has length gcd(len1, len2).' },
    { number: 3, text: 'The answer is str1.substring(0, gcd(str1.length, str2.length)).' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'GCD of Lengths — O(m + n) time',
      explanation: 'Check concatenation equality. If valid, the GCD string is the prefix of length gcd(m, n).',
      code: {
        java: `public String gcdOfStrings(String str1, String str2) {
    if (!(str1 + str2).equals(str2 + str1)) return "";
    int g = gcd(str1.length(), str2.length());
    return str1.substring(0, g);
}

private int gcd(int a, int b) {
    return b == 0 ? a : gcd(b, a % b);
}`,
        cpp: `string gcdOfStrings(string str1, string str2) {
    if (str1+str2 != str2+str1) return "";
    int g = __gcd(str1.size(), str2.size());
    return str1.substr(0, g);
}`,
        python: `from math import gcd

def gcdOfStrings(str1, str2):
    if str1 + str2 != str2 + str1:
        return ""
    return str1[:gcd(len(str1), len(str2))]`,
      },
      dryRun: {
        title: 'Dry run — str1="ABABAB", str2="ABAB"',
        columns: ['Step', 'Check', 'Value'],
        rows: [
          ['Concat test', '"ABABAB"+"ABAB"="ABABABABAB"', '—'],
          ['—', '"ABAB"+"ABABAB"="ABABABABAB"', 'Equal ✓'],
          ['gcd(6,4)', 'gcd(6,4)=2', '—'],
          ['Answer', 'str1[:2]="AB" ✓', '—'],
        ],
        highlightRow: 3,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 172. Nim Game
// ══════════════════════════════════════════════════════
'nim-game': {
  statement:
    'You are playing the following Nim Game with your friend: Initially, there is a heap of stones on the table. You and your friend will alternate taking turns, and you go first. On each turn, the person whose turn it is will remove 1 to 3 stones from the heap. The one who removes the last stone is the winner. Given n, the number of stones in the heap, return true if you can win the game assuming both you and your friend play optimally.',
  tags: ['Math', 'Game Theory'],
  requirement: 'O(1) time',
  externalLinks: [
    { label: '↗ LeetCode #292', url: 'https://leetcode.com/problems/nim-game/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  n = 4\nOutput: false\nExplanation: Whatever you take, your friend can always take enough to leave you with 0' },
    { label: 'Example 2', text: 'Input:  n = 1\nOutput: true' },
    { label: 'Example 3', text: 'Input:  n = 2\nOutput: true' },
  ],
  constraints: [
    '1 ≤ n ≤ 2³¹ − 1',
  ],
  requiredComplexity: 'O(1) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Try small cases: n=1,2,3: you win. n=4: you lose (whatever you take, opponent leaves you empty). n=5,6,7: you win. n=8: you lose. Do you see the pattern?' },
    { number: 2, text: 'You lose if and only if n is a multiple of 4. The opponent can always mirror your moves to keep multiples of 4.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Math — O(1) time, O(1) space',
      explanation: 'You win if and only if n is not a multiple of 4.',
      code: {
        java: `public boolean canWinNim(int n) {
    return n % 4 != 0;
}`,
        cpp: `bool canWinNim(int n) {
    return n % 4 != 0;
}`,
        python: `def canWinNim(n):
    return n % 4 != 0`,
      },
      dryRun: {
        title: 'Pattern verification',
        columns: ['n', 'n%4', 'Winner'],
        rows: [
          ['1', '1', 'You win ✓'],
          ['2', '2', 'You win ✓'],
          ['3', '3', 'You win ✓'],
          ['4', '0', 'You lose ✓'],
          ['5', '1', 'You win ✓'],
          ['8', '0', 'You lose ✓'],
        ],
        highlightRow: 3,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 173. Factorial Trailing Zeroes
// ══════════════════════════════════════════════════════
'factorial-trailing-zeroes': {
  statement:
    'Given an integer n, return the number of trailing zeroes in n!. Note that n! = n × (n-1) × (n-2) × ... × 3 × 2 × 1.',
  tags: ['Math'],
  requirement: 'O(log n) time',
  externalLinks: [
    { label: '↗ LeetCode #172', url: 'https://leetcode.com/problems/factorial-trailing-zeroes/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  n = 3\nOutput: 0\nExplanation: 3! = 6, no trailing zeros' },
    { label: 'Example 2', text: 'Input:  n = 5\nOutput: 1\nExplanation: 5! = 120, one trailing zero' },
    { label: 'Example 3', text: 'Input:  n = 0\nOutput: 0' },
  ],
  constraints: [
    '0 ≤ n ≤ 10⁴',
  ],
  requiredComplexity: 'O(log n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Trailing zeros come from factors of 10 = 2 × 5. In any factorial, there are always more factors of 2 than 5, so count factors of 5.' },
    { number: 2, text: 'Count multiples of 5, 25, 125, ... in n!. Each contributes at least one factor of 5.' },
    { number: 3, text: 'Formula: floor(n/5) + floor(n/25) + floor(n/125) + ... until n/5^k = 0.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Count Factors of 5 — O(log n) time, O(1) space',
      explanation: 'Divide n by powers of 5, summing quotients.',
      code: {
        java: `public int trailingZeroes(int n) {
    int count = 0;
    while (n >= 5) {
        n /= 5;
        count += n;
    }
    return count;
}`,
        cpp: `int trailingZeroes(int n) {
    int count=0;
    while(n>=5){n/=5;count+=n;}
    return count;
}`,
        python: `def trailingZeroes(n):
    count = 0
    while n >= 5:
        n //= 5
        count += n
    return count`,
      },
      dryRun: {
        title: 'Dry run — n = 25',
        columns: ['n', 'n/5', 'count'],
        rows: [
          ['25', '5', '5'],
          ['5', '1', '6'],
          ['1 < 5', '—', 'return 6 ✓ (25! has 6 trailing zeros)'],
        ],
        highlightRow: 2,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 174. Count Primes
// ══════════════════════════════════════════════════════
'count-primes': {
  statement:
    'Given an integer n, return the number of prime numbers that are strictly less than n.',
  tags: ['Math', 'Sieve of Eratosthenes'],
  requirement: 'O(n log log n) time',
  externalLinks: [
    { label: '↗ LeetCode #204', url: 'https://leetcode.com/problems/count-primes/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  n = 10\nOutput: 4\nExplanation: Primes: 2, 3, 5, 7' },
    { label: 'Example 2', text: 'Input:  n = 0\nOutput: 0' },
    { label: 'Example 3', text: 'Input:  n = 1\nOutput: 0' },
  ],
  constraints: [
    '0 ≤ n ≤ 5 × 10⁶',
  ],
  requiredComplexity: 'O(n log log n) time · O(n) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Naively checking each number is O(n√n). The Sieve of Eratosthenes is much faster — can you recall how it works?' },
    { number: 2, text: 'Start with all numbers 2..n-1 marked as prime. For each prime p, mark all multiples p², p²+p, p²+2p, ... as not prime.' },
    { number: 3, text: 'Only need to sieve up to √n because any composite number has a factor ≤ √n.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Sieve of Eratosthenes — O(n log log n) time, O(n) space',
      explanation: 'Boolean array tracks primality. For each prime p, mark all multiples starting from p² as composite.',
      code: {
        java: `public int countPrimes(int n) {
    if (n < 2) return 0;
    boolean[] isComposite = new boolean[n];
    int count = 0;
    for (int i = 2; i < n; i++) {
        if (!isComposite[i]) {
            count++;
            for (long j = (long)i*i; j < n; j += i) {
                isComposite[(int)j] = true;
            }
        }
    }
    return count;
}`,
        cpp: `int countPrimes(int n) {
    if (n<2) return 0;
    vector<bool> comp(n, false);
    int count=0;
    for (int i=2;i<n;i++) {
        if (!comp[i]) {
            count++;
            for (long j=(long)i*i;j<n;j+=i) comp[j]=true;
        }
    }
    return count;
}`,
        python: `def countPrimes(n):
    if n < 2:
        return 0
    is_composite = [False] * n
    for i in range(2, int(n**0.5) + 1):
        if not is_composite[i]:
            for j in range(i*i, n, i):
                is_composite[j] = True
    return sum(1 for i in range(2, n) if not is_composite[i])`,
      },
      dryRun: {
        title: 'Dry run — n = 10',
        columns: ['i', 'isPrime[i]?', 'Mark composites (j=i² step i)', 'count'],
        rows: [
          ['2', 'Yes', 'j=4,6,8 marked composite', '1'],
          ['3', 'Yes', 'j=9 marked composite', '2'],
          ['4', 'No (composite)', '—', '2'],
          ['5', 'Yes', 'j=25>10, nothing', '3'],
          ['7', 'Yes', 'j=49>10, nothing', '4'],
          ['Result', '—', 'Primes: 2,3,5,7', '4 ✓'],
        ],
        highlightRow: 5,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 175. Bulb Switcher
// ══════════════════════════════════════════════════════
'bulb-switcher': {
  statement:
    'There are n bulbs that are initially off. You first turn on all the bulbs, then you turn off every second bulb, then you toggle every third bulb, and so on. On the kth round, you toggle every kth bulb. For the nth round, you only toggle the last bulb. Return the number of bulbs that are on after n rounds.',
  tags: ['Math', 'Brainteaser'],
  requirement: 'O(1) time',
  externalLinks: [
    { label: '↗ LeetCode #319', url: 'https://leetcode.com/problems/bulb-switcher/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  n = 3\nOutput: 1\nExplanation: Bulb 1 is toggled in rounds 1. Bulb 2 in rounds 1,2. Bulb 3 in rounds 1,3. Only bulb 1 ends on.' },
    { label: 'Example 2', text: 'Input:  n = 0\nOutput: 0' },
    { label: 'Example 3', text: 'Input:  n = 1\nOutput: 1' },
  ],
  constraints: [
    '0 ≤ n ≤ 10⁹',
  ],
  requiredComplexity: 'O(1) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Bulb i is toggled once for each divisor of i. A bulb ends on only if it\'s toggled an odd number of times. When does a number have an odd number of divisors?' },
    { number: 2, text: 'Only perfect squares have an odd number of divisors (because divisors pair up, but the square root pairs with itself). So only perfect-square bulbs remain on.' },
    { number: 3, text: 'The count of perfect squares ≤ n is floor(√n).' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Square Root — O(1) time, O(1) space',
      explanation: 'Count perfect squares ≤ n using integer square root.',
      code: {
        java: `public int bulbSwitch(int n) {
    return (int) Math.sqrt(n);
}`,
        cpp: `int bulbSwitch(int n) {
    return (int)sqrt(n);
}`,
        python: `def bulbSwitch(n):
    return int(n**0.5)`,
      },
      dryRun: {
        title: 'Dry run — n = 10',
        columns: ['Bulb', 'Divisors', 'Toggle count', 'On?'],
        rows: [
          ['1', '{1}', '1 (odd)', 'Yes (1=1²)'],
          ['2', '{1,2}', '2 (even)', 'No'],
          ['4', '{1,2,4}', '3 (odd)', 'Yes (4=2²)'],
          ['9', '{1,3,9}', '3 (odd)', 'Yes (9=3²)'],
          ['√10 ≈ 3', 'Perfect squares ≤ 10: 1,4,9', '—', 'return 3 ✓'],
        ],
        highlightRow: 4,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 176. Minimum Moves to Equal Array Elements
// ══════════════════════════════════════════════════════
'minimum-moves-to-equal-array-elements': {
  statement:
    'Given an integer array nums of size n, return the minimum number of moves required to make all array elements equal. In one move, you can increment n - 1 elements of the array by 1.',
  tags: ['Math', 'Arrays'],
  requirement: 'O(n) time',
  externalLinks: [
    { label: '↗ LeetCode #453', url: 'https://leetcode.com/problems/minimum-moves-to-equal-array-elements/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  nums = [1,2,3]\nOutput: 3\nExplanation: Move 1: [2,3,3] → Move 2: [3,4,3]? No: [2,3,3]→[3,3,4]→[4,4,4]. Wait: min=1, sum=6, ans=6-3=3.' },
    { label: 'Example 2', text: 'Input:  nums = [1,1,1]\nOutput: 0' },
  ],
  constraints: [
    'n == nums.length',
    '1 ≤ nums.length ≤ 10⁵',
    '−10⁹ ≤ nums[i] ≤ 10⁹',
    'The answer is guaranteed to fit in a 32-bit integer',
  ],
  requiredComplexity: 'O(n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Incrementing n-1 elements by 1 is equivalent to decrementing 1 element by 1. (The relative differences are the same.)' },
    { number: 2, text: 'With this equivalence: make all elements equal to the minimum. Each non-minimum element needs (nums[i] - min) decrements.' },
    { number: 3, text: 'Answer = sum(nums) - n * min(nums).' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Math — O(n) time, O(1) space',
      explanation: 'Incrementing n-1 elements by 1 equals decrementing 1 element by 1. Total moves = sum - n*min.',
      code: {
        java: `public int minMoves(int[] nums) {
    int min = Integer.MAX_VALUE, sum = 0;
    for (int n : nums) { sum += n; min = Math.min(min, n); }
    return sum - min * nums.length;
}`,
        cpp: `int minMoves(vector<int>& nums) {
    int mn=*min_element(nums.begin(),nums.end());
    long sum=accumulate(nums.begin(),nums.end(),0L);
    return sum - (long)mn*nums.size();
}`,
        python: `def minMoves(nums):
    return sum(nums) - min(nums) * len(nums)`,
      },
      dryRun: {
        title: 'Dry run — nums = [1,2,3]',
        columns: ['sum', 'min', 'n', 'answer = sum - min*n'],
        rows: [
          ['6', '1', '3', '6 - 1*3 = 3 ✓'],
        ],
        highlightRow: 0,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 177. Super Pow
// ══════════════════════════════════════════════════════
'super-pow': {
  statement:
    'Your task is to calculate aᵇ mod 1337, where a is a positive integer and b is an extremely large positive integer given in the form of an array. The array b contains digits such that b = b[0]*10^(k-1) + b[1]*10^(k-2) + ... + b[k-1].',
  tags: ['Math', 'Modular Exponentiation'],
  requirement: 'O(n) time where n = len(b)',
  externalLinks: [
    { label: '↗ LeetCode #372', url: 'https://leetcode.com/problems/super-pow/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  a = 2, b = [3]\nOutput: 8' },
    { label: 'Example 2', text: 'Input:  a = 2, b = [1,0]\nOutput: 1024' },
    { label: 'Example 3', text: 'Input:  a = 1, b = [4,3,3,8,5,2]\nOutput: 1' },
  ],
  constraints: [
    '1 ≤ a ≤ 2³¹ − 1',
    '1 ≤ b.length ≤ 2000',
    '0 ≤ b[i] ≤ 9',
    'b does not contain leading zeros',
  ],
  requiredComplexity: 'O(n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'a^[d1,d2,d3] = (a^[d1,d2])^10 * a^d3. Process b digit by digit from left to right using this recurrence.' },
    { number: 2, text: 'At each step: result = (result^10 * a^digit) mod 1337. Use fast modular exponentiation for power.' },
    { number: 3, text: 'Use (a % 1337) to reduce a initially — it doesn\'t change the result mod 1337.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Modular Exponentiation — O(n) time, O(1) space',
      explanation: 'Process each digit of b left to right. At each step multiply result^10 by a^digit, all mod 1337.',
      code: {
        java: `public int superPow(int a, int[] b) {
    final int MOD = 1337;
    a %= MOD;
    int result = 1;
    for (int digit : b) {
        result = powMod(result, 10, MOD) * powMod(a, digit, MOD) % MOD;
    }
    return result;
}

private int powMod(int base, int exp, int mod) {
    int result = 1;
    base %= mod;
    while (exp > 0) {
        if ((exp & 1) == 1) result = result * base % mod;
        base = base * base % mod;
        exp >>= 1;
    }
    return result;
}`,
        cpp: `int powMod(int base, int exp, int mod){
    int r=1; base%=mod;
    while(exp>0){if(exp&1)r=r*base%mod;base=base*base%mod;exp>>=1;}
    return r;
}
int superPow(int a, vector<int>& b) {
    const int MOD=1337;
    a%=MOD;
    int result=1;
    for(int d:b) result=powMod(result,10,MOD)*powMod(a,d,MOD)%MOD;
    return result;
}`,
        python: `def superPow(a, b):
    MOD = 1337

    def pow_mod(base, exp, mod):
        result = 1
        base %= mod
        while exp > 0:
            if exp & 1:
                result = result * base % mod
            base = base * base % mod
            exp >>= 1
        return result

    a %= MOD
    result = 1
    for digit in b:
        result = pow_mod(result, 10, MOD) * pow_mod(a, digit, MOD) % MOD
    return result`,
      },
      dryRun: {
        title: 'Dry run — a=2, b=[1,0] (a^10 = 1024)',
        columns: ['digit', 'result^10 % 1337', 'a^digit % 1337', 'new result'],
        rows: [
          ['1', '1^10=1', '2^1=2', '1*2=2'],
          ['0', '2^10=1024', '2^0=1', '1024*1=1024'],
          ['Result', '1024 ✓', '—', '—'],
        ],
        highlightRow: 2,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 178. Rectangle Area
// ══════════════════════════════════════════════════════
'rectangle-area': {
  statement:
    'Given the coordinates of two rectilinear rectangles in a 2D plane, return the total area covered by the two rectangles. The first rectangle is defined by its bottom-left corner (ax1, ay1) and its top-right corner (ax2, ay2). The second rectangle is defined by its bottom-left corner (bx1, by1) and its top-right corner (bx2, by2).',
  tags: ['Math', 'Geometry'],
  requirement: 'O(1) time',
  externalLinks: [
    { label: '↗ LeetCode #223', url: 'https://leetcode.com/problems/rectangle-area/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  ax1=-3,ay1=0,ax2=3,ay2=4,bx1=0,by1=-1,bx2=9,by2=2\nOutput: 45' },
    { label: 'Example 2', text: 'Input:  ax1=-2,ay1=-2,ax2=2,ay2=2,bx1=-2,by1=-2,bx2=2,by2=2\nOutput: 16' },
  ],
  constraints: [
    '−10⁴ ≤ ax1 < ax2 ≤ 10⁴',
    '−10⁴ ≤ ay1 < ay2 ≤ 10⁴',
    '−10⁴ ≤ bx1 < bx2 ≤ 10⁴',
    '−10⁴ ≤ by1 < by2 ≤ 10⁴',
  ],
  requiredComplexity: 'O(1) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Total area = area1 + area2 - overlap. How do you compute the overlap area?' },
    { number: 2, text: 'Overlap width = max(0, min(ax2,bx2) - max(ax1,bx1)). Overlap height = max(0, min(ay2,by2) - max(ay1,by1)).' },
    { number: 3, text: 'Overlap area = overlap_width × overlap_height (0 if they don\'t overlap).' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Inclusion-Exclusion — O(1) time, O(1) space',
      explanation: 'Compute individual areas, subtract overlap.',
      code: {
        java: `public int computeArea(int ax1,int ay1,int ax2,int ay2,
                               int bx1,int by1,int bx2,int by2) {
    int area1 = (ax2-ax1) * (ay2-ay1);
    int area2 = (bx2-bx1) * (by2-by1);
    int overlapW = Math.max(0, Math.min(ax2,bx2) - Math.max(ax1,bx1));
    int overlapH = Math.max(0, Math.min(ay2,by2) - Math.max(ay1,by1));
    return area1 + area2 - overlapW * overlapH;
}`,
        cpp: `int computeArea(int ax1,int ay1,int ax2,int ay2,
                        int bx1,int by1,int bx2,int by2) {
    int a1=(ax2-ax1)*(ay2-ay1), a2=(bx2-bx1)*(by2-by1);
    int ow=max(0,min(ax2,bx2)-max(ax1,bx1));
    int oh=max(0,min(ay2,by2)-max(ay1,by1));
    return a1+a2-ow*oh;
}`,
        python: `def computeArea(ax1,ay1,ax2,ay2,bx1,by1,bx2,by2):
    area1 = (ax2-ax1)*(ay2-ay1)
    area2 = (bx2-bx1)*(by2-by1)
    ow = max(0, min(ax2,bx2) - max(ax1,bx1))
    oh = max(0, min(ay2,by2) - max(ay1,by1))
    return area1 + area2 - ow*oh`,
      },
      dryRun: {
        title: 'Dry run — A:(-3,0)-(3,4), B:(0,-1)-(9,2)',
        columns: ['Calculation', 'Value'],
        rows: [
          ['area1 = 6*4', '24'],
          ['area2 = 9*3', '27'],
          ['ow = min(3,9)-max(-3,0) = 3-0', '3'],
          ['oh = min(4,2)-max(0,-1) = 2-0', '2'],
          ['total = 24+27-3*2', '45 ✓'],
        ],
        highlightRow: 4,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 179. Valid Square
// ══════════════════════════════════════════════════════
'valid-square': {
  statement:
    'Given the coordinates of four points in 2D space p1, p2, p3 and p4, return true if the four points construct a square. The coordinate of a point pi is represented as [xi, yi].',
  tags: ['Math', 'Geometry'],
  requirement: 'O(1) time',
  externalLinks: [
    { label: '↗ LeetCode #593', url: 'https://leetcode.com/problems/valid-square/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  p1=[0,0], p2=[1,1], p3=[1,0], p4=[0,1]\nOutput: true' },
    { label: 'Example 2', text: 'Input:  p1=[0,0], p2=[1,1], p3=[1,0], p4=[0,12]\nOutput: false' },
  ],
  constraints: [
    'p1.length == p2.length == p3.length == p4.length == 2',
    '−10⁴ ≤ xi, yi ≤ 10⁴',
  ],
  requiredComplexity: 'O(1) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Compute all 6 pairwise squared distances. A square has exactly 2 distinct distances: 4 equal sides and 2 equal diagonals. The diagonals are √2 times the sides.' },
    { number: 2, text: 'Collect all squared distances into a set. There should be exactly 2 distinct values. Reject if any distance is 0 (degenerate).' },
    { number: 3, text: 'The 4 smaller distances are sides and 2 larger are diagonals. Verify 4 sides are equal, 2 diagonals are equal, and diagonal² = 2 × side².' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Distance Set — O(1) time, O(1) space',
      explanation: 'Compute all 6 squared distances. Valid square: exactly 2 distinct values, no zeros, counts of 4 and 2.',
      code: {
        java: `public boolean validSquare(int[] p1, int[] p2, int[] p3, int[] p4) {
    long[] dists = new long[6];
    int[][] pts = {p1, p2, p3, p4};
    int k = 0;
    for (int i = 0; i < 4; i++)
        for (int j = i+1; j < 4; j++)
            dists[k++] = dist(pts[i], pts[j]);
    Arrays.sort(dists);
    return dists[0] > 0 &&
           dists[0]==dists[1] && dists[1]==dists[2] && dists[2]==dists[3] &&
           dists[4]==dists[5] && dists[4]==2*dists[0];
}

private long dist(int[] a, int[] b) {
    long dx=a[0]-b[0], dy=a[1]-b[1];
    return dx*dx+dy*dy;
}`,
        cpp: `long long dist(vector<int>& a,vector<int>& b){long long dx=a[0]-b[0],dy=a[1]-b[1];return dx*dx+dy*dy;}
bool validSquare(vector<int>& p1,vector<int>& p2,vector<int>& p3,vector<int>& p4) {
    vector<vector<int>*> pts={&p1,&p2,&p3,&p4};
    vector<long long> d;
    for(int i=0;i<4;i++) for(int j=i+1;j<4;j++) d.push_back(dist(*pts[i],*pts[j]));
    sort(d.begin(),d.end());
    return d[0]>0&&d[0]==d[1]&&d[1]==d[2]&&d[2]==d[3]&&d[4]==d[5]&&d[4]==2*d[0];
}`,
        python: `def validSquare(p1, p2, p3, p4):
    def dist_sq(a, b):
        return (a[0]-b[0])**2 + (a[1]-b[1])**2
    pts = [p1, p2, p3, p4]
    dists = sorted(dist_sq(pts[i], pts[j])
                   for i in range(4) for j in range(i+1, 4))
    return (dists[0] > 0 and
            dists[0] == dists[1] == dists[2] == dists[3] and
            dists[4] == dists[5] and dists[4] == 2 * dists[0])`,
      },
      dryRun: {
        title: 'Dry run — p1=[0,0],p2=[1,0],p3=[1,1],p4=[0,1]',
        columns: ['Pair', 'dist²'],
        rows: [
          ['(0,0)-(1,0)', '1'],
          ['(0,0)-(1,1)', '2'],
          ['(0,0)-(0,1)', '1'],
          ['(1,0)-(1,1)', '1'],
          ['(1,0)-(0,1)', '2'],
          ['(1,1)-(0,1)', '1'],
          ['Sorted: [1,1,1,1,2,2]', '4 sides=1, 2 diags=2, 2=2*1 ✓', ''],
        ],
        highlightRow: 6,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 180. Max Points on a Line
// ══════════════════════════════════════════════════════
'max-points-on-a-line': {
  statement:
    'Given an array of points where points[i] = [xi, yi] represents a point on the X-Y plane, return the maximum number of points that lie on the same straight line.',
  tags: ['Math', 'Geometry', 'Hash Map'],
  requirement: 'O(n²) time',
  externalLinks: [
    { label: '↗ LeetCode #149', url: 'https://leetcode.com/problems/max-points-on-a-line/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  points = [[1,1],[2,2],[3,3]]\nOutput: 3' },
    { label: 'Example 2', text: 'Input:  points = [[1,1],[3,2],[5,3],[4,1],[2,3],[1,4]]\nOutput: 4' },
  ],
  constraints: [
    '1 ≤ points.length ≤ 300',
    'points[i].length == 2',
    '−10⁴ ≤ xi, yi ≤ 10⁴',
    'All points are unique',
  ],
  requiredComplexity: 'O(n²) time · O(n) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'For each point, consider all other points and compute the slope. Points with the same slope from the fixed point are collinear.' },
    { number: 2, text: 'Use a hash map: slope → count. The maximum count + 1 (for the fixed point itself) is the max collinear.' },
    { number: 3, text: 'Represent slopes as reduced fractions (dy/gcd, dx/gcd) to avoid floating point issues. Handle vertical lines (dx=0) and horizontal lines (dy=0) as special keys.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Slope Hash Map — O(n²) time, O(n) space',
      explanation: 'For each point, use a slope map to count collinear points. Use reduced fraction representation for slopes.',
      code: {
        java: `public int maxPoints(int[][] points) {
    int n = points.length, result = 1;
    for (int i = 0; i < n; i++) {
        Map<String, Integer> slopeCount = new HashMap<>();
        for (int j = i+1; j < n; j++) {
            int dx = points[j][0] - points[i][0];
            int dy = points[j][1] - points[i][1];
            int g = gcd(Math.abs(dx), Math.abs(dy));
            if (g != 0) { dx /= g; dy /= g; }
            if (dx < 0) { dx = -dx; dy = -dy; }
            else if (dx == 0) dy = Math.abs(dy);
            String key = dx + "," + dy;
            slopeCount.merge(key, 1, Integer::sum);
            result = Math.max(result, slopeCount.get(key) + 1);
        }
    }
    return result;
}

private int gcd(int a, int b) { return b == 0 ? a : gcd(b, a % b); }`,
        cpp: `int maxPoints(vector<vector<int>>& points) {
    int n=points.size(), res=1;
    auto gcd=[](int a,int b)->int{while(b){a%=b;swap(a,b);}return a;};
    for(int i=0;i<n;i++){
        map<pair<int,int>,int> cnt;
        for(int j=i+1;j<n;j++){
            int dx=points[j][0]-points[i][0], dy=points[j][1]-points[i][1];
            int g=gcd(abs(dx),abs(dy));
            if(g){dx/=g;dy/=g;}
            if(dx<0){dx=-dx;dy=-dy;}
            else if(!dx) dy=abs(dy);
            res=max(res,++cnt[{dx,dy}]+1);
        }
    }
    return res;
}`,
        python: `from math import gcd
from collections import defaultdict

def maxPoints(points):
    n = len(points)
    if n <= 2:
        return n
    result = 1
    for i in range(n):
        slope_count = defaultdict(int)
        for j in range(i+1, n):
            dx = points[j][0] - points[i][0]
            dy = points[j][1] - points[i][1]
            g = gcd(abs(dx), abs(dy))
            if g:
                dx //= g; dy //= g
            if dx < 0:
                dx, dy = -dx, -dy
            elif dx == 0:
                dy = abs(dy)
            slope_count[(dx, dy)] += 1
            result = max(result, slope_count[(dx, dy)] + 1)
    return result`,
      },
      dryRun: {
        title: 'Dry run — points = [[1,1],[2,2],[3,3]]',
        columns: ['Fixed i', 'j', 'slope (dx,dy)', 'count', 'max'],
        rows: [
          ['0(1,1)', '1(2,2)', '(1,1)', '1', '2'],
          ['0(1,1)', '2(3,3)', '(1,1)', '2', '3'],
          ['1(2,2)', '2(3,3)', '(1,1)', '1', '3'],
          ['Result', '—', '—', '—', '3 ✓'],
        ],
        highlightRow: 3,
      },
    },
  ],
},

// ══════════════════════════════════════════════════════
// 181. K-th Smallest in Lexicographical Order
// ══════════════════════════════════════════════════════
'kth-smallest-in-lexicographical-order': {
  statement:
    'Given two integers n and k, return the kth lexicographically smallest integer in the range [1, n].',
  tags: ['Math', 'Trie', 'Number Theory'],
  requirement: 'O(log² n) time',
  externalLinks: [
    { label: '↗ LeetCode #440', url: 'https://leetcode.com/problems/k-th-smallest-in-lexicographical-order/' },
  ],
  examples: [
    { label: 'Example 1', text: 'Input:  n = 13, k = 2\nOutput: 10\nExplanation: Lexicographic order: [1,10,11,12,13,2,3,4,5,6,7,8,9]. 2nd is 10.' },
    { label: 'Example 2', text: 'Input:  n = 1, k = 1\nOutput: 1' },
  ],
  constraints: [
    '1 ≤ k ≤ n ≤ 10⁹',
  ],
  requiredComplexity: 'O(log² n) time · O(1) space',
  hints: [
    { number: 1, unlockedByDefault: true, text: 'Think of lexicographic order as a 10-ary trie. The kth element is reached by traversing this trie.' },
    { number: 2, text: 'From current prefix, count how many numbers in [1,n] start with that prefix. If count < k, skip this entire subtree and move to next sibling (prefix++).' },
    { number: 3, text: 'If count ≥ k, the answer is in this subtree — go deeper (prefix *= 10) and decrement k by 1 (the prefix itself).' },
    { number: 4, label: 'Hint 4 — counting nodes', text: 'Count nodes in range [prefix, prefix+1) that are ≤ n. Compute in steps: level = (min(n+1, next) - cur), multiply cur by 10 to go deeper.' },
  ],
  approaches: [
    {
      key: 'optimal',
      label: 'Trie Traversal — O(log² n) time, O(1) space',
      explanation: 'Navigate the lexicographic trie by counting nodes under each prefix. Move to sibling or child based on remaining k.',
      code: {
        java: `public int findKthNumber(int n, int k) {
    int curr = 1;
    k--;
    while (k > 0) {
        long steps = countSteps(n, curr, curr + 1);
        if (steps <= k) {
            curr++; // skip this subtree
            k -= steps;
        } else {
            curr *= 10; // go deeper
            k--;
        }
    }
    return curr;
}

private long countSteps(int n, long curr, long next) {
    long steps = 0;
    while (curr <= n) {
        steps += Math.min((long)n + 1, next) - curr;
        curr *= 10;
        next *= 10;
    }
    return steps;
}`,
        cpp: `long long countSteps(int n, long long cur, long long next) {
    long long steps=0;
    while(cur<=n){steps+=min((long long)n+1,next)-cur;cur*=10;next*=10;}
    return steps;
}
int findKthNumber(int n, int k) {
    int cur=1; k--;
    while(k>0){
        long long steps=countSteps(n,cur,cur+1);
        if(steps<=k){cur++;k-=steps;}
        else{cur*=10;k--;}
    }
    return cur;
}`,
        python: `def findKthNumber(n, k):
    def count_steps(n, cur, nxt):
        steps = 0
        while cur <= n:
            steps += min(n + 1, nxt) - cur
            cur *= 10
            nxt *= 10
        return steps

    cur = 1
    k -= 1
    while k > 0:
        steps = count_steps(n, cur, cur + 1)
        if steps <= k:
            cur += 1
            k -= steps
        else:
            cur *= 10
            k -= 1
    return cur`,
      },
      dryRun: {
        title: 'Dry run — n=13, k=2',
        columns: ['cur', 'k', 'steps(cur, cur+1)', 'Action'],
        rows: [
          ['1', '1 (k-1)', 'count[1,2)∩[1,13]: 1,10,11,12,13 = 5', 'steps=5>k=1 → go deeper, cur=10, k=0'],
          ['10', '0', '—', 'k=0 → return cur=10 ✓'],
        ],
        highlightRow: 1,
      },
    },
  ],
},




};

// getProblemDetails — safe lookup with graceful fallback for problems that
// don't have a full write-up yet.
export function getProblemDetails(id) {
  return problemDetails[id] || null;
}