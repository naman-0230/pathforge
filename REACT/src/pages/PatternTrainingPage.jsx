import { useState, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import TopicChip from '../components/TopicChip';
import PatternQuestion from '../components/PatternQuestion';
import PatternResults from '../components/PatternResults';
import { useApp } from '../context/AppContext.jsx';
import { topics } from '../data/topics.js';
import {
  generateQuestions,
  gradeAnswer,
  getExplanation,
  recordSessionResult,
} from '../utils/patternEngine.js';
import { triggerSync } from '../utils/sync.js';
import { usePageTitle } from '../utils/usePageTitle.js';
import '../styles/app.css';
import '../styles/patternTraining.css';

// PatternTrainingPage — three-phase state machine:
//   phase 'setup'    → user picks topics + difficulty + question count
//   phase 'session'  → running questions one at a time
//   phase 'results'  → post-session summary

const ROUND_LENGTHS = [5, 10, 15];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export default function PatternTrainingPage() {
  usePageTitle('Pattern Training');
  const { roadmapSetup, user } = useApp();

  // Seed selected topics from user's roadmap (only seeded topics that
  // are in their selection). This is the most useful default — no point
  // training patterns from topics they aren't studying.
  const availableTopics = useMemo(() => {
    return topics.filter((t) => t.seeded);
  }, []);

  const defaultTopicKeys = useMemo(() => {
    if (!roadmapSetup?.selectedTopics?.length) {
      return availableTopics.map((t) => t.key);
    }
    return roadmapSetup.selectedTopics.filter((k) =>
      availableTopics.some((t) => t.key === k)
    );
  }, [roadmapSetup, availableTopics]);

  const [phase, setPhase] = useState('setup');
  const [selectedTopicKeys, setSelectedTopicKeys] = useState(defaultTopicKeys);
  const [selectedDifficulties, setSelectedDifficulties] = useState(DIFFICULTIES);
  const [roundLength, setRoundLength] = useState(10);
  const [setupError, setSetupError] = useState(null);

  // Session state
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState([]); // { correct, userAnswer, timeSpentMs }
  const [feedback, setFeedback] = useState(null); // { correct, explanation }
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [finalSession, setFinalSession] = useState(null);

  function toggleTopic(key) {
    setSelectedTopicKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
    setSetupError(null);
  }

  function toggleDifficulty(diff) {
    setSelectedDifficulties((prev) =>
      prev.includes(diff) ? prev.filter((d) => d !== diff) : [...prev, diff]
    );
    setSetupError(null);
  }

  function handleStart() {
    if (selectedTopicKeys.length === 0) {
      setSetupError('Pick at least one topic to train on.');
      return;
    }
    if (selectedDifficulties.length === 0) {
      setSetupError('Pick at least one difficulty level.');
      return;
    }

    const qs = generateQuestions({
      topicKeys: selectedTopicKeys,
      difficulties: selectedDifficulties,
      count: roundLength,
    });

    if (qs.length === 0) {
      setSetupError('Not enough problems in your selection to generate questions. Try adding more topics or difficulty levels.');
      return;
    }
    if (qs.length < roundLength) {
      // Silently downsize the round — some topics don't have enough patterns
      // for the requested count. Better a short round than an error.
    }

    setQuestions(qs);
    setCurrentIdx(0);
    setAnswers([]);
    setFeedback(null);
    setSessionStartTime(Date.now());
    setPhase('session');
  }

  function handleAnswerSubmit(userAnswer, timeSpentMs) {
    const q = questions[currentIdx];
    const correct = gradeAnswer(q, userAnswer);
    const explanation = getExplanation(q, correct);

    setAnswers((prev) => [
      ...prev,
      { userAnswer, timeSpentMs, correct },
    ]);
    setFeedback({ correct, explanation });
  }

  function handleNext() {
    setFeedback(null);
    if (currentIdx + 1 >= questions.length) {
      finishSession();
    } else {
      setCurrentIdx((i) => i + 1);
    }
  }

  function finishSession() {
    const timeSpentMs = Date.now() - sessionStartTime;
    const score = answers.filter((a) => a.correct).length;

    // Build the full session record — attach userAnswer/correct/timeSpent
    // to each question for history storage
    const enrichedQuestions = questions.map((q, i) => ({
      ...q,
      userAnswer: answers[i]?.userAnswer,
      correct: answers[i]?.correct || false,
      timeSpentMs: answers[i]?.timeSpentMs || 0,
    }));

    const session = {
      sessionId: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      topicKeys: selectedTopicKeys,
      difficulties: selectedDifficulties,
      questions: enrichedQuestions,
      score,
      totalQuestions: questions.length,
      timeSpentMs,
    };

    recordSessionResult(session);
    if (user?.id) triggerSync(user.id);

    setFinalSession(session);
    setPhase('results');
  }

  function handleTrainAgain() {
    setPhase('setup');
    setQuestions([]);
    setCurrentIdx(0);
    setAnswers([]);
    setFeedback(null);
    setFinalSession(null);
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div>
            <h1>Pattern Training</h1>
            <p className="page-sub">
              Train the meta-skill: recognizing which pattern to use — not solving problems you've already seen.
            </p>
          </div>
        </div>

        {phase === 'setup' && (
          <SetupView
            availableTopics={availableTopics}
            selectedTopicKeys={selectedTopicKeys}
            onToggleTopic={toggleTopic}
            selectedDifficulties={selectedDifficulties}
            onToggleDifficulty={toggleDifficulty}
            roundLength={roundLength}
            onSetRoundLength={setRoundLength}
            error={setupError}
            onStart={handleStart}
          />
        )}

        {phase === 'session' && questions.length > 0 && (
          <SessionView
            question={questions[currentIdx]}
            questionNumber={currentIdx + 1}
            totalQuestions={questions.length}
            feedback={feedback}
            onSubmit={handleAnswerSubmit}
            onNext={handleNext}
          />
        )}

        {phase === 'results' && finalSession && (
          <PatternResults
            session={finalSession}
            onTrainAgain={handleTrainAgain}
          />
        )}
      </main>
    </div>
  );
}

function SetupView({
  availableTopics,
  selectedTopicKeys,
  onToggleTopic,
  selectedDifficulties,
  onToggleDifficulty,
  roundLength,
  onSetRoundLength,
  error,
  onStart,
}) {
  return (
    <div className="pattern-setup">
      <div className="pattern-setup-section">
        <label className="pattern-setup-label">Topics to train on</label>
        <div className="topic-grid">
          {availableTopics.map((t) => (
            <TopicChip
              key={t.key}
              icon={t.icon}
              label={t.label}
              selected={selectedTopicKeys.includes(t.key)}
              onClick={() => onToggleTopic(t.key)}
            />
          ))}
        </div>
      </div>

      <div className="pattern-setup-section">
        <label className="pattern-setup-label">Difficulty</label>
        <div className="pattern-difficulty-chips">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              className={`pattern-diff-chip ${selectedDifficulties.includes(d) ? 'selected' : ''}`}
              onClick={() => onToggleDifficulty(d)}
              type="button"
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="pattern-setup-section">
        <label className="pattern-setup-label">Round length</label>
        <div className="pattern-round-chips">
          {ROUND_LENGTHS.map((n) => (
            <button
              key={n}
              className={`pattern-round-chip ${roundLength === n ? 'selected' : ''}`}
              onClick={() => onSetRoundLength(n)}
              type="button"
            >
              {n} questions
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="pattern-setup-error">
          {error}
        </div>
      )}

      <div className="pattern-setup-actions">
        <Button variant="primary" onClick={onStart}>
          Start training →
        </Button>
      </div>
    </div>
  );
}

function SessionView({ question, questionNumber, totalQuestions, feedback, onSubmit, onNext }) {
  const isAnswered = feedback !== null;

  return (
    <div className="pattern-session">
      <div className="pattern-progress-bar">
        <div
          className="pattern-progress-fill"
          style={{ width: `${((questionNumber - (isAnswered ? 0 : 1)) / totalQuestions) * 100}%` }}
        />
      </div>

      {!isAnswered ? (
        <PatternQuestion
          question={question}
          questionNumber={questionNumber}
          totalQuestions={totalQuestions}
          onSubmit={onSubmit}
        />
      ) : (
        <div className={`pattern-feedback ${feedback.correct ? 'correct' : 'wrong'}`}>
          <div className="pattern-feedback-icon">
            {feedback.correct ? '✓' : '✗'}
          </div>
          <div className="pattern-feedback-verdict">
            {feedback.correct ? 'Correct!' : 'Not quite.'}
          </div>
          <div className="pattern-feedback-explanation">
            {feedback.explanation}
          </div>
          <Button variant="primary" onClick={onNext}>
            {questionNumber >= totalQuestions ? 'See results' : 'Next question →'}
          </Button>
        </div>
      )}
    </div>
  );
}