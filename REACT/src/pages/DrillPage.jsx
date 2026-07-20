import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import DrillSession from '../components/DrillSession';
import DrillResults from '../components/DrillResults';
import { useApp } from '../context/AppContext.jsx';
import { generateDrill, recordDrillResult, getDrillRecommendation } from '../utils/drillEngine.js';
import { triggerSync } from '../utils/sync.js';
import { usePageTitle } from '../utils/usePageTitle.js';
import '../styles/app.css';
import '../styles/drill.css';

// DrillPage — full-page drill runner. URL: /drill/:pattern (URL-encoded).
//
// Three phases:
//   'loading'  → generate drill, show splash briefly (usually skipped)
//   'active'   → user is doing the drill, DrillSession renders
//   'results'  → drill finished, DrillResults renders with next-drill CTA
//
// EDGE CASES:
//   - Bad pattern in URL (no problems) → error state with back link
//   - User navigates away mid-drill → session data is lost (not persisted
//     until finish). Deliberate — a mid-drill state that could go stale
//     across devices would be worse than losing it. If we later want
//     resumable drills, add a "pathforge:drills:active" storage key.

export default function DrillPage() {
  const { pattern: patternParam } = useParams();
  const navigate = useNavigate();
  const { roadmapSetup, user } = useApp();
  const pattern = decodeURIComponent(patternParam || '');

  usePageTitle(`Drill: ${pattern}`);

  const [phase, setPhase] = useState('loading');
  const [drill, setDrill] = useState(null);
  const [finalSession, setFinalSession] = useState(null);
  const [error, setError] = useState(null);

  const topicKeys = roadmapSetup?.selectedTopics || null;

  useEffect(() => {
    if (!pattern) {
      setError('No pattern specified');
      setPhase('error');
      return;
    }
    const generated = generateDrill(pattern, { topicKeys });
    if (!generated || generated.problems.length === 0) {
      setError(`No problems found for pattern "${pattern}" in your active topics.`);
      setPhase('error');
      return;
    }
    setDrill(generated);
    setPhase('active');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pattern]);

  function handleFinish(session) {
    recordDrillResult(session);
    if (user?.id) triggerSync(user.id);
    setFinalSession(session);
    setPhase('results');
  }

  function handleCancel() {
    navigate('/dashboard');
  }

  function handleStartAnother(newPattern) {
    // Navigate to the new drill, which will trigger the useEffect to
    // regenerate from scratch.
    navigate(`/drill/${encodeURIComponent(newPattern)}`);
  }

  // Compute next recommendation for the results screen (skip the one
  // just completed so we don't recommend the same pattern back)
  const nextRecommendation = (() => {
    if (phase !== 'results') return null;
    const rec = getDrillRecommendation({ topicKeys });
    if (!rec || rec.pattern === pattern) return null;
    return rec;
  })();

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div>
            <h1>Pattern Drill</h1>
            <p className="page-sub">
              Focused practice on one pattern across multiple topics.
            </p>
          </div>
        </div>

        {phase === 'error' && (
          <div className="drill-error">
            <div className="drill-error-icon">⚠️</div>
            <div className="drill-error-message">{error}</div>
            <Link to="/dashboard" className="btn btn-primary">
              Back to dashboard
            </Link>
          </div>
        )}

        {phase === 'active' && drill && (
          <DrillSession
            drill={drill}
            onFinish={handleFinish}
            onCancel={handleCancel}
          />
        )}

        {phase === 'results' && finalSession && (
          <DrillResults
            session={finalSession}
            nextRecommendation={nextRecommendation}
            onStartAnother={handleStartAnother}
          />
        )}
      </main>
    </div>
  );
}