import { Link } from 'react-router-dom';
import AchievementBadge from './AchievementBadge';
import { getRecentUnlocked, getAchievementStats } from '../utils/achievements.js';

// AchievementShelf — mini-shelf for the Dashboard showing the top 3 most
// notable unlocked achievements (highest tier first). If no achievements
// yet, shows a nudge with a link to see what's available.
//
// Full browsing/exploring happens on /achievements.

export default function AchievementShelf() {
  const recent = getRecentUnlocked(3);
  const stats = getAchievementStats();

  return (
    <div className="section-box">
      <div className="section-box-header">
        <span className="section-box-title">🏆 Achievements</span>
        <Link to="/achievements" className="btn btn-sm">
          See all ({stats.unlocked}/{stats.total})
        </Link>
      </div>

      {recent.length === 0 ? (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          fontSize: 13,
          color: 'var(--text-mid)',
        }}>
          Achievements unlock as you use PathForge — solve problems, keep streaks, complete sections.
          <Link
            to="/achievements"
            style={{
              display: 'inline-block',
              marginTop: 8,
              fontSize: 12,
              color: 'var(--accent, #e8732d)',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            See what's available →
          </Link>
        </div>
      ) : (
        <div className="achievement-shelf-mini">
          {recent.map((a) => (
            <AchievementBadge key={a.id} achievement={a} size="sm" />
          ))}
        </div>
      )}
    </div>
  );
}