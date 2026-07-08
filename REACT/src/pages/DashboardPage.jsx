import { useState } from 'react';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Badge from '../components/Badge';
import StatCard from '../components/StatCard';
import ProblemRow from '../components/ProblemRow';
import RevisionRow from '../components/RevisionRow';
import ConfidenceButton from '../components/ConfidenceButton';
import TopicProgressRow from '../components/TopicProgressRow';
import ActivityHeatmap from '../components/ActivityHeatmap.jsx';
import { useApp } from '../context/AppContext.jsx';
import { getTimeGreeting } from '../utils/greeting.js';
import { getDaysRemaining } from '../utils/date.js';
import { getDashboardSubtitle } from '../utils/motivation.js';
import {
  ensureRevisionScheduled,
  isRevisionDue,
  getDaysUntilRevision,
  completeRevisionSession,
  completeSectionRevisionSession,
  getAllDueRevisions,
  checkAndScheduleAllRevisions,
} from '../utils/revision.js';
import { getCurrentStreak, getTotalSolvedFromLog, getSolvedInLastNDays, getDaysSinceLastActivity } from '../utils/activity.js';
import { topics } from '../data/topics.js';
import { getDifficultyType, getProblemsBySection } from '../data/problems.js';
import { isProblemSolved } from '../utils/progress.js';
import { isTopicWeak } from '../utils/weakPoints.js';
import { loadJSON, saveJSON } from '../utils/storage.js';
import { slugify } from '../utils/slug.js';
import {
  getOrRegenerateRoadmapState,
  resolveRoadmapBreakdown,
  getRoadmapOverallProgress,
  getTodayPlan,
  getWeightedProblemQueue,
} from '../utils/roadmapGenerator.js';
import '../styles/app.css';
import '../styles/dashboard.css';

// DashboardPage — now shares the exact same "what's true about my roadmap
// right now" source as RoadmapPage: the STORED roadmap state
// (roadmapGenerator.js), not a second, disagreeing derivation of it.
//
// WHAT CHANGED THIS PASS (previously this page had drifted behind
// RoadmapPage's stored-state / calendar-day work):
//
//   - "Today's problems" used to be `getWeightedProblemQueue().slice(0, 3)`
//     — a completely different notion of "today" than RoadmapPage's
//     calendar-dated day plan, and a hardcoded `3` regardless of the
//     person's actual pace. It's now built from the SAME getTodayPlan() as
//     RoadmapPage: real assigned problems for today's real date, solved
//     ones stay visible (grayed via ProblemRow's existing `done` prop)
//     instead of vanishing, and a permanent (not toast) "quota complete"
//     message shows in the card once every assigned problem is solved.
//   - Per product decision, the card ALSO always offers extra "keep going"
//     problems beyond the formal quota — this is what "Today's problems"
//     originally did (front of the overall queue), preserved here as a
//     secondary list that keeps refilling as things get solved, whether or
//     not today's formal quota exists/is complete.
//   - "Roadmap progress" stat card and the topic progress rows are now
//     ROADMAP-SCOPED (via resolveRoadmapBreakdown / getRoadmapOverallProgress)
//     instead of reading against the entire ~500+ problem database — matches
//     what RoadmapPage already shows as "your plan."
//   - Revisions only consider topics actually IN the active roadmap
//     (previously looped every seeded topic regardless of selection).
//   - Topic progress rows show every topic actually in the roadmap, not a
//     hardcoded `topics.slice(0, 5)`.
//   - NEW: a "finished a section — read the next one's fundamentals?"
//     prompt (see getFundamentalsPrompt below), deep-linking to
//     /fundamentals/:topicKey#section-slug (TopicFundamentalsPage.jsx).
//     Only fires the FIRST time a section boundary is crossed (never before
//     the very first section — starting the roadmap shouldn't immediately
//     nag), and "No, I'm already familiar" just dismisses it for that
//     specific section boundary permanently (storage-backed, not just
//     session state).
//
// STILL NOT WIRED UP (flagged, not fixed, since it wasn't asked for this
// round): `prefs.weakPoints.showCallouts` is saved but never read — the
// weak-point badges below and on RoadmapPage show regardless of that
// preference. Same category of dead toggle as `sensitivity` was.

const revisionConfidenceOptions = [
  { value: 1, label: '😵 Forgot most of it' },
  { value: 2, label: '🤔 Shaky, needed to think hard' },
  { value: 3, label: '😊 Remembered it well' },
  { value: 4, label: '🚀 Instant recall' },
];

// How many extra "keep going" suggestions to show beyond today's formal
// quota. This is a UI display choice, not a data assumption — unlike the
// old hardcoded `slice(0, 3)`, this only controls how many suggestions
// render, never how many problems are actually "due."
const BONUS_SUGGESTION_COUNT = 3;

const FUNDAMENTALS_DISMISSED_KEY = 'pathforge:fundamentalsPromptDismissed';

function isFundamentalsPromptDismissed(topicKey, sectionName) {
  const dismissed = loadJSON(FUNDAMENTALS_DISMISSED_KEY, {});
  return !!dismissed[`${topicKey}:${sectionName}`];
}

function dismissFundamentalsPrompt(topicKey, sectionName) {
  const dismissed = loadJSON(FUNDAMENTALS_DISMISSED_KEY, {});
  dismissed[`${topicKey}:${sectionName}`] = true;
  saveJSON(FUNDAMENTALS_DISMISSED_KEY, dismissed);
}

// getFundamentalsPrompt — walks the roadmap's active topics in curriculum
// order, section by section, looking for the exact boundary "everything up
// to here is solved, but this next section isn't." Starts assuming NO prior
// section is complete (so this never fires before Day 1 — you have to
// actually finish a section first). Distinguishes "just finished a SECTION"
// from "just finished an entire TOPIC" (i.e. that section was the topic's
// last one) so the congratulations message can say the right thing.
function getFundamentalsPrompt(roadmapState) {
  const breakdown = resolveRoadmapBreakdown(roadmapState);
  const activeKeys = new Set(breakdown.filter((t) => t.inRoadmap).map((t) => t.topicKey));
  const activeTopics = topics.filter((t) => activeKeys.has(t.key)).sort((a, b) => a.order - b.order);

  let prevSectionJustCompleted = false; // starts false — no prompt before Day 1
  let prevWasLastSectionOfTopic = false;
  let prevTopicLabel = null;
  let prevSectionName = null;

  for (const topic of activeTopics) {
    for (let i = 0; i < topic.sections.length; i++) {
      const sectionName = topic.sections[i];
      const sectionProblems = getProblemsBySection(topic.key, sectionName);
      const allSolved = sectionProblems.length > 0 && sectionProblems.every((p) => isProblemSolved(p.id));

      if (!allSolved) {
        if (!prevSectionJustCompleted) return null;
        if (isFundamentalsPromptDismissed(topic.key, sectionName)) return null;
        return {
          nextTopicKey: topic.key,
          nextTopicLabel: topic.label,
          nextSectionName: sectionName,
          justFinishedTopic: prevWasLastSectionOfTopic,
          justFinishedLabel: prevWasLastSectionOfTopic ? prevTopicLabel : prevSectionName,
        };
      }

      prevWasLastSectionOfTopic = i === topic.sections.length - 1;
      prevTopicLabel = topic.label;
      prevSectionName = sectionName;
      prevSectionJustCompleted = true;
    }
  }
  return null; // everything in the active roadmap is solved
}

function buildTopicProgressRows(breakdown) {
  return breakdown
    .filter((t) => t.inRoadmap || !t.seeded)
    .map((t) => {
      if (!t.seeded) {
        return { name: t.label, solved: 0, total: t.total, statusLabel: 'Upcoming', statusType: 'gray' };
      }
      if (t.total > 0 && t.solved === t.total) {
        return { name: t.label, solved: t.solved, total: t.total, statusLabel: 'Done ✓', statusType: 'green' };
      }
      if (t.solved === 0) {
        return { name: t.label, solved: t.solved, total: t.total, statusLabel: 'Not started', statusType: 'gray' };
      }
      return isTopicWeak(t.topicKey)
        ? { name: t.label, solved: t.solved, total: t.total, statusLabel: 'Weak', statusType: 'amber', barColor: 'var(--amber)' }
        : { name: t.label, solved: t.solved, total: t.total, statusLabel: 'Strong', statusType: 'green' };
    });
}

// SOURCE_LABELS — human-readable "why is this due" text shown in the meta line
// of each revision row. Kept here in the page (not in revision.js) because it's
// pure display copy — logic files stay free of UI strings.
const SOURCE_LABELS = {
  'topic': 'Topic complete',
  'section-complete': 'Section complete',
  'stuck-section': 'Stuck on section',
  'manual-flag': 'Flagged for review',
};

// buildRevisions — now consumes the unified due-list from revision.js (both
// topic-level legacy revisions AND the new section-level ones), scoped to
// topics actually in the active roadmap so revisions off-plan aren't shown.
// Each entry carries a `key` string that uniquely identifies whether it's a
// topic or section revision — used by the confidence picker to route the
// completion call to the right SM-2 store.
function buildRevisions(breakdown) {
  const roadmapTopicKeys = new Set(breakdown.filter((t) => t.inRoadmap).map((t) => t.topicKey));

  return getAllDueRevisions()
    .filter((r) => roadmapTopicKeys.has(r.topicKey))
    .map((r) => {
      const sourceLabel = SOURCE_LABELS[r.source] || 'Due';
      const dueLabel =
        r.daysOverdue === 0
          ? 'due today'
          : r.daysOverdue > 0
            ? `${r.daysOverdue} day${r.daysOverdue === 1 ? '' : 's'} overdue`
            : `due in ${-r.daysOverdue} days`;

      const isSection = r.kind === 'section';
      const key = isSection ? `section:${r.topicKey}::${r.sectionName}` : `topic:${r.topicKey}`;

      return {
        key,
        kind: r.kind,
        topicKey: r.topicKey,
        sectionName: r.sectionName,
        topic: isSection ? `${r.topicLabel} · ${r.sectionName}` : r.topicLabel,
        meta: `${sourceLabel} · ${dueLabel}`,
        dueNow: true, // getAllDueRevisions only returns things already due
        label: 'Revise →',
      };
    });
}

export default function DashboardPage() {
  const { user, roadmapSetup } = useApp();
  const navigate = useNavigate();

  const [roadmapState] = useState(() => getOrRegenerateRoadmapState(roadmapSetup));

  const [, forceRefresh] = useState(0);
  const [revisingKey, setRevisingKey] = useState(null);

  const firstName = user?.name?.split(' ')[0] || 'there';
  const greeting = getTimeGreeting();
  const emoji = greeting === 'Good night' ? '🌙' : '👋';

  const breakdown = resolveRoadmapBreakdown(roadmapState);
  const todayPlan = getTodayPlan(roadmapState);
  const hasToday = !!todayPlan && todayPlan.total > 0;
  const quotaComplete = hasToday && todayPlan.allSolved;

  const todayIds = new Set((todayPlan?.problems || []).map((p) => p.id));
  const bonusQueue = getWeightedProblemQueue(roadmapSetup).filter((p) => !todayIds.has(p.id));
  const bonusProblems = bonusQueue.slice(0, BONUS_SUGGESTION_COUNT).map((p) => {
    const topic = topics.find((t) => t.key === p.topicKey);
    return {
      id: p.id,
      name: p.name,
      meta: `${topic?.label} · #${p.leetcode}`,
      difficulty: p.difficulty,
      difficultyType: getDifficultyType(p.difficulty),
    };
  });

  const topicRows = buildTopicProgressRows(breakdown);
  const revisions = buildRevisions(breakdown);
  const overallProgress = getRoadmapOverallProgress(roadmapState);

  const fundamentalsPrompt = getFundamentalsPrompt(roadmapState);

  const daysRemaining = getDaysRemaining(roadmapSetup?.deadline);
  const daysRemainingLabel =
    daysRemaining === null
      ? 'set a deadline in your roadmap'
      : daysRemaining < 0
        ? `${Math.abs(daysRemaining)} days past your deadline`
        : daysRemaining === 0
          ? 'deadline is today'
          : `${daysRemaining} days left to stay on track`;

  const daysSinceLastActivity = getDaysSinceLastActivity();
  const subtitle = getDashboardSubtitle({
    daysSinceLastActivity,
    problemsToday: hasToday ? todayPlan.total : bonusProblems.length,
    daysRemainingLabel,
  });

  function handleReviseClick(key) {
    setRevisingKey(key);
  }

  // handleConfirmRevision — routes the SM-2 completion call to the correct
  // store based on which kind of revision was clicked. Section revisions go
  // to the section-scoped state, topic revisions to the legacy topic-scoped
  // one; both use the same SM-2 math under the hood, just different storage.
  function handleConfirmRevision(rating) {
    if (!revisingKey) return;
    const revision = revisions.find((r) => r.key === revisingKey);
    if (!revision) {
      setRevisingKey(null);
      return;
    }
    if (revision.kind === 'section') {
      completeSectionRevisionSession(revision.topicKey, revision.sectionName, rating);
    } else {
      completeRevisionSession(revision.topicKey, rating);
    }
    setRevisingKey(null);
    forceRefresh((n) => n + 1);
  }

  function handleCancelRevision() {
    setRevisingKey(null);
  }

  function handleFundamentalsNo() {
    if (!fundamentalsPrompt) return;
    dismissFundamentalsPrompt(fundamentalsPrompt.nextTopicKey, fundamentalsPrompt.nextSectionName);
    forceRefresh((n) => n + 1);
  }

  function handleFundamentalsYes() {
    if (!fundamentalsPrompt) return;
    dismissFundamentalsPrompt(fundamentalsPrompt.nextTopicKey, fundamentalsPrompt.nextSectionName);
    const href = `/fundamentals/${fundamentalsPrompt.nextTopicKey}#${slugify(fundamentalsPrompt.nextSectionName)}`;
    navigate(href);
  }

  useEffect(() => {
    checkAndScheduleAllRevisions();
  }, []);

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1>{greeting}, {firstName} {emoji}</h1>
            <p className="page-sub">{subtitle}</p>
          </div>
          <Link to="/roadmap" className="btn btn-primary btn-sm">View full roadmap</Link>
        </div>

        <div className="stat-row">
          <StatCard
            label="Problems solved"
            value={getTotalSolvedFromLog()}
            delta={`↑ ${getSolvedInLastNDays(7)} this week`}
            deltaType="positive"
          />
          <StatCard
            label="Current streak"
            value={`${getCurrentStreak()} days`}
            delta={getCurrentStreak() > 0 ? '🔥 Keep it up' : 'Solve something today'}
            deltaType="positive"
          />
          <StatCard
            label="Roadmap progress"
            value={`${overallProgress.percent}%`}
            delta={`${overallProgress.totalSolved} / ${overallProgress.totalProblems} problems`}
            deltaType="neutral"
          />
          <StatCard
            label="Days remaining"
            value={daysRemaining === null ? '—' : Math.max(daysRemaining, 0)}
            delta={daysRemaining === null ? 'No deadline set' : 'Until deadline'}
            deltaType="neutral"
          />
        </div>

        <div className="section-box" style={{ marginBottom: 16 }}>
          <div className="section-box-header">
            <span className="section-box-title">Activity</span>
            <span style={{ fontSize: 12, color: 'var(--text-low)', fontFamily: 'var(--font-mono)' }}>
              last 17 weeks
            </span>
          </div>
          <div style={{ padding: '16px 20px' }}>
            <ActivityHeatmap />
          </div>
        </div>

        <div className="two-col">
          <div className="section-box">
            <div className="section-box-header">
              <span className="section-box-title">Today's problems</span>
              {hasToday && (
                <Badge type={quotaComplete ? 'green' : 'purple'}>
                  {todayPlan.solvedCount}/{todayPlan.total} today
                </Badge>
              )}
            </div>
            <div className="problem-list">
              {quotaComplete && (
                <p style={{ padding: '12px 20px 0', color: 'var(--green, #3fae63)', fontSize: 13, fontWeight: 500 }}>
                  🎉 Nice work — today's quota is done! Anything below is extra, if you're up for more.
                </p>
              )}

              {hasToday && todayPlan.problems.map((p) => {
                const topic = topics.find((t) => t.key === p.topicKey);
                return (
                  <ProblemRow
                    key={p.id}
                    id={p.id}
                    name={p.name}
                    meta={`${topic?.label} · #${p.leetcode}`}
                    difficulty={p.difficulty}
                    difficultyType={getDifficultyType(p.difficulty)}
                    done={p.solved}
                  />
                );
              })}

              {!hasToday && bonusProblems.length === 0 && (
                <p style={{ padding: '20px', color: 'var(--text-mid)', fontSize: 13 }}>
                  All caught up — no unsolved problems left in your active topics.
                </p>
              )}

              {bonusProblems.length > 0 && (
                <>
                  <div style={{ padding: '10px 20px 0', fontSize: 11, color: 'var(--text-low)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {hasToday ? 'Want to keep going?' : "Nothing formally due today — here's what's next"}
                  </div>
                  {bonusProblems.map((p) => <ProblemRow key={p.id} {...p} />)}
                </>
              )}
            </div>
          </div>

          <div className="section-box">
            <div className="section-box-header">
              <span className="section-box-title">Revision due</span>
              <Badge type="amber">{revisions.length} due</Badge>
            </div>
            <div className="revision-list">
              {revisions.length === 0 ? (
                <p style={{ padding: '20px', color: 'var(--text-mid)', fontSize: 13 }}>
                  No revisions yet — these appear once you finish a section, flag a problem, or stall on a section.
                </p>
              ) : (
                revisions.map((r) =>
                  r.key === revisingKey ? (
                    <div key={r.key} className="revision-confidence-picker">
                      <div className="revision-confidence-prompt">How well did "{r.topic}" come back to you?</div>
                      <div className="revision-confidence-options">
                        {revisionConfidenceOptions.map((opt) => (
                          <ConfidenceButton
                            key={opt.value}
                            value={opt.value}
                            label={opt.label}
                            selected={false}
                            onClick={handleConfirmRevision}
                          />
                        ))}
                      </div>
                      <button className="btn btn-sm" onClick={handleCancelRevision}>Cancel</button>
                    </div>
                  ) : (
                    <RevisionRow
                      key={r.key}
                      {...r}
                      onRevise={() => handleReviseClick(r.key)}
                    />
                  )
                )
              )}
            </div>

          </div>
        </div>

        <div className="section-box" style={{ marginTop: 16 }}>
          <div className="section-box-header">
            <span className="section-box-title">Topic progress</span>
            <Link to="/roadmap" className="btn btn-sm">Full roadmap</Link>
          </div>
          <div className="topic-progress-list">
            {topicRows.map((t) => (
              <TopicProgressRow key={t.name} {...t} />
            ))}
          </div>
        </div>
      </main>

      {fundamentalsPrompt && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: 'var(--bg-elevated, #1a1a1a)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: 24,
              maxWidth: 420,
              width: '90%',
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
              🎉 {fundamentalsPrompt.justFinishedTopic
                ? `Congratulations on completing ${fundamentalsPrompt.justFinishedLabel}!`
                : `Congratulations on completing "${fundamentalsPrompt.justFinishedLabel}"!`}
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-mid)', marginBottom: 20 }}>
              Would you like to go through the fundamentals for {fundamentalsPrompt.nextTopicLabel} ·{' '}
              {fundamentalsPrompt.nextSectionName} before starting?
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn btn-sm" onClick={handleFundamentalsNo}>
                No, I'm already familiar
              </button>
              <button className="btn btn-primary btn-sm" onClick={handleFundamentalsYes}>
                Yes, take me there
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}