import { getWeeklyTestEditorTrendData, getWeeklyTestEditorEngagementStats } from '../utils/weeklyTests.js';

// WeeklyTestEditorTrend — visualizes editor pass rate across weekly test
// sessions over time. Empty state if no editor attempts, "need more data"
// if only 1 session with attempts.

const WIDTH = 500;
const HEIGHT = 180;
const PADDING = { top: 20, right: 20, bottom: 30, left: 40 };

export default function WeeklyTestEditorTrend() {
  const stats = getWeeklyTestEditorEngagementStats();
  const trendData = getWeeklyTestEditorTrendData().filter((d) => d.passRate !== null);

  if (stats.attemptedInEditor === 0) {
    return (
      <div style={{
        padding: 24,
        textAlign: 'center',
        color: 'var(--text-low)',
        fontSize: 12,
      }}>
        <div style={{ fontSize: 24, opacity: 0.4, marginBottom: 8 }}>💻</div>
        <p>
          No editor submissions yet in your weekly tests.
          <br />
          Attempt problems in the code editor during tests to see your pass rate trend here.
        </p>
      </div>
    );
  }

  const summaryStats = (
    <div style={{
      display: 'flex',
      gap: 16,
      padding: '12px 16px 8px',
      borderBottom: '1px solid var(--border)',
      fontSize: 11,
    }}>
      <div>
        <div style={{ color: 'var(--text-low)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 10, marginBottom: 2 }}>
          Engagement
        </div>
        <div style={{ color: 'var(--text-high)', fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600 }}>
          {stats.attemptedInEditor}/{stats.totalProblems} problems
        </div>
        <div style={{ color: 'var(--text-mid)', fontSize: 10 }}>
          {Math.round(stats.engagementRate * 100)}% attempted in editor
        </div>
      </div>
      <div>
        <div style={{ color: 'var(--text-low)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 10, marginBottom: 2 }}>
          Overall pass rate
        </div>
        <div style={{
          color: stats.passRate >= 0.66 ? 'var(--green, #3fae63)' : stats.passRate >= 0.33 ? 'var(--amber, #d9a441)' : 'var(--red, #e35b5b)',
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          fontWeight: 600,
        }}>
          {Math.round(stats.passRate * 100)}%
        </div>
        <div style={{ color: 'var(--text-mid)', fontSize: 10 }}>
          {stats.passedInEditor} of {stats.attemptedInEditor} passed
        </div>
      </div>
    </div>
  );

  if (trendData.length < 2) {
    return (
      <div>
        {summaryStats}
        <div style={{
          padding: 16,
          textAlign: 'center',
          color: 'var(--text-low)',
          fontSize: 11,
          fontStyle: 'italic',
        }}>
          Complete more weekly tests with editor submissions to see pass rate trend.
        </div>
      </div>
    );
  }

  const chartWidth = WIDTH - PADDING.left - PADDING.right;
  const chartHeight = HEIGHT - PADDING.top - PADDING.bottom;
  const stepX = chartWidth / (trendData.length - 1);

  const points = trendData.map((d, i) => {
    const x = PADDING.left + i * stepX;
    const y = PADDING.top + chartHeight - (d.passRate / 100) * chartHeight;
    return { x, y, data: d };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div>
      {summaryStats}
      <div style={{ padding: '12px 16px' }}>
        <svg
          width="100%"
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ display: 'block' }}
        >
          {[0, 25, 50, 75, 100].map((val) => {
            const y = PADDING.top + chartHeight - (val / 100) * chartHeight;
            return (
              <g key={val}>
                <line
                  x1={PADDING.left}
                  y1={y}
                  x2={WIDTH - PADDING.right}
                  y2={y}
                  stroke="var(--border)"
                  strokeWidth="1"
                  strokeDasharray={val === 0 || val === 100 ? '0' : '2,4'}
                  opacity="0.5"
                />
                <text
                  x={PADDING.left - 6}
                  y={y + 3}
                  fontSize="9"
                  fill="var(--text-low)"
                  textAnchor="end"
                  fontFamily="var(--font-mono)"
                >
                  {val}%
                </text>
              </g>
            );
          })}

          <path
            d={pathD}
            fill="none"
            stroke="var(--accent, #e8732d)"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r="4"
                fill="var(--bg-elevated, #1a1a1a)"
                stroke="var(--accent, #e8732d)"
                strokeWidth="2"
              />
              <title>
                {p.data.weekId}
                {'\n'}
                {new Date(p.data.completedAt).toLocaleDateString()}
                {'\n'}
                {p.data.passedCount}/{p.data.attemptedCount} passed ({Math.round(p.data.passRate)}%)
              </title>
            </g>
          ))}

          {[0, Math.floor(trendData.length / 2), trendData.length - 1].map((i) => {
            const p = points[i];
            const date = new Date(p.data.completedAt);
            const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            return (
              <text
                key={i}
                x={p.x}
                y={HEIGHT - PADDING.bottom + 15}
                fontSize="9"
                fill="var(--text-low)"
                textAnchor="middle"
                fontFamily="var(--font-mono)"
              >
                {label}
              </text>
            );
          })}
        </svg>
        <div style={{
          fontSize: 10,
          color: 'var(--text-low)',
          textAlign: 'center',
          marginTop: 4,
          fontStyle: 'italic',
        }}>
          Hover any point to see week details
        </div>
      </div>
    </div>
  );
}