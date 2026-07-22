# Test Cases

Each problem that supports the code editor has a `.json` file here.
Adding a file automatically enables the code editor for that problem
(assuming its `problems.js` entry has `codeEditorSupported: true`).

## File naming

Filename must match the problem's ID slug from `problems.js`.
Example: problem ID `two-sum` → file `two-sum.json`.

## Schema

```json
{
  "problemId": "two-sum",
  "functionName": "twoSum",
  "className": "Solution",
  "paramOrder": ["nums", "target"],
  "paramTypes": {
    "nums": "int[]",
    "target": "int"
  },
  "returnType": "int[]",
  "starterCode": {
    "cpp":    "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // your code here\n    }\n};",
    "java":   "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // your code here\n    }\n}",
    "python": "class Solution:\n    def twoSum(self, nums, target):\n        # your code here\n        pass"
  },
  "testCases": [
    {
      "id": 1,
      "input": { "nums": [2, 7, 11, 15], "target": 9 },
      "expected": [0, 1],
      "isHidden": false
    },
    {
      "id": 2,
      "input": { "nums": [3, 2, 4], "target": 6 },
      "expected": [1, 2],
      "isHidden": true
    }
  ]
}