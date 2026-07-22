import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import DsaMockCodeBlock from '../components/DsaMockCodeBlock';
import { useApp } from '../context/AppContext.jsx';
import { canAccess } from '../utils/tierGate.js';
import { DSA_MOCK_CATEGORIES, getSectionLabel } from '../data/dsaMocks/questions.js';
import {
  generatePracticeSession,
  gradeAnswer,
  recordSessionStart,
  recordSessionResult,
} from '../utils/dsaMocks.js';
import { triggerSync } from '../utils/sync.js';
import { usePageTitle } from '../utils/usePageTitle.js';
import SessionLoader from '../components/SessionLoader';
import '../styles/app.css';
import '../styles/dsaMocks.css';

// DsaMocksPracticePage — free-nav practice mode.
//
// URL: /dsa-mocks/practice?topicKey=arrays&subcategory=two-pointers&difficulty=all&goalMode=all&count=10
//
// Same UX as AptitudePracticePage:
//   - Free navigation (prev/next/jump)
//   - Answering optional (skip and come back)
//   - Per-Q feedback immediately after answering (answer is locked)
//   - Submit anytime; unattempted questions shown as skipped in results

export default function DsaMocksPracticePage() {
  usePageTitle('DSA Mock Practice');
  const { user, tierLoaded } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userTier = user?.tier || 'free';
  const hasAccess = canAccess('theoryTests', userTier);

  const topicKey = searchParams.get('topicKey');
  const subcategory = searchParams.get('subcategory') || 'all';
  const difficulty = searchParams.get('difficulty') || 'all';
  const goalMode = searchParams.get('goalMode') || 'all';
  const count = parseInt(searchParams.get('count') || '10', 10);

  const [session, setSession] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [phase, setPhase] = useState('loading');
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  useEffect(() => {
    if (!tierLoaded) return;
    if (!hasAccess) { navigate('/dsa-mocks'); return; }
    if (!topicKey || !DSA_MOCK_CATEGORIES[topicKey]) { navigate('/dsa-mocks'); return; }

    const s = generatePracticeSession({
      topicKey,
      subcategory: subcategory === 'all' ? null : subcategory,
      difficulty,
      goalMode,
      count,
    });
    if (!s || s.questions.length === 0) {
      navigate('/dsa-mocks');
      return;
    }

    (async () => {
      await recordSessionStart(user?.id, s);
      setSession({ ...s, startedAt: Date.now() });
      setPhase('active');
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tierLoaded, hasAccess, topicKey, subcategory, difficulty, goalMode, count]);

  function goTo(idx) {
    if (!session) return;
    if (idx < 0 || idx >= session.questions.length) return;
    setCurrentIdx(idx);
  }

  function handleSelect(optionIdx) {
    if (!session) return;
    if (feedback[currentIdx]) return; // Locked
    const q = session.questions[currentIdx];
    const result = gradeAnswer(q, optionIdx);
    setAnswers((prev) => ({ ...prev, [currentIdx]: optionIdx }));
    setFeedback((prev) => ({ ...prev, [currentIdx]: result }));
  }

  function handleSubmit() {
    const answeredCount = Object.keys(answers).length;
    const unattempted = session.questions.length - answeredCount;
    if (unattempted > 0) {
      setShowSubmitConfirm(true);
    } else {
      finalizeSession();
    }
  }

  function finalizeSession() {
    setShowSubmitConfirm(false);
    const timeSpentMs = Date.now() - session.startedAt;
    const sessionWithTime = { ...session, timeSpentMs };
    const answersArray = session.questions.map((_, i) =>
      answers[i] != null ? answers[i] : null
    );
    recordSessionResult(sessionWithTime, answersArray);
    if (user?.id) triggerSync(user.id);
    navigate('/dsa-mocks/results', {
      state: { session: sessionWithTime, answers: answersArray },
    });
  }

  function handleCancel() {
    if (!window.confirm('Cancel this practice session? Your progress will not be saved.')) return;
    navigate('/dsa-mocks');
  }

  if (phase === 'loading' || !session) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <SessionLoader icon="📝" label="Preparing your DSA mock..." />
      </main>
    </div>
  );
}

  const currentQuestion = session.questions[currentIdx];
  const currentAnswer = answers[currentIdx];
  const currentFeedback = feedback[currentIdx];
  const isAnswered = !!currentFeedback;
  const topicInfo = DSA_MOCK_CATEGORIES[currentQuestion.category];
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = session.questions.length;
  const sectionLabel = getSectionLabel(currentQuestion.category, currentQuestion.subcategory);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="dsa-practice-container">
          <div className="dsa-practice-header">
            <div>
              <div className="dsa-practice-progress">
                Question {currentIdx + 1} of {totalQuestions} · {answeredCount} answered
              </div>
              <div className="dsa-practice-category">
                {topicInfo.icon} {topicInfo.label} ·{' '}
                <span className={`dsa-diff-inline dsa-diff-inline-${currentQuestion.difficulty}`}>
                  {currentQuestion.difficulty}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Button variant="primary" onClick={handleSubmit}>Submit</Button>
              <button className="sim-active-cancel" onClick={handleCancel} type="button">
                Cancel
              </button>
            </div>
          </div>

          <div className="dsa-progress-bar">
            <div
              className="dsa-progress-fill"
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            />
          </div>

          <div className="dsa-test-nav">
            {session.questions.map((_, idx) => {
              const isCurrent = idx === currentIdx;
              const fb = feedback[idx];
              let cls = 'dsa-test-nav-btn';
              if (isCurrent) cls += ' current';
              else if (fb?.correct) cls += ' answered';
              else if (fb && !fb.correct) cls += ' wrong';
              return (
                <button
                  key={idx}
                  className={cls}
                  onClick={() => goTo(idx)}
                  type="button"
                  title={`Q${idx + 1}`}
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
              <span>{sectionLabel}</span>
              <span>·</span>
              <Link
                to={`/fundamentals/${currentQuestion.category}#${currentQuestion.subcategory}`}
                className="dsa-inline-fund-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                📖 Fundamentals
              </Link>
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
                const isSelected = currentAnswer === idx;
                const isCorrect = isAnswered && idx === currentQuestion.correctIndex;
                const isWrong = isAnswered && isSelected && !currentFeedback.correct;

                let className = 'dsa-option';
                if (isSelected && !isAnswered) className += ' selected';
                if (isCorrect) className += ' correct';
                if (isWrong) className += ' wrong';

                return (
                  <button
                    key={idx}
                    className={className}
                    onClick={() => handleSelect(idx)}
                    type="button"
                    disabled={isAnswered}
                  >
                    <span className="dsa-option-letter">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="dsa-option-text">{opt}</span>
                    {isCorrect && <span className="dsa-option-mark">✓</span>}
                    {isWrong && <span className="dsa-option-mark">✗</span>}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className={`dsa-feedback ${currentFeedback.correct ? 'correct' : 'wrong'}`}>
                <div className="dsa-feedback-header">
                  {currentFeedback.correct ? '✓ Correct' : '✗ Incorrect'}
                </div>
                <div className="dsa-feedback-explanation">
                  {currentFeedback.explanation}
                </div>
              </div>
            )}

            {!isAnswered && (
              <div className="dsa-skip-hint">
                💡 Select an answer, or use the navigator to skip. Come back anytime.
              </div>
            )}
          </div>

          <div className="dsa-practice-nav">
            <Button onClick={() => goTo(currentIdx - 1)} disabled={currentIdx === 0}>
              ← Previous
            </Button>
            <Button
              variant={isAnswered ? 'primary' : undefined}
              onClick={() => goTo(currentIdx + 1)}
              disabled={currentIdx === totalQuestions - 1}
            >
              {isAnswered ? 'Next →' : 'Skip →'}
            </Button>
          </div>
        </div>

        {showSubmitConfirm && (
          <div className="dsa-modal-overlay" onClick={() => setShowSubmitConfirm(false)}>
            <div className="dsa-modal" onClick={(e) => e.stopPropagation()}>
              <div className="dsa-modal-title">Submit with unattempted questions?</div>
              <div className="dsa-modal-body">
                You have <strong>{totalQuestions - answeredCount}</strong> unattempted{' '}
                {totalQuestions - answeredCount === 1 ? 'question' : 'questions'}.
                They'll be marked as skipped.
              </div>
              <div className="dsa-modal-actions">
                <Button onClick={() => setShowSubmitConfirm(false)}>Go back</Button>
                <Button variant="primary" onClick={finalizeSession}>Submit anyway</Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}