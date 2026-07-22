// TestResultsPanel.jsx — displays test results after Run/Submit.
//
// Two zones:
//   1. Case tabs at top — [Case 1] [Case 2] [Case 3] [Custom]
//      Each tab colored by status: green=pass, red=fail, gray=not run yet
//   2. Active case detail below — input, expected, actual, runtime
//
// STATES:
//   - Idle (no run yet): shows visible cases from problem spec, no results
//   - Running: shows spinner overlay
//   - Ran (Run button): shows results for visible cases only
//   - Submitted: shows results for ALL cases (visible + hidden)
//     Hidden cases show only pass/fail — inputs and expected are NOT revealed
//   - Compile/runtime error: shows error message instead of case detail
//
// CUSTOM TAB:
//   Extra tab where user can paste JSON input to test their code against
//   arbitrary inputs. Doesn't count toward submission. Only shows result
//   for THAT input.

import { useState, useEffect } from 'react';

export default function TestResultsPanel({
  visibleTestCases,   // array of { id, input, expected, isHidden: false }
  results,            // array of { testId, passed, actualOutput, expected, error, ... } | null
  isRunning,          // bool
  isSubmitting,       // bool (true = show hidden cases too)
  executorError,      // top-level executor error string | null
  compileError,       // compile error string | null
  onCustomRun,        // (customInput) => void
  customRunResult,    // { passed, actualOutput, error } | null
}) {
  const [activeCaseId, setActiveCaseId] = useState(null);
  const [customInput, setCustomInput] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  // On results change, auto-select first failing case (or first case)
  useEffect(() => {
    if (!results || results.length === 0) {
      if (visibleTestCases.length > 0) {
        setActiveCaseId(visibleTestCases[0].id);
      }
      return;
    }
    const firstFail = results.find((r) => !r.passed && !r.isHidden);
    if (firstFail) {
      setActiveCaseId(firstFail.testId);
    } else {
      setActiveCaseId(results[0].testId);
    }
  }, [results, visibleTestCases]);

  // ─── Top-level executor error ───────────────────────────────
  if (executorError) {
    return (
      <div className="test-results-panel">
        <div className="test-results-error">
          <div className="test-results-error-header">⚠ Executor error</div>
          <div className="test-results-error-body">{executorError}</div>
          <div className="test-results-error-hint">
            The code execution service may be down or rate-limited. Try again in a moment.
          </div>
        </div>
      </div>
    );
  }

  // ─── Compile error ──────────────────────────────────────────
  if (compileError) {
    return (
      <div className="test-results-panel">
        <div className="test-results-error test-results-error-compile">
          <div className="test-results-error-header">✗ Compile error</div>
          <pre className="test-results-error-code">{compileError}</pre>
        </div>
      </div>
    );
  }

  // Build case list — visible cases always shown, plus hidden ones if submitted
  const casesToShow = isSubmitting && results
    ? results.map((r) => ({
        id: r.testId,
        isHidden: r.isHidden,
        input: r.input,
        expected: r.expected,
      }))
    : visibleTestCases;

  const activeCase = casesToShow.find((c) => c.id === activeCaseId);
  const activeResult = results?.find((r) => r.testId === activeCaseId);
  const isCustomActive = showCustom;

  return (
    <div className="test-results-panel">
      {/* ─── Test case tabs ─── */}
      <div className="test-case-tabs">
        {casesToShow.map((tc) => {
          const result = results?.find((r) => r.testId === tc.id);
          let statusClass = '';
          if (result) statusClass = result.passed ? 'passed' : 'failed';

          const isActive = !isCustomActive && activeCaseId === tc.id;

          return (
            <button
              key={tc.id}
              type="button"
              className={`test-case-tab ${statusClass} ${isActive ? 'active' : ''}`}
              onClick={() => {
                setActiveCaseId(tc.id);
                setShowCustom(false);
              }}
              title={tc.isHidden ? `Hidden test ${tc.id}` : `Test case ${tc.id}`}
            >
              {tc.isHidden && '🔒 '}Case {tc.id}
              {result && (
                <span className="test-case-tab-icon">
                  {result.passed ? '✓' : '✗'}
                </span>
              )}
            </button>
          );
        })}
        <button
          type="button"
          className={`test-case-tab ${isCustomActive ? 'active' : ''}`}
          onClick={() => setShowCustom(true)}
          title="Test with your own input"
        >
          + Custom
        </button>
      </div>

      {/* ─── Loading overlay ─── */}
      {isRunning && (
        <div className="test-results-loading">
          <div className="test-results-loading-spinner" />
          <div>Running your code...</div>
        </div>
      )}

      {/* ─── Case detail ─── */}
      {!isRunning && !isCustomActive && activeCase && (
        <CaseDetail
          testCase={activeCase}
          result={activeResult}
          isSubmitted={isSubmitting}
        />
      )}

      {/* ─── Custom input view ─── */}
      {!isRunning && isCustomActive && (
        <CustomInputView
          customInput={customInput}
          onInputChange={setCustomInput}
          onRun={() => onCustomRun(customInput)}
          result={customRunResult}
        />
      )}

      {/* ─── Empty state ─── */}
      {!isRunning && !activeCase && !isCustomActive && (
        <div className="test-results-empty">
          Hit Run to test your code against the sample cases.
        </div>
      )}
    </div>
  );
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

function CaseDetail({ testCase, result, isSubmitted }) {
  // For hidden cases on submission, don't reveal input/expected
  const revealDetails = !testCase.isHidden || !isSubmitted;

  return (
    <div className="case-detail">
      {/* Status banner */}
      {result && (
        <div className={`case-status ${result.passed ? 'passed' : 'failed'}`}>
          <span className="case-status-icon">
            {result.passed ? '✓' : '✗'}
          </span>
          <span className="case-status-text">
            {result.passed ? 'Passed' : (result.errorType === 'tle' ? 'Time Limit Exceeded' : (result.errorType === 'runtime' ? 'Runtime Error' : 'Wrong Answer'))}
          </span>
          {result.time > 0 && (
            <span className="case-status-time">{Math.round(result.time)}ms</span>
          )}
        </div>
      )}

      {/* Runtime error detail */}
      {result?.error && result.errorType === 'runtime' && (
        <div className="case-section">
          <div className="case-section-label">Error output</div>
          <pre className="case-error-block">{result.error}</pre>
        </div>
      )}

      {revealDetails ? (
        <>
          <div className="case-section">
            <div className="case-section-label">Input</div>
            <pre className="case-value-block">{formatValue(testCase.input)}</pre>
          </div>
          <div className="case-section">
            <div className="case-section-label">Expected</div>
            <pre className="case-value-block">{formatValue(testCase.expected)}</pre>
          </div>
          {result && result.actualOutput !== null && result.actualOutput !== undefined && (
            <div className="case-section">
              <div className="case-section-label">Your output</div>
              <pre className={`case-value-block ${result.passed ? 'passed' : 'failed'}`}>
                {formatValue(result.actualOutput)}
              </pre>
            </div>
          )}
        </>
      ) : (
        <div className="case-hidden-notice">
          🔒 Hidden test case — input and expected output not shown.
        </div>
      )}
    </div>
  );
}

function CustomInputView({ customInput, onInputChange, onRun, result }) {
  return (
    <div className="case-detail case-custom">
      <div className="case-section">
        <div className="case-section-label">
          Custom input (JSON object matching problem params)
        </div>
        <textarea
          className="case-custom-textarea"
          value={customInput}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={'{"nums": [2, 7, 11, 15], "target": 9}'}
          rows={4}
          spellCheck={false}
        />
        <button
          type="button"
          className="btn btn-sm btn-primary"
          onClick={onRun}
          style={{ marginTop: 8 }}
          disabled={!customInput.trim()}
        >
          Run with custom input
        </button>
      </div>

      {result && (
        <>
          <div className="case-section">
            <div className="case-section-label">Output</div>
            <pre className="case-value-block">
              {result.error ? result.error : formatValue(result.actualOutput)}
            </pre>
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================
// HELPERS
// ============================================================

// formatValue — JSON.stringify with light pretty-printing for arrays.
// Uses 2-space indent for objects, but keeps arrays on single line if short.
function formatValue(v) {
  if (v === null || v === undefined) return 'null';
  if (typeof v === 'string') return `"${v}"`;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  try {
    const short = JSON.stringify(v);
    if (short.length <= 60) return short;
    return JSON.stringify(v, null, 2);
  } catch {
    return String(v);
  }
}