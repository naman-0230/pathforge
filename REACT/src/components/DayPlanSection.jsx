import { Link } from 'react-router-dom';
import Badge from './Badge';
import { getTopic } from '../data/topics.js';
import { getDifficultyType } from '../data/problems.js';

// DayPlanSection — the visual for the STORED, calendar-dated day plan
// (roadmapGenerator.js resolveDayPlan / getMissedProblems). Three behaviors
// that didn't exist before:
//
//   1. GRAYING: a day's problems are always rendered from `day.problems`,
//      which includes solved ones too (tagged `solved: true`) — they no
//      longer just disappear from the list. Solved rows render grayed out,
//      struck through, with a check mark instead of the difficulty badge.
//   2. COMPLETION CELEBRATION: when a day is `isToday` and `allSolved`, its
//      header shows a small "quota complete" badge instead of the day
//      label alone.
//   3. MISSED / CATCH-UP: `missedProblems` (unsolved items from days whose
//      date has already passed) render in a separate section, visually
//      distinct (amber), ABOVE the day list — never merged into any day's
//      quota, per the "catch-up you clear at your own pace" decision.
//
// Only today + future days are shown in the main day list — past days are
// either fully solved (nothing to show) or have unsolved leftovers, which
// are already surfaced via `missedProblems` instead.
export default function DayPlanSection({ dayPlan = [], missedProblems = [], defaultVisibleDays = 7 }) {
  const visibleAllDays = dayPlan.filter((d) => !d.isPast);
  const hasAnything = visibleAllDays.some((d) => d.total > 0) || missedProblems.length > 0;

  if (!hasAnything) {
    return (
      <div className="section-box" style={{ marginBottom: 16 }}>
        <div className="section-box-header">
          <span className="section-box-title">Your day-by-day plan</span>
        </div>
        <p style={{ padding: 20, color: 'var(--text-mid)', fontSize: 13 }}>
          Nothing to schedule yet — solve a few problems below to get a real plan going,
          or check that you've selected topics during onboarding.
        </p>
      </div>
    );
  }

  const visibleDays = visibleAllDays.slice(0, defaultVisibleDays);
  const remainingCount = visibleAllDays.length - visibleDays.length;

  return (
    <div className="section-box" style={{ marginBottom: 16 }}>
      <div className="section-box-header">
        <span className="section-box-title">Your day-by-day plan</span>
        <Badge type="purple">{visibleAllDays.length} day{visibleAllDays.length === 1 ? '' : 's'} ahead</Badge>
      </div>

      {missedProblems.length > 0 && (
        <div
          style={{
            margin: '0 20px 14px',
            padding: '12px 14px',
            borderRadius: 8,
            background: 'var(--amber-bg, #3a2f14)',
            border: '1px solid var(--amber, #d9a441)',
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>⏳ Catch-up — {missedProblems.length} problem{missedProblems.length === 1 ? '' : 's'} from earlier days</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {missedProblems.map((p) => {
              const topic = getTopic(p.topicKey);
              return (
                <Link
                  key={p.id}
                  to={`/problem/${p.id}`}
                  className="prob-item"
                  style={{ border: '1px solid var(--amber, #d9a441)', borderRadius: 8, padding: '10px 14px' }}
                >
                  <div className="prob-item-left">
                    <span className="prob-item-name">{p.name}</span>
                    <Badge type={getDifficultyType(p.difficulty)}>{p.difficulty}</Badge>
                  </div>
                  <span className="prob-pattern">{topic?.label} · missed {p.missedDate}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {visibleDays.map((day) => (
          <div key={day.date}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 10,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-low)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: 8,
              }}
            >
              <span>{day.isToday ? 'Today' : day.date}</span>
              {day.isToday && day.allSolved && day.total > 0 && (
                <Badge type="green">🎉 Quota complete</Badge>
              )}
              {!day.allSolved && day.total > 0 && (
                <span style={{ textTransform: 'none', letterSpacing: 'normal', fontFamily: 'inherit' }}>
                  {day.solvedCount}/{day.total} done
                </span>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {day.problems.map((p) => {
                const topic = getTopic(p.topicKey);
                if (p.solved) {
                  return (
                    <div
                      key={p.id}
                      className="prob-item"
                      style={{
                        border: '1px solid var(--border)',
                        borderRadius: 8,
                        padding: '10px 14px',
                        opacity: 0.5,
                      }}
                    >
                      <div className="prob-item-left">
                        <span style={{ textDecoration: 'line-through' }}>{p.name}</span>
                        <Badge type="green">✓ Done</Badge>
                      </div>
                      <span className="prob-pattern">{topic?.label}</span>
                    </div>
                  );
                }
                return (
                  <Link
                    key={p.id}
                    to={`/problem/${p.id}`}
                    className="prob-item"
                    style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px' }}
                  >
                    <div className="prob-item-left">
                      <span className="prob-item-name">{p.name}</span>
                      <Badge type={getDifficultyType(p.difficulty)}>{p.difficulty}</Badge>
                    </div>
                    <span className="prob-pattern">{topic?.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {remainingCount > 0 && (
          <div style={{ fontSize: 12, color: 'var(--text-low)', textAlign: 'center' }}>
            + {remainingCount} more day{remainingCount > 1 ? 's' : ''} in your plan
          </div>
        )}
      </div>
    </div>
  );
}