import { useApp } from '../context/AppContext.jsx';
import { Link } from 'react-router-dom';
import { getTimeGreeting } from '../utils/greeting.js';
import { getDaysRemaining, getDaysSince } from '../utils/date.js';
import { getDashboardSubtitle } from '../utils/motivation.js';
import Sidebar from '../components/Sidebar';
import Badge from '../components/Badge';
import Button from '../components/Button';
import StatCard from '../components/StatCard';
import ProblemRow from '../components/ProblemRow';
import RevisionRow from '../components/RevisionRow';
import TopicProgressRow from '../components/TopicProgressRow';
import '../styles/app.css';
import '../styles/dashboard.css';

// DashboardPage — converted from dashboard.html.
//
// KEY CHANGE from the static version: every number/list here was hardcoded directly
// into the HTML. Now it's all just JS data below (todaysProblems, revisions, topics).
// This is intentional groundwork for Phase 6/7/8 from our plan — later, these consts
// get replaced by `useState` + real data from localStorage or your backend API.
// Nothing about the JSX below will need to change when that happens — only where
// the data comes from changes.

const todaysProblems = [
  { id: 'two-sum', name: 'Two Sum', meta: 'Arrays · #1', difficulty: 'Easy', difficultyType: 'green' },
  { id: 'longest-substring', name: 'Longest Substring Without Repeating Characters', meta: 'Sliding Window · #3', difficulty: 'Medium', difficultyType: 'amber' },
  { id: 'trapping-rain-water', name: 'Trapping Rain Water', meta: 'Two Pointers · #42', difficulty: 'Hard', difficultyType: 'red' },
];

const revisions = [
  { topic: 'Arrays', meta: 'Completed 8 days ago · due today', dueNow: true, label: 'Revise →' },
  { topic: 'Hashing', meta: 'Completed 4 days ago · due in 2 days', dueNow: false, label: 'In 2 days' },
];

const topics = [
  { name: 'Arrays', solved: 24, total: 30, statusLabel: 'Strong', statusType: 'green' },
  { name: 'Hashing', solved: 18, total: 18, statusLabel: 'Done ✓', statusType: 'green' },
  { name: 'Sliding Window', solved: 6, total: 15, statusLabel: 'Weak', statusType: 'amber', barColor: 'var(--amber)' },
  { name: 'Linked Lists', solved: 0, total: 20, statusLabel: 'Upcoming', statusType: 'gray' },
  { name: 'Trees', solved: 0, total: 28, statusLabel: 'Upcoming', statusType: 'gray' },
];

// MOCK — until real activity tracking exists (Phase 6/7), this stands in for
// "the date the person last solved a problem." It's set to "today" so the
// default view shows the normal subtitle. To see the streak-nudge copy in
// action, temporarily change this to e.g. new Date(Date.now() - 3 * 86400000)
// (3 days ago) and reload.
const lastActivityDate = new Date().toISOString().slice(0, 10);

export default function DashboardPage() {
  const { user, roadmapSetup } = useApp();
  const firstName = user?.name?.split(' ')[0] || 'there';
  const greeting = getTimeGreeting();
  const emoji = greeting === 'Good night' ? '🌙' : '👋';

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
              {todaysProblems.map((p) => (
                <ProblemRow key={p.id} {...p} />
              ))}
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
            {topics.map((t) => (
              <TopicProgressRow key={t.name} {...t} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
