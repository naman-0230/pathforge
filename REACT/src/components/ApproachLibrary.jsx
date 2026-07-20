import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Badge from './Badge';
import { getDifficultyType } from '../data/problems.js';
import { getApproachesGroupedByPattern, searchApproaches } from '../utils/approachLibrary.js';

// ApproachLibrary — browsable, searchable view of every approach the user
// has ever written. Shows in Analytics as a personal cheatsheet.
//
// TWO MODES:
//   'grouped' (default): approaches organized by pattern, collapsible groups
//   'search':            flat filtered list when user types in search box
//
// Automatically switches to search mode when the query has content, back
// to grouped mode when cleared. No mode toggle needed.

export default function ApproachLibrary() {
  const [query, setQuery] = useState('');
  const [expandedPatterns, setExpandedPatterns] = useState(new Set());

  const grouped = useMemo(() => getApproachesGroupedByPattern(), []);
  const searchResults = useMemo(
    () => query.trim() ? searchApproaches(query) : [],
    [query]
  );

  const inSearchMode = query.trim().length > 0;
  const totalApproaches = grouped.reduce((s, g) => s + g.approaches.length, 0);

  function togglePattern(pattern) {
    setExpandedPatterns((prev) => {
      const next = new Set(prev);
      if (next.has(pattern)) next.delete(pattern);
      else next.add(pattern);
      return next;
    });
  }

  if (totalApproaches === 0) {
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
        <div style={{ fontSize: 28, opacity: 0.4 }}>💭</div>
        <p style={{ fontSize: 12, color: 'var(--text-low)', lineHeight: 1.6, maxWidth: 320 }}>
          Your approach library builds up as you write approach sketches on problems.
          Every approach you write shows up here, grouped by pattern.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      {/* Header + search */}
      <div style={{ marginBottom: 16 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
        }}>
                    <div
            key={`counter-${inSearchMode}-${searchResults.length}`}
            className="approach-counter-fade"
            style={{
              fontSize: 11,
              color: 'var(--text-low)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 600,
            }}
          >
            {inSearchMode
              ? `${searchResults.length} result${searchResults.length === 1 ? '' : 's'}`
              : `${totalApproaches} approach${totalApproaches === 1 ? '' : 'es'} across ${grouped.length} pattern${grouped.length === 1 ? '' : 's'}`}
          </div>
        </div>
                <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search approaches, problems, patterns..."
          style={{
            width: '100%',
            padding: '8px 12px',
            background: 'var(--bg-hover, #1a1a1a)',
            border: `1px solid ${inSearchMode ? 'var(--accent-mid, #e8732d)' : 'var(--border)'}`,
            borderRadius: 6,
            color: 'var(--text-high)',
            fontSize: 13,
            fontFamily: 'inherit',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            boxShadow: inSearchMode ? '0 0 0 2px rgba(232, 115, 45, 0.1)' : 'none',
          }}
        />
      </div>

                 {/* Results container. Key changes on EVERY query change so React
          remounts the subtree and CSS animations fire fresh each time —
          otherwise typing more characters within the same "search mode"
          wouldn't trigger any visual transition, since React would
          reconcile in place. */}
      <div key={`${inSearchMode ? 'search' : 'grouped'}-${query}`} className="approach-library-results">
        {inSearchMode ? (
          <SearchResultsView results={searchResults} query={query} />
        ) : (
          <GroupedView
            grouped={grouped}
            expandedPatterns={expandedPatterns}
            onToggle={togglePattern}
          />
        )}
      </div>
    </div>
  );
}

function GroupedView({ grouped, expandedPatterns, onToggle }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {grouped.map(({ pattern, approaches }) => {
        const isExpanded = expandedPatterns.has(pattern);
        return (
          <div
            key={pattern}
            style={{
              border: '1px solid var(--border)',
              borderRadius: 8,
              background: 'var(--bg-hover, #1a1a1a)',
              overflow: 'hidden',
            }}
          >
            <button
              onClick={() => onToggle(pattern)}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 14px',
                background: 'none',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                fontFamily: 'inherit',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  display: 'inline-block',
                  transition: 'transform 0.2s ease',
                  transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                  fontSize: 10,
                  color: 'var(--text-low)',
                }}>▶</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-high)' }}>
                  {pattern}
                </span>
              </div>
              <span style={{
                fontSize: 11,
                color: 'var(--text-low)',
                fontFamily: 'var(--font-mono)',
              }}>
                {approaches.length}
              </span>
            </button>
            {isExpanded && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                padding: '4px 12px 12px',
              }}>
                {approaches.map((a) => (
                  <ApproachCard key={a.problemId} approach={a} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SearchResultsView({ results, query }) {
  if (results.length === 0) {
    return (
      <div
        className="approach-empty-fade"
        style={{
          padding: 24,
          textAlign: 'center',
          fontSize: 13,
          color: 'var(--text-low)',
        }}
      >
        No approaches match "{query}"
      </div>
    );
  }
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 6 }}
      className="approach-results-list"
    >
      {results.map((a, i) => (
        <div
          key={a.problemId}
          className="approach-result-item"
          style={{
            // Staggered delay — each item comes in slightly after the last,
            // capped at 8 items so a huge result list doesn't cascade for
            // seconds. Beyond 8, items snap in with 0 delay.
            animationDelay: `${Math.min(i, 8) * 25}ms`,
          }}
        >
          <ApproachCard approach={a} showPattern />
        </div>
      ))}
    </div>
  );
}

function ApproachCard({ approach, showPattern }) {
  const dateStr = approach.date
    ? new Date(approach.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null;

  return (
    <div style={{
      padding: '10px 12px',
      background: 'var(--bg-elevated, #1a1a1a)',
      border: '1px solid var(--border)',
      borderRadius: 6,
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 8,
        marginBottom: 6,
      }}>
        <Link
          to={`/problem/${approach.problemId}`}
          style={{
            fontSize: 13,
            color: 'var(--text-high)',
            fontWeight: 500,
            textDecoration: 'none',
            flex: 1,
            minWidth: 0,
          }}
        >
          {approach.problemName}
        </Link>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
          <Badge type={getDifficultyType(approach.difficulty)}>{approach.difficulty}</Badge>
        </div>
      </div>
      <div style={{
        fontSize: 12,
        color: 'var(--text-mid)',
        lineHeight: 1.6,
        fontStyle: 'italic',
        marginBottom: 6,
        whiteSpace: 'pre-wrap',
      }}>
        "{approach.approach}"
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 10,
        color: 'var(--text-low)',
      }}>
        <span>
          {approach.topicLabel}
          {showPattern && approach.pattern && ` · ${approach.pattern}`}
        </span>
        {dateStr && <span style={{ fontFamily: 'var(--font-mono)' }}>{dateStr}</span>}
      </div>
    </div>
  );
}