import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import { useApp } from '../context/AppContext.jsx';
import { canAccessAptitude } from '../utils/tierGate.js';
import { CATEGORIES, getSubcategoryLabel } from '../data/aptitude/questions.js';
import { hasContent } from '../utils/aptitudeFundamentals.js';
import {
  generatePracticeSession,
  gradeAnswer,
  recordSessionStart,
  recordSessionResult,
} from '../utils/aptitude.js';
import { triggerSync } from '../utils/sync.js';
import { usePageTitle } from '../utils/usePageTitle.js';
import '../styles/app.css';
import '../styles/aptitude.css';

// AptitudePracticePage — free-navigation practice mode.
//
// URL: /aptitude/practice?category=quant&subcategory=percentage&difficulty=all&count=10
//
// Key behaviors:
//   - Navigate freely: prev / next / question-navigator dots
//   - Answering is optional — skip and come back
//   - Per-question feedback appears immediately after answering
//   - Answer is locked once given (matches original practice-mode intent)
//   - Submit button always visible; confirms if unattempted count > 0
//   - Reuses AptitudeResultsPage — the existing page already handles
//     unattempted (userAnswer == null) correctly, no changes needed there

export default function AptitudePracticePage() {
  usePageTitle('Aptitude Practice');
  const { user, tierLoaded } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory') || 'all';
  const difficulty = searchParams.get('difficulty') || 'all';
  const count = parseInt(searchParams.get('count') || '10', 10);

  const [session, setSession] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  // answers: object keyed by question index, holds the selected option index
  // (or undefined if unattempted). Object form makes navigation trivial.
  const [answers, setAnswers] = useState({});
  // feedback: object keyed by question index, holds { correct, correctIndex, explanation }
  const [feedback, setFeedback] = useState({});
  const [phase, setPhase] = useState('loading');
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const hasAccess = canAccessAptitude(user);

  useEffect(() => {
    if (!tierLoaded) return;
    if (!hasAccess) { navigate('/aptitude'); return; }
    if (!category || !CATEGORIES[category]) { navigate('/aptitude'); return; }

    const s = generatePracticeSession({
      category,
      subcategory: subcategory === 'all' ? null : subcategory,
      difficulty,
      count,
    });
    if (!s || s.questions.length === 0) {
      navigate('/aptitude');
      return;
    }

    (async () => {
      await recordSessionStart(user?.id, s);
      setSession({ ...s, startedAt: Date.now() });
      setPhase('active');
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tierLoaded, hasAccess, category, subcategory, difficulty, count]);

  function goTo(idx) {
    if (!session) return;
    if (idx < 0 || idx >= session.questions.length) return;
    setCurrentIdx(idx);
  }

  function handleSelect(optionIdx) {
    if (!session) return;
    if (feedback[currentIdx]) return; // Already answered — locked
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
    // Convert answers object → array by index. AptitudeResultsPage expects
    // this shape and already treats null/undefined as skipped.
    const answersArray = session.questions.map((_, i) =>
      answers[i] != null ? answers[i] : null
    );
    recordSessionResult(sessionWithTime, answersArray);
    if (user?.id) triggerSync(user.id);
    navigate('/aptitude/results', {
      state: {
        session: sessionWithTime,
        answers: answersArray,
      },
    });
  }

  function handleCancel() {
    if (!window.confirm('Cancel this practice session? Your progress will not be saved.')) return;
    navigate('/aptitude');
  }

  if (phase === 'loading' || !session) {
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-mid)' }}>
            Loading practice session...
          </div>
        </main>
      </div>
    );
  }

  const currentQuestion = session.questions[currentIdx];
  const currentAnswer = answers[currentIdx];
  const currentFeedback = feedback[currentIdx];
  const isAnswered = !!currentFeedback;
  const catInfo = CATEGORIES[currentQuestion.category];
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = session.questions.length;
  const currentSubLabel = getSubcategoryLabel(currentQuestion.category, currentQuestion.subcategory);
  const currentHasFundamentals = hasContent(currentQuestion.category, currentQuestion.subcategory);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="aptitude-practice-container">
          {/* Header */}
          <div className="aptitude-practice-header">
            <div>
              <div className="aptitude-practice-progress">
                Question {currentIdx + 1} of {totalQuestions} · {answeredCount} answered
              </div>
              <div className="aptitude-practice-category">
                {catInfo.icon} {catInfo.label} ·{' '}
                <span className={`aptitude-diff-inline aptitude-diff-inline-${currentQuestion.difficulty}`}>
                  {currentQuestion.difficulty}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Button variant="primary" onClick={handleSubmit}>
                Submit
              </Button>
              <button className="sim-active-cancel" onClick={handleCancel} type="button">
                Cancel
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="aptitude-progress-bar">
            <div
              className="aptitude-progress-fill"
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            />
          </div>

          {/* Question navigator — coloured dots for quick jump */}
          <div className="aptitude-test-nav">
            {session.questions.map((_, idx) => {
              const isCurrent = idx === currentIdx;
              const ans = answers[idx];
              const fb = feedback[idx];
              let cls = 'aptitude-test-nav-btn';
              if (isCurrent) cls += ' current';
              else if (fb?.correct) cls += ' answered'; // reuse green style
              else if (fb && !fb.correct) cls += ' apt-nav-wrong';
              return (
                <button
                  key={idx}
                  className={cls}
                  onClick={() => goTo(idx)}
                  type="button"
                  title={`Question ${idx + 1}${ans != null ? (fb?.correct ? ' (correct)' : ' (wrong)') : ' (unattempted)'}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Question card */}
          <div className="aptitude-question-card">
            <div className="aptitude-question-meta">
              <span>Q{currentIdx + 1}</span>
              <span>·</span>
              <span>{currentSubLabel}</span>
              {currentHasFundamentals && (
                <>
                  <span>·</span>
                  <Link
                    to={`/aptitude/fundamentals/${currentQuestion.category}/${currentQuestion.subcategory}`}
                    className="aptitude-inline-fund-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    📖 Fundamentals
                  </Link>
                </>
              )}
            </div>

            <div className="aptitude-question-text">
              {currentQuestion.question}
            </div>

            <div className="aptitude-options">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = currentAnswer === idx;
                const isCorrect = isAnswered && idx === currentQuestion.correctIndex;
                const isWrong = isAnswered && isSelected && !currentFeedback.correct;

                let className = 'aptitude-option';
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
                    <span className="aptitude-option-letter">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="aptitude-option-text">{opt}</span>
                    {isCorrect && <span className="aptitude-option-mark">✓</span>}
                    {isWrong && <span className="aptitude-option-mark">✗</span>}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className={`aptitude-feedback ${currentFeedback.correct ? 'correct' : 'wrong'}`}>
                <div className="aptitude-feedback-header">
                  {currentFeedback.correct ? '✓ Correct' : '✗ Incorrect'}
                </div>
                <div className="aptitude-feedback-explanation">
                  {currentFeedback.explanation}
                </div>
              </div>
            )}

            {!isAnswered && (
              <div className="aptitude-skip-hint">
                💡 Select an answer, or use the navigator above to skip to another question. You can come back anytime.
              </div>
            )}
          </div>

          {/* Prev / Next */}
          <div className="aptitude-practice-nav">
            <Button
              onClick={() => goTo(currentIdx - 1)}
              disabled={currentIdx === 0}
            >
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

        {/* Submit confirm modal */}
        {showSubmitConfirm && (
          <div className="aptitude-modal-overlay" onClick={() => setShowSubmitConfirm(false)}>
            <div className="aptitude-modal" onClick={(e) => e.stopPropagation()}>
              <div className="aptitude-modal-title">Submit with unattempted questions?</div>
              <div className="aptitude-modal-body">
                You have <strong>{totalQuestions - answeredCount}</strong> unattempted{' '}
                {totalQuestions - answeredCount === 1 ? 'question' : 'questions'}.
                They will be marked as skipped in your results.
              </div>
              <div className="aptitude-modal-actions">
                <Button onClick={() => setShowSubmitConfirm(false)}>
                  Go back
                </Button>
                <Button variant="primary" onClick={finalizeSession}>
                  Submit anyway
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}