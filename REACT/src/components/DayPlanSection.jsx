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
//
// MOBILE: all inline styles have been extracted to CSS classes so media
// queries in roadmap.css can adjust spacing/typography for narrow screens.
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
        <div className="dayplan-catchup">
          <div className="dayplan-catchup-header">
            <span>⏳ Catch-up — {missedProblems.length} problem{missedProblems.length === 1 ? '' : 's'} from earlier days</span>
          </div>
          <div className="dayplan-catchup-list">
            {missedProblems.map((p) => {
              const topic = getTopic(p.topicKey);
              return (
                <Link
                  key={p.id}
                  to={`/problem/${p.id}`}
                  className="prob-item dayplan-item dayplan-item-missed"
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

      <div className="dayplan-days-container">
        {visibleDays.map((day) => (
          <div key={day.date}>
            <div className="dayplan-day-header">
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
            <div className="dayplan-problem-list">
              {day.problems.map((p) => {
                const topic = getTopic(p.topicKey);
                if (p.solved) {
                  return (
                    <div
                      key={p.id}
                      className="prob-item dayplan-item dayplan-item-solved"
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
                    className="prob-item dayplan-item"
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
          <div className="dayplan-remaining">
            + {remainingCount} more day{remainingCount > 1 ? 's' : ''} in your plan
          </div>
        )}
      </div>
    </div>
  );
}