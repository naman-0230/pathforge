import Sidebar from '../components/Sidebar';
import TopicStrengthRadar from '../components/TopicStrengthRadar';
import WeakPointRankingList from '../components/WeakPointRankingList';
import ActivityTrendChart from '../components/ActivityTrendChart';
import DifficultyBreakdownChart from '../components/DifficultyBreakdownChart';
import { getTotalSolvedFromLog } from '../utils/activity.js';
import { useApp } from '../context/AppContext.jsx';
import { Link } from 'react-router-dom';
import '../styles/app.css';
import { usePageTitle } from '../utils/usePageTitle.js';

// AnalyticsPage — four views into the same underlying progress data.
// Shows a focused empty state when no problems have been solved yet
// so charts don't crash or render meaninglessly.
export default function AnalyticsPage() {
  usePageTitle('Analytics');
  const { roadmapSetup } = useApp();
  const totalSolved = getTotalSolvedFromLog();
  const hasData = totalSolved > 0;

  // ── No data yet ─────────────────────────────────────────────────────
  if (!hasData) {
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <div className="page-header">
            <div>
              <h1>Analytics</h1>
              <p className="page-sub">How you're actually doing, not just what's checked off</p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
            gap: 16,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 48 }}>📊</div>
            <h2 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.03em' }}>
              Nothing to show yet
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-mid)', maxWidth: 400, lineHeight: 1.7 }}>
              Analytics show up once you've solved some problems. Strength radar, weak point ranking,
              activity trend, and difficulty breakdown all update automatically as you go.
            </p>
            {!roadmapSetup ? (
              <Link to="/settings#study-plan" className="btn btn-primary">
                Configure your roadmap →
              </Link>
            ) : (
              <Link to="/roadmap" className="btn btn-primary">
                Start solving problems →
              </Link>
            )}
            <p style={{ fontSize: 11, color: 'var(--text-low)', marginTop: 4 }}>
              Come back here after your first few problems.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // ── Has data — show charts ───────────────────────────────────────────
  // Minimum solved thresholds before each chart is meaningful:
  //   Strength radar: needs at least 1 topic attempted (3+ problems)
  //   Weak point ranking: needs at least 2 topics with concluded attempts
  //   Activity trend: needs at least a few days of data
  //   Difficulty: needs at least 1 solved (already guaranteed by hasData)
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1>Analytics</h1>
            <p className="page-sub">How you're actually doing, not just what's checked off</p>
          </div>
          <span style={{
            fontSize: 11,
            color: 'var(--text-low)',
            fontFamily: 'var(--font-mono)',
            alignSelf: 'center',
          }}>
            {totalSolved} problems solved
          </span>
        </div>

        <div className="two-col">
          <div className="section-box">
            <div className="section-box-header">
              <span className="section-box-title">Topic strength</span>
            </div>
            <div style={{ padding: '12px 8px' }}>
              {totalSolved < 3 ? (
                <ChartPlaceholder message="Solve a few more problems to see your topic strength radar." />
              ) : (
                <TopicStrengthRadar />
              )}
            </div>
          </div>

          <div className="section-box">
            <div className="section-box-header">
              <span className="section-box-title">Weak point ranking</span>
            </div>
            <div style={{ padding: '16px 0' }}>
              {totalSolved < 5 ? (
                <ChartPlaceholder message="Keep solving — weak point ranking needs a bit more data to be meaningful." />
              ) : (
                <WeakPointRankingList />
              )}
            </div>
          </div>
        </div>

        <div className="two-col" style={{ marginTop: 16 }}>
          <div className="section-box">
            <div className="section-box-header">
              <span className="section-box-title">Activity trend</span>
              <span style={{ fontSize: 12, color: 'var(--text-low)', fontFamily: 'var(--font-mono)' }}>
                last 8 weeks
              </span>
            </div>
            <div style={{ padding: '12px 16px' }}>
              <ActivityTrendChart />
            </div>
          </div>

          <div className="section-box">
            <div className="section-box-header">
              <span className="section-box-title">Difficulty breakdown</span>
            </div>
            <div style={{ padding: '12px 16px' }}>
              <DifficultyBreakdownChart />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ChartPlaceholder — shown when a specific chart needs more data than
// currently available. Keeps the layout intact so it doesn't look broken.
function ChartPlaceholder({ message }) {
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
      <div style={{ fontSize: 28, opacity: 0.4 }}>📈</div>
      <p style={{ fontSize: 12, color: 'var(--text-low)', lineHeight: 1.6, maxWidth: 240 }}>
        {message}
      </p>
    </div>
  );
}