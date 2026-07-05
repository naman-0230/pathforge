import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Badge from '../components/Badge';
import Button from '../components/Button';
import StatCard from '../components/StatCard';
import ProblemRow from '../components/ProblemRow';
import RevisionRow from '../components/RevisionRow';
import TopicProgressRow from '../components/TopicProgressRow';
import { useApp } from '../context/AppContext.jsx';
import { getTimeGreeting } from '../utils/greeting.js';
import { getDaysRemaining, getDaysSince } from '../utils/date.js';
import { getDashboardSubtitle } from '../utils/motivation.js';
import { topics, getTopic } from '../data/topics.js';
import { getProblemsByTopic, getDifficultyType } from '../data/problems.js';
import { isProblemSolved, getTopicStats } from '../utils/progress.js';
import '../styles/app.css';
import '../styles/dashboard.css';

// DashboardPage — converted from dashboard.html.
//
// KEY CHANGE: todaysProblems and the topic progress list used to be separate
// hardcoded arrays here, disconnected from the Roadmap page and from what's
// actually saved in localStorage. Now both are derived from the same real
// data (data/topics.js + data/problems.js) and the same solved-status source
// (utils/progress.js) that RoadmapPage and ProblemPage use — so a problem you
// mark solved on the Problem page immediately disappears from "Today's
// problems" here too, and Dashboard/Roadmap can never disagree with each other.

const revisions = [
  { topic: 'Arrays', meta: 'Completed 8 days ago · due today', dueNow: true, label: 'Revise →' },
  { topic: 'Hashing', meta: 'Completed 4 days ago · due in 2 days', dueNow: false, label: 'In 2 days' },
];

// MOCK — until real activity tracking exists, this stands in for "the date
// the person last solved a problem." Set to "today" so the default view shows
// the normal subtitle. Change to a few days ago to test the streak-nudge copy.
const lastActivityDate = new Date().toISOString().slice(0, 10);

// pickTodaysProblems — NOT the real adaptive algorithm yet (that's the next
// phase — actual weighted roadmap generation). For now, this is a simple
// placeholder: walk every seeded topic in order, take the first few unsolved
// problems. Good enough to have a real, working "Today's problems" list while
// the real scheduling logic gets built.
function pickTodaysProblems(count = 3) {
  const picked = [];
  for (const topic of topics.filter((t) => t.seeded)) {
    if (picked.length >= count) break;
    const topicProblems = getProblemsByTopic(topic.key);
    for (const p of topicProblems) {
      if (picked.length >= count) break;
      if (!isProblemSolved(p.id)) {
        picked.push({
          id: p.id,
          name: p.name,
          meta: `${topic.label} · #${p.leetcode}`,
          difficulty: p.difficulty,
          difficultyType: getDifficultyType(p.difficulty),
        });
      }
    }
  }
  return picked;
}

// buildTopicProgressRows — same "solved/total" data Roadmap uses, just
// formatted for the compact dashboard row style (Strong/Weak/Done/Upcoming).
// The Strong/Weak split here is still a rough placeholder (>=60% solved =
// Strong, otherwise Weak) — real weak-point detection based on hints-opened
// and confidence ratings comes in the next phase, not just raw solve ratio.
function buildTopicProgressRows() {
  return topics.slice(0, 5).map((topic) => {
    if (!topic.seeded) {
      return {
        name: topic.label,
        solved: 0,
        total: topic.targetTotal,
        statusLabel: 'Upcoming',
        statusType: 'gray',
      };
    }

    const { solved, total } = getTopicStats(topic.key);

    if (total > 0 && solved === total) {
      return { name: topic.label, solved, total, statusLabel: 'Done ✓', statusType: 'green' };
    }
    if (solved === 0) {
      return { name: topic.label, solved, total, statusLabel: 'Not started', statusType: 'gray' };
    }
    const ratio = solved / total;
    return ratio >= 0.6
      ? { name: topic.label, solved, total, statusLabel: 'Strong', statusType: 'green' }
      : { name: topic.label, solved, total, statusLabel: 'Weak', statusType: 'amber', barColor: 'var(--amber)' };
  });
}

export default function DashboardPage() {
  const { user, roadmapSetup } = useApp();
  const firstName = user?.name?.split(' ')[0] || 'there';
  const greeting = getTimeGreeting();
  const emoji = greeting === 'Good night' ? '🌙' : '👋';

  const todaysProblems = pickTodaysProblems(3);
  const topicRows = buildTopicProgressRows();

  const daysRemaining = getDaysRemaining(roadmapSetup?.deadline);
  const daysRemainingLabel =
    daysRemaining === null
      ? 'set a deadline in your roadmap'
      : daysRemaining < 0
      ? `${Math.abs(daysRemaining)} days past your deadline`
      : daysRemaining === 0
      ? 'deadline is today'
      : `${daysRemaining} days left to stay on track`;

  const daysSinceLastActivity = getDaysSince(lastActivityDate);
  const subtitle = getDashboardSubtitle({
    daysSinceLastActivity,
    problemsToday: todaysProblems.length,
    daysRemainingLabel,
  });

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
          <StatCard label="Problems solved" value="87" delta="↑ 5 this week" deltaType="positive" />
          <StatCard label="Current streak" value="14 days" delta="🔥 Keep it up" deltaType="positive" />
          <StatCard label="Roadmap progress" value="34%" delta="On schedule" deltaType="neutral" />
          <StatCard
            label="Days remaining"
            value={daysRemaining === null ? '—' : Math.max(daysRemaining, 0)}
            delta={daysRemaining === null ? 'No deadline set' : 'Until deadline'}
            deltaType="neutral"
          />
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
              {revisions.map((r) => (
                <RevisionRow key={r.topic} {...r} onRevise={() => console.log(`Revise ${r.topic}`)} />
              ))}
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