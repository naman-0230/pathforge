import { Link } from 'react-router-dom';
import { getRequiredTier, getTierLabel, getTierPrice } from '../utils/tierGate.js';

// CustomTestLandingView — feature-tease landing shown to Free/Basic users
// when they navigate to /custom-tests. Same visual language as the
// interview-sim and weekly-test landing pages: hero → benefits → sample
// preview → upgrade block.

export default function CustomTestLandingView() {
  const requiredTier = getRequiredTier('customTests');

  return (
    <div className="feature-landing-page">
      <div className="feature-landing-hero">
        <div className="feature-landing-icon">🧰</div>
        <h1>Custom Tests</h1>
        <p className="feature-landing-tagline">
          Build your own tests. Save templates. Practice exactly what you want, when you want.
        </p>
      </div>

      <div className="feature-landing-section">
        <h2>What are custom tests?</h2>
        <p>
          Design your own timed test with the exact topics, difficulty mix, and problem count you
          need. Save the configuration as a template — one click to re-run whenever. Perfect for
          weekly interview warmups, focused pattern drills, or company-specific prep sessions.
        </p>
      </div>

      <div className="feature-landing-section">
        <h2>Why they matter</h2>
        <div className="feature-landing-grid">
          <div className="feature-landing-benefit">
            <div className="feature-landing-benefit-icon">🎯</div>
            <div className="feature-landing-benefit-title">Total control</div>
            <div className="feature-landing-benefit-desc">
              Pick topics, difficulty, count, duration — down to specific patterns. Practice the exact shape of what you're weak at.
            </div>
          </div>
          <div className="feature-landing-benefit">
            <div className="feature-landing-benefit-icon">📁</div>
            <div className="feature-landing-benefit-title">Save templates</div>
            <div className="feature-landing-benefit-desc">
              Set it up once. Re-run anytime. Build a library of practice sets — "Interview warmup," "Trees deep dive," "Company X prep."
            </div>
          </div>
          <div className="feature-landing-benefit">
            <div className="feature-landing-benefit-icon">📈</div>
            <div className="feature-landing-benefit-title">Track per-template</div>
            <div className="feature-landing-benefit-desc">
              See how your score on each template evolves. Watch your "Sliding Window" score climb from 20% to 100% over weeks.
            </div>
          </div>
        </div>
      </div>

      <div className="feature-landing-section">
        <h2>What you can customize</h2>
        <div className="feature-landing-preview">
          <div className="feature-landing-preview-label">Sample template</div>
          <SampleTemplateCard />
        </div>
      </div>

      <div className="feature-landing-upgrade">
        <div className="feature-landing-upgrade-header">
          <div>
            <div className="feature-landing-upgrade-tier">
              {getTierLabel(requiredTier)} tier
            </div>
            <div className="feature-landing-upgrade-price">
              ₹{getTierPrice(requiredTier)} <span>until your deadline</span>
            </div>
          </div>
        </div>
        <ul className="feature-landing-upgrade-benefits">
          <li>✓ Custom tests with full configuration</li>
          <li>✓ Up to 20 saved templates</li>
          <li>✓ Weekly structured tests</li>
          <li>✓ Theory content (OS, DBMS, Networks, OOP)</li>
          <li>✓ Mock interview rounds</li>
          <li>✓ AI approach feedback</li>
        </ul>
        <div className="feature-landing-upgrade-actions">
          <Link to="/settings" className="btn btn-primary">
            Upgrade to {getTierLabel(requiredTier)} →
          </Link>
          <Link to="/dashboard" className="btn">
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

// SampleTemplateCard — a static "here's what a template looks like"
// preview. Not real data, clearly styled as a mockup.
function SampleTemplateCard() {
  return (
    <div style={{
      background: 'var(--bg-elevated, #1a1a1a)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      padding: 14,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-high)' }}>
          Interview warmup
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-low)', fontFamily: 'var(--font-mono)' }}>
          used 8 times · avg 76%
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <SamplePill>Arrays</SamplePill>
        <SamplePill>Strings</SamplePill>
        <SamplePill>Trees</SamplePill>
        <SamplePill>·</SamplePill>
        <SamplePill>5 problems</SamplePill>
        <SamplePill>30 min</SamplePill>
        <SamplePill>20E · 60M · 20H</SamplePill>
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-low)', fontStyle: 'italic' }}>
        Studied sections only · Randomized each run
      </div>
    </div>
  );
}

function SamplePill({ children }) {
  return (
    <span style={{
      fontSize: 10,
      padding: '2px 8px',
      background: 'var(--bg-hover, #1a1a1a)',
      color: 'var(--text-mid)',
      borderRadius: 4,
      border: '1px solid var(--border)',
    }}>
      {children}
    </span>
  );
}