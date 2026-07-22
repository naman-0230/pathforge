// TestResultsPanel.jsx — displays test results after Run/Submit.
//
// STATES:
//   - Idle (no run yet): shows visible cases from problem spec, no results
//   - Running: shows spinner overlay
//   - Ran (Run button): shows results for visible cases only
//   - Submitted: shows ALL cases (visible + hidden) with pass/fail
//     Hidden failed cases: user can see they failed, but input/expected stay hidden
//   - Compile/runtime error: replaces case detail with error message
//
// OVERALL STATUS BANNER (new):
//   When submission completes, shows a prominent banner at top:
//     - All passed → "✅ Accepted — All 7 tests passed"
//     - Some failed → "❌ Rejected — 4/7 tests passed"
//     - Compile error → "❌ Compile Error"
//   This is separate from per-case pass/fail below.

import { useState, useEffect } from 'react';

export default function TestResultsPanel({
  visibleTestCases,
  results,
  isRunning,
  isSubmitting,
  executorError,
  compileError,
  onCustomRun,
  customRunResult,
}) {
  const [activeCaseId, setActiveCaseId] = useState(null);
  const [customInput, setCustomInput] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  useEffect(() => {
    if (!results || results.length === 0) {
      if (visibleTestCases.length > 0) {
        setActiveCaseId(visibleTestCases[0].id);
      }
      return;
    }
    // Auto-select first failing case (visible OR hidden)
    const firstFail = results.find((r) => !r.passed);
    if (firstFail) {
      setActiveCaseId(firstFail.testId);
    } else {
      setActiveCaseId(results[0].testId);
    }
  }, [results, visibleTestCases]);

  // ─── Executor error ─────────────────────────────────────────
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
        <div className="test-results-overall-banner overall-banner-error">
          <span className="overall-banner-icon">❌</span>
          <span className="overall-banner-text">Compile Error</span>
        </div>
        <div className="test-results-error test-results-error-compile">
          <div className="test-results-error-header">Compilation failed</div>
          <pre className="test-results-error-code">{compileError}</pre>
        </div>
      </div>
    );
  }

  // Build case list — visible cases when idle/running, ALL cases when results exist
  // (results contains both visible and hidden, so we render tabs for all of them)
  const casesToShow = results && results.length > 0
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

  // Overall status calculation
  const overallStatus = (() => {
    if (!results || results.length === 0) return null;
    const passed = results.filter((r) => r.passed).length;
    const total = results.length;
    const allPassed = passed === total;
    return {
      accepted: allPassed,
      passed,
      total,
      hasTle: results.some((r) => r.errorType === 'tle'),
      hasRuntime: results.some((r) => r.errorType === 'runtime'),
    };
  })();

  return (
    <div className="test-results-panel">
      {/* Overall status banner — only shown after Run/Submit */}
      {overallStatus && (
        <div className={`test-results-overall-banner ${overallStatus.accepted ? 'overall-banner-success' : 'overall-banner-error'}`}>
          <span className="overall-banner-icon">
            {overallStatus.accepted ? '✅' : '❌'}
          </span>
          <span className="overall-banner-text">
            {overallStatus.accepted
              ? `Accepted — All ${overallStatus.total} tests passed`
              : `${isSubmitting ? 'Submission Rejected' : 'Wrong Answer'} — ${overallStatus.passed}/${overallStatus.total} passed`}
          </span>
          {overallStatus.hasTle && !overallStatus.accepted && (
            <span className="overall-banner-note">· includes TLE</span>
          )}
          {overallStatus.hasRuntime && !overallStatus.accepted && (
            <span className="overall-banner-note">· includes runtime error</span>
          )}
        </div>
      )}

      {/* Case tabs */}
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

      {/* Loading overlay */}
      {isRunning && (
        <div className="test-results-loading">
          <div className="test-results-loading-spinner" />
          <div>Running your code...</div>
        </div>
      )}

      {/* Case detail */}
      {!isRunning && !isCustomActive && activeCase && (
        <CaseDetail
          testCase={activeCase}
          result={activeResult}
          isSubmitted={isSubmitting}
        />
      )}

      {/* Custom input */}
      {!isRunning && isCustomActive && (
        <CustomInputView
          customInput={customInput}
          onInputChange={setCustomInput}
          onRun={() => onCustomRun(customInput)}
          result={customRunResult}
        />
      )}

      {/* Empty state */}
      {!isRunning && !activeCase && !isCustomActive && (
        <div className="test-results-empty">
          Hit Run to test your code against the sample cases.
        </div>
      )}
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────

function CaseDetail({ testCase, result, isSubmitted }) {
  const revealDetails = !testCase.isHidden || !isSubmitted;

  return (
    <div className="case-detail">
      {/* Per-case status */}
      {result && (
        <div className={`case-status ${result.passed ? 'passed' : 'failed'}`}>
          <span className="case-status-icon">
            {result.passed ? '✓' : '✗'}
          </span>
          <span className="case-status-text">
            {result.passed
              ? 'Passed'
              : (result.errorType === 'tle'
                ? 'Time Limit Exceeded'
                : (result.errorType === 'runtime'
                  ? 'Runtime Error'
                  : 'Wrong Answer'))}
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
          {result && !result.passed && (
            <div style={{ marginTop: 8, color: 'var(--red, #e35b5b)', fontWeight: 500 }}>
              This case failed. Review your logic for edge cases like empty inputs,
              duplicates, negatives, or boundary values.
            </div>
          )}
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
        <div className="case-section">
          <div className="case-section-label">Output</div>
          <pre className="case-value-block">
            {result.error ? result.error : formatValue(result.actualOutput)}
          </pre>
        </div>
      )}
    </div>
  );
}

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