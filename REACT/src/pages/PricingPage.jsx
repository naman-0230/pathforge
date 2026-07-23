import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import PricingTierCard from '../components/PricingTierCard';
import PricingComparisonTable from '../components/PricingComparisonTable';
import PricingFAQ from '../components/PricingFAQ';
import { APTITUDE_ADDON_PRICE } from '../utils/tierGate.js';
import { usePageTitle } from '../utils/usePageTitle.js';
import '../styles/app.css';
import '../styles/pricing.css';
import '../styles/landing.css';

// PricingPage — public /pricing route. Accessible to logged-out users
// (for prospects) and logged-in users (upgrade browsing).
//
// Layout:
//   1. Hero
//   2. 3 tier cards (Free / Basic / Advanced)
//   3. Aptitude add-on section (separate below)
//   4. Feature comparison table
//   5. FAQ
//   6. Bottom CTA
//
// TIER CARD BEHAVIOR:
//   - Logged out: "Get [Tier]" → sends to signup with intent param
//   - Logged in: "Current plan" / "Upgrade" / "You're on higher plan"
//     based on user's actual tier

export default function PricingPage() {
  usePageTitle('Pricing');
  const { user } = useApp();
  const isLoggedIn = !!user;
  const currentTier = user?.tier || null;
  const hasAptitude = user?.aptitudeAccess || false;

  return (
    <>
      {/* Same nav as landing for consistency when logged out */}
      {!isLoggedIn && (
        <nav className="nav">
          <div className="nav-logo">
            <div className="nav-logo-dot"></div>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              PathForge
            </Link>
          </div>
          <div className="nav-links">
            <Link to="/" className="btn">Home</Link>
            <Link to="/login" className="btn">Log in</Link>
            <Link to="/signup" className="btn btn-primary">Get started free</Link>
          </div>
        </nav>
      )}

      <div className={isLoggedIn ? 'pricing-page pricing-page-in-app' : 'pricing-page'}>
        {/* Hero */}
        <section className="pricing-hero">
          <h1 className="pricing-hero-title">
            Simple, honest pricing.
          </h1>
          <p className="pricing-hero-sub">
            Built for Indian students. Pay in ₹, no recurring charges — buy 6 months at a time.
          </p>
        </section>

        {/* Tier cards */}
        <section className="pricing-tiers-section">
          <div className="pricing-tier-grid">
            <PricingTierCard
              tier="free"
              currentTier={currentTier}
              loggedIn={isLoggedIn}
            />
            <PricingTierCard
              tier="basic"
              currentTier={currentTier}
              loggedIn={isLoggedIn}
              highlighted
            />
            <PricingTierCard
              tier="advanced"
              currentTier={currentTier}
              loggedIn={isLoggedIn}
            />
          </div>
        </section>

        {/* Aptitude add-on */}
        <section className="pricing-addon-section">
          <div className="pricing-addon-card">
            <div className="pricing-addon-header">
              <div>
                <div className="pricing-addon-badge">Add-on · Stackable</div>
                <h2 className="pricing-addon-title">🧠 Aptitude & LR</h2>
                <p className="pricing-addon-desc">
                  Prep for placement aptitude rounds — Quantitative, Logical Reasoning, Verbal Ability.
                  30+ questions with practice + test modes across all 3 categories.
                </p>
              </div>
              <div className="pricing-addon-price-block">
                <div className="pricing-addon-price">₹{APTITUDE_ADDON_PRICE}</div>
                <div className="pricing-addon-price-sub">lifetime access</div>
              </div>
            </div>

            <ul className="pricing-addon-features">
              <li>✓ Practice mode with instant feedback</li>
              <li>✓ Timed sectional + mixed tests</li>
              <li>✓ Fundamentals + short tricks per category</li>
              <li>✓ Analytics: per-category performance tracking</li>
              <li>✓ Works with any tier — even Free</li>
              <li>✓ One-time purchase, no expiry</li>
            </ul>

            <div className="pricing-addon-action">
              {!isLoggedIn ? (
                <Link
                  to="/signup?intent=aptitude_addon"
                  className="btn btn-primary"
                >
                  Sign up + Get Aptitude
                </Link>
              ) : hasAptitude ? (
                <button className="btn" disabled>
                  ✓ You have this
                </button>
              ) : (
                <Link
                  to="/checkout?tier=aptitude_addon"
                  className="btn btn-primary"
                >
                  Get Aptitude Add-on →
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Comparison table */}
        <section className="pricing-section">
          <div className="pricing-section-title">Compare tiers in detail</div>
          <PricingComparisonTable />
        </section>

        {/* FAQ */}
        <section className="pricing-section">
          <PricingFAQ />
        </section>

        {/* Bottom CTA */}
        {!isLoggedIn && (
          <section className="pricing-bottom-cta">
            <h2>Ready to stop guessing?</h2>
            <p>Start with Free — no credit card needed.</p>
            <Link to="/signup" className="btn btn-primary" style={{ padding: '12px 32px', fontSize: 15 }}>
              Get started free →
            </Link>
          </section>
        )}

        {/* Footer (only when logged out — logged in users have sidebar nav) */}
        {!isLoggedIn && (
          <footer className="footer">
            <div className="nav-logo"><div className="nav-logo-dot"></div>PathForge</div>
            <p style={{ fontSize: 13, color: 'var(--text-low)', marginTop: 8 }}>
              Built for serious DSA + placement prep.
            </p>
          </footer>
        )}
      </div>
    </>
  );
}