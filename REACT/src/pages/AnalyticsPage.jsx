import Sidebar from '../components/Sidebar';
import TopicStrengthRadar from '../components/TopicStrengthRadar';
import WeakPointRankingList from '../components/WeakPointRankingList';
import ActivityTrendChart from '../components/ActivityTrendChart';
import DifficultyBreakdownChart from '../components/DifficultyBreakdownChart';
import PatternAccuracyChart from '../components/PatternAccuracyChart';
import PatternWeaknessList from '../components/PatternWeaknessList';
import DrillHistoryCard from '../components/DrillHistoryCard';
import ApproachLibrary from '../components/ApproachLibrary';
import PeekReasonBreakdown from '../components/PeekReasonBreakdown';
import ThinkingTimeChart from '../components/ThinkingTimeChart';
import { getAllApproaches } from '../utils/approachLibrary.js';
import { getPeekReasonStats } from '../utils/failureArchive.js';
import { getOverallThinkingTime } from '../utils/thinkingTime.js';
import WeeklyTestHistory from '../components/WeeklyTestHistory';
import { getTestHistory } from '../utils/weeklyTests.js';
import CustomTestHistory from '../components/CustomTestHistory';
import { getSessionHistory as getCustomTestHistory } from '../utils/customTests.js';
import AptitudeAnalytics from '../components/AptitudeAnalytics';
import { getSessionHistory as getAptitudeHistory } from '../utils/aptitude.js';
import DsaMockAnalytics from '../components/DsaMockAnalytics';
import { getSessionHistory as getDsaMockHistory } from '../utils/dsaMocks.js';
import { getTotalSolvedFromLog } from '../utils/activity.js';
import { getSessionHistory, getPatternStats } from '../utils/patternEngine.js';
import { getDrillHistory } from '../utils/drillEngine.js';
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

  // Analytics has data if EITHER problems have been solved OR pattern
  // training/drill activity exists. This means a user who's been doing
  // pattern training but hasn't solved any problems yet still gets
  // meaningful analytics (their pattern data) instead of an empty state.
  const patternHistory = getSessionHistory();
  const patternStats = getPatternStats();
  const drillHistory = getDrillHistory();
  const dsaMockHistory = getDsaMockHistory();
  const hasDsaMockData = dsaMockHistory.length > 0;
  const hasPatternData = patternHistory.length > 0 || Object.keys(patternStats).length > 0;
  const hasDrillData = drillHistory.length > 0;
  const approachCount = getAllApproaches().length;
  const hasApproachData = approachCount > 0;
  const peekStats = getPeekReasonStats();
  const hasPeekData = peekStats.totalPeeks > 0;
  const thinkingTimeOverall = getOverallThinkingTime();
  const hasThinkingTimeData = thinkingTimeOverall !== null;
  const weeklyTestHistory = getTestHistory();
  const hasWeeklyTestData = weeklyTestHistory.length > 0;
  const customTestHistory = getCustomTestHistory();
  const hasCustomTestData = customTestHistory.length > 0;
  const aptitudeHistory = getAptitudeHistory();
  const hasAptitudeData = aptitudeHistory.length > 0;
  const hasData = totalSolved > 0 || hasPatternData || hasDrillData || hasApproachData || hasPeekData || hasThinkingTimeData || hasWeeklyTestData || hasCustomTestData || hasAptitudeData || hasDsaMockData;

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
            {totalSolved} problems · {patternHistory.length} training sessions · {drillHistory.length} drills · {approachCount} approaches
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

        {/* Pattern Training analytics — separate section so users can see at
            a glance how their meta-skill (pattern recognition) is trending,
            distinct from raw problem-solving stats. */}
        <div style={{
          marginTop: 24,
          marginBottom: 12,
          fontSize: 11,
          color: 'var(--text-low)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontWeight: 600,
        }}>
          Pattern Training & Drills
        </div>

        <div className="two-col">
          <div className="section-box">
            <div className="section-box-header">
              <span className="section-box-title">Pattern recognition accuracy</span>
              <span style={{ fontSize: 12, color: 'var(--text-low)', fontFamily: 'var(--font-mono)' }}>
                trend
              </span>
            </div>
            <PatternAccuracyChart />
          </div>

          <div className="section-box">
            <div className="section-box-header">
              <span className="section-box-title">Pattern weakness ranking</span>
            </div>
            <div style={{ padding: '8px 0' }}>
              <PatternWeaknessList />
            </div>
          </div>
        </div>

        <div className="two-col" style={{ marginTop: 16 }}>
          <div className="section-box">
            <div className="section-box-header">
              <span className="section-box-title">Drill activity</span>
              {drillHistory.length > 0 && (
                <span style={{ fontSize: 12, color: 'var(--text-low)', fontFamily: 'var(--font-mono)' }}>
                  {drillHistory.length} total
                </span>
              )}
            </div>
            <DrillHistoryCard />
          </div>

          {/* Placeholder to keep two-col grid balanced. If we later add
              another pattern-related chart (e.g. per-topic pattern accuracy)
              it goes here. For now, leave the space free-flowing on mobile
              (the two-col CSS handles single-column layout below 900px). */}
          <div className="section-box">
            <div className="section-box-header">
              <span className="section-box-title">Why you open solutions</span>
              {peekStats.totalPeeks > 0 && (
                <span style={{ fontSize: 12, color: 'var(--text-low)', fontFamily: 'var(--font-mono)' }}>
                  {peekStats.totalPeeks} total
                </span>
              )}
            </div>
            <PeekReasonBreakdown />
          </div>
        </div>

        {/* Thinking time — measures how long between opening a problem and
            writing anything. A proxy for genuine cognitive processing time,
            distinct from total time (which includes reading, distraction).
            Full-width because the per-topic breakdown benefits from horizontal
            space to show all topics without overflow. */}
        <div className="two-col" style={{ marginTop: 16 }}>
          <div className="section-box">
            <div className="section-box-header">
              <span className="section-box-title">Thinking time</span>
              {thinkingTimeOverall && (
                <span style={{ fontSize: 12, color: 'var(--text-low)', fontFamily: 'var(--font-mono)' }}>
                  avg across topics
                </span>
              )}
            </div>
            <ThinkingTimeChart />
          </div>

          {/* Empty second column — placeholder for a future related chart
              (e.g. thinking time vs confidence correlation). Left free so
              two-col layout stays balanced on desktop; mobile stacks. */}
          <div />
        </div>

        {/* Approach library — the personal cheatsheet built up from every
            approach the user has ever written. Full-width section since
            approach text tends to be long and benefits from horizontal space. */}
        <div style={{
          marginTop: 24,
          marginBottom: 12,
          fontSize: 11,
          color: 'var(--text-low)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontWeight: 600,
        }}>
          Approach Library
        </div>

        <div className="section-box">
          <div className="section-box-header">
            <span className="section-box-title">Your approaches by pattern</span>
            {approachCount > 0 && (
              <span style={{ fontSize: 12, color: 'var(--text-low)', fontFamily: 'var(--font-mono)' }}>
                {approachCount} total
              </span>
            )}
          </div>
          <ApproachLibrary />
        </div>

        {/* Weekly Test history — Advanced-tier feature. Only appears when
            user has taken (or skipped) at least one test. Analytics section
            for tracking score trends across recurring tests. */}
        {hasWeeklyTestData && (
          <>
            <div style={{
              marginTop: 24,
              marginBottom: 12,
              fontSize: 11,
              color: 'var(--text-low)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 600,
            }}>
              Weekly Tests
            </div>

            <div className="section-box">
              <div className="section-box-header">
                <span className="section-box-title">Weekly test history</span>
                <span style={{ fontSize: 12, color: 'var(--text-low)', fontFamily: 'var(--font-mono)' }}>
                  {weeklyTestHistory.length} total
                </span>
              </div>
              <WeeklyTestHistory />
            </div>
          </>
        )}

        {hasCustomTestData && (
          <>
            <div style={{
              marginTop: 24,
              marginBottom: 12,
              fontSize: 11,
              color: 'var(--text-low)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 600,
            }}>
              Custom Tests
            </div>

            <div className="section-box">
              <div className="section-box-header">
                <span className="section-box-title">Custom test performance</span>
                <span style={{ fontSize: 12, color: 'var(--text-low)', fontFamily: 'var(--font-mono)' }}>
                  {customTestHistory.length} total
                </span>
              </div>
              <CustomTestHistory />
            </div>
          </>
        )}

        {hasAptitudeData && (
          <>
            <div style={{
              marginTop: 24,
              marginBottom: 12,
              fontSize: 11,
              color: 'var(--text-low)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 600,
            }}>
              Aptitude & Logical Reasoning
            </div>

            <div className="section-box">
              <div className="section-box-header">
                <span className="section-box-title">Aptitude performance</span>
                <span style={{ fontSize: 12, color: 'var(--text-low)', fontFamily: 'var(--font-mono)' }}>
                  {aptitudeHistory.length} sessions
                </span>
              </div>
              <AptitudeAnalytics />
            </div>
          </>
        )}

        {hasDsaMockData && (
          <>
            <div style={{
              marginTop: 24,
              marginBottom: 12,
              fontSize: 11,
              color: 'var(--text-low)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 600,
            }}>
              DSA Mock Tests
            </div>

            <div className="section-box">
              <div className="section-box-header">
                <span className="section-box-title">DSA theory & concept performance</span>
                <span style={{ fontSize: 12, color: 'var(--text-low)', fontFamily: 'var(--font-mono)' }}>
                  {dsaMockHistory.length} sessions
                </span>
              </div>
              <DsaMockAnalytics />
            </div>
          </>
        )}
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