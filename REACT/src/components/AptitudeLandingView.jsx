import { Link } from 'react-router-dom';

// AptitudeLandingView — feature-tease shown to users who haven't
// purchased the aptitude add-on. Similar visual style to other landing
// pages (interview sim, weekly tests) but pitching a one-time purchase
// instead of a tier upgrade.

export default function AptitudeLandingView() {
  return (
    <div className="feature-landing-page">
      <div className="feature-landing-hero">
        <div className="feature-landing-icon">🧠</div>
        <h1>Aptitude & Logical Reasoning</h1>
        <p className="feature-landing-tagline">
          Complete prep for placement aptitude rounds. Quant, LR, verbal — all in one place.
        </p>
      </div>

      <div className="feature-landing-section">
        <h2>What's included</h2>
        <p>
          Every placement test in India starts with an aptitude round — TCS Digital, Infosys,
          Wipro, Accenture, and dozens more. This add-on gives you focused practice + timed tests
          in the standard three-category format.
        </p>
      </div>

      <div className="feature-landing-section">
        <h2>Three categories</h2>
        <div className="feature-landing-grid">
          <div className="feature-landing-benefit">
            <div className="feature-landing-benefit-icon">🧮</div>
            <div className="feature-landing-benefit-title">Quantitative</div>
            <div className="feature-landing-benefit-desc">
              Numbers, percentages, ratios, time-speed-distance, probability, interest.
            </div>
          </div>
          <div className="feature-landing-benefit">
            <div className="feature-landing-benefit-icon">🧩</div>
            <div className="feature-landing-benefit-title">Logical Reasoning</div>
            <div className="feature-landing-benefit-desc">
              Series, syllogisms, coding-decoding, blood relations, seating, directions.
            </div>
          </div>
          <div className="feature-landing-benefit">
            <div className="feature-landing-benefit-icon">📖</div>
            <div className="feature-landing-benefit-title">Verbal Ability</div>
            <div className="feature-landing-benefit-desc">
              Synonyms, antonyms, grammar, para jumbles, sentence correction, vocabulary.
            </div>
          </div>
        </div>
      </div>

      <div className="feature-landing-section">
        <h2>Three modes</h2>
        <div className="feature-landing-grid">
          <div className="feature-landing-benefit">
            <div className="feature-landing-benefit-icon">📝</div>
            <div className="feature-landing-benefit-title">Practice</div>
            <div className="feature-landing-benefit-desc">
              Untimed. Instant feedback per question. Build fundamentals at your pace.
            </div>
          </div>
          <div className="feature-landing-benefit">
            <div className="feature-landing-benefit-icon">🎯</div>
            <div className="feature-landing-benefit-title">Sectional Test</div>
            <div className="feature-landing-benefit-desc">
              20-min single-category test. Just like real placement tests.
            </div>
          </div>
          <div className="feature-landing-benefit">
            <div className="feature-landing-benefit-icon">⏱️</div>
            <div className="feature-landing-benefit-title">Mixed Test</div>
            <div className="feature-landing-benefit-desc">
              30 or 45 min. All three categories mixed. Full test simulation.
            </div>
          </div>
        </div>
      </div>

      <div className="feature-landing-upgrade">
        <div className="feature-landing-upgrade-header">
          <div>
            <div className="feature-landing-upgrade-tier">
              One-time add-on
            </div>
            <div className="feature-landing-upgrade-price">
              ₹99 <span>lifetime access</span>
            </div>
          </div>
        </div>
        <ul className="feature-landing-upgrade-benefits">
          <li>✓ Full question bank across all 3 categories</li>
          <li>✓ Difficulty filtering (Easy / Medium / Hard)</li>
          <li>✓ Practice + Sectional + Mixed test modes</li>
          <li>✓ Detailed explanations for every question</li>
          <li>✓ Analytics: track accuracy per category over time</li>
          <li>✓ Stackable with Free, Basic, or Advanced tier</li>
          <li>✓ One-time purchase — no recurring charges</li>
        </ul>
        <div className="feature-landing-upgrade-actions">
          <Link to="/checkout?tier=aptitude_addon" className="btn btn-primary">
            Purchase add-on →
          </Link>
          <Link to="/dashboard" className="btn">
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}