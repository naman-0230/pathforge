import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Badge from '../components/Badge';
import Button from '../components/Button';
import ConfidenceButton from '../components/ConfidenceButton';
import { topics } from '../data/topics.js';
import { getDifficultyType } from '../data/problems.js';
import { getTopicStats } from '../utils/progress.js';
import {
  ensureRevisionScheduled,
  isRevisionDue,
  getDaysUntilRevision,
  getRevisionState,
  getProblemsForRevision,
  completeRevisionSession,
} from '../utils/revision.js';

// RevisionPage — full SM-2 revision flow, not just a due-date list.
//
// A revision session here means: re-attempt 2-3 real problems from a
// completed topic (prioritized toward the ones you originally solved with
// LOWER confidence — see getProblemsForRevision), then rate how the revision
// actually went. That rating drives the real SM-2 math via
// completeRevisionSession, same as everywhere else in the app.
//
// Session state lives in this component (not the URL/localStorage) — problem
// links open in a new tab (target="_blank") so this page stays mounted and
// the in-progress session isn't lost while you go re-solve something.

const confidenceOptions = [
  { value: 1, label: '😵 Still shaky' },
  { value: 2, label: '🤔 Needed a reminder' },
  { value: 3, label: '😊 Came back to me' },
  { value: 4, label: '🚀 Solid' },
];

export default function RevisionPage() {
  const [, forceRefresh] = useState(0);
  const [activeSession, setActiveSession] = useState(null); // { topicKey, label, problems } | null

  const revisableTopics = topics
    .filter((t) => t.seeded)
    .map((t) => {
      const { solved, total } = getTopicStats(t.key);
      if (total === 0 || solved < total) return null; // only fully-completed topics get revision

      ensureRevisionScheduled(t.key);
      const state = getRevisionState(t.key);
      const due = isRevisionDue(t.key);
      const daysUntil = getDaysUntilRevision(t.key);

      return { topicKey: t.key, label: t.label, total, due, daysUntil, state };
    })
    .filter(Boolean);

  function handleStart(topic) {
    const picked = getProblemsForRevision(topic.topicKey, 3);
    setActiveSession({ topicKey: topic.topicKey, label: topic.label, problems: picked });
  }

  function handleRate(rating) {
    completeRevisionSession(activeSession.topicKey, rating);
    setActiveSession(null);
    forceRefresh((n) => n + 1);
  }

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1>Revision</h1>
            <p className="page-sub">Spaced revision, scheduled by SM-2 — not a fixed "every N days" rule</p>
          </div>
        </div>

        {/* ACTIVE SESSION */}
        {activeSession && (
          <div className="section-box" style={{ marginBottom: 16, borderColor: 'var(--border-accent)' }}>
            <div className="section-box-header">
              <span className="section-box-title">Revising: {activeSession.label}</span>
              <Badge type="purple">In progress</Badge>
            </div>
            <div style={{ padding: '16px 20px' }}>
              <p style={{ fontSize: 13, color: 'var(--text-mid)', marginBottom: 14 }}>
                Re-attempt these {activeSession.problems.length} problems (each opens in a new tab), then rate
                how the revision actually went below.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                {activeSession.problems.map((p) => (
                  <a
                    key={p.id}
                    href={`/problem/${p.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="prob-item"
                    style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px' }}
                  >
                    <div className="prob-item-left">
                      <span className="prob-item-name">{p.name}</span>
                      <Badge type={getDifficultyType(p.difficulty)}>{p.difficulty}</Badge>
                    </div>
                    <span className="prob-pattern">{p.pattern}</span>
                  </a>
                ))}
              </div>

              <div className="conf-label" style={{ marginBottom: 8 }}>How did this revision go?</div>
              <div className="conf-options" style={{ maxWidth: 420 }}>
                {confidenceOptions.map((opt) => (
                  <ConfidenceButton
                    key={opt.value}
                    value={opt.value}
                    label={opt.label}
                    selected={false}
                    onClick={handleRate}
                  />
                ))}
              </div>
              <Button size="sm" style={{ marginTop: 14 }} onClick={() => setActiveSession(null)}>
                Cancel session
              </Button>
            </div>
          </div>
        )}

        {/* TOPIC LIST */}
        <div className="section-box">
          <div className="section-box-header">
            <span className="section-box-title">Your revision schedule</span>
            <Badge type="amber">{revisableTopics.filter((t) => t.due).length} due</Badge>
          </div>

          {revisableTopics.length === 0 ? (
            <p style={{ padding: 20, color: 'var(--text-mid)', fontSize: 13 }}>
              Nothing to revise yet — finish every problem in a topic and it'll show up here with a
              real SM-2 schedule.
            </p>
          ) : (
            <div className="revision-list">
              {revisableTopics.map((t) => (
                <div className="revision-row" key={t.topicKey}>
                  <div>
                    <div className="prob-name">{t.label}</div>
                    <div className="prob-meta">
                      {t.total} problems completed ·{' '}
                      {t.due
                        ? 'due today'
                        : t.daysUntil === 1
                        ? 'due tomorrow'
                        : `due in ${t.daysUntil} days`}
                      {' · interval '}
                      {t.state.interval}d
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={t.due ? 'primary' : 'default'}
                    style={!t.due ? { opacity: 0.5 } : undefined}
                    disabled={!t.due || !!activeSession}
                    onClick={() => handleStart(t)}
                  >
                    {t.due ? 'Start session →' : `In ${t.daysUntil}d`}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}