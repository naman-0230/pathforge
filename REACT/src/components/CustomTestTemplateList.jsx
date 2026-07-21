import { Link } from 'react-router-dom';
import Button from './Button';
import { deleteTemplate, getHistoryForTemplate } from '../utils/customTests.js';
import { getTopic } from '../data/topics.js';

// CustomTestTemplateList — the main list view on /custom-tests.
// Shows each saved template as a card with quick-glance stats
// (times run, average score) and inline actions (Run, Edit, Delete).
//
// EMPTY STATE:
//   Full-page empty state with a "Create your first test" CTA when
//   no templates exist.

export default function CustomTestTemplateList({ templates, onEdit, onDeleted, onCreate }) {
  if (templates.length === 0) {
    return <EmptyState onCreate={onCreate} />;
  }

  return (
    <div className="custom-tests-template-list">
      {templates.map((tpl) => (
        <TemplateCard
          key={tpl.id}
          template={tpl}
          onEdit={() => onEdit(tpl.id)}
          onDelete={() => handleDelete(tpl, onDeleted)}
        />
      ))}
    </div>
  );
}

function handleDelete(template, onDeleted) {
  if (!window.confirm(`Delete "${template.name}"? History for this template is kept but detached.`)) return;
  deleteTemplate(template.id);
  onDeleted?.();
}

function TemplateCard({ template, onEdit, onDelete }) {
  const history = getHistoryForTemplate(template.id);
  const usedTimes = history.length;
  const avgScore = usedTimes > 0
    ? Math.round(
        history.reduce((sum, h) => sum + (h.score / h.problemCount) * 100, 0) / usedTimes
      )
    : null;

  const { config } = template;
  const topicLabels = config.topicKeys.length > 0
    ? config.topicKeys.map((k) => getTopic(k)?.label || k).join(', ')
    : 'All topics';

  return (
    <div className="custom-tests-template-card">
      <div className="custom-tests-template-header">
        <div>
          <div className="custom-tests-template-name">{template.name}</div>
          <div className="custom-tests-template-meta">
            {usedTimes > 0
              ? `Run ${usedTimes} time${usedTimes === 1 ? '' : 's'} · avg ${avgScore}%`
              : 'Not run yet'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <Link to={`/custom-tests/run/${template.id}`} className="btn btn-sm btn-primary">
            Run →
          </Link>
          <button className="btn btn-sm" onClick={onEdit}>
            Edit
          </button>
          <button className="custom-tests-template-delete" onClick={onDelete} title="Delete">
            ✕
          </button>
        </div>
      </div>

      <div className="custom-tests-template-pills">
        <Pill>{config.problemCount} problems</Pill>
        <Pill>{config.durationMinutes} min</Pill>
        <Pill>
          {config.difficultyMix.easy}E · {config.difficultyMix.medium}M · {config.difficultyMix.hard}H
        </Pill>
        {config.patternFilter && <Pill accent>Pattern: {config.patternFilter}</Pill>}
        {config.solvedFilter !== 'any' && (
          <Pill>{config.solvedFilter === 'unsolved' ? 'Unsolved only' : 'Solved only'}</Pill>
        )}
        {config.studiedOnly && <Pill>Studied only</Pill>}
        {!config.randomizeOnRerun && <Pill accent>📌 Pinned</Pill>}
      </div>

      <div className="custom-tests-template-topics">
        <span className="custom-tests-template-topics-label">Topics:</span> {topicLabels}
      </div>
    </div>
  );
}

function Pill({ children, accent }) {
  return (
    <span className={`custom-tests-template-pill ${accent ? 'accent' : ''}`}>
      {children}
    </span>
  );
}

function EmptyState({ onCreate }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 40 + 'vh',
      textAlign: 'center',
      gap: 14,
    }}>
      <div style={{ fontSize: 48, opacity: 0.5 }}>🧰</div>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-high)', margin: 0 }}>
        No templates yet
      </h2>
      <p style={{ fontSize: 13, color: 'var(--text-mid)', maxWidth: 400, lineHeight: 1.6, margin: 0 }}>
        Custom tests let you build your own practice sets. Pick topics, difficulty, patterns —
        anything. Save as a template to re-run whenever.
      </p>
      <Button variant="primary" onClick={onCreate}>
        + Create your first test
      </Button>
    </div>
  );
}