// WeeklyTestSampleChart — clearly-sample SVG showing what a user's weekly
// test score trend would look like. Small, low-detail — enough to convey
// "improvement over time" without pretending to be real data.
//
// Uses generic "W1/W2/W3/W4" week labels and simple ascending trend —
// tells the visual story of "regular testing = visible improvement" in
// under 100px of vertical space.

export default function WeeklyTestSampleChart() {
  const data = [
    { week: 'W1', score: 33 },
    { week: 'W2', score: 50 },
    { week: 'W3', score: 66 },
    { week: 'W4', score: 83 },
  ];

  const width = 240;
  const height = 60;
  const padLeft = 22;
  const padRight = 10;
  const padTop = 8;
  const padBottom = 18;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const points = data.map((d, i) => ({
    x: padLeft + (i / (data.length - 1)) * chartW,
    y: padTop + chartH * (1 - d.score / 100),
    score: d.score,
    week: d.week,
  }));

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      {/* Trend line */}
      <path
        d={pathD}
        fill="none"
        stroke="var(--accent, #e8732d)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />

      {/* Points */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="2.5" fill="var(--accent, #e8732d)" opacity="0.9" />
          <text
            x={p.x}
            y={height - 6}
            fontSize="8"
            textAnchor="middle"
            fill="var(--text-low)"
            fontFamily="var(--font-mono, monospace)"
          >
            {p.week}
          </text>
        </g>
      ))}
    </svg>
  );
}