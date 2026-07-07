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
import {
  getOrRegenerateRoadmapState,
  forceRegenerateRoadmap,
  checkWeakPointRecalcSuggestion,
  resolveRoadmapBreakdown,
  getRoadmapOverallProgress,
  buildDayPlan,
} from '../utils/roadmapGenerator.js';
import '../styles/app.css';
import '../styles/roadmap.css';

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
    }, 4000);
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

  const [expandedTopics, setExpandedTopics] = useState({ [defaultOpenKey]: true });

  function toggleTopic(key) {
    setExpandedTopics((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const sections = breakdown.map(buildTopicSectionData);
  const { totalSolved, totalProblems, percent: overallPercent } = getRoadmapOverallProgress(roadmapState);
  const dayPlan = buildDayPlan(roadmapState, roadmapSetup);

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
            <Link to="/settings#study-plan">
              <Button size="sm">Edit topics</Button>
            </Link>
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

        <DayPlanSection days={dayPlan} />

        <div className="roadmap-list">
          {sections.map((section) => {
            const { key, ...sectionProps } = section;

            return (
              <TopicSection
                key={key}
                {...sectionProps}
                isExpanded={!!expandedTopics[key]}
                onToggle={() => toggleTopic(key)}
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
            background: '#112711',
            border: '1px solid var(--grey, #15301b)',
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
    </div>
  );
}