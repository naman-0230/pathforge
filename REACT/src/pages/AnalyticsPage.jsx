import Sidebar from '../components/Sidebar';
import TopicStrengthRadar from '../components/TopicStrengthRadar';
import WeakPointRankingList from '../components/WeakPointRankingList';
import ActivityTrendChart from '../components/ActivityTrendChart';
import DifficultyBreakdownChart from '../components/DifficultyBreakdownChart';
import '../styles/app.css';

// AnalyticsPage — four views into the same underlying progress data:
//   1. Topic strength radar — breadth + quality blended per topic
//   2. Weak point ranking — the exact scoring engine behind Dashboard/Roadmap's
//      "Weak" badges, shown as a full ranked list instead of a single flag
//   3. Activity trend — weekly solve counts, smoother than the daily heatmap
//   4. Difficulty breakdown — Easy/Medium/Hard solved so far
//
// Nothing here is separately tracked — it's all derived live from the same
// localStorage progress data every other page already reads and writes to.
export default function AnalyticsPage() {
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

        <div className="two-col">
          <div className="section-box">
            <div className="section-box-header">
              <span className="section-box-title">Topic strength</span>
            </div>
            <div style={{ padding: '12px 8px' }}>
              <TopicStrengthRadar />
            </div>
          </div>

          <div className="section-box">
            <div className="section-box-header">
              <span className="section-box-title">Weak point ranking</span>
            </div>
            <div style={{ padding: '16px 0' }}>
              <WeakPointRankingList />
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