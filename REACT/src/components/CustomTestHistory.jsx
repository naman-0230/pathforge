import { Link } from 'react-router-dom';
import { getSessionHistory, getTemplates } from '../utils/customTests.js';

// CustomTestHistory — Analytics chart for custom tests. Shows aggregate
// stats and per-template performance.
//
// EMPTY STATE:
//   Shown when user has never run a custom test.
//
// GROUPING:
//   Sessions grouped by template — shows each template's run count and
//   average score. Similar to Approach Library's grouped-by-pattern view.

export default function CustomTestHistory() {
  const history = getSessionHistory();
  const templates = getTemplates();

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
        <div style={{ fontSize: 28, opacity: 0.4 }}>🧰</div>
        <p style={{ fontSize: 12, color: 'var(--text-low)', lineHeight: 1.6, maxWidth: 300 }}>
          No custom tests taken yet. Once you run one, your history and per-template performance show up here.
        </p>
        <Link to="/custom-tests" className="btn btn-sm" style={{ marginTop: 4 }}>
          Create a test →
        </Link>
      </div>
    );
  }

  // Aggregate stats
  const totalRuns = history.length;
  const avgScore = Math.round(
    history.reduce((sum, h) => sum + (h.score / h.problemCount) * 100, 0) / totalRuns
  );

  // Group by template
  const grouped = {};
  for (const h of history) {
    if (!grouped[h.templateId]) {
      grouped[h.templateId] = {
        templateId: h.templateId,
        templateName: h.templateName,
        runs: [],
      };
    }
    grouped[h.templateId].runs.push(h);
  }

  const templateStats = Object.values(grouped).map((g) => {
    const scores = g.runs.map((r) => (r.score / r.problemCount) * 100);
    const avg = Math.round(scores.reduce((s, x) => s + x, 0) / scores.length);
    const latest = scores[0]; // history is newest-first
    const trend = scores.length >= 2 ? (latest - scores[scores.length - 1]) : 0;
    // Check if template still exists (may have been deleted)
    const templateExists = templates.some((t) => t.id === g.templateId);
    return {
      ...g,
      runCount: g.runs.length,
      avgScore: avg,
      latestScore: Math.round(latest),
      trend: Math.round(trend),
      templateExists,
    };
  }).sort((a, b) => b.runCount - a.runCount);

  return (
    <div style={{ padding: 16 }}>
      {/* Aggregate stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 12,
        marginBottom: 16,
      }}>
        <StatBlock label="Total runs" value={totalRuns} />
        <StatBlock label="Templates used" value={templateStats.length} />
        <StatBlock label="Avg score" value={`${avgScore}%`} />
      </div>

      {/* Per-template breakdown */}
      <div style={{
        fontSize: 11,
        color: 'var(--text-low)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        fontWeight: 600,
        marginBottom: 10,
      }}>
        Performance by template
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {templateStats.map((t) => (
          <TemplateRow key={t.templateId} template={t} />
        ))}
      </div>
    </div>
  );
}

function TemplateRow({ template }) {
  const trendColor = template.trend > 5
    ? 'var(--green, #3fae63)'
    : template.trend < -5
    ? 'var(--red, #e35b5b)'
    : 'var(--text-low)';
  const trendSymbol = template.trend > 5 ? '↑' : template.trend < -5 ? '↓' : '→';

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 12px',
      background: 'var(--bg-hover, #1a1a1a)',
      borderRadius: 6,
      gap: 8,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 12,
          color: template.templateExists ? 'var(--text-high)' : 'var(--text-low)',
          fontWeight: 500,
          textDecoration: template.templateExists ? 'none' : 'line-through',
        }}>
          {template.templateName}
          {!template.templateExists && (
            <span style={{ marginLeft: 6, fontSize: 10, fontStyle: 'italic', color: 'var(--text-low)' }}>
              (deleted)
            </span>
          )}
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-low)' }}>
          {template.runCount} run{template.runCount === 1 ? '' : 's'} · latest {template.latestScore}%
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--text-mid)',
          fontFamily: 'var(--font-mono, monospace)',
        }}>
          {template.avgScore}%
        </div>
        <div style={{
          fontSize: 14,
          fontWeight: 700,
          color: trendColor,
          fontFamily: 'var(--font-mono, monospace)',
          width: 20,
          textAlign: 'center',
        }}>
          {trendSymbol}
        </div>
      </div>
    </div>
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