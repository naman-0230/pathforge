// codeExecutor/index.js — public API for running user code against test cases.
//
// This is the ONE file the rest of the app imports. Everything about
// which executor (Piston / Judge0 / self-hosted) and how each language
// wraps user code is hidden behind this interface.
//
// PUBLIC API:
//   executeCode({ language, code, testCases, problemSpec })
//     → { status, results, totalTime, error }
//
//   Where:
//     language     'cpp' | 'java' | 'python'
//     code         user's `class Solution { ... }` source
//     testCases    array of { id, input, expected, isHidden }
//     problemSpec  { functionName, className, returnType } — from test case JSON
//
//   Returns:
//     status       'accepted' | 'wrong_answer' | 'compile_error' | 'runtime_error' | 'tle' | 'executor_error'
//     results      array of per-test-case { testId, passed, actualOutput, expected, error, time }
//     totalTime    sum of execution times across cases (ms)
//     error        top-level error string if executor itself failed
//
// SWAP MECHANISM:
//   VITE_CODE_EXECUTOR_ADAPTER env var selects the adapter at build time.
//   Defaults to 'piston' if unset — meaning fresh clones work out of box.
//   Change to 'judge0' when you upgrade + set VITE_JUDGE0_KEY.

import { pistonAdapter } from './adapters/piston.js';
import { judge0Adapter } from './adapters/judge0.js';
import { wrapCpp } from './harness/cpp.js';
import { wrapJava } from './harness/java.js';
import { wrapPython } from './harness/python.js';

// ============================================================
// ADAPTER SELECTION
// ============================================================

const ADAPTER_NAME = import.meta.env.VITE_CODE_EXECUTOR_ADAPTER || 'piston';

const ADAPTERS = {
  piston: pistonAdapter,
  judge0: judge0Adapter,
};

const activeAdapter = ADAPTERS[ADAPTER_NAME];

if (!activeAdapter) {
  console.error(`[codeExecutor] Unknown adapter: ${ADAPTER_NAME}. Falling back to piston.`);
}

const executor = activeAdapter || pistonAdapter;

// ============================================================
// HARNESS ROUTING
// ============================================================

const HARNESSES = {
  cpp: wrapCpp,
  java: wrapJava,
  python: wrapPython,
};

// ============================================================
// PUBLIC API — executeCode
// ============================================================

// executeCode — runs user code against all provided test cases.
// Each test case is executed as a separate submission (Piston/Judge0 don't
// support batch runs). Total time = sum of individual execution times.
//
// FLOW PER TEST CASE:
//   1. Wrap user code with language-specific harness (adds main()/entry point
//      that reads test input from stdin, calls the Solution method, prints
//      result as JSON to stdout)
//   2. Send to executor with test input as stdin
//   3. Parse stdout as JSON = actual output
//   4. Deep-compare actual vs expected
//   5. Record pass/fail
//
// EARLY EXIT:
//   If a test case has a compile error, we don't retry — return immediately
//   with compile_error status. Runtime errors are per-case; we continue to
//   the next case (some inputs might work, others crash).
export async function executeCode({ language, code, testCases, problemSpec }) {
  const wrap = HARNESSES[language];
  if (!wrap) {
    return {
      status: 'executor_error',
      results: [],
      totalTime: 0,
      error: `Unsupported language: ${language}`,
    };
  }

  if (!testCases || testCases.length === 0) {
    return {
      status: 'executor_error',
      results: [],
      totalTime: 0,
      error: 'No test cases provided',
    };
  }

  const results = [];
  let totalTime = 0;
  let hadCompileError = false;

  for (const testCase of testCases) {
    // Wrap user code + prepare stdin for this specific test case
    const { fullCode, stdin } = wrap({ userCode: code, testCase, problemSpec });

    let response;
    try {
      response = await executor.execute({
        language,
        code: fullCode,
        stdin,
      });
    } catch (err) {
      return {
        status: 'executor_error',
        results,
        totalTime,
        error: `Executor request failed: ${err.message || String(err)}`,
      };
    }

    // Compile error — no point running remaining tests, they'll all fail
    if (response.compileError) {
      hadCompileError = true;
      results.push({
        testId: testCase.id,
        passed: false,
        actualOutput: null,
        expected: testCase.expected,
        input: testCase.input,
        isHidden: testCase.isHidden,
        error: response.compileError,
        errorType: 'compile',
        time: 0,
      });
      break;
    }

    // Runtime error on this specific test case — record and continue
    if (response.runtimeError) {
      results.push({
        testId: testCase.id,
        passed: false,
        actualOutput: null,
        expected: testCase.expected,
        input: testCase.input,
        isHidden: testCase.isHidden,
        error: response.runtimeError,
        errorType: 'runtime',
        time: response.time || 0,
      });
      totalTime += response.time || 0;
      continue;
    }

    // Timeout (TLE)
    if (response.timedOut) {
      results.push({
        testId: testCase.id,
        passed: false,
        actualOutput: null,
        expected: testCase.expected,
        input: testCase.input,
        isHidden: testCase.isHidden,
        error: 'Time limit exceeded',
        errorType: 'tle',
        time: response.time || 0,
      });
      totalTime += response.time || 0;
      continue;
    }

    // Try to parse stdout as JSON. User code is expected to print the
    // JSON-encoded result on the last line (harness handles this).
    let actualOutput;
    try {
      actualOutput = parseOutput(response.stdout);
    } catch (parseErr) {
      results.push({
        testId: testCase.id,
        passed: false,
        actualOutput: response.stdout,
        expected: testCase.expected,
        input: testCase.input,
        isHidden: testCase.isHidden,
        error: `Could not parse output as JSON. Your code printed:\n${response.stdout?.slice(0, 200)}`,
        errorType: 'output_format',
        time: response.time || 0,
      });
      totalTime += response.time || 0;
      continue;
    }

    // Compare — deep equality on arrays, exact match on primitives
    const passed = deepEqual(actualOutput, testCase.expected);

    results.push({
      testId: testCase.id,
      passed,
      actualOutput,
      expected: testCase.expected,
      input: testCase.input,
      isHidden: testCase.isHidden,
      error: null,
      time: response.time || 0,
    });
    totalTime += response.time || 0;
  }

  // Determine overall status
  let status;
  if (hadCompileError) {
    status = 'compile_error';
  } else if (results.some((r) => r.errorType === 'tle')) {
    status = 'tle';
  } else if (results.some((r) => r.errorType === 'runtime')) {
    status = 'runtime_error';
  } else if (results.every((r) => r.passed)) {
    status = 'accepted';
  } else {
    status = 'wrong_answer';
  }

  return { status, results, totalTime, error: null };
}

// ============================================================
// HELPERS
// ============================================================

// parseOutput — extracts the JSON result from user's program stdout.
// Harness code always prints the JSON result on the LAST non-empty line
// (before any trailing whitespace). Any prints from user's debug code
// go before it. This lets users use print()/cout/System.out for debugging
// without breaking output parsing.
function parseOutput(stdout) {
  if (!stdout || typeof stdout !== 'string') {
    throw new Error('Empty output');
  }
  const lines = stdout.trim().split('\n').filter((l) => l.trim().length > 0);
  if (lines.length === 0) throw new Error('No output lines');
  const lastLine = lines[lines.length - 1].trim();
  return JSON.parse(lastLine);
}

// deepEqual — recursively compare two values. Handles arrays, objects,
// primitives, and null. Order matters for arrays (LeetCode-style problems
// where order is significant like Two Sum indices).
//
// For problems where order doesn't matter (e.g. "return any valid answer"),
// the test case JSON should specify `compareMode: 'unordered'` and we'll
// sort both sides before comparing. Not implemented yet — v2 feature.
function deepEqual(a, b) {
  if (a === b) return true;
  if (a === null || b === null) return a === b;
  if (typeof a !== typeof b) return false;

  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  if (typeof a === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const k of keysA) {
      if (!deepEqual(a[k], b[k])) return false;
    }
    return true;
  }

  // Numbers with floating-point tolerance (rare in DSA but possible)
  if (typeof a === 'number' && typeof b === 'number') {
    return Math.abs(a - b) < 1e-9;
  }

  return false;
}

// ============================================================
// DIAGNOSTIC EXPORT — for showing adapter status in dev UI (optional)
// ============================================================

export function getExecutorInfo() {
  return {
    adapter: ADAPTER_NAME,
    available: !!activeAdapter,
  };
}