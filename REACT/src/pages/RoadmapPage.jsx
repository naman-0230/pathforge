import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import TopicSection from '../components/TopicSection';
import '../styles/app.css';
import '../styles/roadmap.css';

// RoadmapPage — converted from roadmap.html.
//
// KEY CHANGE from the static version: the old toggleSection() manually queried
// the DOM for the clicked section and flipped its display style. Here, `expandedTopics`
// is a single object in state — { Arrays: true, Hashing: false, ... } — and each
// TopicSection just reads its own boolean from it. Clicking a header calls
// toggleTopic(name), which flips just that one key.
const roadmapData = [
  {
    name: 'Hashing',
    statusLabel: 'Completed',
    statusType: 'green',
    extraNote: 'Revision due in 2 days',
    dotStatus: 'done',
    sectionState: 'done',
    solved: 18,
    total: 18,
    expandable: false,
    problems: [],
  },
  {
    name: 'Arrays',
    statusLabel: 'In progress',
    statusType: 'purple',
    dotStatus: 'active',
    sectionState: 'active',
    solved: 24,
    total: 30,
    expandable: true,
    moreCount: 24,
    problems: [
      { id: 'two-sum', name: 'Two Sum', difficulty: 'Easy', difficultyType: 'green', pattern: 'Hash Map', status: 'done' },
      { id: 'best-time-buy-sell-stock', name: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', difficultyType: 'green', pattern: 'Greedy', status: 'done' },
      { id: 'contains-duplicate', name: 'Contains Duplicate', difficulty: 'Easy', difficultyType: 'green', pattern: 'Hash Set', status: 'done' },
      { id: 'product-of-array-except-self', name: 'Product of Array Except Self', difficulty: 'Medium', difficultyType: 'amber', pattern: 'Prefix Sum', status: 'current' },
      { id: 'maximum-subarray', name: 'Maximum Subarray', difficulty: 'Medium', difficultyType: 'amber', pattern: "Kadane's", status: 'pending' },
      { id: 'trapping-rain-water', name: 'Trapping Rain Water', difficulty: 'Hard', difficultyType: 'red', pattern: 'Two Pointers', status: 'pending' },
    ],
  },
  {
    name: 'Sliding Window',
    statusLabel: 'Weak point',
    statusType: 'amber',
    extraNote: '+3 extra problems added',
    dotStatus: 'active',
    sectionState: 'weak',
    solved: 6,
    total: 15,
    expandable: true,
    problems: [],
  },
  {
    name: 'Linked Lists',
    statusLabel: 'Upcoming',
    statusType: 'gray',
    dotStatus: 'upcoming',
    sectionState: 'upcoming',
    solved: 0,
    total: 20,
    expandable: false,
    problems: [],
  },
  {
    name: 'Trees',
    statusLabel: 'Upcoming',
    statusType: 'gray',
    dotStatus: 'upcoming',
    sectionState: 'upcoming',
    solved: 0,
    total: 28,
    expandable: false,
    problems: [],
  },
  {
    name: 'Graphs',
    statusLabel: 'Upcoming',
    statusType: 'gray',
    dotStatus: 'upcoming',
    sectionState: 'upcoming',
    solved: 0,
    total: 35,
    expandable: false,
    problems: [],
  },
  {
    name: 'Dynamic Programming',
    statusLabel: 'Upcoming',
    statusType: 'gray',
    dotStatus: 'upcoming',
    sectionState: 'upcoming',
    solved: 0,
    total: 40,
    expandable: false,
    problems: [],
  },
];

export default function RoadmapPage() {
  // Arrays section starts expanded to match the original static HTML's default view.
  const [expandedTopics, setExpandedTopics] = useState({ Arrays: true });

  function toggleTopic(name) {
    setExpandedTopics((prev) => ({ ...prev, [name]: !prev[name] }));
  }

  const totalSolved = roadmapData.reduce((sum, t) => sum + t.solved, 0);
  const totalProblems = roadmapData.reduce((sum, t) => sum + t.total, 0);
  const overallPercent = Math.round((totalSolved / totalProblems) * 100);

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1>My Roadmap</h1>
            <p className="page-sub">7 topics selected · 48 days remaining · ~3 problems/day</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button size="sm">Edit topics</Button>
            <Button size="sm" variant="primary">Recalculate ⚡</Button>
          </div>
        </div>

        <div className="roadmap-overall">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 500 }}>Overall progress</span>
            <span style={{ fontSize: 13, color: 'var(--text-low)', fontFamily: 'var(--font-mono)' }}>
              {totalSolved} / {totalProblems} problems
            </span>
          </div>
          <ProgressBar percent={overallPercent} height="8px" />
        </div>

        <div className="roadmap-list">
          {roadmapData.map((topic) => (
            <TopicSection
              key={topic.name}
              {...topic}
              isExpanded={!!expandedTopics[topic.name]}
              onToggle={() => toggleTopic(topic.name)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
