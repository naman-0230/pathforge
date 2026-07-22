import { useState, useEffect, useRef } from 'react';
import CodeEditor from './CodeEditor';
import TestResultsPanel from './TestResultsPanel';
import Button from './Button';
import { executeCode } from '../utils/codeExecutor';
import {
  getSavedCode,
  saveCode,
  resetCode,
  getLastLanguageForProblem,
  setLastLanguageForProblem,
} from '../utils/codeEditorState.js';
import { getVisibleTestCases } from '../utils/testCaseLoader.js';
import { loadJSON, saveJSON } from '../utils/storage.js';

const LANGUAGE_OPTIONS = [
  { value: 'cpp', label: 'C++' },
  { value: 'java', label: 'Java' },
  { value: 'python', label: 'Python' },
];

const AUTOSAVE_DEBOUNCE_MS = 800;

function resultsCollapseKey(problemId) {
  return `pathforge:codeEditor:${problemId}:resultsCollapsed`;
}

export default function CodeEditorPanel({
  problemId,
  topicKey,
  testCaseSpec,
  timerDisplay,
  timerRunning,
  timerHasStarted,
  onToggleTimer,
  onAccepted,
  onSubmission,
}) {
  const [language, setLanguage] = useState(() => getLastLanguageForProblem(problemId));
  const [code, setCode] = useState('');

  useEffect(() => {
    const saved = getSavedCode(problemId, language);
    if (saved !== null) {
      setCode(saved);
    } else {
      setCode(testCaseSpec?.starterCode?.[language] || '');
    }
  }, [problemId, language, testCaseSpec]);

  const saveTimer = useRef(null);
  useEffect(() => {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveCode(problemId, language, code);
    }, AUTOSAVE_DEBOUNCE_MS);
    return () => clearTimeout(saveTimer.current);
  }, [code, problemId, language]);

  const [results, setResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executorError, setExecutorError] = useState(null);
  const [compileError, setCompileError] = useState(null);
  const [customRunResult, setCustomRunResult] = useState(null);

  // Test results collapsed state — persists per problem
  // Default: collapsed (start with editor at full height)
  const [resultsCollapsed, setResultsCollapsed] = useState(() => {
    const saved = loadJSON(resultsCollapseKey(problemId), true);
    return saved;
  });

  useEffect(() => {
    saveJSON(resultsCollapseKey(problemId), resultsCollapsed);
  }, [resultsCollapsed, problemId]);

  // Auto-expand when new results come in (user just clicked Run/Submit)
  useEffect(() => {
    if (results || executorError || compileError) {
      setResultsCollapsed(false);
    }
  }, [results, executorError, compileError]);

  const visibleTestCases = getVisibleTestCases(testCaseSpec);
  const hasHiddenTests = testCaseSpec?.testCases?.some((tc) => tc.isHidden);

  function handleLanguageChange(newLang) {
    saveCode(problemId, language, code);
    setLanguage(newLang);
    setLastLanguageForProblem(problemId, newLang);
    setResults(null);
    setCompileError(null);
    setExecutorError(null);
  }

  function handleReset() {
    if (!window.confirm(`Reset your ${language.toUpperCase()} code for this problem to the starter template?`)) return;
    resetCode(problemId, language);
    setCode(testCaseSpec?.starterCode?.[language] || '');
    setResults(null);
    setCompileError(null);
    setExecutorError(null);
  }

  async function handleRun() {
    if (isRunning || isSubmitting) return;
    setIsRunning(true);
    setResults(null);
    setCompileError(null);
    setExecutorError(null);
    setResultsCollapsed(false); // ensure visible while running

    try {
      const result = await executeCode({
        language,
        code,
        testCases: visibleTestCases,
        problemSpec: testCaseSpec,
      });

      if (result.error) {
        setExecutorError(result.error);
      } else if (result.status === 'compile_error') {
        setCompileError(result.results[0]?.error || 'Compile error');
      } else {
        setResults(result.results);
      }

      onSubmission?.({
        problemId,
        language,
        submissionType: 'run',
        status: result.status,
        passedCount: result.results.filter((r) => r.passed).length,
        totalCount: result.results.length,
        executionTimeMs: result.totalTime,
        codeSnippet: code,
        firstFailedTestId: result.results.find((r) => !r.passed)?.testId ?? null,
      });
    } catch (err) {
      setExecutorError(err.message || String(err));
    } finally {
      setIsRunning(false);
    }
  }

  async function handleSubmit() {
    if (isRunning || isSubmitting) return;
    setIsSubmitting(true);
    setResults(null);
    setCompileError(null);
    setExecutorError(null);
    setResultsCollapsed(false);

    try {
      const result = await executeCode({
        language,
        code,
        testCases: testCaseSpec.testCases,
        problemSpec: testCaseSpec,
      });

      if (result.error) {
        setExecutorError(result.error);
      } else if (result.status === 'compile_error') {
        setCompileError(result.results[0]?.error || 'Compile error');
      } else {
        setResults(result.results);
      }

      onSubmission?.({
        problemId,
        language,
        submissionType: 'submit',
        status: result.status,
        passedCount: result.results.filter((r) => r.passed).length,
        totalCount: result.results.length,
        executionTimeMs: result.totalTime,
        codeSnippet: code,
        firstFailedTestId: result.results.find((r) => !r.passed)?.testId ?? null,
      });

      if (result.status === 'accepted') {
        onAccepted?.({
          language,
          submissionCount: 1,
          totalTests: result.results.length,
          timeMs: result.totalTime,
        });
      }
    } catch (err) {
      setExecutorError(err.message || String(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCustomRun(customInputStr) {
    setCustomRunResult(null);

    let customInput;
    try {
      customInput = JSON.parse(customInputStr);
    } catch (e) {
      setCustomRunResult({
        passed: null,
        actualOutput: null,
        error: `Invalid JSON: ${e.message}`,
      });
      return;
    }

    const customCase = {
      id: 'custom',
      input: customInput,
      expected: null,
      isHidden: false,
    };

    try {
      const result = await executeCode({
        language,
        code,
        testCases: [customCase],
        problemSpec: testCaseSpec,
      });

      const first = result.results[0];
      setCustomRunResult({
        passed: null,
        actualOutput: first?.actualOutput,
        error: first?.error || result.error,
      });
    } catch (err) {
      setCustomRunResult({
        passed: null,
        actualOutput: null,
        error: err.message,
      });
    }
  }

  // Summary text for collapsed results bar
  const resultsSummary = (() => {
    if (isRunning || isSubmitting) return 'Running...';
    if (executorError) return '⚠ Executor error';
    if (compileError) return '✗ Compile error';
    if (results) {
      const passed = results.filter((r) => r.passed).length;
      const total = results.length;
      const allPassed = passed === total;
      return `${allPassed ? '✅' : '❌'} ${passed}/${total} passed`;
    }
    return 'Not run yet';
  })();

  const hasAnyResults = results || executorError || compileError;

  return (
    <div className={`code-editor-panel ${resultsCollapsed ? 'results-collapsed' : ''}`}>
      {/* Header */}
      <div className="code-editor-header">
        <div className="code-editor-lang-picker">
          <label className="code-editor-lang-label">Language:</label>
          <select
            className="code-editor-lang-select"
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
          >
            {LANGUAGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        {timerDisplay && (
          <div className="code-editor-timer-cluster">
            <span className="code-editor-timer-display">⏱ {timerDisplay}</span>
            <button
              type="button"
              className="btn btn-sm code-editor-timer-btn"
              onClick={onToggleTimer}
            >
              {timerRunning ? '⏸ Stop' : timerHasStarted ? '▶ Resume' : '▶ Start'}
            </button>
          </div>
        )}
      </div>

      {/* Editor — grows when results collapsed */}
      <div className="code-editor-body">
        <CodeEditor
          value={code}
          onChange={setCode}
          language={language}
        />
      </div>

      {/* Actions */}
      <div className="code-editor-actions">
        <Button size="sm" onClick={handleRun} disabled={isRunning || isSubmitting}>
          {isRunning ? 'Running...' : '▶ Run'}
        </Button>
        <Button size="sm" variant="primary" onClick={handleSubmit} disabled={isRunning || isSubmitting}>
          {isSubmitting ? 'Submitting...' : `Submit${hasHiddenTests ? ' (all tests)' : ''}`}
        </Button>
        <Button size="sm" onClick={handleReset} disabled={isRunning || isSubmitting} style={{ marginLeft: 'auto' }}>
          Reset code
        </Button>
      </div>

      {/* Results — collapsible */}
      <div className={`code-editor-results-wrapper ${resultsCollapsed ? 'collapsed' : 'expanded'}`}>
        <button
          type="button"
          className="code-editor-results-toggle"
          onClick={() => setResultsCollapsed((c) => !c)}
          title={resultsCollapsed ? 'Expand test results' : 'Collapse to gain editor space'}
        >
          <span className="code-editor-results-toggle-chevron">
            {resultsCollapsed ? '▶' : '▼'}
          </span>
          <span className="code-editor-results-toggle-label">Test Results</span>
          <span className="code-editor-results-toggle-summary">{resultsSummary}</span>
        </button>

        {!resultsCollapsed && (
          <div className="code-editor-results">
            <TestResultsPanel
              visibleTestCases={visibleTestCases}
              results={results}
              isRunning={isRunning || isSubmitting}
              isSubmitting={isSubmitting && !!results}
              executorError={executorError}
              compileError={compileError}
              onCustomRun={handleCustomRun}
              customRunResult={customRunResult}
            />
          </div>
        )}
      </div>
    </div>
  );
}