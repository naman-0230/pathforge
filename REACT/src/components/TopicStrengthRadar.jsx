import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { getTopicStrengthData } from '../utils/analytics.js';

// TopicStrengthRadar — one axis per seeded topic, 0-100 "mastery" score
// (blend of breadth-solved and quality-of-solve, see analytics.js for the math).
export default function TopicStrengthRadar() {
  const data = getTopicStrengthData();

  if (data.length === 0 || data.every((d) => d.mastery === 0)) {
    return (
      <p style={{ padding: 20, color: 'var(--text-mid)', fontSize: 13 }}>
        Solve a few problems across different topics to see your strength radar fill in.
      </p>
    );
  }

  return (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer>
        <RadarChart data={data} outerRadius="70%">
          <PolarGrid stroke="rgba(255,255,255,0.08)" />
          <PolarAngleAxis
            dataKey="topic"
            tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 11 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 9 }}
            tickCount={5}
          />
          <Radar
            name="Mastery"
            dataKey="mastery"
            stroke="#E8732D"
            fill="#E8732D"
            fillOpacity={0.35}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}