// PricingComparisonTable — medium-detail feature comparison across tiers.
// ~13 features grouped by category for scannability.

const COMPARISON_ROWS = [
  { section: 'Core' },
  { feature: 'DSA Roadmap (450+ problems)', free: true, basic: true, advanced: true },
  { feature: 'Analytics & weak-point detection', free: true, basic: true, advanced: true },
  { feature: 'Revision scheduling (SM-2)', free: true, basic: true, advanced: true },
  { feature: 'Pattern Training + Drills', free: true, basic: true, advanced: true },

  { section: 'Topics & Content' },
  { feature: 'Topics in daily plan', free: 'Arrays only', basic: 'All 8 topics', advanced: 'All 8 topics' },
  { feature: 'Fundamentals content', free: 'Arrays only', basic: 'All topics', advanced: 'All topics' },
  { feature: 'Theory content (OS, DBMS, Networks, OOP)', free: false, basic: false, advanced: true },

  { section: 'Practice & Testing' },
  { feature: 'Interview simulations', free: '1 per week', basic: 'Unlimited', advanced: 'Unlimited' },
  { feature: 'Code editor', free: 'Arrays > first 2 sections', basic: 'Everywhere', advanced: 'Everywhere' },
  { feature: 'Weekly structured tests', free: false, basic: false, advanced: true },
  { feature: 'Custom tests on demand', free: false, basic: false, advanced: true },
  { feature: 'DSA Mock Tests (theory MCQs)', free: false, basic: false, advanced: true },
  { feature: 'AI approach feedback', free: false, basic: false, advanced: 'Coming soon' },
];

export default function PricingComparisonTable() {
  return (
    <div className="pricing-comparison-wrapper">
      <table className="pricing-comparison-table">
        <thead>
          <tr>
            <th className="pricing-comparison-feature-col">Feature</th>
            <th>Free</th>
            <th>Basic</th>
            <th>Advanced</th>
          </tr>
        </thead>
        <tbody>
          {COMPARISON_ROWS.map((row, i) => {
            if (row.section) {
              return (
                <tr key={i} className="pricing-comparison-section-row">
                  <td colSpan={4}>{row.section}</td>
                </tr>
              );
            }
            return (
              <tr key={i}>
                <td className="pricing-comparison-feature-name">{row.feature}</td>
                <ComparisonCell value={row.free} />
                <ComparisonCell value={row.basic} />
                <ComparisonCell value={row.advanced} />
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ComparisonCell({ value }) {
  if (value === true) {
    return <td className="pricing-comparison-cell pricing-comparison-yes">✓</td>;
  }
  if (value === false) {
    return <td className="pricing-comparison-cell pricing-comparison-no">—</td>;
  }
  return (
    <td className="pricing-comparison-cell pricing-comparison-text">
      {value}
    </td>
  );
}