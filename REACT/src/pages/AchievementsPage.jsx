import { useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Badge from '../components/Badge';
import AchievementBadge from '../components/AchievementBadge';
import { getGroupedAchievements, getAchievementStats } from '../utils/achievements.js';
import { usePageTitle } from '../utils/usePageTitle.js';
import '../styles/app.css';
import '../styles/achievements.css';

// AchievementsPage — full browsable shelf of every achievement.
// Grouped by category. Filter to see just unlocked, or all.
//
// Locked achievements stay visible (grayscale) so users see what's next
// to unlock. Hiding locked ones would remove the motivational aspect.

export default function AchievementsPage() {
  usePageTitle('Achievements');

  const grouped = useMemo(() => getGroupedAchievements(), []);
  const stats = getAchievementStats();
  const [filter, setFilter] = useState('all'); // 'all' | 'unlocked' | 'locked'

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div>
            <h1>Achievements</h1>
            <p className="page-sub">
              {stats.unlocked} of {stats.total} unlocked · {stats.percent}% complete
            </p>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>
              All
            </FilterChip>
            <FilterChip active={filter === 'unlocked'} onClick={() => setFilter('unlocked')}>
              Unlocked ({stats.unlocked})
            </FilterChip>
            <FilterChip active={filter === 'locked'} onClick={() => setFilter('locked')}>
              Locked ({stats.total - stats.unlocked})
            </FilterChip>
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="achievements-progress-wrap">
          <div className="achievements-progress-bar">
            <div
              className="achievements-progress-fill"
              style={{ width: `${stats.percent}%` }}
            />
          </div>
        </div>

        {grouped.map((cat) => {
          const filtered = cat.items.filter((a) => {
            if (filter === 'unlocked') return a.unlocked;
            if (filter === 'locked') return !a.unlocked;
            return true;
          });
          if (filtered.length === 0) return null;

          const unlockedInCat = cat.items.filter((a) => a.unlocked).length;

          return (
            <div key={cat.key} className="achievements-category">
              <div className="achievements-category-header">
                <span className="achievements-category-title">
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </span>
                <Badge type={unlockedInCat === cat.items.length ? 'green' : 'purple'}>
                  {unlockedInCat}/{cat.items.length}
                </Badge>
              </div>
              <div className="achievements-grid">
                {filtered.map((a) => (
                  <AchievementBadge key={a.id} achievement={a} />
                ))}
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}

function FilterChip({ active, onClick, children }) {
  return (
    <button
      className={`achievements-filter-chip ${active ? 'active' : ''}`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}