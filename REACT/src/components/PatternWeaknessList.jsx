import { Link } from 'react-router-dom';
import { getPatternStats, getWeakPatterns } from '../utils/patternEngine.js';

// PatternWeaknessList — ranks patterns by miss rate from pattern training
// data. Similar in style to WeakPointRankingList (which ranks TOPICS by
// problem-solving struggle) but this one ranks PATTERNS by recognition
// misses. Different data source, same idea: "here's where you're weakest,
// prioritize this."
//
// Each row links to a drill on that pattern for immediate action.
// Shows top 6 to avoid a long scroll — anything beyond top 6 isn't
// meaningfully weak enough to prioritize.

export default function PatternWeaknessList() {
  const allStats = getPatternStats();
  const allPatterns = Object.entries(allStats).map(([pattern, s]) => ({
    pattern,
    seen: s.seen,
    missed: s.missed,
    missRate: s.seen > 0 ? s.missed / s.seen : 0,
  }));

  // Show anything with >= 2 attempts, sorted worst-first
  const ranked = allPatterns
    .filter((p) => p.seen >= 2)
    .sort((a, b) => b.missRate - a.missRate)
    .slice(0, 6);

  if (ranked.length === 0) {
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
        <p style={{ fontSize: 12, color: 'var(--text-low)', lineHeight: 1.6, maxWidth: 240 }}>
          Do a few pattern training sessions to see which patterns you struggle to recognize.
        </p>
      </div>
    );
  }

  const weakSet = new Set(getWeakPatterns({ minSeen: 3, minMissRate: 0.4 }).map((w) => w.pattern));

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {ranked.map((p) => {
        const percent = Math.round(p.missRate * 100);
        const isWeak = weakSet.has(p.pattern);
        const barColor = percent >= 60
          ? 'var(--red, #e35b5b)'
          : percent >= 40
          ? 'var(--amber, #d9a441)'
          : 'var(--green, #3fae63)';

        return (
          <div
            key={p.pattern}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto auto',
              gap: 12,
              alignItems: 'center',
              padding: '10px 16px',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontSize: 13,
                color: 'var(--text-high)',
                fontWeight: 500,
                marginBottom: 4,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}>
                {p.pattern}
                {isWeak && (
                  <span style={{
                    fontSize: 9,
                    padding: '1px 6px',
                    background: 'rgba(227, 91, 91, 0.15)',
                    color: 'var(--red, #e35b5b)',
                    borderRadius: 3,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    Weak
                  </span>
                )}
              </div>
              <div style={{
                height: 4,
                background: 'var(--bg-hover, #1a1a1a)',
                borderRadius: 2,
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${percent}%`,
                  background: barColor,
                  transition: 'width 0.3s ease',
                }} />
              </div>
            </div>
            <div style={{
              fontSize: 11,
              color: 'var(--text-low)',
              fontFamily: 'var(--font-mono)',
              whiteSpace: 'nowrap',
            }}>
              {p.missed}/{p.seen} missed
            </div>
            <Link
              to={`/drill/${encodeURIComponent(p.pattern)}`}
              className="btn btn-sm"
              style={{ fontSize: 11, padding: '4px 10px' }}
            >
              Drill →
            </Link>
          </div>
        );
      })}
    </div>
  );
}