import { useState } from 'react';
import { Link } from 'react-router-dom';
import DsaMockCodeBlock from './DsaMockCodeBlock';
import { getSampleQuestions } from '../data/dsaMocks/questions.js';
import { getTierLabel, getTierPrice } from '../utils/tierGate.js';

// DsaMockLandingView — landing page shown to free/basic tier users on
// /dsa-mocks. Feature-tease + 3 sample questions users can actually try
// (ephemeral — attempts aren't saved). CTA to upgrade to Advanced tier.
//
// SECURITY NOTE: sample questions are real questions from the bank, but
// only 3 are exposed. Even if a user cracks the URL, they'd need the tier
// gate to bypass — which is server-authoritative via canAccess('theoryTests').

export default function DsaMockLandingView({ userTier }) {
  const samples = getSampleQuestions();
  const tierLabel = getTierLabel(userTier);
  const advancedPrice = getTierPrice('advanced');

  return (
    <div className="feature-landing-page">
      <div className="feature-landing-hero">
        <div className="feature-landing-icon">📝</div>
        <h1>DSA Mock Tests</h1>
        <p className="feature-landing-tagline">
          Theory + concept questions for DSA interviews and viva. Test what you actually understand — not just what you've coded.
        </p>
      </div>

      <div className="feature-landing-section">
        <h2>What's included</h2>
        <p>
          Interviewers ask theory. Vivas ask theory. This module tests your <em>understanding</em>
          of complexity, algorithm behavior, code output, and data structure properties — the questions
          that decide whether you pass the technical round or not.
        </p>
      </div>

      <div className="feature-landing-section">
        <h2>Three goal modes</h2>
        <div className="feature-landing-grid">
          <div className="feature-landing-benefit">
            <div className="feature-landing-benefit-icon">💼</div>
            <div className="feature-landing-benefit-title">Interview</div>
            <div className="feature-landing-benefit-desc">
              Tricky complexity questions, code-output prediction, algorithm behavior — the stuff
              that trips people up in FAANG/product-company rounds.
            </div>
          </div>
          <div className="feature-landing-benefit">
            <div className="feature-landing-benefit-icon">🎓</div>
            <div className="feature-landing-benefit-title">Viva</div>
            <div className="feature-landing-benefit-desc">
              Definitions, properties, when-to-use questions. What professors and college examiners
              actually ask in oral rounds.
            </div>
          </div>
          <div className="feature-landing-benefit">
            <div className="feature-landing-benefit-icon">📝</div>
            <div className="feature-landing-benefit-title">General</div>
            <div className="feature-landing-benefit-desc">
              Broader CS knowledge — bridges to fundamentals. Good for reinforcement study sessions.
            </div>
          </div>
        </div>
      </div>

      <div className="feature-landing-section">
        <h2>Try 3 sample questions</h2>
        <p style={{ fontSize: 13, color: 'var(--text-mid)', marginBottom: 16 }}>
          One easy, one medium, one hard — real questions from the bank. Attempts aren't saved.
        </p>
        <div className="dsa-samples-list">
          {samples.map((q, idx) => (
            <SampleQuestion key={q.id} question={q} index={idx} />
          ))}
        </div>
      </div>

      <div className="feature-landing-upgrade">
        <div className="feature-landing-upgrade-header">
          <div>
            <div className="feature-landing-upgrade-tier">
              Advanced tier
            </div>
            <div className="feature-landing-upgrade-price">
              ₹{advancedPrice} <span>until deadline</span>
            </div>
          </div>
        </div>
        <ul className="feature-landing-upgrade-benefits">
          <li>✓ 150+ DSA theory questions across all 8 topics</li>
          <li>✓ Practice + timed sectional + mixed test modes</li>
          <li>✓ Interview / Viva / General goal-mode filtering</li>
          <li>✓ Code snippets with syntax highlighting for output/complexity questions</li>
          <li>✓ Detailed explanations for every question</li>
          <li>✓ Analytics: weak section detection, goal-mode performance split</li>
          <li>✓ Deep-links to DSA fundamentals for topics you struggle with</li>
          <li>✓ Also unlocks Weekly Tests + Custom Tests + Theory Content</li>
        </ul>
        <div className="feature-landing-upgrade-actions">
    <Link to="/checkout?tier=advanced" className="btn btn-primary">
        Upgrade from {tierLabel} → Advanced
    </Link>
    <Link to="/pricing" className="btn">
        See all plans
    </Link>
        </div>
      </div>
    </div>
  );
}

// SampleQuestion — ephemeral in-place question attempt. Selected answer,
// correctness, and explanation shown immediately. No server calls, no
// storage — pure client-side preview.
function SampleQuestion({ question, index }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  function handleSelect(idx) {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
  }

  const isCorrect = revealed && selected === question.correctIndex;

  return (
    <div className="dsa-sample-card">
      <div className="dsa-sample-header">
        <span className="dsa-sample-num">Sample {index + 1}</span>
        <span className={`dsa-diff-inline dsa-diff-inline-${question.difficulty}`}>
          {question.difficulty}
        </span>
        <span className="dsa-sample-topic">{question.category}</span>
      </div>

      <div className="dsa-sample-question">{question.question}</div>

      {question.codeSnippet && (
        <DsaMockCodeBlock code={question.codeSnippet} language={question.language || 'cpp'} />
      )}

      <div className="dsa-sample-options">
        {question.options.map((opt, idx) => {
          const isSelected = selected === idx;
          const isCorrectOpt = revealed && idx === question.correctIndex;
          const isWrongOpt = revealed && isSelected && !isCorrect;

          let className = 'dsa-sample-option';
          if (isSelected && !revealed) className += ' selected';
          if (isCorrectOpt) className += ' correct';
          if (isWrongOpt) className += ' wrong';

          return (
            <button
              key={idx}
              type="button"
              className={className}
              onClick={() => handleSelect(idx)}
              disabled={revealed}
            >
              <span className="dsa-sample-letter">
                {String.fromCharCode(65 + idx)}
              </span>
              <span>{opt}</span>
              {isCorrectOpt && <span className="dsa-sample-mark">✓</span>}
              {isWrongOpt && <span className="dsa-sample-mark">✗</span>}
            </button>
          );
        })}
      </div>

      {revealed && (
        <div className={`dsa-sample-feedback ${isCorrect ? 'correct' : 'wrong'}`}>
          <div className="dsa-sample-feedback-header">
            {isCorrect ? '✓ Correct' : '✗ Incorrect'}
          </div>
          <div className="dsa-sample-feedback-body">
            {question.explanation}
          </div>
        </div>
      )}
    </div>
  );
}