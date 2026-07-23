import { Link } from 'react-router-dom';
import PricingTierCard from './PricingTierCard';

// PricingPreviewLanding — compact 3-tier preview for the landing page.
// Links out to /pricing for full comparison.

export default function PricingPreviewLanding() {
  return (
    <section className="pricing-preview-landing">
      <div className="section-label">Pricing</div>
      <h2 className="section-title">Fair, honest, ₹-priced.</h2>
      <p className="pricing-preview-tagline">
        Start free. Upgrade when you're ready. No recurring charges.
      </p>

      <div className="pricing-preview-grid">
        <PricingTierCard tier="free" mode="compact" loggedIn={false} />
        <PricingTierCard tier="basic" mode="compact" loggedIn={false} highlighted />
        <PricingTierCard tier="advanced" mode="compact" loggedIn={false} />
      </div>

      <div className="pricing-preview-footer">
        <Link to="/pricing" className="btn">
          See full comparison + FAQ →
        </Link>
      </div>
    </section>
  );
}