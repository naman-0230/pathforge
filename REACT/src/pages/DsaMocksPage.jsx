import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import DsaMockLandingView from '../components/DsaMockLandingView';
import { useApp } from '../context/AppContext.jsx';
import { canAccess } from '../utils/tierGate.js';
import { DSA_MOCK_CATEGORIES, getCategoryStats } from '../data/dsaMocks/questions.js';
import { getSessionHistory, getTopicPerformance } from '../utils/dsaMocks.js';
import { usePageTitle } from '../utils/usePageTitle.js';
import '../styles/app.css';
import '../styles/dsaMocks.css';

// DsaMocksPage — hub for the DSA Mock Tests feature at /dsa-mocks.
//
// TIER GATING:
//   Requires 'advanced' tier via canAccess('theoryTests', tier). Free and
//   Basic users see DsaMockLandingView (preview + 3 sample questions).
//
// GOAL-MODE TABS:
//   Interview / Viva / General / All — filter for the topic cards' question
//   counts. Doesn't change what topics are shown, just what counts as
//   "questions available" per topic.

const GOAL_MODE_TABS = [
  { value: 'all', label: 'All', icon: '📚' },
  { value: 'interview', label: 'Interview', icon: '💼' },
  { value: 'viva', label: 'Viva', icon: '🎓' },
  { value: 'general', label: 'General', icon: '📝' },
];

const MIXED_TEST_PRESETS = [
  { duration: 30, count: 20, label: '30 min · 20 questions' },
  { duration: 45, count: 30, label: '45 min · 30 questions' },
];

export default function DsaMocksPage() {
  usePageTitle('DSA Mock Tests');
  const { user, tierLoaded } = useApp();
  const userTier = user?.tier || 'free';
  const hasAccess = canAccess('theoryTests', userTier);

  const [goalMode, setGoalMode] = useState('all');
  const [categoryStats] = useState(() => getCategoryStats());
  const [performance, setPerformance] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!hasAccess) return;
    setPerformance(getTopicPerformance());
    setHistory(getSessionHistory());
  }, [hasAccess]);

  if (!tierLoaded) {
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="main-content" />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <DsaMockLandingView userTier={userTier} />
        </main>
      </div>
    );
  }

  const recentSessions = history.slice(0, 5);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div>
            <h1>📝 DSA Mock Tests</h1>
            <p className="page-sub">
              Theory + concept questions to prep for interviews and viva. Not implementation — pure knowledge testing.
            </p>
          </div>
        </div>

        {/* Goal mode tabs */}
        <div className="dsa-goal-tabs">
          {GOAL_MODE_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              className={`dsa-goal-tab ${goalMode === tab.value ? 'active' : ''}`}
              onClick={() => setGoalMode(tab.value)}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Topic cards */}
        <div className="dsa-topic-grid">
          {Object.values(categoryStats).map((cat) => {
            const perf = performance.find((p) => p.topicKey === cat.key);
            const goalCount = goalMode === 'all'
              ? cat.total
              : (cat.byGoalMode?.[goalMode] || 0);
            return (
              <TopicCard
                key={cat.key}
                topic={cat}
                performance={perf}
                goalMode={goalMode}
                goalCount={goalCount}
              />
            );
          })}
        </div>

        {/* Test section */}
        <div className="dsa-test-section">
          <div className="dsa-test-section-header">
            <div>
              <h2>Take a mixed test</h2>
              <p>All topics combined. Timed, real interview-round feel.</p>
            </div>
          </div>
          <div className="dsa-test-actions">
            {MIXED_TEST_PRESETS.map((preset) => (
              <Link
                key={preset.label}
                to={`/dsa-mocks/test?mode=mixed&duration=${preset.duration}&count=${preset.count}&goalMode=${goalMode}`}
                className={preset === MIXED_TEST_PRESETS[0] ? 'btn btn-primary' : 'btn'}
              >
                🕐 {preset.label}
              </Link>
            ))}
          </div>
          <div className="dsa-sectional-row">
            <span className="dsa-sectional-label">Sectional test:</span>
            {Object.values(categoryStats).map((cat) => (
              <Link
                key={cat.key}
                to={`/dsa-mocks/test?mode=sectional&topicKey=${cat.key}&duration=15&count=15&goalMode=${goalMode}`}
                className="dsa-sectional-chip"
              >
                {cat.icon} {cat.shortLabel}
              </Link>
            ))}
          </div>
        </div>

        {/* Recent sessions */}
        {recentSessions.length > 0 && (
          <div className="dsa-recent-section">
            <div className="dsa-recent-header">
              <h2>Recent sessions</h2>
              <Link to="/analytics" className="btn btn-sm">See analytics</Link>
            </div>
            <div className="dsa-recent-list">
              {recentSessions.map((s) => (
                <RecentSessionRow key={s.sessionId} session={s} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function TopicCard({ topic, performance, goalMode, goalCount }) {
  const accuracy = performance?.accuracy;
  const seen = performance?.seen || 0;

  return (
    <div className="dsa-topic-card">
      <div className="dsa-topic-card-header">
        <span className="dsa-topic-icon">{topic.icon}</span>
        <div>
          <div className="dsa-topic-name">{topic.label}</div>
          <div className="dsa-topic-meta">
            {goalCount} questions{goalMode !== 'all' ? ` · ${goalMode}` : ''}
          </div>
        </div>
      </div>

      {seen > 0 && (
        <div className="dsa-topic-stats">
          <span className="dsa-topic-stat">
            <strong>{accuracy}%</strong> accuracy
          </span>
          <span className="dsa-topic-stat-sep">·</span>
          <span className="dsa-topic-stat">{seen} attempted</span>
        </div>
      )}

      <div className="dsa-topic-difficulty">
        <DifficultyPill count={topic.byDifficulty.easy} label="Easy" color="green" />
        <DifficultyPill count={topic.byDifficulty.medium} label="Medium" color="amber" />
        <DifficultyPill count={topic.byDifficulty.hard} label="Hard" color="red" />
      </div>

      <div className="dsa-topic-actions">
        <Link
          to={`/dsa-mocks/${topic.key}?goalMode=${goalMode}`}
          className="btn btn-sm btn-primary"
        >
          {topic.sectionCount} sections →
        </Link>
      </div>
    </div>
  );
}

function DifficultyPill({ count, label, color }) {
  return (
    <span className={`dsa-diff-pill dsa-diff-pill-${color}`}>
      {count} {label}
    </span>
  );
}

function RecentSessionRow({ session }) {
  const percent = Math.round((session.correctCount / session.questionCount) * 100);
  const dateStr = new Date(session.completedAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric',
  });
  const topicInfo = DSA_MOCK_CATEGORIES[session.topicKey];
  const modeLabel = session.mode === 'practice'
    ? `Practice · ${topicInfo?.shortLabel || 'Mixed'}`
    : session.mode === 'sectional-test'
    ? `Sectional · ${topicInfo?.shortLabel || session.topicKey}`
    : 'Mixed test';

  const color = percent >= 66
    ? 'var(--green, #3fae63)'
    : percent >= 33
    ? 'var(--amber, #d9a441)'
    : 'var(--red, #e35b5b)';

  return (
    <div className="dsa-recent-row">
      <div>
        <div className="dsa-recent-mode">{modeLabel}</div>
        <div className="dsa-recent-meta">
          {session.correctCount}/{session.questionCount} correct · {dateStr}
        </div>
      </div>
      <div style={{
        fontSize: 14,
        fontWeight: 600,
        color,
        fontFamily: 'var(--font-mono, monospace)',
      }}>
        {percent}%
      </div>
    </div>
  );
}