import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getDifficultyBreakdown } from '../utils/analytics.js';

// DifficultyBreakdownChart — how many Easy/Medium/Hard problems solved so far.
export default function DifficultyBreakdownChart() {
  const data = getDifficultyBreakdown();
  const total = data.reduce((sum, d) => sum + d.count, 0);

  if (total === 0) {
    return (
      <p style={{ padding: 20, color: 'var(--text-mid)', fontSize: 13 }}>
        Solve a problem to see your difficulty breakdown here.
      </p>
    );
  }

  return (
    <div style={{ width: '100%', height: 200 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="difficulty" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
          <YAxis allowDecimals={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
          <Tooltip
            contentStyle={{ background: '#0F1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: '#E8E6FF' }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.difficulty} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}