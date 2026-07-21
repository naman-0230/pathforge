import { getTestHistory } from '../utils/weeklyTests.js';

// WeeklyTestHistory — Analytics chart showing weekly test performance
// over time. Simple SVG line chart of score-per-test with trend line.
// Plus a scrollable list of recent test details.
//
// EMPTY STATE:
//   Shows if user hasn't taken any tests yet, with a nudge to take one.
//
// COMPLETED tests only — skipped tests are excluded from the chart
// (they have no score) but shown separately in the list with a strike-through.

export default function WeeklyTestHistory() {
  const history = getTestHistory();
  const completed = history.filter((h) => !h.skipped);

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
        <div style={{ fontSize: 28, opacity: 0.4 }}>🧪</div>
        <p style={{ fontSize: 12, color: 'var(--text-low)', lineHeight: 1.6, maxWidth: 300 }}>
          No weekly tests taken yet. Your test history and score trends will show up here.
        </p>
      </div>
    );
  }

  // Compute aggregate stats
  const totalTaken = completed.length;
  const totalSkipped = history.filter((h) => h.skipped).length;
  const avgScore = totalTaken > 0
    ? Math.round(
        completed.reduce((sum, h) => sum + (h.score / h.totalQuestions) * 100, 0) / totalTaken
      )
    : 0;

  return (
    <div style={{ padding: 16 }}>
      {/* Summary stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 12,
        marginBottom: 16,
      }}>
        <StatBlock label="Tests taken" value={totalTaken} />
        <StatBlock label="Avg score" value={`${avgScore}%`} />
        <StatBlock label="Skipped" value={totalSkipped} />
      </div>

      {/* Score trend chart (only if 2+ completed tests) */}
      {completed.length >= 2 && (
        <ScoreTrendChart completed={completed} />
      )}

      {/* Recent tests list */}
      <div style={{
        fontSize: 11,
        color: 'var(--text-low)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        fontWeight: 600,
        marginBottom: 10,
        marginTop: 20,
      }}>
        Recent tests
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {history.slice(0, 8).map((h, i) => (
          <TestRow key={`${h.weekId}-${i}`} entry={h} />
        ))}
      </div>
    </div>
  );
}

function ScoreTrendChart({ completed }) {
  // Oldest first for chart
  const chronological = [...completed].reverse().slice(-10); // last 10 chronologically
  const width = 360;
  const height = 140;
  const padLeft = 32;
  const padRight = 12;
  const padTop = 12;
  const padBottom = 24;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const points = chronological.map((h, i) => {
    const percent = Math.round((h.score / h.totalQuestions) * 100);
    const x = padLeft + (chronological.length > 1
      ? (i / (chronological.length - 1)) * chartW
      : chartW / 2);
    const y = padTop + chartH * (1 - percent / 100);
    return { x, y, percent, weekId: h.weekId };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');

  return (
    <div>
      <div style={{
        fontSize: 11,
        color: 'var(--text-low)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        fontWeight: 600,
        marginBottom: 8,
      }}>
        Score trend
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        {/* Y-axis gridlines at 0/50/100 */}
        {[0, 50, 100].map((v) => {
          const y = padTop + chartH * (1 - v / 100);
          return (
            <g key={v}>
              <line
                x1={padLeft}
                x2={width - padRight}
                y1={y}
                y2={y}
                stroke="var(--border)"
                strokeWidth="0.5"
                strokeDasharray={v === 0 || v === 100 ? '0' : '2,3'}
              />
              <text
                x={padLeft - 6}
                y={y + 3}
                fontSize="9"
                textAnchor="end"
                fill="var(--text-low)"
                fontFamily="var(--font-mono)"
              >
                {v}
              </text>
            </g>
          );
        })}

        {/* Trend line */}
        <path
          d={pathD}
          fill="none"
          stroke="var(--accent, #e8732d)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Points */}
        {points.map((p, i) => {
          const color = p.percent >= 66
            ? 'var(--green, #3fae63)'
            : p.percent >= 33
            ? 'var(--amber, #d9a441)'
            : 'var(--red, #e35b5b)';
          return (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="4" fill={color} stroke="var(--bg-base, #111)" strokeWidth="1.5" />
              <title>{p.weekId}: {p.percent}%</title>
            </g>
          );
        })}

        <text x={padLeft} y={height - 6} fontSize="9" fill="var(--text-low)" fontFamily="var(--font-mono)">
          oldest
        </text>
        <text x={width - padRight} y={height - 6} fontSize="9" textAnchor="end" fill="var(--text-low)" fontFamily="var(--font-mono)">
          newest
        </text>
      </svg>
    </div>
  );
}

function TestRow({ entry }) {
  const isSkipped = entry.skipped;
  const dateStr = new Date(entry.completedAt || entry.skippedAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric',
  });

  if (isSkipped) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 12px',
        background: 'var(--bg-hover, #1a1a1a)',
        borderRadius: 6,
        opacity: 0.5,
      }}>
        <span style={{
          fontSize: 12,
          color: 'var(--text-mid)',
          textDecoration: 'line-through',
        }}>
          {entry.weekId} · Skipped
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-low)', fontFamily: 'var(--font-mono)' }}>
          {dateStr}
        </span>
      </div>
    );
  }

  const percent = Math.round((entry.score / entry.totalQuestions) * 100);
  const color = percent >= 66
    ? 'var(--green, #3fae63)'
    : percent >= 33
    ? 'var(--amber, #d9a441)'
    : 'var(--red, #e35b5b)';

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 12px',
      background: 'var(--bg-hover, #1a1a1a)',
      borderRadius: 6,
    }}>
      <div>
        <div style={{ fontSize: 12, color: 'var(--text-high)', fontWeight: 500 }}>
          {entry.weekId}
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-low)' }}>
          {entry.score}/{entry.totalQuestions} solved · {dateStr}
        </div>
      </div>
      <div style={{
        fontSize: 14,
        fontWeight: 600,
        color,
        fontFamily: 'var(--font-mono, monospace)',
      }}>
        {percent}%
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
        fontSize: 18,
        fontWeight: 600,
        color: 'var(--text-high)',
        fontFamily: 'var(--font-mono, monospace)',
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