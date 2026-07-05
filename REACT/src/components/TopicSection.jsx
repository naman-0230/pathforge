import Badge from './Badge';
import RoadmapProblemItem from './RoadmapProblemItem';

// TopicSection — one collapsible topic block (Hashing, Arrays, Sliding Window, etc).
//
// KEY CHANGE from the static version: the old toggleSection() function manually
// found the DOM node, toggled display, and flipped the arrow character. Here,
// `isExpanded` is just a boolean passed down from RoadmapPage's state — this
// component only decides *how* to render based on that boolean. Clicking calls
// `onToggle`, which flips that topic's entry in the parent's expandedTopics state.
export default function TopicSection({
  name,
  statusLabel,   // e.g. 'Completed' | 'In progress' | 'Weak point' | 'Upcoming'
  statusType,    // badge color: 'green' | 'purple' | 'amber' | 'gray'
  extraNote,     // e.g. 'Revision due in 2 days' or '+3 extra problems added'
  dotStatus,     // 'done' | 'active' | 'upcoming'
  solved,
  total,
  groups = [],   // [{ subPatternKey, label, solved, total, problems: [...] }]
  moreCount = 0,
  sectionState = '', // 'done' | 'active' | 'weak' | 'upcoming' — controls border color via roadmap.css
  isExpanded,
  onToggle,
  expandable = true,
}) {
  return (
    <div className={`topic-section ${sectionState}`}>
      <div className="topic-section-header" onClick={expandable ? onToggle : undefined}>
        <div className="topic-section-left">
          <span className={`topic-status-dot ${dotStatus}`}></span>
          <span className="topic-section-name">{name}</span>
          <Badge type={statusType}>{statusLabel}</Badge>
          {extraNote && (
            <span style={{ fontSize: 11, color: 'var(--amber)', marginLeft: 4 }}>{extraNote}</span>
          )}
        </div>
        <div className="topic-section-right">
          <span style={{ fontSize: 12, color: 'var(--text-low)', fontFamily: 'var(--font-mono)' }}>
            {solved}/{total}
          </span>
          <span className="expand-icon" style={!expandable ? { opacity: 0.3 } : undefined}>
            {isExpanded ? '▲' : '▼'}
          </span>
        </div>
      </div>

      {/* KEY CHANGE: problems used to be one flat list. Now they're broken into
          sections by subpattern (Two Pointers, Sliding Window, etc.), each with
          its own small header — purely visual grouping, nothing is locked or
          hidden. This just makes the curriculum structure visible instead of
          dumping every problem in the topic into one undifferentiated list. */}
      {expandable && isExpanded && groups.length > 0 && (
        <div className="topic-problems-list">
          {groups.map((group) => (
            <div key={group.subPatternKey}>
              <div
                style={{
                  padding: '10px 20px 6px 36px',
                  fontSize: 10,
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--text-low)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>{group.label}</span>
                <span>{group.solved}/{group.total}</span>
              </div>
              {group.problems.map((p) => (
                <RoadmapProblemItem key={p.id} {...p} />
              ))}
            </div>
          ))}
          {moreCount > 0 && (
            <div className="prob-item more-row">+ {moreCount} more problems in this topic</div>
          )}
        </div>
      )}
    </div>
  );
}