import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import TopicSection from '../components/TopicSection';
import { topics } from '../data/topics.js';
import { getDifficultyType } from '../data/problems.js';
import { isProblemSolved, getTopicStats } from '../utils/progress.js';
import { isTopicWeak } from '../utils/weakPoints.js';
import '../styles/app.css';
import '../styles/roadmap.css';

// RoadmapPage — now builds itself entirely from real data (data/topics.js +
// data/problems.js) instead of one giant hardcoded array. This is the payoff
// of the data-layer work: adding a new problem to problems.js, or a new topic
// to topics.js, makes it show up here automatically — nothing in this file
// needs to change.
//
// "Solved" status comes from localStorage (via getTopicStats), the same place
// ProblemPage saves to when you mark something solved — so Roadmap, Dashboard,
// and Problem pages all agree on progress without needing a backend yet.

function buildTopicSectionData(topic) {
  if (!topic.seeded) {
    // Upcoming topic — no real problems yet, just a target count.
    return {
      key: topic.key,
      name: topic.label,
      statusLabel: 'Upcoming',
      statusType: 'gray',
      dotStatus: 'upcoming',
      sectionState: 'upcoming',
      solved: 0,
      total: topic.targetTotal,
      expandable: false,
      problems: [],
    };
  }

  const { solved, total, problems } = getTopicStats(topic.key);

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
  } else if (solved > 0 && isTopicWeak(topic.key)) {
    // KEY CHANGE: this used to just mean "partially solved." Now it's the
    // real weak-point engine — flagged only when hints/peeks/low confidence
    // on this topic's solved problems actually rank it among the weakest,
    // not just because it happens to be in progress.
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

  // Find the first unsolved problem — that's the "current" one, matching the
  // → dot the original static design used to mark where you left off.
  const firstUnsolvedIndex = problems.findIndex((p) => !isProblemSolved(p.id));

  const problemItems = problems.map((p, i) => ({
    id: p.id,
    name: p.name,
    difficulty: p.difficulty,
    difficultyType: getDifficultyType(p.difficulty),
    pattern: p.pattern,
    status: isProblemSolved(p.id) ? 'done' : i === firstUnsolvedIndex ? 'current' : 'pending',
  }));

  return {
    key: topic.key,
    name: topic.label,
    statusLabel,
    statusType,
    dotStatus,
    sectionState,
    extraNote,
    solved,
    total,
    expandable: total > 0,
    problems: problemItems,
  };
}

export default function RoadmapPage() {
  // Default open: the first seeded topic that has some progress but isn't
  // finished yet — falls back to the very first seeded topic if nothing's
  // been touched yet. Matches the original design defaulting Arrays open.
  const seededTopics = topics.filter((t) => t.seeded);
  const defaultOpenKey =
    seededTopics.find((t) => {
      const stats = getTopicStats(t.key);
      return stats.solved > 0 && stats.solved < stats.total;
    })?.key || seededTopics[0]?.key;

  const [expandedTopics, setExpandedTopics] = useState({ [defaultOpenKey]: true });

  function toggleTopic(key) {
    setExpandedTopics((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const sections = topics.map(buildTopicSectionData);
  const totalSolved = sections.reduce((sum, t) => sum + t.solved, 0);
  const totalProblems = sections.reduce((sum, t) => sum + t.total, 0);
  const overallPercent = totalProblems > 0 ? Math.round((totalSolved / totalProblems) * 100) : 0;

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1>My Roadmap</h1>
            <p className="page-sub">{seededTopics.length} topics active · {topics.length - seededTopics.length} upcoming</p>
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
          {sections.map((section) => (
            <TopicSection
              key={section.key}
              {...section}
              isExpanded={!!expandedTopics[section.key]}
              onToggle={() => toggleTopic(section.key)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}