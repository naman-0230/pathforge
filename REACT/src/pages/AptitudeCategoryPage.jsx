import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import { useApp } from '../context/AppContext.jsx';
import { canAccessAptitude } from '../utils/tierGate.js';
import {
  CATEGORIES,
  SUBCATEGORIES,
  getSubcategoryStats,
  getQuestionsByFilter,
} from '../data/aptitude/questions.js';
import { hasContent } from '../utils/aptitudeFundamentals.js';
import { usePageTitle } from '../utils/usePageTitle.js';
import '../styles/app.css';
import '../styles/aptitude.css';

// AptitudeCategoryPage — intermediate topic-picker screen shown after
// clicking Practice on a category from the aptitude hub.
//
// URL: /aptitude/:category   (e.g. /aptitude/quant)
//
// User flow:
//   1. Pick a subcategory (or "All Topics")
//   2. Pick difficulty (all / easy / medium / hard)
//   3. Pick question count (5 / 10 / 15 / 20)
//   4. Pick mode (practice / test)
//   5. Launch → routes to /aptitude/practice or /aptitude/test with params
//
// Also surfaces a "📖 Fundamentals" link on each subcategory chip when
// that subcategory has real (non-stub) content in its markdown file.

const DIFFICULTIES = [
  { value: 'all', label: 'All' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

const SESSION_COUNTS = [5, 10, 15, 20];

export default function AptitudeCategoryPage() {
  usePageTitle('Aptitude Topics');
  const { category } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, tierLoaded } = useApp();
  const hasAccess = canAccessAptitude(user);

  const categoryInfo = CATEGORIES[category];
  const subcategoryStats = useMemo(
    () => (categoryInfo ? getSubcategoryStats(category) : []),
    [category, categoryInfo]
  );

  const [selectedSub, setSelectedSub] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [count, setCount] = useState(10);
  const [mode, setMode] = useState('practice');

  // Redirect invalid category
  useEffect(() => {
    if (!tierLoaded) return;
    if (!hasAccess) { navigate('/aptitude'); return; }
    if (!categoryInfo) { navigate('/aptitude'); }
  }, [tierLoaded, hasAccess, categoryInfo, navigate]);

  // Preselect from state (arriving from AptitudeFundamentalReader)
  useEffect(() => {
    if (location.state?.preselect) {
      setSelectedSub(location.state.preselect);
    }
  }, [location.state]);

  const availableCount = useMemo(() => {
    return getQuestionsByFilter({
      category,
      subcategory: selectedSub === 'all' ? null : selectedSub,
      difficulty,
    }).length;
  }, [category, selectedSub, difficulty]);

  const effectiveCount = Math.min(count, availableCount);

  function handleLaunch() {
    if (availableCount === 0) return;

    const params = new URLSearchParams({
      category,
      subcategory: selectedSub,
      difficulty,
      count: String(effectiveCount),
    });

    if (mode === 'practice') {
      navigate(`/aptitude/practice?${params.toString()}`);
    } else {
      // Test mode — sectional test scoped to this category (+ subcategory)
      const testParams = new URLSearchParams({
        mode: 'sectional',
        category,
        duration: '20',
        count: String(effectiveCount),
      });
      if (selectedSub !== 'all') testParams.set('subcategory', selectedSub);
      if (difficulty !== 'all') testParams.set('difficulty', difficulty);
      navigate(`/aptitude/test?${testParams.toString()}`);
    }
  }

  if (!tierLoaded || !categoryInfo) {
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
        <div className="aptitude-picker-container">
          {/* Breadcrumb */}
          <nav className="aptitude-picker-breadcrumb">
            <Link to="/aptitude">Aptitude</Link>
            <span className="aptitude-picker-crumb-sep">›</span>
            <span>{categoryInfo.label}</span>
          </nav>

          {/* Header */}
          <div className="page-header">
            <div>
              <h1>
                <span style={{ marginRight: 10 }}>{categoryInfo.icon}</span>
                {categoryInfo.label}
              </h1>
              <p className="page-sub">
                {subcategoryStats.length} topics · {availableCount} questions available for this filter
              </p>
            </div>
          </div>

          {/* Topic picker */}
          <div className="aptitude-picker-section">
            <div className="aptitude-picker-section-title">Select topic</div>
            <div className="aptitude-picker-chips">
              <button
                type="button"
                className={`aptitude-picker-chip aptitude-picker-chip-all ${selectedSub === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedSub('all')}
              >
                <span>All Topics</span>
                <span className="aptitude-picker-chip-count">
                  {getQuestionsByFilter({ category, difficulty }).length}
                </span>
              </button>

              {subcategoryStats.map((sub) => {
                const subCount = getQuestionsByFilter({
                  category,
                  subcategory: sub.slug,
                  difficulty,
                }).length;
                const isActive = selectedSub === sub.slug;
                const hasFundamentals = hasContent(category, sub.slug);
                const disabled = subCount === 0;

                return (
                  <div key={sub.slug} className="aptitude-picker-chip-wrap">
                    <button
                      type="button"
                      className={`aptitude-picker-chip ${isActive ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
                      onClick={() => !disabled && setSelectedSub(sub.slug)}
                      disabled={disabled}
                      title={disabled ? 'No questions yet for this topic' : sub.label}
                    >
                      <span>{sub.label}</span>
                      <span className="aptitude-picker-chip-count">{subCount}</span>
                    </button>
                    {hasFundamentals && (
                      <Link
                        to={`/aptitude/fundamentals/${category}/${sub.slug}`}
                        className="aptitude-picker-chip-fund"
                        title={`Read ${sub.label} fundamentals`}
                      >
                        📖
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Config row: difficulty + count + mode */}
          <div className="aptitude-picker-config">
            <div className="aptitude-picker-config-group">
              <div className="aptitude-picker-config-label">Difficulty</div>
              <div className="aptitude-picker-pills">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    className={`aptitude-picker-pill ${difficulty === d.value ? 'active' : ''}`}
                    onClick={() => setDifficulty(d.value)}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="aptitude-picker-config-group">
              <div className="aptitude-picker-config-label">Questions</div>
              <div className="aptitude-picker-pills">
                {SESSION_COUNTS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`aptitude-picker-pill ${count === n ? 'active' : ''}`}
                    onClick={() => setCount(n)}
                    disabled={n > availableCount}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="aptitude-picker-config-group">
              <div className="aptitude-picker-config-label">Mode</div>
              <div className="aptitude-picker-pills">
                <button
                  type="button"
                  className={`aptitude-picker-pill ${mode === 'practice' ? 'active' : ''}`}
                  onClick={() => setMode('practice')}
                >
                  Practice
                </button>
                <button
                  type="button"
                  className={`aptitude-picker-pill ${mode === 'test' ? 'active' : ''}`}
                  onClick={() => setMode('test')}
                >
                  Test
                </button>
              </div>
            </div>
          </div>

          {/* Mode description */}
          <div className="aptitude-picker-mode-desc">
            {mode === 'practice' ? (
              <>
                <strong>Practice mode:</strong> Navigate freely. Skip questions and come back.
                Get instant feedback after answering each one. Submit anytime — unattempted
                questions are shown separately in results.
              </>
            ) : (
              <>
                <strong>Test mode:</strong> Timed 20-minute sectional test. Jump between questions
                freely; results appear only on submit.
              </>
            )}
          </div>

          {/* Warnings */}
          {availableCount === 0 && (
            <div className="aptitude-picker-warning">
              No questions match this filter. Try changing difficulty or picking a different topic.
            </div>
          )}
          {availableCount > 0 && availableCount < count && (
            <div className="aptitude-picker-info">
              Only {availableCount} question{availableCount === 1 ? '' : 's'} available for this
              selection. Your session will use {availableCount}.
            </div>
          )}

          {/* Launch */}
          <div className="aptitude-picker-launch">
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

          {/* Fundamentals hub link */}
          <div className="aptitude-picker-fund-hint">
            📖 Not sure where to start? <Link to="/aptitude/fundamentals">Browse fundamentals</Link> to learn theory + short tricks before practicing.
          </div>
        </div>
      </main>
    </div>
  );
}