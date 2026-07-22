// codeExecutor/harness/python.js — Python code wrapper.
//
// Cleanest of the three harnesses — Python has json module built-in, no
// need to embed a parser. User writes `class Solution: def method(self, ...)`,
// harness appends code that:
//   1. Reads stdin as JSON
//   2. Instantiates Solution
//   3. Calls the method with **unpacked kwargs
//   4. Prints json.dumps(result)
//
// PYTHON-SPECIFIC:
//   - Uses List[int] etc. from typing (imported by harness for user's convenience)
//   - Handles both list-return and int/str/bool-return uniformly via json.dumps
//   - No type coercion needed — Python is dynamically typed

export function wrapPython({ userCode, testCase, problemSpec }) {
  const { functionName, paramOrder } = problemSpec;

  // For Python, we don't need per-param type parsing — just unpack the
  // dict directly. Python figures out types at runtime.
  const argExtraction = paramOrder
    .map((name) => `    ${name} = test_input["${name}"]`)
    .join('\n');

  const argList = paramOrder.join(', ');

  const harness = `
import json
import sys
from typing import List, Dict, Optional, Tuple, Set

${USER_CODE_MARKER_START}
${userCode}
${USER_CODE_MARKER_END}

def _run_test():
    raw_input = sys.stdin.read()
    test_input = json.loads(raw_input)

${argExtraction}

    solution = Solution()
    result = solution.${functionName}(${argList})

    # Print result as JSON on the last line of output.
    # Debug prints from user code stay above this and are ignored by the
    # output parser (which reads only the last non-empty line).
    print(json.dumps(result, default=_json_default))

def _json_default(obj):
    """Fallback JSON encoder for types like sets, tuples."""
    if isinstance(obj, (set, frozenset)):
        return list(obj)
    if isinstance(obj, tuple):
        return list(obj)
    return str(obj)

if __name__ == "__main__":
    _run_test()
`.trim();

  return {
    fullCode: harness,
    stdin: JSON.stringify(testCase.input),
  };
}

const USER_CODE_MARKER_START = '# ═══ USER CODE START ═══';
const USER_CODE_MARKER_END = '# ═══ USER CODE END ═══';