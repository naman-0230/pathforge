import { Link } from 'react-router-dom';
import { getDrillHistory } from '../utils/drillEngine.js';

// DrillHistoryCard — summary stats for pattern drills. Shows count of
// drills completed, average coverage %, and total problems worked
// through. Small enough to sit as a compact card in Analytics.
//
// If no drills done yet, shows a nudge with a link to pattern training
// (which is what surfaces weak patterns → drill recommendations).

export default function DrillHistoryCard() {
  const history = getDrillHistory();

  if (history.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 160,
        gap: 10,
        padding: 20,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 28, opacity: 0.4 }}>🎯</div>
        <p style={{ fontSize: 12, color: 'var(--text-low)', lineHeight: 1.6, maxWidth: 260 }}>
          No drills yet. Drills auto-recommend once pattern training identifies a weak pattern.
        </p>
        <Link to="/pattern-training" className="btn btn-sm" style={{ marginTop: 4 }}>
          Try pattern training →
        </Link>
      </div>
    );
  }

  const totalDrills = history.length;
  const totalProblemsWorked = history.reduce((sum, d) => sum + (d.totalSolved || 0), 0);
  const totalPossibleProblems = history.reduce(
    (sum, d) => sum + (d.problems?.length || 0),
    0
  );
  const avgCoverage = totalPossibleProblems > 0
    ? Math.round((totalProblemsWorked / totalPossibleProblems) * 100)
    : 0;

  // Recent drills — last 5 for the mini-list
  const recent = history.slice(0, 5);

  return (
    <div style={{ padding: 16 }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 12,
        marginBottom: 16,
      }}>
        <StatBlock label="Drills done" value={totalDrills} />
        <StatBlock label="Problems worked" value={totalProblemsWorked} />
        <StatBlock label="Avg coverage" value={`${avgCoverage}%`} />
      </div>

      <div style={{
        fontSize: 11,
        color: 'var(--text-low)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        fontWeight: 600,
        marginBottom: 8,
      }}>
        Recent drills
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {recent.map((d) => {
          const coverage = d.problems?.length > 0
            ? Math.round(((d.totalSolved || 0) / d.problems.length) * 100)
            : 0;
          const dateStr = d.completedAt
            ? new Date(d.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            : '—';
          return (
            <div
              key={d.drillId}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '6px 10px',
                background: 'var(--bg-hover, #1a1a1a)',
                borderRadius: 6,
                fontSize: 12,
              }}
            >
              <span style={{ color: 'var(--text-high)', fontWeight: 500 }}>
                {d.pattern}
              </span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-low)',
                fontSize: 11,
              }}>
                {coverage}% · {dateStr}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatBlock({ label, value }) {
  return (
    <div style={{
      background: 'var(--bg-hover, #1a1a1a)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      padding: '10px 12px',
      textAlign: 'center',
    }}>
      <div style={{
        fontSize: 20,
        fontWeight: 600,
        color: 'var(--text-high)',
        fontFamily: 'var(--font-mono)',
        marginBottom: 2,
      }}>
        {value}
      </div>
      <div style={{
        fontSize: 9,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        color: 'var(--text-low)',
      }}>
        {label}
      </div>
    </div>
  );
}