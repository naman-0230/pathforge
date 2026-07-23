import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import { useApp } from '../context/AppContext.jsx';
import {
  getTierLabel,
  getTierPrice,
  getUpgradeCost,
  APTITUDE_ADDON_PRICE,
  TIER_DURATION_MONTHS,
} from '../utils/tierGate.js';
import { CONTACT_INFO, submitUpgradeRequest, getPendingUpgrades } from '../utils/upgradeFlow.js';
import { usePageTitle } from '../utils/usePageTitle.js';
import '../styles/app.css';
import '../styles/pricing.css';

// CheckoutPage — dedicated payment flow for upgrades.
//
// URL: /checkout?tier=basic|advanced|aptitude_addon
//
// PHASES:
//   'loading'    → checking user state
//   'invalid'    → invalid tier param or invalid upgrade
//   'has-pending' → user already has a pending request
//   'ready'      → payment instructions + "I've paid" button
//   'submitting' → creating pending_upgrades row
//   'success'    → request submitted, waiting for admin action
//   'error'      → request failed

export default function CheckoutPage() {
  usePageTitle('Complete Upgrade');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, tierLoaded } = useApp();

  const requestedTier = searchParams.get('tier'); // 'basic' | 'advanced' | 'aptitude_addon'
  const currentTier = user?.tier || 'free';
  const currentAptitudeAccess = user?.aptitudeAccess || false;

  const [phase, setPhase] = useState('loading');
  const [transactionId, setTransactionId] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState(null);
  const [existingRequests, setExistingRequests] = useState([]);

  // Compute price
  const price = (() => {
    if (requestedTier === 'aptitude_addon') return APTITUDE_ADDON_PRICE;
    return getUpgradeCost(currentTier, requestedTier);
  })();

  const isValidUpgrade = (() => {
    if (!requestedTier) return false;
    if (requestedTier === 'aptitude_addon') return !currentAptitudeAccess;
    if (requestedTier === currentTier) return false; // same tier
    if (price === null) return false; // downgrade
    return ['basic', 'advanced'].includes(requestedTier);
  })();

  // Check for existing pending requests on mount
  useEffect(() => {
    if (!tierLoaded || !user?.id) return;

    if (!isValidUpgrade) {
      setPhase('invalid');
      return;
    }

    (async () => {
      const pending = await getPendingUpgrades(user.id);
      const matchingPending = pending.filter((p) => p.requested_tier === requestedTier);
      if (matchingPending.length > 0) {
        setExistingRequests(matchingPending);
        setPhase('has-pending');
      } else {
        setPhase('ready');
      }
    })();
  }, [tierLoaded, user?.id, requestedTier, isValidUpgrade]);

  async function handleSubmit() {
    if (!user?.id) return;

    setPhase('submitting');
    setError(null);

    const result = await submitUpgradeRequest({
      userId: user.id,
      currentTier,
      currentAptitudeAccess,
      requestedTier,
      priceInr: price,
      transactionId: transactionId.trim() || null,
      notes: notes.trim() || null,
    });

    if (result.success) {
      setPhase('success');
    } else {
      setError(result.error || 'Something went wrong');
      setPhase('error');
    }
  }

  // Copy payment details helper
  function copyPaymentDetails() {
    const text = `PathForge Upgrade\nTier: ${requestedTier}\nPrice: ₹${price}\nEmail: ${user?.email}\nUPI: ${CONTACT_INFO.upi}`;
    navigator.clipboard?.writeText(text);
    alert('Payment details copied to clipboard.');
  }

  const tierDisplay = requestedTier === 'aptitude_addon'
    ? 'Aptitude Add-on'
    : getTierLabel(requestedTier);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="checkout-page">
          <div className="page-header">
            <div>
              <Link to="/settings#tier" className="checkout-back-link">
                ← Back to Settings
              </Link>
              <h1>Complete Upgrade</h1>
              <p className="page-sub">{tierDisplay}</p>
            </div>
          </div>

          {phase === 'loading' && (
            <div className="checkout-loading">Loading...</div>
          )}

          {phase === 'invalid' && (
            <InvalidView requestedTier={requestedTier} currentTier={currentTier} />
          )}

          {phase === 'has-pending' && (
            <HasPendingView requests={existingRequests} />
          )}

          {(phase === 'ready' || phase === 'submitting') && (
            <ReadyView
              requestedTier={requestedTier}
              currentTier={currentTier}
              price={price}
              userEmail={user?.email}
              transactionId={transactionId}
              setTransactionId={setTransactionId}
              notes={notes}
              setNotes={setNotes}
              onSubmit={handleSubmit}
              submitting={phase === 'submitting'}
              onCopy={copyPaymentDetails}
            />
          )}

          {phase === 'success' && (
            <SuccessView requestedTier={requestedTier} />
          )}

          {phase === 'error' && (
            <ErrorView error={error} onRetry={() => setPhase('ready')} />
          )}
        </div>
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PHASE COMPONENTS
// ─────────────────────────────────────────────────────────────

function InvalidView({ requestedTier, currentTier }) {
  return (
    <div className="checkout-invalid">
      <div className="checkout-icon">⚠️</div>
      <h2>Invalid upgrade</h2>
      <p>
        {!requestedTier
          ? "No tier specified. Please pick a plan from the pricing page."
          : `You can't upgrade to ${requestedTier} from your current ${currentTier} tier.`}
      </p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 20 }}>
        <Link to="/pricing" className="btn btn-primary">Browse pricing</Link>
        <Link to="/settings#tier" className="btn">Back to Settings</Link>
      </div>
    </div>
  );
}

function HasPendingView({ requests }) {
  const latest = requests[0];
  const requestedAt = new Date(latest.requested_at).toLocaleString();

  return (
    <div className="checkout-pending">
      <div className="checkout-icon">⏳</div>
      <h2>Your request is being processed</h2>
      <p>
        You submitted an upgrade request on <strong>{requestedAt}</strong>.
        We'll verify your payment and activate your account within 24 hours
        (usually much faster during working hours).
      </p>
      <div className="checkout-pending-details">
        <div><strong>Requested tier:</strong> {latest.requested_tier}</div>
        {latest.price_paid_inr && (
          <div><strong>Amount:</strong> ₹{latest.price_paid_inr}</div>
        )}
        {latest.transaction_id && (
          <div><strong>Your transaction ID:</strong> {latest.transaction_id}</div>
        )}
      </div>
      <p className="checkout-pending-note">
        Once your tier is activated, you'll see it update automatically — no need to refresh.
        You'll also get a confirmation notification in the app.
      </p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 20 }}>
        <Link to="/dashboard" className="btn btn-primary">Back to dashboard</Link>
        <a
          href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noreferrer"
          className="btn"
        >
          Contact us on WhatsApp
        </a>
      </div>
    </div>
  );
}

function ReadyView({
  requestedTier,
  currentTier,
  price,
  userEmail,
  transactionId,
  setTransactionId,
  notes,
  setNotes,
  onSubmit,
  submitting,
  onCopy,
}) {
  const isAddon = requestedTier === 'aptitude_addon';
  const isUpgradeDiff = !isAddon && currentTier !== 'free';

  return (
    <div className="checkout-ready">
      {/* Summary card */}
      <div className="checkout-summary-card">
        <div className="checkout-summary-header">Order Summary</div>
        <div className="checkout-summary-row">
          <span>Product:</span>
          <strong>
            {isAddon ? 'Aptitude Add-on (lifetime)' : `${getTierLabel(requestedTier)} tier (${TIER_DURATION_MONTHS} months)`}
          </strong>
        </div>
        {isUpgradeDiff && (
          <div className="checkout-summary-row checkout-summary-note">
            <span>Since you're on {getTierLabel(currentTier)}, you pay the difference:</span>
            <span>
              ₹{getTierPrice(requestedTier)} - ₹{getTierPrice(currentTier)}
            </span>
          </div>
        )}
        <div className="checkout-summary-row checkout-summary-total">
          <span>Total:</span>
          <strong>₹{price}</strong>
        </div>
      </div>

      {/* Payment instructions */}
      <div className="checkout-payment-card">
        <div className="checkout-section-title">1. Pay ₹{price} via UPI</div>
        <div className="checkout-upi-block">
          <div className="checkout-upi-label">Send to this UPI ID:</div>
          <div className="checkout-upi-id">{CONTACT_INFO.upi}</div>
          {CONTACT_INFO.bankName && (
            <div className="checkout-alt-payment">
              <div className="checkout-alt-payment-label">Or bank transfer:</div>
              <div>
                {CONTACT_INFO.bankName} · A/C {CONTACT_INFO.bankAccount} · IFSC {CONTACT_INFO.bankIfsc}
              </div>
            </div>
          )}
        </div>

        <div className="checkout-section-title" style={{ marginTop: 20 }}>
          2. Send us proof
        </div>
        <div className="checkout-proof-block">
          <p>Screenshot the payment confirmation and send to:</p>
          <div className="checkout-contact-list">
            <a
              href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="checkout-contact-item"
            >
              📱 WhatsApp: <strong>{CONTACT_INFO.whatsapp}</strong>
            </a>
            <a
              href={`mailto:${CONTACT_INFO.email}?subject=PathForge Upgrade&body=Email: ${userEmail}%0AAmount: ₹${price}%0ATier: ${requestedTier}`}
              className="checkout-contact-item"
            >
              📧 Email: <strong>{CONTACT_INFO.email}</strong>
            </a>
          </div>
          <p className="checkout-proof-include">
            Include these details in your message:
          </p>
          <ul className="checkout-proof-list">
            <li>Your registered email: <strong>{userEmail}</strong></li>
            <li>Tier: {isAddon ? 'Aptitude Add-on' : getTierLabel(requestedTier)}</li>
            <li>Amount paid: ₹{price}</li>
            <li>Payment screenshot</li>
          </ul>
          <button
            type="button"
            className="btn btn-sm"
            onClick={onCopy}
            style={{ marginTop: 8 }}
          >
            📋 Copy details
          </button>
        </div>
      </div>

      {/* Optional metadata */}
      <div className="checkout-optional-card">
        <div className="checkout-section-title">3. Optional info (helps us verify faster)</div>
        <div className="checkout-form-row">
          <label>UPI transaction ID (from your payment confirmation)</label>
          <input
            type="text"
            className="checkout-input"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="e.g. 4XXX2XXX8XXX"
          />
        </div>
        <div className="checkout-form-row">
          <label>Notes (anything else you want us to know)</label>
          <textarea
            className="checkout-input"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional"
          />
        </div>
      </div>

      {/* Submit */}
      <div className="checkout-submit-block">
        <p className="checkout-submit-note">
          <strong>4. Notify us after payment</strong>
          <br />
          Once you've paid + sent proof, click below. We'll activate your account
          within 24 hours (usually 1-2 hours during 9am-9pm IST). Your tier will
          update automatically — no refresh needed.
        </p>
        <Button
          variant="primary"
          onClick={onSubmit}
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : '✓ I\'ve paid, notify us'}
        </Button>
      </div>
    </div>
  );
}

function SuccessView({ requestedTier }) {
  return (
    <div className="checkout-success">
      <div className="checkout-icon">🎉</div>
      <h2>Request received!</h2>
      <p>
        We've got your upgrade request for <strong>{requestedTier === 'aptitude_addon' ? 'Aptitude Add-on' : getTierLabel(requestedTier)}</strong>.
        We'll verify your payment and activate your account soon.
      </p>
      <p>
        <strong>What happens next:</strong>
      </p>
      <ol style={{ textAlign: 'left', maxWidth: 400, margin: '0 auto', color: 'var(--text-mid)', lineHeight: 1.8 }}>
        <li>We check your WhatsApp/email for payment proof</li>
        <li>We verify the payment reached our account</li>
        <li>We activate your tier via our system</li>
        <li>Your app auto-updates within seconds — no refresh needed</li>
        <li>You'll see a celebration notification when it's live</li>
      </ol>
      <p className="checkout-success-time">
        Typical processing time: <strong>1-2 hours during 9am-9pm IST</strong>. Max 24 hours.
      </p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 20 }}>
        <Link to="/dashboard" className="btn btn-primary">Back to dashboard</Link>
        <a
          href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noreferrer"
          className="btn"
        >
          Contact us on WhatsApp
        </a>
      </div>
    </div>
  );
}

function ErrorView({ error, onRetry }) {
  return (
    <div className="checkout-error">
      <div className="checkout-icon">⚠️</div>
      <h2>Something went wrong</h2>
      <p style={{ color: 'var(--red, #e35b5b)' }}>{error}</p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 20 }}>
        <Button variant="primary" onClick={onRetry}>Try again</Button>
        <Link to="/settings" className="btn">Back to Settings</Link>
      </div>
    </div>
  );
}