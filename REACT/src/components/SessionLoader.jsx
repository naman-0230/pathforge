import { useEffect, useState } from 'react';

// SessionLoader — shared loading UI for session-based features
// (aptitude, DSA mocks, custom tests, weekly tests).
//
// Design goals:
//   - Feels intentional, not accidental
//   - Doesn't flash for very fast loads (< 200ms delay before appearing)
//   - Progressive messaging: shows initial → mid → slow states so long
//     loads don't feel frozen
//   - Uses app's accent color for spinner (visual consistency)
//   - Compact but present — not a full skeleton, not a bare spinner
//
// Usage:
//   <SessionLoader icon="📝" label="Preparing DSA mock..." />
//   <SessionLoader icon="🧠" label="Loading aptitude session..." />
//
// Anti-flash: renders nothing for the first 200ms. If load completes
// faster than that, user never sees the loader (no jank). If it's slow,
// they see the professional loader instead of raw text.

const APPEAR_DELAY_MS = 200;
const MID_STATE_MS = 1500;
const SLOW_STATE_MS = 4000;

export default function SessionLoader({
  icon = '⏳',
  label = 'Preparing your session...',
  subLabel = null,
}) {
  const [visible, setVisible] = useState(false);
  const [loadState, setLoadState] = useState('initial'); // 'initial' | 'mid' | 'slow'

  useEffect(() => {
    // Anti-flash: wait 200ms before showing anything
    const appearTimer = setTimeout(() => setVisible(true), APPEAR_DELAY_MS);

    // Progressive messaging for slow loads
    const midTimer = setTimeout(() => setLoadState('mid'), MID_STATE_MS);
    const slowTimer = setTimeout(() => setLoadState('slow'), SLOW_STATE_MS);

    return () => {
      clearTimeout(appearTimer);
      clearTimeout(midTimer);
      clearTimeout(slowTimer);
    };
  }, []);

  if (!visible) return null;

  const progressiveSubLabel = subLabel || (
    loadState === 'slow'
      ? 'Taking longer than usual — hang tight...'
      : loadState === 'mid'
      ? 'Shuffling questions and preparing your session...'
      : 'Just a moment...'
  );

  return (
    <div className="session-loader">
      <div className="session-loader-inner">
        {/* Animated orbital spinner around the icon */}
        <div className="session-loader-orbit">
          <div className="session-loader-icon">{icon}</div>
          <div className="session-loader-ring" />
          <div className="session-loader-ring session-loader-ring-2" />
        </div>

        {/* Primary label */}
        <div className="session-loader-label">{label}</div>

        {/* Progressive sub-label */}
        <div className="session-loader-sub">{progressiveSubLabel}</div>

        {/* Subtle dots animation as extra "we're alive" signal */}
        <div className="session-loader-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}