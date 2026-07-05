import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopicChip from '../components/TopicChip';
import Badge from '../components/Badge';
import Button from '../components/Button';
import '../styles/onboarding.css';

// OnboardingPage — converted from onboarding.html.
//
// KEY CHANGE from the static version: goStep(n) manually hid/showed 3 separate
// <div> blocks and updated a text node for the step indicator. Here, `step` is a
// single number in state (1, 2, or 3) and we just conditionally render one block
// at a time based on it — no more querying/hiding DOM nodes by hand.
//
// Similarly: toggleTopic/selectHours/selectLevel each manually added/removed a
// 'selected' class across sibling elements. Now selectedTopics/hoursPerDay/dsaLevel
// are real state, and every chip/card just checks against that state to know if
// it should render as selected. This also means — unlike the original HTML — this
// data is now actually capturable and could be sent to a backend when "Start my
// roadmap" is clicked, instead of evaporating as CSS classes.

const allTopics = [
  { key: 'arrays', icon: '📦', label: 'Arrays' },
  { key: 'linked-lists', icon: '🔗', label: 'Linked Lists' },
  { key: 'stacks-queues', icon: '📚', label: 'Stacks & Queues' },
  { key: 'trees', icon: '🌲', label: 'Trees' },
  { key: 'graphs', icon: '🕸️', label: 'Graphs' },
  { key: 'recursion', icon: '🔄', label: 'Recursion' },
  { key: 'dp', icon: '🧩', label: 'Dynamic Programming' },
  { key: 'binary-search', icon: '🔍', label: 'Binary Search' },
  { key: 'sliding-window', icon: '🪟', label: 'Sliding Window' },
  { key: 'two-pointers', icon: '👆👆', label: 'Two Pointers' },
  { key: 'hashing', icon: '🗂️', label: 'Hashing' },
  { key: 'greedy', icon: '⛰️', label: 'Greedy' },
  { key: 'heaps', icon: '🔺', label: 'Heaps / Priority Queue' },
  { key: 'tries', icon: '🌳', label: 'Tries' },
  { key: 'bit-manipulation', icon: '📐', label: 'Bit Manipulation' },
  { key: 'maths', icon: '🧮', label: 'Maths & Number Theory' },
];

// Matches which chips start selected in the original static HTML
const defaultSelected = ['arrays', 'linked-lists', 'stacks-queues', 'trees', 'graphs', 'recursion', 'dp'];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [selectedTopics, setSelectedTopics] = useState(defaultSelected);
  const [deadline, setDeadline] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [dsaLevel, setDsaLevel] = useState('intermediate');
  const navigate = useNavigate();

  function toggleTopic(key) {
    setSelectedTopics((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  function handleStart() {
    // KEY CHANGE: instead of going straight to /dashboard, we now hand off to
    // /signup — this is the "onboarding first, signup last" flow. Everything
    // collected here travels along via router state, so SignupPage can pre-fill
    // the name and (once a backend exists) actually create the roadmap using
    // these choices the moment the account is created.
    navigate('/signup', {
      state: { name, selectedTopics, deadline, hoursPerDay, dsaLevel },
    });
  }

  return (
    <>
      <nav className="nav">
        <div className="nav-logo"><div className="nav-logo-dot"></div>PathForge</div>
        <div style={{ fontSize: 13, color: 'var(--text-low)' }}>Step {step} of 3</div>
      </nav>

      {/* STEP 1: TOPICS */}
      {step === 1 && (
        <div className="onboard-wrap">
          <div className="onboard-header">
            <div className="step-pill">Step 1 of 3</div>
            <h1>What do you want to cover?</h1>
            <p>Select the topics for your roadmap. You can change this later.</p>
          </div>

          <div className="time-field" style={{ marginBottom: 28, maxWidth: 320 }}>
            <label>What should we call you?</label>
            <input
              type="text"
              placeholder="Your first name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                background: 'var(--bg-hover)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', padding: '9px 13px', fontSize: 14,
                color: 'var(--text-high)', fontFamily: 'var(--font-head)',
                outline: 'none', width: '100%',
              }}
            />
          </div>

          <div className="topic-grid">
            {allTopics.map((t) => (
              <TopicChip
                key={t.key}
                icon={t.icon}
                label={t.label}
                selected={selectedTopics.includes(t.key)}
                onClick={() => toggleTopic(t.key)}
              />
            ))}
          </div>

          <div className="onboard-actions">
            <Button variant="primary" onClick={() => setStep(2)}>Continue →</Button>
          </div>
        </div>
      )}

      {/* STEP 2: TIME */}
      {step === 2 && (
        <div className="onboard-wrap">
          <div className="onboard-header">
            <div className="step-pill">Step 2 of 3</div>
            <h1>Set your schedule</h1>
            <p>We'll build a roadmap that fits your timeline.</p>
          </div>

          <div className="time-form">
            <div className="time-field">
              <label>When's your deadline?</label>
              <p className="time-hint">Interview date, target date, or just a goal.</p>
              <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </div>

            <div className="time-field">
              <label>Hours per day you can commit</label>
              <p className="time-hint">Be realistic — consistency beats intensity.</p>
              <div className="hours-options">
                {[1, 2, 3, 4].map((h) => (
                  <div
                    key={h}
                    className={`hours-chip ${hoursPerDay === h ? 'selected' : ''}`}
                    onClick={() => setHoursPerDay(h)}
                  >
                    {h === 4 ? '4+ hrs' : `~${h} hr${h > 1 ? 's' : ''}`}
                  </div>
                ))}
              </div>
            </div>

            <div className="time-field">
              <label>Your current DSA level</label>
              <p className="time-hint">We'll calibrate the starting difficulty.</p>
              <div className="level-options">
                {[
                  { key: 'beginner', title: 'Beginner', desc: 'Just starting out or very rusty' },
                  { key: 'intermediate', title: 'Intermediate', desc: 'Solved some problems, know the basics' },
                  { key: 'advanced', title: 'Advanced', desc: 'Comfortable with most topics' },
                ].map((lvl) => (
                  <div
                    key={lvl.key}
                    className={`level-card ${dsaLevel === lvl.key ? 'selected' : ''}`}
                    onClick={() => setDsaLevel(lvl.key)}
                  >
                    <div className="level-title">{lvl.title}</div>
                    <div className="level-desc">{lvl.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="onboard-actions">
            <Button onClick={() => setStep(1)}>← Back</Button>
            <Button variant="primary" onClick={() => setStep(3)}>Continue →</Button>
          </div>
        </div>
      )}

      {/* STEP 3: PREVIEW */}
      {step === 3 && (
        <div className="onboard-wrap">
          <div className="onboard-header">
            <div className="step-pill">Step 3 of 3</div>
            <h1>Your roadmap is ready</h1>
            <p>Here's a preview. You'll do about <strong>3 problems/day</strong> to hit your goal.</p>
          </div>

          <div className="roadmap-preview">
            {[
              { label: 'Week 1–2', type: 'purple', topics: ['Arrays', 'Hashing', 'Two Pointers'], count: '~28 problems' },
              { label: 'Week 3–4', type: 'amber', topics: ['Sliding Window', 'Linked Lists', 'Stacks & Queues'], count: '~32 problems' },
              { label: 'Week 5–7', type: 'green', topics: ['Trees', 'Recursion', 'Binary Search'], count: '~40 problems' },
              { label: 'Week 8–12', type: 'red', topics: ['Graphs', 'DP', 'Heaps'], count: '~55 problems' },
            ].map((phase, i, arr) => (
              <div key={phase.label} style={{ width: '100%' }}>
                <div className="preview-phase">
                  <div className="phase-label">{phase.label}</div>
                  <div className="phase-topics">
                    {phase.topics.map((t) => (
                      <Badge key={t} type={phase.type}>{t}</Badge>
                    ))}
                  </div>
                  <div className="phase-count">{phase.count}</div>
                </div>
                {i < arr.length - 1 && <div className="preview-arrow">↓</div>}
              </div>
            ))}
          </div>

          <div className="onboard-note">
            <span>⚡</span> The roadmap will adapt as you go. Weak topics get more problems. Strong topics move faster.
          </div>

          <div className="onboard-actions">
            <Button onClick={() => setStep(2)}>← Back</Button>
            <Button variant="primary" onClick={handleStart}>Start my roadmap →</Button>
          </div>
        </div>
      )}
    </>
  );
}