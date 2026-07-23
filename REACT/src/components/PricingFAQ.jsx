import { useState } from 'react';

// PricingFAQ — collapsible FAQ items.
// Users click question to expand answer. Only one open at a time
// keeps the page compact.

const FAQ_ITEMS = [
  {
    q: 'How long does my tier last?',
    a: 'Basic and Advanced tiers give you 6 months of full access from the date of purchase. The Aptitude add-on is a one-time lifetime unlock.',
  },
  {
    q: 'What happens when my tier expires?',
    a: `A warning banner appears on your dashboard 7 days before expiry. You get a 3-day grace period after expiry to renew without losing access. After that, your account downgrades to Free — your data (solved problems, revision schedule, notes) stays intact.`,
  },
  {
    q: 'How do I upgrade from Basic to Advanced?',
    a: 'You pay only the difference (₹200) — not the full Advanced price. This gives you a fresh 6 months of Advanced access starting from the upgrade date.',
  },
  {
    q: 'Is my payment secure?',
    a: `Currently we accept payments via UPI transfer. You send us proof via WhatsApp and we manually activate your account within 24 hours (usually within 1-2 hours during 9am-9pm IST). We're integrating Razorpay soon for instant activation.`,
  },
  {
    q: 'Can I get a refund?',
    a: `We don't have an automated refund policy given the manual payment flow. If you're genuinely unhappy within 7 days of upgrading, message us on WhatsApp and we'll handle it case-by-case.`,
  },
  {
    q: 'Do you offer student discounts?',
    a: `Our pricing is already student-friendly (₹199-399 for 6 months is under $5). We don't offer additional discounts, but the Aptitude add-on at ₹99 is a one-time purchase available to any tier.`,
  },
];

export default function PricingFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  function toggle(index) {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <div className="pricing-faq">
      <div className="pricing-faq-title">Frequently asked questions</div>
      <div className="pricing-faq-list">
        {FAQ_ITEMS.map((item, i) => (
          <div key={i} className={`pricing-faq-item ${openIndex === i ? 'open' : ''}`}>
            <button
              type="button"
              className="pricing-faq-question"
              onClick={() => toggle(i)}
            >
              <span>{item.q}</span>
              <span className="pricing-faq-chevron">
                {openIndex === i ? '−' : '+'}
              </span>
            </button>
            {openIndex === i && (
              <div className="pricing-faq-answer">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}