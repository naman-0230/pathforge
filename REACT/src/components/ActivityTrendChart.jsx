import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getWeeklyActivityTrend } from '../utils/analytics.js';

// ActivityTrendChart — problems solved per week, last 8 weeks. Smoother than
// the daily heatmap on Dashboard — this is about trend direction, not streaks.
export default function ActivityTrendChart() {
  const data = getWeeklyActivityTrend(8);
  const allZero = data.every((d) => d.solved === 0);

  if (allZero) {
    return (
      <p style={{ padding: 20, color: 'var(--text-mid)', fontSize: 13 }}>
        No solves logged yet — this chart fills in once you start marking problems solved.
      </p>
    );
  }

  return (
    <div style={{ width: '100%', height: 240 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="week" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
          <YAxis allowDecimals={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
          <Tooltip
            contentStyle={{ background: '#0F1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: '#E8E6FF' }}
          />
          <Line type="monotone" dataKey="solved" stroke="#E8732D" strokeWidth={2} dot={{ fill: '#E8732D', r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}