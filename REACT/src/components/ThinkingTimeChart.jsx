import { getThinkingTimeStats, getOverallThinkingTime, formatDuration } from '../utils/thinkingTime.js';

// ThinkingTimeChart — Analytics visualization showing average time-to-
// first-write per topic, with trend indicators. This is the "how long
// do I think before writing something" metric.
//
// LAYOUT:
//   Header: overall average across everything, sample count
//   Per-topic rows: icon + topic name + avg + recent avg + trend badge
//
// TREND COLOR:
//   improving (recent < all-time)  → green ↓ (faster is good)
//   declining (recent > all-time)  → red   ↑ (slower is worrying)
//   stable                         → gray  → (no meaningful change)
//
// EMPTY STATE:
//   Shows when no attempts have been captured yet (early users or those
//   who always skip typing). Explains the metric and how to generate data.

export default function ThinkingTimeChart() {
  const stats = getThinkingTimeStats();
  const overall = getOverallThinkingTime();

  if (stats.length === 0 || overall === null) {
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
        <div style={{ fontSize: 28, opacity: 0.4 }}>⏱️</div>
        <p style={{ fontSize: 12, color: 'var(--text-low)', lineHeight: 1.6, maxWidth: 320 }}>
          Thinking time shows up here once you've solved a few problems.
          It measures the gap between opening a problem and writing your
          first note or approach — a proxy for genuine problem-solving time.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      {/* Header — overall stat */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 14,
        paddingBottom: 12,
        borderBottom: '1px solid var(--border)',
      }}>
        <div>
          <div style={{
            fontSize: 22,
            fontWeight: 600,
            color: 'var(--text-high)',
            fontFamily: 'var(--font-mono, monospace)',
            marginBottom: 2,
          }}>
            {formatDuration(overall.avgMs)}
          </div>
          <div style={{
            fontSize: 10,
            color: 'var(--text-low)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}>
            Overall average
          </div>
        </div>
        <div style={{
          fontSize: 11,
          color: 'var(--text-low)',
          fontFamily: 'var(--font-mono, monospace)',
        }}>
          {overall.totalSamples} sample{overall.totalSamples === 1 ? '' : 's'}
        </div>
      </div>

      {/* Per-topic breakdown */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}>
        {stats.map((s) => (
          <TopicRow key={s.topicKey} stat={s} overallAvgMs={overall.avgMs} />
        ))}
      </div>

      <div style={{
        fontSize: 10,
        color: 'var(--text-low)',
        marginTop: 12,
        paddingTop: 10,
        borderTop: '1px solid var(--border)',
        lineHeight: 1.6,
        fontStyle: 'italic',
      }}>
        Trend compares your last 5 attempts against your all-time average.
        Faster thinking on the same difficulty means you're internalizing the patterns.
      </div>
    </div>
  );
}

function TopicRow({ stat, overallAvgMs }) {
  const trendConfig = {
    improving: { icon: '↓', color: 'var(--green, #3fae63)', label: 'faster' },
    declining: { icon: '↑', color: 'var(--red, #e35b5b)', label: 'slower' },
    stable:    { icon: '→', color: 'var(--text-low)',      label: 'stable' },
  };
  const t = trendConfig[stat.trend];

  // Relative bar — how does this topic's avg compare to overall avg?
  // Longer bar = more thinking time (harder for this user). Capped at 2x
  // overall so one outlier topic doesn't dominate the visual.
  const relativeWidth = Math.min((stat.avgMs / (overallAvgMs * 2)) * 100, 100);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '20px 1fr auto auto',
      gap: 10,
      alignItems: 'center',
      padding: '8px 4px',
    }}>
      <span style={{ fontSize: 14, lineHeight: 1 }}>{stat.icon}</span>

      <div style={{ minWidth: 0 }}>
        <div style={{
          fontSize: 12,
          color: 'var(--text-high)',
          fontWeight: 500,
          marginBottom: 3,
        }}>
          {stat.topicLabel}
        </div>
        <div style={{
          height: 3,
          background: 'var(--bg-hover, #1a1a1a)',
          borderRadius: 2,
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${relativeWidth}%`,
            background: 'var(--accent-mid, #e8732d)',
            opacity: 0.6,
            transition: 'width 0.3s ease',
          }} />
        </div>
      </div>

      <div style={{
        fontSize: 11,
        fontFamily: 'var(--font-mono, monospace)',
        color: 'var(--text-mid)',
        textAlign: 'right',
        minWidth: 60,
      }}>
        {formatDuration(stat.avgMs)}
        <div style={{ fontSize: 9, color: 'var(--text-low)' }}>
          {stat.sampleCount} attempts
        </div>
      </div>

      <div
        title={`${t.label} — recent ${stat.avgMsRecent !== null ? formatDuration(stat.avgMsRecent) : 'n/a'}`}
        style={{
          fontSize: 12,
          color: t.color,
          fontFamily: 'var(--font-mono, monospace)',
          fontWeight: 600,
          width: 20,
          textAlign: 'center',
        }}
      >
        {t.icon}
      </div>
    </div>
  );
}