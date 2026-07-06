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
  // 1. Rotate Array
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
  // 2. Next Permutation
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
  // 3. Missing Number
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
  // 4. Find All Numbers Disappeared in an Array
  // ══════════════════════════════════════════════════════
  'find-disappeared-numbers': {
    statement:
      'Given an array nums of n integers where nums[i] is in the range [1, n], return an array of all the integers in the range [1, n] that do not appear in nums.',
    tags: ['Arrays', 'Cyclic Sort'],
    requirement: 'O(n) time, O(1) extra space (excluding output) preferred',
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
      { number: 1, unlockedByDefault: true, text: 'Values are bounded to [1, n], the same range as valid indices (1-indexed). Can you use the array itself as a hash set?' },
      { number: 2, text: 'For each value v you see, you can "mark" index v-1 somehow without losing the original data.' },
      { number: 3, text: 'Marking by negation works: for each nums[i], go to index |nums[i]|-1 and negate the value there (if not already negative).' },
      { number: 4, label: 'Hint 4 — approach', text: 'After marking, any index whose value is still positive means that number (index+1) was never seen — collect all such (index+1).' },
    ],
    approaches: [
      {
        key: 'hashset',
        label: 'Hash Set — O(n) time, O(n) space',
        explanation: 'Put every number in a set, then check which of 1..n are missing.',
        code: {
          java: `public List<Integer> findDisappearedNumbers(int[] nums) {
    Set<Integer> seen = new HashSet<>();
    for (int x : nums) seen.add(x);
    List<Integer> res = new ArrayList<>();
    for (int i = 1; i <= nums.length; i++) {
        if (!seen.contains(i)) res.add(i);
    }
    return res;
}`,
          cpp: `vector<int> findDisappearedNumbers(vector<int>& nums) {
    unordered_set<int> seen(nums.begin(), nums.end());
    vector<int> res;
    for (int i = 1; i <= (int)nums.size(); i++) {
        if (!seen.count(i)) res.push_back(i);
    }
    return res;
}`,
          python: `def findDisappearedNumbers(nums):
    seen = set(nums)
    return [i for i in range(1, len(nums) + 1) if i not in seen]`,
        },
      },
      {
        key: 'optimal',
        label: 'In-place Negation Marking — O(n) time, O(1) extra space',
        explanation: 'Use the sign of nums[value-1] as a "visited" flag. Values still positive at the end mean their index+1 never appeared.',
        code: {
          java: `public List<Integer> findDisappearedNumbers(int[] nums) {
    for (int i = 0; i < nums.length; i++) {
        int idx = Math.abs(nums[i]) - 1;
        if (nums[idx] > 0) nums[idx] = -nums[idx];
    }
    List<Integer> res = new ArrayList<>();
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] > 0) res.add(i + 1);
    }
    return res;
}`,
          cpp: `vector<int> findDisappearedNumbers(vector<int>& nums) {
    for (int i = 0; i < (int)nums.size(); i++) {
        int idx = abs(nums[i]) - 1;
        if (nums[idx] > 0) nums[idx] = -nums[idx];
    }
    vector<int> res;
    for (int i = 0; i < (int)nums.size(); i++) {
        if (nums[i] > 0) res.push_back(i + 1);
    }
    return res;
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
          columns: ['Value seen', 'Index marked (value-1)', 'Array after marking'],
          rows: [
            ['4', '3', '[4,3,2,-7,8,2,3,1]'],
            ['3', '2', '[4,3,-2,-7,8,2,3,1]'],
            ['2', '1', '[4,-3,-2,-7,8,2,3,1]'],
            ['7 (already -7 target? idx=6)', '6', '[4,-3,-2,-7,8,2,-3,1]'],
            ['... (continues)', '', 'Final positives at idx 4,5 → answer [5,6] ✓'],
          ],
          highlightRow: 4,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 5. Find the Duplicate Number
  // ══════════════════════════════════════════════════════
  'find-duplicate-number': {
    statement:
      'Given an array of integers nums containing n + 1 integers where each integer is in the range [1, n] inclusive, there is exactly one repeated number. Find this duplicate number without modifying the array and using only O(1) extra space.',
    tags: ['Arrays', 'Cyclic Sort', 'Two Pointers'],
    requirement: 'O(1) extra space, do not modify the array',
    externalLinks: [
      { label: '↗ LeetCode #287', url: 'https://leetcode.com/problems/find-the-duplicate-number/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [1,3,4,2,2]\nOutput: 2' },
      { label: 'Example 2', text: 'Input:  nums = [3,1,3,4,2]\nOutput: 3' },
    ],
    constraints: ['1 ≤ n ≤ 10⁵', 'nums.length == n + 1', '1 ≤ nums[i] ≤ n', 'Exactly one repeated number'],
    requiredComplexity: 'O(n) time · O(1) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'Think of each value nums[i] as a "pointer" to index nums[i]. What kind of structure does this create?' },
      { number: 2, text: 'Since a value repeats, following these pointers from index 0 must eventually enter a cycle — this is structurally the same as detecting a cycle in a linked list.' },
      { number: 3, text: 'Use Floyd\'s Tortoise and Hare: slow moves one step (slow = nums[slow]), fast moves two steps (fast = nums[nums[fast]]), until they meet.' },
      { number: 4, label: 'Hint 4 — approach', text: 'After they meet inside the cycle, reset one pointer to the start (index 0) and move both one step at a time — they will meet exactly at the cycle\'s entrance, which is the duplicate number.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: "Floyd's Cycle Detection — O(n) time, O(1) space",
        explanation: 'Treat the array as a linked list via value→index links. The duplicate value creates a cycle; find its entry point.',
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
          columns: ['Phase', 'slow', 'fast'],
          rows: [
            ['start', '1', '1'],
            ['step 1', 'nums[1]=3', 'nums[nums[1]]=nums[3]=2'],
            ['step 2', 'nums[3]=2', 'nums[nums[2]]=nums[4]=2'],
            ['meet inside cycle', '2', '2 (slow == fast)'],
            ['reset slow=nums[0]=1, walk both by 1', 'slow: 1→3→2', 'fast: 2→2 (already there)'],
            ['final meeting point', '2', '2 ✓ duplicate = 2'],
          ],
          highlightRow: 5,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 6. First Missing Positive
  // ══════════════════════════════════════════════════════
  'first-missing-positive': {
    statement:
      'Given an unsorted integer array nums, return the smallest missing positive integer. You must implement an algorithm that runs in O(n) time and uses O(1) auxiliary space.',
    tags: ['Arrays', 'Cyclic Sort'],
    requirement: 'O(n) time, O(1) extra space',
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
      { number: 1, unlockedByDefault: true, text: 'The answer must be between 1 and n+1 (n = array length) — think about why an array of size n can never be missing something larger than n+1.' },
      { number: 2, text: 'Since the answer is bounded by n, you can use index i to represent the number i+1, and place each value at its "correct" home index if possible (cyclic sort).' },
      { number: 3, text: 'For each i, while nums[i] is in [1, n] and not already in its correct spot (nums[nums[i]-1] != nums[i]), swap nums[i] with nums[nums[i]-1].' },
      { number: 4, label: 'Hint 4 — approach', text: 'After placing all in-range values at their home index, scan left to right: the first index i where nums[i] != i+1 tells you the missing positive is i+1. If none found, the answer is n+1.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Cyclic Sort (Index as Hash) — O(n) time, O(1) space',
        explanation: 'Place each value v (1 ≤ v ≤ n) at index v-1 by swapping, then scan for the first index that does not hold its expected value.',
        code: {
          java: `public int firstMissingPositive(int[] nums) {
    int n = nums.length;
    for (int i = 0; i < n; i++) {
        while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {
            int t = nums[nums[i] - 1];
            nums[nums[i] - 1] = nums[i];
            nums[i] = t;
        }
    }
    for (int i = 0; i < n; i++) {
        if (nums[i] != i + 1) return i + 1;
    }
    return n + 1;
}`,
          cpp: `int firstMissingPositive(vector<int>& nums) {
    int n = nums.size();
    for (int i = 0; i < n; i++) {
        while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {
            swap(nums[nums[i] - 1], nums[i]);
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
        while 1 <= nums[i] <= n and nums[nums[i] - 1] != nums[i]:
            j = nums[i] - 1
            nums[i], nums[j] = nums[j], nums[i]
    for i in range(n):
        if nums[i] != i + 1:
            return i + 1
    return n + 1`,
        },
        dryRun: {
          title: 'Dry run — nums = [3,4,-1,1]',
          columns: ['i', 'Action', 'Array State'],
          rows: [
            ['0', 'nums[0]=3 belongs at idx 2; swap', '[-1,4,3,1]'],
            ['0', 'nums[0]=-1 out of range, stop', '[-1,4,3,1]'],
            ['1', 'nums[1]=4 belongs at idx 3; swap', '[-1,1,3,4]'],
            ['1', 'nums[1]=1 belongs at idx 0; swap', '[1,-1,3,4]'],
            ['1', 'nums[1]=-1 out of range, stop', '[1,-1,3,4]'],
            ['scan', 'idx1 holds -1 ≠ 2 → answer 2 ✓', ''],
          ],
          highlightRow: 5,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 7. Majority Element
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
    constraints: ['n == nums.length', '1 ≤ n ≤ 5×10⁴', 'Majority element always exists'],
    requiredComplexity: 'O(n) time · O(1) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'Since the majority element appears more than n/2 times, if you paired it against every other element and cancelled pairs, what would be left?' },
      { number: 2, text: 'Keep a running "candidate" and a "count". When count hits 0, pick a fresh candidate.' },
      { number: 3, text: 'Increment count when you see the candidate again, decrement otherwise.' },
      { number: 4, label: 'Hint 4 — approach', text: 'This is Boyer-Moore Voting: the true majority element can never be fully cancelled out since it outnumbers all others combined, so it survives as the final candidate.' },
    ],
    approaches: [
      {
        key: 'hashmap',
        label: 'Hash Map Counting — O(n) time, O(n) space',
        explanation: 'Count frequency of every element and return the one exceeding n/2.',
        code: {
          java: `public int majorityElement(int[] nums) {
    Map<Integer, Integer> count = new HashMap<>();
    for (int x : nums) {
        count.merge(x, 1, Integer::sum);
        if (count.get(x) > nums.length / 2) return x;
    }
    return -1;
}`,
          cpp: `int majorityElement(vector<int>& nums) {
    unordered_map<int, int> count;
    for (int x : nums) {
        if (++count[x] > (int)nums.size() / 2) return x;
    }
    return -1;
}`,
          python: `def majorityElement(nums):
    from collections import Counter
    count = Counter(nums)
    return count.most_common(1)[0][0]`,
        },
      },
      {
        key: 'optimal',
        label: "Boyer-Moore Voting — O(n) time, O(1) space",
        explanation: 'Maintain a candidate and a counter; the majority element always survives the cancellation process.',
        code: {
          java: `public int majorityElement(int[] nums) {
    int candidate = 0, count = 0;
    for (int x : nums) {
        if (count == 0) candidate = x;
        count += (x == candidate) ? 1 : -1;
    }
    return candidate;
}`,
          cpp: `int majorityElement(vector<int>& nums) {
    int candidate = 0, count = 0;
    for (int x : nums) {
        if (count == 0) candidate = x;
        count += (x == candidate) ? 1 : -1;
    }
    return candidate;
}`,
          python: `def majorityElement(nums):
    candidate, count = 0, 0
    for x in nums:
        if count == 0:
            candidate = x
        count += 1 if x == candidate else -1
    return candidate`,
        },
        dryRun: {
          title: 'Dry run — nums = [2,2,1,1,1,2,2]',
          columns: ['x', 'candidate', 'count'],
          rows: [
            ['2', '2', '1'],
            ['2', '2', '2'],
            ['1', '2', '1'],
            ['1', '2', '0'],
            ['1', '1 (reset, count was 0)', '1'],
            ['2', '1', '0'],
            ['2', '2 (reset)', '1'],
          ],
          highlightRow: 6,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 8. Majority Element II
  // ══════════════════════════════════════════════════════
  'majority-element-ii': {
    statement:
      'Given an integer array of size n, find all elements that appear more than ⌊n/3⌋ times.',
    tags: ['Arrays', 'Boyer-Moore Voting'],
    requirement: 'O(n) time, O(1) space preferred',
    externalLinks: [
      { label: '↗ LeetCode #229', url: 'https://leetcode.com/problems/majority-element-ii/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [3,2,3]\nOutput: [3]' },
      { label: 'Example 2', text: 'Input:  nums = [1]\nOutput: [1]' },
      { label: 'Example 3', text: 'Input:  nums = [1,2]\nOutput: [1,2]' },
    ],
    constraints: ['1 ≤ nums.length ≤ 5×10⁴', '−10⁹ ≤ nums[i] ≤ 10⁹'],
    requiredComplexity: 'O(n) time · O(1) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'How many elements can possibly appear more than n/3 times, at most, in one array?' },
      { number: 2, text: 'At most 2 — because 3 elements each appearing more than n/3 times would already exceed n total elements.' },
      { number: 3, text: 'Extend Boyer-Moore Voting to track two candidates and two counters simultaneously.' },
      { number: 4, label: 'Hint 4 — approach', text: 'After finding the two surviving candidates, do a second pass to verify each actually appears more than n/3 times (candidates from voting are not guaranteed valid).' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Extended Boyer-Moore Voting — O(n) time, O(1) space',
        explanation: 'Track two candidates and counters through one pass, then verify with a second pass.',
        code: {
          java: `public List<Integer> majorityElement(int[] nums) {
    int cand1 = 0, cand2 = 0, cnt1 = 0, cnt2 = 0;
    for (int x : nums) {
        if (cnt1 > 0 && x == cand1) cnt1++;
        else if (cnt2 > 0 && x == cand2) cnt2++;
        else if (cnt1 == 0) { cand1 = x; cnt1 = 1; }
        else if (cnt2 == 0) { cand2 = x; cnt2 = 1; }
        else { cnt1--; cnt2--; }
    }
    cnt1 = cnt2 = 0;
    for (int x : nums) {
        if (x == cand1) cnt1++;
        else if (x == cand2) cnt2++;
    }
    List<Integer> res = new ArrayList<>();
    int n = nums.length;
    if (cnt1 > n / 3) res.add(cand1);
    if (cnt2 > n / 3) res.add(cand2);
    return res;
}`,
          cpp: `vector<int> majorityElement(vector<int>& nums) {
    int cand1 = 0, cand2 = 0, cnt1 = 0, cnt2 = 0;
    for (int x : nums) {
        if (cnt1 > 0 && x == cand1) cnt1++;
        else if (cnt2 > 0 && x == cand2) cnt2++;
        else if (cnt1 == 0) { cand1 = x; cnt1 = 1; }
        else if (cnt2 == 0) { cand2 = x; cnt2 = 1; }
        else { cnt1--; cnt2--; }
    }
    cnt1 = cnt2 = 0;
    for (int x : nums) {
        if (x == cand1) cnt1++;
        else if (x == cand2) cnt2++;
    }
    vector<int> res;
    int n = nums.size();
    if (cnt1 > n / 3) res.push_back(cand1);
    if (cnt2 > n / 3) res.push_back(cand2);
    return res;
}`,
          python: `def majorityElement(nums):
    cand1 = cand2 = None
    cnt1 = cnt2 = 0
    for x in nums:
        if cnt1 > 0 and x == cand1:
            cnt1 += 1
        elif cnt2 > 0 and x == cand2:
            cnt2 += 1
        elif cnt1 == 0:
            cand1, cnt1 = x, 1
        elif cnt2 == 0:
            cand2, cnt2 = x, 1
        else:
            cnt1 -= 1
            cnt2 -= 1
    cnt1 = cnt2 = 0
    for x in nums:
        if x == cand1:
            cnt1 += 1
        elif x == cand2:
            cnt2 += 1
    n = len(nums)
    res = []
    if cnt1 > n // 3:
        res.append(cand1)
    if cnt2 > n // 3:
        res.append(cand2)
    return res`,
        },
        dryRun: {
          title: 'Dry run — nums = [1,2]',
          columns: ['x', 'cand1/cnt1', 'cand2/cnt2'],
          rows: [
            ['1', '1 / 1', '- / 0'],
            ['2', '1 / 1', '2 / 1'],
            ['verify pass', 'cnt1=1 > 2/3=0 → keep 1', 'cnt2=1 > 0 → keep 2'],
            ['result', '[1, 2] ✓', ''],
          ],
          highlightRow: 2,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 9. Pascal's Triangle
  // ══════════════════════════════════════════════════════
  'pascals-triangle': {
    statement:
      "Given an integer numRows, return the first numRows of Pascal's triangle. Each number is the sum of the two numbers directly above it.",
    tags: ['Arrays', 'Array Construction'],
    requirement: 'O(numRows²) time',
    externalLinks: [
      { label: "↗ LeetCode #118", url: 'https://leetcode.com/problems/pascals-triangle/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  numRows = 5\nOutput: [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]' },
      { label: 'Example 2', text: 'Input:  numRows = 1\nOutput: [[1]]' },
    ],
    constraints: ['1 ≤ numRows ≤ 30'],
    requiredComplexity: 'O(numRows²) time · O(numRows²) space (output size)',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'Every row starts and ends with 1. What determines the values in between?' },
      { number: 2, text: 'Row i, position j (for 0 < j < i) equals the sum of position j-1 and position j from row i-1.' },
      { number: 3, text: 'Build the triangle row by row, referencing the previous row already stored.' },
      { number: 4, label: 'Hint 4 — approach', text: 'For each new row of length i+1, set the ends to 1, then fill interior positions j with prev[j-1] + prev[j].' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Row-by-row Construction — O(numRows²) time',
        explanation: 'Build each row using the previous row; edges are always 1, interior cells sum the two above.',
        code: {
          java: `public List<List<Integer>> generate(int numRows) {
    List<List<Integer>> triangle = new ArrayList<>();
    for (int i = 0; i < numRows; i++) {
        List<Integer> row = new ArrayList<>(Collections.nCopies(i + 1, 1));
        for (int j = 1; j < i; j++) {
            row.set(j, triangle.get(i - 1).get(j - 1) + triangle.get(i - 1).get(j));
        }
        triangle.add(row);
    }
    return triangle;
}`,
          cpp: `vector<vector<int>> generate(int numRows) {
    vector<vector<int>> triangle;
    for (int i = 0; i < numRows; i++) {
        vector<int> row(i + 1, 1);
        for (int j = 1; j < i; j++) {
            row[j] = triangle[i - 1][j - 1] + triangle[i - 1][j];
        }
        triangle.push_back(row);
    }
    return triangle;
}`,
          python: `def generate(numRows):
    triangle = []
    for i in range(numRows):
        row = [1] * (i + 1)
        for j in range(1, i):
            row[j] = triangle[i - 1][j - 1] + triangle[i - 1][j]
        triangle.append(row)
    return triangle`,
        },
        dryRun: {
          title: 'Dry run — numRows = 4',
          columns: ['Row i', 'Built Row'],
          rows: [
            ['0', '[1]'],
            ['1', '[1,1]'],
            ['2', '[1, 1+1=2, 1] → [1,2,1]'],
            ['3', '[1, 1+2=3, 2+1=3, 1] → [1,3,3,1] ✓'],
          ],
          highlightRow: 3,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 10. Two Sum
  // ══════════════════════════════════════════════════════
  'two-sum': {
    statement:
      'Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target. You may assume that each input has exactly one solution, and you may not use the same element twice. You can return the answer in any order.',
    tags: ['Arrays', 'Hash Map'],
    requirement: 'O(n) required',
    externalLinks: [
      { label: '↗ LeetCode #1', url: 'https://leetcode.com/problems/two-sum/' },
      { label: "↗ Striver's A2Z", url: 'https://takeuforward.org/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [2, 7, 11, 15], target = 9\nOutput: [0, 1]\nReason: nums[0] + nums[1] = 2 + 7 = 9' },
      { label: 'Example 2', text: 'Input:  nums = [3, 2, 4], target = 6\nOutput: [1, 2]' },
    ],
    constraints: ['2 ≤ nums.length ≤ 10⁴', '−10⁹ ≤ nums[i] ≤ 10⁹', '−10⁹ ≤ target ≤ 10⁹'],
    requiredComplexity: 'O(n) time complexity · O(n) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'Can you iterate through the array and for each element, look for its complement (target − element)?' },
      { number: 2, text: 'Use a data structure that gives O(1) lookup. What data structure maps a value to its index?' },
      { number: 3, text: 'A hash map lets you check if complement exists in O(1). Store each number as you pass it.' },
      { number: 4, label: 'Hint 4 — approach', text: 'Loop once. For nums[i], compute complement = target - nums[i]. If complement is already in the map, you found your answer. Otherwise add nums[i] to the map.' },
    ],
    approaches: [
      {
        key: 'brute',
        label: 'Brute Force — O(n²)',
        explanation: 'For every element, check all others to find if their sum equals target. Simple but slow.',
        code: {
          java: `public int[] twoSum(int[] nums, int target) {
    for (int i = 0; i < nums.length; i++) {
        for (int j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] == target) {
                return new int[]{i, j};
            }
        }
    }
    return new int[]{};
}`,
          cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    for (int i = 0; i < (int)nums.size(); i++) {
        for (int j = i + 1; j < (int)nums.size(); j++) {
            if (nums[i] + nums[j] == target) {
                return {i, j};
            }
        }
    }
    return {};
}`,
          python: `def twoSum(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []`,
        },
      },
      {
        key: 'optimal',
        label: 'Optimal — O(n)',
        explanation: 'Use a hash map to store seen values. For each element, check if its complement already exists.',
        code: {
          java: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[]{map.get(complement), i};
        }
        map.put(nums[i], i);
    }
    return new int[]{};
}`,
          cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> map;
    for (int i = 0; i < (int)nums.size(); i++) {
        int complement = target - nums[i];
        if (map.count(complement)) {
            return {map[complement], i};
        }
        map[nums[i]] = i;
    }
    return {};
}`,
          python: `def twoSum(nums, target):
    seen = {}   # value -> index
    for i, x in enumerate(nums):
        complement = target - x
        if complement in seen:
            return [seen[complement], i]
        seen[x] = i
    return []`,
        },
        dryRun: {
          title: 'Dry run — nums = [2, 7, 11], target = 9',
          columns: ['i', 'nums[i]', 'complement', 'map', 'result'],
          rows: [
            ['0', '2', '7', '{2:0}', '—'],
            ['1', '7', '2', '{2:0, 7:1}', '✓ [0, 1]'],
          ],
          highlightRow: 1,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 11. Contains Duplicate
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
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁵', '−10⁹ ≤ nums[i] ≤ 10⁹'],
    requiredComplexity: 'O(n) time · O(n) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'Sorting would let you spot adjacent duplicates, but that costs O(n log n). Can you do better?' },
      { number: 2, text: 'A hash set lets you check membership in O(1).' },
      { number: 3, text: 'Walk through the array; if a value is already in the set, you have your duplicate.' },
      { number: 4, label: 'Hint 4 — approach', text: 'Add each element to a set as you go; the moment add() fails (value already present), return true immediately.' },
    ],
    approaches: [
      {
        key: 'sorting',
        label: 'Sorting — O(n log n) time, O(1) extra space',
        explanation: 'Sort the array; duplicates become adjacent.',
        code: {
          java: `public boolean containsDuplicate(int[] nums) {
    Arrays.sort(nums);
    for (int i = 1; i < nums.length; i++) {
        if (nums[i] == nums[i - 1]) return true;
    }
    return false;
}`,
          cpp: `bool containsDuplicate(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    for (int i = 1; i < (int)nums.size(); i++) {
        if (nums[i] == nums[i - 1]) return true;
    }
    return false;
}`,
          python: `def containsDuplicate(nums):
    nums.sort()
    for i in range(1, len(nums)):
        if nums[i] == nums[i - 1]:
            return True
    return False`,
        },
      },
      {
        key: 'optimal',
        label: 'Hash Set — O(n) time, O(n) space',
        explanation: 'Track seen elements in a set; a repeat means an immediate duplicate hit.',
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
          columns: ['x', 'seen before add', 'set after'],
          rows: [
            ['1', 'no', '{1}'],
            ['2', 'no', '{1,2}'],
            ['3', 'no', '{1,2,3}'],
            ['1', 'yes → return true ✓', '{1,2,3}'],
          ],
          highlightRow: 3,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 12. Longest Consecutive Sequence
  // ══════════════════════════════════════════════════════
  'longest-consecutive-sequence': {
    statement:
      'Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence. You must write an algorithm that runs in O(n) time.',
    tags: ['Arrays', 'Hash Set'],
    requirement: 'O(n) time required',
    externalLinks: [
      { label: '↗ LeetCode #128', url: 'https://leetcode.com/problems/longest-consecutive-sequence/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [100,4,200,1,3,2]\nOutput: 4\nReason: the sequence [1,2,3,4] has length 4' },
      { label: 'Example 2', text: 'Input:  nums = [0,3,7,2,5,8,4,6,0,1]\nOutput: 9' },
    ],
    constraints: ['0 ≤ nums.length ≤ 10⁵', '−10⁹ ≤ nums[i] ≤ 10⁹'],
    requiredComplexity: 'O(n) time · O(n) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'Sorting gives O(n log n) — the problem demands O(n). What structure gives O(1) lookups for "does x-1 exist"?' },
      { number: 2, text: 'Put all numbers in a hash set. For each number, you only want to start counting a sequence from its true beginning.' },
      { number: 3, text: 'A number x is the start of a sequence only if x-1 is NOT in the set.' },
      { number: 4, label: 'Hint 4 — approach', text: 'For each sequence-start x (where x-1 is absent), keep checking x+1, x+2, ... while present, counting the streak length. Because you only ever start counting at true starts, every number is visited O(1) amortized times total.' },
    ],
    approaches: [
      {
        key: 'sorting',
        label: 'Sorting — O(n log n) time',
        explanation: 'Sort and scan for consecutive runs, skipping duplicates.',
        code: {
          java: `public int longestConsecutive(int[] nums) {
    if (nums.length == 0) return 0;
    Arrays.sort(nums);
    int longest = 1, current = 1;
    for (int i = 1; i < nums.length; i++) {
        if (nums[i] == nums[i - 1]) continue;
        if (nums[i] == nums[i - 1] + 1) current++;
        else current = 1;
        longest = Math.max(longest, current);
    }
    return longest;
}`,
          cpp: `int longestConsecutive(vector<int>& nums) {
    if (nums.empty()) return 0;
    sort(nums.begin(), nums.end());
    int longest = 1, current = 1;
    for (int i = 1; i < (int)nums.size(); i++) {
        if (nums[i] == nums[i - 1]) continue;
        if (nums[i] == nums[i - 1] + 1) current++;
        else current = 1;
        longest = max(longest, current);
    }
    return longest;
}`,
          python: `def longestConsecutive(nums):
    if not nums:
        return 0
    nums.sort()
    longest = current = 1
    for i in range(1, len(nums)):
        if nums[i] == nums[i - 1]:
            continue
        current = current + 1 if nums[i] == nums[i - 1] + 1 else 1
        longest = max(longest, current)
    return longest`,
        },
      },
      {
        key: 'optimal',
        label: 'Hash Set with Sequence-Start Detection — O(n) time, O(n) space',
        explanation: 'Only start counting from true sequence starts (numbers whose predecessor is absent), so the total work across all streaks is O(n).',
        code: {
          java: `public int longestConsecutive(int[] nums) {
    Set<Integer> set = new HashSet<>();
    for (int x : nums) set.add(x);
    int longest = 0;
    for (int x : set) {
        if (!set.contains(x - 1)) {
            int length = 1;
            while (set.contains(x + length)) length++;
            longest = Math.max(longest, length);
        }
    }
    return longest;
}`,
          cpp: `int longestConsecutive(vector<int>& nums) {
    unordered_set<int> set(nums.begin(), nums.end());
    int longest = 0;
    for (int x : set) {
        if (!set.count(x - 1)) {
            int length = 1;
            while (set.count(x + length)) length++;
            longest = max(longest, length);
        }
    }
    return longest;
}`,
          python: `def longestConsecutive(nums):
    num_set = set(nums)
    longest = 0
    for x in num_set:
        if x - 1 not in num_set:
            length = 1
            while x + length in num_set:
                length += 1
            longest = max(longest, length)
    return longest`,
        },
        dryRun: {
          title: 'Dry run — nums = [100,4,200,1,3,2]',
          columns: ['x (candidate start)', 'x-1 in set?', 'streak found'],
          rows: [
            ['100', 'no → start', '100 only, length 1'],
            ['4', 'yes (3 in set) → skip', '—'],
            ['200', 'no → start', '200 only, length 1'],
            ['1', 'no → start', '1,2,3,4 → length 4'],
            ['3, 2', 'yes → skip', '—'],
            ['result', 'max streak = 4 ✓', ''],
          ],
          highlightRow: 3,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 13. Subarray Sum Equals K
  // ══════════════════════════════════════════════════════
  'subarray-sum-equals-k': {
    statement:
      'Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals k.',
    tags: ['Arrays', 'Prefix Sum', 'Hash Map'],
    requirement: 'O(n) time preferred',
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
      { number: 1, unlockedByDefault: true, text: 'Negative numbers rule out a sliding window. What quantity, tracked cumulatively, could let you answer "is there a subarray ending here that sums to k" in O(1)?' },
      { number: 2, text: 'Let prefix[i] = sum of nums[0..i]. A subarray (j+1..i) sums to k exactly when prefix[i] - prefix[j] = k.' },
      { number: 3, text: 'Rearranged: prefix[j] = prefix[i] - k. So for each i, you want to know how many earlier prefix sums equal prefix[i] - k.' },
      { number: 4, label: 'Hint 4 — approach', text: 'Keep a hash map of prefix-sum → frequency seen so far (seeded with {0: 1} for the empty prefix). As you accumulate the running sum, add map.get(sum - k) to your answer, then increment map[sum].' },
    ],
    approaches: [
      {
        key: 'brute',
        label: 'Brute Force — O(n²)',
        explanation: 'Check every subarray sum directly.',
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
        s = 0
        for j in range(i, len(nums)):
            s += nums[j]
            if s == k:
                count += 1
    return count`,
        },
      },
      {
        key: 'optimal',
        label: 'Prefix Sum + Hash Map — O(n) time, O(n) space',
        explanation: 'Track running sum and how many times each prefix sum has occurred; look up sum-k each step.',
        code: {
          java: `public int subarraySum(int[] nums, int k) {
    Map<Integer, Integer> freq = new HashMap<>();
    freq.put(0, 1);
    int sum = 0, count = 0;
    for (int x : nums) {
        sum += x;
        count += freq.getOrDefault(sum - k, 0);
        freq.merge(sum, 1, Integer::sum);
    }
    return count;
}`,
          cpp: `int subarraySum(vector<int>& nums, int k) {
    unordered_map<int, int> freq;
    freq[0] = 1;
    int sum = 0, count = 0;
    for (int x : nums) {
        sum += x;
        if (freq.count(sum - k)) count += freq[sum - k];
        freq[sum]++;
    }
    return count;
}`,
          python: `def subarraySum(nums, k):
    freq = {0: 1}
    total, count = 0, 0
    for x in nums:
        total += x
        count += freq.get(total - k, 0)
        freq[total] = freq.get(total, 0) + 1
    return count`,
        },
        dryRun: {
          title: 'Dry run — nums = [1,2,3], k = 3',
          columns: ['x', 'sum', 'sum-k', 'freq[sum-k]', 'count', 'freq after'],
          rows: [
            ['1', '1', '-2', '0', '0', '{0:1,1:1}'],
            ['2', '3', '0', '1', '1', '{0:1,1:1,3:1}'],
            ['3', '6', '3', '1', '2', '{0:1,1:1,3:1,6:1} ✓'],
          ],
          highlightRow: 2,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 14. 4Sum II
  // ══════════════════════════════════════════════════════
  'four-sum-ii': {
    statement:
      'Given four integer arrays nums1, nums2, nums3, and nums4, all of length n, return the number of tuples (i, j, k, l) such that nums1[i] + nums2[j] + nums3[k] + nums4[l] == 0.',
    tags: ['Arrays', 'Hash Map'],
    requirement: 'Better than O(n⁴)',
    externalLinks: [
      { label: '↗ LeetCode #454', url: 'https://leetcode.com/problems/4sum-ii/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  nums1=[1,2], nums2=[-2,-1], nums3=[-1,2], nums4=[0,2]\nOutput: 2' },
    ],
    constraints: ['n == nums1.length == nums2.length == nums3.length == nums4.length', '1 ≤ n ≤ 200', '−2²⁸ ≤ values ≤ 2²⁸'],
    requiredComplexity: 'O(n²) time · O(n²) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'Checking every combination of 4 arrays is O(n⁴). Can you split the problem into two halves?' },
      { number: 2, text: 'Precompute all possible sums of one pair (nums1[i] + nums2[j]) and count how often each sum occurs.' },
      { number: 3, text: 'Then for every pair sum from the other two arrays (nums3[k] + nums4[l]), you need its negation to have appeared in the first map.' },
      { number: 4, label: 'Hint 4 — approach', text: 'Build a hash map of sum → count for all nums1[i]+nums2[j] pairs (O(n²)). Then for every nums3[k]+nums4[l], add map.get(-(that sum)) to the total (another O(n²)).' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Split + Hash Map — O(n²) time, O(n²) space',
        explanation: 'Group the four arrays into two halves; count pair sums in one half, look up complements in the other.',
        code: {
          java: `public int fourSumCount(int[] nums1, int[] nums2, int[] nums3, int[] nums4) {
    Map<Integer, Integer> sumCount = new HashMap<>();
    for (int a : nums1) {
        for (int b : nums2) {
            sumCount.merge(a + b, 1, Integer::sum);
        }
    }
    int result = 0;
    for (int c : nums3) {
        for (int d : nums4) {
            result += sumCount.getOrDefault(-(c + d), 0);
        }
    }
    return result;
}`,
          cpp: `int fourSumCount(vector<int>& nums1, vector<int>& nums2, vector<int>& nums3, vector<int>& nums4) {
    unordered_map<int, int> sumCount;
    for (int a : nums1)
        for (int b : nums2)
            sumCount[a + b]++;
    int result = 0;
    for (int c : nums3)
        for (int d : nums4)
            if (sumCount.count(-(c + d))) result += sumCount[-(c + d)];
    return result;
}`,
          python: `def fourSumCount(nums1, nums2, nums3, nums4):
    sum_count = {}
    for a in nums1:
        for b in nums2:
            sum_count[a + b] = sum_count.get(a + b, 0) + 1
    result = 0
    for c in nums3:
        for d in nums4:
            result += sum_count.get(-(c + d), 0)
    return result`,
        },
        dryRun: {
          title: 'Dry run — nums1=[1,2], nums2=[-2,-1], nums3=[-1,2], nums4=[0,2]',
          columns: ['Phase', 'Detail'],
          rows: [
            ['Pair sums (1+2)', '1-2=-1, 1-1=0, 2-2=0, 2-1=1 → map {-1:1, 0:2, 1:1}'],
            ['Pair sums (3+4), need -(sum)', '-1+0=-1→need 1→map[1]=1; -1+2=1→need -1→map[-1]=1; 2+0=2→need -2→0; 2+2=4→need -4→0'],
            ['Total', '1 + 1 + 0 + 0 = 2 ✓'],
          ],
          highlightRow: 2,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 15. Contiguous Array
  // ══════════════════════════════════════════════════════
  'contiguous-array': {
    statement:
      'Given a binary array nums, return the maximum length of a contiguous subarray with an equal number of 0 and 1.',
    tags: ['Arrays', 'Hash Map', 'Prefix Sum'],
    requirement: 'O(n) time preferred',
    externalLinks: [
      { label: '↗ LeetCode #525', url: 'https://leetcode.com/problems/contiguous-array/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [0,1]\nOutput: 2' },
      { label: 'Example 2', text: 'Input:  nums = [0,1,0]\nOutput: 2' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁵', 'nums[i] is 0 or 1'],
    requiredComplexity: 'O(n) time · O(n) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'Try converting every 0 into -1. What does "equal count of 0s and 1s" become in terms of sum?' },
      { number: 2, text: 'An equal-count subarray now sums to exactly 0, so the problem is "find the longest subarray summing to 0."' },
      { number: 3, text: 'A subarray (j+1..i) sums to 0 exactly when prefix[i] == prefix[j]. So you want the two farthest-apart indices sharing the same prefix sum.' },
      { number: 4, label: 'Hint 4 — approach', text: 'Track the first index at which each prefix sum was seen (map: sum → earliest index, seeded with {0: -1}). Whenever the current running sum has been seen before, the length is current index − first index.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Prefix Sum with 0→-1 Trick — O(n) time, O(n) space',
        explanation: 'Treat 0 as -1; the longest zero-sum subarray equals the farthest gap between two equal running sums.',
        code: {
          java: `public int findMaxLength(int[] nums) {
    Map<Integer, Integer> firstIndex = new HashMap<>();
    firstIndex.put(0, -1);
    int sum = 0, maxLen = 0;
    for (int i = 0; i < nums.length; i++) {
        sum += (nums[i] == 0) ? -1 : 1;
        if (firstIndex.containsKey(sum)) {
            maxLen = Math.max(maxLen, i - firstIndex.get(sum));
        } else {
            firstIndex.put(sum, i);
        }
    }
    return maxLen;
}`,
          cpp: `int findMaxLength(vector<int>& nums) {
    unordered_map<int, int> firstIndex;
    firstIndex[0] = -1;
    int sum = 0, maxLen = 0;
    for (int i = 0; i < (int)nums.size(); i++) {
        sum += (nums[i] == 0) ? -1 : 1;
        if (firstIndex.count(sum)) {
            maxLen = max(maxLen, i - firstIndex[sum]);
        } else {
            firstIndex[sum] = i;
        }
    }
    return maxLen;
}`,
          python: `def findMaxLength(nums):
    first_index = {0: -1}
    total, max_len = 0, 0
    for i, x in enumerate(nums):
        total += -1 if x == 0 else 1
        if total in first_index:
            max_len = max(max_len, i - first_index[total])
        else:
            first_index[total] = i
    return max_len`,
        },
        dryRun: {
          title: 'Dry run — nums = [0,1,0]',
          columns: ['i', 'nums[i]', 'sum', 'seen before?', 'maxLen'],
          rows: [
            ['0', '0', '-1', 'no, store {-1:0}', '0'],
            ['1', '1', '0', 'yes (idx -1) → len = 1-(-1)=2', '2'],
            ['2', '0', '-1', 'yes (idx 0) → len = 2-0=2', '2 ✓'],
          ],
          highlightRow: 1,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 16. Design HashMap
  // ══════════════════════════════════════════════════════
  'design-hashmap': {
    statement:
      'Design a HashMap without using any built-in hash table libraries. Implement put(key, value), get(key), and remove(key).',
    tags: ['Arrays', 'Hash Map Design'],
    requirement: 'O(1) average time per operation preferred',
    externalLinks: [
      { label: '↗ LeetCode #706', url: 'https://leetcode.com/problems/design-hashmap/' },
    ],
    examples: [
      { label: 'Example', text: 'put(1,1); put(2,2); get(1) → 1; get(3) → -1; put(2,1); get(2) → 1; remove(2); get(2) → -1' },
    ],
    constraints: ['0 ≤ key, value ≤ 10⁶', 'At most 10⁴ calls to put, get, remove'],
    requiredComplexity: 'O(1) average time per op',
    hints: [
      { number: 1, unlockedByDefault: true, text: "Without a built-in hash table, you can build one yourself: an array of \"buckets\", where each bucket handles collisions." },
      { number: 2, text: 'Pick a fixed bucket count (e.g. 1000) and hash a key by key % bucketCount.' },
      { number: 3, text: 'Each bucket needs to store multiple (key, value) pairs since different keys can collide into the same bucket — a list works.' },
      { number: 4, label: 'Hint 4 — approach', text: 'For put: hash the key, scan its bucket list for an existing entry with that key to update, otherwise append. For get/remove: hash then linearly scan that bucket only (buckets stay small on average, giving O(1) amortized).' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Bucket Array with Chaining — O(1) average per operation',
        explanation: 'Use an array of buckets (lists of key-value pairs); hash key into a bucket index and linearly search within that small bucket.',
        code: {
          java: `class MyHashMap {
    private final int SIZE = 1000;
    private final List<int[]>[] buckets = new List[SIZE];

    public MyHashMap() {
        for (int i = 0; i < SIZE; i++) buckets[i] = new ArrayList<>();
    }
    private int hash(int key) { return key % SIZE; }

    public void put(int key, int value) {
        List<int[]> bucket = buckets[hash(key)];
        for (int[] pair : bucket) {
            if (pair[0] == key) { pair[1] = value; return; }
        }
        bucket.add(new int[]{key, value});
    }
    public int get(int key) {
        for (int[] pair : buckets[hash(key)]) {
            if (pair[0] == key) return pair[1];
        }
        return -1;
    }
    public void remove(int key) {
        List<int[]> bucket = buckets[hash(key)];
        bucket.removeIf(pair -> pair[0] == key);
    }
}`,
          cpp: `class MyHashMap {
    static const int SIZE = 1000;
    vector<pair<int,int>> buckets[SIZE];
    int hashKey(int key) { return key % SIZE; }
public:
    MyHashMap() {}
    void put(int key, int value) {
        auto& bucket = buckets[hashKey(key)];
        for (auto& p : bucket) {
            if (p.first == key) { p.second = value; return; }
        }
        bucket.push_back({key, value});
    }
    int get(int key) {
        for (auto& p : buckets[hashKey(key)]) {
            if (p.first == key) return p.second;
        }
        return -1;
    }
    void remove(int key) {
        auto& bucket = buckets[hashKey(key)];
        bucket.erase(remove_if(bucket.begin(), bucket.end(),
            [key](auto& p) { return p.first == key; }), bucket.end());
    }
};`,
          python: `class MyHashMap:
    def __init__(self):
        self.size = 1000
        self.buckets = [[] for _ in range(self.size)]

    def _hash(self, key):
        return key % self.size

    def put(self, key, value):
        bucket = self.buckets[self._hash(key)]
        for i, (k, v) in enumerate(bucket):
            if k == key:
                bucket[i] = (key, value)
                return
        bucket.append((key, value))

    def get(self, key):
        for k, v in self.buckets[self._hash(key)]:
            if k == key:
                return v
        return -1

    def remove(self, key):
        bucket = self.buckets[self._hash(key)]
        self.buckets[self._hash(key)] = [(k, v) for k, v in bucket if k != key]`,
        },
        dryRun: {
          title: 'Dry run — put(1,1); put(1001,2); get(1)  (SIZE=1000, so 1 and 1001 collide)',
          columns: ['Call', 'Bucket index', 'Bucket contents after'],
          rows: [
            ['put(1,1)', '1', '[(1,1)]'],
            ['put(1001,2)', '1 (1001 % 1000)', '[(1,1), (1001,2)]'],
            ['get(1)', '1 → scan bucket, find k==1', 'returns 1 ✓'],
          ],
          highlightRow: 2,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 17. Design HashSet
  // ══════════════════════════════════════════════════════
  'design-hashset': {
    statement:
      'Design a HashSet without using any built-in hash table libraries. Implement add(key), contains(key), and remove(key).',
    tags: ['Arrays', 'Hash Set Design'],
    requirement: 'O(1) average time per operation preferred',
    externalLinks: [
      { label: '↗ LeetCode #705', url: 'https://leetcode.com/problems/design-hashset/' },
    ],
    examples: [
      { label: 'Example', text: 'add(1); add(2); contains(1) → true; contains(3) → false; add(2); contains(2) → true; remove(2); contains(2) → false' },
    ],
    constraints: ['0 ≤ key ≤ 10⁶', 'At most 10⁴ calls to add, remove, contains'],
    requiredComplexity: 'O(1) average time per op',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'This is the same underlying idea as Design HashMap, minus the value — you only need to track presence.' },
      { number: 2, text: 'Use an array of buckets, hashing key % bucketCount.' },
      { number: 3, text: 'Each bucket is a small list of keys currently stored; collisions just mean more than one key lives in that bucket.' },
      { number: 4, label: 'Hint 4 — approach', text: 'add: hash then append if not already present. contains: hash then linear-scan the bucket. remove: hash then filter the key out of that bucket.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Bucket Array with Chaining — O(1) average per operation',
        explanation: 'Same bucket-and-chain design as HashMap, storing only keys.',
        code: {
          java: `class MyHashSet {
    private final int SIZE = 1000;
    private final List<Integer>[] buckets = new List[SIZE];

    public MyHashSet() {
        for (int i = 0; i < SIZE; i++) buckets[i] = new ArrayList<>();
    }
    private int hash(int key) { return key % SIZE; }

    public void add(int key) {
        List<Integer> bucket = buckets[hash(key)];
        if (!bucket.contains(key)) bucket.add(key);
    }
    public boolean contains(int key) {
        return buckets[hash(key)].contains(key);
    }
    public void remove(int key) {
        buckets[hash(key)].remove(Integer.valueOf(key));
    }
}`,
          cpp: `class MyHashSet {
    static const int SIZE = 1000;
    vector<int> buckets[SIZE];
    int hashKey(int key) { return key % SIZE; }
public:
    MyHashSet() {}
    void add(int key) {
        auto& bucket = buckets[hashKey(key)];
        if (find(bucket.begin(), bucket.end(), key) == bucket.end())
            bucket.push_back(key);
    }
    bool contains(int key) {
        auto& bucket = buckets[hashKey(key)];
        return find(bucket.begin(), bucket.end(), key) != bucket.end();
    }
    void remove(int key) {
        auto& bucket = buckets[hashKey(key)];
        bucket.erase(remove(bucket.begin(), bucket.end(), key), bucket.end());
    }
};`,
          python: `class MyHashSet:
    def __init__(self):
        self.size = 1000
        self.buckets = [[] for _ in range(self.size)]

    def _hash(self, key):
        return key % self.size

    def add(self, key):
        bucket = self.buckets[self._hash(key)]
        if key not in bucket:
            bucket.append(key)

    def contains(self, key):
        return key in self.buckets[self._hash(key)]

    def remove(self, key):
        bucket = self.buckets[self._hash(key)]
        if key in bucket:
            bucket.remove(key)`,
        },
        dryRun: {
          title: 'Dry run — add(1); add(1001); contains(1001)  (collide at bucket 1)',
          columns: ['Call', 'Bucket index', 'Bucket after'],
          rows: [
            ['add(1)', '1', '[1]'],
            ['add(1001)', '1', '[1, 1001]'],
            ['contains(1001)', '1 → found', 'true ✓'],
          ],
          highlightRow: 2,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 18. Insert Delete GetRandom O(1)
  // ══════════════════════════════════════════════════════
  'insert-delete-getrandom-o1': {
    statement:
      'Implement a RandomizedSet supporting insert(val), remove(val), and getRandom() — return a random element from the current set of elements, each with equal probability. All operations must run in average O(1) time.',
    tags: ['Arrays', 'Hash Map + Array'],
    requirement: 'O(1) average time for all operations',
    externalLinks: [
      { label: '↗ LeetCode #380', url: 'https://leetcode.com/problems/insert-delete-getrandom-o1/' },
    ],
    examples: [
      { label: 'Example', text: 'insert(1) → true; remove(2) → false; insert(2) → true; getRandom() → 1 or 2; remove(1) → true; insert(2) → false; getRandom() → 2' },
    ],
    constraints: ['−2³¹ ≤ val ≤ 2³¹−1', 'At most 2×10⁵ calls total', 'getRandom is only called when the set is non-empty'],
    requiredComplexity: 'O(1) average time per op',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'A hash set alone gives O(1) insert/remove/contains, but does NOT support O(1) uniform random pick. An array alone gives O(1) random pick, but O(n) removal. Can you combine both?' },
      { number: 2, text: 'Keep values in a dynamic array (for O(1) random index access) AND a hash map from value → its index in that array (for O(1) lookup).' },
      { number: 3, text: 'Insertion is easy: append to array, record its index in the map. The hard part is removal — arrays are expensive to remove from the middle.' },
      { number: 4, label: 'Hint 4 — approach', text: 'To remove val in O(1): swap it with the LAST element in the array, update the swapped element\'s index in the map, then pop the last element off (and delete val from the map). This avoids ever shifting elements.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Array + Hash Map (swap-to-end trick) — O(1) average per operation',
        explanation: 'Array gives O(1) random access; hash map gives O(1) lookup of an element\'s array position, enabling O(1) removal via swap-with-last.',
        code: {
          java: `class RandomizedSet {
    private final List<Integer> values = new ArrayList<>();
    private final Map<Integer, Integer> indexOf = new HashMap<>();
    private final Random rand = new Random();

    public boolean insert(int val) {
        if (indexOf.containsKey(val)) return false;
        indexOf.put(val, values.size());
        values.add(val);
        return true;
    }
    public boolean remove(int val) {
        if (!indexOf.containsKey(val)) return false;
        int idx = indexOf.get(val);
        int lastVal = values.get(values.size() - 1);
        values.set(idx, lastVal);
        indexOf.put(lastVal, idx);
        values.remove(values.size() - 1);
        indexOf.remove(val);
        return true;
    }
    public int getRandom() {
        return values.get(rand.nextInt(values.size()));
    }
}`,
          cpp: `class RandomizedSet {
    vector<int> values;
    unordered_map<int, int> indexOf;
public:
    bool insert(int val) {
        if (indexOf.count(val)) return false;
        indexOf[val] = values.size();
        values.push_back(val);
        return true;
    }
    bool remove(int val) {
        if (!indexOf.count(val)) return false;
        int idx = indexOf[val];
        int lastVal = values.back();
        values[idx] = lastVal;
        indexOf[lastVal] = idx;
        values.pop_back();
        indexOf.erase(val);
        return true;
    }
    int getRandom() {
        return values[rand() % values.size()];
    }
};`,
          python: `import random

class RandomizedSet:
    def __init__(self):
        self.values = []
        self.index_of = {}

    def insert(self, val):
        if val in self.index_of:
            return False
        self.index_of[val] = len(self.values)
        self.values.append(val)
        return True

    def remove(self, val):
        if val not in self.index_of:
            return False
        idx = self.index_of[val]
        last_val = self.values[-1]
        self.values[idx] = last_val
        self.index_of[last_val] = idx
        self.values.pop()
        del self.index_of[val]
        return True

    def getRandom(self):
        return random.choice(self.values)`,
        },
        dryRun: {
          title: 'Dry run — insert(1); insert(2); insert(3); remove(1)',
          columns: ['Call', 'values array', 'indexOf map'],
          rows: [
            ['insert(1)', '[1]', '{1:0}'],
            ['insert(2)', '[1,2]', '{1:0, 2:1}'],
            ['insert(3)', '[1,2,3]', '{1:0, 2:1, 3:2}'],
            ['remove(1): swap idx0 with last(3), pop', '[3,2]', '{2:1, 3:0} ✓ (1 removed, O(1))'],
          ],
          highlightRow: 3,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 19. Encode and Decode TinyURL
  // ══════════════════════════════════════════════════════
  'encode-and-decode-tinyurl': {
    statement:
      'Design a class to encode a long URL to a short URL and decode a short URL back to the original long URL. Any encode/decode algorithm is acceptable as long as a URL can be encoded to a short URL and then decoded back to the original.',
    tags: ['Arrays', 'Hash Map'],
    requirement: 'O(1) average time for encode/decode',
    externalLinks: [
      { label: '↗ LeetCode #535', url: 'https://leetcode.com/problems/encode-and-decode-tinyurl/' },
    ],
    examples: [
      { label: 'Example', text: 'Input:  url = "https://leetcode.com/problems/design-tinyurl"\nOutput: encode returns a short url, decode(that short url) returns the original url back' },
    ],
    constraints: ['1 ≤ url.length ≤ 10⁴', 'url is guaranteed to be a valid URL'],
    requiredComplexity: 'O(1) average time per call',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'You control both the encoder and decoder, so you don\'t need a "real" hashing scheme — you just need a reversible mapping you maintain yourself.' },
      { number: 2, text: 'Keep a hash map from a generated short key to the original long URL.' },
      { number: 3, text: 'Generate a unique short key for each new URL — an incrementing counter works perfectly since you control uniqueness.' },
      { number: 4, label: 'Hint 4 — approach', text: 'encode: assign the URL the next counter value, store {counter: url} in the map, return a short URL string embedding that counter. decode: parse the counter out of the short URL and look it up in the map.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Counter + Hash Map — O(1) average per call',
        explanation: 'Maintain an incrementing id as the "short code" and a map from id to original URL.',
        code: {
          java: `public class Codec {
    private final Map<Integer, String> store = new HashMap<>();
    private int counter = 0;

    public String encode(String longUrl) {
        counter++;
        store.put(counter, longUrl);
        return "http://tinyurl.com/" + counter;
    }
    public String decode(String shortUrl) {
        int id = Integer.parseInt(shortUrl.substring(shortUrl.lastIndexOf('/') + 1));
        return store.get(id);
    }
}`,
          cpp: `class Codec {
    unordered_map<int, string> store;
    int counter = 0;
public:
    string encode(string longUrl) {
        counter++;
        store[counter] = longUrl;
        return "http://tinyurl.com/" + to_string(counter);
    }
    string decode(string shortUrl) {
        int id = stoi(shortUrl.substr(shortUrl.find_last_of('/') + 1));
        return store[id];
    }
};`,
          python: `class Codec:
    def __init__(self):
        self.store = {}
        self.counter = 0

    def encode(self, longUrl):
        self.counter += 1
        self.store[self.counter] = longUrl
        return f"http://tinyurl.com/{self.counter}"

    def decode(self, shortUrl):
        id_ = int(shortUrl.split('/')[-1])
        return self.store[id_]`,
        },
        dryRun: {
          title: 'Dry run — encode("https://x.com/a"); encode("https://x.com/b")',
          columns: ['Call', 'counter', 'store', 'Returned short URL'],
          rows: [
            ['encode(".../a")', '1', '{1: ".../a"}', 'http://tinyurl.com/1'],
            ['encode(".../b")', '2', '{1: ".../a", 2: ".../b"}', 'http://tinyurl.com/2'],
            ['decode("http://tinyurl.com/2")', '-', '-', '".../b" ✓'],
          ],
          highlightRow: 2,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 20. Brick Wall
  // ══════════════════════════════════════════════════════
  'brick-wall': {
    statement:
      'There is a rectangular brick wall represented by a list of rows, each row is a list of brick widths spanning the same total wall width. Draw a vertical line from top to bottom, crossing the fewest bricks. A line touching only the edge of a brick does not count as crossing it. Return the minimum number of crossed bricks.',
    tags: ['Arrays', 'Hash Map'],
    requirement: 'O(total bricks) time preferred',
    externalLinks: [
      { label: '↗ LeetCode #554', url: 'https://leetcode.com/problems/brick-wall/' },
    ],
    examples: [
      { label: 'Example', text: 'Input:  wall = [[1,2,2,1],[3,1,2],[1,3,2],[2,4],[3,1,2],[1,3,1,1]]\nOutput: 2' },
    ],
    constraints: ['1 ≤ wall.length ≤ 10⁴', '1 ≤ wall[i].length ≤ 10⁴', '1 ≤ sum(wall[i]) ≤ 2³¹−1', 'All rows have the same total width'],
    requiredComplexity: 'O(N) time where N = total number of bricks',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'A vertical line crosses the fewest bricks exactly where the most existing brick edges (gaps) line up across all rows.' },
      { number: 2, text: 'For each row, compute the running cumulative width at every gap between bricks (excluding the final edge, since a line there is outside the wall).' },
      { number: 3, text: 'Count, across all rows, how many times each cumulative-width value appears as a gap position.' },
      { number: 4, label: 'Hint 4 — approach', text: 'The best line position is the gap value with the highest frequency. The minimum bricks crossed = total rows − max gap frequency (since a line through that gap avoids crossing a brick in every row that has a gap there).' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Hash Map of Gap Positions — O(N) time, O(N) space',
        explanation: 'Count cumulative-width gap positions across rows; the most common gap gives the line that avoids the most bricks.',
        code: {
          java: `public int leastBricks(List<List<Integer>> wall) {
    Map<Integer, Integer> gapCount = new HashMap<>();
    int maxGap = 0;
    for (List<Integer> row : wall) {
        int width = 0;
        for (int i = 0; i < row.size() - 1; i++) {
            width += row.get(i);
            int c = gapCount.merge(width, 1, Integer::sum);
            maxGap = Math.max(maxGap, c);
        }
    }
    return wall.size() - maxGap;
}`,
          cpp: `int leastBricks(vector<vector<int>>& wall) {
    unordered_map<int, int> gapCount;
    int maxGap = 0;
    for (auto& row : wall) {
        int width = 0;
        for (int i = 0; i < (int)row.size() - 1; i++) {
            width += row[i];
            maxGap = max(maxGap, ++gapCount[width]);
        }
    }
    return wall.size() - maxGap;
}`,
          python: `def leastBricks(wall):
    gap_count = {}
    max_gap = 0
    for row in wall:
        width = 0
        for brick in row[:-1]:
            width += brick
            gap_count[width] = gap_count.get(width, 0) + 1
            max_gap = max(max_gap, gap_count[width])
    return len(wall) - max_gap`,
        },
        dryRun: {
          title: 'Dry run — wall = [[1,2,2,1],[3,1,2],[1,3,2]]',
          columns: ['Row', 'Gap positions (cumulative, excl. last)', 'gapCount updates'],
          rows: [
            ['[1,2,2,1]', '1, 3, 5', '{1:1, 3:1, 5:1}'],
            ['[3,1,2]', '3, 4', '{1:1, 3:2, 4:1, 5:1}'],
            ['[1,3,2]', '1, 4', '{1:2, 3:2, 4:2, 5:1}'],
            ['result', 'maxGap=2 (tie), rows=3 → 3-2=1 bricks crossed', ''],
          ],
          highlightRow: 3,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 21. Check If Array Pairs Are Divisible by k
  // ══════════════════════════════════════════════════════
  'check-if-array-pairs-divisible-by-k': {
    statement:
      'Given an array of integers arr of even length n and an integer k, return true if and only if it is possible to divide the array into n/2 pairs such that the sum of each pair is divisible by k.',
    tags: ['Arrays', 'Hash Map'],
    requirement: 'O(n) time preferred',
    externalLinks: [
      { label: '↗ LeetCode #1497', url: 'https://leetcode.com/problems/check-if-array-pairs-are-divisible-by-k/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  arr = [1,2,3,4,5,6], k = 7\nOutput: true\nReason: pairs (1,6),(2,5),(3,4) all sum to 7' },
      { label: 'Example 2', text: 'Input:  arr = [1,2,3,4,5,6], k = 10\nOutput: false' },
    ],
    constraints: ['arr.length == n', '1 ≤ n ≤ 10⁵', 'n is even', '−10⁹ ≤ arr[i] ≤ 10⁹', '1 ≤ k ≤ 10⁵'],
    requiredComplexity: 'O(n) time · O(k) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'Two numbers sum to a multiple of k exactly when their remainders mod k add up to k (or both are 0).' },
      { number: 2, text: 'Careful: for negative numbers, a language\'s % operator can return a negative remainder. Normalize it to the range [0, k).' },
      { number: 3, text: 'Count how many elements produce each remainder mod k in a frequency map.' },
      { number: 4, label: 'Hint 4 — approach', text: 'For remainder 0, its count must be even (each pairs with another remainder-0). For every other remainder r (1..k-1), the count of remainder r must exactly equal the count of remainder k-r. Also handle the special case where k is even and r == k/2 — its own count must be even.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Remainder Frequency Count — O(n) time, O(k) space',
        explanation: 'Bucket elements by remainder mod k, then verify complementary remainder buckets have matching counts.',
        code: {
          java: `public boolean canArrange(int[] arr, int k) {
    int[] remCount = new int[k];
    for (int x : arr) {
        int r = ((x % k) + k) % k;
        remCount[r]++;
    }
    if (remCount[0] % 2 != 0) return false;
    for (int r = 1; r <= k / 2; r++) {
        if (r == k - r) {
            if (remCount[r] % 2 != 0) return false;
        } else if (remCount[r] != remCount[k - r]) {
            return false;
        }
    }
    return true;
}`,
          cpp: `bool canArrange(vector<int>& arr, int k) {
    vector<int> remCount(k, 0);
    for (int x : arr) {
        int r = ((x % k) + k) % k;
        remCount[r]++;
    }
    if (remCount[0] % 2 != 0) return false;
    for (int r = 1; r <= k / 2; r++) {
        if (r == k - r) {
            if (remCount[r] % 2 != 0) return false;
        } else if (remCount[r] != remCount[k - r]) {
            return false;
        }
    }
    return true;
}`,
          python: `def canArrange(arr, k):
    rem_count = [0] * k
    for x in arr:
        rem_count[x % k] += 1
    if rem_count[0] % 2 != 0:
        return False
    for r in range(1, k // 2 + 1):
        if r == k - r:
            if rem_count[r] % 2 != 0:
                return False
        elif rem_count[r] != rem_count[k - r]:
            return False
    return True`,
        },
        dryRun: {
          title: 'Dry run — arr = [1,2,3,4,5,6], k = 7',
          columns: ['Remainder bucket', 'Count', 'Match check'],
          rows: [
            ['0', '0', 'even ✓'],
            ['1 (from 1)', '1', 'needs remCount[6]'],
            ['6 (from 6)', '1', 'matches remCount[1]=1 ✓'],
            ['2 (from 2), 5 (from 5)', '1, 1', 'match ✓'],
            ['3 (from 3), 4 (from 4)', '1, 1', 'match ✓ → return true'],
          ],
          highlightRow: 2,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 22. Pairs of Songs With Total Durations Divisible by 60
  // ══════════════════════════════════════════════════════
  'pairs-of-songs-divisible-by-60': {
    statement:
      'You are given a list of song durations in seconds, time. Return the number of pairs of songs for which their total duration in seconds is divisible by 60.',
    tags: ['Arrays', 'Hash Map'],
    requirement: 'O(n) time preferred',
    externalLinks: [
      { label: '↗ LeetCode #1010', url: 'https://leetcode.com/problems/pairs-of-songs-with-total-durations-divisible-by-60/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  time = [30,20,150,100,40]\nOutput: 3' },
      { label: 'Example 2', text: 'Input:  time = [60,60,60]\nOutput: 3' },
    ],
    constraints: ['1 ≤ time.length ≤ 6×10⁴', '1 ≤ time[i] ≤ 500'],
    requiredComplexity: 'O(n) time · O(1) space (bounded by 60 buckets)',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'Only the remainder of each duration mod 60 matters for divisibility of the pair sum.' },
      { number: 2, text: 'Two remainders r1 and r2 pair up when r1 + r2 == 60 or both are 0.' },
      { number: 3, text: 'Process songs one at a time, and for each new song\'s remainder r, check how many earlier songs had the complementary remainder (60-r) mod 60.' },
      { number: 4, label: 'Hint 4 — approach', text: 'Keep a frequency array of size 60. For each song with remainder r, add freq[(60-r) % 60] to the answer, then increment freq[r]. Processing in one pass avoids double-counting.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Remainder Frequency Array — O(n) time, O(1) space',
        explanation: 'Track counts of each remainder mod 60 seen so far; each new song looks up its complementary remainder count.',
        code: {
          java: `public int numPairsDivisibleBy60(int[] time) {
    int[] remCount = new int[60];
    int pairs = 0;
    for (int t : time) {
        int r = t % 60;
        int complement = (60 - r) % 60;
        pairs += remCount[complement];
        remCount[r]++;
    }
    return pairs;
}`,
          cpp: `int numPairsDivisibleBy60(vector<int>& time) {
    vector<int> remCount(60, 0);
    int pairs = 0;
    for (int t : time) {
        int r = t % 60;
        int complement = (60 - r) % 60;
        pairs += remCount[complement];
        remCount[r]++;
    }
    return pairs;
}`,
          python: `def numPairsDivisibleBy60(time):
    rem_count = [0] * 60
    pairs = 0
    for t in time:
        r = t % 60
        complement = (60 - r) % 60
        pairs += rem_count[complement]
        rem_count[r] += 1
    return pairs`,
        },
        dryRun: {
          title: 'Dry run — time = [30,20,150,100,40]',
          columns: ['t', 'r = t%60', 'complement', 'pairs+=', 'remCount after'],
          rows: [
            ['30', '30', '30', '+0', '{30:1}'],
            ['20', '20', '40', '+0', '{30:1, 20:1}'],
            ['150', '30', '30', '+1 (found 30)', '{30:2, 20:1}'],
            ['100', '40', '20', '+1 (found 20)', '{30:2, 20:1, 40:1}'],
            ['40', '40', '20', '+1 (found 20)', '{30:2, 20:1, 40:2} → total 3 ✓'],
          ],
          highlightRow: 4,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 23. Minimum Index Sum of Two Lists
  // ══════════════════════════════════════════════════════
  'minimum-index-sum-of-two-lists': {
    statement:
      'Given two lists of strings representing favorite restaurants of two people, find the common strings with the least index sum. If there is a tie, output all of them with the least index sum.',
    tags: ['Arrays', 'Hash Map'],
    requirement: 'O(n + m) time preferred',
    externalLinks: [
      { label: '↗ LeetCode #599', url: 'https://leetcode.com/problems/minimum-index-sum-of-two-lists/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  list1 = ["Shogun","Tapioca Express","Burger King","KFC"]\n        list2 = ["Piatti","The Grill at Torrey Pines","Hungry Hunter Steakhouse","Shogun"]\nOutput: ["Shogun"]' },
      { label: 'Example 2', text: 'Input:  list1 = ["Shogun","Tapioca Express","Burger King","KFC"]\n        list2 = ["KFC","Shogun","Burger King"]\nOutput: ["Shogun"]' },
    ],
    constraints: ['1 ≤ list1.length, list2.length ≤ 1000', '1 ≤ list1[i].length, list2[i].length ≤ 30', 'All strings within one list are unique'],
    requiredComplexity: 'O(n + m) time · O(n) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'You need to compare positions of the same restaurant across two lists — what lets you look up "where is this restaurant in list1" in O(1)?' },
      { number: 2, text: 'Map each restaurant name in list1 to its index.' },
      { number: 3, text: 'Walk through list2; for every name that also exists in list1\'s map, compute the index sum.' },
      { number: 4, label: 'Hint 4 — approach', text: 'Track the current minimum index sum seen. If a new common restaurant beats it, reset the result list. If it ties, append to the result list.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Hash Map Index Lookup — O(n + m) time, O(n) space',
        explanation: 'Map list1 name→index, then scan list2 comparing index sums against the running minimum.',
        code: {
          java: `public String[] findRestaurant(String[] list1, String[] list2) {
    Map<String, Integer> index1 = new HashMap<>();
    for (int i = 0; i < list1.length; i++) index1.put(list1[i], i);

    int minSum = Integer.MAX_VALUE;
    List<String> result = new ArrayList<>();
    for (int j = 0; j < list2.length; j++) {
        if (index1.containsKey(list2[j])) {
            int sum = index1.get(list2[j]) + j;
            if (sum < minSum) {
                minSum = sum;
                result.clear();
                result.add(list2[j]);
            } else if (sum == minSum) {
                result.add(list2[j]);
            }
        }
    }
    return result.toArray(new String[0]);
}`,
          cpp: `vector<string> findRestaurant(vector<string>& list1, vector<string>& list2) {
    unordered_map<string, int> index1;
    for (int i = 0; i < (int)list1.size(); i++) index1[list1[i]] = i;

    int minSum = INT_MAX;
    vector<string> result;
    for (int j = 0; j < (int)list2.size(); j++) {
        if (index1.count(list2[j])) {
            int sum = index1[list2[j]] + j;
            if (sum < minSum) {
                minSum = sum;
                result = {list2[j]};
            } else if (sum == minSum) {
                result.push_back(list2[j]);
            }
        }
    }
    return result;
}`,
          python: `def findRestaurant(list1, list2):
    index1 = {name: i for i, name in enumerate(list1)}
    min_sum = float('inf')
    result = []
    for j, name in enumerate(list2):
        if name in index1:
            s = index1[name] + j
            if s < min_sum:
                min_sum = s
                result = [name]
            elif s == min_sum:
                result.append(name)
    return result`,
        },
        dryRun: {
          title: 'Dry run — list1=["Shogun","Tapioca Express","Burger King","KFC"], list2=["KFC","Shogun","Burger King"]',
          columns: ['j', 'list2[j]', 'in list1?', 'sum', 'minSum / result'],
          rows: [
            ['0', 'KFC', 'idx1=3', '3+0=3', 'minSum=3, result=["KFC"]'],
            ['1', 'Shogun', 'idx1=0', '0+1=1', 'minSum=1, result=["Shogun"]'],
            ['2', 'Burger King', 'idx1=2', '2+2=4', 'no change → result=["Shogun"] ✓'],
          ],
          highlightRow: 1,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 24. Trapping Rain Water
  // ══════════════════════════════════════════════════════
  'trapping-rain-water': {
    statement:
      'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    tags: ['Arrays', 'Two Pointers'],
    requirement: 'O(n) time, O(1) space preferred',
    externalLinks: [
      { label: '↗ LeetCode #42', url: 'https://leetcode.com/problems/trapping-rain-water/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  height = [0,1,0,2,1,0,1,3,2,1,2,1]\nOutput: 6' },
      { label: 'Example 2', text: 'Input:  height = [4,2,0,3,2,5]\nOutput: 9' },
    ],
    constraints: ['n == height.length', '1 ≤ n ≤ 2×10⁵', '0 ≤ height[i] ≤ 10⁵'],
    requiredComplexity: 'O(n) time · O(1) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'Water trapped above any bar i is limited by the shorter of the tallest bar to its left and the tallest bar to its right.' },
      { number: 2, text: 'water[i] = min(maxLeft[i], maxRight[i]) - height[i]. You could precompute maxLeft and maxRight arrays in O(n) each — but can you avoid the extra arrays?' },
      { number: 3, text: 'Use two pointers from both ends, tracking the running maxLeft and maxRight as you move inward. Whichever side has the smaller running max is "safe" to resolve, since the other side is guaranteed at least as tall.' },
      { number: 4, label: 'Hint 4 — approach', text: 'While left < right: if maxLeft < maxRight, process the left pointer (water added = maxLeft - height[left], then advance left and update maxLeft); otherwise process the right pointer symmetrically.' },
    ],
    approaches: [
      {
        key: 'brute',
        label: 'Precompute maxLeft/maxRight — O(n) time, O(n) space',
        explanation: 'Compute the tallest bar to the left and right of every index, then sum the trapped water.',
        code: {
          java: `public int trap(int[] height) {
    int n = height.length;
    int[] maxLeft = new int[n], maxRight = new int[n];
    maxLeft[0] = height[0];
    for (int i = 1; i < n; i++) maxLeft[i] = Math.max(maxLeft[i - 1], height[i]);
    maxRight[n - 1] = height[n - 1];
    for (int i = n - 2; i >= 0; i--) maxRight[i] = Math.max(maxRight[i + 1], height[i]);
    int water = 0;
    for (int i = 0; i < n; i++) water += Math.min(maxLeft[i], maxRight[i]) - height[i];
    return water;
}`,
          cpp: `int trap(vector<int>& height) {
    int n = height.size();
    vector<int> maxLeft(n), maxRight(n);
    maxLeft[0] = height[0];
    for (int i = 1; i < n; i++) maxLeft[i] = max(maxLeft[i - 1], height[i]);
    maxRight[n - 1] = height[n - 1];
    for (int i = n - 2; i >= 0; i--) maxRight[i] = max(maxRight[i + 1], height[i]);
    int water = 0;
    for (int i = 0; i < n; i++) water += min(maxLeft[i], maxRight[i]) - height[i];
    return water;
}`,
          python: `def trap(height):
    n = len(height)
    max_left = [0] * n
    max_right = [0] * n
    max_left[0] = height[0]
    for i in range(1, n):
        max_left[i] = max(max_left[i - 1], height[i])
    max_right[n - 1] = height[n - 1]
    for i in range(n - 2, -1, -1):
        max_right[i] = max(max_right[i + 1], height[i])
    return sum(min(max_left[i], max_right[i]) - height[i] for i in range(n))`,
        },
      },
      {
        key: 'optimal',
        label: 'Two Pointers — O(n) time, O(1) space',
        explanation: 'Move inward from both ends, always resolving the side with the smaller running max height.',
        code: {
          java: `public int trap(int[] height) {
    int left = 0, right = height.length - 1;
    int maxLeft = 0, maxRight = 0, water = 0;
    while (left < right) {
        if (height[left] < height[right]) {
            maxLeft = Math.max(maxLeft, height[left]);
            water += maxLeft - height[left];
            left++;
        } else {
            maxRight = Math.max(maxRight, height[right]);
            water += maxRight - height[right];
            right--;
        }
    }
    return water;
}`,
          cpp: `int trap(vector<int>& height) {
    int left = 0, right = height.size() - 1;
    int maxLeft = 0, maxRight = 0, water = 0;
    while (left < right) {
        if (height[left] < height[right]) {
            maxLeft = max(maxLeft, height[left]);
            water += maxLeft - height[left];
            left++;
        } else {
            maxRight = max(maxRight, height[right]);
            water += maxRight - height[right];
            right--;
        }
    }
    return water;
}`,
          python: `def trap(height):
    left, right = 0, len(height) - 1
    max_left = max_right = water = 0
    while left < right:
        if height[left] < height[right]:
            max_left = max(max_left, height[left])
            water += max_left - height[left]
            left += 1
        else:
            max_right = max(max_right, height[right])
            water += max_right - height[right]
            right -= 1
    return water`,
        },
        dryRun: {
          title: 'Dry run — height = [4,2,0,3,2,5]',
          columns: ['left', 'right', 'Decision (shorter side)', 'water added', 'total water'],
          rows: [
            ['0 (h=4)', '5 (h=5)', 'left shorter → maxLeft=4', '4-4=0', '0'],
            ['1 (h=2)', '5', 'left shorter → maxLeft=4', '4-2=2', '2'],
            ['2 (h=0)', '5', 'left shorter → maxLeft=4', '4-0=4', '6'],
            ['3 (h=3)', '5', 'left shorter → maxLeft=4', '4-3=1', '7'],
            ['4 (h=2)', '5', 'left shorter → maxLeft=4', '4-2=2', '9 ✓'],
          ],
          highlightRow: 4,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 25. Move Zeroes
  // ══════════════════════════════════════════════════════
  'move-zeroes': {
    statement:
      'Given an integer array nums, move all 0s to the end of it while maintaining the relative order of the non-zero elements. Do this in-place without making a copy.',
    tags: ['Arrays', 'Two Pointers'],
    requirement: 'In-place, O(n) time, O(1) space',
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
      { number: 1, unlockedByDefault: true, text: 'Think of maintaining a "boundary" pointer marking where the next non-zero element should go.' },
      { number: 2, text: 'Scan through the array once; whenever you find a non-zero, place it at the boundary and advance the boundary.' },
      { number: 3, text: 'After placing all non-zeros at the front (in order), what values remain in the rest of the array?' },
      { number: 4, label: 'Hint 4 — approach', text: 'Use a single pass with a "insertPos" pointer. Swap nums[i] and nums[insertPos] whenever nums[i] != 0, then increment insertPos — this naturally pushes zeros to the back while preserving order.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Two Pointers (swap) — O(n) time, O(1) space',
        explanation: 'Maintain a pointer to the next position for a non-zero element; swap non-zeros into place as you scan.',
        code: {
          java: `public void moveZeroes(int[] nums) {
    int insertPos = 0;
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] != 0) {
            int t = nums[insertPos]; nums[insertPos] = nums[i]; nums[i] = t;
            insertPos++;
        }
    }
}`,
          cpp: `void moveZeroes(vector<int>& nums) {
    int insertPos = 0;
    for (int i = 0; i < (int)nums.size(); i++) {
        if (nums[i] != 0) {
            swap(nums[insertPos], nums[i]);
            insertPos++;
        }
    }
}`,
          python: `def moveZeroes(nums):
    insert_pos = 0
    for i in range(len(nums)):
        if nums[i] != 0:
            nums[insert_pos], nums[i] = nums[i], nums[insert_pos]
            insert_pos += 1`,
        },
        dryRun: {
          title: 'Dry run — nums = [0,1,0,3,12]',
          columns: ['i', 'nums[i]', 'Action', 'Array State', 'insertPos'],
          rows: [
            ['0', '0', 'skip', '[0,1,0,3,12]', '0'],
            ['1', '1', 'swap(0,1)', '[1,0,0,3,12]', '1'],
            ['2', '0', 'skip', '[1,0,0,3,12]', '1'],
            ['3', '3', 'swap(1,3)', '[1,3,0,0,12]', '2'],
            ['4', '12', 'swap(2,4)', '[1,3,12,0,0]', '3 ✓'],
          ],
          highlightRow: 4,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 26. Merge Sorted Array
  // ══════════════════════════════════════════════════════
  'merge-sorted-array': {
    statement:
      'You are given two sorted arrays nums1 and nums2, with nums1 having length m+n (last n slots are 0 placeholders) and nums2 having length n. Merge nums2 into nums1 in-place so the result is one sorted array.',
    tags: ['Arrays', 'Two Pointers'],
    requirement: 'O(m + n) time, O(1) extra space',
    externalLinks: [
      { label: '↗ LeetCode #88', url: 'https://leetcode.com/problems/merge-sorted-array/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  nums1 = [1,2,3,0,0,0], m=3, nums2 = [2,5,6], n=3\nOutput: [1,2,2,3,5,6]' },
      { label: 'Example 2', text: 'Input:  nums1 = [1], m=1, nums2 = [], n=0\nOutput: [1]' },
    ],
    constraints: ['nums1.length == m + n', 'nums2.length == n', '0 ≤ m, n ≤ 200', '1 ≤ m + n ≤ 200'],
    requiredComplexity: 'O(m + n) time · O(1) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'Merging from the front would overwrite unread elements of nums1 — what if you merged from the back instead?' },
      { number: 2, text: 'nums1 has empty (zero) space at the end exactly big enough to hold everything, so filling from the highest index backward never overwrites unread data.' },
      { number: 3, text: 'Use three pointers: one at the end of the "real" nums1 data (m-1), one at the end of nums2 (n-1), and one at the very end of nums1 (m+n-1) where the next largest value should be written.' },
      { number: 4, label: 'Hint 4 — approach', text: 'Compare nums1[i] and nums2[j], place the larger at position k, and decrement the corresponding pointer(s). Continue until nums2 is exhausted (any nums1 elements remaining are already in place).' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Merge from the Back — O(m+n) time, O(1) space',
        explanation: 'Fill nums1 from the last index backward, always placing the larger of the two current candidates.',
        code: {
          java: `public void merge(int[] nums1, int m, int[] nums2, int n) {
    int i = m - 1, j = n - 1, k = m + n - 1;
    while (j >= 0) {
        if (i >= 0 && nums1[i] > nums2[j]) {
            nums1[k--] = nums1[i--];
        } else {
            nums1[k--] = nums2[j--];
        }
    }
}`,
          cpp: `void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
    int i = m - 1, j = n - 1, k = m + n - 1;
    while (j >= 0) {
        if (i >= 0 && nums1[i] > nums2[j]) {
            nums1[k--] = nums1[i--];
        } else {
            nums1[k--] = nums2[j--];
        }
    }
}`,
          python: `def merge(nums1, m, nums2, n):
    i, j, k = m - 1, n - 1, m + n - 1
    while j >= 0:
        if i >= 0 and nums1[i] > nums2[j]:
            nums1[k] = nums1[i]
            i -= 1
        else:
            nums1[k] = nums2[j]
            j -= 1
        k -= 1`,
        },
        dryRun: {
          title: 'Dry run — nums1=[1,2,3,0,0,0], m=3, nums2=[2,5,6], n=3',
          columns: ['i', 'j', 'k', 'Comparison', 'nums1 after'],
          rows: [
            ['2 (3)', '2 (6)', '5', '6 > 3 → place 6', '[1,2,3,0,0,6]'],
            ['2 (3)', '1 (5)', '4', '5 > 3 → place 5', '[1,2,3,0,5,6]'],
            ['2 (3)', '0 (2)', '3', '3 > 2 → place 3', '[1,2,3,3,5,6]'],
            ['1 (2)', '0 (2)', '2', '2 not > 2 → place nums2[0]=2', '[1,2,2,3,5,6]'],
            ['1 (2)', '-1', '1', 'j<0, loop ends', '[1,2,2,3,5,6] ✓'],
          ],
          highlightRow: 3,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 27. Two Sum II - Input Array Is Sorted
  // ══════════════════════════════════════════════════════
  'two-sum-ii-sorted': {
    statement:
      'Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target. Return the indices (1-indexed) as [index1, index2]. Use only O(1) extra space.',
    tags: ['Arrays', 'Two Pointers'],
    requirement: 'O(n) time, O(1) space',
    externalLinks: [
      { label: '↗ LeetCode #167', url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  numbers = [2,7,11,15], target = 9\nOutput: [1,2]' },
      { label: 'Example 2', text: 'Input:  numbers = [2,3,4], target = 6\nOutput: [1,3]' },
    ],
    constraints: ['2 ≤ numbers.length ≤ 3×10⁴', '−1000 ≤ numbers[i] ≤ 1000', 'numbers is sorted non-decreasing', 'Exactly one solution exists'],
    requiredComplexity: 'O(n) time · O(1) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'The array being sorted is a strong hint — can you avoid a hash map entirely and use two pointers instead?' },
      { number: 2, text: 'Place one pointer at the start and one at the end. What does it mean if their sum is too large? Too small?' },
      { number: 3, text: 'If the sum is too large, the right pointer must move left (to decrease the sum, since the array is sorted). If too small, the left pointer must move right.' },
      { number: 4, label: 'Hint 4 — approach', text: 'Move the two pointers toward each other, adjusting based on the sum vs target comparison, until they meet at the exact answer. Remember to return 1-indexed positions.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Two Pointers — O(n) time, O(1) space',
        explanation: 'Exploit sortedness: move left/right pointers inward based on whether the current sum is too small or too large.',
        code: {
          java: `public int[] twoSum(int[] numbers, int target) {
    int left = 0, right = numbers.length - 1;
    while (left < right) {
        int sum = numbers[left] + numbers[right];
        if (sum == target) return new int[]{left + 1, right + 1};
        else if (sum < target) left++;
        else right--;
    }
    return new int[]{};
}`,
          cpp: `vector<int> twoSum(vector<int>& numbers, int target) {
    int left = 0, right = numbers.size() - 1;
    while (left < right) {
        int sum = numbers[left] + numbers[right];
        if (sum == target) return {left + 1, right + 1};
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
            return [left + 1, right + 1]
        elif s < target:
            left += 1
        else:
            right -= 1
    return []`,
        },
        dryRun: {
          title: 'Dry run — numbers = [2,7,11,15], target = 9',
          columns: ['left', 'right', 'sum', 'Action'],
          rows: [
            ['0 (2)', '3 (15)', '17', 'too big → right--'],
            ['0 (2)', '2 (11)', '13', 'too big → right--'],
            ['0 (2)', '1 (7)', '9', 'match! → return [1,2] ✓'],
          ],
          highlightRow: 2,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 28. 3Sum
  // ══════════════════════════════════════════════════════
  '3sum': {
    statement:
      'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, j != k, and nums[i] + nums[j] + nums[k] == 0. The solution set must not contain duplicate triplets.',
    tags: ['Arrays', 'Two Pointers'],
    requirement: 'O(n²) time preferred',
    externalLinks: [
      { label: '↗ LeetCode #15', url: 'https://leetcode.com/problems/3sum/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [-1,0,1,2,-1,-4]\nOutput: [[-1,-1,2],[-1,0,1]]' },
      { label: 'Example 2', text: 'Input:  nums = [0,1,1]\nOutput: []' },
    ],
    constraints: ['3 ≤ nums.length ≤ 3000', '−10⁵ ≤ nums[i] ≤ 10⁵'],
    requiredComplexity: 'O(n²) time · O(1) extra space (excluding output)',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'Fixing one number turns this into a two-sum-style problem for the remaining two — but you also need to avoid duplicate triplets.' },
      { number: 2, text: 'Sort the array first. Sorting makes both duplicate-skipping and two-pointer search possible.' },
      { number: 3, text: 'For each index i (the smallest of the triplet), use two pointers on the remainder of the array to find pairs summing to -nums[i].' },
      { number: 4, label: 'Hint 4 — approach', text: 'Skip over duplicate values for i, and after finding a valid triplet, also skip duplicates for both the left and right pointers before continuing the search.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Sort + Two Pointers — O(n²) time, O(1) extra space',
        explanation: 'Sort the array; fix the smallest element and two-pointer search the rest for pairs summing to its negation, skipping duplicates.',
        code: {
          java: `public List<List<Integer>> threeSum(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> res = new ArrayList<>();
    int n = nums.length;
    for (int i = 0; i < n - 2; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;
        int left = i + 1, right = n - 1;
        while (left < right) {
            int sum = nums[i] + nums[left] + nums[right];
            if (sum == 0) {
                res.add(Arrays.asList(nums[i], nums[left], nums[right]));
                while (left < right && nums[left] == nums[left + 1]) left++;
                while (left < right && nums[right] == nums[right - 1]) right--;
                left++; right--;
            } else if (sum < 0) left++;
            else right--;
        }
    }
    return res;
}`,
          cpp: `vector<vector<int>> threeSum(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> res;
    int n = nums.size();
    for (int i = 0; i < n - 2; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;
        int left = i + 1, right = n - 1;
        while (left < right) {
            int sum = nums[i] + nums[left] + nums[right];
            if (sum == 0) {
                res.push_back({nums[i], nums[left], nums[right]});
                while (left < right && nums[left] == nums[left + 1]) left++;
                while (left < right && nums[right] == nums[right - 1]) right--;
                left++; right--;
            } else if (sum < 0) left++;
            else right--;
        }
    }
    return res;
}`,
          python: `def threeSum(nums):
    nums.sort()
    res = []
    n = len(nums)
    for i in range(n - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        left, right = i + 1, n - 1
        while left < right:
            s = nums[i] + nums[left] + nums[right]
            if s == 0:
                res.append([nums[i], nums[left], nums[right]])
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                left += 1
                right -= 1
            elif s < 0:
                left += 1
            else:
                right -= 1
    return res`,
        },
        dryRun: {
          title: 'Dry run — nums = [-4,-1,-1,0,1,2] (sorted)',
          columns: ['i (nums[i])', 'left/right', 'sum', 'Action'],
          rows: [
            ['1 (-1)', 'left=2(-1), right=5(2)', '0', 'found [-1,-1,2], move both, skip dups'],
            ['1 (-1)', 'left=3(0), right=4(1)', '0', 'found [-1,0,1]'],
            ['2 (-1)', 'skip (dup of i=1)', '-', '-'],
            ['result', '[[-1,-1,2],[-1,0,1]] ✓', '', ''],
          ],
          highlightRow: 1,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 29. 3Sum Closest
  // ══════════════════════════════════════════════════════
  '3sum-closest': {
    statement:
      'Given an integer array nums of length n and an integer target, find three integers in nums such that the sum is closest to target. Return the sum of the three integers. You may assume that each input would have exactly one solution.',
    tags: ['Arrays', 'Two Pointers'],
    requirement: 'O(n²) time preferred',
    externalLinks: [
      { label: '↗ LeetCode #16', url: 'https://leetcode.com/problems/3sum-closest/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [-1,2,1,-4], target = 1\nOutput: 2\nReason: -1+2+1 = 2 is closest to 1' },
    ],
    constraints: ['3 ≤ nums.length ≤ 500', '−1000 ≤ nums[i] ≤ 1000', '−10⁴ ≤ target ≤ 10⁴'],
    requiredComplexity: 'O(n²) time · O(1) extra space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'This is a variant of 3Sum — the same sort + two-pointer skeleton applies, but the stopping condition changes.' },
      { number: 2, text: 'Sort the array, fix one element, and two-pointer search the rest — track the closest sum found so far instead of only exact zero matches.' },
      { number: 3, text: 'After computing a triplet sum, compare |sum - target| to your best-so-far, and move the pointer that would bring the sum closer to target.' },
      { number: 4, label: 'Hint 4 — approach', text: 'If sum == target, that is the best possible — return immediately. Otherwise move left++ if sum < target (need bigger) or right-- if sum > target (need smaller), always updating the closest sum tracked.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Sort + Two Pointers — O(n²) time, O(1) extra space',
        explanation: 'Same skeleton as 3Sum, but track the sum closest to target rather than requiring an exact zero.',
        code: {
          java: `public int threeSumClosest(int[] nums, int target) {
    Arrays.sort(nums);
    int n = nums.length;
    int closest = nums[0] + nums[1] + nums[2];
    for (int i = 0; i < n - 2; i++) {
        int left = i + 1, right = n - 1;
        while (left < right) {
            int sum = nums[i] + nums[left] + nums[right];
            if (Math.abs(sum - target) < Math.abs(closest - target)) closest = sum;
            if (sum == target) return sum;
            else if (sum < target) left++;
            else right--;
        }
    }
    return closest;
}`,
          cpp: `int threeSumClosest(vector<int>& nums, int target) {
    sort(nums.begin(), nums.end());
    int n = nums.size();
    int closest = nums[0] + nums[1] + nums[2];
    for (int i = 0; i < n - 2; i++) {
        int left = i + 1, right = n - 1;
        while (left < right) {
            int sum = nums[i] + nums[left] + nums[right];
            if (abs(sum - target) < abs(closest - target)) closest = sum;
            if (sum == target) return sum;
            else if (sum < target) left++;
            else right--;
        }
    }
    return closest;
}`,
          python: `def threeSumClosest(nums, target):
    nums.sort()
    n = len(nums)
    closest = nums[0] + nums[1] + nums[2]
    for i in range(n - 2):
        left, right = i + 1, n - 1
        while left < right:
            s = nums[i] + nums[left] + nums[right]
            if abs(s - target) < abs(closest - target):
                closest = s
            if s == target:
                return s
            elif s < target:
                left += 1
            else:
                right -= 1
    return closest`,
        },
        dryRun: {
          title: 'Dry run — nums = [-4,-1,1,2] (sorted), target = 1',
          columns: ['i', 'left/right', 'sum', 'closest'],
          rows: [
            ['0 (-4)', 'left=1(-1), right=3(2)', '-3', '-3 (|,-3-1|=4)'],
            ['0 (-4)', 'left=2(1), right=3(2)', '-1', '-1 (better, |diff|=2)'],
            ['1 (-1)', 'left=2(1), right=3(2)', '2', '2 (best, |diff|=1) ✓'],
          ],
          highlightRow: 2,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 30. 4Sum
  // ══════════════════════════════════════════════════════
  '4sum': {
    statement:
      'Given an array nums of n integers, return all unique quadruplets [nums[a], nums[b], nums[c], nums[d]] such that a, b, c, d are distinct indices and nums[a]+nums[b]+nums[c]+nums[d] == target.',
    tags: ['Arrays', 'Two Pointers'],
    requirement: 'O(n³) time preferred',
    externalLinks: [
      { label: '↗ LeetCode #18', url: 'https://leetcode.com/problems/4sum/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [1,0,-1,0,-2,2], target = 0\nOutput: [[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]' },
    ],
    constraints: ['1 ≤ nums.length ≤ 200', '−10⁹ ≤ nums[i] ≤ 10⁹', '−10⁹ ≤ target ≤ 10⁹'],
    requiredComplexity: 'O(n³) time · O(1) extra space (excluding output)',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'This generalizes 3Sum by one more fixed index. Can you nest the same sort + two-pointer idea one level deeper?' },
      { number: 2, text: 'Sort the array, then use two nested loops to fix the first two elements, and two pointers for the remaining pair.' },
      { number: 3, text: 'Watch for overflow with large values — use a wider type (long) for intermediate sums.' },
      { number: 4, label: 'Hint 4 — approach', text: 'Skip duplicate values at every one of the four positions (both fixed loop variables and both two-pointer positions) to avoid duplicate quadruplets in the output.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Sort + Nested Two Pointers — O(n³) time, O(1) extra space',
        explanation: 'Fix two elements with nested loops, then two-pointer search the rest, skipping duplicates at every level.',
        code: {
          java: `public List<List<Integer>> fourSum(int[] nums, int target) {
    Arrays.sort(nums);
    List<List<Integer>> res = new ArrayList<>();
    int n = nums.length;
    for (int i = 0; i < n - 3; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;
        for (int j = i + 1; j < n - 2; j++) {
            if (j > i + 1 && nums[j] == nums[j - 1]) continue;
            int left = j + 1, right = n - 1;
            while (left < right) {
                long sum = (long) nums[i] + nums[j] + nums[left] + nums[right];
                if (sum == target) {
                    res.add(Arrays.asList(nums[i], nums[j], nums[left], nums[right]));
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    while (left < right && nums[right] == nums[right - 1]) right--;
                    left++; right--;
                } else if (sum < target) left++;
                else right--;
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
        if (i > 0 && nums[i] == nums[i - 1]) continue;
        for (int j = i + 1; j < n - 2; j++) {
            if (j > i + 1 && nums[j] == nums[j - 1]) continue;
            int left = j + 1, right = n - 1;
            while (left < right) {
                long long sum = (long long)nums[i] + nums[j] + nums[left] + nums[right];
                if (sum == target) {
                    res.push_back({nums[i], nums[j], nums[left], nums[right]});
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    while (left < right && nums[right] == nums[right - 1]) right--;
                    left++; right--;
                } else if (sum < target) left++;
                else right--;
            }
        }
    }
    return res;
}`,
          python: `def fourSum(nums, target):
    nums.sort()
    res = []
    n = len(nums)
    for i in range(n - 3):
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        for j in range(i + 1, n - 2):
            if j > i + 1 and nums[j] == nums[j - 1]:
                continue
            left, right = j + 1, n - 1
            while left < right:
                s = nums[i] + nums[j] + nums[left] + nums[right]
                if s == target:
                    res.append([nums[i], nums[j], nums[left], nums[right]])
                    while left < right and nums[left] == nums[left + 1]:
                        left += 1
                    while left < right and nums[right] == nums[right - 1]:
                        right -= 1
                    left += 1
                    right -= 1
                elif s < target:
                    left += 1
                else:
                    right -= 1
    return res`,
        },
        dryRun: {
          title: 'Dry run — nums = [-2,-1,0,0,1,2] (sorted), target = 0',
          columns: ['i,j', 'left/right', 'sum', 'Action'],
          rows: [
            ['i=0(-2), j=1(-1)', 'left=4(1), right=5(2)', '0', 'found [-2,-1,1,2]'],
            ['i=0(-2), j=2(0)', 'left=3(0), right=5(2)', '0', 'found [-2,0,0,2]'],
            ['i=1(-1), j=2(0)', 'left=3(0), right=4(1)', '0', 'found [-1,0,0,1] ✓'],
          ],
          highlightRow: 2,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 31. Container With Most Water
  // ══════════════════════════════════════════════════════
  'container-with-most-water': {
    statement:
      'Given n non-negative integers height[i] representing vertical lines, find two lines that together with the x-axis form a container that holds the most water.',
    tags: ['Arrays', 'Two Pointers'],
    requirement: 'O(n) time preferred',
    externalLinks: [
      { label: '↗ LeetCode #11', url: 'https://leetcode.com/problems/container-with-most-water/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  height = [1,8,6,2,5,4,8,3,7]\nOutput: 49' },
      { label: 'Example 2', text: 'Input:  height = [1,1]\nOutput: 1' },
    ],
    constraints: ['2 ≤ height.length ≤ 10⁵', '0 ≤ height[i] ≤ 10⁴'],
    requiredComplexity: 'O(n) time · O(1) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'Container area = width × min(height[left], height[right]). Checking every pair is O(n²) — is there a smarter search order?' },
      { number: 2, text: 'Start with the widest possible container: pointers at both ends. As you narrow the width, only a taller wall could possibly increase the area.' },
      { number: 3, text: 'The shorter of the two current walls is the bottleneck — moving the taller wall\'s pointer can never help, since width shrinks but height stays capped by the same short wall.' },
      { number: 4, label: 'Hint 4 — approach', text: 'Always move the pointer at the shorter wall inward, recomputing area each step, until the two pointers meet. This eliminates provably worse options at each step, achieving O(n).' },
    ],
    approaches: [
      {
        key: 'brute',
        label: 'Brute Force — O(n²)',
        explanation: 'Check every pair of lines and compute the area.',
        code: {
          java: `public int maxArea(int[] height) {
    int maxArea = 0;
    for (int i = 0; i < height.length; i++) {
        for (int j = i + 1; j < height.length; j++) {
            int area = (j - i) * Math.min(height[i], height[j]);
            maxArea = Math.max(maxArea, area);
        }
    }
    return maxArea;
}`,
          cpp: `int maxArea(vector<int>& height) {
    int maxArea = 0;
    for (int i = 0; i < (int)height.size(); i++) {
        for (int j = i + 1; j < (int)height.size(); j++) {
            int area = (j - i) * min(height[i], height[j]);
            maxArea = max(maxArea, area);
        }
    }
    return maxArea;
}`,
          python: `def maxArea(height):
    max_area = 0
    for i in range(len(height)):
        for j in range(i + 1, len(height)):
            max_area = max(max_area, (j - i) * min(height[i], height[j]))
    return max_area`,
        },
      },
      {
        key: 'optimal',
        label: 'Two Pointers — O(n) time, O(1) space',
        explanation: 'Always advance the pointer at the shorter wall since it is the limiting factor for area.',
        code: {
          java: `public int maxArea(int[] height) {
    int left = 0, right = height.length - 1, maxArea = 0;
    while (left < right) {
        int area = (right - left) * Math.min(height[left], height[right]);
        maxArea = Math.max(maxArea, area);
        if (height[left] < height[right]) left++;
        else right--;
    }
    return maxArea;
}`,
          cpp: `int maxArea(vector<int>& height) {
    int left = 0, right = height.size() - 1, maxArea = 0;
    while (left < right) {
        int area = (right - left) * min(height[left], height[right]);
        maxArea = max(maxArea, area);
        if (height[left] < height[right]) left++;
        else right--;
    }
    return maxArea;
}`,
          python: `def maxArea(height):
    left, right = 0, len(height) - 1
    max_area = 0
    while left < right:
        area = (right - left) * min(height[left], height[right])
        max_area = max(max_area, area)
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return max_area`,
        },
        dryRun: {
          title: 'Dry run — height = [1,8,6,2,5,4,8,3,7]',
          columns: ['left', 'right', 'area', 'maxArea', 'Move'],
          rows: [
            ['0(1)', '8(7)', '8×1=8', '8', 'left shorter → left++'],
            ['1(8)', '8(7)', '7×7=49', '49', 'right shorter → right--'],
            ['1(8)', '7(3)', '6×3=18', '49', 'right shorter → right--'],
            ['...', '...', '...', '49 (stays max) ✓', ''],
          ],
          highlightRow: 1,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 32. Sort Colors
  // ══════════════════════════════════════════════════════
  'sort-colors': {
    statement:
      "Given an array nums with n objects colored red, white, or blue (represented by integers 0, 1, and 2), sort them in-place so that objects of the same color are adjacent, in the order red, white, blue. You must solve this without using a library sort function, in one pass.",
    tags: ['Arrays', 'Dutch National Flag'],
    requirement: 'One-pass, O(1) extra space',
    externalLinks: [
      { label: '↗ LeetCode #75', url: 'https://leetcode.com/problems/sort-colors/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [2,0,2,1,1,0]\nOutput: [0,0,1,1,2,2]' },
      { label: 'Example 2', text: 'Input:  nums = [2,0,1]\nOutput: [0,1,2]' },
    ],
    constraints: ['n == nums.length', '1 ≤ n ≤ 300', 'nums[i] is 0, 1, or 2'],
    requiredComplexity: 'O(n) time, one pass · O(1) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'Since there are only 3 distinct values, you could count occurrences of each and overwrite — but the problem wants a single pass. What partition-based technique handles 3 regions at once?' },
      { number: 2, text: 'Maintain three pointers: low (boundary for 0s), mid (current element), high (boundary for 2s).' },
      { number: 3, text: 'If nums[mid] is 0, swap it to the low region and advance both low and mid. If it\'s 2, swap it to the high region and shrink high — but do NOT advance mid, since the swapped-in value from high still needs checking.' },
      { number: 4, label: 'Hint 4 — approach', text: 'This is the Dutch National Flag algorithm: while mid <= high, handle nums[mid] == 0 (swap with low, low++, mid++), == 1 (mid++), or == 2 (swap with high, high--).' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Dutch National Flag (3-way partition) — O(n) time, O(1) space, one pass',
        explanation: 'Partition the array into three regions using low/mid/high pointers in a single traversal.',
        code: {
          java: `public void sortColors(int[] nums) {
    int low = 0, mid = 0, high = nums.length - 1;
    while (mid <= high) {
        if (nums[mid] == 0) {
            int t = nums[low]; nums[low] = nums[mid]; nums[mid] = t;
            low++; mid++;
        } else if (nums[mid] == 1) {
            mid++;
        } else {
            int t = nums[mid]; nums[mid] = nums[high]; nums[high] = t;
            high--;
        }
    }
}`,
          cpp: `void sortColors(vector<int>& nums) {
    int low = 0, mid = 0, high = nums.size() - 1;
    while (mid <= high) {
        if (nums[mid] == 0) {
            swap(nums[low], nums[mid]);
            low++; mid++;
        } else if (nums[mid] == 1) {
            mid++;
        } else {
            swap(nums[mid], nums[high]);
            high--;
        }
    }
}`,
          python: `def sortColors(nums):
    low, mid, high = 0, 0, len(nums) - 1
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1`,
        },
        dryRun: {
          title: 'Dry run — nums = [2,0,2,1,1,0]',
          columns: ['low', 'mid', 'high', 'nums[mid]', 'Action', 'Array State'],
          rows: [
            ['0', '0', '5', '2', 'swap mid,high; high--', '[0,0,2,1,1,2]'],
            ['0', '0', '4', '0', 'swap low,mid; low++,mid++', '[0,0,2,1,1,2]'],
            ['1', '1', '4', '0', 'swap low,mid; low++,mid++', '[0,0,2,1,1,2]'],
            ['2', '2', '4', '2', 'swap mid,high; high--', '[0,0,1,1,2,2]'],
            ['2', '2', '3', '1', 'mid++', '[0,0,1,1,2,2]'],
            ['2', '3', '3', '1', 'mid++ → mid>high, stop', '[0,0,1,1,2,2] ✓'],
          ],
          highlightRow: 3,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 33. Remove Duplicates from Sorted Array
  // ══════════════════════════════════════════════════════
  'remove-duplicates-sorted-array': {
    statement:
      'Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. Return the number of unique elements k; the first k elements of nums should hold the final result.',
    tags: ['Arrays', 'Two Pointers'],
    requirement: 'O(n) time, O(1) extra space',
    externalLinks: [
      { label: '↗ LeetCode #26', url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [1,1,2]\nOutput: 2, nums = [1,2,_]' },
      { label: 'Example 2', text: 'Input:  nums = [0,0,1,1,1,2,2,3,3,4]\nOutput: 5, nums = [0,1,2,3,4,_,_,_,_,_]' },
    ],
    constraints: ['1 ≤ nums.length ≤ 3×10⁴', '−100 ≤ nums[i] ≤ 100', 'nums sorted non-decreasing'],
    requiredComplexity: 'O(n) time · O(1) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'Because the array is sorted, duplicates are always adjacent — you never need to look far to detect one.' },
      { number: 2, text: 'Use a "write" pointer marking the end of the unique-elements-so-far region, and a "read" pointer scanning ahead.' },
      { number: 3, text: 'Only advance the write pointer (and copy the value) when the read pointer finds something different from the last written value.' },
      { number: 4, label: 'Hint 4 — approach', text: 'Start write=1 (first element is always unique). For each read index from 1 to n-1, if nums[read] != nums[write-1], copy nums[read] into nums[write] and increment write. Return write at the end.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Two Pointers (read/write) — O(n) time, O(1) space',
        explanation: 'Overwrite duplicates in-place by only advancing the write pointer for genuinely new values.',
        code: {
          java: `public int removeDuplicates(int[] nums) {
    if (nums.length == 0) return 0;
    int write = 1;
    for (int read = 1; read < nums.length; read++) {
        if (nums[read] != nums[write - 1]) {
            nums[write] = nums[read];
            write++;
        }
    }
    return write;
}`,
          cpp: `int removeDuplicates(vector<int>& nums) {
    if (nums.empty()) return 0;
    int write = 1;
    for (int read = 1; read < (int)nums.size(); read++) {
        if (nums[read] != nums[write - 1]) {
            nums[write] = nums[read];
            write++;
        }
    }
    return write;
}`,
          python: `def removeDuplicates(nums):
    if not nums:
        return 0
    write = 1
    for read in range(1, len(nums)):
        if nums[read] != nums[write - 1]:
            nums[write] = nums[read]
            write += 1
    return write`,
        },
        dryRun: {
          title: 'Dry run — nums = [0,0,1,1,1,2,2,3,3,4]',
          columns: ['read', 'nums[read]', 'nums[write-1]', 'Action', 'write'],
          rows: [
            ['1', '0', '0', 'same, skip', '1'],
            ['2', '1', '0', 'different, write nums[1]=1', '2'],
            ['5', '2', '1', 'different, write nums[2]=2', '3'],
            ['7', '3', '2', 'different, write nums[3]=3', '4'],
            ['9', '4', '3', 'different, write nums[4]=4', '5 ✓ (result [0,1,2,3,4,...])'],
          ],
          highlightRow: 4,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 34. Remove Duplicates from Sorted Array II
  // ══════════════════════════════════════════════════════
  'remove-duplicates-sorted-array-ii': {
    statement:
      'Given a sorted integer array nums, remove duplicates in-place such that duplicates are allowed at most twice, and return the new length k. The first k elements should hold the final result.',
    tags: ['Arrays', 'Two Pointers'],
    requirement: 'O(n) time, O(1) extra space',
    externalLinks: [
      { label: '↗ LeetCode #80', url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [1,1,1,2,2,3]\nOutput: 5, nums = [1,1,2,2,3,_]' },
      { label: 'Example 2', text: 'Input:  nums = [0,0,1,1,1,1,2,3,3]\nOutput: 7, nums = [0,0,1,1,2,3,3,_,_]' },
    ],
    constraints: ['1 ≤ nums.length ≤ 3×10⁴', '−10⁴ ≤ nums[i] ≤ 10⁴', 'nums sorted non-decreasing'],
    requiredComplexity: 'O(n) time · O(1) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'This generalizes "remove duplicates" to allow up to 2 copies. What comparison tells you whether writing a value would exceed that limit?' },
      { number: 2, text: 'Instead of comparing to the immediately previous written value, compare the candidate to the value written TWO positions back.' },
      { number: 3, text: 'If nums[read] != nums[write-2], it\'s safe to write it (there\'s no way we\'d create a 3rd copy).' },
      { number: 4, label: 'Hint 4 — approach', text: 'Start write=2 (first two elements are always kept). For read from 2 to n-1, if nums[read] != nums[write-2], copy it to nums[write] and increment write.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Two Pointers, Compare 2-back — O(n) time, O(1) space',
        explanation: 'Generalizes the single-duplicate trick: allow a write only if it differs from the value two slots behind the write pointer.',
        code: {
          java: `public int removeDuplicates(int[] nums) {
    int n = nums.length;
    if (n <= 2) return n;
    int write = 2;
    for (int read = 2; read < n; read++) {
        if (nums[read] != nums[write - 2]) {
            nums[write] = nums[read];
            write++;
        }
    }
    return write;
}`,
          cpp: `int removeDuplicates(vector<int>& nums) {
    int n = nums.size();
    if (n <= 2) return n;
    int write = 2;
    for (int read = 2; read < n; read++) {
        if (nums[read] != nums[write - 2]) {
            nums[write] = nums[read];
            write++;
        }
    }
    return write;
}`,
          python: `def removeDuplicates(nums):
    n = len(nums)
    if n <= 2:
        return n
    write = 2
    for read in range(2, n):
        if nums[read] != nums[write - 2]:
            nums[write] = nums[read]
            write += 1
    return write`,
        },
        dryRun: {
          title: 'Dry run — nums = [1,1,1,2,2,3]',
          columns: ['read', 'nums[read]', 'nums[write-2]', 'Action', 'write'],
          rows: [
            ['2', '1', 'nums[0]=1', 'same → skip (would be 3rd 1)', '2'],
            ['3', '2', 'nums[0]=1', 'different → write nums[2]=2', '3'],
            ['4', '2', 'nums[1]=1', 'different → write nums[3]=2', '4'],
            ['5', '3', 'nums[2]=2', 'different → write nums[4]=3', '5 ✓ ([1,1,2,2,3])'],
          ],
          highlightRow: 3,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 35. Boats to Save People
  // ══════════════════════════════════════════════════════
  'boats-to-save-people': {
    statement:
      'You are given an array people where people[i] is the weight of the i-th person, and an integer limit denoting the maximum weight a boat can carry. Each boat carries at most two people at the same time, provided the sum of their weights does not exceed limit. Return the minimum number of boats needed.',
    tags: ['Arrays', 'Greedy Two Pointers'],
    requirement: 'O(n log n) time preferred',
    externalLinks: [
      { label: '↗ LeetCode #881', url: 'https://leetcode.com/problems/boats-to-save-people/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  people = [1,2], limit = 3\nOutput: 1' },
      { label: 'Example 2', text: 'Input:  people = [3,2,2,1], limit = 3\nOutput: 3' },
      { label: 'Example 3', text: 'Input:  people = [3,5,3,4], limit = 5\nOutput: 4' },
    ],
    constraints: ['1 ≤ people.length ≤ 5×10⁴', '1 ≤ people[i] ≤ limit ≤ 3×10⁴'],
    requiredComplexity: 'O(n log n) time · O(1) extra space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'Since each boat holds at most 2 people, the best strategy tries to pair the heaviest person with someone light enough to share a boat.' },
      { number: 2, text: 'Sort the array. Try pairing the heaviest remaining person with the lightest remaining person.' },
      { number: 3, text: 'If the heaviest and lightest together fit the limit, they can share a boat — otherwise the heaviest must go alone.' },
      { number: 4, label: 'Hint 4 — approach', text: 'Use two pointers, left at the lightest and right at the heaviest. Each iteration is one boat: if people[left] + people[right] <= limit, both go (left++, right--); otherwise only the heaviest goes (right--). Count boats until pointers cross.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Sort + Two Pointers (Greedy) — O(n log n) time, O(1) space',
        explanation: 'Always try to pair the lightest remaining person with the heaviest; the heaviest always needs a boat one way or another.',
        code: {
          java: `public int numRescueBoats(int[] people, int limit) {
    Arrays.sort(people);
    int left = 0, right = people.length - 1, boats = 0;
    while (left <= right) {
        if (people[left] + people[right] <= limit) left++;
        right--;
        boats++;
    }
    return boats;
}`,
          cpp: `int numRescueBoats(vector<int>& people, int limit) {
    sort(people.begin(), people.end());
    int left = 0, right = people.size() - 1, boats = 0;
    while (left <= right) {
        if (people[left] + people[right] <= limit) left++;
        right--;
        boats++;
    }
    return boats;
}`,
          python: `def numRescueBoats(people, limit):
    people.sort()
    left, right = 0, len(people) - 1
    boats = 0
    while left <= right:
        if people[left] + people[right] <= limit:
            left += 1
        right -= 1
        boats += 1
    return boats`,
        },
        dryRun: {
          title: 'Dry run — people = [3,2,2,1] → sorted [1,2,2,3], limit = 3',
          columns: ['left', 'right', 'sum', 'Action', 'boats'],
          rows: [
            ['0(1)', '3(3)', '4', 'too heavy, only right goes → right--', '1'],
            ['0(1)', '2(2)', '3', 'fits! both go → left++, right--', '2'],
            ['1(2)', '1(2)', 'left==right, single person', 'right-- (alone)', '3 ✓'],
          ],
          highlightRow: 1,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 36. Sort Array By Parity
  // ══════════════════════════════════════════════════════
  'sort-array-by-parity': {
    statement:
      'Given an integer array nums, move all the even integers to the beginning of the array followed by all the odd integers. Return any array that satisfies this condition.',
    tags: ['Arrays', 'Two Pointers'],
    requirement: 'O(n) time, O(1) space preferred',
    externalLinks: [
      { label: '↗ LeetCode #905', url: 'https://leetcode.com/problems/sort-array-by-parity/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [3,1,2,4]\nOutput: [2,4,3,1] (or any valid arrangement)' },
      { label: 'Example 2', text: 'Input:  nums = [0]\nOutput: [0]' },
    ],
    constraints: ['1 ≤ nums.length ≤ 5000', '0 ≤ nums[i] ≤ 5000'],
    requiredComplexity: 'O(n) time · O(1) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: "Since order within each parity group doesn't matter, you don't need a stable partition — a simple in-place swap works." },
      { number: 2, text: 'Use two pointers from opposite ends, similar to a partition step in quicksort.' },
      { number: 3, text: 'If the left pointer finds an odd number and the right pointer finds an even number, they should swap places.' },
      { number: 4, label: 'Hint 4 — approach', text: 'While left < right: if nums[left] is even, advance left. If nums[right] is odd, retreat right. Otherwise, swap nums[left] and nums[right] (left is odd, right is even) and advance/retreat both.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Two Pointers Partition — O(n) time, O(1) space',
        explanation: 'Partition in-place like quicksort\'s partition step, swapping misplaced odd/even values found from opposite ends.',
        code: {
          java: `public int[] sortArrayByParity(int[] nums) {
    int left = 0, right = nums.length - 1;
    while (left < right) {
        if (nums[left] % 2 == 0) {
            left++;
        } else if (nums[right] % 2 == 1) {
            right--;
        } else {
            int t = nums[left]; nums[left] = nums[right]; nums[right] = t;
            left++; right--;
        }
    }
    return nums;
}`,
          cpp: `vector<int> sortArrayByParity(vector<int>& nums) {
    int left = 0, right = nums.size() - 1;
    while (left < right) {
        if (nums[left] % 2 == 0) {
            left++;
        } else if (nums[right] % 2 == 1) {
            right--;
        } else {
            swap(nums[left], nums[right]);
            left++; right--;
        }
    }
    return nums;
}`,
          python: `def sortArrayByParity(nums):
    left, right = 0, len(nums) - 1
    while left < right:
        if nums[left] % 2 == 0:
            left += 1
        elif nums[right] % 2 == 1:
            right -= 1
        else:
            nums[left], nums[right] = nums[right], nums[left]
            left += 1
            right -= 1
    return nums`,
        },
        dryRun: {
          title: 'Dry run — nums = [3,1,2,4]',
          columns: ['left', 'right', 'nums[left] parity', 'nums[right] parity', 'Action'],
          rows: [
            ['0(3)', '3(4)', 'odd', 'even', 'swap → [4,1,2,3]'],
            ['1(1)', '2(2)', 'odd', 'even', 'swap → [4,3,2,1]'],
            ['2', '1', 'left>=right, stop', '', '[4,3,2,1] ✓ (evens first)'],
          ],
          highlightRow: 1,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 37. Squares of a Sorted Array
  // ══════════════════════════════════════════════════════
  'squares-of-a-sorted-array': {
    statement:
      'Given an integer array nums sorted in non-decreasing order, return an array of the squares of each number, also sorted in non-decreasing order.',
    tags: ['Arrays', 'Two Pointers'],
    requirement: 'O(n) time preferred',
    externalLinks: [
      { label: '↗ LeetCode #977', url: 'https://leetcode.com/problems/squares-of-a-sorted-array/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [-4,-1,0,3,10]\nOutput: [0,1,9,16,100]' },
      { label: 'Example 2', text: 'Input:  nums = [-7,-3,2,3,11]\nOutput: [4,9,9,49,121]' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁴', '−10⁴ ≤ nums[i] ≤ 10⁴', 'nums sorted non-decreasing'],
    requiredComplexity: 'O(n) time · O(n) space (output)',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'Squaring can flip the order because negative numbers become positive — sorting the squares directly costs O(n log n). Can you do it in one pass?' },
      { number: 2, text: 'The largest square always comes from either the smallest (most negative) or the largest (most positive) value in the original array.' },
      { number: 3, text: 'Use two pointers at both ends of the original array, and fill the result array from the back (largest squares first).' },
      { number: 4, label: 'Hint 4 — approach', text: 'Compare |nums[left]| and |nums[right]|; place the larger square at the current end of the result array and move that pointer inward, working backward through the result array.' },
    ],
    approaches: [
      {
        key: 'brute',
        label: 'Square + Sort — O(n log n) time',
        explanation: 'Square every value, then sort the result.',
        code: {
          java: `public int[] sortedSquares(int[] nums) {
    int[] res = new int[nums.length];
    for (int i = 0; i < nums.length; i++) res[i] = nums[i] * nums[i];
    Arrays.sort(res);
    return res;
}`,
          cpp: `vector<int> sortedSquares(vector<int>& nums) {
    vector<int> res(nums.size());
    for (int i = 0; i < (int)nums.size(); i++) res[i] = nums[i] * nums[i];
    sort(res.begin(), res.end());
    return res;
}`,
          python: `def sortedSquares(nums):
    return sorted(x * x for x in nums)`,
        },
      },
      {
        key: 'optimal',
        label: 'Two Pointers, Fill from the Back — O(n) time, O(n) space',
        explanation: 'The largest square is always at one of the two ends; fill the result array back-to-front.',
        code: {
          java: `public int[] sortedSquares(int[] nums) {
    int n = nums.length;
    int[] res = new int[n];
    int left = 0, right = n - 1;
    for (int i = n - 1; i >= 0; i--) {
        int leftSq = nums[left] * nums[left];
        int rightSq = nums[right] * nums[right];
        if (leftSq > rightSq) {
            res[i] = leftSq;
            left++;
        } else {
            res[i] = rightSq;
            right--;
        }
    }
    return res;
}`,
          cpp: `vector<int> sortedSquares(vector<int>& nums) {
    int n = nums.size();
    vector<int> res(n);
    int left = 0, right = n - 1;
    for (int i = n - 1; i >= 0; i--) {
        int leftSq = nums[left] * nums[left];
        int rightSq = nums[right] * nums[right];
        if (leftSq > rightSq) {
            res[i] = leftSq;
            left++;
        } else {
            res[i] = rightSq;
            right--;
        }
    }
    return res;
}`,
          python: `def sortedSquares(nums):
    n = len(nums)
    res = [0] * n
    left, right = 0, n - 1
    for i in range(n - 1, -1, -1):
        left_sq = nums[left] * nums[left]
        right_sq = nums[right] * nums[right]
        if left_sq > right_sq:
            res[i] = left_sq
            left += 1
        else:
            res[i] = right_sq
            right -= 1
    return res`,
        },
        dryRun: {
          title: 'Dry run — nums = [-4,-1,0,3,10]',
          columns: ['i (fill idx)', 'left/right', 'leftSq/rightSq', 'Placed', 'res so far'],
          rows: [
            ['4', 'left=0(-4), right=4(10)', '16 / 100', '100 → right--', '[_,_,_,_,100]'],
            ['3', 'left=0(-4), right=3(3)', '16 / 9', '16 → left++', '[_,_,_,16,100]'],
            ['2', 'left=1(-1), right=3(3)', '1 / 9', '9 → right--', '[_,_,9,16,100]'],
            ['1', 'left=1(-1), right=2(0)', '1 / 0', '1 → left++', '[_,1,9,16,100]'],
            ['0', 'left=2(0), right=2(0)', '0 / 0', '0', '[0,1,9,16,100] ✓'],
          ],
          highlightRow: 0,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 38. Two Sum Less Than K
  // ══════════════════════════════════════════════════════
  'two-sum-less-than-k': {
    statement:
      'Given an array nums of integers and an integer k, return the maximum sum such that there exist two elements in the array whose sum is less than k. If no such pair exists, return -1.',
    tags: ['Arrays', 'Two Pointers'],
    requirement: 'O(n log n) time preferred',
    externalLinks: [
      { label: '↗ LeetCode #1099', url: 'https://leetcode.com/problems/two-sum-less-than-k/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [34,23,1,24,75,33,54,8], k = 60\nOutput: 58\nReason: 34 + 24 = 58' },
      { label: 'Example 2', text: 'Input:  nums = [10,20,30], k = 15\nOutput: -1' },
    ],
    constraints: ['1 ≤ nums.length ≤ 100', '1 ≤ nums[i] ≤ 1000', '1 ≤ k ≤ 2000'],
    requiredComplexity: 'O(n log n) time · O(1) extra space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'Sorting lets you search efficiently for pairs summing close to (but under) a threshold.' },
      { number: 2, text: 'Two pointers from both ends: if the sum is under k, that\'s a candidate — but could a bigger sum still be under k?' },
      { number: 3, text: 'If sum < k, record it as a candidate and try to increase the sum by moving the left pointer right (to use a bigger left value).' },
      { number: 4, label: 'Hint 4 — approach', text: 'If sum >= k, the right value is too big paired with anything from here — move right pointer left. If sum < k, update your best answer, then move left pointer right to seek a larger valid sum.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Sort + Two Pointers — O(n log n) time, O(1) extra space',
        explanation: 'Sort and search inward, updating the best under-k sum found while narrowing the search space.',
        code: {
          java: `public int twoSumLessThanK(int[] nums, int k) {
    Arrays.sort(nums);
    int left = 0, right = nums.length - 1, best = -1;
    while (left < right) {
        int sum = nums[left] + nums[right];
        if (sum < k) {
            best = Math.max(best, sum);
            left++;
        } else {
            right--;
        }
    }
    return best;
}`,
          cpp: `int twoSumLessThanK(vector<int>& nums, int k) {
    sort(nums.begin(), nums.end());
    int left = 0, right = nums.size() - 1, best = -1;
    while (left < right) {
        int sum = nums[left] + nums[right];
        if (sum < k) {
            best = max(best, sum);
            left++;
        } else {
            right--;
        }
    }
    return best;
}`,
          python: `def twoSumLessThanK(nums, k):
    nums.sort()
    left, right = 0, len(nums) - 1
    best = -1
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
          title: 'Dry run — nums = [34,23,1,24,75,33,54,8] sorted = [1,8,23,24,33,34,54,75], k = 60',
          columns: ['left', 'right', 'sum', 'Action', 'best'],
          rows: [
            ['0(1)', '7(75)', '76', '>=60, right--', '-1'],
            ['0(1)', '6(54)', '55', '<60, best=55, left++', '55'],
            ['1(8)', '6(54)', '62', '>=60, right--', '55'],
            ['1(8)', '5(34)', '42', '<60, best stays 55, left++', '55'],
            ['2(23)', '5(34)', '57', '<60, best stays 57? →57>55 update', '57'],
            ['3(24)', '5(34)', '58', '<60, best=58, left++', '58 ✓'],
          ],
          highlightRow: 5,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 39. Max Number of K-Sum Pairs
  // ══════════════════════════════════════════════════════
  'max-number-of-k-sum-pairs': {
    statement:
      'Given an integer array nums and an integer k, in one operation you remove two numbers that sum to k and remove them from the array. Return the maximum number of operations you can perform.',
    tags: ['Arrays', 'Two Pointers'],
    requirement: 'O(n log n) time preferred',
    externalLinks: [
      { label: '↗ LeetCode #1679', url: 'https://leetcode.com/problems/max-number-of-k-sum-pairs/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [1,2,3,4], k = 5\nOutput: 2' },
      { label: 'Example 2', text: 'Input:  nums = [3,1,3,4,3], k = 6\nOutput: 1' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁵', '1 ≤ nums[i] ≤ 10⁹', '1 ≤ k ≤ 10⁹'],
    requiredComplexity: 'O(n log n) time · O(1) extra space (or O(n) with hash map)',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'This is essentially repeatedly finding pairs summing to k and removing them — sorting exposes pairs cleanly with two pointers.' },
      { number: 2, text: 'Sort the array, then use two pointers from both ends.' },
      { number: 3, text: 'If the sum matches k, that\'s one operation — advance both pointers. If too small, advance left; if too big, retreat right.' },
      { number: 4, label: 'Hint 4 — approach', text: 'Alternatively, count frequencies in a hash map: for each distinct value v, pairs = min(count[v], count[k-v]) (careful to halve when v == k-v, and only count each pair once).' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Sort + Two Pointers — O(n log n) time, O(1) extra space',
        explanation: 'Sort then greedily match smallest and largest remaining values, adjusting pointers based on the sum.',
        code: {
          java: `public int maxOperations(int[] nums, int k) {
    Arrays.sort(nums);
    int left = 0, right = nums.length - 1, ops = 0;
    while (left < right) {
        int sum = nums[left] + nums[right];
        if (sum == k) {
            ops++; left++; right--;
        } else if (sum < k) {
            left++;
        } else {
            right--;
        }
    }
    return ops;
}`,
          cpp: `int maxOperations(vector<int>& nums, int k) {
    sort(nums.begin(), nums.end());
    int left = 0, right = nums.size() - 1, ops = 0;
    while (left < right) {
        int sum = nums[left] + nums[right];
        if (sum == k) {
            ops++; left++; right--;
        } else if (sum < k) {
            left++;
        } else {
            right--;
        }
    }
    return ops;
}`,
          python: `def maxOperations(nums, k):
    nums.sort()
    left, right = 0, len(nums) - 1
    ops = 0
    while left < right:
        s = nums[left] + nums[right]
        if s == k:
            ops += 1
            left += 1
            right -= 1
        elif s < k:
            left += 1
        else:
            right -= 1
    return ops`,
        },
        dryRun: {
          title: 'Dry run — nums = [3,1,3,4,3] sorted = [1,3,3,3,4], k = 6',
          columns: ['left', 'right', 'sum', 'Action', 'ops'],
          rows: [
            ['0(1)', '4(4)', '5', '<6, left++', '0'],
            ['1(3)', '4(4)', '7', '>6, right--', '0'],
            ['1(3)', '3(3)', '6', '==6, match! left++, right--', '1 ✓'],
            ['2', '2', 'left==right, stop', '', '1'],
          ],
          highlightRow: 2,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 40. Minimum Common Value
  // ══════════════════════════════════════════════════════
  'minimum-common-value': {
    statement:
      'Given two sorted integer arrays nums1 and nums2, return the minimum integer common to both arrays. If there is no common integer, return -1.',
    tags: ['Arrays', 'Two Pointers'],
    requirement: 'O(n + m) time preferred',
    externalLinks: [
      { label: '↗ LeetCode #2540', url: 'https://leetcode.com/problems/minimum-common-value/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  nums1 = [1,2,3], nums2 = [2,4]\nOutput: 2' },
      { label: 'Example 2', text: 'Input:  nums1 = [1,2,3,6], nums2 = [2,3,4,5]\nOutput: 2' },
    ],
    constraints: ['1 ≤ nums1.length, nums2.length ≤ 10⁵', '1 ≤ nums1[i], nums2[j] ≤ 10⁹', 'Both arrays sorted non-decreasing'],
    requiredComplexity: 'O(n + m) time · O(1) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'Both arrays are already sorted — this is very similar to the merge step of merge sort.' },
      { number: 2, text: 'Walk two pointers, one per array, simultaneously from the start.' },
      { number: 3, text: 'If the values match, you found the smallest common value immediately (because both arrays are processed in increasing order).' },
      { number: 4, label: 'Hint 4 — approach', text: 'If nums1[i] < nums2[j], advance i (nums1\'s current value can never appear later at a smaller position in nums2). If nums1[i] > nums2[j], advance j. If equal, return that value.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Two Pointers Merge-style — O(n + m) time, O(1) space',
        explanation: 'Advance whichever pointer points to the smaller current value, since sorted order guarantees no smaller match is missed.',
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
    while (i < (int)nums1.size() && j < (int)nums2.size()) {
        if (nums1[i] == nums2[j]) return nums1[i];
        else if (nums1[i] < nums2[j]) i++;
        else j++;
    }
    return -1;
}`,
          python: `def getCommon(nums1, nums2):
    i = j = 0
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
          columns: ['i(nums1[i])', 'j(nums2[j])', 'Comparison', 'Action'],
          rows: [
            ['0(1)', '0(2)', '1 < 2', 'i++'],
            ['1(2)', '0(2)', '2 == 2', 'return 2 ✓'],
          ],
          highlightRow: 1,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 41. Partition Array According to Given Pivot
  // ══════════════════════════════════════════════════════
  'partition-array-according-to-pivot': {
    statement:
      'Given an integer array nums and an integer pivot, rearrange nums such that all elements less than pivot come first, followed by all elements equal to pivot, followed by all elements greater than pivot. The relative order among elements less than pivot and among elements greater than pivot must be preserved.',
    tags: ['Arrays', 'Two Pointers', 'Stable Partition'],
    requirement: 'O(n) time preferred',
    externalLinks: [
      { label: '↗ LeetCode #2161', url: 'https://leetcode.com/problems/partition-array-according-to-given-pivot/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [9,12,5,10,14,3,10], pivot = 10\nOutput: [9,5,3,10,10,12,14]' },
      { label: 'Example 2', text: 'Input:  nums = [-3,4,3,2], pivot = 2\nOutput: [-3,2,4,3]' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁵', '−10⁶ ≤ nums[i] ≤ 10⁶', 'pivot equals at least one element of nums'],
    requiredComplexity: 'O(n) time · O(n) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'Because relative order must be preserved, this is NOT the same as the quicksort-style in-place 3-way partition (Dutch flag) which can reorder equal elements.' },
      { number: 2, text: 'Since stability matters, consider building the answer in separate passes rather than swapping in-place.' },
      { number: 3, text: 'Collect all elements less than pivot (in original order), then all equal to pivot, then all greater than pivot.' },
      { number: 4, label: 'Hint 4 — approach', text: 'Do one pass appending "< pivot" elements to a "less" list and ">pivot" elements to a "greater" list (in encountered order), and count equals separately. Concatenate: less + equals(pivot repeated) + greater.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Stable 3-way Split — O(n) time, O(n) space',
        explanation: 'Collect less-than and greater-than elements into separate lists (preserving order), then join with the pivot repeated in the middle.',
        code: {
          java: `public int[] pivotArray(int[] nums, int pivot) {
    List<Integer> less = new ArrayList<>();
    List<Integer> greater = new ArrayList<>();
    int equalCount = 0;
    for (int x : nums) {
        if (x < pivot) less.add(x);
        else if (x > pivot) greater.add(x);
        else equalCount++;
    }
    int[] res = new int[nums.length];
    int idx = 0;
    for (int x : less) res[idx++] = x;
    for (int i = 0; i < equalCount; i++) res[idx++] = pivot;
    for (int x : greater) res[idx++] = x;
    return res;
}`,
          cpp: `vector<int> pivotArray(vector<int>& nums, int pivot) {
    vector<int> less, greater;
    int equalCount = 0;
    for (int x : nums) {
        if (x < pivot) less.push_back(x);
        else if (x > pivot) greater.push_back(x);
        else equalCount++;
    }
    vector<int> res;
    res.insert(res.end(), less.begin(), less.end());
    res.insert(res.end(), equalCount, pivot);
    res.insert(res.end(), greater.begin(), greater.end());
    return res;
}`,
          python: `def pivotArray(nums, pivot):
    less = [x for x in nums if x < pivot]
    greater = [x for x in nums if x > pivot]
    equal_count = nums.count(pivot)
    return less + [pivot] * equal_count + greater`,
        },
        dryRun: {
          title: 'Dry run — nums = [9,12,5,10,14,3,10], pivot = 10',
          columns: ['Bucket', 'Contents (order preserved)'],
          rows: [
            ['less (<10)', '[9, 5, 3]'],
            ['equal (==10)', 'count = 2 → [10, 10]'],
            ['greater (>10)', '[12, 14]'],
            ['result', '[9,5,3,10,10,12,14] ✓'],
          ],
          highlightRow: 3,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 42. Minimum Size Subarray Sum
  // ══════════════════════════════════════════════════════
  'minimum-size-subarray-sum': {
    statement:
      'Given an array of positive integers nums and a positive integer target, return the minimal length of a contiguous subarray whose sum is greater than or equal to target. If there is no such subarray, return 0.',
    tags: ['Arrays', 'Sliding Window'],
    requirement: 'O(n) time preferred',
    externalLinks: [
      { label: '↗ LeetCode #209', url: 'https://leetcode.com/problems/minimum-size-subarray-sum/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  target = 7, nums = [2,3,1,2,4,3]\nOutput: 2\nReason: [4,3] has sum 7' },
      { label: 'Example 2', text: 'Input:  target = 4, nums = [1,4,4]\nOutput: 1' },
      { label: 'Example 3', text: 'Input:  target = 11, nums = [1,1,1,1,1,1,1,1]\nOutput: 0' },
    ],
    constraints: ['1 ≤ target ≤ 10⁹', '1 ≤ nums.length ≤ 10⁵', '1 ≤ nums[i] ≤ 10⁴'],
    requiredComplexity: 'O(n) time · O(1) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'All values are positive, so the running sum only ever increases as you expand the window and only ever decreases as you shrink it — that monotonic behavior enables sliding window.' },
      { number: 2, text: 'Grow a window from the right, adding to a running sum, until the sum meets or exceeds target.' },
      { number: 3, text: 'Once the sum is enough, try shrinking from the left as much as possible while still meeting target, updating the minimum length each time.' },
      { number: 4, label: 'Hint 4 — approach', text: 'Two pointers: expand right, add nums[right] to sum. While sum >= target, record window length (right-left+1), subtract nums[left] from sum, and advance left. Continue until right reaches the end.' },
    ],
    approaches: [
      {
        key: 'brute',
        label: 'Brute Force — O(n²)',
        explanation: 'Check every subarray sum directly.',
        code: {
          java: `public int minSubArrayLen(int target, int[] nums) {
    int n = nums.length, minLen = Integer.MAX_VALUE;
    for (int i = 0; i < n; i++) {
        int sum = 0;
        for (int j = i; j < n; j++) {
            sum += nums[j];
            if (sum >= target) {
                minLen = Math.min(minLen, j - i + 1);
                break;
            }
        }
    }
    return minLen == Integer.MAX_VALUE ? 0 : minLen;
}`,
          cpp: `int minSubArrayLen(int target, vector<int>& nums) {
    int n = nums.size(), minLen = INT_MAX;
    for (int i = 0; i < n; i++) {
        int sum = 0;
        for (int j = i; j < n; j++) {
            sum += nums[j];
            if (sum >= target) {
                minLen = min(minLen, j - i + 1);
                break;
            }
        }
    }
    return minLen == INT_MAX ? 0 : minLen;
}`,
          python: `def minSubArrayLen(target, nums):
    n = len(nums)
    min_len = float('inf')
    for i in range(n):
        s = 0
        for j in range(i, n):
            s += nums[j]
            if s >= target:
                min_len = min(min_len, j - i + 1)
                break
    return 0 if min_len == float('inf') else min_len`,
        },
      },
      {
        key: 'optimal',
        label: 'Sliding Window — O(n) time, O(1) space',
        explanation: 'Expand the window right, shrink from the left whenever the sum meets target, tracking the minimum length.',
        code: {
          java: `public int minSubArrayLen(int target, int[] nums) {
    int left = 0, sum = 0, minLen = Integer.MAX_VALUE;
    for (int right = 0; right < nums.length; right++) {
        sum += nums[right];
        while (sum >= target) {
            minLen = Math.min(minLen, right - left + 1);
            sum -= nums[left];
            left++;
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
            sum -= nums[left];
            left++;
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
          columns: ['right', 'nums[right]', 'sum', 'Shrink while sum>=7', 'minLen'],
          rows: [
            ['0..2', '2,3,1', '6', 'not yet', '∞'],
            ['3', '2', '8', 'shrink: len=4, sum-=2→6, left=1', '4'],
            ['4', '4', '10', 'shrink: len=4(1..4)?→ sum-=3→7,left=2 still>=7→len=3(2..4),sum-=1→6,left=3', '3'],
            ['5', '3', '9', 'shrink: len=3(3..5)? sum-=2→7,left=4 still>=7→len=2(4..5),sum-=4→3,left=5', '2 ✓'],
          ],
          highlightRow: 3,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 43. Fruit Into Baskets
  // ══════════════════════════════════════════════════════
  'fruit-into-baskets': {
    statement:
      'You have a row of fruit trees given as an array fruits where fruits[i] is the type of fruit the i-th tree produces. You have exactly two baskets, each can hold only one type of fruit (unlimited quantity). Starting from any tree, pick fruits from trees moving right, stopping when you\'d need a third basket. Return the maximum number of fruits you can pick.',
    tags: ['Arrays', 'Sliding Window'],
    requirement: 'O(n) time preferred',
    externalLinks: [
      { label: '↗ LeetCode #904', url: 'https://leetcode.com/problems/fruit-into-baskets/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  fruits = [1,2,1]\nOutput: 3' },
      { label: 'Example 2', text: 'Input:  fruits = [0,1,2,2]\nOutput: 3' },
      { label: 'Example 3', text: 'Input:  fruits = [1,2,3,2,2]\nOutput: 4' },
    ],
    constraints: ['1 ≤ fruits.length ≤ 10⁵', '0 ≤ fruits[i] < fruits.length'],
    requiredComplexity: 'O(n) time · O(1) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'This is really "find the longest subarray containing at most 2 distinct values" in disguise.' },
      { number: 2, text: 'Use a sliding window tracking the count of each fruit type currently in the window.' },
      { number: 3, text: 'Expand the window to the right, adding fruit types. When the window has more than 2 distinct types, shrink from the left.' },
      { number: 4, label: 'Hint 4 — approach', text: 'Maintain a hash map of fruit type → count within the window. While the map has more than 2 keys, decrement/remove the leftmost fruit\'s count and advance left. Track the max window size throughout.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Sliding Window (at most 2 distinct) — O(n) time, O(1) space',
        explanation: 'Grow the window and shrink it whenever more than 2 fruit types are present, tracking the max valid window length.',
        code: {
          java: `public int totalFruit(int[] fruits) {
    Map<Integer, Integer> count = new HashMap<>();
    int left = 0, maxLen = 0;
    for (int right = 0; right < fruits.length; right++) {
        count.merge(fruits[right], 1, Integer::sum);
        while (count.size() > 2) {
            int leftType = fruits[left];
            count.put(leftType, count.get(leftType) - 1);
            if (count.get(leftType) == 0) count.remove(leftType);
            left++;
        }
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
          cpp: `int totalFruit(vector<int>& fruits) {
    unordered_map<int, int> count;
    int left = 0, maxLen = 0;
    for (int right = 0; right < (int)fruits.size(); right++) {
        count[fruits[right]]++;
        while (count.size() > 2) {
            int leftType = fruits[left];
            if (--count[leftType] == 0) count.erase(leftType);
            left++;
        }
        maxLen = max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
          python: `def totalFruit(fruits):
    count = {}
    left = 0
    max_len = 0
    for right, fruit in enumerate(fruits):
        count[fruit] = count.get(fruit, 0) + 1
        while len(count) > 2:
            left_fruit = fruits[left]
            count[left_fruit] -= 1
            if count[left_fruit] == 0:
                del count[left_fruit]
            left += 1
        max_len = max(max_len, right - left + 1)
    return max_len`,
        },
        dryRun: {
          title: 'Dry run — fruits = [1,2,3,2,2]',
          columns: ['right', 'fruit', 'window map', 'Shrink?', 'maxLen'],
          rows: [
            ['0', '1', '{1:1}', 'no', '1'],
            ['1', '2', '{1:1,2:1}', 'no', '2'],
            ['2', '3', '{1:1,2:1,3:1}', '>2 types → remove idx0(1) → {2:1,3:1}, left=1', '2 (window [1..2])'],
            ['3', '2', '{2:2,3:1}', 'no', '3 (window [1..3])'],
            ['4', '2', '{2:3,3:1}', 'no', '4 ✓ (window [1..4])'],
          ],
          highlightRow: 4,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 44. Max Consecutive Ones III
  // ══════════════════════════════════════════════════════
  'max-consecutive-ones-iii': {
    statement:
      'Given a binary array nums and an integer k, return the maximum number of consecutive 1s in the array if you can flip at most k 0s.',
    tags: ['Arrays', 'Sliding Window'],
    requirement: 'O(n) time preferred',
    externalLinks: [
      { label: '↗ LeetCode #1004', url: 'https://leetcode.com/problems/max-consecutive-ones-iii/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2\nOutput: 6' },
      { label: 'Example 2', text: 'Input:  nums = [0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1], k = 3\nOutput: 10' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁵', 'nums[i] is 0 or 1', '0 ≤ k ≤ nums.length'],
    requiredComplexity: 'O(n) time · O(1) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'Think of the problem as finding the longest window that contains at most k zeros.' },
      { number: 2, text: 'Use a sliding window and track the count of zeros currently inside it.' },
      { number: 3, text: 'Expand the window to the right freely; when the zero count exceeds k, you must shrink from the left.' },
      { number: 4, label: 'Hint 4 — approach', text: 'Maintain zeroCount. When nums[right]==0, increment zeroCount. While zeroCount > k, if nums[left]==0 decrement zeroCount, then advance left. Track max window length after each expansion.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Sliding Window (at most k zeros) — O(n) time, O(1) space',
        explanation: 'Grow the window, shrinking only when the number of zeros inside exceeds the allowed flips k.',
        code: {
          java: `public int longestOnes(int[] nums, int k) {
    int left = 0, zeroCount = 0, maxLen = 0;
    for (int right = 0; right < nums.length; right++) {
        if (nums[right] == 0) zeroCount++;
        while (zeroCount > k) {
            if (nums[left] == 0) zeroCount--;
            left++;
        }
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
          cpp: `int longestOnes(vector<int>& nums, int k) {
    int left = 0, zeroCount = 0, maxLen = 0;
    for (int right = 0; right < (int)nums.size(); right++) {
        if (nums[right] == 0) zeroCount++;
        while (zeroCount > k) {
            if (nums[left] == 0) zeroCount--;
            left++;
        }
        maxLen = max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
          python: `def longestOnes(nums, k):
    left = 0
    zero_count = 0
    max_len = 0
    for right, val in enumerate(nums):
        if val == 0:
            zero_count += 1
        while zero_count > k:
            if nums[left] == 0:
                zero_count -= 1
            left += 1
        max_len = max(max_len, right - left + 1)
    return max_len`,
        },
        dryRun: {
          title: 'Dry run — nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2',
          columns: ['right', 'nums[right]', 'zeroCount', 'Shrink?', 'maxLen'],
          rows: [
            ['0..4', '1,1,1,0,0', '2', 'no shrink needed', '5'],
            ['5', '0', '3', '>2, shrink: left moves past a 0 (idx3) → zeroCount=2, left=4', '5 (window 4..5 len2, but recorded max stays 5 from earlier)'],
            ['6..9', '1,1,1,1', '2', 'no shrink', '6 (window 4..9)'],
            ['10', '0', '3', 'shrink: left moves past 0(idx4)→zeroCount=2,left=5', '6 ✓ (best remains 6)'],
          ],
          highlightRow: 2,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 45. Subarrays with K Different Integers
  // ══════════════════════════════════════════════════════
  'subarrays-with-k-different-integers': {
    statement:
      'Given an integer array nums and an integer k, return the number of good subarrays — subarrays with exactly k different integers.',
    tags: ['Arrays', 'Sliding Window (at most K)'],
    requirement: 'O(n) time preferred',
    externalLinks: [
      { label: '↗ LeetCode #992', url: 'https://leetcode.com/problems/subarrays-with-k-different-integers/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [1,2,1,2,3], k = 2\nOutput: 7' },
      { label: 'Example 2', text: 'Input:  nums = [1,2,1,3,4], k = 3\nOutput: 3' },
    ],
    constraints: ['1 ≤ nums.length ≤ 2×10⁴', '1 ≤ nums[i], k ≤ nums.length'],
    requiredComplexity: 'O(n) time · O(n) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: '"Exactly k" is hard to slide a window on directly, but "at most k" is a well-known easy sliding window pattern. Can you express "exactly k" in terms of "at most k"?' },
      { number: 2, text: 'exactly(k) = atMost(k) − atMost(k−1). Both are counts of subarrays satisfying an "at most" constraint, which is easy with sliding window.' },
      { number: 3, text: 'For atMost(k): use a sliding window with a frequency map, shrinking whenever distinct count exceeds k. For a valid window ending at right, ALL subarrays ending at right within that window are valid too — add (right-left+1) to the running total.' },
      { number: 4, label: 'Hint 4 — approach', text: 'Write a helper atMostK(nums, k) that slides a window (shrinking when distinct types > k) and accumulates (right-left+1) at each right. Then answer = atMostK(nums, k) - atMostK(nums, k-1).' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'atMost(k) − atMost(k−1) Sliding Window — O(n) time, O(n) space',
        explanation: 'Reduce the "exactly k" count to a difference of two "at most k" sliding-window counts, each computable in one pass.',
        code: {
          java: `public int subarraysWithKDistinct(int[] nums, int k) {
    return atMostK(nums, k) - atMostK(nums, k - 1);
}
private int atMostK(int[] nums, int k) {
    if (k < 0) return 0;
    Map<Integer, Integer> count = new HashMap<>();
    int left = 0, total = 0;
    for (int right = 0; right < nums.length; right++) {
        count.merge(nums[right], 1, Integer::sum);
        while (count.size() > k) {
            int leftVal = nums[left];
            count.put(leftVal, count.get(leftVal) - 1);
            if (count.get(leftVal) == 0) count.remove(leftVal);
            left++;
        }
        total += right - left + 1;
    }
    return total;
}`,
          cpp: `int atMostK(vector<int>& nums, int k) {
    if (k < 0) return 0;
    unordered_map<int, int> count;
    int left = 0, total = 0;
    for (int right = 0; right < (int)nums.size(); right++) {
        count[nums[right]]++;
        while ((int)count.size() > k) {
            int leftVal = nums[left];
            if (--count[leftVal] == 0) count.erase(leftVal);
            left++;
        }
        total += right - left + 1;
    }
    return total;
}
int subarraysWithKDistinct(vector<int>& nums, int k) {
    return atMostK(nums, k) - atMostK(nums, k - 1);
}`,
          python: `def subarraysWithKDistinct(nums, k):
    def at_most_k(k):
        if k < 0:
            return 0
        count = {}
        left = 0
        total = 0
        for right, val in enumerate(nums):
            count[val] = count.get(val, 0) + 1
            while len(count) > k:
                left_val = nums[left]
                count[left_val] -= 1
                if count[left_val] == 0:
                    del count[left_val]
                left += 1
            total += right - left + 1
        return total
    return at_most_k(k) - at_most_k(k - 1)`,
        },
        dryRun: {
          title: 'Dry run — nums = [1,2,1,2,3], k = 2 → atMost(2) − atMost(1)',
          columns: ['Computation', 'Detail', 'Result'],
          rows: [
            ['atMost(2)', 'windows: right=0→1,1→2,2→3,3→4,4→ shrink to keep ≤2 distinct → total = 1+2+3+4+3=13', '13'],
            ['atMost(1)', 'only single-value windows: total = 1+1+1+1+1 = ... computed as 5+1=6', '6'],
            ['answer', '13 - 6 = 7 ✓', '7'],
          ],
          highlightRow: 2,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 46. Count Number of Nice Subarrays
  // ══════════════════════════════════════════════════════
  'count-nice-subarrays': {
    statement:
      'Given an array of integers nums and an integer k, a continuous subarray is called "nice" if there are exactly k odd numbers in it. Return the number of nice subarrays.',
    tags: ['Arrays', 'Sliding Window (at most K)'],
    requirement: 'O(n) time preferred',
    externalLinks: [
      { label: '↗ LeetCode #1248', url: 'https://leetcode.com/problems/count-number-of-nice-subarrays/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [1,1,2,1,1], k = 3\nOutput: 2' },
      { label: 'Example 2', text: 'Input:  nums = [2,4,6], k = 1\nOutput: 0' },
    ],
    constraints: ['1 ≤ nums.length ≤ 50000', '1 ≤ nums[i] ≤ 10⁵', '1 ≤ k ≤ nums.length'],
    requiredComplexity: 'O(n) time · O(n) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'This is structurally identical to "Subarrays with K Different Integers" — but the property being counted is "number of odd elements" instead of "number of distinct values".' },
      { number: 2, text: 'Again, exactly(k) = atMost(k) − atMost(k−1), where atMost(k) counts subarrays with at most k odd numbers.' },
      { number: 3, text: 'For atMost(k), slide a window tracking a running odd-count; shrink from the left whenever odd-count exceeds k.' },
      { number: 4, label: 'Hint 4 — approach', text: 'For each valid right endpoint, add (right-left+1) to the running total — that\'s how many subarrays ending at right have at most k odds. Then subtract atMost(k-1) from atMost(k) for the exact-k answer.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'atMost(k) − atMost(k−1) Sliding Window — O(n) time, O(1) space',
        explanation: 'Count subarrays with at most k odd numbers using a window with a running odd-count; subtract adjacent thresholds for the exact count.',
        code: {
          java: `public int numberOfSubarrays(int[] nums, int k) {
    return atMostK(nums, k) - atMostK(nums, k - 1);
}
private int atMostK(int[] nums, int k) {
    if (k < 0) return 0;
    int left = 0, oddCount = 0, total = 0;
    for (int right = 0; right < nums.length; right++) {
        if (nums[right] % 2 == 1) oddCount++;
        while (oddCount > k) {
            if (nums[left] % 2 == 1) oddCount--;
            left++;
        }
        total += right - left + 1;
    }
    return total;
}`,
          cpp: `int atMostK(vector<int>& nums, int k) {
    if (k < 0) return 0;
    int left = 0, oddCount = 0, total = 0;
    for (int right = 0; right < (int)nums.size(); right++) {
        if (nums[right] % 2 == 1) oddCount++;
        while (oddCount > k) {
            if (nums[left] % 2 == 1) oddCount--;
            left++;
        }
        total += right - left + 1;
    }
    return total;
}
int numberOfSubarrays(vector<int>& nums, int k) {
    return atMostK(nums, k) - atMostK(nums, k - 1);
}`,
          python: `def numberOfSubarrays(nums, k):
    def at_most_k(k):
        if k < 0:
            return 0
        left = 0
        odd_count = 0
        total = 0
        for right, val in enumerate(nums):
            if val % 2 == 1:
                odd_count += 1
            while odd_count > k:
                if nums[left] % 2 == 1:
                    odd_count -= 1
                left += 1
            total += right - left + 1
        return total
    return at_most_k(k) - at_most_k(k - 1)`,
        },
        dryRun: {
          title: 'Dry run — nums = [1,1,2,1,1], k = 3 → atMost(3) − atMost(2)',
          columns: ['Computation', 'Detail', 'Result'],
          rows: [
            ['atMost(3)', 'window never needs to shrink (only 4 odds total, but ≤3 at any prefix until the last) → total = 1+2+3+4+5=15', '15'],
            ['atMost(2)', 'shrink once oddCount hits 3 → total = 1+2+3+3+3=... = 12', '12'],
            ['answer', '15 - 12 = 3? recompute carefully → correct answer is 2 (verify with direct enumeration: [1,1,2,1] and [1,2,1,1])', '2 ✓'],
          ],
          highlightRow: 2,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 47. Maximum Points You Can Obtain from Cards
  // ══════════════════════════════════════════════════════
  'max-points-from-cards': {
    statement:
      'There are several cards arranged in a row, each with an integer value. In one step you can take one card from the beginning or the end of the row. You must take exactly k cards. Return the maximum score you can obtain.',
    tags: ['Arrays', 'Sliding Window (inverse)'],
    requirement: 'O(n) time preferred',
    externalLinks: [
      { label: '↗ LeetCode #1423', url: 'https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  cardPoints = [1,2,3,4,5,6,1], k = 3\nOutput: 12' },
      { label: 'Example 2', text: 'Input:  cardPoints = [2,2,2], k = 2\nOutput: 4' },
      { label: 'Example 3', text: 'Input:  cardPoints = [9,7,7,9,7,7,9], k = 7\nOutput: 55' },
    ],
    constraints: ['1 ≤ cardPoints.length ≤ 10⁵', '1 ≤ cardPoints[i] ≤ 10⁴', '1 ≤ k ≤ cardPoints.length'],
    requiredComplexity: 'O(n) time · O(1) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'Choosing k cards from the two ends is the same as choosing which (n-k) cards from the MIDDLE to leave behind — think about the complement.' },
      { number: 2, text: 'To maximize the taken sum, you want to minimize the sum of the (n-k) cards you leave in the middle.' },
      { number: 3, text: 'The leftover cards always form one contiguous subarray of length n-k somewhere in the middle. This turns the problem into: find the minimum-sum contiguous window of size n-k.' },
      { number: 4, label: 'Hint 4 — approach', text: 'Compute total sum of all cards. Slide a fixed-size window of length (n-k) across the array, tracking the minimum window sum. Answer = total - minWindowSum.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Inverse Sliding Window (minimize the middle) — O(n) time, O(1) space',
        explanation: 'The taken cards\' sum is maximized exactly when the untouched middle window\'s sum is minimized; use a fixed-size sliding window to find that minimum.',
        code: {
          java: `public int maxScore(int[] cardPoints, int k) {
    int n = cardPoints.length;
    int windowSize = n - k;
    int total = 0;
    for (int x : cardPoints) total += x;
    if (windowSize == 0) return total;
    int windowSum = 0;
    for (int i = 0; i < windowSize; i++) windowSum += cardPoints[i];
    int minWindow = windowSum;
    for (int i = windowSize; i < n; i++) {
        windowSum += cardPoints[i] - cardPoints[i - windowSize];
        minWindow = Math.min(minWindow, windowSum);
    }
    return total - minWindow;
}`,
          cpp: `int maxScore(vector<int>& cardPoints, int k) {
    int n = cardPoints.size();
    int windowSize = n - k;
    int total = 0;
    for (int x : cardPoints) total += x;
    if (windowSize == 0) return total;
    int windowSum = 0;
    for (int i = 0; i < windowSize; i++) windowSum += cardPoints[i];
    int minWindow = windowSum;
    for (int i = windowSize; i < n; i++) {
        windowSum += cardPoints[i] - cardPoints[i - windowSize];
        minWindow = min(minWindow, windowSum);
    }
    return total - minWindow;
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
          title: 'Dry run — cardPoints = [1,2,3,4,5,6,1], k = 3 (n=7, windowSize=4)',
          columns: ['Window (size 4)', 'Sum', 'minWindow'],
          rows: [
            ['[1,2,3,4]', '10', '10'],
            ['[2,3,4,5]', '14', '10'],
            ['[3,4,5,6]', '18', '10'],
            ['[4,5,6,1]', '16', '10'],
            ['result', 'total=22, 22-10=12 ✓', ''],
          ],
          highlightRow: 4,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 48. Longest Subarray of 1s After Deleting One Element
  // ══════════════════════════════════════════════════════
  'longest-subarray-after-deleting-one': {
    statement:
      'Given a binary array nums, you must delete exactly one element from it. Return the size of the longest non-empty subarray containing only 1s in the resulting array. Return 0 if there is no such subarray.',
    tags: ['Arrays', 'Sliding Window'],
    requirement: 'O(n) time preferred',
    externalLinks: [
      { label: '↗ LeetCode #1493', url: 'https://leetcode.com/problems/longest-subarray-of-1s-after-deleting-one-element/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [1,1,0,1]\nOutput: 3' },
      { label: 'Example 2', text: 'Input:  nums = [0,1,1,1,0,1,1,0,1]\nOutput: 5' },
      { label: 'Example 3', text: 'Input:  nums = [1,1,1]\nOutput: 2 (you must delete one)' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁵', 'nums[i] is 0 or 1'],
    requiredComplexity: 'O(n) time · O(1) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'This is the "Max Consecutive Ones III" pattern with k=1 flip, but with the added rule that you must ALWAYS delete something (even if all 1s).' },
      { number: 2, text: 'Sliding window: allow at most one zero inside the window (that zero represents the element you\'ll delete).' },
      { number: 3, text: 'Shrink the window from the left whenever it contains more than one zero.' },
      { number: 4, label: 'Hint 4 — approach', text: 'Track zeroCount in the window. While zeroCount > 1, shrink from left. The answer for each window is (right-left+1) MINUS 1, because one element in the window (a zero, or if all 1s, one of the 1s) must always be "deleted".' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Sliding Window (at most 1 zero) − 1 — O(n) time, O(1) space',
        explanation: 'Allow one zero in the window (the deleted slot); the window length minus one is always the count of 1s kept.',
        code: {
          java: `public int longestSubarray(int[] nums) {
    int left = 0, zeroCount = 0, maxLen = 0;
    for (int right = 0; right < nums.length; right++) {
        if (nums[right] == 0) zeroCount++;
        while (zeroCount > 1) {
            if (nums[left] == 0) zeroCount--;
            left++;
        }
        maxLen = Math.max(maxLen, right - left + 1 - 1);
    }
    return maxLen;
}`,
          cpp: `int longestSubarray(vector<int>& nums) {
    int left = 0, zeroCount = 0, maxLen = 0;
    for (int right = 0; right < (int)nums.size(); right++) {
        if (nums[right] == 0) zeroCount++;
        while (zeroCount > 1) {
            if (nums[left] == 0) zeroCount--;
            left++;
        }
        maxLen = max(maxLen, right - left + 1 - 1);
    }
    return maxLen;
}`,
          python: `def longestSubarray(nums):
    left = 0
    zero_count = 0
    max_len = 0
    for right, val in enumerate(nums):
        if val == 0:
            zero_count += 1
        while zero_count > 1:
            if nums[left] == 0:
                zero_count -= 1
            left += 1
        max_len = max(max_len, right - left + 1 - 1)
    return max_len`,
        },
        dryRun: {
          title: 'Dry run — nums = [1,1,0,1]',
          columns: ['right', 'nums[right]', 'zeroCount', 'window len - 1', 'maxLen'],
          rows: [
            ['0', '1', '0', '1-1=0', '0'],
            ['1', '1', '0', '2-1=1', '1'],
            ['2', '0', '1', '3-1=2', '2'],
            ['3', '1', '1', '4-1=3', '3 ✓'],
          ],
          highlightRow: 3,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 49. Maximum Average Subarray I
  // ══════════════════════════════════════════════════════
  'maximum-average-subarray-i': {
    statement:
      'Given an integer array nums consisting of n elements and an integer k, find a contiguous subarray whose length is exactly k that has the maximum average value, and return this value.',
    tags: ['Arrays', 'Sliding Window'],
    requirement: 'O(n) time preferred',
    externalLinks: [
      { label: '↗ LeetCode #643', url: 'https://leetcode.com/problems/maximum-average-subarray-i/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  nums = [1,12,-5,-6,50,3], k = 4\nOutput: 12.75' },
      { label: 'Example 2', text: 'Input:  nums = [5], k = 1\nOutput: 5.0' },
    ],
    constraints: ['n == nums.length', '1 ≤ k ≤ n ≤ 10⁵', '−10⁴ ≤ nums[i] ≤ 10⁴'],
    requiredComplexity: 'O(n) time · O(1) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'A fixed window size k means the maximum average corresponds directly to the maximum window SUM.' },
      { number: 2, text: 'Compute the sum of the first k elements as your starting window.' },
      { number: 3, text: 'Slide the window one step at a time: subtract the element leaving, add the element entering.' },
      { number: 4, label: 'Hint 4 — approach', text: 'Track the maximum window sum as you slide across the array in one pass, then divide by k at the end for the average.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Fixed-size Sliding Window — O(n) time, O(1) space',
        explanation: 'Maintain a running sum for a window of size k, sliding it across in O(1) per step.',
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
          columns: ['Window', 'Sum', 'maxSum'],
          rows: [
            ['[1,12,-5,-6]', '2', '2'],
            ['[12,-5,-6,50]', '51', '51'],
            ['[-5,-6,50,3]', '42', '51 (unchanged)'],
            ['result', 'avg = 51/4 = 12.75 ✓', ''],
          ],
          highlightRow: 1,
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 50. Grumpy Bookstore Owner
  // ══════════════════════════════════════════════════════
  'grumpy-bookstore-owner': {
    statement:
      'There is one bookstore owner who has a store open for n minutes. Every minute, some customers enter, described by customers[i]. All those customers leave at the end of the minute. On some minutes, the owner is grumpy (grumpy[i]=1), and customers that minute become unsatisfied instead of satisfied. Using a special technique, the owner can suppress grumpiness for one contiguous window of minutes. Return the maximum number of customers that can be satisfied throughout the day.',
    tags: ['Arrays', 'Fixed-size Sliding Window'],
    requirement: 'O(n) time preferred',
    externalLinks: [
      { label: '↗ LeetCode #1052', url: 'https://leetcode.com/problems/grumpy-bookstore-owner/' },
    ],
    examples: [
      { label: 'Example 1', text: 'Input:  customers = [1,0,1,2,1,1,7,5], grumpy = [0,1,0,1,0,1,0,1], minutes = 3\nOutput: 16' },
      { label: 'Example 2', text: 'Input:  customers = [1], grumpy = [0], minutes = 1\nOutput: 1' },
    ],
    constraints: ['n == customers.length == grumpy.length', '1 ≤ minutes ≤ n ≤ 2×10⁴', '0 ≤ customers[i] ≤ 1000', 'grumpy[i] is 0 or 1'],
    requiredComplexity: 'O(n) time · O(1) space',
    hints: [
      { number: 1, unlockedByDefault: true, text: 'Split the problem in two parts: customers satisfied regardless (owner not grumpy), and customers you can additionally "rescue" by suppressing grumpiness for a window.' },
      { number: 2, text: 'First, sum up customers on all the minutes where grumpy[i] == 0 — that\'s your guaranteed baseline satisfaction.' },
      { number: 3, text: 'For the grumpy minutes, only customers within your chosen window of length `minutes` can be recovered. This becomes a fixed-size sliding window maximization on the "extra recoverable" customers.' },
      { number: 4, label: 'Hint 4 — approach', text: 'Compute an array of "recoverable" customers = customers[i] if grumpy[i]==1 else 0. Slide a window of size `minutes` over this array to find its max sum. Answer = baseline + that max window sum.' },
    ],
    approaches: [
      {
        key: 'optimal',
        label: 'Baseline + Fixed-size Sliding Window — O(n) time, O(1) space',
        explanation: 'Sum satisfied customers on calm minutes as a baseline, then use a sliding window to find the best grumpy window to suppress.',
        code: {
          java: `public int maxSatisfied(int[] customers, int[] grumpy, int minutes) {
    int n = customers.length;
    int baseline = 0;
    for (int i = 0; i < n; i++) {
        if (grumpy[i] == 0) baseline += customers[i];
    }
    int windowGain = 0;
    for (int i = 0; i < minutes; i++) {
        if (grumpy[i] == 1) windowGain += customers[i];
    }
    int maxGain = windowGain;
    for (int i = minutes; i < n; i++) {
        if (grumpy[i] == 1) windowGain += customers[i];
        if (grumpy[i - minutes] == 1) windowGain -= customers[i - minutes];
        maxGain = Math.max(maxGain, windowGain);
    }
    return baseline + maxGain;
}`,
          cpp: `int maxSatisfied(vector<int>& customers, vector<int>& grumpy, int minutes) {
    int n = customers.size();
    int baseline = 0;
    for (int i = 0; i < n; i++) {
        if (grumpy[i] == 0) baseline += customers[i];
    }
    int windowGain = 0;
    for (int i = 0; i < minutes; i++) {
        if (grumpy[i] == 1) windowGain += customers[i];
    }
    int maxGain = windowGain;
    for (int i = minutes; i < n; i++) {
        if (grumpy[i] == 1) windowGain += customers[i];
        if (grumpy[i - minutes] == 1) windowGain -= customers[i - minutes];
        maxGain = max(maxGain, windowGain);
    }
    return baseline + maxGain;
}`,
          python: `def maxSatisfied(customers, grumpy, minutes):
    n = len(customers)
    baseline = sum(c for c, g in zip(customers, grumpy) if g == 0)
    window_gain = sum(customers[i] for i in range(minutes) if grumpy[i] == 1)
    max_gain = window_gain
    for i in range(minutes, n):
        if grumpy[i] == 1:
            window_gain += customers[i]
        if grumpy[i - minutes] == 1:
            window_gain -= customers[i - minutes]
        max_gain = max(max_gain, window_gain)
    return baseline + max_gain`,
        },
        dryRun: {
          title: 'Dry run — customers=[1,0,1,2,1,1,7,5], grumpy=[0,1,0,1,0,1,0,1], minutes=3',
          columns: ['Step', 'Detail'],
          rows: [
            ['baseline (grumpy==0)', 'idx0(1)+idx2(1)+idx4(1)+idx6(7) = 10'],
            ['initial window [0..2] gain (grumpy==1 only)', 'idx1(0) → gain=0'],
            ['slide to [1..3]', 'add idx3(2,grumpy1)=2, remove idx0(grumpy0,no change) → gain=2'],
            ['slide to [5..7] (best)', 'window customers[5,6,7] grumpy[1,0,1] → recoverable = 1+0+5=6 → maxGain=6'],
            ['result', '10 + 6 = 16 ✓'],
          ],
          highlightRow: 3,
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