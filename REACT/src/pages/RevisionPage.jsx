import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Badge from '../components/Badge';
import { getPreferences } from '../utils/preferences.js';
import Button from '../components/Button';
import ConfidenceButton from '../components/ConfidenceButton';
import { getDifficultyType } from '../data/problems.js';
import {
  checkAndScheduleAllRevisions,
  getAllScheduledRevisions,
  getRevisionScheduleSummary,
  getRevisionHistory,
  getProblemsForRevision,
  getProblemsForSectionRevision,
  completeRevisionSession,
  completeSectionRevisionSession,
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

// SOURCE_LABELS — matches the Dashboard's labels so users see consistent
// terminology across both pages. Duplicated here (instead of imported from
// revision.js) because these are pure display copy — logic files stay UI-free.
const SOURCE_LABELS = {
  'topic': 'Topic complete',
  'section-complete': 'Section complete',
  'long-running-section': 'Long-running section',
  'stuck-section': 'Stuck on section',
  'manual-flag': 'Flagged for review',
};

// entryKey — same identifier scheme as the Dashboard, so a session started
// from a section revision here can be uniquely told apart from a topic
// revision when handleRate needs to route to the correct SM-2 store.
function entryKey(entry) {
  return entry.kind === 'section'
    ? `section:${entry.topicKey}::${entry.sectionName}`
    : `topic:${entry.topicKey}`;
}

function entryTitle(entry) {
  return entry.kind === 'section' ? `${entry.topicLabel} · ${entry.sectionName}` : entry.topicLabel;
}

function dueLabel(entry) {
  if (entry.daysOverdue > 0) return `${entry.daysOverdue} day${entry.daysOverdue === 1 ? '' : 's'} overdue`;
  if (entry.daysUntilReview === 0) return 'due today';
  if (entry.daysUntilReview === 1) return 'due tomorrow';
  return `due in ${entry.daysUntilReview} days`;
}



export default function RevisionPage() {
  const [, forceRefresh] = useState(0);
  // activeSession now carries the kind so handleRate knows which SM-2 store
  // to update. Shape: { kind, topicKey, sectionName?, label, problems }.
  const [activeSession, setActiveSession] = useState(null);

  // Run the section-scheduling sweep once on mount so this page always
  // reflects the latest state (same pattern as Dashboard). Safe to call
  // repeatedly — every ensure* helper it invokes is idempotent.
  useEffect(() => {
    checkAndScheduleAllRevisions();
  }, []);

const prefs = getPreferences();
const scheduled = getAllScheduledRevisions();
const summary = getRevisionScheduleSummary();
const history = getRevisionHistory(20);

// Cap the actionable "due now" list to the user's daily revision goal.
// Upcoming and summary are NOT capped — the user should see full visibility
// of what's coming, only the actionable slice is bounded.
const dueEntries = scheduled.filter((e) => e.isDue).slice(0, prefs.revision.dailyGoal);
const upcomingEntries = scheduled.filter((e) => !e.isDue);

  // handleStart — pulls the curated problem list for the chosen entry.
  // Section revisions use the section-scoped picker (flagged first, then
  // struggle-ranked); topic revisions use the legacy picker (low-confidence
  // first). Both return the same problem shape, so the UI below is agnostic.
  function handleStart(entry) {
    const problems =
      entry.kind === 'section'
        ? getProblemsForSectionRevision(entry.topicKey, entry.sectionName)
        : getProblemsForRevision(entry.topicKey, 3);

    setActiveSession({
      kind: entry.kind,
      topicKey: entry.topicKey,
      sectionName: entry.sectionName,
      label: entryTitle(entry),
      problems,
    });
  }

  // handleRate — routes SM-2 completion to the correct store based on the
  // active session's kind. Same rating semantics for both, just different
  // storage buckets.
  function handleRate(rating) {
    if (!activeSession) return;
    if (activeSession.kind === 'section') {
      completeSectionRevisionSession(activeSession.topicKey, activeSession.sectionName, rating);
    } else {
      completeRevisionSession(activeSession.topicKey, rating);
    }
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

        {/* SUMMARY STRIP — small at-a-glance counts so the page opens with
            a sense of overall revision load, not just today's slice. */}
        <div
          className="section-box"
          style={{ marginBottom: 16, padding: '14px 20px', display: 'flex', gap: 24, flexWrap: 'wrap' }}
        >
          <SummaryStat label="Scheduled" value={summary.total} />
          <SummaryStat label="Due now" value={summary.due} accent="amber" />
          <SummaryStat label="Upcoming" value={summary.upcoming} />
          <SummaryStat label="Sections" value={summary.sectionCount} />
          <SummaryStat label="Topics" value={summary.topicCount} />
        </div>

        {/* ACTIVE SESSION — unchanged in structure, only the header title
            now reflects section-vs-topic naming via activeSession.label. */}
        {activeSession && (
          <div className="section-box" style={{ marginBottom: 16, borderColor: 'var(--border-accent)' }}>
            <div className="section-box-header">
              <span className="section-box-title">Revising: {activeSession.label}</span>
              <Badge type="purple">In progress</Badge>
            </div>
            <div style={{ padding: '16px 20px' }}>
              <p style={{ fontSize: 13, color: 'var(--text-mid)', marginBottom: 14 }}>
                Re-attempt these {activeSession.problems.length} problem{activeSession.problems.length === 1 ? '' : 's'} (each opens in a new tab), then rate
                how the revision actually went below.
              </p>
              {activeSession.problems.length === 0 ? (
                <p style={{ fontSize: 13, color: 'var(--text-mid)', marginBottom: 14 }}>
                  No problems available to revise in this session yet. This can happen if the section has flagged
                  problems that were later unflagged, or if attempted problems were reset.
                </p>
              ) : (
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
              )}

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

        {/* DUE NOW — the actionable list. Priority order comes straight from
            getAllScheduledRevisions (manual-flag > topic > section-complete
            > stuck-section, then most-overdue first inside each band). */}
        <div className="section-box" style={{ marginBottom: 16 }}>
          <div className="section-box-header">
            <span className="section-box-title">Due now</span>
            <Badge type="amber">{dueEntries.length} due</Badge>
          </div>

          {dueEntries.length === 0 ? (
            <p style={{ padding: 20, color: 'var(--text-mid)', fontSize: 13 }}>
              Nothing due right now — finish a section, flag a problem for review, or stall on an
              in-progress section and revisions will appear here on the SM-2 schedule.
            </p>
          ) : (
            <div className="revision-list">
              {dueEntries.map((e) => (
                <div className="revision-row" key={entryKey(e)}>
                  <div>
                    <div className="prob-name">{entryTitle(e)}</div>
                    <div className="prob-meta">
                      {SOURCE_LABELS[e.source] || 'Due'} · {dueLabel(e)} · interval {e.state.interval}d
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="primary"
                    disabled={!!activeSession}
                    onClick={() => handleStart(e)}
                  >
                    Start session →
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* UPCOMING — visibility only, not clickable. Completing a revision
            before it's due would break SM-2's spacing math (you'd be rating
            recall on material that hasn't actually had time to fade), so
            there's no button — just "due in N days" as a static hint. */}
        <div className="section-box" style={{ marginBottom: 16 }}>
          <div className="section-box-header">
            <span className="section-box-title">Upcoming</span>
            <Badge type="purple">{upcomingEntries.length}</Badge>
          </div>

          {upcomingEntries.length === 0 ? (
            <p style={{ padding: 20, color: 'var(--text-mid)', fontSize: 13 }}>
              No upcoming revisions scheduled. Complete more sections or flag problems to build out your
              schedule.
            </p>
          ) : (
            <div className="revision-list">
              {upcomingEntries.map((e) => (
                <div className="revision-row" key={entryKey(e)}>
                  <div>
                    <div className="prob-name">{entryTitle(e)}</div>
                    <div className="prob-meta">
                      {SOURCE_LABELS[e.source] || 'Scheduled'} · {dueLabel(e)} · interval {e.state.interval}d
                    </div>
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--text-low)', fontFamily: 'var(--font-mono)' }}>
                    in {e.daysUntilReview}d
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* HISTORY — last 20 completed sessions across every topic and
            section, most recent first. Read-only. Handy for spotting
            patterns like "I keep rating Two Pointers as 'shaky' — maybe I
            should re-do the fundamentals" that the schedule alone won't
            surface. */}
        <div className="section-box">
          <div className="section-box-header">
            <span className="section-box-title">Recent sessions</span>
            <Badge type="purple">{history.length}</Badge>
          </div>

          {history.length === 0 ? (
            <p style={{ padding: 20, color: 'var(--text-mid)', fontSize: 13 }}>
              No revision sessions completed yet. Once you finish a session, it'll show up here.
            </p>
          ) : (
            <div className="revision-list">
              {history.map((h, i) => (
                <div className="revision-row" key={`${h.date}-${h.kind}-${h.topicKey}-${h.sectionName || ''}-${i}`}>
                  <div>
                    <div className="prob-name">
                      {h.kind === 'section' ? `${h.topicLabel} · ${h.sectionName}` : h.topicLabel}
                    </div>
                    <div className="prob-meta">
                      {h.date} · confidence {h.confidenceRating}/4 · next interval {h.interval}d
                    </div>
                  </div>
                  <Badge type={h.quality >= 3 ? 'green' : 'amber'}>
                    q{Number(h.quality).toFixed(1)}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// SummaryStat — tiny inline component for the summary strip. Kept in-file
// because it's page-specific and trivial; not worth a new component file.
function SummaryStat({ label, value, accent }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{ fontSize: 11, color: 'var(--text-low)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </span>
      <span
        style={{
          fontSize: 20,
          fontWeight: 600,
          color: accent === 'amber' ? 'var(--amber)' : 'var(--text-high)',
          fontFamily: 'var(--font-mono)',
        }}
      >
        {value}
      </span>
    </div>
  );
}

