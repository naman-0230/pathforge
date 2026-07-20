import { useState, useEffect } from 'react';
import Badge from './Badge';
import { getDifficultyType } from '../data/problems.js';

// PatternQuestion — renders one question (either type) and handles user
// interaction. On submit, calls onSubmit(userAnswer). Parent decides
// what to do with the answer (grade it, show feedback, advance).
//
// LOCAL STATE:
//   selectedOption  — for identify-pattern: string (the pattern name)
//   selectedIds     — for match-pair: array of 0/1/2 problem ids
//   startTime       — set on mount for time-per-question tracking
//
// KEYBOARD SUPPORT (nice-to-have): identify-pattern responds to 1-4 keys
// as shortcuts for the four options. match-pair uses click only.

export default function PatternQuestion({ question, questionNumber, totalQuestions, onSubmit }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [startTime] = useState(() => Date.now());

  // Reset selection when question changes (parent renders a new question)
  useEffect(() => {
    setSelectedOption(null);
    setSelectedIds([]);
  }, [question]);

  // Keyboard shortcuts for identify-pattern (1-4)
  useEffect(() => {
    if (question.type !== 'identify-pattern') return;
    function onKey(e) {
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= question.options.length) {
        setSelectedOption(question.options[num - 1]);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [question]);

  function handleToggleId(id) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return prev; // already at 2, don't allow more
      return [...prev, id];
    });
  }

  function handleSubmit() {
    const timeSpentMs = Date.now() - startTime;
    if (question.type === 'identify-pattern') {
      onSubmit(selectedOption, timeSpentMs);
    } else {
      onSubmit(selectedIds, timeSpentMs);
    }
  }

  const canSubmit = question.type === 'identify-pattern'
    ? selectedOption !== null
    : selectedIds.length === 2;

  return (
    <div className="pattern-question">
      <div className="pattern-question-header">
        <span className="pattern-question-counter">
          Question {questionNumber} of {totalQuestions}
        </span>
        <span className="pattern-question-type">
          {question.type === 'identify-pattern' ? 'Identify the pattern' : 'Find the matching pair'}
        </span>
      </div>

      {question.type === 'identify-pattern' ? (
        <IdentifyPatternView
          question={question}
          selectedOption={selectedOption}
          onSelect={setSelectedOption}
        />
      ) : (
        <MatchPairView
          question={question}
          selectedIds={selectedIds}
          onToggle={handleToggleId}
        />
      )}

      <div className="pattern-question-footer">
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          Submit answer
        </button>
      </div>
    </div>
  );
}

function IdentifyPatternView({ question, selectedOption, onSelect }) {
  return (
    <>
      <div className="pattern-prompt">
        Which pattern would you use to solve this problem?
      </div>
      {/* Identify-pattern is a single card, unclamped — plenty of vertical
          room so the whole statement is always visible. No expand toggle
          needed here (the clamp+toggle pattern only applies to match-pair). */}
      <div className="pattern-problem-card pattern-problem-card-single">
        <div className="pattern-problem-name">{question.problem.name}</div>
        <div className="pattern-problem-meta">
          <Badge type={getDifficultyType(question.problem.difficulty)}>
            {question.problem.difficulty}
          </Badge>
          <span className="pattern-problem-topic">{question.problem.topicLabel}</span>
        </div>
        <div className="pattern-problem-statement">
          {question.problem.statement}
        </div>
      </div>

      <div className="pattern-options">
        {question.options.map((opt, i) => (
          <button
            key={opt}
            className={`pattern-option ${selectedOption === opt ? 'selected' : ''}`}
            onClick={() => onSelect(opt)}
          >
            <span className="pattern-option-num">{i + 1}</span>
            <span className="pattern-option-text">{opt}</span>
          </button>
        ))}
      </div>
    </>
  );
}

function MatchPairView({ question, selectedIds, onToggle }) {
  // Track which cards have their full statement expanded. Independent per
  // card — clicking "Show more" on one card doesn't affect the others.
  // Reset when the question changes (via key on the parent).
  const [expandedIds, setExpandedIds] = useState(new Set());

  function toggleExpand(e, id) {
    // Prevent the card's onClick (which selects/deselects) from firing
    // when the user is just trying to expand the description.
    e.preventDefault();
    e.stopPropagation();
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <>
      <div className="pattern-prompt">
        Which two problems use the <strong>same pattern</strong>?
      </div>
      <div className="pattern-problems-grid">
        {question.problems.map((p) => {
          const isSelected = selectedIds.includes(p.id);
          const isExpanded = expandedIds.has(p.id);
          // Rough heuristic: statements longer than ~200 chars will hit the
          // 6-line clamp and need a "Show more" toggle. Shorter ones fit
          // entirely within the clamp and don't need one — checking this
          // avoids showing "Show more" on cards that already show everything.
          const needsToggle = (p.statement?.length || 0) > 200;

          return (
            <button
              key={p.id}
              className={`pattern-problem-card pattern-problem-card-clickable ${isSelected ? 'selected' : ''}`}
              onClick={() => onToggle(p.id)}
              type="button"
            >
              {isSelected && (
                <div className="pattern-problem-check">
                  {selectedIds.indexOf(p.id) + 1}
                </div>
              )}
              <div className="pattern-problem-name">{p.name}</div>
              <div className="pattern-problem-meta">
                <Badge type={getDifficultyType(p.difficulty)}>{p.difficulty}</Badge>
                <span className="pattern-problem-topic">{p.topicLabel}</span>
              </div>
              <div className={`pattern-problem-statement ${isExpanded ? 'expanded' : ''}`}>
                {p.statement}
              </div>
              {needsToggle && (
                <span
                  className="pattern-problem-expand-toggle"
                  onClick={(e) => toggleExpand(e, p.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') toggleExpand(e, p.id);
                  }}
                >
                  {isExpanded ? '← Show less' : 'Show more →'}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div className="pattern-selection-hint">
        {selectedIds.length === 0 && 'Select 2 problems that share a pattern'}
        {selectedIds.length === 1 && 'Select 1 more problem'}
        {selectedIds.length === 2 && '✓ Ready to submit'}
      </div>
    </>
  );
}