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
// To add a new one: copy the 'two-sum' shape below and fill it in for another
// problem from problems.js (match the `id` exactly).

export const problemDetails = {
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
      {
        label: 'Example 1',
        text: 'Input:  nums = [2, 7, 11, 15], target = 9\nOutput: [0, 1]\nReason: nums[0] + nums[1] = 2 + 7 = 9',
      },
      {
        label: 'Example 2',
        text: 'Input:  nums = [3, 2, 4], target = 6\nOutput: [1, 2]',
      },
    ],
    constraints: [
      '2 ≤ nums.length ≤ 10⁴',
      '−10⁹ ≤ nums[i] ≤ 10⁹',
      '−10⁹ ≤ target ≤ 10⁹',
    ],
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
        code: `function twoSum(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
}`,
      },
      {
        key: 'optimal',
        label: 'Optimal — O(n)',
        explanation: 'Use a hash map to store seen values. For each element, check if its complement already exists.',
        code: `function twoSum(nums, target) {
  const map = new Map();   // value → index
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
}`,
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
};

export function getProblemDetails(id) {
  return problemDetails[id] || null;
}