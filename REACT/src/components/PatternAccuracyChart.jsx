import { getSessionHistory } from '../utils/patternEngine.js';

// PatternAccuracyChart — simple SVG line chart showing accuracy across
// recent pattern training sessions. No chart library needed for something
// this simple, and it keeps bundle size down.
//
// X-axis: sessions in order (oldest → newest, left → right)
// Y-axis: accuracy % (0-100)
//
// Points are colored by verdict tier:
//   ≥80% green, 60-79% amber, <60% red
// Trend line connects them so improvement/decline is visible at a glance.
//
// If fewer than 2 sessions exist, a placeholder is shown — can't draw
// a "trend" from one point.

export default function PatternAccuracyChart() {
  const history = getSessionHistory();
  const sessions = [...history].reverse(); // oldest first for chart

  if (sessions.length < 2) {
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
        <div style={{ fontSize: 28, opacity: 0.4 }}>📈</div>
        <p style={{ fontSize: 12, color: 'var(--text-low)', lineHeight: 1.6, maxWidth: 240 }}>
          Do a couple more pattern training sessions to see your accuracy trend.
        </p>
      </div>
    );
  }

  // Cap at last 12 sessions so the chart stays readable
  const displaySessions = sessions.slice(-12);
  const dataPoints = displaySessions.map((s) => ({
    accuracy: Math.round((s.score / s.totalQuestions) * 100),
    date: s.completedAt,
  }));

  const width = 360;
  const height = 180;
  const padLeft = 40;
  const padRight = 12;
  const padTop = 16;
  const padBottom = 28;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  // X positions: evenly spread across chartW
  const xStep = dataPoints.length > 1 ? chartW / (dataPoints.length - 1) : 0;
  const points = dataPoints.map((d, i) => ({
    x: padLeft + i * xStep,
    y: padTop + (chartH * (1 - d.accuracy / 100)),
    accuracy: d.accuracy,
  }));

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');

  // Average line
  const avg = Math.round(dataPoints.reduce((s, d) => s + d.accuracy, 0) / dataPoints.length);
  const avgY = padTop + (chartH * (1 - avg / 100));

  return (
    <div style={{ padding: 16 }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        fontSize: 11,
        color: 'var(--text-low)',
      }}>
        <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
          Last {displaySessions.length} sessions
        </span>
        <span style={{ fontFamily: 'var(--font-mono)' }}>
          Avg: <strong style={{ color: 'var(--text-high)' }}>{avg}%</strong>
        </span>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        {/* Y-axis gridlines at 0/25/50/75/100 */}
        {[0, 25, 50, 75, 100].map((v) => {
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

        {/* Average line */}
        <line
          x1={padLeft}
          x2={width - padRight}
          y1={avgY}
          y2={avgY}
          stroke="var(--accent-mid, #e8732d)"
          strokeWidth="1"
          strokeDasharray="4,3"
          opacity="0.5"
        />

        {/* Trend line */}
        <path
          d={pathD}
          fill="none"
          stroke="var(--accent, #e8732d)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((p, i) => {
          const color = p.accuracy >= 80
            ? 'var(--green, #3fae63)'
            : p.accuracy >= 60
            ? 'var(--amber, #d9a441)'
            : 'var(--red, #e35b5b)';
          return (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="4" fill={color} stroke="var(--bg-base, #111)" strokeWidth="1.5" />
              <text
                x={p.x}
                y={p.y - 8}
                fontSize="9"
                textAnchor="middle"
                fill="var(--text-mid)"
                fontFamily="var(--font-mono)"
              >
                {p.accuracy}
              </text>
            </g>
          );
        })}

        {/* X-axis label */}
        <text
          x={padLeft}
          y={height - 8}
          fontSize="9"
          fill="var(--text-low)"
          fontFamily="var(--font-mono)"
        >
          oldest
        </text>
        <text
          x={width - padRight}
          y={height - 8}
          fontSize="9"
          textAnchor="end"
          fill="var(--text-low)"
          fontFamily="var(--font-mono)"
        >
          newest
        </text>
      </svg>
    </div>
  );
}