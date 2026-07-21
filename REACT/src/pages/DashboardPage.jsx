import { useState, useEffect, useRef } from 'react';
import CompanionCat from '../components/pets/CompanionCat';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Badge from '../components/Badge';
import StatCard from '../components/StatCard';
import ProblemRow from '../components/ProblemRow';
import { getPreferences } from '../utils/preferences.js';
import RevisionRow from '../components/RevisionRow';
import TopicProgressRow from '../components/TopicProgressRow';
import ActivityHeatmap from '../components/ActivityHeatmap.jsx';
import { useApp } from '../context/AppContext.jsx';
import { getTimeGreeting } from '../utils/greeting.js';
import { getDaysRemaining } from '../utils/date.js';
import { getMotivationMessage } from '../utils/motivation.js';
import {
  ensureRevisionScheduled,
  isRevisionDue,
  getDaysUntilRevision,
  getAllDueRevisions,
  checkAndScheduleAllRevisions,
  getRevisionScheduleSummary,
} from '../utils/revision.js';
import { getCurrentStreak, getTotalSolvedFromLog, getSolvedInLastNDays, getDaysSinceLastActivity, getActivityLog, localDateStr, parseLocalDate } from '../utils/activity.js';
import { topics } from '../data/topics.js';
import { getDifficultyType, getProblemsBySection } from '../data/problems.js';
import { isProblemSolved, getOverallProgress } from '../utils/progress.js';
import { isTopicWeak } from '../utils/weakPoints.js';
import { loadJSON, saveJSON } from '../utils/storage.js';
import { slugify } from '../utils/slug.js';
import { isSectionFundamentalsRead } from '../utils/fundamentalsRead.js';
import {
  getOrRegenerateRoadmapState,
  resolveRoadmapBreakdown,
  getRoadmapOverallProgress,
  getTodayPlan,
  getWeightedProblemQueue,
} from '../utils/roadmapGenerator.js';
import { getDrillRecommendation, dismissDrillRecommendation } from '../utils/drillEngine.js';
import AchievementShelf from '../components/AchievementShelf';
import { getNewlyUnlockedAchievements, markAchievementsAsSeen } from '../utils/achievements.js';
import ReminderBanner from '../components/ReminderBanner';
import { useReminderTick } from '../utils/useReminderTick.js';
import '../styles/app.css';
import '../styles/dashboard.css';
import { usePageTitle } from '../utils/usePageTitle.js';

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


// How many extra "keep going" suggestions to show beyond today's formal
// quota. This is a UI display choice, not a data assumption — unlike the
// old hardcoded `slice(0, 3)`, this only controls how many suggestions
// render, never how many problems are actually "due."
const BONUS_SUGGESTION_COUNT = 3;

const FUNDAMENTALS_DISMISSED_KEY = 'pathforge:fundamentalsPromptDismissed';

// Tracks which section COMPLETIONS have been acknowledged (user clicked
// Yes or No on the prompt). Keyed by the COMPLETED section, not the next
// section — so completing "Basics" and acknowledging the prompt stores
// "arrays:Basics", meaning "I've already seen the prompt that fired when
// Basics was completed."
function isCompletionAcknowledged(topicKey, completedSectionName) {
  const acked = loadJSON(FUNDAMENTALS_DISMISSED_KEY, {});
  return !!acked[`${topicKey}:${completedSectionName}`];
}

function acknowledgeCompletion(topicKey, completedSectionName) {
  const acked = loadJSON(FUNDAMENTALS_DISMISSED_KEY, {});
  acked[`${topicKey}:${completedSectionName}`] = true;
  saveJSON(FUNDAMENTALS_DISMISSED_KEY, acked);
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

  let prevSectionCompleted = null; // { topicKey, sectionName } of the last completed section
  let prevWasLastSectionOfTopic = false;
  let prevTopicLabel = null;

  for (const topic of activeTopics) {
    for (let i = 0; i < topic.sections.length; i++) {
      const sectionName = topic.sections[i];
      const sectionProblems = getProblemsBySection(topic.key, sectionName);
      const allSolved = sectionProblems.length > 0 && sectionProblems.every((p) => isProblemSolved(p.id));

      if (!allSolved) {
        // Found the first incomplete section — this is the boundary.
        // Only fire a prompt if:
        //   1. There WAS a completed section before this (prevSectionCompleted !== null)
        //   2. That completion hasn't been acknowledged yet
        //   3. The upcoming section isn't already read
        if (!prevSectionCompleted) return null;
        if (isCompletionAcknowledged(prevSectionCompleted.topicKey, prevSectionCompleted.sectionName)) return null;
        if (isSectionFundamentalsRead(topic.key, sectionName)) return null;

        return {
          nextTopicKey: topic.key,
          nextTopicLabel: topic.label,
          nextSectionName: sectionName,
          justFinishedTopic: prevWasLastSectionOfTopic,
          justFinishedLabel: prevWasLastSectionOfTopic ? prevTopicLabel : prevSectionCompleted.sectionName,
          // Pass through so handlers can acknowledge the RIGHT section
          completedTopicKey: prevSectionCompleted.topicKey,
          completedSectionName: prevSectionCompleted.sectionName,
        };
      }

      // This section is complete — track it as the most recent completed section
      prevSectionCompleted = { topicKey: topic.key, sectionName };
      prevWasLastSectionOfTopic = i === topic.sections.length - 1;
      prevTopicLabel = topic.label;
    }
  }
  return null; // everything in the active roadmap is solved
}

function buildTopicProgressRows(breakdown, showCallouts) {
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
      // Weak/Strong callouts are gated by the Settings toggle. When callouts
      // are off, in-progress topics show a plain "In progress" pill instead
      // of leaking weak-point analytics into the everyday view.
      if (!showCallouts) {
        return { name: t.label, solved: t.solved, total: t.total, statusLabel: 'In progress', statusType: 'gray' };
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
  'long-running-section': 'Long-running section',
  'stuck-section': 'Stuck on section',
  'manual-flag': 'Flagged for review',
};

// buildRevisions — now consumes the unified due-list from revision.js (both
// topic-level legacy revisions AND the new section-level ones), scoped to
// topics actually in the active roadmap so revisions off-plan aren't shown.
// Each entry carries a `key` string that uniquely identifies whether it's a
// topic or section revision — used by the confidence picker to route the
// completion call to the right SM-2 store.
function buildRevisions(breakdown, dailyGoal) {
  const roadmapTopicKeys = new Set(breakdown.filter((t) => t.inRoadmap).map((t) => t.topicKey));

  return getAllDueRevisions()
    .filter((r) => roadmapTopicKeys.has(r.topicKey))
    .slice(0, dailyGoal) // cap "due today" display to the user's daily revision goal
    .map((r) => {
      const sourceLabel = SOURCE_LABELS[r.source] || 'Due';
      const dueLabel =
        r.daysOverdue === 0
          ? 'due today'
          : r.daysOverdue > 0
            ? `${r.daysOverdue} day${r.daysOverdue === 1 ? '' : 's'} overdue`
            : `due in ${-r.daysOverdue} days`;
      const isSection = r.kind === 'section';
      const id = isSection ? `section:${r.topicKey}::${r.sectionName}` : `topic:${r.topicKey}`;

      return {
        id,
        kind: r.kind,
        topicKey: r.topicKey,
        sectionName: r.sectionName,
        topic: isSection ? `${r.topicLabel} · ${r.sectionName}` : r.topicLabel,
        meta: `${sourceLabel} · ${dueLabel}`,
        dueNow: true,
        label: 'Revise →',
      };

    });
}

export default function DashboardPage() {
  const { user, roadmapSetup } = useApp();
  const navigate = useNavigate();
    // Start the reminder background tick — checks due reminders every 60s
  // and fires browser notifications for ones we haven't fired yet today.
  // Safe to call regardless of whether reminders are enabled (the tick
  // function itself checks preferences).
  useReminderTick();

  const [roadmapState] = useState(() => getOrRegenerateRoadmapState(roadmapSetup));

  const [, forceRefresh] = useState(0);

  usePageTitle('Dashboard');
  const firstName = user?.name?.split(' ')[0] || 'there';
  const greeting = getTimeGreeting();
  const emoji = greeting === 'Good night' ? '🌙' : '👋';

  const prefs = getPreferences();
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

  const topicRows = buildTopicProgressRows(breakdown, prefs.weakPoints.showCallouts);
  const revisions = buildRevisions(breakdown, prefs.revision.dailyGoal);
    const overallProgress = getRoadmapOverallProgress(roadmapState);

  const fundamentalsPrompt = getFundamentalsPrompt(roadmapState);

  // Drill recommendation — held in state so dismissal (clicking "Not now"
  // on the card) can immediately hide it without needing a page refresh.
  // On next mount / page visit, getDrillRecommendation is called fresh
  // and will return null for patterns still within the 24h dismissal
  // cooldown, so the card correctly stays hidden across navigation.
  const [drillRecommendation, setDrillRecommendation] = useState(() =>
    getDrillRecommendation({ topicKeys: roadmapSetup?.selectedTopics || null })
  );

  function handleDismissDrill() {
    if (!drillRecommendation) return;
    dismissDrillRecommendation(drillRecommendation.pattern);
    setDrillRecommendation(null);
  }

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
  const streak = getCurrentStreak();

  // totalSolvedFromActivity — streak/milestone-style event data based on the
  // activity log. This can undercount if problems were bulk-marked solved or
  // imported from older data without a recordSolve() call.
  const totalSolvedFromActivity = getTotalSolvedFromLog();

  // totalSolvedActual — real solved problem count from progress records.
  // This is what "are you a brand new user?" should key off, because it's
  // the actual source of truth for solved state.
  const totalSolvedActual = getOverallProgress().totalSolved;

  // prevStreak / prevTotalSolved — yesterday's values for milestone crossing
  // detection (did we just cross 7 days? just hit 50 solved?). Derived from
  // the activity log directly so no extra storage is needed.
  const activityLog = getActivityLog();
  const yesterday = localDateStr(new Date(Date.now() - 86400000));
  const yesterdayCount = activityLog[yesterday] || 0;
  const prevTotalSolved = Math.max(0, totalSolvedFromActivity - (activityLog[localDateStr(new Date())] || 0));
  // prevStreak approximation: if today has activity, streak yesterday was
  // streak - 1 (we added today). If today has no activity, streak is same
  // as yesterday (nothing added). Edge case: if streak is 0 and yesterday
  // had activity, prevStreak was 1 (just broken today).
  const todayActivity = activityLog[localDateStr(new Date())] || 0;
  const prevStreak = todayActivity > 0
    ? Math.max(0, streak - 1)
    : yesterdayCount > 0
      ? 1
      : streak;

  // justCompletedSection — the most recently completed section in the active
  // roadmap that the user just finished (solved the last problem in it).
  // We detect this by finding sections where ALL problems are solved but the
  // section before it (or the topic start) is also all-solved — meaning this
  // is genuinely the frontier section just completed, not an old one.
  const justCompletedSection = (() => {
    const activeTopicKeys = new Set(
      breakdown.filter((t) => t.inRoadmap).map((t) => t.topicKey)
    );
    const { topics: topicsData } = { topics: breakdown };
    for (const topicEntry of breakdown.filter((t) => t.inRoadmap)) {
      const topic = topicsData.find
        ? topicsData.find((t) => t.topicKey === topicEntry.topicKey)
        : null;
      // topics.js sections for this topic
      const topicMeta = breakdown.find((t) => t.topicKey === topicEntry.topicKey);
      if (!topicMeta) continue;
    }
    // Simpler: import topics directly and scan
    return null; // computed below after topics import is available
  })();

  // justCompletedSection / justCompletedTopic — scan roadmap topics in order,
  // find the "frontier": the most recently completed section or topic.
  // "Most recently" = last section where all problems are solved, assuming
  // the one after it is not yet complete (so it's the frontier, not history).
  let _justCompletedSection = null;
  let _justCompletedTopic = null;
  let _firstProblemNewTopic = null;

  for (const topicEntry of breakdown.filter((t) => t.inRoadmap && t.seeded)) {
    const topicMeta = topics.find((t) => t.key === topicEntry.topicKey);
    if (!topicMeta) continue;

    let allPrevSolved = true;
    for (let si = 0; si < topicMeta.sections.length; si++) {
      const sectionName = topicMeta.sections[si];
      const sectionProblems = getProblemsBySection(topicEntry.topicKey, sectionName);
      const allSolved = sectionProblems.length > 0 &&
        sectionProblems.every((p) => isProblemSolved(p.id));
      const nextSection = topicMeta.sections[si + 1];
      const nextSectionProblems = nextSection
        ? getProblemsBySection(topicEntry.topicKey, nextSection)
        : [];
      const nextAllSolved = nextSectionProblems.length > 0 &&
        nextSectionProblems.every((p) => isProblemSolved(p.id));

      if (allSolved && !nextAllSolved && allPrevSolved) {
        // This is the frontier section — just completed
        _justCompletedSection = { topicKey: topicEntry.topicKey, name: sectionName };
        // Check if this was the last section of the topic
        if (si === topicMeta.sections.length - 1) {
          _justCompletedTopic = { topicKey: topicEntry.topicKey, label: topicEntry.label };
        }
      }

      // First problem of a new topic detection: solved === 1 in a topic
      // where baselineSolvedIds was 0 at generation time means this is
      // genuinely the "just started" moment.
      if (si === 0 && sectionProblems.some((p) => isProblemSolved(p.id))) {
        const roadmapEntry = roadmapState?.selection?.[topicEntry.topicKey];
        const baselineCount = roadmapEntry?.baselineSolvedIds?.length ?? 0;
        const totalSolvedInTopic = topicEntry.solved;
        if (baselineCount === 0 && totalSolvedInTopic === 1) {
          _firstProblemNewTopic = { topicKey: topicEntry.topicKey, label: topicEntry.label };
        }
      }

      if (!allSolved) allPrevSolved = false;
    }
  }

  // Revision context
  const revisionSummary = getRevisionScheduleSummary();
  const dueRevisions = getAllDueRevisions();
  const mostOverdueRevisionLabel = dueRevisions.length > 0
    ? (dueRevisions[0].sectionName
      ? `${dueRevisions[0].topicLabel} · ${dueRevisions[0].sectionName}`
      : dueRevisions[0].topicLabel)
    : null;

  // Roadmap meta for pace computation
  const roadmapMeta = (() => {
    const generatedAt = roadmapState?.generatedAt ?? null;
    const dayPlan = roadmapState?.dayPlan ?? [];
    const totalDays = dayPlan.length;
    return { generatedAt, totalDays };
  })();

  const justDidFirstBulkImport = (() => {
    // Check if bulk import just happened and hasn't been consumed by
    // the motivation engine yet. The flag is set by RoadmapPage's
    // handleBulkMarkSolved and consumed here.
    const done = loadJSON('pathforge:bulkImportDone', false);
    const consumed = loadJSON('pathforge:motivation:state', {})?.consumedEvents?.includes('baseline');
    return done && !consumed;
  })();

  const subtitle = getMotivationMessage({
    userName: firstName,
    justDidFirstBulkImport,
    daysSinceLastActivity,
    streak,
    prevStreak,
    totalSolved: totalSolvedFromActivity,
    totalSolvedActual,
    prevTotalSolved,
    quotaComplete,
    daysRemaining,
    roadmapMeta,
    totalProblems: overallProgress.totalProblems,
    justCompletedSection: _justCompletedSection,
    justCompletedTopic: _justCompletedTopic,
    firstProblemNewTopic: _firstProblemNewTopic,
    revisionDueCount: revisionSummary.due,
    mostOverdueRevisionLabel,
  });

  function handleReviseClick(_key) {
    // Dashboard is a summary surface, not a workspace — send the user to
    // the full Revision page to actually run the session (problem list +
    // open-in-new-tab links + rating flow). Keeps only one place in the
    // app where revisions are actually performed, so the UX stays
    // consistent and the two pages can't drift apart.
    navigate('/revision');
  }

  // handleConfirmRevision — routes the SM-2 completion call to the correct
  // store based on which kind of revision was clicked. Section revisions go
  // to the section-scoped state, topic revisions to the legacy topic-scoped
  // one; both use the same SM-2 math under the hood, just different storage.


  function handleFundamentalsNo() {
    if (!fundamentalsPrompt) return;
    // Acknowledge this completion so the prompt doesn't fire again
    // until the NEXT section is completed.
    acknowledgeCompletion(
      fundamentalsPrompt.completedTopicKey,
      fundamentalsPrompt.completedSectionName
    );
    forceRefresh((n) => n + 1);
  }

  function handleFundamentalsYes() {
    if (!fundamentalsPrompt) return;
    // Acknowledge this completion
    acknowledgeCompletion(
      fundamentalsPrompt.completedTopicKey,
      fundamentalsPrompt.completedSectionName
    );
    const href = `/fundamentals/${fundamentalsPrompt.nextTopicKey}#${slugify(fundamentalsPrompt.nextSectionName)}`;
    navigate(href);
  }

  useEffect(() => {
    checkAndScheduleAllRevisions();
  }, []);

    // Achievement unlock toasts — fire once per session for any newly
  // unlocked achievements the user hasn't seen. Marked-as-seen so they
  // don't re-fire on subsequent page loads. Deliberately runs after a
  // short delay so it doesn't collide with the greeting animation on
  // initial mount.
  //
  // NOTE: this uses `alert()` currently as a placeholder. If your app has
  // a proper toast system available on the dashboard (I see Toast is
  // imported elsewhere), swap this to that. Keeping it lightweight here
  // so this feature ships without touching the toast infrastructure.
  useEffect(() => {
    const timer = setTimeout(() => {
      const newlyUnlocked = getNewlyUnlockedAchievements();
      if (newlyUnlocked.length === 0) return;

      // Show at most 3 in one visit to avoid spam if user unlocked many
      // at once (e.g. after a big bulk import)
      const toShow = newlyUnlocked.slice(0, 3);
      for (const a of toShow) {
        // Simple browser notification. Users who want richer UI can
        // upgrade this to their toast system.
        console.log(`🏆 Achievement unlocked: ${a.name}`);
      }
      markAchievementsAsSeen(newlyUnlocked.map((a) => a.id));
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // ── No roadmap setup yet ──────────────────────────────────────────────
  // User signed up but skipped onboarding, or cleared their data.
  // Show a focused call to action instead of a bunch of empty/zero cards.
  if (!roadmapSetup) {
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            gap: 16,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 48 }}>🗺️</div>
            <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.04em' }}>
              Your roadmap isn't set up yet
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-mid)', maxWidth: 380, lineHeight: 1.7 }}>
              Set up your study plan to get a personalized DSA roadmap, daily problem quota, and revision schedule.
            </p>
            <Link
              to="/settings#study-plan"
              className="btn btn-primary"
              style={{ marginTop: 8 }}
            >
              Configure your roadmap →
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />

            <main className="main-content">
        {/* Reminder banner — renders any currently-active reminders as
            dismissible cards above the page header. Non-blocking; if no
            reminders are active, nothing renders. */}
        <ReminderBanner />

        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div>
              <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {subtitle}
                {/* 🐱 Cat sits right next to heading text */}
                <CompanionCat
                  streakActive={getCurrentStreak() > 0}
                  mood={quotaComplete ? 'celebrate' : 'normal'}
                />
              </h1>
              <p className="page-sub">
                {hasToday ? `${todayPlan.total} problems today` : 'No problems scheduled today'}
                {daysRemaining !== null && daysRemaining >= 0 ? ` · ${daysRemaining} days left` : ''}
                {revisionSummary.due > 0 ? ` · ${revisionSummary.due} revision${revisionSummary.due === 1 ? '' : 's'} due` : ''}
              </p>
            </div>
          </div>
          <Link to="/roadmap" className="btn btn-primary btn-sm">
            View full roadmap
          </Link>
        </div>
                {/* Drill recommendation — surfaces automatically when pattern
            training has detected a weak pattern with enough problems
            in the roadmap to build a drill from. Dismissible via just
            not clicking it — no explicit dismiss because it disappears
            on its own once the miss rate drops below threshold. */}
               {drillRecommendation && (
          <div className="drill-recommendation-card">
            <div className="drill-recommendation-icon">🎯</div>
            <div className="drill-recommendation-body">
              <div className="drill-recommendation-title">
                Weak pattern detected: <strong style={{ color: 'var(--accent, #e8732d)' }}>{drillRecommendation.pattern}</strong>
              </div>
              <div className="drill-recommendation-desc">
                You missed this <strong>{Math.round(drillRecommendation.missRate * 100)}%</strong> of the time in pattern training.
                Drill it with <strong>{drillRecommendation.problemCount}</strong> focused problems across your topics.
              </div>
            </div>
            <div className="drill-recommendation-actions">
              <Link
                to={`/drill/${encodeURIComponent(drillRecommendation.pattern)}`}
                className="btn btn-primary btn-sm"
              >
                Start drill →
              </Link>
              <button
                className="drill-recommendation-dismiss"
                onClick={handleDismissDrill}
                title="Hide this recommendation for 24 hours"
                aria-label="Dismiss drill recommendation"
              >
                ✕
              </button>
            </div>
          </div>
        )}
        <div className="stat-row stagger-children">
          <StatCard
            label="Problems solved"
            value={totalSolvedActual}
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
                revisions.map((r) => (
                  <RevisionRow
                    key={r.id}
                    {...r}
                    onRevise={() => handleReviseClick(r.id)}
                  />
                ))
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

        {/* Achievement shelf — pure motivation panel. Shows top 3 recent
            unlocks with a link to the full /achievements page. Placed
            below topic progress so it feels like a reward for scrolling
            through the "here's what you need to do" content first. */}
        <div style={{ marginTop: 16 }}>
          <AchievementShelf />
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
            animation: 'backdropFadeIn 200ms cubic-bezier(0.4,0,0.2,1) both',
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
              animation: 'modalAppear 250ms cubic-bezier(0.34,1.56,0.64,1) both',
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