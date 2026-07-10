import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProblemsByTopic } from '../data/problems.js';
import { getDaysRemaining } from '../utils/date.js';
import TopicChip from '../components/TopicChip';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { topics } from '../data/topics.js';
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
// it should render as selected.
//
// FIX: this used to keep its own separate, hardcoded topic list — which drifted
// out of sync when topics.js was restructured (Two Pointers/Sliding Window/
// Binary Search/Hashing merged into Arrays subpatterns, Strings added). Now it
// just derives the list from data/topics.js directly, so the two can never
// disagree again.
const allTopics = topics.map((t) => ({ key: t.key, icon: t.icon, label: t.label }));

// Matches which chips start selected in the original static HTML
const defaultSelected = ['arrays', 'linked-lists', 'stacks-queues', 'trees', 'graphs', 'recursion', 'dp'];



// Problems-per-hour by level — same values as roadmapGenerator.js
const PROBLEMS_PER_HOUR = { beginner: 1.5, intermediate: 2.2, advanced: 3 };

// Phase badge colors — cycles through for visual variety
const PHASE_COLORS = ['purple', 'amber', 'green', 'red'];

function OnboardingPreview({ selectedTopics, hoursPerDay, dsaLevel, deadline, onBack, onStart }) {
  const preview = useMemo(() => {
    // Compute problems per day using same formula as roadmapGenerator.js
    const rate = PROBLEMS_PER_HOUR[dsaLevel] ?? PROBLEMS_PER_HOUR.intermediate;
    const effectiveHours = Math.pow(hoursPerDay || 2, 0.9);
    const problemsPerDay = Math.max(1, Math.round(effectiveHours * rate));

    // Total problems across selected topics
    const selectedTopicData = topics
      .filter((t) => t.seeded && selectedTopics.includes(t.key))
      .sort((a, b) => a.order - b.order);

    const totalProblems = selectedTopicData.reduce((sum, t) => {
      return sum + getProblemsByTopic(t.key).length;
    }, 0);

    // Days needed
    const daysNeeded = Math.ceil(totalProblems / problemsPerDay);
    const weeksNeeded = Math.ceil(daysNeeded / 7);

    // Days remaining until deadline
    const daysLeft = getDaysRemaining(deadline);
    const deadlineOk = daysLeft === null || daysLeft >= daysNeeded;

    // Split selected topics into phases of roughly equal size
    const phaseCount = Math.min(4, Math.max(1, selectedTopicData.length));
    const chunkSize = Math.ceil(selectedTopicData.length / phaseCount);
    const phases = [];

    for (let i = 0; i < selectedTopicData.length; i += chunkSize) {
      const phaseTopics = selectedTopicData.slice(i, i + chunkSize);
      const phaseProblems = phaseTopics.reduce((sum, t) => {
        return sum + getProblemsByTopic(t.key).length;
      }, 0);
      const phaseWeeks = Math.ceil((phaseProblems / problemsPerDay) / 7);
      const startWeek = phases.length === 0
        ? 1
        : phases[phases.length - 1].endWeek + 1;
      const endWeek = startWeek + phaseWeeks - 1;

      phases.push({
        label: startWeek === endWeek
          ? `Week ${startWeek}`
          : `Week ${startWeek}–${endWeek}`,
        topics: phaseTopics.map((t) => t.label),
        count: `~${phaseProblems} problems`,
        color: PHASE_COLORS[phases.length % PHASE_COLORS.length],
        startWeek,
        endWeek,
      });
    }

    return { problemsPerDay, totalProblems, weeksNeeded, daysLeft, deadlineOk, phases };
  }, [selectedTopics, hoursPerDay, dsaLevel, deadline]);

  return (
    <div className="onboard-wrap">
      <div className="onboard-header">
        <div className="step-pill">Step 3 of 3</div>
        <h1>Your roadmap is ready</h1>
        <p>
          You'll do about{' '}
          <strong>{preview.problemsPerDay} problem{preview.problemsPerDay === 1 ? '' : 's'}/day</strong>
          {' '}across{' '}
          <strong>{preview.totalProblems} total problems</strong>
          {' '}— roughly{' '}
          <strong>{preview.weeksNeeded} week{preview.weeksNeeded === 1 ? '' : 's'}</strong> at this pace.
        </p>

        {/* Deadline warning if pace doesn't fit */}
        {preview.daysLeft !== null && !preview.deadlineOk && (
          <div style={{
            marginTop: 10,
            padding: '8px 14px',
            background: 'rgba(251,176,64,0.08)',
            border: '1px solid rgba(251,176,64,0.25)',
            borderRadius: 8,
            fontSize: 12,
            color: 'var(--amber)',
          }}>
            ⚠️ At this pace you'd need {preview.weeksNeeded} weeks, but your deadline is in {Math.ceil(preview.daysLeft / 7)} weeks.
            Consider increasing your daily hours or narrowing your topic selection.
          </div>
        )}

        {/* Confirmation if pace fits deadline */}
        {preview.daysLeft !== null && preview.deadlineOk && (
          <div style={{
            marginTop: 10,
            padding: '8px 14px',
            background: 'rgba(15,208,86,0.08)',
            border: '1px solid rgba(15,208,86,0.2)',
            borderRadius: 8,
            fontSize: 12,
            color: 'var(--green)',
          }}>
            ✓ You're on track to finish before your deadline.
          </div>
        )}
      </div>

      {/* Dynamic phases */}
      <div className="roadmap-preview">
        {preview.phases.map((phase, i, arr) => (
          <div key={phase.label} style={{ width: '100%' }}>
            <div className="preview-phase">
              <div className="phase-label">{phase.label}</div>
              <div className="phase-topics">
                {phase.topics.map((t) => (
                  <Badge key={t} type={phase.color}>{t}</Badge>
                ))}
              </div>
              <div className="phase-count">{phase.count}</div>
            </div>
            {i < arr.length - 1 && <div className="preview-arrow">↓</div>}
          </div>
        ))}

        {preview.phases.length === 0 && (
          <div style={{
            padding: 20,
            textAlign: 'center',
            color: 'var(--text-mid)',
            fontSize: 13,
          }}>
            Select at least one topic in Step 1 to see your roadmap preview.
          </div>
        )}
      </div>

      <div className="onboard-note">
        <span>⚡</span> The roadmap adapts as you go — weak topics get more focus, strong ones move faster.
      </div>

      <div className="onboard-actions">
        <Button onClick={onBack}>← Back</Button>
        <Button
          variant="primary"
          onClick={onStart}
          disabled={preview.phases.length === 0}
        >
          Start my roadmap →
        </Button>
      </div>
    </div>
  );
}



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
                {[1, 2, 3, 4, 5, 6, 8].map((h) => (
                  <div
                    key={h}
                    className={`hours-chip ${hoursPerDay === h ? 'selected' : ''}`}
                    onClick={() => setHoursPerDay(h)}
                  >
                    {h === 8 ? '8+ hrs' : `~${h} hr${h > 1 ? 's' : ''}`}
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

      {/* STEP 3: PREVIEW — dynamically computed from user selections */}
      {step === 3 && (
        <OnboardingPreview
          selectedTopics={selectedTopics}
          hoursPerDay={hoursPerDay}
          dsaLevel={dsaLevel}
          deadline={deadline}
          onBack={() => setStep(2)}
          onStart={handleStart}
        />
      )}
    </>
  );
}