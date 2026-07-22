import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import SimulationTimer from '../components/SimulationTimer';
import DsaMockCodeBlock from '../components/DsaMockCodeBlock';
import { useApp } from '../context/AppContext.jsx';
import { canAccess } from '../utils/tierGate.js';
import { DSA_MOCK_CATEGORIES } from '../data/dsaMocks/questions.js';
import {
  generateTestSession,
  recordSessionStart,
  recordSessionResult,
} from '../utils/dsaMocks.js';
import { triggerSync } from '../utils/sync.js';
import { usePageTitle } from '../utils/usePageTitle.js';
import SessionLoader from '../components/SessionLoader';
import '../styles/app.css';
import '../styles/dsaMocks.css';

// DsaMocksTestPage — timed test mode.
//
// URL: /dsa-mocks/test?mode=mixed|sectional&topicKey=arrays&subcategory=x&duration=15&count=15&goalMode=all
//
// One question shown at a time with navigator to jump. No feedback until
// final submit. Timer auto-submits on expiry.

export default function DsaMocksTestPage() {
  usePageTitle('DSA Mock Test');
  const { user, tierLoaded } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userTier = user?.tier || 'free';
  const hasAccess = canAccess('theoryTests', userTier);

  const mode = searchParams.get('mode') || 'mixed';
  const topicKey = searchParams.get('topicKey');
  const subcategory = searchParams.get('subcategory');
  const goalMode = searchParams.get('goalMode') || 'all';
  const duration = parseInt(searchParams.get('duration') || '15', 10);
  const count = parseInt(searchParams.get('count') || '15', 10);

  const [session, setSession] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [phase, setPhase] = useState('loading');

  useEffect(() => {
    if (!tierLoaded) return;
    if (!hasAccess) { navigate('/dsa-mocks'); return; }

    const s = generateTestSession({
      mode,
      topicKey,
      subcategory,
      goalMode,
      durationMinutes: duration,
      count,
    });
    if (!s) { navigate('/dsa-mocks'); return; }

    (async () => {
      await recordSessionStart(user?.id, s);
      setSession({ ...s, startedAt: Date.now() });
      setPhase('active');
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tierLoaded, hasAccess, mode, topicKey, subcategory, goalMode, duration, count]);

  function handleSelect(questionIdx, optionIdx) {
    setAnswers((prev) => ({ ...prev, [questionIdx]: optionIdx }));
  }

  function handleNext() {
    if (currentIdx + 1 < session.questions.length) setCurrentIdx((i) => i + 1);
  }
  function handlePrev() {
    if (currentIdx > 0) setCurrentIdx((i) => i - 1);
  }
  function handleJumpTo(idx) { setCurrentIdx(idx); }

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
    navigate('/dsa-mocks');
  }

  function finishTest() {
    const timeSpentMs = Date.now() - session.startedAt;
    const sessionWithTime = { ...session, timeSpentMs };
    const answersArray = session.questions.map((_, i) => answers[i] ?? null);
    recordSessionResult(sessionWithTime, answersArray);
    if (user?.id) triggerSync(user.id);
    navigate('/dsa-mocks/results', {
      state: { session: sessionWithTime, answers: answersArray },
    });
  }

if (phase === 'loading' || !session) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <SessionLoader icon="📝" label="Preparing your DSA test..." />
      </main>
    </div>
  );
}

  const currentQuestion = session.questions[currentIdx];
  const topicInfo = DSA_MOCK_CATEGORIES[currentQuestion.category];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="app-layout no-sidebar">
      <main className="main-content">
        <div className="dsa-test-container">
          <div className="dsa-test-header">
            <div>
              <div className="dsa-test-title">
                {session.mode === 'sectional-test'
                  ? `${DSA_MOCK_CATEGORIES[session.topicKey]?.label || session.topicKey} — Sectional Test`
                  : 'Mixed DSA Mock Test'}
              </div>
              <div className="dsa-test-status">
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

          <div className="dsa-test-nav">
            {session.questions.map((_, idx) => {
              const isCurrent = idx === currentIdx;
              const isAnswered = answers[idx] != null;
              let cls = 'dsa-test-nav-btn';
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

          <div className="dsa-question-card">
            <div className="dsa-question-meta">
              <span>Q{currentIdx + 1}</span>
              <span>·</span>
              <span>{topicInfo.icon} {topicInfo.shortLabel}</span>
              <span>·</span>
              <span className={`dsa-diff-inline dsa-diff-inline-${currentQuestion.difficulty}`}>
                {currentQuestion.difficulty}
              </span>
            </div>

            <div className="dsa-question-text">
              {currentQuestion.question}
            </div>

            {currentQuestion.codeSnippet && (
              <DsaMockCodeBlock
                code={currentQuestion.codeSnippet}
                language={currentQuestion.language || 'cpp'}
              />
            )}

            <div className="dsa-options">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = answers[currentIdx] === idx;
                return (
                  <button
                    key={idx}
                    className={`dsa-option ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelect(currentIdx, idx)}
                    type="button"
                  >
                    <span className="dsa-option-letter">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="dsa-option-text">{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="dsa-practice-nav">
            <Button onClick={handlePrev} disabled={currentIdx === 0}>← Previous</Button>
            {currentIdx < session.questions.length - 1 ? (
              <Button variant="primary" onClick={handleNext}>Next →</Button>
            ) : (
              <Button variant="primary" onClick={handleSubmit}>Submit test</Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}