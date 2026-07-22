import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import SimulationTimer from '../components/SimulationTimer';
import { useApp } from '../context/AppContext.jsx';
import { canAccessAptitude } from '../utils/tierGate.js';
import { CATEGORIES } from '../data/aptitude/questions.js';
import {
  generateTestSession,
  recordSessionStart,
  recordSessionResult,
} from '../utils/aptitude.js';
import { triggerSync } from '../utils/sync.js';
import { usePageTitle } from '../utils/usePageTitle.js';
import '../styles/app.css';
import '../styles/aptitude.css';

// AptitudeTestPage — timed test mode. All questions shown one at a time
// with a nav bar to jump between them. No feedback until final submit.
// Timer auto-submits on expiry.
// URL: /aptitude/test?mode=mixed|sectional&category=quant&duration=30&count=20

export default function AptitudeTestPage() {
  usePageTitle('Aptitude Test');
  const { user, tierLoaded } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const mode = searchParams.get('mode') || 'mixed';
  const category = searchParams.get('category');
  const duration = parseInt(searchParams.get('duration') || '30', 10);
  const count = parseInt(searchParams.get('count') || '20', 10);

  const [session, setSession] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [phase, setPhase] = useState('loading');

  const hasAccess = canAccessAptitude(user);

  useEffect(() => {
    if (!tierLoaded) return;
    if (!hasAccess) {
      navigate('/aptitude');
      return;
    }

    const s = generateTestSession({ mode, category, durationMinutes: duration, count });
    if (!s) {
      navigate('/aptitude');
      return;
    }

    (async () => {
      await recordSessionStart(user?.id, s);
      setSession({ ...s, startedAt: Date.now() });
      setPhase('active');
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tierLoaded, hasAccess, mode, category, duration, count]);

  function handleSelect(questionIdx, optionIdx) {
    setAnswers((prev) => ({ ...prev, [questionIdx]: optionIdx }));
  }

  function handleNext() {
    if (currentIdx + 1 < session.questions.length) {
      setCurrentIdx((i) => i + 1);
    }
  }

  function handlePrev() {
    if (currentIdx > 0) {
      setCurrentIdx((i) => i - 1);
    }
  }

  function handleJumpTo(idx) {
    setCurrentIdx(idx);
  }

  function handleTimeUp() {
    if (phase !== 'active') return;
    finishTest();
  }

  function handleSubmit() {
    const unanswered = session.questions.length - Object.keys(answers).length;
    if (unanswered > 0) {
      if (!window.confirm(`You have ${unanswered} unanswered question${unanswered === 1 ? '' : 's'}. Submit anyway?`)) return;
    }
    finishTest();
  }

  function handleCancel() {
    if (!window.confirm('Cancel this test? Your progress will not be saved.')) return;
    navigate('/aptitude');
  }

  function finishTest() {
    const timeSpentMs = Date.now() - session.startedAt;
    const sessionWithTime = { ...session, timeSpentMs };
    // Convert answers object to array by index
    const answersArray = session.questions.map((_, i) => answers[i] ?? null);
    recordSessionResult(sessionWithTime, answersArray);
    if (user?.id) triggerSync(user.id);
    navigate('/aptitude/results', {
      state: {
        session: sessionWithTime,
        answers: answersArray,
      },
    });
  }

  if (phase === 'loading' || !session) {
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-mid)' }}>
            Preparing your test...
          </div>
        </main>
      </div>
    );
  }

  const currentQuestion = session.questions[currentIdx];
  const catInfo = CATEGORIES[currentQuestion.category];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="app-layout no-sidebar">
      <main className="main-content">
        <div className="aptitude-test-container">
          <div className="aptitude-test-header">
            <div>
              <div className="aptitude-test-title">
                {session.mode === 'sectional-test'
                  ? `${CATEGORIES[session.category].label} — Sectional Test`
                  : 'Mixed Aptitude Test'}
              </div>
              <div className="aptitude-test-status">
                {answeredCount} of {session.questions.length} answered
              </div>
            </div>
            <SimulationTimer
              startedAt={session.startedAt}
              durationMs={session.durationMs}
              onTimeUp={handleTimeUp}
            />
            <button className="sim-active-cancel" onClick={handleCancel} type="button">
              Cancel
            </button>
          </div>

          {/* Question navigator strip */}
          <div className="aptitude-test-nav">
            {session.questions.map((_, idx) => {
              const isCurrent = idx === currentIdx;
              const isAnswered = answers[idx] != null;
              let cls = 'aptitude-test-nav-btn';
              if (isCurrent) cls += ' current';
              if (isAnswered) cls += ' answered';
              return (
                <button
                  key={idx}
                  className={cls}
                  onClick={() => handleJumpTo(idx)}
                  type="button"
                  title={`Question ${idx + 1}${isAnswered ? ' (answered)' : ''}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="aptitude-question-card">
            <div className="aptitude-question-meta">
              <span>Question {currentIdx + 1}</span>
              <span>·</span>
              <span>{catInfo.icon} {catInfo.shortLabel}</span>
              <span>·</span>
              <span className={`aptitude-diff-inline aptitude-diff-inline-${currentQuestion.difficulty}`}>
                {currentQuestion.difficulty}
              </span>
            </div>

            <div className="aptitude-question-text">
              {currentQuestion.question}
            </div>

            <div className="aptitude-options">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = answers[currentIdx] === idx;
                return (
                  <button
                    key={idx}
                    className={`aptitude-option ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelect(currentIdx, idx)}
                    type="button"
                  >
                    <span className="aptitude-option-letter">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="aptitude-option-text">{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="aptitude-test-actions">
            <Button onClick={handlePrev} disabled={currentIdx === 0}>
              ← Previous
            </Button>
            {currentIdx < session.questions.length - 1 ? (
              <Button variant="primary" onClick={handleNext}>
                Next →
              </Button>
            ) : (
              <Button variant="primary" onClick={handleSubmit}>
                Submit test
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}