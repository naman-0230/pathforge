import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import { useApp } from '../context/AppContext.jsx';
import { canAccess } from '../utils/tierGate.js';
import {
  DSA_MOCK_CATEGORIES,
  DSA_MOCK_SECTIONS,
  getSectionStats,
  getQuestionsByFilter,
} from '../data/dsaMocks/questions.js';
import { usePageTitle } from '../utils/usePageTitle.js';
import { topics } from '../data/topics.js';
import { slugify } from '../utils/slug.js';
import '../styles/app.css';
import '../styles/dsaMocks.css';

// DsaMocksTopicPage — section-picker screen shown after picking a topic
// from the hub.
//
// URL: /dsa-mocks/:topicKey?goalMode=interview
//
// User picks:
//   - Section (or "All Sections")
//   - Difficulty (all / easy / medium / hard)
//   - Goal mode (all / interview / viva / general)
//   - Question count (5 / 10 / 15 / 20)
//   - Mode (practice / test)
//
// Each section chip also shows a "📖 Fundamentals" link that deep-links
// to /fundamentals/:topicKey#section-slug (existing TopicFundamentalsPage
// handles the hash scroll).

const DIFFICULTIES = [
  { value: 'all', label: 'All' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

const GOAL_MODES = [
  { value: 'all', label: 'All' },
  { value: 'interview', label: 'Interview' },
  { value: 'viva', label: 'Viva' },
  { value: 'general', label: 'General' },
];

const SESSION_COUNTS = [5, 10, 15, 20];

export default function DsaMocksTopicPage() {
  usePageTitle('DSA Mock Tests');
  const { topicKey } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user, tierLoaded } = useApp();
  const userTier = user?.tier || 'free';
  const hasAccess = canAccess('theoryTests', userTier);

  const topicInfo = DSA_MOCK_CATEGORIES[topicKey];
  const topicMeta = topics.find((t) => t.key === topicKey); // for section fundamentals labels
  const sectionStats = useMemo(
    () => (topicInfo ? getSectionStats(topicKey) : []),
    [topicKey, topicInfo]
  );

  const [selectedSection, setSelectedSection] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [goalMode, setGoalMode] = useState(searchParams.get('goalMode') || 'all');
  const [count, setCount] = useState(10);
  const [mode, setMode] = useState('practice');

  useEffect(() => {
    if (!tierLoaded) return;
    if (!hasAccess) { navigate('/dsa-mocks'); return; }
    if (!topicInfo) { navigate('/dsa-mocks'); }
  }, [tierLoaded, hasAccess, topicInfo, navigate]);

  // Preselect a section if arriving from analytics weak-sub deep-link
  useEffect(() => {
    if (location.state?.preselect) {
      setSelectedSection(location.state.preselect);
    }
  }, [location.state]);

  const availableCount = useMemo(() => {
    return getQuestionsByFilter({
      category: topicKey,
      subcategory: selectedSection === 'all' ? null : selectedSection,
      difficulty,
      goalMode,
    }).length;
  }, [topicKey, selectedSection, difficulty, goalMode]);

  const effectiveCount = Math.min(count, availableCount);

  function handleLaunch() {
    if (availableCount === 0) return;

    if (mode === 'practice') {
      const params = new URLSearchParams({
        topicKey,
        subcategory: selectedSection,
        difficulty,
        goalMode,
        count: String(effectiveCount),
      });
      navigate(`/dsa-mocks/practice?${params.toString()}`);
    } else {
      const params = new URLSearchParams({
        mode: 'sectional',
        topicKey,
        duration: '15',
        count: String(effectiveCount),
        goalMode,
      });
      if (selectedSection !== 'all') params.set('subcategory', selectedSection);
      navigate(`/dsa-mocks/test?${params.toString()}`);
    }
  }

  if (!tierLoaded || !topicInfo) {
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="main-content" />
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="dsa-picker-container">
          {/* Breadcrumb */}
          <nav className="dsa-breadcrumb">
            <Link to="/dsa-mocks">DSA Mock Tests</Link>
            <span className="dsa-breadcrumb-sep">›</span>
            <span>{topicInfo.label}</span>
          </nav>

          <div className="page-header">
            <div>
              <h1>
                <span style={{ marginRight: 10 }}>{topicInfo.icon}</span>
                {topicInfo.label}
              </h1>
              <p className="page-sub">
                {sectionStats.length} sections · {availableCount} questions available for this filter
              </p>
            </div>
          </div>

          {/* Section picker */}
          <div className="dsa-picker-section">
            <div className="dsa-picker-section-title">Select section</div>
            <div className="dsa-picker-chips">
              <button
                type="button"
                className={`dsa-picker-chip dsa-picker-chip-all ${selectedSection === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedSection('all')}
              >
                <span>All Sections</span>
                <span className="dsa-picker-chip-count">
                  {getQuestionsByFilter({ category: topicKey, difficulty, goalMode }).length}
                </span>
              </button>

              {sectionStats.map((sec) => {
                const subCount = getQuestionsByFilter({
                  category: topicKey,
                  subcategory: sec.slug,
                  difficulty,
                  goalMode,
                }).length;
                const isActive = selectedSection === sec.slug;
                const disabled = subCount === 0;
                // Match section name from topicMeta for fundamentals link
                const originalSectionName = topicMeta?.sections.find(
                  (s) => slugify(s) === sec.slug
                );

                return (
                  <div key={sec.slug} className="dsa-picker-chip-wrap">
                    <button
                      type="button"
                      className={`dsa-picker-chip ${isActive ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
                      onClick={() => !disabled && setSelectedSection(sec.slug)}
                      disabled={disabled}
                      title={disabled ? 'No questions for this section yet' : sec.label}
                    >
                      <span>{sec.label}</span>
                      <span className="dsa-picker-chip-count">{subCount}</span>
                    </button>
                    {originalSectionName && (
                      <Link
                        to={`/fundamentals/${topicKey}#${sec.slug}`}
                        className="dsa-picker-chip-fund"
                        title={`Read ${sec.label} fundamentals`}
                      >
                        📖
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Config: difficulty + goal mode + count + mode */}
          <div className="dsa-picker-config">
            <div className="dsa-picker-config-group">
              <div className="dsa-picker-config-label">Difficulty</div>
              <div className="dsa-picker-pills">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    className={`dsa-picker-pill ${difficulty === d.value ? 'active' : ''}`}
                    onClick={() => setDifficulty(d.value)}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="dsa-picker-config-group">
              <div className="dsa-picker-config-label">Goal</div>
              <div className="dsa-picker-pills">
                {GOAL_MODES.map((g) => (
                  <button
                    key={g.value}
                    type="button"
                    className={`dsa-picker-pill ${goalMode === g.value ? 'active' : ''}`}
                    onClick={() => setGoalMode(g.value)}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="dsa-picker-config-group">
              <div className="dsa-picker-config-label">Questions</div>
              <div className="dsa-picker-pills">
                {SESSION_COUNTS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`dsa-picker-pill ${count === n ? 'active' : ''}`}
                    onClick={() => setCount(n)}
                    disabled={n > availableCount}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="dsa-picker-config-group">
              <div className="dsa-picker-config-label">Mode</div>
              <div className="dsa-picker-pills">
                <button
                  type="button"
                  className={`dsa-picker-pill ${mode === 'practice' ? 'active' : ''}`}
                  onClick={() => setMode('practice')}
                >
                  Practice
                </button>
                <button
                  type="button"
                  className={`dsa-picker-pill ${mode === 'test' ? 'active' : ''}`}
                  onClick={() => setMode('test')}
                >
                  Test
                </button>
              </div>
            </div>
          </div>

          {/* Mode description */}
          <div className="dsa-picker-mode-desc">
            {mode === 'practice' ? (
              <>
                <strong>Practice mode:</strong> Navigate freely. Skip questions and come back.
                Get instant feedback + explanations after answering. Submit anytime.
              </>
            ) : (
              <>
                <strong>Test mode:</strong> Timed 15-minute sectional test. Jump between questions freely.
                Results shown only on submit — no in-flight feedback.
              </>
            )}
          </div>

          {/* Warnings */}
          {availableCount === 0 && (
            <div className="dsa-picker-warning">
              No questions match this filter combination. Try changing difficulty, goal mode, or section.
            </div>
          )}
          {availableCount > 0 && availableCount < count && (
            <div className="dsa-picker-info">
              Only {availableCount} question{availableCount === 1 ? '' : 's'} available.
              Session will use {availableCount}.
            </div>
          )}

          {/* Launch */}
          <div className="dsa-picker-launch">
            <Button
              variant="primary"
              onClick={handleLaunch}
              disabled={availableCount === 0}
            >
              {mode === 'practice' ? '🚀 Start practice' : '⏱ Start test'}
              {availableCount > 0 && (
                <span style={{ marginLeft: 10, opacity: 0.75, fontSize: 12 }}>
                  · {effectiveCount} question{effectiveCount === 1 ? '' : 's'}
                </span>
              )}
            </Button>
          </div>

          {/* Fundamentals shortcut */}
          <div className="dsa-picker-fund-hint">
            📖 Not sure where to start?{' '}
            <Link to={`/fundamentals/${topicKey}`}>Read {topicInfo.label} fundamentals</Link>{' '}
            to review theory before testing your knowledge.
          </div>
        </div>
      </main>
    </div>
  );
}