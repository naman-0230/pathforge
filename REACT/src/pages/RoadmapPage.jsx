import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import TopicSection from '../components/TopicSection';
import DayPlanSection from '../components/DayPlanSection';
import { useApp } from '../context/AppContext.jsx';
import { topics } from '../data/topics.js';
import { getDifficultyType } from '../data/problems.js';
import { isProblemSolved } from '../utils/progress.js';
import { isTopicWeak } from '../utils/weakPoints.js';
import { loadJSON, saveJSON } from '../utils/storage.js';
import { triggerSync } from '../utils/sync.js';
import {
  getOrRegenerateRoadmapState,
  forceRegenerateRoadmap,
  checkWeakPointRecalcSuggestion,
  resolveRoadmapBreakdown,
  getRoadmapOverallProgress,
  resolveDayPlan,
  getMissedProblems,
  isTodayQuotaComplete,
} from '../utils/roadmapGenerator.js';
import '../styles/app.css';
import '../styles/roadmap.css';
import { usePageTitle } from '../utils/usePageTitle.js';
// RoadmapPage — reads/writes a STORED, FROZEN roadmap (see
// utils/roadmapGenerator.js) instead of recomputing everything from
// scratch on every render. The roadmap only actually regenerates on one of
// three triggers:
//   1. Settings changed (deadline/hours/topics) — detected automatically
//      below, applied immediately, no confirmation (the person already
//      took that action on the Settings page).
//   2. "Recalculate ⚡" clicked — applied immediately, confirmation shown.
//   3. Weak-point analysis suggests a change (NOT YET IMPLEMENTED — see
//      checkWeakPointRecalcSuggestion, currently always returns null) —
//      when it exists, this should ASK via a banner first and only apply
//      on accept. The banner plumbing below is ready for that; it just has
//      nothing to trigger it yet.
//
// Bug fix carried over from the previous pass: grouping now uses the real
// `section` field (topics.js `sections` array) instead of the old
// `topic.curriculum` / `p.subPattern`, which don't exist in the real data.

const sectionsByTopicKey = Object.fromEntries(topics.map((t) => [t.key, t.sections || []]));

function buildTopicSectionData(entry) {
  if (!entry.seeded) {
    return {
      key: entry.topicKey,
      name: entry.label,
      statusLabel: 'Upcoming',
      statusType: 'gray',
      dotStatus: 'upcoming',
      sectionState: 'upcoming',
      solved: 0,
      total: entry.total,
      expandable: false,
      groups: [],
    };
  }

  if (!entry.inRoadmap) {
    return {
      key: entry.topicKey,
      name: entry.label,
      statusLabel: 'Not in your plan',
      statusType: 'gray',
      dotStatus: 'upcoming',
      sectionState: 'upcoming',
      extraNote: entry.solved > 0
        ? 'Not part of your current roadmap, but past progress is kept.'
        : 'Not part of your current roadmap.',
      solved: entry.solved,
      total: entry.total,
      expandable: entry.solved > 0,
      groups: entry.solved > 0
        ? [{
          subPatternKey: 'solved',
          label: 'Previously solved',
          solved: entry.solved,
          total: entry.solved,
          problems: entry.solvedProblems.map((p) => ({
            id: p.id,
            name: p.name,
            difficulty: p.difficulty,
            difficultyType: getDifficultyType(p.difficulty),
            pattern: p.pattern,
            section: p.section,
            status: 'done',
          })),
        }]
        : [],
    };
  }

  const { solved, total, solvedProblems, selectedProblems } = entry;

  let statusLabel = 'Not started';
  let statusType = 'gray';
  let dotStatus = 'upcoming';
  let sectionState = 'upcoming';
  let extraNote;

  if (total > 0 && solved === total) {
    statusLabel = 'Completed';
    statusType = 'green';
    dotStatus = 'done';
    sectionState = 'done';
  } else if (solved > 0 && isTopicWeak(entry.topicKey)) {
    statusLabel = 'Weak point';
    statusType = 'amber';
    dotStatus = 'active';
    sectionState = 'weak';
    extraNote = 'Prioritized — extra problems ahead in your queue';
  } else if (solved > 0) {
    statusLabel = 'In progress';
    statusType = 'purple';
    dotStatus = 'active';
    sectionState = 'active';
  }

  const combined = [...solvedProblems, ...selectedProblems].sort((a, b) => a.order - b.order);
  const firstUnsolvedIndex = combined.findIndex((p) => !isProblemSolved(p.id));

  const problemItems = combined.map((p, i) => ({
    id: p.id,
    name: p.name,
    difficulty: p.difficulty,
    difficultyType: getDifficultyType(p.difficulty),
    pattern: p.pattern,
    section: p.section,
    status: isProblemSolved(p.id) ? 'done' : i === firstUnsolvedIndex ? 'current' : 'pending',
  }));

  const groups = [];
  const sectionsInOrder = sectionsByTopicKey[entry.topicKey] || [];
  for (const sectionName of sectionsInOrder) {
    const groupItems = problemItems.filter((p) => p.section === sectionName);
    if (groupItems.length === 0) continue;
    const groupSolved = groupItems.filter((p) => p.status === 'done').length;
    groups.push({
      subPatternKey: sectionName,
      label: sectionName,
      solved: groupSolved,
      total: groupItems.length,
      problems: groupItems,
    });
  }

  return {
    key: entry.topicKey,
    name: entry.label,
    statusLabel,
    statusType,
    dotStatus,
    sectionState,
    extraNote,
    solved,
    total,
    expandable: total > 0,
    groups,
  };
}

export default function RoadmapPage() {
  usePageTitle('My Roadmap');
  const { roadmapSetup } = useApp();

  // The frozen roadmap record. Initialized lazily: on first mount, this
  // either loads what's already stored or generates it for the first time
  // (both handled by getOrRegenerateRoadmapState, which also covers "the
  // stored one was made under different settings" — trigger #1).
  const [roadmapState, setRoadmapState] = useState(() => getOrRegenerateRoadmapState(roadmapSetup));
  const [weakPointSuggestion, setWeakPointSuggestion] = useState(null);

  // Toast — fixed-position, non-blocking confirmation for "recalculated".
  // Doesn't shift any other layout since it's position:fixed, and animates
  // in/out via CSS transition rather than popping in/out abruptly.
  const [toast, setToast] = useState(null); // { message } | null
  const [toastVisible, setToastVisible] = useState(false);
  const toastHideTimer = useRef(null);
  const toastRemoveTimer = useRef(null);

  function showToast(message) {
    clearTimeout(toastHideTimer.current);
    clearTimeout(toastRemoveTimer.current);

    setToast({ message });
    setToastVisible(false);
    // Double rAF: ensures the "hidden" state actually paints before we flip
    // to visible, so the transition has something to animate from.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setToastVisible(true));
    });

    toastHideTimer.current = setTimeout(() => {
      setToastVisible(false);
      toastRemoveTimer.current = setTimeout(() => setToast(null), 300); // matches CSS transition duration
    }, 2500);
  }

  useEffect(() => {
    return () => {
      clearTimeout(toastHideTimer.current);
      clearTimeout(toastRemoveTimer.current);
    };
  }, []);

  // Trigger #1 — settings changed. Re-checks whenever roadmapSetup changes
  // (e.g. coming back from the Settings page with a new deadline). Applies
  // immediately, no confirmation — matches getOrRegenerateRoadmapState's
  // contract: it only regenerates if the signature actually differs from
  // what's stored, so this is a no-op re-render otherwise.
  useEffect(() => {
    setRoadmapState(getOrRegenerateRoadmapState(roadmapSetup));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roadmapSetup?.deadline, roadmapSetup?.hoursPerDay, roadmapSetup?.dsaLevel, JSON.stringify(roadmapSetup?.selectedTopics || [])]);

  // Trigger #3 scaffold — checks whether weak-point analysis has a
  // suggestion. Always null right now (see roadmapGenerator.js), so this
  // banner simply never appears until that's actually built. Left wired up
  // so turning it on later is a one-line change in checkWeakPointRecalcSuggestion.
  useEffect(() => {
    setWeakPointSuggestion(checkWeakPointRecalcSuggestion(roadmapState));
  }, [roadmapState]);

  const breakdown = resolveRoadmapBreakdown(roadmapState);
  const seededTopics = breakdown.filter((t) => t.seeded);
  const inRoadmapTopics = breakdown.filter((t) => t.inRoadmap);

  const defaultOpenKey =
    inRoadmapTopics.find((t) => t.solved > 0 && t.solved < t.total)?.topicKey ||
    inRoadmapTopics[0]?.topicKey ||
    seededTopics[0]?.topicKey;

    const { user } = useApp();
  const [expandedTopics, setExpandedTopics] = useState({ [defaultOpenKey]: true });
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkConfidence, setBulkConfidence] = useState(null);
    const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkGuideShown, setBulkGuideShown] = useState(
    () => loadJSON('pathforge:bulkGuideShown', false)
  );

  function toggleTopic(key) {
    setExpandedTopics((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const bulkMode = selectedIds.size > 0;

  function handleSelectProblem(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

    function dismissBulkGuide() {
    setBulkGuideShown(true);
    saveJSON('pathforge:bulkGuideShown', true);
  }
  function handleClearSelection() {
    setSelectedIds(new Set());
    setBulkConfidence(null);
  }

   function handleBulkMarkSolved() {
    if (selectedIds.size === 0) return;
    setBulkLoading(true);

    const count = selectedIds.size;

    for (const id of selectedIds) {
      const key = `pathforge:problem:${id}`;
      const existing = loadJSON(key, {});

      // Bulk mark is treated as HISTORICAL BASELINE — "I already solved
      // these before PathForge." This means:
      //   - isSolved = true (the problem IS solved)
      //   - solvedAt / firstSolvedAt = null (we don't know WHEN)
      //   - NO activity log increment (doesn't inflate today's stats)
      //   - NO streak contribution (didn't solve it today in the app)
      //   - attempt context = 'import' (distinguishable from real solves)
      //   - confidenceRating stored if given, but timestamped as null
      //
      // If the user later opens this problem and solves it genuinely
      // inside PathForge, that creates a real attempt with real timestamps
      // and a real recordSolve() call — cleanly layered on top.

      const attempt = bulkConfidence
        ? {
            date: null,
            confidenceRating: bulkConfidence,
            timeSpentSeconds: null,
            hintsOpened: 0,
            solutionPeeked: false,
            context: 'import',
          }
        : null;

      const updatedAttempts = Array.isArray(existing.attempts)
        ? (attempt ? [...existing.attempts, attempt] : existing.attempts)
        : (attempt ? [attempt] : []);

      saveJSON(key, {
        ...existing,
        attempts: updatedAttempts,
        isSolved: true,
        // Null dates = "solved before PathForge, exact date unknown"
        solvedAt: existing.solvedAt ?? null,
        firstSolvedAt: existing.firstSolvedAt ?? null,
        // Store confidence only if given
        confidenceRating: bulkConfidence ?? existing.confidenceRating ?? null,
        unlockedHints: existing.unlockedHints ?? [],
        attemptConfirmed: true,
        solutionEverViewed: existing.solutionEverViewed ?? false,
        accumulatedSeconds: existing.accumulatedSeconds ?? 0,
        runningSince: null,
        flaggedForRevision: existing.flaggedForRevision ?? false,
        notes: existing.notes ?? '',
        markedHard: existing.markedHard ?? false,
      });
    }

    // Trigger sync after bulk write — NO recordSolve() calls
    if (user?.id) triggerSync(user.id);

    // Track whether this was the first bulk import — used for the
    // "baseline established" motivation message
    const isFirstBulkImport = !loadJSON('pathforge:bulkImportDone', false);
    if (isFirstBulkImport) {
      saveJSON('pathforge:bulkImportDone', true);
    }

    // Refresh roadmap state to reflect new solves
    setRoadmapState(getOrRegenerateRoadmapState(roadmapSetup));
    setBulkLoading(false);
    handleClearSelection();
    showToast(
      isFirstBulkImport
        ? `✓ ${count} problem${count === 1 ? '' : 's'} imported — your roadmap now reflects your real progress`
        : `✓ Marked ${count} problem${count === 1 ? '' : 's'} as solved`
    );
  }

  const sections = breakdown.map(buildTopicSectionData);
  const { totalSolved, totalProblems, percent: overallPercent } = getRoadmapOverallProgress(roadmapState);
  const dayPlan = resolveDayPlan(roadmapState);
  const missedProblems = getMissedProblems(roadmapState);
  const todayComplete = isTodayQuotaComplete(roadmapState);

  // Completion celebration — fire the toast exactly once, the moment
  // today's quota flips from incomplete to complete. Persisted to
  // localStorage (not just a ref) so reloading the page or navigating away
  // and back doesn't re-fire the toast for a day already celebrated.
  const lastCelebratedRef = useRef(loadJSON('pathforge:roadmap:lastCelebratedDate', null));
  useEffect(() => {
    const today = dayPlan.find((d) => d.isToday);
    if (!today) return;
    if (todayComplete && lastCelebratedRef.current !== today.date) {
      showToast('🎉 Today\'s quota complete!');
      lastCelebratedRef.current = today.date;
      saveJSON('pathforge:roadmap:lastCelebratedDate', today.date);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayComplete, roadmapState]);

  // Trigger #2 — explicit button click. Always regenerates, regardless of
  // whether settings changed, and shows a confirmation (not the "heads up,
  // something shifted silently" wording — this one the person asked for).
  function handleRecalculate() {
    const fresh = forceRegenerateRoadmap(roadmapSetup);
    setRoadmapState(fresh);
    showToast('Roadmap recalculated ✅');
  }

  // Trigger #3 — accepting a weak-point suggestion. Only applies on
  // explicit accept; dismissing just clears the banner and changes nothing.
  function handleAcceptWeakPointSuggestion() {
    const fresh = forceRegenerateRoadmap(roadmapSetup);
    setRoadmapState(fresh);
    setWeakPointSuggestion(null);
    showToast('Roadmap adjusted based on your weak points ✅');
  }

    // ── No roadmap setup ─────────────────────────────────────────────────
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
            <div style={{ fontSize: 48 }}>📋</div>
            <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.04em' }}>
              No roadmap yet
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-mid)', maxWidth: 380, lineHeight: 1.7 }}>
              Your roadmap is generated from your study plan — topics, deadline, hours per day, and level.
              Set it up to get started.
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <Link to="/onboarding" className="btn btn-primary">
                Set up my roadmap →
              </Link>
              <Link to="/settings" className="btn">
                Edit in Settings
              </Link>
            </div>
          </div>
              </main>

      {/* Floating bulk action bar */}
      {bulkMode && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          left: 'calc(220px + (100% - 220px) / 2)',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-accent)',
          borderRadius: 12,
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          animation: 'fadeSlideUp 200ms cubic-bezier(0.4,0,0.2,1) both',
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth: '90vw',
        }}>
          {/* Count */}
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-high)', whiteSpace: 'nowrap' }}>
            {selectedIds.size} problem{selectedIds.size === 1 ? '' : 's'} selected
          </span>

          {/* Optional confidence rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 11, color: 'var(--text-low)', whiteSpace: 'nowrap' }}>
              Confidence:
            </span>
            {[
              { value: 1, label: '😵' },
              { value: 2, label: '🤔' },
              { value: 3, label: '😊' },
              { value: 4, label: '🚀' },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setBulkConfidence((prev) => prev === opt.value ? null : opt.value)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  border: `1.5px solid ${bulkConfidence === opt.value ? 'var(--accent)' : 'var(--border)'}`,
                  background: bulkConfidence === opt.value ? 'rgba(232,115,45,0.15)' : 'var(--bg-hover)',
                  cursor: 'pointer',
                  fontSize: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease',
                }}
                title={`Confidence ${opt.value}/4`}
              >
                {opt.label}
              </button>
            ))}
            {bulkConfidence && (
              <span style={{ fontSize: 11, color: 'var(--accent-mid)' }}>
                {bulkConfidence}/4
              </span>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-sm"
              onClick={handleClearSelection}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleBulkMarkSolved}
              disabled={bulkLoading}
            >
              {bulkLoading ? 'Saving...' : `Mark ${selectedIds.size} as solved`}
            </button>
          </div>
        </div>
      )}
      </div>
    );
  }

  // ── No problems in plan ───────────────────────────────────────────────
  if (inRoadmapTopics.length === 0) {
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <div className="page-header">
            <div>
              <h1>My Roadmap</h1>
              <p className="page-sub">No topics selected</p>
            </div>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '40vh',
            gap: 16,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 40 }}>🔍</div>
            <p style={{ fontSize: 14, color: 'var(--text-mid)', maxWidth: 360, lineHeight: 1.7 }}>
              No topics are selected in your study plan. Add at least one topic to generate your roadmap.
            </p>
            <Link to="/settings" className="btn btn-primary">
              Edit study plan →
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
        <div className="page-header">
          <div>
            <h1>My Roadmap</h1>
            <p className="page-sub">
              {inRoadmapTopics.length} topics in your plan · {seededTopics.length - inRoadmapTopics.length} excluded · {breakdown.length - seededTopics.length} upcoming
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link to="/settings#study-plan" className="btn btn-sm">Edit topics</Link>
            <Button size="sm" variant="primary" onClick={handleRecalculate}>Recalculate ⚡</Button>
          </div>
        </div>

        {weakPointSuggestion && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 14px',
              borderRadius: 8,
              marginBottom: 12,
              fontSize: 13,
              background: 'var(--amber-bg, #3a2f14)',
              border: '1px solid var(--amber, #d9a441)',
            }}
          >
            <span>{weakPointSuggestion.reason || 'We think adjusting your plan based on weak spots could help.'}</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={handleAcceptWeakPointSuggestion}
                style={{ background: 'none', border: '1px solid currentColor', borderRadius: 6, padding: '2px 10px', color: 'inherit', cursor: 'pointer', fontSize: 13 }}
              >
                Recalculate
              </button>
              <button
                onClick={() => setWeakPointSuggestion(null)}
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 13 }}
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        <div className="roadmap-overall">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 500 }}>Overall progress (your plan)</span>
            <span style={{ fontSize: 13, color: 'var(--text-low)', fontFamily: 'var(--font-mono)' }}>
              {totalSolved} / {totalProblems} problems
            </span>
          </div>
          <ProgressBar percent={overallPercent} height="8px" />
        </div>

                {/* One-time bulk select guide — shown only once for new users */}
        {!bulkGuideShown && (
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            padding: '14px 18px',
            marginBottom: 16,
            background: 'rgba(232,115,45,0.06)',
            border: '1px solid var(--border-accent)',
            borderRadius: 10,
            animation: 'fadeSlideUp 300ms cubic-bezier(0.4,0,0.2,1) both',
          }}>
            <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0 }}>💡</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-high)', marginBottom: 4 }}>
                Already solved some problems on LeetCode?
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-mid)', lineHeight: 1.6, margin: 0 }}>
                Hover over any unsolved problem (below "Your-day-by-day-plan" section) to see a checkbox — select multiple problems and mark them
                as solved in one go. You can optionally rate your confidence for all of them at once.
              </p>
            </div>
            <button
              onClick={dismissBulkGuide}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-low)',
                cursor: 'pointer',
                fontSize: 16,
                padding: '2px 6px',
                lineHeight: 1,
                flexShrink: 0,
              }}
              title="Dismiss"
            >
              ✕
            </button>
          </div>
        )}

        <DayPlanSection dayPlan={dayPlan} missedProblems={missedProblems} />

        <div className="roadmap-list">
          {sections.map((section) => {
            const { key, ...rest } = section;
            return (
            <TopicSection
            key={key}
            {...rest}
            isExpanded={!!expandedTopics[key]}
            onToggle={() => toggleTopic(key)}
            bulkMode={bulkMode}
            selectedIds={selectedIds}
            onSelectProblem={handleSelectProblem}
          />
            );
          })}
        </div>
      </main>

      {/* Fixed-position toast — doesn't affect layout of anything else,
          animates in/out via CSS transition rather than popping abruptly. */}
            {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
            padding: '10px 16px',
            borderRadius: 8,
            fontSize: 13,
            background: 'var(--green-bg, #14321f)',
            border: '1px solid var(--green, #3fae63)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
            opacity: toastVisible ? 1 : 0,
            transform: toastVisible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            pointerEvents: 'none',
          }}
        >
          {toast.message}
        </div>
      )}

      {/* Floating bulk action bar — rendered OUTSIDE .app-layout so it
          can't be clipped by any overflow or stacking context issue. */}
      {bulkMode && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          left: 0,
          right: 0,
          zIndex: 99999,
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <div style={{
            pointerEvents: 'auto',
            marginLeft: 220,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-accent)',
            borderRadius: 12,
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            animation: 'fadeSlideUp 200ms cubic-bezier(0.4,0,0.2,1) both',
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: 'calc(100vw - 280px)',
          }}>
            {/* Count */}
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-high)', whiteSpace: 'nowrap' }}>
              {selectedIds.size} problem{selectedIds.size === 1 ? '' : 's'} selected
            </span>

            {/* Optional confidence rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 11, color: 'var(--text-low)', whiteSpace: 'nowrap' }}>
                Confidence:
              </span>
              {[
                { value: 1, label: '😵' },
                { value: 2, label: '🤔' },
                { value: 3, label: '😊' },
                { value: 4, label: '🚀' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setBulkConfidence((prev) => prev === opt.value ? null : opt.value)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    border: `1.5px solid ${bulkConfidence === opt.value ? 'var(--accent)' : 'var(--border)'}`,
                    background: bulkConfidence === opt.value ? 'rgba(232,115,45,0.15)' : 'var(--bg-hover)',
                    cursor: 'pointer',
                    fontSize: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                  }}
                  title={`Confidence ${opt.value}/4`}
                >
                  {opt.label}
                </button>
              ))}
              {bulkConfidence && (
                <span style={{ fontSize: 11, color: 'var(--accent-mid)' }}>
                  {bulkConfidence}/4
                </span>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="btn btn-sm"
                onClick={handleClearSelection}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleBulkMarkSolved}
                disabled={bulkLoading}
              >
                {bulkLoading ? 'Saving...' : `Mark ${selectedIds.size} as solved`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}