import { Link } from 'react-router-dom';
import { getPeekReasonStats } from '../utils/failureArchive.js';

// PeekReasonBreakdown — Analytics chart for the Failure Archive. Two parts:
//   1. Horizontal bar breakdown by reason (with percent + count)
//   2. Insight callout — actionable recommendation based on the dominant reason
//
// EMPTY STATE:
//   If user has never logged a reason (0 categorized peeks), show a nudge
//   explaining that data appears once they interact with the prompt.
//   Different from "never peeked at all" — some users skip the prompt
//   every time, so we distinguish "no data" vs "peeked but skipped".

export default function PeekReasonBreakdown() {
  const stats = getPeekReasonStats();
  const { breakdown, totalPeeks, totalWithReason, insight } = stats;

  if (totalWithReason === 0) {
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
        <div style={{ fontSize: 28, opacity: 0.4 }}>🧭</div>
        <p style={{ fontSize: 12, color: 'var(--text-low)', lineHeight: 1.6, maxWidth: 300 }}>
          {totalPeeks > 0
            ? `You've viewed ${totalPeeks} solution${totalPeeks === 1 ? '' : 's'} but haven't logged a reason yet. Next time the prompt appears, one tap adds it here.`
            : 'When you open a solution, a quick prompt asks why. Data shows up here.'}
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 14,
      }}>
        <div style={{
          fontSize: 11,
          color: 'var(--text-low)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontWeight: 600,
        }}>
          {totalWithReason} categorized peek{totalWithReason === 1 ? '' : 's'}
        </div>
        {totalPeeks > totalWithReason && (
          <div style={{ fontSize: 10, color: 'var(--text-low)', fontFamily: 'var(--font-mono)' }}>
            {totalPeeks - totalWithReason} skipped
          </div>
        )}
      </div>

      {/* Horizontal bar breakdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {breakdown.filter((b) => b.count > 0).map((b, idx) => {
          const isDominant = idx === 0;
          return (
            <div key={b.key}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 4,
                fontSize: 12,
              }}>
                <span style={{
                  color: 'var(--text-high)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontWeight: isDominant ? 600 : 400,
                }}>
                  <span>{b.emoji}</span>
                  <span>{b.label}</span>
                </span>
                <span style={{
                  color: 'var(--text-low)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                }}>
                  {b.count} · {b.percent}%
                </span>
              </div>
              <div style={{
                height: 6,
                background: 'var(--bg-hover, #1a1a1a)',
                borderRadius: 3,
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${b.percent}%`,
                  background: isDominant
                    ? 'var(--accent, #e8732d)'
                    : 'var(--accent-mid, rgba(232,115,45,0.5))',
                  transition: 'width 0.3s ease',
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Insight callout */}
      {insight && (
        <div style={{
          padding: '12px 14px',
          background: 'rgba(232, 115, 45, 0.06)',
          border: '1px solid var(--accent-mid, #e8732d)',
          borderRadius: 8,
          fontSize: 12,
          lineHeight: 1.6,
        }}>
          <div style={{
            color: 'var(--text-high)',
            fontWeight: 500,
            marginBottom: 4,
          }}>
            💡 {insight.title}
          </div>
          <div style={{ color: 'var(--text-mid)' }}>
            {insight.action}
          </div>
          {insight.link && (
            <Link
              to={insight.link}
              style={{
                display: 'inline-block',
                marginTop: 8,
                fontSize: 11,
                color: 'var(--accent, #e8732d)',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              {insight.linkLabel} →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}