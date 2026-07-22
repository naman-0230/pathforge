// CodeEditorTeaseCard.jsx — full-size upgrade card for the code editor.
//
// Shown in specific contexts where we want to explain the feature in detail:
//   - Free user clicks "Learn more" from the compact locked pill
//   - Future: settings page preview, marketing page
//
// NOT shown as the default state on problem pages — that's what the compact
// SolveInEditorButton locked-pill does. This card is opt-in / secondary.
//
// Contents:
//   - Feature overview (3 columns of icons)
//   - Sample screenshot placeholder (v2 — put actual screenshot)
//   - Upgrade CTA (Basic tier)
//   - Reassurance that Mark Solved still works without upgrade

import { Link } from 'react-router-dom';
import { getTierPrice } from '../utils/tierGate.js';

export default function CodeEditorTeaseCard({ onClose }) {
  const basicPrice = getTierPrice('basic');

  return (
    <div className="code-editor-tease-card">
      {onClose && (
        <button
          type="button"
          className="code-editor-tease-close"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
      )}

      <div className="code-editor-tease-hero">
        <div className="code-editor-tease-icon">💻</div>
        <h2 className="code-editor-tease-title">Solve problems inline</h2>
        <p className="code-editor-tease-tagline">
          Write code, run tests, and track your submissions — all without leaving PathForge.
        </p>
      </div>

      <div className="code-editor-tease-features">
        <div className="code-editor-tease-feature">
          <div className="code-editor-tease-feature-icon">📝</div>
          <div className="code-editor-tease-feature-title">Real editor</div>
          <div className="code-editor-tease-feature-desc">
            Syntax highlighting, auto-indent, bracket matching. C++, Java, Python.
          </div>
        </div>
        <div className="code-editor-tease-feature">
          <div className="code-editor-tease-feature-icon">✅</div>
          <div className="code-editor-tease-feature-title">Test cases</div>
          <div className="code-editor-tease-feature-desc">
            Run against sample cases as you code. Submit runs hidden tests too.
          </div>
        </div>
        <div className="code-editor-tease-feature">
          <div className="code-editor-tease-feature-icon">🏆</div>
          <div className="code-editor-tease-feature-title">Auto-mark solved</div>
          <div className="code-editor-tease-feature-desc">
            Pass all tests → problem auto-marked solved with a code badge.
          </div>
        </div>
      </div>

      <div className="code-editor-tease-cta">
        <div className="code-editor-tease-price-row">
          <div>
            <div className="code-editor-tease-tier">Basic tier</div>
            <div className="code-editor-tease-price">
              ₹{basicPrice} <span>until deadline</span>
            </div>
          </div>
        </div>
        <ul className="code-editor-tease-benefits">
          <li>✓ Code editor on every problem</li>
          <li>✓ Unlimited interview simulations</li>
          <li>✓ Everything Free tier has, unlocked in full</li>
        </ul>
        <div className="code-editor-tease-actions">
          <Link to="/settings#tier" className="btn btn-primary">
            Upgrade to Basic
          </Link>
          {onClose && (
            <button type="button" className="btn" onClick={onClose}>
              Not now
            </button>
          )}
        </div>
      </div>

      <div className="code-editor-tease-reassurance">
        💡 Free tier can code on Arrays &gt; Basics and Hashing. On other problems,
        the Mark Solved button still tracks your progress just like today.
      </div>
    </div>
  );
}