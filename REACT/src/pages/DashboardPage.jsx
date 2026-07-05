import { useApp } from '../context/AppContext.jsx';
import { Link } from 'react-router-dom';
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

export default function DashboardPage() {

  const { user } = useApp();
  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1>Good morning, {firstName} 👋</h1>
            <p className="page-sub">3 problems scheduled today · 12 days left to stay on track</p>
          </div>
          <Link to="/roadmap" className="btn btn-primary btn-sm">View full roadmap</Link>
        </div>

        {/* STAT CARDS */}
        <div className="stat-row">
          <StatCard label="Problems solved" value="87" delta="↑ 5 this week" deltaType="positive" />
          <StatCard label="Current streak" value="14 days" delta="🔥 Keep it up" deltaType="positive" />
          <StatCard label="Roadmap progress" value="34%" delta="On schedule" deltaType="neutral" />
          <StatCard label="Days remaining" value="48" delta="Until deadline" deltaType="neutral" />
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
