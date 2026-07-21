// InterviewFeedback — displays the auto-generated post-session summary.
// Split into verdict / strengths / improvements sections with clear
// visual hierarchy so users can absorb it quickly.

export default function InterviewFeedback({ feedback, session }) {
  const { verdict, strengths, improvements, score } = feedback;
  const { problems, perProblemMetrics = [] } = session;

  const verdictColor =
    verdict.tone === 'positive' ? 'var(--green, #3fae63)'
    : verdict.tone === 'critical' ? 'var(--red, #e35b5b)'
    : 'var(--amber, #d9a441)';

  const attempted = perProblemMetrics.filter((m) => m.approachWritten).length;

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
        <StatBlock label="Problems attempted" value={`${attempted}/${problems.length}`} />
        <StatBlock label="Duration used" value={`${Math.floor((session.timeSpentMs || 0) / 60000)} min`} />
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
          const m = perProblemMetrics[i] || {};
          return (
            <div key={p.id} className="interview-feedback-problem-row">
              <div>
                <div className="interview-feedback-problem-name">{p.name}</div>
                <div className="interview-feedback-problem-meta">
                  {p.topicLabel} · {p.difficulty}
                </div>
              </div>
              <div className="interview-feedback-problem-metrics">
                {m.approachWritten ? '✓ Attempted' : '✗ Skipped'}
                {m.timeToApproachMs != null && (
                  <span style={{ color: 'var(--text-low)', marginLeft: 8 }}>
                    · {Math.round(m.timeToApproachMs / 1000)}s to approach
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatBlock({ label, value }) {
  return (
    <div className="interview-feedback-stat">
      <div className="interview-feedback-stat-value">{value}</div>
      <div className="interview-feedback-stat-label">{label}</div>
    </div>
  );
}