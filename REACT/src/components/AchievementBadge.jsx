// AchievementBadge — one badge display. Renders in two visual states:
//   Unlocked: full color, tier ring (bronze/silver/gold), tooltip with description
//   Locked:   grayscale, faded, question mark description, progress bar if applicable
//
// TIER COLORS:
//   bronze — muted brown/amber
//   silver — cool gray
//   gold   — warm yellow
//   single — accent orange (no tier ring, just the badge)
//
// Progress bar only appears on LOCKED tiered achievements where progress
// and target are set. Unlocked ones are already at 100% so no bar needed.

const TIER_STYLES = {
  bronze: {
    ring: '#a06635',
    ringGlow: 'rgba(160, 102, 53, 0.3)',
    label: 'BRONZE',
  },
  silver: {
    ring: '#b0b0b0',
    ringGlow: 'rgba(176, 176, 176, 0.3)',
    label: 'SILVER',
  },
  gold: {
    ring: '#e0b23a',
    ringGlow: 'rgba(224, 178, 58, 0.4)',
    label: 'GOLD',
  },
  single: {
    ring: 'var(--accent, #e8732d)',
    ringGlow: 'rgba(232, 115, 45, 0.3)',
    label: null,
  },
};

export default function AchievementBadge({ achievement, size = 'md' }) {
  const { unlocked, progress, target, tier, name, description, icon } = achievement;
  const style = TIER_STYLES[tier] || TIER_STYLES.single;
  const isSmall = size === 'sm';

  const showProgress = !unlocked && typeof progress === 'number' && typeof target === 'number';
  const progressPercent = showProgress ? Math.min(100, Math.round((progress / target) * 100)) : 0;

  return (
    <div
      className={`achievement-badge ${unlocked ? 'unlocked' : 'locked'} ${isSmall ? 'small' : ''}`}
      title={unlocked ? `${name} — ${description}` : `Locked: ${description}`}
    >
      <div
        className="achievement-badge-icon-wrap"
        style={{
          borderColor: unlocked ? style.ring : 'var(--border)',
          boxShadow: unlocked ? `0 0 12px ${style.ringGlow}` : 'none',
        }}
      >
        <span className="achievement-badge-icon">
          {unlocked ? icon : '❓'}
        </span>
      </div>

      <div className="achievement-badge-body">
        <div className="achievement-badge-name">
          {unlocked ? name : '???'}
        </div>
        <div className="achievement-badge-description">
          {description}
        </div>
        {showProgress && (
          <>
            <div className="achievement-badge-progress-bar">
              <div
                className="achievement-badge-progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="achievement-badge-progress-text">
              {progress} / {target}
            </div>
          </>
        )}
      </div>

      {unlocked && style.label && (
        <div
          className="achievement-badge-tier"
          style={{ color: style.ring }}
        >
          {style.label}
        </div>
      )}
    </div>
  );
}