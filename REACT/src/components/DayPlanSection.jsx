import { Link } from 'react-router-dom';
import Badge from './Badge';
import { getTopic } from '../data/topics.js';
import { getDifficultyType } from '../data/problems.js';

// DayPlanSection — the visual for buildDayPlan()'s output. This is the actual
// "adaptive roadmap" from your spec made visible: each day's problems come
// from the weighted queue (weak topics show up more often), recalculated
// fresh every time this renders — so as soon as you solve something or a
// topic gets flagged weak, the very next render reflects it. There's no
// separate "regenerate" step; it's just always current.
export default function DayPlanSection({ days, defaultVisibleDays = 7 }) {
  if (days.length === 0) {
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

  const visibleDays = days.slice(0, defaultVisibleDays);
  const remainingCount = days.length - visibleDays.length;

  return (
    <div className="section-box" style={{ marginBottom: 16 }}>
      <div className="section-box-header">
        <span className="section-box-title">Your day-by-day plan</span>
        <Badge type="purple">{days.length} days planned</Badge>
      </div>
      <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {visibleDays.map((day) => (
          <div key={day.day}>
            <div
              style={{
                fontSize: 10,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-low)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: 8,
              }}
            >
              Day {day.day}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {day.problems.map((p) => {
                const topic = getTopic(p.topicKey);
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