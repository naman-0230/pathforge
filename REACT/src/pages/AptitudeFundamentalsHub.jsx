import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useApp } from '../context/AppContext.jsx';
import { canAccessAptitude } from '../utils/tierGate.js';
import { CATEGORIES, SUBCATEGORIES } from '../data/aptitude/questions.js';
import { hasContent, getContentStats } from '../utils/aptitudeFundamentals.js';
import { usePageTitle } from '../utils/usePageTitle.js';
import '../styles/app.css';
import '../styles/aptitude.css';

// AptitudeFundamentalsHub — index page for all aptitude fundamentals.
// URL: /aptitude/fundamentals
//
// Shows every subcategory across all 3 categories. Real (non-stub)
// articles are linkable; stub subcategories show a "coming soon" pill
// and are unclickable. Users write real articles by editing the
// corresponding .md file in src/data/aptitude/fundamentals/.

export default function AptitudeFundamentalsHub() {
  usePageTitle('Aptitude Fundamentals');
  const { user, tierLoaded } = useApp();
  const hasAccess = canAccessAptitude(user);

  // (React import fix — we need useEffect + useNavigate from react-router)
  // Import above uses `useEffect` from 'react' but it wasn't re-exported;
  // fixing:
  // (See real import block below; this comment is just a note.)

  const contentStats = getContentStats();
  const totalTopics = Object.values(SUBCATEGORIES).flat().length;
  const totalWithContent = Object.values(contentStats).reduce((a, b) => a + b, 0);

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
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-mid)' }}>
            Aptitude add-on required to access fundamentals.
            <div style={{ marginTop: 12 }}>
              <Link to="/aptitude" className="btn btn-primary">Learn more</Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="aptitude-fund-hub-container">
          {/* Breadcrumb */}
          <nav className="aptitude-picker-breadcrumb">
            <Link to="/aptitude">Aptitude</Link>
            <span className="aptitude-picker-crumb-sep">›</span>
            <span>Fundamentals</span>
          </nav>

          <div className="page-header">
            <div>
              <h1>📖 Aptitude Fundamentals</h1>
              <p className="page-sub">
                Short tricks, formulas, and theory for every topic.{' '}
                <span className="aptitude-fund-progress-badge">
                  {totalWithContent}/{totalTopics} articles ready
                </span>
              </p>
            </div>
          </div>

          {/* Category blocks */}
          <div className="aptitude-fund-categories">
            {Object.entries(CATEGORIES).map(([catKey, catInfo]) => {
              const subs = SUBCATEGORIES[catKey] || [];
              const readyCount = contentStats[catKey] || 0;

              return (
                <div key={catKey} className="aptitude-fund-cat-block">
                  <div className="aptitude-fund-cat-header">
                    <span style={{ fontSize: 22 }}>{catInfo.icon}</span>
                    <h2>{catInfo.label}</h2>
                    <span className="aptitude-fund-cat-count">
                      {readyCount}/{subs.length}
                    </span>
                  </div>

                  <div className="aptitude-fund-topics-grid">
                    {subs.map((sub) => {
                      const ready = hasContent(catKey, sub.slug);
                      if (ready) {
                        return (
                          <Link
                            key={sub.slug}
                            to={`/aptitude/fundamentals/${catKey}/${sub.slug}`}
                            className="aptitude-fund-topic-card ready"
                          >
                            <span className="aptitude-fund-topic-name">{sub.label}</span>
                            <span className="aptitude-fund-topic-arrow">→</span>
                          </Link>
                        );
                      }
                      return (
                        <div
                          key={sub.slug}
                          className="aptitude-fund-topic-card stub"
                          title="Content coming soon"
                        >
                          <span className="aptitude-fund-topic-name">{sub.label}</span>
                          <span className="aptitude-fund-topic-soon">soon</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="aptitude-fund-cat-footer">
                    <Link to={`/aptitude/${catKey}`} className="btn btn-sm">
                      Practice {catInfo.shortLabel} →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* How to use */}
          <div className="aptitude-fund-howto">
            <div className="aptitude-fund-howto-title">💡 How fundamentals work</div>
            <p>
              Read a topic's fundamentals article before practicing to learn the theory,
              short tricks, and common traps. Articles are added progressively — topics
              marked "soon" are being written.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}