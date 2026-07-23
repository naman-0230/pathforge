import { useEffect, useState } from 'react';
import { getTierLabel } from '../utils/tierGate.js';

// UpgradeSuccessToast — celebration toast that appears when Supabase
// Realtime detects a tier upgrade or aptitude add-on grant.
//
// Triggered by AppContext when it receives a Realtime UPDATE event on
// user_tier. Auto-dismisses after 8 seconds.

export default function UpgradeSuccessToast({ upgrade, onDismiss }) {
  const [visible, setVisible] = useState(false);
  const [collapsing, setCollapsing] = useState(false);

  useEffect(() => {
    if (!upgrade) return;

    // Trigger enter animation
    requestAnimationFrame(() => setVisible(true));

    // Auto-dismiss after 8 seconds
    const dismissTimer = setTimeout(() => {
      handleDismiss();
    }, 8000);

    return () => clearTimeout(dismissTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upgrade]);

  function handleDismiss() {
    setCollapsing(true);
    setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, 300);
  }

  if (!upgrade || !visible) return null;

  const { newTier, isTierUpgrade, isAptitudeGrant } = upgrade;

  let title, message;
  if (isTierUpgrade && isAptitudeGrant) {
    title = `🎉 ${getTierLabel(newTier)} tier + Aptitude activated!`;
    message = 'Full access unlocked. Time to make the most of it.';
  } else if (isTierUpgrade) {
    title = `🎉 ${getTierLabel(newTier)} tier activated!`;
    message = `You now have full ${getTierLabel(newTier)} access.`;
  } else if (isAptitudeGrant) {
    title = '🎉 Aptitude add-on activated!';
    message = 'Practice Quant, LR, and Verbal anytime — lifetime access.';
  } else {
    return null;
  }

  return (
    <div className={`upgrade-success-toast ${collapsing ? 'collapsing' : ''}`}>
      <div className="upgrade-toast-icon">🎉</div>
      <div className="upgrade-toast-body">
        <div className="upgrade-toast-title">{title}</div>
        <div className="upgrade-toast-message">{message}</div>
      </div>
      <button
        className="upgrade-toast-dismiss"
        onClick={handleDismiss}
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}