import { useState, useEffect } from 'react';

// SimulationTimer — countdown timer showing time remaining in a session.
// Fires onTimeUp when it hits zero. Warns visually at <5min and <1min.
//
// Doesn't own the "started" state — parent controls start/pause via
// the startedAt prop. If startedAt is null, timer shows full duration
// but doesn't tick.

export default function SimulationTimer({ startedAt, durationMs, onTimeUp }) {
  const [now, setNow] = useState(() => Date.now());
  const [hasFired, setHasFired] = useState(false);

  useEffect(() => {
    if (!startedAt) return;
    const tickId = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tickId);
  }, [startedAt]);

  const elapsed = startedAt ? now - startedAt : 0;
  const remaining = Math.max(0, durationMs - elapsed);

  useEffect(() => {
    if (remaining === 0 && startedAt && !hasFired) {
      setHasFired(true);
      onTimeUp?.();
    }
  }, [remaining, startedAt, hasFired, onTimeUp]);

  const totalSeconds = Math.floor(remaining / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const warningLevel = remaining < 60000 ? 'critical' : remaining < 300000 ? 'warning' : 'normal';

  return (
    <div className={`sim-timer sim-timer-${warningLevel}`}>
      <div className="sim-timer-value">{timeStr}</div>
      <div className="sim-timer-label">
        {startedAt ? 'time remaining' : 'total time'}
      </div>
    </div>
  );
}