import { getWeakestTopics } from '../utils/weakPoints.js';
import Badge from './Badge';

// WeakPointRankingList — ranks every topic with at least one solved problem
// from weakest (highest struggle score) to strongest. Same engine that
// drives the "Weak point" badges on Dashboard/Roadmap — this just surfaces
// the full ranked list instead of a single yes/no flag per topic.
export default function WeakPointRankingList() {
  const ranked = getWeakestTopics();

  if (ranked.length === 0) {
    return (
      <p style={{ padding: 20, color: 'var(--text-mid)', fontSize: 13 }}>
        Solve a few problems to see which patterns need the most work.
      </p>
    );
  }

  const maxScore = Math.max(...ranked.map((t) => t.score), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '4px 0' }}>
      {ranked.map((t, i) => {
        const barPercent = Math.round((t.score / maxScore) * 100);
        const isWeak = t.score > 2 && i < Math.max(1, Math.ceil(ranked.length / 3));
        return (
          <div key={t.topicKey} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px' }}>
            <span style={{ fontSize: 13, minWidth: 130, color: 'var(--text-high)', fontWeight: 500 }}>
              {t.label}
            </span>
            <div style={{ flex: 1, height: 6, background: 'var(--bg-hover)', borderRadius: 4, overflow: 'hidden' }}>
              <div
                style={{
                  width: `${barPercent}%`,
                  height: '100%',
                  background: isWeak ? 'var(--amber)' : 'var(--green)',
                  borderRadius: 4,
                }}
              />
            </div>
            <span style={{ fontSize: 11, color: 'var(--text-low)', fontFamily: 'var(--font-mono)', minWidth: 70, textAlign: 'right' }}>
              {t.score.toFixed(1)} pts
            </span>
            <Badge type={isWeak ? 'amber' : 'green'}>{isWeak ? 'Weak' : 'Strong'}</Badge>
          </div>
        );
      })}
    </div>
  );
}