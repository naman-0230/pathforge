import { Link } from 'react-router-dom';
import { getSessionHistory, getCategoryPerformance, getWeakSubcategories } from '../utils/aptitude.js';
import { CATEGORIES, getSubcategoryLabel } from '../data/aptitude/questions.js';
import { hasContent } from '../utils/aptitudeFundamentals.js';

// AptitudeAnalytics — Analytics page section for aptitude add-on.
// Shows: overall stats, per-category accuracy, weak subcategories,
// recent session list.
//
// Weak-subcategory rows are clickable — they deep-link to the topic
// picker (/aptitude/:category) with that subcategory preselected via
// router state so the user can immediately practice their weak area.

export default function AptitudeAnalytics() {
  const history = getSessionHistory();
  const performance = getCategoryPerformance();
  const weakSubs = getWeakSubcategories({ minSeen: 3, maxResults: 5 });

  if (history.length === 0) {
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
        <div style={{ fontSize: 28, opacity: 0.4 }}>🧠</div>
        <p style={{ fontSize: 12, color: 'var(--text-low)', lineHeight: 1.6, maxWidth: 300 }}>
          Complete an aptitude session to see your performance data here.
        </p>
        <Link to="/aptitude" className="btn btn-sm">
          Start practicing →
        </Link>
      </div>
    );
  }

  const totalSessions = history.length;
  const totalQuestions = history.reduce((sum, s) => sum + s.questionCount, 0);
  const totalCorrect = history.reduce((sum, s) => sum + s.correctCount, 0);
  const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  return (
    <div style={{ padding: 16 }}>
      {/* Overall stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 12,
        marginBottom: 16,
      }}>
        <StatBlock label="Sessions" value={totalSessions} />
        <StatBlock label="Questions" value={totalQuestions} />
        <StatBlock label="Accuracy" value={`${overallAccuracy}%`} />
      </div>

      {/* Per-category performance */}
      <div style={{
        fontSize: 11,
        color: 'var(--text-low)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        fontWeight: 600,
        marginBottom: 10,
      }}>
        Performance by category
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
        {performance.map((p) => (
          <CategoryRow key={p.category} data={p} />
        ))}
      </div>

      {/* Weak subcategories */}
      {weakSubs.length > 0 && (
        <>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
          }}>
            <div style={{
              fontSize: 11,
              color: 'var(--text-low)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 600,
            }}>
              Weakest sub-topics
            </div>
            <div style={{
              fontSize: 10,
              color: 'var(--text-low)',
              fontStyle: 'italic',
            }}>
              Click to practice
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {weakSubs.map((w) => (
              <WeakSubRow key={`${w.category}:${w.subcategory}`} data={w} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function WeakSubRow({ data }) {
  const catInfo = CATEGORIES[data.category];
  const subLabel = getSubcategoryLabel(data.category, data.subcategory);
  const hasFund = hasContent(data.category, data.subcategory);

  return (
    <Link
      to={`/aptitude/${data.category}`}
      state={{ preselect: data.subcategory }}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 12px',
        background: 'rgba(227, 91, 91, 0.06)',
        borderLeft: '2px solid var(--red, #e35b5b)',
        borderRadius: 4,
        textDecoration: 'none',
        transition: 'background 0.15s ease, transform 0.1s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(227, 91, 91, 0.12)';
        e.currentTarget.style.transform = 'translateX(2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(227, 91, 91, 0.06)';
        e.currentTarget.style.transform = 'translateX(0)';
      }}
    >
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{
          fontSize: 12,
          color: 'var(--text-high)',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          <span>{subLabel}</span>
          {hasFund && (
            <span
              style={{
                fontSize: 10,
                opacity: 0.7,
              }}
              title="Fundamentals available"
            >
              📖
            </span>
          )}
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-low)' }}>
          {catInfo?.icon} {catInfo?.shortLabel || data.category} · {data.correct}/{data.seen} correct
        </div>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexShrink: 0,
      }}>
        <div style={{
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--red, #e35b5b)',
          fontFamily: 'var(--font-mono, monospace)',
        }}>
          {Math.round(data.accuracy * 100)}%
        </div>
        <span style={{
          fontSize: 12,
          color: 'var(--text-low)',
          opacity: 0.6,
        }}>
          →
        </span>
      </div>
    </Link>
  );
}

function CategoryRow({ data }) {
  const color = !data.accuracy
    ? 'var(--text-low)'
    : data.accuracy >= 66
    ? 'var(--green, #3fae63)'
    : data.accuracy >= 33
    ? 'var(--amber, #d9a441)'
    : 'var(--red, #e35b5b)';

  return (
    <Link
      to={`/aptitude/${data.category}`}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 12px',
        background: 'var(--bg-hover, #1a1a1a)',
        borderRadius: 6,
        textDecoration: 'none',
        transition: 'background 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(232, 115, 45, 0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--bg-hover, #1a1a1a)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 16 }}>{data.icon}</span>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-high)', fontWeight: 500 }}>
            {data.label}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-low)' }}>
            {data.correct}/{data.seen} attempts
          </div>
        </div>
      </div>
      <div style={{
        fontSize: 14,
        fontWeight: 600,
        color,
        fontFamily: 'var(--font-mono, monospace)',
      }}>
        {data.accuracy != null ? `${data.accuracy}%` : '—'}
      </div>
    </Link>
  );
}

function StatBlock({ label, value }) {
  return (
    <div style={{
      background: 'var(--bg-hover, #1a1a1a)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      padding: '10px 12px',
      textAlign: 'center',
    }}>
      <div style={{
        fontSize: 18,
        fontWeight: 600,
        color: 'var(--text-high)',
        fontFamily: 'var(--font-mono, monospace)',
        marginBottom: 2,
      }}>
        {value}
      </div>
      <div style={{
        fontSize: 9,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        color: 'var(--text-low)',
      }}>
        {label}
      </div>
    </div>
  );
}