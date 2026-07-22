import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import AptitudeLandingView from '../components/AptitudeLandingView';
import { useApp } from '../context/AppContext.jsx';
import { canAccessAptitude } from '../utils/tierGate.js';
import { getCategoryStats } from '../data/aptitude/questions.js';
import { getCategoryPerformance, getSessionHistory } from '../utils/aptitude.js';
import { usePageTitle } from '../utils/usePageTitle.js';
import '../styles/app.css';
import '../styles/aptitude.css';

// AptitudePage — hub for aptitude add-on. Shows category cards, quick
// stats, and entry points to Practice and Test modes.
//
// TIER GATING:
//   Requires aptitudeAccess=true on user_tier (server-authoritative).
//   Non-purchasers see AptitudeLandingView (feature-tease landing).

export default function AptitudePage() {
    usePageTitle('Aptitude & LR');
    const { user, tierLoaded } = useApp();
    const hasAccess = canAccessAptitude(user);

    const [categoryStats] = useState(() => getCategoryStats());
    const [performance, setPerformance] = useState([]);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (!hasAccess) return;
        setPerformance(getCategoryPerformance());
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

    // Non-purchaser — show landing page
    if (!hasAccess) {
        return (
            <div className="app-layout">
                <Sidebar />
                <main className="main-content">
                    <AptitudeLandingView />
                </main>
            </div>
        );
    }

    const totalSessions = history.length;
    const recentSessions = history.slice(0, 5);

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <div className="page-header">
                    <div>
                        <h1>Aptitude & Logical Reasoning</h1>
                        <p className="page-sub">
                            Practice + test yourself on quant, LR, and verbal ability. Real placement-test format.
                        </p>
                    </div>
                </div>

                {/* Fundamentals shortcut */}
                <div className="aptitude-fund-shortcut">
                    <div>
                        <strong>📖 New: Aptitude Fundamentals</strong>
                        <div style={{ fontSize: 12, color: 'var(--text-mid)', marginTop: 2 }}>
                            Read theory, formulas, and short tricks before practicing.
                        </div>
                    </div>
                    <Link to="/aptitude/fundamentals" className="btn btn-sm">
                        Browse articles →
                    </Link>
                </div>

                {/* Category cards */}
                <div className="aptitude-category-grid">
                    {Object.values(categoryStats).map((cat) => {
                        const perf = performance.find((p) => p.category === cat.key);
                        return (
                            <CategoryCard
                                key={cat.key}
                                category={cat}
                                performance={perf}
                            />
                        );
                    })}
                </div>

                {/* Test mode entry point */}
                <div className="aptitude-test-section">
                    <div className="aptitude-test-section-header">
                        <div>
                            <h2>Take a test</h2>
                            <p>Timed, mixed-category or single-category. Just like actual placement tests.</p>
                        </div>
                    </div>
                    <div className="aptitude-test-actions">
                        <Link
                            to="/aptitude/test?mode=mixed&duration=30&count=20"
                            className="btn btn-primary"
                        >
                            🕐 Mixed test — 30 min, 20 questions
                        </Link>
                        <Link
                            to="/aptitude/test?mode=mixed&duration=45&count=30"
                            className="btn"
                        >
                            Longer mixed — 45 min, 30 questions
                        </Link>
                    </div>
                    <div className="aptitude-sectional-row">
                        <span className="aptitude-sectional-label">Sectional:</span>
                        {Object.values(categoryStats).map((cat) => (
                            <Link
                                key={cat.key}
                                to={`/aptitude/test?mode=sectional&category=${cat.key}&duration=20&count=15`}
                                className="aptitude-sectional-chip"
                            >
                                {cat.icon} {cat.shortLabel}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent sessions */}
                {recentSessions.length > 0 && (
                    <div className="aptitude-recent-section">
                        <div className="aptitude-recent-header">
                            <h2>Recent sessions</h2>
                            <Link to="/analytics" className="btn btn-sm">See analytics</Link>
                        </div>
                        <div className="aptitude-recent-list">
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

function CategoryCard({ category, performance }) {
    const accuracy = performance?.accuracy;
    const seen = performance?.seen || 0;

    return (
        <div className="aptitude-category-card">
            <div className="aptitude-category-card-header">
                <span className="aptitude-category-icon">{category.icon}</span>
                <div>
                    <div className="aptitude-category-name">{category.label}</div>
                    <div className="aptitude-category-meta">
                        {category.total} questions available
                    </div>
                </div>
            </div>

            {seen > 0 && (
                <div className="aptitude-category-stats">
                    <span className="aptitude-category-stat">
                        <strong>{accuracy}%</strong> accuracy
                    </span>
                    <span className="aptitude-category-stat-sep">·</span>
                    <span className="aptitude-category-stat">
                        {seen} attempted
                    </span>
                </div>
            )}

            <div className="aptitude-category-difficulty">
                <DifficultyPill count={category.byDifficulty.easy} label="Easy" color="green" />
                <DifficultyPill count={category.byDifficulty.medium} label="Medium" color="amber" />
                <DifficultyPill count={category.byDifficulty.hard} label="Hard" color="red" />
            </div>

            <div className="aptitude-category-actions">
                <Link
                    to={`/aptitude/${category.key}`}
                    className="btn btn-sm btn-primary"
                >
                    Choose topic →
                </Link>
            </div>
        </div>
    );
}

function DifficultyPill({ count, label, color }) {
    return (
        <span className={`aptitude-diff-pill aptitude-diff-pill-${color}`}>
            {count} {label}
        </span>
    );
}

function RecentSessionRow({ session }) {
    const percent = Math.round((session.correctCount / session.questionCount) * 100);
    const dateStr = new Date(session.completedAt).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric',
    });
    const modeLabel = session.mode === 'practice'
        ? 'Practice'
        : session.mode === 'sectional-test'
            ? `Sectional (${session.category})`
            : 'Mixed test';

    const color = percent >= 66
        ? 'var(--green, #3fae63)'
        : percent >= 33
            ? 'var(--amber, #d9a441)'
            : 'var(--red, #e35b5b)';

    return (
        <div className="aptitude-recent-row">
            <div>
                <div className="aptitude-recent-mode">{modeLabel}</div>
                <div className="aptitude-recent-meta">
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