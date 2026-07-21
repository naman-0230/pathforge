import { useState, useMemo } from 'react';
import Button from './Button';
import Badge from './Badge';
import TopicChip from './TopicChip';
import Select from './Select';
import { topics } from '../data/topics.js';
import { getProblemsByTopic } from '../data/problems.js';
import { createTemplate, updateTemplate, getTemplate } from '../utils/customTests.js';

// CustomTestBuilder — the form for creating a new template OR editing
// an existing one. Same component handles both, distinguished by whether
// templateId is passed.
//
// SECTIONS (top → bottom):
//   1. Name (required)
//   2. Topics (multi-select chip grid)
//   3. Problem count + Duration (paired numeric selectors)
//   4. Difficulty mix (three sliders that must sum to 100)
//   5. Pattern filter (optional dropdown of all patterns in selected topics)
//   6. Solved filter (any / unsolved / solved)
//   7. Extra toggles (studied only, randomize on rerun)
//   8. Save / Cancel
//
// VALIDATION:
//   - Name required
//   - At least one topic selected
//   - Difficulty mix must sum to 100
//   - Problem count 2-10
//   - Duration 15-180 min

const DIFFICULTY_PRESETS = {
  easy: { easy: 100, medium: 0, hard: 0, label: 'All Easy' },
  balanced: { easy: 33, medium: 34, hard: 33, label: 'Balanced' },
  hard: { easy: 0, medium: 40, hard: 60, label: 'Interview-level' },
  custom: null, // "custom" is a marker for user-driven percentages
};

export default function CustomTestBuilder({ templateId, onDone, onCancel }) {
  const isEditing = !!templateId;
  const existing = isEditing ? getTemplate(templateId) : null;

  const [name, setName] = useState(existing?.name || '');
  const [topicKeys, setTopicKeys] = useState(existing?.config.topicKeys || []);
  const [problemCount, setProblemCount] = useState(existing?.config.problemCount || 3);
  const [durationMinutes, setDurationMinutes] = useState(existing?.config.durationMinutes || 30);
  const [difficultyPreset, setDifficultyPreset] = useState(() => {
    const mix = existing?.config.difficultyMix;
    if (!mix) return 'balanced';
    // Detect which preset matches, or fall back to custom
    for (const [key, p] of Object.entries(DIFFICULTY_PRESETS)) {
      if (p && p.easy === mix.easy && p.medium === mix.medium && p.hard === mix.hard) {
        return key;
      }
    }
    return 'custom';
  });
  const [customMix, setCustomMix] = useState(existing?.config.difficultyMix || { easy: 33, medium: 34, hard: 33 });
  const [patternFilter, setPatternFilter] = useState(existing?.config.patternFilter || '');
  const [solvedFilter, setSolvedFilter] = useState(existing?.config.solvedFilter || 'any');
  const [studiedOnly, setStudiedOnly] = useState(existing?.config.studiedOnly ?? true);
  const [randomizeOnRerun, setRandomizeOnRerun] = useState(existing?.config.randomizeOnRerun ?? true);
  const [error, setError] = useState(null);

  const availableTopics = useMemo(() => topics.filter((t) => t.seeded), []);

  // Compute available patterns from currently-selected topics — pattern
  // filter dropdown should only show patterns that actually exist in the
  // selected topics, so users can't pick something impossible.
  const availablePatterns = useMemo(() => {
    if (topicKeys.length === 0) return [];
    const patterns = new Set();
    for (const key of topicKeys) {
      for (const p of getProblemsByTopic(key)) {
        if (p.pattern) patterns.add(p.pattern);
      }
    }
    return Array.from(patterns).sort();
  }, [topicKeys]);

  // Active mix is either the preset's or the custom values
  const activeMix = difficultyPreset === 'custom'
    ? customMix
    : DIFFICULTY_PRESETS[difficultyPreset];

  const mixSum = activeMix.easy + activeMix.medium + activeMix.hard;
  const mixValid = mixSum === 100;

  function toggleTopic(key) {
    setTopicKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
    // Clear pattern filter if it's no longer valid
    setPatternFilter('');
    setError(null);
  }

  function handleMixChange(difficulty, value) {
    const n = Math.max(0, Math.min(100, Number(value) || 0));
    setCustomMix((prev) => ({ ...prev, [difficulty]: n }));
    setDifficultyPreset('custom');
  }

  function handleSave() {
    setError(null);

    if (!name.trim()) {
      setError('Give this test a name.');
      return;
    }
    if (topicKeys.length === 0) {
      setError('Pick at least one topic.');
      return;
    }
    if (!mixValid) {
      setError(`Difficulty percentages must sum to 100 (currently ${mixSum}).`);
      return;
    }

    const config = {
      topicKeys,
      difficultyMix: activeMix,
      problemCount,
      durationMinutes,
      studiedOnly,
      patternFilter: patternFilter || null,
      solvedFilter,
      randomizeOnRerun,
    };

    try {
      if (isEditing) {
        updateTemplate(templateId, { name: name.trim(), config });
      } else {
        createTemplate(name.trim(), config);
      }
      onDone();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="custom-tests-builder">
      <div className="page-header">
        <div>
          <h1>{isEditing ? 'Edit template' : 'Create custom test'}</h1>
          <p className="page-sub">
            Configure the test once — reuse the template whenever.
          </p>
        </div>
      </div>

      {/* Name */}
      <div className="custom-tests-builder-section">
        <label className="custom-tests-builder-label">Name</label>
        <input
          className="custom-tests-builder-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Interview warmup, Trees deep dive, Weekend cram"
          maxLength={60}
        />
      </div>

      {/* Topics */}
      <div className="custom-tests-builder-section">
        <label className="custom-tests-builder-label">Topics</label>
        <div className="topic-grid">
          {availableTopics.map((t) => (
            <TopicChip
              key={t.key}
              icon={t.icon}
              label={t.label}
              selected={topicKeys.includes(t.key)}
              onClick={() => toggleTopic(t.key)}
            />
          ))}
        </div>
      </div>

      {/* Problem count + Duration */}
      <div className="custom-tests-builder-grid-2">
        <div className="custom-tests-builder-section">
          <label className="custom-tests-builder-label">Number of problems</label>
          <div className="custom-tests-builder-count-chips">
            {[2, 3, 4, 5, 6, 8, 10].map((n) => (
              <button
                key={n}
                className={`custom-tests-builder-count-chip ${problemCount === n ? 'selected' : ''}`}
                onClick={() => setProblemCount(n)}
                type="button"
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="custom-tests-builder-section">
          <label className="custom-tests-builder-label">Duration (minutes)</label>
          <Select
            value={durationMinutes}
            onChange={(v) => setDurationMinutes(Number(v))}
            options={[
              { value: 15, label: '15 minutes' },
              { value: 30, label: '30 minutes' },
              { value: 45, label: '45 minutes' },
              { value: 60, label: '60 minutes' },
              { value: 90, label: '90 minutes' },
              { value: 120, label: '2 hours' },
              { value: 180, label: '3 hours' },
            ]}
          />
        </div>
      </div>

      {/* Difficulty mix */}
      <div className="custom-tests-builder-section">
        <label className="custom-tests-builder-label">Difficulty mix</label>
        <div className="custom-tests-builder-preset-row">
          {Object.entries(DIFFICULTY_PRESETS).map(([key, preset]) => (
            <button
              key={key}
              className={`custom-tests-builder-preset ${difficultyPreset === key ? 'selected' : ''}`}
              onClick={() => setDifficultyPreset(key)}
              type="button"
            >
              {preset ? preset.label : 'Custom'}
            </button>
          ))}
        </div>
        {difficultyPreset === 'custom' && (
          <div className="custom-tests-builder-mix-row">
            <MixInput label="Easy" value={customMix.easy} onChange={(v) => handleMixChange('easy', v)} />
            <MixInput label="Medium" value={customMix.medium} onChange={(v) => handleMixChange('medium', v)} />
            <MixInput label="Hard" value={customMix.hard} onChange={(v) => handleMixChange('hard', v)} />
            <div className={`custom-tests-builder-mix-total ${mixValid ? 'valid' : 'invalid'}`}>
              Total: {mixSum}%
            </div>
          </div>
        )}
      </div>

      {/* Pattern filter */}
      <div className="custom-tests-builder-section">
        <label className="custom-tests-builder-label">
          Pattern filter <span className="custom-tests-builder-label-optional">(optional)</span>
        </label>
        {availablePatterns.length === 0 ? (
          <p className="custom-tests-builder-subnote">
            Select at least one topic to see available patterns.
          </p>
        ) : (
          <Select
            value={patternFilter}
            onChange={(v) => setPatternFilter(v)}
            options={[
              { value: '', label: 'Any pattern (no filter)' },
              ...availablePatterns.map((p) => ({ value: p, label: p })),
            ]}
          />
        )}
      </div>

      {/* Solved filter */}
      <div className="custom-tests-builder-section">
        <label className="custom-tests-builder-label">Include problems that are:</label>
        <div className="custom-tests-builder-radio-row">
          {[
            { value: 'any', label: 'Any (solved or unsolved)' },
            { value: 'unsolved', label: 'Only unsolved (fresh practice)' },
            { value: 'solved', label: 'Only solved (revision)' },
          ].map((opt) => (
            <label key={opt.value} className="custom-tests-builder-radio-label">
              <input
                type="radio"
                name="solvedFilter"
                value={opt.value}
                checked={solvedFilter === opt.value}
                onChange={(e) => setSolvedFilter(e.target.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {/* Extra toggles */}
      <div className="custom-tests-builder-section">
        <label className="custom-tests-builder-toggle-row">
          <input
            type="checkbox"
            checked={studiedOnly}
            onChange={(e) => setStudiedOnly(e.target.checked)}
          />
          <span>
            <strong>Studied sections only</strong>
            <span className="custom-tests-builder-toggle-desc">
              Restrict to sections you've engaged with — no surprise ambushes from unfamiliar patterns.
            </span>
          </span>
        </label>
        <label className="custom-tests-builder-toggle-row">
          <input
            type="checkbox"
            checked={randomizeOnRerun}
            onChange={(e) => setRandomizeOnRerun(e.target.checked)}
          />
          <span>
            <strong>Randomize each run</strong>
            <span className="custom-tests-builder-toggle-desc">
              When on: fresh problems every run. When off: same problem set locked in — good for tracking improvement on specific problems (spaced repetition style).
            </span>
          </span>
        </label>
      </div>

      {error && (
        <div className="custom-tests-builder-error">
          {error}
        </div>
      )}

      <div className="custom-tests-builder-actions">
        <Button onClick={onCancel}>Cancel</Button>
        <Button variant="primary" onClick={handleSave}>
          {isEditing ? 'Save changes' : 'Create template'}
        </Button>
      </div>
    </div>
  );
}

function MixInput({ label, value, onChange }) {
  return (
    <div className="custom-tests-builder-mix-input">
      <label>{label}</label>
      <input
        type="number"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <span>%</span>
    </div>
  );
}