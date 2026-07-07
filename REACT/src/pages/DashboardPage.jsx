import { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Badge from '../components/Badge';
import Button from '../components/Button';
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
import { getCurrentStreak, getTotalSolvedFromLog, getSolvedInLastNDays, getDaysSinceLastActivity } from '../utils/activity.js';
import { topics } from '../data/topics.js';
import { getDifficultyType } from '../data/problems.js';
import { getTopicStats, getOverallProgress } from '../utils/progress.js';
import { isTopicWeak } from '../utils/weakPoints.js';
import { getWeightedProblemQueue } from '../utils/roadmapGenerator.js';
import { ensureRevisionScheduled, isRevisionDue, getDaysUntilRevision, completeRevisionSession } from '../utils/revision.js';
import '../styles/app.css';
import '../styles/dashboard.css';

// DashboardPage — this is where all three core engines come together:
//   - roadmapGenerator: "Today's problems" is now the front of the real
//     weighted queue (weak topics get more frequent slots), not a naive
//     "first 3 unsolved, topic by topic" placeholder.
//   - weakPoints: topic progress rows use real hint/peek/confidence scoring
//     to decide Strong vs Weak, not just raw solve ratio.
//   - revision (SM-2): any topic that's 100% solved automatically gets a
//     revision schedule, and its due date is real — driven by past revision
//     quality, not a fixed "every N days" rule.
//
// FIX: "Revise →" used to call completeRevisionSession(topicKey, 4) directly
// — every single revision was recorded as quality "Easy" no matter how it
// actually went, which meant the SM-2 math in revision.js/sm2.js could never
// actually adapt (there was no real signal for it to adapt to). Clicking
// Revise now opens an inline confidence picker for that topic first — same
// four options and same ConfidenceButton component ProblemPage already uses
// — and only calls completeRevisionSession once a real rating is picked.

const revisionConfidenceOptions = [
  { value: 1, label: '😵 Forgot most of it' },
  { value: 2, label: '🤔 Shaky, needed to think hard' },
  { value: 3, label: '😊 Remembered it well' },
  { value: 4, label: '🚀 Instant recall' },
];

function buildTopicProgressRows() {
  return topics.slice(0, 5).map((topic) => {
    if (!topic.seeded) {
      return { name: topic.label, solved: 0, total: topic.targetTotal, statusLabel: 'Upcoming', statusType: 'gray' };
    }

    const { solved, total } = getTopicStats(topic.key);

    if (total > 0 && solved === total) {
      return { name: topic.label, solved, total, statusLabel: 'Done ✓', statusType: 'green' };
    }
    if (solved === 0) {
      return { name: topic.label, solved, total, statusLabel: 'Not started', statusType: 'gray' };
    }
    // KEY CHANGE: this used to be a plain solved/total ratio. Now it asks the
    // real weak-point engine — a topic can have plenty solved and still be
    // flagged weak if it took a lot of hints/peeks/low confidence to get there.
    return isTopicWeak(topic.key)
      ? { name: topic.label, solved, total, statusLabel: 'Weak', statusType: 'amber', barColor: 'var(--amber)' }
      : { name: topic.label, solved, total, statusLabel: 'Strong', statusType: 'green' };
  });
}

// buildRevisions — any seeded topic that's fully solved gets a real SM-2
// revision schedule (ensureRevisionScheduled is a no-op if one already
// exists). Due/not-due and the "in N days" label come straight from that
// schedule instead of hardcoded text.
function buildRevisions() {
  return topics
    .filter((t) => t.seeded)
    .map((t) => {
      const { solved, total } = getTopicStats(t.key);
      if (total === 0 || solved < total) return null; // only fully-completed topics get revision

      ensureRevisionScheduled(t.key);
      const due = isRevisionDue(t.key);
      const daysUntil = getDaysUntilRevision(t.key);
      const label = due
        ? 'due today'
        : daysUntil === 1
        ? 'due tomorrow'
        : `due in ${daysUntil} days`;

      return {
        topicKey: t.key,
        topic: t.label,
        meta: `Completed all ${total} problems · ${label}`,
        dueNow: due,
        label: due ? 'Revise →' : label,
      };
    })
    .filter(Boolean);
}

export default function DashboardPage() {
  const { user, roadmapSetup } = useApp();
  // Bumping this after "Revise" forces a re-render, which re-reads localStorage
  // fresh — everything here reads storage directly at render time rather than
  // caching it in state, so a simple re-render is all that's needed.
  const [, forceRefresh] = useState(0);

  // Which topic (if any) currently has its confidence picker open, replacing
  // that one row inline instead of popping a modal — keeps the interaction
  // lightweight since it's just one extra click deep from the normal list.
  const [revisingTopicKey, setRevisingTopicKey] = useState(null);

  const firstName = user?.name?.split(' ')[0] || 'there';
  const greeting = getTimeGreeting();
  const emoji = greeting === 'Good night' ? '🌙' : '👋';

  // KEY CHANGE: this used to loop topics in a fixed order and grab the first
  // 3 unsolved problems, no matter how the person was actually doing. Now it
  // reads the front of the real weighted queue — weak topics get 3x the
  // slots per round, so struggling patterns naturally surface more often
  // without ever being fully hidden.
  const weightedQueue = getWeightedProblemQueue(roadmapSetup);
  const todaysProblems = weightedQueue.slice(0, 3).map((p) => {
    const topic = topics.find((t) => t.key === p.topicKey);
    return {
      id: p.id,
      name: p.name,
      meta: `${topic?.label} · #${p.leetcode}`,
      difficulty: p.difficulty,
      difficultyType: getDifficultyType(p.difficulty),
    };
  });

  const topicRows = buildTopicProgressRows();
  const revisions = buildRevisions();
  const overallProgress = getOverallProgress();

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
    problemsToday: todaysProblems.length,
    daysRemainingLabel,
  });

  // Opens the inline picker for this topic instead of completing the session
  // immediately — the actual SM-2 call now happens in handleConfirmRevision,
  // once a real rating is chosen.
  function handleReviseClick(topicKey) {
    setRevisingTopicKey(topicKey);
  }

  function handleConfirmRevision(rating) {
    if (!revisingTopicKey) return;
    completeRevisionSession(revisingTopicKey, rating);
    setRevisingTopicKey(null);
    forceRefresh((n) => n + 1);
  }

  function handleCancelRevision() {
    setRevisingTopicKey(null);
  }

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

        {/* STAT CARDS */}
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

        {/* ACTIVITY HEATMAP */}
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
          {/* TODAY'S PROBLEMS */}
          <div className="section-box">
            <div className="section-box-header">
              <span className="section-box-title">Today's problems</span>
              <Badge type="purple">{todaysProblems.length} due</Badge>
            </div>
            <div className="problem-list">
              {todaysProblems.length === 0 ? (
                <p style={{ padding: '20px', color: 'var(--text-mid)', fontSize: 13 }}>
                  All caught up — no unsolved problems left in your active topics.
                </p>
              ) : (
                todaysProblems.map((p) => <ProblemRow key={p.id} {...p} />)
              )}
            </div>
          </div>

          {/* REVISION DUE */}
          <div className="section-box">
            <div className="section-box-header">
              <span className="section-box-title">Revision due</span>
              <Badge type="amber">{revisions.length} topics</Badge>
            </div>
            <div className="revision-list">
              {revisions.length === 0 ? (
                <p style={{ padding: '20px', color: 'var(--text-mid)', fontSize: 13 }}>
                  No revisions yet — these appear once you finish a whole topic.
                </p>
              ) : (
                revisions.map((r) =>
                  r.topicKey === revisingTopicKey ? (
                    <div key={r.topicKey} className="revision-confidence-picker">
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
                      key={r.topicKey}
                      {...r}
                      onRevise={() => handleReviseClick(r.topicKey)}
                    />
                  )
                )
              )}
            </div>
          </div>
        </div>

        {/* TOPIC PROGRESS */}
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
    </div>
  );
}