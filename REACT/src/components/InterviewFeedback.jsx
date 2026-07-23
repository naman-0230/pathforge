// InterviewFeedback — displays the auto-generated post-session summary.
//
// SCORE + VERDICT are based on editor test results only. Approach, timing,
// and reflection are shown as secondary signals but don't inflate the score.
//
// PER-PROBLEM BREAKDOWN shows objective outcome per problem:
//   ✅ Passed        — all editor test cases passed
//   ❌ Failed        — some test cases failed
//   ⚠  Compile Error — code didn't compile
//   ⊘ Not attempted  — no code submitted
//
// Approach + reflection status shown as secondary badges next to outcome.

export default function InterviewFeedback({ feedback, session }) {
  const { verdict, strengths, improvements, score, counts = {}, outcomes = [] } = feedback;
  const { problems, perProblemMetrics = [], reflections = [] } = session;

  const verdictColor =
    verdict.tone === 'positive' ? 'var(--green, #3fae63)'
    : verdict.tone === 'critical' ? 'var(--red, #e35b5b)'
    : 'var(--amber, #d9a441)';

  const total = counts.total ?? problems.length;
  const passed = counts.passed ?? 0;

  return (
    <div className="interview-feedback">
      <div className="interview-feedback-header">
        <div className="interview-feedback-verdict" style={{ color: verdictColor }}>
          {verdict.text}
        </div>
        <div className="interview-feedback-score">
          Session score: <strong>{score}/100</strong>
        </div>
      </div>

      <div className="interview-feedback-stats">
        <StatBlock label="Problems passed" value={`${passed}/${total}`} />
        <StatBlock label="Duration used" value={`${Math.floor((session.timeSpentMs || 0) / 60000)} min`} />
        {counts.notAttempted > 0 && (
          <StatBlock label="Not attempted" value={counts.notAttempted} tone="critical" />
        )}
        {counts.compileError > 0 && (
          <StatBlock label="Compile errors" value={counts.compileError} tone="warn" />
        )}
        {counts.failed > 0 && (
          <StatBlock label="Failed tests" value={counts.failed} tone="warn" />
        )}
      </div>

      <div className="interview-feedback-section">
        <div className="interview-feedback-section-title" style={{ color: 'var(--green, #3fae63)' }}>
          ✓ Strengths
        </div>
        <ul className="interview-feedback-list">
          {strengths.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </div>

      <div className="interview-feedback-section">
        <div className="interview-feedback-section-title" style={{ color: 'var(--amber, #d9a441)' }}>
          ⚠ Areas to improve
        </div>
        <ul className="interview-feedback-list">
          {improvements.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </div>

      <div className="interview-feedback-per-problem">
        <div className="interview-feedback-section-title">Per-problem breakdown</div>
        {problems.map((p, i) => {
          const outcome = outcomes[i] || {};
          const m = perProblemMetrics[i] || {};
          const reflection = reflections[i] || {};
          const reflected = !!(reflection.gotRight?.trim().length > 0);

          return (
            <div key={p.id} className="interview-feedback-problem-row">
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="interview-feedback-problem-name">
                  <OutcomeStatus status={outcome.status} editorResult={outcome.editorResult} />
                  <span style={{ marginLeft: 8 }}>{p.name}</span>
                </div>
                <div className="interview-feedback-problem-meta">
                  {p.topicLabel} · {p.difficulty}
                </div>
              </div>

              {/* Secondary signals — approach + timing + reflection */}
              <div className="interview-feedback-problem-secondary">
                <SecondaryBadge
                  ok={m.approachWritten}
                  okText="Approach written"
                  notText="No approach"
                />
                {m.timeToApproachMs != null && (
                  <span className="interview-feedback-secondary-note">
                    {Math.round(m.timeToApproachMs / 1000)}s to approach
                  </span>
                )}
                <SecondaryBadge
                  ok={reflected}
                  okText="Reflected"
                  notText="No reflection"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────

function OutcomeStatus({ status, editorResult }) {
  if (status === 'passed') {
    return (
      <span className="outcome-badge outcome-passed" title="All test cases passed in editor">
        ✅ Passed
        {editorResult?.language && (
          <span style={{ opacity: 0.8, marginLeft: 4, fontSize: 10 }}>
            {editorResult.language.toUpperCase()}
          </span>
        )}
      </span>
    );
  }
  if (status === 'compile_error') {
    return (
      <span className="outcome-badge outcome-compile-error" title="Code failed to compile">
        ⚠ Compile Error
      </span>
    );
  }
  if (status === 'failed') {
    return (
      <span className="outcome-badge outcome-failed" title={`Failed ${(editorResult?.totalTests || 0) - (editorResult?.passedTests || 0)} of ${editorResult?.totalTests || 0} test cases`}>
        ❌ Failed
        {editorResult?.totalTests && (
          <span style={{ opacity: 0.8, marginLeft: 4, fontSize: 10 }}>
            {editorResult.passedTests}/{editorResult.totalTests}
          </span>
        )}
      </span>
    );
  }
  return (
    <span className="outcome-badge outcome-not-attempted" title="No code submitted">
      ⊘ Not attempted
    </span>
  );
}

function SecondaryBadge({ ok, okText, notText }) {
  return (
    <span className={`secondary-badge ${ok ? 'secondary-ok' : 'secondary-not'}`}>
      {ok ? '✓ ' : '⊘ '}
      {ok ? okText : notText}
    </span>
  );
}

function StatBlock({ label, value, tone }) {
  const valueColor =
    tone === 'critical' ? 'var(--red, #e35b5b)'
    : tone === 'warn' ? 'var(--amber, #d9a441)'
    : 'var(--text-high)';

  return (
    <div className="interview-feedback-stat">
      <div className="interview-feedback-stat-value" style={{ color: valueColor }}>
        {value}
      </div>
      <div className="interview-feedback-stat-label">{label}</div>
    </div>
  );
}